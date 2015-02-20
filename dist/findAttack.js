module.exports = function(creep, ignoreCreeps, defend) {
    function find(opts) {
        opts = opts || {};
        var target, possibleTargets = creep.room.find(Game.HOSTILE_SPAWNS);
        if (!ignoreCreeps) {
            possibleTargets = possibleTargets.concat(creep.room.find(Game.HOSTILE_CREEPS));
        }
        target = creep.pos.findClosest(possibleTargets, opts);
        if (target) {
            creep.moveTo(target, opts);
        }
        return target;
    }
    var target, healers = creep.room.find(Game.MY_CREEPS, {
        filter: function(i) {
            return i.getActiveBodyparts('heal') > 0;
        }
    });
    if (defend) {
        var siege = creep.room.find(Game.MY_CREEPS, {
            filter: function(i) {
                return /Siege/.test(i.name);
            }
        });
        if (siege.length > 0) {
            target = siege[0];
            creep.moveTo(target);
        }
    }
    if (!target && creep.hits < creep.hitsMax / 2 && healers.length > 0) {
        target = creep.pos.findClosest(Game.MY_CREEPS, {
            filter: function(i) {
                return i.getActiveBodyparts('heal') > 0;
            }
        });
        if (!target || creep.moveTo(target) != Game.OK) {
            target = null;
        }
    }
    var nearCreeps = creep.pos.findInRange(Game.HOSTILE_CREEPS, 1);
    if (nearCreeps) {
        creep.attack(nearCreeps[0]);
    }
    if (!target) {
        target = find();
        if (!target && !ignoreCreeps) {
            target = find({
                ignoreDestructibleStructures: true
            });
        }
        if (!target && ignoreCreeps) {
            var hostileCreeps = creep.room.find(Game.HOSTILE_CREEPS);
            target = find({
                ignoreDestructibleStructures: true,
                ignore: hostileCreeps
            });
        }
        if (!target) {
            target = creep.pos.findClosest(Game.HOSTILE_CREEPS);
            if (target) {
                creep.moveTo(target);
            }
        }
        if (!target) {
            target = creep.pos.findClosest(Game.HOSTILE_CREEPS, {
                ignoreDestructibleStructures: true
            });
            if (target) {
                creep.moveTo(target, {
                    ignoreDestructibleStructures: true
                });
            }
        }
        if (!target) {
            return;
        }
        creep.attack(target);
    }
    if (creep.getActiveBodyparts(Game.RANGED_ATTACK)) {
        require('shootAtWill')(creep);
    }
}