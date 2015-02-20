var platform = require('platform'),
    util = require('util');
module.exports = MySpawn;

platform.inherit(MySpawn, platform.BaseSpawn);
function MySpawn(spawn) {
    this.base(spawn);
    this.spawn = spawn;
    this.queue = [];
    this.spawningCreep = null;
    this.waves = [];
    this.w = 1;
    this.on('tick', this.onTick);
    this.on('tick', this.calculateWaves);
    this.on('newCreep', this.onNewCreep);
}

MySpawn.prototype.queueCreep = function(creep) {
    if (this.queue.indexOf(creep) === -1 && this.spawningCreep !== creep) {
        this.queue.push(creep);
        this.onTick();
    }
};

MySpawn.prototype.onTick = function() {
//    console.log('Spawn status: queue: ', this.queue.length, '; spawning: ', this.spawning, ';');
    if (!this.spawningCreep && !this.spawning) {
        var creep = this.queue[0];
        var body = creep && creep.getBody(5, this.energy);
        if (creep) {
            if (this.energy >= util.cost(body)) {
                console.log('Spawn', creep.name, creep.getBody(5, this.energy));
                var result = this.createCreep(creep.getBody(5, this.energy));
                if (isNaN(result)){
                    this.queue.shift();
                    this.spawningCreep = creep;
                } else {
                    console.log('Spawn error: ' + util.getErrorMessage(result));
                }
            } else {
                console.log('Not enuff nrg', body.join(), this.energy, util.cost(body));
            }
        } else {
            console.log('No creep');
        }
    }
};

MySpawn.prototype.onNewCreep = function(creep) {
    this.spawningCreep.creep = creep;
    if (this.spawningCreep.onTick) this.spawningCreep.onTick();
    this.spawningCreep = null;
};

MySpawn.prototype.calculateWaves = function() {
    return;
    if (this.w < 40) {
        var wave = util.getPointsAtDistance(this, this.w, 0);
        wave = wave.slice(0, Math.max(10, Math.floor(wave.length/5)));
        for (var a = 0; a < this.waves.length; a++) {
            var otherWave = this.waves[a];
            for (var b = 0; b < otherWave.length; b++){
                var otherPos = otherWave[b];
                for (var c = 0; c < wave.length; c++) {
                    var myPos = wave[c];
                    if (util.pos.isEqual(otherPos, myPos)) {
                        wave.splice(c, 1);
                        c--;
                    }
                }
            }
        }
        util.decoratePositions(this.room, wave, 'green');
        this.waves.push(wave);
        this.w++;
    }
};