var platform = require('platform'),
    util = require('util');

module.exports = Defender;

platform.inherit(Defender, platform.BaseCreep);
function Defender(creep) {
    this.base(creep);
    this.on('tick', this.defend);
    this.maxDistance = 10;
    this.maxHostileDistance = 11;
}

Defender.prototype.getBody = function(length, energy) {
    var body = ['move'];
    while (body.length < length) {
        switch (body.length % 2) {
            case 10: body.push('move'); break;
            default : body.push('ranged_attack'); break;
        }
    }
    while (util.cost(body) < energy && body.length < 10) {
        body.unshift('tough');
    }
    util.maxCost(body, energy);
    return body;
};

Defender.prototype.defend = function() {
    if (this.alive) {
        require('findAttack')(this, false, false);
        var hostile = util.findNearest(this, Game.HOSTILE_CREEPS);
        if (this.assignment) this.moveTo(this.assignment);

        var spawn = util.findNearest(this, Game.MY_SPAWNS);
        if (spawn) {
            var spawnDistance = util.distance(this, spawn);
            if (spawnDistance > (hostile ? this.maxHostileDistance : this.maxDistance)) {
                this.moveTo(spawn);
            } else if (!hostile) {
                util.moveAwayFrom(this, spawn);
                //this.move(Math.ceil(Math.random() * 8));
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