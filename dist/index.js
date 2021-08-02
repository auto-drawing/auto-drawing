(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.AutoDrawing = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    var dpr = 1;
    if (typeof window !== 'undefined') {
        dpr = Math.max(window.devicePixelRatio
            || (window.screen && window.screen.deviceXDPI / window.screen.logicalXDPI)
            || 1, 1);
    }
    var devicePixelRatio = dpr;
    var DARK_MODE_THRESHOLD = 0.4;
    var DARK_LABEL_COLOR = '#333';
    var LIGHT_LABEL_COLOR = '#ccc';
    var LIGHTER_LABEL_COLOR = '#eee';

    var BUILTIN_OBJECT = {
        '[object Function]': true,
        '[object RegExp]': true,
        '[object Date]': true,
        '[object Error]': true,
        '[object CanvasGradient]': true,
        '[object CanvasPattern]': true,
        '[object Image]': true,
        '[object Canvas]': true
    };
    var TYPED_ARRAY = {
        '[object Int8Array]': true,
        '[object Uint8Array]': true,
        '[object Uint8ClampedArray]': true,
        '[object Int16Array]': true,
        '[object Uint16Array]': true,
        '[object Int32Array]': true,
        '[object Uint32Array]': true,
        '[object Float32Array]': true,
        '[object Float64Array]': true
    };
    var objToString = Object.prototype.toString;
    var arrayProto$1 = Array.prototype;
    var nativeForEach = arrayProto$1.forEach;
    var nativeFilter = arrayProto$1.filter;
    var nativeSlice = arrayProto$1.slice;
    var nativeMap = arrayProto$1.map;
    var ctorFunction = function () { }.constructor;
    var protoFunction = ctorFunction ? ctorFunction.prototype : null;
    var methods$1 = {};
    function $override(name, fn) {
        methods$1[name] = fn;
    }
    var idStart = 0x0907;
    function guid() {
        return idStart++;
    }
    function logError() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (typeof console !== 'undefined') {
            console.error.apply(console, args);
        }
    }
    function clone$2(source) {
        if (source == null || typeof source !== 'object') {
            return source;
        }
        var result = source;
        var typeStr = objToString.call(source);
        if (typeStr === '[object Array]') {
            if (!isPrimitive(source)) {
                result = [];
                for (var i = 0, len = source.length; i < len; i++) {
                    result[i] = clone$2(source[i]);
                }
            }
        }
        else if (TYPED_ARRAY[typeStr]) {
            if (!isPrimitive(source)) {
                var Ctor = source.constructor;
                if (Ctor.from) {
                    result = Ctor.from(source);
                }
                else {
                    result = new Ctor(source.length);
                    for (var i = 0, len = source.length; i < len; i++) {
                        result[i] = clone$2(source[i]);
                    }
                }
            }
        }
        else if (!BUILTIN_OBJECT[typeStr] && !isPrimitive(source) && !isDom(source)) {
            result = {};
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    result[key] = clone$2(source[key]);
                }
            }
        }
        return result;
    }
    function merge(target, source, overwrite) {
        if (!isObject$1(source) || !isObject$1(target)) {
            return overwrite ? clone$2(source) : target;
        }
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                var targetProp = target[key];
                var sourceProp = source[key];
                if (isObject$1(sourceProp)
                    && isObject$1(targetProp)
                    && !isArray$1(sourceProp)
                    && !isArray$1(targetProp)
                    && !isDom(sourceProp)
                    && !isDom(targetProp)
                    && !isBuiltInObject(sourceProp)
                    && !isBuiltInObject(targetProp)
                    && !isPrimitive(sourceProp)
                    && !isPrimitive(targetProp)) {
                    merge(targetProp, sourceProp, overwrite);
                }
                else if (overwrite || !(key in target)) {
                    target[key] = clone$2(source[key]);
                }
            }
        }
        return target;
    }
    function mergeAll(targetAndSources, overwrite) {
        var result = targetAndSources[0];
        for (var i = 1, len = targetAndSources.length; i < len; i++) {
            result = merge(result, targetAndSources[i], overwrite);
        }
        return result;
    }
    function extend(target, source) {
        if (Object.assign) {
            Object.assign(target, source);
        }
        else {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }
    function defaults(target, source, overlay) {
        var keysArr = keys$1(source);
        for (var i = 0; i < keysArr.length; i++) {
            var key = keysArr[i];
            if ((overlay ? source[key] != null : target[key] == null)) {
                target[key] = source[key];
            }
        }
        return target;
    }
    var createCanvas$1 = function () {
        return methods$1.createCanvas();
    };
    methods$1.createCanvas = function () {
        return document.createElement('canvas');
    };
    function indexOf(array, value) {
        if (array) {
            if (array.indexOf) {
                return array.indexOf(value);
            }
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] === value) {
                    return i;
                }
            }
        }
        return -1;
    }
    function inherits(clazz, baseClazz) {
        var clazzPrototype = clazz.prototype;
        function F() { }
        F.prototype = baseClazz.prototype;
        clazz.prototype = new F();
        for (var prop in clazzPrototype) {
            if (clazzPrototype.hasOwnProperty(prop)) {
                clazz.prototype[prop] = clazzPrototype[prop];
            }
        }
        clazz.prototype.constructor = clazz;
        clazz.superClass = baseClazz;
    }
    function mixin(target, source, override) {
        target = 'prototype' in target ? target.prototype : target;
        source = 'prototype' in source ? source.prototype : source;
        if (Object.getOwnPropertyNames) {
            var keyList = Object.getOwnPropertyNames(source);
            for (var i = 0; i < keyList.length; i++) {
                var key = keyList[i];
                if (key !== 'constructor') {
                    if ((override ? source[key] != null : target[key] == null)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        else {
            defaults(target, source, override);
        }
    }
    function isArrayLike$1(data) {
        if (!data) {
            return false;
        }
        if (typeof data === 'string') {
            return false;
        }
        return typeof data.length === 'number';
    }
    function each(arr, cb, context) {
        if (!(arr && cb)) {
            return;
        }
        if (arr.forEach && arr.forEach === nativeForEach) {
            arr.forEach(cb, context);
        }
        else if (arr.length === +arr.length) {
            for (var i = 0, len = arr.length; i < len; i++) {
                cb.call(context, arr[i], i, arr);
            }
        }
        else {
            for (var key in arr) {
                if (arr.hasOwnProperty(key)) {
                    cb.call(context, arr[key], key, arr);
                }
            }
        }
    }
    function map(arr, cb, context) {
        if (!arr) {
            return [];
        }
        if (!cb) {
            return slice(arr);
        }
        if (arr.map && arr.map === nativeMap) {
            return arr.map(cb, context);
        }
        else {
            var result = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                result.push(cb.call(context, arr[i], i, arr));
            }
            return result;
        }
    }
    function reduce(arr, cb, memo, context) {
        if (!(arr && cb)) {
            return;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            memo = cb.call(context, memo, arr[i], i, arr);
        }
        return memo;
    }
    function filter(arr, cb, context) {
        if (!arr) {
            return [];
        }
        if (!cb) {
            return slice(arr);
        }
        if (arr.filter && arr.filter === nativeFilter) {
            return arr.filter(cb, context);
        }
        else {
            var result = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (cb.call(context, arr[i], i, arr)) {
                    result.push(arr[i]);
                }
            }
            return result;
        }
    }
    function find(arr, cb, context) {
        if (!(arr && cb)) {
            return;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            if (cb.call(context, arr[i], i, arr)) {
                return arr[i];
            }
        }
    }
    function keys$1(obj) {
        if (!obj) {
            return [];
        }
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keyList = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keyList.push(key);
            }
        }
        return keyList;
    }
    function bindPolyfill(func, context) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return function () {
            return func.apply(context, args.concat(nativeSlice.call(arguments)));
        };
    }
    var bind = (protoFunction && isFunction$1(protoFunction.bind))
        ? protoFunction.call.bind(protoFunction.bind)
        : bindPolyfill;
    function curry(func) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return function () {
            return func.apply(this, args.concat(nativeSlice.call(arguments)));
        };
    }
    function isArray$1(value) {
        if (Array.isArray) {
            return Array.isArray(value);
        }
        return objToString.call(value) === '[object Array]';
    }
    function isFunction$1(value) {
        return typeof value === 'function';
    }
    function isString(value) {
        return typeof value === 'string';
    }
    function isStringSafe(value) {
        return objToString.call(value) === '[object String]';
    }
    function isNumber(value) {
        return typeof value === 'number';
    }
    function isObject$1(value) {
        var type = typeof value;
        return type === 'function' || (!!value && type === 'object');
    }
    function isBuiltInObject(value) {
        return !!BUILTIN_OBJECT[objToString.call(value)];
    }
    function isTypedArray$1(value) {
        return !!TYPED_ARRAY[objToString.call(value)];
    }
    function isDom(value) {
        return typeof value === 'object'
            && typeof value.nodeType === 'number'
            && typeof value.ownerDocument === 'object';
    }
    function isGradientObject(value) {
        return value.colorStops != null;
    }
    function isImagePatternObject(value) {
        return value.image != null;
    }
    function isRegExp(value) {
        return objToString.call(value) === '[object RegExp]';
    }
    function eqNaN(value) {
        return value !== value;
    }
    function retrieve() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        for (var i = 0, len = args.length; i < len; i++) {
            if (args[i] != null) {
                return args[i];
            }
        }
    }
    function retrieve2(value0, value1) {
        return value0 != null
            ? value0
            : value1;
    }
    function retrieve3(value0, value1, value2) {
        return value0 != null
            ? value0
            : value1 != null
                ? value1
                : value2;
    }
    function slice(arr) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return nativeSlice.apply(arr, args);
    }
    function normalizeCssArray(val) {
        if (typeof (val) === 'number') {
            return [val, val, val, val];
        }
        var len = val.length;
        if (len === 2) {
            return [val[0], val[1], val[0], val[1]];
        }
        else if (len === 3) {
            return [val[0], val[1], val[2], val[1]];
        }
        return val;
    }
    function assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }
    function trim(str) {
        if (str == null) {
            return null;
        }
        else if (typeof str.trim === 'function') {
            return str.trim();
        }
        else {
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    }
    var primitiveKey = '__ec_primitive__';
    function setAsPrimitive(obj) {
        obj[primitiveKey] = true;
    }
    function isPrimitive(obj) {
        return obj[primitiveKey];
    }
    var HashMap = (function () {
        function HashMap(obj) {
            this.data = {};
            var isArr = isArray$1(obj);
            this.data = {};
            var thisMap = this;
            (obj instanceof HashMap)
                ? obj.each(visit)
                : (obj && each(obj, visit));
            function visit(value, key) {
                isArr ? thisMap.set(value, key) : thisMap.set(key, value);
            }
        }
        HashMap.prototype.get = function (key) {
            return this.data.hasOwnProperty(key) ? this.data[key] : null;
        };
        HashMap.prototype.set = function (key, value) {
            return (this.data[key] = value);
        };
        HashMap.prototype.each = function (cb, context) {
            for (var key in this.data) {
                if (this.data.hasOwnProperty(key)) {
                    cb.call(context, this.data[key], key);
                }
            }
        };
        HashMap.prototype.keys = function () {
            return keys$1(this.data);
        };
        HashMap.prototype.removeKey = function (key) {
            delete this.data[key];
        };
        return HashMap;
    }());
    function createHashMap(obj) {
        return new HashMap(obj);
    }
    function concatArray(a, b) {
        var newArray = new a.constructor(a.length + b.length);
        for (var i = 0; i < a.length; i++) {
            newArray[i] = a[i];
        }
        var offset = a.length;
        for (var i = 0; i < b.length; i++) {
            newArray[i + offset] = b[i];
        }
        return newArray;
    }
    function createObject(proto, properties) {
        var obj;
        if (Object.create) {
            obj = Object.create(proto);
        }
        else {
            var StyleCtor = function () { };
            StyleCtor.prototype = proto;
            obj = new StyleCtor();
        }
        if (properties) {
            extend(obj, properties);
        }
        return obj;
    }
    function hasOwn(own, prop) {
        return own.hasOwnProperty(prop);
    }
    function noop() { }

    var util = /*#__PURE__*/Object.freeze({
        __proto__: null,
        $override: $override,
        guid: guid,
        logError: logError,
        clone: clone$2,
        merge: merge,
        mergeAll: mergeAll,
        extend: extend,
        defaults: defaults,
        createCanvas: createCanvas$1,
        indexOf: indexOf,
        inherits: inherits,
        mixin: mixin,
        isArrayLike: isArrayLike$1,
        each: each,
        map: map,
        reduce: reduce,
        filter: filter,
        find: find,
        keys: keys$1,
        bind: bind,
        curry: curry,
        isArray: isArray$1,
        isFunction: isFunction$1,
        isString: isString,
        isStringSafe: isStringSafe,
        isNumber: isNumber,
        isObject: isObject$1,
        isBuiltInObject: isBuiltInObject,
        isTypedArray: isTypedArray$1,
        isDom: isDom,
        isGradientObject: isGradientObject,
        isImagePatternObject: isImagePatternObject,
        isRegExp: isRegExp,
        eqNaN: eqNaN,
        retrieve: retrieve,
        retrieve2: retrieve2,
        retrieve3: retrieve3,
        slice: slice,
        normalizeCssArray: normalizeCssArray,
        assert: assert,
        trim: trim,
        setAsPrimitive: setAsPrimitive,
        isPrimitive: isPrimitive,
        HashMap: HashMap,
        createHashMap: createHashMap,
        concatArray: concatArray,
        createObject: createObject,
        hasOwn: hasOwn,
        noop: noop
    });

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var Eventful = (function () {
        function Eventful(eventProcessors) {
            if (eventProcessors) {
                this._$eventProcessor = eventProcessors;
            }
        }
        Eventful.prototype.on = function (event, query, handler, context) {
            if (!this._$handlers) {
                this._$handlers = {};
            }
            var _h = this._$handlers;
            if (typeof query === 'function') {
                context = handler;
                handler = query;
                query = null;
            }
            if (!handler || !event) {
                return this;
            }
            var eventProcessor = this._$eventProcessor;
            if (query != null && eventProcessor && eventProcessor.normalizeQuery) {
                query = eventProcessor.normalizeQuery(query);
            }
            if (!_h[event]) {
                _h[event] = [];
            }
            for (var i = 0; i < _h[event].length; i++) {
                if (_h[event][i].h === handler) {
                    return this;
                }
            }
            var wrap = {
                h: handler,
                query: query,
                ctx: (context || this),
                callAtLast: handler.zrEventfulCallAtLast
            };
            var lastIndex = _h[event].length - 1;
            var lastWrap = _h[event][lastIndex];
            (lastWrap && lastWrap.callAtLast)
                ? _h[event].splice(lastIndex, 0, wrap)
                : _h[event].push(wrap);
            return this;
        };
        Eventful.prototype.isSilent = function (eventName) {
            var _h = this._$handlers;
            return !_h || !_h[eventName] || !_h[eventName].length;
        };
        Eventful.prototype.off = function (eventType, handler) {
            var _h = this._$handlers;
            if (!_h) {
                return this;
            }
            if (!eventType) {
                this._$handlers = {};
                return this;
            }
            if (handler) {
                if (_h[eventType]) {
                    var newList = [];
                    for (var i = 0, l = _h[eventType].length; i < l; i++) {
                        if (_h[eventType][i].h !== handler) {
                            newList.push(_h[eventType][i]);
                        }
                    }
                    _h[eventType] = newList;
                }
                if (_h[eventType] && _h[eventType].length === 0) {
                    delete _h[eventType];
                }
            }
            else {
                delete _h[eventType];
            }
            return this;
        };
        Eventful.prototype.trigger = function (eventType) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!this._$handlers) {
                return this;
            }
            var _h = this._$handlers[eventType];
            var eventProcessor = this._$eventProcessor;
            if (_h) {
                var argLen = args.length;
                var len = _h.length;
                for (var i = 0; i < len; i++) {
                    var hItem = _h[i];
                    if (eventProcessor
                        && eventProcessor.filter
                        && hItem.query != null
                        && !eventProcessor.filter(eventType, hItem.query)) {
                        continue;
                    }
                    switch (argLen) {
                        case 0:
                            hItem.h.call(hItem.ctx);
                            break;
                        case 1:
                            hItem.h.call(hItem.ctx, args[0]);
                            break;
                        case 2:
                            hItem.h.call(hItem.ctx, args[0], args[1]);
                            break;
                        default:
                            hItem.h.apply(hItem.ctx, args);
                            break;
                    }
                }
            }
            eventProcessor && eventProcessor.afterTrigger
                && eventProcessor.afterTrigger(eventType);
            return this;
        };
        Eventful.prototype.triggerWithContext = function (type) {
            if (!this._$handlers) {
                return this;
            }
            var _h = this._$handlers[type];
            var eventProcessor = this._$eventProcessor;
            if (_h) {
                var args = arguments;
                var argLen = args.length;
                var ctx = args[argLen - 1];
                var len = _h.length;
                for (var i = 0; i < len; i++) {
                    var hItem = _h[i];
                    if (eventProcessor
                        && eventProcessor.filter
                        && hItem.query != null
                        && !eventProcessor.filter(type, hItem.query)) {
                        continue;
                    }
                    switch (argLen) {
                        case 0:
                            hItem.h.call(ctx);
                            break;
                        case 1:
                            hItem.h.call(ctx, args[0]);
                            break;
                        case 2:
                            hItem.h.call(ctx, args[0], args[1]);
                            break;
                        default:
                            hItem.h.apply(ctx, args.slice(1, argLen - 1));
                            break;
                    }
                }
            }
            eventProcessor && eventProcessor.afterTrigger
                && eventProcessor.afterTrigger(type);
            return this;
        };
        return Eventful;
    }());

    function createLinearGradient(ctx, obj, rect) {
        var x = obj.x == null ? 0 : obj.x;
        var x2 = obj.x2 == null ? 1 : obj.x2;
        var y = obj.y == null ? 0 : obj.y;
        var y2 = obj.y2 == null ? 0 : obj.y2;
        if (!obj.global) {
            x = x * rect.width + rect.x;
            x2 = x2 * rect.width + rect.x;
            y = y * rect.height + rect.y;
            y2 = y2 * rect.height + rect.y;
        }
        x = isNaN(x) ? 0 : x;
        x2 = isNaN(x2) ? 1 : x2;
        y = isNaN(y) ? 0 : y;
        y2 = isNaN(y2) ? 0 : y2;
        var canvasGradient = ctx.createLinearGradient(x, y, x2, y2);
        return canvasGradient;
    }
    function createRadialGradient(ctx, obj, rect) {
        var width = rect.width;
        var height = rect.height;
        var min = Math.min(width, height);
        var x = obj.x == null ? 0.5 : obj.x;
        var y = obj.y == null ? 0.5 : obj.y;
        var r = obj.r == null ? 0.5 : obj.r;
        if (!obj.global) {
            x = x * width + rect.x;
            y = y * height + rect.y;
            r = r * min;
        }
        var canvasGradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        return canvasGradient;
    }
    function getCanvasGradient(ctx, obj, rect) {
        var canvasGradient = obj.type === 'radial'
            ? createRadialGradient(ctx, obj, rect)
            : createLinearGradient(ctx, obj, rect);
        var colorStops = obj.colorStops;
        for (var i = 0; i < colorStops.length; i++) {
            canvasGradient.addColorStop(colorStops[i].offset, colorStops[i].color);
        }
        return canvasGradient;
    }
    function isClipPathChanged(clipPaths, prevClipPaths) {
        if (clipPaths === prevClipPaths || (!clipPaths && !prevClipPaths)) {
            return false;
        }
        if (!clipPaths || !prevClipPaths || (clipPaths.length !== prevClipPaths.length)) {
            return true;
        }
        for (var i = 0; i < clipPaths.length; i++) {
            if (clipPaths[i] !== prevClipPaths[i]) {
                return true;
            }
        }
        return false;
    }

    function create$1() {
        return [1, 0, 0, 1, 0, 0];
    }
    function identity(out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        out[4] = 0;
        out[5] = 0;
        return out;
    }
    function copy$1(out, m) {
        out[0] = m[0];
        out[1] = m[1];
        out[2] = m[2];
        out[3] = m[3];
        out[4] = m[4];
        out[5] = m[5];
        return out;
    }
    function mul$1(out, m1, m2) {
        var out0 = m1[0] * m2[0] + m1[2] * m2[1];
        var out1 = m1[1] * m2[0] + m1[3] * m2[1];
        var out2 = m1[0] * m2[2] + m1[2] * m2[3];
        var out3 = m1[1] * m2[2] + m1[3] * m2[3];
        var out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
        var out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
        out[0] = out0;
        out[1] = out1;
        out[2] = out2;
        out[3] = out3;
        out[4] = out4;
        out[5] = out5;
        return out;
    }
    function translate(out, a, v) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4] + v[0];
        out[5] = a[5] + v[1];
        return out;
    }
    function rotate(out, a, rad) {
        var aa = a[0];
        var ac = a[2];
        var atx = a[4];
        var ab = a[1];
        var ad = a[3];
        var aty = a[5];
        var st = Math.sin(rad);
        var ct = Math.cos(rad);
        out[0] = aa * ct + ab * st;
        out[1] = -aa * st + ab * ct;
        out[2] = ac * ct + ad * st;
        out[3] = -ac * st + ct * ad;
        out[4] = ct * atx + st * aty;
        out[5] = ct * aty - st * atx;
        return out;
    }
    function scale$1(out, a, v) {
        var vx = v[0];
        var vy = v[1];
        out[0] = a[0] * vx;
        out[1] = a[1] * vy;
        out[2] = a[2] * vx;
        out[3] = a[3] * vy;
        out[4] = a[4] * vx;
        out[5] = a[5] * vy;
        return out;
    }
    function invert(out, a) {
        var aa = a[0];
        var ac = a[2];
        var atx = a[4];
        var ab = a[1];
        var ad = a[3];
        var aty = a[5];
        var det = aa * ad - ab * ac;
        if (!det) {
            return null;
        }
        det = 1.0 / det;
        out[0] = ad * det;
        out[1] = -ab * det;
        out[2] = -ac * det;
        out[3] = aa * det;
        out[4] = (ac * aty - ad * atx) * det;
        out[5] = (ab * atx - aa * aty) * det;
        return out;
    }
    function clone$1(a) {
        var b = create$1();
        copy$1(b, a);
        return b;
    }

    var matrix = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$1,
        identity: identity,
        copy: copy$1,
        mul: mul$1,
        translate: translate,
        rotate: rotate,
        scale: scale$1,
        invert: invert,
        clone: clone$1
    });

    function create(x, y) {
        if (x == null) {
            x = 0;
        }
        if (y == null) {
            y = 0;
        }
        return [x, y];
    }
    function copy(out, v) {
        out[0] = v[0];
        out[1] = v[1];
        return out;
    }
    function clone(v) {
        return [v[0], v[1]];
    }
    function set(out, a, b) {
        out[0] = a;
        out[1] = b;
        return out;
    }
    function add(out, v1, v2) {
        out[0] = v1[0] + v2[0];
        out[1] = v1[1] + v2[1];
        return out;
    }
    function scaleAndAdd(out, v1, v2, a) {
        out[0] = v1[0] + v2[0] * a;
        out[1] = v1[1] + v2[1] * a;
        return out;
    }
    function sub(out, v1, v2) {
        out[0] = v1[0] - v2[0];
        out[1] = v1[1] - v2[1];
        return out;
    }
    function len(v) {
        return Math.sqrt(lenSquare(v));
    }
    var length = len;
    function lenSquare(v) {
        return v[0] * v[0] + v[1] * v[1];
    }
    var lengthSquare = lenSquare;
    function mul(out, v1, v2) {
        out[0] = v1[0] * v2[0];
        out[1] = v1[1] * v2[1];
        return out;
    }
    function div(out, v1, v2) {
        out[0] = v1[0] / v2[0];
        out[1] = v1[1] / v2[1];
        return out;
    }
    function dot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1];
    }
    function scale(out, v, s) {
        out[0] = v[0] * s;
        out[1] = v[1] * s;
        return out;
    }
    function normalize(out, v) {
        var d = len(v);
        if (d === 0) {
            out[0] = 0;
            out[1] = 0;
        }
        else {
            out[0] = v[0] / d;
            out[1] = v[1] / d;
        }
        return out;
    }
    function distance(v1, v2) {
        return Math.sqrt((v1[0] - v2[0]) * (v1[0] - v2[0])
            + (v1[1] - v2[1]) * (v1[1] - v2[1]));
    }
    var dist$1 = distance;
    function distanceSquare(v1, v2) {
        return (v1[0] - v2[0]) * (v1[0] - v2[0])
            + (v1[1] - v2[1]) * (v1[1] - v2[1]);
    }
    var distSquare = distanceSquare;
    function negate(out, v) {
        out[0] = -v[0];
        out[1] = -v[1];
        return out;
    }
    function lerp$1(out, v1, v2, t) {
        out[0] = v1[0] + t * (v2[0] - v1[0]);
        out[1] = v1[1] + t * (v2[1] - v1[1]);
        return out;
    }
    function applyTransform(out, v, m) {
        var x = v[0];
        var y = v[1];
        out[0] = m[0] * x + m[2] * y + m[4];
        out[1] = m[1] * x + m[3] * y + m[5];
        return out;
    }
    function min$1(out, v1, v2) {
        out[0] = Math.min(v1[0], v2[0]);
        out[1] = Math.min(v1[1], v2[1]);
        return out;
    }
    function max$1(out, v1, v2) {
        out[0] = Math.max(v1[0], v2[0]);
        out[1] = Math.max(v1[1], v2[1]);
        return out;
    }

    var vector = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create,
        copy: copy,
        clone: clone,
        set: set,
        add: add,
        scaleAndAdd: scaleAndAdd,
        sub: sub,
        len: len,
        length: length,
        lenSquare: lenSquare,
        lengthSquare: lengthSquare,
        mul: mul,
        div: div,
        dot: dot,
        scale: scale,
        normalize: normalize,
        distance: distance,
        dist: dist$1,
        distanceSquare: distanceSquare,
        distSquare: distSquare,
        negate: negate,
        lerp: lerp$1,
        applyTransform: applyTransform,
        min: min$1,
        max: max$1
    });

    var mIdentity = identity;
    var EPSILON$3 = 5e-5;
    function isNotAroundZero$1(val) {
        return val > EPSILON$3 || val < -EPSILON$3;
    }
    var scaleTmp = [];
    var tmpTransform = [];
    var originTransform = create$1();
    var abs = Math.abs;
    var Transformable = (function () {
        function Transformable() {
        }
        Transformable.prototype.setPosition = function (arr) {
            this.x = arr[0];
            this.y = arr[1];
        };
        Transformable.prototype.setScale = function (arr) {
            this.scaleX = arr[0];
            this.scaleY = arr[1];
        };
        Transformable.prototype.setSkew = function (arr) {
            this.skewX = arr[0];
            this.skewY = arr[1];
        };
        Transformable.prototype.setOrigin = function (arr) {
            this.originX = arr[0];
            this.originY = arr[1];
        };
        Transformable.prototype.needLocalTransform = function () {
            return isNotAroundZero$1(this.rotation)
                || isNotAroundZero$1(this.x)
                || isNotAroundZero$1(this.y)
                || isNotAroundZero$1(this.scaleX - 1)
                || isNotAroundZero$1(this.scaleY - 1);
        };
        Transformable.prototype.updateTransform = function () {
            var parent = this.parent;
            var parentHasTransform = parent && parent.transform;
            var needLocalTransform = this.needLocalTransform();
            var m = this.transform;
            if (!(needLocalTransform || parentHasTransform)) {
                m && mIdentity(m);
                return;
            }
            m = m || create$1();
            if (needLocalTransform) {
                this.getLocalTransform(m);
            }
            else {
                mIdentity(m);
            }
            if (parentHasTransform) {
                if (needLocalTransform) {
                    mul$1(m, parent.transform, m);
                }
                else {
                    copy$1(m, parent.transform);
                }
            }
            this.transform = m;
            this._resolveGlobalScaleRatio(m);
        };
        Transformable.prototype._resolveGlobalScaleRatio = function (m) {
            var globalScaleRatio = this.globalScaleRatio;
            if (globalScaleRatio != null && globalScaleRatio !== 1) {
                this.getGlobalScale(scaleTmp);
                var relX = scaleTmp[0] < 0 ? -1 : 1;
                var relY = scaleTmp[1] < 0 ? -1 : 1;
                var sx = ((scaleTmp[0] - relX) * globalScaleRatio + relX) / scaleTmp[0] || 0;
                var sy = ((scaleTmp[1] - relY) * globalScaleRatio + relY) / scaleTmp[1] || 0;
                m[0] *= sx;
                m[1] *= sx;
                m[2] *= sy;
                m[3] *= sy;
            }
            this.invTransform = this.invTransform || create$1();
            invert(this.invTransform, m);
        };
        Transformable.prototype.getLocalTransform = function (m) {
            return Transformable.getLocalTransform(this, m);
        };
        Transformable.prototype.getComputedTransform = function () {
            var transformNode = this;
            var ancestors = [];
            while (transformNode) {
                ancestors.push(transformNode);
                transformNode = transformNode.parent;
            }
            while (transformNode = ancestors.pop()) {
                transformNode.updateTransform();
            }
            return this.transform;
        };
        Transformable.prototype.setLocalTransform = function (m) {
            if (!m) {
                return;
            }
            var sx = m[0] * m[0] + m[1] * m[1];
            var sy = m[2] * m[2] + m[3] * m[3];
            var rotation = Math.atan2(m[1], m[0]);
            var shearX = Math.PI / 2 + rotation - Math.atan2(m[3], m[2]);
            sy = Math.sqrt(sy) * Math.cos(shearX);
            sx = Math.sqrt(sx);
            this.skewX = shearX;
            this.skewY = 0;
            this.rotation = -rotation;
            this.x = +m[4];
            this.y = +m[5];
            this.scaleX = sx;
            this.scaleY = sy;
            this.originX = 0;
            this.originY = 0;
        };
        Transformable.prototype.decomposeTransform = function () {
            if (!this.transform) {
                return;
            }
            var parent = this.parent;
            var m = this.transform;
            if (parent && parent.transform) {
                mul$1(tmpTransform, parent.invTransform, m);
                m = tmpTransform;
            }
            var ox = this.originX;
            var oy = this.originY;
            if (ox || oy) {
                originTransform[4] = ox;
                originTransform[5] = oy;
                mul$1(tmpTransform, m, originTransform);
                tmpTransform[4] -= ox;
                tmpTransform[5] -= oy;
                m = tmpTransform;
            }
            this.setLocalTransform(m);
        };
        Transformable.prototype.getGlobalScale = function (out) {
            var m = this.transform;
            out = out || [];
            if (!m) {
                out[0] = 1;
                out[1] = 1;
                return out;
            }
            out[0] = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
            out[1] = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
            if (m[0] < 0) {
                out[0] = -out[0];
            }
            if (m[3] < 0) {
                out[1] = -out[1];
            }
            return out;
        };
        Transformable.prototype.transformCoordToLocal = function (x, y) {
            var v2 = [x, y];
            var invTransform = this.invTransform;
            if (invTransform) {
                applyTransform(v2, v2, invTransform);
            }
            return v2;
        };
        Transformable.prototype.transformCoordToGlobal = function (x, y) {
            var v2 = [x, y];
            var transform = this.transform;
            if (transform) {
                applyTransform(v2, v2, transform);
            }
            return v2;
        };
        Transformable.prototype.getLineScale = function () {
            var m = this.transform;
            return m && abs(m[0] - 1) > 1e-10 && abs(m[3] - 1) > 1e-10
                ? Math.sqrt(abs(m[0] * m[3] - m[2] * m[1]))
                : 1;
        };
        Transformable.getLocalTransform = function (target, m) {
            m = m || [];
            var ox = target.originX || 0;
            var oy = target.originY || 0;
            var sx = target.scaleX;
            var sy = target.scaleY;
            var rotation = target.rotation || 0;
            var x = target.x;
            var y = target.y;
            var skewX = target.skewX ? Math.tan(target.skewX) : 0;
            var skewY = target.skewY ? Math.tan(-target.skewY) : 0;
            if (ox || oy) {
                m[4] = -ox * sx - skewX * oy * sy;
                m[5] = -oy * sy - skewY * ox * sx;
            }
            else {
                m[4] = m[5] = 0;
            }
            m[0] = sx;
            m[3] = sy;
            m[1] = skewY * sx;
            m[2] = skewX * sy;
            rotation && rotate(m, m, rotation);
            m[4] += ox + x;
            m[5] += oy + y;
            return m;
        };
        Transformable.initDefaultProps = (function () {
            var proto = Transformable.prototype;
            proto.x = 0;
            proto.y = 0;
            proto.scaleX = 1;
            proto.scaleY = 1;
            proto.originX = 0;
            proto.originY = 0;
            proto.skewX = 0;
            proto.skewY = 0;
            proto.rotation = 0;
            proto.globalScaleRatio = 1;
        })();
        return Transformable;
    }());

    var easing = {
        linear: function (k) {
            return k;
        },
        quadraticIn: function (k) {
            return k * k;
        },
        quadraticOut: function (k) {
            return k * (2 - k);
        },
        quadraticInOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k;
            }
            return -0.5 * (--k * (k - 2) - 1);
        },
        cubicIn: function (k) {
            return k * k * k;
        },
        cubicOut: function (k) {
            return --k * k * k + 1;
        },
        cubicInOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k + 2);
        },
        quarticIn: function (k) {
            return k * k * k * k;
        },
        quarticOut: function (k) {
            return 1 - (--k * k * k * k);
        },
        quarticInOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k;
            }
            return -0.5 * ((k -= 2) * k * k * k - 2);
        },
        quinticIn: function (k) {
            return k * k * k * k * k;
        },
        quinticOut: function (k) {
            return --k * k * k * k * k + 1;
        },
        quinticInOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k * k * k + 2);
        },
        sinusoidalIn: function (k) {
            return 1 - Math.cos(k * Math.PI / 2);
        },
        sinusoidalOut: function (k) {
            return Math.sin(k * Math.PI / 2);
        },
        sinusoidalInOut: function (k) {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        },
        exponentialIn: function (k) {
            return k === 0 ? 0 : Math.pow(1024, k - 1);
        },
        exponentialOut: function (k) {
            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
        },
        exponentialInOut: function (k) {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if ((k *= 2) < 1) {
                return 0.5 * Math.pow(1024, k - 1);
            }
            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        },
        circularIn: function (k) {
            return 1 - Math.sqrt(1 - k * k);
        },
        circularOut: function (k) {
            return Math.sqrt(1 - (--k * k));
        },
        circularInOut: function (k) {
            if ((k *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - k * k) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        },
        elasticIn: function (k) {
            var s;
            var a = 0.1;
            var p = 0.4;
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            }
            else {
                s = p * Math.asin(1 / a) / (2 * Math.PI);
            }
            return -(a * Math.pow(2, 10 * (k -= 1))
                * Math.sin((k - s) * (2 * Math.PI) / p));
        },
        elasticOut: function (k) {
            var s;
            var a = 0.1;
            var p = 0.4;
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            }
            else {
                s = p * Math.asin(1 / a) / (2 * Math.PI);
            }
            return (a * Math.pow(2, -10 * k)
                * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
        },
        elasticInOut: function (k) {
            var s;
            var a = 0.1;
            var p = 0.4;
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            }
            else {
                s = p * Math.asin(1 / a) / (2 * Math.PI);
            }
            if ((k *= 2) < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (k -= 1))
                    * Math.sin((k - s) * (2 * Math.PI) / p));
            }
            return a * Math.pow(2, -10 * (k -= 1))
                * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
        },
        backIn: function (k) {
            var s = 1.70158;
            return k * k * ((s + 1) * k - s);
        },
        backOut: function (k) {
            var s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;
        },
        backInOut: function (k) {
            var s = 1.70158 * 1.525;
            if ((k *= 2) < 1) {
                return 0.5 * (k * k * ((s + 1) * k - s));
            }
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        },
        bounceIn: function (k) {
            return 1 - easing.bounceOut(1 - k);
        },
        bounceOut: function (k) {
            if (k < (1 / 2.75)) {
                return 7.5625 * k * k;
            }
            else if (k < (2 / 2.75)) {
                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
            }
            else if (k < (2.5 / 2.75)) {
                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
            }
            else {
                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
            }
        },
        bounceInOut: function (k) {
            if (k < 0.5) {
                return easing.bounceIn(k * 2) * 0.5;
            }
            return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
        }
    };

    var Clip = (function () {
        function Clip(opts) {
            this._initialized = false;
            this._startTime = 0;
            this._pausedTime = 0;
            this._paused = false;
            this._life = opts.life || 1000;
            this._delay = opts.delay || 0;
            this.loop = opts.loop == null ? false : opts.loop;
            this.gap = opts.gap || 0;
            this.easing = opts.easing || 'linear';
            this.onframe = opts.onframe;
            this.ondestroy = opts.ondestroy;
            this.onrestart = opts.onrestart;
        }
        Clip.prototype.step = function (globalTime, deltaTime) {
            if (!this._initialized) {
                this._startTime = globalTime + this._delay;
                this._initialized = true;
            }
            if (this._paused) {
                this._pausedTime += deltaTime;
                return;
            }
            var percent = (globalTime - this._startTime - this._pausedTime) / this._life;
            if (percent < 0) {
                percent = 0;
            }
            percent = Math.min(percent, 1);
            var easing$1 = this.easing;
            var easingFunc = typeof easing$1 === 'string'
                ? easing[easing$1] : easing$1;
            var schedule = typeof easingFunc === 'function'
                ? easingFunc(percent)
                : percent;
            this.onframe && this.onframe(schedule);
            if (percent === 1) {
                if (this.loop) {
                    this._restart(globalTime);
                    this.onrestart && this.onrestart();
                }
                else {
                    return true;
                }
            }
            return false;
        };
        Clip.prototype._restart = function (globalTime) {
            var remainder = (globalTime - this._startTime - this._pausedTime) % this._life;
            this._startTime = globalTime - remainder + this.gap;
            this._pausedTime = 0;
        };
        Clip.prototype.pause = function () {
            this._paused = true;
        };
        Clip.prototype.resume = function () {
            this._paused = false;
        };
        return Clip;
    }());

    var Entry = (function () {
        function Entry(val) {
            this.value = val;
        }
        return Entry;
    }());
    var LinkedList = (function () {
        function LinkedList() {
            this._len = 0;
        }
        LinkedList.prototype.insert = function (val) {
            var entry = new Entry(val);
            this.insertEntry(entry);
            return entry;
        };
        LinkedList.prototype.insertEntry = function (entry) {
            if (!this.head) {
                this.head = this.tail = entry;
            }
            else {
                this.tail.next = entry;
                entry.prev = this.tail;
                entry.next = null;
                this.tail = entry;
            }
            this._len++;
        };
        LinkedList.prototype.remove = function (entry) {
            var prev = entry.prev;
            var next = entry.next;
            if (prev) {
                prev.next = next;
            }
            else {
                this.head = next;
            }
            if (next) {
                next.prev = prev;
            }
            else {
                this.tail = prev;
            }
            entry.next = entry.prev = null;
            this._len--;
        };
        LinkedList.prototype.len = function () {
            return this._len;
        };
        LinkedList.prototype.clear = function () {
            this.head = this.tail = null;
            this._len = 0;
        };
        return LinkedList;
    }());
    var LRU = (function () {
        function LRU(maxSize) {
            this._list = new LinkedList();
            this._maxSize = 10;
            this._map = {};
            this._maxSize = maxSize;
        }
        LRU.prototype.put = function (key, value) {
            var list = this._list;
            var map = this._map;
            var removed = null;
            if (map[key] == null) {
                var len = list.len();
                var entry = this._lastRemovedEntry;
                if (len >= this._maxSize && len > 0) {
                    var leastUsedEntry = list.head;
                    list.remove(leastUsedEntry);
                    delete map[leastUsedEntry.key];
                    removed = leastUsedEntry.value;
                    this._lastRemovedEntry = leastUsedEntry;
                }
                if (entry) {
                    entry.value = value;
                }
                else {
                    entry = new Entry(value);
                }
                entry.key = key;
                list.insertEntry(entry);
                map[key] = entry;
            }
            return removed;
        };
        LRU.prototype.get = function (key) {
            var entry = this._map[key];
            var list = this._list;
            if (entry != null) {
                if (entry !== list.tail) {
                    list.remove(entry);
                    list.insertEntry(entry);
                }
                return entry.value;
            }
        };
        LRU.prototype.clear = function () {
            this._list.clear();
            this._map = {};
        };
        LRU.prototype.len = function () {
            return this._list.len();
        };
        return LRU;
    }());

    var kCSSColorTable = {
        'transparent': [0, 0, 0, 0], 'aliceblue': [240, 248, 255, 1],
        'antiquewhite': [250, 235, 215, 1], 'aqua': [0, 255, 255, 1],
        'aquamarine': [127, 255, 212, 1], 'azure': [240, 255, 255, 1],
        'beige': [245, 245, 220, 1], 'bisque': [255, 228, 196, 1],
        'black': [0, 0, 0, 1], 'blanchedalmond': [255, 235, 205, 1],
        'blue': [0, 0, 255, 1], 'blueviolet': [138, 43, 226, 1],
        'brown': [165, 42, 42, 1], 'burlywood': [222, 184, 135, 1],
        'cadetblue': [95, 158, 160, 1], 'chartreuse': [127, 255, 0, 1],
        'chocolate': [210, 105, 30, 1], 'coral': [255, 127, 80, 1],
        'cornflowerblue': [100, 149, 237, 1], 'cornsilk': [255, 248, 220, 1],
        'crimson': [220, 20, 60, 1], 'cyan': [0, 255, 255, 1],
        'darkblue': [0, 0, 139, 1], 'darkcyan': [0, 139, 139, 1],
        'darkgoldenrod': [184, 134, 11, 1], 'darkgray': [169, 169, 169, 1],
        'darkgreen': [0, 100, 0, 1], 'darkgrey': [169, 169, 169, 1],
        'darkkhaki': [189, 183, 107, 1], 'darkmagenta': [139, 0, 139, 1],
        'darkolivegreen': [85, 107, 47, 1], 'darkorange': [255, 140, 0, 1],
        'darkorchid': [153, 50, 204, 1], 'darkred': [139, 0, 0, 1],
        'darksalmon': [233, 150, 122, 1], 'darkseagreen': [143, 188, 143, 1],
        'darkslateblue': [72, 61, 139, 1], 'darkslategray': [47, 79, 79, 1],
        'darkslategrey': [47, 79, 79, 1], 'darkturquoise': [0, 206, 209, 1],
        'darkviolet': [148, 0, 211, 1], 'deeppink': [255, 20, 147, 1],
        'deepskyblue': [0, 191, 255, 1], 'dimgray': [105, 105, 105, 1],
        'dimgrey': [105, 105, 105, 1], 'dodgerblue': [30, 144, 255, 1],
        'firebrick': [178, 34, 34, 1], 'floralwhite': [255, 250, 240, 1],
        'forestgreen': [34, 139, 34, 1], 'fuchsia': [255, 0, 255, 1],
        'gainsboro': [220, 220, 220, 1], 'ghostwhite': [248, 248, 255, 1],
        'gold': [255, 215, 0, 1], 'goldenrod': [218, 165, 32, 1],
        'gray': [128, 128, 128, 1], 'green': [0, 128, 0, 1],
        'greenyellow': [173, 255, 47, 1], 'grey': [128, 128, 128, 1],
        'honeydew': [240, 255, 240, 1], 'hotpink': [255, 105, 180, 1],
        'indianred': [205, 92, 92, 1], 'indigo': [75, 0, 130, 1],
        'ivory': [255, 255, 240, 1], 'khaki': [240, 230, 140, 1],
        'lavender': [230, 230, 250, 1], 'lavenderblush': [255, 240, 245, 1],
        'lawngreen': [124, 252, 0, 1], 'lemonchiffon': [255, 250, 205, 1],
        'lightblue': [173, 216, 230, 1], 'lightcoral': [240, 128, 128, 1],
        'lightcyan': [224, 255, 255, 1], 'lightgoldenrodyellow': [250, 250, 210, 1],
        'lightgray': [211, 211, 211, 1], 'lightgreen': [144, 238, 144, 1],
        'lightgrey': [211, 211, 211, 1], 'lightpink': [255, 182, 193, 1],
        'lightsalmon': [255, 160, 122, 1], 'lightseagreen': [32, 178, 170, 1],
        'lightskyblue': [135, 206, 250, 1], 'lightslategray': [119, 136, 153, 1],
        'lightslategrey': [119, 136, 153, 1], 'lightsteelblue': [176, 196, 222, 1],
        'lightyellow': [255, 255, 224, 1], 'lime': [0, 255, 0, 1],
        'limegreen': [50, 205, 50, 1], 'linen': [250, 240, 230, 1],
        'magenta': [255, 0, 255, 1], 'maroon': [128, 0, 0, 1],
        'mediumaquamarine': [102, 205, 170, 1], 'mediumblue': [0, 0, 205, 1],
        'mediumorchid': [186, 85, 211, 1], 'mediumpurple': [147, 112, 219, 1],
        'mediumseagreen': [60, 179, 113, 1], 'mediumslateblue': [123, 104, 238, 1],
        'mediumspringgreen': [0, 250, 154, 1], 'mediumturquoise': [72, 209, 204, 1],
        'mediumvioletred': [199, 21, 133, 1], 'midnightblue': [25, 25, 112, 1],
        'mintcream': [245, 255, 250, 1], 'mistyrose': [255, 228, 225, 1],
        'moccasin': [255, 228, 181, 1], 'navajowhite': [255, 222, 173, 1],
        'navy': [0, 0, 128, 1], 'oldlace': [253, 245, 230, 1],
        'olive': [128, 128, 0, 1], 'olivedrab': [107, 142, 35, 1],
        'orange': [255, 165, 0, 1], 'orangered': [255, 69, 0, 1],
        'orchid': [218, 112, 214, 1], 'palegoldenrod': [238, 232, 170, 1],
        'palegreen': [152, 251, 152, 1], 'paleturquoise': [175, 238, 238, 1],
        'palevioletred': [219, 112, 147, 1], 'papayawhip': [255, 239, 213, 1],
        'peachpuff': [255, 218, 185, 1], 'peru': [205, 133, 63, 1],
        'pink': [255, 192, 203, 1], 'plum': [221, 160, 221, 1],
        'powderblue': [176, 224, 230, 1], 'purple': [128, 0, 128, 1],
        'red': [255, 0, 0, 1], 'rosybrown': [188, 143, 143, 1],
        'royalblue': [65, 105, 225, 1], 'saddlebrown': [139, 69, 19, 1],
        'salmon': [250, 128, 114, 1], 'sandybrown': [244, 164, 96, 1],
        'seagreen': [46, 139, 87, 1], 'seashell': [255, 245, 238, 1],
        'sienna': [160, 82, 45, 1], 'silver': [192, 192, 192, 1],
        'skyblue': [135, 206, 235, 1], 'slateblue': [106, 90, 205, 1],
        'slategray': [112, 128, 144, 1], 'slategrey': [112, 128, 144, 1],
        'snow': [255, 250, 250, 1], 'springgreen': [0, 255, 127, 1],
        'steelblue': [70, 130, 180, 1], 'tan': [210, 180, 140, 1],
        'teal': [0, 128, 128, 1], 'thistle': [216, 191, 216, 1],
        'tomato': [255, 99, 71, 1], 'turquoise': [64, 224, 208, 1],
        'violet': [238, 130, 238, 1], 'wheat': [245, 222, 179, 1],
        'white': [255, 255, 255, 1], 'whitesmoke': [245, 245, 245, 1],
        'yellow': [255, 255, 0, 1], 'yellowgreen': [154, 205, 50, 1]
    };
    function clampCssByte(i) {
        i = Math.round(i);
        return i < 0 ? 0 : i > 255 ? 255 : i;
    }
    function clampCssAngle(i) {
        i = Math.round(i);
        return i < 0 ? 0 : i > 360 ? 360 : i;
    }
    function clampCssFloat(f) {
        return f < 0 ? 0 : f > 1 ? 1 : f;
    }
    function parseCssInt(val) {
        var str = val;
        if (str.length && str.charAt(str.length - 1) === '%') {
            return clampCssByte(parseFloat(str) / 100 * 255);
        }
        return clampCssByte(parseInt(str, 10));
    }
    function parseCssFloat(val) {
        var str = val;
        if (str.length && str.charAt(str.length - 1) === '%') {
            return clampCssFloat(parseFloat(str) / 100);
        }
        return clampCssFloat(parseFloat(str));
    }
    function cssHueToRgb(m1, m2, h) {
        if (h < 0) {
            h += 1;
        }
        else if (h > 1) {
            h -= 1;
        }
        if (h * 6 < 1) {
            return m1 + (m2 - m1) * h * 6;
        }
        if (h * 2 < 1) {
            return m2;
        }
        if (h * 3 < 2) {
            return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        }
        return m1;
    }
    function lerpNumber(a, b, p) {
        return a + (b - a) * p;
    }
    function setRgba(out, r, g, b, a) {
        out[0] = r;
        out[1] = g;
        out[2] = b;
        out[3] = a;
        return out;
    }
    function copyRgba(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        return out;
    }
    var colorCache = new LRU(20);
    var lastRemovedArr = null;
    function putToCache(colorStr, rgbaArr) {
        if (lastRemovedArr) {
            copyRgba(lastRemovedArr, rgbaArr);
        }
        lastRemovedArr = colorCache.put(colorStr, lastRemovedArr || (rgbaArr.slice()));
    }
    function parse(colorStr, rgbaArr) {
        if (!colorStr) {
            return;
        }
        rgbaArr = rgbaArr || [];
        var cached = colorCache.get(colorStr);
        if (cached) {
            return copyRgba(rgbaArr, cached);
        }
        colorStr = colorStr + '';
        var str = colorStr.replace(/ /g, '').toLowerCase();
        if (str in kCSSColorTable) {
            copyRgba(rgbaArr, kCSSColorTable[str]);
            putToCache(colorStr, rgbaArr);
            return rgbaArr;
        }
        var strLen = str.length;
        if (str.charAt(0) === '#') {
            if (strLen === 4 || strLen === 5) {
                var iv = parseInt(str.slice(1, 4), 16);
                if (!(iv >= 0 && iv <= 0xfff)) {
                    setRgba(rgbaArr, 0, 0, 0, 1);
                    return;
                }
                setRgba(rgbaArr, ((iv & 0xf00) >> 4) | ((iv & 0xf00) >> 8), (iv & 0xf0) | ((iv & 0xf0) >> 4), (iv & 0xf) | ((iv & 0xf) << 4), strLen === 5 ? parseInt(str.slice(4), 16) / 0xf : 1);
                putToCache(colorStr, rgbaArr);
                return rgbaArr;
            }
            else if (strLen === 7 || strLen === 9) {
                var iv = parseInt(str.slice(1, 7), 16);
                if (!(iv >= 0 && iv <= 0xffffff)) {
                    setRgba(rgbaArr, 0, 0, 0, 1);
                    return;
                }
                setRgba(rgbaArr, (iv & 0xff0000) >> 16, (iv & 0xff00) >> 8, iv & 0xff, strLen === 9 ? parseInt(str.slice(7), 16) / 0xff : 1);
                putToCache(colorStr, rgbaArr);
                return rgbaArr;
            }
            return;
        }
        var op = str.indexOf('(');
        var ep = str.indexOf(')');
        if (op !== -1 && ep + 1 === strLen) {
            var fname = str.substr(0, op);
            var params = str.substr(op + 1, ep - (op + 1)).split(',');
            var alpha = 1;
            switch (fname) {
                case 'rgba':
                    if (params.length !== 4) {
                        return params.length === 3
                            ? setRgba(rgbaArr, +params[0], +params[1], +params[2], 1)
                            : setRgba(rgbaArr, 0, 0, 0, 1);
                    }
                    alpha = parseCssFloat(params.pop());
                case 'rgb':
                    if (params.length !== 3) {
                        setRgba(rgbaArr, 0, 0, 0, 1);
                        return;
                    }
                    setRgba(rgbaArr, parseCssInt(params[0]), parseCssInt(params[1]), parseCssInt(params[2]), alpha);
                    putToCache(colorStr, rgbaArr);
                    return rgbaArr;
                case 'hsla':
                    if (params.length !== 4) {
                        setRgba(rgbaArr, 0, 0, 0, 1);
                        return;
                    }
                    params[3] = parseCssFloat(params[3]);
                    hsla2rgba(params, rgbaArr);
                    putToCache(colorStr, rgbaArr);
                    return rgbaArr;
                case 'hsl':
                    if (params.length !== 3) {
                        setRgba(rgbaArr, 0, 0, 0, 1);
                        return;
                    }
                    hsla2rgba(params, rgbaArr);
                    putToCache(colorStr, rgbaArr);
                    return rgbaArr;
                default:
                    return;
            }
        }
        setRgba(rgbaArr, 0, 0, 0, 1);
        return;
    }
    function hsla2rgba(hsla, rgba) {
        var h = (((parseFloat(hsla[0]) % 360) + 360) % 360) / 360;
        var s = parseCssFloat(hsla[1]);
        var l = parseCssFloat(hsla[2]);
        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
        var m1 = l * 2 - m2;
        rgba = rgba || [];
        setRgba(rgba, clampCssByte(cssHueToRgb(m1, m2, h + 1 / 3) * 255), clampCssByte(cssHueToRgb(m1, m2, h) * 255), clampCssByte(cssHueToRgb(m1, m2, h - 1 / 3) * 255), 1);
        if (hsla.length === 4) {
            rgba[3] = hsla[3];
        }
        return rgba;
    }
    function rgba2hsla(rgba) {
        if (!rgba) {
            return;
        }
        var R = rgba[0] / 255;
        var G = rgba[1] / 255;
        var B = rgba[2] / 255;
        var vMin = Math.min(R, G, B);
        var vMax = Math.max(R, G, B);
        var delta = vMax - vMin;
        var L = (vMax + vMin) / 2;
        var H;
        var S;
        if (delta === 0) {
            H = 0;
            S = 0;
        }
        else {
            if (L < 0.5) {
                S = delta / (vMax + vMin);
            }
            else {
                S = delta / (2 - vMax - vMin);
            }
            var deltaR = (((vMax - R) / 6) + (delta / 2)) / delta;
            var deltaG = (((vMax - G) / 6) + (delta / 2)) / delta;
            var deltaB = (((vMax - B) / 6) + (delta / 2)) / delta;
            if (R === vMax) {
                H = deltaB - deltaG;
            }
            else if (G === vMax) {
                H = (1 / 3) + deltaR - deltaB;
            }
            else if (B === vMax) {
                H = (2 / 3) + deltaG - deltaR;
            }
            if (H < 0) {
                H += 1;
            }
            if (H > 1) {
                H -= 1;
            }
        }
        var hsla = [H * 360, S, L];
        if (rgba[3] != null) {
            hsla.push(rgba[3]);
        }
        return hsla;
    }
    function lift(color, level) {
        var colorArr = parse(color);
        if (colorArr) {
            for (var i = 0; i < 3; i++) {
                if (level < 0) {
                    colorArr[i] = colorArr[i] * (1 - level) | 0;
                }
                else {
                    colorArr[i] = ((255 - colorArr[i]) * level + colorArr[i]) | 0;
                }
                if (colorArr[i] > 255) {
                    colorArr[i] = 255;
                }
                else if (colorArr[i] < 0) {
                    colorArr[i] = 0;
                }
            }
            return stringify(colorArr, colorArr.length === 4 ? 'rgba' : 'rgb');
        }
    }
    function toHex(color) {
        var colorArr = parse(color);
        if (colorArr) {
            return ((1 << 24) + (colorArr[0] << 16) + (colorArr[1] << 8) + (+colorArr[2])).toString(16).slice(1);
        }
    }
    function fastLerp(normalizedValue, colors, out) {
        if (!(colors && colors.length)
            || !(normalizedValue >= 0 && normalizedValue <= 1)) {
            return;
        }
        out = out || [];
        var value = normalizedValue * (colors.length - 1);
        var leftIndex = Math.floor(value);
        var rightIndex = Math.ceil(value);
        var leftColor = colors[leftIndex];
        var rightColor = colors[rightIndex];
        var dv = value - leftIndex;
        out[0] = clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv));
        out[1] = clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv));
        out[2] = clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv));
        out[3] = clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv));
        return out;
    }
    var fastMapToColor = fastLerp;
    function lerp(normalizedValue, colors, fullOutput) {
        if (!(colors && colors.length)
            || !(normalizedValue >= 0 && normalizedValue <= 1)) {
            return;
        }
        var value = normalizedValue * (colors.length - 1);
        var leftIndex = Math.floor(value);
        var rightIndex = Math.ceil(value);
        var leftColor = parse(colors[leftIndex]);
        var rightColor = parse(colors[rightIndex]);
        var dv = value - leftIndex;
        var color = stringify([
            clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv)),
            clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv)),
            clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv)),
            clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv))
        ], 'rgba');
        return fullOutput
            ? {
                color: color,
                leftIndex: leftIndex,
                rightIndex: rightIndex,
                value: value
            }
            : color;
    }
    var mapToColor = lerp;
    function modifyHSL(color, h, s, l) {
        var colorArr = parse(color);
        if (color) {
            colorArr = rgba2hsla(colorArr);
            h != null && (colorArr[0] = clampCssAngle(h));
            s != null && (colorArr[1] = parseCssFloat(s));
            l != null && (colorArr[2] = parseCssFloat(l));
            return stringify(hsla2rgba(colorArr), 'rgba');
        }
    }
    function modifyAlpha(color, alpha) {
        var colorArr = parse(color);
        if (colorArr && alpha != null) {
            colorArr[3] = clampCssFloat(alpha);
            return stringify(colorArr, 'rgba');
        }
    }
    function stringify(arrColor, type) {
        if (!arrColor || !arrColor.length) {
            return;
        }
        var colorStr = arrColor[0] + ',' + arrColor[1] + ',' + arrColor[2];
        if (type === 'rgba' || type === 'hsva' || type === 'hsla') {
            colorStr += ',' + arrColor[3];
        }
        return type + '(' + colorStr + ')';
    }
    function lum(color, backgroundLum) {
        var arr = parse(color);
        return arr
            ? (0.299 * arr[0] + 0.587 * arr[1] + 0.114 * arr[2]) * arr[3] / 255
                + (1 - arr[3]) * backgroundLum
            : 0;
    }
    function random() {
        var r = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    var color = /*#__PURE__*/Object.freeze({
        __proto__: null,
        parse: parse,
        lift: lift,
        toHex: toHex,
        fastLerp: fastLerp,
        fastMapToColor: fastMapToColor,
        lerp: lerp,
        mapToColor: mapToColor,
        modifyHSL: modifyHSL,
        modifyAlpha: modifyAlpha,
        stringify: stringify,
        lum: lum,
        random: random
    });

    var arraySlice = Array.prototype.slice;
    function interpolateNumber(p0, p1, percent) {
        return (p1 - p0) * percent + p0;
    }
    function step(p0, p1, percent) {
        return percent > 0.5 ? p1 : p0;
    }
    function interpolate1DArray(out, p0, p1, percent) {
        var len = p0.length;
        for (var i = 0; i < len; i++) {
            out[i] = interpolateNumber(p0[i], p1[i], percent);
        }
    }
    function interpolate2DArray(out, p0, p1, percent) {
        var len = p0.length;
        var len2 = len && p0[0].length;
        for (var i = 0; i < len; i++) {
            if (!out[i]) {
                out[i] = [];
            }
            for (var j = 0; j < len2; j++) {
                out[i][j] = interpolateNumber(p0[i][j], p1[i][j], percent);
            }
        }
    }
    function add1DArray(out, p0, p1, sign) {
        var len = p0.length;
        for (var i = 0; i < len; i++) {
            out[i] = p0[i] + p1[i] * sign;
        }
        return out;
    }
    function add2DArray(out, p0, p1, sign) {
        var len = p0.length;
        var len2 = len && p0[0].length;
        for (var i = 0; i < len; i++) {
            if (!out[i]) {
                out[i] = [];
            }
            for (var j = 0; j < len2; j++) {
                out[i][j] = p0[i][j] + p1[i][j] * sign;
            }
        }
        return out;
    }
    function fillArray(val0, val1, arrDim) {
        var arr0 = val0;
        var arr1 = val1;
        if (!arr0.push || !arr1.push) {
            return;
        }
        var arr0Len = arr0.length;
        var arr1Len = arr1.length;
        if (arr0Len !== arr1Len) {
            var isPreviousLarger = arr0Len > arr1Len;
            if (isPreviousLarger) {
                arr0.length = arr1Len;
            }
            else {
                for (var i = arr0Len; i < arr1Len; i++) {
                    arr0.push(arrDim === 1 ? arr1[i] : arraySlice.call(arr1[i]));
                }
            }
        }
        var len2 = arr0[0] && arr0[0].length;
        for (var i = 0; i < arr0.length; i++) {
            if (arrDim === 1) {
                if (isNaN(arr0[i])) {
                    arr0[i] = arr1[i];
                }
            }
            else {
                for (var j = 0; j < len2; j++) {
                    if (isNaN(arr0[i][j])) {
                        arr0[i][j] = arr1[i][j];
                    }
                }
            }
        }
    }
    function is1DArraySame(arr0, arr1) {
        var len = arr0.length;
        if (len !== arr1.length) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            if (arr0[i] !== arr1[i]) {
                return false;
            }
        }
        return true;
    }
    function catmullRomInterpolate(p0, p1, p2, p3, t, t2, t3) {
        var v0 = (p2 - p0) * 0.5;
        var v1 = (p3 - p1) * 0.5;
        return (2 * (p1 - p2) + v0 + v1) * t3
            + (-3 * (p1 - p2) - 2 * v0 - v1) * t2
            + v0 * t + p1;
    }
    function catmullRomInterpolate1DArray(out, p0, p1, p2, p3, t, t2, t3) {
        var len = p0.length;
        for (var i = 0; i < len; i++) {
            out[i] = catmullRomInterpolate(p0[i], p1[i], p2[i], p3[i], t, t2, t3);
        }
    }
    function catmullRomInterpolate2DArray(out, p0, p1, p2, p3, t, t2, t3) {
        var len = p0.length;
        var len2 = p0[0].length;
        for (var i = 0; i < len; i++) {
            if (!out[i]) {
                out[1] = [];
            }
            for (var j = 0; j < len2; j++) {
                out[i][j] = catmullRomInterpolate(p0[i][j], p1[i][j], p2[i][j], p3[i][j], t, t2, t3);
            }
        }
    }
    function cloneValue(value) {
        if (isArrayLike$1(value)) {
            var len = value.length;
            if (isArrayLike$1(value[0])) {
                var ret = [];
                for (var i = 0; i < len; i++) {
                    ret.push(arraySlice.call(value[i]));
                }
                return ret;
            }
            return arraySlice.call(value);
        }
        return value;
    }
    function rgba2String(rgba) {
        rgba[0] = Math.floor(rgba[0]);
        rgba[1] = Math.floor(rgba[1]);
        rgba[2] = Math.floor(rgba[2]);
        return 'rgba(' + rgba.join(',') + ')';
    }
    function guessArrayDim(value) {
        return isArrayLike$1(value && value[0]) ? 2 : 1;
    }
    var tmpRgba = [0, 0, 0, 0];
    var Track = (function () {
        function Track(propName) {
            this.keyframes = [];
            this.maxTime = 0;
            this.arrDim = 0;
            this.interpolable = true;
            this._needsSort = false;
            this._isAllValueEqual = true;
            this._lastFrame = 0;
            this._lastFramePercent = 0;
            this.propName = propName;
        }
        Track.prototype.isFinished = function () {
            return this._finished;
        };
        Track.prototype.setFinished = function () {
            this._finished = true;
            if (this._additiveTrack) {
                this._additiveTrack.setFinished();
            }
        };
        Track.prototype.needsAnimate = function () {
            return !this._isAllValueEqual && this.keyframes.length >= 2 && this.interpolable;
        };
        Track.prototype.getAdditiveTrack = function () {
            return this._additiveTrack;
        };
        Track.prototype.addKeyframe = function (time, value) {
            if (time >= this.maxTime) {
                this.maxTime = time;
            }
            else {
                this._needsSort = true;
            }
            var keyframes = this.keyframes;
            var len = keyframes.length;
            if (this.interpolable) {
                if (isArrayLike$1(value)) {
                    var arrayDim = guessArrayDim(value);
                    if (len > 0 && this.arrDim !== arrayDim) {
                        this.interpolable = false;
                        return;
                    }
                    if (arrayDim === 1 && typeof value[0] !== 'number'
                        || arrayDim === 2 && typeof value[0][0] !== 'number') {
                        this.interpolable = false;
                        return;
                    }
                    if (len > 0) {
                        var lastFrame = keyframes[len - 1];
                        if (this._isAllValueEqual) {
                            if (arrayDim === 1) {
                                if (!is1DArraySame(value, lastFrame.value)) {
                                    this._isAllValueEqual = false;
                                }
                            }
                            else {
                                this._isAllValueEqual = false;
                            }
                        }
                    }
                    this.arrDim = arrayDim;
                }
                else {
                    if (this.arrDim > 0) {
                        this.interpolable = false;
                        return;
                    }
                    if (typeof value === 'string') {
                        var colorArray = parse(value);
                        if (colorArray) {
                            value = colorArray;
                            this.isValueColor = true;
                        }
                        else {
                            this.interpolable = false;
                        }
                    }
                    else if (typeof value !== 'number' || isNaN(value)) {
                        this.interpolable = false;
                        return;
                    }
                    if (this._isAllValueEqual && len > 0) {
                        var lastFrame = keyframes[len - 1];
                        if (this.isValueColor && !is1DArraySame(lastFrame.value, value)) {
                            this._isAllValueEqual = false;
                        }
                        else if (lastFrame.value !== value) {
                            this._isAllValueEqual = false;
                        }
                    }
                }
            }
            var kf = {
                time: time,
                value: value,
                percent: 0
            };
            this.keyframes.push(kf);
            return kf;
        };
        Track.prototype.prepare = function (additiveTrack) {
            var kfs = this.keyframes;
            if (this._needsSort) {
                kfs.sort(function (a, b) {
                    return a.time - b.time;
                });
            }
            var arrDim = this.arrDim;
            var kfsLen = kfs.length;
            var lastKf = kfs[kfsLen - 1];
            for (var i = 0; i < kfsLen; i++) {
                kfs[i].percent = kfs[i].time / this.maxTime;
                if (arrDim > 0 && i !== kfsLen - 1) {
                    fillArray(kfs[i].value, lastKf.value, arrDim);
                }
            }
            if (additiveTrack
                && this.needsAnimate()
                && additiveTrack.needsAnimate()
                && arrDim === additiveTrack.arrDim
                && this.isValueColor === additiveTrack.isValueColor
                && !additiveTrack._finished) {
                this._additiveTrack = additiveTrack;
                var startValue = kfs[0].value;
                for (var i = 0; i < kfsLen; i++) {
                    if (arrDim === 0) {
                        if (this.isValueColor) {
                            kfs[i].additiveValue
                                = add1DArray([], kfs[i].value, startValue, -1);
                        }
                        else {
                            kfs[i].additiveValue = kfs[i].value - startValue;
                        }
                    }
                    else if (arrDim === 1) {
                        kfs[i].additiveValue = add1DArray([], kfs[i].value, startValue, -1);
                    }
                    else if (arrDim === 2) {
                        kfs[i].additiveValue = add2DArray([], kfs[i].value, startValue, -1);
                    }
                }
            }
        };
        Track.prototype.step = function (target, percent) {
            if (this._finished) {
                return;
            }
            if (this._additiveTrack && this._additiveTrack._finished) {
                this._additiveTrack = null;
            }
            var isAdditive = this._additiveTrack != null;
            var valueKey = isAdditive ? 'additiveValue' : 'value';
            var keyframes = this.keyframes;
            var kfsNum = this.keyframes.length;
            var propName = this.propName;
            var arrDim = this.arrDim;
            var isValueColor = this.isValueColor;
            var frameIdx;
            if (percent < 0) {
                frameIdx = 0;
            }
            else if (percent < this._lastFramePercent) {
                var start = Math.min(this._lastFrame + 1, kfsNum - 1);
                for (frameIdx = start; frameIdx >= 0; frameIdx--) {
                    if (keyframes[frameIdx].percent <= percent) {
                        break;
                    }
                }
                frameIdx = Math.min(frameIdx, kfsNum - 2);
            }
            else {
                for (frameIdx = this._lastFrame; frameIdx < kfsNum; frameIdx++) {
                    if (keyframes[frameIdx].percent > percent) {
                        break;
                    }
                }
                frameIdx = Math.min(frameIdx - 1, kfsNum - 2);
            }
            var nextFrame = keyframes[frameIdx + 1];
            var frame = keyframes[frameIdx];
            if (!(frame && nextFrame)) {
                return;
            }
            this._lastFrame = frameIdx;
            this._lastFramePercent = percent;
            var range = (nextFrame.percent - frame.percent);
            if (range === 0) {
                return;
            }
            var w = (percent - frame.percent) / range;
            var targetArr = isAdditive ? this._additiveValue
                : (isValueColor ? tmpRgba : target[propName]);
            if ((arrDim > 0 || isValueColor) && !targetArr) {
                targetArr = this._additiveValue = [];
            }
            if (this.useSpline) {
                var p1 = keyframes[frameIdx][valueKey];
                var p0 = keyframes[frameIdx === 0 ? frameIdx : frameIdx - 1][valueKey];
                var p2 = keyframes[frameIdx > kfsNum - 2 ? kfsNum - 1 : frameIdx + 1][valueKey];
                var p3 = keyframes[frameIdx > kfsNum - 3 ? kfsNum - 1 : frameIdx + 2][valueKey];
                if (arrDim > 0) {
                    arrDim === 1
                        ? catmullRomInterpolate1DArray(targetArr, p0, p1, p2, p3, w, w * w, w * w * w)
                        : catmullRomInterpolate2DArray(targetArr, p0, p1, p2, p3, w, w * w, w * w * w);
                }
                else if (isValueColor) {
                    catmullRomInterpolate1DArray(targetArr, p0, p1, p2, p3, w, w * w, w * w * w);
                    if (!isAdditive) {
                        target[propName] = rgba2String(targetArr);
                    }
                }
                else {
                    var value = void 0;
                    if (!this.interpolable) {
                        value = p2;
                    }
                    else {
                        value = catmullRomInterpolate(p0, p1, p2, p3, w, w * w, w * w * w);
                    }
                    if (isAdditive) {
                        this._additiveValue = value;
                    }
                    else {
                        target[propName] = value;
                    }
                }
            }
            else {
                if (arrDim > 0) {
                    arrDim === 1
                        ? interpolate1DArray(targetArr, frame[valueKey], nextFrame[valueKey], w)
                        : interpolate2DArray(targetArr, frame[valueKey], nextFrame[valueKey], w);
                }
                else if (isValueColor) {
                    interpolate1DArray(targetArr, frame[valueKey], nextFrame[valueKey], w);
                    if (!isAdditive) {
                        target[propName] = rgba2String(targetArr);
                    }
                }
                else {
                    var value = void 0;
                    if (!this.interpolable) {
                        value = step(frame[valueKey], nextFrame[valueKey], w);
                    }
                    else {
                        value = interpolateNumber(frame[valueKey], nextFrame[valueKey], w);
                    }
                    if (isAdditive) {
                        this._additiveValue = value;
                    }
                    else {
                        target[propName] = value;
                    }
                }
            }
            if (isAdditive) {
                this._addToTarget(target);
            }
        };
        Track.prototype._addToTarget = function (target) {
            var arrDim = this.arrDim;
            var propName = this.propName;
            var additiveValue = this._additiveValue;
            if (arrDim === 0) {
                if (this.isValueColor) {
                    parse(target[propName], tmpRgba);
                    add1DArray(tmpRgba, tmpRgba, additiveValue, 1);
                    target[propName] = rgba2String(tmpRgba);
                }
                else {
                    target[propName] = target[propName] + additiveValue;
                }
            }
            else if (arrDim === 1) {
                add1DArray(target[propName], target[propName], additiveValue, 1);
            }
            else if (arrDim === 2) {
                add2DArray(target[propName], target[propName], additiveValue, 1);
            }
        };
        return Track;
    }());
    var Animator = (function () {
        function Animator(target, loop, additiveTo) {
            this._tracks = {};
            this._trackKeys = [];
            this._delay = 0;
            this._maxTime = 0;
            this._paused = false;
            this._started = 0;
            this._clip = null;
            this._target = target;
            this._loop = loop;
            if (loop && additiveTo) {
                logError('Can\' use additive animation on looped animation.');
                return;
            }
            this._additiveAnimators = additiveTo;
        }
        Animator.prototype.getTarget = function () {
            return this._target;
        };
        Animator.prototype.changeTarget = function (target) {
            this._target = target;
        };
        Animator.prototype.when = function (time, props) {
            return this.whenWithKeys(time, props, keys$1(props));
        };
        Animator.prototype.whenWithKeys = function (time, props, propNames) {
            var tracks = this._tracks;
            for (var i = 0; i < propNames.length; i++) {
                var propName = propNames[i];
                var track = tracks[propName];
                if (!track) {
                    track = tracks[propName] = new Track(propName);
                    var initialValue = void 0;
                    var additiveTrack = this._getAdditiveTrack(propName);
                    if (additiveTrack) {
                        var lastFinalKf = additiveTrack.keyframes[additiveTrack.keyframes.length - 1];
                        initialValue = lastFinalKf && lastFinalKf.value;
                        if (additiveTrack.isValueColor && initialValue) {
                            initialValue = rgba2String(initialValue);
                        }
                    }
                    else {
                        initialValue = this._target[propName];
                    }
                    if (initialValue == null) {
                        continue;
                    }
                    if (time !== 0) {
                        track.addKeyframe(0, cloneValue(initialValue));
                    }
                    this._trackKeys.push(propName);
                }
                track.addKeyframe(time, cloneValue(props[propName]));
            }
            this._maxTime = Math.max(this._maxTime, time);
            return this;
        };
        Animator.prototype.pause = function () {
            this._clip.pause();
            this._paused = true;
        };
        Animator.prototype.resume = function () {
            this._clip.resume();
            this._paused = false;
        };
        Animator.prototype.isPaused = function () {
            return !!this._paused;
        };
        Animator.prototype._doneCallback = function () {
            this._setTracksFinished();
            this._clip = null;
            var doneList = this._doneList;
            if (doneList) {
                var len = doneList.length;
                for (var i = 0; i < len; i++) {
                    doneList[i].call(this);
                }
            }
        };
        Animator.prototype._abortedCallback = function () {
            this._setTracksFinished();
            var animation = this.animation;
            var abortedList = this._abortedList;
            if (animation) {
                animation.removeClip(this._clip);
            }
            this._clip = null;
            if (abortedList) {
                for (var i = 0; i < abortedList.length; i++) {
                    abortedList[i].call(this);
                }
            }
        };
        Animator.prototype._setTracksFinished = function () {
            var tracks = this._tracks;
            var tracksKeys = this._trackKeys;
            for (var i = 0; i < tracksKeys.length; i++) {
                tracks[tracksKeys[i]].setFinished();
            }
        };
        Animator.prototype._getAdditiveTrack = function (trackName) {
            var additiveTrack;
            var additiveAnimators = this._additiveAnimators;
            if (additiveAnimators) {
                for (var i = 0; i < additiveAnimators.length; i++) {
                    var track = additiveAnimators[i].getTrack(trackName);
                    if (track) {
                        additiveTrack = track;
                    }
                }
            }
            return additiveTrack;
        };
        Animator.prototype.start = function (easing, forceAnimate) {
            if (this._started > 0) {
                return;
            }
            this._started = 1;
            var self = this;
            var tracks = [];
            for (var i = 0; i < this._trackKeys.length; i++) {
                var propName = this._trackKeys[i];
                var track = this._tracks[propName];
                var additiveTrack = this._getAdditiveTrack(propName);
                var kfs = track.keyframes;
                track.prepare(additiveTrack);
                if (track.needsAnimate()) {
                    tracks.push(track);
                }
                else if (!track.interpolable) {
                    var lastKf = kfs[kfs.length - 1];
                    if (lastKf) {
                        self._target[track.propName] = lastKf.value;
                    }
                }
            }
            if (tracks.length || forceAnimate) {
                var clip = new Clip({
                    life: this._maxTime,
                    loop: this._loop,
                    delay: this._delay,
                    onframe: function (percent) {
                        self._started = 2;
                        var additiveAnimators = self._additiveAnimators;
                        if (additiveAnimators) {
                            var stillHasAdditiveAnimator = false;
                            for (var i = 0; i < additiveAnimators.length; i++) {
                                if (additiveAnimators[i]._clip) {
                                    stillHasAdditiveAnimator = true;
                                    break;
                                }
                            }
                            if (!stillHasAdditiveAnimator) {
                                self._additiveAnimators = null;
                            }
                        }
                        for (var i = 0; i < tracks.length; i++) {
                            tracks[i].step(self._target, percent);
                        }
                        var onframeList = self._onframeList;
                        if (onframeList) {
                            for (var i = 0; i < onframeList.length; i++) {
                                onframeList[i](self._target, percent);
                            }
                        }
                    },
                    ondestroy: function () {
                        self._doneCallback();
                    }
                });
                this._clip = clip;
                if (this.animation) {
                    this.animation.addClip(clip);
                }
                if (easing && easing !== 'spline') {
                    clip.easing = easing;
                }
            }
            else {
                this._doneCallback();
            }
            return this;
        };
        Animator.prototype.stop = function (forwardToLast) {
            if (!this._clip) {
                return;
            }
            var clip = this._clip;
            if (forwardToLast) {
                clip.onframe(1);
            }
            this._abortedCallback();
        };
        Animator.prototype.delay = function (time) {
            this._delay = time;
            return this;
        };
        Animator.prototype.during = function (cb) {
            if (cb) {
                if (!this._onframeList) {
                    this._onframeList = [];
                }
                this._onframeList.push(cb);
            }
            return this;
        };
        Animator.prototype.done = function (cb) {
            if (cb) {
                if (!this._doneList) {
                    this._doneList = [];
                }
                this._doneList.push(cb);
            }
            return this;
        };
        Animator.prototype.aborted = function (cb) {
            if (cb) {
                if (!this._abortedList) {
                    this._abortedList = [];
                }
                this._abortedList.push(cb);
            }
            return this;
        };
        Animator.prototype.getClip = function () {
            return this._clip;
        };
        Animator.prototype.getTrack = function (propName) {
            return this._tracks[propName];
        };
        Animator.prototype.stopTracks = function (propNames, forwardToLast) {
            if (!propNames.length || !this._clip) {
                return true;
            }
            var tracks = this._tracks;
            var tracksKeys = this._trackKeys;
            for (var i = 0; i < propNames.length; i++) {
                var track = tracks[propNames[i]];
                if (track) {
                    if (forwardToLast) {
                        track.step(this._target, 1);
                    }
                    else if (this._started === 1) {
                        track.step(this._target, 0);
                    }
                    track.setFinished();
                }
            }
            var allAborted = true;
            for (var i = 0; i < tracksKeys.length; i++) {
                if (!tracks[tracksKeys[i]].isFinished()) {
                    allAborted = false;
                    break;
                }
            }
            if (allAborted) {
                this._abortedCallback();
            }
            return allAborted;
        };
        Animator.prototype.saveFinalToTarget = function (target, trackKeys) {
            if (!target) {
                return;
            }
            trackKeys = trackKeys || this._trackKeys;
            for (var i = 0; i < trackKeys.length; i++) {
                var propName = trackKeys[i];
                var track = this._tracks[propName];
                if (!track || track.isFinished()) {
                    continue;
                }
                var kfs = track.keyframes;
                var lastKf = kfs[kfs.length - 1];
                if (lastKf) {
                    var val = cloneValue(lastKf.value);
                    if (track.isValueColor) {
                        val = rgba2String(val);
                    }
                    target[propName] = val;
                }
            }
        };
        Animator.prototype.__changeFinalValue = function (finalProps, trackKeys) {
            trackKeys = trackKeys || keys$1(finalProps);
            for (var i = 0; i < trackKeys.length; i++) {
                var propName = trackKeys[i];
                var track = this._tracks[propName];
                if (!track) {
                    continue;
                }
                var kfs = track.keyframes;
                if (kfs.length > 1) {
                    var lastKf = kfs.pop();
                    track.addKeyframe(lastKf.time, finalProps[propName]);
                    track.prepare(track.getAdditiveTrack());
                }
            }
        };
        return Animator;
    }());

    var Point = (function () {
        function Point(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }
        Point.prototype.copy = function (other) {
            this.x = other.x;
            this.y = other.y;
            return this;
        };
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        Point.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Point.prototype.equal = function (other) {
            return other.x === this.x && other.y === this.y;
        };
        Point.prototype.add = function (other) {
            this.x += other.x;
            this.y += other.y;
            return this;
        };
        Point.prototype.scale = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
        };
        Point.prototype.scaleAndAdd = function (other, scalar) {
            this.x += other.x * scalar;
            this.y += other.y * scalar;
        };
        Point.prototype.sub = function (other) {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        };
        Point.prototype.dot = function (other) {
            return this.x * other.x + this.y * other.y;
        };
        Point.prototype.len = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        Point.prototype.lenSquare = function () {
            return this.x * this.x + this.y * this.y;
        };
        Point.prototype.normalize = function () {
            var len = this.len();
            this.x /= len;
            this.y /= len;
            return this;
        };
        Point.prototype.distance = function (other) {
            var dx = this.x - other.x;
            var dy = this.y - other.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        Point.prototype.distanceSquare = function (other) {
            var dx = this.x - other.x;
            var dy = this.y - other.y;
            return dx * dx + dy * dy;
        };
        Point.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        Point.prototype.transform = function (m) {
            if (!m) {
                return;
            }
            var x = this.x;
            var y = this.y;
            this.x = m[0] * x + m[2] * y + m[4];
            this.y = m[1] * x + m[3] * y + m[5];
            return this;
        };
        Point.prototype.toArray = function (out) {
            out[0] = this.x;
            out[1] = this.y;
            return out;
        };
        Point.prototype.fromArray = function (input) {
            this.x = input[0];
            this.y = input[1];
        };
        Point.set = function (p, x, y) {
            p.x = x;
            p.y = y;
        };
        Point.copy = function (p, p2) {
            p.x = p2.x;
            p.y = p2.y;
        };
        Point.len = function (p) {
            return Math.sqrt(p.x * p.x + p.y * p.y);
        };
        Point.lenSquare = function (p) {
            return p.x * p.x + p.y * p.y;
        };
        Point.dot = function (p0, p1) {
            return p0.x * p1.x + p0.y * p1.y;
        };
        Point.add = function (out, p0, p1) {
            out.x = p0.x + p1.x;
            out.y = p0.y + p1.y;
        };
        Point.sub = function (out, p0, p1) {
            out.x = p0.x - p1.x;
            out.y = p0.y - p1.y;
        };
        Point.scale = function (out, p0, scalar) {
            out.x = p0.x * scalar;
            out.y = p0.y * scalar;
        };
        Point.scaleAndAdd = function (out, p0, p1, scalar) {
            out.x = p0.x + p1.x * scalar;
            out.y = p0.y + p1.y * scalar;
        };
        Point.lerp = function (out, p0, p1, t) {
            var onet = 1 - t;
            out.x = onet * p0.x + t * p1.x;
            out.y = onet * p0.y + t * p1.y;
        };
        return Point;
    }());

    var mathMin$3 = Math.min;
    var mathMax$3 = Math.max;
    var lt = new Point();
    var rb = new Point();
    var lb = new Point();
    var rt = new Point();
    var minTv$1 = new Point();
    var maxTv$1 = new Point();
    var BoundingRect = (function () {
        function BoundingRect(x, y, width, height) {
            if (width < 0) {
                x = x + width;
                width = -width;
            }
            if (height < 0) {
                y = y + height;
                height = -height;
            }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        BoundingRect.prototype.union = function (other) {
            var x = mathMin$3(other.x, this.x);
            var y = mathMin$3(other.y, this.y);
            if (isFinite(this.x) && isFinite(this.width)) {
                this.width = mathMax$3(other.x + other.width, this.x + this.width) - x;
            }
            else {
                this.width = other.width;
            }
            if (isFinite(this.y) && isFinite(this.height)) {
                this.height = mathMax$3(other.y + other.height, this.y + this.height) - y;
            }
            else {
                this.height = other.height;
            }
            this.x = x;
            this.y = y;
        };
        BoundingRect.prototype.applyTransform = function (m) {
            BoundingRect.applyTransform(this, this, m);
        };
        BoundingRect.prototype.calculateTransform = function (b) {
            var a = this;
            var sx = b.width / a.width;
            var sy = b.height / a.height;
            var m = create$1();
            translate(m, m, [-a.x, -a.y]);
            scale$1(m, m, [sx, sy]);
            translate(m, m, [b.x, b.y]);
            return m;
        };
        BoundingRect.prototype.intersect = function (b, mtv) {
            if (!b) {
                return false;
            }
            if (!(b instanceof BoundingRect)) {
                b = BoundingRect.create(b);
            }
            var a = this;
            var ax0 = a.x;
            var ax1 = a.x + a.width;
            var ay0 = a.y;
            var ay1 = a.y + a.height;
            var bx0 = b.x;
            var bx1 = b.x + b.width;
            var by0 = b.y;
            var by1 = b.y + b.height;
            var overlap = !(ax1 < bx0 || bx1 < ax0 || ay1 < by0 || by1 < ay0);
            if (mtv) {
                var dMin = Infinity;
                var dMax = 0;
                var d0 = Math.abs(ax1 - bx0);
                var d1 = Math.abs(bx1 - ax0);
                var d2 = Math.abs(ay1 - by0);
                var d3 = Math.abs(by1 - ay0);
                var dx = Math.min(d0, d1);
                var dy = Math.min(d2, d3);
                if (ax1 < bx0 || bx1 < ax0) {
                    if (dx > dMax) {
                        dMax = dx;
                        if (d0 < d1) {
                            Point.set(maxTv$1, -d0, 0);
                        }
                        else {
                            Point.set(maxTv$1, d1, 0);
                        }
                    }
                }
                else {
                    if (dx < dMin) {
                        dMin = dx;
                        if (d0 < d1) {
                            Point.set(minTv$1, d0, 0);
                        }
                        else {
                            Point.set(minTv$1, -d1, 0);
                        }
                    }
                }
                if (ay1 < by0 || by1 < ay0) {
                    if (dy > dMax) {
                        dMax = dy;
                        if (d2 < d3) {
                            Point.set(maxTv$1, 0, -d2);
                        }
                        else {
                            Point.set(maxTv$1, 0, d3);
                        }
                    }
                }
                else {
                    if (dx < dMin) {
                        dMin = dx;
                        if (d2 < d3) {
                            Point.set(minTv$1, 0, d2);
                        }
                        else {
                            Point.set(minTv$1, 0, -d3);
                        }
                    }
                }
            }
            if (mtv) {
                Point.copy(mtv, overlap ? minTv$1 : maxTv$1);
            }
            return overlap;
        };
        BoundingRect.prototype.contain = function (x, y) {
            var rect = this;
            return x >= rect.x
                && x <= (rect.x + rect.width)
                && y >= rect.y
                && y <= (rect.y + rect.height);
        };
        BoundingRect.prototype.clone = function () {
            return new BoundingRect(this.x, this.y, this.width, this.height);
        };
        BoundingRect.prototype.copy = function (other) {
            BoundingRect.copy(this, other);
        };
        BoundingRect.prototype.plain = function () {
            return {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height
            };
        };
        BoundingRect.prototype.isFinite = function () {
            return isFinite(this.x)
                && isFinite(this.y)
                && isFinite(this.width)
                && isFinite(this.height);
        };
        BoundingRect.prototype.isZero = function () {
            return this.width === 0 || this.height === 0;
        };
        BoundingRect.create = function (rect) {
            return new BoundingRect(rect.x, rect.y, rect.width, rect.height);
        };
        BoundingRect.copy = function (target, source) {
            target.x = source.x;
            target.y = source.y;
            target.width = source.width;
            target.height = source.height;
        };
        BoundingRect.applyTransform = function (target, source, m) {
            if (!m) {
                if (target !== source) {
                    BoundingRect.copy(target, source);
                }
                return;
            }
            if (m[1] < 1e-5 && m[1] > -1e-5 && m[2] < 1e-5 && m[2] > -1e-5) {
                var sx = m[0];
                var sy = m[3];
                var tx = m[4];
                var ty = m[5];
                target.x = source.x * sx + tx;
                target.y = source.y * sy + ty;
                target.width = source.width * sx;
                target.height = source.height * sy;
                if (target.width < 0) {
                    target.x += target.width;
                    target.width = -target.width;
                }
                if (target.height < 0) {
                    target.y += target.height;
                    target.height = -target.height;
                }
                return;
            }
            lt.x = lb.x = source.x;
            lt.y = rt.y = source.y;
            rb.x = rt.x = source.x + source.width;
            rb.y = lb.y = source.y + source.height;
            lt.transform(m);
            rt.transform(m);
            rb.transform(m);
            lb.transform(m);
            target.x = mathMin$3(lt.x, rb.x, lb.x, rt.x);
            target.y = mathMin$3(lt.y, rb.y, lb.y, rt.y);
            var maxX = mathMax$3(lt.x, rb.x, lb.x, rt.x);
            var maxY = mathMax$3(lt.y, rb.y, lb.y, rt.y);
            target.width = maxX - target.x;
            target.height = maxY - target.y;
        };
        return BoundingRect;
    }());

    var textWidthCache = {};
    var DEFAULT_FONT = '12px sans-serif';
    var _ctx;
    var _cachedFont;
    function defaultMeasureText(text, font) {
        if (!_ctx) {
            _ctx = createCanvas$1().getContext('2d');
        }
        if (_cachedFont !== font) {
            _cachedFont = _ctx.font = font || DEFAULT_FONT;
        }
        return _ctx.measureText(text);
    }
    var methods = {
        measureText: defaultMeasureText
    };
    function getWidth(text, font) {
        font = font || DEFAULT_FONT;
        var cacheOfFont = textWidthCache[font];
        if (!cacheOfFont) {
            cacheOfFont = textWidthCache[font] = new LRU(500);
        }
        var width = cacheOfFont.get(text);
        if (width == null) {
            width = methods.measureText(text, font).width;
            cacheOfFont.put(text, width);
        }
        return width;
    }
    function innerGetBoundingRect(text, font, textAlign, textBaseline) {
        var width = getWidth(text, font);
        var height = getLineHeight(font);
        var x = adjustTextX(0, width, textAlign);
        var y = adjustTextY$1(0, height, textBaseline);
        var rect = new BoundingRect(x, y, width, height);
        return rect;
    }
    function getBoundingRect(text, font, textAlign, textBaseline) {
        var textLines = ((text || '') + '').split('\n');
        var len = textLines.length;
        if (len === 1) {
            return innerGetBoundingRect(textLines[0], font, textAlign, textBaseline);
        }
        else {
            var uniondRect = new BoundingRect(0, 0, 0, 0);
            for (var i = 0; i < textLines.length; i++) {
                var rect = innerGetBoundingRect(textLines[i], font, textAlign, textBaseline);
                i === 0 ? uniondRect.copy(rect) : uniondRect.union(rect);
            }
            return uniondRect;
        }
    }
    function adjustTextX(x, width, textAlign) {
        if (textAlign === 'right') {
            x -= width;
        }
        else if (textAlign === 'center') {
            x -= width / 2;
        }
        return x;
    }
    function adjustTextY$1(y, height, verticalAlign) {
        if (verticalAlign === 'middle') {
            y -= height / 2;
        }
        else if (verticalAlign === 'bottom') {
            y -= height;
        }
        return y;
    }
    function getLineHeight(font) {
        return getWidth('国', font);
    }
    function parsePercent(value, maxValue) {
        if (typeof value === 'string') {
            if (value.lastIndexOf('%') >= 0) {
                return parseFloat(value) / 100 * maxValue;
            }
            return parseFloat(value);
        }
        return value;
    }
    function calculateTextPosition(out, opts, rect) {
        var textPosition = opts.position || 'inside';
        var distance = opts.distance != null ? opts.distance : 5;
        var height = rect.height;
        var width = rect.width;
        var halfHeight = height / 2;
        var x = rect.x;
        var y = rect.y;
        var textAlign = 'left';
        var textVerticalAlign = 'top';
        if (textPosition instanceof Array) {
            x += parsePercent(textPosition[0], rect.width);
            y += parsePercent(textPosition[1], rect.height);
            textAlign = null;
            textVerticalAlign = null;
        }
        else {
            switch (textPosition) {
                case 'left':
                    x -= distance;
                    y += halfHeight;
                    textAlign = 'right';
                    textVerticalAlign = 'middle';
                    break;
                case 'right':
                    x += distance + width;
                    y += halfHeight;
                    textVerticalAlign = 'middle';
                    break;
                case 'top':
                    x += width / 2;
                    y -= distance;
                    textAlign = 'center';
                    textVerticalAlign = 'bottom';
                    break;
                case 'bottom':
                    x += width / 2;
                    y += height + distance;
                    textAlign = 'center';
                    break;
                case 'inside':
                    x += width / 2;
                    y += halfHeight;
                    textAlign = 'center';
                    textVerticalAlign = 'middle';
                    break;
                case 'insideLeft':
                    x += distance;
                    y += halfHeight;
                    textVerticalAlign = 'middle';
                    break;
                case 'insideRight':
                    x += width - distance;
                    y += halfHeight;
                    textAlign = 'right';
                    textVerticalAlign = 'middle';
                    break;
                case 'insideTop':
                    x += width / 2;
                    y += distance;
                    textAlign = 'center';
                    break;
                case 'insideBottom':
                    x += width / 2;
                    y += height - distance;
                    textAlign = 'center';
                    textVerticalAlign = 'bottom';
                    break;
                case 'insideTopLeft':
                    x += distance;
                    y += distance;
                    break;
                case 'insideTopRight':
                    x += width - distance;
                    y += distance;
                    textAlign = 'right';
                    break;
                case 'insideBottomLeft':
                    x += distance;
                    y += height - distance;
                    textVerticalAlign = 'bottom';
                    break;
                case 'insideBottomRight':
                    x += width - distance;
                    y += height - distance;
                    textAlign = 'right';
                    textVerticalAlign = 'bottom';
                    break;
            }
        }
        out = out || {};
        out.x = x;
        out.y = y;
        out.align = textAlign;
        out.verticalAlign = textVerticalAlign;
        return out;
    }

    var Browser = (function () {
        function Browser() {
            this.firefox = false;
            this.ie = false;
            this.edge = false;
            this.newEdge = false;
            this.weChat = false;
        }
        return Browser;
    }());
    var Env = (function () {
        function Env() {
            this.browser = new Browser();
            this.node = false;
            this.wxa = false;
            this.worker = false;
            this.canvasSupported = false;
            this.svgSupported = false;
            this.touchEventsSupported = false;
            this.pointerEventsSupported = false;
            this.domSupported = false;
            this.transformSupported = false;
            this.transform3dSupported = false;
        }
        return Env;
    }());
    var env = new Env();
    if (typeof wx === 'object' && typeof wx.getSystemInfoSync === 'function') {
        env.wxa = true;
        env.canvasSupported = true;
        env.touchEventsSupported = true;
    }
    else if (typeof document === 'undefined' && typeof self !== 'undefined') {
        env.worker = true;
        env.canvasSupported = true;
    }
    else if (typeof navigator === 'undefined') {
        env.node = true;
        env.canvasSupported = true;
        env.svgSupported = true;
    }
    else {
        detect(navigator.userAgent, env);
    }
    function detect(ua, env) {
        var browser = env.browser;
        var firefox = ua.match(/Firefox\/([\d.]+)/);
        var ie = ua.match(/MSIE\s([\d.]+)/)
            || ua.match(/Trident\/.+?rv:(([\d.]+))/);
        var edge = ua.match(/Edge?\/([\d.]+)/);
        var weChat = (/micromessenger/i).test(ua);
        if (firefox) {
            browser.firefox = true;
            browser.version = firefox[1];
        }
        if (ie) {
            browser.ie = true;
            browser.version = ie[1];
        }
        if (edge) {
            browser.edge = true;
            browser.version = edge[1];
            browser.newEdge = +edge[1].split('.')[0] > 18;
        }
        if (weChat) {
            browser.weChat = true;
        }
        env.canvasSupported = !!document.createElement('canvas').getContext;
        env.svgSupported = typeof SVGRect !== 'undefined';
        env.touchEventsSupported = 'ontouchstart' in window && !browser.ie && !browser.edge;
        env.pointerEventsSupported = 'onpointerdown' in window
            && (browser.edge || (browser.ie && +browser.version >= 11));
        env.domSupported = typeof document !== 'undefined';
        var style = document.documentElement.style;
        env.transform3dSupported = ((browser.ie && 'transition' in style)
            || browser.edge
            || (('WebKitCSSMatrix' in window) && ('m11' in new WebKitCSSMatrix()))
            || 'MozPerspective' in style)
            && !('OTransition' in style);
        env.transformSupported = env.transform3dSupported
            || (browser.ie && +browser.version >= 9);
    }

    var REDARAW_BIT = 1;
    var STYLE_CHANGED_BIT = 2;
    var SHAPE_CHANGED_BIT = 4;

    var PRESERVED_NORMAL_STATE = '__zr_normal__';
    var PRIMARY_STATES_KEYS$1 = ['x', 'y', 'scaleX', 'scaleY', 'originX', 'originY', 'rotation', 'ignore'];
    var DEFAULT_ANIMATABLE_MAP = {
        x: true,
        y: true,
        scaleX: true,
        scaleY: true,
        originX: true,
        originY: true,
        rotation: true,
        ignore: false
    };
    var tmpTextPosCalcRes = {};
    var tmpBoundingRect = new BoundingRect(0, 0, 0, 0);
    var Element = (function () {
        function Element(props) {
            this.id = guid();
            this.animators = [];
            this.currentStates = [];
            this.states = {};
            this._init(props);
        }
        Element.prototype._init = function (props) {
            this.attr(props);
        };
        Element.prototype.drift = function (dx, dy, e) {
            switch (this.draggable) {
                case 'horizontal':
                    dy = 0;
                    break;
                case 'vertical':
                    dx = 0;
                    break;
            }
            var m = this.transform;
            if (!m) {
                m = this.transform = [1, 0, 0, 1, 0, 0];
            }
            m[4] += dx;
            m[5] += dy;
            this.decomposeTransform();
            this.markRedraw();
        };
        Element.prototype.beforeUpdate = function () { };
        Element.prototype.afterUpdate = function () { };
        Element.prototype.update = function () {
            this.updateTransform();
            if (this.__dirty) {
                this.updateInnerText();
            }
        };
        Element.prototype.updateInnerText = function (forceUpdate) {
            var textEl = this._textContent;
            if (textEl && (!textEl.ignore || forceUpdate)) {
                if (!this.textConfig) {
                    this.textConfig = {};
                }
                var textConfig = this.textConfig;
                var isLocal = textConfig.local;
                var attachedTransform = textEl.attachedTransform;
                var textAlign = void 0;
                var textVerticalAlign = void 0;
                var textStyleChanged = false;
                if (isLocal) {
                    attachedTransform.parent = this;
                }
                else {
                    attachedTransform.parent = null;
                }
                var innerOrigin = false;
                attachedTransform.x = textEl.x;
                attachedTransform.y = textEl.y;
                attachedTransform.originX = textEl.originX;
                attachedTransform.originY = textEl.originY;
                attachedTransform.rotation = textEl.rotation;
                attachedTransform.scaleX = textEl.scaleX;
                attachedTransform.scaleY = textEl.scaleY;
                if (textConfig.position != null) {
                    var layoutRect = tmpBoundingRect;
                    if (textConfig.layoutRect) {
                        layoutRect.copy(textConfig.layoutRect);
                    }
                    else {
                        layoutRect.copy(this.getBoundingRect());
                    }
                    if (!isLocal) {
                        layoutRect.applyTransform(this.transform);
                    }
                    if (this.calculateTextPosition) {
                        this.calculateTextPosition(tmpTextPosCalcRes, textConfig, layoutRect);
                    }
                    else {
                        calculateTextPosition(tmpTextPosCalcRes, textConfig, layoutRect);
                    }
                    attachedTransform.x = tmpTextPosCalcRes.x;
                    attachedTransform.y = tmpTextPosCalcRes.y;
                    textAlign = tmpTextPosCalcRes.align;
                    textVerticalAlign = tmpTextPosCalcRes.verticalAlign;
                    var textOrigin = textConfig.origin;
                    if (textOrigin && textConfig.rotation != null) {
                        var relOriginX = void 0;
                        var relOriginY = void 0;
                        if (textOrigin === 'center') {
                            relOriginX = layoutRect.width * 0.5;
                            relOriginY = layoutRect.height * 0.5;
                        }
                        else {
                            relOriginX = parsePercent(textOrigin[0], layoutRect.width);
                            relOriginY = parsePercent(textOrigin[1], layoutRect.height);
                        }
                        innerOrigin = true;
                        attachedTransform.originX = -attachedTransform.x + relOriginX + (isLocal ? 0 : layoutRect.x);
                        attachedTransform.originY = -attachedTransform.y + relOriginY + (isLocal ? 0 : layoutRect.y);
                    }
                }
                if (textConfig.rotation != null) {
                    attachedTransform.rotation = textConfig.rotation;
                }
                var textOffset = textConfig.offset;
                if (textOffset) {
                    attachedTransform.x += textOffset[0];
                    attachedTransform.y += textOffset[1];
                    if (!innerOrigin) {
                        attachedTransform.originX = -textOffset[0];
                        attachedTransform.originY = -textOffset[1];
                    }
                }
                var isInside = textConfig.inside == null
                    ? (typeof textConfig.position === 'string' && textConfig.position.indexOf('inside') >= 0)
                    : textConfig.inside;
                var innerTextDefaultStyle = this._innerTextDefaultStyle || (this._innerTextDefaultStyle = {});
                var textFill = void 0;
                var textStroke = void 0;
                var autoStroke = void 0;
                if (isInside && this.canBeInsideText()) {
                    textFill = textConfig.insideFill;
                    textStroke = textConfig.insideStroke;
                    if (textFill == null || textFill === 'auto') {
                        textFill = this.getInsideTextFill();
                    }
                    if (textStroke == null || textStroke === 'auto') {
                        textStroke = this.getInsideTextStroke(textFill);
                        autoStroke = true;
                    }
                }
                else {
                    textFill = textConfig.outsideFill;
                    textStroke = textConfig.outsideStroke;
                    if (textFill == null || textFill === 'auto') {
                        textFill = this.getOutsideFill();
                    }
                    if (textStroke == null || textStroke === 'auto') {
                        textStroke = this.getOutsideStroke(textFill);
                        autoStroke = true;
                    }
                }
                textFill = textFill || '#000';
                if (textFill !== innerTextDefaultStyle.fill
                    || textStroke !== innerTextDefaultStyle.stroke
                    || autoStroke !== innerTextDefaultStyle.autoStroke
                    || textAlign !== innerTextDefaultStyle.align
                    || textVerticalAlign !== innerTextDefaultStyle.verticalAlign) {
                    textStyleChanged = true;
                    innerTextDefaultStyle.fill = textFill;
                    innerTextDefaultStyle.stroke = textStroke;
                    innerTextDefaultStyle.autoStroke = autoStroke;
                    innerTextDefaultStyle.align = textAlign;
                    innerTextDefaultStyle.verticalAlign = textVerticalAlign;
                    textEl.setDefaultTextStyle(innerTextDefaultStyle);
                }
                textEl.__dirty |= REDARAW_BIT;
                if (textStyleChanged) {
                    textEl.dirtyStyle(true);
                }
            }
        };
        Element.prototype.canBeInsideText = function () {
            return true;
        };
        Element.prototype.getInsideTextFill = function () {
            return '#fff';
        };
        Element.prototype.getInsideTextStroke = function (textFill) {
            return '#000';
        };
        Element.prototype.getOutsideFill = function () {
            return this.__zr && this.__zr.isDarkMode() ? LIGHT_LABEL_COLOR : DARK_LABEL_COLOR;
        };
        Element.prototype.getOutsideStroke = function (textFill) {
            var backgroundColor = this.__zr && this.__zr.getBackgroundColor();
            var colorArr = typeof backgroundColor === 'string' && parse(backgroundColor);
            if (!colorArr) {
                colorArr = [255, 255, 255, 1];
            }
            var alpha = colorArr[3];
            var isDark = this.__zr.isDarkMode();
            for (var i = 0; i < 3; i++) {
                colorArr[i] = colorArr[i] * alpha + (isDark ? 0 : 255) * (1 - alpha);
            }
            colorArr[3] = 1;
            return stringify(colorArr, 'rgba');
        };
        Element.prototype.traverse = function (cb, context) { };
        Element.prototype.attrKV = function (key, value) {
            if (key === 'textConfig') {
                this.setTextConfig(value);
            }
            else if (key === 'textContent') {
                this.setTextContent(value);
            }
            else if (key === 'clipPath') {
                this.setClipPath(value);
            }
            else if (key === 'extra') {
                this.extra = this.extra || {};
                extend(this.extra, value);
            }
            else {
                this[key] = value;
            }
        };
        Element.prototype.hide = function () {
            this.ignore = true;
            this.markRedraw();
        };
        Element.prototype.show = function () {
            this.ignore = false;
            this.markRedraw();
        };
        Element.prototype.attr = function (keyOrObj, value) {
            if (typeof keyOrObj === 'string') {
                this.attrKV(keyOrObj, value);
            }
            else if (isObject$1(keyOrObj)) {
                var obj = keyOrObj;
                var keysArr = keys$1(obj);
                for (var i = 0; i < keysArr.length; i++) {
                    var key = keysArr[i];
                    this.attrKV(key, keyOrObj[key]);
                }
            }
            this.markRedraw();
            return this;
        };
        Element.prototype.saveCurrentToNormalState = function (toState) {
            this._innerSaveToNormal(toState);
            var normalState = this._normalState;
            for (var i = 0; i < this.animators.length; i++) {
                var animator = this.animators[i];
                var fromStateTransition = animator.__fromStateTransition;
                if (fromStateTransition && fromStateTransition !== PRESERVED_NORMAL_STATE) {
                    continue;
                }
                var targetName = animator.targetName;
                var target = targetName
                    ? normalState[targetName] : normalState;
                animator.saveFinalToTarget(target);
            }
        };
        Element.prototype._innerSaveToNormal = function (toState) {
            var normalState = this._normalState;
            if (!normalState) {
                normalState = this._normalState = {};
            }
            if (toState.textConfig && !normalState.textConfig) {
                normalState.textConfig = this.textConfig;
            }
            this._savePrimaryToNormal(toState, normalState, PRIMARY_STATES_KEYS$1);
        };
        Element.prototype._savePrimaryToNormal = function (toState, normalState, primaryKeys) {
            for (var i = 0; i < primaryKeys.length; i++) {
                var key = primaryKeys[i];
                if (toState[key] != null && !(key in normalState)) {
                    normalState[key] = this[key];
                }
            }
        };
        Element.prototype.hasState = function () {
            return this.currentStates.length > 0;
        };
        Element.prototype.getState = function (name) {
            return this.states[name];
        };
        Element.prototype.ensureState = function (name) {
            var states = this.states;
            if (!states[name]) {
                states[name] = {};
            }
            return states[name];
        };
        Element.prototype.clearStates = function (noAnimation) {
            this.useState(PRESERVED_NORMAL_STATE, false, noAnimation);
        };
        Element.prototype.useState = function (stateName, keepCurrentStates, noAnimation, forceUseHoverLayer) {
            var toNormalState = stateName === PRESERVED_NORMAL_STATE;
            var hasStates = this.hasState();
            if (!hasStates && toNormalState) {
                return;
            }
            var currentStates = this.currentStates;
            var animationCfg = this.stateTransition;
            if (indexOf(currentStates, stateName) >= 0 && (keepCurrentStates || currentStates.length === 1)) {
                return;
            }
            var state;
            if (this.stateProxy && !toNormalState) {
                state = this.stateProxy(stateName);
            }
            if (!state) {
                state = (this.states && this.states[stateName]);
            }
            if (!state && !toNormalState) {
                logError("State " + stateName + " not exists.");
                return;
            }
            if (!toNormalState) {
                this.saveCurrentToNormalState(state);
            }
            var useHoverLayer = !!((state && state.hoverLayer) || forceUseHoverLayer);
            if (useHoverLayer) {
                this._toggleHoverLayerFlag(true);
            }
            this._applyStateObj(stateName, state, this._normalState, keepCurrentStates, !noAnimation && !this.__inHover && animationCfg && animationCfg.duration > 0, animationCfg);
            var textContent = this._textContent;
            var textGuide = this._textGuide;
            if (textContent) {
                textContent.useState(stateName, keepCurrentStates, noAnimation, useHoverLayer);
            }
            if (textGuide) {
                textGuide.useState(stateName, keepCurrentStates, noAnimation, useHoverLayer);
            }
            if (toNormalState) {
                this.currentStates = [];
                this._normalState = {};
            }
            else {
                if (!keepCurrentStates) {
                    this.currentStates = [stateName];
                }
                else {
                    this.currentStates.push(stateName);
                }
            }
            this._updateAnimationTargets();
            this.markRedraw();
            if (!useHoverLayer && this.__inHover) {
                this._toggleHoverLayerFlag(false);
                this.__dirty &= ~REDARAW_BIT;
            }
            return state;
        };
        Element.prototype.useStates = function (states, noAnimation, forceUseHoverLayer) {
            if (!states.length) {
                this.clearStates();
            }
            else {
                var stateObjects = [];
                var currentStates = this.currentStates;
                var len = states.length;
                var notChange = len === currentStates.length;
                if (notChange) {
                    for (var i = 0; i < len; i++) {
                        if (states[i] !== currentStates[i]) {
                            notChange = false;
                            break;
                        }
                    }
                }
                if (notChange) {
                    return;
                }
                for (var i = 0; i < len; i++) {
                    var stateName = states[i];
                    var stateObj = void 0;
                    if (this.stateProxy) {
                        stateObj = this.stateProxy(stateName, states);
                    }
                    if (!stateObj) {
                        stateObj = this.states[stateName];
                    }
                    if (stateObj) {
                        stateObjects.push(stateObj);
                    }
                }
                var lastStateObj = stateObjects[len - 1];
                var useHoverLayer = !!((lastStateObj && lastStateObj.hoverLayer) || forceUseHoverLayer);
                if (useHoverLayer) {
                    this._toggleHoverLayerFlag(true);
                }
                var mergedState = this._mergeStates(stateObjects);
                var animationCfg = this.stateTransition;
                this.saveCurrentToNormalState(mergedState);
                this._applyStateObj(states.join(','), mergedState, this._normalState, false, !noAnimation && !this.__inHover && animationCfg && animationCfg.duration > 0, animationCfg);
                var textContent = this._textContent;
                var textGuide = this._textGuide;
                if (textContent) {
                    textContent.useStates(states, noAnimation, useHoverLayer);
                }
                if (textGuide) {
                    textGuide.useStates(states, noAnimation, useHoverLayer);
                }
                this._updateAnimationTargets();
                this.currentStates = states.slice();
                this.markRedraw();
                if (!useHoverLayer && this.__inHover) {
                    this._toggleHoverLayerFlag(false);
                    this.__dirty &= ~REDARAW_BIT;
                }
            }
        };
        Element.prototype._updateAnimationTargets = function () {
            for (var i = 0; i < this.animators.length; i++) {
                var animator = this.animators[i];
                if (animator.targetName) {
                    animator.changeTarget(this[animator.targetName]);
                }
            }
        };
        Element.prototype.removeState = function (state) {
            var idx = indexOf(this.currentStates, state);
            if (idx >= 0) {
                var currentStates = this.currentStates.slice();
                currentStates.splice(idx, 1);
                this.useStates(currentStates);
            }
        };
        Element.prototype.replaceState = function (oldState, newState, forceAdd) {
            var currentStates = this.currentStates.slice();
            var idx = indexOf(currentStates, oldState);
            var newStateExists = indexOf(currentStates, newState) >= 0;
            if (idx >= 0) {
                if (!newStateExists) {
                    currentStates[idx] = newState;
                }
                else {
                    currentStates.splice(idx, 1);
                }
            }
            else if (forceAdd && !newStateExists) {
                currentStates.push(newState);
            }
            this.useStates(currentStates);
        };
        Element.prototype.toggleState = function (state, enable) {
            if (enable) {
                this.useState(state, true);
            }
            else {
                this.removeState(state);
            }
        };
        Element.prototype._mergeStates = function (states) {
            var mergedState = {};
            var mergedTextConfig;
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                extend(mergedState, state);
                if (state.textConfig) {
                    mergedTextConfig = mergedTextConfig || {};
                    extend(mergedTextConfig, state.textConfig);
                }
            }
            if (mergedTextConfig) {
                mergedState.textConfig = mergedTextConfig;
            }
            return mergedState;
        };
        Element.prototype._applyStateObj = function (stateName, state, normalState, keepCurrentStates, transition, animationCfg) {
            var needsRestoreToNormal = !(state && keepCurrentStates);
            if (state && state.textConfig) {
                this.textConfig = extend({}, keepCurrentStates ? this.textConfig : normalState.textConfig);
                extend(this.textConfig, state.textConfig);
            }
            else if (needsRestoreToNormal) {
                if (normalState.textConfig) {
                    this.textConfig = normalState.textConfig;
                }
            }
            var transitionTarget = {};
            var hasTransition = false;
            for (var i = 0; i < PRIMARY_STATES_KEYS$1.length; i++) {
                var key = PRIMARY_STATES_KEYS$1[i];
                var propNeedsTransition = transition && DEFAULT_ANIMATABLE_MAP[key];
                if (state && state[key] != null) {
                    if (propNeedsTransition) {
                        hasTransition = true;
                        transitionTarget[key] = state[key];
                    }
                    else {
                        this[key] = state[key];
                    }
                }
                else if (needsRestoreToNormal) {
                    if (normalState[key] != null) {
                        if (propNeedsTransition) {
                            hasTransition = true;
                            transitionTarget[key] = normalState[key];
                        }
                        else {
                            this[key] = normalState[key];
                        }
                    }
                }
            }
            if (!transition) {
                for (var i = 0; i < this.animators.length; i++) {
                    var animator = this.animators[i];
                    var targetName = animator.targetName;
                    animator.__changeFinalValue(targetName
                        ? (state || normalState)[targetName]
                        : (state || normalState));
                }
            }
            if (hasTransition) {
                this._transitionState(stateName, transitionTarget, animationCfg);
            }
        };
        Element.prototype._attachComponent = function (componentEl) {
            if (componentEl.__zr && !componentEl.__hostTarget) {
                throw new Error('Text element has been added to zrender.');
            }
            if (componentEl === this) {
                throw new Error('Recursive component attachment.');
            }
            var zr = this.__zr;
            if (zr) {
                componentEl.addSelfToZr(zr);
            }
            componentEl.__zr = zr;
            componentEl.__hostTarget = this;
        };
        Element.prototype._detachComponent = function (componentEl) {
            if (componentEl.__zr) {
                componentEl.removeSelfFromZr(componentEl.__zr);
            }
            componentEl.__zr = null;
            componentEl.__hostTarget = null;
        };
        Element.prototype.getClipPath = function () {
            return this._clipPath;
        };
        Element.prototype.setClipPath = function (clipPath) {
            if (this._clipPath && this._clipPath !== clipPath) {
                this.removeClipPath();
            }
            this._attachComponent(clipPath);
            this._clipPath = clipPath;
            this.markRedraw();
        };
        Element.prototype.removeClipPath = function () {
            var clipPath = this._clipPath;
            if (clipPath) {
                this._detachComponent(clipPath);
                this._clipPath = null;
                this.markRedraw();
            }
        };
        Element.prototype.getTextContent = function () {
            return this._textContent;
        };
        Element.prototype.setTextContent = function (textEl) {
            var previousTextContent = this._textContent;
            if (previousTextContent === textEl) {
                return;
            }
            if (previousTextContent && previousTextContent !== textEl) {
                this.removeTextContent();
            }
            if (textEl.__zr && !textEl.__hostTarget) {
                throw new Error('Text element has been added to zrender.');
            }
            textEl.attachedTransform = new Transformable();
            this._attachComponent(textEl);
            this._textContent = textEl;
            this.markRedraw();
        };
        Element.prototype.setTextConfig = function (cfg) {
            if (!this.textConfig) {
                this.textConfig = {};
            }
            extend(this.textConfig, cfg);
            this.markRedraw();
        };
        Element.prototype.removeTextConfig = function () {
            this.textConfig = null;
            this.markRedraw();
        };
        Element.prototype.removeTextContent = function () {
            var textEl = this._textContent;
            if (textEl) {
                textEl.attachedTransform = null;
                this._detachComponent(textEl);
                this._textContent = null;
                this._innerTextDefaultStyle = null;
                this.markRedraw();
            }
        };
        Element.prototype.getTextGuideLine = function () {
            return this._textGuide;
        };
        Element.prototype.setTextGuideLine = function (guideLine) {
            if (this._textGuide && this._textGuide !== guideLine) {
                this.removeTextGuideLine();
            }
            this._attachComponent(guideLine);
            this._textGuide = guideLine;
            this.markRedraw();
        };
        Element.prototype.removeTextGuideLine = function () {
            var textGuide = this._textGuide;
            if (textGuide) {
                this._detachComponent(textGuide);
                this._textGuide = null;
                this.markRedraw();
            }
        };
        Element.prototype.markRedraw = function () {
            this.__dirty |= REDARAW_BIT;
            var zr = this.__zr;
            if (zr) {
                if (this.__inHover) {
                    zr.refreshHover();
                }
                else {
                    zr.refresh();
                }
            }
            if (this.__hostTarget) {
                this.__hostTarget.markRedraw();
            }
        };
        Element.prototype.dirty = function () {
            this.markRedraw();
        };
        Element.prototype._toggleHoverLayerFlag = function (inHover) {
            this.__inHover = inHover;
            var textContent = this._textContent;
            var textGuide = this._textGuide;
            if (textContent) {
                textContent.__inHover = inHover;
            }
            if (textGuide) {
                textGuide.__inHover = inHover;
            }
        };
        Element.prototype.addSelfToZr = function (zr) {
            this.__zr = zr;
            var animators = this.animators;
            if (animators) {
                for (var i = 0; i < animators.length; i++) {
                    zr.animation.addAnimator(animators[i]);
                }
            }
            if (this._clipPath) {
                this._clipPath.addSelfToZr(zr);
            }
            if (this._textContent) {
                this._textContent.addSelfToZr(zr);
            }
            if (this._textGuide) {
                this._textGuide.addSelfToZr(zr);
            }
        };
        Element.prototype.removeSelfFromZr = function (zr) {
            this.__zr = null;
            var animators = this.animators;
            if (animators) {
                for (var i = 0; i < animators.length; i++) {
                    zr.animation.removeAnimator(animators[i]);
                }
            }
            if (this._clipPath) {
                this._clipPath.removeSelfFromZr(zr);
            }
            if (this._textContent) {
                this._textContent.removeSelfFromZr(zr);
            }
            if (this._textGuide) {
                this._textGuide.removeSelfFromZr(zr);
            }
        };
        Element.prototype.animate = function (key, loop) {
            var target = key ? this[key] : this;
            if (!target) {
                logError('Property "'
                    + key
                    + '" is not existed in element '
                    + this.id);
                return;
            }
            var animator = new Animator(target, loop);
            this.addAnimator(animator, key);
            return animator;
        };
        Element.prototype.addAnimator = function (animator, key) {
            var zr = this.__zr;
            var el = this;
            animator.during(function () {
                el.updateDuringAnimation(key);
            }).done(function () {
                var animators = el.animators;
                var idx = indexOf(animators, animator);
                if (idx >= 0) {
                    animators.splice(idx, 1);
                }
            });
            this.animators.push(animator);
            if (zr) {
                zr.animation.addAnimator(animator);
            }
            zr && zr.wakeUp();
        };
        Element.prototype.updateDuringAnimation = function (key) {
            this.markRedraw();
        };
        Element.prototype.stopAnimation = function (scope, forwardToLast) {
            var animators = this.animators;
            var len = animators.length;
            var leftAnimators = [];
            for (var i = 0; i < len; i++) {
                var animator = animators[i];
                if (!scope || scope === animator.scope) {
                    animator.stop(forwardToLast);
                }
                else {
                    leftAnimators.push(animator);
                }
            }
            this.animators = leftAnimators;
            return this;
        };
        Element.prototype.animateTo = function (target, cfg, animationProps) {
            animateTo(this, target, cfg, animationProps);
        };
        Element.prototype.animateFrom = function (target, cfg, animationProps) {
            animateTo(this, target, cfg, animationProps, true);
        };
        Element.prototype._transitionState = function (stateName, target, cfg, animationProps) {
            var animators = animateTo(this, target, cfg, animationProps);
            for (var i = 0; i < animators.length; i++) {
                animators[i].__fromStateTransition = stateName;
            }
        };
        Element.prototype.getBoundingRect = function () {
            return null;
        };
        Element.prototype.getPaintRect = function () {
            return null;
        };
        Element.initDefaultProps = (function () {
            var elProto = Element.prototype;
            elProto.type = 'element';
            elProto.name = '';
            elProto.ignore = false;
            elProto.silent = false;
            elProto.isGroup = false;
            elProto.draggable = false;
            elProto.dragging = false;
            elProto.ignoreClip = false;
            elProto.__inHover = false;
            elProto.__dirty = REDARAW_BIT;
            var logs = {};
            function logDeprecatedError(key, xKey, yKey) {
                if (!logs[key + xKey + yKey]) {
                    console.warn("DEPRECATED: '" + key + "' has been deprecated. use '" + xKey + "', '" + yKey + "' instead");
                    logs[key + xKey + yKey] = true;
                }
            }
            function createLegacyProperty(key, privateKey, xKey, yKey) {
                Object.defineProperty(elProto, key, {
                    get: function () {
                        logDeprecatedError(key, xKey, yKey);
                        if (!this[privateKey]) {
                            var pos = this[privateKey] = [];
                            enhanceArray(this, pos);
                        }
                        return this[privateKey];
                    },
                    set: function (pos) {
                        logDeprecatedError(key, xKey, yKey);
                        this[xKey] = pos[0];
                        this[yKey] = pos[1];
                        this[privateKey] = pos;
                        enhanceArray(this, pos);
                    }
                });
                function enhanceArray(self, pos) {
                    Object.defineProperty(pos, 0, {
                        get: function () {
                            return self[xKey];
                        },
                        set: function (val) {
                            self[xKey] = val;
                        }
                    });
                    Object.defineProperty(pos, 1, {
                        get: function () {
                            return self[yKey];
                        },
                        set: function (val) {
                            self[yKey] = val;
                        }
                    });
                }
            }
            if (Object.defineProperty && (!env.browser.ie || env.browser.version > 8)) {
                createLegacyProperty('position', '_legacyPos', 'x', 'y');
                createLegacyProperty('scale', '_legacyScale', 'scaleX', 'scaleY');
                createLegacyProperty('origin', '_legacyOrigin', 'originX', 'originY');
            }
        })();
        return Element;
    }());
    mixin(Element, Eventful);
    mixin(Element, Transformable);
    function animateTo(animatable, target, cfg, animationProps, reverse) {
        cfg = cfg || {};
        var animators = [];
        animateToShallow(animatable, '', animatable, target, cfg, animationProps, animators, reverse);
        var finishCount = animators.length;
        var doneHappened = false;
        var cfgDone = cfg.done;
        var cfgAborted = cfg.aborted;
        var doneCb = function () {
            doneHappened = true;
            finishCount--;
            if (finishCount <= 0) {
                doneHappened
                    ? (cfgDone && cfgDone())
                    : (cfgAborted && cfgAborted());
            }
        };
        var abortedCb = function () {
            finishCount--;
            if (finishCount <= 0) {
                doneHappened
                    ? (cfgDone && cfgDone())
                    : (cfgAborted && cfgAborted());
            }
        };
        if (!finishCount) {
            cfgDone && cfgDone();
        }
        if (animators.length > 0 && cfg.during) {
            animators[0].during(function (target, percent) {
                cfg.during(percent);
            });
        }
        for (var i = 0; i < animators.length; i++) {
            var animator = animators[i];
            if (doneCb) {
                animator.done(doneCb);
            }
            if (abortedCb) {
                animator.aborted(abortedCb);
            }
            animator.start(cfg.easing, cfg.force);
        }
        return animators;
    }
    function copyArrShallow(source, target, len) {
        for (var i = 0; i < len; i++) {
            source[i] = target[i];
        }
    }
    function is2DArray(value) {
        return isArrayLike$1(value[0]);
    }
    function copyValue(target, source, key) {
        if (isArrayLike$1(source[key])) {
            if (!isArrayLike$1(target[key])) {
                target[key] = [];
            }
            if (isTypedArray$1(source[key])) {
                var len = source[key].length;
                if (target[key].length !== len) {
                    target[key] = new (source[key].constructor)(len);
                    copyArrShallow(target[key], source[key], len);
                }
            }
            else {
                var sourceArr = source[key];
                var targetArr = target[key];
                var len0 = sourceArr.length;
                if (is2DArray(sourceArr)) {
                    var len1 = sourceArr[0].length;
                    for (var i = 0; i < len0; i++) {
                        if (!targetArr[i]) {
                            targetArr[i] = Array.prototype.slice.call(sourceArr[i]);
                        }
                        else {
                            copyArrShallow(targetArr[i], sourceArr[i], len1);
                        }
                    }
                }
                else {
                    copyArrShallow(targetArr, sourceArr, len0);
                }
                targetArr.length = sourceArr.length;
            }
        }
        else {
            target[key] = source[key];
        }
    }
    function animateToShallow(animatable, topKey, source, target, cfg, animationProps, animators, reverse) {
        var animatableKeys = [];
        var changedKeys = [];
        var targetKeys = keys$1(target);
        var duration = cfg.duration;
        var delay = cfg.delay;
        var additive = cfg.additive;
        var setToFinal = cfg.setToFinal;
        var animateAll = !isObject$1(animationProps);
        for (var k = 0; k < targetKeys.length; k++) {
            var innerKey = targetKeys[k];
            if (source[innerKey] != null
                && target[innerKey] != null
                && (animateAll || animationProps[innerKey])) {
                if (isObject$1(target[innerKey]) && !isArrayLike$1(target[innerKey])) {
                    if (topKey) {
                        if (!reverse) {
                            source[innerKey] = target[innerKey];
                            animatable.updateDuringAnimation(topKey);
                        }
                        continue;
                    }
                    animateToShallow(animatable, innerKey, source[innerKey], target[innerKey], cfg, animationProps && animationProps[innerKey], animators, reverse);
                }
                else {
                    animatableKeys.push(innerKey);
                    changedKeys.push(innerKey);
                }
            }
            else if (!reverse) {
                source[innerKey] = target[innerKey];
                animatable.updateDuringAnimation(topKey);
                changedKeys.push(innerKey);
            }
        }
        var keyLen = animatableKeys.length;
        if (keyLen > 0
            || (cfg.force && !animators.length)) {
            var existsAnimators = animatable.animators;
            var existsAnimatorsOnSameTarget = [];
            for (var i = 0; i < existsAnimators.length; i++) {
                if (existsAnimators[i].targetName === topKey) {
                    existsAnimatorsOnSameTarget.push(existsAnimators[i]);
                }
            }
            if (!additive && existsAnimatorsOnSameTarget.length) {
                for (var i = 0; i < existsAnimatorsOnSameTarget.length; i++) {
                    var allAborted = existsAnimatorsOnSameTarget[i].stopTracks(changedKeys);
                    if (allAborted) {
                        var idx = indexOf(existsAnimators, existsAnimatorsOnSameTarget[i]);
                        existsAnimators.splice(idx, 1);
                    }
                }
            }
            var revertedSource = void 0;
            var reversedTarget = void 0;
            var sourceClone = void 0;
            if (reverse) {
                reversedTarget = {};
                if (setToFinal) {
                    revertedSource = {};
                }
                for (var i = 0; i < keyLen; i++) {
                    var innerKey = animatableKeys[i];
                    reversedTarget[innerKey] = source[innerKey];
                    if (setToFinal) {
                        revertedSource[innerKey] = target[innerKey];
                    }
                    else {
                        source[innerKey] = target[innerKey];
                    }
                }
            }
            else if (setToFinal) {
                sourceClone = {};
                for (var i = 0; i < keyLen; i++) {
                    var innerKey = animatableKeys[i];
                    sourceClone[innerKey] = cloneValue(source[innerKey]);
                    copyValue(source, target, innerKey);
                }
            }
            var animator = new Animator(source, false, additive ? existsAnimatorsOnSameTarget : null);
            animator.targetName = topKey;
            if (cfg.scope) {
                animator.scope = cfg.scope;
            }
            if (setToFinal && revertedSource) {
                animator.whenWithKeys(0, revertedSource, animatableKeys);
            }
            if (sourceClone) {
                animator.whenWithKeys(0, sourceClone, animatableKeys);
            }
            animator.whenWithKeys(duration == null ? 500 : duration, reverse ? reversedTarget : target, animatableKeys).delay(delay || 0);
            animatable.addAnimator(animator, topKey);
            animators.push(animator);
        }
    }

    var STYLE_MAGIC_KEY = '__zr_style_' + Math.round((Math.random() * 10));
    var DEFAULT_COMMON_STYLE = {
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: '#000',
        opacity: 1,
        blend: 'source-over'
    };
    var DEFAULT_COMMON_ANIMATION_PROPS = {
        style: {
            shadowBlur: true,
            shadowOffsetX: true,
            shadowOffsetY: true,
            shadowColor: true,
            opacity: true
        }
    };
    DEFAULT_COMMON_STYLE[STYLE_MAGIC_KEY] = true;
    var PRIMARY_STATES_KEYS = ['z', 'z2', 'invisible'];
    var PRIMARY_STATES_KEYS_IN_HOVER_LAYER = ['invisible'];
    var Displayable = (function (_super) {
        __extends(Displayable, _super);
        function Displayable(props) {
            return _super.call(this, props) || this;
        }
        Displayable.prototype._init = function (props) {
            var keysArr = keys$1(props);
            for (var i = 0; i < keysArr.length; i++) {
                var key = keysArr[i];
                if (key === 'style') {
                    this.useStyle(props[key]);
                }
                else {
                    _super.prototype.attrKV.call(this, key, props[key]);
                }
            }
            if (!this.style) {
                this.useStyle({});
            }
        };
        Displayable.prototype.beforeBrush = function () { };
        Displayable.prototype.afterBrush = function () { };
        Displayable.prototype.innerBeforeBrush = function () { };
        Displayable.prototype.innerAfterBrush = function () { };
        Displayable.prototype.shouldBePainted = function (viewWidth, viewHeight, considerClipPath, considerAncestors) {
            var m = this.transform;
            if (this.ignore
                || this.invisible
                || this.style.opacity === 0
                || (this.culling
                    && isDisplayableCulled(this, viewWidth, viewHeight))
                || (m && !m[0] && !m[3])) {
                return false;
            }
            if (considerClipPath && this.__clipPaths) {
                for (var i = 0; i < this.__clipPaths.length; ++i) {
                    if (this.__clipPaths[i].isZeroArea()) {
                        return false;
                    }
                }
            }
            if (considerAncestors && this.parent) {
                var parent_1 = this.parent;
                while (parent_1) {
                    if (parent_1.ignore) {
                        return false;
                    }
                    parent_1 = parent_1.parent;
                }
            }
            return true;
        };
        Displayable.prototype.contain = function (x, y) {
            return this.rectContain(x, y);
        };
        Displayable.prototype.traverse = function (cb, context) {
            cb.call(context, this);
        };
        Displayable.prototype.rectContain = function (x, y) {
            var coord = this.transformCoordToLocal(x, y);
            var rect = this.getBoundingRect();
            return rect.contain(coord[0], coord[1]);
        };
        Displayable.prototype.getPaintRect = function () {
            var rect = this._paintRect;
            if (!this._paintRect || this.__dirty) {
                var transform = this.transform;
                var elRect = this.getBoundingRect();
                var style = this.style;
                var shadowSize = style.shadowBlur || 0;
                var shadowOffsetX = style.shadowOffsetX || 0;
                var shadowOffsetY = style.shadowOffsetY || 0;
                rect = this._paintRect || (this._paintRect = new BoundingRect(0, 0, 0, 0));
                if (transform) {
                    BoundingRect.applyTransform(rect, elRect, transform);
                }
                else {
                    rect.copy(elRect);
                }
                if (shadowSize || shadowOffsetX || shadowOffsetY) {
                    rect.width += shadowSize * 2 + Math.abs(shadowOffsetX);
                    rect.height += shadowSize * 2 + Math.abs(shadowOffsetY);
                    rect.x = Math.min(rect.x, rect.x + shadowOffsetX - shadowSize);
                    rect.y = Math.min(rect.y, rect.y + shadowOffsetY - shadowSize);
                }
                var tolerance = this.dirtyRectTolerance;
                if (!rect.isZero()) {
                    rect.x = Math.floor(rect.x - tolerance);
                    rect.y = Math.floor(rect.y - tolerance);
                    rect.width = Math.ceil(rect.width + 1 + tolerance * 2);
                    rect.height = Math.ceil(rect.height + 1 + tolerance * 2);
                }
            }
            return rect;
        };
        Displayable.prototype.setPrevPaintRect = function (paintRect) {
            if (paintRect) {
                this._prevPaintRect = this._prevPaintRect || new BoundingRect(0, 0, 0, 0);
                this._prevPaintRect.copy(paintRect);
            }
            else {
                this._prevPaintRect = null;
            }
        };
        Displayable.prototype.getPrevPaintRect = function () {
            return this._prevPaintRect;
        };
        Displayable.prototype.animateStyle = function (loop) {
            return this.animate('style', loop);
        };
        Displayable.prototype.updateDuringAnimation = function (targetKey) {
            if (targetKey === 'style') {
                this.dirtyStyle();
            }
            else {
                this.markRedraw();
            }
        };
        Displayable.prototype.attrKV = function (key, value) {
            if (key !== 'style') {
                _super.prototype.attrKV.call(this, key, value);
            }
            else {
                if (!this.style) {
                    this.useStyle(value);
                }
                else {
                    this.setStyle(value);
                }
            }
        };
        Displayable.prototype.setStyle = function (keyOrObj, value) {
            if (typeof keyOrObj === 'string') {
                this.style[keyOrObj] = value;
            }
            else {
                extend(this.style, keyOrObj);
            }
            this.dirtyStyle();
            return this;
        };
        Displayable.prototype.dirtyStyle = function (notRedraw) {
            if (!notRedraw) {
                this.markRedraw();
            }
            this.__dirty |= STYLE_CHANGED_BIT;
            if (this._rect) {
                this._rect = null;
            }
        };
        Displayable.prototype.dirty = function () {
            this.dirtyStyle();
        };
        Displayable.prototype.styleChanged = function () {
            return !!(this.__dirty & STYLE_CHANGED_BIT);
        };
        Displayable.prototype.styleUpdated = function () {
            this.__dirty &= ~STYLE_CHANGED_BIT;
        };
        Displayable.prototype.createStyle = function (obj) {
            return createObject(DEFAULT_COMMON_STYLE, obj);
        };
        Displayable.prototype.useStyle = function (obj) {
            if (!obj[STYLE_MAGIC_KEY]) {
                obj = this.createStyle(obj);
            }
            if (this.__inHover) {
                this.__hoverStyle = obj;
            }
            else {
                this.style = obj;
            }
            this.dirtyStyle();
        };
        Displayable.prototype.isStyleObject = function (obj) {
            return obj[STYLE_MAGIC_KEY];
        };
        Displayable.prototype._innerSaveToNormal = function (toState) {
            _super.prototype._innerSaveToNormal.call(this, toState);
            var normalState = this._normalState;
            if (toState.style && !normalState.style) {
                normalState.style = this._mergeStyle(this.createStyle(), this.style);
            }
            this._savePrimaryToNormal(toState, normalState, PRIMARY_STATES_KEYS);
        };
        Displayable.prototype._applyStateObj = function (stateName, state, normalState, keepCurrentStates, transition, animationCfg) {
            _super.prototype._applyStateObj.call(this, stateName, state, normalState, keepCurrentStates, transition, animationCfg);
            var needsRestoreToNormal = !(state && keepCurrentStates);
            var targetStyle;
            if (state && state.style) {
                if (transition) {
                    if (keepCurrentStates) {
                        targetStyle = state.style;
                    }
                    else {
                        targetStyle = this._mergeStyle(this.createStyle(), normalState.style);
                        this._mergeStyle(targetStyle, state.style);
                    }
                }
                else {
                    targetStyle = this._mergeStyle(this.createStyle(), keepCurrentStates ? this.style : normalState.style);
                    this._mergeStyle(targetStyle, state.style);
                }
            }
            else if (needsRestoreToNormal) {
                targetStyle = normalState.style;
            }
            if (targetStyle) {
                if (transition) {
                    var sourceStyle = this.style;
                    this.style = this.createStyle(needsRestoreToNormal ? {} : sourceStyle);
                    if (needsRestoreToNormal) {
                        var changedKeys = keys$1(sourceStyle);
                        for (var i = 0; i < changedKeys.length; i++) {
                            var key = changedKeys[i];
                            if (key in targetStyle) {
                                targetStyle[key] = targetStyle[key];
                                this.style[key] = sourceStyle[key];
                            }
                        }
                    }
                    var targetKeys = keys$1(targetStyle);
                    for (var i = 0; i < targetKeys.length; i++) {
                        var key = targetKeys[i];
                        this.style[key] = this.style[key];
                    }
                    this._transitionState(stateName, {
                        style: targetStyle
                    }, animationCfg, this.getAnimationStyleProps());
                }
                else {
                    this.useStyle(targetStyle);
                }
            }
            var statesKeys = this.__inHover ? PRIMARY_STATES_KEYS_IN_HOVER_LAYER : PRIMARY_STATES_KEYS;
            for (var i = 0; i < statesKeys.length; i++) {
                var key = statesKeys[i];
                if (state && state[key] != null) {
                    this[key] = state[key];
                }
                else if (needsRestoreToNormal) {
                    if (normalState[key] != null) {
                        this[key] = normalState[key];
                    }
                }
            }
        };
        Displayable.prototype._mergeStates = function (states) {
            var mergedState = _super.prototype._mergeStates.call(this, states);
            var mergedStyle;
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                if (state.style) {
                    mergedStyle = mergedStyle || {};
                    this._mergeStyle(mergedStyle, state.style);
                }
            }
            if (mergedStyle) {
                mergedState.style = mergedStyle;
            }
            return mergedState;
        };
        Displayable.prototype._mergeStyle = function (targetStyle, sourceStyle) {
            extend(targetStyle, sourceStyle);
            return targetStyle;
        };
        Displayable.prototype.getAnimationStyleProps = function () {
            return DEFAULT_COMMON_ANIMATION_PROPS;
        };
        Displayable.initDefaultProps = (function () {
            var dispProto = Displayable.prototype;
            dispProto.type = 'displayable';
            dispProto.invisible = false;
            dispProto.z = 0;
            dispProto.z2 = 0;
            dispProto.zlevel = 0;
            dispProto.culling = false;
            dispProto.cursor = 'pointer';
            dispProto.rectHover = false;
            dispProto.incremental = false;
            dispProto._rect = null;
            dispProto.dirtyRectTolerance = 0;
            dispProto.__dirty = REDARAW_BIT | STYLE_CHANGED_BIT;
        })();
        return Displayable;
    }(Element));
    var tmpRect = new BoundingRect(0, 0, 0, 0);
    var viewRect = new BoundingRect(0, 0, 0, 0);
    function isDisplayableCulled(el, width, height) {
        tmpRect.copy(el.getBoundingRect());
        if (el.transform) {
            tmpRect.applyTransform(el.transform);
        }
        viewRect.width = width;
        viewRect.height = height;
        return !tmpRect.intersect(viewRect);
    }

    var mathPow = Math.pow;
    var mathSqrt$4 = Math.sqrt;
    var EPSILON$2 = 1e-8;
    var EPSILON_NUMERIC = 1e-4;
    var THREE_SQRT = mathSqrt$4(3);
    var ONE_THIRD = 1 / 3;
    var _v0 = create();
    var _v1 = create();
    var _v2 = create();
    function isAroundZero$1(val) {
        return val > -EPSILON$2 && val < EPSILON$2;
    }
    function isNotAroundZero(val) {
        return val > EPSILON$2 || val < -EPSILON$2;
    }
    function cubicAt(p0, p1, p2, p3, t) {
        var onet = 1 - t;
        return onet * onet * (onet * p0 + 3 * t * p1)
            + t * t * (t * p3 + 3 * onet * p2);
    }
    function cubicDerivativeAt(p0, p1, p2, p3, t) {
        var onet = 1 - t;
        return 3 * (((p1 - p0) * onet + 2 * (p2 - p1) * t) * onet
            + (p3 - p2) * t * t);
    }
    function cubicRootAt(p0, p1, p2, p3, val, roots) {
        var a = p3 + 3 * (p1 - p2) - p0;
        var b = 3 * (p2 - p1 * 2 + p0);
        var c = 3 * (p1 - p0);
        var d = p0 - val;
        var A = b * b - 3 * a * c;
        var B = b * c - 9 * a * d;
        var C = c * c - 3 * b * d;
        var n = 0;
        if (isAroundZero$1(A) && isAroundZero$1(B)) {
            if (isAroundZero$1(b)) {
                roots[0] = 0;
            }
            else {
                var t1 = -c / b;
                if (t1 >= 0 && t1 <= 1) {
                    roots[n++] = t1;
                }
            }
        }
        else {
            var disc = B * B - 4 * A * C;
            if (isAroundZero$1(disc)) {
                var K = B / A;
                var t1 = -b / a + K;
                var t2 = -K / 2;
                if (t1 >= 0 && t1 <= 1) {
                    roots[n++] = t1;
                }
                if (t2 >= 0 && t2 <= 1) {
                    roots[n++] = t2;
                }
            }
            else if (disc > 0) {
                var discSqrt = mathSqrt$4(disc);
                var Y1 = A * b + 1.5 * a * (-B + discSqrt);
                var Y2 = A * b + 1.5 * a * (-B - discSqrt);
                if (Y1 < 0) {
                    Y1 = -mathPow(-Y1, ONE_THIRD);
                }
                else {
                    Y1 = mathPow(Y1, ONE_THIRD);
                }
                if (Y2 < 0) {
                    Y2 = -mathPow(-Y2, ONE_THIRD);
                }
                else {
                    Y2 = mathPow(Y2, ONE_THIRD);
                }
                var t1 = (-b - (Y1 + Y2)) / (3 * a);
                if (t1 >= 0 && t1 <= 1) {
                    roots[n++] = t1;
                }
            }
            else {
                var T = (2 * A * b - 3 * a * B) / (2 * mathSqrt$4(A * A * A));
                var theta = Math.acos(T) / 3;
                var ASqrt = mathSqrt$4(A);
                var tmp = Math.cos(theta);
                var t1 = (-b - 2 * ASqrt * tmp) / (3 * a);
                var t2 = (-b + ASqrt * (tmp + THREE_SQRT * Math.sin(theta))) / (3 * a);
                var t3 = (-b + ASqrt * (tmp - THREE_SQRT * Math.sin(theta))) / (3 * a);
                if (t1 >= 0 && t1 <= 1) {
                    roots[n++] = t1;
                }
                if (t2 >= 0 && t2 <= 1) {
                    roots[n++] = t2;
                }
                if (t3 >= 0 && t3 <= 1) {
                    roots[n++] = t3;
                }
            }
        }
        return n;
    }
    function cubicExtrema(p0, p1, p2, p3, extrema) {
        var b = 6 * p2 - 12 * p1 + 6 * p0;
        var a = 9 * p1 + 3 * p3 - 3 * p0 - 9 * p2;
        var c = 3 * p1 - 3 * p0;
        var n = 0;
        if (isAroundZero$1(a)) {
            if (isNotAroundZero(b)) {
                var t1 = -c / b;
                if (t1 >= 0 && t1 <= 1) {
                    extrema[n++] = t1;
                }
            }
        }
        else {
            var disc = b * b - 4 * a * c;
            if (isAroundZero$1(disc)) {
                extrema[0] = -b / (2 * a);
            }
            else if (disc > 0) {
                var discSqrt = mathSqrt$4(disc);
                var t1 = (-b + discSqrt) / (2 * a);
                var t2 = (-b - discSqrt) / (2 * a);
                if (t1 >= 0 && t1 <= 1) {
                    extrema[n++] = t1;
                }
                if (t2 >= 0 && t2 <= 1) {
                    extrema[n++] = t2;
                }
            }
        }
        return n;
    }
    function cubicSubdivide(p0, p1, p2, p3, t, out) {
        var p01 = (p1 - p0) * t + p0;
        var p12 = (p2 - p1) * t + p1;
        var p23 = (p3 - p2) * t + p2;
        var p012 = (p12 - p01) * t + p01;
        var p123 = (p23 - p12) * t + p12;
        var p0123 = (p123 - p012) * t + p012;
        out[0] = p0;
        out[1] = p01;
        out[2] = p012;
        out[3] = p0123;
        out[4] = p0123;
        out[5] = p123;
        out[6] = p23;
        out[7] = p3;
    }
    function cubicProjectPoint(x0, y0, x1, y1, x2, y2, x3, y3, x, y, out) {
        var t;
        var interval = 0.005;
        var d = Infinity;
        var prev;
        var next;
        var d1;
        var d2;
        _v0[0] = x;
        _v0[1] = y;
        for (var _t = 0; _t < 1; _t += 0.05) {
            _v1[0] = cubicAt(x0, x1, x2, x3, _t);
            _v1[1] = cubicAt(y0, y1, y2, y3, _t);
            d1 = distSquare(_v0, _v1);
            if (d1 < d) {
                t = _t;
                d = d1;
            }
        }
        d = Infinity;
        for (var i = 0; i < 32; i++) {
            if (interval < EPSILON_NUMERIC) {
                break;
            }
            prev = t - interval;
            next = t + interval;
            _v1[0] = cubicAt(x0, x1, x2, x3, prev);
            _v1[1] = cubicAt(y0, y1, y2, y3, prev);
            d1 = distSquare(_v1, _v0);
            if (prev >= 0 && d1 < d) {
                t = prev;
                d = d1;
            }
            else {
                _v2[0] = cubicAt(x0, x1, x2, x3, next);
                _v2[1] = cubicAt(y0, y1, y2, y3, next);
                d2 = distSquare(_v2, _v0);
                if (next <= 1 && d2 < d) {
                    t = next;
                    d = d2;
                }
                else {
                    interval *= 0.5;
                }
            }
        }
        if (out) {
            out[0] = cubicAt(x0, x1, x2, x3, t);
            out[1] = cubicAt(y0, y1, y2, y3, t);
        }
        return mathSqrt$4(d);
    }
    function cubicLength(x0, y0, x1, y1, x2, y2, x3, y3, iteration) {
        var px = x0;
        var py = y0;
        var d = 0;
        var step = 1 / iteration;
        for (var i = 1; i <= iteration; i++) {
            var t = i * step;
            var x = cubicAt(x0, x1, x2, x3, t);
            var y = cubicAt(y0, y1, y2, y3, t);
            var dx = x - px;
            var dy = y - py;
            d += Math.sqrt(dx * dx + dy * dy);
            px = x;
            py = y;
        }
        return d;
    }
    function quadraticAt(p0, p1, p2, t) {
        var onet = 1 - t;
        return onet * (onet * p0 + 2 * t * p1) + t * t * p2;
    }
    function quadraticDerivativeAt(p0, p1, p2, t) {
        return 2 * ((1 - t) * (p1 - p0) + t * (p2 - p1));
    }
    function quadraticRootAt(p0, p1, p2, val, roots) {
        var a = p0 - 2 * p1 + p2;
        var b = 2 * (p1 - p0);
        var c = p0 - val;
        var n = 0;
        if (isAroundZero$1(a)) {
            if (isNotAroundZero(b)) {
                var t1 = -c / b;
                if (t1 >= 0 && t1 <= 1) {
                    roots[n++] = t1;
                }
            }
        }
        else {
            var disc = b * b - 4 * a * c;
            if (isAroundZero$1(disc)) {
                var t1 = -b / (2 * a);
                if (t1 >= 0 && t1 <= 1) {
                    roots[n++] = t1;
                }
            }
            else if (disc > 0) {
                var discSqrt = mathSqrt$4(disc);
                var t1 = (-b + discSqrt) / (2 * a);
                var t2 = (-b - discSqrt) / (2 * a);
                if (t1 >= 0 && t1 <= 1) {
                    roots[n++] = t1;
                }
                if (t2 >= 0 && t2 <= 1) {
                    roots[n++] = t2;
                }
            }
        }
        return n;
    }
    function quadraticExtremum(p0, p1, p2) {
        var divider = p0 + p2 - 2 * p1;
        if (divider === 0) {
            return 0.5;
        }
        else {
            return (p0 - p1) / divider;
        }
    }
    function quadraticSubdivide(p0, p1, p2, t, out) {
        var p01 = (p1 - p0) * t + p0;
        var p12 = (p2 - p1) * t + p1;
        var p012 = (p12 - p01) * t + p01;
        out[0] = p0;
        out[1] = p01;
        out[2] = p012;
        out[3] = p012;
        out[4] = p12;
        out[5] = p2;
    }
    function quadraticProjectPoint(x0, y0, x1, y1, x2, y2, x, y, out) {
        var t;
        var interval = 0.005;
        var d = Infinity;
        _v0[0] = x;
        _v0[1] = y;
        for (var _t = 0; _t < 1; _t += 0.05) {
            _v1[0] = quadraticAt(x0, x1, x2, _t);
            _v1[1] = quadraticAt(y0, y1, y2, _t);
            var d1 = distSquare(_v0, _v1);
            if (d1 < d) {
                t = _t;
                d = d1;
            }
        }
        d = Infinity;
        for (var i = 0; i < 32; i++) {
            if (interval < EPSILON_NUMERIC) {
                break;
            }
            var prev = t - interval;
            var next = t + interval;
            _v1[0] = quadraticAt(x0, x1, x2, prev);
            _v1[1] = quadraticAt(y0, y1, y2, prev);
            var d1 = distSquare(_v1, _v0);
            if (prev >= 0 && d1 < d) {
                t = prev;
                d = d1;
            }
            else {
                _v2[0] = quadraticAt(x0, x1, x2, next);
                _v2[1] = quadraticAt(y0, y1, y2, next);
                var d2 = distSquare(_v2, _v0);
                if (next <= 1 && d2 < d) {
                    t = next;
                    d = d2;
                }
                else {
                    interval *= 0.5;
                }
            }
        }
        if (out) {
            out[0] = quadraticAt(x0, x1, x2, t);
            out[1] = quadraticAt(y0, y1, y2, t);
        }
        return mathSqrt$4(d);
    }
    function quadraticLength(x0, y0, x1, y1, x2, y2, iteration) {
        var px = x0;
        var py = y0;
        var d = 0;
        var step = 1 / iteration;
        for (var i = 1; i <= iteration; i++) {
            var t = i * step;
            var x = quadraticAt(x0, x1, x2, t);
            var y = quadraticAt(y0, y1, y2, t);
            var dx = x - px;
            var dy = y - py;
            d += Math.sqrt(dx * dx + dy * dy);
            px = x;
            py = y;
        }
        return d;
    }

    var mathMin$2 = Math.min;
    var mathMax$2 = Math.max;
    var mathSin$4 = Math.sin;
    var mathCos$4 = Math.cos;
    var PI2$6 = Math.PI * 2;
    var start = create();
    var end = create();
    var extremity = create();
    function fromLine(x0, y0, x1, y1, min, max) {
        min[0] = mathMin$2(x0, x1);
        min[1] = mathMin$2(y0, y1);
        max[0] = mathMax$2(x0, x1);
        max[1] = mathMax$2(y0, y1);
    }
    var xDim = [];
    var yDim = [];
    function fromCubic(x0, y0, x1, y1, x2, y2, x3, y3, min, max) {
        var cubicExtrema$1 = cubicExtrema;
        var cubicAt$1 = cubicAt;
        var n = cubicExtrema$1(x0, x1, x2, x3, xDim);
        min[0] = Infinity;
        min[1] = Infinity;
        max[0] = -Infinity;
        max[1] = -Infinity;
        for (var i = 0; i < n; i++) {
            var x = cubicAt$1(x0, x1, x2, x3, xDim[i]);
            min[0] = mathMin$2(x, min[0]);
            max[0] = mathMax$2(x, max[0]);
        }
        n = cubicExtrema$1(y0, y1, y2, y3, yDim);
        for (var i = 0; i < n; i++) {
            var y = cubicAt$1(y0, y1, y2, y3, yDim[i]);
            min[1] = mathMin$2(y, min[1]);
            max[1] = mathMax$2(y, max[1]);
        }
        min[0] = mathMin$2(x0, min[0]);
        max[0] = mathMax$2(x0, max[0]);
        min[0] = mathMin$2(x3, min[0]);
        max[0] = mathMax$2(x3, max[0]);
        min[1] = mathMin$2(y0, min[1]);
        max[1] = mathMax$2(y0, max[1]);
        min[1] = mathMin$2(y3, min[1]);
        max[1] = mathMax$2(y3, max[1]);
    }
    function fromQuadratic(x0, y0, x1, y1, x2, y2, min, max) {
        var quadraticExtremum$1 = quadraticExtremum;
        var quadraticAt$1 = quadraticAt;
        var tx = mathMax$2(mathMin$2(quadraticExtremum$1(x0, x1, x2), 1), 0);
        var ty = mathMax$2(mathMin$2(quadraticExtremum$1(y0, y1, y2), 1), 0);
        var x = quadraticAt$1(x0, x1, x2, tx);
        var y = quadraticAt$1(y0, y1, y2, ty);
        min[0] = mathMin$2(x0, x2, x);
        min[1] = mathMin$2(y0, y2, y);
        max[0] = mathMax$2(x0, x2, x);
        max[1] = mathMax$2(y0, y2, y);
    }
    function fromArc(x, y, rx, ry, startAngle, endAngle, anticlockwise, min, max) {
        var vec2Min = min$1;
        var vec2Max = max$1;
        var diff = Math.abs(startAngle - endAngle);
        if (diff % PI2$6 < 1e-4 && diff > 1e-4) {
            min[0] = x - rx;
            min[1] = y - ry;
            max[0] = x + rx;
            max[1] = y + ry;
            return;
        }
        start[0] = mathCos$4(startAngle) * rx + x;
        start[1] = mathSin$4(startAngle) * ry + y;
        end[0] = mathCos$4(endAngle) * rx + x;
        end[1] = mathSin$4(endAngle) * ry + y;
        vec2Min(min, start, end);
        vec2Max(max, start, end);
        startAngle = startAngle % (PI2$6);
        if (startAngle < 0) {
            startAngle = startAngle + PI2$6;
        }
        endAngle = endAngle % (PI2$6);
        if (endAngle < 0) {
            endAngle = endAngle + PI2$6;
        }
        if (startAngle > endAngle && !anticlockwise) {
            endAngle += PI2$6;
        }
        else if (startAngle < endAngle && anticlockwise) {
            startAngle += PI2$6;
        }
        if (anticlockwise) {
            var tmp = endAngle;
            endAngle = startAngle;
            startAngle = tmp;
        }
        for (var angle = 0; angle < endAngle; angle += Math.PI / 2) {
            if (angle > startAngle) {
                extremity[0] = mathCos$4(angle) * rx + x;
                extremity[1] = mathSin$4(angle) * ry + y;
                vec2Min(min, extremity, min);
                vec2Max(max, extremity, max);
            }
        }
    }

    var CMD$3 = {
        M: 1,
        L: 2,
        C: 3,
        Q: 4,
        A: 5,
        Z: 6,
        R: 7
    };
    var tmpOutX = [];
    var tmpOutY = [];
    var min = [];
    var max = [];
    var min2 = [];
    var max2 = [];
    var mathMin$1 = Math.min;
    var mathMax$1 = Math.max;
    var mathCos$3 = Math.cos;
    var mathSin$3 = Math.sin;
    var mathSqrt$3 = Math.sqrt;
    var mathAbs$1 = Math.abs;
    var PI$5 = Math.PI;
    var PI2$5 = PI$5 * 2;
    var hasTypedArray = typeof Float32Array !== 'undefined';
    var tmpAngles = [];
    function modPI2(radian) {
        var n = Math.round(radian / PI$5 * 1e8) / 1e8;
        return (n % 2) * PI$5;
    }
    function normalizeArcAngles(angles, anticlockwise) {
        var newStartAngle = modPI2(angles[0]);
        if (newStartAngle < 0) {
            newStartAngle += PI2$5;
        }
        var delta = newStartAngle - angles[0];
        var newEndAngle = angles[1];
        newEndAngle += delta;
        if (!anticlockwise && newEndAngle - newStartAngle >= PI2$5) {
            newEndAngle = newStartAngle + PI2$5;
        }
        else if (anticlockwise && newStartAngle - newEndAngle >= PI2$5) {
            newEndAngle = newStartAngle - PI2$5;
        }
        else if (!anticlockwise && newStartAngle > newEndAngle) {
            newEndAngle = newStartAngle + (PI2$5 - modPI2(newStartAngle - newEndAngle));
        }
        else if (anticlockwise && newStartAngle < newEndAngle) {
            newEndAngle = newStartAngle - (PI2$5 - modPI2(newEndAngle - newStartAngle));
        }
        angles[0] = newStartAngle;
        angles[1] = newEndAngle;
    }
    var PathProxy = (function () {
        function PathProxy(notSaveData) {
            this.dpr = 1;
            this._xi = 0;
            this._yi = 0;
            this._x0 = 0;
            this._y0 = 0;
            this._len = 0;
            if (notSaveData) {
                this._saveData = false;
            }
            if (this._saveData) {
                this.data = [];
            }
        }
        PathProxy.prototype.increaseVersion = function () {
            this._version++;
        };
        PathProxy.prototype.getVersion = function () {
            return this._version;
        };
        PathProxy.prototype.setScale = function (sx, sy, segmentIgnoreThreshold) {
            segmentIgnoreThreshold = segmentIgnoreThreshold || 0;
            if (segmentIgnoreThreshold > 0) {
                this._ux = mathAbs$1(segmentIgnoreThreshold / devicePixelRatio / sx) || 0;
                this._uy = mathAbs$1(segmentIgnoreThreshold / devicePixelRatio / sy) || 0;
            }
        };
        PathProxy.prototype.setDPR = function (dpr) {
            this.dpr = dpr;
        };
        PathProxy.prototype.setContext = function (ctx) {
            this._ctx = ctx;
        };
        PathProxy.prototype.getContext = function () {
            return this._ctx;
        };
        PathProxy.prototype.beginPath = function () {
            this._ctx && this._ctx.beginPath();
            this.reset();
            return this;
        };
        PathProxy.prototype.reset = function () {
            if (this._saveData) {
                this._len = 0;
            }
            if (this._lineDash) {
                this._lineDash = null;
                this._dashOffset = 0;
            }
            if (this._pathSegLen) {
                this._pathSegLen = null;
                this._pathLen = 0;
            }
            this._version++;
        };
        PathProxy.prototype.moveTo = function (x, y) {
            this._drawPendingPt();
            this.addData(CMD$3.M, x, y);
            this._ctx && this._ctx.moveTo(x, y);
            this._x0 = x;
            this._y0 = y;
            this._xi = x;
            this._yi = y;
            return this;
        };
        PathProxy.prototype.lineTo = function (x, y) {
            var dx = mathAbs$1(x - this._xi);
            var dy = mathAbs$1(y - this._yi);
            var exceedUnit = dx > this._ux || dy > this._uy;
            this.addData(CMD$3.L, x, y);
            if (this._ctx && exceedUnit) {
                this._needsDash ? this._dashedLineTo(x, y)
                    : this._ctx.lineTo(x, y);
            }
            if (exceedUnit) {
                this._xi = x;
                this._yi = y;
                this._pendingPtDist = 0;
            }
            else {
                var d2 = dx * dx + dy * dy;
                if (d2 > this._pendingPtDist) {
                    this._pendingPtX = x;
                    this._pendingPtY = y;
                    this._pendingPtDist = d2;
                }
            }
            return this;
        };
        PathProxy.prototype.bezierCurveTo = function (x1, y1, x2, y2, x3, y3) {
            this.addData(CMD$3.C, x1, y1, x2, y2, x3, y3);
            if (this._ctx) {
                this._needsDash ? this._dashedBezierTo(x1, y1, x2, y2, x3, y3)
                    : this._ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
            }
            this._xi = x3;
            this._yi = y3;
            return this;
        };
        PathProxy.prototype.quadraticCurveTo = function (x1, y1, x2, y2) {
            this.addData(CMD$3.Q, x1, y1, x2, y2);
            if (this._ctx) {
                this._needsDash ? this._dashedQuadraticTo(x1, y1, x2, y2)
                    : this._ctx.quadraticCurveTo(x1, y1, x2, y2);
            }
            this._xi = x2;
            this._yi = y2;
            return this;
        };
        PathProxy.prototype.arc = function (cx, cy, r, startAngle, endAngle, anticlockwise) {
            tmpAngles[0] = startAngle;
            tmpAngles[1] = endAngle;
            normalizeArcAngles(tmpAngles, anticlockwise);
            startAngle = tmpAngles[0];
            endAngle = tmpAngles[1];
            var delta = endAngle - startAngle;
            this.addData(CMD$3.A, cx, cy, r, r, startAngle, delta, 0, anticlockwise ? 0 : 1);
            this._ctx && this._ctx.arc(cx, cy, r, startAngle, endAngle, anticlockwise);
            this._xi = mathCos$3(endAngle) * r + cx;
            this._yi = mathSin$3(endAngle) * r + cy;
            return this;
        };
        PathProxy.prototype.arcTo = function (x1, y1, x2, y2, radius) {
            if (this._ctx) {
                this._ctx.arcTo(x1, y1, x2, y2, radius);
            }
            return this;
        };
        PathProxy.prototype.rect = function (x, y, w, h) {
            this._ctx && this._ctx.rect(x, y, w, h);
            this.addData(CMD$3.R, x, y, w, h);
            return this;
        };
        PathProxy.prototype.closePath = function () {
            this._drawPendingPt();
            this.addData(CMD$3.Z);
            var ctx = this._ctx;
            var x0 = this._x0;
            var y0 = this._y0;
            if (ctx) {
                this._needsDash && this._dashedLineTo(x0, y0);
                ctx.closePath();
            }
            this._xi = x0;
            this._yi = y0;
            return this;
        };
        PathProxy.prototype.fill = function (ctx) {
            ctx && ctx.fill();
            this.toStatic();
        };
        PathProxy.prototype.stroke = function (ctx) {
            ctx && ctx.stroke();
            this.toStatic();
        };
        PathProxy.prototype.setLineDash = function (lineDash) {
            if (lineDash instanceof Array) {
                this._lineDash = lineDash;
                this._dashIdx = 0;
                var lineDashSum = 0;
                for (var i = 0; i < lineDash.length; i++) {
                    lineDashSum += lineDash[i];
                }
                this._dashSum = lineDashSum;
                this._needsDash = true;
            }
            else {
                this._lineDash = null;
                this._needsDash = false;
            }
            return this;
        };
        PathProxy.prototype.setLineDashOffset = function (offset) {
            this._dashOffset = offset;
            return this;
        };
        PathProxy.prototype.len = function () {
            return this._len;
        };
        PathProxy.prototype.setData = function (data) {
            var len = data.length;
            if (!(this.data && this.data.length === len) && hasTypedArray) {
                this.data = new Float32Array(len);
            }
            for (var i = 0; i < len; i++) {
                this.data[i] = data[i];
            }
            this._len = len;
        };
        PathProxy.prototype.appendPath = function (path) {
            if (!(path instanceof Array)) {
                path = [path];
            }
            var len = path.length;
            var appendSize = 0;
            var offset = this._len;
            for (var i = 0; i < len; i++) {
                appendSize += path[i].len();
            }
            if (hasTypedArray && (this.data instanceof Float32Array)) {
                this.data = new Float32Array(offset + appendSize);
            }
            for (var i = 0; i < len; i++) {
                var appendPathData = path[i].data;
                for (var k = 0; k < appendPathData.length; k++) {
                    this.data[offset++] = appendPathData[k];
                }
            }
            this._len = offset;
        };
        PathProxy.prototype.addData = function (cmd, a, b, c, d, e, f, g, h) {
            if (!this._saveData) {
                return;
            }
            var data = this.data;
            if (this._len + arguments.length > data.length) {
                this._expandData();
                data = this.data;
            }
            for (var i = 0; i < arguments.length; i++) {
                data[this._len++] = arguments[i];
            }
        };
        PathProxy.prototype._drawPendingPt = function () {
            if (this._pendingPtDist > 0) {
                this._ctx && this._ctx.lineTo(this._pendingPtX, this._pendingPtY);
                this._pendingPtDist = 0;
            }
        };
        PathProxy.prototype._expandData = function () {
            if (!(this.data instanceof Array)) {
                var newData = [];
                for (var i = 0; i < this._len; i++) {
                    newData[i] = this.data[i];
                }
                this.data = newData;
            }
        };
        PathProxy.prototype._dashedLineTo = function (x1, y1) {
            var dashSum = this._dashSum;
            var lineDash = this._lineDash;
            var ctx = this._ctx;
            var offset = this._dashOffset;
            var x0 = this._xi;
            var y0 = this._yi;
            var dx = x1 - x0;
            var dy = y1 - y0;
            var dist = mathSqrt$3(dx * dx + dy * dy);
            var x = x0;
            var y = y0;
            var nDash = lineDash.length;
            var dash;
            var idx;
            dx /= dist;
            dy /= dist;
            if (offset < 0) {
                offset = dashSum + offset;
            }
            offset %= dashSum;
            x -= offset * dx;
            y -= offset * dy;
            while ((dx > 0 && x <= x1) || (dx < 0 && x >= x1)
                || (dx === 0 && ((dy > 0 && y <= y1) || (dy < 0 && y >= y1)))) {
                idx = this._dashIdx;
                dash = lineDash[idx];
                x += dx * dash;
                y += dy * dash;
                this._dashIdx = (idx + 1) % nDash;
                if ((dx > 0 && x < x0) || (dx < 0 && x > x0) || (dy > 0 && y < y0) || (dy < 0 && y > y0)) {
                    continue;
                }
                ctx[idx % 2 ? 'moveTo' : 'lineTo'](dx >= 0 ? mathMin$1(x, x1) : mathMax$1(x, x1), dy >= 0 ? mathMin$1(y, y1) : mathMax$1(y, y1));
            }
            dx = x - x1;
            dy = y - y1;
            this._dashOffset = -mathSqrt$3(dx * dx + dy * dy);
        };
        PathProxy.prototype._dashedBezierTo = function (x1, y1, x2, y2, x3, y3) {
            var ctx = this._ctx;
            var dashSum = this._dashSum;
            var offset = this._dashOffset;
            var lineDash = this._lineDash;
            var x0 = this._xi;
            var y0 = this._yi;
            var bezierLen = 0;
            var idx = this._dashIdx;
            var nDash = lineDash.length;
            var t;
            var dx;
            var dy;
            var x;
            var y;
            var tmpLen = 0;
            if (offset < 0) {
                offset = dashSum + offset;
            }
            offset %= dashSum;
            for (t = 0; t < 1; t += 0.1) {
                dx = cubicAt(x0, x1, x2, x3, t + 0.1)
                    - cubicAt(x0, x1, x2, x3, t);
                dy = cubicAt(y0, y1, y2, y3, t + 0.1)
                    - cubicAt(y0, y1, y2, y3, t);
                bezierLen += mathSqrt$3(dx * dx + dy * dy);
            }
            for (; idx < nDash; idx++) {
                tmpLen += lineDash[idx];
                if (tmpLen > offset) {
                    break;
                }
            }
            t = (tmpLen - offset) / bezierLen;
            while (t <= 1) {
                x = cubicAt(x0, x1, x2, x3, t);
                y = cubicAt(y0, y1, y2, y3, t);
                idx % 2 ? ctx.moveTo(x, y)
                    : ctx.lineTo(x, y);
                t += lineDash[idx] / bezierLen;
                idx = (idx + 1) % nDash;
            }
            (idx % 2 !== 0) && ctx.lineTo(x3, y3);
            dx = x3 - x;
            dy = y3 - y;
            this._dashOffset = -mathSqrt$3(dx * dx + dy * dy);
        };
        PathProxy.prototype._dashedQuadraticTo = function (x1, y1, x2, y2) {
            var x3 = x2;
            var y3 = y2;
            x2 = (x2 + 2 * x1) / 3;
            y2 = (y2 + 2 * y1) / 3;
            x1 = (this._xi + 2 * x1) / 3;
            y1 = (this._yi + 2 * y1) / 3;
            this._dashedBezierTo(x1, y1, x2, y2, x3, y3);
        };
        PathProxy.prototype.toStatic = function () {
            if (!this._saveData) {
                return;
            }
            this._drawPendingPt();
            var data = this.data;
            if (data instanceof Array) {
                data.length = this._len;
                if (hasTypedArray && this._len > 11) {
                    this.data = new Float32Array(data);
                }
            }
        };
        PathProxy.prototype.getBoundingRect = function () {
            min[0] = min[1] = min2[0] = min2[1] = Number.MAX_VALUE;
            max[0] = max[1] = max2[0] = max2[1] = -Number.MAX_VALUE;
            var data = this.data;
            var xi = 0;
            var yi = 0;
            var x0 = 0;
            var y0 = 0;
            var i;
            for (i = 0; i < this._len;) {
                var cmd = data[i++];
                var isFirst = i === 1;
                if (isFirst) {
                    xi = data[i];
                    yi = data[i + 1];
                    x0 = xi;
                    y0 = yi;
                }
                switch (cmd) {
                    case CMD$3.M:
                        xi = x0 = data[i++];
                        yi = y0 = data[i++];
                        min2[0] = x0;
                        min2[1] = y0;
                        max2[0] = x0;
                        max2[1] = y0;
                        break;
                    case CMD$3.L:
                        fromLine(xi, yi, data[i], data[i + 1], min2, max2);
                        xi = data[i++];
                        yi = data[i++];
                        break;
                    case CMD$3.C:
                        fromCubic(xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1], min2, max2);
                        xi = data[i++];
                        yi = data[i++];
                        break;
                    case CMD$3.Q:
                        fromQuadratic(xi, yi, data[i++], data[i++], data[i], data[i + 1], min2, max2);
                        xi = data[i++];
                        yi = data[i++];
                        break;
                    case CMD$3.A:
                        var cx = data[i++];
                        var cy = data[i++];
                        var rx = data[i++];
                        var ry = data[i++];
                        var startAngle = data[i++];
                        var endAngle = data[i++] + startAngle;
                        i += 1;
                        var anticlockwise = !data[i++];
                        if (isFirst) {
                            x0 = mathCos$3(startAngle) * rx + cx;
                            y0 = mathSin$3(startAngle) * ry + cy;
                        }
                        fromArc(cx, cy, rx, ry, startAngle, endAngle, anticlockwise, min2, max2);
                        xi = mathCos$3(endAngle) * rx + cx;
                        yi = mathSin$3(endAngle) * ry + cy;
                        break;
                    case CMD$3.R:
                        x0 = xi = data[i++];
                        y0 = yi = data[i++];
                        var width = data[i++];
                        var height = data[i++];
                        fromLine(x0, y0, x0 + width, y0 + height, min2, max2);
                        break;
                    case CMD$3.Z:
                        xi = x0;
                        yi = y0;
                        break;
                }
                min$1(min, min, min2);
                max$1(max, max, max2);
            }
            if (i === 0) {
                min[0] = min[1] = max[0] = max[1] = 0;
            }
            return new BoundingRect(min[0], min[1], max[0] - min[0], max[1] - min[1]);
        };
        PathProxy.prototype._calculateLength = function () {
            var data = this.data;
            var len = this._len;
            var ux = this._ux;
            var uy = this._uy;
            var xi = 0;
            var yi = 0;
            var x0 = 0;
            var y0 = 0;
            if (!this._pathSegLen) {
                this._pathSegLen = [];
            }
            var pathSegLen = this._pathSegLen;
            var pathTotalLen = 0;
            var segCount = 0;
            for (var i = 0; i < len;) {
                var cmd = data[i++];
                var isFirst = i === 1;
                if (isFirst) {
                    xi = data[i];
                    yi = data[i + 1];
                    x0 = xi;
                    y0 = yi;
                }
                var l = -1;
                switch (cmd) {
                    case CMD$3.M:
                        xi = x0 = data[i++];
                        yi = y0 = data[i++];
                        break;
                    case CMD$3.L: {
                        var x2 = data[i++];
                        var y2 = data[i++];
                        var dx = x2 - xi;
                        var dy = y2 - yi;
                        if (mathAbs$1(dx) > ux || mathAbs$1(dy) > uy || i === len - 1) {
                            l = Math.sqrt(dx * dx + dy * dy);
                            xi = x2;
                            yi = y2;
                        }
                        break;
                    }
                    case CMD$3.C: {
                        var x1 = data[i++];
                        var y1 = data[i++];
                        var x2 = data[i++];
                        var y2 = data[i++];
                        var x3 = data[i++];
                        var y3 = data[i++];
                        l = cubicLength(xi, yi, x1, y1, x2, y2, x3, y3, 10);
                        xi = x3;
                        yi = y3;
                        break;
                    }
                    case CMD$3.Q: {
                        var x1 = data[i++];
                        var y1 = data[i++];
                        var x2 = data[i++];
                        var y2 = data[i++];
                        l = quadraticLength(xi, yi, x1, y1, x2, y2, 10);
                        xi = x2;
                        yi = y2;
                        break;
                    }
                    case CMD$3.A:
                        var cx = data[i++];
                        var cy = data[i++];
                        var rx = data[i++];
                        var ry = data[i++];
                        var startAngle = data[i++];
                        var delta = data[i++];
                        var endAngle = delta + startAngle;
                        i += 1;
                        !data[i++];
                        if (isFirst) {
                            x0 = mathCos$3(startAngle) * rx + cx;
                            y0 = mathSin$3(startAngle) * ry + cy;
                        }
                        l = mathMax$1(rx, ry) * mathMin$1(PI2$5, Math.abs(delta));
                        xi = mathCos$3(endAngle) * rx + cx;
                        yi = mathSin$3(endAngle) * ry + cy;
                        break;
                    case CMD$3.R: {
                        x0 = xi = data[i++];
                        y0 = yi = data[i++];
                        var width = data[i++];
                        var height = data[i++];
                        l = width * 2 + height * 2;
                        break;
                    }
                    case CMD$3.Z: {
                        var dx = x0 - xi;
                        var dy = y0 - yi;
                        l = Math.sqrt(dx * dx + dy * dy);
                        xi = x0;
                        yi = y0;
                        break;
                    }
                }
                if (l >= 0) {
                    pathSegLen[segCount++] = l;
                    pathTotalLen += l;
                }
            }
            this._pathLen = pathTotalLen;
            return pathTotalLen;
        };
        PathProxy.prototype.rebuildPath = function (ctx, percent) {
            var d = this.data;
            var ux = this._ux;
            var uy = this._uy;
            var len = this._len;
            var x0;
            var y0;
            var xi;
            var yi;
            var x;
            var y;
            var drawPart = percent < 1;
            var pathSegLen;
            var pathTotalLen;
            var accumLength = 0;
            var segCount = 0;
            var displayedLength;
            var pendingPtDist = 0;
            var pendingPtX;
            var pendingPtY;
            if (drawPart) {
                if (!this._pathSegLen) {
                    this._calculateLength();
                }
                pathSegLen = this._pathSegLen;
                pathTotalLen = this._pathLen;
                displayedLength = percent * pathTotalLen;
                if (!displayedLength) {
                    return;
                }
            }
            lo: for (var i = 0; i < len;) {
                var cmd = d[i++];
                var isFirst = i === 1;
                if (isFirst) {
                    xi = d[i];
                    yi = d[i + 1];
                    x0 = xi;
                    y0 = yi;
                }
                switch (cmd) {
                    case CMD$3.M:
                        if (pendingPtDist > 0) {
                            ctx.lineTo(pendingPtX, pendingPtY);
                            pendingPtDist = 0;
                        }
                        x0 = xi = d[i++];
                        y0 = yi = d[i++];
                        ctx.moveTo(xi, yi);
                        break;
                    case CMD$3.L: {
                        x = d[i++];
                        y = d[i++];
                        var dx = mathAbs$1(x - xi);
                        var dy = mathAbs$1(y - yi);
                        if (dx > ux || dy > uy) {
                            if (drawPart) {
                                var l = pathSegLen[segCount++];
                                if (accumLength + l > displayedLength) {
                                    var t = (displayedLength - accumLength) / l;
                                    ctx.lineTo(xi * (1 - t) + x * t, yi * (1 - t) + y * t);
                                    break lo;
                                }
                                accumLength += l;
                            }
                            ctx.lineTo(x, y);
                            xi = x;
                            yi = y;
                            pendingPtDist = 0;
                        }
                        else {
                            var d2 = dx * dx + dy * dy;
                            if (d2 > pendingPtDist) {
                                pendingPtX = x;
                                pendingPtY = y;
                                pendingPtDist = d2;
                            }
                        }
                        break;
                    }
                    case CMD$3.C: {
                        var x1 = d[i++];
                        var y1 = d[i++];
                        var x2 = d[i++];
                        var y2 = d[i++];
                        var x3 = d[i++];
                        var y3 = d[i++];
                        if (drawPart) {
                            var l = pathSegLen[segCount++];
                            if (accumLength + l > displayedLength) {
                                var t = (displayedLength - accumLength) / l;
                                cubicSubdivide(xi, x1, x2, x3, t, tmpOutX);
                                cubicSubdivide(yi, y1, y2, y3, t, tmpOutY);
                                ctx.bezierCurveTo(tmpOutX[1], tmpOutY[1], tmpOutX[2], tmpOutY[2], tmpOutX[3], tmpOutY[3]);
                                break lo;
                            }
                            accumLength += l;
                        }
                        ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
                        xi = x3;
                        yi = y3;
                        break;
                    }
                    case CMD$3.Q: {
                        var x1 = d[i++];
                        var y1 = d[i++];
                        var x2 = d[i++];
                        var y2 = d[i++];
                        if (drawPart) {
                            var l = pathSegLen[segCount++];
                            if (accumLength + l > displayedLength) {
                                var t = (displayedLength - accumLength) / l;
                                quadraticSubdivide(xi, x1, x2, t, tmpOutX);
                                quadraticSubdivide(yi, y1, y2, t, tmpOutY);
                                ctx.quadraticCurveTo(tmpOutX[1], tmpOutY[1], tmpOutX[2], tmpOutY[2]);
                                break lo;
                            }
                            accumLength += l;
                        }
                        ctx.quadraticCurveTo(x1, y1, x2, y2);
                        xi = x2;
                        yi = y2;
                        break;
                    }
                    case CMD$3.A:
                        var cx = d[i++];
                        var cy = d[i++];
                        var rx = d[i++];
                        var ry = d[i++];
                        var startAngle = d[i++];
                        var delta = d[i++];
                        var psi = d[i++];
                        var anticlockwise = !d[i++];
                        var r = (rx > ry) ? rx : ry;
                        var isEllipse = mathAbs$1(rx - ry) > 1e-3;
                        var endAngle = startAngle + delta;
                        var breakBuild = false;
                        if (drawPart) {
                            var l = pathSegLen[segCount++];
                            if (accumLength + l > displayedLength) {
                                endAngle = startAngle + delta * (displayedLength - accumLength) / l;
                                breakBuild = true;
                            }
                            accumLength += l;
                        }
                        if (isEllipse && ctx.ellipse) {
                            ctx.ellipse(cx, cy, rx, ry, psi, startAngle, endAngle, anticlockwise);
                        }
                        else {
                            ctx.arc(cx, cy, r, startAngle, endAngle, anticlockwise);
                        }
                        if (breakBuild) {
                            break lo;
                        }
                        if (isFirst) {
                            x0 = mathCos$3(startAngle) * rx + cx;
                            y0 = mathSin$3(startAngle) * ry + cy;
                        }
                        xi = mathCos$3(endAngle) * rx + cx;
                        yi = mathSin$3(endAngle) * ry + cy;
                        break;
                    case CMD$3.R:
                        x0 = xi = d[i];
                        y0 = yi = d[i + 1];
                        x = d[i++];
                        y = d[i++];
                        var width = d[i++];
                        var height = d[i++];
                        if (drawPart) {
                            var l = pathSegLen[segCount++];
                            if (accumLength + l > displayedLength) {
                                var d_1 = displayedLength - accumLength;
                                ctx.moveTo(x, y);
                                ctx.lineTo(x + mathMin$1(d_1, width), y);
                                d_1 -= width;
                                if (d_1 > 0) {
                                    ctx.lineTo(x + width, y + mathMin$1(d_1, height));
                                }
                                d_1 -= height;
                                if (d_1 > 0) {
                                    ctx.lineTo(x + mathMax$1(width - d_1, 0), y + height);
                                }
                                d_1 -= width;
                                if (d_1 > 0) {
                                    ctx.lineTo(x, y + mathMax$1(height - d_1, 0));
                                }
                                break lo;
                            }
                            accumLength += l;
                        }
                        ctx.rect(x, y, width, height);
                        break;
                    case CMD$3.Z:
                        if (pendingPtDist > 0) {
                            ctx.lineTo(pendingPtX, pendingPtY);
                            pendingPtDist = 0;
                        }
                        if (drawPart) {
                            var l = pathSegLen[segCount++];
                            if (accumLength + l > displayedLength) {
                                var t = (displayedLength - accumLength) / l;
                                ctx.lineTo(xi * (1 - t) + x0 * t, yi * (1 - t) + y0 * t);
                                break lo;
                            }
                            accumLength += l;
                        }
                        ctx.closePath();
                        xi = x0;
                        yi = y0;
                }
            }
        };
        PathProxy.CMD = CMD$3;
        PathProxy.initDefaultProps = (function () {
            var proto = PathProxy.prototype;
            proto._saveData = true;
            proto._needsDash = false;
            proto._dashOffset = 0;
            proto._dashIdx = 0;
            proto._dashSum = 0;
            proto._ux = 0;
            proto._uy = 0;
            proto._pendingPtDist = 0;
            proto._version = 0;
        })();
        return PathProxy;
    }());

    var globalImageCache = new LRU(50);
    function findExistImage(newImageOrSrc) {
        if (typeof newImageOrSrc === 'string') {
            var cachedImgObj = globalImageCache.get(newImageOrSrc);
            return cachedImgObj && cachedImgObj.image;
        }
        else {
            return newImageOrSrc;
        }
    }
    function createOrUpdateImage(newImageOrSrc, image, hostEl, onload, cbPayload) {
        if (!newImageOrSrc) {
            return image;
        }
        else if (typeof newImageOrSrc === 'string') {
            if ((image && image.__zrImageSrc === newImageOrSrc) || !hostEl) {
                return image;
            }
            var cachedImgObj = globalImageCache.get(newImageOrSrc);
            var pendingWrap = { hostEl: hostEl, cb: onload, cbPayload: cbPayload };
            if (cachedImgObj) {
                image = cachedImgObj.image;
                !isImageReady(image) && cachedImgObj.pending.push(pendingWrap);
            }
            else {
                image = new Image();
                image.onload = image.onerror = imageOnLoad;
                globalImageCache.put(newImageOrSrc, image.__cachedImgObj = {
                    image: image,
                    pending: [pendingWrap]
                });
                image.src = image.__zrImageSrc = newImageOrSrc;
            }
            return image;
        }
        else {
            return newImageOrSrc;
        }
    }
    function imageOnLoad() {
        var cachedImgObj = this.__cachedImgObj;
        this.onload = this.onerror = this.__cachedImgObj = null;
        for (var i = 0; i < cachedImgObj.pending.length; i++) {
            var pendingWrap = cachedImgObj.pending[i];
            var cb = pendingWrap.cb;
            cb && cb(this, pendingWrap.cbPayload);
            pendingWrap.hostEl.dirty();
        }
        cachedImgObj.pending.length = 0;
    }
    function isImageReady(image) {
        return image && image.width && image.height;
    }

    function containStroke$4(x0, y0, x1, y1, lineWidth, x, y) {
        if (lineWidth === 0) {
            return false;
        }
        var _l = lineWidth;
        var _a = 0;
        var _b = x0;
        if ((y > y0 + _l && y > y1 + _l)
            || (y < y0 - _l && y < y1 - _l)
            || (x > x0 + _l && x > x1 + _l)
            || (x < x0 - _l && x < x1 - _l)) {
            return false;
        }
        if (x0 !== x1) {
            _a = (y0 - y1) / (x0 - x1);
            _b = (x0 * y1 - x1 * y0) / (x0 - x1);
        }
        else {
            return Math.abs(x - x0) <= _l / 2;
        }
        var tmp = _a * x - y + _b;
        var _s = tmp * tmp / (_a * _a + 1);
        return _s <= _l / 2 * _l / 2;
    }

    function containStroke$3(x0, y0, x1, y1, x2, y2, x3, y3, lineWidth, x, y) {
        if (lineWidth === 0) {
            return false;
        }
        var _l = lineWidth;
        if ((y > y0 + _l && y > y1 + _l && y > y2 + _l && y > y3 + _l)
            || (y < y0 - _l && y < y1 - _l && y < y2 - _l && y < y3 - _l)
            || (x > x0 + _l && x > x1 + _l && x > x2 + _l && x > x3 + _l)
            || (x < x0 - _l && x < x1 - _l && x < x2 - _l && x < x3 - _l)) {
            return false;
        }
        var d = cubicProjectPoint(x0, y0, x1, y1, x2, y2, x3, y3, x, y, null);
        return d <= _l / 2;
    }

    function containStroke$2(x0, y0, x1, y1, x2, y2, lineWidth, x, y) {
        if (lineWidth === 0) {
            return false;
        }
        var _l = lineWidth;
        if ((y > y0 + _l && y > y1 + _l && y > y2 + _l)
            || (y < y0 - _l && y < y1 - _l && y < y2 - _l)
            || (x > x0 + _l && x > x1 + _l && x > x2 + _l)
            || (x < x0 - _l && x < x1 - _l && x < x2 - _l)) {
            return false;
        }
        var d = quadraticProjectPoint(x0, y0, x1, y1, x2, y2, x, y, null);
        return d <= _l / 2;
    }

    var PI2$4 = Math.PI * 2;
    function normalizeRadian(angle) {
        angle %= PI2$4;
        if (angle < 0) {
            angle += PI2$4;
        }
        return angle;
    }

    var PI2$3 = Math.PI * 2;
    function containStroke$1(cx, cy, r, startAngle, endAngle, anticlockwise, lineWidth, x, y) {
        if (lineWidth === 0) {
            return false;
        }
        var _l = lineWidth;
        x -= cx;
        y -= cy;
        var d = Math.sqrt(x * x + y * y);
        if ((d - _l > r) || (d + _l < r)) {
            return false;
        }
        if (Math.abs(startAngle - endAngle) % PI2$3 < 1e-4) {
            return true;
        }
        if (anticlockwise) {
            var tmp = startAngle;
            startAngle = normalizeRadian(endAngle);
            endAngle = normalizeRadian(tmp);
        }
        else {
            startAngle = normalizeRadian(startAngle);
            endAngle = normalizeRadian(endAngle);
        }
        if (startAngle > endAngle) {
            endAngle += PI2$3;
        }
        var angle = Math.atan2(y, x);
        if (angle < 0) {
            angle += PI2$3;
        }
        return (angle >= startAngle && angle <= endAngle)
            || (angle + PI2$3 >= startAngle && angle + PI2$3 <= endAngle);
    }

    function windingLine(x0, y0, x1, y1, x, y) {
        if ((y > y0 && y > y1) || (y < y0 && y < y1)) {
            return 0;
        }
        if (y1 === y0) {
            return 0;
        }
        var t = (y - y0) / (y1 - y0);
        var dir = y1 < y0 ? 1 : -1;
        if (t === 1 || t === 0) {
            dir = y1 < y0 ? 0.5 : -0.5;
        }
        var x_ = t * (x1 - x0) + x0;
        return x_ === x ? Infinity : x_ > x ? dir : 0;
    }

    var CMD$2 = PathProxy.CMD;
    var PI2$2 = Math.PI * 2;
    var EPSILON$1 = 1e-4;
    function isAroundEqual(a, b) {
        return Math.abs(a - b) < EPSILON$1;
    }
    var roots = [-1, -1, -1];
    var extrema = [-1, -1];
    function swapExtrema() {
        var tmp = extrema[0];
        extrema[0] = extrema[1];
        extrema[1] = tmp;
    }
    function windingCubic(x0, y0, x1, y1, x2, y2, x3, y3, x, y) {
        if ((y > y0 && y > y1 && y > y2 && y > y3)
            || (y < y0 && y < y1 && y < y2 && y < y3)) {
            return 0;
        }
        var nRoots = cubicRootAt(y0, y1, y2, y3, y, roots);
        if (nRoots === 0) {
            return 0;
        }
        else {
            var w = 0;
            var nExtrema = -1;
            var y0_ = void 0;
            var y1_ = void 0;
            for (var i = 0; i < nRoots; i++) {
                var t = roots[i];
                var unit = (t === 0 || t === 1) ? 0.5 : 1;
                var x_ = cubicAt(x0, x1, x2, x3, t);
                if (x_ < x) {
                    continue;
                }
                if (nExtrema < 0) {
                    nExtrema = cubicExtrema(y0, y1, y2, y3, extrema);
                    if (extrema[1] < extrema[0] && nExtrema > 1) {
                        swapExtrema();
                    }
                    y0_ = cubicAt(y0, y1, y2, y3, extrema[0]);
                    if (nExtrema > 1) {
                        y1_ = cubicAt(y0, y1, y2, y3, extrema[1]);
                    }
                }
                if (nExtrema === 2) {
                    if (t < extrema[0]) {
                        w += y0_ < y0 ? unit : -unit;
                    }
                    else if (t < extrema[1]) {
                        w += y1_ < y0_ ? unit : -unit;
                    }
                    else {
                        w += y3 < y1_ ? unit : -unit;
                    }
                }
                else {
                    if (t < extrema[0]) {
                        w += y0_ < y0 ? unit : -unit;
                    }
                    else {
                        w += y3 < y0_ ? unit : -unit;
                    }
                }
            }
            return w;
        }
    }
    function windingQuadratic(x0, y0, x1, y1, x2, y2, x, y) {
        if ((y > y0 && y > y1 && y > y2)
            || (y < y0 && y < y1 && y < y2)) {
            return 0;
        }
        var nRoots = quadraticRootAt(y0, y1, y2, y, roots);
        if (nRoots === 0) {
            return 0;
        }
        else {
            var t = quadraticExtremum(y0, y1, y2);
            if (t >= 0 && t <= 1) {
                var w = 0;
                var y_ = quadraticAt(y0, y1, y2, t);
                for (var i = 0; i < nRoots; i++) {
                    var unit = (roots[i] === 0 || roots[i] === 1) ? 0.5 : 1;
                    var x_ = quadraticAt(x0, x1, x2, roots[i]);
                    if (x_ < x) {
                        continue;
                    }
                    if (roots[i] < t) {
                        w += y_ < y0 ? unit : -unit;
                    }
                    else {
                        w += y2 < y_ ? unit : -unit;
                    }
                }
                return w;
            }
            else {
                var unit = (roots[0] === 0 || roots[0] === 1) ? 0.5 : 1;
                var x_ = quadraticAt(x0, x1, x2, roots[0]);
                if (x_ < x) {
                    return 0;
                }
                return y2 < y0 ? unit : -unit;
            }
        }
    }
    function windingArc(cx, cy, r, startAngle, endAngle, anticlockwise, x, y) {
        y -= cy;
        if (y > r || y < -r) {
            return 0;
        }
        var tmp = Math.sqrt(r * r - y * y);
        roots[0] = -tmp;
        roots[1] = tmp;
        var dTheta = Math.abs(startAngle - endAngle);
        if (dTheta < 1e-4) {
            return 0;
        }
        if (dTheta >= PI2$2 - 1e-4) {
            startAngle = 0;
            endAngle = PI2$2;
            var dir = anticlockwise ? 1 : -1;
            if (x >= roots[0] + cx && x <= roots[1] + cx) {
                return dir;
            }
            else {
                return 0;
            }
        }
        if (startAngle > endAngle) {
            var tmp_1 = startAngle;
            startAngle = endAngle;
            endAngle = tmp_1;
        }
        if (startAngle < 0) {
            startAngle += PI2$2;
            endAngle += PI2$2;
        }
        var w = 0;
        for (var i = 0; i < 2; i++) {
            var x_ = roots[i];
            if (x_ + cx > x) {
                var angle = Math.atan2(y, x_);
                var dir = anticlockwise ? 1 : -1;
                if (angle < 0) {
                    angle = PI2$2 + angle;
                }
                if ((angle >= startAngle && angle <= endAngle)
                    || (angle + PI2$2 >= startAngle && angle + PI2$2 <= endAngle)) {
                    if (angle > Math.PI / 2 && angle < Math.PI * 1.5) {
                        dir = -dir;
                    }
                    w += dir;
                }
            }
        }
        return w;
    }
    function containPath(path, lineWidth, isStroke, x, y) {
        var data = path.data;
        var len = path.len();
        var w = 0;
        var xi = 0;
        var yi = 0;
        var x0 = 0;
        var y0 = 0;
        var x1;
        var y1;
        for (var i = 0; i < len;) {
            var cmd = data[i++];
            var isFirst = i === 1;
            if (cmd === CMD$2.M && i > 1) {
                if (!isStroke) {
                    w += windingLine(xi, yi, x0, y0, x, y);
                }
            }
            if (isFirst) {
                xi = data[i];
                yi = data[i + 1];
                x0 = xi;
                y0 = yi;
            }
            switch (cmd) {
                case CMD$2.M:
                    x0 = data[i++];
                    y0 = data[i++];
                    xi = x0;
                    yi = y0;
                    break;
                case CMD$2.L:
                    if (isStroke) {
                        if (containStroke$4(xi, yi, data[i], data[i + 1], lineWidth, x, y)) {
                            return true;
                        }
                    }
                    else {
                        w += windingLine(xi, yi, data[i], data[i + 1], x, y) || 0;
                    }
                    xi = data[i++];
                    yi = data[i++];
                    break;
                case CMD$2.C:
                    if (isStroke) {
                        if (containStroke$3(xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1], lineWidth, x, y)) {
                            return true;
                        }
                    }
                    else {
                        w += windingCubic(xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1], x, y) || 0;
                    }
                    xi = data[i++];
                    yi = data[i++];
                    break;
                case CMD$2.Q:
                    if (isStroke) {
                        if (containStroke$2(xi, yi, data[i++], data[i++], data[i], data[i + 1], lineWidth, x, y)) {
                            return true;
                        }
                    }
                    else {
                        w += windingQuadratic(xi, yi, data[i++], data[i++], data[i], data[i + 1], x, y) || 0;
                    }
                    xi = data[i++];
                    yi = data[i++];
                    break;
                case CMD$2.A:
                    var cx = data[i++];
                    var cy = data[i++];
                    var rx = data[i++];
                    var ry = data[i++];
                    var theta = data[i++];
                    var dTheta = data[i++];
                    i += 1;
                    var anticlockwise = !!(1 - data[i++]);
                    x1 = Math.cos(theta) * rx + cx;
                    y1 = Math.sin(theta) * ry + cy;
                    if (!isFirst) {
                        w += windingLine(xi, yi, x1, y1, x, y);
                    }
                    else {
                        x0 = x1;
                        y0 = y1;
                    }
                    var _x = (x - cx) * ry / rx + cx;
                    if (isStroke) {
                        if (containStroke$1(cx, cy, ry, theta, theta + dTheta, anticlockwise, lineWidth, _x, y)) {
                            return true;
                        }
                    }
                    else {
                        w += windingArc(cx, cy, ry, theta, theta + dTheta, anticlockwise, _x, y);
                    }
                    xi = Math.cos(theta + dTheta) * rx + cx;
                    yi = Math.sin(theta + dTheta) * ry + cy;
                    break;
                case CMD$2.R:
                    x0 = xi = data[i++];
                    y0 = yi = data[i++];
                    var width = data[i++];
                    var height = data[i++];
                    x1 = x0 + width;
                    y1 = y0 + height;
                    if (isStroke) {
                        if (containStroke$4(x0, y0, x1, y0, lineWidth, x, y)
                            || containStroke$4(x1, y0, x1, y1, lineWidth, x, y)
                            || containStroke$4(x1, y1, x0, y1, lineWidth, x, y)
                            || containStroke$4(x0, y1, x0, y0, lineWidth, x, y)) {
                            return true;
                        }
                    }
                    else {
                        w += windingLine(x1, y0, x1, y1, x, y);
                        w += windingLine(x0, y1, x0, y0, x, y);
                    }
                    break;
                case CMD$2.Z:
                    if (isStroke) {
                        if (containStroke$4(xi, yi, x0, y0, lineWidth, x, y)) {
                            return true;
                        }
                    }
                    else {
                        w += windingLine(xi, yi, x0, y0, x, y);
                    }
                    xi = x0;
                    yi = y0;
                    break;
            }
        }
        if (!isStroke && !isAroundEqual(yi, y0)) {
            w += windingLine(xi, yi, x0, y0, x, y) || 0;
        }
        return w !== 0;
    }
    function contain(pathProxy, x, y) {
        return containPath(pathProxy, 0, false, x, y);
    }
    function containStroke(pathProxy, lineWidth, x, y) {
        return containPath(pathProxy, lineWidth, true, x, y);
    }

    var DEFAULT_PATH_STYLE = defaults({
        fill: '#000',
        stroke: null,
        strokePercent: 1,
        fillOpacity: 1,
        strokeOpacity: 1,
        lineDashOffset: 0,
        lineWidth: 1,
        lineCap: 'butt',
        miterLimit: 10,
        strokeNoScale: false,
        strokeFirst: false
    }, DEFAULT_COMMON_STYLE);
    var DEFAULT_PATH_ANIMATION_PROPS = {
        style: defaults({
            fill: true,
            stroke: true,
            strokePercent: true,
            fillOpacity: true,
            strokeOpacity: true,
            lineDashOffset: true,
            lineWidth: true,
            miterLimit: true
        }, DEFAULT_COMMON_ANIMATION_PROPS.style)
    };
    var pathCopyParams = [
        'x', 'y', 'rotation', 'scaleX', 'scaleY', 'originX', 'originY', 'invisible',
        'culling', 'z', 'z2', 'zlevel', 'parent'
    ];
    var Path = (function (_super) {
        __extends(Path, _super);
        function Path(opts) {
            return _super.call(this, opts) || this;
        }
        Path.prototype.update = function () {
            var _this = this;
            _super.prototype.update.call(this);
            var style = this.style;
            if (style.decal) {
                var decalEl = this._decalEl = this._decalEl || new Path();
                if (decalEl.buildPath === Path.prototype.buildPath) {
                    decalEl.buildPath = function (ctx) {
                        _this.buildPath(ctx, _this.shape);
                    };
                }
                decalEl.silent = true;
                var decalElStyle = decalEl.style;
                for (var key in style) {
                    if (decalElStyle[key] !== style[key]) {
                        decalElStyle[key] = style[key];
                    }
                }
                decalElStyle.fill = style.fill ? style.decal : null;
                decalElStyle.decal = null;
                decalElStyle.shadowColor = null;
                style.strokeFirst && (decalElStyle.stroke = null);
                for (var i = 0; i < pathCopyParams.length; ++i) {
                    decalEl[pathCopyParams[i]] = this[pathCopyParams[i]];
                }
                decalEl.__dirty |= REDARAW_BIT;
            }
            else if (this._decalEl) {
                this._decalEl = null;
            }
        };
        Path.prototype.getDecalElement = function () {
            return this._decalEl;
        };
        Path.prototype._init = function (props) {
            var keysArr = keys$1(props);
            this.shape = this.getDefaultShape();
            var defaultStyle = this.getDefaultStyle();
            if (defaultStyle) {
                this.useStyle(defaultStyle);
            }
            for (var i = 0; i < keysArr.length; i++) {
                var key = keysArr[i];
                var value = props[key];
                if (key === 'style') {
                    if (!this.style) {
                        this.useStyle(value);
                    }
                    else {
                        extend(this.style, value);
                    }
                }
                else if (key === 'shape') {
                    extend(this.shape, value);
                }
                else {
                    _super.prototype.attrKV.call(this, key, value);
                }
            }
            if (!this.style) {
                this.useStyle({});
            }
        };
        Path.prototype.getDefaultStyle = function () {
            return null;
        };
        Path.prototype.getDefaultShape = function () {
            return {};
        };
        Path.prototype.canBeInsideText = function () {
            return this.hasFill();
        };
        Path.prototype.getInsideTextFill = function () {
            var pathFill = this.style.fill;
            if (pathFill !== 'none') {
                if (isString(pathFill)) {
                    var fillLum = lum(pathFill, 0);
                    if (fillLum > 0.5) {
                        return DARK_LABEL_COLOR;
                    }
                    else if (fillLum > 0.2) {
                        return LIGHTER_LABEL_COLOR;
                    }
                    return LIGHT_LABEL_COLOR;
                }
                else if (pathFill) {
                    return LIGHT_LABEL_COLOR;
                }
            }
            return DARK_LABEL_COLOR;
        };
        Path.prototype.getInsideTextStroke = function (textFill) {
            var pathFill = this.style.fill;
            if (isString(pathFill)) {
                var zr = this.__zr;
                var isDarkMode = !!(zr && zr.isDarkMode());
                var isDarkLabel = lum(textFill, 0) < DARK_MODE_THRESHOLD;
                if (isDarkMode === isDarkLabel) {
                    return pathFill;
                }
            }
        };
        Path.prototype.buildPath = function (ctx, shapeCfg, inBundle) { };
        Path.prototype.pathUpdated = function () {
            this.__dirty &= ~SHAPE_CHANGED_BIT;
        };
        Path.prototype.createPathProxy = function () {
            this.path = new PathProxy(false);
        };
        Path.prototype.hasStroke = function () {
            var style = this.style;
            var stroke = style.stroke;
            return !(stroke == null || stroke === 'none' || !(style.lineWidth > 0));
        };
        Path.prototype.hasFill = function () {
            var style = this.style;
            var fill = style.fill;
            return fill != null && fill !== 'none';
        };
        Path.prototype.getBoundingRect = function () {
            var rect = this._rect;
            var style = this.style;
            var needsUpdateRect = !rect;
            if (needsUpdateRect) {
                var firstInvoke = false;
                if (!this.path) {
                    firstInvoke = true;
                    this.createPathProxy();
                }
                var path = this.path;
                if (firstInvoke || (this.__dirty & SHAPE_CHANGED_BIT)) {
                    path.beginPath();
                    this.buildPath(path, this.shape, false);
                    this.pathUpdated();
                }
                rect = path.getBoundingRect();
            }
            this._rect = rect;
            if (this.hasStroke() && this.path && this.path.len() > 0) {
                var rectWithStroke = this._rectWithStroke || (this._rectWithStroke = rect.clone());
                if (this.__dirty || needsUpdateRect) {
                    rectWithStroke.copy(rect);
                    var lineScale = style.strokeNoScale ? this.getLineScale() : 1;
                    var w = style.lineWidth;
                    if (!this.hasFill()) {
                        var strokeContainThreshold = this.strokeContainThreshold;
                        w = Math.max(w, strokeContainThreshold == null ? 4 : strokeContainThreshold);
                    }
                    if (lineScale > 1e-10) {
                        rectWithStroke.width += w / lineScale;
                        rectWithStroke.height += w / lineScale;
                        rectWithStroke.x -= w / lineScale / 2;
                        rectWithStroke.y -= w / lineScale / 2;
                    }
                }
                return rectWithStroke;
            }
            return rect;
        };
        Path.prototype.contain = function (x, y) {
            var localPos = this.transformCoordToLocal(x, y);
            var rect = this.getBoundingRect();
            var style = this.style;
            x = localPos[0];
            y = localPos[1];
            if (rect.contain(x, y)) {
                var pathProxy = this.path;
                if (this.hasStroke()) {
                    var lineWidth = style.lineWidth;
                    var lineScale = style.strokeNoScale ? this.getLineScale() : 1;
                    if (lineScale > 1e-10) {
                        if (!this.hasFill()) {
                            lineWidth = Math.max(lineWidth, this.strokeContainThreshold);
                        }
                        if (containStroke(pathProxy, lineWidth / lineScale, x, y)) {
                            return true;
                        }
                    }
                }
                if (this.hasFill()) {
                    return contain(pathProxy, x, y);
                }
            }
            return false;
        };
        Path.prototype.dirtyShape = function () {
            this.__dirty |= SHAPE_CHANGED_BIT;
            if (this._rect) {
                this._rect = null;
            }
            if (this._decalEl) {
                this._decalEl.dirtyShape();
            }
            this.markRedraw();
        };
        Path.prototype.dirty = function () {
            this.dirtyStyle();
            this.dirtyShape();
        };
        Path.prototype.animateShape = function (loop) {
            return this.animate('shape', loop);
        };
        Path.prototype.updateDuringAnimation = function (targetKey) {
            if (targetKey === 'style') {
                this.dirtyStyle();
            }
            else if (targetKey === 'shape') {
                this.dirtyShape();
            }
            else {
                this.markRedraw();
            }
        };
        Path.prototype.attrKV = function (key, value) {
            if (key === 'shape') {
                this.setShape(value);
            }
            else {
                _super.prototype.attrKV.call(this, key, value);
            }
        };
        Path.prototype.setShape = function (keyOrObj, value) {
            var shape = this.shape;
            if (!shape) {
                shape = this.shape = {};
            }
            if (typeof keyOrObj === 'string') {
                shape[keyOrObj] = value;
            }
            else {
                extend(shape, keyOrObj);
            }
            this.dirtyShape();
            return this;
        };
        Path.prototype.shapeChanged = function () {
            return !!(this.__dirty & SHAPE_CHANGED_BIT);
        };
        Path.prototype.createStyle = function (obj) {
            return createObject(DEFAULT_PATH_STYLE, obj);
        };
        Path.prototype._innerSaveToNormal = function (toState) {
            _super.prototype._innerSaveToNormal.call(this, toState);
            var normalState = this._normalState;
            if (toState.shape && !normalState.shape) {
                normalState.shape = extend({}, this.shape);
            }
        };
        Path.prototype._applyStateObj = function (stateName, state, normalState, keepCurrentStates, transition, animationCfg) {
            _super.prototype._applyStateObj.call(this, stateName, state, normalState, keepCurrentStates, transition, animationCfg);
            var needsRestoreToNormal = !(state && keepCurrentStates);
            var targetShape;
            if (state && state.shape) {
                if (transition) {
                    if (keepCurrentStates) {
                        targetShape = state.shape;
                    }
                    else {
                        targetShape = extend({}, normalState.shape);
                        extend(targetShape, state.shape);
                    }
                }
                else {
                    targetShape = extend({}, keepCurrentStates ? this.shape : normalState.shape);
                    extend(targetShape, state.shape);
                }
            }
            else if (needsRestoreToNormal) {
                targetShape = normalState.shape;
            }
            if (targetShape) {
                if (transition) {
                    this.shape = extend({}, this.shape);
                    var targetShapePrimaryProps = {};
                    var shapeKeys = keys$1(targetShape);
                    for (var i = 0; i < shapeKeys.length; i++) {
                        var key = shapeKeys[i];
                        if (typeof targetShape[key] === 'object') {
                            this.shape[key] = targetShape[key];
                        }
                        else {
                            targetShapePrimaryProps[key] = targetShape[key];
                        }
                    }
                    this._transitionState(stateName, {
                        shape: targetShapePrimaryProps
                    }, animationCfg);
                }
                else {
                    this.shape = targetShape;
                    this.dirtyShape();
                }
            }
        };
        Path.prototype._mergeStates = function (states) {
            var mergedState = _super.prototype._mergeStates.call(this, states);
            var mergedShape;
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                if (state.shape) {
                    mergedShape = mergedShape || {};
                    this._mergeStyle(mergedShape, state.shape);
                }
            }
            if (mergedShape) {
                mergedState.shape = mergedShape;
            }
            return mergedState;
        };
        Path.prototype.getAnimationStyleProps = function () {
            return DEFAULT_PATH_ANIMATION_PROPS;
        };
        Path.prototype.isZeroArea = function () {
            return false;
        };
        Path.extend = function (defaultProps) {
            var Sub = (function (_super) {
                __extends(Sub, _super);
                function Sub(opts) {
                    var _this = _super.call(this, opts) || this;
                    defaultProps.init && defaultProps.init.call(_this, opts);
                    return _this;
                }
                Sub.prototype.getDefaultStyle = function () {
                    return clone$2(defaultProps.style);
                };
                Sub.prototype.getDefaultShape = function () {
                    return clone$2(defaultProps.shape);
                };
                return Sub;
            }(Path));
            for (var key in defaultProps) {
                if (typeof defaultProps[key] === 'function') {
                    Sub.prototype[key] = defaultProps[key];
                }
            }
            return Sub;
        };
        Path.initDefaultProps = (function () {
            var pathProto = Path.prototype;
            pathProto.type = 'path';
            pathProto.strokeContainThreshold = 5;
            pathProto.segmentIgnoreThreshold = 0;
            pathProto.subPixelOptimize = false;
            pathProto.autoBatch = false;
            pathProto.__dirty = REDARAW_BIT | STYLE_CHANGED_BIT | SHAPE_CHANGED_BIT;
        })();
        return Path;
    }(Displayable));

    var DEFAULT_IMAGE_STYLE = defaults({
        x: 0,
        y: 0
    }, DEFAULT_COMMON_STYLE);
    var DEFAULT_IMAGE_ANIMATION_PROPS = {
        style: defaults({
            x: true,
            y: true,
            width: true,
            height: true,
            sx: true,
            sy: true,
            sWidth: true,
            sHeight: true
        }, DEFAULT_COMMON_ANIMATION_PROPS.style)
    };
    function isImageLike(source) {
        return !!(source
            && typeof source !== 'string'
            && source.width && source.height);
    }
    var ZRImage = (function (_super) {
        __extends(ZRImage, _super);
        function ZRImage() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ZRImage.prototype.createStyle = function (obj) {
            return createObject(DEFAULT_IMAGE_STYLE, obj);
        };
        ZRImage.prototype._getSize = function (dim) {
            var style = this.style;
            var size = style[dim];
            if (size != null) {
                return size;
            }
            var imageSource = isImageLike(style.image)
                ? style.image : this.__image;
            if (!imageSource) {
                return 0;
            }
            var otherDim = dim === 'width' ? 'height' : 'width';
            var otherDimSize = style[otherDim];
            if (otherDimSize == null) {
                return imageSource[dim];
            }
            else {
                return imageSource[dim] / imageSource[otherDim] * otherDimSize;
            }
        };
        ZRImage.prototype.getWidth = function () {
            return this._getSize('width');
        };
        ZRImage.prototype.getHeight = function () {
            return this._getSize('height');
        };
        ZRImage.prototype.getAnimationStyleProps = function () {
            return DEFAULT_IMAGE_ANIMATION_PROPS;
        };
        ZRImage.prototype.getBoundingRect = function () {
            var style = this.style;
            if (!this._rect) {
                this._rect = new BoundingRect(style.x || 0, style.y || 0, this.getWidth(), this.getHeight());
            }
            return this._rect;
        };
        return ZRImage;
    }(Displayable));
    ZRImage.prototype.type = 'image';

    var DEFAULT_TSPAN_STYLE = defaults({
        strokeFirst: true,
        font: DEFAULT_FONT,
        x: 0,
        y: 0,
        textAlign: 'left',
        textBaseline: 'top',
        miterLimit: 2
    }, DEFAULT_PATH_STYLE);
    var TSpan = (function (_super) {
        __extends(TSpan, _super);
        function TSpan() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TSpan.prototype.hasStroke = function () {
            var style = this.style;
            var stroke = style.stroke;
            return stroke != null && stroke !== 'none' && style.lineWidth > 0;
        };
        TSpan.prototype.hasFill = function () {
            var style = this.style;
            var fill = style.fill;
            return fill != null && fill !== 'none';
        };
        TSpan.prototype.createStyle = function (obj) {
            return createObject(DEFAULT_TSPAN_STYLE, obj);
        };
        TSpan.prototype.setBoundingRect = function (rect) {
            this._rect = rect;
        };
        TSpan.prototype.getBoundingRect = function () {
            var style = this.style;
            if (!this._rect) {
                var text = style.text;
                text != null ? (text += '') : (text = '');
                var rect = getBoundingRect(text, style.font, style.textAlign, style.textBaseline);
                rect.x += style.x || 0;
                rect.y += style.y || 0;
                if (this.hasStroke()) {
                    var w = style.lineWidth;
                    rect.x -= w / 2;
                    rect.y -= w / 2;
                    rect.width += w;
                    rect.height += w;
                }
                this._rect = rect;
            }
            return this._rect;
        };
        TSpan.initDefaultProps = (function () {
            var tspanProto = TSpan.prototype;
            tspanProto.dirtyRectTolerance = 10;
        })();
        return TSpan;
    }(Displayable));
    TSpan.prototype.type = 'tspan';

    function normalizeLineDash(lineType, lineWidth) {
        if (!lineType || lineType === 'solid' || !(lineWidth > 0)) {
            return null;
        }
        lineWidth = lineWidth || 1;
        return lineType === 'dashed'
            ? [4 * lineWidth, 2 * lineWidth]
            : lineType === 'dotted'
                ? [lineWidth]
                : isNumber(lineType)
                    ? [lineType] : isArray$1(lineType) ? lineType : null;
    }

    var m = [];
    var IncrementalDisplayable = (function (_super) {
        __extends(IncrementalDisplayable, _super);
        function IncrementalDisplayable() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.notClear = true;
            _this.incremental = true;
            _this._displayables = [];
            _this._temporaryDisplayables = [];
            _this._cursor = 0;
            return _this;
        }
        IncrementalDisplayable.prototype.traverse = function (cb, context) {
            cb.call(context, this);
        };
        IncrementalDisplayable.prototype.useStyle = function () {
            this.style = {};
        };
        IncrementalDisplayable.prototype.getCursor = function () {
            return this._cursor;
        };
        IncrementalDisplayable.prototype.innerAfterBrush = function () {
            this._cursor = this._displayables.length;
        };
        IncrementalDisplayable.prototype.clearDisplaybles = function () {
            this._displayables = [];
            this._temporaryDisplayables = [];
            this._cursor = 0;
            this.markRedraw();
            this.notClear = false;
        };
        IncrementalDisplayable.prototype.clearTemporalDisplayables = function () {
            this._temporaryDisplayables = [];
        };
        IncrementalDisplayable.prototype.addDisplayable = function (displayable, notPersistent) {
            if (notPersistent) {
                this._temporaryDisplayables.push(displayable);
            }
            else {
                this._displayables.push(displayable);
            }
            this.markRedraw();
        };
        IncrementalDisplayable.prototype.addDisplayables = function (displayables, notPersistent) {
            notPersistent = notPersistent || false;
            for (var i = 0; i < displayables.length; i++) {
                this.addDisplayable(displayables[i], notPersistent);
            }
        };
        IncrementalDisplayable.prototype.getDisplayables = function () {
            return this._displayables;
        };
        IncrementalDisplayable.prototype.getTemporalDisplayables = function () {
            return this._temporaryDisplayables;
        };
        IncrementalDisplayable.prototype.eachPendingDisplayable = function (cb) {
            for (var i = this._cursor; i < this._displayables.length; i++) {
                cb && cb(this._displayables[i]);
            }
            for (var i = 0; i < this._temporaryDisplayables.length; i++) {
                cb && cb(this._temporaryDisplayables[i]);
            }
        };
        IncrementalDisplayable.prototype.update = function () {
            this.updateTransform();
            for (var i = this._cursor; i < this._displayables.length; i++) {
                var displayable = this._displayables[i];
                displayable.parent = this;
                displayable.update();
                displayable.parent = null;
            }
            for (var i = 0; i < this._temporaryDisplayables.length; i++) {
                var displayable = this._temporaryDisplayables[i];
                displayable.parent = this;
                displayable.update();
                displayable.parent = null;
            }
        };
        IncrementalDisplayable.prototype.getBoundingRect = function () {
            if (!this._rect) {
                var rect = new BoundingRect(Infinity, Infinity, -Infinity, -Infinity);
                for (var i = 0; i < this._displayables.length; i++) {
                    var displayable = this._displayables[i];
                    var childRect = displayable.getBoundingRect().clone();
                    if (displayable.needLocalTransform()) {
                        childRect.applyTransform(displayable.getLocalTransform(m));
                    }
                    rect.union(childRect);
                }
                this._rect = rect;
            }
            return this._rect;
        };
        IncrementalDisplayable.prototype.contain = function (x, y) {
            var localPos = this.transformCoordToLocal(x, y);
            var rect = this.getBoundingRect();
            if (rect.contain(localPos[0], localPos[1])) {
                for (var i = 0; i < this._displayables.length; i++) {
                    var displayable = this._displayables[i];
                    if (displayable.contain(x, y)) {
                        return true;
                    }
                }
            }
            return false;
        };
        return IncrementalDisplayable;
    }(Displayable));

    var pathProxyForDraw = new PathProxy(true);
    function styleHasStroke(style) {
        var stroke = style.stroke;
        return !(stroke == null || stroke === 'none' || !(style.lineWidth > 0));
    }
    function styleHasFill(style) {
        var fill = style.fill;
        return fill != null && fill !== 'none';
    }
    function doFillPath(ctx, style) {
        if (style.fillOpacity != null && style.fillOpacity !== 1) {
            var originalGlobalAlpha = ctx.globalAlpha;
            ctx.globalAlpha = style.fillOpacity * style.opacity;
            ctx.fill();
            ctx.globalAlpha = originalGlobalAlpha;
        }
        else {
            ctx.fill();
        }
    }
    function doStrokePath(ctx, style) {
        if (style.strokeOpacity != null && style.strokeOpacity !== 1) {
            var originalGlobalAlpha = ctx.globalAlpha;
            ctx.globalAlpha = style.strokeOpacity * style.opacity;
            ctx.stroke();
            ctx.globalAlpha = originalGlobalAlpha;
        }
        else {
            ctx.stroke();
        }
    }
    function createCanvasPattern(ctx, pattern, el) {
        var image = createOrUpdateImage(pattern.image, pattern.__image, el);
        if (isImageReady(image)) {
            var canvasPattern = ctx.createPattern(image, pattern.repeat || 'repeat');
            if (typeof DOMMatrix === 'function'
                && canvasPattern.setTransform) {
                var matrix = new DOMMatrix();
                matrix.rotateSelf(0, 0, (pattern.rotation || 0) / Math.PI * 180);
                matrix.scaleSelf((pattern.scaleX || 1), (pattern.scaleY || 1));
                matrix.translateSelf((pattern.x || 0), (pattern.y || 0));
                canvasPattern.setTransform(matrix);
            }
            return canvasPattern;
        }
    }
    function brushPath(ctx, el, style, inBatch) {
        var hasStroke = styleHasStroke(style);
        var hasFill = styleHasFill(style);
        var strokePercent = style.strokePercent;
        var strokePart = strokePercent < 1;
        var firstDraw = !el.path;
        if ((!el.silent || strokePart) && firstDraw) {
            el.createPathProxy();
        }
        var path = el.path || pathProxyForDraw;
        if (!inBatch) {
            var fill = style.fill;
            var stroke = style.stroke;
            var hasFillGradient = hasFill && !!fill.colorStops;
            var hasStrokeGradient = hasStroke && !!stroke.colorStops;
            var hasFillPattern = hasFill && !!fill.image;
            var hasStrokePattern = hasStroke && !!stroke.image;
            var fillGradient = void 0;
            var strokeGradient = void 0;
            var fillPattern = void 0;
            var strokePattern = void 0;
            var rect = void 0;
            if (hasFillGradient || hasStrokeGradient) {
                rect = el.getBoundingRect();
            }
            if (hasFillGradient) {
                fillGradient = el.__dirty
                    ? getCanvasGradient(ctx, fill, rect)
                    : el.__canvasFillGradient;
                el.__canvasFillGradient = fillGradient;
            }
            if (hasStrokeGradient) {
                strokeGradient = el.__dirty
                    ? getCanvasGradient(ctx, stroke, rect)
                    : el.__canvasStrokeGradient;
                el.__canvasStrokeGradient = strokeGradient;
            }
            if (hasFillPattern) {
                fillPattern = (el.__dirty || !el.__canvasFillPattern)
                    ? createCanvasPattern(ctx, fill, el)
                    : el.__canvasFillPattern;
                el.__canvasFillPattern = fillPattern;
            }
            if (hasStrokePattern) {
                strokePattern = (el.__dirty || !el.__canvasStrokePattern)
                    ? createCanvasPattern(ctx, stroke, el)
                    : el.__canvasStrokePattern;
                el.__canvasStrokePattern = fillPattern;
            }
            if (hasFillGradient) {
                ctx.fillStyle = fillGradient;
            }
            else if (hasFillPattern) {
                if (fillPattern) {
                    ctx.fillStyle = fillPattern;
                }
                else {
                    hasFill = false;
                }
            }
            if (hasStrokeGradient) {
                ctx.strokeStyle = strokeGradient;
            }
            else if (hasStrokePattern) {
                if (strokePattern) {
                    ctx.strokeStyle = strokePattern;
                }
                else {
                    hasStroke = false;
                }
            }
        }
        var lineDash = style.lineDash && style.lineWidth > 0 && normalizeLineDash(style.lineDash, style.lineWidth);
        var lineDashOffset = style.lineDashOffset;
        var ctxLineDash = !!ctx.setLineDash;
        var scale = el.getGlobalScale();
        path.setScale(scale[0], scale[1], el.segmentIgnoreThreshold);
        if (lineDash) {
            var lineScale_1 = (style.strokeNoScale && el.getLineScale) ? el.getLineScale() : 1;
            if (lineScale_1 && lineScale_1 !== 1) {
                lineDash = map(lineDash, function (rawVal) {
                    return rawVal / lineScale_1;
                });
                lineDashOffset /= lineScale_1;
            }
        }
        var needsRebuild = true;
        if (firstDraw || (el.__dirty & SHAPE_CHANGED_BIT)
            || (lineDash && !ctxLineDash && hasStroke)) {
            path.setDPR(ctx.dpr);
            if (strokePart) {
                path.setContext(null);
            }
            else {
                path.setContext(ctx);
                needsRebuild = false;
            }
            path.reset();
            if (lineDash && !ctxLineDash) {
                path.setLineDash(lineDash);
                path.setLineDashOffset(lineDashOffset);
            }
            el.buildPath(path, el.shape, inBatch);
            path.toStatic();
            el.pathUpdated();
        }
        if (needsRebuild) {
            path.rebuildPath(ctx, strokePart ? strokePercent : 1);
        }
        if (lineDash && ctxLineDash) {
            ctx.setLineDash(lineDash);
            ctx.lineDashOffset = lineDashOffset;
        }
        if (!inBatch) {
            if (style.strokeFirst) {
                if (hasStroke) {
                    doStrokePath(ctx, style);
                }
                if (hasFill) {
                    doFillPath(ctx, style);
                }
            }
            else {
                if (hasFill) {
                    doFillPath(ctx, style);
                }
                if (hasStroke) {
                    doStrokePath(ctx, style);
                }
            }
        }
        if (lineDash && ctxLineDash) {
            ctx.setLineDash([]);
        }
    }
    function brushImage(ctx, el, style) {
        var image = el.__image = createOrUpdateImage(style.image, el.__image, el, el.onload);
        if (!image || !isImageReady(image)) {
            return;
        }
        var x = style.x || 0;
        var y = style.y || 0;
        var width = el.getWidth();
        var height = el.getHeight();
        var aspect = image.width / image.height;
        if (width == null && height != null) {
            width = height * aspect;
        }
        else if (height == null && width != null) {
            height = width / aspect;
        }
        else if (width == null && height == null) {
            width = image.width;
            height = image.height;
        }
        if (style.sWidth && style.sHeight) {
            var sx = style.sx || 0;
            var sy = style.sy || 0;
            ctx.drawImage(image, sx, sy, style.sWidth, style.sHeight, x, y, width, height);
        }
        else if (style.sx && style.sy) {
            var sx = style.sx;
            var sy = style.sy;
            var sWidth = width - sx;
            var sHeight = height - sy;
            ctx.drawImage(image, sx, sy, sWidth, sHeight, x, y, width, height);
        }
        else {
            ctx.drawImage(image, x, y, width, height);
        }
    }
    function brushText(ctx, el, style) {
        var text = style.text;
        text != null && (text += '');
        if (text) {
            ctx.font = style.font || DEFAULT_FONT;
            ctx.textAlign = style.textAlign;
            ctx.textBaseline = style.textBaseline;
            var hasLineDash = void 0;
            if (ctx.setLineDash) {
                var lineDash = style.lineDash && style.lineWidth > 0 && normalizeLineDash(style.lineDash, style.lineWidth);
                var lineDashOffset = style.lineDashOffset;
                if (lineDash) {
                    var lineScale_2 = (style.strokeNoScale && el.getLineScale) ? el.getLineScale() : 1;
                    if (lineScale_2 && lineScale_2 !== 1) {
                        lineDash = map(lineDash, function (rawVal) {
                            return rawVal / lineScale_2;
                        });
                        lineDashOffset /= lineScale_2;
                    }
                    ctx.setLineDash(lineDash);
                    ctx.lineDashOffset = lineDashOffset;
                    hasLineDash = true;
                }
            }
            if (style.strokeFirst) {
                if (styleHasStroke(style)) {
                    ctx.strokeText(text, style.x, style.y);
                }
                if (styleHasFill(style)) {
                    ctx.fillText(text, style.x, style.y);
                }
            }
            else {
                if (styleHasFill(style)) {
                    ctx.fillText(text, style.x, style.y);
                }
                if (styleHasStroke(style)) {
                    ctx.strokeText(text, style.x, style.y);
                }
            }
            if (hasLineDash) {
                ctx.setLineDash([]);
            }
        }
    }
    var SHADOW_NUMBER_PROPS = ['shadowBlur', 'shadowOffsetX', 'shadowOffsetY'];
    var STROKE_PROPS = [
        ['lineCap', 'butt'], ['lineJoin', 'miter'], ['miterLimit', 10]
    ];
    function bindCommonProps(ctx, style, prevStyle, forceSetAll, scope) {
        var styleChanged = false;
        if (!forceSetAll) {
            prevStyle = prevStyle || {};
            if (style === prevStyle) {
                return false;
            }
        }
        if (forceSetAll || style.opacity !== prevStyle.opacity) {
            if (!styleChanged) {
                flushPathDrawn(ctx, scope);
                styleChanged = true;
            }
            var opacity = Math.max(Math.min(style.opacity, 1), 0);
            ctx.globalAlpha = isNaN(opacity) ? DEFAULT_COMMON_STYLE.opacity : opacity;
        }
        if (forceSetAll || style.blend !== prevStyle.blend) {
            if (!styleChanged) {
                flushPathDrawn(ctx, scope);
                styleChanged = true;
            }
            ctx.globalCompositeOperation = style.blend || DEFAULT_COMMON_STYLE.blend;
        }
        for (var i = 0; i < SHADOW_NUMBER_PROPS.length; i++) {
            var propName = SHADOW_NUMBER_PROPS[i];
            if (forceSetAll || style[propName] !== prevStyle[propName]) {
                if (!styleChanged) {
                    flushPathDrawn(ctx, scope);
                    styleChanged = true;
                }
                ctx[propName] = ctx.dpr * (style[propName] || 0);
            }
        }
        if (forceSetAll || style.shadowColor !== prevStyle.shadowColor) {
            if (!styleChanged) {
                flushPathDrawn(ctx, scope);
                styleChanged = true;
            }
            ctx.shadowColor = style.shadowColor || DEFAULT_COMMON_STYLE.shadowColor;
        }
        return styleChanged;
    }
    function bindPathAndTextCommonStyle(ctx, el, prevEl, forceSetAll, scope) {
        var style = getStyle(el, scope.inHover);
        var prevStyle = forceSetAll
            ? null
            : (prevEl && getStyle(prevEl, scope.inHover) || {});
        if (style === prevStyle) {
            return false;
        }
        var styleChanged = bindCommonProps(ctx, style, prevStyle, forceSetAll, scope);
        if (forceSetAll || style.fill !== prevStyle.fill) {
            if (!styleChanged) {
                flushPathDrawn(ctx, scope);
                styleChanged = true;
            }
            ctx.fillStyle = style.fill;
        }
        if (forceSetAll || style.stroke !== prevStyle.stroke) {
            if (!styleChanged) {
                flushPathDrawn(ctx, scope);
                styleChanged = true;
            }
            ctx.strokeStyle = style.stroke;
        }
        if (forceSetAll || style.opacity !== prevStyle.opacity) {
            if (!styleChanged) {
                flushPathDrawn(ctx, scope);
                styleChanged = true;
            }
            ctx.globalAlpha = style.opacity == null ? 1 : style.opacity;
        }
        if (el.hasStroke()) {
            var lineWidth = style.lineWidth;
            var newLineWidth = lineWidth / ((style.strokeNoScale && el && el.getLineScale) ? el.getLineScale() : 1);
            if (ctx.lineWidth !== newLineWidth) {
                if (!styleChanged) {
                    flushPathDrawn(ctx, scope);
                    styleChanged = true;
                }
                ctx.lineWidth = newLineWidth;
            }
        }
        for (var i = 0; i < STROKE_PROPS.length; i++) {
            var prop = STROKE_PROPS[i];
            var propName = prop[0];
            if (forceSetAll || style[propName] !== prevStyle[propName]) {
                if (!styleChanged) {
                    flushPathDrawn(ctx, scope);
                    styleChanged = true;
                }
                ctx[propName] = style[propName] || prop[1];
            }
        }
        return styleChanged;
    }
    function bindImageStyle(ctx, el, prevEl, forceSetAll, scope) {
        return bindCommonProps(ctx, getStyle(el, scope.inHover), prevEl && getStyle(prevEl, scope.inHover), forceSetAll, scope);
    }
    function setContextTransform(ctx, el) {
        var m = el.transform;
        var dpr = ctx.dpr || 1;
        if (m) {
            ctx.setTransform(dpr * m[0], dpr * m[1], dpr * m[2], dpr * m[3], dpr * m[4], dpr * m[5]);
        }
        else {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
    }
    function updateClipStatus(clipPaths, ctx, scope) {
        var allClipped = false;
        for (var i = 0; i < clipPaths.length; i++) {
            var clipPath = clipPaths[i];
            allClipped = allClipped || clipPath.isZeroArea();
            setContextTransform(ctx, clipPath);
            ctx.beginPath();
            clipPath.buildPath(ctx, clipPath.shape);
            ctx.clip();
        }
        scope.allClipped = allClipped;
    }
    function isTransformChanged(m0, m1) {
        if (m0 && m1) {
            return m0[0] !== m1[0]
                || m0[1] !== m1[1]
                || m0[2] !== m1[2]
                || m0[3] !== m1[3]
                || m0[4] !== m1[4]
                || m0[5] !== m1[5];
        }
        else if (!m0 && !m1) {
            return false;
        }
        return true;
    }
    var DRAW_TYPE_PATH = 1;
    var DRAW_TYPE_IMAGE = 2;
    var DRAW_TYPE_TEXT = 3;
    var DRAW_TYPE_INCREMENTAL = 4;
    function canPathBatch(style) {
        var hasFill = styleHasFill(style);
        var hasStroke = styleHasStroke(style);
        return !(style.lineDash
            || !(+hasFill ^ +hasStroke)
            || (hasFill && typeof style.fill !== 'string')
            || (hasStroke && typeof style.stroke !== 'string')
            || style.strokePercent < 1
            || style.strokeOpacity < 1
            || style.fillOpacity < 1);
    }
    function flushPathDrawn(ctx, scope) {
        scope.batchFill && ctx.fill();
        scope.batchStroke && ctx.stroke();
        scope.batchFill = '';
        scope.batchStroke = '';
    }
    function getStyle(el, inHover) {
        return inHover ? (el.__hoverStyle || el.style) : el.style;
    }
    function brushSingle(ctx, el) {
        brush(ctx, el, { inHover: false, viewWidth: 0, viewHeight: 0 }, true);
    }
    function brush(ctx, el, scope, isLast) {
        var m = el.transform;
        if (!el.shouldBePainted(scope.viewWidth, scope.viewHeight, false, false)) {
            el.__dirty &= ~REDARAW_BIT;
            el.__isRendered = false;
            return;
        }
        var clipPaths = el.__clipPaths;
        var prevElClipPaths = scope.prevElClipPaths;
        var forceSetTransform = false;
        var forceSetStyle = false;
        if (!prevElClipPaths || isClipPathChanged(clipPaths, prevElClipPaths)) {
            if (prevElClipPaths && prevElClipPaths.length) {
                flushPathDrawn(ctx, scope);
                ctx.restore();
                forceSetStyle = forceSetTransform = true;
                scope.prevElClipPaths = null;
                scope.allClipped = false;
                scope.prevEl = null;
            }
            if (clipPaths && clipPaths.length) {
                flushPathDrawn(ctx, scope);
                ctx.save();
                updateClipStatus(clipPaths, ctx, scope);
                forceSetTransform = true;
            }
            scope.prevElClipPaths = clipPaths;
        }
        if (scope.allClipped) {
            el.__isRendered = false;
            return;
        }
        el.beforeBrush && el.beforeBrush();
        el.innerBeforeBrush();
        var prevEl = scope.prevEl;
        if (!prevEl) {
            forceSetStyle = forceSetTransform = true;
        }
        var canBatchPath = el instanceof Path
            && el.autoBatch
            && canPathBatch(el.style);
        if (forceSetTransform || isTransformChanged(m, prevEl.transform)) {
            flushPathDrawn(ctx, scope);
            setContextTransform(ctx, el);
        }
        else if (!canBatchPath) {
            flushPathDrawn(ctx, scope);
        }
        var style = getStyle(el, scope.inHover);
        if (el instanceof Path) {
            if (scope.lastDrawType !== DRAW_TYPE_PATH) {
                forceSetStyle = true;
                scope.lastDrawType = DRAW_TYPE_PATH;
            }
            bindPathAndTextCommonStyle(ctx, el, prevEl, forceSetStyle, scope);
            if (!canBatchPath || (!scope.batchFill && !scope.batchStroke)) {
                ctx.beginPath();
            }
            brushPath(ctx, el, style, canBatchPath);
            if (canBatchPath) {
                scope.batchFill = style.fill || '';
                scope.batchStroke = style.stroke || '';
            }
        }
        else {
            if (el instanceof TSpan) {
                if (scope.lastDrawType !== DRAW_TYPE_TEXT) {
                    forceSetStyle = true;
                    scope.lastDrawType = DRAW_TYPE_TEXT;
                }
                bindPathAndTextCommonStyle(ctx, el, prevEl, forceSetStyle, scope);
                brushText(ctx, el, style);
            }
            else if (el instanceof ZRImage) {
                if (scope.lastDrawType !== DRAW_TYPE_IMAGE) {
                    forceSetStyle = true;
                    scope.lastDrawType = DRAW_TYPE_IMAGE;
                }
                bindImageStyle(ctx, el, prevEl, forceSetStyle, scope);
                brushImage(ctx, el, style);
            }
            else if (el instanceof IncrementalDisplayable) {
                if (scope.lastDrawType !== DRAW_TYPE_INCREMENTAL) {
                    forceSetStyle = true;
                    scope.lastDrawType = DRAW_TYPE_INCREMENTAL;
                }
                brushIncremental(ctx, el, scope);
            }
        }
        if (canBatchPath && isLast) {
            flushPathDrawn(ctx, scope);
        }
        el.innerAfterBrush();
        el.afterBrush && el.afterBrush();
        scope.prevEl = el;
        el.__dirty = 0;
        el.__isRendered = true;
    }
    function brushIncremental(ctx, el, scope) {
        var displayables = el.getDisplayables();
        var temporalDisplayables = el.getTemporalDisplayables();
        ctx.save();
        var innerScope = {
            prevElClipPaths: null,
            prevEl: null,
            allClipped: false,
            viewWidth: scope.viewWidth,
            viewHeight: scope.viewHeight,
            inHover: scope.inHover
        };
        var i;
        var len;
        for (i = el.getCursor(), len = displayables.length; i < len; i++) {
            var displayable = displayables[i];
            displayable.beforeBrush && displayable.beforeBrush();
            displayable.innerBeforeBrush();
            brush(ctx, displayable, innerScope, i === len - 1);
            displayable.innerAfterBrush();
            displayable.afterBrush && displayable.afterBrush();
            innerScope.prevEl = displayable;
        }
        for (var i_1 = 0, len_1 = temporalDisplayables.length; i_1 < len_1; i_1++) {
            var displayable = temporalDisplayables[i_1];
            displayable.beforeBrush && displayable.beforeBrush();
            displayable.innerBeforeBrush();
            brush(ctx, displayable, innerScope, i_1 === len_1 - 1);
            displayable.innerAfterBrush();
            displayable.afterBrush && displayable.afterBrush();
            innerScope.prevEl = displayable;
        }
        el.clearTemporalDisplayables();
        el.notClear = true;
        ctx.restore();
    }

    function returnFalse() {
        return false;
    }
    function createDom(id, painter, dpr) {
        var newDom = createCanvas$1();
        var width = painter.getWidth();
        var height = painter.getHeight();
        var newDomStyle = newDom.style;
        if (newDomStyle) {
            newDomStyle.position = 'absolute';
            newDomStyle.left = '0';
            newDomStyle.top = '0';
            newDomStyle.width = width + 'px';
            newDomStyle.height = height + 'px';
            newDom.setAttribute('data-zr-dom-id', id);
        }
        newDom.width = width * dpr;
        newDom.height = height * dpr;
        return newDom;
    }
    var Layer = (function (_super) {
        __extends(Layer, _super);
        function Layer(id, painter, dpr) {
            var _this = _super.call(this) || this;
            _this.motionBlur = false;
            _this.lastFrameAlpha = 0.7;
            _this.dpr = 1;
            _this.virtual = false;
            _this.config = {};
            _this.incremental = false;
            _this.zlevel = 0;
            _this.maxRepaintRectCount = 5;
            _this.__dirty = true;
            _this.__firstTimePaint = true;
            _this.__used = false;
            _this.__drawIndex = 0;
            _this.__startIndex = 0;
            _this.__endIndex = 0;
            _this.__prevStartIndex = null;
            _this.__prevEndIndex = null;
            var dom;
            dpr = dpr || devicePixelRatio;
            if (typeof id === 'string') {
                dom = createDom(id, painter, dpr);
            }
            else if (isObject$1(id)) {
                dom = id;
                id = dom.id;
            }
            _this.id = id;
            _this.dom = dom;
            var domStyle = dom.style;
            if (domStyle) {
                dom.onselectstart = returnFalse;
                domStyle.webkitUserSelect = 'none';
                domStyle.userSelect = 'none';
                domStyle.webkitTapHighlightColor = 'rgba(0,0,0,0)';
                domStyle['-webkit-touch-callout'] = 'none';
                domStyle.padding = '0';
                domStyle.margin = '0';
                domStyle.borderWidth = '0';
            }
            _this.domBack = null;
            _this.ctxBack = null;
            _this.painter = painter;
            _this.config = null;
            _this.dpr = dpr;
            return _this;
        }
        Layer.prototype.getElementCount = function () {
            return this.__endIndex - this.__startIndex;
        };
        Layer.prototype.afterBrush = function () {
            this.__prevStartIndex = this.__startIndex;
            this.__prevEndIndex = this.__endIndex;
        };
        Layer.prototype.initContext = function () {
            this.ctx = this.dom.getContext('2d');
            this.ctx.dpr = this.dpr;
        };
        Layer.prototype.setUnpainted = function () {
            this.__firstTimePaint = true;
        };
        Layer.prototype.createBackBuffer = function () {
            var dpr = this.dpr;
            this.domBack = createDom('back-' + this.id, this.painter, dpr);
            this.ctxBack = this.domBack.getContext('2d');
            if (dpr !== 1) {
                this.ctxBack.scale(dpr, dpr);
            }
        };
        Layer.prototype.createRepaintRects = function (displayList, prevList, viewWidth, viewHeight) {
            if (this.__firstTimePaint) {
                this.__firstTimePaint = false;
                return null;
            }
            var mergedRepaintRects = [];
            var maxRepaintRectCount = this.maxRepaintRectCount;
            var full = false;
            var pendingRect = new BoundingRect(0, 0, 0, 0);
            function addRectToMergePool(rect) {
                if (!rect.isFinite() || rect.isZero()) {
                    return;
                }
                if (mergedRepaintRects.length === 0) {
                    var boundingRect = new BoundingRect(0, 0, 0, 0);
                    boundingRect.copy(rect);
                    mergedRepaintRects.push(boundingRect);
                }
                else {
                    var isMerged = false;
                    var minDeltaArea = Infinity;
                    var bestRectToMergeIdx = 0;
                    for (var i = 0; i < mergedRepaintRects.length; ++i) {
                        var mergedRect = mergedRepaintRects[i];
                        if (mergedRect.intersect(rect)) {
                            var pendingRect_1 = new BoundingRect(0, 0, 0, 0);
                            pendingRect_1.copy(mergedRect);
                            pendingRect_1.union(rect);
                            mergedRepaintRects[i] = pendingRect_1;
                            isMerged = true;
                            break;
                        }
                        else if (full) {
                            pendingRect.copy(rect);
                            pendingRect.union(mergedRect);
                            var aArea = rect.width * rect.height;
                            var bArea = mergedRect.width * mergedRect.height;
                            var pendingArea = pendingRect.width * pendingRect.height;
                            var deltaArea = pendingArea - aArea - bArea;
                            if (deltaArea < minDeltaArea) {
                                minDeltaArea = deltaArea;
                                bestRectToMergeIdx = i;
                            }
                        }
                    }
                    if (full) {
                        mergedRepaintRects[bestRectToMergeIdx].union(rect);
                        isMerged = true;
                    }
                    if (!isMerged) {
                        var boundingRect = new BoundingRect(0, 0, 0, 0);
                        boundingRect.copy(rect);
                        mergedRepaintRects.push(boundingRect);
                    }
                    if (!full) {
                        full = mergedRepaintRects.length >= maxRepaintRectCount;
                    }
                }
            }
            for (var i = this.__startIndex; i < this.__endIndex; ++i) {
                var el = displayList[i];
                if (el) {
                    var shouldPaint = el.shouldBePainted(viewWidth, viewHeight, true, true);
                    var prevRect = el.__isRendered && ((el.__dirty & REDARAW_BIT) || !shouldPaint)
                        ? el.getPrevPaintRect()
                        : null;
                    if (prevRect) {
                        addRectToMergePool(prevRect);
                    }
                    var curRect = shouldPaint && ((el.__dirty & REDARAW_BIT) || !el.__isRendered)
                        ? el.getPaintRect()
                        : null;
                    if (curRect) {
                        addRectToMergePool(curRect);
                    }
                }
            }
            for (var i = this.__prevStartIndex; i < this.__prevEndIndex; ++i) {
                var el = prevList[i];
                var shouldPaint = el.shouldBePainted(viewWidth, viewHeight, true, true);
                if (el && (!shouldPaint || !el.__zr) && el.__isRendered) {
                    var prevRect = el.getPrevPaintRect();
                    if (prevRect) {
                        addRectToMergePool(prevRect);
                    }
                }
            }
            var hasIntersections;
            do {
                hasIntersections = false;
                for (var i = 0; i < mergedRepaintRects.length;) {
                    if (mergedRepaintRects[i].isZero()) {
                        mergedRepaintRects.splice(i, 1);
                        continue;
                    }
                    for (var j = i + 1; j < mergedRepaintRects.length;) {
                        if (mergedRepaintRects[i].intersect(mergedRepaintRects[j])) {
                            hasIntersections = true;
                            mergedRepaintRects[i].union(mergedRepaintRects[j]);
                            mergedRepaintRects.splice(j, 1);
                        }
                        else {
                            j++;
                        }
                    }
                    i++;
                }
            } while (hasIntersections);
            this._paintRects = mergedRepaintRects;
            return mergedRepaintRects;
        };
        Layer.prototype.debugGetPaintRects = function () {
            return (this._paintRects || []).slice();
        };
        Layer.prototype.resize = function (width, height) {
            var dpr = this.dpr;
            var dom = this.dom;
            var domStyle = dom.style;
            var domBack = this.domBack;
            if (domStyle) {
                domStyle.width = width + 'px';
                domStyle.height = height + 'px';
            }
            dom.width = width * dpr;
            dom.height = height * dpr;
            if (domBack) {
                domBack.width = width * dpr;
                domBack.height = height * dpr;
                if (dpr !== 1) {
                    this.ctxBack.scale(dpr, dpr);
                }
            }
        };
        Layer.prototype.clear = function (clearAll, clearColor, repaintRects) {
            var dom = this.dom;
            var ctx = this.ctx;
            var width = dom.width;
            var height = dom.height;
            clearColor = clearColor || this.clearColor;
            var haveMotionBLur = this.motionBlur && !clearAll;
            var lastFrameAlpha = this.lastFrameAlpha;
            var dpr = this.dpr;
            var self = this;
            if (haveMotionBLur) {
                if (!this.domBack) {
                    this.createBackBuffer();
                }
                this.ctxBack.globalCompositeOperation = 'copy';
                this.ctxBack.drawImage(dom, 0, 0, width / dpr, height / dpr);
            }
            var domBack = this.domBack;
            function doClear(x, y, width, height) {
                ctx.clearRect(x, y, width, height);
                if (clearColor && clearColor !== 'transparent') {
                    var clearColorGradientOrPattern = void 0;
                    if (isGradientObject(clearColor)) {
                        clearColorGradientOrPattern = clearColor.__canvasGradient
                            || getCanvasGradient(ctx, clearColor, {
                                x: 0,
                                y: 0,
                                width: width,
                                height: height
                            });
                        clearColor.__canvasGradient = clearColorGradientOrPattern;
                    }
                    else if (isImagePatternObject(clearColor)) {
                        clearColorGradientOrPattern = createCanvasPattern(ctx, clearColor, {
                            dirty: function () {
                                self.setUnpainted();
                                self.__painter.refresh();
                            }
                        });
                    }
                    ctx.save();
                    ctx.fillStyle = clearColorGradientOrPattern || clearColor;
                    ctx.fillRect(x, y, width, height);
                    ctx.restore();
                }
                if (haveMotionBLur) {
                    ctx.save();
                    ctx.globalAlpha = lastFrameAlpha;
                    ctx.drawImage(domBack, x, y, width, height);
                    ctx.restore();
                }
            }
            if (!repaintRects || haveMotionBLur) {
                doClear(0, 0, width, height);
            }
            else if (repaintRects.length) {
                each(repaintRects, function (rect) {
                    doClear(rect.x * dpr, rect.y * dpr, rect.width * dpr, rect.height * dpr);
                });
            }
        };
        return Layer;
    }(Eventful));

    var requestAnimationFrame;
    requestAnimationFrame = (typeof window !== 'undefined'
        && ((window.requestAnimationFrame && window.requestAnimationFrame.bind(window))
            || (window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window))
            || window.mozRequestAnimationFrame
            || window.webkitRequestAnimationFrame)) || function (func) {
        return setTimeout(func, 16);
    };
    var requestAnimationFrame$1 = requestAnimationFrame;

    var HOVER_LAYER_ZLEVEL = 1e5;
    var CANVAS_ZLEVEL = 314159;
    var EL_AFTER_INCREMENTAL_INC = 0.01;
    var INCREMENTAL_INC = 0.001;
    function parseInt10$1(val) {
        return parseInt(val, 10);
    }
    function isLayerValid(layer) {
        if (!layer) {
            return false;
        }
        if (layer.__builtin__) {
            return true;
        }
        if (typeof (layer.resize) !== 'function'
            || typeof (layer.refresh) !== 'function') {
            return false;
        }
        return true;
    }
    function createRoot(width, height) {
        var domRoot = document.createElement('div');
        domRoot.style.cssText = [
            'position:relative',
            'width:' + width + 'px',
            'height:' + height + 'px',
            'padding:0',
            'margin:0',
            'border-width:0'
        ].join(';') + ';';
        return domRoot;
    }
    var CanvasPainter = (function () {
        function CanvasPainter(root, storage, opts, id) {
            this.type = 'canvas';
            this._zlevelList = [];
            this._prevDisplayList = [];
            this._layers = {};
            this._layerConfig = {};
            this._needsManuallyCompositing = false;
            this.type = 'canvas';
            var singleCanvas = !root.nodeName
                || root.nodeName.toUpperCase() === 'CANVAS';
            this._opts = opts = extend({}, opts || {});
            this.dpr = opts.devicePixelRatio || devicePixelRatio;
            this._singleCanvas = singleCanvas;
            this.root = root;
            var rootStyle = root.style;
            if (rootStyle) {
                rootStyle.webkitTapHighlightColor = 'transparent';
                rootStyle.webkitUserSelect = 'none';
                rootStyle.userSelect = 'none';
                rootStyle['-webkit-touch-callout'] = 'none';
                root.innerHTML = '';
            }
            this.storage = storage;
            var zlevelList = this._zlevelList;
            this._prevDisplayList = [];
            var layers = this._layers;
            if (!singleCanvas) {
                this._width = this._getSize(0);
                this._height = this._getSize(1);
                var domRoot = this._domRoot = createRoot(this._width, this._height);
                root.appendChild(domRoot);
            }
            else {
                var rootCanvas = root;
                var width = rootCanvas.width;
                var height = rootCanvas.height;
                if (opts.width != null) {
                    width = opts.width;
                }
                if (opts.height != null) {
                    height = opts.height;
                }
                this.dpr = opts.devicePixelRatio || 1;
                rootCanvas.width = width * this.dpr;
                rootCanvas.height = height * this.dpr;
                this._width = width;
                this._height = height;
                var mainLayer = new Layer(rootCanvas, this, this.dpr);
                mainLayer.__builtin__ = true;
                mainLayer.initContext();
                layers[CANVAS_ZLEVEL] = mainLayer;
                mainLayer.zlevel = CANVAS_ZLEVEL;
                zlevelList.push(CANVAS_ZLEVEL);
                this._domRoot = root;
            }
        }
        CanvasPainter.prototype.getType = function () {
            return 'canvas';
        };
        CanvasPainter.prototype.isSingleCanvas = function () {
            return this._singleCanvas;
        };
        CanvasPainter.prototype.getViewportRoot = function () {
            return this._domRoot;
        };
        CanvasPainter.prototype.getViewportRootOffset = function () {
            var viewportRoot = this.getViewportRoot();
            if (viewportRoot) {
                return {
                    offsetLeft: viewportRoot.offsetLeft || 0,
                    offsetTop: viewportRoot.offsetTop || 0
                };
            }
        };
        CanvasPainter.prototype.refresh = function (paintAll) {
            var list = this.storage.getDisplayList(true);
            var prevList = this._prevDisplayList;
            var zlevelList = this._zlevelList;
            this._redrawId = Math.random();
            this._paintList(list, prevList, paintAll, this._redrawId);
            for (var i = 0; i < zlevelList.length; i++) {
                var z = zlevelList[i];
                var layer = this._layers[z];
                if (!layer.__builtin__ && layer.refresh) {
                    var clearColor = i === 0 ? this._backgroundColor : null;
                    layer.refresh(clearColor);
                }
            }
            if (this._opts.useDirtyRect) {
                this._prevDisplayList = list.slice();
            }
            return this;
        };
        CanvasPainter.prototype.refreshHover = function () {
            this._paintHoverList(this.storage.getDisplayList(false));
        };
        CanvasPainter.prototype._paintHoverList = function (list) {
            var len = list.length;
            var hoverLayer = this._hoverlayer;
            hoverLayer && hoverLayer.clear();
            if (!len) {
                return;
            }
            var scope = {
                inHover: true,
                viewWidth: this._width,
                viewHeight: this._height
            };
            var ctx;
            for (var i = 0; i < len; i++) {
                var el = list[i];
                if (el.__inHover) {
                    if (!hoverLayer) {
                        hoverLayer = this._hoverlayer = this.getLayer(HOVER_LAYER_ZLEVEL);
                    }
                    if (!ctx) {
                        ctx = hoverLayer.ctx;
                        ctx.save();
                    }
                    brush(ctx, el, scope, i === len - 1);
                }
            }
            if (ctx) {
                ctx.restore();
            }
        };
        CanvasPainter.prototype.getHoverLayer = function () {
            return this.getLayer(HOVER_LAYER_ZLEVEL);
        };
        CanvasPainter.prototype.paintOne = function (ctx, el) {
            brushSingle(ctx, el);
        };
        CanvasPainter.prototype._paintList = function (list, prevList, paintAll, redrawId) {
            if (this._redrawId !== redrawId) {
                return;
            }
            paintAll = paintAll || false;
            this._updateLayerStatus(list);
            var _a = this._doPaintList(list, prevList, paintAll), finished = _a.finished, needsRefreshHover = _a.needsRefreshHover;
            if (this._needsManuallyCompositing) {
                this._compositeManually();
            }
            if (needsRefreshHover) {
                this._paintHoverList(list);
            }
            if (!finished) {
                var self_1 = this;
                requestAnimationFrame$1(function () {
                    self_1._paintList(list, prevList, paintAll, redrawId);
                });
            }
            else {
                this.eachLayer(function (layer) {
                    layer.afterBrush && layer.afterBrush();
                });
            }
        };
        CanvasPainter.prototype._compositeManually = function () {
            var ctx = this.getLayer(CANVAS_ZLEVEL).ctx;
            var width = this._domRoot.width;
            var height = this._domRoot.height;
            ctx.clearRect(0, 0, width, height);
            this.eachBuiltinLayer(function (layer) {
                if (layer.virtual) {
                    ctx.drawImage(layer.dom, 0, 0, width, height);
                }
            });
        };
        CanvasPainter.prototype._doPaintList = function (list, prevList, paintAll) {
            var _this = this;
            var layerList = [];
            var useDirtyRect = this._opts.useDirtyRect;
            for (var zi = 0; zi < this._zlevelList.length; zi++) {
                var zlevel = this._zlevelList[zi];
                var layer = this._layers[zlevel];
                if (layer.__builtin__
                    && layer !== this._hoverlayer
                    && (layer.__dirty || paintAll)) {
                    layerList.push(layer);
                }
            }
            var finished = true;
            var needsRefreshHover = false;
            var _loop_1 = function (k) {
                var layer = layerList[k];
                var ctx = layer.ctx;
                var repaintRects = useDirtyRect
                    && layer.createRepaintRects(list, prevList, this_1._width, this_1._height);
                var start = paintAll ? layer.__startIndex : layer.__drawIndex;
                var useTimer = !paintAll && layer.incremental && Date.now;
                var startTime = useTimer && Date.now();
                var clearColor = layer.zlevel === this_1._zlevelList[0]
                    ? this_1._backgroundColor : null;
                if (layer.__startIndex === layer.__endIndex) {
                    layer.clear(false, clearColor, repaintRects);
                }
                else if (start === layer.__startIndex) {
                    var firstEl = list[start];
                    if (!firstEl.incremental || !firstEl.notClear || paintAll) {
                        layer.clear(false, clearColor, repaintRects);
                    }
                }
                if (start === -1) {
                    console.error('For some unknown reason. drawIndex is -1');
                    start = layer.__startIndex;
                }
                var i;
                var repaint = function (repaintRect) {
                    var scope = {
                        inHover: false,
                        allClipped: false,
                        prevEl: null,
                        viewWidth: _this._width,
                        viewHeight: _this._height
                    };
                    for (i = start; i < layer.__endIndex; i++) {
                        var el = list[i];
                        if (el.__inHover) {
                            needsRefreshHover = true;
                        }
                        _this._doPaintEl(el, layer, useDirtyRect, repaintRect, scope, i === layer.__endIndex - 1);
                        if (useTimer) {
                            var dTime = Date.now() - startTime;
                            if (dTime > 15) {
                                break;
                            }
                        }
                    }
                    if (scope.prevElClipPaths) {
                        ctx.restore();
                    }
                };
                if (repaintRects) {
                    if (repaintRects.length === 0) {
                        i = layer.__endIndex;
                    }
                    else {
                        var dpr = this_1.dpr;
                        for (var r = 0; r < repaintRects.length; ++r) {
                            var rect = repaintRects[r];
                            ctx.save();
                            ctx.beginPath();
                            ctx.rect(rect.x * dpr, rect.y * dpr, rect.width * dpr, rect.height * dpr);
                            ctx.clip();
                            repaint(rect);
                            ctx.restore();
                        }
                    }
                }
                else {
                    ctx.save();
                    repaint();
                    ctx.restore();
                }
                layer.__drawIndex = i;
                if (layer.__drawIndex < layer.__endIndex) {
                    finished = false;
                }
            };
            var this_1 = this;
            for (var k = 0; k < layerList.length; k++) {
                _loop_1(k);
            }
            if (env.wxa) {
                each(this._layers, function (layer) {
                    if (layer && layer.ctx && layer.ctx.draw) {
                        layer.ctx.draw();
                    }
                });
            }
            return {
                finished: finished,
                needsRefreshHover: needsRefreshHover
            };
        };
        CanvasPainter.prototype._doPaintEl = function (el, currentLayer, useDirtyRect, repaintRect, scope, isLast) {
            var ctx = currentLayer.ctx;
            if (useDirtyRect) {
                var paintRect = el.getPaintRect();
                if (!repaintRect || paintRect && paintRect.intersect(repaintRect)) {
                    brush(ctx, el, scope, isLast);
                    el.setPrevPaintRect(paintRect);
                }
            }
            else {
                brush(ctx, el, scope, isLast);
            }
        };
        CanvasPainter.prototype.getLayer = function (zlevel, virtual) {
            if (this._singleCanvas && !this._needsManuallyCompositing) {
                zlevel = CANVAS_ZLEVEL;
            }
            var layer = this._layers[zlevel];
            if (!layer) {
                layer = new Layer('zr_' + zlevel, this, this.dpr);
                layer.zlevel = zlevel;
                layer.__builtin__ = true;
                if (this._layerConfig[zlevel]) {
                    merge(layer, this._layerConfig[zlevel], true);
                }
                else if (this._layerConfig[zlevel - EL_AFTER_INCREMENTAL_INC]) {
                    merge(layer, this._layerConfig[zlevel - EL_AFTER_INCREMENTAL_INC], true);
                }
                if (virtual) {
                    layer.virtual = virtual;
                }
                this.insertLayer(zlevel, layer);
                layer.initContext();
            }
            return layer;
        };
        CanvasPainter.prototype.insertLayer = function (zlevel, layer) {
            var layersMap = this._layers;
            var zlevelList = this._zlevelList;
            var len = zlevelList.length;
            var domRoot = this._domRoot;
            var prevLayer = null;
            var i = -1;
            if (layersMap[zlevel]) {
                logError('ZLevel ' + zlevel + ' has been used already');
                return;
            }
            if (!isLayerValid(layer)) {
                logError('Layer of zlevel ' + zlevel + ' is not valid');
                return;
            }
            if (len > 0 && zlevel > zlevelList[0]) {
                for (i = 0; i < len - 1; i++) {
                    if (zlevelList[i] < zlevel
                        && zlevelList[i + 1] > zlevel) {
                        break;
                    }
                }
                prevLayer = layersMap[zlevelList[i]];
            }
            zlevelList.splice(i + 1, 0, zlevel);
            layersMap[zlevel] = layer;
            if (!layer.virtual) {
                if (prevLayer) {
                    var prevDom = prevLayer.dom;
                    if (prevDom.nextSibling) {
                        domRoot.insertBefore(layer.dom, prevDom.nextSibling);
                    }
                    else {
                        domRoot.appendChild(layer.dom);
                    }
                }
                else {
                    if (domRoot.firstChild) {
                        domRoot.insertBefore(layer.dom, domRoot.firstChild);
                    }
                    else {
                        domRoot.appendChild(layer.dom);
                    }
                }
            }
            layer.__painter = this;
        };
        CanvasPainter.prototype.eachLayer = function (cb, context) {
            var zlevelList = this._zlevelList;
            for (var i = 0; i < zlevelList.length; i++) {
                var z = zlevelList[i];
                cb.call(context, this._layers[z], z);
            }
        };
        CanvasPainter.prototype.eachBuiltinLayer = function (cb, context) {
            var zlevelList = this._zlevelList;
            for (var i = 0; i < zlevelList.length; i++) {
                var z = zlevelList[i];
                var layer = this._layers[z];
                if (layer.__builtin__) {
                    cb.call(context, layer, z);
                }
            }
        };
        CanvasPainter.prototype.eachOtherLayer = function (cb, context) {
            var zlevelList = this._zlevelList;
            for (var i = 0; i < zlevelList.length; i++) {
                var z = zlevelList[i];
                var layer = this._layers[z];
                if (!layer.__builtin__) {
                    cb.call(context, layer, z);
                }
            }
        };
        CanvasPainter.prototype.getLayers = function () {
            return this._layers;
        };
        CanvasPainter.prototype._updateLayerStatus = function (list) {
            this.eachBuiltinLayer(function (layer, z) {
                layer.__dirty = layer.__used = false;
            });
            function updatePrevLayer(idx) {
                if (prevLayer) {
                    if (prevLayer.__endIndex !== idx) {
                        prevLayer.__dirty = true;
                    }
                    prevLayer.__endIndex = idx;
                }
            }
            if (this._singleCanvas) {
                for (var i_1 = 1; i_1 < list.length; i_1++) {
                    var el = list[i_1];
                    if (el.zlevel !== list[i_1 - 1].zlevel || el.incremental) {
                        this._needsManuallyCompositing = true;
                        break;
                    }
                }
            }
            var prevLayer = null;
            var incrementalLayerCount = 0;
            var prevZlevel;
            var i;
            for (i = 0; i < list.length; i++) {
                var el = list[i];
                var zlevel = el.zlevel;
                var layer = void 0;
                if (prevZlevel !== zlevel) {
                    prevZlevel = zlevel;
                    incrementalLayerCount = 0;
                }
                if (el.incremental) {
                    layer = this.getLayer(zlevel + INCREMENTAL_INC, this._needsManuallyCompositing);
                    layer.incremental = true;
                    incrementalLayerCount = 1;
                }
                else {
                    layer = this.getLayer(zlevel + (incrementalLayerCount > 0 ? EL_AFTER_INCREMENTAL_INC : 0), this._needsManuallyCompositing);
                }
                if (!layer.__builtin__) {
                    logError('ZLevel ' + zlevel + ' has been used by unkown layer ' + layer.id);
                }
                if (layer !== prevLayer) {
                    layer.__used = true;
                    if (layer.__startIndex !== i) {
                        layer.__dirty = true;
                    }
                    layer.__startIndex = i;
                    if (!layer.incremental) {
                        layer.__drawIndex = i;
                    }
                    else {
                        layer.__drawIndex = -1;
                    }
                    updatePrevLayer(i);
                    prevLayer = layer;
                }
                if ((el.__dirty & REDARAW_BIT) && !el.__inHover) {
                    layer.__dirty = true;
                    if (layer.incremental && layer.__drawIndex < 0) {
                        layer.__drawIndex = i;
                    }
                }
            }
            updatePrevLayer(i);
            this.eachBuiltinLayer(function (layer, z) {
                if (!layer.__used && layer.getElementCount() > 0) {
                    layer.__dirty = true;
                    layer.__startIndex = layer.__endIndex = layer.__drawIndex = 0;
                }
                if (layer.__dirty && layer.__drawIndex < 0) {
                    layer.__drawIndex = layer.__startIndex;
                }
            });
        };
        CanvasPainter.prototype.clear = function () {
            this.eachBuiltinLayer(this._clearLayer);
            return this;
        };
        CanvasPainter.prototype._clearLayer = function (layer) {
            layer.clear();
        };
        CanvasPainter.prototype.setBackgroundColor = function (backgroundColor) {
            this._backgroundColor = backgroundColor;
            each(this._layers, function (layer) {
                layer.setUnpainted();
            });
        };
        CanvasPainter.prototype.configLayer = function (zlevel, config) {
            if (config) {
                var layerConfig = this._layerConfig;
                if (!layerConfig[zlevel]) {
                    layerConfig[zlevel] = config;
                }
                else {
                    merge(layerConfig[zlevel], config, true);
                }
                for (var i = 0; i < this._zlevelList.length; i++) {
                    var _zlevel = this._zlevelList[i];
                    if (_zlevel === zlevel || _zlevel === zlevel + EL_AFTER_INCREMENTAL_INC) {
                        var layer = this._layers[_zlevel];
                        merge(layer, layerConfig[zlevel], true);
                    }
                }
            }
        };
        CanvasPainter.prototype.delLayer = function (zlevel) {
            var layers = this._layers;
            var zlevelList = this._zlevelList;
            var layer = layers[zlevel];
            if (!layer) {
                return;
            }
            layer.dom.parentNode.removeChild(layer.dom);
            delete layers[zlevel];
            zlevelList.splice(indexOf(zlevelList, zlevel), 1);
        };
        CanvasPainter.prototype.resize = function (width, height) {
            if (!this._domRoot.style) {
                if (width == null || height == null) {
                    return;
                }
                this._width = width;
                this._height = height;
                this.getLayer(CANVAS_ZLEVEL).resize(width, height);
            }
            else {
                var domRoot = this._domRoot;
                domRoot.style.display = 'none';
                var opts = this._opts;
                width != null && (opts.width = width);
                height != null && (opts.height = height);
                width = this._getSize(0);
                height = this._getSize(1);
                domRoot.style.display = '';
                if (this._width !== width || height !== this._height) {
                    domRoot.style.width = width + 'px';
                    domRoot.style.height = height + 'px';
                    for (var id in this._layers) {
                        if (this._layers.hasOwnProperty(id)) {
                            this._layers[id].resize(width, height);
                        }
                    }
                    this.refresh(true);
                }
                this._width = width;
                this._height = height;
            }
            return this;
        };
        CanvasPainter.prototype.clearLayer = function (zlevel) {
            var layer = this._layers[zlevel];
            if (layer) {
                layer.clear();
            }
        };
        CanvasPainter.prototype.dispose = function () {
            this.root.innerHTML = '';
            this.root =
                this.storage =
                    this._domRoot =
                        this._layers = null;
        };
        CanvasPainter.prototype.getRenderedCanvas = function (opts) {
            opts = opts || {};
            if (this._singleCanvas && !this._compositeManually) {
                return this._layers[CANVAS_ZLEVEL].dom;
            }
            var imageLayer = new Layer('image', this, opts.pixelRatio || this.dpr);
            imageLayer.initContext();
            imageLayer.clear(false, opts.backgroundColor || this._backgroundColor);
            var ctx = imageLayer.ctx;
            if (opts.pixelRatio <= this.dpr) {
                this.refresh();
                var width_1 = imageLayer.dom.width;
                var height_1 = imageLayer.dom.height;
                this.eachLayer(function (layer) {
                    if (layer.__builtin__) {
                        ctx.drawImage(layer.dom, 0, 0, width_1, height_1);
                    }
                    else if (layer.renderToCanvas) {
                        ctx.save();
                        layer.renderToCanvas(ctx);
                        ctx.restore();
                    }
                });
            }
            else {
                var scope = {
                    inHover: false,
                    viewWidth: this._width,
                    viewHeight: this._height
                };
                var displayList = this.storage.getDisplayList(true);
                for (var i = 0, len = displayList.length; i < len; i++) {
                    var el = displayList[i];
                    brush(ctx, el, scope, i === len - 1);
                }
            }
            return imageLayer.dom;
        };
        CanvasPainter.prototype.getWidth = function () {
            return this._width;
        };
        CanvasPainter.prototype.getHeight = function () {
            return this._height;
        };
        CanvasPainter.prototype._getSize = function (whIdx) {
            var opts = this._opts;
            var wh = ['width', 'height'][whIdx];
            var cwh = ['clientWidth', 'clientHeight'][whIdx];
            var plt = ['paddingLeft', 'paddingTop'][whIdx];
            var prb = ['paddingRight', 'paddingBottom'][whIdx];
            if (opts[wh] != null && opts[wh] !== 'auto') {
                return parseFloat(opts[wh]);
            }
            var root = this.root;
            var stl = document.defaultView.getComputedStyle(root);
            return ((root[cwh] || parseInt10$1(stl[wh]) || parseInt10$1(root.style[wh]))
                - (parseInt10$1(stl[plt]) || 0)
                - (parseInt10$1(stl[prb]) || 0)) | 0;
        };
        CanvasPainter.prototype.pathToImage = function (path, dpr) {
            dpr = dpr || this.dpr;
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var rect = path.getBoundingRect();
            var style = path.style;
            var shadowBlurSize = style.shadowBlur * dpr;
            var shadowOffsetX = style.shadowOffsetX * dpr;
            var shadowOffsetY = style.shadowOffsetY * dpr;
            var lineWidth = path.hasStroke() ? style.lineWidth : 0;
            var leftMargin = Math.max(lineWidth / 2, -shadowOffsetX + shadowBlurSize);
            var rightMargin = Math.max(lineWidth / 2, shadowOffsetX + shadowBlurSize);
            var topMargin = Math.max(lineWidth / 2, -shadowOffsetY + shadowBlurSize);
            var bottomMargin = Math.max(lineWidth / 2, shadowOffsetY + shadowBlurSize);
            var width = rect.width + leftMargin + rightMargin;
            var height = rect.height + topMargin + bottomMargin;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, width, height);
            ctx.dpr = dpr;
            var pathTransform = {
                x: path.x,
                y: path.y,
                scaleX: path.scaleX,
                scaleY: path.scaleY,
                rotation: path.rotation,
                originX: path.originX,
                originY: path.originY
            };
            path.x = leftMargin - rect.x;
            path.y = topMargin - rect.y;
            path.rotation = 0;
            path.scaleX = 1;
            path.scaleY = 1;
            path.updateTransform();
            if (path) {
                brush(ctx, path, {
                    inHover: false,
                    viewWidth: this._width,
                    viewHeight: this._height
                }, true);
            }
            var imgShape = new ZRImage({
                style: {
                    x: 0,
                    y: 0,
                    image: canvas
                }
            });
            extend(path, pathTransform);
            return imgShape;
        };
        return CanvasPainter;
    }());

    function createElement(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }

    function diff(oldArr, newArr, equals) {
        if (!equals) {
            equals = function (a, b) {
                return a === b;
            };
        }
        oldArr = oldArr.slice();
        newArr = newArr.slice();
        var newLen = newArr.length;
        var oldLen = oldArr.length;
        var editLength = 1;
        var maxEditLength = newLen + oldLen;
        var bestPath = [{ newPos: -1, components: [] }];
        var oldPos = extractCommon(bestPath[0], newArr, oldArr, 0, equals);
        if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
            var indices = [];
            for (var i = 0; i < newArr.length; i++) {
                indices.push(i);
            }
            return [{
                    indices: indices,
                    count: newArr.length,
                    added: false,
                    removed: false
                }];
        }
        function execEditLength() {
            for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
                var basePath;
                var addPath = bestPath[diagonalPath - 1];
                var removePath = bestPath[diagonalPath + 1];
                var oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
                if (addPath) {
                    bestPath[diagonalPath - 1] = undefined;
                }
                var canAdd = addPath && addPath.newPos + 1 < newLen;
                var canRemove = removePath && 0 <= oldPos && oldPos < oldLen;
                if (!canAdd && !canRemove) {
                    bestPath[diagonalPath] = undefined;
                    continue;
                }
                if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {
                    basePath = clonePath(removePath);
                    pushComponent(basePath.components, false, true);
                }
                else {
                    basePath = addPath;
                    basePath.newPos++;
                    pushComponent(basePath.components, true, false);
                }
                oldPos = extractCommon(basePath, newArr, oldArr, diagonalPath, equals);
                if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
                    return buildValues(basePath.components);
                }
                else {
                    bestPath[diagonalPath] = basePath;
                }
            }
            editLength++;
        }
        while (editLength <= maxEditLength) {
            var ret = execEditLength();
            if (ret) {
                return ret;
            }
        }
    }
    function extractCommon(basePath, newArr, oldArr, diagonalPath, equals) {
        var newLen = newArr.length;
        var oldLen = oldArr.length;
        var newPos = basePath.newPos;
        var oldPos = newPos - diagonalPath;
        var commonCount = 0;
        while (newPos + 1 < newLen && oldPos + 1 < oldLen && equals(newArr[newPos + 1], oldArr[oldPos + 1])) {
            newPos++;
            oldPos++;
            commonCount++;
        }
        if (commonCount) {
            basePath.components.push({
                count: commonCount,
                added: false,
                removed: false,
                indices: []
            });
        }
        basePath.newPos = newPos;
        return oldPos;
    }
    function pushComponent(components, added, removed) {
        var last = components[components.length - 1];
        if (last && last.added === added && last.removed === removed) {
            components[components.length - 1] = {
                count: last.count + 1,
                added: added,
                removed: removed,
                indices: []
            };
        }
        else {
            components.push({
                count: 1,
                added: added,
                removed: removed,
                indices: []
            });
        }
    }
    function buildValues(components) {
        var componentPos = 0;
        var componentLen = components.length;
        var newPos = 0;
        var oldPos = 0;
        for (; componentPos < componentLen; componentPos++) {
            var component = components[componentPos];
            if (!component.removed) {
                var indices = [];
                for (var i = newPos; i < newPos + component.count; i++) {
                    indices.push(i);
                }
                component.indices = indices;
                newPos += component.count;
                if (!component.added) {
                    oldPos += component.count;
                }
            }
            else {
                for (var i = oldPos; i < oldPos + component.count; i++) {
                    component.indices.push(i);
                }
                oldPos += component.count;
            }
        }
        return components;
    }
    function clonePath(path) {
        return { newPos: path.newPos, components: path.components.slice(0) };
    }
    function arrayDiff(oldArr, newArr, equal) {
        return diff(oldArr, newArr, equal);
    }

    var NONE = 'none';
    var mathRound = Math.round;
    var mathSin$2 = Math.sin;
    var mathCos$2 = Math.cos;
    var PI$4 = Math.PI;
    var PI2$1 = Math.PI * 2;
    var degree = 180 / PI$4;
    var EPSILON = 1e-4;
    function round3(val) {
        return mathRound(val * 1e3) / 1e3;
    }
    function round4(val) {
        return mathRound(val * 1e4) / 1e4;
    }
    function isAroundZero(val) {
        return val < EPSILON && val > -EPSILON;
    }
    function pathHasFill(style) {
        var fill = style.fill;
        return fill != null && fill !== NONE;
    }
    function pathHasStroke(style) {
        var stroke = style.stroke;
        return stroke != null && stroke !== NONE;
    }
    function setTransform(svgEl, m) {
        if (m) {
            attr(svgEl, 'transform', 'matrix('
                + round3(m[0]) + ','
                + round3(m[1]) + ','
                + round3(m[2]) + ','
                + round3(m[3]) + ','
                + round4(m[4]) + ','
                + round4(m[5])
                + ')');
        }
    }
    function attr(el, key, val) {
        if (!val || val.type !== 'linear' && val.type !== 'radial') {
            el.setAttribute(key, val);
        }
    }
    function attrXLink(el, key, val) {
        el.setAttributeNS('http://www.w3.org/1999/xlink', key, val);
    }
    function attrXML(el, key, val) {
        el.setAttributeNS('http://www.w3.org/XML/1998/namespace', key, val);
    }
    function bindStyle(svgEl, style, el) {
        var opacity = style.opacity == null ? 1 : style.opacity;
        if (el instanceof ZRImage) {
            svgEl.style.opacity = opacity + '';
            return;
        }
        if (pathHasFill(style)) {
            var fill = style.fill;
            fill = fill === 'transparent' ? NONE : fill;
            attr(svgEl, 'fill', fill);
            attr(svgEl, 'fill-opacity', (style.fillOpacity != null ? style.fillOpacity * opacity : opacity) + '');
        }
        else {
            attr(svgEl, 'fill', NONE);
        }
        if (pathHasStroke(style)) {
            var stroke = style.stroke;
            stroke = stroke === 'transparent' ? NONE : stroke;
            attr(svgEl, 'stroke', stroke);
            var strokeWidth = style.lineWidth;
            var strokeScale_1 = style.strokeNoScale
                ? el.getLineScale()
                : 1;
            attr(svgEl, 'stroke-width', (strokeScale_1 ? strokeWidth / strokeScale_1 : 0) + '');
            attr(svgEl, 'paint-order', style.strokeFirst ? 'stroke' : 'fill');
            attr(svgEl, 'stroke-opacity', (style.strokeOpacity != null ? style.strokeOpacity * opacity : opacity) + '');
            var lineDash = style.lineDash && strokeWidth > 0 && normalizeLineDash(style.lineDash, strokeWidth);
            if (lineDash) {
                var lineDashOffset = style.lineDashOffset;
                if (strokeScale_1 && strokeScale_1 !== 1) {
                    lineDash = map(lineDash, function (rawVal) {
                        return rawVal / strokeScale_1;
                    });
                    if (lineDashOffset) {
                        lineDashOffset /= strokeScale_1;
                        lineDashOffset = mathRound(lineDashOffset);
                    }
                }
                attr(svgEl, 'stroke-dasharray', lineDash.join(','));
                attr(svgEl, 'stroke-dashoffset', (lineDashOffset || 0) + '');
            }
            else {
                attr(svgEl, 'stroke-dasharray', '');
            }
            style.lineCap && attr(svgEl, 'stroke-linecap', style.lineCap);
            style.lineJoin && attr(svgEl, 'stroke-linejoin', style.lineJoin);
            style.miterLimit && attr(svgEl, 'stroke-miterlimit', style.miterLimit + '');
        }
        else {
            attr(svgEl, 'stroke', NONE);
        }
    }
    var SVGPathRebuilder = (function () {
        function SVGPathRebuilder() {
        }
        SVGPathRebuilder.prototype.reset = function () {
            this._d = [];
            this._str = '';
        };
        SVGPathRebuilder.prototype.moveTo = function (x, y) {
            this._add('M', x, y);
        };
        SVGPathRebuilder.prototype.lineTo = function (x, y) {
            this._add('L', x, y);
        };
        SVGPathRebuilder.prototype.bezierCurveTo = function (x, y, x2, y2, x3, y3) {
            this._add('C', x, y, x2, y2, x3, y3);
        };
        SVGPathRebuilder.prototype.quadraticCurveTo = function (x, y, x2, y2) {
            this._add('Q', x, y, x2, y2);
        };
        SVGPathRebuilder.prototype.arc = function (cx, cy, r, startAngle, endAngle, anticlockwise) {
            this.ellipse(cx, cy, r, r, 0, startAngle, endAngle, anticlockwise);
        };
        SVGPathRebuilder.prototype.ellipse = function (cx, cy, rx, ry, psi, startAngle, endAngle, anticlockwise) {
            var firstCmd = this._d.length === 0;
            var dTheta = endAngle - startAngle;
            var clockwise = !anticlockwise;
            var dThetaPositive = Math.abs(dTheta);
            var isCircle = isAroundZero(dThetaPositive - PI2$1)
                || (clockwise ? dTheta >= PI2$1 : -dTheta >= PI2$1);
            var unifiedTheta = dTheta > 0 ? dTheta % PI2$1 : (dTheta % PI2$1 + PI2$1);
            var large = false;
            if (isCircle) {
                large = true;
            }
            else if (isAroundZero(dThetaPositive)) {
                large = false;
            }
            else {
                large = (unifiedTheta >= PI$4) === !!clockwise;
            }
            var x0 = round4(cx + rx * mathCos$2(startAngle));
            var y0 = round4(cy + ry * mathSin$2(startAngle));
            if (isCircle) {
                if (clockwise) {
                    dTheta = PI2$1 - 1e-4;
                }
                else {
                    dTheta = -PI2$1 + 1e-4;
                }
                large = true;
                if (firstCmd) {
                    this._d.push('M', x0, y0);
                }
            }
            var x = round4(cx + rx * mathCos$2(startAngle + dTheta));
            var y = round4(cy + ry * mathSin$2(startAngle + dTheta));
            if (isNaN(x0) || isNaN(y0) || isNaN(rx) || isNaN(ry) || isNaN(psi) || isNaN(degree) || isNaN(x) || isNaN(y)) {
                return '';
            }
            this._d.push('A', round4(rx), round4(ry), mathRound(psi * degree), +large, +clockwise, x, y);
        };
        SVGPathRebuilder.prototype.rect = function (x, y, w, h) {
            this._add('M', x, y);
            this._add('L', x + w, y);
            this._add('L', x + w, y + h);
            this._add('L', x, y + h);
            this._add('L', x, y);
        };
        SVGPathRebuilder.prototype.closePath = function () {
            if (this._d.length > 0) {
                this._add('Z');
            }
        };
        SVGPathRebuilder.prototype._add = function (cmd, a, b, c, d, e, f, g, h) {
            this._d.push(cmd);
            for (var i = 1; i < arguments.length; i++) {
                var val = arguments[i];
                if (isNaN(val)) {
                    this._invalid = true;
                    return;
                }
                this._d.push(round4(val));
            }
        };
        SVGPathRebuilder.prototype.generateStr = function () {
            this._str = this._invalid ? '' : this._d.join(' ');
            this._d = [];
        };
        SVGPathRebuilder.prototype.getStr = function () {
            return this._str;
        };
        return SVGPathRebuilder;
    }());
    var svgPath = {
        brush: function (el) {
            var style = el.style;
            var svgEl = el.__svgEl;
            if (!svgEl) {
                svgEl = createElement('path');
                el.__svgEl = svgEl;
            }
            if (!el.path) {
                el.createPathProxy();
            }
            var path = el.path;
            if (el.shapeChanged()) {
                path.beginPath();
                el.buildPath(path, el.shape);
                el.pathUpdated();
            }
            var pathVersion = path.getVersion();
            var elExt = el;
            var svgPathBuilder = elExt.__svgPathBuilder;
            if (elExt.__svgPathVersion !== pathVersion || !svgPathBuilder || el.style.strokePercent < 1) {
                if (!svgPathBuilder) {
                    svgPathBuilder = elExt.__svgPathBuilder = new SVGPathRebuilder();
                }
                svgPathBuilder.reset();
                path.rebuildPath(svgPathBuilder, el.style.strokePercent);
                svgPathBuilder.generateStr();
                elExt.__svgPathVersion = pathVersion;
            }
            attr(svgEl, 'd', svgPathBuilder.getStr());
            bindStyle(svgEl, style, el);
            setTransform(svgEl, el.transform);
        }
    };
    var svgImage = {
        brush: function (el) {
            var style = el.style;
            var image = style.image;
            if (image instanceof HTMLImageElement) {
                image = image.src;
            }
            else if (image instanceof HTMLCanvasElement) {
                image = image.toDataURL();
            }
            if (!image) {
                return;
            }
            var x = style.x || 0;
            var y = style.y || 0;
            var dw = style.width;
            var dh = style.height;
            var svgEl = el.__svgEl;
            if (!svgEl) {
                svgEl = createElement('image');
                el.__svgEl = svgEl;
            }
            if (image !== el.__imageSrc) {
                attrXLink(svgEl, 'href', image);
                el.__imageSrc = image;
            }
            attr(svgEl, 'width', dw + '');
            attr(svgEl, 'height', dh + '');
            attr(svgEl, 'x', x + '');
            attr(svgEl, 'y', y + '');
            bindStyle(svgEl, style, el);
            setTransform(svgEl, el.transform);
        }
    };
    var TEXT_ALIGN_TO_ANCHOR = {
        left: 'start',
        right: 'end',
        center: 'middle',
        middle: 'middle'
    };
    function adjustTextY(y, lineHeight, textBaseline) {
        if (textBaseline === 'top') {
            y += lineHeight / 2;
        }
        else if (textBaseline === 'bottom') {
            y -= lineHeight / 2;
        }
        return y;
    }
    var svgText = {
        brush: function (el) {
            var style = el.style;
            var text = style.text;
            text != null && (text += '');
            if (!text || isNaN(style.x) || isNaN(style.y)) {
                return;
            }
            var textSvgEl = el.__svgEl;
            if (!textSvgEl) {
                textSvgEl = createElement('text');
                attrXML(textSvgEl, 'xml:space', 'preserve');
                el.__svgEl = textSvgEl;
            }
            var font = style.font || DEFAULT_FONT;
            var textSvgElStyle = textSvgEl.style;
            textSvgElStyle.font = font;
            textSvgEl.textContent = text;
            bindStyle(textSvgEl, style, el);
            setTransform(textSvgEl, el.transform);
            var x = style.x || 0;
            var y = adjustTextY(style.y || 0, getLineHeight(font), style.textBaseline);
            var textAlign = TEXT_ALIGN_TO_ANCHOR[style.textAlign]
                || style.textAlign;
            attr(textSvgEl, 'dominant-baseline', 'central');
            attr(textSvgEl, 'text-anchor', textAlign);
            attr(textSvgEl, 'x', x + '');
            attr(textSvgEl, 'y', y + '');
        }
    };

    var MARK_UNUSED = '0';
    var MARK_USED = '1';
    var Definable = (function () {
        function Definable(zrId, svgRoot, tagNames, markLabel, domName) {
            this.nextId = 0;
            this._domName = '_dom';
            this.createElement = createElement;
            this._zrId = zrId;
            this._svgRoot = svgRoot;
            this._tagNames = typeof tagNames === 'string' ? [tagNames] : tagNames;
            this._markLabel = markLabel;
            if (domName) {
                this._domName = domName;
            }
        }
        Definable.prototype.getDefs = function (isForceCreating) {
            var svgRoot = this._svgRoot;
            var defs = this._svgRoot.getElementsByTagName('defs');
            if (defs.length === 0) {
                if (isForceCreating) {
                    var defs_1 = svgRoot.insertBefore(this.createElement('defs'), svgRoot.firstChild);
                    if (!defs_1.contains) {
                        defs_1.contains = function (el) {
                            var children = defs_1.children;
                            if (!children) {
                                return false;
                            }
                            for (var i = children.length - 1; i >= 0; --i) {
                                if (children[i] === el) {
                                    return true;
                                }
                            }
                            return false;
                        };
                    }
                    return defs_1;
                }
                else {
                    return null;
                }
            }
            else {
                return defs[0];
            }
        };
        Definable.prototype.doUpdate = function (target, onUpdate) {
            if (!target) {
                return;
            }
            var defs = this.getDefs(false);
            if (target[this._domName] && defs.contains(target[this._domName])) {
                if (typeof onUpdate === 'function') {
                    onUpdate(target);
                }
            }
            else {
                var dom = this.add(target);
                if (dom) {
                    target[this._domName] = dom;
                }
            }
        };
        Definable.prototype.add = function (target) {
            return null;
        };
        Definable.prototype.addDom = function (dom) {
            var defs = this.getDefs(true);
            if (dom.parentNode !== defs) {
                defs.appendChild(dom);
            }
        };
        Definable.prototype.removeDom = function (target) {
            var defs = this.getDefs(false);
            if (defs && target[this._domName]) {
                defs.removeChild(target[this._domName]);
                target[this._domName] = null;
            }
        };
        Definable.prototype.getDoms = function () {
            var defs = this.getDefs(false);
            if (!defs) {
                return [];
            }
            var doms = [];
            each(this._tagNames, function (tagName) {
                var tags = defs.getElementsByTagName(tagName);
                for (var i = 0; i < tags.length; i++) {
                    doms.push(tags[i]);
                }
            });
            return doms;
        };
        Definable.prototype.markAllUnused = function () {
            var doms = this.getDoms();
            var that = this;
            each(doms, function (dom) {
                dom[that._markLabel] = MARK_UNUSED;
            });
        };
        Definable.prototype.markDomUsed = function (dom) {
            dom && (dom[this._markLabel] = MARK_USED);
        };
        Definable.prototype.markDomUnused = function (dom) {
            dom && (dom[this._markLabel] = MARK_UNUSED);
        };
        Definable.prototype.isDomUnused = function (dom) {
            return dom && dom[this._markLabel] !== MARK_USED;
        };
        Definable.prototype.removeUnused = function () {
            var _this = this;
            var defs = this.getDefs(false);
            if (!defs) {
                return;
            }
            var doms = this.getDoms();
            each(doms, function (dom) {
                if (_this.isDomUnused(dom)) {
                    defs.removeChild(dom);
                }
            });
        };
        Definable.prototype.getSvgProxy = function (displayable) {
            if (displayable instanceof Path) {
                return svgPath;
            }
            else if (displayable instanceof ZRImage) {
                return svgImage;
            }
            else if (displayable instanceof TSpan) {
                return svgText;
            }
            else {
                return svgPath;
            }
        };
        Definable.prototype.getSvgElement = function (displayable) {
            return displayable.__svgEl;
        };
        return Definable;
    }());

    function isLinearGradient(value) {
        return value.type === 'linear';
    }
    function isRadialGradient(value) {
        return value.type === 'radial';
    }
    function isGradient(value) {
        return value && (value.type === 'linear'
            || value.type === 'radial');
    }
    var GradientManager = (function (_super) {
        __extends(GradientManager, _super);
        function GradientManager(zrId, svgRoot) {
            return _super.call(this, zrId, svgRoot, ['linearGradient', 'radialGradient'], '__gradient_in_use__') || this;
        }
        GradientManager.prototype.addWithoutUpdate = function (svgElement, displayable) {
            if (displayable && displayable.style) {
                var that_1 = this;
                each(['fill', 'stroke'], function (fillOrStroke) {
                    var value = displayable.style[fillOrStroke];
                    if (isGradient(value)) {
                        var gradient = value;
                        var defs = that_1.getDefs(true);
                        var dom = void 0;
                        if (gradient.__dom) {
                            dom = gradient.__dom;
                            if (!defs.contains(gradient.__dom)) {
                                that_1.addDom(dom);
                            }
                        }
                        else {
                            dom = that_1.add(gradient);
                        }
                        that_1.markUsed(displayable);
                        var id = dom.getAttribute('id');
                        svgElement.setAttribute(fillOrStroke, 'url(#' + id + ')');
                    }
                });
            }
        };
        GradientManager.prototype.add = function (gradient) {
            var dom;
            if (isLinearGradient(gradient)) {
                dom = this.createElement('linearGradient');
            }
            else if (isRadialGradient(gradient)) {
                dom = this.createElement('radialGradient');
            }
            else {
                logError('Illegal gradient type.');
                return null;
            }
            gradient.id = gradient.id || this.nextId++;
            dom.setAttribute('id', 'zr' + this._zrId
                + '-gradient-' + gradient.id);
            this.updateDom(gradient, dom);
            this.addDom(dom);
            return dom;
        };
        GradientManager.prototype.update = function (gradient) {
            if (!isGradient(gradient)) {
                return;
            }
            var that = this;
            this.doUpdate(gradient, function () {
                var dom = gradient.__dom;
                if (!dom) {
                    return;
                }
                var tagName = dom.tagName;
                var type = gradient.type;
                if (type === 'linear' && tagName === 'linearGradient'
                    || type === 'radial' && tagName === 'radialGradient') {
                    that.updateDom(gradient, gradient.__dom);
                }
                else {
                    that.removeDom(gradient);
                    that.add(gradient);
                }
            });
        };
        GradientManager.prototype.updateDom = function (gradient, dom) {
            if (isLinearGradient(gradient)) {
                dom.setAttribute('x1', gradient.x + '');
                dom.setAttribute('y1', gradient.y + '');
                dom.setAttribute('x2', gradient.x2 + '');
                dom.setAttribute('y2', gradient.y2 + '');
            }
            else if (isRadialGradient(gradient)) {
                dom.setAttribute('cx', gradient.x + '');
                dom.setAttribute('cy', gradient.y + '');
                dom.setAttribute('r', gradient.r + '');
            }
            else {
                logError('Illegal gradient type.');
                return;
            }
            if (gradient.global) {
                dom.setAttribute('gradientUnits', 'userSpaceOnUse');
            }
            else {
                dom.setAttribute('gradientUnits', 'objectBoundingBox');
            }
            dom.innerHTML = '';
            var colors = gradient.colorStops;
            for (var i = 0, len = colors.length; i < len; ++i) {
                var stop_1 = this.createElement('stop');
                stop_1.setAttribute('offset', colors[i].offset * 100 + '%');
                var color$1 = colors[i].color;
                if (color$1.indexOf('rgba') > -1) {
                    var opacity = parse(color$1)[3];
                    var hex = toHex(color$1);
                    stop_1.setAttribute('stop-color', '#' + hex);
                    stop_1.setAttribute('stop-opacity', opacity + '');
                }
                else {
                    stop_1.setAttribute('stop-color', colors[i].color);
                }
                dom.appendChild(stop_1);
            }
            gradient.__dom = dom;
        };
        GradientManager.prototype.markUsed = function (displayable) {
            if (displayable.style) {
                var gradient = displayable.style.fill;
                if (gradient && gradient.__dom) {
                    _super.prototype.markDomUsed.call(this, gradient.__dom);
                }
                gradient = displayable.style.stroke;
                if (gradient && gradient.__dom) {
                    _super.prototype.markDomUsed.call(this, gradient.__dom);
                }
            }
        };
        return GradientManager;
    }(Definable));

    var wmUniqueIndex = Math.round(Math.random() * 9);
    var WeakMap$1 = (function () {
        function WeakMap() {
            this._id = '__ec_inner_' + wmUniqueIndex++;
        }
        WeakMap.prototype.get = function (key) {
            return this._guard(key)[this._id];
        };
        WeakMap.prototype.set = function (key, value) {
            var target = this._guard(key);
            if (typeof Object.defineProperty === 'function') {
                Object.defineProperty(target, this._id, {
                    value: value,
                    enumerable: false,
                    configurable: true
                });
            }
            else {
                target[this._id] = value;
            }
            return this;
        };
        WeakMap.prototype["delete"] = function (key) {
            if (this.has(key)) {
                delete this._guard(key)[this._id];
                return true;
            }
            return false;
        };
        WeakMap.prototype.has = function (key) {
            return !!this._guard(key)[this._id];
        };
        WeakMap.prototype._guard = function (key) {
            if (key !== Object(key)) {
                throw TypeError('Value of WeakMap is not a non-null object.');
            }
            return key;
        };
        return WeakMap;
    }());

    function isPattern(value) {
        return value && (!!value.image || !!value.svgElement);
    }
    var patternDomMap = new WeakMap$1();
    var PatternManager = (function (_super) {
        __extends(PatternManager, _super);
        function PatternManager(zrId, svgRoot) {
            return _super.call(this, zrId, svgRoot, ['pattern'], '__pattern_in_use__') || this;
        }
        PatternManager.prototype.addWithoutUpdate = function (svgElement, displayable) {
            if (displayable && displayable.style) {
                var that_1 = this;
                each(['fill', 'stroke'], function (fillOrStroke) {
                    var pattern = displayable.style[fillOrStroke];
                    if (isPattern(pattern)) {
                        var defs = that_1.getDefs(true);
                        var dom = patternDomMap.get(pattern);
                        if (dom) {
                            if (!defs.contains(dom)) {
                                that_1.addDom(dom);
                            }
                        }
                        else {
                            dom = that_1.add(pattern);
                        }
                        that_1.markUsed(displayable);
                        var id = dom.getAttribute('id');
                        svgElement.setAttribute(fillOrStroke, 'url(#' + id + ')');
                    }
                });
            }
        };
        PatternManager.prototype.add = function (pattern) {
            if (!isPattern(pattern)) {
                return;
            }
            var dom = this.createElement('pattern');
            pattern.id = pattern.id == null ? this.nextId++ : pattern.id;
            dom.setAttribute('id', 'zr' + this._zrId
                + '-pattern-' + pattern.id);
            dom.setAttribute('x', '0');
            dom.setAttribute('y', '0');
            dom.setAttribute('patternUnits', 'userSpaceOnUse');
            this.updateDom(pattern, dom);
            this.addDom(dom);
            return dom;
        };
        PatternManager.prototype.update = function (pattern) {
            if (!isPattern(pattern)) {
                return;
            }
            var that = this;
            this.doUpdate(pattern, function () {
                var dom = patternDomMap.get(pattern);
                that.updateDom(pattern, dom);
            });
        };
        PatternManager.prototype.updateDom = function (pattern, patternDom) {
            var svgElement = pattern.svgElement;
            if (svgElement instanceof SVGElement) {
                if (svgElement.parentNode !== patternDom) {
                    patternDom.innerHTML = '';
                    patternDom.appendChild(svgElement);
                    patternDom.setAttribute('width', pattern.svgWidth + '');
                    patternDom.setAttribute('height', pattern.svgHeight + '');
                }
            }
            else {
                var img = void 0;
                var prevImage = patternDom.getElementsByTagName('image');
                if (prevImage.length) {
                    if (pattern.image) {
                        img = prevImage[0];
                    }
                    else {
                        patternDom.removeChild(prevImage[0]);
                        return;
                    }
                }
                else if (pattern.image) {
                    img = this.createElement('image');
                }
                if (img) {
                    var imageSrc = void 0;
                    var patternImage = pattern.image;
                    if (typeof patternImage === 'string') {
                        imageSrc = patternImage;
                    }
                    else if (patternImage instanceof HTMLImageElement) {
                        imageSrc = patternImage.src;
                    }
                    else if (patternImage instanceof HTMLCanvasElement) {
                        imageSrc = patternImage.toDataURL();
                    }
                    if (imageSrc) {
                        img.setAttribute('href', imageSrc);
                        img.setAttribute('x', '0');
                        img.setAttribute('y', '0');
                        var hostEl = {
                            dirty: function () { }
                        };
                        var createdImage = createOrUpdateImage(imageSrc, img, hostEl, function (img) {
                            patternDom.setAttribute('width', img.width + '');
                            patternDom.setAttribute('height', img.height + '');
                        });
                        if (createdImage && createdImage.width && createdImage.height) {
                            patternDom.setAttribute('width', createdImage.width + '');
                            patternDom.setAttribute('height', createdImage.height + '');
                        }
                        patternDom.appendChild(img);
                    }
                }
            }
            var x = pattern.x || 0;
            var y = pattern.y || 0;
            var rotation = (pattern.rotation || 0) / Math.PI * 180;
            var scaleX = pattern.scaleX || 1;
            var scaleY = pattern.scaleY || 1;
            var transform = "translate(" + x + ", " + y + ") rotate(" + rotation + ") scale(" + scaleX + ", " + scaleY + ")";
            patternDom.setAttribute('patternTransform', transform);
            patternDomMap.set(pattern, patternDom);
        };
        PatternManager.prototype.markUsed = function (displayable) {
            if (displayable.style) {
                if (isPattern(displayable.style.fill)) {
                    _super.prototype.markDomUsed.call(this, patternDomMap.get(displayable.style.fill));
                }
                if (isPattern(displayable.style.stroke)) {
                    _super.prototype.markDomUsed.call(this, patternDomMap.get(displayable.style.stroke));
                }
            }
        };
        return PatternManager;
    }(Definable));

    function generateClipPathsKey(clipPaths) {
        var key = [];
        if (clipPaths) {
            for (var i = 0; i < clipPaths.length; i++) {
                var clipPath = clipPaths[i];
                key.push(clipPath.id);
            }
        }
        return key.join(',');
    }
    function hasClipPath(displayable) {
        var clipPaths = displayable.__clipPaths;
        return clipPaths && clipPaths.length > 0;
    }
    var ClippathManager = (function (_super) {
        __extends(ClippathManager, _super);
        function ClippathManager(zrId, svgRoot) {
            var _this = _super.call(this, zrId, svgRoot, 'clipPath', '__clippath_in_use__') || this;
            _this._refGroups = {};
            _this._keyDuplicateCount = {};
            return _this;
        }
        ClippathManager.prototype.markAllUnused = function () {
            _super.prototype.markAllUnused.call(this);
            for (var key in this._refGroups) {
                this.markDomUnused(this._refGroups[key]);
            }
            this._keyDuplicateCount = {};
        };
        ClippathManager.prototype._getClipPathGroup = function (displayable, prevDisplayable) {
            if (!hasClipPath(displayable)) {
                return;
            }
            var clipPaths = displayable.__clipPaths;
            var keyDuplicateCount = this._keyDuplicateCount;
            var clipPathKey = generateClipPathsKey(clipPaths);
            if (isClipPathChanged(clipPaths, prevDisplayable && prevDisplayable.__clipPaths)) {
                keyDuplicateCount[clipPathKey] = keyDuplicateCount[clipPathKey] || 0;
                keyDuplicateCount[clipPathKey] && (clipPathKey += '-' + keyDuplicateCount[clipPathKey]);
                keyDuplicateCount[clipPathKey]++;
            }
            return this._refGroups[clipPathKey]
                || (this._refGroups[clipPathKey] = this.createElement('g'));
        };
        ClippathManager.prototype.update = function (displayable, prevDisplayable) {
            var clipGroup = this._getClipPathGroup(displayable, prevDisplayable);
            if (clipGroup) {
                this.markDomUsed(clipGroup);
                this.updateDom(clipGroup, displayable.__clipPaths);
            }
            return clipGroup;
        };
        ClippathManager.prototype.updateDom = function (parentEl, clipPaths) {
            if (clipPaths && clipPaths.length > 0) {
                var defs = this.getDefs(true);
                var clipPath = clipPaths[0];
                var clipPathEl = void 0;
                var id = void 0;
                if (clipPath._dom) {
                    id = clipPath._dom.getAttribute('id');
                    clipPathEl = clipPath._dom;
                    if (!defs.contains(clipPathEl)) {
                        defs.appendChild(clipPathEl);
                    }
                }
                else {
                    id = 'zr' + this._zrId + '-clip-' + this.nextId;
                    ++this.nextId;
                    clipPathEl = this.createElement('clipPath');
                    clipPathEl.setAttribute('id', id);
                    defs.appendChild(clipPathEl);
                    clipPath._dom = clipPathEl;
                }
                var svgProxy = this.getSvgProxy(clipPath);
                svgProxy.brush(clipPath);
                var pathEl = this.getSvgElement(clipPath);
                clipPathEl.innerHTML = '';
                clipPathEl.appendChild(pathEl);
                parentEl.setAttribute('clip-path', 'url(#' + id + ')');
                if (clipPaths.length > 1) {
                    this.updateDom(clipPathEl, clipPaths.slice(1));
                }
            }
            else {
                if (parentEl) {
                    parentEl.setAttribute('clip-path', 'none');
                }
            }
        };
        ClippathManager.prototype.markUsed = function (displayable) {
            var _this = this;
            if (displayable.__clipPaths) {
                each(displayable.__clipPaths, function (clipPath) {
                    if (clipPath._dom) {
                        _super.prototype.markDomUsed.call(_this, clipPath._dom);
                    }
                });
            }
        };
        ClippathManager.prototype.removeUnused = function () {
            _super.prototype.removeUnused.call(this);
            var newRefGroupsMap = {};
            for (var key in this._refGroups) {
                var group = this._refGroups[key];
                if (!this.isDomUnused(group)) {
                    newRefGroupsMap[key] = group;
                }
                else if (group.parentNode) {
                    group.parentNode.removeChild(group);
                }
            }
            this._refGroups = newRefGroupsMap;
        };
        return ClippathManager;
    }(Definable));

    var ShadowManager = (function (_super) {
        __extends(ShadowManager, _super);
        function ShadowManager(zrId, svgRoot) {
            var _this = _super.call(this, zrId, svgRoot, ['filter'], '__filter_in_use__', '_shadowDom') || this;
            _this._shadowDomMap = {};
            _this._shadowDomPool = [];
            return _this;
        }
        ShadowManager.prototype._getFromPool = function () {
            var shadowDom = this._shadowDomPool.pop();
            if (!shadowDom) {
                shadowDom = this.createElement('filter');
                shadowDom.setAttribute('id', 'zr' + this._zrId + '-shadow-' + this.nextId++);
                var domChild = this.createElement('feDropShadow');
                shadowDom.appendChild(domChild);
                this.addDom(shadowDom);
            }
            return shadowDom;
        };
        ShadowManager.prototype.update = function (svgElement, displayable) {
            var style = displayable.style;
            if (hasShadow(style)) {
                var shadowKey = getShadowKey(displayable);
                var shadowDom = displayable._shadowDom = this._shadowDomMap[shadowKey];
                if (!shadowDom) {
                    shadowDom = this._getFromPool();
                    this._shadowDomMap[shadowKey] = shadowDom;
                }
                this.updateDom(svgElement, displayable, shadowDom);
            }
            else {
                this.remove(svgElement, displayable);
            }
        };
        ShadowManager.prototype.remove = function (svgElement, displayable) {
            if (displayable._shadowDom != null) {
                displayable._shadowDom = null;
                svgElement.style.filter = '';
            }
        };
        ShadowManager.prototype.updateDom = function (svgElement, displayable, shadowDom) {
            var domChild = shadowDom.children[0];
            var style = displayable.style;
            var globalScale = displayable.getGlobalScale();
            var scaleX = globalScale[0];
            var scaleY = globalScale[1];
            if (!scaleX || !scaleY) {
                return;
            }
            var offsetX = style.shadowOffsetX || 0;
            var offsetY = style.shadowOffsetY || 0;
            var blur = style.shadowBlur;
            var color = style.shadowColor;
            domChild.setAttribute('dx', offsetX / scaleX + '');
            domChild.setAttribute('dy', offsetY / scaleY + '');
            domChild.setAttribute('flood-color', color);
            var stdDx = blur / 2 / scaleX;
            var stdDy = blur / 2 / scaleY;
            var stdDeviation = stdDx + ' ' + stdDy;
            domChild.setAttribute('stdDeviation', stdDeviation);
            shadowDom.setAttribute('x', '-100%');
            shadowDom.setAttribute('y', '-100%');
            shadowDom.setAttribute('width', '300%');
            shadowDom.setAttribute('height', '300%');
            displayable._shadowDom = shadowDom;
            var id = shadowDom.getAttribute('id');
            svgElement.style.filter = 'url(#' + id + ')';
        };
        ShadowManager.prototype.removeUnused = function () {
            var defs = this.getDefs(false);
            if (!defs) {
                return;
            }
            var shadowDomsPool = this._shadowDomPool;
            for (var key in this._shadowDomMap) {
                var dom = this._shadowDomMap[key];
                shadowDomsPool.push(dom);
            }
            this._shadowDomMap = {};
        };
        return ShadowManager;
    }(Definable));
    function hasShadow(style) {
        return style
            && (style.shadowBlur || style.shadowOffsetX || style.shadowOffsetY);
    }
    function getShadowKey(displayable) {
        var style = displayable.style;
        var globalScale = displayable.getGlobalScale();
        return [
            style.shadowColor,
            (style.shadowBlur || 0).toFixed(2),
            (style.shadowOffsetX || 0).toFixed(2),
            (style.shadowOffsetY || 0).toFixed(2),
            globalScale[0],
            globalScale[1]
        ].join(',');
    }

    function parseInt10(val) {
        return parseInt(val, 10);
    }
    function getSvgProxy(el) {
        if (el instanceof Path) {
            return svgPath;
        }
        else if (el instanceof ZRImage) {
            return svgImage;
        }
        else if (el instanceof TSpan) {
            return svgText;
        }
        else {
            return svgPath;
        }
    }
    function checkParentAvailable(parent, child) {
        return child && parent && child.parentNode !== parent;
    }
    function insertAfter(parent, child, prevSibling) {
        if (checkParentAvailable(parent, child) && prevSibling) {
            var nextSibling = prevSibling.nextSibling;
            nextSibling ? parent.insertBefore(child, nextSibling)
                : parent.appendChild(child);
        }
    }
    function prepend(parent, child) {
        if (checkParentAvailable(parent, child)) {
            var firstChild = parent.firstChild;
            firstChild ? parent.insertBefore(child, firstChild)
                : parent.appendChild(child);
        }
    }
    function remove(parent, child) {
        if (child && parent && child.parentNode === parent) {
            parent.removeChild(child);
        }
    }
    function removeFromMyParent(child) {
        if (child && child.parentNode) {
            child.parentNode.removeChild(child);
        }
    }
    function getSvgElement(displayable) {
        return displayable.__svgEl;
    }
    var SVGPainter = (function () {
        function SVGPainter(root, storage, opts, zrId) {
            this.type = 'svg';
            this.refreshHover = createMethodNotSupport('refreshHover');
            this.pathToImage = createMethodNotSupport('pathToImage');
            this.configLayer = createMethodNotSupport('configLayer');
            this.root = root;
            this.storage = storage;
            this._opts = opts = extend({}, opts || {});
            var svgDom = createElement('svg');
            svgDom.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
            svgDom.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
            svgDom.setAttribute('version', '1.1');
            svgDom.setAttribute('baseProfile', 'full');
            svgDom.style.cssText = 'user-select:none;position:absolute;left:0;top:0;';
            var bgRoot = createElement('g');
            svgDom.appendChild(bgRoot);
            var svgRoot = createElement('g');
            svgDom.appendChild(svgRoot);
            this._gradientManager = new GradientManager(zrId, svgRoot);
            this._patternManager = new PatternManager(zrId, svgRoot);
            this._clipPathManager = new ClippathManager(zrId, svgRoot);
            this._shadowManager = new ShadowManager(zrId, svgRoot);
            var viewport = document.createElement('div');
            viewport.style.cssText = 'overflow:hidden;position:relative';
            this._svgDom = svgDom;
            this._svgRoot = svgRoot;
            this._backgroundRoot = bgRoot;
            this._viewport = viewport;
            root.appendChild(viewport);
            viewport.appendChild(svgDom);
            this.resize(opts.width, opts.height);
            this._visibleList = [];
        }
        SVGPainter.prototype.getType = function () {
            return 'svg';
        };
        SVGPainter.prototype.getViewportRoot = function () {
            return this._viewport;
        };
        SVGPainter.prototype.getSvgDom = function () {
            return this._svgDom;
        };
        SVGPainter.prototype.getSvgRoot = function () {
            return this._svgRoot;
        };
        SVGPainter.prototype.getViewportRootOffset = function () {
            var viewportRoot = this.getViewportRoot();
            if (viewportRoot) {
                return {
                    offsetLeft: viewportRoot.offsetLeft || 0,
                    offsetTop: viewportRoot.offsetTop || 0
                };
            }
        };
        SVGPainter.prototype.refresh = function () {
            var list = this.storage.getDisplayList(true);
            this._paintList(list);
        };
        SVGPainter.prototype.setBackgroundColor = function (backgroundColor) {
            if (this._backgroundRoot && this._backgroundNode) {
                this._backgroundRoot.removeChild(this._backgroundNode);
            }
            var bgNode = createElement('rect');
            bgNode.setAttribute('width', this.getWidth());
            bgNode.setAttribute('height', this.getHeight());
            bgNode.setAttribute('x', 0);
            bgNode.setAttribute('y', 0);
            bgNode.setAttribute('id', 0);
            bgNode.style.fill = backgroundColor;
            this._backgroundRoot.appendChild(bgNode);
            this._backgroundNode = bgNode;
        };
        SVGPainter.prototype.createSVGElement = function (tag) {
            return createElement(tag);
        };
        SVGPainter.prototype.paintOne = function (el) {
            var svgProxy = getSvgProxy(el);
            svgProxy && svgProxy.brush(el);
            return getSvgElement(el);
        };
        SVGPainter.prototype._paintList = function (list) {
            var gradientManager = this._gradientManager;
            var patternManager = this._patternManager;
            var clipPathManager = this._clipPathManager;
            var shadowManager = this._shadowManager;
            gradientManager.markAllUnused();
            patternManager.markAllUnused();
            clipPathManager.markAllUnused();
            shadowManager.markAllUnused();
            var svgRoot = this._svgRoot;
            var visibleList = this._visibleList;
            var listLen = list.length;
            var newVisibleList = [];
            for (var i = 0; i < listLen; i++) {
                var displayable = list[i];
                var svgProxy = getSvgProxy(displayable);
                var svgElement = getSvgElement(displayable);
                if (!displayable.invisible) {
                    if (displayable.__dirty || !svgElement) {
                        svgProxy && svgProxy.brush(displayable);
                        svgElement = getSvgElement(displayable);
                        if (svgElement && displayable.style) {
                            gradientManager.update(displayable.style.fill);
                            gradientManager.update(displayable.style.stroke);
                            patternManager.update(displayable.style.fill);
                            patternManager.update(displayable.style.stroke);
                            shadowManager.update(svgElement, displayable);
                        }
                        displayable.__dirty = 0;
                    }
                    if (svgElement) {
                        newVisibleList.push(displayable);
                    }
                }
            }
            var diff = arrayDiff(visibleList, newVisibleList);
            var prevSvgElement;
            var topPrevSvgElement;
            for (var i = 0; i < diff.length; i++) {
                var item = diff[i];
                if (item.removed) {
                    for (var k = 0; k < item.count; k++) {
                        var displayable = visibleList[item.indices[k]];
                        var svgElement = getSvgElement(displayable);
                        hasClipPath(displayable) ? removeFromMyParent(svgElement)
                            : remove(svgRoot, svgElement);
                    }
                }
            }
            var prevDisplayable;
            var currentClipGroup;
            for (var i = 0; i < diff.length; i++) {
                var item = diff[i];
                if (item.removed) {
                    continue;
                }
                for (var k = 0; k < item.count; k++) {
                    var displayable = newVisibleList[item.indices[k]];
                    var clipGroup = clipPathManager.update(displayable, prevDisplayable);
                    if (clipGroup !== currentClipGroup) {
                        prevSvgElement = topPrevSvgElement;
                        if (clipGroup) {
                            prevSvgElement ? insertAfter(svgRoot, clipGroup, prevSvgElement)
                                : prepend(svgRoot, clipGroup);
                            topPrevSvgElement = clipGroup;
                            prevSvgElement = null;
                        }
                        currentClipGroup = clipGroup;
                    }
                    var svgElement = getSvgElement(displayable);
                    prevSvgElement
                        ? insertAfter(currentClipGroup || svgRoot, svgElement, prevSvgElement)
                        : prepend(currentClipGroup || svgRoot, svgElement);
                    prevSvgElement = svgElement || prevSvgElement;
                    if (!currentClipGroup) {
                        topPrevSvgElement = prevSvgElement;
                    }
                    gradientManager.markUsed(displayable);
                    gradientManager.addWithoutUpdate(svgElement, displayable);
                    patternManager.markUsed(displayable);
                    patternManager.addWithoutUpdate(svgElement, displayable);
                    clipPathManager.markUsed(displayable);
                    prevDisplayable = displayable;
                }
            }
            gradientManager.removeUnused();
            patternManager.removeUnused();
            clipPathManager.removeUnused();
            shadowManager.removeUnused();
            this._visibleList = newVisibleList;
        };
        SVGPainter.prototype.resize = function (width, height) {
            var viewport = this._viewport;
            viewport.style.display = 'none';
            var opts = this._opts;
            width != null && (opts.width = width);
            height != null && (opts.height = height);
            width = this._getSize(0);
            height = this._getSize(1);
            viewport.style.display = '';
            if (this._width !== width || this._height !== height) {
                this._width = width;
                this._height = height;
                var viewportStyle = viewport.style;
                viewportStyle.width = width + 'px';
                viewportStyle.height = height + 'px';
                var svgRoot = this._svgDom;
                svgRoot.setAttribute('width', width + '');
                svgRoot.setAttribute('height', height + '');
            }
            if (this._backgroundNode) {
                this._backgroundNode.setAttribute('width', width);
                this._backgroundNode.setAttribute('height', height);
            }
        };
        SVGPainter.prototype.getWidth = function () {
            return this._width;
        };
        SVGPainter.prototype.getHeight = function () {
            return this._height;
        };
        SVGPainter.prototype._getSize = function (whIdx) {
            var opts = this._opts;
            var wh = ['width', 'height'][whIdx];
            var cwh = ['clientWidth', 'clientHeight'][whIdx];
            var plt = ['paddingLeft', 'paddingTop'][whIdx];
            var prb = ['paddingRight', 'paddingBottom'][whIdx];
            if (opts[wh] != null && opts[wh] !== 'auto') {
                return parseFloat(opts[wh]);
            }
            var root = this.root;
            var stl = document.defaultView.getComputedStyle(root);
            return ((root[cwh] || parseInt10(stl[wh]) || parseInt10(root.style[wh]))
                - (parseInt10(stl[plt]) || 0)
                - (parseInt10(stl[prb]) || 0)) | 0;
        };
        SVGPainter.prototype.dispose = function () {
            this.root.innerHTML = '';
            this._svgRoot
                = this._backgroundRoot
                    = this._svgDom
                        = this._backgroundNode
                            = this._viewport
                                = this.storage
                                    = null;
        };
        SVGPainter.prototype.clear = function () {
            var viewportNode = this._viewport;
            if (viewportNode && viewportNode.parentNode) {
                viewportNode.parentNode.removeChild(viewportNode);
            }
        };
        SVGPainter.prototype.toDataURL = function () {
            this.refresh();
            var svgDom = this._svgDom;
            var outerHTML = svgDom.outerHTML
                || (svgDom.parentNode && svgDom.parentNode).innerHTML;
            var html = encodeURIComponent(outerHTML.replace(/></g, '>\n\r<'));
            return 'data:image/svg+xml;charset=UTF-8,' + html;
        };
        return SVGPainter;
    }());
    function createMethodNotSupport(method) {
        return function () {
            logError('In SVG mode painter not support method "' + method + '"');
        };
    }

    var Param = (function () {
        function Param(target, e) {
            this.target = target;
            this.topTarget = e && e.topTarget;
        }
        return Param;
    }());
    var Draggable = (function () {
        function Draggable(handler) {
            this.handler = handler;
            handler.on('mousedown', this._dragStart, this);
            handler.on('mousemove', this._drag, this);
            handler.on('mouseup', this._dragEnd, this);
        }
        Draggable.prototype._dragStart = function (e) {
            var draggingTarget = e.target;
            while (draggingTarget && !draggingTarget.draggable) {
                draggingTarget = draggingTarget.parent;
            }
            if (draggingTarget) {
                this._draggingTarget = draggingTarget;
                draggingTarget.dragging = true;
                this._x = e.offsetX;
                this._y = e.offsetY;
                this.handler.dispatchToElement(new Param(draggingTarget, e), 'dragstart', e.event);
            }
        };
        Draggable.prototype._drag = function (e) {
            var draggingTarget = this._draggingTarget;
            if (draggingTarget) {
                var x = e.offsetX;
                var y = e.offsetY;
                var dx = x - this._x;
                var dy = y - this._y;
                this._x = x;
                this._y = y;
                draggingTarget.drift(dx, dy, e);
                this.handler.dispatchToElement(new Param(draggingTarget, e), 'drag', e.event);
                var dropTarget = this.handler.findHover(x, y, draggingTarget).target;
                var lastDropTarget = this._dropTarget;
                this._dropTarget = dropTarget;
                if (draggingTarget !== dropTarget) {
                    if (lastDropTarget && dropTarget !== lastDropTarget) {
                        this.handler.dispatchToElement(new Param(lastDropTarget, e), 'dragleave', e.event);
                    }
                    if (dropTarget && dropTarget !== lastDropTarget) {
                        this.handler.dispatchToElement(new Param(dropTarget, e), 'dragenter', e.event);
                    }
                }
            }
        };
        Draggable.prototype._dragEnd = function (e) {
            var draggingTarget = this._draggingTarget;
            if (draggingTarget) {
                draggingTarget.dragging = false;
            }
            this.handler.dispatchToElement(new Param(draggingTarget, e), 'dragend', e.event);
            if (this._dropTarget) {
                this.handler.dispatchToElement(new Param(this._dropTarget, e), 'drop', e.event);
            }
            this._draggingTarget = null;
            this._dropTarget = null;
        };
        return Draggable;
    }());

    var LN2 = Math.log(2);
    function determinant(rows, rank, rowStart, rowMask, colMask, detCache) {
        var cacheKey = rowMask + '-' + colMask;
        var fullRank = rows.length;
        if (detCache.hasOwnProperty(cacheKey)) {
            return detCache[cacheKey];
        }
        if (rank === 1) {
            var colStart = Math.round(Math.log(((1 << fullRank) - 1) & ~colMask) / LN2);
            return rows[rowStart][colStart];
        }
        var subRowMask = rowMask | (1 << rowStart);
        var subRowStart = rowStart + 1;
        while (rowMask & (1 << subRowStart)) {
            subRowStart++;
        }
        var sum = 0;
        for (var j = 0, colLocalIdx = 0; j < fullRank; j++) {
            var colTag = 1 << j;
            if (!(colTag & colMask)) {
                sum += (colLocalIdx % 2 ? -1 : 1) * rows[rowStart][j]
                    * determinant(rows, rank - 1, subRowStart, subRowMask, colMask | colTag, detCache);
                colLocalIdx++;
            }
        }
        detCache[cacheKey] = sum;
        return sum;
    }
    function buildTransformer(src, dest) {
        var mA = [
            [src[0], src[1], 1, 0, 0, 0, -dest[0] * src[0], -dest[0] * src[1]],
            [0, 0, 0, src[0], src[1], 1, -dest[1] * src[0], -dest[1] * src[1]],
            [src[2], src[3], 1, 0, 0, 0, -dest[2] * src[2], -dest[2] * src[3]],
            [0, 0, 0, src[2], src[3], 1, -dest[3] * src[2], -dest[3] * src[3]],
            [src[4], src[5], 1, 0, 0, 0, -dest[4] * src[4], -dest[4] * src[5]],
            [0, 0, 0, src[4], src[5], 1, -dest[5] * src[4], -dest[5] * src[5]],
            [src[6], src[7], 1, 0, 0, 0, -dest[6] * src[6], -dest[6] * src[7]],
            [0, 0, 0, src[6], src[7], 1, -dest[7] * src[6], -dest[7] * src[7]]
        ];
        var detCache = {};
        var det = determinant(mA, 8, 0, 0, 0, detCache);
        if (det === 0) {
            return;
        }
        var vh = [];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                vh[j] == null && (vh[j] = 0);
                vh[j] += ((i + j) % 2 ? -1 : 1)
                    * determinant(mA, 7, i === 0 ? 1 : 0, 1 << i, 1 << j, detCache)
                    / det * dest[i];
            }
        }
        return function (out, srcPointX, srcPointY) {
            var pk = srcPointX * vh[6] + srcPointY * vh[7] + 1;
            out[0] = (srcPointX * vh[0] + srcPointY * vh[1] + vh[2]) / pk;
            out[1] = (srcPointX * vh[3] + srcPointY * vh[4] + vh[5]) / pk;
        };
    }

    var EVENT_SAVED_PROP = '___zrEVENTSAVED';
    function transformCoordWithViewport(out, el, inX, inY, inverse) {
        if (el.getBoundingClientRect && env.domSupported && !isCanvasEl(el)) {
            var saved = el[EVENT_SAVED_PROP] || (el[EVENT_SAVED_PROP] = {});
            var markers = prepareCoordMarkers(el, saved);
            var transformer = preparePointerTransformer(markers, saved, inverse);
            if (transformer) {
                transformer(out, inX, inY);
                return true;
            }
        }
        return false;
    }
    function prepareCoordMarkers(el, saved) {
        var markers = saved.markers;
        if (markers) {
            return markers;
        }
        markers = saved.markers = [];
        var propLR = ['left', 'right'];
        var propTB = ['top', 'bottom'];
        for (var i = 0; i < 4; i++) {
            var marker = document.createElement('div');
            var stl = marker.style;
            var idxLR = i % 2;
            var idxTB = (i >> 1) % 2;
            stl.cssText = [
                'position: absolute',
                'visibility: hidden',
                'padding: 0',
                'margin: 0',
                'border-width: 0',
                'user-select: none',
                'width:0',
                'height:0',
                propLR[idxLR] + ':0',
                propTB[idxTB] + ':0',
                propLR[1 - idxLR] + ':auto',
                propTB[1 - idxTB] + ':auto',
                ''
            ].join('!important;');
            el.appendChild(marker);
            markers.push(marker);
        }
        return markers;
    }
    function preparePointerTransformer(markers, saved, inverse) {
        var transformerName = inverse ? 'invTrans' : 'trans';
        var transformer = saved[transformerName];
        var oldSrcCoords = saved.srcCoords;
        var srcCoords = [];
        var destCoords = [];
        var oldCoordTheSame = true;
        for (var i = 0; i < 4; i++) {
            var rect = markers[i].getBoundingClientRect();
            var ii = 2 * i;
            var x = rect.left;
            var y = rect.top;
            srcCoords.push(x, y);
            oldCoordTheSame = oldCoordTheSame && oldSrcCoords && x === oldSrcCoords[ii] && y === oldSrcCoords[ii + 1];
            destCoords.push(markers[i].offsetLeft, markers[i].offsetTop);
        }
        return (oldCoordTheSame && transformer)
            ? transformer
            : (saved.srcCoords = srcCoords,
                saved[transformerName] = inverse
                    ? buildTransformer(destCoords, srcCoords)
                    : buildTransformer(srcCoords, destCoords));
    }
    function isCanvasEl(el) {
        return el.nodeName.toUpperCase() === 'CANVAS';
    }

    var isDomLevel2 = (typeof window !== 'undefined') && !!window.addEventListener;
    var MOUSE_EVENT_REG = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
    var _calcOut = [];
    function clientToLocal(el, e, out, calculate) {
        out = out || {};
        if (calculate || !env.canvasSupported) {
            calculateZrXY(el, e, out);
        }
        else if (env.browser.firefox
            && e.layerX != null
            && e.layerX !== e.offsetX) {
            out.zrX = e.layerX;
            out.zrY = e.layerY;
        }
        else if (e.offsetX != null) {
            out.zrX = e.offsetX;
            out.zrY = e.offsetY;
        }
        else {
            calculateZrXY(el, e, out);
        }
        return out;
    }
    function calculateZrXY(el, e, out) {
        if (env.domSupported && el.getBoundingClientRect) {
            var ex = e.clientX;
            var ey = e.clientY;
            if (isCanvasEl(el)) {
                var box = el.getBoundingClientRect();
                out.zrX = ex - box.left;
                out.zrY = ey - box.top;
                return;
            }
            else {
                if (transformCoordWithViewport(_calcOut, el, ex, ey)) {
                    out.zrX = _calcOut[0];
                    out.zrY = _calcOut[1];
                    return;
                }
            }
        }
        out.zrX = out.zrY = 0;
    }
    function getNativeEvent(e) {
        return e
            || window.event;
    }
    function normalizeEvent(el, e, calculate) {
        e = getNativeEvent(e);
        if (e.zrX != null) {
            return e;
        }
        var eventType = e.type;
        var isTouch = eventType && eventType.indexOf('touch') >= 0;
        if (!isTouch) {
            clientToLocal(el, e, e, calculate);
            var wheelDelta = getWheelDeltaMayPolyfill(e);
            e.zrDelta = wheelDelta ? wheelDelta / 120 : -(e.detail || 0) / 3;
        }
        else {
            var touch = eventType !== 'touchend'
                ? e.targetTouches[0]
                : e.changedTouches[0];
            touch && clientToLocal(el, touch, e, calculate);
        }
        var button = e.button;
        if (e.which == null && button !== undefined && MOUSE_EVENT_REG.test(e.type)) {
            e.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
        }
        return e;
    }
    function getWheelDeltaMayPolyfill(e) {
        var rawWheelDelta = e.wheelDelta;
        if (rawWheelDelta) {
            return rawWheelDelta;
        }
        var deltaX = e.deltaX;
        var deltaY = e.deltaY;
        if (deltaX == null || deltaY == null) {
            return rawWheelDelta;
        }
        var delta = deltaY !== 0 ? Math.abs(deltaY) : Math.abs(deltaX);
        var sign = deltaY > 0 ? -1
            : deltaY < 0 ? 1
                : deltaX > 0 ? -1
                    : 1;
        return 3 * delta * sign;
    }
    function addEventListener(el, name, handler, opt) {
        if (isDomLevel2) {
            el.addEventListener(name, handler, opt);
        }
        else {
            el.attachEvent('on' + name, handler);
        }
    }
    function removeEventListener(el, name, handler, opt) {
        if (isDomLevel2) {
            el.removeEventListener(name, handler, opt);
        }
        else {
            el.detachEvent('on' + name, handler);
        }
    }
    var stop = isDomLevel2
        ? function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.cancelBubble = true;
        }
        : function (e) {
            e.returnValue = false;
            e.cancelBubble = true;
        };

    var GestureMgr = (function () {
        function GestureMgr() {
            this._track = [];
        }
        GestureMgr.prototype.recognize = function (event, target, root) {
            this._doTrack(event, target, root);
            return this._recognize(event);
        };
        GestureMgr.prototype.clear = function () {
            this._track.length = 0;
            return this;
        };
        GestureMgr.prototype._doTrack = function (event, target, root) {
            var touches = event.touches;
            if (!touches) {
                return;
            }
            var trackItem = {
                points: [],
                touches: [],
                target: target,
                event: event
            };
            for (var i = 0, len = touches.length; i < len; i++) {
                var touch = touches[i];
                var pos = clientToLocal(root, touch, {});
                trackItem.points.push([pos.zrX, pos.zrY]);
                trackItem.touches.push(touch);
            }
            this._track.push(trackItem);
        };
        GestureMgr.prototype._recognize = function (event) {
            for (var eventName in recognizers) {
                if (recognizers.hasOwnProperty(eventName)) {
                    var gestureInfo = recognizers[eventName](this._track, event);
                    if (gestureInfo) {
                        return gestureInfo;
                    }
                }
            }
        };
        return GestureMgr;
    }());
    function dist(pointPair) {
        var dx = pointPair[1][0] - pointPair[0][0];
        var dy = pointPair[1][1] - pointPair[0][1];
        return Math.sqrt(dx * dx + dy * dy);
    }
    function center(pointPair) {
        return [
            (pointPair[0][0] + pointPair[1][0]) / 2,
            (pointPair[0][1] + pointPair[1][1]) / 2
        ];
    }
    var recognizers = {
        pinch: function (tracks, event) {
            var trackLen = tracks.length;
            if (!trackLen) {
                return;
            }
            var pinchEnd = (tracks[trackLen - 1] || {}).points;
            var pinchPre = (tracks[trackLen - 2] || {}).points || pinchEnd;
            if (pinchPre
                && pinchPre.length > 1
                && pinchEnd
                && pinchEnd.length > 1) {
                var pinchScale = dist(pinchEnd) / dist(pinchPre);
                !isFinite(pinchScale) && (pinchScale = 1);
                event.pinchScale = pinchScale;
                var pinchCenter = center(pinchEnd);
                event.pinchX = pinchCenter[0];
                event.pinchY = pinchCenter[1];
                return {
                    type: 'pinch',
                    target: tracks[0].target,
                    event: event
                };
            }
        }
    };

    var SILENT = 'silent';
    function makeEventPacket(eveType, targetInfo, event) {
        return {
            type: eveType,
            event: event,
            target: targetInfo.target,
            topTarget: targetInfo.topTarget,
            cancelBubble: false,
            offsetX: event.zrX,
            offsetY: event.zrY,
            gestureEvent: event.gestureEvent,
            pinchX: event.pinchX,
            pinchY: event.pinchY,
            pinchScale: event.pinchScale,
            wheelDelta: event.zrDelta,
            zrByTouch: event.zrByTouch,
            which: event.which,
            stop: stopEvent
        };
    }
    function stopEvent() {
        stop(this.event);
    }
    var EmptyProxy = (function (_super) {
        __extends(EmptyProxy, _super);
        function EmptyProxy() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.handler = null;
            return _this;
        }
        EmptyProxy.prototype.dispose = function () { };
        EmptyProxy.prototype.setCursor = function () { };
        return EmptyProxy;
    }(Eventful));
    var HoveredResult = (function () {
        function HoveredResult(x, y) {
            this.x = x;
            this.y = y;
        }
        return HoveredResult;
    }());
    var handlerNames = [
        'click', 'dblclick', 'mousewheel', 'mouseout',
        'mouseup', 'mousedown', 'mousemove', 'contextmenu'
    ];
    var Handler = (function (_super) {
        __extends(Handler, _super);
        function Handler(storage, painter, proxy, painterRoot) {
            var _this = _super.call(this) || this;
            _this._hovered = new HoveredResult(0, 0);
            _this.storage = storage;
            _this.painter = painter;
            _this.painterRoot = painterRoot;
            proxy = proxy || new EmptyProxy();
            _this.proxy = null;
            _this.setHandlerProxy(proxy);
            _this._draggingMgr = new Draggable(_this);
            return _this;
        }
        Handler.prototype.setHandlerProxy = function (proxy) {
            if (this.proxy) {
                this.proxy.dispose();
            }
            if (proxy) {
                each(handlerNames, function (name) {
                    proxy.on && proxy.on(name, this[name], this);
                }, this);
                proxy.handler = this;
            }
            this.proxy = proxy;
        };
        Handler.prototype.mousemove = function (event) {
            var x = event.zrX;
            var y = event.zrY;
            var isOutside = isOutsideBoundary(this, x, y);
            var lastHovered = this._hovered;
            var lastHoveredTarget = lastHovered.target;
            if (lastHoveredTarget && !lastHoveredTarget.__zr) {
                lastHovered = this.findHover(lastHovered.x, lastHovered.y);
                lastHoveredTarget = lastHovered.target;
            }
            var hovered = this._hovered = isOutside ? new HoveredResult(x, y) : this.findHover(x, y);
            var hoveredTarget = hovered.target;
            var proxy = this.proxy;
            proxy.setCursor && proxy.setCursor(hoveredTarget ? hoveredTarget.cursor : 'default');
            if (lastHoveredTarget && hoveredTarget !== lastHoveredTarget) {
                this.dispatchToElement(lastHovered, 'mouseout', event);
            }
            this.dispatchToElement(hovered, 'mousemove', event);
            if (hoveredTarget && hoveredTarget !== lastHoveredTarget) {
                this.dispatchToElement(hovered, 'mouseover', event);
            }
        };
        Handler.prototype.mouseout = function (event) {
            var eventControl = event.zrEventControl;
            if (eventControl !== 'only_globalout') {
                this.dispatchToElement(this._hovered, 'mouseout', event);
            }
            if (eventControl !== 'no_globalout') {
                this.trigger('globalout', { type: 'globalout', event: event });
            }
        };
        Handler.prototype.resize = function () {
            this._hovered = new HoveredResult(0, 0);
        };
        Handler.prototype.dispatch = function (eventName, eventArgs) {
            var handler = this[eventName];
            handler && handler.call(this, eventArgs);
        };
        Handler.prototype.dispose = function () {
            this.proxy.dispose();
            this.storage = null;
            this.proxy = null;
            this.painter = null;
        };
        Handler.prototype.setCursorStyle = function (cursorStyle) {
            var proxy = this.proxy;
            proxy.setCursor && proxy.setCursor(cursorStyle);
        };
        Handler.prototype.dispatchToElement = function (targetInfo, eventName, event) {
            targetInfo = targetInfo || {};
            var el = targetInfo.target;
            if (el && el.silent) {
                return;
            }
            var eventKey = ('on' + eventName);
            var eventPacket = makeEventPacket(eventName, targetInfo, event);
            while (el) {
                el[eventKey]
                    && (eventPacket.cancelBubble = !!el[eventKey].call(el, eventPacket));
                el.trigger(eventName, eventPacket);
                el = el.__hostTarget ? el.__hostTarget : el.parent;
                if (eventPacket.cancelBubble) {
                    break;
                }
            }
            if (!eventPacket.cancelBubble) {
                this.trigger(eventName, eventPacket);
                if (this.painter && this.painter.eachOtherLayer) {
                    this.painter.eachOtherLayer(function (layer) {
                        if (typeof (layer[eventKey]) === 'function') {
                            layer[eventKey].call(layer, eventPacket);
                        }
                        if (layer.trigger) {
                            layer.trigger(eventName, eventPacket);
                        }
                    });
                }
            }
        };
        Handler.prototype.findHover = function (x, y, exclude) {
            var list = this.storage.getDisplayList();
            var out = new HoveredResult(x, y);
            for (var i = list.length - 1; i >= 0; i--) {
                var hoverCheckResult = void 0;
                if (list[i] !== exclude
                    && !list[i].ignore
                    && (hoverCheckResult = isHover(list[i], x, y))) {
                    !out.topTarget && (out.topTarget = list[i]);
                    if (hoverCheckResult !== SILENT) {
                        out.target = list[i];
                        break;
                    }
                }
            }
            return out;
        };
        Handler.prototype.processGesture = function (event, stage) {
            if (!this._gestureMgr) {
                this._gestureMgr = new GestureMgr();
            }
            var gestureMgr = this._gestureMgr;
            stage === 'start' && gestureMgr.clear();
            var gestureInfo = gestureMgr.recognize(event, this.findHover(event.zrX, event.zrY, null).target, this.proxy.dom);
            stage === 'end' && gestureMgr.clear();
            if (gestureInfo) {
                var type = gestureInfo.type;
                event.gestureEvent = type;
                var res = new HoveredResult();
                res.target = gestureInfo.target;
                this.dispatchToElement(res, type, gestureInfo.event);
            }
        };
        return Handler;
    }(Eventful));
    each(['click', 'mousedown', 'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
        Handler.prototype[name] = function (event) {
            var x = event.zrX;
            var y = event.zrY;
            var isOutside = isOutsideBoundary(this, x, y);
            var hovered;
            var hoveredTarget;
            if (name !== 'mouseup' || !isOutside) {
                hovered = this.findHover(x, y);
                hoveredTarget = hovered.target;
            }
            if (name === 'mousedown') {
                this._downEl = hoveredTarget;
                this._downPoint = [event.zrX, event.zrY];
                this._upEl = hoveredTarget;
            }
            else if (name === 'mouseup') {
                this._upEl = hoveredTarget;
            }
            else if (name === 'click') {
                if (this._downEl !== this._upEl
                    || !this._downPoint
                    || dist$1(this._downPoint, [event.zrX, event.zrY]) > 4) {
                    return;
                }
                this._downPoint = null;
            }
            this.dispatchToElement(hovered, name, event);
        };
    });
    function isHover(displayable, x, y) {
        if (displayable[displayable.rectHover ? 'rectContain' : 'contain'](x, y)) {
            var el = displayable;
            var isSilent = void 0;
            var ignoreClip = false;
            while (el) {
                if (el.ignoreClip) {
                    ignoreClip = true;
                }
                if (!ignoreClip) {
                    var clipPath = el.getClipPath();
                    if (clipPath && !clipPath.contain(x, y)) {
                        return false;
                    }
                    if (el.silent) {
                        isSilent = true;
                    }
                }
                var hostEl = el.__hostTarget;
                el = hostEl ? hostEl : el.parent;
            }
            return isSilent ? SILENT : true;
        }
        return false;
    }
    function isOutsideBoundary(handlerInstance, x, y) {
        var painter = handlerInstance.painter;
        return x < 0 || x > painter.getWidth() || y < 0 || y > painter.getHeight();
    }

    var DEFAULT_MIN_MERGE = 32;
    var DEFAULT_MIN_GALLOPING = 7;
    function minRunLength(n) {
        var r = 0;
        while (n >= DEFAULT_MIN_MERGE) {
            r |= n & 1;
            n >>= 1;
        }
        return n + r;
    }
    function makeAscendingRun(array, lo, hi, compare) {
        var runHi = lo + 1;
        if (runHi === hi) {
            return 1;
        }
        if (compare(array[runHi++], array[lo]) < 0) {
            while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
                runHi++;
            }
            reverseRun(array, lo, runHi);
        }
        else {
            while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
                runHi++;
            }
        }
        return runHi - lo;
    }
    function reverseRun(array, lo, hi) {
        hi--;
        while (lo < hi) {
            var t = array[lo];
            array[lo++] = array[hi];
            array[hi--] = t;
        }
    }
    function binaryInsertionSort(array, lo, hi, start, compare) {
        if (start === lo) {
            start++;
        }
        for (; start < hi; start++) {
            var pivot = array[start];
            var left = lo;
            var right = start;
            var mid;
            while (left < right) {
                mid = left + right >>> 1;
                if (compare(pivot, array[mid]) < 0) {
                    right = mid;
                }
                else {
                    left = mid + 1;
                }
            }
            var n = start - left;
            switch (n) {
                case 3:
                    array[left + 3] = array[left + 2];
                case 2:
                    array[left + 2] = array[left + 1];
                case 1:
                    array[left + 1] = array[left];
                    break;
                default:
                    while (n > 0) {
                        array[left + n] = array[left + n - 1];
                        n--;
                    }
            }
            array[left] = pivot;
        }
    }
    function gallopLeft(value, array, start, length, hint, compare) {
        var lastOffset = 0;
        var maxOffset = 0;
        var offset = 1;
        if (compare(value, array[start + hint]) > 0) {
            maxOffset = length - hint;
            while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                if (offset <= 0) {
                    offset = maxOffset;
                }
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }
            lastOffset += hint;
            offset += hint;
        }
        else {
            maxOffset = hint + 1;
            while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                if (offset <= 0) {
                    offset = maxOffset;
                }
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }
            var tmp = lastOffset;
            lastOffset = hint - offset;
            offset = hint - tmp;
        }
        lastOffset++;
        while (lastOffset < offset) {
            var m = lastOffset + (offset - lastOffset >>> 1);
            if (compare(value, array[start + m]) > 0) {
                lastOffset = m + 1;
            }
            else {
                offset = m;
            }
        }
        return offset;
    }
    function gallopRight(value, array, start, length, hint, compare) {
        var lastOffset = 0;
        var maxOffset = 0;
        var offset = 1;
        if (compare(value, array[start + hint]) < 0) {
            maxOffset = hint + 1;
            while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                if (offset <= 0) {
                    offset = maxOffset;
                }
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }
            var tmp = lastOffset;
            lastOffset = hint - offset;
            offset = hint - tmp;
        }
        else {
            maxOffset = length - hint;
            while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                if (offset <= 0) {
                    offset = maxOffset;
                }
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }
            lastOffset += hint;
            offset += hint;
        }
        lastOffset++;
        while (lastOffset < offset) {
            var m = lastOffset + (offset - lastOffset >>> 1);
            if (compare(value, array[start + m]) < 0) {
                offset = m;
            }
            else {
                lastOffset = m + 1;
            }
        }
        return offset;
    }
    function TimSort(array, compare) {
        var minGallop = DEFAULT_MIN_GALLOPING;
        var runStart;
        var runLength;
        var stackSize = 0;
        var tmp = [];
        runStart = [];
        runLength = [];
        function pushRun(_runStart, _runLength) {
            runStart[stackSize] = _runStart;
            runLength[stackSize] = _runLength;
            stackSize += 1;
        }
        function mergeRuns() {
            while (stackSize > 1) {
                var n = stackSize - 2;
                if ((n >= 1 && runLength[n - 1] <= runLength[n] + runLength[n + 1])
                    || (n >= 2 && runLength[n - 2] <= runLength[n] + runLength[n - 1])) {
                    if (runLength[n - 1] < runLength[n + 1]) {
                        n--;
                    }
                }
                else if (runLength[n] > runLength[n + 1]) {
                    break;
                }
                mergeAt(n);
            }
        }
        function forceMergeRuns() {
            while (stackSize > 1) {
                var n = stackSize - 2;
                if (n > 0 && runLength[n - 1] < runLength[n + 1]) {
                    n--;
                }
                mergeAt(n);
            }
        }
        function mergeAt(i) {
            var start1 = runStart[i];
            var length1 = runLength[i];
            var start2 = runStart[i + 1];
            var length2 = runLength[i + 1];
            runLength[i] = length1 + length2;
            if (i === stackSize - 3) {
                runStart[i + 1] = runStart[i + 2];
                runLength[i + 1] = runLength[i + 2];
            }
            stackSize--;
            var k = gallopRight(array[start2], array, start1, length1, 0, compare);
            start1 += k;
            length1 -= k;
            if (length1 === 0) {
                return;
            }
            length2 = gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);
            if (length2 === 0) {
                return;
            }
            if (length1 <= length2) {
                mergeLow(start1, length1, start2, length2);
            }
            else {
                mergeHigh(start1, length1, start2, length2);
            }
        }
        function mergeLow(start1, length1, start2, length2) {
            var i = 0;
            for (i = 0; i < length1; i++) {
                tmp[i] = array[start1 + i];
            }
            var cursor1 = 0;
            var cursor2 = start2;
            var dest = start1;
            array[dest++] = array[cursor2++];
            if (--length2 === 0) {
                for (i = 0; i < length1; i++) {
                    array[dest + i] = tmp[cursor1 + i];
                }
                return;
            }
            if (length1 === 1) {
                for (i = 0; i < length2; i++) {
                    array[dest + i] = array[cursor2 + i];
                }
                array[dest + length2] = tmp[cursor1];
                return;
            }
            var _minGallop = minGallop;
            var count1;
            var count2;
            var exit;
            while (1) {
                count1 = 0;
                count2 = 0;
                exit = false;
                do {
                    if (compare(array[cursor2], tmp[cursor1]) < 0) {
                        array[dest++] = array[cursor2++];
                        count2++;
                        count1 = 0;
                        if (--length2 === 0) {
                            exit = true;
                            break;
                        }
                    }
                    else {
                        array[dest++] = tmp[cursor1++];
                        count1++;
                        count2 = 0;
                        if (--length1 === 1) {
                            exit = true;
                            break;
                        }
                    }
                } while ((count1 | count2) < _minGallop);
                if (exit) {
                    break;
                }
                do {
                    count1 = gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);
                    if (count1 !== 0) {
                        for (i = 0; i < count1; i++) {
                            array[dest + i] = tmp[cursor1 + i];
                        }
                        dest += count1;
                        cursor1 += count1;
                        length1 -= count1;
                        if (length1 <= 1) {
                            exit = true;
                            break;
                        }
                    }
                    array[dest++] = array[cursor2++];
                    if (--length2 === 0) {
                        exit = true;
                        break;
                    }
                    count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);
                    if (count2 !== 0) {
                        for (i = 0; i < count2; i++) {
                            array[dest + i] = array[cursor2 + i];
                        }
                        dest += count2;
                        cursor2 += count2;
                        length2 -= count2;
                        if (length2 === 0) {
                            exit = true;
                            break;
                        }
                    }
                    array[dest++] = tmp[cursor1++];
                    if (--length1 === 1) {
                        exit = true;
                        break;
                    }
                    _minGallop--;
                } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);
                if (exit) {
                    break;
                }
                if (_minGallop < 0) {
                    _minGallop = 0;
                }
                _minGallop += 2;
            }
            minGallop = _minGallop;
            minGallop < 1 && (minGallop = 1);
            if (length1 === 1) {
                for (i = 0; i < length2; i++) {
                    array[dest + i] = array[cursor2 + i];
                }
                array[dest + length2] = tmp[cursor1];
            }
            else if (length1 === 0) {
                throw new Error();
            }
            else {
                for (i = 0; i < length1; i++) {
                    array[dest + i] = tmp[cursor1 + i];
                }
            }
        }
        function mergeHigh(start1, length1, start2, length2) {
            var i = 0;
            for (i = 0; i < length2; i++) {
                tmp[i] = array[start2 + i];
            }
            var cursor1 = start1 + length1 - 1;
            var cursor2 = length2 - 1;
            var dest = start2 + length2 - 1;
            var customCursor = 0;
            var customDest = 0;
            array[dest--] = array[cursor1--];
            if (--length1 === 0) {
                customCursor = dest - (length2 - 1);
                for (i = 0; i < length2; i++) {
                    array[customCursor + i] = tmp[i];
                }
                return;
            }
            if (length2 === 1) {
                dest -= length1;
                cursor1 -= length1;
                customDest = dest + 1;
                customCursor = cursor1 + 1;
                for (i = length1 - 1; i >= 0; i--) {
                    array[customDest + i] = array[customCursor + i];
                }
                array[dest] = tmp[cursor2];
                return;
            }
            var _minGallop = minGallop;
            while (true) {
                var count1 = 0;
                var count2 = 0;
                var exit = false;
                do {
                    if (compare(tmp[cursor2], array[cursor1]) < 0) {
                        array[dest--] = array[cursor1--];
                        count1++;
                        count2 = 0;
                        if (--length1 === 0) {
                            exit = true;
                            break;
                        }
                    }
                    else {
                        array[dest--] = tmp[cursor2--];
                        count2++;
                        count1 = 0;
                        if (--length2 === 1) {
                            exit = true;
                            break;
                        }
                    }
                } while ((count1 | count2) < _minGallop);
                if (exit) {
                    break;
                }
                do {
                    count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);
                    if (count1 !== 0) {
                        dest -= count1;
                        cursor1 -= count1;
                        length1 -= count1;
                        customDest = dest + 1;
                        customCursor = cursor1 + 1;
                        for (i = count1 - 1; i >= 0; i--) {
                            array[customDest + i] = array[customCursor + i];
                        }
                        if (length1 === 0) {
                            exit = true;
                            break;
                        }
                    }
                    array[dest--] = tmp[cursor2--];
                    if (--length2 === 1) {
                        exit = true;
                        break;
                    }
                    count2 = length2 - gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);
                    if (count2 !== 0) {
                        dest -= count2;
                        cursor2 -= count2;
                        length2 -= count2;
                        customDest = dest + 1;
                        customCursor = cursor2 + 1;
                        for (i = 0; i < count2; i++) {
                            array[customDest + i] = tmp[customCursor + i];
                        }
                        if (length2 <= 1) {
                            exit = true;
                            break;
                        }
                    }
                    array[dest--] = array[cursor1--];
                    if (--length1 === 0) {
                        exit = true;
                        break;
                    }
                    _minGallop--;
                } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);
                if (exit) {
                    break;
                }
                if (_minGallop < 0) {
                    _minGallop = 0;
                }
                _minGallop += 2;
            }
            minGallop = _minGallop;
            if (minGallop < 1) {
                minGallop = 1;
            }
            if (length2 === 1) {
                dest -= length1;
                cursor1 -= length1;
                customDest = dest + 1;
                customCursor = cursor1 + 1;
                for (i = length1 - 1; i >= 0; i--) {
                    array[customDest + i] = array[customCursor + i];
                }
                array[dest] = tmp[cursor2];
            }
            else if (length2 === 0) {
                throw new Error();
            }
            else {
                customCursor = dest - (length2 - 1);
                for (i = 0; i < length2; i++) {
                    array[customCursor + i] = tmp[i];
                }
            }
        }
        return {
            mergeRuns: mergeRuns,
            forceMergeRuns: forceMergeRuns,
            pushRun: pushRun
        };
    }
    function sort(array, compare, lo, hi) {
        if (!lo) {
            lo = 0;
        }
        if (!hi) {
            hi = array.length;
        }
        var remaining = hi - lo;
        if (remaining < 2) {
            return;
        }
        var runLength = 0;
        if (remaining < DEFAULT_MIN_MERGE) {
            runLength = makeAscendingRun(array, lo, hi, compare);
            binaryInsertionSort(array, lo, hi, lo + runLength, compare);
            return;
        }
        var ts = TimSort(array, compare);
        var minRun = minRunLength(remaining);
        do {
            runLength = makeAscendingRun(array, lo, hi, compare);
            if (runLength < minRun) {
                var force = remaining;
                if (force > minRun) {
                    force = minRun;
                }
                binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
                runLength = force;
            }
            ts.pushRun(lo, runLength);
            ts.mergeRuns();
            remaining -= runLength;
            lo += runLength;
        } while (remaining !== 0);
        ts.forceMergeRuns();
    }

    var invalidZErrorLogged = false;
    function logInvalidZError() {
        if (invalidZErrorLogged) {
            return;
        }
        invalidZErrorLogged = true;
        console.warn('z / z2 / zlevel of displayable is invalid, which may cause unexpected errors');
    }
    function shapeCompareFunc(a, b) {
        if (a.zlevel === b.zlevel) {
            if (a.z === b.z) {
                return a.z2 - b.z2;
            }
            return a.z - b.z;
        }
        return a.zlevel - b.zlevel;
    }
    var Storage = (function () {
        function Storage() {
            this._roots = [];
            this._displayList = [];
            this._displayListLen = 0;
            this.displayableSortFunc = shapeCompareFunc;
        }
        Storage.prototype.traverse = function (cb, context) {
            for (var i = 0; i < this._roots.length; i++) {
                this._roots[i].traverse(cb, context);
            }
        };
        Storage.prototype.getDisplayList = function (update, includeIgnore) {
            includeIgnore = includeIgnore || false;
            var displayList = this._displayList;
            if (update || !displayList.length) {
                this.updateDisplayList(includeIgnore);
            }
            return displayList;
        };
        Storage.prototype.updateDisplayList = function (includeIgnore) {
            this._displayListLen = 0;
            var roots = this._roots;
            var displayList = this._displayList;
            for (var i = 0, len = roots.length; i < len; i++) {
                this._updateAndAddDisplayable(roots[i], null, includeIgnore);
            }
            displayList.length = this._displayListLen;
            env.canvasSupported && sort(displayList, shapeCompareFunc);
        };
        Storage.prototype._updateAndAddDisplayable = function (el, clipPaths, includeIgnore) {
            if (el.ignore && !includeIgnore) {
                return;
            }
            el.beforeUpdate();
            el.update();
            el.afterUpdate();
            var userSetClipPath = el.getClipPath();
            if (el.ignoreClip) {
                clipPaths = null;
            }
            else if (userSetClipPath) {
                if (clipPaths) {
                    clipPaths = clipPaths.slice();
                }
                else {
                    clipPaths = [];
                }
                var currentClipPath = userSetClipPath;
                var parentClipPath = el;
                while (currentClipPath) {
                    currentClipPath.parent = parentClipPath;
                    currentClipPath.updateTransform();
                    clipPaths.push(currentClipPath);
                    parentClipPath = currentClipPath;
                    currentClipPath = currentClipPath.getClipPath();
                }
            }
            if (el.childrenRef) {
                var children = el.childrenRef();
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    if (el.__dirty) {
                        child.__dirty |= REDARAW_BIT;
                    }
                    this._updateAndAddDisplayable(child, clipPaths, includeIgnore);
                }
                el.__dirty = 0;
            }
            else {
                var disp = el;
                if (clipPaths && clipPaths.length) {
                    disp.__clipPaths = clipPaths;
                }
                else if (disp.__clipPaths && disp.__clipPaths.length > 0) {
                    disp.__clipPaths = [];
                }
                if (isNaN(disp.z)) {
                    logInvalidZError();
                    disp.z = 0;
                }
                if (isNaN(disp.z2)) {
                    logInvalidZError();
                    disp.z2 = 0;
                }
                if (isNaN(disp.zlevel)) {
                    logInvalidZError();
                    disp.zlevel = 0;
                }
                this._displayList[this._displayListLen++] = disp;
            }
            var decalEl = el.getDecalElement && el.getDecalElement();
            if (decalEl) {
                this._updateAndAddDisplayable(decalEl, clipPaths, includeIgnore);
            }
            var textGuide = el.getTextGuideLine();
            if (textGuide) {
                this._updateAndAddDisplayable(textGuide, clipPaths, includeIgnore);
            }
            var textEl = el.getTextContent();
            if (textEl) {
                this._updateAndAddDisplayable(textEl, clipPaths, includeIgnore);
            }
        };
        Storage.prototype.addRoot = function (el) {
            if (el.__zr && el.__zr.storage === this) {
                return;
            }
            this._roots.push(el);
        };
        Storage.prototype.delRoot = function (el) {
            if (el instanceof Array) {
                for (var i = 0, l = el.length; i < l; i++) {
                    this.delRoot(el[i]);
                }
                return;
            }
            var idx = indexOf(this._roots, el);
            if (idx >= 0) {
                this._roots.splice(idx, 1);
            }
        };
        Storage.prototype.delAllRoots = function () {
            this._roots = [];
            this._displayList = [];
            this._displayListLen = 0;
            return;
        };
        Storage.prototype.getRoots = function () {
            return this._roots;
        };
        Storage.prototype.dispose = function () {
            this._displayList = null;
            this._roots = null;
        };
        return Storage;
    }());

    var Animation = (function (_super) {
        __extends(Animation, _super);
        function Animation(opts) {
            var _this = _super.call(this) || this;
            _this._running = false;
            _this._time = 0;
            _this._pausedTime = 0;
            _this._pauseStart = 0;
            _this._paused = false;
            opts = opts || {};
            _this.stage = opts.stage || {};
            _this.onframe = opts.onframe || function () { };
            return _this;
        }
        Animation.prototype.addClip = function (clip) {
            if (clip.animation) {
                this.removeClip(clip);
            }
            if (!this._clipsHead) {
                this._clipsHead = this._clipsTail = clip;
            }
            else {
                this._clipsTail.next = clip;
                clip.prev = this._clipsTail;
                clip.next = null;
                this._clipsTail = clip;
            }
            clip.animation = this;
        };
        Animation.prototype.addAnimator = function (animator) {
            animator.animation = this;
            var clip = animator.getClip();
            if (clip) {
                this.addClip(clip);
            }
        };
        Animation.prototype.removeClip = function (clip) {
            if (!clip.animation) {
                return;
            }
            var prev = clip.prev;
            var next = clip.next;
            if (prev) {
                prev.next = next;
            }
            else {
                this._clipsHead = next;
            }
            if (next) {
                next.prev = prev;
            }
            else {
                this._clipsTail = prev;
            }
            clip.next = clip.prev = clip.animation = null;
        };
        Animation.prototype.removeAnimator = function (animator) {
            var clip = animator.getClip();
            if (clip) {
                this.removeClip(clip);
            }
            animator.animation = null;
        };
        Animation.prototype.update = function (notTriggerFrameAndStageUpdate) {
            var time = new Date().getTime() - this._pausedTime;
            var delta = time - this._time;
            var clip = this._clipsHead;
            while (clip) {
                var nextClip = clip.next;
                var finished = clip.step(time, delta);
                if (finished) {
                    clip.ondestroy && clip.ondestroy();
                    this.removeClip(clip);
                    clip = nextClip;
                }
                else {
                    clip = nextClip;
                }
            }
            this._time = time;
            if (!notTriggerFrameAndStageUpdate) {
                this.onframe(delta);
                this.trigger('frame', delta);
                this.stage.update && this.stage.update();
            }
        };
        Animation.prototype._startLoop = function () {
            var self = this;
            this._running = true;
            function step() {
                if (self._running) {
                    requestAnimationFrame$1(step);
                    !self._paused && self.update();
                }
            }
            requestAnimationFrame$1(step);
        };
        Animation.prototype.start = function () {
            if (this._running) {
                return;
            }
            this._time = new Date().getTime();
            this._pausedTime = 0;
            this._startLoop();
        };
        Animation.prototype.stop = function () {
            this._running = false;
        };
        Animation.prototype.pause = function () {
            if (!this._paused) {
                this._pauseStart = new Date().getTime();
                this._paused = true;
            }
        };
        Animation.prototype.resume = function () {
            if (this._paused) {
                this._pausedTime += (new Date().getTime()) - this._pauseStart;
                this._paused = false;
            }
        };
        Animation.prototype.clear = function () {
            var clip = this._clipsHead;
            while (clip) {
                var nextClip = clip.next;
                clip.prev = clip.next = clip.animation = null;
                clip = nextClip;
            }
            this._clipsHead = this._clipsTail = null;
        };
        Animation.prototype.isFinished = function () {
            return this._clipsHead == null;
        };
        Animation.prototype.animate = function (target, options) {
            options = options || {};
            this.start();
            var animator = new Animator(target, options.loop);
            this.addAnimator(animator);
            return animator;
        };
        return Animation;
    }(Eventful));

    var TOUCH_CLICK_DELAY = 300;
    var globalEventSupported = env.domSupported;
    var localNativeListenerNames = (function () {
        var mouseHandlerNames = [
            'click', 'dblclick', 'mousewheel', 'wheel', 'mouseout',
            'mouseup', 'mousedown', 'mousemove', 'contextmenu'
        ];
        var touchHandlerNames = [
            'touchstart', 'touchend', 'touchmove'
        ];
        var pointerEventNameMap = {
            pointerdown: 1, pointerup: 1, pointermove: 1, pointerout: 1
        };
        var pointerHandlerNames = map(mouseHandlerNames, function (name) {
            var nm = name.replace('mouse', 'pointer');
            return pointerEventNameMap.hasOwnProperty(nm) ? nm : name;
        });
        return {
            mouse: mouseHandlerNames,
            touch: touchHandlerNames,
            pointer: pointerHandlerNames
        };
    })();
    var globalNativeListenerNames = {
        mouse: ['mousemove', 'mouseup'],
        pointer: ['pointermove', 'pointerup']
    };
    var wheelEventSupported = false;
    function isPointerFromTouch(event) {
        var pointerType = event.pointerType;
        return pointerType === 'pen' || pointerType === 'touch';
    }
    function setTouchTimer(scope) {
        scope.touching = true;
        if (scope.touchTimer != null) {
            clearTimeout(scope.touchTimer);
            scope.touchTimer = null;
        }
        scope.touchTimer = setTimeout(function () {
            scope.touching = false;
            scope.touchTimer = null;
        }, 700);
    }
    function markTouch(event) {
        event && (event.zrByTouch = true);
    }
    function normalizeGlobalEvent(instance, event) {
        return normalizeEvent(instance.dom, new FakeGlobalEvent(instance, event), true);
    }
    function isLocalEl(instance, el) {
        var elTmp = el;
        var isLocal = false;
        while (elTmp && elTmp.nodeType !== 9
            && !(isLocal = elTmp.domBelongToZr
                || (elTmp !== el && elTmp === instance.painterRoot))) {
            elTmp = elTmp.parentNode;
        }
        return isLocal;
    }
    var FakeGlobalEvent = (function () {
        function FakeGlobalEvent(instance, event) {
            this.stopPropagation = noop;
            this.stopImmediatePropagation = noop;
            this.preventDefault = noop;
            this.type = event.type;
            this.target = this.currentTarget = instance.dom;
            this.pointerType = event.pointerType;
            this.clientX = event.clientX;
            this.clientY = event.clientY;
        }
        return FakeGlobalEvent;
    }());
    var localDOMHandlers = {
        mousedown: function (event) {
            event = normalizeEvent(this.dom, event);
            this.__mayPointerCapture = [event.zrX, event.zrY];
            this.trigger('mousedown', event);
        },
        mousemove: function (event) {
            event = normalizeEvent(this.dom, event);
            var downPoint = this.__mayPointerCapture;
            if (downPoint && (event.zrX !== downPoint[0] || event.zrY !== downPoint[1])) {
                this.__togglePointerCapture(true);
            }
            this.trigger('mousemove', event);
        },
        mouseup: function (event) {
            event = normalizeEvent(this.dom, event);
            this.__togglePointerCapture(false);
            this.trigger('mouseup', event);
        },
        mouseout: function (event) {
            event = normalizeEvent(this.dom, event);
            var element = event.toElement || event.relatedTarget;
            if (!isLocalEl(this, element)) {
                if (this.__pointerCapturing) {
                    event.zrEventControl = 'no_globalout';
                }
                this.trigger('mouseout', event);
            }
        },
        wheel: function (event) {
            wheelEventSupported = true;
            event = normalizeEvent(this.dom, event);
            this.trigger('mousewheel', event);
        },
        mousewheel: function (event) {
            if (wheelEventSupported) {
                return;
            }
            event = normalizeEvent(this.dom, event);
            this.trigger('mousewheel', event);
        },
        touchstart: function (event) {
            event = normalizeEvent(this.dom, event);
            markTouch(event);
            this.__lastTouchMoment = new Date();
            this.handler.processGesture(event, 'start');
            localDOMHandlers.mousemove.call(this, event);
            localDOMHandlers.mousedown.call(this, event);
        },
        touchmove: function (event) {
            event = normalizeEvent(this.dom, event);
            markTouch(event);
            this.handler.processGesture(event, 'change');
            localDOMHandlers.mousemove.call(this, event);
        },
        touchend: function (event) {
            event = normalizeEvent(this.dom, event);
            markTouch(event);
            this.handler.processGesture(event, 'end');
            localDOMHandlers.mouseup.call(this, event);
            if (+new Date() - (+this.__lastTouchMoment) < TOUCH_CLICK_DELAY) {
                localDOMHandlers.click.call(this, event);
            }
        },
        pointerdown: function (event) {
            localDOMHandlers.mousedown.call(this, event);
        },
        pointermove: function (event) {
            if (!isPointerFromTouch(event)) {
                localDOMHandlers.mousemove.call(this, event);
            }
        },
        pointerup: function (event) {
            localDOMHandlers.mouseup.call(this, event);
        },
        pointerout: function (event) {
            if (!isPointerFromTouch(event)) {
                localDOMHandlers.mouseout.call(this, event);
            }
        }
    };
    each(['click', 'dblclick', 'contextmenu'], function (name) {
        localDOMHandlers[name] = function (event) {
            event = normalizeEvent(this.dom, event);
            this.trigger(name, event);
        };
    });
    var globalDOMHandlers = {
        pointermove: function (event) {
            if (!isPointerFromTouch(event)) {
                globalDOMHandlers.mousemove.call(this, event);
            }
        },
        pointerup: function (event) {
            globalDOMHandlers.mouseup.call(this, event);
        },
        mousemove: function (event) {
            this.trigger('mousemove', event);
        },
        mouseup: function (event) {
            var pointerCaptureReleasing = this.__pointerCapturing;
            this.__togglePointerCapture(false);
            this.trigger('mouseup', event);
            if (pointerCaptureReleasing) {
                event.zrEventControl = 'only_globalout';
                this.trigger('mouseout', event);
            }
        }
    };
    function mountLocalDOMEventListeners(instance, scope) {
        var domHandlers = scope.domHandlers;
        if (env.pointerEventsSupported) {
            each(localNativeListenerNames.pointer, function (nativeEventName) {
                mountSingleDOMEventListener(scope, nativeEventName, function (event) {
                    domHandlers[nativeEventName].call(instance, event);
                });
            });
        }
        else {
            if (env.touchEventsSupported) {
                each(localNativeListenerNames.touch, function (nativeEventName) {
                    mountSingleDOMEventListener(scope, nativeEventName, function (event) {
                        domHandlers[nativeEventName].call(instance, event);
                        setTouchTimer(scope);
                    });
                });
            }
            each(localNativeListenerNames.mouse, function (nativeEventName) {
                mountSingleDOMEventListener(scope, nativeEventName, function (event) {
                    event = getNativeEvent(event);
                    if (!scope.touching) {
                        domHandlers[nativeEventName].call(instance, event);
                    }
                });
            });
        }
    }
    function mountGlobalDOMEventListeners(instance, scope) {
        if (env.pointerEventsSupported) {
            each(globalNativeListenerNames.pointer, mount);
        }
        else if (!env.touchEventsSupported) {
            each(globalNativeListenerNames.mouse, mount);
        }
        function mount(nativeEventName) {
            function nativeEventListener(event) {
                event = getNativeEvent(event);
                if (!isLocalEl(instance, event.target)) {
                    event = normalizeGlobalEvent(instance, event);
                    scope.domHandlers[nativeEventName].call(instance, event);
                }
            }
            mountSingleDOMEventListener(scope, nativeEventName, nativeEventListener, { capture: true });
        }
    }
    function mountSingleDOMEventListener(scope, nativeEventName, listener, opt) {
        scope.mounted[nativeEventName] = listener;
        scope.listenerOpts[nativeEventName] = opt;
        addEventListener(scope.domTarget, nativeEventName, listener, opt);
    }
    function unmountDOMEventListeners(scope) {
        var mounted = scope.mounted;
        for (var nativeEventName in mounted) {
            if (mounted.hasOwnProperty(nativeEventName)) {
                removeEventListener(scope.domTarget, nativeEventName, mounted[nativeEventName], scope.listenerOpts[nativeEventName]);
            }
        }
        scope.mounted = {};
    }
    var DOMHandlerScope = (function () {
        function DOMHandlerScope(domTarget, domHandlers) {
            this.mounted = {};
            this.listenerOpts = {};
            this.touching = false;
            this.domTarget = domTarget;
            this.domHandlers = domHandlers;
        }
        return DOMHandlerScope;
    }());
    var HandlerDomProxy = (function (_super) {
        __extends(HandlerDomProxy, _super);
        function HandlerDomProxy(dom, painterRoot) {
            var _this = _super.call(this) || this;
            _this.__pointerCapturing = false;
            _this.dom = dom;
            _this.painterRoot = painterRoot;
            _this._localHandlerScope = new DOMHandlerScope(dom, localDOMHandlers);
            if (globalEventSupported) {
                _this._globalHandlerScope = new DOMHandlerScope(document, globalDOMHandlers);
            }
            mountLocalDOMEventListeners(_this, _this._localHandlerScope);
            return _this;
        }
        HandlerDomProxy.prototype.dispose = function () {
            unmountDOMEventListeners(this._localHandlerScope);
            if (globalEventSupported) {
                unmountDOMEventListeners(this._globalHandlerScope);
            }
        };
        HandlerDomProxy.prototype.setCursor = function (cursorStyle) {
            this.dom.style && (this.dom.style.cursor = cursorStyle || 'default');
        };
        HandlerDomProxy.prototype.__togglePointerCapture = function (isPointerCapturing) {
            this.__mayPointerCapture = null;
            if (globalEventSupported
                && ((+this.__pointerCapturing) ^ (+isPointerCapturing))) {
                this.__pointerCapturing = isPointerCapturing;
                var globalHandlerScope = this._globalHandlerScope;
                isPointerCapturing
                    ? mountGlobalDOMEventListeners(this, globalHandlerScope)
                    : unmountDOMEventListeners(globalHandlerScope);
            }
        };
        return HandlerDomProxy;
    }(Eventful));

    var Group = (function (_super) {
        __extends(Group, _super);
        function Group(opts) {
            var _this = _super.call(this) || this;
            _this.isGroup = true;
            _this._children = [];
            _this.attr(opts);
            return _this;
        }
        Group.prototype.childrenRef = function () {
            return this._children;
        };
        Group.prototype.children = function () {
            return this._children.slice();
        };
        Group.prototype.childAt = function (idx) {
            return this._children[idx];
        };
        Group.prototype.childOfName = function (name) {
            var children = this._children;
            for (var i = 0; i < children.length; i++) {
                if (children[i].name === name) {
                    return children[i];
                }
            }
        };
        Group.prototype.childCount = function () {
            return this._children.length;
        };
        Group.prototype.add = function (child) {
            if (child) {
                if (child !== this && child.parent !== this) {
                    this._children.push(child);
                    this._doAdd(child);
                }
                if (child.__hostTarget) {
                    throw 'This elemenet has been used as an attachment';
                }
            }
            return this;
        };
        Group.prototype.addBefore = function (child, nextSibling) {
            if (child && child !== this && child.parent !== this
                && nextSibling && nextSibling.parent === this) {
                var children = this._children;
                var idx = children.indexOf(nextSibling);
                if (idx >= 0) {
                    children.splice(idx, 0, child);
                    this._doAdd(child);
                }
            }
            return this;
        };
        Group.prototype.replaceAt = function (child, index) {
            var children = this._children;
            var old = children[index];
            if (child && child !== this && child.parent !== this && child !== old) {
                children[index] = child;
                old.parent = null;
                var zr = this.__zr;
                if (zr) {
                    old.removeSelfFromZr(zr);
                }
                this._doAdd(child);
            }
            return this;
        };
        Group.prototype._doAdd = function (child) {
            if (child.parent) {
                child.parent.remove(child);
            }
            child.parent = this;
            var zr = this.__zr;
            if (zr && zr !== child.__zr) {
                child.addSelfToZr(zr);
            }
            zr && zr.refresh();
        };
        Group.prototype.remove = function (child) {
            var zr = this.__zr;
            var children = this._children;
            var idx = indexOf(children, child);
            if (idx < 0) {
                return this;
            }
            children.splice(idx, 1);
            child.parent = null;
            if (zr) {
                child.removeSelfFromZr(zr);
            }
            zr && zr.refresh();
            return this;
        };
        Group.prototype.removeAll = function () {
            var children = this._children;
            var zr = this.__zr;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (zr) {
                    child.removeSelfFromZr(zr);
                }
                child.parent = null;
            }
            children.length = 0;
            return this;
        };
        Group.prototype.eachChild = function (cb, context) {
            var children = this._children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                cb.call(context, child, i);
            }
            return this;
        };
        Group.prototype.traverse = function (cb, context) {
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                var stopped = cb.call(context, child);
                if (child.isGroup && !stopped) {
                    child.traverse(cb, context);
                }
            }
            return this;
        };
        Group.prototype.addSelfToZr = function (zr) {
            _super.prototype.addSelfToZr.call(this, zr);
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                child.addSelfToZr(zr);
            }
        };
        Group.prototype.removeSelfFromZr = function (zr) {
            _super.prototype.removeSelfFromZr.call(this, zr);
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                child.removeSelfFromZr(zr);
            }
        };
        Group.prototype.getBoundingRect = function (includeChildren) {
            var tmpRect = new BoundingRect(0, 0, 0, 0);
            var children = includeChildren || this._children;
            var tmpMat = [];
            var rect = null;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.ignore || child.invisible) {
                    continue;
                }
                var childRect = child.getBoundingRect();
                var transform = child.getLocalTransform(tmpMat);
                if (transform) {
                    BoundingRect.applyTransform(tmpRect, childRect, transform);
                    rect = rect || tmpRect.clone();
                    rect.union(tmpRect);
                }
                else {
                    rect = rect || childRect.clone();
                    rect.union(childRect);
                }
            }
            return rect || tmpRect;
        };
        return Group;
    }(Element));
    Group.prototype.type = 'group';

    /*!
    * ZRender, a high performance 2d drawing library.
    *
    * Copyright (c) 2013, Baidu Inc.
    * All rights reserved.
    *
    * LICENSE
    * https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
    */
    var useVML = !env.canvasSupported;
    var painterCtors = {};
    var instances = {};
    function delInstance(id) {
        delete instances[id];
    }
    function isDarkMode(backgroundColor) {
        if (!backgroundColor) {
            return false;
        }
        if (typeof backgroundColor === 'string') {
            return lum(backgroundColor, 1) < DARK_MODE_THRESHOLD;
        }
        else if (backgroundColor.colorStops) {
            var colorStops = backgroundColor.colorStops;
            var totalLum = 0;
            var len = colorStops.length;
            for (var i = 0; i < len; i++) {
                totalLum += lum(colorStops[i].color, 1);
            }
            totalLum /= len;
            return totalLum < DARK_MODE_THRESHOLD;
        }
        return false;
    }
    var ZRender = (function () {
        function ZRender(id, dom, opts) {
            var _this = this;
            this._sleepAfterStill = 10;
            this._stillFrameAccum = 0;
            this._needsRefresh = true;
            this._needsRefreshHover = true;
            this._darkMode = false;
            opts = opts || {};
            this.dom = dom;
            this.id = id;
            var storage = new Storage();
            var rendererType = opts.renderer || 'canvas';
            if (useVML) {
                throw new Error('IE8 support has been dropped since 5.0');
            }
            if (!painterCtors[rendererType]) {
                rendererType = keys$1(painterCtors)[0];
            }
            if (!painterCtors[rendererType]) {
                throw new Error("Renderer '" + rendererType + "' is not imported. Please import it first.");
            }
            opts.useDirtyRect = opts.useDirtyRect == null
                ? false
                : opts.useDirtyRect;
            var painter = new painterCtors[rendererType](dom, storage, opts, id);
            this.storage = storage;
            this.painter = painter;
            var handerProxy = (!env.node && !env.worker)
                ? new HandlerDomProxy(painter.getViewportRoot(), painter.root)
                : null;
            this.handler = new Handler(storage, painter, handerProxy, painter.root);
            this.animation = new Animation({
                stage: {
                    update: function () { return _this._flush(true); }
                }
            });
            this.animation.start();
        }
        ZRender.prototype.add = function (el) {
            if (!el) {
                return;
            }
            this.storage.addRoot(el);
            el.addSelfToZr(this);
            this.refresh();
        };
        ZRender.prototype.remove = function (el) {
            if (!el) {
                return;
            }
            this.storage.delRoot(el);
            el.removeSelfFromZr(this);
            this.refresh();
        };
        ZRender.prototype.configLayer = function (zLevel, config) {
            if (this.painter.configLayer) {
                this.painter.configLayer(zLevel, config);
            }
            this.refresh();
        };
        ZRender.prototype.setBackgroundColor = function (backgroundColor) {
            if (this.painter.setBackgroundColor) {
                this.painter.setBackgroundColor(backgroundColor);
            }
            this.refresh();
            this._backgroundColor = backgroundColor;
            this._darkMode = isDarkMode(backgroundColor);
        };
        ZRender.prototype.getBackgroundColor = function () {
            return this._backgroundColor;
        };
        ZRender.prototype.setDarkMode = function (darkMode) {
            this._darkMode = darkMode;
        };
        ZRender.prototype.isDarkMode = function () {
            return this._darkMode;
        };
        ZRender.prototype.refreshImmediately = function (fromInside) {
            if (!fromInside) {
                this.animation.update(true);
            }
            this._needsRefresh = false;
            this.painter.refresh();
            this._needsRefresh = false;
        };
        ZRender.prototype.refresh = function () {
            this._needsRefresh = true;
            this.animation.start();
        };
        ZRender.prototype.flush = function () {
            this._flush(false);
        };
        ZRender.prototype._flush = function (fromInside) {
            var triggerRendered;
            var start = new Date().getTime();
            if (this._needsRefresh) {
                triggerRendered = true;
                this.refreshImmediately(fromInside);
            }
            if (this._needsRefreshHover) {
                triggerRendered = true;
                this.refreshHoverImmediately();
            }
            var end = new Date().getTime();
            if (triggerRendered) {
                this._stillFrameAccum = 0;
                this.trigger('rendered', {
                    elapsedTime: end - start
                });
            }
            else if (this._sleepAfterStill > 0) {
                this._stillFrameAccum++;
                if (this._stillFrameAccum > this._sleepAfterStill) {
                    this.animation.stop();
                }
            }
        };
        ZRender.prototype.setSleepAfterStill = function (stillFramesCount) {
            this._sleepAfterStill = stillFramesCount;
        };
        ZRender.prototype.wakeUp = function () {
            this.animation.start();
            this._stillFrameAccum = 0;
        };
        ZRender.prototype.addHover = function (el) {
        };
        ZRender.prototype.removeHover = function (el) {
        };
        ZRender.prototype.clearHover = function () {
        };
        ZRender.prototype.refreshHover = function () {
            this._needsRefreshHover = true;
        };
        ZRender.prototype.refreshHoverImmediately = function () {
            this._needsRefreshHover = false;
            if (this.painter.refreshHover && this.painter.getType() === 'canvas') {
                this.painter.refreshHover();
            }
        };
        ZRender.prototype.resize = function (opts) {
            opts = opts || {};
            this.painter.resize(opts.width, opts.height);
            this.handler.resize();
        };
        ZRender.prototype.clearAnimation = function () {
            this.animation.clear();
        };
        ZRender.prototype.getWidth = function () {
            return this.painter.getWidth();
        };
        ZRender.prototype.getHeight = function () {
            return this.painter.getHeight();
        };
        ZRender.prototype.pathToImage = function (e, dpr) {
            if (this.painter.pathToImage) {
                return this.painter.pathToImage(e, dpr);
            }
        };
        ZRender.prototype.setCursorStyle = function (cursorStyle) {
            this.handler.setCursorStyle(cursorStyle);
        };
        ZRender.prototype.findHover = function (x, y) {
            return this.handler.findHover(x, y);
        };
        ZRender.prototype.on = function (eventName, eventHandler, context) {
            this.handler.on(eventName, eventHandler, context);
            return this;
        };
        ZRender.prototype.off = function (eventName, eventHandler) {
            this.handler.off(eventName, eventHandler);
        };
        ZRender.prototype.trigger = function (eventName, event) {
            this.handler.trigger(eventName, event);
        };
        ZRender.prototype.clear = function () {
            var roots = this.storage.getRoots();
            for (var i = 0; i < roots.length; i++) {
                if (roots[i] instanceof Group) {
                    roots[i].removeSelfFromZr(this);
                }
            }
            this.storage.delAllRoots();
            this.painter.clear();
        };
        ZRender.prototype.dispose = function () {
            this.animation.stop();
            this.clear();
            this.storage.dispose();
            this.painter.dispose();
            this.handler.dispose();
            this.animation =
                this.storage =
                    this.painter =
                        this.handler = null;
            delInstance(this.id);
        };
        return ZRender;
    }());
    function init(dom, opts) {
        var zr = new ZRender(guid(), dom, opts);
        instances[zr.id] = zr;
        return zr;
    }
    function dispose(zr) {
        zr.dispose();
    }
    function disposeAll() {
        for (var key in instances) {
            if (instances.hasOwnProperty(key)) {
                instances[key].dispose();
            }
        }
        instances = {};
    }
    function getInstance(id) {
        return instances[id];
    }
    function registerPainter(name, Ctor) {
        painterCtors[name] = Ctor;
    }
    var version = '5.1.1';

    var CMD$1 = PathProxy.CMD;
    var points = [[], [], []];
    var mathSqrt$2 = Math.sqrt;
    var mathAtan2 = Math.atan2;
    function transformPath(path, m) {
        var data = path.data;
        var len = path.len();
        var cmd;
        var nPoint;
        var i;
        var j;
        var k;
        var p;
        var M = CMD$1.M;
        var C = CMD$1.C;
        var L = CMD$1.L;
        var R = CMD$1.R;
        var A = CMD$1.A;
        var Q = CMD$1.Q;
        for (i = 0, j = 0; i < len;) {
            cmd = data[i++];
            j = i;
            nPoint = 0;
            switch (cmd) {
                case M:
                    nPoint = 1;
                    break;
                case L:
                    nPoint = 1;
                    break;
                case C:
                    nPoint = 3;
                    break;
                case Q:
                    nPoint = 2;
                    break;
                case A:
                    var x = m[4];
                    var y = m[5];
                    var sx = mathSqrt$2(m[0] * m[0] + m[1] * m[1]);
                    var sy = mathSqrt$2(m[2] * m[2] + m[3] * m[3]);
                    var angle = mathAtan2(-m[1] / sy, m[0] / sx);
                    data[i] *= sx;
                    data[i++] += x;
                    data[i] *= sy;
                    data[i++] += y;
                    data[i++] *= sx;
                    data[i++] *= sy;
                    data[i++] += angle;
                    data[i++] += angle;
                    i += 2;
                    j = i;
                    break;
                case R:
                    p[0] = data[i++];
                    p[1] = data[i++];
                    applyTransform(p, p, m);
                    data[j++] = p[0];
                    data[j++] = p[1];
                    p[0] += data[i++];
                    p[1] += data[i++];
                    applyTransform(p, p, m);
                    data[j++] = p[0];
                    data[j++] = p[1];
            }
            for (k = 0; k < nPoint; k++) {
                var p_1 = points[k];
                p_1[0] = data[i++];
                p_1[1] = data[i++];
                applyTransform(p_1, p_1, m);
                data[j++] = p_1[0];
                data[j++] = p_1[1];
            }
        }
        path.increaseVersion();
    }

    var mathSqrt$1 = Math.sqrt;
    var mathSin$1 = Math.sin;
    var mathCos$1 = Math.cos;
    var PI$3 = Math.PI;
    function vMag(v) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    }
    function vRatio(u, v) {
        return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
    }
    function vAngle(u, v) {
        return (u[0] * v[1] < u[1] * v[0] ? -1 : 1)
            * Math.acos(vRatio(u, v));
    }
    function processArc(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg, cmd, path) {
        var psi = psiDeg * (PI$3 / 180.0);
        var xp = mathCos$1(psi) * (x1 - x2) / 2.0
            + mathSin$1(psi) * (y1 - y2) / 2.0;
        var yp = -1 * mathSin$1(psi) * (x1 - x2) / 2.0
            + mathCos$1(psi) * (y1 - y2) / 2.0;
        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
        if (lambda > 1) {
            rx *= mathSqrt$1(lambda);
            ry *= mathSqrt$1(lambda);
        }
        var f = (fa === fs ? -1 : 1)
            * mathSqrt$1((((rx * rx) * (ry * ry))
                - ((rx * rx) * (yp * yp))
                - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp)
                + (ry * ry) * (xp * xp))) || 0;
        var cxp = f * rx * yp / ry;
        var cyp = f * -ry * xp / rx;
        var cx = (x1 + x2) / 2.0
            + mathCos$1(psi) * cxp
            - mathSin$1(psi) * cyp;
        var cy = (y1 + y2) / 2.0
            + mathSin$1(psi) * cxp
            + mathCos$1(psi) * cyp;
        var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
        var u = [(xp - cxp) / rx, (yp - cyp) / ry];
        var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
        var dTheta = vAngle(u, v);
        if (vRatio(u, v) <= -1) {
            dTheta = PI$3;
        }
        if (vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if (dTheta < 0) {
            var n = Math.round(dTheta / PI$3 * 1e6) / 1e6;
            dTheta = PI$3 * 2 + (n % 2) * PI$3;
        }
        path.addData(cmd, cx, cy, rx, ry, theta, dTheta, psi, fs);
    }
    var commandReg = /([mlvhzcqtsa])([^mlvhzcqtsa]*)/ig;
    var numberReg$1 = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
    function createPathProxyFromString(data) {
        var path = new PathProxy();
        if (!data) {
            return path;
        }
        var cpx = 0;
        var cpy = 0;
        var subpathX = cpx;
        var subpathY = cpy;
        var prevCmd;
        var CMD = PathProxy.CMD;
        var cmdList = data.match(commandReg);
        if (!cmdList) {
            return path;
        }
        for (var l = 0; l < cmdList.length; l++) {
            var cmdText = cmdList[l];
            var cmdStr = cmdText.charAt(0);
            var cmd = void 0;
            var p = cmdText.match(numberReg$1) || [];
            var pLen = p.length;
            for (var i = 0; i < pLen; i++) {
                p[i] = parseFloat(p[i]);
            }
            var off = 0;
            while (off < pLen) {
                var ctlPtx = void 0;
                var ctlPty = void 0;
                var rx = void 0;
                var ry = void 0;
                var psi = void 0;
                var fa = void 0;
                var fs = void 0;
                var x1 = cpx;
                var y1 = cpy;
                var len = void 0;
                var pathData = void 0;
                switch (cmdStr) {
                    case 'l':
                        cpx += p[off++];
                        cpy += p[off++];
                        cmd = CMD.L;
                        path.addData(cmd, cpx, cpy);
                        break;
                    case 'L':
                        cpx = p[off++];
                        cpy = p[off++];
                        cmd = CMD.L;
                        path.addData(cmd, cpx, cpy);
                        break;
                    case 'm':
                        cpx += p[off++];
                        cpy += p[off++];
                        cmd = CMD.M;
                        path.addData(cmd, cpx, cpy);
                        subpathX = cpx;
                        subpathY = cpy;
                        cmdStr = 'l';
                        break;
                    case 'M':
                        cpx = p[off++];
                        cpy = p[off++];
                        cmd = CMD.M;
                        path.addData(cmd, cpx, cpy);
                        subpathX = cpx;
                        subpathY = cpy;
                        cmdStr = 'L';
                        break;
                    case 'h':
                        cpx += p[off++];
                        cmd = CMD.L;
                        path.addData(cmd, cpx, cpy);
                        break;
                    case 'H':
                        cpx = p[off++];
                        cmd = CMD.L;
                        path.addData(cmd, cpx, cpy);
                        break;
                    case 'v':
                        cpy += p[off++];
                        cmd = CMD.L;
                        path.addData(cmd, cpx, cpy);
                        break;
                    case 'V':
                        cpy = p[off++];
                        cmd = CMD.L;
                        path.addData(cmd, cpx, cpy);
                        break;
                    case 'C':
                        cmd = CMD.C;
                        path.addData(cmd, p[off++], p[off++], p[off++], p[off++], p[off++], p[off++]);
                        cpx = p[off - 2];
                        cpy = p[off - 1];
                        break;
                    case 'c':
                        cmd = CMD.C;
                        path.addData(cmd, p[off++] + cpx, p[off++] + cpy, p[off++] + cpx, p[off++] + cpy, p[off++] + cpx, p[off++] + cpy);
                        cpx += p[off - 2];
                        cpy += p[off - 1];
                        break;
                    case 'S':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        len = path.len();
                        pathData = path.data;
                        if (prevCmd === CMD.C) {
                            ctlPtx += cpx - pathData[len - 4];
                            ctlPty += cpy - pathData[len - 3];
                        }
                        cmd = CMD.C;
                        x1 = p[off++];
                        y1 = p[off++];
                        cpx = p[off++];
                        cpy = p[off++];
                        path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
                        break;
                    case 's':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        len = path.len();
                        pathData = path.data;
                        if (prevCmd === CMD.C) {
                            ctlPtx += cpx - pathData[len - 4];
                            ctlPty += cpy - pathData[len - 3];
                        }
                        cmd = CMD.C;
                        x1 = cpx + p[off++];
                        y1 = cpy + p[off++];
                        cpx += p[off++];
                        cpy += p[off++];
                        path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
                        break;
                    case 'Q':
                        x1 = p[off++];
                        y1 = p[off++];
                        cpx = p[off++];
                        cpy = p[off++];
                        cmd = CMD.Q;
                        path.addData(cmd, x1, y1, cpx, cpy);
                        break;
                    case 'q':
                        x1 = p[off++] + cpx;
                        y1 = p[off++] + cpy;
                        cpx += p[off++];
                        cpy += p[off++];
                        cmd = CMD.Q;
                        path.addData(cmd, x1, y1, cpx, cpy);
                        break;
                    case 'T':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        len = path.len();
                        pathData = path.data;
                        if (prevCmd === CMD.Q) {
                            ctlPtx += cpx - pathData[len - 4];
                            ctlPty += cpy - pathData[len - 3];
                        }
                        cpx = p[off++];
                        cpy = p[off++];
                        cmd = CMD.Q;
                        path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 't':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        len = path.len();
                        pathData = path.data;
                        if (prevCmd === CMD.Q) {
                            ctlPtx += cpx - pathData[len - 4];
                            ctlPty += cpy - pathData[len - 3];
                        }
                        cpx += p[off++];
                        cpy += p[off++];
                        cmd = CMD.Q;
                        path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 'A':
                        rx = p[off++];
                        ry = p[off++];
                        psi = p[off++];
                        fa = p[off++];
                        fs = p[off++];
                        x1 = cpx, y1 = cpy;
                        cpx = p[off++];
                        cpy = p[off++];
                        cmd = CMD.A;
                        processArc(x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path);
                        break;
                    case 'a':
                        rx = p[off++];
                        ry = p[off++];
                        psi = p[off++];
                        fa = p[off++];
                        fs = p[off++];
                        x1 = cpx, y1 = cpy;
                        cpx += p[off++];
                        cpy += p[off++];
                        cmd = CMD.A;
                        processArc(x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path);
                        break;
                }
            }
            if (cmdStr === 'z' || cmdStr === 'Z') {
                cmd = CMD.Z;
                path.addData(cmd);
                cpx = subpathX;
                cpy = subpathY;
            }
            prevCmd = cmd;
        }
        path.toStatic();
        return path;
    }
    var SVGPath = (function (_super) {
        __extends(SVGPath, _super);
        function SVGPath() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SVGPath.prototype.applyTransform = function (m) { };
        return SVGPath;
    }(Path));
    function isPathProxy(path) {
        return path.setData != null;
    }
    function createPathOptions(str, opts) {
        var pathProxy = createPathProxyFromString(str);
        var innerOpts = extend({}, opts);
        innerOpts.buildPath = function (path) {
            if (isPathProxy(path)) {
                path.setData(pathProxy.data);
                var ctx = path.getContext();
                if (ctx) {
                    path.rebuildPath(ctx, 1);
                }
            }
            else {
                var ctx = path;
                pathProxy.rebuildPath(ctx, 1);
            }
        };
        innerOpts.applyTransform = function (m) {
            transformPath(pathProxy, m);
            this.dirtyShape();
        };
        return innerOpts;
    }
    function createFromString(str, opts) {
        return new SVGPath(createPathOptions(str, opts));
    }
    function extendFromString(str, defaultOpts) {
        var innerOpts = createPathOptions(str, defaultOpts);
        var Sub = (function (_super) {
            __extends(Sub, _super);
            function Sub(opts) {
                var _this = _super.call(this, opts) || this;
                _this.applyTransform = innerOpts.applyTransform;
                _this.buildPath = innerOpts.buildPath;
                return _this;
            }
            return Sub;
        }(SVGPath));
        return Sub;
    }
    function mergePath(pathEls, opts) {
        var pathList = [];
        var len = pathEls.length;
        for (var i = 0; i < len; i++) {
            var pathEl = pathEls[i];
            if (!pathEl.path) {
                pathEl.createPathProxy();
            }
            if (pathEl.shapeChanged()) {
                pathEl.buildPath(pathEl.path, pathEl.shape, true);
            }
            pathList.push(pathEl.path);
        }
        var pathBundle = new Path(opts);
        pathBundle.createPathProxy();
        pathBundle.buildPath = function (path) {
            if (isPathProxy(path)) {
                path.appendPath(pathList);
                var ctx = path.getContext();
                if (ctx) {
                    path.rebuildPath(ctx, 1);
                }
            }
        };
        return pathBundle;
    }

    var path = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createFromString: createFromString,
        extendFromString: extendFromString,
        mergePath: mergePath
    });

    var CircleShape = (function () {
        function CircleShape() {
            this.cx = 0;
            this.cy = 0;
            this.r = 0;
        }
        return CircleShape;
    }());
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(opts) {
            return _super.call(this, opts) || this;
        }
        Circle.prototype.getDefaultShape = function () {
            return new CircleShape();
        };
        Circle.prototype.buildPath = function (ctx, shape, inBundle) {
            if (inBundle) {
                ctx.moveTo(shape.cx + shape.r, shape.cy);
            }
            ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2);
        };
        return Circle;
    }(Path));
    Circle.prototype.type = 'circle';

    function buildPath$2(ctx, shape) {
        var x = shape.x;
        var y = shape.y;
        var width = shape.width;
        var height = shape.height;
        var r = shape.r;
        var r1;
        var r2;
        var r3;
        var r4;
        if (width < 0) {
            x = x + width;
            width = -width;
        }
        if (height < 0) {
            y = y + height;
            height = -height;
        }
        if (typeof r === 'number') {
            r1 = r2 = r3 = r4 = r;
        }
        else if (r instanceof Array) {
            if (r.length === 1) {
                r1 = r2 = r3 = r4 = r[0];
            }
            else if (r.length === 2) {
                r1 = r3 = r[0];
                r2 = r4 = r[1];
            }
            else if (r.length === 3) {
                r1 = r[0];
                r2 = r4 = r[1];
                r3 = r[2];
            }
            else {
                r1 = r[0];
                r2 = r[1];
                r3 = r[2];
                r4 = r[3];
            }
        }
        else {
            r1 = r2 = r3 = r4 = 0;
        }
        var total;
        if (r1 + r2 > width) {
            total = r1 + r2;
            r1 *= width / total;
            r2 *= width / total;
        }
        if (r3 + r4 > width) {
            total = r3 + r4;
            r3 *= width / total;
            r4 *= width / total;
        }
        if (r2 + r3 > height) {
            total = r2 + r3;
            r2 *= height / total;
            r3 *= height / total;
        }
        if (r1 + r4 > height) {
            total = r1 + r4;
            r1 *= height / total;
            r4 *= height / total;
        }
        ctx.moveTo(x + r1, y);
        ctx.lineTo(x + width - r2, y);
        r2 !== 0 && ctx.arc(x + width - r2, y + r2, r2, -Math.PI / 2, 0);
        ctx.lineTo(x + width, y + height - r3);
        r3 !== 0 && ctx.arc(x + width - r3, y + height - r3, r3, 0, Math.PI / 2);
        ctx.lineTo(x + r4, y + height);
        r4 !== 0 && ctx.arc(x + r4, y + height - r4, r4, Math.PI / 2, Math.PI);
        ctx.lineTo(x, y + r1);
        r1 !== 0 && ctx.arc(x + r1, y + r1, r1, Math.PI, Math.PI * 1.5);
    }

    var round = Math.round;
    function subPixelOptimizeLine(outputShape, inputShape, style) {
        if (!inputShape) {
            return;
        }
        var x1 = inputShape.x1;
        var x2 = inputShape.x2;
        var y1 = inputShape.y1;
        var y2 = inputShape.y2;
        outputShape.x1 = x1;
        outputShape.x2 = x2;
        outputShape.y1 = y1;
        outputShape.y2 = y2;
        var lineWidth = style && style.lineWidth;
        if (!lineWidth) {
            return outputShape;
        }
        if (round(x1 * 2) === round(x2 * 2)) {
            outputShape.x1 = outputShape.x2 = subPixelOptimize(x1, lineWidth, true);
        }
        if (round(y1 * 2) === round(y2 * 2)) {
            outputShape.y1 = outputShape.y2 = subPixelOptimize(y1, lineWidth, true);
        }
        return outputShape;
    }
    function subPixelOptimizeRect(outputShape, inputShape, style) {
        if (!inputShape) {
            return;
        }
        var originX = inputShape.x;
        var originY = inputShape.y;
        var originWidth = inputShape.width;
        var originHeight = inputShape.height;
        outputShape.x = originX;
        outputShape.y = originY;
        outputShape.width = originWidth;
        outputShape.height = originHeight;
        var lineWidth = style && style.lineWidth;
        if (!lineWidth) {
            return outputShape;
        }
        outputShape.x = subPixelOptimize(originX, lineWidth, true);
        outputShape.y = subPixelOptimize(originY, lineWidth, true);
        outputShape.width = Math.max(subPixelOptimize(originX + originWidth, lineWidth, false) - outputShape.x, originWidth === 0 ? 0 : 1);
        outputShape.height = Math.max(subPixelOptimize(originY + originHeight, lineWidth, false) - outputShape.y, originHeight === 0 ? 0 : 1);
        return outputShape;
    }
    function subPixelOptimize(position, lineWidth, positiveOrNegative) {
        if (!lineWidth) {
            return position;
        }
        var doubledPosition = round(position * 2);
        return (doubledPosition + round(lineWidth)) % 2 === 0
            ? doubledPosition / 2
            : (doubledPosition + (positiveOrNegative ? 1 : -1)) / 2;
    }

    var RectShape = (function () {
        function RectShape() {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }
        return RectShape;
    }());
    var subPixelOptimizeOutputShape$1 = {};
    var Rect = (function (_super) {
        __extends(Rect, _super);
        function Rect(opts) {
            return _super.call(this, opts) || this;
        }
        Rect.prototype.getDefaultShape = function () {
            return new RectShape();
        };
        Rect.prototype.buildPath = function (ctx, shape) {
            var x;
            var y;
            var width;
            var height;
            if (this.subPixelOptimize) {
                var optimizedShape = subPixelOptimizeRect(subPixelOptimizeOutputShape$1, shape, this.style);
                x = optimizedShape.x;
                y = optimizedShape.y;
                width = optimizedShape.width;
                height = optimizedShape.height;
                optimizedShape.r = shape.r;
                shape = optimizedShape;
            }
            else {
                x = shape.x;
                y = shape.y;
                width = shape.width;
                height = shape.height;
            }
            if (!shape.r) {
                ctx.rect(x, y, width, height);
            }
            else {
                buildPath$2(ctx, shape);
            }
        };
        Rect.prototype.isZeroArea = function () {
            return !this.shape.width || !this.shape.height;
        };
        return Rect;
    }(Path));
    Rect.prototype.type = 'rect';

    var EllipseShape = (function () {
        function EllipseShape() {
            this.cx = 0;
            this.cy = 0;
            this.rx = 0;
            this.ry = 0;
        }
        return EllipseShape;
    }());
    var Ellipse = (function (_super) {
        __extends(Ellipse, _super);
        function Ellipse(opts) {
            return _super.call(this, opts) || this;
        }
        Ellipse.prototype.getDefaultShape = function () {
            return new EllipseShape();
        };
        Ellipse.prototype.buildPath = function (ctx, shape) {
            var k = 0.5522848;
            var x = shape.cx;
            var y = shape.cy;
            var a = shape.rx;
            var b = shape.ry;
            var ox = a * k;
            var oy = b * k;
            ctx.moveTo(x - a, y);
            ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
            ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
            ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
            ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
            ctx.closePath();
        };
        return Ellipse;
    }(Path));
    Ellipse.prototype.type = 'ellipse';

    var subPixelOptimizeOutputShape = {};
    var LineShape = (function () {
        function LineShape() {
            this.x1 = 0;
            this.y1 = 0;
            this.x2 = 0;
            this.y2 = 0;
            this.percent = 1;
        }
        return LineShape;
    }());
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(opts) {
            return _super.call(this, opts) || this;
        }
        Line.prototype.getDefaultStyle = function () {
            return {
                stroke: '#000',
                fill: null
            };
        };
        Line.prototype.getDefaultShape = function () {
            return new LineShape();
        };
        Line.prototype.buildPath = function (ctx, shape) {
            var x1;
            var y1;
            var x2;
            var y2;
            if (this.subPixelOptimize) {
                var optimizedShape = subPixelOptimizeLine(subPixelOptimizeOutputShape, shape, this.style);
                x1 = optimizedShape.x1;
                y1 = optimizedShape.y1;
                x2 = optimizedShape.x2;
                y2 = optimizedShape.y2;
            }
            else {
                x1 = shape.x1;
                y1 = shape.y1;
                x2 = shape.x2;
                y2 = shape.y2;
            }
            var percent = shape.percent;
            if (percent === 0) {
                return;
            }
            ctx.moveTo(x1, y1);
            if (percent < 1) {
                x2 = x1 * (1 - percent) + x2 * percent;
                y2 = y1 * (1 - percent) + y2 * percent;
            }
            ctx.lineTo(x2, y2);
        };
        Line.prototype.pointAt = function (p) {
            var shape = this.shape;
            return [
                shape.x1 * (1 - p) + shape.x2 * p,
                shape.y1 * (1 - p) + shape.y2 * p
            ];
        };
        return Line;
    }(Path));
    Line.prototype.type = 'line';

    function interpolate(p0, p1, p2, p3, t, t2, t3) {
        var v0 = (p2 - p0) * 0.5;
        var v1 = (p3 - p1) * 0.5;
        return (2 * (p1 - p2) + v0 + v1) * t3
            + (-3 * (p1 - p2) - 2 * v0 - v1) * t2
            + v0 * t + p1;
    }
    function smoothSpline(points, isLoop) {
        var len = points.length;
        var ret = [];
        var distance$1 = 0;
        for (var i = 1; i < len; i++) {
            distance$1 += distance(points[i - 1], points[i]);
        }
        var segs = distance$1 / 2;
        segs = segs < len ? len : segs;
        for (var i = 0; i < segs; i++) {
            var pos = i / (segs - 1) * (isLoop ? len : len - 1);
            var idx = Math.floor(pos);
            var w = pos - idx;
            var p0 = void 0;
            var p1 = points[idx % len];
            var p2 = void 0;
            var p3 = void 0;
            if (!isLoop) {
                p0 = points[idx === 0 ? idx : idx - 1];
                p2 = points[idx > len - 2 ? len - 1 : idx + 1];
                p3 = points[idx > len - 3 ? len - 1 : idx + 2];
            }
            else {
                p0 = points[(idx - 1 + len) % len];
                p2 = points[(idx + 1) % len];
                p3 = points[(idx + 2) % len];
            }
            var w2 = w * w;
            var w3 = w * w2;
            ret.push([
                interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3),
                interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)
            ]);
        }
        return ret;
    }

    function smoothBezier(points, smooth, isLoop, constraint) {
        var cps = [];
        var v = [];
        var v1 = [];
        var v2 = [];
        var prevPoint;
        var nextPoint;
        var min;
        var max;
        if (constraint) {
            min = [Infinity, Infinity];
            max = [-Infinity, -Infinity];
            for (var i = 0, len = points.length; i < len; i++) {
                min$1(min, min, points[i]);
                max$1(max, max, points[i]);
            }
            min$1(min, min, constraint[0]);
            max$1(max, max, constraint[1]);
        }
        for (var i = 0, len = points.length; i < len; i++) {
            var point = points[i];
            if (isLoop) {
                prevPoint = points[i ? i - 1 : len - 1];
                nextPoint = points[(i + 1) % len];
            }
            else {
                if (i === 0 || i === len - 1) {
                    cps.push(clone(points[i]));
                    continue;
                }
                else {
                    prevPoint = points[i - 1];
                    nextPoint = points[i + 1];
                }
            }
            sub(v, nextPoint, prevPoint);
            scale(v, v, smooth);
            var d0 = distance(point, prevPoint);
            var d1 = distance(point, nextPoint);
            var sum = d0 + d1;
            if (sum !== 0) {
                d0 /= sum;
                d1 /= sum;
            }
            scale(v1, v, -d0);
            scale(v2, v, d1);
            var cp0 = add([], point, v1);
            var cp1 = add([], point, v2);
            if (constraint) {
                max$1(cp0, cp0, min);
                min$1(cp0, cp0, max);
                max$1(cp1, cp1, min);
                min$1(cp1, cp1, max);
            }
            cps.push(cp0);
            cps.push(cp1);
        }
        if (isLoop) {
            cps.push(cps.shift());
        }
        return cps;
    }

    function buildPath$1(ctx, shape, closePath) {
        var smooth = shape.smooth;
        var points = shape.points;
        if (points && points.length >= 2) {
            if (smooth && smooth !== 'spline') {
                var controlPoints = smoothBezier(points, smooth, closePath, shape.smoothConstraint);
                ctx.moveTo(points[0][0], points[0][1]);
                var len = points.length;
                for (var i = 0; i < (closePath ? len : len - 1); i++) {
                    var cp1 = controlPoints[i * 2];
                    var cp2 = controlPoints[i * 2 + 1];
                    var p = points[(i + 1) % len];
                    ctx.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]);
                }
            }
            else {
                if (smooth === 'spline') {
                    points = smoothSpline(points, closePath);
                }
                ctx.moveTo(points[0][0], points[0][1]);
                for (var i = 1, l = points.length; i < l; i++) {
                    ctx.lineTo(points[i][0], points[i][1]);
                }
            }
            closePath && ctx.closePath();
        }
    }

    var PolygonShape = (function () {
        function PolygonShape() {
            this.points = null;
            this.smooth = 0;
            this.smoothConstraint = null;
        }
        return PolygonShape;
    }());
    var Polygon = (function (_super) {
        __extends(Polygon, _super);
        function Polygon(opts) {
            return _super.call(this, opts) || this;
        }
        Polygon.prototype.getDefaultShape = function () {
            return new PolygonShape();
        };
        Polygon.prototype.buildPath = function (ctx, shape) {
            buildPath$1(ctx, shape, true);
        };
        return Polygon;
    }(Path));
    Polygon.prototype.type = 'polygon';

    var PolylineShape = (function () {
        function PolylineShape() {
            this.points = null;
            this.percent = 1;
            this.smooth = 0;
            this.smoothConstraint = null;
        }
        return PolylineShape;
    }());
    var Polyline = (function (_super) {
        __extends(Polyline, _super);
        function Polyline(opts) {
            return _super.call(this, opts) || this;
        }
        Polyline.prototype.getDefaultStyle = function () {
            return {
                stroke: '#000',
                fill: null
            };
        };
        Polyline.prototype.getDefaultShape = function () {
            return new PolylineShape();
        };
        Polyline.prototype.buildPath = function (ctx, shape) {
            buildPath$1(ctx, shape, false);
        };
        return Polyline;
    }(Path));
    Polyline.prototype.type = 'polyline';

    var Gradient = (function () {
        function Gradient(colorStops) {
            this.colorStops = colorStops || [];
        }
        Gradient.prototype.addColorStop = function (offset, color) {
            this.colorStops.push({
                offset: offset,
                color: color
            });
        };
        return Gradient;
    }());

    var LinearGradient = (function (_super) {
        __extends(LinearGradient, _super);
        function LinearGradient(x, y, x2, y2, colorStops, globalCoord) {
            var _this = _super.call(this, colorStops) || this;
            _this.x = x == null ? 0 : x;
            _this.y = y == null ? 0 : y;
            _this.x2 = x2 == null ? 1 : x2;
            _this.y2 = y2 == null ? 0 : y2;
            _this.type = 'linear';
            _this.global = globalCoord || false;
            return _this;
        }
        return LinearGradient;
    }(Gradient));

    var RadialGradient = (function (_super) {
        __extends(RadialGradient, _super);
        function RadialGradient(x, y, r, colorStops, globalCoord) {
            var _this = _super.call(this, colorStops) || this;
            _this.x = x == null ? 0.5 : x;
            _this.y = y == null ? 0.5 : y;
            _this.r = r == null ? 0.5 : r;
            _this.type = 'radial';
            _this.global = globalCoord || false;
            return _this;
        }
        return RadialGradient;
    }(Gradient));

    function parseXML(svg) {
        if (isString(svg)) {
            var parser = new DOMParser();
            svg = parser.parseFromString(svg, 'text/xml');
        }
        var svgNode = svg;
        if (svgNode.nodeType === 9) {
            svgNode = svgNode.firstChild;
        }
        while (svgNode.nodeName.toLowerCase() !== 'svg' || svgNode.nodeType !== 1) {
            svgNode = svgNode.nextSibling;
        }
        return svgNode;
    }

    var nodeParsers;
    var INHERITABLE_STYLE_ATTRIBUTES_MAP = {
        'fill': 'fill',
        'stroke': 'stroke',
        'stroke-width': 'lineWidth',
        'opacity': 'opacity',
        'fill-opacity': 'fillOpacity',
        'stroke-opacity': 'strokeOpacity',
        'stroke-dasharray': 'lineDash',
        'stroke-dashoffset': 'lineDashOffset',
        'stroke-linecap': 'lineCap',
        'stroke-linejoin': 'lineJoin',
        'stroke-miterlimit': 'miterLimit',
        'font-family': 'fontFamily',
        'font-size': 'fontSize',
        'font-style': 'fontStyle',
        'font-weight': 'fontWeight',
        'text-anchor': 'textAlign',
        'visibility': 'visibility',
        'display': 'display'
    };
    var INHERITABLE_STYLE_ATTRIBUTES_MAP_KEYS = keys$1(INHERITABLE_STYLE_ATTRIBUTES_MAP);
    var SELF_STYLE_ATTRIBUTES_MAP = {
        'alignment-baseline': 'textBaseline',
        'stop-color': 'stopColor'
    };
    var SELF_STYLE_ATTRIBUTES_MAP_KEYS = keys$1(SELF_STYLE_ATTRIBUTES_MAP);
    var SVGParser = (function () {
        function SVGParser() {
            this._defs = {};
            this._root = null;
        }
        SVGParser.prototype.parse = function (xml, opt) {
            opt = opt || {};
            var svg = parseXML(xml);
            if (!svg) {
                throw new Error('Illegal svg');
            }
            this._defsUsePending = [];
            var root = new Group();
            this._root = root;
            var named = [];
            var viewBox = svg.getAttribute('viewBox') || '';
            var width = parseFloat((svg.getAttribute('width') || opt.width));
            var height = parseFloat((svg.getAttribute('height') || opt.height));
            isNaN(width) && (width = null);
            isNaN(height) && (height = null);
            parseAttributes(svg, root, null, true, false);
            var child = svg.firstChild;
            while (child) {
                this._parseNode(child, root, named, null, false, false);
                child = child.nextSibling;
            }
            applyDefs(this._defs, this._defsUsePending);
            this._defsUsePending = [];
            var viewBoxRect;
            var viewBoxTransform;
            if (viewBox) {
                var viewBoxArr = splitNumberSequence(viewBox);
                if (viewBoxArr.length >= 4) {
                    viewBoxRect = {
                        x: parseFloat((viewBoxArr[0] || 0)),
                        y: parseFloat((viewBoxArr[1] || 0)),
                        width: parseFloat(viewBoxArr[2]),
                        height: parseFloat(viewBoxArr[3])
                    };
                }
            }
            if (viewBoxRect && width != null && height != null) {
                viewBoxTransform = makeViewBoxTransform(viewBoxRect, { x: 0, y: 0, width: width, height: height });
                if (!opt.ignoreViewBox) {
                    var elRoot = root;
                    root = new Group();
                    root.add(elRoot);
                    elRoot.scaleX = elRoot.scaleY = viewBoxTransform.scale;
                    elRoot.x = viewBoxTransform.x;
                    elRoot.y = viewBoxTransform.y;
                }
            }
            if (!opt.ignoreRootClip && width != null && height != null) {
                root.setClipPath(new Rect({
                    shape: { x: 0, y: 0, width: width, height: height }
                }));
            }
            return {
                root: root,
                width: width,
                height: height,
                viewBoxRect: viewBoxRect,
                viewBoxTransform: viewBoxTransform,
                named: named
            };
        };
        SVGParser.prototype._parseNode = function (xmlNode, parentGroup, named, namedFrom, isInDefs, isInText) {
            var nodeName = xmlNode.nodeName.toLowerCase();
            var el;
            var namedFromForSub = namedFrom;
            if (nodeName === 'defs') {
                isInDefs = true;
            }
            if (nodeName === 'text') {
                isInText = true;
            }
            if (nodeName === 'defs' || nodeName === 'switch') {
                el = parentGroup;
            }
            else {
                if (!isInDefs) {
                    var parser_1 = nodeParsers[nodeName];
                    if (parser_1 && hasOwn(nodeParsers, nodeName)) {
                        el = parser_1.call(this, xmlNode, parentGroup);
                        var nameAttr = xmlNode.getAttribute('name');
                        if (nameAttr) {
                            var newNamed = {
                                name: nameAttr,
                                namedFrom: null,
                                svgNodeTagLower: nodeName,
                                el: el
                            };
                            named.push(newNamed);
                            if (nodeName === 'g') {
                                namedFromForSub = newNamed;
                            }
                        }
                        else if (namedFrom) {
                            named.push({
                                name: namedFrom.name,
                                namedFrom: namedFrom,
                                svgNodeTagLower: nodeName,
                                el: el
                            });
                        }
                        parentGroup.add(el);
                    }
                }
                var parser = paintServerParsers[nodeName];
                if (parser && hasOwn(paintServerParsers, nodeName)) {
                    var def = parser.call(this, xmlNode);
                    var id = xmlNode.getAttribute('id');
                    if (id) {
                        this._defs[id] = def;
                    }
                }
            }
            if (el && el.isGroup) {
                var child = xmlNode.firstChild;
                while (child) {
                    if (child.nodeType === 1) {
                        this._parseNode(child, el, named, namedFromForSub, isInDefs, isInText);
                    }
                    else if (child.nodeType === 3 && isInText) {
                        this._parseText(child, el);
                    }
                    child = child.nextSibling;
                }
            }
        };
        SVGParser.prototype._parseText = function (xmlNode, parentGroup) {
            var text = new TSpan({
                style: {
                    text: xmlNode.textContent
                },
                silent: true,
                x: this._textX || 0,
                y: this._textY || 0
            });
            inheritStyle(parentGroup, text);
            parseAttributes(xmlNode, text, this._defsUsePending, false, false);
            applyTextAlignment(text, parentGroup);
            var textStyle = text.style;
            var fontSize = textStyle.fontSize;
            if (fontSize && fontSize < 9) {
                textStyle.fontSize = 9;
                text.scaleX *= fontSize / 9;
                text.scaleY *= fontSize / 9;
            }
            var font = (textStyle.fontSize || textStyle.fontFamily) && [
                textStyle.fontStyle,
                textStyle.fontWeight,
                (textStyle.fontSize || 12) + 'px',
                textStyle.fontFamily || 'sans-serif'
            ].join(' ');
            textStyle.font = font;
            var rect = text.getBoundingRect();
            this._textX += rect.width;
            parentGroup.add(text);
            return text;
        };
        SVGParser.internalField = (function () {
            nodeParsers = {
                'g': function (xmlNode, parentGroup) {
                    var g = new Group();
                    inheritStyle(parentGroup, g);
                    parseAttributes(xmlNode, g, this._defsUsePending, false, false);
                    return g;
                },
                'rect': function (xmlNode, parentGroup) {
                    var rect = new Rect();
                    inheritStyle(parentGroup, rect);
                    parseAttributes(xmlNode, rect, this._defsUsePending, false, false);
                    rect.setShape({
                        x: parseFloat(xmlNode.getAttribute('x') || '0'),
                        y: parseFloat(xmlNode.getAttribute('y') || '0'),
                        width: parseFloat(xmlNode.getAttribute('width') || '0'),
                        height: parseFloat(xmlNode.getAttribute('height') || '0')
                    });
                    rect.silent = true;
                    return rect;
                },
                'circle': function (xmlNode, parentGroup) {
                    var circle = new Circle();
                    inheritStyle(parentGroup, circle);
                    parseAttributes(xmlNode, circle, this._defsUsePending, false, false);
                    circle.setShape({
                        cx: parseFloat(xmlNode.getAttribute('cx') || '0'),
                        cy: parseFloat(xmlNode.getAttribute('cy') || '0'),
                        r: parseFloat(xmlNode.getAttribute('r') || '0')
                    });
                    circle.silent = true;
                    return circle;
                },
                'line': function (xmlNode, parentGroup) {
                    var line = new Line();
                    inheritStyle(parentGroup, line);
                    parseAttributes(xmlNode, line, this._defsUsePending, false, false);
                    line.setShape({
                        x1: parseFloat(xmlNode.getAttribute('x1') || '0'),
                        y1: parseFloat(xmlNode.getAttribute('y1') || '0'),
                        x2: parseFloat(xmlNode.getAttribute('x2') || '0'),
                        y2: parseFloat(xmlNode.getAttribute('y2') || '0')
                    });
                    line.silent = true;
                    return line;
                },
                'ellipse': function (xmlNode, parentGroup) {
                    var ellipse = new Ellipse();
                    inheritStyle(parentGroup, ellipse);
                    parseAttributes(xmlNode, ellipse, this._defsUsePending, false, false);
                    ellipse.setShape({
                        cx: parseFloat(xmlNode.getAttribute('cx') || '0'),
                        cy: parseFloat(xmlNode.getAttribute('cy') || '0'),
                        rx: parseFloat(xmlNode.getAttribute('rx') || '0'),
                        ry: parseFloat(xmlNode.getAttribute('ry') || '0')
                    });
                    ellipse.silent = true;
                    return ellipse;
                },
                'polygon': function (xmlNode, parentGroup) {
                    var pointsStr = xmlNode.getAttribute('points');
                    var pointsArr;
                    if (pointsStr) {
                        pointsArr = parsePoints(pointsStr);
                    }
                    var polygon = new Polygon({
                        shape: {
                            points: pointsArr || []
                        },
                        silent: true
                    });
                    inheritStyle(parentGroup, polygon);
                    parseAttributes(xmlNode, polygon, this._defsUsePending, false, false);
                    return polygon;
                },
                'polyline': function (xmlNode, parentGroup) {
                    var pointsStr = xmlNode.getAttribute('points');
                    var pointsArr;
                    if (pointsStr) {
                        pointsArr = parsePoints(pointsStr);
                    }
                    var polyline = new Polyline({
                        shape: {
                            points: pointsArr || []
                        },
                        silent: true
                    });
                    inheritStyle(parentGroup, polyline);
                    parseAttributes(xmlNode, polyline, this._defsUsePending, false, false);
                    return polyline;
                },
                'image': function (xmlNode, parentGroup) {
                    var img = new ZRImage();
                    inheritStyle(parentGroup, img);
                    parseAttributes(xmlNode, img, this._defsUsePending, false, false);
                    img.setStyle({
                        image: xmlNode.getAttribute('xlink:href'),
                        x: +xmlNode.getAttribute('x'),
                        y: +xmlNode.getAttribute('y'),
                        width: +xmlNode.getAttribute('width'),
                        height: +xmlNode.getAttribute('height')
                    });
                    img.silent = true;
                    return img;
                },
                'text': function (xmlNode, parentGroup) {
                    var x = xmlNode.getAttribute('x') || '0';
                    var y = xmlNode.getAttribute('y') || '0';
                    var dx = xmlNode.getAttribute('dx') || '0';
                    var dy = xmlNode.getAttribute('dy') || '0';
                    this._textX = parseFloat(x) + parseFloat(dx);
                    this._textY = parseFloat(y) + parseFloat(dy);
                    var g = new Group();
                    inheritStyle(parentGroup, g);
                    parseAttributes(xmlNode, g, this._defsUsePending, false, true);
                    return g;
                },
                'tspan': function (xmlNode, parentGroup) {
                    var x = xmlNode.getAttribute('x');
                    var y = xmlNode.getAttribute('y');
                    if (x != null) {
                        this._textX = parseFloat(x);
                    }
                    if (y != null) {
                        this._textY = parseFloat(y);
                    }
                    var dx = xmlNode.getAttribute('dx') || '0';
                    var dy = xmlNode.getAttribute('dy') || '0';
                    var g = new Group();
                    inheritStyle(parentGroup, g);
                    parseAttributes(xmlNode, g, this._defsUsePending, false, true);
                    this._textX += parseFloat(dx);
                    this._textY += parseFloat(dy);
                    return g;
                },
                'path': function (xmlNode, parentGroup) {
                    var d = xmlNode.getAttribute('d') || '';
                    var path = createFromString(d);
                    inheritStyle(parentGroup, path);
                    parseAttributes(xmlNode, path, this._defsUsePending, false, false);
                    path.silent = true;
                    return path;
                }
            };
        })();
        return SVGParser;
    }());
    var paintServerParsers = {
        'lineargradient': function (xmlNode) {
            var x1 = parseInt(xmlNode.getAttribute('x1') || '0', 10);
            var y1 = parseInt(xmlNode.getAttribute('y1') || '0', 10);
            var x2 = parseInt(xmlNode.getAttribute('x2') || '10', 10);
            var y2 = parseInt(xmlNode.getAttribute('y2') || '0', 10);
            var gradient = new LinearGradient(x1, y1, x2, y2);
            parsePaintServerUnit(xmlNode, gradient);
            parseGradientColorStops(xmlNode, gradient);
            return gradient;
        },
        'radialgradient': function (xmlNode) {
            var cx = parseInt(xmlNode.getAttribute('cx') || '0', 10);
            var cy = parseInt(xmlNode.getAttribute('cy') || '0', 10);
            var r = parseInt(xmlNode.getAttribute('r') || '0', 10);
            var gradient = new RadialGradient(cx, cy, r);
            parsePaintServerUnit(xmlNode, gradient);
            parseGradientColorStops(xmlNode, gradient);
            return gradient;
        }
    };
    function parsePaintServerUnit(xmlNode, gradient) {
        var gradientUnits = xmlNode.getAttribute('gradientUnits');
        if (gradientUnits === 'userSpaceOnUse') {
            gradient.global = true;
        }
    }
    function parseGradientColorStops(xmlNode, gradient) {
        var stop = xmlNode.firstChild;
        while (stop) {
            if (stop.nodeType === 1
                && stop.nodeName.toLocaleLowerCase() === 'stop') {
                var offsetStr = stop.getAttribute('offset');
                var offset = void 0;
                if (offsetStr && offsetStr.indexOf('%') > 0) {
                    offset = parseInt(offsetStr, 10) / 100;
                }
                else if (offsetStr) {
                    offset = parseFloat(offsetStr);
                }
                else {
                    offset = 0;
                }
                var styleVals = {};
                parseInlineStyle(stop, styleVals, styleVals);
                var stopColor = styleVals.stopColor
                    || stop.getAttribute('stop-color')
                    || '#000000';
                gradient.colorStops.push({
                    offset: offset,
                    color: stopColor
                });
            }
            stop = stop.nextSibling;
        }
    }
    function inheritStyle(parent, child) {
        if (parent && parent.__inheritedStyle) {
            if (!child.__inheritedStyle) {
                child.__inheritedStyle = {};
            }
            defaults(child.__inheritedStyle, parent.__inheritedStyle);
        }
    }
    function parsePoints(pointsString) {
        var list = splitNumberSequence(pointsString);
        var points = [];
        for (var i = 0; i < list.length; i += 2) {
            var x = parseFloat(list[i]);
            var y = parseFloat(list[i + 1]);
            points.push([x, y]);
        }
        return points;
    }
    function parseAttributes(xmlNode, el, defsUsePending, onlyInlineStyle, isTextGroup) {
        var disp = el;
        var inheritedStyle = disp.__inheritedStyle = disp.__inheritedStyle || {};
        var selfStyle = {};
        if (xmlNode.nodeType === 1) {
            parseTransformAttribute(xmlNode, el);
            parseInlineStyle(xmlNode, inheritedStyle, selfStyle);
            if (!onlyInlineStyle) {
                parseAttributeStyle(xmlNode, inheritedStyle, selfStyle);
            }
        }
        disp.style = disp.style || {};
        if (inheritedStyle.fill != null) {
            disp.style.fill = getFillStrokeStyle(disp, 'fill', inheritedStyle.fill, defsUsePending);
        }
        if (inheritedStyle.stroke != null) {
            disp.style.stroke = getFillStrokeStyle(disp, 'stroke', inheritedStyle.stroke, defsUsePending);
        }
        each([
            'lineWidth', 'opacity', 'fillOpacity', 'strokeOpacity', 'miterLimit', 'fontSize'
        ], function (propName) {
            if (inheritedStyle[propName] != null) {
                disp.style[propName] = parseFloat(inheritedStyle[propName]);
            }
        });
        each([
            'lineDashOffset', 'lineCap', 'lineJoin', 'fontWeight', 'fontFamily', 'fontStyle', 'textAlign'
        ], function (propName) {
            if (inheritedStyle[propName] != null) {
                disp.style[propName] = inheritedStyle[propName];
            }
        });
        if (isTextGroup) {
            disp.__selfStyle = selfStyle;
        }
        if (inheritedStyle.lineDash) {
            disp.style.lineDash = map(splitNumberSequence(inheritedStyle.lineDash), function (str) {
                return parseFloat(str);
            });
        }
        if (inheritedStyle.visibility === 'hidden' || inheritedStyle.visibility === 'collapse') {
            disp.invisible = true;
        }
        if (inheritedStyle.display === 'none') {
            disp.ignore = true;
        }
    }
    function applyTextAlignment(text, parentGroup) {
        var parentSelfStyle = parentGroup.__selfStyle;
        if (parentSelfStyle) {
            var textBaseline = parentSelfStyle.textBaseline;
            var zrTextBaseline = textBaseline;
            if (!textBaseline || textBaseline === 'auto') {
                zrTextBaseline = 'alphabetic';
            }
            else if (textBaseline === 'baseline') {
                zrTextBaseline = 'alphabetic';
            }
            else if (textBaseline === 'before-edge' || textBaseline === 'text-before-edge') {
                zrTextBaseline = 'top';
            }
            else if (textBaseline === 'after-edge' || textBaseline === 'text-after-edge') {
                zrTextBaseline = 'bottom';
            }
            else if (textBaseline === 'central' || textBaseline === 'mathematical') {
                zrTextBaseline = 'middle';
            }
            text.style.textBaseline = zrTextBaseline;
        }
        var parentInheritedStyle = parentGroup.__inheritedStyle;
        if (parentInheritedStyle) {
            var textAlign = parentInheritedStyle.textAlign;
            var zrTextAlign = textAlign;
            if (textAlign) {
                if (textAlign === 'middle') {
                    zrTextAlign = 'center';
                }
                text.style.textAlign = zrTextAlign;
            }
        }
    }
    var urlRegex = /^url\(\s*#(.*?)\)/;
    function getFillStrokeStyle(el, method, str, defsUsePending) {
        var urlMatch = str && str.match(urlRegex);
        if (urlMatch) {
            var url = trim(urlMatch[1]);
            defsUsePending.push([el, method, url]);
            return;
        }
        if (str === 'none') {
            str = null;
        }
        return str;
    }
    function applyDefs(defs, defsUsePending) {
        for (var i = 0; i < defsUsePending.length; i++) {
            var item = defsUsePending[i];
            item[0].style[item[1]] = defs[item[2]];
        }
    }
    var numberReg = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
    function splitNumberSequence(rawStr) {
        return rawStr.match(numberReg) || [];
    }
    var transformRegex = /(translate|scale|rotate|skewX|skewY|matrix)\(([\-\s0-9\.eE,]*)\)/g;
    var DEGREE_TO_ANGLE = Math.PI / 180;
    function parseTransformAttribute(xmlNode, node) {
        var transform = xmlNode.getAttribute('transform');
        if (transform) {
            transform = transform.replace(/,/g, ' ');
            var transformOps_1 = [];
            var mt = null;
            transform.replace(transformRegex, function (str, type, value) {
                transformOps_1.push(type, value);
                return '';
            });
            for (var i = transformOps_1.length - 1; i > 0; i -= 2) {
                var value = transformOps_1[i];
                var type = transformOps_1[i - 1];
                var valueArr = splitNumberSequence(value);
                mt = mt || create$1();
                switch (type) {
                    case 'translate':
                        translate(mt, mt, [parseFloat(valueArr[0]), parseFloat(valueArr[1] || '0')]);
                        break;
                    case 'scale':
                        scale$1(mt, mt, [parseFloat(valueArr[0]), parseFloat(valueArr[1] || valueArr[0])]);
                        break;
                    case 'rotate':
                        rotate(mt, mt, -parseFloat(valueArr[0]) * DEGREE_TO_ANGLE);
                        break;
                    case 'skewX':
                        var sx = Math.tan(parseFloat(valueArr[0]) * DEGREE_TO_ANGLE);
                        mul$1(mt, [1, 0, sx, 1, 0, 0], mt);
                        break;
                    case 'skewY':
                        var sy = Math.tan(parseFloat(valueArr[0]) * DEGREE_TO_ANGLE);
                        mul$1(mt, [1, sy, 0, 1, 0, 0], mt);
                        break;
                    case 'matrix':
                        mt[0] = parseFloat(valueArr[0]);
                        mt[1] = parseFloat(valueArr[1]);
                        mt[2] = parseFloat(valueArr[2]);
                        mt[3] = parseFloat(valueArr[3]);
                        mt[4] = parseFloat(valueArr[4]);
                        mt[5] = parseFloat(valueArr[5]);
                        break;
                }
            }
            node.setLocalTransform(mt);
        }
    }
    var styleRegex = /([^\s:;]+)\s*:\s*([^:;]+)/g;
    function parseInlineStyle(xmlNode, inheritableStyleResult, selfStyleResult) {
        var style = xmlNode.getAttribute('style');
        if (!style) {
            return;
        }
        styleRegex.lastIndex = 0;
        var styleRegResult;
        while ((styleRegResult = styleRegex.exec(style)) != null) {
            var svgStlAttr = styleRegResult[1];
            var zrInheritableStlAttr = hasOwn(INHERITABLE_STYLE_ATTRIBUTES_MAP, svgStlAttr)
                ? INHERITABLE_STYLE_ATTRIBUTES_MAP[svgStlAttr]
                : null;
            if (zrInheritableStlAttr) {
                inheritableStyleResult[zrInheritableStlAttr] = styleRegResult[2];
            }
            var zrSelfStlAttr = hasOwn(SELF_STYLE_ATTRIBUTES_MAP, svgStlAttr)
                ? SELF_STYLE_ATTRIBUTES_MAP[svgStlAttr]
                : null;
            if (zrSelfStlAttr) {
                selfStyleResult[zrSelfStlAttr] = styleRegResult[2];
            }
        }
    }
    function parseAttributeStyle(xmlNode, inheritableStyleResult, selfStyleResult) {
        for (var i = 0; i < INHERITABLE_STYLE_ATTRIBUTES_MAP_KEYS.length; i++) {
            var svgAttrName = INHERITABLE_STYLE_ATTRIBUTES_MAP_KEYS[i];
            var attrValue = xmlNode.getAttribute(svgAttrName);
            if (attrValue != null) {
                inheritableStyleResult[INHERITABLE_STYLE_ATTRIBUTES_MAP[svgAttrName]] = attrValue;
            }
        }
        for (var i = 0; i < SELF_STYLE_ATTRIBUTES_MAP_KEYS.length; i++) {
            var svgAttrName = SELF_STYLE_ATTRIBUTES_MAP_KEYS[i];
            var attrValue = xmlNode.getAttribute(svgAttrName);
            if (attrValue != null) {
                selfStyleResult[SELF_STYLE_ATTRIBUTES_MAP[svgAttrName]] = attrValue;
            }
        }
    }
    function makeViewBoxTransform(viewBoxRect, boundingRect) {
        var scaleX = boundingRect.width / viewBoxRect.width;
        var scaleY = boundingRect.height / viewBoxRect.height;
        var scale = Math.min(scaleX, scaleY);
        return {
            scale: scale,
            x: -(viewBoxRect.x + viewBoxRect.width / 2) * scale + (boundingRect.x + boundingRect.width / 2),
            y: -(viewBoxRect.y + viewBoxRect.height / 2) * scale + (boundingRect.y + boundingRect.height / 2)
        };
    }
    function parseSVG(xml, opt) {
        var parser = new SVGParser();
        return parser.parse(xml, opt);
    }

    var PI$2 = Math.PI;
    var PI2 = PI$2 * 2;
    var mathSin = Math.sin;
    var mathCos = Math.cos;
    var mathACos = Math.acos;
    var mathATan2 = Math.atan2;
    var mathAbs = Math.abs;
    var mathSqrt = Math.sqrt;
    var mathMax = Math.max;
    var mathMin = Math.min;
    var e = 1e-4;
    function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
        var x10 = x1 - x0;
        var y10 = y1 - y0;
        var x32 = x3 - x2;
        var y32 = y3 - y2;
        var t = y32 * x10 - x32 * y10;
        if (t * t < e) {
            return;
        }
        t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
        return [x0 + t * x10, y0 + t * y10];
    }
    function computeCornerTangents(x0, y0, x1, y1, radius, cr, clockwise) {
        var x01 = x0 - x1;
        var y01 = y0 - y1;
        var lo = (clockwise ? cr : -cr) / mathSqrt(x01 * x01 + y01 * y01);
        var ox = lo * y01;
        var oy = -lo * x01;
        var x11 = x0 + ox;
        var y11 = y0 + oy;
        var x10 = x1 + ox;
        var y10 = y1 + oy;
        var x00 = (x11 + x10) / 2;
        var y00 = (y11 + y10) / 2;
        var dx = x10 - x11;
        var dy = y10 - y11;
        var d2 = dx * dx + dy * dy;
        var r = radius - cr;
        var s = x11 * y10 - x10 * y11;
        var d = (dy < 0 ? -1 : 1) * mathSqrt(mathMax(0, r * r * d2 - s * s));
        var cx0 = (s * dy - dx * d) / d2;
        var cy0 = (-s * dx - dy * d) / d2;
        var cx1 = (s * dy + dx * d) / d2;
        var cy1 = (-s * dx + dy * d) / d2;
        var dx0 = cx0 - x00;
        var dy0 = cy0 - y00;
        var dx1 = cx1 - x00;
        var dy1 = cy1 - y00;
        if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) {
            cx0 = cx1;
            cy0 = cy1;
        }
        return {
            cx: cx0,
            cy: cy0,
            x01: -ox,
            y01: -oy,
            x11: cx0 * (radius / r - 1),
            y11: cy0 * (radius / r - 1)
        };
    }
    function buildPath(ctx, shape) {
        var radius = mathMax(shape.r, 0);
        var innerRadius = mathMax(shape.r0 || 0, 0);
        var hasRadius = radius > 0;
        var hasInnerRadius = innerRadius > 0;
        if (!hasRadius && !hasInnerRadius) {
            return;
        }
        if (!hasRadius) {
            radius = innerRadius;
            innerRadius = 0;
        }
        if (innerRadius > radius) {
            var tmp = radius;
            radius = innerRadius;
            innerRadius = tmp;
        }
        var clockwise = !!shape.clockwise;
        var startAngle = shape.startAngle;
        var endAngle = shape.endAngle;
        var arc;
        if (startAngle === endAngle) {
            arc = 0;
        }
        else {
            var tmpAngles = [startAngle, endAngle];
            normalizeArcAngles(tmpAngles, !clockwise);
            arc = mathAbs(tmpAngles[0] - tmpAngles[1]);
        }
        var x = shape.cx;
        var y = shape.cy;
        var cornerRadius = shape.cornerRadius || 0;
        var innerCornerRadius = shape.innerCornerRadius || 0;
        if (!(radius > e)) {
            ctx.moveTo(x, y);
        }
        else if (arc > PI2 - e) {
            ctx.moveTo(x + radius * mathCos(startAngle), y + radius * mathSin(startAngle));
            ctx.arc(x, y, radius, startAngle, endAngle, !clockwise);
            if (innerRadius > e) {
                ctx.moveTo(x + innerRadius * mathCos(endAngle), y + innerRadius * mathSin(endAngle));
                ctx.arc(x, y, innerRadius, endAngle, startAngle, clockwise);
            }
        }
        else {
            var halfRd = mathAbs(radius - innerRadius) / 2;
            var cr = mathMin(halfRd, cornerRadius);
            var icr = mathMin(halfRd, innerCornerRadius);
            var cr0 = icr;
            var cr1 = cr;
            var xrs = radius * mathCos(startAngle);
            var yrs = radius * mathSin(startAngle);
            var xire = innerRadius * mathCos(endAngle);
            var yire = innerRadius * mathSin(endAngle);
            var xre = void 0;
            var yre = void 0;
            var xirs = void 0;
            var yirs = void 0;
            if (cr > e || icr > e) {
                xre = radius * mathCos(endAngle);
                yre = radius * mathSin(endAngle);
                xirs = innerRadius * mathCos(startAngle);
                yirs = innerRadius * mathSin(startAngle);
                if (arc < PI$2) {
                    var it_1 = intersect(xrs, yrs, xirs, yirs, xre, yre, xire, yire);
                    if (it_1) {
                        var x0 = xrs - it_1[0];
                        var y0 = yrs - it_1[1];
                        var x1 = xre - it_1[0];
                        var y1 = yre - it_1[1];
                        var a = 1 / mathSin(mathACos((x0 * x1 + y0 * y1) / (mathSqrt(x0 * x0 + y0 * y0) * mathSqrt(x1 * x1 + y1 * y1))) / 2);
                        var b = mathSqrt(it_1[0] * it_1[0] + it_1[1] * it_1[1]);
                        cr0 = mathMin(icr, (innerRadius - b) / (a - 1));
                        cr1 = mathMin(cr, (radius - b) / (a + 1));
                    }
                }
            }
            if (!(arc > e)) {
                ctx.moveTo(x + xrs, y + yrs);
            }
            else if (cr1 > e) {
                var ct0 = computeCornerTangents(xirs, yirs, xrs, yrs, radius, cr1, clockwise);
                var ct1 = computeCornerTangents(xre, yre, xire, yire, radius, cr1, clockwise);
                ctx.moveTo(x + ct0.cx + ct0.x01, y + ct0.cy + ct0.y01);
                if (cr1 < cr) {
                    ctx.arc(x + ct0.cx, y + ct0.cy, cr1, mathATan2(ct0.y01, ct0.x01), mathATan2(ct1.y01, ct1.x01), !clockwise);
                }
                else {
                    ctx.arc(x + ct0.cx, y + ct0.cy, cr1, mathATan2(ct0.y01, ct0.x01), mathATan2(ct0.y11, ct0.x11), !clockwise);
                    ctx.arc(x, y, radius, mathATan2(ct0.cy + ct0.y11, ct0.cx + ct0.x11), mathATan2(ct1.cy + ct1.y11, ct1.cx + ct1.x11), !clockwise);
                    ctx.arc(x + ct1.cx, y + ct1.cy, cr1, mathATan2(ct1.y11, ct1.x11), mathATan2(ct1.y01, ct1.x01), !clockwise);
                }
            }
            else {
                ctx.moveTo(x + xrs, y + yrs);
                ctx.arc(x, y, radius, startAngle, endAngle, !clockwise);
            }
            if (!(innerRadius > e) || !(arc > e)) {
                ctx.lineTo(x + xire, y + yire);
            }
            else if (cr0 > e) {
                var ct0 = computeCornerTangents(xire, yire, xre, yre, innerRadius, -cr0, clockwise);
                var ct1 = computeCornerTangents(xrs, yrs, xirs, yirs, innerRadius, -cr0, clockwise);
                ctx.lineTo(x + ct0.cx + ct0.x01, y + ct0.cy + ct0.y01);
                if (cr0 < icr) {
                    ctx.arc(x + ct0.cx, y + ct0.cy, cr0, mathATan2(ct0.y01, ct0.x01), mathATan2(ct1.y01, ct1.x01), !clockwise);
                }
                else {
                    ctx.arc(x + ct0.cx, y + ct0.cy, cr0, mathATan2(ct0.y01, ct0.x01), mathATan2(ct0.y11, ct0.x11), !clockwise);
                    ctx.arc(x, y, innerRadius, mathATan2(ct0.cy + ct0.y11, ct0.cx + ct0.x11), mathATan2(ct1.cy + ct1.y11, ct1.cx + ct1.x11), clockwise);
                    ctx.arc(x + ct1.cx, y + ct1.cy, cr0, mathATan2(ct1.y11, ct1.x11), mathATan2(ct1.y01, ct1.x01), !clockwise);
                }
            }
            else {
                ctx.lineTo(x + xire, y + yire);
                ctx.arc(x, y, innerRadius, endAngle, startAngle, clockwise);
            }
        }
        ctx.closePath();
    }

    var SectorShape = (function () {
        function SectorShape() {
            this.cx = 0;
            this.cy = 0;
            this.r0 = 0;
            this.r = 0;
            this.startAngle = 0;
            this.endAngle = Math.PI * 2;
            this.clockwise = true;
            this.cornerRadius = 0;
            this.innerCornerRadius = 0;
        }
        return SectorShape;
    }());
    var Sector = (function (_super) {
        __extends(Sector, _super);
        function Sector(opts) {
            return _super.call(this, opts) || this;
        }
        Sector.prototype.getDefaultShape = function () {
            return new SectorShape();
        };
        Sector.prototype.buildPath = function (ctx, shape) {
            buildPath(ctx, shape);
        };
        Sector.prototype.isZeroArea = function () {
            return this.shape.startAngle === this.shape.endAngle
                || this.shape.r === this.shape.r0;
        };
        return Sector;
    }(Path));
    Sector.prototype.type = 'sector';

    var CMD = PathProxy.CMD;
    var tmpArr = [];
    function aroundEqual(a, b) {
        return Math.abs(a - b) < 1e-5;
    }
    function pathToBezierCurves(path) {
        var data = path.data;
        var len = path.len();
        var bezierArray = [];
        var currentSubpath;
        var xi = 0;
        var yi = 0;
        var x0 = 0;
        var y0 = 0;
        function createNewSubpath(x, y) {
            if (currentSubpath && currentSubpath.length > 2) {
                bezierArray.push(currentSubpath);
            }
            currentSubpath = [x, y];
        }
        function addLine(x0, y0, x1, y1) {
            if (!(aroundEqual(x0, x1) && aroundEqual(y0, y1))) {
                currentSubpath.push(x0, y0, x1, y1, x1, y1);
            }
        }
        function addArc(startAngle, endAngle, cx, cy, rx, ry) {
            var delta = Math.abs(endAngle - startAngle);
            var len = Math.tan(delta / 4) * 4 / 3;
            var dir = endAngle < startAngle ? -1 : 1;
            var c1 = Math.cos(startAngle);
            var s1 = Math.sin(startAngle);
            var c2 = Math.cos(endAngle);
            var s2 = Math.sin(endAngle);
            var x1 = c1 * rx + cx;
            var y1 = s1 * ry + cy;
            var x4 = c2 * rx + cx;
            var y4 = s2 * ry + cy;
            var hx = rx * len * dir;
            var hy = ry * len * dir;
            currentSubpath.push(x1 - hx * s1, y1 + hy * c1, x4 + hx * s2, y4 - hy * c2, x4, y4);
        }
        var x1;
        var y1;
        var x2;
        var y2;
        for (var i = 0; i < len;) {
            var cmd = data[i++];
            var isFirst = i === 1;
            if (isFirst) {
                xi = data[i];
                yi = data[i + 1];
                x0 = xi;
                y0 = yi;
                if (cmd === CMD.L || cmd === CMD.C || cmd === CMD.Q) {
                    currentSubpath = [x0, y0];
                }
            }
            switch (cmd) {
                case CMD.M:
                    xi = x0 = data[i++];
                    yi = y0 = data[i++];
                    createNewSubpath(x0, y0);
                    break;
                case CMD.L:
                    x1 = data[i++];
                    y1 = data[i++];
                    addLine(xi, yi, x1, y1);
                    xi = x1;
                    yi = y1;
                    break;
                case CMD.C:
                    currentSubpath.push(data[i++], data[i++], data[i++], data[i++], xi = data[i++], yi = data[i++]);
                    break;
                case CMD.Q:
                    x1 = data[i++];
                    y1 = data[i++];
                    x2 = data[i++];
                    y2 = data[i++];
                    currentSubpath.push(xi + 2 / 3 * (x1 - xi), yi + 2 / 3 * (y1 - yi), x2 + 2 / 3 * (x1 - x2), y2 + 2 / 3 * (y1 - y2), x2, y2);
                    xi = x2;
                    yi = y2;
                    break;
                case CMD.A:
                    var cx = data[i++];
                    var cy = data[i++];
                    var rx = data[i++];
                    var ry = data[i++];
                    var startAngle = data[i++];
                    var endAngle = data[i++] + startAngle;
                    i += 1;
                    var anticlockwise = !data[i++];
                    x1 = Math.cos(startAngle) * rx + cx;
                    y1 = Math.sin(startAngle) * ry + cy;
                    if (isFirst) {
                        x0 = x1;
                        y0 = y1;
                        createNewSubpath(x0, y0);
                    }
                    else {
                        addLine(xi, yi, x1, y1);
                    }
                    xi = Math.cos(endAngle) * rx + cx;
                    yi = Math.sin(endAngle) * ry + cy;
                    var step = (anticlockwise ? -1 : 1) * Math.PI / 2;
                    for (var angle = startAngle; anticlockwise ? angle > endAngle : angle < endAngle; angle += step) {
                        var nextAngle = anticlockwise ? Math.max(angle + step, endAngle)
                            : Math.min(angle + step, endAngle);
                        addArc(angle, nextAngle, cx, cy, rx, ry);
                    }
                    break;
                case CMD.R:
                    x0 = xi = data[i++];
                    y0 = yi = data[i++];
                    x1 = x0 + data[i++];
                    y1 = y0 + data[i++];
                    createNewSubpath(x1, y0);
                    addLine(x1, y0, x1, y1);
                    addLine(x1, y1, x0, y1);
                    addLine(x0, y1, x0, y0);
                    addLine(x0, y0, x1, y0);
                    break;
                case CMD.Z:
                    currentSubpath && addLine(xi, yi, x0, y0);
                    xi = x0;
                    yi = y0;
                    break;
            }
        }
        if (currentSubpath && currentSubpath.length > 2) {
            bezierArray.push(currentSubpath);
        }
        return bezierArray;
    }
    function alignSubpath(subpath1, subpath2) {
        var len1 = subpath1.length;
        var len2 = subpath2.length;
        if (len1 === len2) {
            return [subpath1, subpath2];
        }
        var shorterPath = len1 < len2 ? subpath1 : subpath2;
        var shorterLen = Math.min(len1, len2);
        var diff = Math.abs(len2 - len1) / 6;
        var shorterBezierCount = (shorterLen - 2) / 6;
        var eachCurveSubDivCount = Math.ceil(diff / shorterBezierCount) + 1;
        var newSubpath = [shorterPath[0], shorterPath[1]];
        var remained = diff;
        var tmpSegX = [];
        var tmpSegY = [];
        for (var i = 2; i < shorterLen;) {
            var x0 = shorterPath[i - 2];
            var y0 = shorterPath[i - 1];
            var x1 = shorterPath[i++];
            var y1 = shorterPath[i++];
            var x2 = shorterPath[i++];
            var y2 = shorterPath[i++];
            var x3 = shorterPath[i++];
            var y3 = shorterPath[i++];
            if (remained <= 0) {
                newSubpath.push(x1, y1, x2, y2, x3, y3);
                continue;
            }
            var actualSubDivCount = Math.min(remained, eachCurveSubDivCount - 1) + 1;
            for (var k = 1; k <= actualSubDivCount; k++) {
                var p = k / actualSubDivCount;
                cubicSubdivide(x0, x1, x2, x3, p, tmpSegX);
                cubicSubdivide(y0, y1, y2, y3, p, tmpSegY);
                x0 = tmpSegX[3];
                y0 = tmpSegY[3];
                newSubpath.push(tmpSegX[1], tmpSegY[1], tmpSegX[2], tmpSegY[2], x0, y0);
                x1 = tmpSegX[5];
                y1 = tmpSegY[5];
                x2 = tmpSegX[6];
                y2 = tmpSegY[6];
            }
            remained -= actualSubDivCount - 1;
        }
        return shorterPath === subpath1 ? [newSubpath, subpath2] : [subpath1, newSubpath];
    }
    function createSubpath(lastSubpathSubpath, otherSubpath) {
        var len = lastSubpathSubpath.length;
        var lastX = lastSubpathSubpath[len - 2];
        var lastY = lastSubpathSubpath[len - 1];
        var newSubpath = [];
        for (var i = 0; i < otherSubpath.length;) {
            newSubpath[i++] = lastX;
            newSubpath[i++] = lastY;
        }
        return newSubpath;
    }
    function alignBezierCurves(array1, array2) {
        var _a;
        var lastSubpath1;
        var lastSubpath2;
        var newArray1 = [];
        var newArray2 = [];
        for (var i = 0; i < Math.max(array1.length, array2.length); i++) {
            var subpath1 = array1[i];
            var subpath2 = array2[i];
            var newSubpath1 = void 0;
            var newSubpath2 = void 0;
            if (!subpath1) {
                newSubpath1 = createSubpath(lastSubpath1 || subpath2, subpath2);
                newSubpath2 = subpath2;
            }
            else if (!subpath2) {
                newSubpath2 = createSubpath(lastSubpath2 || subpath1, subpath1);
                newSubpath1 = subpath1;
            }
            else {
                _a = alignSubpath(subpath1, subpath2), newSubpath1 = _a[0], newSubpath2 = _a[1];
                lastSubpath1 = newSubpath1;
                lastSubpath2 = newSubpath2;
            }
            newArray1.push(newSubpath1);
            newArray2.push(newSubpath2);
        }
        return [newArray1, newArray2];
    }
    function centroid(array) {
        var signedArea = 0;
        var cx = 0;
        var cy = 0;
        var len = array.length;
        for (var i = 0, j = len - 2; i < len; j = i, i += 2) {
            var x0 = array[j];
            var y0 = array[j + 1];
            var x1 = array[i];
            var y1 = array[i + 1];
            var a = x0 * y1 - x1 * y0;
            signedArea += a;
            cx += (x0 + x1) * a;
            cy += (y0 + y1) * a;
        }
        if (signedArea === 0) {
            return [array[0] || 0, array[1] || 0];
        }
        return [cx / signedArea / 3, cy / signedArea / 3, signedArea];
    }
    function findBestRingOffset(fromSubBeziers, toSubBeziers, fromCp, toCp) {
        var bezierCount = (fromSubBeziers.length - 2) / 6;
        var bestScore = Infinity;
        var bestOffset = 0;
        var len = fromSubBeziers.length;
        var len2 = len - 2;
        for (var offset = 0; offset < bezierCount; offset++) {
            var cursorOffset = offset * 6;
            var score = 0;
            for (var k = 0; k < len; k += 2) {
                var idx = k === 0 ? cursorOffset : ((cursorOffset + k - 2) % len2 + 2);
                var x0 = fromSubBeziers[idx] - fromCp[0];
                var y0 = fromSubBeziers[idx + 1] - fromCp[1];
                var x1 = toSubBeziers[k] - toCp[0];
                var y1 = toSubBeziers[k + 1] - toCp[1];
                var dx = x1 - x0;
                var dy = y1 - y0;
                score += dx * dx + dy * dy;
            }
            if (score < bestScore) {
                bestScore = score;
                bestOffset = offset;
            }
        }
        return bestOffset;
    }
    function reverse(array) {
        var newArr = [];
        var len = array.length;
        for (var i = 0; i < len; i += 2) {
            newArr[i] = array[len - i - 2];
            newArr[i + 1] = array[len - i - 1];
        }
        return newArr;
    }
    function findBestMorphingRotation(fromArr, toArr, searchAngleIteration, searchAngleRange) {
        var result = [];
        var fromNeedsReverse;
        for (var i = 0; i < fromArr.length; i++) {
            var fromSubpathBezier = fromArr[i];
            var toSubpathBezier = toArr[i];
            var fromCp = centroid(fromSubpathBezier);
            var toCp = centroid(toSubpathBezier);
            if (fromNeedsReverse == null) {
                fromNeedsReverse = fromCp[2] < 0 !== toCp[2] < 0;
            }
            var newFromSubpathBezier = [];
            var newToSubpathBezier = [];
            var bestAngle = 0;
            var bestScore = Infinity;
            var tmpArr_1 = [];
            var len = fromSubpathBezier.length;
            if (fromNeedsReverse) {
                fromSubpathBezier = reverse(fromSubpathBezier);
            }
            var offset = findBestRingOffset(fromSubpathBezier, toSubpathBezier, fromCp, toCp) * 6;
            var len2 = len - 2;
            for (var k = 0; k < len2; k += 2) {
                var idx = (offset + k) % len2 + 2;
                newFromSubpathBezier[k + 2] = fromSubpathBezier[idx] - fromCp[0];
                newFromSubpathBezier[k + 3] = fromSubpathBezier[idx + 1] - fromCp[1];
            }
            newFromSubpathBezier[0] = fromSubpathBezier[offset] - fromCp[0];
            newFromSubpathBezier[1] = fromSubpathBezier[offset + 1] - fromCp[1];
            if (searchAngleIteration > 0) {
                var step = searchAngleRange / searchAngleIteration;
                for (var angle = -searchAngleRange / 2; angle <= searchAngleRange / 2; angle += step) {
                    var sa = Math.sin(angle);
                    var ca = Math.cos(angle);
                    var score = 0;
                    for (var k = 0; k < fromSubpathBezier.length; k += 2) {
                        var x0 = newFromSubpathBezier[k];
                        var y0 = newFromSubpathBezier[k + 1];
                        var x1 = toSubpathBezier[k] - toCp[0];
                        var y1 = toSubpathBezier[k + 1] - toCp[1];
                        var newX1 = x1 * ca - y1 * sa;
                        var newY1 = x1 * sa + y1 * ca;
                        tmpArr_1[k] = newX1;
                        tmpArr_1[k + 1] = newY1;
                        var dx = newX1 - x0;
                        var dy = newY1 - y0;
                        score += dx * dx + dy * dy;
                    }
                    if (score < bestScore) {
                        bestScore = score;
                        bestAngle = angle;
                        for (var m = 0; m < tmpArr_1.length; m++) {
                            newToSubpathBezier[m] = tmpArr_1[m];
                        }
                    }
                }
            }
            else {
                for (var i_1 = 0; i_1 < len; i_1 += 2) {
                    newToSubpathBezier[i_1] = toSubpathBezier[i_1] - toCp[0];
                    newToSubpathBezier[i_1 + 1] = toSubpathBezier[i_1 + 1] - toCp[1];
                }
            }
            result.push({
                from: newFromSubpathBezier,
                to: newToSubpathBezier,
                fromCp: fromCp,
                toCp: toCp,
                rotation: -bestAngle
            });
        }
        return result;
    }
    function morphPath(fromPath, toPath, animationOpts) {
        var fromPathProxy;
        var toPathProxy;
        if (!fromPath || !toPath) {
            return toPath;
        }
        !fromPath.path && fromPath.createPathProxy();
        fromPathProxy = fromPath.path;
        fromPathProxy.beginPath();
        fromPath.buildPath(fromPathProxy, fromPath.shape);
        !toPath.path && toPath.createPathProxy();
        toPathProxy = toPath.path;
        toPathProxy === fromPathProxy && (toPathProxy = new PathProxy(false));
        toPathProxy.beginPath();
        if (isIndividualMorphingPath(toPath)) {
            toPath.__oldBuildPath(toPathProxy, toPath.shape);
        }
        else {
            toPath.buildPath(toPathProxy, toPath.shape);
        }
        var _a = alignBezierCurves(pathToBezierCurves(fromPathProxy), pathToBezierCurves(toPathProxy)), fromBezierCurves = _a[0], toBezierCurves = _a[1];
        var morphingData = findBestMorphingRotation(fromBezierCurves, toBezierCurves, 10, Math.PI);
        becomeIndividualMorphingPath(toPath, morphingData, 0);
        var oldDone = animationOpts && animationOpts.done;
        var oldAborted = animationOpts && animationOpts.aborted;
        var oldDuring = animationOpts && animationOpts.during;
        toPath.animateTo({
            __morphT: 1
        }, defaults({
            during: function (p) {
                toPath.dirtyShape();
                oldDuring && oldDuring(p);
            },
            done: function () {
                restoreIndividualMorphingPath(toPath);
                toPath.createPathProxy();
                toPath.dirtyShape();
                oldDone && oldDone();
            },
            aborted: function () {
                oldAborted && oldAborted();
            }
        }, animationOpts));
        return toPath;
    }
    function morphingPathBuildPath(path) {
        var morphingData = this.__morphingData;
        var t = this.__morphT;
        var onet = 1 - t;
        var newCp = [];
        for (var i = 0; i < morphingData.length; i++) {
            var item = morphingData[i];
            var from = item.from;
            var to = item.to;
            var angle = item.rotation * t;
            var fromCp = item.fromCp;
            var toCp = item.toCp;
            var sa = Math.sin(angle);
            var ca = Math.cos(angle);
            lerp$1(newCp, fromCp, toCp, t);
            for (var m = 0; m < from.length; m += 2) {
                var x0 = from[m];
                var y0 = from[m + 1];
                var x1 = to[m];
                var y1 = to[m + 1];
                var x = x0 * onet + x1 * t;
                var y = y0 * onet + y1 * t;
                tmpArr[m] = (x * ca - y * sa) + newCp[0];
                tmpArr[m + 1] = (x * sa + y * ca) + newCp[1];
            }
            for (var m = 0; m < from.length;) {
                if (m === 0) {
                    path.moveTo(tmpArr[m++], tmpArr[m++]);
                }
                path.bezierCurveTo(tmpArr[m++], tmpArr[m++], tmpArr[m++], tmpArr[m++], tmpArr[m++], tmpArr[m++]);
            }
        }
    }
    function becomeIndividualMorphingPath(path, morphingData, morphT) {
        if (isIndividualMorphingPath(path)) {
            updateIndividualMorphingPath(path, morphingData, morphT);
            return;
        }
        var morphingPath = path;
        morphingPath.__oldBuildPath = morphingPath.buildPath;
        morphingPath.buildPath = morphingPathBuildPath;
        updateIndividualMorphingPath(morphingPath, morphingData, morphT);
    }
    function updateIndividualMorphingPath(morphingPath, morphingData, morphT) {
        morphingPath.__morphingData = morphingData;
        morphingPath.__morphT = morphT;
    }
    function restoreIndividualMorphingPath(path) {
        if (isIndividualMorphingPath(path)) {
            path.buildPath = path.__oldBuildPath;
            path.__oldBuildPath = path.__morphingData = null;
        }
    }
    function isIndividualMorphingPath(path) {
        return path.__oldBuildPath != null;
    }

    var CompoundPath = (function (_super) {
        __extends(CompoundPath, _super);
        function CompoundPath() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = 'compound';
            return _this;
        }
        CompoundPath.prototype._updatePathDirty = function () {
            var paths = this.shape.paths;
            var dirtyPath = this.shapeChanged();
            for (var i = 0; i < paths.length; i++) {
                dirtyPath = dirtyPath || paths[i].shapeChanged();
            }
            if (dirtyPath) {
                this.dirtyShape();
            }
        };
        CompoundPath.prototype.beforeBrush = function () {
            this._updatePathDirty();
            var paths = this.shape.paths || [];
            var scale = this.getGlobalScale();
            for (var i = 0; i < paths.length; i++) {
                if (!paths[i].path) {
                    paths[i].createPathProxy();
                }
                paths[i].path.setScale(scale[0], scale[1], paths[i].segmentIgnoreThreshold);
            }
        };
        CompoundPath.prototype.buildPath = function (ctx, shape) {
            var paths = shape.paths || [];
            for (var i = 0; i < paths.length; i++) {
                paths[i].buildPath(ctx, paths[i].shape, true);
            }
        };
        CompoundPath.prototype.afterBrush = function () {
            var paths = this.shape.paths || [];
            for (var i = 0; i < paths.length; i++) {
                paths[i].pathUpdated();
            }
        };
        CompoundPath.prototype.getBoundingRect = function () {
            this._updatePathDirty.call(this);
            return Path.prototype.getBoundingRect.call(this);
        };
        return CompoundPath;
    }(Path));

    var STYLE_REG = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;
    function truncateText(text, containerWidth, font, ellipsis, options) {
        if (!containerWidth) {
            return '';
        }
        var textLines = (text + '').split('\n');
        options = prepareTruncateOptions(containerWidth, font, ellipsis, options);
        for (var i = 0, len = textLines.length; i < len; i++) {
            textLines[i] = truncateSingleLine(textLines[i], options);
        }
        return textLines.join('\n');
    }
    function prepareTruncateOptions(containerWidth, font, ellipsis, options) {
        options = options || {};
        var preparedOpts = extend({}, options);
        preparedOpts.font = font;
        ellipsis = retrieve2(ellipsis, '...');
        preparedOpts.maxIterations = retrieve2(options.maxIterations, 2);
        var minChar = preparedOpts.minChar = retrieve2(options.minChar, 0);
        preparedOpts.cnCharWidth = getWidth('国', font);
        var ascCharWidth = preparedOpts.ascCharWidth = getWidth('a', font);
        preparedOpts.placeholder = retrieve2(options.placeholder, '');
        var contentWidth = containerWidth = Math.max(0, containerWidth - 1);
        for (var i = 0; i < minChar && contentWidth >= ascCharWidth; i++) {
            contentWidth -= ascCharWidth;
        }
        var ellipsisWidth = getWidth(ellipsis, font);
        if (ellipsisWidth > contentWidth) {
            ellipsis = '';
            ellipsisWidth = 0;
        }
        contentWidth = containerWidth - ellipsisWidth;
        preparedOpts.ellipsis = ellipsis;
        preparedOpts.ellipsisWidth = ellipsisWidth;
        preparedOpts.contentWidth = contentWidth;
        preparedOpts.containerWidth = containerWidth;
        return preparedOpts;
    }
    function truncateSingleLine(textLine, options) {
        var containerWidth = options.containerWidth;
        var font = options.font;
        var contentWidth = options.contentWidth;
        if (!containerWidth) {
            return '';
        }
        var lineWidth = getWidth(textLine, font);
        if (lineWidth <= containerWidth) {
            return textLine;
        }
        for (var j = 0;; j++) {
            if (lineWidth <= contentWidth || j >= options.maxIterations) {
                textLine += options.ellipsis;
                break;
            }
            var subLength = j === 0
                ? estimateLength(textLine, contentWidth, options.ascCharWidth, options.cnCharWidth)
                : lineWidth > 0
                    ? Math.floor(textLine.length * contentWidth / lineWidth)
                    : 0;
            textLine = textLine.substr(0, subLength);
            lineWidth = getWidth(textLine, font);
        }
        if (textLine === '') {
            textLine = options.placeholder;
        }
        return textLine;
    }
    function estimateLength(text, contentWidth, ascCharWidth, cnCharWidth) {
        var width = 0;
        var i = 0;
        for (var len = text.length; i < len && width < contentWidth; i++) {
            var charCode = text.charCodeAt(i);
            width += (0 <= charCode && charCode <= 127) ? ascCharWidth : cnCharWidth;
        }
        return i;
    }
    function parsePlainText(text, style) {
        text != null && (text += '');
        var overflow = style.overflow;
        var padding = style.padding;
        var font = style.font;
        var truncate = overflow === 'truncate';
        var calculatedLineHeight = getLineHeight(font);
        var lineHeight = retrieve2(style.lineHeight, calculatedLineHeight);
        var truncateLineOverflow = style.lineOverflow === 'truncate';
        var width = style.width;
        var lines;
        if (width != null && overflow === 'break' || overflow === 'breakAll') {
            lines = text ? wrapText(text, style.font, width, overflow === 'breakAll', 0).lines : [];
        }
        else {
            lines = text ? text.split('\n') : [];
        }
        var contentHeight = lines.length * lineHeight;
        var height = retrieve2(style.height, contentHeight);
        if (contentHeight > height && truncateLineOverflow) {
            var lineCount = Math.floor(height / lineHeight);
            lines = lines.slice(0, lineCount);
        }
        var outerHeight = height;
        var outerWidth = width;
        if (padding) {
            outerHeight += padding[0] + padding[2];
            if (outerWidth != null) {
                outerWidth += padding[1] + padding[3];
            }
        }
        if (text && truncate && outerWidth != null) {
            var options = prepareTruncateOptions(width, font, style.ellipsis, {
                minChar: style.truncateMinChar,
                placeholder: style.placeholder
            });
            for (var i = 0; i < lines.length; i++) {
                lines[i] = truncateSingleLine(lines[i], options);
            }
        }
        if (width == null) {
            var maxWidth = 0;
            for (var i = 0; i < lines.length; i++) {
                maxWidth = Math.max(getWidth(lines[i], font), maxWidth);
            }
            width = maxWidth;
        }
        return {
            lines: lines,
            height: height,
            outerHeight: outerHeight,
            lineHeight: lineHeight,
            calculatedLineHeight: calculatedLineHeight,
            contentHeight: contentHeight,
            width: width
        };
    }
    var RichTextToken = (function () {
        function RichTextToken() {
        }
        return RichTextToken;
    }());
    var RichTextLine = (function () {
        function RichTextLine(tokens) {
            this.tokens = [];
            if (tokens) {
                this.tokens = tokens;
            }
        }
        return RichTextLine;
    }());
    var RichTextContentBlock = (function () {
        function RichTextContentBlock() {
            this.width = 0;
            this.height = 0;
            this.contentWidth = 0;
            this.contentHeight = 0;
            this.outerWidth = 0;
            this.outerHeight = 0;
            this.lines = [];
        }
        return RichTextContentBlock;
    }());
    function parseRichText(text, style) {
        var contentBlock = new RichTextContentBlock();
        text != null && (text += '');
        if (!text) {
            return contentBlock;
        }
        var topWidth = style.width;
        var topHeight = style.height;
        var overflow = style.overflow;
        var wrapInfo = (overflow === 'break' || overflow === 'breakAll') && topWidth != null
            ? { width: topWidth, accumWidth: 0, breakAll: overflow === 'breakAll' }
            : null;
        var lastIndex = STYLE_REG.lastIndex = 0;
        var result;
        while ((result = STYLE_REG.exec(text)) != null) {
            var matchedIndex = result.index;
            if (matchedIndex > lastIndex) {
                pushTokens(contentBlock, text.substring(lastIndex, matchedIndex), style, wrapInfo);
            }
            pushTokens(contentBlock, result[2], style, wrapInfo, result[1]);
            lastIndex = STYLE_REG.lastIndex;
        }
        if (lastIndex < text.length) {
            pushTokens(contentBlock, text.substring(lastIndex, text.length), style, wrapInfo);
        }
        var pendingList = [];
        var calculatedHeight = 0;
        var calculatedWidth = 0;
        var stlPadding = style.padding;
        var truncate = overflow === 'truncate';
        var truncateLine = style.lineOverflow === 'truncate';
        function finishLine(line, lineWidth, lineHeight) {
            line.width = lineWidth;
            line.lineHeight = lineHeight;
            calculatedHeight += lineHeight;
            calculatedWidth = Math.max(calculatedWidth, lineWidth);
        }
        outer: for (var i = 0; i < contentBlock.lines.length; i++) {
            var line = contentBlock.lines[i];
            var lineHeight = 0;
            var lineWidth = 0;
            for (var j = 0; j < line.tokens.length; j++) {
                var token = line.tokens[j];
                var tokenStyle = token.styleName && style.rich[token.styleName] || {};
                var textPadding = token.textPadding = tokenStyle.padding;
                var paddingH = textPadding ? textPadding[1] + textPadding[3] : 0;
                var font = token.font = tokenStyle.font || style.font;
                token.contentHeight = getLineHeight(font);
                var tokenHeight = retrieve2(tokenStyle.height, token.contentHeight);
                token.innerHeight = tokenHeight;
                textPadding && (tokenHeight += textPadding[0] + textPadding[2]);
                token.height = tokenHeight;
                token.lineHeight = retrieve3(tokenStyle.lineHeight, style.lineHeight, tokenHeight);
                token.align = tokenStyle && tokenStyle.align || style.align;
                token.verticalAlign = tokenStyle && tokenStyle.verticalAlign || 'middle';
                if (truncateLine && topHeight != null && calculatedHeight + token.lineHeight > topHeight) {
                    if (j > 0) {
                        line.tokens = line.tokens.slice(0, j);
                        finishLine(line, lineWidth, lineHeight);
                        contentBlock.lines = contentBlock.lines.slice(0, i + 1);
                    }
                    else {
                        contentBlock.lines = contentBlock.lines.slice(0, i);
                    }
                    break outer;
                }
                var styleTokenWidth = tokenStyle.width;
                var tokenWidthNotSpecified = styleTokenWidth == null || styleTokenWidth === 'auto';
                if (typeof styleTokenWidth === 'string' && styleTokenWidth.charAt(styleTokenWidth.length - 1) === '%') {
                    token.percentWidth = styleTokenWidth;
                    pendingList.push(token);
                    token.contentWidth = getWidth(token.text, font);
                }
                else {
                    if (tokenWidthNotSpecified) {
                        var textBackgroundColor = tokenStyle.backgroundColor;
                        var bgImg = textBackgroundColor && textBackgroundColor.image;
                        if (bgImg) {
                            bgImg = findExistImage(bgImg);
                            if (isImageReady(bgImg)) {
                                token.width = Math.max(token.width, bgImg.width * tokenHeight / bgImg.height);
                            }
                        }
                    }
                    var remainTruncWidth = truncate && topWidth != null
                        ? topWidth - lineWidth : null;
                    if (remainTruncWidth != null && remainTruncWidth < token.width) {
                        if (!tokenWidthNotSpecified || remainTruncWidth < paddingH) {
                            token.text = '';
                            token.width = token.contentWidth = 0;
                        }
                        else {
                            token.text = truncateText(token.text, remainTruncWidth - paddingH, font, style.ellipsis, { minChar: style.truncateMinChar });
                            token.width = token.contentWidth = getWidth(token.text, font);
                        }
                    }
                    else {
                        token.contentWidth = getWidth(token.text, font);
                    }
                }
                token.width += paddingH;
                lineWidth += token.width;
                tokenStyle && (lineHeight = Math.max(lineHeight, token.lineHeight));
            }
            finishLine(line, lineWidth, lineHeight);
        }
        contentBlock.outerWidth = contentBlock.width = retrieve2(topWidth, calculatedWidth);
        contentBlock.outerHeight = contentBlock.height = retrieve2(topHeight, calculatedHeight);
        contentBlock.contentHeight = calculatedHeight;
        contentBlock.contentWidth = calculatedWidth;
        if (stlPadding) {
            contentBlock.outerWidth += stlPadding[1] + stlPadding[3];
            contentBlock.outerHeight += stlPadding[0] + stlPadding[2];
        }
        for (var i = 0; i < pendingList.length; i++) {
            var token = pendingList[i];
            var percentWidth = token.percentWidth;
            token.width = parseInt(percentWidth, 10) / 100 * contentBlock.width;
        }
        return contentBlock;
    }
    function pushTokens(block, str, style, wrapInfo, styleName) {
        var isEmptyStr = str === '';
        var tokenStyle = styleName && style.rich[styleName] || {};
        var lines = block.lines;
        var font = tokenStyle.font || style.font;
        var newLine = false;
        var strLines;
        var linesWidths;
        if (wrapInfo) {
            var tokenPadding = tokenStyle.padding;
            var tokenPaddingH = tokenPadding ? tokenPadding[1] + tokenPadding[3] : 0;
            if (tokenStyle.width != null && tokenStyle.width !== 'auto') {
                var outerWidth_1 = parsePercent(tokenStyle.width, wrapInfo.width) + tokenPaddingH;
                if (lines.length > 0) {
                    if (outerWidth_1 + wrapInfo.accumWidth > wrapInfo.width) {
                        strLines = str.split('\n');
                        newLine = true;
                    }
                }
                wrapInfo.accumWidth = outerWidth_1;
            }
            else {
                var res = wrapText(str, font, wrapInfo.width, wrapInfo.breakAll, wrapInfo.accumWidth);
                wrapInfo.accumWidth = res.accumWidth + tokenPaddingH;
                linesWidths = res.linesWidths;
                strLines = res.lines;
            }
        }
        else {
            strLines = str.split('\n');
        }
        for (var i = 0; i < strLines.length; i++) {
            var text = strLines[i];
            var token = new RichTextToken();
            token.styleName = styleName;
            token.text = text;
            token.isLineHolder = !text && !isEmptyStr;
            if (typeof tokenStyle.width === 'number') {
                token.width = tokenStyle.width;
            }
            else {
                token.width = linesWidths
                    ? linesWidths[i]
                    : getWidth(text, font);
            }
            if (!i && !newLine) {
                var tokens = (lines[lines.length - 1] || (lines[0] = new RichTextLine())).tokens;
                var tokensLen = tokens.length;
                (tokensLen === 1 && tokens[0].isLineHolder)
                    ? (tokens[0] = token)
                    : ((text || !tokensLen || isEmptyStr) && tokens.push(token));
            }
            else {
                lines.push(new RichTextLine([token]));
            }
        }
    }
    function isLatin(ch) {
        var code = ch.charCodeAt(0);
        return code >= 0x21 && code <= 0xFF;
    }
    var breakCharMap = reduce(',&?/;] '.split(''), function (obj, ch) {
        obj[ch] = true;
        return obj;
    }, {});
    function isWordBreakChar(ch) {
        if (isLatin(ch)) {
            if (breakCharMap[ch]) {
                return true;
            }
            return false;
        }
        return true;
    }
    function wrapText(text, font, lineWidth, isBreakAll, lastAccumWidth) {
        var lines = [];
        var linesWidths = [];
        var line = '';
        var currentWord = '';
        var currentWordWidth = 0;
        var accumWidth = 0;
        for (var i = 0; i < text.length; i++) {
            var ch = text.charAt(i);
            if (ch === '\n') {
                if (currentWord) {
                    line += currentWord;
                    accumWidth += currentWordWidth;
                }
                lines.push(line);
                linesWidths.push(accumWidth);
                line = '';
                currentWord = '';
                currentWordWidth = 0;
                accumWidth = 0;
                continue;
            }
            var chWidth = getWidth(ch, font);
            var inWord = isBreakAll ? false : !isWordBreakChar(ch);
            if (!lines.length
                ? lastAccumWidth + accumWidth + chWidth > lineWidth
                : accumWidth + chWidth > lineWidth) {
                if (!accumWidth) {
                    if (inWord) {
                        lines.push(currentWord);
                        linesWidths.push(currentWordWidth);
                        currentWord = ch;
                        currentWordWidth = chWidth;
                    }
                    else {
                        lines.push(ch);
                        linesWidths.push(chWidth);
                    }
                }
                else if (line || currentWord) {
                    if (inWord) {
                        if (!line) {
                            line = currentWord;
                            currentWord = '';
                            currentWordWidth = 0;
                            accumWidth = currentWordWidth;
                        }
                        lines.push(line);
                        linesWidths.push(accumWidth - currentWordWidth);
                        currentWord += ch;
                        currentWordWidth += chWidth;
                        line = '';
                        accumWidth = currentWordWidth;
                    }
                    else {
                        if (currentWord) {
                            line += currentWord;
                            accumWidth += currentWordWidth;
                            currentWord = '';
                            currentWordWidth = 0;
                        }
                        lines.push(line);
                        linesWidths.push(accumWidth);
                        line = ch;
                        accumWidth = chWidth;
                    }
                }
                continue;
            }
            accumWidth += chWidth;
            if (inWord) {
                currentWord += ch;
                currentWordWidth += chWidth;
            }
            else {
                if (currentWord) {
                    line += currentWord;
                    currentWord = '';
                    currentWordWidth = 0;
                }
                line += ch;
            }
        }
        if (!lines.length && !line) {
            line = text;
            currentWord = '';
            currentWordWidth = 0;
        }
        if (currentWord) {
            line += currentWord;
        }
        if (line) {
            lines.push(line);
            linesWidths.push(accumWidth);
        }
        if (lines.length === 1) {
            accumWidth += lastAccumWidth;
        }
        return {
            accumWidth: accumWidth,
            lines: lines,
            linesWidths: linesWidths
        };
    }

    var DEFAULT_RICH_TEXT_COLOR = {
        fill: '#000'
    };
    var DEFAULT_STROKE_LINE_WIDTH = 2;
    var DEFAULT_TEXT_ANIMATION_PROPS = {
        style: defaults({
            fill: true,
            stroke: true,
            fillOpacity: true,
            strokeOpacity: true,
            lineWidth: true,
            fontSize: true,
            lineHeight: true,
            width: true,
            height: true,
            textShadowColor: true,
            textShadowBlur: true,
            textShadowOffsetX: true,
            textShadowOffsetY: true,
            backgroundColor: true,
            padding: true,
            borderColor: true,
            borderWidth: true,
            borderRadius: true
        }, DEFAULT_COMMON_ANIMATION_PROPS.style)
    };
    var ZRText = (function (_super) {
        __extends(ZRText, _super);
        function ZRText(opts) {
            var _this = _super.call(this) || this;
            _this.type = 'text';
            _this._children = [];
            _this._defaultStyle = DEFAULT_RICH_TEXT_COLOR;
            _this.attr(opts);
            return _this;
        }
        ZRText.prototype.childrenRef = function () {
            return this._children;
        };
        ZRText.prototype.update = function () {
            if (this.styleChanged()) {
                this._updateSubTexts();
            }
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                child.zlevel = this.zlevel;
                child.z = this.z;
                child.z2 = this.z2;
                child.culling = this.culling;
                child.cursor = this.cursor;
                child.invisible = this.invisible;
            }
            var attachedTransform = this.attachedTransform;
            if (attachedTransform) {
                attachedTransform.updateTransform();
                var m = attachedTransform.transform;
                if (m) {
                    this.transform = this.transform || [];
                    copy$1(this.transform, m);
                }
                else {
                    this.transform = null;
                }
            }
            else {
                _super.prototype.update.call(this);
            }
        };
        ZRText.prototype.getComputedTransform = function () {
            if (this.__hostTarget) {
                this.__hostTarget.getComputedTransform();
                this.__hostTarget.updateInnerText(true);
            }
            return this.attachedTransform ? this.attachedTransform.getComputedTransform()
                : _super.prototype.getComputedTransform.call(this);
        };
        ZRText.prototype._updateSubTexts = function () {
            this._childCursor = 0;
            normalizeTextStyle(this.style);
            this.style.rich
                ? this._updateRichTexts()
                : this._updatePlainTexts();
            this._children.length = this._childCursor;
            this.styleUpdated();
        };
        ZRText.prototype.addSelfToZr = function (zr) {
            _super.prototype.addSelfToZr.call(this, zr);
            for (var i = 0; i < this._children.length; i++) {
                this._children[i].__zr = zr;
            }
        };
        ZRText.prototype.removeSelfFromZr = function (zr) {
            _super.prototype.removeSelfFromZr.call(this, zr);
            for (var i = 0; i < this._children.length; i++) {
                this._children[i].__zr = null;
            }
        };
        ZRText.prototype.getBoundingRect = function () {
            if (this.styleChanged()) {
                this._updateSubTexts();
            }
            if (!this._rect) {
                var tmpRect = new BoundingRect(0, 0, 0, 0);
                var children = this._children;
                var tmpMat = [];
                var rect = null;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var childRect = child.getBoundingRect();
                    var transform = child.getLocalTransform(tmpMat);
                    if (transform) {
                        tmpRect.copy(childRect);
                        tmpRect.applyTransform(transform);
                        rect = rect || tmpRect.clone();
                        rect.union(tmpRect);
                    }
                    else {
                        rect = rect || childRect.clone();
                        rect.union(childRect);
                    }
                }
                this._rect = rect || tmpRect;
            }
            return this._rect;
        };
        ZRText.prototype.setDefaultTextStyle = function (defaultTextStyle) {
            this._defaultStyle = defaultTextStyle || DEFAULT_RICH_TEXT_COLOR;
        };
        ZRText.prototype.setTextContent = function (textContent) {
            throw new Error('Can\'t attach text on another text');
        };
        ZRText.prototype._mergeStyle = function (targetStyle, sourceStyle) {
            if (!sourceStyle) {
                return targetStyle;
            }
            var sourceRich = sourceStyle.rich;
            var targetRich = targetStyle.rich || (sourceRich && {});
            extend(targetStyle, sourceStyle);
            if (sourceRich && targetRich) {
                this._mergeRich(targetRich, sourceRich);
                targetStyle.rich = targetRich;
            }
            else if (targetRich) {
                targetStyle.rich = targetRich;
            }
            return targetStyle;
        };
        ZRText.prototype._mergeRich = function (targetRich, sourceRich) {
            var richNames = keys$1(sourceRich);
            for (var i = 0; i < richNames.length; i++) {
                var richName = richNames[i];
                targetRich[richName] = targetRich[richName] || {};
                extend(targetRich[richName], sourceRich[richName]);
            }
        };
        ZRText.prototype.getAnimationStyleProps = function () {
            return DEFAULT_TEXT_ANIMATION_PROPS;
        };
        ZRText.prototype._getOrCreateChild = function (Ctor) {
            var child = this._children[this._childCursor];
            if (!child || !(child instanceof Ctor)) {
                child = new Ctor();
            }
            this._children[this._childCursor++] = child;
            child.__zr = this.__zr;
            child.parent = this;
            return child;
        };
        ZRText.prototype._updatePlainTexts = function () {
            var style = this.style;
            var textFont = style.font || DEFAULT_FONT;
            var textPadding = style.padding;
            var text = getStyleText(style);
            var contentBlock = parsePlainText(text, style);
            var needDrawBg = needDrawBackground(style);
            var bgColorDrawn = !!(style.backgroundColor);
            var outerHeight = contentBlock.outerHeight;
            var textLines = contentBlock.lines;
            var lineHeight = contentBlock.lineHeight;
            var defaultStyle = this._defaultStyle;
            var baseX = style.x || 0;
            var baseY = style.y || 0;
            var textAlign = style.align || defaultStyle.align || 'left';
            var verticalAlign = style.verticalAlign || defaultStyle.verticalAlign || 'top';
            var textX = baseX;
            var textY = adjustTextY$1(baseY, contentBlock.contentHeight, verticalAlign);
            if (needDrawBg || textPadding) {
                var outerWidth_1 = contentBlock.width;
                textPadding && (outerWidth_1 += textPadding[1] + textPadding[3]);
                var boxX = adjustTextX(baseX, outerWidth_1, textAlign);
                var boxY = adjustTextY$1(baseY, outerHeight, verticalAlign);
                needDrawBg && this._renderBackground(style, style, boxX, boxY, outerWidth_1, outerHeight);
            }
            textY += lineHeight / 2;
            if (textPadding) {
                textX = getTextXForPadding(baseX, textAlign, textPadding);
                if (verticalAlign === 'top') {
                    textY += textPadding[0];
                }
                else if (verticalAlign === 'bottom') {
                    textY -= textPadding[2];
                }
            }
            var defaultLineWidth = 0;
            var useDefaultFill = false;
            var textFill = getFill('fill' in style
                ? style.fill
                : (useDefaultFill = true, defaultStyle.fill));
            var textStroke = getStroke('stroke' in style
                ? style.stroke
                : (!bgColorDrawn
                    && (!defaultStyle.autoStroke || useDefaultFill))
                    ? (defaultLineWidth = DEFAULT_STROKE_LINE_WIDTH, defaultStyle.stroke)
                    : null);
            var hasShadow = style.textShadowBlur > 0;
            var fixedBoundingRect = style.width != null
                && (style.overflow === 'truncate' || style.overflow === 'break' || style.overflow === 'breakAll');
            var calculatedLineHeight = contentBlock.calculatedLineHeight;
            for (var i = 0; i < textLines.length; i++) {
                var el = this._getOrCreateChild(TSpan);
                var subElStyle = el.createStyle();
                el.useStyle(subElStyle);
                subElStyle.text = textLines[i];
                subElStyle.x = textX;
                subElStyle.y = textY;
                if (textAlign) {
                    subElStyle.textAlign = textAlign;
                }
                subElStyle.textBaseline = 'middle';
                subElStyle.opacity = style.opacity;
                subElStyle.strokeFirst = true;
                if (hasShadow) {
                    subElStyle.shadowBlur = style.textShadowBlur || 0;
                    subElStyle.shadowColor = style.textShadowColor || 'transparent';
                    subElStyle.shadowOffsetX = style.textShadowOffsetX || 0;
                    subElStyle.shadowOffsetY = style.textShadowOffsetY || 0;
                }
                if (textStroke) {
                    subElStyle.stroke = textStroke;
                    subElStyle.lineWidth = style.lineWidth || defaultLineWidth;
                    subElStyle.lineDash = style.lineDash;
                    subElStyle.lineDashOffset = style.lineDashOffset || 0;
                }
                if (textFill) {
                    subElStyle.fill = textFill;
                }
                subElStyle.font = textFont;
                textY += lineHeight;
                if (fixedBoundingRect) {
                    el.setBoundingRect(new BoundingRect(adjustTextX(subElStyle.x, style.width, subElStyle.textAlign), adjustTextY$1(subElStyle.y, calculatedLineHeight, subElStyle.textBaseline), style.width, calculatedLineHeight));
                }
            }
        };
        ZRText.prototype._updateRichTexts = function () {
            var style = this.style;
            var text = getStyleText(style);
            var contentBlock = parseRichText(text, style);
            var contentWidth = contentBlock.width;
            var outerWidth = contentBlock.outerWidth;
            var outerHeight = contentBlock.outerHeight;
            var textPadding = style.padding;
            var baseX = style.x || 0;
            var baseY = style.y || 0;
            var defaultStyle = this._defaultStyle;
            var textAlign = style.align || defaultStyle.align;
            var verticalAlign = style.verticalAlign || defaultStyle.verticalAlign;
            var boxX = adjustTextX(baseX, outerWidth, textAlign);
            var boxY = adjustTextY$1(baseY, outerHeight, verticalAlign);
            var xLeft = boxX;
            var lineTop = boxY;
            if (textPadding) {
                xLeft += textPadding[3];
                lineTop += textPadding[0];
            }
            var xRight = xLeft + contentWidth;
            if (needDrawBackground(style)) {
                this._renderBackground(style, style, boxX, boxY, outerWidth, outerHeight);
            }
            var bgColorDrawn = !!(style.backgroundColor);
            for (var i = 0; i < contentBlock.lines.length; i++) {
                var line = contentBlock.lines[i];
                var tokens = line.tokens;
                var tokenCount = tokens.length;
                var lineHeight = line.lineHeight;
                var remainedWidth = line.width;
                var leftIndex = 0;
                var lineXLeft = xLeft;
                var lineXRight = xRight;
                var rightIndex = tokenCount - 1;
                var token = void 0;
                while (leftIndex < tokenCount
                    && (token = tokens[leftIndex], !token.align || token.align === 'left')) {
                    this._placeToken(token, style, lineHeight, lineTop, lineXLeft, 'left', bgColorDrawn);
                    remainedWidth -= token.width;
                    lineXLeft += token.width;
                    leftIndex++;
                }
                while (rightIndex >= 0
                    && (token = tokens[rightIndex], token.align === 'right')) {
                    this._placeToken(token, style, lineHeight, lineTop, lineXRight, 'right', bgColorDrawn);
                    remainedWidth -= token.width;
                    lineXRight -= token.width;
                    rightIndex--;
                }
                lineXLeft += (contentWidth - (lineXLeft - xLeft) - (xRight - lineXRight) - remainedWidth) / 2;
                while (leftIndex <= rightIndex) {
                    token = tokens[leftIndex];
                    this._placeToken(token, style, lineHeight, lineTop, lineXLeft + token.width / 2, 'center', bgColorDrawn);
                    lineXLeft += token.width;
                    leftIndex++;
                }
                lineTop += lineHeight;
            }
        };
        ZRText.prototype._placeToken = function (token, style, lineHeight, lineTop, x, textAlign, parentBgColorDrawn) {
            var tokenStyle = style.rich[token.styleName] || {};
            tokenStyle.text = token.text;
            var verticalAlign = token.verticalAlign;
            var y = lineTop + lineHeight / 2;
            if (verticalAlign === 'top') {
                y = lineTop + token.height / 2;
            }
            else if (verticalAlign === 'bottom') {
                y = lineTop + lineHeight - token.height / 2;
            }
            var needDrawBg = !token.isLineHolder && needDrawBackground(tokenStyle);
            needDrawBg && this._renderBackground(tokenStyle, style, textAlign === 'right'
                ? x - token.width
                : textAlign === 'center'
                    ? x - token.width / 2
                    : x, y - token.height / 2, token.width, token.height);
            var bgColorDrawn = !!tokenStyle.backgroundColor;
            var textPadding = token.textPadding;
            if (textPadding) {
                x = getTextXForPadding(x, textAlign, textPadding);
                y -= token.height / 2 - textPadding[0] - token.innerHeight / 2;
            }
            var el = this._getOrCreateChild(TSpan);
            var subElStyle = el.createStyle();
            el.useStyle(subElStyle);
            var defaultStyle = this._defaultStyle;
            var useDefaultFill = false;
            var defaultLineWidth = 0;
            var textFill = getStroke('fill' in tokenStyle ? tokenStyle.fill
                : 'fill' in style ? style.fill
                    : (useDefaultFill = true, defaultStyle.fill));
            var textStroke = getStroke('stroke' in tokenStyle ? tokenStyle.stroke
                : 'stroke' in style ? style.stroke
                    : (!bgColorDrawn
                        && !parentBgColorDrawn
                        && (!defaultStyle.autoStroke || useDefaultFill)) ? (defaultLineWidth = DEFAULT_STROKE_LINE_WIDTH, defaultStyle.stroke)
                        : null);
            var hasShadow = tokenStyle.textShadowBlur > 0
                || style.textShadowBlur > 0;
            subElStyle.text = token.text;
            subElStyle.x = x;
            subElStyle.y = y;
            if (hasShadow) {
                subElStyle.shadowBlur = tokenStyle.textShadowBlur || style.textShadowBlur || 0;
                subElStyle.shadowColor = tokenStyle.textShadowColor || style.textShadowColor || 'transparent';
                subElStyle.shadowOffsetX = tokenStyle.textShadowOffsetX || style.textShadowOffsetX || 0;
                subElStyle.shadowOffsetY = tokenStyle.textShadowOffsetY || style.textShadowOffsetY || 0;
            }
            subElStyle.textAlign = textAlign;
            subElStyle.textBaseline = 'middle';
            subElStyle.font = token.font || DEFAULT_FONT;
            subElStyle.opacity = retrieve3(tokenStyle.opacity, style.opacity, 1);
            if (textStroke) {
                subElStyle.lineWidth = retrieve3(tokenStyle.lineWidth, style.lineWidth, defaultLineWidth);
                subElStyle.lineDash = retrieve2(tokenStyle.lineDash, style.lineDash);
                subElStyle.lineDashOffset = style.lineDashOffset || 0;
                subElStyle.stroke = textStroke;
            }
            if (textFill) {
                subElStyle.fill = textFill;
            }
            var textWidth = token.contentWidth;
            var textHeight = token.contentHeight;
            el.setBoundingRect(new BoundingRect(adjustTextX(subElStyle.x, textWidth, subElStyle.textAlign), adjustTextY$1(subElStyle.y, textHeight, subElStyle.textBaseline), textWidth, textHeight));
        };
        ZRText.prototype._renderBackground = function (style, topStyle, x, y, width, height) {
            var textBackgroundColor = style.backgroundColor;
            var textBorderWidth = style.borderWidth;
            var textBorderColor = style.borderColor;
            var isImageBg = textBackgroundColor && textBackgroundColor.image;
            var isPlainOrGradientBg = textBackgroundColor && !isImageBg;
            var textBorderRadius = style.borderRadius;
            var self = this;
            var rectEl;
            var imgEl;
            if (isPlainOrGradientBg || (textBorderWidth && textBorderColor)) {
                rectEl = this._getOrCreateChild(Rect);
                rectEl.useStyle(rectEl.createStyle());
                rectEl.style.fill = null;
                var rectShape = rectEl.shape;
                rectShape.x = x;
                rectShape.y = y;
                rectShape.width = width;
                rectShape.height = height;
                rectShape.r = textBorderRadius;
                rectEl.dirtyShape();
            }
            if (isPlainOrGradientBg) {
                var rectStyle = rectEl.style;
                rectStyle.fill = textBackgroundColor || null;
                rectStyle.fillOpacity = retrieve2(style.fillOpacity, 1);
            }
            else if (isImageBg) {
                imgEl = this._getOrCreateChild(ZRImage);
                imgEl.onload = function () {
                    self.dirtyStyle();
                };
                var imgStyle = imgEl.style;
                imgStyle.image = textBackgroundColor.image;
                imgStyle.x = x;
                imgStyle.y = y;
                imgStyle.width = width;
                imgStyle.height = height;
            }
            if (textBorderWidth && textBorderColor) {
                var rectStyle = rectEl.style;
                rectStyle.lineWidth = textBorderWidth;
                rectStyle.stroke = textBorderColor;
                rectStyle.strokeOpacity = retrieve2(style.strokeOpacity, 1);
                rectStyle.lineDash = style.borderDash;
                rectStyle.lineDashOffset = style.borderDashOffset || 0;
                rectEl.strokeContainThreshold = 0;
                if (rectEl.hasFill() && rectEl.hasStroke()) {
                    rectStyle.strokeFirst = true;
                    rectStyle.lineWidth *= 2;
                }
            }
            var commonStyle = (rectEl || imgEl).style;
            commonStyle.shadowBlur = style.shadowBlur || 0;
            commonStyle.shadowColor = style.shadowColor || 'transparent';
            commonStyle.shadowOffsetX = style.shadowOffsetX || 0;
            commonStyle.shadowOffsetY = style.shadowOffsetY || 0;
            commonStyle.opacity = retrieve3(style.opacity, topStyle.opacity, 1);
        };
        ZRText.makeFont = function (style) {
            var font = '';
            if (style.fontSize || style.fontFamily || style.fontWeight) {
                var fontSize = '';
                if (typeof style.fontSize === 'string'
                    && (style.fontSize.indexOf('px') !== -1
                        || style.fontSize.indexOf('rem') !== -1
                        || style.fontSize.indexOf('em') !== -1)) {
                    fontSize = style.fontSize;
                }
                else if (!isNaN(+style.fontSize)) {
                    fontSize = style.fontSize + 'px';
                }
                else {
                    fontSize = '12px';
                }
                font = [
                    style.fontStyle,
                    style.fontWeight,
                    fontSize,
                    style.fontFamily || 'sans-serif'
                ].join(' ');
            }
            return font && trim(font) || style.textFont || style.font;
        };
        return ZRText;
    }(Displayable));
    var VALID_TEXT_ALIGN = { left: true, right: 1, center: 1 };
    var VALID_TEXT_VERTICAL_ALIGN = { top: 1, bottom: 1, middle: 1 };
    function normalizeTextStyle(style) {
        normalizeStyle(style);
        each(style.rich, normalizeStyle);
        return style;
    }
    function normalizeStyle(style) {
        if (style) {
            style.font = ZRText.makeFont(style);
            var textAlign = style.align;
            textAlign === 'middle' && (textAlign = 'center');
            style.align = (textAlign == null || VALID_TEXT_ALIGN[textAlign]) ? textAlign : 'left';
            var verticalAlign = style.verticalAlign;
            verticalAlign === 'center' && (verticalAlign = 'middle');
            style.verticalAlign = (verticalAlign == null || VALID_TEXT_VERTICAL_ALIGN[verticalAlign]) ? verticalAlign : 'top';
            var textPadding = style.padding;
            if (textPadding) {
                style.padding = normalizeCssArray(style.padding);
            }
        }
    }
    function getStroke(stroke, lineWidth) {
        return (stroke == null || lineWidth <= 0 || stroke === 'transparent' || stroke === 'none')
            ? null
            : (stroke.image || stroke.colorStops)
                ? '#000'
                : stroke;
    }
    function getFill(fill) {
        return (fill == null || fill === 'none')
            ? null
            : (fill.image || fill.colorStops)
                ? '#000'
                : fill;
    }
    function getTextXForPadding(x, textAlign, textPadding) {
        return textAlign === 'right'
            ? (x - textPadding[1])
            : textAlign === 'center'
                ? (x + textPadding[3] / 2 - textPadding[1] / 2)
                : (x + textPadding[3]);
    }
    function getStyleText(style) {
        var text = style.text;
        text != null && (text += '');
        return text;
    }
    function needDrawBackground(style) {
        return !!(style.backgroundColor
            || (style.borderWidth && style.borderColor));
    }

    var ArcShape = (function () {
        function ArcShape() {
            this.cx = 0;
            this.cy = 0;
            this.r = 0;
            this.startAngle = 0;
            this.endAngle = Math.PI * 2;
            this.clockwise = true;
        }
        return ArcShape;
    }());
    var Arc = (function (_super) {
        __extends(Arc, _super);
        function Arc(opts) {
            return _super.call(this, opts) || this;
        }
        Arc.prototype.getDefaultStyle = function () {
            return {
                stroke: '#000',
                fill: null
            };
        };
        Arc.prototype.getDefaultShape = function () {
            return new ArcShape();
        };
        Arc.prototype.buildPath = function (ctx, shape) {
            var x = shape.cx;
            var y = shape.cy;
            var r = Math.max(shape.r, 0);
            var startAngle = shape.startAngle;
            var endAngle = shape.endAngle;
            var clockwise = shape.clockwise;
            var unitX = Math.cos(startAngle);
            var unitY = Math.sin(startAngle);
            ctx.moveTo(unitX * r + x, unitY * r + y);
            ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
        };
        return Arc;
    }(Path));
    Arc.prototype.type = 'arc';

    var out = [];
    var BezierCurveShape = (function () {
        function BezierCurveShape() {
            this.x1 = 0;
            this.y1 = 0;
            this.x2 = 0;
            this.y2 = 0;
            this.cpx1 = 0;
            this.cpy1 = 0;
            this.percent = 1;
        }
        return BezierCurveShape;
    }());
    function someVectorAt(shape, t, isTangent) {
        var cpx2 = shape.cpx2;
        var cpy2 = shape.cpy2;
        if (cpx2 === null || cpy2 === null) {
            return [
                (isTangent ? cubicDerivativeAt : cubicAt)(shape.x1, shape.cpx1, shape.cpx2, shape.x2, t),
                (isTangent ? cubicDerivativeAt : cubicAt)(shape.y1, shape.cpy1, shape.cpy2, shape.y2, t)
            ];
        }
        else {
            return [
                (isTangent ? quadraticDerivativeAt : quadraticAt)(shape.x1, shape.cpx1, shape.x2, t),
                (isTangent ? quadraticDerivativeAt : quadraticAt)(shape.y1, shape.cpy1, shape.y2, t)
            ];
        }
    }
    var BezierCurve = (function (_super) {
        __extends(BezierCurve, _super);
        function BezierCurve(opts) {
            return _super.call(this, opts) || this;
        }
        BezierCurve.prototype.getDefaultStyle = function () {
            return {
                stroke: '#000',
                fill: null
            };
        };
        BezierCurve.prototype.getDefaultShape = function () {
            return new BezierCurveShape();
        };
        BezierCurve.prototype.buildPath = function (ctx, shape) {
            var x1 = shape.x1;
            var y1 = shape.y1;
            var x2 = shape.x2;
            var y2 = shape.y2;
            var cpx1 = shape.cpx1;
            var cpy1 = shape.cpy1;
            var cpx2 = shape.cpx2;
            var cpy2 = shape.cpy2;
            var percent = shape.percent;
            if (percent === 0) {
                return;
            }
            ctx.moveTo(x1, y1);
            if (cpx2 == null || cpy2 == null) {
                if (percent < 1) {
                    quadraticSubdivide(x1, cpx1, x2, percent, out);
                    cpx1 = out[1];
                    x2 = out[2];
                    quadraticSubdivide(y1, cpy1, y2, percent, out);
                    cpy1 = out[1];
                    y2 = out[2];
                }
                ctx.quadraticCurveTo(cpx1, cpy1, x2, y2);
            }
            else {
                if (percent < 1) {
                    cubicSubdivide(x1, cpx1, cpx2, x2, percent, out);
                    cpx1 = out[1];
                    cpx2 = out[2];
                    x2 = out[3];
                    cubicSubdivide(y1, cpy1, cpy2, y2, percent, out);
                    cpy1 = out[1];
                    cpy2 = out[2];
                    y2 = out[3];
                }
                ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
            }
        };
        BezierCurve.prototype.pointAt = function (t) {
            return someVectorAt(this.shape, t, false);
        };
        BezierCurve.prototype.tangentAt = function (t) {
            var p = someVectorAt(this.shape, t, true);
            return normalize(p, p);
        };
        return BezierCurve;
    }(Path));
    BezierCurve.prototype.type = 'bezier-curve';

    var DropletShape = (function () {
        function DropletShape() {
            this.cx = 0;
            this.cy = 0;
            this.width = 0;
            this.height = 0;
        }
        return DropletShape;
    }());
    var Droplet = (function (_super) {
        __extends(Droplet, _super);
        function Droplet(opts) {
            return _super.call(this, opts) || this;
        }
        Droplet.prototype.getDefaultShape = function () {
            return new DropletShape();
        };
        Droplet.prototype.buildPath = function (ctx, shape) {
            var x = shape.cx;
            var y = shape.cy;
            var a = shape.width;
            var b = shape.height;
            ctx.moveTo(x, y + a);
            ctx.bezierCurveTo(x + a, y + a, x + a * 3 / 2, y - a / 3, x, y - b);
            ctx.bezierCurveTo(x - a * 3 / 2, y - a / 3, x - a, y + a, x, y + a);
            ctx.closePath();
        };
        return Droplet;
    }(Path));
    Droplet.prototype.type = 'droplet';

    var HeartShape = (function () {
        function HeartShape() {
            this.cx = 0;
            this.cy = 0;
            this.width = 0;
            this.height = 0;
        }
        return HeartShape;
    }());
    var Heart = (function (_super) {
        __extends(Heart, _super);
        function Heart(opts) {
            return _super.call(this, opts) || this;
        }
        Heart.prototype.getDefaultShape = function () {
            return new HeartShape();
        };
        Heart.prototype.buildPath = function (ctx, shape) {
            var x = shape.cx;
            var y = shape.cy;
            var a = shape.width;
            var b = shape.height;
            ctx.moveTo(x, y);
            ctx.bezierCurveTo(x + a / 2, y - b * 2 / 3, x + a * 2, y + b / 3, x, y + b);
            ctx.bezierCurveTo(x - a * 2, y + b / 3, x - a / 2, y - b * 2 / 3, x, y);
        };
        return Heart;
    }(Path));
    Heart.prototype.type = 'heart';

    var PI$1 = Math.PI;
    var sin$3 = Math.sin;
    var cos$3 = Math.cos;
    var IsogonShape = (function () {
        function IsogonShape() {
            this.x = 0;
            this.y = 0;
            this.r = 0;
            this.n = 0;
        }
        return IsogonShape;
    }());
    var Isogon = (function (_super) {
        __extends(Isogon, _super);
        function Isogon(opts) {
            return _super.call(this, opts) || this;
        }
        Isogon.prototype.getDefaultShape = function () {
            return new IsogonShape();
        };
        Isogon.prototype.buildPath = function (ctx, shape) {
            var n = shape.n;
            if (!n || n < 2) {
                return;
            }
            var x = shape.x;
            var y = shape.y;
            var r = shape.r;
            var dStep = 2 * PI$1 / n;
            var deg = -PI$1 / 2;
            ctx.moveTo(x + r * cos$3(deg), y + r * sin$3(deg));
            for (var i = 0, end = n - 1; i < end; i++) {
                deg += dStep;
                ctx.lineTo(x + r * cos$3(deg), y + r * sin$3(deg));
            }
            ctx.closePath();
            return;
        };
        return Isogon;
    }(Path));
    Isogon.prototype.type = 'isogon';

    var RingShape = (function () {
        function RingShape() {
            this.cx = 0;
            this.cy = 0;
            this.r = 0;
            this.r0 = 0;
        }
        return RingShape;
    }());
    var Ring = (function (_super) {
        __extends(Ring, _super);
        function Ring(opts) {
            return _super.call(this, opts) || this;
        }
        Ring.prototype.getDefaultShape = function () {
            return new RingShape();
        };
        Ring.prototype.buildPath = function (ctx, shape) {
            var x = shape.cx;
            var y = shape.cy;
            var PI2 = Math.PI * 2;
            ctx.moveTo(x + shape.r, y);
            ctx.arc(x, y, shape.r, 0, PI2, false);
            ctx.moveTo(x + shape.r0, y);
            ctx.arc(x, y, shape.r0, 0, PI2, true);
        };
        return Ring;
    }(Path));
    Ring.prototype.type = 'ring';

    var sin$2 = Math.sin;
    var cos$2 = Math.cos;
    var radian = Math.PI / 180;
    var RoseShape = (function () {
        function RoseShape() {
            this.cx = 0;
            this.cy = 0;
            this.r = [];
            this.k = 0;
            this.n = 1;
        }
        return RoseShape;
    }());
    var Rose = (function (_super) {
        __extends(Rose, _super);
        function Rose(opts) {
            return _super.call(this, opts) || this;
        }
        Rose.prototype.getDefaultStyle = function () {
            return {
                stroke: '#000',
                fill: null
            };
        };
        Rose.prototype.getDefaultShape = function () {
            return new RoseShape();
        };
        Rose.prototype.buildPath = function (ctx, shape) {
            var R = shape.r;
            var k = shape.k;
            var n = shape.n;
            var x0 = shape.cx;
            var y0 = shape.cy;
            var x;
            var y;
            var r;
            ctx.moveTo(x0, y0);
            for (var i = 0, len = R.length; i < len; i++) {
                r = R[i];
                for (var j = 0; j <= 360 * n; j++) {
                    x = r
                        * sin$2(k / n * j % 360 * radian)
                        * cos$2(j * radian)
                        + x0;
                    y = r
                        * sin$2(k / n * j % 360 * radian)
                        * sin$2(j * radian)
                        + y0;
                    ctx.lineTo(x, y);
                }
            }
        };
        return Rose;
    }(Path));
    Rose.prototype.type = 'rose';

    var PI = Math.PI;
    var cos$1 = Math.cos;
    var sin$1 = Math.sin;
    var StarShape = (function () {
        function StarShape() {
            this.cx = 0;
            this.cy = 0;
            this.n = 3;
            this.r = 0;
        }
        return StarShape;
    }());
    var Star = (function (_super) {
        __extends(Star, _super);
        function Star(opts) {
            return _super.call(this, opts) || this;
        }
        Star.prototype.getDefaultShape = function () {
            return new StarShape();
        };
        Star.prototype.buildPath = function (ctx, shape) {
            var n = shape.n;
            if (!n || n < 2) {
                return;
            }
            var x = shape.cx;
            var y = shape.cy;
            var r = shape.r;
            var r0 = shape.r0;
            if (r0 == null) {
                r0 = n > 4
                    ? r * cos$1(2 * PI / n) / cos$1(PI / n)
                    : r / 3;
            }
            var dStep = PI / n;
            var deg = -PI / 2;
            var xStart = x + r * cos$1(deg);
            var yStart = y + r * sin$1(deg);
            deg += dStep;
            ctx.moveTo(xStart, yStart);
            for (var i = 0, end = n * 2 - 1, ri = void 0; i < end; i++) {
                ri = i % 2 === 0 ? r0 : r;
                ctx.lineTo(x + ri * cos$1(deg), y + ri * sin$1(deg));
                deg += dStep;
            }
            ctx.closePath();
        };
        return Star;
    }(Path));
    Star.prototype.type = 'star';

    var cos = Math.cos;
    var sin = Math.sin;
    var TrochoidShape = (function () {
        function TrochoidShape() {
            this.cx = 0;
            this.cy = 0;
            this.r = 0;
            this.r0 = 0;
            this.d = 0;
            this.location = 'out';
        }
        return TrochoidShape;
    }());
    var Trochoid = (function (_super) {
        __extends(Trochoid, _super);
        function Trochoid(opts) {
            return _super.call(this, opts) || this;
        }
        Trochoid.prototype.getDefaultStyle = function () {
            return {
                stroke: '#000',
                fill: null
            };
        };
        Trochoid.prototype.getDefaultShape = function () {
            return new TrochoidShape();
        };
        Trochoid.prototype.buildPath = function (ctx, shape) {
            var R = shape.r;
            var r = shape.r0;
            var d = shape.d;
            var offsetX = shape.cx;
            var offsetY = shape.cy;
            var delta = shape.location === 'out' ? 1 : -1;
            var x1;
            var y1;
            var x2;
            var y2;
            if (shape.location && R <= r) {
                return;
            }
            var num = 0;
            var i = 1;
            var theta;
            x1 = (R + delta * r) * cos(0)
                - delta * d * cos(0) + offsetX;
            y1 = (R + delta * r) * sin(0)
                - d * sin(0) + offsetY;
            ctx.moveTo(x1, y1);
            do {
                num++;
            } while ((r * num) % (R + delta * r) !== 0);
            do {
                theta = Math.PI / 180 * i;
                x2 = (R + delta * r) * cos(theta)
                    - delta * d * cos((R / r + delta) * theta)
                    + offsetX;
                y2 = (R + delta * r) * sin(theta)
                    - d * sin((R / r + delta) * theta)
                    + offsetY;
                ctx.lineTo(x2, y2);
                i++;
            } while (i <= (r * num) / (R + delta * r) * 360);
        };
        return Trochoid;
    }(Path));
    Trochoid.prototype.type = 'trochoid';

    var Pattern = (function () {
        function Pattern(image, repeat) {
            this.image = image;
            this.repeat = repeat;
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.scaleX = 1;
            this.scaleY = 1;
        }
        return Pattern;
    }());

    var extent = [0, 0];
    var extent2 = [0, 0];
    var minTv = new Point();
    var maxTv = new Point();
    var OrientedBoundingRect = (function () {
        function OrientedBoundingRect(rect, transform) {
            this._corners = [];
            this._axes = [];
            this._origin = [0, 0];
            for (var i = 0; i < 4; i++) {
                this._corners[i] = new Point();
            }
            for (var i = 0; i < 2; i++) {
                this._axes[i] = new Point();
            }
            if (rect) {
                this.fromBoundingRect(rect, transform);
            }
        }
        OrientedBoundingRect.prototype.fromBoundingRect = function (rect, transform) {
            var corners = this._corners;
            var axes = this._axes;
            var x = rect.x;
            var y = rect.y;
            var x2 = x + rect.width;
            var y2 = y + rect.height;
            corners[0].set(x, y);
            corners[1].set(x2, y);
            corners[2].set(x2, y2);
            corners[3].set(x, y2);
            if (transform) {
                for (var i = 0; i < 4; i++) {
                    corners[i].transform(transform);
                }
            }
            Point.sub(axes[0], corners[1], corners[0]);
            Point.sub(axes[1], corners[3], corners[0]);
            axes[0].normalize();
            axes[1].normalize();
            for (var i = 0; i < 2; i++) {
                this._origin[i] = axes[i].dot(corners[0]);
            }
        };
        OrientedBoundingRect.prototype.intersect = function (other, mtv) {
            var overlapped = true;
            var noMtv = !mtv;
            minTv.set(Infinity, Infinity);
            maxTv.set(0, 0);
            if (!this._intersectCheckOneSide(this, other, minTv, maxTv, noMtv, 1)) {
                overlapped = false;
                if (noMtv) {
                    return overlapped;
                }
            }
            if (!this._intersectCheckOneSide(other, this, minTv, maxTv, noMtv, -1)) {
                overlapped = false;
                if (noMtv) {
                    return overlapped;
                }
            }
            if (!noMtv) {
                Point.copy(mtv, overlapped ? minTv : maxTv);
            }
            return overlapped;
        };
        OrientedBoundingRect.prototype._intersectCheckOneSide = function (self, other, minTv, maxTv, noMtv, inverse) {
            var overlapped = true;
            for (var i = 0; i < 2; i++) {
                var axis = this._axes[i];
                this._getProjMinMaxOnAxis(i, self._corners, extent);
                this._getProjMinMaxOnAxis(i, other._corners, extent2);
                if (extent[1] < extent2[0] || extent[0] > extent2[1]) {
                    overlapped = false;
                    if (noMtv) {
                        return overlapped;
                    }
                    var dist0 = Math.abs(extent2[0] - extent[1]);
                    var dist1 = Math.abs(extent[0] - extent2[1]);
                    if (Math.min(dist0, dist1) > maxTv.len()) {
                        if (dist0 < dist1) {
                            Point.scale(maxTv, axis, -dist0 * inverse);
                        }
                        else {
                            Point.scale(maxTv, axis, dist1 * inverse);
                        }
                    }
                }
                else if (minTv) {
                    var dist0 = Math.abs(extent2[0] - extent[1]);
                    var dist1 = Math.abs(extent[0] - extent2[1]);
                    if (Math.min(dist0, dist1) < minTv.len()) {
                        if (dist0 < dist1) {
                            Point.scale(minTv, axis, dist0 * inverse);
                        }
                        else {
                            Point.scale(minTv, axis, -dist1 * inverse);
                        }
                    }
                }
            }
            return overlapped;
        };
        OrientedBoundingRect.prototype._getProjMinMaxOnAxis = function (dim, corners, out) {
            var axis = this._axes[dim];
            var origin = this._origin;
            var proj = corners[0].dot(axis) + origin[dim];
            var min = proj;
            var max = proj;
            for (var i = 1; i < corners.length; i++) {
                var proj_1 = corners[i].dot(axis) + origin[dim];
                min = Math.min(proj_1, min);
                max = Math.max(proj_1, max);
            }
            out[0] = min;
            out[1] = max;
        };
        return OrientedBoundingRect;
    }());

    var DebugRect = (function () {
        function DebugRect(style) {
            var dom = this.dom = document.createElement('div');
            dom.className = 'ec-debug-dirty-rect';
            style = extend({}, style);
            extend(style, {
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                border: '1px solid #00f'
            });
            dom.style.cssText = "\nposition: absolute;\nopacity: 0;\ntransition: opacity 0.5s linear;\npointer-events: none;\n";
            for (var key in style) {
                if (style.hasOwnProperty(key)) {
                    dom.style[key] = style[key];
                }
            }
        }
        DebugRect.prototype.update = function (rect) {
            var domStyle = this.dom.style;
            domStyle.width = rect.width + 'px';
            domStyle.height = rect.height + 'px';
            domStyle.left = rect.x + 'px';
            domStyle.top = rect.y + 'px';
        };
        DebugRect.prototype.hide = function () {
            this.dom.style.opacity = '0';
        };
        DebugRect.prototype.show = function (autoHideDelay) {
            var _this = this;
            clearTimeout(this._hideTimeout);
            this.dom.style.opacity = '1';
            this._hideTimeout = setTimeout(function () {
                _this.hide();
            }, autoHideDelay || 1000);
        };
        return DebugRect;
    }());
    function showDebugDirtyRect(zr, opts) {
        opts = opts || {};
        var painter = zr.painter;
        if (!painter.getLayers) {
            throw new Error('Debug dirty rect can only been used on canvas renderer.');
        }
        if (painter.isSingleCanvas()) {
            throw new Error('Debug dirty rect can only been used on zrender inited with container.');
        }
        var debugViewRoot = document.createElement('div');
        debugViewRoot.style.cssText = "\nposition:absolute;\nleft:0;\ntop:0;\nright:0;\nbottom:0;\npointer-events:none;\n";
        debugViewRoot.className = 'ec-debug-dirty-rect-container';
        var debugRects = [];
        var dom = zr.dom;
        dom.appendChild(debugViewRoot);
        var computedStyle = getComputedStyle(dom);
        if (computedStyle.position === 'static') {
            dom.style.position = 'relative';
        }
        zr.on('rendered', function () {
            if (painter.getLayers) {
                var idx_1 = 0;
                painter.eachBuiltinLayer(function (layer) {
                    if (!layer.debugGetPaintRects) {
                        return;
                    }
                    var paintRects = layer.debugGetPaintRects();
                    for (var i = 0; i < paintRects.length; i++) {
                        if (!paintRects[i].width || !paintRects[i].height) {
                            continue;
                        }
                        if (!debugRects[idx_1]) {
                            debugRects[idx_1] = new DebugRect(opts.style);
                            debugViewRoot.appendChild(debugRects[idx_1].dom);
                        }
                        debugRects[idx_1].show(opts.autoHideDelay);
                        debugRects[idx_1].update(paintRects[i]);
                        idx_1++;
                    }
                });
                for (var i = idx_1; i < debugRects.length; i++) {
                    debugRects[i].hide();
                }
            }
        });
    }

    registerPainter('canvas', CanvasPainter);
    registerPainter('svg', SVGPainter);

    var index = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init,
        dispose: dispose,
        disposeAll: disposeAll,
        getInstance: getInstance,
        registerPainter: registerPainter,
        version: version,
        Point: Point,
        Element: Element,
        Group: Group,
        Path: Path,
        Image: ZRImage,
        CompoundPath: CompoundPath,
        TSpan: TSpan,
        IncrementalDisplayable: IncrementalDisplayable,
        Text: ZRText,
        Arc: Arc,
        ArcShape: ArcShape,
        BezierCurve: BezierCurve,
        BezierCurveShape: BezierCurveShape,
        Circle: Circle,
        CircleShape: CircleShape,
        Droplet: Droplet,
        DropletShape: DropletShape,
        Ellipse: Ellipse,
        EllipseShape: EllipseShape,
        Heart: Heart,
        HeartShape: HeartShape,
        Isogon: Isogon,
        IsogonShape: IsogonShape,
        Line: Line,
        LineShape: LineShape,
        Polygon: Polygon,
        PolygonShape: PolygonShape,
        Polyline: Polyline,
        PolylineShape: PolylineShape,
        Rect: Rect,
        RectShape: RectShape,
        Ring: Ring,
        RingShape: RingShape,
        Rose: Rose,
        RoseShape: RoseShape,
        Sector: Sector,
        SectorShape: SectorShape,
        Star: Star,
        StarShape: StarShape,
        Trochoid: Trochoid,
        TrochoidShape: TrochoidShape,
        LinearGradient: LinearGradient,
        RadialGradient: RadialGradient,
        Pattern: Pattern,
        BoundingRect: BoundingRect,
        OrientedBoundingRect: OrientedBoundingRect,
        showDebugDirtyRect: showDebugDirtyRect,
        matrix: matrix,
        vector: vector,
        color: color,
        path: path,
        util: util,
        parseSVG: parseSVG,
        morphPath: morphPath
    });

    /**
     *  创建直线
     * @param options
     * @returns
     */

    function createLine(options) {
      var _a = options || {},
          _a$x = _a.x1,
          x1 = _a$x === void 0 ? 0 : _a$x,
          _a$y = _a.y1,
          y1 = _a$y === void 0 ? 0 : _a$y,
          _a$x2 = _a.x2,
          x2 = _a$x2 === void 0 ? 0 : _a$x2,
          _a$y2 = _a.y2,
          y2 = _a$y2 === void 0 ? 0 : _a$y2,
          _a$zlevel = _a.zlevel,
          zlevel = _a$zlevel === void 0 ? 0 : _a$zlevel,
          _a$percent = _a.percent,
          percent = _a$percent === void 0 ? 1 : _a$percent,
          rest = __rest(_a, ["x1", "y1", "x2", "y2", "zlevel", "percent"]);

      var shape = new Line({
        zlevel: zlevel,
        shape: {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          percent: percent
        },
        style: Object.assign({
          lineWidth: 1,
          lineCap: 'square',
          stroke: '#0f0'
        }, rest)
      });
      return shape;
    }

    /**
     *  创建矩形
     * @param options
     * @returns
     */

    function createRect(options) {
      var _a = options || {},
          _a$x = _a.x,
          x = _a$x === void 0 ? 0 : _a$x,
          _a$y = _a.y,
          y = _a$y === void 0 ? 0 : _a$y,
          _a$width = _a.width,
          width = _a$width === void 0 ? 0 : _a$width,
          _a$height = _a.height,
          height = _a$height === void 0 ? 0 : _a$height,
          _a$zlevel = _a.zlevel,
          zlevel = _a$zlevel === void 0 ? 0 : _a$zlevel,
          rest = __rest(_a, ["x", "y", "width", "height", "zlevel"]);

      var shape = new Rect({
        zlevel: zlevel,
        shape: {
          x: x,
          y: y,
          width: width,
          height: height
        },
        style: Object.assign({
          fill: 'none',
          stroke: '#fff'
        }, rest)
      });
      return shape;
    }

    /**
     *  创建圆
     * @param options
     * @returns
     */

    function createCircle(options) {
      var _a = options || {},
          _a$r = _a.r,
          r = _a$r === void 0 ? 0 : _a$r,
          _a$cx = _a.cx,
          cx = _a$cx === void 0 ? 0 : _a$cx,
          _a$cy = _a.cy,
          cy = _a$cy === void 0 ? 0 : _a$cy,
          _a$zlevel = _a.zlevel,
          zlevel = _a$zlevel === void 0 ? 0 : _a$zlevel,
          rest = __rest(_a, ["r", "cx", "cy", "zlevel"]);

      var shape = new Circle({
        zlevel: zlevel,
        shape: {
          cx: cx,
          cy: cy,
          r: r
        },
        style: Object.assign({
          fill: 'none',
          stroke: '#00f'
        }, rest)
      });
      return shape;
    }

    /**
     *  创建圆弧
     * @param options
     * @returns
     */

    function createArc(options) {
      var _a = options || {},
          _a$r = _a.r,
          r = _a$r === void 0 ? 0 : _a$r,
          _a$cx = _a.cx,
          cx = _a$cx === void 0 ? 0 : _a$cx,
          _a$cy = _a.cy,
          cy = _a$cy === void 0 ? 0 : _a$cy,
          _a$startAngle = _a.startAngle,
          startAngle = _a$startAngle === void 0 ? 0 : _a$startAngle,
          _a$endAngle = _a.endAngle,
          endAngle = _a$endAngle === void 0 ? 360 : _a$endAngle,
          _a$zlevel = _a.zlevel,
          zlevel = _a$zlevel === void 0 ? 0 : _a$zlevel,
          _a$clockwise = _a.clockwise,
          clockwise = _a$clockwise === void 0 ? true : _a$clockwise,
          rest = __rest(_a, ["r", "cx", "cy", "startAngle", "endAngle", "zlevel", "clockwise"]);

      var shape = new Arc({
        zlevel: zlevel,
        shape: {
          cx: cx,
          cy: cy,
          r: r,
          startAngle: Math.PI / 180 * startAngle,
          endAngle: Math.PI / 180 * endAngle,
          // 顺时针方向。
          clockwise: clockwise
        },
        style: Object.assign({
          fill: 'none',
          stroke: 'rgba(0,0,255,0.5)'
        }, rest)
      });
      return shape;
    }

    /**
     *  创建复合路径
     * @param options
     * @returns
     */

    function createCompoundPath(options) {
      var _a = options || {},
          _a$paths = _a.paths,
          paths = _a$paths === void 0 ? [] : _a$paths,
          _a$zlevel = _a.zlevel,
          zlevel = _a$zlevel === void 0 ? 0 : _a$zlevel,
          _a$isClose = _a.isClose,
          isClose = _a$isClose === void 0 ? true : _a$isClose,
          rest = __rest(_a, ["paths", "zlevel", "isClose"]);

      var PathShape = isClose ? Polygon : Polyline;
      var shape = new CompoundPath({
        zlevel: zlevel,
        shape: {
          paths: [new PathShape({
            shape: {
              points: paths
            }
          })]
        },
        style: Object.assign({
          fill: 'none',
          stroke: '#fff'
        }, rest)
      });
      return shape;
    }

    /**
     *  创建闭合多边型
     * @param options
     * @returns
     */

    function createPolygon(options) {
      var _ref = options || {},
          _ref$points = _ref.points,
          points = _ref$points === void 0 ? [] : _ref$points,
          _ref$zlevel = _ref.zlevel,
          zlevel = _ref$zlevel === void 0 ? 0 : _ref$zlevel;

      var shape = new Polygon({
        zlevel: zlevel,
        shape: {
          points: points
        },
        style: Object.assign({
          fill: 'none',
          stroke: '#0f0'
        }, options)
      });
      return shape;
    }

    /**
     *  创建不闭合多边型
     * @param options
     * @returns
     */

    function createPolyline(options) {
      var _ref = options || {},
          _ref$points = _ref.points,
          points = _ref$points === void 0 ? [] : _ref$points,
          _ref$zlevel = _ref.zlevel,
          zlevel = _ref$zlevel === void 0 ? 0 : _ref$zlevel;

      var shape = new Polyline({
        zlevel: zlevel,
        shape: {
          points: points
        },
        style: Object.assign({
          fill: 'none',
          stroke: '#0f0'
        }, options)
      });
      return shape;
    }

    /**
     *  创建文字
     * @param options
     * @returns
     */

    function createText(options) {
      var _a = options || {},
          text = _a.text,
          _a$x = _a.x,
          x = _a$x === void 0 ? 0 : _a$x,
          _a$y = _a.y,
          y = _a$y === void 0 ? 0 : _a$y,
          _a$zlevel = _a.zlevel,
          zlevel = _a$zlevel === void 0 ? 0 : _a$zlevel,
          rest = __rest(_a, ["text", "x", "y", "zlevel"]);

      var shape = new ZRText({
        zlevel: zlevel,
        style: Object.assign({
          x: x,
          y: y,
          text: text,
          fill: '#fff',
          stroke: 'none',
          fontSize: 16,
          fontWeight: 400
        }, rest)
      });
      return shape;
    }

    /**
     *  创建贝塞尔曲线
     * @param options
     * @returns
     */

    function createBezierCurve(options) {
      var _a = options || {},
          x1 = _a.x1,
          y1 = _a.y1,
          x2 = _a.x2,
          y2 = _a.y2,
          cpx1 = _a.cpx1,
          cpy1 = _a.cpy1,
          cpx2 = _a.cpx2,
          cpy2 = _a.cpy2,
          _a$percent = _a.percent,
          percent = _a$percent === void 0 ? 1 : _a$percent,
          _a$zlevel = _a.zlevel,
          zlevel = _a$zlevel === void 0 ? 0 : _a$zlevel,
          rest = __rest(_a, ["x1", "y1", "x2", "y2", "cpx1", "cpy1", "cpx2", "cpy2", "percent", "zlevel"]);

      var shape = new BezierCurve({
        zlevel: zlevel,
        shape: {
          // 必选参数
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          cpx1: cpx1,
          cpy1: cpy1,
          // 下面参数可选
          cpx2: cpx2,
          cpy2: cpy2,
          percent: percent
        },
        style: Object.assign({
          fill: 'none',
          stroke: '#0f0'
        }, rest)
      });
      return shape;
    }

    /**
     *  创建圆
     * @param options
     * @returns
     */

    function createSector(options) {
      var _a = options || {},
          _a$r = _a.r,
          r = _a$r === void 0 ? 0 : _a$r,
          _a$cx = _a.cx,
          cx = _a$cx === void 0 ? 0 : _a$cx,
          _a$cy = _a.cy,
          cy = _a$cy === void 0 ? 0 : _a$cy,
          _a$r2 = _a.r0,
          r0 = _a$r2 === void 0 ? 0 : _a$r2,
          _a$startAngle = _a.startAngle,
          startAngle = _a$startAngle === void 0 ? 0 : _a$startAngle,
          _a$endAngle = _a.endAngle,
          endAngle = _a$endAngle === void 0 ? 0 : _a$endAngle,
          _a$zlevel = _a.zlevel,
          zlevel = _a$zlevel === void 0 ? 0 : _a$zlevel,
          _a$clockwise = _a.clockwise,
          clockwise = _a$clockwise === void 0 ? true : _a$clockwise,
          rest = __rest(_a, ["r", "cx", "cy", "r0", "startAngle", "endAngle", "zlevel", "clockwise"]);

      var shape = new Sector({
        zlevel: zlevel,
        shape: {
          cx: cx,
          cy: cy,
          r: r,
          r0: r0,
          startAngle: Math.PI / 180 * startAngle,
          endAngle: Math.PI / 180 * endAngle,
          // 顺时针方向。
          clockwise: clockwise
        },
        style: Object.assign({
          fill: 'none',
          stroke: 'none'
        }, rest)
      });
      return shape;
    }

    /**
     *  创建图片
     * @param options
     * @returns
     */

    function createImage(options) {
      var _a = options || {},
          _a$x = _a.x,
          x = _a$x === void 0 ? 0 : _a$x,
          _a$y = _a.y,
          y = _a$y === void 0 ? 0 : _a$y,
          _a$width = _a.width,
          width = _a$width === void 0 ? 0 : _a$width,
          _a$height = _a.height,
          height = _a$height === void 0 ? 0 : _a$height,
          _a$zlevel = _a.zlevel,
          zlevel = _a$zlevel === void 0 ? 0 : _a$zlevel,
          _a$image = _a.image,
          image = _a$image === void 0 ? '' : _a$image,
          rest = __rest(_a, ["x", "y", "width", "height", "zlevel", "image"]);

      var shape = new ZRImage({
        zlevel: zlevel,
        style: Object.assign({
          x: x,
          y: y,
          width: width,
          height: height,
          image: image,
          fill: 'none',
          stroke: 'none'
        }, rest)
      });
      return shape;
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }

    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;

      var _s, _e;

      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    var _listCacheClear = listCacheClear;

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    var eq_1 = eq;

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq_1(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    var _assocIndexOf = assocIndexOf;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype;

    /** Built-in value references. */
    var splice = arrayProto.splice;

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    var _listCacheDelete = listCacheDelete;

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    var _listCacheGet = listCacheGet;

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return _assocIndexOf(this.__data__, key) > -1;
    }

    var _listCacheHas = listCacheHas;

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    var _listCacheSet = listCacheSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = _listCacheClear;
    ListCache.prototype['delete'] = _listCacheDelete;
    ListCache.prototype.get = _listCacheGet;
    ListCache.prototype.has = _listCacheHas;
    ListCache.prototype.set = _listCacheSet;

    var _ListCache = ListCache;

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new _ListCache;
      this.size = 0;
    }

    var _stackClear = stackClear;

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    var _stackDelete = stackDelete;

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    var _stackGet = stackGet;

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    var _stackHas = stackHas;

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    var _freeGlobal = freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = _freeGlobal || freeSelf || Function('return this')();

    var _root = root;

    /** Built-in value references. */
    var Symbol$1 = _root.Symbol;

    var _Symbol = Symbol$1;

    /** Used for built-in method references. */
    var objectProto$c = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$c.toString;

    /** Built-in value references. */
    var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty$9.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag$1] = tag;
        } else {
          delete value[symToStringTag$1];
        }
      }
      return result;
    }

    var _getRawTag = getRawTag;

    /** Used for built-in method references. */
    var objectProto$b = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto$b.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    var _objectToString = objectToString;

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? _getRawTag(value)
        : _objectToString(value);
    }

    var _baseGetTag = baseGetTag;

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    var isObject_1 = isObject;

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag$2 = '[object Function]',
        genTag$1 = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject_1(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = _baseGetTag(value);
      return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
    }

    var isFunction_1 = isFunction;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = _root['__core-js_shared__'];

    var _coreJsData = coreJsData;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    var _isMasked = isMasked;

    /** Used for built-in method references. */
    var funcProto$1 = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString$1.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    var _toSource = toSource;

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto = Function.prototype,
        objectProto$a = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty$8).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject_1(value) || _isMasked(value)) {
        return false;
      }
      var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
      return pattern.test(_toSource(value));
    }

    var _baseIsNative = baseIsNative;

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    var _getValue = getValue;

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = _getValue(object, key);
      return _baseIsNative(value) ? value : undefined;
    }

    var _getNative = getNative;

    /* Built-in method references that are verified to be native. */
    var Map = _getNative(_root, 'Map');

    var _Map = Map;

    /* Built-in method references that are verified to be native. */
    var nativeCreate = _getNative(Object, 'create');

    var _nativeCreate = nativeCreate;

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
      this.size = 0;
    }

    var _hashClear = hashClear;

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    var _hashDelete = hashDelete;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

    /** Used for built-in method references. */
    var objectProto$9 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (_nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED$1 ? undefined : result;
      }
      return hasOwnProperty$7.call(data, key) ? data[key] : undefined;
    }

    var _hashGet = hashGet;

    /** Used for built-in method references. */
    var objectProto$8 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$6.call(data, key);
    }

    var _hashHas = hashHas;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    var _hashSet = hashSet;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = _hashClear;
    Hash.prototype['delete'] = _hashDelete;
    Hash.prototype.get = _hashGet;
    Hash.prototype.has = _hashHas;
    Hash.prototype.set = _hashSet;

    var _Hash = Hash;

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new _Hash,
        'map': new (_Map || _ListCache),
        'string': new _Hash
      };
    }

    var _mapCacheClear = mapCacheClear;

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    var _isKeyable = isKeyable;

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return _isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    var _getMapData = getMapData;

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = _getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    var _mapCacheDelete = mapCacheDelete;

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return _getMapData(this, key).get(key);
    }

    var _mapCacheGet = mapCacheGet;

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return _getMapData(this, key).has(key);
    }

    var _mapCacheHas = mapCacheHas;

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = _getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    var _mapCacheSet = mapCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = _mapCacheClear;
    MapCache.prototype['delete'] = _mapCacheDelete;
    MapCache.prototype.get = _mapCacheGet;
    MapCache.prototype.has = _mapCacheHas;
    MapCache.prototype.set = _mapCacheSet;

    var _MapCache = MapCache;

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof _ListCache) {
        var pairs = data.__data__;
        if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new _MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    var _stackSet = stackSet;

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new _ListCache(entries);
      this.size = data.size;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = _stackClear;
    Stack.prototype['delete'] = _stackDelete;
    Stack.prototype.get = _stackGet;
    Stack.prototype.has = _stackHas;
    Stack.prototype.set = _stackSet;

    var _Stack = Stack;

    /**
     * A specialized version of `_.forEach` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    var _arrayEach = arrayEach;

    var defineProperty = (function() {
      try {
        var func = _getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    var _defineProperty = defineProperty;

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && _defineProperty) {
        _defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    var _baseAssignValue = baseAssignValue;

    /** Used for built-in method references. */
    var objectProto$7 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty$5.call(object, key) && eq_1(objValue, value)) ||
          (value === undefined && !(key in object))) {
        _baseAssignValue(object, key, value);
      }
    }

    var _assignValue = assignValue;

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          _baseAssignValue(object, key, newValue);
        } else {
          _assignValue(object, key, newValue);
        }
      }
      return object;
    }

    var _copyObject = copyObject;

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    var _baseTimes = baseTimes;

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    var isObjectLike_1 = isObjectLike;

    /** `Object#toString` result references. */
    var argsTag$2 = '[object Arguments]';

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike_1(value) && _baseGetTag(value) == argsTag$2;
    }

    var _baseIsArguments = baseIsArguments;

    /** Used for built-in method references. */
    var objectProto$6 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

    /** Built-in value references. */
    var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
      return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
        !propertyIsEnumerable$1.call(value, 'callee');
    };

    var isArguments_1 = isArguments;

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    var isArray_1 = isArray;

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    var stubFalse_1 = stubFalse;

    var isBuffer_1 = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? _root.Buffer : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse_1;

    module.exports = isBuffer;
    });

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER$1 = 9007199254740991;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER$1 : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    var _isIndex = isIndex;

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    var isLength_1 = isLength;

    /** `Object#toString` result references. */
    var argsTag$1 = '[object Arguments]',
        arrayTag$1 = '[object Array]',
        boolTag$2 = '[object Boolean]',
        dateTag$2 = '[object Date]',
        errorTag$1 = '[object Error]',
        funcTag$1 = '[object Function]',
        mapTag$4 = '[object Map]',
        numberTag$2 = '[object Number]',
        objectTag$2 = '[object Object]',
        regexpTag$2 = '[object RegExp]',
        setTag$4 = '[object Set]',
        stringTag$2 = '[object String]',
        weakMapTag$2 = '[object WeakMap]';

    var arrayBufferTag$2 = '[object ArrayBuffer]',
        dataViewTag$3 = '[object DataView]',
        float32Tag$2 = '[object Float32Array]',
        float64Tag$2 = '[object Float64Array]',
        int8Tag$2 = '[object Int8Array]',
        int16Tag$2 = '[object Int16Array]',
        int32Tag$2 = '[object Int32Array]',
        uint8Tag$2 = '[object Uint8Array]',
        uint8ClampedTag$2 = '[object Uint8ClampedArray]',
        uint16Tag$2 = '[object Uint16Array]',
        uint32Tag$2 = '[object Uint32Array]';

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] =
    typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] =
    typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] =
    typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] =
    typedArrayTags[uint32Tag$2] = true;
    typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] =
    typedArrayTags[arrayBufferTag$2] = typedArrayTags[boolTag$2] =
    typedArrayTags[dataViewTag$3] = typedArrayTags[dateTag$2] =
    typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
    typedArrayTags[mapTag$4] = typedArrayTags[numberTag$2] =
    typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$2] =
    typedArrayTags[setTag$4] = typedArrayTags[stringTag$2] =
    typedArrayTags[weakMapTag$2] = false;

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike_1(value) &&
        isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
    }

    var _baseIsTypedArray = baseIsTypedArray;

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }

    var _baseUnary = baseUnary;

    var _nodeUtil = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && _freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        }

        // Legacy `process.binding('util')` for Node.js < 10.
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }());

    module.exports = nodeUtil;
    });

    /* Node.js helper references. */
    var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

    var isTypedArray_1 = isTypedArray;

    /** Used for built-in method references. */
    var objectProto$5 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray_1(value),
          isArg = !isArr && isArguments_1(value),
          isBuff = !isArr && !isArg && isBuffer_1(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? _baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty$3.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               _isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    var _arrayLikeKeys = arrayLikeKeys;

    /** Used for built-in method references. */
    var objectProto$4 = Object.prototype;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;

      return value === proto;
    }

    var _isPrototype = isPrototype;

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    var _overArg = overArg;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeKeys = _overArg(Object.keys, Object);

    var _nativeKeys = nativeKeys;

    /** Used for built-in method references. */
    var objectProto$3 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!_isPrototype(object)) {
        return _nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty$2.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    var _baseKeys = baseKeys;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength_1(value.length) && !isFunction_1(value);
    }

    var isArrayLike_1 = isArrayLike;

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
    }

    var keys_1 = keys;

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && _copyObject(source, keys_1(source), object);
    }

    var _baseAssign = baseAssign;

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    var _nativeKeysIn = nativeKeysIn;

    /** Used for built-in method references. */
    var objectProto$2 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      if (!isObject_1(object)) {
        return _nativeKeysIn(object);
      }
      var isProto = _isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty$1.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    var _baseKeysIn = baseKeysIn;

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
    }

    var keysIn_1 = keysIn;

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn(object, source) {
      return object && _copyObject(source, keysIn_1(source), object);
    }

    var _baseAssignIn = baseAssignIn;

    var _cloneBuffer = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? _root.Buffer : undefined,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    module.exports = cloneBuffer;
    });

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    var _copyArray = copyArray;

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    var _arrayFilter = arrayFilter;

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    var stubArray_1 = stubArray;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Built-in value references. */
    var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return _arrayFilter(nativeGetSymbols$1(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    var _getSymbols = getSymbols;

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return _copyObject(source, _getSymbols(source), object);
    }

    var _copySymbols = copySymbols;

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    var _arrayPush = arrayPush;

    /** Built-in value references. */
    var getPrototype = _overArg(Object.getPrototypeOf, Object);

    var _getPrototype = getPrototype;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !nativeGetSymbols ? stubArray_1 : function(object) {
      var result = [];
      while (object) {
        _arrayPush(result, _getSymbols(object));
        object = _getPrototype(object);
      }
      return result;
    };

    var _getSymbolsIn = getSymbolsIn;

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn(source, object) {
      return _copyObject(source, _getSymbolsIn(source), object);
    }

    var _copySymbolsIn = copySymbolsIn;

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
    }

    var _baseGetAllKeys = baseGetAllKeys;

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return _baseGetAllKeys(object, keys_1, _getSymbols);
    }

    var _getAllKeys = getAllKeys;

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
    }

    var _getAllKeysIn = getAllKeysIn;

    /* Built-in method references that are verified to be native. */
    var DataView = _getNative(_root, 'DataView');

    var _DataView = DataView;

    /* Built-in method references that are verified to be native. */
    var Promise$1 = _getNative(_root, 'Promise');

    var _Promise = Promise$1;

    /* Built-in method references that are verified to be native. */
    var Set = _getNative(_root, 'Set');

    var _Set = Set;

    /* Built-in method references that are verified to be native. */
    var WeakMap = _getNative(_root, 'WeakMap');

    var _WeakMap = WeakMap;

    /** `Object#toString` result references. */
    var mapTag$3 = '[object Map]',
        objectTag$1 = '[object Object]',
        promiseTag = '[object Promise]',
        setTag$3 = '[object Set]',
        weakMapTag$1 = '[object WeakMap]';

    var dataViewTag$2 = '[object DataView]';

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = _toSource(_DataView),
        mapCtorString = _toSource(_Map),
        promiseCtorString = _toSource(_Promise),
        setCtorString = _toSource(_Set),
        weakMapCtorString = _toSource(_WeakMap);

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = _baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
        (_Map && getTag(new _Map) != mapTag$3) ||
        (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
        (_Set && getTag(new _Set) != setTag$3) ||
        (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
      getTag = function(value) {
        var result = _baseGetTag(value),
            Ctor = result == objectTag$1 ? value.constructor : undefined,
            ctorString = Ctor ? _toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag$2;
            case mapCtorString: return mapTag$3;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag$3;
            case weakMapCtorString: return weakMapTag$1;
          }
        }
        return result;
      };
    }

    var _getTag = getTag;

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    var _initCloneArray = initCloneArray;

    /** Built-in value references. */
    var Uint8Array = _root.Uint8Array;

    var _Uint8Array = Uint8Array;

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
      return result;
    }

    var _cloneArrayBuffer = cloneArrayBuffer;

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    var _cloneDataView = cloneDataView;

    /** Used to match `RegExp` flags from their coerced string values. */
    var reFlags = /\w*$/;

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    var _cloneRegExp = cloneRegExp;

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = _Symbol ? _Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    var _cloneSymbol = cloneSymbol;

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    var _cloneTypedArray = cloneTypedArray;

    /** `Object#toString` result references. */
    var boolTag$1 = '[object Boolean]',
        dateTag$1 = '[object Date]',
        mapTag$2 = '[object Map]',
        numberTag$1 = '[object Number]',
        regexpTag$1 = '[object RegExp]',
        setTag$2 = '[object Set]',
        stringTag$1 = '[object String]',
        symbolTag$1 = '[object Symbol]';

    var arrayBufferTag$1 = '[object ArrayBuffer]',
        dataViewTag$1 = '[object DataView]',
        float32Tag$1 = '[object Float32Array]',
        float64Tag$1 = '[object Float64Array]',
        int8Tag$1 = '[object Int8Array]',
        int16Tag$1 = '[object Int16Array]',
        int32Tag$1 = '[object Int32Array]',
        uint8Tag$1 = '[object Uint8Array]',
        uint8ClampedTag$1 = '[object Uint8ClampedArray]',
        uint16Tag$1 = '[object Uint16Array]',
        uint32Tag$1 = '[object Uint32Array]';

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag$1:
          return _cloneArrayBuffer(object);

        case boolTag$1:
        case dateTag$1:
          return new Ctor(+object);

        case dataViewTag$1:
          return _cloneDataView(object, isDeep);

        case float32Tag$1: case float64Tag$1:
        case int8Tag$1: case int16Tag$1: case int32Tag$1:
        case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
          return _cloneTypedArray(object, isDeep);

        case mapTag$2:
          return new Ctor;

        case numberTag$1:
        case stringTag$1:
          return new Ctor(object);

        case regexpTag$1:
          return _cloneRegExp(object);

        case setTag$2:
          return new Ctor;

        case symbolTag$1:
          return _cloneSymbol(object);
      }
    }

    var _initCloneByTag = initCloneByTag;

    /** Built-in value references. */
    var objectCreate = Object.create;

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject_1(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    var _baseCreate = baseCreate;

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !_isPrototype(object))
        ? _baseCreate(_getPrototype(object))
        : {};
    }

    var _initCloneObject = initCloneObject;

    /** `Object#toString` result references. */
    var mapTag$1 = '[object Map]';

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap(value) {
      return isObjectLike_1(value) && _getTag(value) == mapTag$1;
    }

    var _baseIsMap = baseIsMap;

    /* Node.js helper references. */
    var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

    var isMap_1 = isMap;

    /** `Object#toString` result references. */
    var setTag$1 = '[object Set]';

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet(value) {
      return isObjectLike_1(value) && _getTag(value) == setTag$1;
    }

    var _baseIsSet = baseIsSet;

    /* Node.js helper references. */
    var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

    var isSet_1 = isSet;

    /** Used to compose bitmasks for cloning. */
    var CLONE_DEEP_FLAG$1 = 1,
        CLONE_FLAT_FLAG = 2,
        CLONE_SYMBOLS_FLAG$1 = 4;

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        objectTag = '[object Object]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]',
        weakMapTag = '[object WeakMap]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /** Used to identify `toStringTag` values supported by `_.clone`. */
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] =
    cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
    cloneableTags[boolTag] = cloneableTags[dateTag] =
    cloneableTags[float32Tag] = cloneableTags[float64Tag] =
    cloneableTags[int8Tag] = cloneableTags[int16Tag] =
    cloneableTags[int32Tag] = cloneableTags[mapTag] =
    cloneableTags[numberTag] = cloneableTags[objectTag] =
    cloneableTags[regexpTag] = cloneableTags[setTag] =
    cloneableTags[stringTag] = cloneableTags[symbolTag] =
    cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
    cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] =
    cloneableTags[weakMapTag] = false;

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG$1,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG$1;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject_1(value)) {
        return value;
      }
      var isArr = isArray_1(value);
      if (isArr) {
        result = _initCloneArray(value);
        if (!isDeep) {
          return _copyArray(value, result);
        }
      } else {
        var tag = _getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer_1(value)) {
          return _cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : _initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? _copySymbolsIn(value, _baseAssignIn(result, value))
              : _copySymbols(value, _baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = _initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new _Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (isSet_1(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap_1(value)) {
        value.forEach(function(subValue, key) {
          result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });
      }

      var keysFunc = isFull
        ? (isFlat ? _getAllKeysIn : _getAllKeys)
        : (isFlat ? keysIn_1 : keys_1);

      var props = isArr ? undefined : keysFunc(value);
      _arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    var _baseClone = baseClone;

    /** Used to compose bitmasks for cloning. */
    var CLONE_DEEP_FLAG = 1,
        CLONE_SYMBOLS_FLAG = 4;

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return _baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }

    var cloneDeep_1 = cloneDeep;

    /**
     * 缩放ZRender Group
     * @param  zr  ZRender 实例
     * @param  group  Group 实例
     * @param options  `{scaleMin:number, scaleMax:number}`  scaleMin：缩放最小值 scaleMax：缩放最大值
     * @default options = {scaleMin:0.5,scaleMax:100}
     */

    function scaleGroup(zr, group, options) {
      var _ref = options || {},
          _ref$scaleMin = _ref.scaleMin,
          scaleMin = _ref$scaleMin === void 0 ? 0.5 : _ref$scaleMin,
          _ref$scaleMax = _ref.scaleMax,
          scaleMax = _ref$scaleMax === void 0 ? 100 : _ref$scaleMax;

      zr.on('mousewheel', function (e) {
        e.event.preventDefault();
        var scaleX = group.scaleX,
            scaleY = group.scaleY;
        var k = 1 + e.wheelDelta / 5;

        if (k < scaleMin || k > scaleMax) {
          return;
        }

        var _group$x = group.x,
            x = _group$x === void 0 ? 0 : _group$x,
            y = group.y;
        group.animateTo({
          scaleX: scaleX * k,
          scaleY: scaleY * k,
          x: e.offsetX - (e.offsetX - x) * k,
          y: e.offsetY - (e.offsetY - y) * k
        }, {
          duration: 100,
          delay: 0,
          done: function done() {
            (options === null || options === void 0 ? void 0 : options.callback) && options.callback({
              scale: group.scaleX,
              x: group.x,
              y: group.y
            });
          }
        });
      });
    }
    /**
     * 平移ZRender Group
     * @param zr  ZRender 实例
     * @param group  Group 实例
     */

    function translateGroup(zr, group, options) {
      var state = {
        startX: 0,
        startY: 0,
        isDown: false
      };
      zr.on('mousedown', function (e) {
        var _e$event = e.event,
            startX = _e$event.clientX,
            startY = _e$event.clientY;
        state.startX = startX;
        state.startY = startY;
        state.isDown = true;
      });

      function move(e) {
        var _e$event2 = e.event,
            clientX = _e$event2.clientX,
            clientY = _e$event2.clientY;
        var stepX = clientX - state.startX;
        var stepY = clientY - state.startY;
        var x = group.x + stepX;
        var y = group.y + stepY;
        group.animateTo({
          x: x,
          y: y
        }, {
          duration: 100,
          delay: 0,
          done: function done() {
            (options === null || options === void 0 ? void 0 : options.callback) && options.callback({
              scale: group.scaleX,
              x: group.x,
              y: group.y
            });
          }
        });
      }

      zr.on('mouseup', function (e) {
        move(e);
        state.isDown = true;
      });
    }
    /**
     * 求两点之间的中点坐标
     * @param param0
     * @param param1
     * @returns
     */

    var getMiddle = function getMiddle(_ref2, _ref3) {
      var _ref4 = _slicedToArray(_ref2, 2),
          _ref4$ = _ref4[0],
          x1 = _ref4$ === void 0 ? 0 : _ref4$,
          _ref4$2 = _ref4[1],
          y1 = _ref4$2 === void 0 ? 0 : _ref4$2;

      var _ref5 = _slicedToArray(_ref3, 2),
          _ref5$ = _ref5[0],
          x2 = _ref5$ === void 0 ? 0 : _ref5$,
          _ref5$2 = _ref5[1],
          y2 = _ref5$2 === void 0 ? 0 : _ref5$2;

      var x0 = (x1 + x2) / 2;
      var y0 = (y1 + y2) / 2;
      return [x0, y0];
    };
    /**
     * 复制数组元素几遍
     * @param {array} arr 原数组
     * @param {number} count 复制遍数 默认1
     * @returns
     */

    function copyArrayByCount(arr) {
      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var res = [];

      var countArray = _toConsumableArray(new Array(count));

      countArray.forEach(function () {
        res = [].concat(_toConsumableArray(res), _toConsumableArray(cloneDeep_1(arr)));
      });
      return res;
    }

    /**
     * 注册画布，解决打包后出现 `Renderer 'undefined' is not imported. Please import it first` 的问题
     */

    registerPainter('canvas', CanvasPainter);
    registerPainter('svg', SVGPainter);
    /**
     * 创建容器
     * @param element  HTML元素本身 或者 HTML的id
     * @param options 初始参数
     * @returns zrender 实例
     */

    function createCanvas(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var el = element instanceof HTMLElement ? element : document.getElementById(element);
      var ratio = window.devicePixelRatio;
      var height = window.innerHeight * ratio;
      var width = window.innerWidth * ratio;
      var Canvas = init(el, Object.assign({
        renderer: 'canvas',
        devicePixelRatio: ratio,
        width: width,
        height: height
      }, options));
      return Canvas;
    }
    /**
     * 销毁容器
     * @param zr
     */

    function disposeCanvas(zr) {
      zr && zr.dispose();
    }
    /**
     * 创建Group
     */

    function createGroup(options) {
      var group = new Group(options);
      return group;
    }
    /**
     *  根据数据生成图
     * @param group
     * @param item
     */

    function generateShape(item, _index) {
      // console.log(index)
      var type = item.type,
          x1 = item.x1,
          y1 = item.y1,
          x2 = item.x2,
          y2 = item.y2,
          x = item.x,
          y = item.y,
          cx = item.cx,
          cy = item.cy,
          cpx1 = item.cpx1,
          cpy1 = item.cpy1,
          cpx2 = item.cpx2,
          cpy2 = item.cpy2,
          width = item.width,
          height = item.height,
          r = item.r,
          r0 = item.r0,
          points = item.points,
          startAngle = item.startAngle,
          endAngle = item.endAngle,
          text = item.text,
          data = item.data,
          id = item.id,
          paths = item.paths,
          image = item.image,
          options = __rest(item, ["type", "x1", "y1", "x2", "y2", "x", "y", "cx", "cy", "cpx1", "cpy1", "cpx2", "cpy2", "width", "height", "r", "r0", "points", "startAngle", "endAngle", "text", "data", "id", "paths", "image"]);

      var shape = undefined;

      switch (type) {
        case 'line':
          shape = createLine(Object.assign({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
          }, options));
          break;

        case 'circle':
          shape = createCircle(Object.assign({
            cx: cx,
            cy: cy,
            r: r
          }, options));
          break;

        case 'rect':
          shape = createRect(Object.assign({
            x: x,
            y: y,
            width: width,
            height: height
          }, options));
          break;

        case 'polygon':
          shape = createPolygon(Object.assign({
            points: points
          }, options));
          break;

        case 'polyline':
          shape = createPolygon(Object.assign({
            points: points
          }, options));
          break;

        case 'arc':
          shape = createArc(Object.assign({
            cx: cx,
            cy: cy,
            r: r,
            startAngle: startAngle,
            endAngle: endAngle
          }, options));
          break;

        case 'text':
          shape = createText(Object.assign({
            x: x,
            y: y,
            text: text
          }, options));
          break;

        case 'sector':
          shape = createSector(Object.assign({
            cx: cx,
            cy: cy,
            r: r,
            r0: r0,
            startAngle: startAngle,
            endAngle: endAngle
          }, options));
          break;

        case 'image':
          shape = createImage(Object.assign({
            x: x,
            y: y,
            width: width,
            height: height,
            image: image
          }, options));
          break;

        case 'compoundPath':
          shape = createCompoundPath(Object.assign({
            paths: paths
          }, options));
          break;

        case 'bezierCurve':
          shape = createBezierCurve(Object.assign({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            cpx1: cpx1,
            cpy1: cpy1,
            // 下面参数可选
            cpx2: cpx2,
            cpy2: cpy2
          }, options));
          break;

        case 'group':
          var shapes = data === null || data === void 0 ? void 0 : data.map(function (item) {
            return generateShape(item);
          });
          var group = new Group();

          if (id) {
            group.id = id;
          }

          shapes === null || shapes === void 0 ? void 0 : shapes.forEach(function (item) {
            return group.add(item);
          });
          shape = group;
          break;
      }

      return shape;
    }
    /**
     * 渲染图形到画布
     * @param zr
     * @param group
     * @param data
     * @param options `scale：是否需要缩放 translate：是否需要平移`
     * @default options =  { scale: false, translate: true }
     */

    function renderCanvas(zr, group, data, options) {
      var _a, _b;

      var translate = (_a = options === null || options === void 0 ? void 0 : options.translate) !== null && _a !== void 0 ? _a : true;
      var scale = (_b = options === null || options === void 0 ? void 0 : options.scale) !== null && _b !== void 0 ? _b : false;
      var shapes = data.map(function (item, index) {
        return generateShape(item);
      });
      shapes.forEach(function (item) {
        return item && group.add(item);
      });
      translate && translateGroup(zr, group, {
        callback: options === null || options === void 0 ? void 0 : options.callback
      });
      scale && scaleGroup(zr, group, {
        callback: options === null || options === void 0 ? void 0 : options.callback
      });
      zr.add(group);
    }

    exports.copyArrayByCount = copyArrayByCount;
    exports.createArc = createArc;
    exports.createBezierCurve = createBezierCurve;
    exports.createCanvas = createCanvas;
    exports.createCircle = createCircle;
    exports.createCompoundPath = createCompoundPath;
    exports.createGroup = createGroup;
    exports.createImage = createImage;
    exports.createLine = createLine;
    exports.createPolygon = createPolygon;
    exports.createPolyline = createPolyline;
    exports.createRect = createRect;
    exports.createText = createText;
    exports.disposeCanvas = disposeCanvas;
    exports.generateShape = generateShape;
    exports.getMiddle = getMiddle;
    exports.renderCanvas = renderCanvas;
    exports.scaleGroup = scaleGroup;
    exports.translateGroup = translateGroup;
    exports.zrender = index;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
