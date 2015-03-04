var platform = require('platform'),
    util = require('util');

module.exports = Defender;

platform.inherit(Defender, platform.BaseCreep);
function Defender(creep) {
    this.base(creep);
    this.on('tick', this.defend);
    this.maxDistance = 3;
    this.maxHostileDistance = 20;
}

Defender.prototype.getBody = function(length, energy) {
    var body = ['move'];
    while (body.length < length) {
        body.push('ranged_attack');
    }
    return body;
};

Defender.prototype.defend = function() {
    if (this.alive) {
        //require('findAttack')(this, false, false);
        var hostile = util.findNearest(this, Game.HOSTILE_CREEPS);
        var hostileDistance = util.approxDistance(this, hostile);
        if (this.assignment) {
            if (util.approxDistance(this, this.assignment) > 3) {
                this.moveTo(this.assignment);
            } else {
                this.assignment = null;
            }
        }
        if (!this.assignment) {
            if (hostile && hostileDistance < 5 && hostileDistance > 3) {

            }
        }

        var spawn = util.findNearest(this, Game.MY_SPAWNS);
        if (spawn) {
            var spawnDistance = util.distance(this, spawn);
            if (spawnDistance > (hostile ? this.maxHostileDistance : this.maxDistance)) {
                this.moveTo(spawn);
            } else if (!hostile) {
                if (spawnDistance < 2) util.moveAwayFrom(this, spawn);
                else this.move(Math.ceil(Math.random() * 8));
            } else {
                if (util.distance(this, hostile) < 3) {
                    util.moveAwayFrom(this, hostile);
                } else {
                    this.moveTo(hostile);
                }
            }
        }
    }
};