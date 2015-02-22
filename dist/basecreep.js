/**
 * This file enhances platform.BaseCreep, but with the concerns of the application. That
 * is why these methods are not part of the platform. They are not framework concerns.
 */

var platform = require('platform'),
    util = require('util'),
    route = require('route'),
    _ = require('lodash');

var temp = {
    movedTo: []
};

platform.BaseCreep.prototype.moveTo = function() {
    if (this.fatigue) return;
    var item, x, y, debug;
    if (typeof arguments[0] === 'number') {
        x = arguments[0];
        y = arguments[1];
    } else {
        item = arguments[0];
        if (typeof item.x === 'number') {
            x = item.x;
            y = item.y;
        } else if (item.pos) {
            x = item.pos.x;
            y = item.pos.y;
        }
    };
    if (typeof arguments[1] === 'boolean') debug = arguments[1];

    var pos = {x: x, y: y};
    if (Memory.routeComplete) {
        // Try to route directly to target.
        var target;/* = _.find(Memory.destinations, function(dest) {
            return dest.id === item.id;
        });*/
        if (!target) {
            // Try to route to a nearby target.
            var poi = _.min(Memory.destinations, function(dest) {
                return util.approxDistance(dest, pos);
            });
            if (util.approxDistance(poi, pos) < 5 && util.approxDistance(this, pos) > 5) {
                // Found a nearby target
                target = poi;
            }
        }

        if (target) {
            var move = route.getNextMove(this.creep.pos, target);
            if (move) {
                //this.creep.move(move.direction);
                this.creep.moveTo(move.pos.x, move.pos.y);
                temp.movedTo.push(move.pos);
                var dirs = ['',
                    "T",
                    "TR",
                    "R",
                    "BR",
                    "B",
                    "BL",
                    "L",
                    "TL",
                ];
               // this.say('route ' + dirs[move.direction]);
                return;
            }

        }
    }

//    var nativeRoute = this.creep.room.findPath(
//        this.creep.pos,
//        this.creep.room.getPositionAt(x, y),
//        {
//            avoid: temp.movedTo
//        }
//    );
//    if (nativeRoute) {
//
//    }
    this.creep.moveTo(this.creep.room.getPositionAt(x, y));
    //this.creep.moveTo(x, y);
    //this.say('move');

}
