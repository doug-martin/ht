(function () {
    "use strict";

    function defineHt(_) {


        var hashFunction = function (key) {
            if (typeof key === "string") {
                return key;
            } else if (typeof key === "object") {
                return  key.hashCode ? key.hashCode() : "" + key;
            } else {
                return "" + key;
            }
        };

        var Bucket = _.declare({

            instance: {

                constructor: function () {
                    this.__entries = [];
                },

                pushValue: function (key, value) {
                    this.__entries.push({key: key, value: value});
                    return value;
                },

                remove: function (key) {
                    var ret = null, map = this.__entries, val;
                    var i = map.length - 1;
                    for (; i >= 0; i--) {
                        if (!!(val = map[i]) && val.key === key) {
                            map[i] = null;
                            return val.value;
                        }
                    }
                    return ret;
                },

                "set": function (key, value) {
                    var ret = null, map = this.__entries;
                    var i = map.length - 1;
                    for (; i >= 0; i--) {
                        var val = map[i];
                        if (val && key === val.key) {
                            val.value = value;
                            ret = value;
                            break;
                        }
                    }
                    if (!ret) {
                        map.push({key: key, value: value});
                    }
                    return ret;
                },

                find: function (key) {
                    var ret = null, map = this.__entries, val;
                    var i = map.length - 1;
                    for (; i >= 0; i--) {
                        val = map[i];
                        if (val && key === val.key) {
                            ret = val.value;
                            break;
                        }
                    }
                    return ret;
                },

                getEntrySet: function (arr) {
                    var map = this.__entries, l = map.length;
                    if (l) {
                        for (var i = 0; i < l; i++) {
                            var e = map[i];
                            if (e) {
                                arr.push(e);
                            }
                        }
                    }
                },

                getKeys: function (arr) {
                    var map = this.__entries, l = map.length;
                    if (l) {
                        for (var i = 0; i < l; i++) {
                            var e = map[i];
                            if (e) {
                                arr.push(e.key);
                            }
                        }
                    }
                    return arr;
                },

                getValues: function (arr) {
                    var map = this.__entries, l = map.length;
                    if (l) {
                        for (var i = 0; i < l; i++) {
                            var e = map[i];
                            if (e) {
                                arr.push(e.value);
                            }
                        }
                    }
                    return arr;
                }
            }
        });

        return _.declare({

            instance: {

                constructor: function () {
                    this.__map = {};
                },

                __entrySet: function () {
                    var ret = [];
                    for (var i in this.__map) {
                        if (this.__map.hasOwnProperty(i)) {
                            this.__map[i].getEntrySet(ret);
                        }
                    }
                    return ret;
                },

                put: function (key, value) {
                    var hash = hashFunction(key);
                    var bucket = null;
                    if (!(bucket = this.__map[hash])) {
                        bucket = (this.__map[hash] = new Bucket());
                    }
                    bucket.pushValue(key, value);
                    return value;
                },

                remove: function (key) {
                    var hash = hashFunction(key), ret = null;
                    var bucket = this.__map[hash];
                    if (bucket) {
                        ret = bucket.remove(key);
                    }
                    return ret;
                },

                "get": function (key) {
                    var hash = hashFunction(key), ret = null, bucket;
                    if (!!(bucket = this.__map[hash])) {
                        ret = bucket.find(key);
                    }
                    return ret;
                },

                "set": function (key, value) {
                    var hash = hashFunction(key), ret = null, bucket = null, map = this.__map;
                    if (!!(bucket = map[hash])) {
                        ret = bucket.set(key, value);
                    } else {
                        ret = (map[hash] = new Bucket()).pushValue(key, value);
                    }
                    return ret;
                },

                contains: function (key) {
                    var hash = hashFunction(key), ret = false, bucket = null;
                    if (!!(bucket = this.__map[hash])) {
                        ret = !!(bucket.find(key));
                    }
                    return ret;
                },

                concat: function (hashTable) {
                    if (hashTable instanceof this._static) {
                        var ret = new this._static();
                        var otherEntrySet = hashTable.entrySet().concat(this.entrySet());
                        for (var i = otherEntrySet.length - 1; i >= 0; i--) {
                            var e = otherEntrySet[i];
                            ret.put(e.key, e.value);
                        }
                        return ret;
                    } else {
                        throw new TypeError("When joining hashtables the joining arg must be a HashTable");
                    }
                },

                filter: function (cb, scope) {
                    var es = this.__entrySet(), ret = new this._static();
                    es = _.filter(es, cb, scope);
                    for (var i = es.length - 1; i >= 0; i--) {
                        var e = es[i];
                        ret.put(e.key, e.value);
                    }
                    return ret;
                },

                forEach: function (cb, scope) {
                    var es = this.__entrySet();
                    _.forEach(es, cb, scope);
                },

                every: function (cb, scope) {
                    var es = this.__entrySet();
                    return _.every(es, cb, scope);
                },

                map: function (cb, scope) {
                    var es = this.__entrySet();
                    return _.map(es, cb, scope);
                },

                some: function (cb, scope) {
                    var es = this.__entrySet();
                    return _.some(es, cb, scope);
                },

                reduce: function (cb, scope) {
                    var es = this.__entrySet();
                    return _.reduce(es, cb, scope);
                },

                reduceRight: function (cb, scope) {
                    var es = this.__entrySet();
                    return _.reduceRight(es, cb, scope);
                },

                clear: function () {
                    this.__map = {};
                },

                keys: function () {
                    var ret = [], map = this.__map;
                    for (var i in map) {
                        if (map.hasOwnProperty(i)) {
                            map[i].getKeys(ret);
                        }
                    }
                    return ret;
                },

                values: function () {
                    var ret = [], map = this.__map;
                    for (var i in map) {
                        if (map.hasOwnProperty(i)) {
                            map[i].getValues(ret);
                        }
                    }
                    return ret;
                },

                entrySet: function () {
                    return this.__entrySet();
                },

                isEmpty: function () {
                    return this.keys().length === 0;
                }
            }

        });


    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineHt(require("extended")().register("declare", require("declare.js")).register(require("is-extended")).register(require("array-extended")));

        }
    } else if ("function" === typeof define) {
        define(["extended", "declare", "is-extended", "array-extended"], function (extended, declare, is, array) {
            return defineHt(extended().register("declare", declare).register(is).register(array));
        });
    } else {
        this.Ht = defineHt(this.extended().register("declare", this.declare).register(this.isExtended).register(this.arrayExtended));
    }

}).call(this);






