var platform = require('platform'),
    MySpawn = require('myspawn'),
    Miner = require('miner'),
    Runner = require('runner'),
    MiningSite = require('miningsite'),
    Energy = require('energy'),
    Defender = require('defender'),
    Medic = require('medic'),
    ConstructionSite = require('constructionsite'),
    logic = require('logic'),
    util = require('util');

module.exports = MyRoom;
platform.inherit(MyRoom, platform.BaseRoom);
function MyRoom(room) {
    console.log('Room');
    this.base(room);
    this.on('tick', this.ressurectUnits);
    this.on('tick', this.deployUnits);
    this.on('tick', this.pickupEnergy);
    this.on('tick', this.planBuildings);
    this.on('tick', this.buildBuildings);
    this.miningSites = [];
    this.spawns = [];
    this.creeps = {
        miner: [],
        runner: [],
        defender: [],
        medic: []
    };
    this.lastCreep = null;
    var sources = this.find(Game.SOURCES) || [];
    var spawn = Game.spawns[Object.keys(Game.spawns)[0]];
    util.sortByDistance(sources, spawn);
    sources.forEach(function(source) {
        // Exclude routes through swamp
        if ((this.findPath(spawn.pos, source.pos)||[]).filter(function(step) {
            if ((this.lookAt(step.x, step.y)||[]).filter(function(thing) {
                return thing.terrain === 'swamp';
            }.bind(this)).length) return true;
        }.bind(this)).length) return;

        var newSite = platform.construct(MiningSite, source);
        if (!newSite) throw new Error('Null site');
        for (var a = 0; a < this.miningSites.length; a++) {

            for (var b = 0; b < newSite.unassignedPositions.length; b++) {

                for (var c = 0; c < this.miningSites[a].unassignedPositions.length; c++) {

                    if (util.pos.isEqual(this.miningSites[a].unassignedPositions[c], newSite.unassignedPositions[b])) {
                        this.miningSites[a].unassignedPositions.splice(c, 1);
                        c--;
                    }
                }
            }
        }
        this.miningSites.push(newSite);

    }.bind(this));
    for (var a = 0; a < this.miningSites.length; a++) {
        for (var b = 0; b < this.miningSites[a].unassignedPositions.length; b++) {
            var pos = this.miningSites[a].unassignedPositions[b];
            this.createFlag(pos.x, pos.y, ['S', a, b].join('.'), 'orange');
        }
    }
console.log('SOURCES!!!');
    this.on('newSpawn', this.onNewSpawn);
}

MyRoom.prototype.ressurectUnits = function() {
    for (var type in this.creeps) {
        this.creeps[type].forEach(function(creep) {
            if (!creep.alive && !creep.dummy) {
                this.spawn(creep);
            }
        }.bind(this));
    }
};

MyRoom.prototype.onNewSpawn = function(spawn) {
    console.log('New Spawn');
    this.spawns.push(platform.construct(MySpawn, spawn));
    util.sortByDistance(this.miningSites, this.spawns);
};

MyRoom.prototype.deployUnits = function() {
    for (var fakeWeight = 0; fakeWeight < 2; fakeWeight++) {
        if (!this.lastCreep || this.lastCreep.alive) {
            var units = [];
            var totalWeight = 0;
            var totalCreeps = fakeWeight;
            for (var name in logic.units) {
                totalCreeps += this.creeps[name].length;
                var unit = logic.units[name];
                unit.type = name;
                totalWeight += unit.weight;
                units.push(unit);
            }
            units.sort(function(a, b) {
                return a.priority - b.priority;
            });
            for (var i = 0; i < units.length; i++) {
                var unit = units[i];
                var totalCreepsOfThisUnit = this.creeps[unit.type].length;
                if (
                        /* Min condition */ (unit.min && totalCreepsOfThisUnit < unit.min)
                        ||
                        /* Ratio condition */ ((totalCreepsOfThisUnit / totalCreeps || 0) < (unit.weight / totalWeight || 0))
                    ) {

                    if (/* Max condition */ (!unit.max || totalCreepsOfThisUnit < unit.max)) {

                        switch (unit.type) {
                            case 'miner': this.lastCreep = this.createMiner(); break;
                            case 'runner': this.lastCreep = this.createRunner(); break;
                            case 'defender': this.lastCreep = this.createDefender(); break;
                            case 'medic': this.lastCreep = this.createMedic(); break;
                            default:
                                console.log('Unknown unit type: ' + unit.type);
                                return;
                        }

                        if (this.lastCreep) {
                            this.lastCreep.room = this;
                            this.creeps[unit.type].push(this.lastCreep);
                            this.spawn(this.lastCreep);
                            return;
                        }
                    } else {
                        this.creeps[unit.type].push({dummy: true});
                        console.log('Faking a ' + unit.type);
                        return;
                    }
                }

                if (!this.lastCreep) this.lastCreep = this.createMedic();
            }
        }
    }
};
MyRoom.prototype.createMiner = function() {
    console.log('MINER');
    for (var i = 0; i < this.miningSites.length; i++) {
        var site = this.miningSites[i];
        if (site.unassignedPositions.length) {
            var position = site.unassignedPositions.pop();
            var miner = platform.construct(Miner, null, position);
            site.miners.push(miner);
            return miner;
        }
    }
};

