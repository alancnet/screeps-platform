var platform = require('platform'),
    _ = require('lodash'),
    util = require('util'),
    healer = require('healer');
module.exports = Medic;
platform.inherit(Medic, platform.BaseCreep);
function Medic(creep) {
    this.base(creep);
    this.on('tick', this.doHealer);
    this.maxDistance = 7;
    this.maxHostileDistance = 10;
}

Medic.prototype.getBody = function(length, energy) {
    var body = ['move', 'move'];
    while (body.length < length) {
        body.push('heal');
    }
    while (util.cost(body) < energy) {
        body.unshift('tough');
    }
    return util.maxCost(body, energy);
};
Medic.prototype.doHealer = function() {
    if (this.creep) {
        var hostile = util.findNearest(this, Game.HOSTILE_CREEPS);
        var spawn = util.findNearest(this, Game.MY_SPAWNS);
        healer(this.creep);
        if (spawn) {
            var spawnDistance = util.distance(this, spawn);
            if (spawnDistance > (hostile ? this.maxHostileDistance : this.maxDistance)) {
                this.moveTo(spawn);

            }
        }
    }
};
