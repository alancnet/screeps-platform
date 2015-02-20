var _ = require('lodash'),
    cloneDeep = require('cloneDeep'),
    OBJECT_ID = '@platform.id',
    OBJECT_TYPE = '@platform.type',
    DYNAMIC_ID = '@platform.gameId',
    entityCollections = ['rooms', 'spawns', 'structures', 'flags', 'creeps'],
    platform;


/**
 * Options for Platform
 * @typedef {Object} PlatformOptions
 * @property {Function} gameClass - GameClass constructor
 */

/**
 * Creates an instance of platform
 * @param {PlatformOptions} options
 */
function Platform(options) {
    this.base();
    this.Base = Platform.Base;
    this.eventQueue = [];
    this.systemMemory = options.memory || Memory;
    if (!this.systemMemory.platform) this.systemMemory.platform = {
        objectCount: 0,
        singletons: {}
    };
    this.dynamicObjects = {};
    this.memory = this.systemMemory.platform;
    this.game = options.game || Game;
    this.heap = {};
    this.types = {};

    // Initialize dynamic objects
    if (this.game.rooms && this.game.getRoom) {
        // Normalize rooms interface
        for (var name in this.game.rooms) {
            var room = this.game.getRoom(name);
            if (room) {
                room.id = 'room:' + room.name;
                this.game.rooms[name] = room;
            }
        }
    }
    this.dynamicObjects['game'] = this.game;
    this.game.id = this.game.id || 'game';

    _.forEach(entityCollections, function(names) {
        var arr = Game[names];
        _.forEach(arr, function(val) {
            this.dynamicObjects[val.id] = val;
        }.bind(this))
    }.bind(this));

}
Platform.expectingBase = 0;

/**
 * Registers a type with platform for saving and loading from memory
 * @param {Function} constructor - Reference to class constructor. Function must have a name.
 */
Platform.prototype.registerType = function(constructor) {
    if (!constructor.name) throw new Error('Type does not have name');
    if (this.types[constructor.name] && this.types[constructor.name] !== constructor) throw new Error('Type already registered');
    this.types[constructor.name] = constructor;
};

/**
 * Registers a class as the Game Class, so that it is constructed once per game.
 * @param {Function} constructor - Reference to Game Class constructor.
 */
Platform.prototype.constructSingleton = function(constructor) {
    if (!constructor) throw new Error('Constructor required');
    if (!constructor.apply) throw new Error('Constructor is not a function: ' + JSON.stringify(constructor));

    if (!this.memory.singletons[constructor.name]) {
        var args = [constructor];
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
        var ret = this.construct.apply(this, args);
        this.memory.singletons[constructor.name] = ret[OBJECT_ID];
        return ret;
    } else {
        for (var key in this.heap) {
            var obj = this.heap[key];
            if (obj[OBJECT_TYPE] === constructor.name) return obj;
        }
    }
}

/**
 * Constructs a class by creating an object, and applying the
 * constructor to it.
 * @param {Function} constructor - Reference to class constructor.
 * @param {...*} args - Arguments to pass to constructor
 * @returns {Object} Instance of the class.
 */
Platform.prototype.construct = function construct(constructor) {
    Platform.constructing = (Platform.constructing || 0) + 1;
    if (!constructor) throw new Error('Constructor required');
    if (!constructor.apply) throw new Error('Constructor is not a function: ', typeof constructor);
    // Construct an object in the same way it will be reconstructed to
    // help find bugs earlier
    if (!this.types[constructor.name]) throw new Error('Type not registered: ' + constructor.name);
    var o = Object.create(constructor.prototype);
    var objectId = 'object' + this.memory.objectCount++;
    var args = [];
    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    var prevBase = Platform.expectingBase++;
    var ret = constructor.apply(o, args);
    if (Platform.expectingBase !== prevBase) throw new Error('Base class not called on construction. Did you forget to this.base()?');
    if (ret) throw new Error('Create classes using prototype pattern, '+
        'not module pattern. Objects are reconstructed using prototype.');
    this.heap[objectId] = o;

    o[OBJECT_ID] = objectId;
    o[OBJECT_TYPE] = constructor.name;

    Platform.constructing = Platform.constructing - 1;
    return o;
};

/**
 * Saved heap data
 */
