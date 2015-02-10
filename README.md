# screeps-platform

Basic object oriented programming for Screeps:

```javascript
var platform = require('platform');

platform.inherit(MyGame, platform.Base);
function MyGame(game) {
    this.base();
    this.game = game;
    console.log('Constructed once!');
    this.on('tick', this.onTick);
    this.ticks = 0;
}
MyGame.prototype.onTick = function() {
    console.log('Game Tick', this.ticks++, this.game.time);
}


platform.registerType(MyGame);
platform.load();
platform.constructSingleton(MyGame);
platform.tick();
platform.save();
```
