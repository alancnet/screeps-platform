var _ = require('lodash');
module.exports = {
    moveToNearest: moveToNearest,
    distance: distance,
    sortByDistance: sortByDistance,
    createMemory: createMemory,
    find: find,
    findNearest: findNearest,
    findByPos: findByPos,
    pos: {
        toMemory: toMemory,
        fromMemory: fromMemory,
        isEqual: posIsEqual
    },
    getPointsAtDistance: getPointsAtDistance,
    getErrorMessage: getErrorMessage,
    decoratePositions: decoratePositions,
    fireAtWill: fireAtWill,
    cost: cost,
    maxCost: maxCost,
    getEmptyPositionsAround: getEmptyPositionsAround,
    moveAwayFromNearest: moveAwayFromNearest,
    moveAwayFrom: moveAwayFrom,
    approxDistance: approxDistance
};

function distance(a, b) {
    var pos1 = a.pos || a,
        pos2 = b.pos || b;

    return Math.sqrt(
        Math.pow(pos1.x - pos2.x, 2) +
            Math.pow(pos1.y - pos2.y, 2)
    );
}

function moveAwayFrom(w, target) {
    var points = getEmptyPositionsAround(w);
    sortByDistance(points, target);
    var furthest = points.pop();
    if (furthest) {
        w.moveTo(furthest.x, furthest.y);
    }
}
function moveAwayFromNearest(w, type, minDistance) {
    if (!w) throw new Error('moveAwayFromNearest called without creep');
    if (!w.pos) throw new Error('moveAwayFromNearest called with creep without pos');
    var objs = w.room.find(type);
    if (objs) {
        sortByDistance(objs, w);
        var obj = objs.shift();
        if (!obj) return null;
        if (!obj.pos) throw new Error('obj has no position');
        if (!minDistance || distance(w, obj) <= minDistance) {
            moveAwayFrom(w, obj);
            return obj;
        }
    }
}


function moveToNearest(w, type) {
    if (!w) throw new Error('moveToNearest called without creep');
    if (!w.pos) throw new Error('moveToNearest called with creep without pos');
    var objs = w.room.find(type);
    if (objs) {
        sortByDistance(objs, w);
        var obj = objs.shift();
        if (!obj) return null;
        if (!obj.pos) throw new Error('obj has no position');
        w.moveTo(obj);
        return obj;
    }
}

function toMemory(point) {
    return {x: point.x, y: point.y};
}

function fromMemory(point) {
    return room.getPositionAt(point.x, point.y);
}

function sortByDistance(arr, distanceTo) {
    if (!(distanceTo instanceof Array)) distanceTo = [distanceTo];
    arr.forEach(function(item) {
        item.$$distance = Infinity;
        distanceTo.forEach(function(target) {
            item.$$distance = Math.min(item.$$distance, distance(item.pos || item, target.pos || target));
        });
    });
    arr.sort(function(a, b) {
        return a.$$distance - b.$$distance;
    });
    arr.forEach(function(item) {
        delete item.$$distance;
    });
    return arr;
}

function posIsEqual(a, b) {
    var pos1 = a.pos || a,
        pos2 = b.pos || b;
    var ret = pos1.x === pos2.x && pos1.y === pos2.y;
    return ret;
}

function createMemory(obj) {
    if (!Memory.foreign) Memory.foreign = {};
    if (!Memory.foreign[obj.id]) Memory.foreign[obj.id] = {};
    obj.memory = Memory.foreign[obj.id];
}

function find(creep, type, range) {
    var objs = creep.room.find(type);
    if (objs && objs.length) {
        objs.forEach(function(obj) {
            obj.distance = Math.sqrt(
                Math.pow(creep.pos.x - obj.pos.x, 2) +
                    Math.pow(creep.pos.y - obj.pos.y, 2)
            );
        });
        objs.sort(function(a, b) {
            return a.distance - b.distance;
        }).filter(function(a){
                return !range && a.distance <= range;
            });
        return objs;
    }

}

function findNearest(creep, type, range) {
    var objs = find(creep, type);
    if (objs && objs.length && (!range || distance(creep, objs[0]) <= range)) return objs[0];
}