Platform.prototype.save = function() {
    var deconstruct = function deconstruct(object) {
        if (stack.indexOf(object) != -1) throw new Error('Circular dependency');
        stack.push(object);
        if (object && object[OBJECT_ID] && data[object[OBJECT_ID]]) return;
        var copy;
        try {
            copy = cloneDeep.cloneDeep(object, function(value) {
                if (value && value[OBJECT_ID] && value[OBJECT_ID] !== object[OBJECT_ID]) {
                    // Save references to platform managed objects
                    var ret = {};
                    ret[OBJECT_ID] = value[OBJECT_ID];
                    return ret;
                } else if (value && value.id && (this.dynamicObjects[value.id] || Game.getObjectById(value.id)) && !value[OBJECT_ID]) {
                    // Save references to world objects
                    var ret = {};
                    ret[DYNAMIC_ID] = value.id;
                    return ret;
                } else {
                    return undefined;
                }
            }.bind(this));
        } catch (ex) {
            console.log(ex.stack);
        }
        data[object[OBJECT_ID]] = copy;
        if (stack.pop() !== object) throw new Error('Unexpected pop');
    }.bind(this);

    var data = {},
        stack = [],
        heap = this.heap;
    _.forEach(heap, function(obj) {
        deconstruct(obj);
    }.bind(this));

    this.memory.heap = data;

};

/**
 * Loads saved heap data
 */
Platform.prototype.load = function() {

    var reconstruct = function reconstruct(constructor, copy) {
        var o = Object.create(constructor.prototype);
        var localData = cloneDeep.cloneDeep(copy, function(value, key, obj) {
            if (value && value[DYNAMIC_ID] && !value[OBJECT_ID]) {
                return this.dynamicObjects[value[DYNAMIC_ID]] || Game.getObjectById(value[DYNAMIC_ID]) || null;
            } else {
                return undefined;
            }
        }.bind(this));
        _.extend(o, localData);
        heap[o[OBJECT_ID]] = o;

    }.bind(this);


    var heap = {},
        data = this.memory.heap || {};

    _.forEach(data, function(copy) {
        var constructor = this.types[copy[OBJECT_TYPE]];
        if (!constructor) throw new Error('Unknown type: ' + copy[OBJECT_TYPE]);
        reconstruct(constructor, copy);
    }.bind(this));

    var dependencies = [];

    _.forEach(heap, function(copy) {
        // Using cloneDeep to walk through the object the same way, but ignoring the output. This time
        // we'll be taking notes on the original object (the copy from before) and modifying it later.
        cloneDeep.cloneDeep(copy, function(value, key, obj) {
            if (value && value[OBJECT_ID] && value[OBJECT_ID] !== copy[OBJECT_ID]) {
                if (!obj) debugger;
                dependencies.push({
                    object: obj,
                    key: key,
                    id: value[OBJECT_ID]
                });
                return {};
            }
        });
    });

    dependencies.forEach(function(dep) {
        var obj = heap[dep.id];
        if (!obj) obj = null; //throw new Error('Unresolved dependency');
        dep.object[dep.key] = obj;
    });

    _.forEach(heap, function(obj) {
        obj.emit('revive');
    });

    this.heap = heap;

};

/**
 * Call from main per tick to announce to existing objects that a tick has occured
 */
Platform.prototype.tick = function() {
    this.broadcast('tick');

    var digests = 0;
    while (this.eventQueue.length && digests++ < 10) {
        var count = 0;
        while (this.eventQueue.length) {
            count++;
            if (count > 12) {
                //throw new Error(this.eventQueue.length.toString() +  this.eventQueue.join());
            }
            var ev = this.eventQueue.shift();

            ev.object['_'+ev.type].apply(ev.object, ev.args);
        }
    }
}

/**
 * Inherit classes
 * @param {Function} constructor - The class to extend
 * @param {Function} baseConstructor - The class to extend with
 */
Platform.prototype.inherit = Platform.inherit = function inherit(constructor, baseConstructor) {
    var oldProto = constructor.prototype;
    var newProto = Object.create(baseConstructor.prototype);
    Object.defineProperty(newProto, 'basePrototype', {
        value: baseConstructor.prototype,
        enumerable: false
    });
    newProto.baseConstructor = baseConstructor;
    constructor.prototype = _.extend(newProto, oldProto);

    //_.extend(constructor.prototype, baseConstructor.prototype);
    var oldBase = baseConstructor.prototype.base;
    constructor.prototype.base = function() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
        this.base = oldBase;
        baseConstructor.apply(this, args);
    }
}

