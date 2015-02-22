(function() {
    //require('optimization');
    Memory.ticks = (Memory.ticks||0) + 1;
    if (Memory.ticks < 2)  return
    try {
    //    for (var key in Memory) {
    //        delete Memory[key];
    //    }


        var map = require('route');

    // Unit tests
    //require('tests')();
        var platform = require('platform'),
            baseCreep = require('basecreep'),
            myTypes = ['mygame', 'myroom', 'myspawn', 'miner', 'miningsite', 'runner', 'energy', 'defender', 'medic', 'constructionsite'],
            MyGame = require('mygame');

        myTypes.forEach(function(lib) {
            platform.registerType(require(lib));
        });

        platform.load();

        Game.myGame = platform.constructSingleton(MyGame, Game);

        platform.tick();
    //    platform.tick();
        platform.save();

        var copy = JSON.parse(JSON.stringify(Memory));
        for (var key in Memory) {
            delete Memory[key];
        }
        for (var key in copy) {
            Memory[key] = copy[key];
        }


    } catch (e) {
        console.log('%c%s', 'color: red;', (e.stack|| e.messsage|| e.toString&& e.toString()||"null").replace(/blob:.+,/g, ''));
        throw e;
    }
})();
