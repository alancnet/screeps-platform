var platform = require('platform'),
    util = require('util'),
    _ = require('lodash');
module.exports = Energy;

Energy.getFor = function(energy) {
    if (!Game.myGame.energies) Game.myGame.energies = {};
    var energies = Game.myGame.energies;
    if (energies[energy.id]) {
        return energies[energy.id];
    } else {
        var nrg = platform.construct(Energy, energy);
        energies[energy.id] = nrg;
        return nrg;
    }
};

platform.inherit(Energy, platform.Base);
function Energy(energy) {
    this.base();
    this.energy = energy;
    this.on('tick', this.checkAlive);
    this.on('runner.full', this.relieveRunner);
    this.runners = [];
}

Energy.prototype.assignRunner = function(runner) {
    this.runners.push(runner);
    runner.assignment = this.energy;
};

Energy.prototype.relieveRunner = function(runner) {
    var i = this.runners.indexOf(runner);
    if (i != -1) {
        this.runners.splice(i, 1);
        runner.assignment = null;
    }
};

Energy.prototype.checkAlive = function() {
    this.alive = !!(this.energy && this.energy.energy);
    if (!this.alive) {
        this.broadcast('energyDepleted', this);
        this.dispose();
    }
};

Energy.prototype.getRunnerCapacity = function() {
    var cap = 0;
    _.forEach(this.runners, function(runner) {
        cap += runner.energyCapacity - runner.energy;
    });
    return cap;
};

Energy.prototype.getUnclaimedEnergy = function() {
    return Math.max(0, this.energy.energy - this.getRunnerCapacity());
};
