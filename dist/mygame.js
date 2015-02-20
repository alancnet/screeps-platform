var platform = require('platform'),
    MyRoom = require('myroom');
module.exports = MyGame;

platform.inherit(MyGame, platform.BaseGame);
function MyGame(game) {
    this.base();
    this.game = game;
    this.myRooms = [];
    //console.log('Constructed once!');
    this.on('tick', this.onTick);
    this.on('newRoom', 'onNewRoom');
    this.ticks = 0;
}
MyGame.prototype.onTick = function() {
}

MyGame.prototype.onNewRoom = function(room) {
    this.myRooms.push(platform.construct(MyRoom, room));
}

