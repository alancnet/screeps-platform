Game = {
    "creeps": {
        "Builder1": {
            "id": "id116610",
            "name": "Builder1",
            "toString": function () {
                return "[creep " + (j.user == a.user._id ? j.name : "#" + i) + "]"
            },
            "pos": {
                "x": 21,
                "y": 24,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "body": [
                {
                    "type": "work",
                    "hits": 100
                },
                {
                    "type": "work",
                    "hits": 100
                },
                {
                    "type": "work",
                    "hits": 100
                },
                {
                    "type": "carry",
                    "hits": 100
                },
                {
                    "type": "move",
                    "hits": 100
                }
            ],
            "my": true,
            "owner": {
                "username": "Player 54d2f8109facf3600348e265"
            },
            "spawning": false,
            "ticksToLive": 1568,
            "energy": 50,
            "energyCapacity": 50,
            "fatigue": 0,
            "hits": 500,
            "hitsMax": 500,
            "memory": {
                "role": "builder"
            },
            "room": {
                "name": "sim",
                "mode": "simulation",
                "toString": function () {
                    return "[room " + i + "]"
                },
                "find": function (a, b) {
                    var c, f = this;
                    switch (b = b || {}, a) {
                        case e.CREEPS:
                            c = d.where(h.creeps, function (a) {
                                return a.room == f && !a.spawning
                            });
                            break;
                        case e.MY_CREEPS:
                            c = d.where(h.creeps, function (a) {
                                return a.room == f && !a.spawning && a.my
                            });
                            break;
                        case e.HOSTILE_CREEPS:
                            c = d.where(h.creeps, function (a) {
                                return a.room == f && !a.spawning && !a.my
                            });
                            break;
                        case e.MY_SPAWNS:
                            c = d.where(h.spawns, function (a) {
                                return a.room == f && a.my === !0
                            });
                            break;
                        case e.HOSTILE_SPAWNS:
                            c = d.where(h.spawns, function (a) {
                                return a.room == f && a.my === !1
                            });
                            break;
                        case e.SOURCES_ACTIVE:
                            c = d.where(h.sources, function (a) {
                                return a.room == f && !a.spawning && a.energy > 0
                            });
                            break;
                        case e.SOURCES:
                            c = d.where(h.sources, function (a) {
                                return a.room == f
                            });
                            break;
                        case e.DROPPED_ENERGY:
                            c = d.where(h.energy, function (a) {
                                return a.room == f
                            });
                            break;
                        case e.STRUCTURES:
                            c = d.where(h.structures, function (a) {
                                return a.room == f
                            });
                            break;
                        case e.MY_STRUCTURES:
                            c = d.where(h.structures, function (a) {
                                return a.room == f && a.my === !0
                            });
                            break;
                        case e.HOSTILE_STRUCTURES:
                            c = d.where(h.structures, function (a) {
                                return a.room == f && a.my === !1
                            });
                            break;
                        case e.FLAGS:
                            c = d.where(h.flags, function (a) {
                                return a.room == f
                            });
                            break;
                        case e.CONSTRUCTION_SITES:
                            c = d.where(h.constructionSites, function (a) {
                                return a.room == f && a.my
                            });
                            break;
                        case e.EXIT_TOP:
                            c = d.where(h.exits, function (a) {
                                return a.room == f && a.exit == e.TOP
                            });
                            break;
                        case e.EXIT_RIGHT:
                            c = d.where(h.exits, function (a) {
                                return a.room == f && a.exit == e.RIGHT
                            });
                            break;
                        case e.EXIT_BOTTOM:
                            c = d.where(h.exits, function (a) {
                                return a.room == f && a.exit == e.BOTTOM
                            });
                            break;
                        case e.EXIT_LEFT:
                            c = d.where(h.exits, function (a) {
                                return a.room == f && a.exit == e.LEFT
                            });
                            break;
                        default:
                            c = []
                    }
                    return b.filter && (c = d.filter(c, b.filter)), c
                },
                "lookAt": function (b, c) {
                    function e(a, b) {
                        var c = d.where(b, {
                            pos: {
                                x: j,
                                y: k
                            }
                        });
                        c.length && (l = l.concat(d.map(c, function (b) {
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
                    return e("creep", h.creeps), e("energy", h.energy), e("source", h.sources), e("structure", h.structures), e("flag", h.flags), e("constructionSite", h.constructionSites), e("exit", h.exits), ["roomObjects", "roomTerrain"].forEach(function (b) {
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
                "lookAtArea": function (b, c, e, f) {
                    function g(a, g) {
                        var h = g;
                        (b > 0 || c > 0 || 49 > e || 49 > f) && (h = d.where(g, n)), d.forEach(h, function (b) {
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
                    var n = function (a) {
                        return (a.room == j || a.room == i) && a.pos && a.pos.y >= b && a.pos.y <= e && a.pos.x >= c && a.pos.x <= f || !a.pos && a.y >= b && a.y <= e && a.x >= c && a.x <= f
                    };
                    g("creep", h.creeps), g("energy", h.energy), g("source", h.sources), g("structure", h.structures), g("flag", h.flags), g("constructionSite", h.constructionSites), g("exit", h.exits), ["roomObjects", "roomTerrain"].forEach(function (g) {
                        var h = a[g];
                        (b > 0 || c > 0 || 49 > e || 49 > f) && (h = d.where(a[g], function (a) {
                            return ("wall" == a.type || "swamp" == a.type) && n(a)
                        })), d.forEach(h, function (a) {
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
                "findPath": function (a, b, c) {
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
                        if (Math.abs(f - k) < 2 && Math.abs(h - m) < 2) return [
                            {
                                x: k,
                                y: m,
                                dx: k - f,
                                dy: m - h,
                                direction: g.getDirection(k - f, m - h)
                            }
                        ];
                        var j = n(c),
                            p = l(c);
                        j.setWalkableAt(k, m, !0), e = p.findPath(f, h, k, m, j)
                    }
                    e.splice(0, 1);
                    var q = f,
                        v = h,
                        w = d.map(e, function (a) {
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
                "getPositionAt": function (a, b) {
                    return 0 > a || a > 49 || 0 > b || b > 49 ? null : c.makePos(a, b, i, h)
                },
                "createFlag": function (a, c, f, k) {
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
                "createConstructionSite": function (c, f, j) {
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
                "getEndNodes": function (a, b) {
                    var c;
                    return b = b || {}, !b.filter && d.isNumber(a) ? c = a : (d.isNumber(a) && (a = this.find(a, b)), c = u.key(a), r[c] = u.cache[c]), r[c] || (r[c] = a, d.isNumber(a) && (r[c] = this.find(a, b))), {
                        key: c,
                        objects: r[c]
                    }
                }
            },
            "move": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : j.fatigue > 0 ? g.ERR_TIRED : 0 == this.getActiveBodyparts(g.MOVE) ? g.ERR_NO_BODYPART : (b[i] = b[i] || {}, b[i].move = {
                    direction: a
                }, g.OK) : g.ERR_NOT_OWNER
            },
            "moveTo": function (b, c) {
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
                        var o = f.find(m.path, function (a) {
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
            "harvest": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.WORK) ? g.ERR_NO_BODYPART : a && a.id && c.sources[a.id] ? a.energy ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].harvest = {
                    id: a.id
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "transferEnergy": function (a, d) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 > d ? g.ERR_INVALID_ARGS : a && a.id && (c.spawns[a.id] || c.creeps[a.id] || c.structures[a.id]) ? c.structures[a.id] && "extension" != c.structures[a.id].structureType && "spawn" != c.structures[a.id].structureType ? g.ERR_INVALID_TARGET : j.energy ? (d || (d = Math.min(j.energy, a.energyCapacity - a.energy)), this.energy < d ? g.ERR_NOT_ENOUGH_ENERGY : !d || a.energy + d > a.energyCapacity ? g.ERR_FULL : a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].transferEnergy = {
                    id: a.id,
                    amount: d
                }, g.OK) : g.ERR_NOT_IN_RANGE) : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "pickup": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : a && a.id && c.energy[a.id] ? this.energy >= this.energyCapacity ? g.ERR_FULL : a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].pickup = {
                    id: a.id
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "dropEnergy": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : j.energy ? (a || (a = j.energy), this.energy < a ? g.ERR_NOT_ENOUGH_ENERGY : (b[i] = b[i] || {}, b[i].dropEnergy = {
                    amount: a
                }, g.OK)) : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_NOT_OWNER
            },
            "getActiveBodyparts": function (a) {
                return f.filter(this.body,function (b) {
                    return b.hits > 0 && b.type == a
                }).length
            },
            "attack": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.ATTACK) ? g.ERR_NO_BODYPART : a && a.id && (c.creeps[a.id] || c.structures[a.id]) ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].attack = {
                    id: a.id,
                    x: a.pos.x,
                    y: a.pos.y
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "rangedAttack": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.RANGED_ATTACK) ? g.ERR_NO_BODYPART : a && a.id && (c.creeps[a.id] || c.structures[a.id]) ? Math.abs(a.pos.x - this.pos.x) > 3 || Math.abs(a.pos.y - this.pos.y) > 3 ? g.ERR_NOT_IN_RANGE : (b[i] = b[i] || {}, b[i].rangedAttack = {
                    id: a.id
                }, g.OK) : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "rangedMassAttack": function () {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.RANGED_ATTACK) ? g.ERR_NO_BODYPART : (b[i] = b[i] || {}, b[i].rangedMassAttack = {}, g.OK) : g.ERR_NOT_OWNER
            },
            "heal": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.HEAL) ? g.ERR_NO_BODYPART : a && a.id && c.creeps[a.id] && a != this ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].heal = {
                    id: a.id,
                    x: a.pos.x,
                    y: a.pos.y
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "rangedHeal": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.HEAL) ? g.ERR_NO_BODYPART : a && a.id && c.creeps[a.id] && a != this ? Math.abs(a.pos.x - this.pos.x) > 3 || Math.abs(a.pos.y - this.pos.y) > 3 ? g.ERR_NOT_IN_RANGE : (b[i] = b[i] || {}, b[i].rangedHeal = {
                    id: a.id
                }, g.OK) : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "repair": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.WORK) ? g.ERR_NO_BODYPART : this.energy ? a && a.id && c.structures[a.id] ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].repair = {
                    id: a.id,
                    x: a.pos.x,
                    y: a.pos.y
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_NOT_OWNER
            },
            "build": function (d) {
                if (!this.my) return g.ERR_NOT_OWNER;
                if (j.spawning) return g.ERR_BUSY;
                if (0 == this.getActiveBodyparts(g.WORK)) return g.ERR_NO_BODYPART;
                if (!this.energy) return g.ERR_NOT_ENOUGH_ENERGY;
                if (!d || !d.id || !c.constructionSites[d.id]) return g.ERR_INVALID_TARGET;
                if (!d.pos.isNearTo(this.pos)) return g.ERR_NOT_IN_RANGE;
                if (f.contains(["spawn", "extension", "constructedWall"], d.structureType) && f.any(a.roomObjects, function (a) {
                    return a.x == d.pos.x && a.y == d.pos.y && f.contains(g.OBSTACLE_OBJECT_TYPES, a.type)
                })) return g.ERR_INVALID_TARGET;
                if ("spawn" == d.structureType) {
                    var e = this.getActiveBodyparts(g.WORK) * g.BUILD_POWER,
                        h = d.progressTotal - d.progress,
                        k = Math.min(e, h, this.energy);
                    if (d.progress + k >= d.progressTotal && f.filter(a.roomObjects,function (a) {
                        return "spawn" == a.type
                    }).length >= 3) return g.ERR_INVALID_TARGET
                }
                return b[i] = b[i] || {}, b[i].build = {
                    id: d.id,
                    x: d.pos.x,
                    y: d.pos.y
                }, g.OK
            },
            "suicide": function () {
                return this.my ? j.spawning ? g.ERR_BUSY : (b[i] = b[i] || {}, b[i].suicide = {}, g.OK) : g.ERR_NOT_OWNER
            },
            "say": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : (b[i] = b[i] || {}, b[i].say = {
                    message: "" + a
                }, g.OK) : g.ERR_NOT_OWNER
            }
        },
        "Builder2": {
            "id": "id809300",
            "name": "Builder2",
            "toString": function () {
                return "[creep " + (j.user == a.user._id ? j.name : "#" + i) + "]"
            },
            "pos": {
                "x": 22,
                "y": 24,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "body": [
                {
                    "type": "work",
                    "hits": 100
                },
                {
                    "type": "work",
                    "hits": 100
                },
                {
                    "type": "work",
                    "hits": 100
                },
                {
                    "type": "carry",
                    "hits": 100
                },
                {
                    "type": "move",
                    "hits": 100
                }
            ],
            "my": true,
            "owner": {
                "username": "Player 54d2f8109facf3600348e265"
            },
            "spawning": false,
            "ticksToLive": 1582,
            "energy": 50,
            "energyCapacity": 50,
            "fatigue": 0,
            "hits": 500,
            "hitsMax": 500,
            "memory": {
                "role": "builder"
            },
            "room": undefined,
            "move": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : j.fatigue > 0 ? g.ERR_TIRED : 0 == this.getActiveBodyparts(g.MOVE) ? g.ERR_NO_BODYPART : (b[i] = b[i] || {}, b[i].move = {
                    direction: a
                }, g.OK) : g.ERR_NOT_OWNER
            },
            "moveTo": function (b, c) {
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
                        var o = f.find(m.path, function (a) {
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
            "harvest": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.WORK) ? g.ERR_NO_BODYPART : a && a.id && c.sources[a.id] ? a.energy ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].harvest = {
                    id: a.id
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "transferEnergy": function (a, d) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 > d ? g.ERR_INVALID_ARGS : a && a.id && (c.spawns[a.id] || c.creeps[a.id] || c.structures[a.id]) ? c.structures[a.id] && "extension" != c.structures[a.id].structureType && "spawn" != c.structures[a.id].structureType ? g.ERR_INVALID_TARGET : j.energy ? (d || (d = Math.min(j.energy, a.energyCapacity - a.energy)), this.energy < d ? g.ERR_NOT_ENOUGH_ENERGY : !d || a.energy + d > a.energyCapacity ? g.ERR_FULL : a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].transferEnergy = {
                    id: a.id,
                    amount: d
                }, g.OK) : g.ERR_NOT_IN_RANGE) : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "pickup": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : a && a.id && c.energy[a.id] ? this.energy >= this.energyCapacity ? g.ERR_FULL : a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].pickup = {
                    id: a.id
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "dropEnergy": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : j.energy ? (a || (a = j.energy), this.energy < a ? g.ERR_NOT_ENOUGH_ENERGY : (b[i] = b[i] || {}, b[i].dropEnergy = {
                    amount: a
                }, g.OK)) : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_NOT_OWNER
            },
            "getActiveBodyparts": function (a) {
                return f.filter(this.body,function (b) {
                    return b.hits > 0 && b.type == a
                }).length
            },
            "attack": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.ATTACK) ? g.ERR_NO_BODYPART : a && a.id && (c.creeps[a.id] || c.structures[a.id]) ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].attack = {
                    id: a.id,
                    x: a.pos.x,
                    y: a.pos.y
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "rangedAttack": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.RANGED_ATTACK) ? g.ERR_NO_BODYPART : a && a.id && (c.creeps[a.id] || c.structures[a.id]) ? Math.abs(a.pos.x - this.pos.x) > 3 || Math.abs(a.pos.y - this.pos.y) > 3 ? g.ERR_NOT_IN_RANGE : (b[i] = b[i] || {}, b[i].rangedAttack = {
                    id: a.id
                }, g.OK) : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "rangedMassAttack": function () {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.RANGED_ATTACK) ? g.ERR_NO_BODYPART : (b[i] = b[i] || {}, b[i].rangedMassAttack = {}, g.OK) : g.ERR_NOT_OWNER
            },
            "heal": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.HEAL) ? g.ERR_NO_BODYPART : a && a.id && c.creeps[a.id] && a != this ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].heal = {
                    id: a.id,
                    x: a.pos.x,
                    y: a.pos.y
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "rangedHeal": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.HEAL) ? g.ERR_NO_BODYPART : a && a.id && c.creeps[a.id] && a != this ? Math.abs(a.pos.x - this.pos.x) > 3 || Math.abs(a.pos.y - this.pos.y) > 3 ? g.ERR_NOT_IN_RANGE : (b[i] = b[i] || {}, b[i].rangedHeal = {
                    id: a.id
                }, g.OK) : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "repair": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.WORK) ? g.ERR_NO_BODYPART : this.energy ? a && a.id && c.structures[a.id] ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].repair = {
                    id: a.id,
                    x: a.pos.x,
                    y: a.pos.y
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_NOT_OWNER
            },
            "build": function (d) {
                if (!this.my) return g.ERR_NOT_OWNER;
                if (j.spawning) return g.ERR_BUSY;
                if (0 == this.getActiveBodyparts(g.WORK)) return g.ERR_NO_BODYPART;
                if (!this.energy) return g.ERR_NOT_ENOUGH_ENERGY;
                if (!d || !d.id || !c.constructionSites[d.id]) return g.ERR_INVALID_TARGET;
                if (!d.pos.isNearTo(this.pos)) return g.ERR_NOT_IN_RANGE;
                if (f.contains(["spawn", "extension", "constructedWall"], d.structureType) && f.any(a.roomObjects, function (a) {
                    return a.x == d.pos.x && a.y == d.pos.y && f.contains(g.OBSTACLE_OBJECT_TYPES, a.type)
                })) return g.ERR_INVALID_TARGET;
                if ("spawn" == d.structureType) {
                    var e = this.getActiveBodyparts(g.WORK) * g.BUILD_POWER,
                        h = d.progressTotal - d.progress,
                        k = Math.min(e, h, this.energy);
                    if (d.progress + k >= d.progressTotal && f.filter(a.roomObjects,function (a) {
                        return "spawn" == a.type
                    }).length >= 3) return g.ERR_INVALID_TARGET
                }
                return b[i] = b[i] || {}, b[i].build = {
                    id: d.id,
                    x: d.pos.x,
                    y: d.pos.y
                }, g.OK
            },
            "suicide": function () {
                return this.my ? j.spawning ? g.ERR_BUSY : (b[i] = b[i] || {}, b[i].suicide = {}, g.OK) : g.ERR_NOT_OWNER
            },
            "say": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : (b[i] = b[i] || {}, b[i].say = {
                    message: "" + a
                }, g.OK) : g.ERR_NOT_OWNER
            }
        },
        "Worker2": {
            "id": "id798900",
            "name": "Worker2",
            "toString": function () {
                return "[creep " + (j.user == a.user._id ? j.name : "#" + i) + "]"
            },
            "pos": {
                "x": 29,
                "y": 25,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "body": [
                {
                    "type": "work",
                    "hits": 0
                },
                {
                    "type": "carry",
                    "hits": 80
                },
                {
                    "type": "move",
                    "hits": 100
                }
            ],
            "my": true,
            "owner": {
                "username": "Player 54d2f8109facf3600348e265"
            },
            "spawning": false,
            "ticksToLive": 1606,
            "energy": 0,
            "energyCapacity": 50,
            "fatigue": 0,
            "hits": 180,
            "hitsMax": 300,
            "memory": {
                "role": "harvester",
                "_move": {
                    "dest": {
                        "x": 35,
                        "y": 20
                    },
                    "time": 245,
                    "path": [
                        {
                            "x": 30,
                            "y": 25,
                            "dx": 1,
                            "dy": 0,
                            "direction": 3
                        },
                        {
                            "x": 31,
                            "y": 24,
                            "dx": 1,
                            "dy": -1,
                            "direction": 2
                        },
                        {
                            "x": 32,
                            "y": 23,
                            "dx": 1,
                            "dy": -1,
                            "direction": 2
                        },
                        {
                            "x": 33,
                            "y": 22,
                            "dx": 1,
                            "dy": -1,
                            "direction": 2
                        },
                        {
                            "x": 34,
                            "y": 21,
                            "dx": 1,
                            "dy": -1,
                            "direction": 2
                        },
                        {
                            "x": 35,
                            "y": 20,
                            "dx": 1,
                            "dy": -1,
                            "direction": 2
                        }
                    ],
                    "last": {
                        "x": 29,
                        "y": 25
                    }
                }
            },
            "room": undefined,
            "move": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : j.fatigue > 0 ? g.ERR_TIRED : 0 == this.getActiveBodyparts(g.MOVE) ? g.ERR_NO_BODYPART : (b[i] = b[i] || {}, b[i].move = {
                    direction: a
                }, g.OK) : g.ERR_NOT_OWNER
            },
            "moveTo": function (b, c) {
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
                        var o = f.find(m.path, function (a) {
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
            "harvest": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.WORK) ? g.ERR_NO_BODYPART : a && a.id && c.sources[a.id] ? a.energy ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].harvest = {
                    id: a.id
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "transferEnergy": function (a, d) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 > d ? g.ERR_INVALID_ARGS : a && a.id && (c.spawns[a.id] || c.creeps[a.id] || c.structures[a.id]) ? c.structures[a.id] && "extension" != c.structures[a.id].structureType && "spawn" != c.structures[a.id].structureType ? g.ERR_INVALID_TARGET : j.energy ? (d || (d = Math.min(j.energy, a.energyCapacity - a.energy)), this.energy < d ? g.ERR_NOT_ENOUGH_ENERGY : !d || a.energy + d > a.energyCapacity ? g.ERR_FULL : a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].transferEnergy = {
                    id: a.id,
                    amount: d
                }, g.OK) : g.ERR_NOT_IN_RANGE) : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "pickup": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : a && a.id && c.energy[a.id] ? this.energy >= this.energyCapacity ? g.ERR_FULL : a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].pickup = {
                    id: a.id
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "dropEnergy": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : j.energy ? (a || (a = j.energy), this.energy < a ? g.ERR_NOT_ENOUGH_ENERGY : (b[i] = b[i] || {}, b[i].dropEnergy = {
                    amount: a
                }, g.OK)) : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_NOT_OWNER
            },
            "getActiveBodyparts": function (a) {
                return f.filter(this.body,function (b) {
                    return b.hits > 0 && b.type == a
                }).length
            },
            "attack": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.ATTACK) ? g.ERR_NO_BODYPART : a && a.id && (c.creeps[a.id] || c.structures[a.id]) ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].attack = {
                    id: a.id,
                    x: a.pos.x,
                    y: a.pos.y
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "rangedAttack": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.RANGED_ATTACK) ? g.ERR_NO_BODYPART : a && a.id && (c.creeps[a.id] || c.structures[a.id]) ? Math.abs(a.pos.x - this.pos.x) > 3 || Math.abs(a.pos.y - this.pos.y) > 3 ? g.ERR_NOT_IN_RANGE : (b[i] = b[i] || {}, b[i].rangedAttack = {
                    id: a.id
                }, g.OK) : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "rangedMassAttack": function () {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.RANGED_ATTACK) ? g.ERR_NO_BODYPART : (b[i] = b[i] || {}, b[i].rangedMassAttack = {}, g.OK) : g.ERR_NOT_OWNER
            },
            "heal": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.HEAL) ? g.ERR_NO_BODYPART : a && a.id && c.creeps[a.id] && a != this ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].heal = {
                    id: a.id,
                    x: a.pos.x,
                    y: a.pos.y
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "rangedHeal": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.HEAL) ? g.ERR_NO_BODYPART : a && a.id && c.creeps[a.id] && a != this ? Math.abs(a.pos.x - this.pos.x) > 3 || Math.abs(a.pos.y - this.pos.y) > 3 ? g.ERR_NOT_IN_RANGE : (b[i] = b[i] || {}, b[i].rangedHeal = {
                    id: a.id
                }, g.OK) : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "repair": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.WORK) ? g.ERR_NO_BODYPART : this.energy ? a && a.id && c.structures[a.id] ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].repair = {
                    id: a.id,
                    x: a.pos.x,
                    y: a.pos.y
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_NOT_OWNER
            },
            "build": function (d) {
                if (!this.my) return g.ERR_NOT_OWNER;
                if (j.spawning) return g.ERR_BUSY;
                if (0 == this.getActiveBodyparts(g.WORK)) return g.ERR_NO_BODYPART;
                if (!this.energy) return g.ERR_NOT_ENOUGH_ENERGY;
                if (!d || !d.id || !c.constructionSites[d.id]) return g.ERR_INVALID_TARGET;
                if (!d.pos.isNearTo(this.pos)) return g.ERR_NOT_IN_RANGE;
                if (f.contains(["spawn", "extension", "constructedWall"], d.structureType) && f.any(a.roomObjects, function (a) {
                    return a.x == d.pos.x && a.y == d.pos.y && f.contains(g.OBSTACLE_OBJECT_TYPES, a.type)
                })) return g.ERR_INVALID_TARGET;
                if ("spawn" == d.structureType) {
                    var e = this.getActiveBodyparts(g.WORK) * g.BUILD_POWER,
                        h = d.progressTotal - d.progress,
                        k = Math.min(e, h, this.energy);
                    if (d.progress + k >= d.progressTotal && f.filter(a.roomObjects,function (a) {
                        return "spawn" == a.type
                    }).length >= 3) return g.ERR_INVALID_TARGET
                }
                return b[i] = b[i] || {}, b[i].build = {
                    id: d.id,
                    x: d.pos.x,
                    y: d.pos.y
                }, g.OK
            },
            "suicide": function () {
                return this.my ? j.spawning ? g.ERR_BUSY : (b[i] = b[i] || {}, b[i].suicide = {}, g.OK) : g.ERR_NOT_OWNER
            },
            "say": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : (b[i] = b[i] || {}, b[i].say = {
                    message: "" + a
                }, g.OK) : g.ERR_NOT_OWNER
            }
        },
        "Worker1": {
            "id": "id714860",
            "name": "Worker1",
            "toString": function () {
                return "[creep " + (j.user == a.user._id ? j.name : "#" + i) + "]"
            },
            "pos": {
                "x": 21,
                "y": 25,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "body": [
                {
                    "type": "work",
                    "hits": 100
                },
                {
                    "type": "carry",
                    "hits": 100
                },
                {
                    "type": "move",
                    "hits": 100
                }
            ],
            "my": true,
            "owner": {
                "username": "Player 54d2f8109facf3600348e265"
            },
            "spawning": true,
            "ticksToLive": undefined,
            "energy": 0,
            "energyCapacity": 50,
            "fatigue": 0,
            "hits": 300,
            "hitsMax": 300,
            "memory": {
                "role": "harvester",
                "_move": {
                    "dest": {
                        "x": 21,
                        "y": 25
                    },
                    "time": 233,
                    "path": [
                        {
                            "x": 28,
                            "y": 24,
                            "dx": -1,
                            "dy": 0,
                            "direction": 7
                        },
                        {
                            "x": 27,
                            "y": 24,
                            "dx": -1,
                            "dy": 0,
                            "direction": 7
                        },
                        {
                            "x": 26,
                            "y": 24,
                            "dx": -1,
                            "dy": 0,
                            "direction": 7
                        },
                        {
                            "x": 25,
                            "y": 24,
                            "dx": -1,
                            "dy": 0,
                            "direction": 7
                        },
                        {
                            "x": 24,
                            "y": 24,
                            "dx": -1,
                            "dy": 0,
                            "direction": 7
                        },
                        {
                            "x": 23,
                            "y": 24,
                            "dx": -1,
                            "dy": 0,
                            "direction": 7
                        },
                        {
                            "x": 22,
                            "y": 25,
                            "dx": -1,
                            "dy": 1,
                            "direction": 6
                        },
                        {
                            "x": 21,
                            "y": 25,
                            "dx": -1,
                            "dy": 0,
                            "direction": 7
                        }
                    ],
                    "last": {
                        "x": 29,
                        "y": 24
                    }
                }
            },
            "room": undefined,
            "move": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : j.fatigue > 0 ? g.ERR_TIRED : 0 == this.getActiveBodyparts(g.MOVE) ? g.ERR_NO_BODYPART : (b[i] = b[i] || {}, b[i].move = {
                    direction: a
                }, g.OK) : g.ERR_NOT_OWNER
            },
            "moveTo": function (b, c) {
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
                        var o = f.find(m.path, function (a) {
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
            "harvest": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.WORK) ? g.ERR_NO_BODYPART : a && a.id && c.sources[a.id] ? a.energy ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].harvest = {
                    id: a.id
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "transferEnergy": function (a, d) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 > d ? g.ERR_INVALID_ARGS : a && a.id && (c.spawns[a.id] || c.creeps[a.id] || c.structures[a.id]) ? c.structures[a.id] && "extension" != c.structures[a.id].structureType && "spawn" != c.structures[a.id].structureType ? g.ERR_INVALID_TARGET : j.energy ? (d || (d = Math.min(j.energy, a.energyCapacity - a.energy)), this.energy < d ? g.ERR_NOT_ENOUGH_ENERGY : !d || a.energy + d > a.energyCapacity ? g.ERR_FULL : a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].transferEnergy = {
                    id: a.id,
                    amount: d
                }, g.OK) : g.ERR_NOT_IN_RANGE) : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "pickup": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : a && a.id && c.energy[a.id] ? this.energy >= this.energyCapacity ? g.ERR_FULL : a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].pickup = {
                    id: a.id
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "dropEnergy": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : j.energy ? (a || (a = j.energy), this.energy < a ? g.ERR_NOT_ENOUGH_ENERGY : (b[i] = b[i] || {}, b[i].dropEnergy = {
                    amount: a
                }, g.OK)) : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_NOT_OWNER
            },
            "getActiveBodyparts": function (a) {
                return f.filter(this.body,function (b) {
                    return b.hits > 0 && b.type == a
                }).length
            },
            "attack": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.ATTACK) ? g.ERR_NO_BODYPART : a && a.id && (c.creeps[a.id] || c.structures[a.id]) ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].attack = {
                    id: a.id,
                    x: a.pos.x,
                    y: a.pos.y
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "rangedAttack": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.RANGED_ATTACK) ? g.ERR_NO_BODYPART : a && a.id && (c.creeps[a.id] || c.structures[a.id]) ? Math.abs(a.pos.x - this.pos.x) > 3 || Math.abs(a.pos.y - this.pos.y) > 3 ? g.ERR_NOT_IN_RANGE : (b[i] = b[i] || {}, b[i].rangedAttack = {
                    id: a.id
                }, g.OK) : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "rangedMassAttack": function () {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.RANGED_ATTACK) ? g.ERR_NO_BODYPART : (b[i] = b[i] || {}, b[i].rangedMassAttack = {}, g.OK) : g.ERR_NOT_OWNER
            },
            "heal": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.HEAL) ? g.ERR_NO_BODYPART : a && a.id && c.creeps[a.id] && a != this ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].heal = {
                    id: a.id,
                    x: a.pos.x,
                    y: a.pos.y
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "rangedHeal": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.HEAL) ? g.ERR_NO_BODYPART : a && a.id && c.creeps[a.id] && a != this ? Math.abs(a.pos.x - this.pos.x) > 3 || Math.abs(a.pos.y - this.pos.y) > 3 ? g.ERR_NOT_IN_RANGE : (b[i] = b[i] || {}, b[i].rangedHeal = {
                    id: a.id
                }, g.OK) : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            },
            "repair": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : 0 == this.getActiveBodyparts(g.WORK) ? g.ERR_NO_BODYPART : this.energy ? a && a.id && c.structures[a.id] ? a.pos.isNearTo(this.pos) ? (b[i] = b[i] || {}, b[i].repair = {
                    id: a.id,
                    x: a.pos.x,
                    y: a.pos.y
                }, g.OK) : g.ERR_NOT_IN_RANGE : g.ERR_INVALID_TARGET : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_NOT_OWNER
            },
            "build": function (d) {
                if (!this.my) return g.ERR_NOT_OWNER;
                if (j.spawning) return g.ERR_BUSY;
                if (0 == this.getActiveBodyparts(g.WORK)) return g.ERR_NO_BODYPART;
                if (!this.energy) return g.ERR_NOT_ENOUGH_ENERGY;
                if (!d || !d.id || !c.constructionSites[d.id]) return g.ERR_INVALID_TARGET;
                if (!d.pos.isNearTo(this.pos)) return g.ERR_NOT_IN_RANGE;
                if (f.contains(["spawn", "extension", "constructedWall"], d.structureType) && f.any(a.roomObjects, function (a) {
                    return a.x == d.pos.x && a.y == d.pos.y && f.contains(g.OBSTACLE_OBJECT_TYPES, a.type)
                })) return g.ERR_INVALID_TARGET;
                if ("spawn" == d.structureType) {
                    var e = this.getActiveBodyparts(g.WORK) * g.BUILD_POWER,
                        h = d.progressTotal - d.progress,
                        k = Math.min(e, h, this.energy);
                    if (d.progress + k >= d.progressTotal && f.filter(a.roomObjects,function (a) {
                        return "spawn" == a.type
                    }).length >= 3) return g.ERR_INVALID_TARGET
                }
                return b[i] = b[i] || {}, b[i].build = {
                    id: d.id,
                    x: d.pos.x,
                    y: d.pos.y
                }, g.OK
            },
            "suicide": function () {
                return this.my ? j.spawning ? g.ERR_BUSY : (b[i] = b[i] || {}, b[i].suicide = {}, g.OK) : g.ERR_NOT_OWNER
            },
            "say": function (a) {
                return this.my ? j.spawning ? g.ERR_BUSY : (b[i] = b[i] || {}, b[i].say = {
                    message: "" + a
                }, g.OK) : g.ERR_NOT_OWNER
            }
        }
    },
    "spawns": {
        "Spawn1": {
            "id": "id920600",
            "name": "Spawn1",
            "toString": function () {
                return "[spawn " + (l.user == b.user._id ? l.name : "#" + j) + "]"
            },
            "pos": {
                "x": 21,
                "y": 25,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "owner": {
                "username": "Player 54d2f8109facf3600348e265"
            },
            "my": true,
            "structureType": "spawn",
            "spawning": {
                "name": "Worker1",
                "needTime": 12,
                "remainingTime": 3
            },
            "energy": 520,
            "energyCapacity": 6000,
            "hits": 5000,
            "hitsMax": 5000,
            "memory": {},
            "room": undefined,
            "createCreep": function (e, h, m) {
                if (!this.my) return g.ERR_NOT_OWNER;
                if (l.spawning) return g.ERR_BUSY;
                if (!e || !f.isArray(e) || 0 == e.length) return g.ERR_INVALID_ARGS;
                for (var n = 0; n < e.length; n++)
                    if (!f.contains(g.BODYPARTS_ALL, e[n])) return g.ERR_INVALID_ARGS;
                if (l.energy < d.calcCreepCost(e)) return g.ERR_NOT_ENOUGH_ENERGY;
                var o = f.without(e, "tough").length - 5;
                if (o > 0) {
                    var p = f.filter(b.roomObjects, function (a) {
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
                } else h = a("./names").getUniqueName(function (a) {
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
            "transferEnergy": function (a, b) {
                return this.my ? a && a.id && h.creeps[a.id] ? l.energy ? (b || (b = l.energy), this.energy < b ? g.ERR_NOT_ENOUGH_ENERGY : a.energy == a.energyCapacity ? g.ERR_FULL : a.pos.isNearTo(this.pos) ? (c[j] = c[j] || {}, c[j].transferEnergy = {
                    id: a.id,
                    amount: b
                }, g.OK) : g.ERR_NOT_IN_RANGE) : g.ERR_NOT_ENOUGH_ENERGY : g.ERR_INVALID_TARGET : g.ERR_NOT_OWNER
            }
        }
    },
    "structures": {
        "id288990": {
            "id": "id288990",
            "toString": function () {
                return "[structure (" + f.type + ") #" + b + "]"
            },
            "pos": {
                "x": 20,
                "y": 24,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "hits": 1492,
            "hitsMax": 1500,
            "energy": undefined,
            "energyCapacity": undefined,
            "user": "54d2f8109facf3600348e265",
            "my": true,
            "structureType": "rampart",
            "room": undefined
        },
        "id901630": {
            "id": "id901630",
            "toString": function () {
                return "[structure (" + f.type + ") #" + b + "]"
            },
            "pos": {
                "x": 20,
                "y": 25,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "hits": 1492,
            "hitsMax": 1500,
            "energy": undefined,
            "energyCapacity": undefined,
            "user": "54d2f8109facf3600348e265",
            "my": true,
            "structureType": "rampart",
            "room": undefined
        },
        "id503190": {
            "id": "id503190",
            "toString": function () {
                return "[structure (" + f.type + ") #" + b + "]"
            },
            "pos": {
                "x": 20,
                "y": 26,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "hits": 1492,
            "hitsMax": 1500,
            "energy": undefined,
            "energyCapacity": undefined,
            "user": "54d2f8109facf3600348e265",
            "my": true,
            "structureType": "rampart",
            "room": undefined
        },
        "id25580": {
            "id": "id25580",
            "toString": function () {
                return "[structure (" + f.type + ") #" + b + "]"
            },
            "pos": {
                "x": 21,
                "y": 24,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "hits": 1492,
            "hitsMax": 1500,
            "energy": undefined,
            "energyCapacity": undefined,
            "user": "54d2f8109facf3600348e265",
            "my": true,
            "structureType": "rampart",
            "room": undefined
        },
        "id449090": {
            "id": "id449090",
            "toString": function () {
                return "[structure (" + f.type + ") #" + b + "]"
            },
            "pos": {
                "x": 21,
                "y": 26,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "hits": 1492,
            "hitsMax": 1500,
            "energy": undefined,
            "energyCapacity": undefined,
            "user": "54d2f8109facf3600348e265",
            "my": true,
            "structureType": "rampart",
            "room": undefined
        },
        "id71930": {
            "id": "id71930",
            "toString": function () {
                return "[structure (" + f.type + ") #" + b + "]"
            },
            "pos": {
                "x": 22,
                "y": 24,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "hits": 1492,
            "hitsMax": 1500,
            "energy": undefined,
            "energyCapacity": undefined,
            "user": "54d2f8109facf3600348e265",
            "my": true,
            "structureType": "rampart",
            "room": undefined
        },
        "id500860": {
            "id": "id500860",
            "toString": function () {
                return "[structure (" + f.type + ") #" + b + "]"
            },
            "pos": {
                "x": 22,
                "y": 25,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "hits": 1492,
            "hitsMax": 1500,
            "energy": undefined,
            "energyCapacity": undefined,
            "user": "54d2f8109facf3600348e265",
            "my": true,
            "structureType": "rampart",
            "room": undefined
        },
        "id134180": {
            "id": "id134180",
            "toString": function () {
                return "[structure (" + f.type + ") #" + b + "]"
            },
            "pos": {
                "x": 22,
                "y": 26,
                "roomName": "sim",
                "toString": function () {
                    return "[room" + c + " pos " + a + "," + b + "]"
                },
                "inRangeTo": function (a, b) {
                    return a.pos && (a = a.pos), Math.abs(a.x - this.x) <= b && Math.abs(a.y - this.y) <= b
                },
                "isNearTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return Math.abs(d - this.x) <= 1 && Math.abs(e - this.y) <= 1
                },
                "getDirectionTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return g.getDirection(d - this.x, e - this.y)
                },
                "findPathTo": function (a, b) {
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
                "findNearest": function (a, b) {
                    return this.findClosest(a, b)
                },
                "findClosest": function (a, b) {
                    var f = this;
                    b = d.clone(b || {});
                    var g = e.rooms[c];
                    if (!g) throw new Error("Could not access a room " + c);
                    var h, i = null,
                        j = g.getEndNodes(a, b);
                    if (!b.algorithm) {
                        var k, l = 0;
                        j.objects.forEach(function (a) {
                            var b = a.x,
                                c = a.y;
                            a.pos && (b = a.pos.x, c = a.pos.y);
                            var e = Math.max(Math.abs(f.x - b), Math.abs(f.y - c));
                            (d.isUndefined(k) || k > e) && (k = e), l += e
                        }), b.algorithm = l > 10 * k ? "dijkstra" : "astar"
                    }
                    if ("dijkstra" == b.algorithm && (h = 1, j.objects.forEach(function (a) {
                        var b = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : 1;
                        h > b && (i = a, b = h)
                    }), 1 == h)) {
                        var m = g.findPath(this, j.key, b);
                        if (m.length > 0) {
                            var n = m[m.length - 1],
                                o = g.getPositionAt(n.x, n.y);
                            i = d.find(j.objects, function (a) {
                                return o.equalsTo(a)
                            })
                        }
                    }
                    return "astar" == b.algorithm && j.objects.forEach(function (a) {
                        var c, e = f.equalsTo(a) ? -1 : f.isNearTo(a) ? 0 : (c = f.findPathTo(a, b)) && c.length > 0 && g.getPositionAt(c[c.length - 1].x, c[c.length - 1].y).isNearTo(a) ? c.length : void 0;
                        (d.isUndefined(h) || h >= e) && !d.isUndefined(e) && (h = e, i = a)
                    }), i
                },
                "findInRange": function (a, b, f) {
                    var g = this,
                        h = e.rooms[c];
                    if (!h) throw new Error("Could not access a room " + c);
                    f = d.clone(f || {});
                    var i = [],
                        j = [];
                    return d.isNumber(a) && (i = h.find(a, f)), d.isArray(a) && (i = a), i.forEach(function (a) {
                        g.inRangeTo(a, b) && j.push(a)
                    }), j
                },
                "equalsTo": function (a, b) {
                    var c = g.fetchXYArguments(a, b),
                        d = c[0],
                        e = c[1];
                    return d == this.x && e == this.y
                }
            },
            "hits": 1492,
            "hitsMax": 1500,
            "energy": undefined,
            "energyCapacity": undefined,
            "user": "54d2f8109facf3600348e265",
            "my": true,
            "structureType": "rampart",
            "room": undefined
        }
    },
    "flags": {},
    "rooms": {
        "sim": undefined
    },
    "time": 246,
    "cpuLimit": Infinity,
    "getRoom": function (a) {
        return h.rooms[a] ? h.rooms[a] : null
    },
    "getObjectById": function (a) {
        for (var b = ["creeps", "structures", "spawns", "sources", "energy", "flags", "constructionSites", "exits"], c = 0; c < b.length; c++)
            if (h[b[c]][a]) return h[b[c]][a];
        return null
    },
    "getUsedCpu": function (a) {
        return g(a)
    },
    "CREEPS": 1,
    "MY_CREEPS": 2,
    "HOSTILE_CREEPS": 3,
    "SOURCES_ACTIVE": 4,
    "SOURCES": 5,
    "DROPPED_ENERGY": 6,
    "STRUCTURES": 7,
    "MY_STRUCTURES": 8,
    "HOSTILE_STRUCTURES": 9,
    "FLAGS": 10,
    "CONSTRUCTION_SITES": 11,
    "MY_SPAWNS": 12,
    "HOSTILE_SPAWNS": 13,
    "EXIT_TOP": 14,
    "EXIT_RIGHT": 15,
    "EXIT_BOTTOM": 16,
    "EXIT_LEFT": 17,
    "TOP": 1,
    "TOP_RIGHT": 2,
    "RIGHT": 3,
    "BOTTOM_RIGHT": 4,
    "BOTTOM": 5,
    "BOTTOM_LEFT": 6,
    "LEFT": 7,
    "TOP_LEFT": 8,
    "OK": 0,
    "ERR_NOT_OWNER": -1,
    "ERR_NO_PATH": -2,
    "ERR_NAME_EXISTS": -3,
    "ERR_BUSY": -4,
    "ERR_NOT_FOUND": -5,
    "ERR_NOT_ENOUGH_ENERGY": -6,
    "ERR_INVALID_TARGET": -7,
    "ERR_FULL": -8,
    "ERR_NOT_IN_RANGE": -9,
    "ERR_INVALID_ARGS": -10,
    "ERR_TIRED": -11,
    "ERR_NO_BODYPART": -12,
    "ERR_NOT_ENOUGH_EXTENSIONS": -13,
    "COLOR_RED": "red",
    "COLOR_PURPLE": "purple",
    "COLOR_BLUE": "blue",
    "COLOR_CYAN": "cyan",
    "COLOR_GREEN": "green",
    "COLOR_YELLOW": "yellow",
    "COLOR_ORANGE": "orange",
    "COLOR_BROWN": "brown",
    "COLOR_GREY": "grey",
    "COLOR_WHITE": "white",
    "CREEP_SPAWN_TIME": 9,
    "CREEP_LIFE_TIME": 1800,
    "OBSTACLE_OBJECT_TYPES": ["spawn", "creep", "wall", "source", "constructedWall", "extension"],
    "ENERGY_REGEN_TIME": 300,
    "ENERGY_REGEN_AMOUNT": 3000,
    "ENERGY_DECAY": 1,
    "CREEP_CORPSE_RATE": 0.2,
    "REPAIR_COST": 0.1,
    "RAMPART_DECAY_AMOUNT": 1,
    "RAMPART_DECAY_TIME": 30,
    "RAMPART_HITS": 1500,
    "SPAWN_HITS": 5000,
    "SPAWN_ENERGY_START": 1000,
    "SPAWN_ENERGY_CAPACITY": 6000,
    "SOURCE_ENERGY_CAPACITY": 3000,
    "ROAD_HITS": 300,
    "WALL_HITS": 6000,
    "EXTENSION_HITS": 1000,
    "EXTENSION_ENERGY_CAPACITY": 200,
    "EXTENSION_ENERGY_COST": 200,
    "CONSTRUCTION_DECAY_TIME": 3600,
    "ROAD_WEAROUT": 1,
    "BODYPART_COST": {
        "move": 50,
        "work": 20,
        "attack": 80,
        "carry": 50,
        "heal": 200,
        "ranged_attack": 150,
        "tough": 20
    },
    "CARRY_CAPACITY": 50,
    "HARVEST_POWER": 2,
    "REPAIR_POWER": 20,
    "BUILD_POWER": 5,
    "ATTACK_POWER": 30,
    "RANGED_ATTACK_POWER": 10,
    "HEAL_POWER": 12,
    "RANGED_HEAL_POWER": 4,
    "MOVE": "move",
    "WORK": "work",
    "CARRY": "carry",
    "ATTACK": "attack",
    "RANGED_ATTACK": "ranged_attack",
    "TOUGH": "tough",
    "HEAL": "heal",
    "CONSTRUCTION_COST": {
        "spawn": 5000,
        "extension": 3000,
        "road": 300,
        "constructedWall": 500,
        "rampart": 2000
    },
    "CONSTRUCTION_COST_ROAD_SWAMP_RATIO": 5,
    "STRUCTURE_SPAWN": "spawn",
    "STRUCTURE_EXTENSION": "extension",
    "STRUCTURE_ROAD": "road",
    "STRUCTURE_WALL": "constructedWall",
    "STRUCTURE_RAMPART": "rampart",
    "MODE_SIMULATION": "simulation",
    "MODE_SURVIVAL": "survival",
    "MODE_WORLD": "world",
    "TERRAIN_MASK_WALL": 1,
    "TERRAIN_MASK_SWAMP": 2,
    "TERRAIN_MASK_LAVA": 4,
    "BODYPARTS_ALL": ["move", "work", "carry", "attack", "ranged_attack", "tough", "heal"]
}