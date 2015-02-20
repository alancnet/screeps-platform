var _ = require('lodash'),
    platform = require('platform');
// 50 x 50 maps
var w = 50, h = 50;
var map = {
    addDestination: addDestination,
    routingPass: routingPass,
    performRouting:  performRouting,
    forWholeMap: forWholeMap,
    forNeighbors: forNeighbors,
    getNextMove: getNextMove
};
var room;
var dirs = [Game.TOP_LEFT, Game.TOP, Game.TOP_RIGHT, Game.LEFT, Game.OK, Game.RIGHT, Game.BOTTOM_LEFT, Game.BOTTOM, Game.BOTTOM_RIGHT];
init();

function init() {
    room = Game.rooms[Object.keys(Game.rooms)[0]];
    if (!Memory.terrainComplete) {
        if (!Memory.terrain) Memory.terrain = [];
        var max = Math.min(Memory.terrain.length + 100, w*h);
        for (var i = Memory.terrain.length; i < max; i++) {
            var x = i % w,
                y = Math.floor(i/w);
            Memory.terrain.push(getTerrainAt(x,y).substr(0, 1));
        }
        Memory.terrainComplete = (Memory.terrain.length === h * w);
        if (Memory.terrainComplete) {
            console.log('Terrain complete');
            Memory.terrain = Memory.terrain.join('');
        }
        return; // Next step next tick;
    }
    if (!Memory.mapComplete) {
        if (!Memory.map) Memory.map = [];
        Memory.destinations = [];
        initMap();
        _.forEach([['Spawn', Game.spawns], ['Source', room.find(Game.SOURCES)]], function(a) {
            var name = a[0];
            var things = a[1];
            _.forEach(things, function(thing) {
                addDestination(name, thing);
            })
        });
        console.log('Map complete');
        Memory.mapComplete = true;
        return;
    }
    if (!Memory.routeComplete) {
        if (performRouting(200)) {
            console.log('Route complete');
            Memory.routeComplete = true;
            //visualize(Memory.destinations[0]);
        }
        return;
    }

}

function performRouting(ms) {
    if (Memory.mapComplete) {
        var start = new Date().getTime();
        while (new Date().getTime() - start < ms) {
            if (routingPass()) return true;
        }
    }
}

function initMap() {
    Memory.map = Memory.terrain.split('').map(function(t) {
        return t === 'w' ? 0 : []
    });
}

function addDestination(name, thing) {
    Memory.destinations.push({
        name: name,
        x: thing.pos.x,
        y: thing.pos.y,
        id: thing.id,
        maxMapped: 0,
        fullyMapped: false,
        index: Memory.destinations.length,
        front: [{x: thing.pos.x, y: thing.pos.y}]
    });
    delete Memory.routeComplete;
}

function routingPass() {
    // Find destination in most need of routing
    var target = null;
    for (var i = 0; i < Memory.destinations.length; i++) {
        var dest = Memory.destinations[i];
        if (!dest.fullyMapped) {
            if (target === null || dest.maxMapped < target.maxMapped) {
                target = dest;
            }
        }
    }

    if (target) {
        var changeFound = false;
        var newFront = [];
        var frontIndexes = [];
        // Found a target, route
        var ti = index(target.x, target.y);
        if (!Memory.map[ti]) Memory.map[ti] = [];
        Memory.map[ti][target.index] = 0;
        _.forEach(target.front, function(pos) {
            var x = pos.x, y = pos.y, i = index(x, y);
            if (!Memory.map[i]) return;
            var val = Memory.map[i][target.index];
            if (isNaN(val)) return;
            forNeighbors(x, y, function(nx, ny, ni) {
                var cost = ((nx-x) && (ny-y)) ? 14 /*(sqrt2)*/ : 10;
                var tval = val + (getTerrainAt(nx, ny) === 's' ? 3 * cost : cost);
                var nval = Memory.map[ni][target.index];
                if (!nval || nval > tval) {
                    Memory.map[ni][target.index] = tval;
                    target.maxMapped = Math.max(tval, target.maxMapped);
                    changeFound = true;
                    if (frontIndexes.indexOf(ni) == -1) {
                        frontIndexes.push(ni);
                        newFront.push({
                            x: nx,
                            y: ny
                        });
                    }
                }
            });
        });
        target.front = newFront;
        target.fullyMapped = !changeFound;
        if (target.fullyMapped) {
            console.log(target.name + ' fully mapped after ' + target.maxMapped + ' passes.');
        }
    } else {
        return true;
    }
}

function index(x, y) {
    return (y % 50) * 50 + x;
}

function forStraightNeighbors(x, y, fn) {
    step2(x-1, y);
    step2(x+2, y);
    step2(x, y-1);
    step2(x, y+1);
    function step2(nx, ny) {
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            var i = index(nx, ny);
            if (Memory.map[i]) {
                fn(nx, ny, i);
            }
        }
    }
}

function forNeighbors(x, y, fn) {
    var d = 0;
    for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
            var dir = dirs[d++];
            if (dx || dy) {
                var nx = x+dx,
                    ny = y+dy,
                    i = index(nx, ny);
                if (nx >= 0 && nx <= 50 && ny >= 0 && ny < 50) {
                    if (Memory.map[i]) fn(x+dx, y+dy, index(x+dx, y+dy), dir);
                }
            }
        }
    }
}

function forWholeMap(fn) {
    for (var y = 0; y < 50; y++) {
        for (var x = 0; x < 50; x++) {
            var i = index(x, y);
            fn(x, y, i);
        }
    }
}

function getTerrainAt(x, y) {
    var i = index(x, y);
    if (Memory.terrain && Memory.terrain.length > i) return Memory.terrain[i];
    else return room.lookAt(x, y).reduce(function(pv, cv) {
        return pv || cv.terrain;
    }, null).substr(0, 1);
}


function visualize(target) {
    var colors = [
        'green',
        'yellow',
        'orange',
        'red',
        'purple'
    ];
    //Memory.toggle = !Memory.toggle;
    if (Memory.toggle) {
        for (var name in Game.flags) {
            Game.flags[name].remove();
        }
    } else {

        var flagCount = 0;

        forWholeMap(function(x, y, i) {
            var val = Memory.map[i] && Memory.map[i][target.index];
            if (val && Math.floor(Math.random() * 3) !== 11) {
                var p = val / target.maxMapped;
                var color = colors[Math.floor(val*colors.length/target.maxMapped)];
                if (color) room.createFlag(x, y, 'm' + (flagCount++).toString(), color);
            }
        });
    }
}

function getNextMove(pos, target, avoid) {
    var t = Memory.destinations.indexOf(target);
    var i = index(pos.x, pos.y);
    var val = Memory.map[i][t];
    var mval = val;
    var mx, my;
    var dir = 0;
    var area = room.lookAtArea(pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1);
    if (!avoid) avoid = [];
    forNeighbors(pos.x, pos.y, function(nx, ny, ni, ndir) {
        for (var i = 0; i < avoid.length; i++) {
            if (avoid[i].x == nx && avoid[i].y == ny) return;
        }
        var things = area[ny][nx];
        var nval = Memory.map[ni][t];
        if (nval < mval && !_.find(things, function(thing) {
            return thing.type === 'creep';
        })) {
            mval = nval;
            dir = ndir;
            mx = nx;
            my = ny;
        };
    });

    return {
        direction: dir,
        pos: room.getPositionAt(mx, my)
    };
}

module.exports = map;