/* Base Class */
{
    /**
     * Base class for all things. Offers event pub/sub.
     */
    Platform.Base = function Base() {
        if (!Platform.constructing) throw new Error('Use platform.construct to instantiate classes.');
        Platform.expectingBase--;
        this.__events = {};
    };

    Platform.Base.prototype.dispose = function() {
        delete platform.heap[this[OBJECT_ID]];
    };

    /**
     * Registers an event handler
     * @param {string} name - Name of event
     * @param {string|function} handler - Name of event handler on class object
     */
    Platform.Base.prototype.on = function(name, handler) {
        if (typeof handler === 'function') {
            var handlerFound = false;
            for (var key in this) {
                if (this[key] == handler) {
                    handler = key;
                    handlerFound = true;
                    break;
                }
            }
            if (!handlerFound) {
                throw new Error('Event handlers must be public methods of the class.');
            }
        }
        if (!this.__events[name]) this.__events[name] = [];
        if (!handler) throw new Error('Null handler');
        this.__events[name].push(handler);
        //this.__events[name] = handler
    }

    /**
     * Raise a system-wide event
     * @param {string} name - Name of the event
     * @param {...*} args - Arguments to pass to event handlers
     */
    Platform.Base.prototype.broadcast = function(name) {
        platform.eventQueue.push({
            object: this,
            type: 'broadcast',
            args: arguments,
            toString: function() {
                return '[event broadcast ' + this[OBJECT_TYPE] + ':' + name + ']';
            }
        });
    }


    /**
     * Raise an object-wide event
     * @param {string} name - Name of the event
     * @param {...*} args - Arguments to pass to event handlers
     */
    Platform.Base.prototype.emit = function(name) {
        platform.eventQueue.push({
            object: this,
            type: 'emit',
            args: arguments,
            toString: function() {
                return '[event emit ' + this[OBJECT_TYPE] + ':' + name + ']';
            }
        });
    }

    /**
     * Raise a system-wide event
     * @param {string} name - Name of the event
     * @param {...*} args - Arguments to pass to event handlers
     */
    Platform.Base.prototype._broadcast = function(name) {
        var args = [];
        for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);

        // Call event handlers
        _.forEach(platform.heap, function(obj) {
            if (obj._emit) obj._emit.apply(obj, args);
        });
    }


    /**
     * Raise an object-wide event
     * @param {string} name - Name of the event
     * @param {...*} args - Arguments to pass to event handlers
     */
    Platform.Base.prototype._emit = function(name) {
        var args = [];
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
        if (this.__events && this.__events[name]) {
            //this[this.__events[name]].apply(this, args);
            this.__events[name].forEach(function(handler) {
                if (this[handler]) this[handler].apply(this, args);
            }.bind(this));
        }
    }

    Platform.inherit(Platform, Platform.Base);
}

Platform.proxy = function(obj, prop) {
    var target = obj[prop];
    if (target) {
        for (var key in target) {
            if (obj[key] === undefined) {
                (function(key) {
                    Object.defineProperty(obj, key, {
                        get: function() {
                            var ret = target[key];
                            if (typeof ret === 'function') ret = ret.bind(target);
                            return ret;
                        },
                        set: function(value) {
                            target[key] = value;
                        }
                    });
                })(key);
            }
        }
    }
};

/* Base Game */
{
    Platform.BaseGame = function(game) {
        this.base();
        this.game = game;
        this.on('tick', this.detectChanges);
        this.on('rooms.new', 'onNewRoom');
        this.on('rooms.lost', 'onLostRoom');
        this.on('revive', this.onRevive);
        this.onRevive();
        this.entities = {
            byId: {}
        };
        entityCollections.forEach(function(collection) {
            this.entities[collection] = [];
        }.bind(this));
    }
    Platform.inherit(Platform.BaseGame, Platform.Base);
    Platform.BaseGame.prototype.onRevive = function() {
        Platform.proxy(this, 'game');
    };

    Platform.BaseGame.prototype.detectChanges = function() {
        var eventsToCall = {};
        var byId = {};

        entityCollections.forEach(function(collection) {
            var lost = _.clone(this.entities[collection]);
            var news = [];
            var current = [];
            _.forEach(this.game[collection], function(entity) {
                byId[entity.id] = entity;
                current.push(entity.id);
                var i = lost.indexOf(entity.id);
                if (i != -1) {
                    lost.splice(i, 1);
                } else {
                    news.push(entity.id);
                }
            }.bind(this));

            eventsToCall[collection] = {
                news: news,
                lost: lost
            };
            this.entities[collection] = current;
        }.bind(this));
        this.entities.byId = byId;
        // After entities has been updated, publish the events
        entityCollections.forEach(function(collection) {
            eventsToCall[collection].news.forEach(function(id) {
                console.log(collection + '.new', id);
                this.broadcast(collection + '.new', byId[id]);
            }.bind(this));
            eventsToCall[collection].lost.forEach(function(id) {
                console.log(collection + '.lost', id);
                this.broadcast(collection + '.lost', byId[id]);
            }.bind(this));
        }.bind(this));

    }
}

