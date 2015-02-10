var _ = require('lodash'),
    OBJECT_ID = '@platform.id',
    OBJECT_TYPE = '@platform.type',
    DYNAMIC_ID = '@platform.gameId',
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

    _.forEach(['spawns', 'creeps', 'structures', 'flags', 'rooms'], function(names) {
        var arr = Game[names];
        _.forEach(arr, function(val) {
            this.dynamicObjects[val.id] = val;
        }.bind(this))
    }.bind(this));

}

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
    if (!constructor) throw new Error('Constructor required');
    if (!constructor.apply) throw new Error('Constructor is not a function: ', typeof constructor);
    // Construct an object in the same way it will be reconstructed to
    // help find bugs earlier
    if (!this.types[constructor.name]) throw new Error('Type not registered: ' + constructor.name);
    var o = Object.create(constructor.prototype);
    var objectId = 'object' + this.memory.objectCount++;
    var args = [];
    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    var ret = constructor.apply(o, args);
    if (ret) throw new Error('Create classes using prototype pattern, '+
        'not module pattern. Objects are reconstructed using prototype.');
    this.heap[objectId] = o;

    o[OBJECT_ID] = objectId;
    o[OBJECT_TYPE] = constructor.name;
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
        var copy = _.cloneDeep(object, function(value) {
            if (value && value[OBJECT_ID] && value[OBJECT_ID] !== object[OBJECT_ID]) {
                // Save references to platform managed objects
                var ret = {};
                ret[OBJECT_ID] = value[OBJECT_ID];
                return ret;
            } else if (value && value.id && this.dynamicObjects[value.id]) {
                // Save references to world objects
                var ret = {};
                ret[DYNAMIC_ID] = value.id;
                return ret;
            } else {
                return undefined;
            }
        }.bind(this));
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
        var localData = _.cloneDeep(copy, function(value) {
            if (value && value[OBJECT_ID] && value[OBJECT_ID] !== copy[OBJECT_ID]) {
                var obj = heap[value[OBJECT_ID]];
                if (!obj) throw new Error('Unresolved dependency');
                return obj;
            } else if (value && value[DYNAMIC_ID]) {
                return this.dynamicObjects[value[DYNAMIC_ID]] || null;
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

    this.heap = heap;
 
};

/**
 * Call from main per tick to announce to existing objects that a tick has occured
 */
Platform.prototype.tick = function() {
    this.emit('tick');
}

/**
 * Inherit classes
 * @param {Function} constructor - The class to extend
 * @param {Function} baseConstructor - The class to extend with
 */
Platform.prototype.inherit = Platform.inherit = function inherit(constructor, baseConstructor) {
    var oldProto = constructor.prototype;
    var newProto = Object.create(baseConstructor.prototype);
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

Platform.Base = function Base() {
    this.__events = {};
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
    this.__events[name] = handler;
}

/**
 * Raise a system-wide event
 * @param {string} name - Name of the event
 * @param {...*} args - Arguments to pass to event handlers
 */
Platform.Base.prototype.emit = function(name) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

    // Call event handlers
    _.forEach(platform.heap, function(obj) {
        if (obj.__events && obj.__events[name]) {
            obj[obj.__events[name]].apply(obj, args);
        }
    });
}
Platform.inherit(Platform, Platform.Base);

module.exports = platform = new Platform(Game);
