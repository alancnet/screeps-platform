var platform = require('platform'),
    util = require('util');
module.exports = Runner;

platform.inherit(Runner, platform.BaseCreep);
function Runner(creep) {
    this.base(creep);
    this.assignment = null;
    this.on('tick', this.run);
}

Runner.prototype.getBody = function(length) {
    var body = ['carry', 'carry', 'work', 'move', 'move'];
    while (body.length < length) body.unshift('work');
    return body;
};

Runner.prototype.run = function() {
    if (this.alive) {
        if (util.moveAwayFromNearest(this, Game.HOSTILE_CREEPS, 7)) {

        }
        else if (this.assignment && this.assignment.energy && this.energy < this.energyCapacity) {
            this.moveTo(this.assignment);
            this.pickup(this.assignment);
        } else if (this.energy) {
            if (this.assignment) this.broadcast('runner.full', this);
            var spawn = util.moveToNearest(this, Game.MY_SPAWNS);
            this.transferEnergy(spawn);
        } else {
            // TODO: Move Away from Spawn
        }
    }
};