/* Base Room */
{
    Platform.BaseRoom = function(room) {
        this.base();
        this.room = room;
        this.on('creeps.new', this._newCreep);
        this.on('spawns.new', this._newSpawn);
        this.on('revive', this.onRevive);
        this.onRevive();
    };
    Platform.inherit(Platform.BaseRoom, Platform.Base);
    Platform.BaseRoom.prototype.onRevive = function() {
        Platform.proxy(this, 'room');
    };

    Platform.BaseRoom.prototype._newCreep = function(creep) {
        if (creep.room === this.room && this.onNewCreep) this.emit('newCreep', creep);
    };
    Platform.BaseRoom.prototype._newSpawn = function(spawn) {
        console.log('_newSpawn');
        if (spawn.room === this.room && this.onNewSpawn) this.emit('newSpawn', spawn);
    };
}

/* Base Spawn */
{
    Platform.BaseSpawn = function(spawn) {
        this.base();
        this.spawn = spawn;
        this.on('creeps.new', this._newCreep);
        this.on('revive', this.onRevive);
        this.onRevive();
    };
    Platform.inherit(Platform.BaseSpawn, Platform.Base);
    Platform.BaseSpawn.prototype.onRevive = function() {
        Platform.proxy(this, 'spawn');
    };
    Platform.BaseSpawn.prototype._newCreep = function(creep) {
        if (creep.pos.equalsTo(this.spawn.pos)) {
            console.log('newCreep', creep);
            this.emit('newCreep', creep);
        }
    }
}

/* Base Creep */
{
    Platform.BaseCreep = function(creep) {
        this.base();
        this.snapshot = {
            energy: 0,
            fatigue: 0,
            hits: 0,
            spawning: false
        };
        this.creep = creep;
        this.on('revive', this.onRevive);
        this.onRevive();
        this.on('tick', this.detectChanges);
    };
    Platform.BaseCreep.prototype.onRevive = function() {
        Platform.proxy(this, 'creep');
        this.alive = !!(this.creep && this.creep.hits);

    };
    Platform.inherit(Platform.BaseCreep, Platform.Base);
    Platform.BaseCreep.prototype.detectChanges = function() {
        var energy = this.energy || 0,
            fatigue = this.fatigue || 0,
            hits = this.hits || 0,
            spawning = this.spawning || false;

        if (energy !== this.snapshot.energy) {
            this.emit('energyChange', energy - this.snapshot.energy);
            if (energy === 0) this.emit('energyEmpty');
            if (energy === this.energyMax) this.emit('energyFull');
        }
        if (fatigue !== this.snapshot.fatigue) {
            this.emit('fatigueChange', fatigue - this.snapshot.fatigue);
            if (fatigue === 0) this.emit('unfatigued');
            else this.emit('fatigued');
        }
        if (hits !== this.snapshot.hits) {
            this.emit('hitsChange', hits - this.snapshot.hits);
            if (hits < this.snapshot.hits) this.emit('damage', this.snapshot.hits - hits);
            else this.emit('heal', hits - this.snapshot.hits);
        }
        if (spawning !== this.snapshot.spawning) {
            if (spawning) this.emit('spawning');
            else this.emit('spawned');
        }

        this.snapshot.energy = energy;
        this.snapshot.fatigue = fatigue;
        this.snapshot.hits = hits;
        this.snapshot.spawning = spawning;
    };
}


Platform.constructing = 1;
module.exports = platform = new Platform(Game);
Platform.constructing--;
platform.Base = Platform.Base;
platform.BaseGame = Platform.BaseGame;
platform.BaseRoom = Platform.BaseRoom;
platform.BaseSpawn = Platform.BaseSpawn;
platform.BaseCreep = Platform.BaseCreep;

