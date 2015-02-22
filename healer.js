module.exports = function(creep) {
    var target = creep.pos.findNearest(Game.MY_CREEPS, {
        filter: function(i) {
            return i != creep && i.hits < i.hitsMax;
        }
    });
    if (!target) {
        target = creep.pos.findNearest(Game.MY_CREEPS, {
            filter: function(i) {
                return i != creep && i.getActiveBodyparts(Game.HEAL) == 0;
            }
        });
    }
    if (!target) {
        console.log('No one to heal');
        return false;
    }
    if (creep.pos.isNearTo(target)) {
        creep.heal(target);
    } else {
        creep.rangedHeal(target);
    }
    creep.moveTo(target, true);
    if (creep.getActiveBodyparts(Game.RANGED_ATTACK)) {
        require('shootAtWill')(creep);
    }
    return true;
}