var platform = require('platform'),
    util = require('util');
module.exports = MiningSite;

platform.inherit(MiningSite, platform.Base);
function MiningSite(source) {
    this.base();
    this.source = source;
    this.miners = [];
    this.pos = {
        x: source.pos.x,
        y: source.pos.y
    };
    this.allPositions = util.getEmptyPositionsAround(this.source);
    this.unassignedPositions = this.allPositions.slice(0, 2);
    //util.decoratePositions(this.source.room, this.allPositions, 'yellow');
}

