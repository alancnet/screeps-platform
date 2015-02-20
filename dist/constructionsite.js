var platform = require('platform'),
    util = require('util'),
    _ = require('lodash');
module.exports = ConstructionSite;

ConstructionSite.getFor = function(constructionSite) {
    if (!Game.myGame.energies) Game.myGame.energies = {};
    var energies = Game.myGame.energies;
    if (energies[constructionSite.id]) {
        return energies[constructionSite.id];
    } else {
        var nrg = platform.construct(ConstructionSite, constructionSite);
        energies[constructionSite.id] = nrg;
        return nrg;
    }
};

platform.inherit(ConstructionSite, platform.Base);
function ConstructionSite(constructionSite) {
    this.base();
    this.constructionSite = constructionSite;
    this.on('tick', this.checkAlive);
    this.on('runner.full', this.relieveRunner);
    this.runners = [];
}

ConstructionSite.prototype.assignRunner = function(runner) {
    this.runners.push(runner);
    runner.assignment = this.constructionSite;
};

ConstructionSite.prototype.relieveRunner = function(runner) {
    var i = this.runners.indexOf(runner);
    if (i != -1) {
        this.runners.splice(i, 1);
        runner.assignment = null;
    }
};

ConstructionSite.prototype.checkAlive = function() {
    this.alive = !!(this.constructionSite && this.constructionSite.constructionSite);
    if (!this.alive) {
        this.broadcast('constructionSiteCompleted', this);
        this.dispose();
    }
};

ConstructionSite.prototype.getRunnerCapacity = function() {
    var cap = 0;
    _.forEach(this.runners, function(runner) {
        cap += runner.constructionSiteCapacity - runner.constructionSite;
    });
    return cap;
};

ConstructionSite.prototype.getUnclaimedConstructionSite = function() {
    return Math.max(0, this.constructionSite.constructionSite - this.getRunnerCapacity());
};
