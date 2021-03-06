var platform = require('platform'),
    util = require('util');
module.exports = Miner;

platform.inherit(Miner, platform.BaseCreep);
function Miner(creep, assignment) {
    this.base(creep);
    this.assignment = assignment;
    this.on('tick', this.doMining);
    this.on('spawned', this.onSpawned);
    this.on('damage', this.onDamage);
}

Miner.prototype.getBody = function(length) {
    var body = ['move', 'work', 'work', 'work', 'work'];
    while (body.length < length) body.push('work');
    return body;
};

Miner.prototype.doMining = function() {
    if (this.alive) {
        if (this.assignment) {
            this.moveTo(this.assignment);
            var source = (util.find(this, Game.SOURCES, 1.5)).filter(function(s) {
                return !!s.energy;
            })[0];
            if (source) {
                this.harvest(source);
            }
        } else {
            this.say('No source');
        }
    }
};

Miner.prototype.onSpawned = function() {
    this.say('I live!')
};

Miner.prototype.onDamage = function(damage) {
    if (this.alive) this.say('Ouch! ' + damage);
}