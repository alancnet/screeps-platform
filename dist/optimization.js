var _ = require('lodash');
if (false) {
_.forEach(Game.rooms, function (room) {
    room.everything = room.lookAtArea(0, 0, 49, 49);
    room.lookAt = function(x, y) {
        if (typeof x === 'object') {
            var pos = x.pos || x;
            x = pos.x;
            y = pos.y;
        }
        return room.everything[x][y];
    };
//    room.lookAtArea = function(y1, x1, y2, x2) {
//        var ret = [];
//        for (var x = x1; x <= x2; x++) {
//            ret[x] = [];
//            for (var y = y1; y <= y2; y++) {
//                ret[x][y] = room.everything[x][y];
//            }
//        }
//        return ret;
//    }
});
}