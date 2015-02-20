var platform = require('platform'),
    MySpawn = require('myspawn'),
    Miner = require('miner'),
    Runner = require('runner'),
    MiningSite = require('miningsite'),
    Energy = require('energy'),
    Defender = require('defender'),
    Medic = require('medic'),
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
//        if (!(this.findPath(spawn.pos, source.pos)||[]).filter(function(step) {
//            if ((this.lookAt(step.x, step.y)||[]).filter(function(thing) {
//                return thing.terrain === 'swamp';
//            }.bind(this)).length) return true;
//        }.bind(this)).length)
        this.miningSites.push(platform.construct(MiningSite, source));
    }.bind(this));
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
        if (site.miners.length < Math.min(2, site.allPositions.length)) {
            var miner = platform.construct(Miner, null, site.source);
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
    var sites = this.find(Game.CONSTRUCTION_SITES);
    if (sites.length < 1) {
        for (var i = 0; i < this.creeps.miner.length; i++) {
            var miner = this.creeps.miner[i];
            if (miner.assignment && !util.findByPos(sites)) {
                this.createConstructionSite(miner.pos, Game.STRUCTURE_RAMPART);
                return;
            }
        }
    }
};

MyRoom.prototype.buildBuildings = function() {
    var sites = this.find(Game.CONSTRUCTION_SITES)||[];
    sites.forEach(function(site) {
        var cSite = ConstructionSite.getFor(site);
        while (cSite.getUnclaimedEnergy()) {
            // Find nearest full runner
            var runners = this.creeps.runner.slice(0);
            util.sortByDistance(runners, site);
            for (var i = 0; i < runners.length; i++) {
                var runner = runners[i];
                if (!runner.assignment && runner.energy) {
                    cSite.assignRunner(runner);
                    return;
                }
            }
            break;
        }
    }.bind(this));
};