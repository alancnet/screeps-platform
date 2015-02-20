var global = self;
var Reflect = {
    global: global
};
! function a(b, c, d) {
    function e(g, h) {
        if (!c[g]) {
            if (!b[g]) {
                var i = "function" == typeof require && require;
                if (!h && i) return i(g, !0);
                if (f) return f(g, !0);
                var j = new Error("Cannot find module '" + g + "'");
                throw j.code = "MODULE_NOT_FOUND", j
            }
            var k = c[g] = {
                exports: {}
            };
            b[g][0].call(k.exports, function(a) {
                var c = b[g][1][a];
                return e(c ? c : a)
            }, k, k.exports, a, b, c, d)
        }
        return c[g].exports
    }
    for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
    return e
}({
    1: [function(a, b) {
        ! function() {
            "use strict";
            var c = (a("q"), a("./local-storage"), a("lodash")),
                d = a("./message-mux");
            return b.exports = function() {
                var a = [],
                    b = [],
                    e = [];
                return {
                    update: function(b, d) {
                        c.isObject(b) && (c.merge(b, d), b = b._id), a.push({
                            _id: b,
                            data: d
                        })
                    },
                    insert: function(a) {
                        b.push(a)
                    },
                    remove: function(a) {
                        e.push(a)
                    },
                    execute: function() {
                        return d.sendMessage({
                            type: "bulk",
                            updates: a,
                            inserts: b,
                            removes: e
                        })
                    }
                }
            }, {}
        }()
    }, {
        "./local-storage": 4,
        "./message-mux": 5,
        lodash: 6,
        q: 7
    }],
    2: [function(a, b) {
        ! function() {
            "use strict";
            return b.exports = {
                localStorage: {
                    PENDING_QUEUE: "pendingQueue_",
                    PROCESSING_QUEUE: "processingQueue_",
                    USERS: "users",
                    USERS_CODE: "users.code",
                    USERS_MEMORY: "users.memory",
                    ROOMS: "rooms",
                    ROOMS_OBJECTS: "rooms.objects",
                    ROOMS_TERRAIN: "rooms.terrain",
                    ROOMS_INTENTS: "rooms.intents",
                    GAME_TIME: "gametime",
                    RUN_TIMESTAMP: "runTimestamp",
                    GAME_INFO: "gameinfo",
                    REPLAY: "replay"
                }
            }, {}
        }()
    }, {}],
    3: [function(require, module, exports) {
        var $___46__46__95_simcore_47_src_47_core__ = function() {
            "use strict";

            function EvalCodeError(a) {
                this.toString = function() {
                    return a
                }
            }
            var __moduleName = ".._simcore/src/core",
                _ = require("lodash"),
                q = require("q"),
                config = require("./config"),
                localStorage = require("./local-storage"),
                bulk = require("./bulk"),
                workers = require("./workers"),
                mux = require("./message-mux"),
                consoleCommands = {
                    0: [],
                    1: [],
                    2: []
                },
                tickPeriodDefer = q.defer(),
                startedTimestamp = (new Date).getTime(),
                utils = require("../utils");
            return self.onmessage = function(a) {
                "setTickPeriod" == a.data.type ? tickPeriodDefer.resolve(a.data.period) : "worker" == a.data.type ? workers.handleMessage(a.data) : a.data.consoleCommand ? consoleCommands[a.data.userId].push(a.data.consoleCommand) : mux.handleMessage(a.data)
            }, setInterval(function() {
                localStorage.get(config.localStorage.RUN_TIMESTAMP).then(function(a) {
                    a > startedTimestamp && self.close()
                })
            }, 1e3), exports.queue = require("./queue"), exports.getTickPeriod = function() {
                return tickPeriodDefer.promise
            }, exports.connect = function() {
                return q.all([localStorage.initArray(config.localStorage.USERS), localStorage.initArray(config.localStorage.ROOMS, [{
                    _id: "sim"
                }]), localStorage.initArray(config.localStorage.ROOMS_OBJECTS), localStorage.initArray(config.localStorage.ROOMS_INTENTS)])
            }, exports.getUserRuntimeData = function(a) {
                return q.all([localStorage.get(config.localStorage.USERS).then(function(b) {
                        return _.find(b, function(b) {
                            return b._id == a
                        })
                    }), localStorage.get(config.localStorage.USERS_CODE).then(function(b) {
                        return _.find(b, function(b) {
                            return b._id == a
                        })
                    }), localStorage.get(config.localStorage.ROOMS_OBJECTS), localStorage.get(config.localStorage.ROOMS), localStorage.get(config.localStorage.GAME_TIME), localStorage.get(config.localStorage.ROOMS_TERRAIN), localStorage.get(config.localStorage.USERS_MEMORY).then(function(b) {
                        return _.find(b, function(b) {
                            return b._id == a
                        })
                    })]).then(function(b) {
                        var b = new Object({
                            user: b[0],
                            userCode: b[1] && b[1].modules,
                            userObjects: exports.mapById(_.where(b[2], function(b) {
                                return b.user == a
                            })),
                            roomObjects: exports.mapById(b[2]),
                            rooms: exports.mapById(b[3]),
                            time: b[4],
                            consoleCommands: consoleCommands[a],
                            roomTerrain: exports.mapById(b[5]),
                            userMemory: b[6].memory,
                            cpu: 1 / 0
                        });
                        return consoleCommands[a] = [], b
                    })
            }, exports.getAllUsers = function() {
                return localStorage.get(config.localStorage.USERS)
            }, exports.makeRuntime = function(a) {
                var b = workers.create("runtime"),
                    c = q.defer(),
                    d = !1,
                    e = {
                        type: "timeout",
                        timeout: 5e3
                    };
                return mux.sendMessage(e).then(function() {
                    d || (b.terminate(), c.reject("Script execution has been terminated"))
                }), b.onmessage = function(a) {
                    "done" == a.data.type && (d = !0, mux.sendMessage({
                        type: "clearTimeout",
                        timeoutTransactionId: e.transactionId
                    }), c.resolve(a.data)), "error" == a.data.type && (d = !0, mux.sendMessage({
                        type: "clearTimeout",
                        timeoutTransactionId: e.transactionId
                    }), c.reject(a.data.error))
                }, b.postMessage(a), c.promise
            }, exports.saveUserMemory = function(a, b) {
                return localStorage.get(config.localStorage.USERS_MEMORY).then(function(c) {
                    var d = _.find(c, function(b) {
                        return b._id == a
                    });
                    return d.memory = b, localStorage.put(config.localStorage.USERS_MEMORY, c)
                })
            }, exports.saveUserIntents = function(a, b) {
                return localStorage.get(config.localStorage.ROOMS_INTENTS).then(function(c) {
                    for (var d in b) {
                        var e = _.find(c, {
                            room: d
                        });
                        e || c.push(e = {
                            room: d
                        }), e.users = e.users || {}, e.users[a] = e.users[a] || {}, e.users[a].objects = b[d]
                    }
                    return localStorage.put(config.localStorage.ROOMS_INTENTS, c)
                })
            }, exports.getAllRooms = function() {
                return localStorage.get(config.localStorage.ROOMS)
            }, exports.getRoomIntents = function(a) {
                return localStorage.get(config.localStorage.ROOMS_INTENTS).then(function(b) {
                    return _.find(b, {
                        room: a
                    })
                })
            }, exports.getRoomObjects = function() {
                return localStorage.get(config.localStorage.ROOMS_OBJECTS).then(function(a) {
                    return exports.mapById(a)
                })
            }, exports.getRoomTerrain = function() {
                return localStorage.get(config.localStorage.ROOMS_TERRAIN).then(function(a) {
                    return exports.mapById(a)
                })
            }, exports.bulkObjectsWrite = function() {
                return bulk(config.localStorage.ROOMS_OBJECTS)
            }, exports.clearRoomIntents = function(a) {
                return localStorage.get(config.localStorage.ROOMS_INTENTS).then(function(b) {
                    return _.remove(b, {
                        room: a
                    }), localStorage.put(config.localStorage.ROOMS_INTENTS, b)
                })
            }, exports.mapById = function(a) {
                return _.reduce(a, function(a, b) {
                    return a[b._id.toString()] = b, a
                }, {})
            }, exports.notifyRoomsDone = function() {
                return mux.sendMessage({
                    type: "roomsDone"
                })
            }, exports.sendConsoleMessages = function(a, b) {
                self.postMessage({
                    type: "console",
                    userId: a,
                    messages: b
                })
            }, exports.sendConsoleError = function(a, b) {
                self.postMessage({
                    type: "console",
                    userId: a,
                    error: "" + b
                })
            }, exports.incrementGameTime = function() {
                return localStorage.get(config.localStorage.GAME_TIME).then(function(a) {
                    return a++, localStorage.put(config.localStorage.GAME_TIME, a)
                })
            }, exports.getGameInfo = function() {
                return localStorage.get(config.localStorage.GAME_INFO)
            }, exports.saveGameInfo = function(a, b) {
                return localStorage.get(config.localStorage.REPLAY).then(function(c) {
                    return c.log[a.score] = utils.getDiff(c.current, b), c.current = b, localStorage.put(config.localStorage.REPLAY, c)
                }).then(function() {
                        return localStorage.put(config.localStorage.GAME_INFO, a)
                    })
            }, exports.evalCode = function(module, Game, Memory, console, require, returnValue) {
                var window, self, process, exports = module.exports;
                try {
                    if (returnValue) return eval("(function __run_" + module.name + "(){ var __result = " + module.code + ";\n return __result; \n}).call(global);");
                    eval("(function __run_" + module.name + "(){ " + module.code + " \n}).call(global);")
                } catch (e) {
                    if (e instanceof EvalCodeError) throw e;
                    var message = "";
                    if (/at Object\.exports\.evalCode /.test(e.stack)) {
                        message = e.stack, message = message.replace(/at __run_([^ ]+) /g, "at $1 "), message = message.replace(/</g, "&lt;");
                        var strip = ["Object\\.eval", "Object\\.exports\\.evalCode", "Object\\.exports\\.runCode", "requireFn"];
                        strip.forEach(function(a) {
                            var b = new RegExp(" *at " + a + " [^\n]*?\n", "g");
                            message = message.replace(b, "")
                        }), message = message.replace(/ *at .*?$/, ""), message = message.replace(/ \([^\n]*\:(\d+)\:(\d+)\)\n/g, ":$1:$2\n"), message = message.replace(/_console\d+:\d+/g, "console")
                    } else message = e.message;
                    throw new EvalCodeError(message)
                }
            }, {}
        }()
    }, {
        "../utils": 79,
        "./bulk": 1,
        "./config": 2,
        "./local-storage": 4,
        "./message-mux": 5,
        "./queue": 8,
        "./workers": 10,
        lodash: 6,
        q: 7
    }],
    4: [function(a, b, c) {
        ! function() {
            "use strict";
            var b = (a("q"), a("./message-mux"));
            return c.put = function(a, c) {
                return b.sendMessage({
                    type: "localStorage",
                    put: {
                        key: a,
                        value: c
                    }
                }).then(function(a) {
                        return a.put.value
                    })
            }, c.get = function(a) {
                return b.sendMessage({
                    type: "localStorage",
                    get: {
                        key: a
                    }
                }).then(function(a) {
                        return a.get.value
                    })
            }, c.initArray = function(a, b) {
                return c.get(a).then(function(d) {
                    return d ? void 0 : c.put(a, b || [])
                })
            }, {}
        }()
    }, {
        "./message-mux": 5,
        q: 7
    }],
    5: [function(a, b, c) {
        ! function() {
            "use strict";
            var b = a("q"),
                d = {},
                e = 0;
            return c.sendMessage = function(a) {
                return e++, d[e] = b.defer(), a.transactionId = e, self.postMessage(a), d[e].promise
            }, c.handleMessage = function(a) {
                d[a.transactionId] && (a.reject ? d[a.transactionId].reject(a) : d[a.transactionId].resolve(a), delete d[a.transactionId])
            }, {}
        }()
    }, {
        q: 7
    }],
    6: [function(a, b, c) {
        (function(a) {
            (function() {
                function d(a, b, c) {
                    for (var d = (c || 0) - 1, e = a ? a.length : 0; ++d < e;)
                        if (a[d] === b) return d;
                    return -1
                }

                function e(a, b) {
                    var c = typeof b;
                    if (a = a.cache, "boolean" == c || null == b) return a[b] ? 0 : -1;
                    "number" != c && "string" != c && (c = "object");
                    var e = "number" == c ? b : u + b;
                    return a = (a = a[c]) && a[e], "object" == c ? a && d(a, b) > -1 ? 0 : -1 : a ? 0 : -1
                }

                function f(a) {
                    var b = this.cache,
                        c = typeof a;
                    if ("boolean" == c || null == a) b[a] = !0;
                    else {
                        "number" != c && "string" != c && (c = "object");
                        var d = "number" == c ? a : u + a,
                            e = b[c] || (b[c] = {});
                        "object" == c ? (e[d] || (e[d] = [])).push(a) : e[d] = !0
                    }
                }

                function g(a) {
                    return a.charCodeAt(0)
                }

                function h(a, b) {
                    for (var c = a.criteria, d = b.criteria, e = -1, f = c.length; ++e < f;) {
                        var g = c[e],
                            h = d[e];
                        if (g !== h) {
                            if (g > h || "undefined" == typeof g) return 1;
                            if (h > g || "undefined" == typeof h) return -1
                        }
                    }
                    return a.index - b.index
                }

                function i(a) {
                    var b = -1,
                        c = a.length,
                        d = a[0],
                        e = a[c / 2 | 0],
                        g = a[c - 1];
                    if (d && "object" == typeof d && e && "object" == typeof e && g && "object" == typeof g) return !1;
                    var h = l();
                    h["false"] = h["null"] = h["true"] = h.undefined = !1;
                    var i = l();
                    for (i.array = a, i.cache = h, i.push = f; ++b < c;) i.push(a[b]);
                    return i
                }

                function j(a) {
                    return "\\" + Y[a]
                }

                function k() {
                    return r.pop() || []
                }

                function l() {
                    return s.pop() || {
                        array: null,
                        cache: null,
                        criteria: null,
                        "false": !1,
                        index: 0,
                        "null": !1,
                        number: null,
                        object: null,
                        push: null,
                        string: null,
                        "true": !1,
                        undefined: !1,
                        value: null
                    }
                }

                function m(a) {
                    a.length = 0, r.length < w && r.push(a)
                }

                function n(a) {
                    var b = a.cache;
                    b && n(b), a.array = a.cache = a.criteria = a.object = a.number = a.string = a.value = null, s.length < w && s.push(a)
                }

                function o(a, b, c) {
                    b || (b = 0), "undefined" == typeof c && (c = a ? a.length : 0);
                    for (var d = -1, e = c - b || 0, f = Array(0 > e ? 0 : e); ++d < e;) f[d] = a[b + d];
                    return f
                }

                function p(a) {
                    function b(a) {
                        return a && "object" == typeof a && !Zd(a) && Hd.call(a, "__wrapped__") ? a : new c(a)
                    }

                    function c(a, b) {
                        this.__chain__ = !!b, this.__wrapped__ = a
                    }

                    function f(a) {
                        function b() {
                            if (d) {
                                var a = o(d);
                                Id.apply(a, arguments)
                            }
                            if (this instanceof b) {
                                var f = s(c.prototype),
                                    g = c.apply(f, a || arguments);
                                return Eb(g) ? g : f
                            }
                            return c.apply(e, a || arguments)
                        }
                        var c = a[0],
                            d = a[2],
                            e = a[4];
                        return Yd(b, a), b
                    }

                    function r(a, b, c, d, e) {
                        if (c) {
                            var f = c(a);
                            if ("undefined" != typeof f) return f
                        }
                        var g = Eb(a);
                        if (!g) return a;
                        var h = Ad.call(a);
                        if (!U[h]) return a;
                        var i = Wd[h];
                        switch (h) {
                            case N:
                            case O:
                                return new i(+a);
                            case Q:
                            case T:
                                return new i(a);
                            case S:
                                return f = i(a.source, C.exec(a)), f.lastIndex = a.lastIndex, f
                        }
                        var j = Zd(a);
                        if (b) {
                            var l = !d;
                            d || (d = k()), e || (e = k());
                            for (var n = d.length; n--;)
                                if (d[n] == a) return e[n];
                            f = j ? i(a.length) : {}
                        } else f = j ? o(a) : ee({}, a);
                        return j && (Hd.call(a, "index") && (f.index = a.index), Hd.call(a, "input") && (f.input = a.input)), b ? (d.push(a), e.push(f), (j ? Yb : he)(a, function(a, g) {
                            f[g] = r(a, b, c, d, e)
                        }), l && (m(d), m(e)), f) : f
                    }

                    function s(a) {
                        return Eb(a) ? Nd(a) : {}
                    }

                    function w(a, b, c) {
                        if ("function" != typeof a) return Zc;
                        if ("undefined" == typeof b || !("prototype" in a)) return a;
                        var d = a.__bindData__;
                        if ("undefined" == typeof d && (Xd.funcNames && (d = !a.name), d = d || !Xd.funcDecomp, !d)) {
                            var e = Fd.call(a);
                            Xd.funcNames || (d = !D.test(e)), d || (d = H.test(e), Yd(a, d))
                        }
                        if (d === !1 || d !== !0 && 1 & d[1]) return a;
                        switch (c) {
                            case 1:
                                return function(c) {
                                    return a.call(b, c)
                                };
                            case 2:
                                return function(c, d) {
                                    return a.call(b, c, d)
                                };
                            case 3:
                                return function(c, d, e) {
                                    return a.call(b, c, d, e)
                                };
                            case 4:
                                return function(c, d, e, f) {
                                    return a.call(b, c, d, e, f)
                                }
                        }
                        return Ic(a, b)
                    }

                    function Y(a) {
                        function b() {
                            var a = i ? g : this;
                            if (e) {
                                var n = o(e);
                                Id.apply(n, arguments)
                            }
                            if ((f || k) && (n || (n = o(arguments)), f && Id.apply(n, f), k && n.length < h)) return d |= 16, Y([c, l ? d : -4 & d, n, null, g, h]);
                            if (n || (n = arguments), j && (c = a[m]), this instanceof b) {
                                a = s(c.prototype);
                                var p = c.apply(a, n);
                                return Eb(p) ? p : a
                            }
                            return c.apply(a, n)
                        }
                        var c = a[0],
                            d = a[1],
                            e = a[2],
                            f = a[3],
                            g = a[4],
                            h = a[5],
                            i = 1 & d,
                            j = 2 & d,
                            k = 4 & d,
                            l = 8 & d,
                            m = c;
                        return Yd(b, a), b
                    }

                    function $(a, b) {
                        var c = -1,
                            f = ib(),
                            g = a ? a.length : 0,
                            h = g >= v && f === d,
                            j = [];
                        if (h) {
                            var k = i(b);
                            k ? (f = e, b = k) : h = !1
                        }
                        for (; ++c < g;) {
                            var l = a[c];
                            f(b, l) < 0 && j.push(l)
                        }
                        return h && n(b), j
                    }

                    function _(a, b, c, d) {
                        for (var e = (d || 0) - 1, f = a ? a.length : 0, g = []; ++e < f;) {
                            var h = a[e];
                            if (h && "object" == typeof h && "number" == typeof h.length && (Zd(h) || mb(h))) {
                                b || (h = _(h, b, c));
                                var i = -1,
                                    j = h.length,
                                    k = g.length;
                                for (g.length += j; ++i < j;) g[k++] = h[i]
                            } else c || g.push(h)
                        }
                        return g
                    }

                    function ab(a, b, c, d, e, f) {
                        if (c) {
                            var g = c(a, b);
                            if ("undefined" != typeof g) return !!g
                        }
                        if (a === b) return 0 !== a || 1 / a == 1 / b;
                        var h = typeof a,
                            i = typeof b;
                        if (!(a !== a || a && X[h] || b && X[i])) return !1;
                        if (null == a || null == b) return a === b;
                        var j = Ad.call(a),
                            l = Ad.call(b);
                        if (j == L && (j = R), l == L && (l = R), j != l) return !1;
                        switch (j) {
                            case N:
                            case O:
                                return +a == +b;
                            case Q:
                                return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
                            case S:
                            case T:
                                return a == vd(b)
                        }
                        var n = j == M;
                        if (!n) {
                            var o = Hd.call(a, "__wrapped__"),
                                p = Hd.call(b, "__wrapped__");
                            if (o || p) return ab(o ? a.__wrapped__ : a, p ? b.__wrapped__ : b, c, d, e, f);
                            if (j != R) return !1;
                            var q = a.constructor,
                                r = b.constructor;
                            if (q != r && !(Db(q) && q instanceof q && Db(r) && r instanceof r) && "constructor" in a && "constructor" in b) return !1
                        }
                        var s = !e;
                        e || (e = k()), f || (f = k());
                        for (var t = e.length; t--;)
                            if (e[t] == a) return f[t] == b;
                        var u = 0;
                        if (g = !0, e.push(a), f.push(b), n) {
                            if (t = a.length, u = b.length, g = u == t, g || d)
                                for (; u--;) {
                                    var v = t,
                                        w = b[u];
                                    if (d)
                                        for (; v-- && !(g = ab(a[v], w, c, d, e, f)););
                                    else if (!(g = ab(a[u], w, c, d, e, f))) break
                                }
                        } else ge(b, function(b, h, i) {
                            return Hd.call(i, h) ? (u++, g = Hd.call(a, h) && ab(a[h], b, c, d, e, f)) : void 0
                        }), g && !d && ge(a, function(a, b, c) {
                            return Hd.call(c, b) ? g = --u > -1 : void 0
                        });
                        return e.pop(), f.pop(), s && (m(e), m(f)), g
                    }

                    function bb(a, b, c, d, e) {
                        (Zd(b) ? Yb : he)(b, function(b, f) {
                            var g, h, i = b,
                                j = a[f];
                            if (b && ((h = Zd(b)) || ie(b))) {
                                for (var k = d.length; k--;)
                                    if (g = d[k] == b) {
                                        j = e[k];
                                        break
                                    }
                                if (!g) {
                                    var l;
                                    c && (i = c(j, b), (l = "undefined" != typeof i) && (j = i)), l || (j = h ? Zd(j) ? j : [] : ie(j) ? j : {}), d.push(b), e.push(j), l || bb(j, b, c, d, e)
                                }
                            } else c && (i = c(j, b), "undefined" == typeof i && (i = b)), "undefined" != typeof i && (j = i);
                            a[f] = j
                        })
                    }

                    function db(a, b) {
                        return a + Ed(Vd() * (b - a + 1))
                    }

                    function eb(a, b, c) {
                        var f = -1,
                            g = ib(),
                            h = a ? a.length : 0,
                            j = [],
                            l = !b && h >= v && g === d,
                            o = c || l ? k() : j;
                        if (l) {
                            var p = i(o);
                            g = e, o = p
                        }
                        for (; ++f < h;) {
                            var q = a[f],
                                r = c ? c(q, f, a) : q;
                            (b ? !f || o[o.length - 1] !== r : g(o, r) < 0) && ((c || l) && o.push(r), j.push(q))
                        }
                        return l ? (m(o.array), n(o)) : c && m(o), j
                    }

                    function fb(a) {
                        return function(c, d, e) {
                            var f = {};
                            d = b.createCallback(d, e, 3);
                            var g = -1,
                                h = c ? c.length : 0;
                            if ("number" == typeof h)
                                for (; ++g < h;) {
                                    var i = c[g];
                                    a(f, i, d(i, g, c), c)
                                } else he(c, function(b, c, e) {
                                a(f, b, d(b, c, e), e)
                            });
                            return f
                        }
                    }

                    function gb(a, b, c, d, e, g) {
                        var h = 1 & b,
                            i = 2 & b,
                            j = 4 & b,
                            k = 16 & b,
                            l = 32 & b;
                        if (!i && !Db(a)) throw new wd;
                        k && !c.length && (b &= -17, k = c = !1), l && !d.length && (b &= -33, l = d = !1);
                        var m = a && a.__bindData__;
                        if (m && m !== !0) return m = o(m), m[2] && (m[2] = o(m[2])), m[3] && (m[3] = o(m[3])), !h || 1 & m[1] || (m[4] = e), !h && 1 & m[1] && (b |= 8), !j || 4 & m[1] || (m[5] = g), k && Id.apply(m[2] || (m[2] = []), c), l && Ld.apply(m[3] || (m[3] = []), d), m[1] |= b, gb.apply(null, m);
                        var n = 1 == b || 17 === b ? f : Y;
                        return n([a, b, c, d, e, g])
                    }

                    function hb(a) {
                        return ae[a]
                    }

                    function ib() {
                        var a = (a = b.indexOf) === rc ? d : a;
                        return a
                    }

                    function jb(a) {
                        return "function" == typeof a && Bd.test(a)
                    }

                    function kb(a) {
                        var b, c;
                        return a && Ad.call(a) == R && (b = a.constructor, !Db(b) || b instanceof b) ? (ge(a, function(a, b) {
                            c = b
                        }), "undefined" == typeof c || Hd.call(a, c)) : !1
                    }

                    function lb(a) {
                        return be[a]
                    }

                    function mb(a) {
                        return a && "object" == typeof a && "number" == typeof a.length && Ad.call(a) == L || !1
                    }

                    function nb(a, b, c, d) {
                        return "boolean" != typeof b && null != b && (d = c, c = b, b = !1), r(a, b, "function" == typeof c && w(c, d, 1))
                    }

                    function ob(a, b, c) {
                        return r(a, !0, "function" == typeof b && w(b, c, 1))
                    }

                    function pb(a, b) {
                        var c = s(a);
                        return b ? ee(c, b) : c
                    }

                    function qb(a, c, d) {
                        var e;
                        return c = b.createCallback(c, d, 3), he(a, function(a, b, d) {
                            return c(a, b, d) ? (e = b, !1) : void 0
                        }), e
                    }

                    function rb(a, c, d) {
                        var e;
                        return c = b.createCallback(c, d, 3), tb(a, function(a, b, d) {
                            return c(a, b, d) ? (e = b, !1) : void 0
                        }), e
                    }

                    function sb(a, b, c) {
                        var d = [];
                        ge(a, function(a, b) {
                            d.push(b, a)
                        });
                        var e = d.length;
                        for (b = w(b, c, 3); e-- && b(d[e--], d[e], a) !== !1;);
                        return a
                    }

                    function tb(a, b, c) {
                        var d = _d(a),
                            e = d.length;
                        for (b = w(b, c, 3); e--;) {
                            var f = d[e];
                            if (b(a[f], f, a) === !1) break
                        }
                        return a
                    }

                    function ub(a) {
                        var b = [];
                        return ge(a, function(a, c) {
                            Db(a) && b.push(c)
                        }), b.sort()
                    }

                    function vb(a, b) {
                        return a ? Hd.call(a, b) : !1
                    }

                    function wb(a) {
                        for (var b = -1, c = _d(a), d = c.length, e = {}; ++b < d;) {
                            var f = c[b];
                            e[a[f]] = f
                        }
                        return e
                    }

                    function xb(a) {
                        return a === !0 || a === !1 || a && "object" == typeof a && Ad.call(a) == N || !1
                    }

                    function yb(a) {
                        return a && "object" == typeof a && Ad.call(a) == O || !1
                    }

                    function zb(a) {
                        return a && 1 === a.nodeType || !1
                    }

                    function Ab(a) {
                        var b = !0;
                        if (!a) return b;
                        var c = Ad.call(a),
                            d = a.length;
                        return c == M || c == T || c == L || c == R && "number" == typeof d && Db(a.splice) ? !d : (he(a, function() {
                            return b = !1
                        }), b)
                    }

                    function Bb(a, b, c, d) {
                        return ab(a, b, "function" == typeof c && w(c, d, 2))
                    }

                    function Cb(a) {
                        return Pd(a) && !Qd(parseFloat(a))
                    }

                    function Db(a) {
                        return "function" == typeof a
                    }

                    function Eb(a) {
                        return !(!a || !X[typeof a])
                    }

                    function Fb(a) {
                        return Hb(a) && a != +a
                    }

                    function Gb(a) {
                        return null === a
                    }

                    function Hb(a) {
                        return "number" == typeof a || a && "object" == typeof a && Ad.call(a) == Q || !1
                    }

                    function Ib(a) {
                        return a && "object" == typeof a && Ad.call(a) == S || !1
                    }

                    function Jb(a) {
                        return "string" == typeof a || a && "object" == typeof a && Ad.call(a) == T || !1
                    }

                    function Kb(a) {
                        return "undefined" == typeof a
                    }

                    function Lb(a, c, d) {
                        var e = {};
                        return c = b.createCallback(c, d, 3), he(a, function(a, b, d) {
                            e[b] = c(a, b, d)
                        }), e
                    }

                    function Mb(a) {
                        var b = arguments,
                            c = 2;
                        if (!Eb(a)) return a;
                        if ("number" != typeof b[2] && (c = b.length), c > 3 && "function" == typeof b[c - 2]) var d = w(b[--c - 1], b[c--], 2);
                        else c > 2 && "function" == typeof b[c - 1] && (d = b[--c]);
                        for (var e = o(arguments, 1, c), f = -1, g = k(), h = k(); ++f < c;) bb(a, e[f], d, g, h);
                        return m(g), m(h), a
                    }

                    function Nb(a, c, d) {
                        var e = {};
                        if ("function" != typeof c) {
                            var f = [];
                            ge(a, function(a, b) {
                                f.push(b)
                            }), f = $(f, _(arguments, !0, !1, 1));
                            for (var g = -1, h = f.length; ++g < h;) {
                                var i = f[g];
                                e[i] = a[i]
                            }
                        } else c = b.createCallback(c, d, 3), ge(a, function(a, b, d) {
                            c(a, b, d) || (e[b] = a)
                        });
                        return e
                    }

                    function Ob(a) {
                        for (var b = -1, c = _d(a), d = c.length, e = nd(d); ++b < d;) {
                            var f = c[b];
                            e[b] = [f, a[f]]
                        }
                        return e
                    }

                    function Pb(a, c, d) {
                        var e = {};
                        if ("function" != typeof c)
                            for (var f = -1, g = _(arguments, !0, !1, 1), h = Eb(a) ? g.length : 0; ++f < h;) {
                                var i = g[f];
                                i in a && (e[i] = a[i])
                            } else c = b.createCallback(c, d, 3), ge(a, function(a, b, d) {
                            c(a, b, d) && (e[b] = a)
                        });
                        return e
                    }

                    function Qb(a, c, d, e) {
                        var f = Zd(a);
                        if (null == d)
                            if (f) d = [];
                            else {
                                var g = a && a.constructor,
                                    h = g && g.prototype;
                                d = s(h)
                            }
                        return c && (c = b.createCallback(c, e, 4), (f ? Yb : he)(a, function(a, b, e) {
                            return c(d, a, b, e)
                        })), d
                    }

                    function Rb(a) {
                        for (var b = -1, c = _d(a), d = c.length, e = nd(d); ++b < d;) e[b] = a[c[b]];
                        return e
                    }

                    function Sb(a) {
                        for (var b = arguments, c = -1, d = _(b, !0, !1, 1), e = b[2] && b[2][b[1]] === a ? 1 : d.length, f = nd(e); ++c < e;) f[c] = a[d[c]];
                        return f
                    }

                    function Tb(a, b, c) {
                        var d = -1,
                            e = ib(),
                            f = a ? a.length : 0,
                            g = !1;
                        return c = (0 > c ? Sd(0, f + c) : c) || 0, Zd(a) ? g = e(a, b, c) > -1 : "number" == typeof f ? g = (Jb(a) ? a.indexOf(b, c) : e(a, b, c)) > -1 : he(a, function(a) {
                            return ++d >= c ? !(g = a === b) : void 0
                        }), g
                    }

                    function Ub(a, c, d) {
                        var e = !0;
                        c = b.createCallback(c, d, 3);
                        var f = -1,
                            g = a ? a.length : 0;
                        if ("number" == typeof g)
                            for (; ++f < g && (e = !!c(a[f], f, a)););
                        else he(a, function(a, b, d) {
                            return e = !!c(a, b, d)
                        });
                        return e
                    }

                    function Vb(a, c, d) {
                        var e = [];
                        c = b.createCallback(c, d, 3);
                        var f = -1,
                            g = a ? a.length : 0;
                        if ("number" == typeof g)
                            for (; ++f < g;) {
                                var h = a[f];
                                c(h, f, a) && e.push(h)
                            } else he(a, function(a, b, d) {
                            c(a, b, d) && e.push(a)
                        });
                        return e
                    }

                    function Wb(a, c, d) {
                        c = b.createCallback(c, d, 3);
                        var e = -1,
                            f = a ? a.length : 0;
                        if ("number" != typeof f) {
                            var g;
                            return he(a, function(a, b, d) {
                                return c(a, b, d) ? (g = a, !1) : void 0
                            }), g
                        }
                        for (; ++e < f;) {
                            var h = a[e];
                            if (c(h, e, a)) return h
                        }
                    }

                    function Xb(a, c, d) {
                        var e;
                        return c = b.createCallback(c, d, 3), Zb(a, function(a, b, d) {
                            return c(a, b, d) ? (e = a, !1) : void 0
                        }), e
                    }

                    function Yb(a, b, c) {
                        var d = -1,
                            e = a ? a.length : 0;
                        if (b = b && "undefined" == typeof c ? b : w(b, c, 3), "number" == typeof e)
                            for (; ++d < e && b(a[d], d, a) !== !1;);
                        else he(a, b);
                        return a
                    }

                    function Zb(a, b, c) {
                        var d = a ? a.length : 0;
                        if (b = b && "undefined" == typeof c ? b : w(b, c, 3), "number" == typeof d)
                            for (; d-- && b(a[d], d, a) !== !1;);
                        else {
                            var e = _d(a);
                            d = e.length, he(a, function(a, c, f) {
                                return c = e ? e[--d] : --d, b(f[c], c, f)
                            })
                        }
                        return a
                    }

                    function $b(a, b) {
                        var c = o(arguments, 2),
                            d = -1,
                            e = "function" == typeof b,
                            f = a ? a.length : 0,
                            g = nd("number" == typeof f ? f : 0);
                        return Yb(a, function(a) {
                            g[++d] = (e ? b : a[b]).apply(a, c)
                        }), g
                    }

                    function _b(a, c, d) {
                        var e = -1,
                            f = a ? a.length : 0;
                        if (c = b.createCallback(c, d, 3), "number" == typeof f)
                            for (var g = nd(f); ++e < f;) g[e] = c(a[e], e, a);
                        else g = [], he(a, function(a, b, d) {
                            g[++e] = c(a, b, d)
                        });
                        return g
                    }

                    function ac(a, c, d) {
                        var e = -1 / 0,
                            f = e;
                        if ("function" != typeof c && d && d[c] === a && (c = null), null == c && Zd(a))
                            for (var h = -1, i = a.length; ++h < i;) {
                                var j = a[h];
                                j > f && (f = j)
                            } else c = null == c && Jb(a) ? g : b.createCallback(c, d, 3), Yb(a, function(a, b, d) {
                            var g = c(a, b, d);
                            g > e && (e = g, f = a)
                        });
                        return f
                    }

                    function bc(a, c, d) {
                        var e = 1 / 0,
                            f = e;
                        if ("function" != typeof c && d && d[c] === a && (c = null), null == c && Zd(a))
                            for (var h = -1, i = a.length; ++h < i;) {
                                var j = a[h];
                                f > j && (f = j)
                            } else c = null == c && Jb(a) ? g : b.createCallback(c, d, 3), Yb(a, function(a, b, d) {
                            var g = c(a, b, d);
                            e > g && (e = g, f = a)
                        });
                        return f
                    }

                    function cc(a, c, d, e) {
                        if (!a) return d;
                        var f = arguments.length < 3;
                        c = b.createCallback(c, e, 4);
                        var g = -1,
                            h = a.length;
                        if ("number" == typeof h)
                            for (f && (d = a[++g]); ++g < h;) d = c(d, a[g], g, a);
                        else he(a, function(a, b, e) {
                            d = f ? (f = !1, a) : c(d, a, b, e)
                        });
                        return d
                    }

                    function dc(a, c, d, e) {
                        var f = arguments.length < 3;
                        return c = b.createCallback(c, e, 4), Zb(a, function(a, b, e) {
                            d = f ? (f = !1, a) : c(d, a, b, e)
                        }), d
                    }

                    function ec(a, c, d) {
                        return c = b.createCallback(c, d, 3), Vb(a, function(a, b, d) {
                            return !c(a, b, d)
                        })
                    }

                    function fc(a, b, c) {
                        if (a && "number" != typeof a.length && (a = Rb(a)), null == b || c) return a ? a[db(0, a.length - 1)] : q;
                        var d = gc(a);
                        return d.length = Td(Sd(0, b), d.length), d
                    }

                    function gc(a) {
                        var b = -1,
                            c = a ? a.length : 0,
                            d = nd("number" == typeof c ? c : 0);
                        return Yb(a, function(a) {
                            var c = db(0, ++b);
                            d[b] = d[c], d[c] = a
                        }), d
                    }

                    function hc(a) {
                        var b = a ? a.length : 0;
                        return "number" == typeof b ? b : _d(a).length
                    }

                    function ic(a, c, d) {
                        var e;
                        c = b.createCallback(c, d, 3);
                        var f = -1,
                            g = a ? a.length : 0;
                        if ("number" == typeof g)
                            for (; ++f < g && !(e = c(a[f], f, a)););
                        else he(a, function(a, b, d) {
                            return !(e = c(a, b, d))
                        });
                        return !!e
                    }

                    function jc(a, c, d) {
                        var e = -1,
                            f = Zd(c),
                            g = a ? a.length : 0,
                            i = nd("number" == typeof g ? g : 0);
                        for (f || (c = b.createCallback(c, d, 3)), Yb(a, function(a, b, d) {
                            var g = i[++e] = l();
                            f ? g.criteria = _b(c, function(b) {
                                return a[b]
                            }) : (g.criteria = k())[0] = c(a, b, d), g.index = e, g.value = a
                        }), g = i.length, i.sort(h); g--;) {
                            var j = i[g];
                            i[g] = j.value, f || m(j.criteria), n(j)
                        }
                        return i
                    }

                    function kc(a) {
                        return a && "number" == typeof a.length ? o(a) : Rb(a)
                    }

                    function lc(a) {
                        for (var b = -1, c = a ? a.length : 0, d = []; ++b < c;) {
                            var e = a[b];
                            e && d.push(e)
                        }
                        return d
                    }

                    function mc(a) {
                        return $(a, _(arguments, !0, !0, 1))
                    }

                    function nc(a, c, d) {
                        var e = -1,
                            f = a ? a.length : 0;
                        for (c = b.createCallback(c, d, 3); ++e < f;)
                            if (c(a[e], e, a)) return e;
                        return -1
                    }

                    function oc(a, c, d) {
                        var e = a ? a.length : 0;
                        for (c = b.createCallback(c, d, 3); e--;)
                            if (c(a[e], e, a)) return e;
                        return -1
                    }

                    function pc(a, c, d) {
                        var e = 0,
                            f = a ? a.length : 0;
                        if ("number" != typeof c && null != c) {
                            var g = -1;
                            for (c = b.createCallback(c, d, 3); ++g < f && c(a[g], g, a);) e++
                        } else if (e = c, null == e || d) return a ? a[0] : q;
                        return o(a, 0, Td(Sd(0, e), f))
                    }

                    function qc(a, b, c, d) {
                        return "boolean" != typeof b && null != b && (d = c, c = "function" != typeof b && d && d[b] === a ? null : b, b = !1), null != c && (a = _b(a, c, d)), _(a, b)
                    }

                    function rc(a, b, c) {
                        if ("number" == typeof c) {
                            var e = a ? a.length : 0;
                            c = 0 > c ? Sd(0, e + c) : c || 0
                        } else if (c) {
                            var f = Ac(a, b);
                            return a[f] === b ? f : -1
                        }
                        return d(a, b, c)
                    }

                    function sc(a, c, d) {
                        var e = 0,
                            f = a ? a.length : 0;
                        if ("number" != typeof c && null != c) {
                            var g = f;
                            for (c = b.createCallback(c, d, 3); g-- && c(a[g], g, a);) e++
                        } else e = null == c || d ? 1 : c || e;
                        return o(a, 0, Td(Sd(0, f - e), f))
                    }

                    function tc() {
                        for (var a = [], b = -1, c = arguments.length, f = k(), g = ib(), h = g === d, j = k(); ++b < c;) {
                            var l = arguments[b];
                            (Zd(l) || mb(l)) && (a.push(l), f.push(h && l.length >= v && i(b ? a[b] : j)))
                        }
                        var o = a[0],
                            p = -1,
                            q = o ? o.length : 0,
                            r = [];
                        a: for (; ++p < q;) {
                            var s = f[0];
                            if (l = o[p], (s ? e(s, l) : g(j, l)) < 0) {
                                for (b = c, (s || j).push(l); --b;)
                                    if (s = f[b], (s ? e(s, l) : g(a[b], l)) < 0) continue a;
                                r.push(l)
                            }
                        }
                        for (; c--;) s = f[c], s && n(s);
                        return m(f), m(j), r
                    }

                    function uc(a, c, d) {
                        var e = 0,
                            f = a ? a.length : 0;
                        if ("number" != typeof c && null != c) {
                            var g = f;
                            for (c = b.createCallback(c, d, 3); g-- && c(a[g], g, a);) e++
                        } else if (e = c, null == e || d) return a ? a[f - 1] : q;
                        return o(a, Sd(0, f - e))
                    }

                    function vc(a, b, c) {
                        var d = a ? a.length : 0;
                        for ("number" == typeof c && (d = (0 > c ? Sd(0, d + c) : Td(c, d - 1)) + 1); d--;)
                            if (a[d] === b) return d;
                        return -1
                    }

                    function wc(a) {
                        for (var b = arguments, c = 0, d = b.length, e = a ? a.length : 0; ++c < d;)
                            for (var f = -1, g = b[c]; ++f < e;) a[f] === g && (Kd.call(a, f--, 1), e--);
                        return a
                    }

                    function xc(a, b, c) {
                        a = +a || 0, c = "number" == typeof c ? c : +c || 1, null == b && (b = a, a = 0);
                        for (var d = -1, e = Sd(0, Cd((b - a) / (c || 1))), f = nd(e); ++d < e;) f[d] = a, a += c;
                        return f
                    }

                    function yc(a, c, d) {
                        var e = -1,
                            f = a ? a.length : 0,
                            g = [];
                        for (c = b.createCallback(c, d, 3); ++e < f;) {
                            var h = a[e];
                            c(h, e, a) && (g.push(h), Kd.call(a, e--, 1), f--)
                        }
                        return g
                    }

                    function zc(a, c, d) {
                        if ("number" != typeof c && null != c) {
                            var e = 0,
                                f = -1,
                                g = a ? a.length : 0;
                            for (c = b.createCallback(c, d, 3); ++f < g && c(a[f], f, a);) e++
                        } else e = null == c || d ? 1 : Sd(0, c);
                        return o(a, e)
                    }

                    function Ac(a, c, d, e) {
                        var f = 0,
                            g = a ? a.length : f;
                        for (d = d ? b.createCallback(d, e, 1) : Zc, c = d(c); g > f;) {
                            var h = f + g >>> 1;
                            d(a[h]) < c ? f = h + 1 : g = h
                        }
                        return f
                    }

                    function Bc() {
                        return eb(_(arguments, !0, !0))
                    }

                    function Cc(a, c, d, e) {
                        return "boolean" != typeof c && null != c && (e = d, d = "function" != typeof c && e && e[c] === a ? null : c, c = !1), null != d && (d = b.createCallback(d, e, 3)), eb(a, c, d)
                    }

                    function Dc(a) {
                        return $(a, o(arguments, 1))
                    }

                    function Ec() {
                        for (var a = -1, b = arguments.length; ++a < b;) {
                            var c = arguments[a];
                            if (Zd(c) || mb(c)) var d = d ? eb($(d, c).concat($(c, d))) : c
                        }
                        return d || []
                    }

                    function Fc() {
                        for (var a = arguments.length > 1 ? arguments : arguments[0], b = -1, c = a ? ac(me(a, "length")) : 0, d = nd(0 > c ? 0 : c); ++b < c;) d[b] = me(a, b);
                        return d
                    }

                    function Gc(a, b) {
                        var c = -1,
                            d = a ? a.length : 0,
                            e = {};
                        for (b || !d || Zd(a[0]) || (b = []); ++c < d;) {
                            var f = a[c];
                            b ? e[f] = b[c] : f && (e[f[0]] = f[1])
                        }
                        return e
                    }

                    function Hc(a, b) {
                        if (!Db(b)) throw new wd;
                        return function() {
                            return --a < 1 ? b.apply(this, arguments) : void 0
                        }
                    }

                    function Ic(a, b) {
                        return arguments.length > 2 ? gb(a, 17, o(arguments, 2), null, b) : gb(a, 1, null, null, b)
                    }

                    function Jc(a) {
                        for (var b = arguments.length > 1 ? _(arguments, !0, !1, 1) : ub(a), c = -1, d = b.length; ++c < d;) {
                            var e = b[c];
                            a[e] = gb(a[e], 1, null, null, a)
                        }
                        return a
                    }

                    function Kc(a, b) {
                        return arguments.length > 2 ? gb(b, 19, o(arguments, 2), null, a) : gb(b, 3, null, null, a)
                    }

                    function Lc() {
                        for (var a = arguments, b = a.length; b--;)
                            if (!Db(a[b])) throw new wd;
                        return function() {
                            for (var b = arguments, c = a.length; c--;) b = [a[c].apply(this, b)];
                            return b[0]
                        }
                    }

                    function Mc(a, b) {
                        return b = "number" == typeof b ? b : +b || a.length, gb(a, 4, null, null, null, b)
                    }

                    function Nc(a, b, c) {
                        var d, e, f, g, h, i, j, k = 0,
                            l = !1,
                            m = !0;
                        if (!Db(a)) throw new wd;
                        if (b = Sd(0, b) || 0, c === !0) {
                            var n = !0;
                            m = !1
                        } else Eb(c) && (n = c.leading, l = "maxWait" in c && (Sd(b, c.maxWait) || 0), m = "trailing" in c ? c.trailing : m);
                        var o = function() {
                                var c = b - (oe() - g);
                                if (0 >= c) {
                                    e && Dd(e);
                                    var l = j;
                                    e = i = j = q, l && (k = oe(), f = a.apply(h, d), i || e || (d = h = null))
                                } else i = Jd(o, c)
                            },
                            p = function() {
                                i && Dd(i), e = i = j = q, (m || l !== b) && (k = oe(), f = a.apply(h, d), i || e || (d = h = null))
                            };
                        return function() {
                            if (d = arguments, g = oe(), h = this, j = m && (i || !n), l === !1) var c = n && !i;
                            else {
                                e || n || (k = g);
                                var q = l - (g - k),
                                    r = 0 >= q;
                                r ? (e && (e = Dd(e)), k = g, f = a.apply(h, d)) : e || (e = Jd(p, q))
                            }
                            return r && i ? i = Dd(i) : i || b === l || (i = Jd(o, b)), c && (r = !0, f = a.apply(h, d)), !r || i || e || (d = h = null), f
                        }
                    }

                    function Oc(a) {
                        if (!Db(a)) throw new wd;
                        var b = o(arguments, 1);
                        return Jd(function() {
                            a.apply(q, b)
                        }, 1)
                    }

                    function Pc(a, b) {
                        if (!Db(a)) throw new wd;
                        var c = o(arguments, 2);
                        return Jd(function() {
                            a.apply(q, c)
                        }, b)
                    }

                    function Qc(a, b) {
                        if (!Db(a)) throw new wd;
                        var c = function() {
                            var d = c.cache,
                                e = b ? b.apply(this, arguments) : u + arguments[0];
                            return Hd.call(d, e) ? d[e] : d[e] = a.apply(this, arguments)
                        };
                        return c.cache = {}, c
                    }

                    function Rc(a) {
                        var b, c;
                        if (!Db(a)) throw new wd;
                        return function() {
                            return b ? c : (b = !0, c = a.apply(this, arguments), a = null, c)
                        }
                    }

                    function Sc(a) {
                        return gb(a, 16, o(arguments, 1))
                    }

                    function Tc(a) {
                        return gb(a, 32, null, o(arguments, 1))
                    }

                    function Uc(a, b, c) {
                        var d = !0,
                            e = !0;
                        if (!Db(a)) throw new wd;
                        return c === !1 ? d = !1 : Eb(c) && (d = "leading" in c ? c.leading : d, e = "trailing" in c ? c.trailing : e), V.leading = d, V.maxWait = b, V.trailing = e, Nc(a, b, V)
                    }

                    function Vc(a, b) {
                        return gb(b, 16, [a])
                    }

                    function Wc(a) {
                        return function() {
                            return a
                        }
                    }

                    function Xc(a, b, c) {
                        var d = typeof a;
                        if (null == a || "function" == d) return w(a, b, c);
                        if ("object" != d) return bd(a);
                        var e = _d(a),
                            f = e[0],
                            g = a[f];
                        return 1 != e.length || g !== g || Eb(g) ? function(b) {
                            for (var c = e.length, d = !1; c-- && (d = ab(b[e[c]], a[e[c]], null, !0)););
                            return d
                        } : function(a) {
                            var b = a[f];
                            return g === b && (0 !== g || 1 / g == 1 / b)
                        }
                    }

                    function Yc(a) {
                        return null == a ? "" : vd(a).replace(de, hb)
                    }

                    function Zc(a) {
                        return a
                    }

                    function $c(a, d, e) {
                        var f = !0,
                            g = d && ub(d);
                        d && (e || g.length) || (null == e && (e = d), h = c, d = a, a = b, g = ub(d)), e === !1 ? f = !1 : Eb(e) && "chain" in e && (f = e.chain);
                        var h = a,
                            i = Db(h);
                        Yb(g, function(b) {
                            var c = a[b] = d[b];
                            i && (h.prototype[b] = function() {
                                var b = this.__chain__,
                                    d = this.__wrapped__,
                                    e = [d];
                                Id.apply(e, arguments);
                                var g = c.apply(a, e);
                                if (f || b) {
                                    if (d === g && Eb(g)) return this;
                                    g = new h(g), g.__chain__ = b
                                }
                                return g
                            })
                        })
                    }

                    function _c() {
                        return a._ = zd, this
                    }

                    function ad() {}

                    function bd(a) {
                        return function(b) {
                            return b[a]
                        }
                    }

                    function cd(a, b, c) {
                        var d = null == a,
                            e = null == b;
                        if (null == c && ("boolean" == typeof a && e ? (c = a, a = 1) : e || "boolean" != typeof b || (c = b, e = !0)), d && e && (b = 1), a = +a || 0, e ? (b = a, a = 0) : b = +b || 0, c || a % 1 || b % 1) {
                            var f = Vd();
                            return Td(a + f * (b - a + parseFloat("1e-" + ((f + "").length - 1))), b)
                        }
                        return db(a, b)
                    }

                    function dd(a, b) {
                        if (a) {
                            var c = a[b];
                            return Db(c) ? a[b]() : c
                        }
                    }

                    function ed(a, c, d) {
                        var e = b.templateSettings;
                        a = vd(a || ""), d = fe({}, d, e);
                        var f, g = fe({}, d.imports, e.imports),
                            h = _d(g),
                            i = Rb(g),
                            k = 0,
                            l = d.interpolate || G,
                            m = "__p += '",
                            n = ud((d.escape || G).source + "|" + l.source + "|" + (l === E ? B : G).source + "|" + (d.evaluate || G).source + "|$", "g");
                        a.replace(n, function(b, c, d, e, g, h) {
                            return d || (d = e), m += a.slice(k, h).replace(I, j), c && (m += "' +\n__e(" + c + ") +\n'"), g && (f = !0, m += "';\n" + g + ";\n__p += '"), d && (m += "' +\n((__t = (" + d + ")) == null ? '' : __t) +\n'"), k = h + b.length, b
                        }), m += "';\n";
                        var o = d.variable,
                            p = o;
                        p || (o = "obj", m = "with (" + o + ") {\n" + m + "\n}\n"), m = (f ? m.replace(y, "") : m).replace(z, "$1").replace(A, "$1;"), m = "function(" + o + ") {\n" + (p ? "" : o + " || (" + o + " = {});\n") + "var __t, __p = '', __e = _.escape" + (f ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + m + "return __p\n}";
                        var r = "\n";
                        try {
                            var s = qd(h, "return " + m + r).apply(q, i)
                        } catch (t) {
                            throw t.source = m, t
                        }
                        return c ? s(c) : (s.source = m, s)
                    }

                    function fd(a, b, c) {
                        a = (a = +a) > -1 ? a : 0;
                        var d = -1,
                            e = nd(a);
                        for (b = w(b, c, 1); ++d < a;) e[d] = b(d);
                        return e
                    }

                    function gd(a) {
                        return null == a ? "" : vd(a).replace(ce, lb)
                    }

                    function hd(a) {
                        var b = ++t;
                        return vd(null == a ? "" : a) + b
                    }

                    function id(a) {
                        return a = new c(a), a.__chain__ = !0, a
                    }

                    function jd(a, b) {
                        return b(a), a
                    }

                    function kd() {
                        return this.__chain__ = !0, this
                    }

                    function ld() {
                        return vd(this.__wrapped__)
                    }

                    function md() {
                        return this.__wrapped__
                    }
                    a = a ? cb.defaults(Z.Object(), a, cb.pick(Z, J)) : Z;
                    var nd = a.Array,
                        od = a.Boolean,
                        pd = a.Date,
                        qd = a.Function,
                        rd = a.Math,
                        sd = a.Number,
                        td = a.Object,
                        ud = a.RegExp,
                        vd = a.String,
                        wd = a.TypeError,
                        xd = [],
                        yd = td.prototype,
                        zd = a._,
                        Ad = yd.toString,
                        Bd = ud("^" + vd(Ad).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/toString| for [^\]]+/g, ".*?") + "$"),
                        Cd = rd.ceil,
                        Dd = a.clearTimeout,
                        Ed = rd.floor,
                        Fd = qd.prototype.toString,
                        Gd = jb(Gd = td.getPrototypeOf) && Gd,
                        Hd = yd.hasOwnProperty,
                        Id = xd.push,
                        Jd = a.setTimeout,
                        Kd = xd.splice,
                        Ld = xd.unshift,
                        Md = function() {
                            try {
                                var a = {},
                                    b = jb(b = td.defineProperty) && b,
                                    c = b(a, a, a) && b
                            } catch (d) {}
                            return c
                        }(),
                        Nd = jb(Nd = td.create) && Nd,
                        Od = jb(Od = nd.isArray) && Od,
                        Pd = a.isFinite,
                        Qd = a.isNaN,
                        Rd = jb(Rd = td.keys) && Rd,
                        Sd = rd.max,
                        Td = rd.min,
                        Ud = a.parseInt,
                        Vd = rd.random,
                        Wd = {};
                    Wd[M] = nd, Wd[N] = od, Wd[O] = pd, Wd[P] = qd, Wd[R] = td, Wd[Q] = sd, Wd[S] = ud, Wd[T] = vd, c.prototype = b.prototype;
                    var Xd = b.support = {};
                    Xd.funcDecomp = !jb(a.WinRTError) && H.test(p), Xd.funcNames = "string" == typeof qd.name, b.templateSettings = {
                        escape: /<%-([\s\S]+?)%>/g,
                        evaluate: /<%([\s\S]+?)%>/g,
                        interpolate: E,
                        variable: "",
                        imports: {
                            _: b
                        }
                    }, Nd || (s = function() {
                        function b() {}
                        return function(c) {
                            if (Eb(c)) {
                                b.prototype = c;
                                var d = new b;
                                b.prototype = null
                            }
                            return d || a.Object()
                        }
                    }());
                    var Yd = Md ? function(a, b) {
                            W.value = b, Md(a, "__bindData__", W)
                        } : ad,
                        Zd = Od || function(a) {
                            return a && "object" == typeof a && "number" == typeof a.length && Ad.call(a) == M || !1
                        },
                        $d = function(a) {
                            var b, c = a,
                                d = [];
                            if (!c) return d;
                            if (!X[typeof a]) return d;
                            for (b in c) Hd.call(c, b) && d.push(b);
                            return d
                        },
                        _d = Rd ? function(a) {
                            return Eb(a) ? Rd(a) : []
                        } : $d,
                        ae = {
                            "&": "&amp;",
                            "<": "&lt;",
                            ">": "&gt;",
                            '"': "&quot;",
                            "'": "&#39;"
                        },
                        be = wb(ae),
                        ce = ud("(" + _d(be).join("|") + ")", "g"),
                        de = ud("[" + _d(ae).join("") + "]", "g"),
                        ee = function(a, b, c) {
                            var d, e = a,
                                f = e;
                            if (!e) return f;
                            var g = arguments,
                                h = 0,
                                i = "number" == typeof c ? 2 : g.length;
                            if (i > 3 && "function" == typeof g[i - 2]) var j = w(g[--i - 1], g[i--], 2);
                            else i > 2 && "function" == typeof g[i - 1] && (j = g[--i]);
                            for (; ++h < i;)
                                if (e = g[h], e && X[typeof e])
                                    for (var k = -1, l = X[typeof e] && _d(e), m = l ? l.length : 0; ++k < m;) d = l[k], f[d] = j ? j(f[d], e[d]) : e[d];
                            return f
                        },
                        fe = function(a, b, c) {
                            var d, e = a,
                                f = e;
                            if (!e) return f;
                            for (var g = arguments, h = 0, i = "number" == typeof c ? 2 : g.length; ++h < i;)
                                if (e = g[h], e && X[typeof e])
                                    for (var j = -1, k = X[typeof e] && _d(e), l = k ? k.length : 0; ++j < l;) d = k[j], "undefined" == typeof f[d] && (f[d] = e[d]);
                            return f
                        },
                        ge = function(a, b, c) {
                            var d, e = a,
                                f = e;
                            if (!e) return f;
                            if (!X[typeof e]) return f;
                            b = b && "undefined" == typeof c ? b : w(b, c, 3);
                            for (d in e)
                                if (b(e[d], d, a) === !1) return f;
                            return f
                        },
                        he = function(a, b, c) {
                            var d, e = a,
                                f = e;
                            if (!e) return f;
                            if (!X[typeof e]) return f;
                            b = b && "undefined" == typeof c ? b : w(b, c, 3);
                            for (var g = -1, h = X[typeof e] && _d(e), i = h ? h.length : 0; ++g < i;)
                                if (d = h[g], b(e[d], d, a) === !1) return f;
                            return f
                        },
                        ie = Gd ? function(a) {
                            if (!a || Ad.call(a) != R) return !1;
                            var b = a.valueOf,
                                c = jb(b) && (c = Gd(b)) && Gd(c);
                            return c ? a == c || Gd(a) == c : kb(a)
                        } : kb,
                        je = fb(function(a, b, c) {
                            Hd.call(a, c) ? a[c] ++ : a[c] = 1
                        }),
                        ke = fb(function(a, b, c) {
                            (Hd.call(a, c) ? a[c] : a[c] = []).push(b)
                        }),
                        le = fb(function(a, b, c) {
                            a[c] = b
                        }),
                        me = _b,
                        ne = Vb,
                        oe = jb(oe = pd.now) && oe || function() {
                            return (new pd).getTime()
                        },
                        pe = 8 == Ud(x + "08") ? Ud : function(a, b) {
                            return Ud(Jb(a) ? a.replace(F, "") : a, b || 0)
                        };
                    return b.after = Hc, b.assign = ee, b.at = Sb, b.bind = Ic, b.bindAll = Jc, b.bindKey = Kc, b.chain = id, b.compact = lc, b.compose = Lc, b.constant = Wc, b.countBy = je, b.create = pb, b.createCallback = Xc, b.curry = Mc, b.debounce = Nc, b.defaults = fe, b.defer = Oc, b.delay = Pc, b.difference = mc, b.filter = Vb, b.flatten = qc, b.forEach = Yb, b.forEachRight = Zb, b.forIn = ge, b.forInRight = sb, b.forOwn = he, b.forOwnRight = tb, b.functions = ub, b.groupBy = ke, b.indexBy = le, b.initial = sc, b.intersection = tc, b.invert = wb, b.invoke = $b, b.keys = _d, b.map = _b, b.mapValues = Lb, b.max = ac, b.memoize = Qc, b.merge = Mb, b.min = bc, b.omit = Nb, b.once = Rc, b.pairs = Ob, b.partial = Sc, b.partialRight = Tc, b.pick = Pb, b.pluck = me, b.property = bd, b.pull = wc, b.range = xc, b.reject = ec, b.remove = yc, b.rest = zc, b.shuffle = gc, b.sortBy = jc, b.tap = jd, b.throttle = Uc, b.times = fd, b.toArray = kc, b.transform = Qb, b.union = Bc, b.uniq = Cc, b.values = Rb, b.where = ne, b.without = Dc, b.wrap = Vc, b.xor = Ec, b.zip = Fc, b.zipObject = Gc, b.collect = _b, b.drop = zc, b.each = Yb, b.eachRight = Zb, b.extend = ee, b.methods = ub, b.object = Gc, b.select = Vb, b.tail = zc, b.unique = Cc, b.unzip = Fc, $c(b), b.clone = nb, b.cloneDeep = ob, b.contains = Tb, b.escape = Yc, b.every = Ub, b.find = Wb, b.findIndex = nc, b.findKey = qb, b.findLast = Xb, b.findLastIndex = oc, b.findLastKey = rb, b.has = vb, b.identity = Zc, b.indexOf = rc, b.isArguments = mb, b.isArray = Zd, b.isBoolean = xb, b.isDate = yb, b.isElement = zb, b.isEmpty = Ab, b.isEqual = Bb, b.isFinite = Cb, b.isFunction = Db, b.isNaN = Fb, b.isNull = Gb, b.isNumber = Hb, b.isObject = Eb, b.isPlainObject = ie, b.isRegExp = Ib, b.isString = Jb, b.isUndefined = Kb, b.lastIndexOf = vc, b.mixin = $c, b.noConflict = _c, b.noop = ad, b.now = oe, b.parseInt = pe, b.random = cd, b.reduce = cc, b.reduceRight = dc, b.result = dd, b.runInContext = p, b.size = hc, b.some = ic, b.sortedIndex = Ac, b.template = ed, b.unescape = gd, b.uniqueId = hd, b.all = Ub, b.any = ic, b.detect = Wb, b.findWhere = Wb, b.foldl = cc, b.foldr = dc, b.include = Tb, b.inject = cc, $c(function() {
                        var a = {};
                        return he(b, function(c, d) {
                            b.prototype[d] || (a[d] = c)
                        }), a
                    }(), !1), b.first = pc, b.last = uc, b.sample = fc, b.take = pc, b.head = pc, he(b, function(a, d) {
                        var e = "sample" !== d;
                        b.prototype[d] || (b.prototype[d] = function(b, d) {
                            var f = this.__chain__,
                                g = a(this.__wrapped__, b, d);
                            return f || null != b && (!d || e && "function" == typeof b) ? new c(g, f) : g
                        })
                    }), b.VERSION = "2.4.1", b.prototype.chain = kd, b.prototype.toString = ld, b.prototype.value = md, b.prototype.valueOf = md, Yb(["join", "pop", "shift"], function(a) {
                        var d = xd[a];
                        b.prototype[a] = function() {
                            var a = this.__chain__,
                                b = d.apply(this.__wrapped__, arguments);
                            return a ? new c(b, a) : b
                        }
                    }), Yb(["push", "reverse", "sort", "unshift"], function(a) {
                        var c = xd[a];
                        b.prototype[a] = function() {
                            return c.apply(this.__wrapped__, arguments), this
                        }
                    }), Yb(["concat", "slice", "splice"], function(a) {
                        var d = xd[a];
                        b.prototype[a] = function() {
                            return new c(d.apply(this.__wrapped__, arguments), this.__chain__)
                        }
                    }), b
                }
                var q, r = [],
                    s = [],
                    t = 0,
                    u = +new Date + "",
                    v = 75,
                    w = 40,
                    x = " 	\f ﻿\n\r\u2028\u2029 ᠎             　",
                    y = /\b__p \+= '';/g,
                    z = /\b(__p \+=) '' \+/g,
                    A = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
                    B = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
                    C = /\w*$/,
                    D = /^\s*function[ \n\r\t]+\w/,
                    E = /<%=([\s\S]+?)%>/g,
                    F = RegExp("^[" + x + "]*0+(?=.$)"),
                    G = /($^)/,
                    H = /\bthis\b/,
                    I = /['\n\r\t\u2028\u2029\\]/g,
                    J = ["Array", "Boolean", "Date", "Function", "Math", "Number", "Object", "RegExp", "String", "_", "attachEvent", "clearTimeout", "isFinite", "isNaN", "parseInt", "setTimeout"],
                    K = 0,
                    L = "[object Arguments]",
                    M = "[object Array]",
                    N = "[object Boolean]",
                    O = "[object Date]",
                    P = "[object Function]",
                    Q = "[object Number]",
                    R = "[object Object]",
                    S = "[object RegExp]",
                    T = "[object String]",
                    U = {};
                U[P] = !1, U[L] = U[M] = U[N] = U[O] = U[Q] = U[R] = U[S] = U[T] = !0;
                var V = {
                        leading: !1,
                        maxWait: 0,
                        trailing: !1
                    },
                    W = {
                        configurable: !1,
                        enumerable: !1,
                        value: null,
                        writable: !1
                    },
                    X = {
                        "boolean": !1,
                        "function": !0,
                        object: !0,
                        number: !1,
                        string: !1,
                        undefined: !1
                    },
                    Y = {
                        "\\": "\\",
                        "'": "'",
                        "\n": "n",
                        "\r": "r",
                        "	": "t",
                        "\u2028": "u2028",
                        "\u2029": "u2029"
                    },
                    Z = X[typeof window] && window || this,
                    $ = X[typeof c] && c && !c.nodeType && c,
                    _ = X[typeof b] && b && !b.nodeType && b,
                    ab = _ && _.exports === $ && $,
                    bb = X[typeof a] && a;
                !bb || bb.global !== bb && bb.window !== bb || (Z = bb);
                var cb = p();
                "function" == typeof define && "object" == typeof define.amd && define.amd ? (Z._ = cb, define(function() {
                    return cb
                })) : $ && _ ? ab ? (_.exports = cb)._ = cb : $._ = cb : Z._ = cb
            }).call(this)
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    7: [function(a, b, c) {
        (function(a) {
            ! function(a) {
                "use strict";
                if ("function" == typeof bootstrap) bootstrap("promise", a);
                else if ("object" == typeof c && "object" == typeof b) b.exports = a();
                else if ("function" == typeof define && define.amd) define(a);
                else if ("undefined" != typeof ses) {
                    if (!ses.ok()) return;
                    ses.makeQ = a
                } else {
                    if ("undefined" == typeof self) throw new Error("This environment was not anticiapted by Q. Please file a bug.");
                    self.Q = a()
                }
            }(function() {
                "use strict";

                function b(a) {
                    return function() {
                        return W.apply(a, arguments)
                    }
                }

                function c(a) {
                    return a === Object(a)
                }

                function d(a) {
                    return "[object StopIteration]" === cb(a) || a instanceof S
                }

                function e(a, b) {
                    if (P && b.stack && "object" == typeof a && null !== a && a.stack && -1 === a.stack.indexOf(db)) {
                        for (var c = [], d = b; d; d = d.source) d.stack && c.unshift(d.stack);
                        c.unshift(a.stack);
                        var e = c.join("\n" + db + "\n");
                        a.stack = f(e)
                    }
                }

                function f(a) {
                    for (var b = a.split("\n"), c = [], d = 0; d < b.length; ++d) {
                        var e = b[d];
                        i(e) || g(e) || !e || c.push(e)
                    }
                    return c.join("\n")
                }

                function g(a) {
                    return -1 !== a.indexOf("(module.js:") || -1 !== a.indexOf("(node.js:")
                }

                function h(a) {
                    var b = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(a);
                    if (b) return [b[1], Number(b[2])];
                    var c = /at ([^ ]+):(\d+):(?:\d+)$/.exec(a);
                    if (c) return [c[1], Number(c[2])];
                    var d = /.*@(.+):(\d+)$/.exec(a);
                    return d ? [d[1], Number(d[2])] : void 0
                }

                function i(a) {
                    var b = h(a);
                    if (!b) return !1;
                    var c = b[0],
                        d = b[1];
                    return c === R && d >= T && hb >= d
                }

                function j() {
                    if (P) try {
                        throw new Error
                    } catch (a) {
                        var b = a.stack.split("\n"),
                            c = b[0].indexOf("@") > 0 ? b[1] : b[2],
                            d = h(c);
                        if (!d) return;
                        return R = d[0], d[1]
                    }
                }

                function k(a, b, c) {
                    return function() {
                        return "undefined" != typeof console && "function" == typeof console.warn, a.apply(a, arguments)
                    }
                }

                function l(a) {
                    return a instanceof p ? a : t(a) ? C(a) : B(a)
                }

                function m() {
                    function a(a) {
                        b = a, f.source = a, Y(c, function(b, c) {
                            l.nextTick(function() {
                                a.promiseDispatch.apply(a, c)
                            })
                        }, void 0), c = void 0, d = void 0
                    }
                    var b, c = [],
                        d = [],
                        e = _(m.prototype),
                        f = _(p.prototype);
                    if (f.promiseDispatch = function(a, e, f) {
                        var g = X(arguments);
                        c ? (c.push(g), "when" === e && f[1] && d.push(f[1])) : l.nextTick(function() {
                            b.promiseDispatch.apply(b, g)
                        })
                    }, f.valueOf = function() {
                        if (c) return f;
                        var a = r(b);
                        return s(a) && (b = a), a
                    }, f.inspect = function() {
                        return b ? b.inspect() : {
                            state: "pending"
                        }
                    }, l.longStackSupport && P) try {
                        throw new Error
                    } catch (g) {
                        f.stack = g.stack.substring(g.stack.indexOf("\n") + 1)
                    }
                    return e.promise = f, e.resolve = function(c) {
                        b || a(l(c))
                    }, e.fulfill = function(c) {
                        b || a(B(c))
                    }, e.reject = function(c) {
                        b || a(A(c))
                    }, e.notify = function(a) {
                        b || Y(d, function(b, c) {
                            l.nextTick(function() {
                                c(a)
                            })
                        }, void 0)
                    }, e
                }

                function n(a) {
                    if ("function" != typeof a) throw new TypeError("resolver must be a function.");
                    var b = m();
                    try {
                        a(b.resolve, b.reject, b.notify)
                    } catch (c) {
                        b.reject(c)
                    }
                    return b.promise
                }

                function o(a) {
                    return n(function(b, c) {
                        for (var d = 0, e = a.length; e > d; d++) l(a[d]).then(b, c)
                    })
                }

                function p(a, b, c) {
                    void 0 === b && (b = function(a) {
                        return A(new Error("Promise does not support operation: " + a))
                    }), void 0 === c && (c = function() {
                        return {
                            state: "unknown"
                        }
                    });
                    var d = _(p.prototype);
                    if (d.promiseDispatch = function(c, e, f) {
                        var g;
                        try {
                            g = a[e] ? a[e].apply(d, f) : b.call(d, e, f)
                        } catch (h) {
                            g = A(h)
                        }
                        c && c(g)
                    }, d.inspect = c, c) {
                        var e = c();
                        "rejected" === e.state && (d.exception = e.reason), d.valueOf = function() {
                            var a = c();
                            return "pending" === a.state || "rejected" === a.state ? d : a.value
                        }
                    }
                    return d
                }

                function q(a, b, c, d) {
                    return l(a).then(b, c, d)
                }

                function r(a) {
                    if (s(a)) {
                        var b = a.inspect();
                        if ("fulfilled" === b.state) return b.value
                    }
                    return a
                }

                function s(a) {
                    return a instanceof p
                }

                function t(a) {
                    return c(a) && "function" == typeof a.then
                }

                function u(a) {
                    return s(a) && "pending" === a.inspect().state
                }

                function v(a) {
                    return !s(a) || "fulfilled" === a.inspect().state
                }

                function w(a) {
                    return s(a) && "rejected" === a.inspect().state
                }

                function x() {
                    eb.length = 0, fb.length = 0, gb || (gb = !0)
                }

                function y(a, b) {
                    gb && (fb.push(a), eb.push(b && "undefined" != typeof b.stack ? b.stack : "(no stack) " + b))
                }

                function z(a) {
                    if (gb) {
                        var b = Z(fb, a); - 1 !== b && (fb.splice(b, 1), eb.splice(b, 1))
                    }
                }

                function A(a) {
                    var b = p({
                        when: function(b) {
                            return b && z(this), b ? b(a) : this
                        }
                    }, function() {
                        return this
                    }, function() {
                        return {
                            state: "rejected",
                            reason: a
                        }
                    });
                    return y(b, a), b
                }

                function B(a) {
                    return p({
                        when: function() {
                            return a
                        },
                        get: function(b) {
                            return a[b]
                        },
                        set: function(b, c) {
                            a[b] = c
                        },
                        "delete": function(b) {
                            delete a[b]
                        },
                        post: function(b, c) {
                            return null === b || void 0 === b ? a.apply(void 0, c) : a[b].apply(a, c)
                        },
                        apply: function(b, c) {
                            return a.apply(b, c)
                        },
                        keys: function() {
                            return bb(a)
                        }
                    }, void 0, function() {
                        return {
                            state: "fulfilled",
                            value: a
                        }
                    })
                }

                function C(a) {
                    var b = m();
                    return l.nextTick(function() {
                        try {
                            a.then(b.resolve, b.reject, b.notify)
                        } catch (c) {
                            b.reject(c)
                        }
                    }), b.promise
                }

                function D(a) {
                    return p({
                        isDef: function() {}
                    }, function(b, c) {
                        return J(a, b, c)
                    }, function() {
                        return l(a).inspect()
                    })
                }

                function E(a, b, c) {
                    return l(a).spread(b, c)
                }

                function F(a) {
                    return function() {
                        function b(a, b) {
                            var g;
                            if ("undefined" == typeof StopIteration) {
                                try {
                                    g = c[a](b)
                                } catch (h) {
                                    return A(h)
                                }
                                return g.done ? l(g.value) : q(g.value, e, f)
                            }
                            try {
                                g = c[a](b)
                            } catch (h) {
                                return d(h) ? l(h.value) : A(h)
                            }
                            return q(g, e, f)
                        }
                        var c = a.apply(this, arguments),
                            e = b.bind(b, "next"),
                            f = b.bind(b, "throw");
                        return e()
                    }
                }

                function G(a) {
                    l.done(l.async(a)())
                }

                function H(a) {
                    throw new S(a)
                }

                function I(a) {
                    return function() {
                        return E([this, K(arguments)], function(b, c) {
                            return a.apply(b, c)
                        })
                    }
                }

                function J(a, b, c) {
                    return l(a).dispatch(b, c)
                }

                function K(a) {
                    return q(a, function(a) {
                        var b = 0,
                            c = m();
                        return Y(a, function(d, e, f) {
                            var g;
                            s(e) && "fulfilled" === (g = e.inspect()).state ? a[f] = g.value : (++b, q(e, function(d) {
                                a[f] = d, 0 === --b && c.resolve(a)
                            }, c.reject, function(a) {
                                c.notify({
                                    index: f,
                                    value: a
                                })
                            }))
                        }, void 0), 0 === b && c.resolve(a), c.promise
                    })
                }

                function L(a) {
                    return q(a, function(a) {
                        return a = $(a, l), q(K($(a, function(a) {
                            return q(a, U, U)
                        })), function() {
                            return a
                        })
                    })
                }

                function M(a) {
                    return l(a).allSettled()
                }

                function N(a, b) {
                    return l(a).then(void 0, void 0, b)
                }

                function O(a, b) {
                    return l(a).nodeify(b)
                }
                var P = !1;
                try {
                    throw new Error
                } catch (Q) {
                    P = !!Q.stack
                }
                var R, S, T = j(),
                    U = function() {},
                    V = function() {
                        function b() {
                            for (; c.next;) {
                                c = c.next;
                                var a = c.task;
                                c.task = void 0;
                                var d = c.domain;
                                d && (c.domain = void 0, d.enter());
                                try {
                                    a()
                                } catch (f) {
                                    if (g) throw d && d.exit(), setTimeout(b, 0), d && d.enter(), f;
                                    setTimeout(function() {
                                        throw f
                                    }, 0)
                                }
                                d && d.exit()
                            }
                            e = !1
                        }
                        var c = {
                                task: void 0,
                                next: null
                            },
                            d = c,
                            e = !1,
                            f = void 0,
                            g = !1;
                        if (V = function(b) {
                            d = d.next = {
                                task: b,
                                domain: g && a.domain,
                                next: null
                            }, e || (e = !0, f())
                        }, "undefined" != typeof a && a.nextTick) g = !0, f = function() {
                            a.nextTick(b)
                        };
                        else if ("function" == typeof setImmediate) f = "undefined" != typeof window ? setImmediate.bind(window, b) : function() {
                            setImmediate(b)
                        };
                        else if ("undefined" != typeof MessageChannel) {
                            var h = new MessageChannel;
                            h.port1.onmessage = function() {
                                f = i, h.port1.onmessage = b, b()
                            };
                            var i = function() {
                                h.port2.postMessage(0)
                            };
                            f = function() {
                                setTimeout(b, 0), i()
                            }
                        } else f = function() {
                            setTimeout(b, 0)
                        };
                        return V
                    }(),
                    W = Function.call,
                    X = b(Array.prototype.slice),
                    Y = b(Array.prototype.reduce || function(a, b) {
                        var c = 0,
                            d = this.length;
                        if (1 === arguments.length)
                            for (;;) {
                                if (c in this) {
                                    b = this[c++];
                                    break
                                }
                                if (++c >= d) throw new TypeError
                            }
                        for (; d > c; c++) c in this && (b = a(b, this[c], c));
                        return b
                    }),
                    Z = b(Array.prototype.indexOf || function(a) {
                        for (var b = 0; b < this.length; b++)
                            if (this[b] === a) return b;
                        return -1
                    }),
                    $ = b(Array.prototype.map || function(a, b) {
                        var c = this,
                            d = [];
                        return Y(c, function(e, f, g) {
                            d.push(a.call(b, f, g, c))
                        }, void 0), d
                    }),
                    _ = Object.create || function(a) {
                        function b() {}
                        return b.prototype = a, new b
                    },
                    ab = b(Object.prototype.hasOwnProperty),
                    bb = Object.keys || function(a) {
                        var b = [];
                        for (var c in a) ab(a, c) && b.push(c);
                        return b
                    },
                    cb = b(Object.prototype.toString);
                S = "undefined" != typeof ReturnValue ? ReturnValue : function(a) {
                    this.value = a
                };
                var db = "From previous event:";
                l.resolve = l, l.nextTick = V, l.longStackSupport = !1, "object" == typeof a && a && a.env && a.env.Q_DEBUG && (l.longStackSupport = !0), l.defer = m, m.prototype.makeNodeResolver = function() {
                    var a = this;
                    return function(b, c) {
                        b ? a.reject(b) : a.resolve(arguments.length > 2 ? X(arguments, 1) : c)
                    }
                }, l.Promise = n, l.promise = n, n.race = o, n.all = K, n.reject = A, n.resolve = l, l.passByCopy = function(a) {
                    return a
                }, p.prototype.passByCopy = function() {
                    return this
                }, l.join = function(a, b) {
                    return l(a).join(b)
                }, p.prototype.join = function(a) {
                    return l([this, a]).spread(function(a, b) {
                        if (a === b) return a;
                        throw new Error("Can't join: not the same: " + a + " " + b)
                    })
                }, l.race = o, p.prototype.race = function() {
                    return this.then(l.race)
                }, l.makePromise = p, p.prototype.toString = function() {
                    return "[object Promise]"
                }, p.prototype.then = function(a, b, c) {
                    function d(b) {
                        try {
                            return "function" == typeof a ? a(b) : b
                        } catch (c) {
                            return A(c)
                        }
                    }

                    function f(a) {
                        if ("function" == typeof b) {
                            e(a, h);
                            try {
                                return b(a)
                            } catch (c) {
                                return A(c)
                            }
                        }
                        return A(a)
                    }

                    function g(a) {
                        return "function" == typeof c ? c(a) : a
                    }
                    var h = this,
                        i = m(),
                        j = !1;
                    return l.nextTick(function() {
                        h.promiseDispatch(function(a) {
                            j || (j = !0, i.resolve(d(a)))
                        }, "when", [function(a) {
                            j || (j = !0, i.resolve(f(a)))
                        }])
                    }), h.promiseDispatch(void 0, "when", [void 0, function(a) {
                        var b, c = !1;
                        try {
                            b = g(a)
                        } catch (d) {
                            if (c = !0, !l.onerror) throw d;
                            l.onerror(d)
                        }
                        c || i.notify(b)
                    }]), i.promise
                }, l.tap = function(a, b) {
                    return l(a).tap(b)
                }, p.prototype.tap = function(a) {
                    return a = l(a), this.then(function(b) {
                        return a.fcall(b).thenResolve(b)
                    })
                }, l.when = q, p.prototype.thenResolve = function(a) {
                    return this.then(function() {
                        return a
                    })
                }, l.thenResolve = function(a, b) {
                    return l(a).thenResolve(b)
                }, p.prototype.thenReject = function(a) {
                    return this.then(function() {
                        throw a
                    })
                }, l.thenReject = function(a, b) {
                    return l(a).thenReject(b)
                }, l.nearer = r, l.isPromise = s, l.isPromiseAlike = t, l.isPending = u, p.prototype.isPending = function() {
                    return "pending" === this.inspect().state
                }, l.isFulfilled = v, p.prototype.isFulfilled = function() {
                    return "fulfilled" === this.inspect().state
                }, l.isRejected = w, p.prototype.isRejected = function() {
                    return "rejected" === this.inspect().state
                };
                var eb = [],
                    fb = [],
                    gb = !0;
                l.resetUnhandledRejections = x, l.getUnhandledReasons = function() {
                    return eb.slice()
                }, l.stopUnhandledRejectionTracking = function() {
                    x(), gb = !1
                }, x(), l.reject = A, l.fulfill = B, l.master = D, l.spread = E, p.prototype.spread = function(a, b) {
                    return this.all().then(function(b) {
                        return a.apply(void 0, b)
                    }, b)
                }, l.async = F, l.spawn = G, l["return"] = H, l.promised = I, l.dispatch = J, p.prototype.dispatch = function(a, b) {
                    var c = this,
                        d = m();
                    return l.nextTick(function() {
                        c.promiseDispatch(d.resolve, a, b)
                    }), d.promise
                }, l.get = function(a, b) {
                    return l(a).dispatch("get", [b])
                }, p.prototype.get = function(a) {
                    return this.dispatch("get", [a])
                }, l.set = function(a, b, c) {
                    return l(a).dispatch("set", [b, c])
                }, p.prototype.set = function(a, b) {
                    return this.dispatch("set", [a, b])
                }, l.del = l["delete"] = function(a, b) {
                    return l(a).dispatch("delete", [b])
                }, p.prototype.del = p.prototype["delete"] = function(a) {
                    return this.dispatch("delete", [a])
                }, l.mapply = l.post = function(a, b, c) {
                    return l(a).dispatch("post", [b, c])
                }, p.prototype.mapply = p.prototype.post = function(a, b) {
                    return this.dispatch("post", [a, b])
                }, l.send = l.mcall = l.invoke = function(a, b) {
                    return l(a).dispatch("post", [b, X(arguments, 2)])
                }, p.prototype.send = p.prototype.mcall = p.prototype.invoke = function(a) {
                    return this.dispatch("post", [a, X(arguments, 1)])
                }, l.fapply = function(a, b) {
                    return l(a).dispatch("apply", [void 0, b])
                }, p.prototype.fapply = function(a) {
                    return this.dispatch("apply", [void 0, a])
                }, l["try"] = l.fcall = function(a) {
                    return l(a).dispatch("apply", [void 0, X(arguments, 1)])
                }, p.prototype.fcall = function() {
                    return this.dispatch("apply", [void 0, X(arguments)])
                }, l.fbind = function(a) {
                    var b = l(a),
                        c = X(arguments, 1);
                    return function() {
                        return b.dispatch("apply", [this, c.concat(X(arguments))])
                    }
                }, p.prototype.fbind = function() {
                    var a = this,
                        b = X(arguments);
                    return function() {
                        return a.dispatch("apply", [this, b.concat(X(arguments))])
                    }
                }, l.keys = function(a) {
                    return l(a).dispatch("keys", [])
                }, p.prototype.keys = function() {
                    return this.dispatch("keys", [])
                }, l.all = K, p.prototype.all = function() {
                    return K(this)
                }, l.allResolved = k(L, "allResolved", "allSettled"), p.prototype.allResolved = function() {
                    return L(this)
                }, l.allSettled = M, p.prototype.allSettled = function() {
                    return this.then(function(a) {
                        return K($(a, function(a) {
                            function b() {
                                return a.inspect()
                            }
                            return a = l(a), a.then(b, b)
                        }))
                    })
                }, l.fail = l["catch"] = function(a, b) {
                    return l(a).then(void 0, b)
                }, p.prototype.fail = p.prototype["catch"] = function(a) {
                    return this.then(void 0, a)
                }, l.progress = N, p.prototype.progress = function(a) {
                    return this.then(void 0, void 0, a)
                }, l.fin = l["finally"] = function(a, b) {
                    return l(a)["finally"](b)
                }, p.prototype.fin = p.prototype["finally"] = function(a) {
                    return a = l(a), this.then(function(b) {
                        return a.fcall().then(function() {
                            return b
                        })
                    }, function(b) {
                        return a.fcall().then(function() {
                            throw b
                        })
                    })
                }, l.done = function(a, b, c, d) {
                    return l(a).done(b, c, d)
                }, p.prototype.done = function(b, c, d) {
                    var f = function(a) {
                            l.nextTick(function() {
                                if (e(a, g), !l.onerror) throw a;
                                l.onerror(a)
                            })
                        },
                        g = b || c || d ? this.then(b, c, d) : this;
                    "object" == typeof a && a && a.domain && (f = a.domain.bind(f)), g.then(void 0, f)
                }, l.timeout = function(a, b, c) {
                    return l(a).timeout(b, c)
                }, p.prototype.timeout = function(a, b) {
                    var c = m(),
                        d = setTimeout(function() {
                            b && "string" != typeof b || (b = new Error(b || "Timed out after " + a + " ms"), b.code = "ETIMEDOUT"), c.reject(b)
                        }, a);
                    return this.then(function(a) {
                        clearTimeout(d), c.resolve(a)
                    }, function(a) {
                        clearTimeout(d), c.reject(a)
                    }, c.notify), c.promise
                }, l.delay = function(a, b) {
                    return void 0 === b && (b = a, a = void 0), l(a).delay(b)
                }, p.prototype.delay = function(a) {
                    return this.then(function(b) {
                        var c = m();
                        return setTimeout(function() {
                            c.resolve(b)
                        }, a), c.promise
                    })
                }, l.nfapply = function(a, b) {
                    return l(a).nfapply(b)
                }, p.prototype.nfapply = function(a) {
                    var b = m(),
                        c = X(a);
                    return c.push(b.makeNodeResolver()), this.fapply(c).fail(b.reject), b.promise
                }, l.nfcall = function(a) {
                    var b = X(arguments, 1);
                    return l(a).nfapply(b)
                }, p.prototype.nfcall = function() {
                    var a = X(arguments),
                        b = m();
                    return a.push(b.makeNodeResolver()), this.fapply(a).fail(b.reject), b.promise
                }, l.nfbind = l.denodeify = function(a) {
                    var b = X(arguments, 1);
                    return function() {
                        var c = b.concat(X(arguments)),
                            d = m();
                        return c.push(d.makeNodeResolver()), l(a).fapply(c).fail(d.reject), d.promise
                    }
                }, p.prototype.nfbind = p.prototype.denodeify = function() {
                    var a = X(arguments);
                    return a.unshift(this), l.denodeify.apply(void 0, a)
                }, l.nbind = function(a, b) {
                    var c = X(arguments, 2);
                    return function() {
                        function d() {
                            return a.apply(b, arguments)
                        }
                        var e = c.concat(X(arguments)),
                            f = m();
                        return e.push(f.makeNodeResolver()), l(d).fapply(e).fail(f.reject), f.promise
                    }
                }, p.prototype.nbind = function() {
                    var a = X(arguments, 0);
                    return a.unshift(this), l.nbind.apply(void 0, a)
                }, l.nmapply = l.npost = function(a, b, c) {
                    return l(a).npost(b, c)
                }, p.prototype.nmapply = p.prototype.npost = function(a, b) {
                    var c = X(b || []),
                        d = m();
                    return c.push(d.makeNodeResolver()), this.dispatch("post", [a, c]).fail(d.reject), d.promise
                }, l.nsend = l.nmcall = l.ninvoke = function(a, b) {
                    var c = X(arguments, 2),
                        d = m();
                    return c.push(d.makeNodeResolver()), l(a).dispatch("post", [b, c]).fail(d.reject), d.promise
                }, p.prototype.nsend = p.prototype.nmcall = p.prototype.ninvoke = function(a) {
                    var b = X(arguments, 1),
                        c = m();
                    return b.push(c.makeNodeResolver()), this.dispatch("post", [a, b]).fail(c.reject), c.promise
                }, l.nodeify = O, p.prototype.nodeify = function(a) {
                    return a ? void this.then(function(b) {
                        l.nextTick(function() {
                            a(null, b)
                        })
                    }, function(b) {
                        l.nextTick(function() {
                            a(b)
                        })
                    }) : this
                };
                var hb = j();
                return l
            })
        }).call(this, a("_process"))
    }, {
        _process: 80
    }],
    8: [function(a, b, c) {
        ! function() {
            "use strict";
            var b = a("q"),
                d = a("./local-storage"),
                e = a("./config");
            return c.create = function(a) {
                return d.put(e.localStorage.PENDING_QUEUE + a, []), d.put(e.localStorage.PROCESSING_QUEUE + a, []), {
                    fetch: function() {
                        function c() {
                            var b;
                            d.get(e.localStorage.PENDING_QUEUE + a).then(function(g) {
                                return 0 == g.length ? void setTimeout(c, 50) : (b = g.pop(), void d.get(e.localStorage.PROCESSING_QUEUE + a).then(function(c) {
                                    return c.push(b), d.put(e.localStorage.PROCESSING_QUEUE + a, c)
                                }).then(function() {
                                        return d.put(e.localStorage.PENDING_QUEUE + a, g)
                                    }).then(function() {
                                        return f.resolve(b)
                                    }))
                            })
                        }
                        var f = b.defer();
                        return c(), f.promise
                    },
                    markDone: function(b) {
                        return d.get(e.localStorage.PROCESSING_QUEUE + a).then(function(c) {
                            var f = c.indexOf(b);
                            if (-1 != f) return c.splice(f, 1), d.put(e.localStorage.PROCESSING_QUEUE + a, c)
                        })
                    },
                    add: function(b) {
                        return d.get(e.localStorage.PENDING_QUEUE + a).then(function(c) {
                            return c.push(b), d.put(e.localStorage.PENDING_QUEUE + a, c)
                        })
                    },
                    addMulti: function(b) {
                        return d.get(e.localStorage.PENDING_QUEUE + a).then(function(c) {
                            return c = c.concat(b), d.put(e.localStorage.PENDING_QUEUE + a, c)
                        })
                    },
                    whenAllDone: function() {
                        var c = b.defer(),
                            f = function() {
                                b.all([d.get(e.localStorage.PROCESSING_QUEUE + a), d.get(e.localStorage.PENDING_QUEUE + a)]).then(function(a) {
                                    a[0].length > 0 || a[1].length > 0 ? setTimeout(f, 10) : c.resolve()
                                })
                            };
                        return f(), c.promise
                    }
                }
            }, {}
        }()
    }, {
        "./config": 2,
        "./local-storage": 4,
        q: 7
    }],
    9: [function(a) {
        ! function() {
            "use strict";
            var b = a("../game/game"),
                c = a("../game/console"),
                d = a("lodash");
            return self.onmessage = function(a) {
                var e = a.data;
                if (e.user) try {
                    var f = {},
                        g = new Date,
                        h = function(a) {
                            if (!d.isFunction(a)) throw new Error("argument is not a function in getUsedCpu()");
                            a(new Date - g)
                        };
                    b.runCode(e.userCode, e, f, e.userMemory, c, e.consoleCommands, 1 / 0, h), self.postMessage({
                        type: "done",
                        intents: f,
                        memory: e.userMemory,
                        console: {
                            log: c.getMessages(),
                            results: c.getCommandResults()
                        }
                    })
                } catch (a) {
                    self.postMessage({
                        type: "error",
                        error: a.toString()
                    })
                }
            }, {}
        }()
    }, {
        "../game/console": 11,
        "../game/game": 18,
        lodash: 6
    }],
    10: [function(a, b, c) {
        ! function() {
            "use strict";
            var a = {},
                b = 0;
            return c.create = function(c) {
                return self.postMessage({
                    type: "worker",
                    workerId: b,
                    startSrc: c
                }), a[b] = {
                    postMessage: function(a) {
                        self.postMessage({
                            type: "worker",
                            workerId: b,
                            message: a
                        })
                    },
                    terminate: function() {
                        self.postMessage({
                            type: "worker",
                            workerId: b,
                            terminate: !0
                        })
                    }
                }
            }, c.handleMessage = function(b) {
                a[b.workerId] && a[b.workerId].onmessage({
                    target: a[b.workerId],
                    data: b.message
                })
            }, {}
        }()
    }, {}],
    11: [function(a, b, c) {
        "use strict";
        var d = a("lodash"),
            e = [],
            f = [];
        c.log = function() {
            "undefined" != typeof self && self.navigator.userAgent && console.log.apply(console, arguments), e.push(d.map(arguments, function(a) {
                return a && a.toString ? a.toString() : "undefined" == typeof a ? "undefined" : JSON.stringify(a)
            }).join(" "))
        }, c.commandResult = function(a) {
            f.push(String(a))
        }, c.getMessages = function() {
            var a = e;
            return e = [], a
        }, c.getCommandResults = function() {
            var a = f;
            return f = [], a
        }
    }, {
        lodash: 25
    }],
    12: [function(a, b) {
        "use strict";
        b.exports = {
            CREEPS: 1,
            MY_CREEPS: 2,
            HOSTILE_CREEPS: 3,
            SOURCES_ACTIVE: 4,
            SOURCES: 5,
            DROPPED_ENERGY: 6,
            STRUCTURES: 7,
            MY_STRUCTURES: 8,
            HOSTILE_STRUCTURES: 9,
            FLAGS: 10,
            CONSTRUCTION_SITES: 11,
            MY_SPAWNS: 12,
            HOSTILE_SPAWNS: 13,
            EXIT_TOP: 14,
            EXIT_RIGHT: 15,
            EXIT_BOTTOM: 16,
            EXIT_LEFT: 17,
            TOP: 1,
            TOP_RIGHT: 2,
            RIGHT: 3,
            BOTTOM_RIGHT: 4,
            BOTTOM: 5,
            BOTTOM_LEFT: 6,
            LEFT: 7,
            TOP_LEFT: 8,
            OK: 0,
            ERR_NOT_OWNER: -1,
            ERR_NO_PATH: -2,
            ERR_NAME_EXISTS: -3,
            ERR_BUSY: -4,
            ERR_NOT_FOUND: -5,
            ERR_NOT_ENOUGH_ENERGY: -6,
            ERR_INVALID_TARGET: -7,
            ERR_FULL: -8,
            ERR_NOT_IN_RANGE: -9,
            ERR_INVALID_ARGS: -10,
            ERR_TIRED: -11,
            ERR_NO_BODYPART: -12,
            ERR_NOT_ENOUGH_EXTENSIONS: -13,
            COLOR_RED: "red",
            COLOR_PURPLE: "purple",
            COLOR_BLUE: "blue",
            COLOR_CYAN: "cyan",
            COLOR_GREEN: "green",
            COLOR_YELLOW: "yellow",
            COLOR_ORANGE: "orange",
            COLOR_BROWN: "brown",
            COLOR_GREY: "grey",
            COLOR_WHITE: "white",
            CREEP_SPAWN_TIME: 9,
            CREEP_LIFE_TIME: 1800,
            OBSTACLE_OBJECT_TYPES: ["spawn", "creep", "wall", "source", "constructedWall", "extension"],
            ENERGY_REGEN_TIME: 300,
            ENERGY_REGEN_AMOUNT: 3e3,
            ENERGY_DECAY: 1,
            CREEP_CORPSE_RATE: .2,
            REPAIR_COST: .1,
            RAMPART_DECAY_AMOUNT: 1,
            RAMPART_DECAY_TIME: 30,
            RAMPART_HITS: 1500,
            SPAWN_HITS: 5e3,
            SPAWN_ENERGY_START: 1e3,
            SPAWN_ENERGY_CAPACITY: 6e3,
            SOURCE_ENERGY_CAPACITY: 3e3,
            ROAD_HITS: 300,
            WALL_HITS: 6e3,
            EXTENSION_HITS: 1e3,
            EXTENSION_ENERGY_CAPACITY: 200,
            EXTENSION_ENERGY_COST: 200,
            CONSTRUCTION_DECAY_TIME: 3600,
            ROAD_WEAROUT: 1,
            BODYPART_COST: {
                move: 50,
                work: 20,
                attack: 80,
                carry: 50,
                heal: 200,
                ranged_attack: 150,
                tough: 20
            },
            CARRY_CAPACITY: 50,
            HARVEST_POWER: 2,
            REPAIR_POWER: 20,
            BUILD_POWER: 5,
            ATTACK_POWER: 30,
            RANGED_ATTACK_POWER: 10,
            HEAL_POWER: 12,
            RANGED_HEAL_POWER: 4,
            MOVE: "move",
            WORK: "work",
            CARRY: "carry",
            ATTACK: "attack",
            RANGED_ATTACK: "ranged_attack",
            TOUGH: "tough",
            HEAL: "heal",
            CONSTRUCTION_COST: {
                spawn: 5e3,
                extension: 3e3,
                road: 300,
                constructedWall: 500,
                rampart: 2e3
            },
            CONSTRUCTION_COST_ROAD_SWAMP_RATIO: 5,
            STRUCTURE_SPAWN: "spawn",
            STRUCTURE_EXTENSION: "extension",
            STRUCTURE_ROAD: "road",
            STRUCTURE_WALL: "constructedWall",
            STRUCTURE_RAMPART: "rampart",
            MODE_SIMULATION: "simulation",
            MODE_SURVIVAL: "survival",
            MODE_WORLD: "world",
            TERRAIN_MASK_WALL: 1,
            TERRAIN_MASK_SWAMP: 2,
            TERRAIN_MASK_LAVA: 4
        }, b.exports.BODYPARTS_ALL = [b.exports.MOVE, b.exports.WORK, b.exports.CARRY, b.exports.ATTACK, b.exports.RANGED_ATTACK, b.exports.TOUGH, b.exports.HEAL]
    }, {}],
    13: [function(a, b, c) {
        "use strict";
        var d = (a("./../utils"), a("./rooms")),
            e = a("./constants"),
            f = a("lodash");
        c.make = function(a, b, c) {
            function g(g) {
                var h = a.roomObjects[g];
                return {
                    id: g,
                    toString: function() {
                        return "[construction site (" + h.structureType + ") #" + g + "]"
                    },
                    pos: d.makePos(h.x, h.y, h.room, c),
                    progress: h.progress,
                    progressTotal: h.progressTotal,
                    structureType: h.structureType,
                    name: h.name,
                    ticksToLive: h.ticksToLive,
                    owner: {
                        username: "Player " + h.user
                    },
                    my: f.isUndefined(h.user) ? void 0 : h.user == a.user._id,
                    get room() {
                        return c.rooms[h.room]
                    },
                    remove: function() {
                        return this.my ? (b[g] = b[g] || {}, b[g].remove = {}, e.OK) : e.ERR_NOT_OWNER
                    }
                }
            }
            var h = {};
            for (var i in a.roomObjects) "constructionSite" == a.roomObjects[i].type && (h[i] = g(i));
            return h
        }
    }, {
        "./../utils": 79,
        "./constants": 12,
        "./rooms": 20,
        lodash: 25
    }],
    14: [function(a, b, c) {
        "use strict";
        var d = a("./../utils"),
            e = a("./rooms"),
            f = a("lodash"),
            g = a("./constants");
        c.make = function(a, b, c, h) {
            function i(i) {
                var j = a.roomObjects[i],
                    k = {
                        id: i,
                        name: j.user == a.user._id ? j.name : void 0,
                        toString: function() {
                            return "[creep " + (j.user == a.user._id ? j.name : "#" + i) + "]"
                        },
                        pos: e.makePos(j.x, j.y, j.room, c),
                        body: j.body,
                        my: j.user == a.user._id,
                        owner: {
                            username: "Player " + j.user
                        },
                        spawning: j.spawning,
                        ticksToLive: j.ticksToLive,
                        energy: j.energy,
                        energyCapacity: j.energyCapacity,
                        fatigue: j.fatigue,
                        hits: j.hits,
                        hitsMax: j.hitsMax,
                        get memory() {
                            return this.my ? (f.isUndefined(h.creeps) && (h.creeps = {}), f.isObject(h.creeps) ? h.creeps[j.name] = h.creeps[j.name] || {} : void 0) : void 0
                        },
                        set memory(a) {
                            if (!this.my) throw new Error("Could not set other player's creep memory");
                            if (f.isUndefined(h.creeps) && (h.creeps = {}), !f.isObject(h.creeps)) throw new Error("Could not set creep memory");
                            h.creeps[j.name] = a
                        },
                        get room() {
                            return c.rooms[j.room]
                        },
                        move: function(a) {
                            return this.my ? j.spawning ? g.ERR_BUSY : j.fatigue > 0 ? g.ERR_TIRED : 0 == this.getActiveBodyparts(g.MOVE) ? g.ERR_NO_BODYPART : (b[i] = b[i] || {}, b[i].move = {
                                direction: a
                            }, g.OK) : g.ERR_NOT_OWNER
                        },
                        moveTo: function(b, c) {
                            var e = this;
                            if (!this.my) return g.ERR_NOT_OWNER;
                            if (j.spawning) return g.ERR_BUSY;
                            if (j.fatigue > 0) return g.ERR_TIRED;
                            if (0 == this.getActiveBodyparts(g.MOVE)) return g.ERR_NO_BODYPART;
                            var h = d.fetchXYArguments(b, c),
                                i = h[0],
                                k = h[1];
                            if (f.isUndefined(i) || f.isUndefined(k)) return g.ERR_INVALID_TARGET;
                            var l = f.isObject(c) ? c : {};
                            if (f.isUndefined(l.reusePath) && (l.reusePath = 5), i == this.pos.x && k == this.pos.y) return g.OK;
                            if (l.reusePath && this.memory && f.isObject(this.memory) && this.memory._move) {
                                var m = this.memory._move;
                                if (a.time > m.time + parseInt(l.reusePath)) delete this.memory._move;
                                else if (m.dest.x == i && m.dest.y == k) {
                                    var n = f.findIndex(m.path, {
                                        x: this.pos.x,
                                        y: this.pos.y
                                    });
                                    if (-1 != n && m.path.splice(0, n + 1), 0 == m.path.length) return g.OK;
                                    var o = f.find(m.path, function(a) {
                                        return a.x - a.dx == e.pos.x && a.y - a.dy == e.pos.y
                                    });
                                    if (o && (!m.last || m.last.x != this.pos.x || m.last.y != this.pos.y)) return m.last = {
                                        x: this.pos.x,
                                        y: this.pos.y
                                    }, this.move(o.direction)
                                }
                            }
                            var p = this.room.findPath(this.pos, {
                                x: i,
                                y: k
                            }, l);
                            return l.reusePath && this.memory && f.isObject(this.memory) && (this.memory._move = {
                                dest: {
                                    x: i,
                                    y: k
                                },
                                time: a.time,
                                path: f.clone(p)
                            }), 0 == p.length ? g.ERR_NO_PATH : this.move(p[0].direction)
                        },
                        harvest: function(a) {
                            return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.WORK) ? g.ERR_NO_BODYPART : a && a.id && c.sources[a.id] ? a.energy ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].harvest = {
                                id: a.id
                            }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
                        },
                        transferEnergy: function(a, d) {
                            return this.my ? j.spawning ? g.ERR_BUSY : 0 > d ? g.ERR_INVALID_ARGS : a && a.id && (c.spawns[a.id] || c.creeps[a.id] || c.structures[a.id]) ? c.structures[a.id] && "extension" != c.structures[a.id].structureType && "spawn" != c.structures[a.id].structureType ? g.ERR_INVALID_TARGET : j.energy ? (d || (d = Math.min(j.energy, a.energyCapacity - a.energy)), this.energy < d ? g.ERR_NOT_ENOUGH_ENERGY : !d || a.energy + d > a.energyCapacity ? g.ERR_FULL : a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].transferEnergy = {
                                id: a.id,
                                amount: d
                            }, g.OK) : g.ERR_NOT_IN_RANGE) : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
                        },
                        pickup: function(a) {
                            return this.my ? j.spawning ? g.ERR_BUSY : a && a.id && c.energy[a.id] ? this.energy >= this.energyCapacity ? g.ERR_FULL : a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].pickup = {
                                id: a.id
                            }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
                        },
                        dropEnergy: function(a) {
                            return this.my ? j.spawning ? g.ERR_BUSY : j.energy ? (a || (a = j.energy), this.energy < a ? g.ERR_NOT_ENOUGH_ENERGY : (b[i] = b[i] || {}, b[i].dropEnergy = {
                                amount: a
                            }, g.OK)) : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_NOT_OWNER
                        },
                        getActiveBodyparts: function(a) {
                            return f.filter(this.body, function(b) {
                                return b.hits > 0 && b.type == a
                            }).length
                        },
                        attack: function(a) {
                            return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.ATTACK) ? g.ERR_NO_BODYPART : a && a.id && (c.creeps[a.id] || c.structures[a.id]) ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].attack = {
                                id: a.id,
                                x: a.pos.x,
                                y: a.pos.y
                            }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
                        },
                        rangedAttack: function(a) {
                            return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.RANGED_ATTACK) ? g.ERR_NO_BODYPART : a && a.id && (c.creeps[a.id] || c.structures[a.id]) ? Math.abs(a.pos.x - this.pos.x) > 3 || Math.abs(a.pos.y - this.pos.y) > 3 ? g.ERR_NOT_IN_RANGE : (b[i] = b[i] || {}, b[i].rangedAttack = {
                                id: a.id
                            }, g.OK) : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
                        },
                        rangedMassAttack: function() {
                            return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.RANGED_ATTACK) ? g.ERR_NO_BODYPART : (b[i] = b[i] || {}, b[i].rangedMassAttack = {}, g.OK) : g.ERR_NOT_OWNER
                        },
                        heal: function(a) {
                            return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.HEAL) ? g.ERR_NO_BODYPART : a && a.id && c.creeps[a.id] && a != this ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].heal = {
                                id: a.id,
                                x: a.pos.x,
                                y: a.pos.y
                            }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
                        },
                        rangedHeal: function(a) {
                            return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.HEAL) ? g.ERR_NO_BODYPART : a && a.id && c.creeps[a.id] && a != this ? Math.abs(a.pos.x - this.pos.x) > 3 || Math.abs(a.pos.y - this.pos.y) > 3 ? g.ERR_NOT_IN_RANGE : (b[i] = b[i] || {}, b[i].rangedHeal = {
                                id: a.id
                            }, g.OK) : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
                        },
                        repair: function(a) {
                            return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.WORK) ? g.ERR_NO_BODYPART : this.energy ? a && a.id && c.structures[a.id] ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].repair = {
                                id: a.id,
                                x: a.pos.x,
                                y: a.pos.y
                            }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_NOT_OWNER
                        },
                        build: function(d) {
                            if (!this.my) return g.ERR_NOT_OWNER;
                            if (j.spawning) return g.ERR_BUSY;
                            if (0 == this.getActiveBodyparts(g.WORK)) return g.ERR_NO_BODYPART;
                            if (!this.energy) return g.ERR_NOT_ENOUGH_ENERGY;
                            if (!d || !d.id || !c.constructionSites[d.id]) return g.ERR_INVALID_TARGET;
                            if (!d.pos.isNearTo(this.pos)) return g.ERR_NOT_IN_RANGE;
                            if (f.contains(["spawn", "extension", "constructedWall"], d.structureType) && f.any(a.roomObjects, function(a) {
                                return a.x == d.pos.x && a.y == d.pos.y && f.contains(g.OBSTACLE_OBJECT_TYPES, a.type)
                            })) return g.ERR_INVALID_TARGET;
                            if ("spawn" == d.structureType) {
                                var e = this.getActiveBodyparts(g.WORK) * g.BUILD_POWER,
                                    h = d.progressTotal - d.progress,
                                    k = Math.min(e, h, this.energy);
                                if (d.progress + k >= d.progressTotal && f.filter(a.roomObjects, function(a) {
                                    return "spawn" == a.type
                                }).length >= 3) return g.ERR_INVALID_TARGET
                            }
                            return b[i] = b[i] || {}, b[i].build = {
                                id: d.id,
                                x: d.pos.x,
                                y: d.pos.y
                            }, g.OK
                        },
                        suicide: function() {
                            return this.my ? j.spawning ? g.ERR_BUSY : (b[i] = b[i] || {}, b[i].suicide = {}, g.OK) : g.ERR_NOT_OWNER
                        },
                        say: function(a) {
                            return this.my ? j.spawning ? g.ERR_BUSY : (b[i] = b[i] || {}, b[i].say = {
                                message: "" + a
                            }, g.OK) : g.ERR_NOT_OWNER
                        }
                    };
                return k
            }
            var j = {};
            for (var k in a.roomObjects) "creep" == a.roomObjects[k].type && (j[k] = i(k));
            return j
        }
    }, {
        "./../utils": 79,
        "./constants": 12,
        "./rooms": 20,
        lodash: 25
    }],
    15: [function(a, b, c) {
        "use strict"; {
            var d = (a("./../utils"), a("./rooms"));
            a("./constants")
        }
        c.make = function(a, b, c) {
            function e(b) {
                var e = a.roomObjects[b];
                return {
                    id: b,
                    toString: function() {
                        return "[energy #" + b + "]"
                    },
                    pos: d.makePos(e.x, e.y, e.room, c),
                    energy: e.energy,
                    get room() {
                        return c.rooms[e.room]
                    }
                }
            }
            var f = {};
            for (var g in a.roomObjects) "energy" == a.roomObjects[g].type && (f[g] = e(g));
            return f
        }
    }, {
        "./../utils": 79,
        "./constants": 12,
        "./rooms": 20
    }],
    16: [function(a, b, c) {
        "use strict"; {
            var d = (a("./../utils"), a("./rooms"));
            a("./constants"), a("lodash")
        }
        c.make = function(a, b, c) {
            function e(b) {
                var e = a.roomObjects[b];
                return {
                    id: b,
                    toString: function() {
                        return "[exit " + e.exit + " #" + b + "]"
                    },
                    pos: d.makePos(e.x, e.y, e.room, c),
                    exit: e.exit,
                    get room() {
                        return c.rooms[e.room]
                    }
                }
            }
            var f = {};
            for (var g in a.roomObjects) "exit" == a.roomObjects[g].type && (f[g] = e(g));
            return f
        }
    }, {
        "./../utils": 79,
        "./constants": 12,
        "./rooms": 20,
        lodash: 25
    }],
    17: [function(a, b, c) {
        "use strict"; {
            var d = (a("./../utils"), a("./rooms")),
                e = a("./constants");
            a("lodash")
        }
        c.make = function(a, b, c) {
            function f(f) {
                var g = a.roomObjects[f];
                return {
                    id: f,
                    name: g.name,
                    toString: function() {
                        return "[flag " + g.name + "]"
                    },
                    pos: d.makePos(g.x, g.y, g.room, c),
                    roomName: g.room,
                    color: g.color,
                    get room() {
                        return c.rooms[g.room]
                    },
                    remove: function() {
                        return b[f] = b[f] || {}, b[f].remove = {}, e.OK
                    }
                }
            }
            var g = {};
            for (var h in a.roomObjects) "flag" == a.roomObjects[h].type && a.roomObjects[h].user == a.user._id && (g[h] = f(h));
            return g
        }
    }, {
        "./../utils": 79,
        "./constants": 12,
        "./rooms": 20,
        lodash: 25
    }],
    18: [function(a, b, c) {
        "use strict";
        ! function() {
            function b(b, c, f, g) {
                var h = {};
                h.creeps = a("./creeps").make(b, c, h, f), h.rooms = a("./rooms").make(b, c, h, f), h.structures = a("./structures").make(b, c, h, f), h.spawns = a("./spawns").make(b, c, h, f), h.sources = a("./sources").make(b, c, h, f), h.energy = a("./energy").make(b, c, h, f), h.flags = a("./flags").make(b, c, h, f), h.constructionSites = a("./construction-sites").make(b, c, h, f), h.exits = a("./exits").make(b, c, h, f);
                var i = {
                        creeps: {},
                        spawns: {},
                        structures: {},
                        flags: {},
                        rooms: d.clone(h.rooms),
                        time: b.time,
                        cpuLimit: b.cpu,
                        getRoom: function(a) {
                            return h.rooms[a] ? h.rooms[a] : null
                        },
                        getObjectById: function(a) {
                            for (var b = ["creeps", "structures", "spawns", "sources", "energy", "flags", "constructionSites", "exits"], c = 0; c < b.length; c++)
                                if (h[b[c]][a]) return h[b[c]][a];
                            return null
                        },
                        getUsedCpu: function(a) {
                            return g(a)
                        }
                    },
                    j = ["rampart", "extension"];
                for (var k in b.userObjects) {
                    if ("creep" == b.userObjects[k].type) {
                        var l = h.creeps[k];
                        i.creeps[l.name] = l
                    }
                    if ("spawn" == b.userObjects[k].type) {
                        var m = h.spawns[k];
                        i.spawns[m.name] = m
                    }
                    if ("flag" == b.userObjects[k].type) {
                        var n = h.flags[k];
                        i.flags[n.name] = n
                    }
                    if (d.contains(j, b.userObjects[k].type)) {
                        var o = h.structures[k];
                        i.structures[o.id] = o
                    }
                }
                return d.extend(i, e), i
            }
            var d = a("lodash"),
                e = (a("pathfinding"), a("./constants")),
                f = a("../core/core"),
                g = a("../utils");
            c.runCode = function(a, c, e, h, i, j, k, l) {
                function m(b) {
                    if (-1 == p[b]) throw new Error("Circular reference to module '" + b + "'");
                    if (!p[b]) {
                        if (d.isUndefined(a[b])) throw new Error("Unknown module '" + b + "'");
                        p[b] = -1;
                        var e = {
                            exports: {},
                            user: c.user._id,
                            timestamp: c.userCodeTimestamp,
                            name: b,
                            code: a[b]
                        };
                        f.evalCode(e, o, h, i, m, !1, k), p[b] = e.exports
                    }
                    return p[b]
                }
                var n = c.roomTerrain[d.findKey(c.roomTerrain)];
                "terrain" == n.type && (c.roomTerrain = g.decodeTerrain(c.roomTerrain));
                var o = b(c, e, h, l),
                    p = {
                        lodash: d,
                        map: {}
                    };
                "2" == c.user._id && (a = {
                    main: "var _ = require('lodash'), healer = require('healer'), findAttack = require('findAttack'); for(var i in Game.creeps) { var creep = Game.creeps[i]; if(creep.getActiveBodyparts('heal') > 0) { healer(creep); } else if(/Defend/.test(creep.name)) { findAttack(Game.creeps[i], false, true); } else if(/Siege/.test(creep.name)) { findAttack(Game.creeps[i], true); } else { findAttack(Game.creeps[i], false); } } for(var i in Memory.creeps) { if(!Game.creeps[i]) { delete Memory.creeps[i]; } }",
                    findAttack: "module.exports = function (creep, ignoreCreeps, defend) { function find(opts) { opts = opts || {}; var target, possibleTargets = creep.room.find(Game.HOSTILE_SPAWNS); if (!ignoreCreeps) { possibleTargets = possibleTargets.concat(creep.room.find(Game.HOSTILE_CREEPS)); } target = creep.pos.findClosest(possibleTargets, opts); if (target) { creep.moveTo(target, opts); } return target; } var target, healers = creep.room.find(Game.MY_CREEPS, { filter: function (i) { return i.getActiveBodyparts('heal') > 0; } }); if (defend) { var siege = creep.room.find(Game.MY_CREEPS, { filter: function (i) { return /Siege/.test(i.name); } }); if (siege.length > 0) { target = siege[0]; creep.moveTo(target); } } if (!target && creep.hits < creep.hitsMax / 2 && healers.length > 0) { target = creep.pos.findClosest(Game.MY_CREEPS, { filter: function (i) { return i.getActiveBodyparts('heal') > 0; } }); if (!target || creep.moveTo(target) != Game.OK) { target = null; } } var nearCreeps = creep.pos.findInRange(Game.HOSTILE_CREEPS, 1); if (nearCreeps) { creep.attack(nearCreeps[0]); } if (!target) { target = find(); if (!target && !ignoreCreeps) { target = find({ignoreDestructibleStructures: true}); } if (!target && ignoreCreeps) { var hostileCreeps = creep.room.find(Game.HOSTILE_CREEPS); target = find({ignoreDestructibleStructures: true, ignore: hostileCreeps}); } if (!target) { target = creep.pos.findClosest(Game.HOSTILE_CREEPS); if (target) { creep.moveTo(target); } } if (!target) { target = creep.pos.findClosest(Game.HOSTILE_CREEPS, {ignoreDestructibleStructures: true}); if (target) { creep.moveTo(target, {ignoreDestructibleStructures: true}); } } if (!target) { return; } creep.attack(target); } if (creep.getActiveBodyparts(Game.RANGED_ATTACK)) { require('shootAtWill')(creep); } }",
                    healer: "module.exports = function(creep) { var target = creep.pos.findNearest(Game.MY_CREEPS, {filter: function(i) { return i != creep && i.hits < i.hitsMax; }}); if(!target) { target = creep.pos.findNearest(Game.MY_CREEPS, {filter: function(i) { return i != creep && i.getActiveBodyparts(Game.HEAL) == 0; }}); } if(!target) { return; } if(creep.pos.isNearTo(target)) { creep.heal(target); } else { creep.rangedHeal(target); } creep.moveTo(target); if(creep.getActiveBodyparts(Game.RANGED_ATTACK)) { require('shootAtWill')(creep); } }",
                    shootAtWill: "module.exports = function (creep) { var targets = creep.pos.findInRange(Game.HOSTILE_CREEPS, 3).concat(creep.pos.findInRange(Game.HOSTILE_SPAWNS, 3)); var massDmg = 0, distanceDmg = {1: 10, 2: 4, 3: 1}; for(var i in targets) { var distance = Math.max(Math.abs(targets[i].pos.x - creep.pos.x), Math.abs(targets[i].pos.y - creep.pos.y)); massDmg += distanceDmg[distance]; } if(massDmg > 13) { creep.rangedMassAttack(); } else { var min = -1, target; for (var i in targets) { if (min == -1 || min > targets[i].hits) { target = targets[i]; min = targets[i].hits; } } creep.rangedAttack(target); } }"
                }), m("main");
                for (var q = 0; q < j.length; q++) i.commandResult(f.evalCode({
                    exports: {},
                    name: "_console" + q,
                    code: j[q]
                }, o, h, i, m, !0))
            }
        }()
    }, {
        "../core/core": 3,
        "../utils": 79,
        "./constants": 12,
        "./construction-sites": 13,
        "./creeps": 14,
        "./energy": 15,
        "./exits": 16,
        "./flags": 17,
        "./rooms": 20,
        "./sources": 21,
        "./spawns": 22,
        "./structures": 23,
        lodash: 25,
        pathfinding: 26
    }],
    19: [function(a, b, c) {
        "use strict";
        var d = ["Jackson", "Aiden", "Liam", "Lucas", "Noah", "Mason", "Jayden", "Ethan", "Jacob", "Jack", "Caden", "Logan", "Benjamin", "Michael", "Caleb", "Ryan", "Alexander", "Elijah", "James", "William", "Oliver", "Connor", "Matthew", "Daniel", "Luke", "Brayden", "Jayce", "Henry", "Carter", "Dylan", "Gabriel", "Joshua", "Nicholas", "Isaac", "Owen", "Nathan", "Grayson", "Eli", "Landon", "Andrew", "Max", "Samuel", "Gavin", "Wyatt", "Christian", "Hunter", "Cameron", "Evan", "Charlie", "David", "Sebastian", "Joseph", "Dominic", "Anthony", "Colton", "John", "Tyler", "Zachary", "Thomas", "Julian", "Levi", "Adam", "Isaiah", "Alex", "Aaron", "Parker", "Cooper", "Miles", "Chase", "Muhammad", "Christopher", "Blake", "Austin", "Jordan", "Leo", "Jonathan", "Adrian", "Colin", "Hudson", "Ian", "Xavier", "Camden", "Tristan", "Carson", "Jason", "Nolan", "Riley", "Lincoln", "Brody", "Bentley", "Nathaniel", "Josiah", "Declan", "Jake", "Asher", "Jeremiah", "Cole", "Mateo", "Micah", "Elliot"],
            e = ["Sophia", "Emma", "Olivia", "Isabella", "Mia", "Ava", "Lily", "Zoe", "Emily", "Chloe", "Layla", "Madison", "Madelyn", "Abigail", "Aubrey", "Charlotte", "Amelia", "Ella", "Kaylee", "Avery", "Aaliyah", "Hailey", "Hannah", "Addison", "Riley", "Harper", "Aria", "Arianna", "Mackenzie", "Lila", "Evelyn", "Adalyn", "Grace", "Brooklyn", "Ellie", "Anna", "Kaitlyn", "Isabelle", "Sophie", "Scarlett", "Natalie", "Leah", "Sarah", "Nora", "Mila", "Elizabeth", "Lillian", "Kylie", "Audrey", "Lucy", "Maya", "Annabelle", "Makayla", "Gabriella", "Elena", "Victoria", "Claire", "Savannah", "Peyton", "Maria", "Alaina", "Kennedy", "Stella", "Liliana", "Allison", "Samantha", "Keira", "Alyssa", "Reagan", "Molly", "Alexandra", "Violet", "Charlie", "Julia", "Sadie", "Ruby", "Eva", "Alice", "Eliana", "Taylor", "Callie", "Penelope", "Camilla", "Bailey", "Kaelyn", "Alexis", "Kayla", "Katherine", "Sydney", "Lauren", "Jasmine", "London", "Bella", "Adeline", "Caroline", "Vivian", "Juliana", "Gianna", "Skyler", "Jordyn"];
        c.getUniqueName = function(a) {
            var b, c, f = 0;
            do {
                var g = Math.random() > .5 ? d : e;
                b = g[Math.floor(Math.random() * g.length)], f > 3 && (b += g[Math.floor(Math.random() * g.length)]), f++, c = a(b)
            } while (c);
            return b
        }
    }, {}],
    20: [function(a, b, c) {
        "use strict";
        var d = a("lodash"),
            e = a("./constants"),
            f = a("pathfinding"),
            g = a("./../utils");
        c.make = function(a, b, h) {
            function i(i) {
                function l(a) {
                    a = a || {}, d.defaults(a, {
                        maxOps: 2e3,
                        heuristicWeight: 3
                    });
                    var b = a.maxOps + "," + a.heuristicWeight;
                    return q[b] || (q[b] = new f.AStarFinder({
                        allowDiagonal: !0,
                        maxOpsLimit: a.maxOps,
                        heuristic: f.Heuristic.chebyshev,
                        weight: a.heuristicWeight
                    })), q[b]
                }

                function m(b, c) {
                    b = b || {};
                    var g = [],
                        h = d.clone(e.OBSTACLE_OBJECT_TYPES);
                    b.ignoreDestructibleStructures && (h = d.without(h, "constructedWall", "spawn", "extension")), b.ignoreCreeps && (h = d.without(h, "creep"));
                    for (var j = 0; 50 > j; j++) {
                        for (var k = [], l = 0; 50 > l; l++) k.push(b.withinRampartsOnly ? 0 : 2);
                        g.push(k)
                    }
                    if (["roomObjects", "roomTerrain"].forEach(function(c) {
                        d.forEach(a[c], function(c) {
                            c.room == i && ((d.contains(h, c.type) || !b.ignoreDestructibleStructures && "rampart" == c.type && c.user != a.user._id) && (g[c.y][c.x] = 0), b.withinRampartsOnly && "rampart" == c.type && c.user == a.user._id && (g[c.y][c.x] = 2))
                        })
                    }), b.ignore) {
                        if (!d.isArray(b.ignore)) throw new Error("option `ignore` is not an array");
                        d.forEach(b.ignore, function(a) {
                            a && (a.pos && (g[a.pos.y][a.pos.x] = 2), d.isUndefined(a.x) || (g[a.y][a.x] = 2))
                        })
                    }
                    if (["roomObjects", "roomTerrain"].forEach(function(b) {
                        d.forEach(a[b], function(a) {
                            a.room == i && "swamp" == a.type && 2 == g[a.y][a.x] && (g[a.y][a.x] = 10), a.room == i && "road" == a.type && g[a.y][a.x] > 0 && (g[a.y][a.x] = 1)
                        })
                    }), b.avoid) {
                        if (!d.isArray(b.avoid)) throw new Error("option `avoid` is not an array");
                        d.forEach(b.avoid, function(a) {
                            a && (a.pos && (g[a.pos.y][a.pos.x] = 0), d.isUndefined(a.x) || (g[a.y][a.x] = 0))
                        })
                    }
                    return c && d.forEach(r[c], function(a) {
                        return g[a.pos.y][a.pos.x] = 999
                    }), new f.Grid(50, 50, g)
                }

                function n(a, b) {
                    var c = "grid";
                    return a = a || {}, a.ignoreCreeps && (c += "_ignoreCreeps"), a.ignoreDestructibleStructures && (c += "_ignoreDestructibleStructures"), a.withinRampartsOnly && (c += "_withinRampartsOnly"), d.isNumber(b) && (c += "_endNodes" + b), a.avoid && (c += "_avoid" + u.key(a.avoid)), a.ignore && (c += "_ignore" + u.key(a.ignore)), p[c] || (p[c] = m(a, b)), p[c].clone()
                }
                var o, p = (a.rooms[i], {}),
                    q = {},
                    r = {},
                    s = new f.DijkstraFinder({
                        allowDiagonal: !0
                    }),
                    t = {},
                    u = {
                        cache: {},
                        key: function(a) {
                            if (!d.isArray(a)) return 0;
                            var b = d.map(a, function(a) {
                                    return a.pos ? a.pos : a
                                }),
                                c = d.findKey(this.cache, function(a) {
                                    return d.every(b, function(b) {
                                        return d.any(a, function(a) {
                                            return b.equalsTo(a)
                                        })
                                    }) && b.length == a.length
                                });
                            return void 0 === c ? (c = (new Date).getTime() + Math.floor(1e5 * Math.random()), this.cache[c] = a) : c = parseInt(c), c
                        }
                    };
                return o = {}, Object.defineProperty(o, "name", {
                    value: i,
                    configurable: !0,
                    enumerable: !0,
                    writable: !0
                }), Object.defineProperty(o, "mode", {
                    value: "sim" == i ? e.MODE_SIMULATION : e.MODE_SURVIVAL,
                    configurable: !0,
                    enumerable: !0,
                    writable: !0
                }), Object.defineProperty(o, "toString", {
                    value: function() {
                        return "[room " + i + "]"
                    },
                    configurable: !0,
                    enumerable: !0,
                    writable: !0
                }), Object.defineProperty(o, "find", {
                    value: function(a, b) {
                        var c, f = this;
                        switch (b = b || {}, a) {
                            case e.CREEPS:
                                c = d.where(h.creeps, function(a) {
                                    return a.room == f && !a.spawning
                                });
                                break;
                            case e.MY_CREEPS:
                                c = d.where(h.creeps, function(a) {
                                    return a.room == f && !a.spawning && a.my
                                });
                                break;
                            case e.HOSTILE_CREEPS:
                                c = d.where(h.creeps, function(a) {
                                    return a.room == f && !a.spawning && !a.my
                                });
                                break;
                            case e.MY_SPAWNS:
                                c = d.where(h.spawns, function(a) {
                                    return a.room == f && a.my === !0
                                });
                                break;
                            case e.HOSTILE_SPAWNS:
                                c = d.where(h.spawns, function(a) {
                                    return a.room == f && a.my === !1
                                });
                                break;
                            case e.SOURCES_ACTIVE:
                                c = d.where(h.sources, function(a) {
                                    return a.room == f && !a.spawning && a.energy > 0
                                });
                                break;
                            case e.SOURCES:
                                c = d.where(h.sources, function(a) {
                                    return a.room == f
                                });
                                break;
                            case e.DROPPED_ENERGY:
                                c = d.where(h.energy, function(a) {
                                    return a.room == f
                                });
                                break;
                            case e.STRUCTURES:
                                c = d.where(h.structures, function(a) {
                                    return a.room == f
                                });
                                break;
                            case e.MY_STRUCTURES:
                                c = d.where(h.structures, function(a) {
                                    return a.room == f && a.my === !0
                                });
                                break;
                            case e.HOSTILE_STRUCTURES:
                                c = d.where(h.structures, function(a) {
                                    return a.room == f && a.my === !1
                                });
                                break;
                            case e.FLAGS:
                                c = d.where(h.flags, function(a) {
                                    return a.room == f
                                });
                                break;
                            case e.CONSTRUCTION_SITES:
                                c = d.where(h.constructionSites, function(a) {
                                    return a.room == f && a.my
                                });
                                break;
                            case e.EXIT_TOP:
                                c = d.where(h.exits, function(a) {
                                    return a.room == f && a.exit == e.TOP
                                });
                                break;
                            case e.EXIT_RIGHT:
                                c = d.where(h.exits, function(a) {
                                    return a.room == f && a.exit == e.RIGHT
                                });
                                break;
                            case e.EXIT_BOTTOM:
                                c = d.where(h.exits, function(a) {
                                    return a.room == f && a.exit == e.BOTTOM
                                });
                                break;
                            case e.EXIT_LEFT:
                                c = d.where(h.exits, function(a) {
                                    return a.room == f && a.exit == e.LEFT
                                });
                                break;
                            default:
                                c = []
                        }
                        return b.filter && (c = d.filter(c, b.filter)), c
                    },
                    configurable: !0,
                    enumerable: !0,
                    writable: !0
                }), Object.defineProperty(o, "lookAt", {
                    value: function(b, c) {
                        function e(a, b) {
                            var c = d.where(b, {
                                pos: {
                                    x: j,
                                    y: k
                                }
                            });
                            c.length && (l = l.concat(d.map(c, function(b) {
                                var c;
                                return new Object((c = {}, Object.defineProperty(c, "type", {
                                    value: a,
                                    configurable: !0,
                                    enumerable: !0,
                                    writable: !0
                                }), Object.defineProperty(c, a, {
                                    value: b,
                                    configurable: !0,
                                    enumerable: !0,
                                    writable: !0
                                }), c))
                            })))
                        }
                        var f = g.fetchXYArguments(b, c),
                            j = f[0],
                            k = f[1],
                            l = [];
                        return e("creep", h.creeps), e("energy", h.energy), e("source", h.sources), e("structure", h.structures), e("flag", h.flags), e("constructionSite", h.constructionSites), e("exit", h.exits), ["roomObjects", "roomTerrain"].forEach(function(b) {
                            d.any(a[b], {
                                room: i,
                                x: j,
                                y: k,
                                type: "wall"
                            }) && l.push({
                                type: "terrain",
                                terrain: "wall"
                            }), d.any(a[b], {
                                room: i,
                                x: j,
                                y: k,
                                type: "swamp"
                            }) && l.push({
                                type: "terrain",
                                terrain: "swamp"
                            })
                        }), d.any(l, {
                            type: "terrain"
                        }) || l.push({
                            type: "terrain",
                            terrain: "plain"
                        }), l
                    },
                    configurable: !0,
                    enumerable: !0,
                    writable: !0
                }), Object.defineProperty(o, "lookAtArea", {
                    value: function(b, c, e, f) {
                        function g(a, g) {
                            var h = g;
                            (b > 0 || c > 0 || 49 > e || 49 > f) && (h = d.where(g, n)), d.forEach(h, function(b) {
                                var c;
                                k[b.pos.y][b.pos.x].push((c = {}, Object.defineProperty(c, "type", {
                                    value: a,
                                    configurable: !0,
                                    enumerable: !0,
                                    writable: !0
                                }), Object.defineProperty(c, a, {
                                    value: b,
                                    configurable: !0,
                                    enumerable: !0,
                                    writable: !0
                                }), c))
                            })
                        }
                        for (var j = this, k = {}, l = b; e >= l; l++) {
                            k[l] = {};
                            for (var m = c; f >= m; m++) k[l][m] = []
                        }
                        var n = function(a) {
                            return (a.room == j || a.room == i) && a.pos && a.pos.y >= b && a.pos.y <= e && a.pos.x >= c && a.pos.x <= f || !a.pos && a.y >= b && a.y <= e && a.x >= c && a.x <= f
                        };
                        g("creep", h.creeps), g("energy", h.energy), g("source", h.sources), g("structure", h.structures), g("flag", h.flags), g("constructionSite", h.constructionSites), g("exit", h.exits), ["roomObjects", "roomTerrain"].forEach(function(g) {
                            var h = a[g];
                            (b > 0 || c > 0 || 49 > e || 49 > f) && (h = d.where(a[g], function(a) {
                                return ("wall" == a.type || "swamp" == a.type) && n(a)
                            })), d.forEach(h, function(a) {
                                "wall" != a.type && "swamp" != a.type || 0 != k[a.y][a.x].length && "terrain" == k[a.y][a.x][k[a.y][a.x].length - 1].type || k[a.y][a.x].push({
                                    type: "terrain",
                                    terrain: a.type
                                })
                            })
                        });
                        for (var l = b; e >= l; l++)
                            for (var m = c; f >= m; m++)(0 == k[l][m].length || "terrain" != k[l][m][k[l][m].length - 1].type) && k[l][m].push({
                                type: "terrain",
                                terrain: "plain"
                            });
                        return k
                    },
                    configurable: !0,
                    enumerable: !0,
                    writable: !0
                }), Object.defineProperty(o, "findPath", {
                    value: function(a, b, c) {
                        var e, f = a.x,
                            h = a.y,
                            i = "";
                        if (c = d.clone(c || {}), c.ignoreCreeps && (i += "_ignoreCreeps"), c.ignoreDestructibleStructures && (i += "_ignoreDestructibleStructures"), c.withinRampartsOnly && (i += "_withinRampartsOnly"), c.avoid && (i += "_avoid" + u.key(c.avoid)), c.ignore && (i += "_ignore" + u.key(c.ignore)), d.isNumber(b)) {
                            if (!r[b]) return [];
                            var j = n(c, b);
                            e = s.findPath(f, h, -1, -1, j)
                        } else {
                            var k = b.x,
                                m = b.y,
                                o = f + "," + h + "," + k + "," + m + i;
                            if (t[o]) return d.cloneDeep(t[o]);
                            if (f == k && h == m) return [];
                            if (0 > f || 0 > h || 0 > k || 0 > m || f >= 50 || h >= 50 || k >= 50 || m >= 50) return [];
                            if (Math.abs(f - k) < 2 && Math.abs(h - m) < 2) return [{
                                x: k,
                                y: m,
                                dx: k - f,
                                dy: m - h,
                                direction: g.getDirection(k - f, m - h)
                            }];
                            var j = n(c),
                                p = l(c);
                            j.setWalkableAt(k, m, !0), e = p.findPath(f, h, k, m, j)
                        }
                        e.splice(0, 1);
                        var q = f,
                            v = h,
                            w = d.map(e, function(a) {
                                var b = {
                                    x: a[0],
                                    y: a[1],
                                    dx: a[0] - q,
                                    dy: a[1] - v,
                                    direction: g.getDirection(a[0] - q, a[1] - v)
                                };
                                return q = b.x, v = b.y, b
                            });
                        if (w.length > 0) {
                            var x = w[w.length - 1],
                                o = f + "," + h + "," + x.x + "," + x.y + i;
                            t[o] = d.cloneDeep(w)
                        }
                        return w
                    },
                    configurable: !0,
                    enumerable: !0,
                    writable: !0
                }), Object.defineProperty(o, "getPositionAt", {
                    value: function(a, b) {
                        return 0 > a || a > 49 || 0 > b || b > 49 ? null : c.makePos(a, b, i, h)
                    },
                    configurable: !0,
                    enumerable: !0,
                    writable: !0
                }), Object.defineProperty(o, "createFlag", {
                    value: function(a, c, f, k) {
                        var l = g.fetchXYArguments(a, c),
                            m = l[0],
                            n = l[1];
                        if (d.isUndefined(m) || d.isUndefined(n) || 0 > m || m > 49 || 0 > n || n > 49) return e.ERR_INVALID_ARGS;
                        if (d.isObject(a) && (k = f, f = c), k || (k = "white"), !d.contains(["white", "grey", "red", "purple", "blue", "cyan", "green", "yellow", "orange", "brown"], k)) return e.ERR_INVALID_ARGS;
                        if (!f) {
                            var o = 1;
                            do f = "Flag" + o, o++; while (d.any(h.flags, {
                                name: f
                            }) || -1 != j.indexOf(f))
                        }
                        return d.any(h.flags, {
                            name: f
                        }) || -1 != j.indexOf(f) ? e.ERR_NAME_EXISTS : (j.push(f), b.room = b.room || {}, b.room.createFlag = b.room.createFlag || [], b.room.createFlag.push({
                            roomName: i,
                            x: m,
                            y: n,
                            name: f,
                            color: k
                        }), f)
                    },
                    configurable: !0,
                    enumerable: !0,
                    writable: !0
                }), Object.defineProperty(o, "createConstructionSite", {
                    value: function(c, f, j) {
                        var l = g.fetchXYArguments(c, f),
                            m = l[0],
                            n = l[1];
                        if (d.isUndefined(m) || d.isUndefined(n) || 0 > m || m > 49 || 0 > n || n > 49) return e.ERR_INVALID_ARGS;
                        if (d.isString(f) && d.isUndefined(j) && (j = f), !d.contains(["spawn", "extension", "road", "rampart", "constructedWall"], j)) return e.ERR_INVALID_ARGS;
                        if (!g.checkConstructionSite(a.roomObjects, j, m, n) || !g.checkConstructionSite(a.roomTerrain, j, m, n)) return e.ERR_INVALID_TARGET;
                        var o = {
                            roomName: i,
                            x: m,
                            y: n,
                            structureType: j
                        };
                        if ("spawn" == j) {
                            var p, q = 1;
                            do p = "Spawn" + q, q++; while (d.any(h.spawns, {
                                name: p
                            }) || d.any(h.constructionSites, {
                                structureType: "spawn",
                                name: p
                            }) || -1 != k.indexOf(p));
                            k.push(p), o.name = p
                        }
                        return b.room = b.room || {}, b.room.createConstructionSite = b.room.createConstructionSite || [], b.room.createConstructionSite.push(o), e.OK
                    },
                    configurable: !0,
                    enumerable: !0,
                    writable: !0
                }), Object.defineProperty(o, "getEndNodes", {
                    value: function(a, b) {
                        var c;
                        return b = b || {}, !b.filter && d.isNumber(a) ? c = a : (d.isNumber(a) && (a = this.find(a, b)), c = u.key(a), r[c] = u.cache[c]), r[c] || (r[c] = a, d.isNumber(a) && (r[c] = this.find(a, b))), {
                            key: c,
                            objects: r[c]
                        }
                    },
                    configurable: !0,
                    enumerable: !0,
                    writable: !0
                }), o
            }
            var j = [],
                k = [],
                l = {};
            for (var m in a.rooms) l[m] = i(m);
            return l
        }, c.makePos = function(a, b, c, e) {
            return {
                x: a,
                y: b,
                roomName: c,
                toString: function() {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                inRangeTo: function(a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                isNearTo: function(a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                getDirectionTo: function(a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                findPathTo: function(a, b) {
                    var f = d.isObject(b) ? d.clone(b) : {},
                        h = g.fetchXYArguments(a, b),
                        i = h[0],
                        j = h[1],
                        k = e.rooms[c];
                    if (!k) throw new Error("Could not access a room " + c);
                    return k.findPath(this, {
                        x: i,
                        y: j
                    }, f)
                },
                findNearest: function(a, b) {
                    return this.findClosest(a, b)
                },
                findClosest: function(a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function(a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function(a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function(a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function(a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                findInRange: function(a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function(a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                equalsTo: function(a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            }
        }
    }, {
        "./../utils": 79,
        "./constants": 12,
        lodash: 25,
        pathfinding: 26
    }],
    21: [function(a, b, c) {
        "use strict"; {
            var d = (a("./../utils"), a("./rooms"));
            a("./constants")
        }
        c.make = function(a, b, c) {
            function e(b) {
                var e = a.roomObjects[b];
                return {
                    id: b,
                    toString: function() {
                        return "[source #" + b + "]"
                    },
                    pos: d.makePos(e.x, e.y, e.room, c),
                    energy: e.energy,
                    energyCapacity: e.energyCapacity,
                    ticksToRegeneration: e.ticksToRegeneration,
                    get room() {
                        return c.rooms[e.room]
                    }
                }
            }
            var f = {};
            for (var g in a.roomObjects) "source" == a.roomObjects[g].type && (f[g] = e(g));
            return f
        }
    }, {
        "./../utils": 79,
        "./constants": 12,
        "./rooms": 20
    }],
    22: [function(a, b, c) {
        "use strict";
        var d = a("./../utils"),
            e = a("./rooms"),
            f = a("lodash"),
            g = a("./constants");
        c.make = function(b, c, h, i) {
            function j(j) {
                var l = b.roomObjects[j];
                return {
                    id: j,
                    name: l.user == b.user._id ? l.name : void 0,
                    toString: function() {
                        return "[spawn " + (l.user == b.user._id ? l.name : "#" + j) + "]"
                    },
                    pos: e.makePos(l.x, l.y, l.room, h),
                    owner: {
                        username: "Player " + l.user
                    },
                    my: l.user == b.user._id,
                    structureType: "spawn",
                    spawning: l.spawning,
                    energy: l.energy,
                    energyCapacity: l.energyCapacity,
                    hits: l.hits,
                    hitsMax: l.hitsMax,
                    get memory() {
                        return this.my ? (f.isUndefined(i.spawns) && (i.spawns = {}), f.isObject(i.spawns) ? i.spawns[l.name] = i.spawns[l.name] || {} : void 0) : void 0
                    },
                    set memory(a) {
                        if (!this.my) throw new Error("Could not set other player's spawn memory");
                        if (f.isUndefined(i.spawns) && (i.spawns = {}), !f.isObject(i.spawns)) throw new Error("Could not set spawn memory");
                        i.spawns[l.name] = a
                    },
                    get room() {
                        return h.rooms[l.room]
                    },
                    createCreep: function(e, h, m) {
                        if (!this.my) return g.ERR_NOT_OWNER;
                        if (l.spawning) return g.ERR_BUSY;
                        if (!e || !f.isArray(e) || 0 == e.length) return g.ERR_INVALID_ARGS;
                        for (var n = 0; n < e.length; n++)
                            if (!f.contains(g.BODYPARTS_ALL, e[n])) return g.ERR_INVALID_ARGS;
                        if (l.energy < d.calcCreepCost(e)) return g.ERR_NOT_ENOUGH_ENERGY;
                        var o = f.without(e, "tough").length - 5;
                        if (o > 0) {
                            var p = f.filter(b.roomObjects, function(a) {
                                return "extension" == a.type && a.room == l.room && a.user == l.user && a.energy >= g.EXTENSION_ENERGY_COST
                            });
                            if (p.length < o) return g.ERR_NOT_ENOUGH_EXTENSIONS
                        }
                        if (h) {
                            if (f.any(b.roomObjects, {
                                type: "creep",
                                user: l.user,
                                name: h
                            })) return g.ERR_NAME_EXISTS
                        } else h = a("./names").getUniqueName(function(a) {
                            return f.any(b.roomObjects, {
                                type: "creep",
                                user: l.user,
                                name: a
                            }) || -1 != k.indexOf(a)
                        });
                        return k.push(h), f.isUndefined(i.creeps) && (i.creeps = {}), f.isObject(i.creeps) && (i.creeps[h] = f.isUndefined(m) ? i.creeps[h] || {} : m), c[j] = c[j] || {}, c[j].createCreep = {
                            name: h,
                            body: e
                        }, h
                    },
                    transferEnergy: function(a, b) {
                        return this.my ? a && a.id && h.creeps[a.id] ? l.energy ? (b || (b = l.energy), this.energy < b ? g.ERR_NOT_ENOUGH_ENERGY : a.energy == a.energyCapacity ? g.ERR_FULL : a.pos.isNearTo(this.pos) ? (c[j] = c[j] || {}, c[j].transferEnergy = {
                            id: a.id,
                            amount: b
                        }, g.OK) : g.ERR_NOT_IN_RANGE) : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
                    }
                }
            }
            var k = [],
                l = {};
            for (var m in b.roomObjects) "spawn" == b.roomObjects[m].type && (l[m] = j(m), h.structures[m] = l[m]);
            return l
        }
    }, {
        "./../utils": 79,
        "./constants": 12,
        "./names": 19,
        "./rooms": 20,
        lodash: 25
    }],
    23: [function(a, b, c) {
        "use strict";
        var d = (a("./../utils"), a("./rooms")),
            e = (a("./constants"), a("lodash"));
        c.make = function(a, b, c) {
            function f(b) {
                var f = a.roomObjects[b];
                return {
                    id: b,
                    toString: function() {
                        return "[structure (" + f.type + ") #" + b + "]"
                    },
                    pos: d.makePos(f.x, f.y, f.room, c),
                    hits: f.hits,
                    hitsMax: f.hitsMax,
                    energy: f.energy,
                    energyCapacity: f.energyCapacity,
                    user: f.user,
                    my: e.isUndefined(f.user) ? void 0 : f.user == a.user._id,
                    structureType: f.type,
                    get room() {
                        return c.rooms[f.room]
                    }
                }
            }
            var g = {},
                h = ["rampart", "road", "extension", "constructedWall"];
            for (var i in a.roomObjects) e.contains(h, a.roomObjects[i].type) && (g[i] = f(i));
            return g
        }
    }, {
        "./../utils": 79,
        "./constants": 12,
        "./rooms": 20,
        lodash: 25
    }],
    24: [function(a) {
        "use strict";

        function b() {
            var a, e = new Date;
            "undefined" == typeof self && (a = setTimeout(function() {
                g.reset(), h.reset()
            }, 1e4)), d.getAllUsers().then(function(a) {
                return g.addMulti(f.map(a, function(a) {
                    return a._id.toString()
                }))
            }).then(function() {
                    return g.whenAllDone()
                }).then(function() {
                    return d.getAllRooms()
                }).then(function(a) {
                    return h.addMulti(f.map(a, function(a) {
                        return a._id.toString()
                    }))
                }).then(function() {
                    return h.whenAllDone()
                }).then(function() {
                    return d.incrementGameTime()
                }).then(function() {
                    return d.notifyRoomsDone()
                }).catch(function(a) {}).finally(function() {
                    a && clearTimeout(a), setTimeout(b, Math.max(c - (new Date).getTime() + e.getTime(), 0))
                })
        }
        var c, d = a("./core/core.js"),
            e = a("q"),
            f = a("lodash"),
            g = d.queue.create("users"),
            h = d.queue.create("rooms");
        d.connect().then(function() {
            return d.getTickPeriod()
        }).then(function(a) {
                c = a, b()
            }), "undefined " == typeof self && setInterval(function() {
            var a = e.getUnhandledReasons();
            a.forEach(function(a) {
                return void 0
            }), e.resetUnhandledRejections()
        }, 1e3)
    }, {
        "./core/core.js": 3,
        lodash: 25,
        q: 46
    }],
    25: [function(a, b, c) {
        arguments[4][6][0].apply(c, arguments)
    }, {
        dup: 6
    }],
    26: [function(a, b) {
        b.exports = a("./src/PathFinding")
    }, {
        "./src/PathFinding": 29
    }],
    27: [function(a, b) {
        b.exports = a("./lib/heap")
    }, {
        "./lib/heap": 28
    }],
    28: [function(a, b) {
        (function() {
            var a, c, d, e, f, g, h, i, j, k, l, m, n, o, p;
            d = Math.floor, k = Math.min, c = function(a, b) {
                return b > a ? -1 : a > b ? 1 : 0
            }, j = function(a, b, e, f, g) {
                var h;
                if (null == e && (e = 0), null == g && (g = c), 0 > e) throw new Error("lo must be non-negative");
                for (null == f && (f = a.length); f > e;) h = d((e + f) / 2), g(b, a[h]) < 0 ? f = h : e = h + 1;
                return [].splice.apply(a, [e, e - e].concat(b)), b
            }, g = function(a, b, d) {
                return null == d && (d = c), a.push(b), o(a, 0, a.length - 1, d)
            }, f = function(a, b) {
                var d, e;
                return null == b && (b = c), d = a.pop(), a.length ? (e = a[0], a[0] = d, p(a, 0, b)) : e = d, e
            }, i = function(a, b, d) {
                var e;
                return null == d && (d = c), e = a[0], a[0] = b, p(a, 0, d), e
            }, h = function(a, b, d) {
                var e;
                return null == d && (d = c), a.length && d(a[0], b) < 0 && (e = [a[0], b], b = e[0], a[0] = e[1], p(a, 0, d)), b
            }, e = function(a, b) {
                var e, f, g, h, i, j;
                for (null == b && (b = c), h = function() {
                    j = [];
                    for (var b = 0, c = d(a.length / 2); c >= 0 ? c > b : b > c; c >= 0 ? b++ : b--) j.push(b);
                    return j
                }.apply(this).reverse(), i = [], f = 0, g = h.length; g > f; f++) e = h[f], i.push(p(a, e, b));
                return i
            }, n = function(a, b, d) {
                var e;
                return null == d && (d = c), e = a.indexOf(b), -1 !== e ? (o(a, 0, e, d), p(a, e, d)) : void 0
            }, l = function(a, b, d) {
                var f, g, i, j, k;
                if (null == d && (d = c), g = a.slice(0, b), !g.length) return g;
                for (e(g, d), k = a.slice(b), i = 0, j = k.length; j > i; i++) f = k[i], h(g, f, d);
                return g.sort(d).reverse()
            }, m = function(a, b, d) {
                var g, h, i, l, m, n, o, p, q, r;
                if (null == d && (d = c), 10 * b <= a.length) {
                    if (l = a.slice(0, b).sort(d), !l.length) return l;
                    for (i = l[l.length - 1], p = a.slice(b), m = 0, o = p.length; o > m; m++) g = p[m], d(g, i) < 0 && (j(l, g, 0, null, d), l.pop(), i = l[l.length - 1]);
                    return l
                }
                for (e(a, d), r = [], h = n = 0, q = k(b, a.length); q >= 0 ? q > n : n > q; h = q >= 0 ? ++n : --n) r.push(f(a, d));
                return r
            }, o = function(a, b, d, e) {
                var f, g, h;
                for (null == e && (e = c), f = a[d]; d > b && (h = d - 1 >> 1, g = a[h], e(f, g) < 0);) a[d] = g, d = h;
                return a[d] = f
            }, p = function(a, b, d) {
                var e, f, g, h, i;
                for (null == d && (d = c), f = a.length, i = b, g = a[b], e = 2 * b + 1; f > e;) h = e + 1, f > h && !(d(a[e], a[h]) < 0) && (e = h), a[b] = a[e], b = e, e = 2 * b + 1;
                return a[b] = g, o(a, i, b, d)
            }, a = function() {
                function a(a) {
                    this.cmp = null != a ? a : c, this.nodes = []
                }
                return a.push = g, a.pop = f, a.replace = i, a.pushpop = h, a.heapify = e, a.nlargest = l, a.nsmallest = m, a.prototype.push = function(a) {
                    return g(this.nodes, a, this.cmp)
                }, a.prototype.pop = function() {
                    return f(this.nodes, this.cmp)
                }, a.prototype.peek = function() {
                    return this.nodes[0]
                }, a.prototype.contains = function(a) {
                    return -1 !== this.nodes.indexOf(a)
                }, a.prototype.replace = function(a) {
                    return i(this.nodes, a, this.cmp)
                }, a.prototype.pushpop = function(a) {
                    return h(this.nodes, a, this.cmp)
                }, a.prototype.heapify = function() {
                    return e(this.nodes, this.cmp)
                }, a.prototype.updateItem = function(a) {
                    return n(this.nodes, a, this.cmp)
                }, a.prototype.clear = function() {
                    return this.nodes = []
                }, a.prototype.empty = function() {
                    return 0 === this.nodes.length
                }, a.prototype.size = function() {
                    return this.nodes.length
                }, a.prototype.clone = function() {
                    var b;
                    return b = new a, b.nodes = this.nodes.slice(0), b
                }, a.prototype.toArray = function() {
                    return this.nodes.slice(0)
                }, a.prototype.insert = a.prototype.push, a.prototype.remove = a.prototype.pop, a.prototype.top = a.prototype.peek, a.prototype.front = a.prototype.peek, a.prototype.has = a.prototype.contains, a.prototype.copy = a.prototype.clone, a
            }(), ("undefined" != typeof b && null !== b ? b.exports : void 0) ? b.exports = a : window.Heap = a
        }).call(this)
    }, {}],
    29: [function(a, b) {
        b.exports = {
            Heap: a("heap"),
            Node: a("./core/Node"),
            Grid: a("./core/Grid"),
            Util: a("./core/Util"),
            Heuristic: a("./core/Heuristic"),
            AStarFinder: a("./finders/AStarFinder"),
            BestFirstFinder: a("./finders/BestFirstFinder"),
            BreadthFirstFinder: a("./finders/BreadthFirstFinder"),
            DijkstraFinder: a("./finders/DijkstraFinder"),
            BiAStarFinder: a("./finders/BiAStarFinder"),
            BiBestFirstFinder: a("./finders/BiBestFirstFinder"),
            BiBreadthFirstFinder: a("./finders/BiBreadthFirstFinder"),
            BiDijkstraFinder: a("./finders/BiDijkstraFinder"),
            IDAStarFinder: a("./finders/IDAStarFinder"),
            JumpPointFinder: a("./finders/JumpPointFinder"),
            OrthogonalJumpPointFinder: a("./finders/OrthogonalJumpPointFinder"),
            TraceFinder: a("./finders/TraceFinder")
        }
    }, {
        "./core/Grid": 30,
        "./core/Heuristic": 31,
        "./core/Node": 32,
        "./core/Util": 33,
        "./finders/AStarFinder": 34,
        "./finders/BestFirstFinder": 35,
        "./finders/BiAStarFinder": 36,
        "./finders/BiBestFirstFinder": 37,
        "./finders/BiBreadthFirstFinder": 38,
        "./finders/BiDijkstraFinder": 39,
        "./finders/BreadthFirstFinder": 40,
        "./finders/DijkstraFinder": 41,
        "./finders/IDAStarFinder": 42,
        "./finders/JumpPointFinder": 43,
        "./finders/OrthogonalJumpPointFinder": 44,
        "./finders/TraceFinder": 45,
        heap: 27
    }],
    30: [function(a, b) {
        function c(a, b, c) {
            this.width = a, this.height = b, this.nodes = this._buildNodes(a, b, c)
        }
        var d = a("./Node");
        c.prototype._buildNodes = function(a, b, c) {
            var e, f, g = new Array(b);
            for (e = 0; b > e; ++e)
                for (g[e] = new Array(a), f = 0; a > f; ++f) g[e][f] = new d(f, e);
            if (void 0 === c) return g;
            if (c.length !== b || c[0].length !== a) throw new Error("Matrix size does not fit");
            for (e = 0; b > e; ++e)
                for (f = 0; a > f; ++f) c[e][f] && (g[e][f].walkable = !1), g[e][f].weight = c[e][f];
            return g
        }, c.prototype.getNodeAt = function(a, b) {
            return this.nodes[b][a]
        }, c.prototype.isWalkableAt = function(a, b) {
            return this.isInside(a, b) && this.nodes[b][a].weight > 0
        }, c.prototype.isInside = function(a, b) {
            return a >= 0 && a < this.width && b >= 0 && b < this.height
        }, c.prototype.setWalkableAt = function(a, b) {
            this.nodes[b][a].weight = 1
        }, c.prototype.getNeighbors = function(a, b, c) {
            var d = a.x,
                e = a.y,
                f = [],
                g = !1,
                h = !1,
                i = !1,
                j = !1,
                k = !1,
                l = !1,
                m = !1,
                n = !1,
                o = this.nodes;
            return this.isWalkableAt(d, e - 1) && (f.push(o[e - 1][d]), g = !0), this.isWalkableAt(d + 1, e) && (f.push(o[e][d + 1]), i = !0), this.isWalkableAt(d, e + 1) && (f.push(o[e + 1][d]), k = !0), this.isWalkableAt(d - 1, e) && (f.push(o[e][d - 1]), m = !0), b ? (c ? (h = m && g, j = g && i, l = i && k, n = k && m) : (h = m || g, j = g || i, l = i || k, n = k || m), h && this.isWalkableAt(d - 1, e - 1) && f.push(o[e - 1][d - 1]), j && this.isWalkableAt(d + 1, e - 1) && f.push(o[e - 1][d + 1]), l && this.isWalkableAt(d + 1, e + 1) && f.push(o[e + 1][d + 1]), n && this.isWalkableAt(d - 1, e + 1) && f.push(o[e + 1][d - 1]), f) : f
        }, c.prototype.clone = function() {
            var a, b, e = this.width,
                f = this.height,
                g = this.nodes,
                h = new c(e, f),
                i = new Array(f);
            for (a = 0; f > a; ++a)
                for (i[a] = new Array(e), b = 0; e > b; ++b) i[a][b] = new d(b, a, g[a][b].walkable, g[a][b].weight);
            return h.nodes = i, h
        }, b.exports = c
    }, {
        "./Node": 32
    }],
    31: [function(a, b) {
        b.exports = {
            manhattan: function(a, b) {
                return a + b
            },
            euclidean: function(a, b) {
                return Math.sqrt(a * a + b * b)
            },
            octile: function(a, b) {
                var c = Math.SQRT2 - 1;
                return b > a ? c * a + b : c * b + a
            },
            chebyshev: function(a, b) {
                return Math.max(a, b)
            }
        }
    }, {}],
    32: [function(a, b) {
        function c(a, b, c, d) {
            this.x = a, this.y = b, this.walkable = void 0 === c ? !0 : c, this.weight = d
        }
        b.exports = c
    }, {}],
    33: [function(a, b, c) {
        function d(a) {
            for (var b = [
                [a.x, a.y]
            ]; a.parent;) a = a.parent, b.push([a.x, a.y]);
            return b.reverse()
        }

        function e(a, b) {
            var c = d(a),
                e = d(b);
            return c.concat(e.reverse())
        }

        function f(a) {
            var b, c, d, e, f, g = 0;
            for (b = 1; b < a.length; ++b) c = a[b - 1], d = a[b], e = c[0] - d[0], f = c[1] - d[1], g += Math.sqrt(e * e + f * f);
            return g
        }

        function g(a, b, c, d) {
            var e, f, g, h, i, j, k = Math.abs,
                l = [];
            for (g = k(c - a), h = k(d - b), e = c > a ? 1 : -1, f = d > b ? 1 : -1, i = g - h;;) {
                if (l.push([a, b]), a === c && b === d) break;
                j = 2 * i, j > -h && (i -= h, a += e), g > j && (i += g, b += f)
            }
            return l
        }

        function h(a) {
            var b, c, d, e, f, h, i = [],
                j = a.length;
            if (2 > j) return i;
            for (f = 0; j - 1 > f; ++f)
                for (b = a[f], c = a[f + 1], d = g(b[0], b[1], c[0], c[1]), e = d.length, h = 0; e - 1 > h; ++h) i.push(d[h]);
            return i.push(a[j - 1]), i
        }

        function i(a, b) {
            var c, d, e, f, h, i, j, k, l, m, n, o, p, q = b.length,
                r = b[0][0],
                s = b[0][1],
                t = b[q - 1][0],
                u = b[q - 1][1];
            for (c = r, d = s, h = b[1][0], i = b[1][1], j = [
                [c, d]
            ], k = 2; q > k; ++k) {
                for (m = b[k], e = m[0], f = m[1], n = g(c, d, e, f), p = !1, l = 1; l < n.length; ++l)
                    if (o = n[l], !a.isWalkableAt(o[0], o[1])) {
                        p = !0, j.push([h, i]), c = h, d = i;
                        break
                    }
                p || (h = e, i = f)
            }
            return j.push([t, u]), j
        }

        function j(a) {
            if (a.length < 3) return a;
            var b, c, d, e, f, g, h = [],
                i = a[0][0],
                j = a[0][1],
                k = a[1][0],
                l = a[1][1],
                m = k - i,
                n = l - j;
            for (f = Math.sqrt(m * m + n * n), m /= f, n /= f, h.push([i, j]), g = 2; g < a.length; g++) b = k, c = l, d = m, e = n, k = a[g][0], l = a[g][1], m = k - b, n = l - c, f = Math.sqrt(m * m + n * n), m /= f, n /= f, (m !== d || n !== e) && h.push([b, c]);
            return h.push([k, l]), h
        }
        c.backtrace = d, c.biBacktrace = e, c.pathLength = f, c.interpolate = g, c.expandPath = h, c.smoothenPath = i, c.compressPath = j
    }, {}],
    34: [function(a, b) {
        function c(a) {
            a = a || {}, this.allowDiagonal = a.allowDiagonal, this.dontCrossCorners = a.dontCrossCorners, this.heuristic = a.heuristic || f.manhattan, this.weight = a.weight || 1, this.maxOpsLimit = a.maxOpsLimit
        }
        var d = a("heap"),
            e = a("../core/Util"),
            f = a("../core/Heuristic");
        c.prototype.findPath = function(a, b, c, f, g) {
            var h, i, j, k, l, m, n, o, p, q = new d(function(a, b) {
                    return a.f - b.f
                }),
                r = g.getNodeAt(a, b),
                s = -1 != c ? g.getNodeAt(c, f) : null,
                t = this.heuristic,
                u = this.allowDiagonal,
                v = this.dontCrossCorners,
                w = this.weight,
                x = Math.abs,
                y = (Math.SQRT2, r),
                z = 0,
                A = [
                    [-1, -1],
                    [1, -1],
                    [1, 1],
                    [-1, 1]
                ];
            for (r.g = 0, r.f = 0, r.h = s ? w * t(x(a - c), x(b - f)) : 0, q.push(r), r.opened = !0; !q.empty();) {
                if (h = q.pop(), h.closed = !0, h === s || 999 == h.weight) return e.backtrace(h);
                if (z++, this.maxOpsLimit && z > this.maxOpsLimit) break;
                if (!s) {
                    for (p = null, k = 0; k < A.length; k++)
                        if (m = h.x + A[k][0], n = h.y + A[k][1], g.isInside(m, n) && 999 == g.nodes[n][m].weight) {
                            p = g.nodes[n][m];
                            break
                        }
                    if (p) {
                        var B = e.backtrace(h);
                        return B.push([p.x, p.y]), B
                    }
                }
                for (i = g.getNeighbors(h, u, v), k = 0, l = i.length; l > k; ++k) j = i[k], j.closed || (m = j.x, n = j.y, o = h.g + j.weight, (!j.opened || o < j.g) && (j.g = o, j.h = j.h || w * t(x(m - c), x(n - f)), j.f = j.g + j.h, j.parent = h, (j.h < y.h || j.h === y.h && j.g < y.g) && (y = j), j.opened ? q.updateItem(j) : (q.push(j), j.opened = !0)))
            }
            return e.backtrace(y)
        }, b.exports = c
    }, {
        "../core/Heuristic": 31,
        "../core/Util": 33,
        heap: 27
    }],
    35: [function(a, b) {
        function c(a) {
            d.call(this, a);
            var b = this.heuristic;
            this.heuristic = function(a, c) {
                return 1e6 * b(a, c)
            }
        }
        var d = a("./AStarFinder");
        c.prototype = new d, c.prototype.constructor = c, b.exports = c
    }, {
        "./AStarFinder": 34
    }],
    36: [function(a, b) {
        function c(a) {
            a = a || {}, this.allowDiagonal = a.allowDiagonal, this.dontCrossCorners = a.dontCrossCorners, this.heuristic = a.heuristic || f.manhattan, this.weight = a.weight || 1
        }
        var d = a("heap"),
            e = a("../core/Util"),
            f = a("../core/Heuristic");
        c.prototype.findPath = function(a, b, c, f, g) {
            var h, i, j, k, l, m, n, o, p = function(a, b) {
                    return a.f - b.f
                },
                q = new d(p),
                r = new d(p),
                s = g.getNodeAt(a, b),
                t = g.getNodeAt(c, f),
                u = this.heuristic,
                v = this.allowDiagonal,
                w = this.dontCrossCorners,
                x = this.weight,
                y = Math.abs,
                z = Math.SQRT2,
                A = 1,
                B = 2;
            for (s.g = 0, s.f = 0, q.push(s), s.opened = A, t.g = 0, t.f = 0, r.push(t), t.opened = B; !q.empty() && !r.empty();) {
                for (h = q.pop(), h.closed = !0, i = g.getNeighbors(h, v, w), k = 0, l = i.length; l > k; ++k)
                    if (j = i[k], !j.closed) {
                        if (j.opened === B) return e.biBacktrace(h, j);
                        m = j.x, n = j.y, o = h.g + (m - h.x === 0 || n - h.y === 0 ? 1 : z), (!j.opened || o < j.g) && (j.g = o, j.h = j.h || x * u(y(m - c), y(n - f)), j.f = j.g + j.h, j.parent = h, j.opened ? q.updateItem(j) : (q.push(j), j.opened = A))
                    }
                for (h = r.pop(), h.closed = !0, i = g.getNeighbors(h, v, w), k = 0, l = i.length; l > k; ++k)
                    if (j = i[k], !j.closed) {
                        if (j.opened === A) return e.biBacktrace(j, h);
                        m = j.x, n = j.y, o = h.g + (m - h.x === 0 || n - h.y === 0 ? 1 : z), (!j.opened || o < j.g) && (j.g = o, j.h = j.h || x * u(y(m - a), y(n - b)), j.f = j.g + j.h, j.parent = h, j.opened ? r.updateItem(j) : (r.push(j), j.opened = B))
                    }
            }
            return []
        }, b.exports = c
    }, {
        "../core/Heuristic": 31,
        "../core/Util": 33,
        heap: 27
    }],
    37: [function(a, b) {
        function c(a) {
            d.call(this, a);
            var b = this.heuristic;
            this.heuristic = function(a, c) {
                return 1e6 * b(a, c)
            }
        }
        var d = a("./BiAStarFinder");
        c.prototype = new d, c.prototype.constructor = c, b.exports = c
    }, {
        "./BiAStarFinder": 36
    }],
    38: [function(a, b) {
        function c(a) {
            a = a || {}, this.allowDiagonal = a.allowDiagonal, this.dontCrossCorners = a.dontCrossCorners
        }
        var d = a("../core/Util");
        c.prototype.findPath = function(a, b, c, e, f) {
            var g, h, i, j, k, l = f.getNodeAt(a, b),
                m = f.getNodeAt(c, e),
                n = [],
                o = [],
                p = this.allowDiagonal,
                q = this.dontCrossCorners,
                r = 0,
                s = 1;
            for (n.push(l), l.opened = !0, l.by = r, o.push(m), m.opened = !0, m.by = s; n.length && o.length;) {
                for (i = n.shift(), i.closed = !0, g = f.getNeighbors(i, p, q), j = 0, k = g.length; k > j; ++j)
                    if (h = g[j], !h.closed)
                        if (h.opened) {
                            if (h.by === s) return d.biBacktrace(i, h)
                        } else n.push(h), h.parent = i, h.opened = !0, h.by = r;
                for (i = o.shift(), i.closed = !0, g = f.getNeighbors(i, p, q), j = 0, k = g.length; k > j; ++j)
                    if (h = g[j], !h.closed)
                        if (h.opened) {
                            if (h.by === r) return d.biBacktrace(h, i)
                        } else o.push(h), h.parent = i, h.opened = !0, h.by = s
            }
            return []
        }, b.exports = c
    }, {
        "../core/Util": 33
    }],
    39: [function(a, b) {
        function c(a) {
            d.call(this, a), this.heuristic = function() {
                return 0
            }
        }
        var d = a("./BiAStarFinder");
        c.prototype = new d, c.prototype.constructor = c, b.exports = c
    }, {
        "./BiAStarFinder": 36
    }],
    40: [function(a, b) {
        function c(a) {
            a = a || {}, this.allowDiagonal = a.allowDiagonal, this.dontCrossCorners = a.dontCrossCorners
        }
        var d = a("../core/Util");
        c.prototype.findPath = function(a, b, c, e, f) {
            var g, h, i, j, k, l = [],
                m = this.allowDiagonal,
                n = this.dontCrossCorners,
                o = f.getNodeAt(a, b),
                p = f.getNodeAt(c, e);
            for (l.push(o), o.opened = !0; l.length;) {
                if (i = l.shift(), i.closed = !0, i === p) return d.backtrace(p);
                for (g = f.getNeighbors(i, m, n), j = 0, k = g.length; k > j; ++j) h = g[j], h.closed || h.opened || (l.push(h), h.opened = !0, h.parent = i)
            }
            return []
        }, b.exports = c
    }, {
        "../core/Util": 33
    }],
    41: [function(a, b) {
        function c(a) {
            d.call(this, a), this.heuristic = function() {
                return 0
            }
        }
        var d = a("./AStarFinder");
        c.prototype = new d, c.prototype.constructor = c, b.exports = c
    }, {
        "./AStarFinder": 34
    }],
    42: [function(a, b) {
        function c(a) {
            a = a || {}, this.allowDiagonal = a.allowDiagonal, this.dontCrossCorners = a.dontCrossCorners, this.heuristic = a.heuristic || d.manhattan, this.weight = a.weight || 1, this.trackRecursion = a.trackRecursion || !1, this.timeLimit = a.timeLimit || 1 / 0
        }
        var d = (a("../core/Util"), a("../core/Heuristic")),
            e = a("../core/Node");
        c.prototype.findPath = function(a, b, c, d, f) {
            var g, h, i, j = 0,
                k = (new Date).getTime(),
                l = function(a, b) {
                    return this.heuristic(Math.abs(b.x - a.x), Math.abs(b.y - a.y))
                }.bind(this),
                m = function(a, b) {
                    return a.x === b.x || a.y === b.y ? 1 : Math.SQRT2
                },
                n = function(a, b, c, d, g) {
                    if (j++, this.timeLimit > 0 && (new Date).getTime() - k > 1e3 * this.timeLimit) return 1 / 0;
                    var h = b + l(a, p) * this.weight;
                    if (h > c) return h;
                    if (a == p) return d[g] = [a.x, a.y], a;
                    var i, o, q, r, s = f.getNeighbors(a, this.allowDiagonal, this.dontCrossCorners);
                    for (q = 0, i = 1 / 0; r = s[q]; ++q) {
                        if (this.trackRecursion && (r.retainCount = r.retainCount + 1 || 1, r.tested !== !0 && (r.tested = !0)), o = n(r, b + m(a, r), c, d, g + 1), o instanceof e) return d[g] = [a.x, a.y], o;
                        this.trackRecursion && 0 === --r.retainCount && (r.tested = !1), i > o && (i = o)
                    }
                    return i
                }.bind(this),
                o = f.getNodeAt(a, b),
                p = f.getNodeAt(c, d),
                q = l(o, p);
            for (g = 0; !0; ++g) {
                if (h = [], i = n(o, 0, q, h, 0), 1 / 0 === i) return [];
                if (i instanceof e) return h;
                q = i
            }
            return []
        }, b.exports = c
    }, {
        "../core/Heuristic": 31,
        "../core/Node": 32,
        "../core/Util": 33
    }],
    43: [function(a, b) {
        function c(a) {
            a = a || {}, this.heuristic = a.heuristic || f.manhattan, this.trackJumpRecursion = a.trackJumpRecursion || !1
        }
        var d = a("heap"),
            e = a("../core/Util"),
            f = a("../core/Heuristic");
        c.prototype.findPath = function(a, b, c, f, g) {
            var h, i = this.openList = new d(function(a, b) {
                    return a.f - b.f
                }),
                j = this.startNode = g.getNodeAt(a, b),
                k = this.endNode = g.getNodeAt(c, f);
            for (this.grid = g, j.g = 0, j.f = 0, i.push(j), j.opened = !0; !i.empty();) {
                if (h = i.pop(), h.closed = !0, h === k) return e.expandPath(e.backtrace(k));
                this._identifySuccessors(h)
            }
            return []
        }, c.prototype._identifySuccessors = function(a) {
            {
                var b, c, d, e, g, h, i, j, k, l, m = this.grid,
                    n = this.heuristic,
                    o = this.openList,
                    p = this.endNode.x,
                    q = this.endNode.y,
                    r = a.x,
                    s = a.y,
                    t = Math.abs;
                Math.max
            }
            for (b = this._findNeighbors(a), e = 0, g = b.length; g > e; ++e)
                if (c = b[e], d = this._jump(c[0], c[1], r, s)) {
                    if (h = d[0], i = d[1], l = m.getNodeAt(h, i), l.closed) continue;
                    j = f.octile(t(h - r), t(i - s)), k = a.g + j, (!l.opened || k < l.g) && (l.g = k, l.h = l.h || n(t(h - p), t(i - q)), l.f = l.g + l.h, l.parent = a, l.opened ? o.updateItem(l) : (o.push(l), l.opened = !0))
                }
        }, c.prototype._jump = function(a, b, c, d) {
            var e = this.grid,
                f = a - c,
                g = b - d;
            if (!e.isWalkableAt(a, b)) return null;
            if (this.trackJumpRecursion === !0 && (e.getNodeAt(a, b).tested = !0), e.getNodeAt(a, b) === this.endNode) return [a, b];
            if (0 !== f && 0 !== g) {
                if (e.isWalkableAt(a - f, b + g) && !e.isWalkableAt(a - f, b) || e.isWalkableAt(a + f, b - g) && !e.isWalkableAt(a, b - g)) return [a, b]
            } else if (0 !== f) {
                if (e.isWalkableAt(a + f, b + 1) && !e.isWalkableAt(a, b + 1) || e.isWalkableAt(a + f, b - 1) && !e.isWalkableAt(a, b - 1)) return [a, b]
            } else if (e.isWalkableAt(a + 1, b + g) && !e.isWalkableAt(a + 1, b) || e.isWalkableAt(a - 1, b + g) && !e.isWalkableAt(a - 1, b)) return [a, b];
            return 0 !== f && 0 !== g && (this._jump(a + f, b, a, b) || this._jump(a, b + g, a, b)) ? [a, b] : e.isWalkableAt(a + f, b) || e.isWalkableAt(a, b + g) ? this._jump(a + f, b + g, a, b) : null
        }, c.prototype._findNeighbors = function(a) {
            var b, c, d, e, f, g, h, i, j = a.parent,
                k = a.x,
                l = a.y,
                m = this.grid,
                n = [];
            if (j) b = j.x, c = j.y, d = (k - b) / Math.max(Math.abs(k - b), 1), e = (l - c) / Math.max(Math.abs(l - c), 1), 0 !== d && 0 !== e ? (m.isWalkableAt(k, l + e) && n.push([k, l + e]), m.isWalkableAt(k + d, l) && n.push([k + d, l]), (m.isWalkableAt(k, l + e) || m.isWalkableAt(k + d, l)) && n.push([k + d, l + e]), !m.isWalkableAt(k - d, l) && m.isWalkableAt(k, l + e) && n.push([k - d, l + e]), !m.isWalkableAt(k, l - e) && m.isWalkableAt(k + d, l) && n.push([k + d, l - e])) : 0 === d ? m.isWalkableAt(k, l + e) && (n.push([k, l + e]), m.isWalkableAt(k + 1, l) || n.push([k + 1, l + e]), m.isWalkableAt(k - 1, l) || n.push([k - 1, l + e])) : m.isWalkableAt(k + d, l) && (n.push([k + d, l]), m.isWalkableAt(k, l + 1) || n.push([k + d, l + 1]), m.isWalkableAt(k, l - 1) || n.push([k + d, l - 1]));
            else
                for (f = m.getNeighbors(a, !0), h = 0, i = f.length; i > h; ++h) g = f[h], n.push([g.x, g.y]);
            return n
        }, b.exports = c
    }, {
        "../core/Heuristic": 31,
        "../core/Util": 33,
        heap: 27
    }],
    44: [function(a, b) {
        function c(a) {
            e.call(this, a), a = a || {}, this.heuristic = a.heuristic || d.manhattan
        }
        var d = a("../core/Heuristic"),
            e = a("./JumpPointFinder");
        c.prototype = new e, c.prototype.constructor = c, c.prototype._jump = function(a, b, c, d) {
            var e = this.grid,
                f = a - c,
                g = b - d;
            if (!e.isWalkableAt(a, b)) return null;
            if (this.trackJumpRecursion === !0 && (e.getNodeAt(a, b).tested = !0), e.getNodeAt(a, b) === this.endNode) return [a, b];
            if (0 !== f) {
                if (e.isWalkableAt(a, b - 1) && !e.isWalkableAt(a - f, b - 1) || e.isWalkableAt(a, b + 1) && !e.isWalkableAt(a - f, b + 1)) return [a, b]
            } else {
                if (0 === g) throw new Error("Only horizontal and vertical movements are allowed");
                if (e.isWalkableAt(a - 1, b) && !e.isWalkableAt(a - 1, b - g) || e.isWalkableAt(a + 1, b) && !e.isWalkableAt(a + 1, b - g)) return [a, b];
                if (this._jump(a + 1, b, a, b) || this._jump(a - 1, b, a, b)) return [a, b]
            }
            return this._jump(a + f, b + g, a, b)
        }, c.prototype._findNeighbors = function(a) {
            var b, c, d, e, f, g, h, i, j = a.parent,
                k = a.x,
                l = a.y,
                m = this.grid,
                n = [];
            if (j) b = j.x, c = j.y, d = (k - b) / Math.max(Math.abs(k - b), 1), e = (l - c) / Math.max(Math.abs(l - c), 1), 0 !== d ? (m.isWalkableAt(k, l - 1) && n.push([k, l - 1]), m.isWalkableAt(k, l + 1) && n.push([k, l + 1]), m.isWalkableAt(k + d, l) && n.push([k + d, l])) : 0 !== e && (m.isWalkableAt(k - 1, l) && n.push([k - 1, l]), m.isWalkableAt(k + 1, l) && n.push([k + 1, l]), m.isWalkableAt(k, l + e) && n.push([k, l + e]));
            else
                for (f = m.getNeighbors(a, !1), h = 0, i = f.length; i > h; ++h) g = f[h], n.push([g.x, g.y]);
            return n
        }, b.exports = c
    }, {
        "../core/Heuristic": 31,
        "./JumpPointFinder": 43
    }],
    45: [function(a, b) {
        function c(a) {
            a = a || {}, this.allowDiagonal = a.allowDiagonal, this.dontCrossCorners = a.dontCrossCorners, this.heuristic = a.heuristic || f.manhattan
        }
        var d = a("heap"),
            e = a("../core/Util"),
            f = a("../core/Heuristic");
        c.prototype.findPath = function(a, b, c, f, g) {
            var h, i, j, k, l, m, n, o, p = new d(function(a, b) {
                    return a.f - b.f
                }),
                q = g.getNodeAt(a, b),
                r = g.getNodeAt(c, f),
                s = this.heuristic,
                t = this.allowDiagonal,
                u = this.dontCrossCorners,
                v = Math.abs,
                w = Math.SQRT2;
            for (q.g = 0, q.f = 0, p.push(q), q.opened = !0; !p.empty();) {
                if (h = p.pop(), h.closed = !0, h === r) return e.backtrace(r);
                i = g.getNeighbors(h, t, u);
                var x = i.length;
                for (k = 0, l = i.length; l > k; ++k) j = i[k], j.closed || (m = j.x, n = j.y, o = h.g + (m - h.x === 0 || n - h.y === 0 ? 1 : w), (!j.opened || o < j.g) && (j.g = o * x / 9, j.h = j.h || s(v(m - c), v(n - f)), j.f = j.g + j.h, j.parent = h, j.opened ? p.updateItem(j) : (p.push(j), j.opened = !0)))
            }
            return []
        }, b.exports = c
    }, {
        "../core/Heuristic": 31,
        "../core/Util": 33,
        heap: 27
    }],
    46: [function(a, b, c) {
        arguments[4][7][0].apply(c, arguments)
    }, {
        _process: 80,
        dup: 7
    }],
    47: [function(a, b) {
        "use strict";
        a("lodash"), a("../../../utils"), a("../../../game/constants");
        b.exports = function(a, b, c, d) {
            a && "constructionSite" == a.type && (a.ticksToLive--, a.ticksToLive <= 0 ? (d.remove(a._id), delete b[a._id]) : d.update(a, {
                ticksToLive: a.ticksToLive
            }))
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    48: [function(a, b) {
        "use strict"; {
            var c = a("lodash");
            a("../../../utils"), a("../../../game/constants")
        }
        b.exports = function(a, b, d, e, f, g) {
            e = Math.round(e);
            var h = c.find(f, {
                type: "energy",
                x: a,
                y: b
            });
            h ? g.update(h, {
                energy: h.energy + e
            }) : g.insert({
                type: "energy",
                x: a,
                y: b,
                room: d,
                energy: e
            })
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    49: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = a("../../../utils"),
            e = a("../../../game/constants");
        b.exports = function(b, f, g, h, i) {
            function j(b) {
                for (var d = b.hits, f = b.body.length - 1; f >= 0; f--) b.body[f].hits = d > 100 ? 100 : d, d -= 100, 0 > d && (d = 0);
                b.energyCapacity = c.filter(b.body, function(a) {
                    return a.hits > 0 && a.type == e.CARRY
                }).length * e.CARRY_CAPACITY, b.energy > b.energyCapacity && (a("./drop-energy")(b, {
                    amount: b.energy - b.energyCapacity
                }, g, h, i), b.energy = b.energyCapacity)
            }
            if ("creep" == b.type && !b.spawning) {
                var k = g[f.id];
                if (k && c.contains(["creep", "spawn", "rampart", "road", "constructedWall", "extension"], k.type) && k != b && !(Math.abs(k.x - b.x) > 1 || Math.abs(k.y - b.y) > 1 || "creep" == k.type && k.spawning)) {
                    var l = c.find(g, {
                        type: "rampart",
                        x: k.x,
                        y: k.y
                    });
                    l && (k = l);
                    var m = c.filter(b.body, function(a) {
                        return a.hits > 0 && a.type == e.ATTACK
                    }).length * e.ATTACK_POWER;
                    if (k.hits -= m, "creep" == k.type) {
                        if (!c.any(g, {
                            type: "rampart",
                            x: b.x,
                            y: b.y
                        })) {
                            var n = c.filter(k.body, function(a) {
                                return a.hits > 0 && a.type == e.ATTACK
                            }).length * e.ATTACK_POWER;
                            n > 0 && (b.hits -= n, j(b), b.actionLog.attacked = {
                                x: k.x,
                                y: k.y
                            })
                        }
                        j(k)
                    }
                    if (m > 0) {
                        if (k.hits <= 0) {
                            if (i.remove(k._id), "creep" == k.energy && a("./_create-energy")(k.x, k.y, k.room, d.calcCreepCost(k.body) * e.CREEP_CORPSE_RATE * k.ticksToLive / e.CREEP_LIFE_TIME, g, i), "spawn" == k.type && k.spawning) {
                                var o = c.find(g, {
                                    user: k.user,
                                    name: k.spawning.name
                                });
                                o && i.remove(o._id)
                            }("spawn" == k.type || "extension" == k.type) && k.energy > 0 && a("./_create-energy")(k.x, k.y, k.room, k.energy, g, i)
                        } else "creep" == k.type ? i.update(k, {
                            hits: k.hits,
                            body: k.body,
                            energy: k.energy,
                            energyCapacity: k.energyCapacity
                        }) : i.update(k, {
                            hits: k.hits
                        });
                        b.actionLog.attack = {
                            x: k.x,
                            y: k.y
                        }, k.actionLog && (k.actionLog.attacked = {
                            x: b.x,
                            y: b.y
                        })
                    }
                    "creep" == k.type && (b.hits <= 0 ? (i.remove(b._id), a("./_create-energy")(b.x, b.y, b.room, d.calcCreepCost(b.body) * e.CREEP_CORPSE_RATE * b.ticksToLive / e.CREEP_LIFE_TIME, g, i)) : i.update(b, {
                        hits: b.hits,
                        body: b.body,
                        energy: b.energy,
                        energyCapacity: b.energyCapacity
                    }))
                }
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        "./_create-energy": 48,
        "./drop-energy": 51,
        lodash: 25
    }],
    50: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = a("../../../utils"),
            e = a("../../../game/constants");
        b.exports = function(a, b, f, g, h) {
            if ("creep" == a.type && !(a.spawning || a.energy <= 0)) {
                var i = f[b.id];
                if (i && "constructionSite" == i.type && c.contains(["rampart", "spawn", "road", "extension", "constructedWall"], i.structureType) && !(Math.abs(i.x - a.x) > 1 || Math.abs(i.y - a.y) > 1 || c.any(f, {
                    x: i.x,
                    y: i.y,
                    type: i.structureType
                }) || c.contains(["spawn", "extension", "constructedWall"], i.structureType) && c.any(f, function(a) {
                    return a.x == i.x && a.y == i.y && c.contains(e.OBSTACLE_OBJECT_TYPES, a.type)
                }) || d.checkTerrain(g, i.x, i.y, e.TERRAIN_MASK_WALL))) {
                    var j = c.filter(a.body, function(a) {
                            return a.hits > 0 && a.type == e.WORK
                        }).length * e.BUILD_POWER,
                        k = i.progressTotal - i.progress,
                        l = Math.min(j, k, a.energy);
                    if (!(i.progress + l >= i.progressTotal && "spawn" == i.structureType && c.filter(f, function(a) {
                        return "spawn" == a.type
                    }).length >= 3))
                        if (i.progress += l, a.energy -= l, a.actionLog.build = {
                            x: i.x,
                            y: i.y
                        }, h.update(a, {
                            energy: a.energy
                        }), i.progress < i.progressTotal) h.update(i, {
                            progress: i.progress,
                            ticksToLive: e.CONSTRUCTION_DECAY_TIME
                        });
                        else {
                            h.remove(i._id);
                            var m = {
                                type: i.structureType,
                                x: i.x,
                                y: i.y,
                                room: i.room
                            };
                            if ("spawn" == i.structureType && c.extend(m, {
                                name: i.name,
                                user: i.user,
                                energy: 0,
                                energyCapacity: e.SPAWN_ENERGY_CAPACITY,
                                hits: e.SPAWN_HITS,
                                hitsMax: e.SPAWN_HITS
                            }), "extension" == i.structureType && c.extend(m, {
                                user: i.user,
                                energy: 0,
                                energyCapacity: e.EXTENSION_ENERGY_CAPACITY,
                                hits: e.EXTENSION_HITS,
                                hitsMax: e.EXTENSION_HITS
                            }), "rampart" == i.structureType && c.extend(m, {
                                user: i.user,
                                hits: e.RAMPART_HITS,
                                hitsMax: e.RAMPART_HITS,
                                ticksToDecay: e.RAMPART_DECAY_TIME
                            }), "road" == i.structureType && c.extend(m, {
                                hits: e.ROAD_HITS,
                                hitsMax: e.ROAD_HITS
                            }), "constructedWall" == i.structureType && c.extend(m, {
                                hits: e.WALL_HITS,
                                hitsMax: e.WALL_HITS
                            }), h.insert(m), "spawn" == i.structureType)
                                for (var n = -1; 1 >= n; n++)
                                    for (var o = -1; 1 >= o; o++)(0 != n || 0 != o) && (c.any(f, {
                                        x: i.x + n,
                                        y: i.y,
                                        type: i.structureType
                                    }) || h.insert({
                                        type: "rampart",
                                        x: i.x + n,
                                        y: i.y + o,
                                        room: i.room,
                                        user: i.user,
                                        hits: e.RAMPART_HITS,
                                        hitsMax: e.RAMPART_HITS,
                                        ticksToDecay: e.RAMPART_DECAY_TIME
                                    }));
                            delete f[b.id]
                        }
                }
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    51: [function(a, b) {
        "use strict";
        a("lodash"), a("../../../utils"), a("../../../game/constants");
        b.exports = function(b, c, d, e, f) {
            "creep" == b.type && (b.spawning || b.energy < c.amount || (b.energy -= c.amount, f.update(b, {
                energy: b.energy
            }), a("./_create-energy")(b.x, b.y, b.room, c.amount, d, f)))
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        "./_create-energy": 48,
        lodash: 25
    }],
    52: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = (a("../../../utils"), a("../../../game/constants"));
        b.exports = function(b, e, f, g, h) {
            if ("creep" == b.type && !b.spawning) {
                var i = f[e.id];
                if (i && "source" == i.type && i.energy && !(Math.abs(i.x - b.x) > 1 || Math.abs(i.y - b.y) > 1)) {
                    var j = c.filter(b.body, function(a) {
                        return a.hits > 0 && a.type == d.WORK
                    }).length * d.HARVEST_POWER;
                    if (j) {
                        var k = Math.min(i.energy, j);
                        i.energy -= k, b.energy += k, h.update(b, {
                            energy: b.energy
                        }), h.update(i, {
                            energy: i.energy
                        }), b.energy > b.energyCapacity && a("./drop-energy")(b, {
                            amount: b.energy - b.energyCapacity
                        }, f, g, h), b.actionLog.harvest = {
                            x: i.x,
                            y: i.y
                        }
                    }
                }
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        "./drop-energy": 51,
        lodash: 25
    }],
    53: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = (a("../../../utils"), a("../../../game/constants"));
        b.exports = function(a, b, e, f, g) {
            function h(a) {
                for (var b = a.hits, e = a.body.length - 1; e >= 0; e--) a.body[e].hits = b > 100 ? 100 : b, b -= 100, 0 > b && (b = 0);
                a.energyCapacity = c.filter(a.body, function(a) {
                    return a.hits > 0 && a.type == d.CARRY
                }).length * d.CARRY_CAPACITY
            }
            if ("creep" == a.type && !a.spawning) {
                var i = e[b.id];
                if (!(!i || "creep" != i.type || i.spawning || i == a || i.hits >= i.hitsMax || Math.abs(i.x - a.x) > 1 || Math.abs(i.y - a.y) > 1)) {
                    var j = c.filter(a.body, function(a) {
                        return a.hits > 0 && a.type == d.HEAL
                    }).length * d.HEAL_POWER;
                    i.hits += j, i.hits > i.hitsMax && (i.hits = i.hitsMax), h(i), a.actionLog.heal = {
                        x: i.x,
                        y: i.y
                    }, i.actionLog.healed = {
                        x: a.x,
                        y: a.y
                    }, g.update(i, {
                        hits: i.hits,
                        body: i.body,
                        energyCapacity: i.energyCapacity
                    })
                }
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    54: [function(a, b) {
        "use strict";
        b.exports = function(b, c, d, e, f) {
            c.dropEnergy && a("./drop-energy")(b, c.dropEnergy, d, e, f), c.transferEnergy && a("./transfer-energy")(b, c.transferEnergy, d, e, f), c.pickup && a("./pickup")(b, c.pickup, d, e, f), c.heal ? a("./heal")(b, c.heal, d, e, f) : c.rangedHeal ? a("./rangedHeal")(b, c.rangedHeal, d, e, f) : c.repair ? a("./repair")(b, c.repair, d, e, f) : c.build ? a("./build")(b, c.build, d, e, f) : c.attack ? a("./attack")(b, c.attack, d, e, f) : c.harvest && a("./harvest")(b, c.harvest, d, e, f), c.move && a("./move")(b, c.move, d, e, f), !c.rangedHeal && c.rangedMassAttack && a("./rangedMassAttack")(b, c.rangedMassAttack, d, e, f), c.rangedHeal || c.rangedMassAttack || !c.rangedAttack || a("./rangedAttack")(b, c.rangedAttack, d, e, f), c.suicide && a("./suicide")(b, c.suicide, d, e, f), c.say && a("./say")(b, c.say, d, e, f)
        }
    }, {
        "./attack": 49,
        "./build": 50,
        "./drop-energy": 51,
        "./harvest": 52,
        "./heal": 53,
        "./move": 55,
        "./pickup": 56,
        "./rangedAttack": 57,
        "./rangedHeal": 58,
        "./rangedMassAttack": 59,
        "./repair": 60,
        "./say": 61,
        "./suicide": 62,
        "./transfer-energy": 64
    }],
    55: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = a("../../../utils"),
            e = a("../../../game/constants"),
            f = a("../movement");
        b.exports = function(b, g, h, i, j) {
            if ("creep" == b.type && !(b.spawning || b.fatigue > 0) && 0 != c.filter(b.body, function(a) {
                return a.hits > 0 && a.type == e.MOVE
            }).length) {
                var k = d.getOffsetsByDirection(g.direction),
                    l = k[0],
                    m = k[1],
                    n = null;
                if (c.filter(b.body, function(a) {
                    return a.hits > 0 && a.type == e.ATTACK
                }).length > 0 && (c.filter(h, {
                    x: b.x + l,
                    y: b.y + m
                }).forEach(function(a) {
                        c.contains(["rampart", "constructedWall", "spawn", "extension"], a.type) && b.user != a.user && (n = a)
                    }), 0 != l && 0 != m && !n)) {
                    var o, p;
                    c.filter(h, function(a) {
                        return a.x == b.x && a.y == b.y + m || a.y == b.y && a.x == b.x + l
                    }).forEach(function(a) {
                            c.contains(["rampart", "constructedWall", "spawn", "extension"], a.type) && b.user != a.user && (b.x == a.x ? o = a : p = a)
                        }), o && p && (n = o.hits > p.hits ? p : p)
                }
                n ? a("./attack")(b, {
                    id: n._id,
                    x: n.x,
                    y: n.y
                }, h, i, j) : f.add(b, l, m)
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        "../movement": 66,
        "./attack": 49,
        lodash: 25
    }],
    56: [function(a, b) {
        "use strict";
        a("lodash"), a("../../../utils"), a("../../../game/constants");
        b.exports = function(a, b, c, d, e) {
            if ("creep" == a.type && !(a.spawning || a.energy >= a.energyCapacity)) {
                var f = c[b.id];
                if (f && "energy" == f.type && !(Math.abs(f.x - a.x) > 1 || Math.abs(f.y - a.y) > 1)) {
                    var g = Math.min(a.energyCapacity - a.energy, f.energy);
                    f.energy -= g, a.energy += g, f.energy ? e.update(f, {
                        energy: f.energy
                    }) : (e.remove(f._id), delete c[f._id]), e.update(a, {
                        energy: a.energy
                    })
                }
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    57: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = a("../../../utils"),
            e = a("../../../game/constants");
        b.exports = function(b, f, g, h, i) {
            function j(b) {
                for (var d = b.hits, f = b.body.length - 1; f >= 0; f--) b.body[f].hits = d > 100 ? 100 : d, d -= 100, 0 > d && (d = 0);
                b.energyCapacity = c.filter(b.body, function(a) {
                    return a.hits > 0 && a.type == e.CARRY
                }).length * e.CARRY_CAPACITY, b.energy > b.energyCapacity && (a("./drop-energy")(b, {
                    amount: b.energy - b.energyCapacity
                }, g, h, i), b.energy = b.energyCapacity)
            }
            if ("creep" == b.type && !b.spawning) {
                var k = g[f.id];
                if (k && c.contains(["creep", "spawn", "rampart", "road", "constructedWall", "extension"], k.type) && k != b && !(Math.abs(k.x - b.x) > 3 || Math.abs(k.y - b.y) > 3 || "creep" == k.type && k.spawning)) {
                    var l = c.find(g, {
                        type: "rampart",
                        x: k.x,
                        y: k.y
                    });
                    l && (k = l);
                    var m = c.filter(b.body, function(a) {
                        return a.hits > 0 && a.type == e.RANGED_ATTACK
                    }).length * e.RANGED_ATTACK_POWER;
                    if (m > 0) {
                        if (k.hits -= m, "creep" == k.type && j(k), k.hits <= 0) {
                            if (i.remove(k._id), "creep" == k.type && a("./_create-energy")(k.x, k.y, k.room, d.calcCreepCost(k.body) * e.CREEP_CORPSE_RATE * k.ticksToLive / e.CREEP_LIFE_TIME, g, i), "spawn" == k.type && k.spawning) {
                                var n = c.find(g, {
                                    user: k.user,
                                    name: k.spawning.name
                                });
                                n && i.remove(n._id)
                            }("spawn" == k.type || "extension" == k.type) && k.energy > 0 && a("./_create-energy")(k.x, k.y, k.room, k.energy, g, i)
                        } else "creep" == k.type ? i.update(k, {
                            hits: k.hits,
                            body: k.body,
                            energy: k.energy,
                            energyCapacity: k.energyCapacity
                        }) : i.update(k, {
                            hits: k.hits
                        });
                        b.actionLog.rangedAttack = {
                            x: k.x,
                            y: k.y
                        }, k.actionLog && (k.actionLog.attacked = {
                            x: b.x,
                            y: b.y
                        })
                    }
                }
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        "./_create-energy": 48,
        "./drop-energy": 51,
        lodash: 25
    }],
    58: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = (a("../../../utils"), a("../../../game/constants"));
        b.exports = function(a, b, e, f, g) {
            function h(a) {
                for (var b = a.hits, e = a.body.length - 1; e >= 0; e--) a.body[e].hits = b > 100 ? 100 : b, b -= 100, 0 > b && (b = 0);
                a.energyCapacity = c.filter(a.body, function(a) {
                    return a.hits > 0 && a.type == d.CARRY
                }).length * d.CARRY_CAPACITY
            }
            if ("creep" == a.type && !a.spawning) {
                var i = e[b.id];
                if (!(!i || "creep" != i.type || i.spawning || i == a || i.hits >= i.hitsMax || Math.abs(i.x - a.x) > 3 || Math.abs(i.y - a.y) > 3)) {
                    var j = c.filter(a.body, function(a) {
                        return a.hits > 0 && a.type == d.HEAL
                    }).length * d.RANGED_HEAL_POWER;
                    i.hits += j, i.hits > i.hitsMax && (i.hits = i.hitsMax), h(i), a.actionLog.rangedHeal = {
                        x: i.x,
                        y: i.y
                    }, i.actionLog.healed = {
                        x: a.x,
                        y: a.y
                    }, g.update(i, {
                        hits: i.hits,
                        body: i.body,
                        energyCapacity: i.energyCapacity
                    })
                }
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    59: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = a("../../../utils"),
            e = a("../../../game/constants");
        b.exports = function(b, f, g, h, i) {
            function j(b) {
                for (var d = b.hits, f = b.body.length - 1; f >= 0; f--) b.body[f].hits = d > 100 ? 100 : d, d -= 100, 0 > d && (d = 0);
                b.energyCapacity = c.filter(b.body, function(a) {
                    return a.hits > 0 && a.type == e.CARRY
                }).length * e.CARRY_CAPACITY, b.energy > b.energyCapacity && (a("./drop-energy")(b, {
                    amount: b.energy - b.energyCapacity
                }, g, h, i), b.energy = b.energyCapacity)
            }
            if ("creep" == b.type && !b.spawning) {
                var k = c.filter(b.body, function(a) {
                    return a.hits > 0 && a.type == e.RANGED_ATTACK
                }).length * e.RANGED_ATTACK_POWER;
                if (0 != k) {
                    var l = c.filter(g, function(a) {
                            return !c.isUndefined(a.user) && a.user != b.user && a.x >= b.x - 3 && a.x <= b.x + 3 && a.y >= b.y - 3 && a.y <= b.y + 3
                        }),
                        m = {
                            1: 1,
                            2: .4,
                            3: .1
                        };
                    for (var n in l) {
                        var o = l[n];
                        if ("rampart" == o.type || !c.find(g, {
                            type: "rampart",
                            x: o.x,
                            y: o.y
                        })) {
                            var p = Math.max(Math.abs(b.x - o.x), Math.abs(b.y - o.y));
                            if (o.hits -= Math.round(k * m[p]), "creep" == o.type && j(o), o.hits <= 0) {
                                if (i.remove(o._id), "creep" == o.type && a("./_create-energy")(o.x, o.y, o.room, d.calcCreepCost(o.body) * e.CREEP_CORPSE_RATE * o.ticksToLive / e.CREEP_LIFE_TIME, g, i), "spawn" == o.type && o.spawning) {
                                    var q = c.find(g, {
                                        user: o.user,
                                        name: o.spawning.name
                                    });
                                    q && i.remove(q._id)
                                }("spawn" == o.type || "extension" == o.type) && o.energy > 0 && a("./_create-energy")(o.x, o.y, o.room, o.energy, g, i)
                            } else "creep" == o.type ? i.update(o, {
                                hits: o.hits,
                                body: o.body,
                                energy: o.energy,
                                energyCapacity: o.energyCapacity
                            }) : i.update(o, {
                                hits: o.hits
                            });
                            o.actionLog && (o.actionLog.attacked = {
                                x: b.x,
                                y: b.y
                            })
                        }
                    }
                    b.actionLog.rangedMassAttack = {}
                }
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        "./_create-energy": 48,
        "./drop-energy": 51,
        lodash: 25
    }],
    60: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = (a("../../../utils"), a("../../../game/constants"));
        b.exports = function(a, b, e, f, g) {
            if ("creep" == a.type && !(a.spawning || a.energy <= 0)) {
                var h = e[b.id];
                if (h && c.contains(["spawn", "extension", "road", "rampart", "constructedWall"], h.type) && !(h.hits >= h.hitsMax) && !(Math.abs(h.x - a.x) > 1 || Math.abs(h.y - a.y) > 1)) {
                    var i = c.filter(a.body, function(a) {
                            return a.hits > 0 && a.type == d.WORK
                        }).length * d.REPAIR_POWER,
                        j = a.energy / d.REPAIR_COST,
                        k = h.hitsMax - h.hits,
                        l = Math.min(i, j, k);
                    l && (h.hits += l, a.energy -= Math.min(a.energy, Math.ceil(l * d.REPAIR_COST)), h.hits > h.hitsMax && (h.hits = h.hitsMax), a.actionLog.repair = {
                        x: h.x,
                        y: h.y
                    }, g.update(h, {
                        hits: h.hits
                    }), g.update(a, {
                        energy: a.energy
                    }))
                }
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    61: [function(a, b) {
        "use strict"; {
            var c = a("lodash");
            a("../../../utils"), a("../../../game/constants")
        }
        b.exports = function(a, b) {
            "creep" == a.type && (a.spawning || c.isString(b.message) && (a.actionLog.say = b.message.substring(0, 10)))
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    62: [function(a, b) {
        "use strict";
        var c = (a("lodash"), a("../../../utils")),
            d = a("../../../game/constants");
        b.exports = function(b, e, f, g, h) {
            if ("creep" == b.type && !b.spawning) {
                h.remove(b._id);
                var i = c.calcCreepCost(b.body) * d.CREEP_CORPSE_RATE * b.ticksToLive / d.CREEP_LIFE_TIME;
                b.energy > 0 && (i += b.energy), a("./_create-energy")(b.x, b.y, b.room, i, f, h)
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        "./_create-energy": 48,
        lodash: 25
    }],
    63: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = (a("../../../utils"), a("../../../game/constants")),
            e = a("../movement");
        b.exports = function(b, f, g, h) {
            if (b && "creep" == b.type && (e.execute(b, h), b.spawning || (b.ticksToLive--, b.ticksToLive <= 0 ? (b.energy > 0 && a("./_create-energy")(b.x, b.y, b.room, b.energy, f, h), h.remove(b._id), delete f[b._id]) : h.update(b, {
                ticksToLive: b.ticksToLive,
                actionLog: b.actionLog
            })), b.fatigue > 0)) {
                var i = c.filter(b.body, function(a) {
                    return a.hits > 0 && a.type == d.MOVE
                }).length;
                b.fatigue -= 2 * i, b.fatigue < 0 && (b.fatigue = 0), h.update(b._id, {
                    fatigue: b.fatigue
                })
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        "../movement": 66,
        "./_create-energy": 48,
        lodash: 25
    }],
    64: [function(a, b) {
        "use strict"; {
            var c = a("lodash");
            a("../../../utils"), a("../../../game/constants")
        }
        b.exports = function(a, b, d, e, f) {
            if ("creep" == a.type && !(a.spawning || a.energy < b.amount || b.amount < 0)) {
                var g = d[b.id];
                if (g && c.contains(["spawn", "creep", "extension"], g.type) && g.energy != g.energyCapacity && !(Math.abs(g.x - a.x) > 1 || Math.abs(g.y - a.y) > 1)) {
                    var h = b.amount;
                    g.energy + h > g.energyCapacity && (h = g.energyCapacity - g.energy), g.energy += h, a.energy -= h, f.update(a, {
                        energy: a.energy
                    }), f.update(g, {
                        energy: g.energy
                    })
                }
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    65: [function(a, b) {
        "use strict";
        var c = (a("lodash"), a("../../../utils"), a("../../../game/constants"));
        b.exports = function(a, b, d, e) {
            a && "energy" == a.type && (a.energy -= c.ENERGY_DECAY, a.energy <= 0 ? (e.remove(a._id), delete b[a._id]) : e.update(a, {
                energy: a.energy
            }))
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    66: [function(a, b, c) {
        "use strict";
        var d, e, f, g, h = a("lodash"),
            i = a("../../utils"),
            j = a("../../game/constants");
        c.init = function(a, b) {
            d = {}, e = {}, f = a, g = b
        }, c.add = function(a, b, c) {
            var e = a.x + b,
                f = a.y + c;
            e >= 50 && (e = 49), f >= 50 && (f = 49), 0 > e && (e = 0), 0 > f && (f = 0);
            var g = e + "," + f;
            d[g] = d[g] || [], d[g].push(a)
        }, c.check = function() {
            function a(a, b) {
                return h.any(f, function(c) {
                    return c.x == a && c.y == b && (h.contains(j.OBSTACLE_OBJECT_TYPES, c.type) && ("creep" != c.type || !e[c._id]) || "rampart" == c.type && c.user != p.user || "exit" == c.type && "2" != p.user)
                }) || i.checkTerrain(g, a, b, j.TERRAIN_MASK_WALL)
            }

            function b(a) {
                var c = d[a];
                if (e[d[a]._id] = null, delete d[a], c) {
                    var f = c.x + "," + c.y;
                    d[f] && b(f)
                }
            }
            for (var c in d) {
                var k, l = c.split(/,/),
                    m = l[0],
                    n = l[1];
                if (m = parseInt(m), n = parseInt(n), d[c].length > 1) {
                    var o = h.map(d[c], function(a) {
                        var b = h.filter(a.body, function(a) {
                                return a.hits > 0 && a.type == j.MOVE
                            }).length,
                            c = h.filter(a.body, function(a) {
                                return a.type != j.MOVE && a.type != j.CARRY
                            }).length || 1;
                        return c += Math.ceil(a.energy / j.CARRY_CAPACITY), {
                            object: a,
                            rate: b / c
                        }
                    });
                    o.sort(function(a, b) {
                        return b.rate - a.rate
                    }), k = o[0].object
                } else k = d[c][0];
                e[k._id] = {
                    x: m,
                    y: n
                }, d[c] = k
            }
            for (var c in d) {
                var l = c.split(/,/),
                    m = l[0],
                    n = l[1];
                m = parseInt(m), n = parseInt(n);
                var p = d[c],
                    q = m - p.x,
                    r = n - p.y,
                    s = a(m, n) || 1 == q && -1 == r && a(p.x, p.y - 1) && a(p.x + 1, p.y) || 1 == q && 1 == r && a(p.x, p.y + 1) && a(p.x + 1, p.y) || -1 == q && 1 == r && a(p.x, p.y + 1) && a(p.x - 1, p.y) || -1 == q && -1 == r && a(p.x, p.y - 1) && a(p.x - 1, p.y);
                s && b(c)
            }
        }, c.execute = function(a, b) {
            var c = e[a._id];
            if (c) {
                var d = h.filter(f, {
                        x: c.x,
                        y: c.y
                    }),
                    k = 2;
                if (i.checkTerrain(g, c.x, c.y, j.TERRAIN_MASK_SWAMP) && (k = 10), h.any(d, {
                    type: "road"
                })) {
                    k = 1;
                    var l = h.find(f, {
                        x: c.x,
                        y: c.y,
                        type: "road"
                    });
                    l.hits -= j.ROAD_WEAROUT, l.hits <= 0 ? b.remove(l._id) : b.update(l, {
                        hits: l.hits
                    })
                }
                var m = h.filter(a.body, function(a) {
                    return a.type != j.MOVE && a.type != j.CARRY
                }).length;
                m += Math.ceil(a.energy / j.CARRY_CAPACITY), m *= k, b.update(a, {
                    x: c.x,
                    y: c.y,
                    fatigue: m
                })
            }
        }
    }, {
        "../../game/constants": 12,
        "../../utils": 79,
        lodash: 25
    }],
    67: [function(a, b) {
        "use strict";
        var c = (a("lodash"), a("../../../utils"), a("../../../game/constants"));
        b.exports = function(a, b, d, e) {
            a && "rampart" == a.type && (a.ticksToDecay--, a.ticksToDecay <= 0 && (a.hits -= c.RAMPART_DECAY_AMOUNT, a.hits <= 0 ? (e.remove(a._id), delete b[a._id]) : a.ticksToDecay = c.RAMPART_DECAY_TIME), a.hits > 0 && e.update(a, {
                ticksToDecay: a.ticksToDecay,
                hits: a.hits
            }))
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    68: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = a("../../../utils"),
            e = a("../../../game/constants");
        b.exports = function(a, b, f, g) {
            if (!(a.x < 0 || a.x > 49 || a.y < 0 || a.y > 49) && c.contains(["spawn", "extension", "road", "rampart", "constructedWall"], a.structureType) && d.checkConstructionSite(b, a.structureType, a.x, a.y) && d.checkConstructionSite(f, a.structureType, a.x, a.y)) {
                var h = e.CONSTRUCTION_COST[a.structureType];
                "road" == a.structureType && (c.any(b, {
                    x: a.x,
                    y: a.y,
                    type: "swamp"
                }) || d.checkTerrain(f, a.x, a.y, e.TERRAIN_MASK_SWAMP)) && (h *= e.CONSTRUCTION_COST_ROAD_SWAMP_RATIO);
                var i = {
                    structureType: a.structureType,
                    x: a.x,
                    y: a.y,
                    type: "constructionSite",
                    room: a.roomName,
                    user: a.user,
                    ticksToLive: e.CONSTRUCTION_DECAY_TIME,
                    progress: 0,
                    progressTotal: h
                };
                "spawn" == a.structureType && (i.name = a.name), g.insert(i)
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    69: [function(a, b) {
        "use strict"; {
            var c = a("lodash");
            a("../../../utils"), a("../../../game/constants")
        }
        b.exports = function(a, b, d, e) {
            c.any(b, {
                type: "flag",
                user: a.user,
                name: a.name
            }) || a.color && c.contains(["white", "grey", "red", "purple", "blue", "cyan", "green", "yellow", "orange", "brown"], a.color) && (a.x < 0 || a.x > 49 || a.y < 0 || a.y > 49 || e.insert({
                name: a.name,
                x: a.x,
                y: a.y,
                type: "flag",
                room: a.roomName,
                user: a.user,
                color: a.color
            }))
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    70: [function(a, b) {
        "use strict";
        var c = a("lodash");
        b.exports = function(b, d, e, f) {
            b.createFlag && c.forEach(b.createFlag, function(b) {
                a("./create-flag")(b, d, e, f)
            }), b.createConstructionSite && c.forEach(b.createConstructionSite, function(b) {
                a("./create-construction-site")(b, d, e, f)
            })
        }
    }, {
        "./create-construction-site": 68,
        "./create-flag": 69,
        lodash: 25
    }],
    71: [function(a, b) {
        "use strict";
        var c = (a("lodash"), a("../../../utils"), a("../../../game/constants"));
        b.exports = function(a, b, d, e) {
            a && "source" == a.type && a.energy < a.energyCapacity && (a.ticksToRegeneration--, a.ticksToRegeneration <= 0 && (a.energy += Math.min(a.energyCapacity - a.energy, c.ENERGY_REGEN_AMOUNT), a.ticksToRegeneration = c.ENERGY_REGEN_TIME), e.update(a, {
                ticksToRegeneration: a.ticksToRegeneration,
                energy: a.energy
            }))
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    72: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = a("../../../utils"),
            e = a("../../../game/constants");
        b.exports = function(a, b, f, g, h) {
            if (!a.spawning && "spawn" == a.type) {
                b.body = b.body.slice(0, 30);
                var i = d.calcCreepCost(b.body);
                if (!(a.energy < i)) {
                    var j = c.without(b.body, "tough").length - 5;
                    if (j > 0) {
                        var k = c.filter(f, function(b) {
                            return "extension" == b.type && b.user == a.user && b.energy >= e.EXTENSION_ENERGY_COST
                        });
                        if (k.length < j) return;
                        k.sort(function(b, c) {
                            var d = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y)),
                                e = Math.max(Math.abs(c.x - a.x), Math.abs(c.y - a.y));
                            return d - e
                        }), k = k.slice(0, j), k.forEach(function(a) {
                            a.energy -= e.EXTENSION_ENERGY_COST, h.update(a, {
                                energy: a.energy
                            })
                        })
                    }
                    a.energy -= i, h.update(a, {
                        spawning: {
                            name: b.name,
                            needTime: e.CREEP_SPAWN_TIME + b.body.length,
                            remainingTime: e.CREEP_SPAWN_TIME + b.body.length
                        },
                        energy: a.energy
                    });
                    var l = [],
                        m = 0;
                    b.body.forEach(function(a) {
                        c.contains(e.BODYPARTS_ALL, a) && l.push({
                            type: a,
                            hits: 100
                        }), a == e.CARRY && (m += e.CARRY_CAPACITY)
                    }), h.insert({
                        name: b.name,
                        x: a.x,
                        y: a.y,
                        body: l,
                        energy: 0,
                        energyCapacity: m,
                        type: "creep",
                        room: a.room,
                        user: a.user,
                        hits: 100 * l.length,
                        hitsMax: 100 * l.length,
                        spawning: !0,
                        fatigue: 0
                    })
                }
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    73: [function(a, b) {
        "use strict";
        b.exports = function(b, c, d, e, f) {
            c.createCreep && a("./create-creep")(b, c.createCreep, d, e, f), c.transferEnergy && a("./transfer-energy")(b, c.transferEnergy, d, e, f)
        }
    }, {
        "./create-creep": 72,
        "./transfer-energy": 75
    }],
    74: [function(a, b) {
        "use strict";
        var c = a("lodash"),
            d = a("../../../utils"),
            e = a("../../../game/constants");
        b.exports = function(a, b, f, g) {
            if (a && "spawn" == a.type && a.spawning)
                if (a.spawning.remainingTime--, a.spawning.remainingTime <= 0) {
                    for (var h, i, j, k = function(a) {
                        return c.contains(e.OBSTACLE_OBJECT_TYPES, a.type) && a.x == h && a.y == i
                    }, l = 1; 8 >= l; l++) {
                        var m = d.getOffsetsByDirection(l),
                            n = m[0],
                            o = m[1];
                        if (h = a.x + n, i = a.y + o, j = c.any(b, k) || d.checkTerrain(f, h, i, e.TERRAIN_MASK_WALL), !j) break
                    }
                    j ? g.update(a, {
                        spawning: {
                            remainingTime: 0
                        }
                    }) : (g.update(c.find(b, {
                        type: "creep",
                        name: a.spawning.name,
                        x: a.x,
                        y: a.y
                    }), {
                        x: h,
                        y: i,
                        spawning: !1,
                        ticksToLive: e.CREEP_LIFE_TIME
                    }), g.update(a, {
                        spawning: null
                    }))
                } else g.update(a, {
                    spawning: {
                        remainingTime: a.spawning.remainingTime
                    }
                })
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    75: [function(a, b) {
        "use strict";
        a("lodash"), a("../../../utils"), a("../../../game/constants");
        b.exports = function(a, b, c, d, e) {
            if ("spawn" == a.type) {
                var f = c[b.id];
                if (f && "creep" == f.type && !(f.energy >= f.energyCapacity) && !(Math.abs(f.x - a.x) > 1 || Math.abs(f.y - a.y) > 1)) {
                    var g = b.amount;
                    f.energy + g > f.energyCapacity && (g = f.energyCapacity - f.energy), a.energy < g || (f.energy += g, a.energy -= g, e.update(a, {
                        energy: a.energy
                    }), e.update(f, {
                        energy: f.energy
                    }))
                }
            }
        }
    }, {
        "../../../game/constants": 12,
        "../../../utils": 79,
        lodash: 25
    }],
    76: [function(a, b) {
        "use strict";

        function c(a) {
            for (var b = [], c = {
                M: "move",
                A: "attack",
                R: "ranged_attack",
                T: "tough",
                H: "heal"
            }, d = 0; d < a.length; d++) b.push(c[a.charAt(d)]);
            return b
        }
        var d = a("../../core/core.js"),
            e = (a("q"), a("lodash")),
            f = (a("../../game/constants"), {
                1: [{
                    name: "Normal",
                    body: ["move", "attack"]
                }],
                2: [{
                    name: "Normal",
                    body: ["move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "attack"]
                }],
                3: [{
                    name: "Siege",
                    body: ["tough", "tough", "tough", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "heal", "move", "attack"]
                }],
                4: [{
                    name: "Siege",
                    body: ["tough", "tough", "tough", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["move", "heal"]
                }],
                5: [{
                    name: "Siege",
                    body: ["tough", "tough", "tough", "move", "ranged_attack", "move", "attack", "move", "attack"]
                }, {
                    name: "Defend",
                    body: ["tough", "move", "ranged_attack", "move", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["move", "heal"]
                }],
                6: [{
                    name: "Siege",
                    body: ["tough", "tough", "tough", "move", "ranged_attack", "move", "attack", "move", "attack", "attack"]
                }, {
                    name: "Defend",
                    body: ["tough", "move", "tough", "move", "ranged_attack", "move", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "heal", "move", "heal"]
                }],
                7: [{
                    name: "Siege",
                    body: ["tough", "tough", "tough", "move", "ranged_attack", "move", "attack", "move", "attack", "attack"]
                }, {
                    name: "Defend",
                    body: ["tough", "move", "tough", "move", "ranged_attack", "move", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "tough", "ranged_attack", "move", "ranged_attack", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "tough", "ranged_attack", "move", "ranged_attack", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "heal", "move", "move", "heal", "move", "attack"]
                }],
                8: [{
                    name: "Siege",
                    body: ["tough", "tough", "tough", "move", "ranged_attack", "move", "attack", "move", "attack", "attack"]
                }, {
                    name: "Defend",
                    body: ["tough", "move", "tough", "move", "ranged_attack", "move", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "tough", "ranged_attack", "move", "ranged_attack", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "tough", "ranged_attack", "move", "ranged_attack", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "heal", "move", "move", "heal", "move", "attack"]
                }, {
                    name: "Defend",
                    body: ["tough", "move", "tough", "move", "ranged_attack", "move", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "tough", "move", "ranged_attack", "move", "move", "ranged_attack", "move", "attack"]
                }],
                9: [{
                    name: "Siege",
                    body: ["tough", "tough", "tough", "move", "ranged_attack", "attack", "attack", "attack", "attack", "move", "attack", "move", "attack", "attack"]
                }, {
                    name: "Defend",
                    body: ["tough", "move", "tough", "move", "ranged_attack", "move", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "tough", "ranged_attack", "move", "ranged_attack", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "tough", "ranged_attack", "move", "ranged_attack", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "heal", "move", "move", "heal", "move", "attack"]
                }, {
                    name: "Defend",
                    body: ["tough", "move", "tough", "move", "ranged_attack", "move", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "tough", "move", "ranged_attack", "move", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "heal", "move", "move", "heal", "move", "attack"]
                }],
                10: [{
                    name: "Siege",
                    body: ["tough", "tough", "tough", "move", "ranged_attack", "attack", "attack", "attack", "attack", "move", "attack", "move", "attack", "attack"]
                }, {
                    name: "Siege",
                    body: ["tough", "tough", "tough", "move", "ranged_attack", "attack", "attack", "attack", "attack", "move", "attack", "move", "attack", "attack"]
                }, {
                    name: "Defend",
                    body: ["tough", "tough", "tough", "move", "ranged_attack", "move", "ranged_attack", "move", "attack", "move", "ranged_attack", "move", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "tough", "ranged_attack", "move", "ranged_attack", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "heal", "move", "move", "heal", "move", "attack"]
                }, {
                    name: "Defend",
                    body: ["tough", "move", "tough", "move", "ranged_attack", "move", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "tough", "move", "ranged_attack", "move", "move", "ranged_attack", "move", "attack"]
                }, {
                    name: "Normal",
                    body: ["tough", "move", "heal", "move", "move", "heal", "move", "attack"]
                }],
                11: [{
                    name: "Siege",
                    body: c("TTTMRAAAAMAMRR")
                }, {
                    name: "Siege",
                    body: c("TTTMRAAAAMAMRR")
                }, {
                    name: "Defend",
                    body: c("TTTMRMRMAMRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTRMRMRMA")
                }, {
                    name: "Normal",
                    body: c("TMHHHHMMHMR")
                }, {
                    name: "Defend",
                    body: c("TTTTMMRRRRMMRMR")
                }, {
                    name: "Normal",
                    body: c("TTTTMMRRRRMMRMR")
                }, {
                    name: "Normal",
                    body: c("TMHMMHMR")
                }],
                12: [{
                    name: "Siege",
                    body: c("TTTMRAAAAMAMRR")
                }, {
                    name: "Siege",
                    body: c("TTTMRAAAAMAMRR")
                }, {
                    name: "Defend",
                    body: c("TTTMRMRMAMRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTRMRMRMA")
                }, {
                    name: "Normal",
                    body: c("TMHHHHMMHMR")
                }, {
                    name: "Defend",
                    body: c("TTTTMMRRRRMMRMR")
                }, {
                    name: "Normal",
                    body: c("TTTTMMRRRRMMRMR")
                }, {
                    name: "Normal",
                    body: c("TMHMMHMR")
                }],
                13: [{
                    name: "Siege",
                    body: c("TTTTRAMMRAAAAMAMRR")
                }, {
                    name: "Siege",
                    body: c("TTTTRAMMRAAAAMAMRR")
                }, {
                    name: "Defend",
                    body: c("TTTRMRMRMMRMRMAMRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTRMRMRMA")
                }, {
                    name: "Normal",
                    body: c("TTMHMHMHMMHHHHMMHMR")
                }, {
                    name: "Defend",
                    body: c("TTTTMMRRRRMMRMR")
                }, {
                    name: "Normal",
                    body: c("TTTTMMRRRRMMRMR")
                }, {
                    name: "Normal",
                    body: c("TRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("TRRHMHMMHMMHMR")
                }],
                14: [{
                    name: "Siege",
                    body: c("TTTTTRAMRAMMRAAAAMRMRR")
                }, {
                    name: "Siege",
                    body: c("TTTTTRAMRAMMRAAAAMRMRR")
                }, {
                    name: "Defend",
                    body: c("TTTTTMMRMRMRMMRMRMAMRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTTTRMRMRMRMR")
                }, {
                    name: "Normal",
                    body: c("TTTMMHMHMHMMHHHHMMHMR")
                }, {
                    name: "Defend",
                    body: c("TTTTMMRRRRMMRMR")
                }, {
                    name: "Normal",
                    body: c("TTTTMMRRRRMMRMR")
                }, {
                    name: "Normal",
                    body: c("TRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("TRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("TTTTMMRRRRMMRMA")
                }],
                15: [{
                    name: "Siege",
                    body: c("TTTAAAAAAARRRRMRAMMRAAAAMRMRR")
                }, {
                    name: "Siege",
                    body: c("TTTAAAAAAARRRRMRAMMRAAAAMRMRR")
                }, {
                    name: "Defend",
                    body: c("TTTRRRMMMRMRMRMMRMRMAMRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTTRRMRMRMRMRMRMRMA")
                }, {
                    name: "Normal",
                    body: c("TTTTMMMHMHMHMHMMHHHHMMHMR")
                }, {
                    name: "Defend",
                    body: c("TTTRRMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTTRRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTTHMMMHMRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("TTTHMMMHMRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("TTTRRRMRMMMRRRRMMRMA")
                }],
                16: [{
                    name: "Siege",
                    body: c("TTAAAAAAARRRRRMRAMMRAAAAMRMRR")
                }, {
                    name: "Siege",
                    body: c("TTAAAAAAARRRRRMRAMMRAAAAMRMRR")
                }, {
                    name: "Defend",
                    body: c("TTRRRRRMMMRMRMRMMRMRMAMRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTRRRRMRMRMRMRMRMRMRMA")
                }, {
                    name: "Normal",
                    body: c("TTRRRRMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTTTRRMMMMHMHMHMHMMHHHHMMHMR")
                }, {
                    name: "Defend",
                    body: c("TTRRRRMMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTRRRRMMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTRHMHMMMHMRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("TTRHMHMMMHMRRHMHMMHMMHMR")
                }],
                17: [{
                    name: "Siege",
                    body: c("RRAAAAAAARRRRRRMRAMMRAAAAMRMRR")
                }, {
                    name: "Siege",
                    body: c("RRAAAAAAARRRRRRMRAMMRAAAAMRMRR")
                }, {
                    name: "Defend",
                    body: c("RRRMRMRMRMRMRMRMMRMRMAMRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTRRMRMRMRMRMRMRMRMRMRMRMA")
                }, {
                    name: "Normal",
                    body: c("TTRRRMMRMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTRRRHMHMMMMHMHMHMHMMHHHHMMHMR")
                }, {
                    name: "Defend",
                    body: c("RRRRRRMMMRMMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTRRRRMMMRMMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("TTRHHMMHMHMMMHMRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("TTRHHMMHMHMMMHMRRHMHMMHMMHMR")
                }],
                18: [{
                    name: "Siege",
                    body: c("RRAARRRRRAAAAAAMRAMMRAAAAMRMRR")
                }, {
                    name: "Siege",
                    body: c("RRAARRRRRAAAAAAMRAMMRAAAAMRMRR")
                }, {
                    name: "Defend",
                    body: c("RRRRMRMRMRMRMRMRMMRMRMAMRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMMRRMRMRMRMRMRMRMRMRMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMRMRMRMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRHMHMHMMMMHMHMHMHMMHHHHMMHMR")
                }, {
                    name: "Defend",
                    body: c("RRRRMRMRMMRMMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMRMRMMRMMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRHHHMHMHMHMMMHMRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("RRRHHHMHMHMHMMMHMRRHMHMMHMMHMR")
                }],
                19: [{
                    name: "Siege",
                    body: c("RRAARRRRRAAAAAAMRAMMRAAAAMRMRR")
                }, {
                    name: "Siege",
                    body: c("RRAARRRRRAAAAAAMRAMMRAAAAMRMRR")
                }, {
                    name: "Defend",
                    body: c("RRRRMRMRMRMRMRMRMMRMRMAMRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMMRRMRMRMRMRMRMRMRMRMRMA")
                }, {
                    name: "Defend",
                    body: c("RRRRMRMRMMRMMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMRMRMMRMMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRHHHMHMHMHMMMHMRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("RRRHHHMHMHMHMMMHMRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMRMRMRMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMRMRMRMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMRMRMRMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRHMHMHMMMMHMHMHMHMMHHHHMMHMR")
                }],
                20: [{
                    name: "Siege",
                    body: c("RRAARRRRRAAAAAAMRAMMRAAAAMRMRR")
                }, {
                    name: "Siege",
                    body: c("RRAARRRRRAAAAAAMRAMMRAAAAMRMRR")
                }, {
                    name: "Defend",
                    body: c("RRRRMRMRMRMRMRMRMMRMRMAMRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMMRRMRMRMRMRMRMRMRMRMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRHMHMHMMMMHMHMHMHMMHHHHMMHMR")
                }, {
                    name: "Defend",
                    body: c("RRRRMRMRMMRMMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMRMRMMRMMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMRMRMRMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMRMRMRMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMRMRMRMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRRMRMRMRMRMRMRMRMMMRRRRMMRMA")
                }, {
                    name: "Normal",
                    body: c("RRRHHHMHMHMHMMMHMRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("RRRHHHMHMHMHMMMHMRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("RRRHHHMHMHMHMMMHMRRHMHMMHMMHMR")
                }, {
                    name: "Normal",
                    body: c("RRRHHHMHMHMHMMMHMRRHMHMMHMMHMR")
                }]
            });
        b.exports = function(a, b, c, g, h) {
            if (b.score++, !e.any(c, {
                type: "spawn"
            }) || b.finishing) b.status = "finished";
            else {
                if (b.timeToWave--, b.timeToWave <= 0) {
                    b.timeToWave = 200, b.wave > 20 && (b.timeToWave -= 10 * (b.wave - 20), b.timeToWave < 20 && (b.timeToWave = 20)), b.invaders = b.invaders || {
                        bodies: []
                    };
                    var i = b.wave;
                    i > 20 && (i = 20);
                    for (var j = f[i], k = 0; k < j.length; k++) b.invaders.bodies.push({
                        name: j[k].name + (new Date).getTime() + Math.floor(1e5 * Math.random()),
                        body: e.map(j[k].body, function(a) {
                            return new Object({
                                type: a,
                                hits: 100
                            })
                        }),
                        energy: 0,
                        energyCapacity: 0,
                        type: "creep",
                        room: a,
                        user: "2",
                        hits: 100 * j[k].body.length,
                        hitsMax: 100 * j[k].body.length,
                        spawning: !1,
                        fatigue: 0,
                        ticksToLive: 300
                    });
                    var l = [1, 3, 5, 7],
                        m = [];
                    l.sort(function() {
                        return Math.random() > Math.random()
                    }), l.forEach(function(a) {
                        e.any(c, {
                            type: "exit",
                            exit: a
                        }) && m.push(a)
                    }), b.invaders.exit = m[0], b.wave++
                }
                if (b.invaders.bodies.length) {
                    var n, o = {};
                    do {
                        if (n = e.find(c, function(a) {
                            return "exit" == a.type && a.exit == b.invaders.exit && !o[a.x + "," + a.y] && !e.any(c, {
                                type: "creep",
                                x: a.x,
                                y: a.y
                            })
                        }), !n) break;
                        o[n.x + "," + n.y] = !0, b.invaders.bodies[0].x = n.x, b.invaders.bodies[0].y = n.y, h.insert(b.invaders.bodies[0]), b.invaders.bodies.splice(0, 1)
                    } while (n && b.invaders.bodies.length)
                }
            }
            return d.saveGameInfo(b, c)
        }
    }, {
        "../../core/core.js": 3,
        "../../game/constants": 12,
        lodash: 25,
        q: 46
    }],
    77: [function(a) {
        "use strict";

        function b(b, g, h, i, j) {
            var k = c.bulkObjectsWrite(),
                l = i[e.findKey(i)];
            "terrain" == l.type && (i = l.terrain), e.forEach(h, function(a) {
                "creep" == a.type && (a.actionLog = {
                    attacked: null,
                    healed: null,
                    attack: null,
                    rangedAttack: null,
                    rangedMassAttack: null,
                    rangedHeal: null,
                    harvest: null,
                    heal: null,
                    repair: null,
                    build: null,
                    say: null
                })
            }), f.init(h, i), g && e.forEach(g.users, function(b) {
                for (var c in b.objects) {
                    var d = b.objects[c],
                        e = h[c];
                    "room" != c ? e && ("creep" == e.type && a("./intents/creeps/intents")(e, d, h, i, k), "spawn" == e.type && a("./intents/spawns/intents")(e, d, h, i, k), ("flag" == e.type || "constructionSite" == e.type) && d.remove && k.remove(c)) : a("./intents/room/intents")(d, h, i, k)
                }
            }), f.check(), e.forEach(h, function(b) {
                "energy" == b.type && a("./intents/energy/tick")(b, h, i, k), "source" == b.type && a("./intents/sources/tick")(b, h, i, k), "creep" == b.type && a("./intents/creeps/tick")(b, h, i, k), "spawn" == b.type && a("./intents/spawns/tick")(b, h, i, k), "rampart" == b.type && a("./intents/ramparts/tick")(b, h, i, k), "constructionSite" == b.type && a("./intents/construction-sites/tick")(b, h, i, k)
            });
            var m = [];
            return j && "active" == j.status && m.push(a("./intents/survival")(b, j, h, i, k)), m.push(k.execute()), d.all(m)
        } {
            var c = a("../core/core.js"),
                d = a("q"),
                e = a("lodash"),
                f = (a("../game/constants"), a("./intents/movement"));
            a("../utils")
        }
        c.connect().then(function() {
            function a() {
                var f;
                e.fetch().then(function(a) {
                    return d.all([c.getRoomIntents(f = a), c.getRoomObjects(a), c.getRoomTerrain(a), c.getGameInfo(a)])
                }).then(function(a) {
                        return b(f, a[0], a[1], a[2], a[3])
                    }).catch(function(a) {
                        return void 0
                    }).then(function() {
                        return c.clearRoomIntents(f)
                    }).then(function() {
                        return e.markDone(f)
                    }).catch(function(a) {
                        return void 0
                    }).finally(function() {
                        return setTimeout(a, 0)
                    })
            }
            var e = c.queue.create("rooms");
            a()
        }).catch(function(a) {}), "undefined " == typeof self && setInterval(function() {
            var a = d.getUnhandledReasons();
            a.forEach(function(a) {
                return void 0
            }), d.resetUnhandledRejections()
        }, 1e3)
    }, {
        "../core/core.js": 3,
        "../game/constants": 12,
        "../utils": 79,
        "./intents/construction-sites/tick": 47,
        "./intents/creeps/intents": 54,
        "./intents/creeps/tick": 63,
        "./intents/energy/tick": 65,
        "./intents/movement": 66,
        "./intents/ramparts/tick": 67,
        "./intents/room/intents": 70,
        "./intents/sources/tick": 71,
        "./intents/spawns/intents": 73,
        "./intents/spawns/tick": 74,
        "./intents/survival": 76,
        lodash: 25,
        q: 46
    }],
    78: [function(a) {
        "use strict";

        function b(a) {
            function b() {
                var b = {};
                for (var c in d.intents)
                    if ("room" != c) {
                        if (c in g.userObjects) {
                            var h = g.userObjects[c],
                                i = d.intents[c];
                            b[h.room] = b[h.room] || {};
                            var j = b[h.room][c] = {};
                            i.move && (j.move = {
                                direction: parseInt(i.move.direction)
                            }), i.harvest && (j.harvest = {
                                id: "" + i.harvest.id
                            }), i.attack && (j.attack = {
                                id: "" + i.attack.id,
                                x: parseInt(i.attack.x),
                                y: parseInt(i.attack.y)
                            }), i.rangedAttack && (j.rangedAttack = {
                                id: "" + i.rangedAttack.id
                            }), i.rangedMassAttack && (j.rangedMassAttack = {}), i.heal && (j.heal = {
                                id: "" + i.heal.id,
                                x: parseInt(i.heal.x),
                                y: parseInt(i.heal.y)
                            }), i.rangedHeal && (j.rangedHeal = {
                                id: "" + i.rangedHeal.id
                            }), i.repair && (j.repair = {
                                id: "" + i.repair.id,
                                x: parseInt(i.repair.x),
                                y: parseInt(i.repair.y)
                            }), i.build && (j.build = {
                                id: "" + i.build.id,
                                x: parseInt(i.build.x),
                                y: parseInt(i.build.y)
                            }), i.transferEnergy && (j.transferEnergy = {
                                id: "" + i.transferEnergy.id,
                                amount: parseInt(i.transferEnergy.amount)
                            }), i.dropEnergy && (j.dropEnergy = {
                                amount: parseInt(i.dropEnergy.amount)
                            }), i.pickup && (j.pickup = {
                                id: "" + i.pickup.id
                            }), i.createCreep && (j.createCreep = {
                                name: "" + i.createCreep.name,
                                body: f.filter(i.createCreep.body, function(a) {
                                    return f.contains(e.BODYPARTS_ALL, a)
                                })
                            }), i.suicide && (j.suicide = {}), i.remove && (j.remove = {}), i.say && (j.say = {
                                message: i.say.message.substring(0, 10)
                            })
                        }
                    } else {
                        var k = d.intents.room;
                        k.createFlag && f.forEach(k.createFlag, function(c) {
                            b[c.roomName] = b[c.roomName] || {};
                            var d = b[c.roomName].room = b[c.roomName].room || {};
                            d.createFlag = d.createFlag || [], d.createFlag.push({
                                x: parseInt(c.x),
                                y: parseInt(c.y),
                                name: "" + c.name,
                                color: "" + c.color,
                                roomName: c.roomName,
                                user: a
                            })
                        }), k.createConstructionSite && f.forEach(k.createConstructionSite, function(c) {
                            b[c.roomName] = b[c.roomName] || {};
                            var d = b[c.roomName].room = b[c.roomName].room || {};
                            d.createConstructionSite = d.createConstructionSite || [], d.createConstructionSite.push({
                                x: parseInt(c.x),
                                y: parseInt(c.y),
                                structureType: "" + c.structureType,
                                name: "" + c.name,
                                roomName: "" + c.roomName,
                                user: a
                            })
                        })
                    }
                return b
            }
            var d, g;
            return c.getUserRuntimeData(a).then(function(a) {
                return c.makeRuntime(g = a)
            }).then(function(b) {
                    return d = b, c.sendConsoleMessages(a, d.console), c.saveUserMemory(a, d.memory)
                }).then(function() {
                    return c.saveUserIntents(a, b())
                })
        }
        var c = a("./core/core"),
            d = a("q"),
            e = a("./game/constants"),
            f = a("lodash"),
            g = 0;
        c.connect().then(function() {
            function a() {
                var e;
                g++, d.fetch().then(function(a) {
                    return b(e = a)
                }).catch(function(a) {
                        return c.sendConsoleError(e, a)
                    }).then(function() {
                        return d.markDone(e)
                    }).catch(function(a) {
                        return void 0
                    }).finally(function() {
                        return setTimeout(a, 0)
                    })
            }
            var d = c.queue.create("users");
            a()
        }).catch(function(a) {}), "undefined " == typeof self && setInterval(function() {
            var a = d.getUnhandledReasons();
            a.forEach(function(a) {
                return void 0
            }), d.resetUnhandledRejections()
        }, 1e3)
    }, {
        "./core/core": 3,
        "./game/constants": 12,
        lodash: 25,
        q: 46
    }],
    79: [function(a, b, c) {
        "use strict";
        var d = a("lodash"),
            e = a("./game/constants");
        c.fetchXYArguments = function(a, b) {
            var c, e;
            if (d.isUndefined(b) || !d.isNumber(b)) {
                if (!d.isObject(a)) return [void 0, void 0];
                d.isUndefined(a.x) || (c = a.x, e = a.y), a.pos && (c = a.pos.x, e = a.pos.y)
            } else c = a, e = b;
            return [c, e]
        }, c.getDirection = function(a, b) {
            var c = Math.abs(a),
                d = Math.abs(b);
            return c > 2 * d ? a > 0 ? e.RIGHT : e.LEFT : d > 2 * c ? b > 0 ? e.BOTTOM : e.TOP : a > 0 && b > 0 ? e.BOTTOM_RIGHT : a > 0 && 0 > b ? e.TOP_RIGHT : 0 > a && b > 0 ? e.BOTTOM_LEFT : 0 > a && 0 > b ? e.TOP_LEFT : void 0
        }, c.getOffsetsByDirection = function(a) {
            var b = 0,
                c = 0;
            switch (a) {
                case e.TOP:
                    c--;
                    break;
                case e.TOP_RIGHT:
                    c--, b++;
                    break;
                case e.RIGHT:
                    b++;
                    break;
                case e.BOTTOM_RIGHT:
                    c++, b++;
                    break;
                case e.BOTTOM:
                    c++;
                    break;
                case e.BOTTOM_LEFT:
                    c++, b--;
                    break;
                case e.LEFT:
                    b--;
                    break;
                case e.TOP_LEFT:
                    c--, b--
            }
            return [b, c]
        }, c.calcCreepCost = function(a) {
            var b = 0;
            return a.forEach(function(a) {
                b += d.isObject(a) ? e.BODYPART_COST[a.type] : e.BODYPART_COST[a]
            }), b
        }, c.checkConstructionSite = function(a, b, f, g) {
            if (d.isString(a)) {
                if (c.checkTerrain(a, f, g, e.TERRAIN_MASK_WALL)) return !1;
                if ("spawn" == b || "extension" == b)
                    for (var h = -1; 1 >= h; h++)
                        for (var i = -1; 1 >= i; i++)
                            if (c.checkTerrain(a, f + h, g + i, e.TERRAIN_MASK_WALL)) return !1;
                return !0
            }
            return d.any(a, {
                x: f,
                y: g,
                type: b
            }) ? !1 : d.any(a, {
                x: f,
                y: g,
                type: "constructionSite"
            }) ? !1 : d.any(a, function(a) {
                return a.x == f && a.y == g && d.contains(["wall", "constructedWall", "spawn", "extension", "exit"], a.type)
            }) ? !1 : d.any(a, function(a) {
                return "exit" == a.type && Math.abs(a.x - f) < 2 && Math.abs(a.y - g) < 2
            }) ? !1 : "spawn" != b && "extension" != b || !d.any(a, function(a) {
                return "source" == a.type ? Math.abs(a.x - f) < 5 && Math.abs(a.y - g) < 5 : Math.abs(a.x - f) < 2 && Math.abs(a.y - g) < 2 && d.contains(["wall", "constructedWall", "spawn", "extension", "exit"], a.type)
            }) ? !0 : !1
        }, c.getDiff = function(a, b) {
            function c(a) {
                var b = {};
                return d.forEach(a, function(a) {
                    return b[a._id] = a
                }), b
            }
            var e = {},
                f = c(a),
                g = c(b);
            return d.forEach(a, function(a) {
                if (g[a._id]) {
                    var b = g[a._id],
                        c = e[a._id] = {};
                    for (var f in a)
                        if (d.isUndefined(b[f])) c[f] = null;
                        else if (typeof a[f] != typeof b[f] || a[f] && !b[f]) c[f] = b[f];
                        else if (d.isObject(a[f])) {
                            c[f] = {};
                            for (var h in a[f]) d.isEqual(a[f][h], b[f][h]) || (c[f][h] = b[f][h]);
                            for (var h in b[f]) d.isUndefined(a[f][h]) && (c[f][h] = b[f][h]);
                            d.size(c[f]) || delete e[a._id][f]
                        } else d.isEqual(a[f], b[f]) || (c[f] = b[f]);
                    for (var f in b) d.isUndefined(a[f]) && (c[f] = b[f]);
                    d.size(c) || delete e[a._id]
                } else e[a._id] = null
            }), d.forEach(b, function(a) {
                f[a._id] || (e[a._id] = a)
            }), e
        }, c.encodeTerrain = function(a) {
            for (var b = "", c = 0; 50 > c; c++)
                for (var f = 0; 50 > f; f++) {
                    var g = d.filter(a, {
                            x: f,
                            y: c
                        }),
                        h = 0;
                    d.any(g, {
                        type: "wall"
                    }) && (h |= e.TERRAIN_MASK_WALL), d.any(g, {
                        type: "swamp"
                    }) && (h |= e.TERRAIN_MASK_SWAMP), b += h
                }
            return b
        }, c.decodeTerrain = function(a) {
            var b = [];
            for (var c in a)
                if ("terrain" == a[c].type)
                    for (var d = 0; 50 > d; d++)
                        for (var f = 0; 50 > f; f++) {
                            var g = a[c].terrain.charAt(50 * d + f);
                            g & e.TERRAIN_MASK_WALL && b.push({
                                room: a[c].room,
                                x: f,
                                y: d,
                                type: "wall"
                            }), g & e.TERRAIN_MASK_SWAMP && b.push({
                                room: a[c].room,
                                x: f,
                                y: d,
                                type: "swamp"
                            })
                        }
            return b
        }, c.checkTerrain = function(a, b, c, d) {
            return (parseInt(a.charAt(50 * c + b)) & d) > 0
        }
    }, {
        "./game/constants": 12,
        lodash: 25
    }],
    80: [function(a, b) {
        function c() {
            if (!g) {
                g = !0;
                for (var a, b = f.length; b;) {
                    a = f, f = [];
                    for (var c = -1; ++c < b;) a[c]();
                    b = f.length
                }
                g = !1
            }
        }

        function d() {}
        var e = b.exports = {},
            f = [],
            g = !1;
        e.nextTick = function(a) {
            f.push(a), g || setTimeout(c, 0)
        }, e.title = "browser", e.browser = !0, e.env = {}, e.argv = [], e.version = "", e.on = d, e.addListener = d, e.once = d, e.off = d, e.removeListener = d, e.removeAllListeners = d, e.emit = d, e.binding = function() {
            throw new Error("process.binding is not supported")
        }, e.cwd = function() {
            return "/"
        }, e.chdir = function() {
            throw new Error("process.chdir is not supported")
        }, e.umask = function() {
            return 0
        }
    }, {}],
    81: [function(a) {
        var b = [];
        self.onmessage = function(c) {
            if ("launch" == c.data.type) {
                switch (c.data.name) {
                    case "main":
                        a("../.engine/main.js");
                        break;
                    case "runner":
                        a("../.engine/runner.js");
                        break;
                    case "processor":
                        a("../.engine/processor/processor.js");
                        break;
                    case "runtime":
                        a("../.engine/core/runtime.js")
                }
                b.forEach(function(a) {
                    self.onmessage(a)
                })
            } else b.push(c)
        }
    }, {
        "../.engine/core/runtime.js": 9,
        "../.engine/main.js": 24,
        "../.engine/processor/processor.js": 77,
        "../.engine/runner.js": 78
    }]
}, {}, [81]);