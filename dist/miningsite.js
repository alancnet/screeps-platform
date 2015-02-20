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
    util.decoratePositions(this.source.room, this.allPositions, 'yellow');
}

