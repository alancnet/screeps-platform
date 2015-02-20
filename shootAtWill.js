module.exports = function(creep) {
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