function getEmptyPositionsAround(item) {
    var distance = 1;
    var minx = item.pos.x - distance,
        maxx = item.pos.x + distance,
        miny = item.pos.y - distance,
        maxy = item.pos.y + distance;
    var ret = [];
    var area = item.room.lookAtArea(miny, minx, maxy, maxx);

    for (var x = minx; x <= maxx; x++) {
        for (var y = miny; y <= maxy; y++) {
            var things = ((area[y]||[])[x]||[]);
            if (things.length === 1 && things[0].type === 'terrain' && things[0].terrain !== 'wall') {
                ret.push({
                    x: x,
                    y: y
                });
            }
        }
    }
    return ret;
}

function getPointsAtDistance(item, distance, gaps) {

    if (!gaps) gaps = 0;
    var positions = [];
    var targets = [];
    [Game.EXIT_BOTTOM, Game.EXIT_TOP, Game.EXIT_LEFT, Game.EXIT_RIGHT].forEach(function(exitType) {
        var exit = findNearest(item, exitType);
        if (exit) targets.push(exit);
    });

    for (var i = 0; i < 100; i++) {
        var target = targets[i % targets.length].pos;
        var steps = item.room.findPath(target, item.pos, {
            ignoreCreeps: true,
            avoid: _.clone(positions)
        }).reverse();
        var myPos = steps[distance];
        if (!myPos || !steps.length || module.exports.distance(steps[0], item.pos) != 0) {
            //console.log('Found no path at ', i);
            continue;
        }
        positions.push(item.room.getPositionAt(myPos.x, myPos.y));
    }

    var positionsWithGaps = [];
    for (var i = 0; i < positions.length; i++) {
        // Skip for gaps
        if (i % (gaps + 1)) continue;
        positionsWithGaps.push(positions[i]);
    }
    positions = positionsWithGaps;


    return positions;
}

function decoratePositions(room, positions, myColor) {
    Game.myGame.flagCount = Game.myGame.flagCount || 0;
    var colors = [
        'green',
        'yellow',
        'orange',
        'red',
        'purple'
    ];
    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        var color = colors[Math.floor(i*colors.length/positions.length)];
        room.createFlag(pos.x, pos.y, (Game.myGame.flagCount++).toString(), myColor || color);
        console.log(pos.x, pos.y, color);
    }
}


function getErrorMessage(val) {
    if (val === 0) return 'OK';
    for (var key in Game) {
        if (key.substr(0, 4) == 'ERR_' && Game[key] === val) return key;
    }
    return 'ERR_' + val;
}

function fireAtWill(creep) {
    var targets = creep.pos.findInRange(Game.HOSTILE_CREEPS, 3).concat(creep.pos.findInRange(Game.HOSTILE_SPAWNS, 3));
    var massDmg = 0,
        distanceDmg = {
            1: 10,
            2: 4,
            3: 1
        };
    for (var i in targets) {
        var distance = Math.max(Math.abs(targets[i].pos.x - creep.pos.x), Math.abs(targets[i].pos.y - creep.pos.y));
        massDmg += distanceDmg[distance];
    }
    if (massDmg > 13) {
        creep.rangedMassAttack();
    } else {
        var min = -1,
            target;
        for (var i in targets) {
            if (min == -1 || min > targets[i].hits) {
                target = targets[i];
                min = targets[i].hits;
            }
        }
        creep.rangedAttack(target);
    }
}

function cost(body) {
    var cost = 10;
    for (var i = 0; i < body.length; i++) {
        cost += Game.BODYPART_COST[body[i]];
    }
    return cost;
}

function maxCost(body, max) {
    var ret = body.slice(0);
    while (cost(ret) > max) ret.shift();
    return ret;
}

function approxDistance(a, b) {
    var pos1 = a.pos || a,
        pos2 = b.pos || b;
    return Math.max(Math.abs(pos1.x - pos2.x), Math.abs(pos1.y - pos2.y));
}

function findByPos(arr, x, y) {
    if (arr) {
        for (var i = 0; i < arr; i){
            var pos = arr[i].pos || arr[i];
            if (pos && pos.x == x && pos.y == y) {
                return arr[i];
            }
        }
    }
}