var platform = require('platform'),
    _ = require('lodash'),
    util = require('util'),
    healer = require('healer');
module.exports = Medic;
platform.inherit(Medic, platform.BaseCreep);
function Medic(creep) {
    this.base(creep);
    this.on('tick', this.doHealer);
    this.maxDistance = 2;
    this.maxHostileDistance = 15;
}

Medic.prototype.getBody = function(length, energy) {
    var body = ['move', 'move'];
    while (body.length < length) {
        body.push('heal');
    }
    return body;
};
Medic.prototype.doHealer = function() {
    if (this.creep) {
        var hostile = util.findNearest(this, Game.HOSTILE_CREEPS);
        var spawn = util.findNearest(this, Game.MY_SPAWNS);
        if (!healer(this.creep)) {
            if (this.assignment && util.approxDistance(this.pos, this.assignment.pos) > 3) {
                this.moveTo(this.assignment);
            }
        } else {
            this.say('OMW');
        }
    }
};