MyRoom.prototype.createRunner = function() {
    console.log('RUNNER');
    var runner = platform.construct(Runner);
    return runner;
};

MyRoom.prototype.createDefender = function() {
    var defender = platform.construct(Defender);
    return defender;
};

MyRoom.prototype.createMedic = function() {
    var medic = platform.construct(Medic);
    medic.assignment = this.creeps.defender[this.creeps.defender.length - 1];
    return medic;
}

MyRoom.prototype.spawn = function(creep, target) {
    // TODO: Find nearest spawn, or idle spawn
    if (this.spawns[0]) {
        this.spawns[0].queueCreep(creep);
    } else {
        console.log('Spawns empty');
    }
};

MyRoom.prototype.pickupEnergy = function() {
    var nrgs = this.find(Game.DROPPED_ENERGY)||[];
    util.sortByDistance(nrgs, this.spawns[0]);
    nrgs.forEach(function(nrg) {
        var energy = Energy.getFor(nrg);
        while (energy.getUnclaimedEnergy()) {
            // Find nearest idle runner
            var runners = this.creeps.runner.slice(0);
            util.sortByDistance(runners, nrg);
            for (var i = 0; i < runners.length; i++) {
                var runner = runners[i];
                if (!runner.assignment && runner.energy < runner.energyCapacity) {
                    energy.assignRunner(runner);
                    return;
                }
            }
            break;
        }
    }.bind(this));
};

MyRoom.prototype.planBuildings = function() {
    return; // Do this manually for now
    if (this.creeps.defender.length && this.creeps.defender[0].hits && this.creeps.medic.length && this.creeps.medic[0].hits) {
        var sites = this.find(Game.CONSTRUCTION_SITES);
        if (sites.length < 1) {
            for (var i = 0; i < this.creeps.miner.length; i++) {
                var miner = this.creeps.miner[i];
                if (miner.assignment && !util.findByPos(sites)) {
                    this.createConstructionSite(miner.assignment, Game.STRUCTURE_RAMPART);
                    return;
                }
            }
        }
    }
};

MyRoom.prototype.buildBuildings = function() {
    var sites = this.find(Game.CONSTRUCTION_SITES)||[];
    sites.forEach(function(site) {
        var cSite = ConstructionSite.getFor(site);
        while (cSite.getUnclaimedWork()) {
            console.log('Need a runner');
            // Find nearest full runner
            var runners = this.creeps.runner.slice(0);
            util.sortByDistance(runners, site);
            for (var i = 0; i < runners.length; i++) {
                var runner = runners[i];
                if (!runner.assignment && runner.energy) {
                    console.log('Assigning runner');
                    cSite.assignRunner(runner);
                    return;
                }
            }
            break;
        }
    }.bind(this));
};

var temp = {find: {}}
MyRoom.prototype.find = function(type, opts) {
    if (!temp.find[type]) temp.find[type] = this.room.find(type);
    var ret = temp.find[type].slice(0);
    if (opts && opts.filter) ret = _.filter(ret, opts.filter);
    return ret;
};