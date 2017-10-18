/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var es5 = __webpack_require__(5);
var canEvaluate = typeof navigator == "undefined";

var errorObj = {e: {}};
var tryCatchTarget;
var globalObject = typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window :
    typeof global !== "undefined" ? global :
    this !== undefined ? this : null;

function tryCatcher() {
    try {
        var target = tryCatchTarget;
        tryCatchTarget = null;
        return target.apply(this, arguments);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}

var inherits = function(Child, Parent) {
    var hasProp = {}.hasOwnProperty;

    function T() {
        this.constructor = Child;
        this.constructor$ = Parent;
        for (var propertyName in Parent.prototype) {
            if (hasProp.call(Parent.prototype, propertyName) &&
                propertyName.charAt(propertyName.length-1) !== "$"
           ) {
                this[propertyName + "$"] = Parent.prototype[propertyName];
            }
        }
    }
    T.prototype = Parent.prototype;
    Child.prototype = new T();
    return Child.prototype;
};


function isPrimitive(val) {
    return val == null || val === true || val === false ||
        typeof val === "string" || typeof val === "number";

}

function isObject(value) {
    return typeof value === "function" ||
           typeof value === "object" && value !== null;
}

function maybeWrapAsError(maybeError) {
    if (!isPrimitive(maybeError)) return maybeError;

    return new Error(safeToString(maybeError));
}

function withAppended(target, appendee) {
    var len = target.length;
    var ret = new Array(len + 1);
    var i;
    for (i = 0; i < len; ++i) {
        ret[i] = target[i];
    }
    ret[i] = appendee;
    return ret;
}

function getDataPropertyOrDefault(obj, key, defaultValue) {
    if (es5.isES5) {
        var desc = Object.getOwnPropertyDescriptor(obj, key);

        if (desc != null) {
            return desc.get == null && desc.set == null
                    ? desc.value
                    : defaultValue;
        }
    } else {
        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
    }
}

function notEnumerableProp(obj, name, value) {
    if (isPrimitive(obj)) return obj;
    var descriptor = {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
    };
    es5.defineProperty(obj, name, descriptor);
    return obj;
}

function thrower(r) {
    throw r;
}

var inheritedDataKeys = (function() {
    var excludedPrototypes = [
        Array.prototype,
        Object.prototype,
        Function.prototype
    ];

    var isExcludedProto = function(val) {
        for (var i = 0; i < excludedPrototypes.length; ++i) {
            if (excludedPrototypes[i] === val) {
                return true;
            }
        }
        return false;
    };

    if (es5.isES5) {
        var getKeys = Object.getOwnPropertyNames;
        return function(obj) {
            var ret = [];
            var visitedKeys = Object.create(null);
            while (obj != null && !isExcludedProto(obj)) {
                var keys;
                try {
                    keys = getKeys(obj);
                } catch (e) {
                    return ret;
                }
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    if (visitedKeys[key]) continue;
                    visitedKeys[key] = true;
                    var desc = Object.getOwnPropertyDescriptor(obj, key);
                    if (desc != null && desc.get == null && desc.set == null) {
                        ret.push(key);
                    }
                }
                obj = es5.getPrototypeOf(obj);
            }
            return ret;
        };
    } else {
        var hasProp = {}.hasOwnProperty;
        return function(obj) {
            if (isExcludedProto(obj)) return [];
            var ret = [];

            /*jshint forin:false */
            enumeration: for (var key in obj) {
                if (hasProp.call(obj, key)) {
                    ret.push(key);
                } else {
                    for (var i = 0; i < excludedPrototypes.length; ++i) {
                        if (hasProp.call(excludedPrototypes[i], key)) {
                            continue enumeration;
                        }
                    }
                    ret.push(key);
                }
            }
            return ret;
        };
    }

})();

var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
function isClass(fn) {
    try {
        if (typeof fn === "function") {
            var keys = es5.names(fn.prototype);

            var hasMethods = es5.isES5 && keys.length > 1;
            var hasMethodsOtherThanConstructor = keys.length > 0 &&
                !(keys.length === 1 && keys[0] === "constructor");
            var hasThisAssignmentAndStaticMethods =
                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

            if (hasMethods || hasMethodsOtherThanConstructor ||
                hasThisAssignmentAndStaticMethods) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

function toFastProperties(obj) {
    /*jshint -W027,-W055,-W031*/
    function FakeConstructor() {}
    FakeConstructor.prototype = obj;
    var l = 8;
    while (l--) new FakeConstructor();
    return obj;
    eval(obj);
}

var rident = /^[a-z$_][a-z$_0-9]*$/i;
function isIdentifier(str) {
    return rident.test(str);
}

function filledRange(count, prefix, suffix) {
    var ret = new Array(count);
    for(var i = 0; i < count; ++i) {
        ret[i] = prefix + i + suffix;
    }
    return ret;
}

function safeToString(obj) {
    try {
        return obj + "";
    } catch (e) {
        return "[no string representation]";
    }
}

function isError(obj) {
    return obj !== null &&
           typeof obj === "object" &&
           typeof obj.message === "string" &&
           typeof obj.name === "string";
}

function markAsOriginatingFromRejection(e) {
    try {
        notEnumerableProp(e, "isOperational", true);
    }
    catch(ignore) {}
}

function originatesFromRejection(e) {
    if (e == null) return false;
    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
        e["isOperational"] === true);
}

function canAttachTrace(obj) {
    return isError(obj) && es5.propertyIsWritable(obj, "stack");
}

var ensureErrorObject = (function() {
    if (!("stack" in new Error())) {
        return function(value) {
            if (canAttachTrace(value)) return value;
            try {throw new Error(safeToString(value));}
            catch(err) {return err;}
        };
    } else {
        return function(value) {
            if (canAttachTrace(value)) return value;
            return new Error(safeToString(value));
        };
    }
})();

function classString(obj) {
    return {}.toString.call(obj);
}

function copyDescriptors(from, to, filter) {
    var keys = es5.names(from);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (filter(key)) {
            try {
                es5.defineProperty(to, key, es5.getDescriptor(from, key));
            } catch (ignore) {}
        }
    }
}

var asArray = function(v) {
    if (es5.isArray(v)) {
        return v;
    }
    return null;
};

if (typeof Symbol !== "undefined" && Symbol.iterator) {
    var ArrayFrom = typeof Array.from === "function" ? function(v) {
        return Array.from(v);
    } : function(v) {
        var ret = [];
        var it = v[Symbol.iterator]();
        var itResult;
        while (!((itResult = it.next()).done)) {
            ret.push(itResult.value);
        }
        return ret;
    };

    asArray = function(v) {
        if (es5.isArray(v)) {
            return v;
        } else if (v != null && typeof v[Symbol.iterator] === "function") {
            return ArrayFrom(v);
        }
        return null;
    };
}

var isNode = typeof process !== "undefined" &&
        classString(process).toLowerCase() === "[object process]";

var hasEnvVariables = typeof process !== "undefined" &&
    typeof process.env !== "undefined";

function env(key) {
    return hasEnvVariables ? process.env[key] : undefined;
}

function getNativePromise() {
    if (typeof Promise === "function") {
        try {
            var promise = new Promise(function(){});
            if ({}.toString.call(promise) === "[object Promise]") {
                return Promise;
            }
        } catch (e) {}
    }
}

function domainBind(self, cb) {
    return self.bind(cb);
}

var ret = {
    isClass: isClass,
    isIdentifier: isIdentifier,
    inheritedDataKeys: inheritedDataKeys,
    getDataPropertyOrDefault: getDataPropertyOrDefault,
    thrower: thrower,
    isArray: es5.isArray,
    asArray: asArray,
    notEnumerableProp: notEnumerableProp,
    isPrimitive: isPrimitive,
    isObject: isObject,
    isError: isError,
    canEvaluate: canEvaluate,
    errorObj: errorObj,
    tryCatch: tryCatch,
    inherits: inherits,
    withAppended: withAppended,
    maybeWrapAsError: maybeWrapAsError,
    toFastProperties: toFastProperties,
    filledRange: filledRange,
    toString: safeToString,
    canAttachTrace: canAttachTrace,
    ensureErrorObject: ensureErrorObject,
    originatesFromRejection: originatesFromRejection,
    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
    classString: classString,
    copyDescriptors: copyDescriptors,
    hasDevTools: typeof chrome !== "undefined" && chrome &&
                 typeof chrome.loadTimes === "function",
    isNode: isNode,
    hasEnvVariables: hasEnvVariables,
    env: env,
    global: globalObject,
    getNativePromise: getNativePromise,
    domainBind: domainBind
};
ret.isRecentNode = ret.isNode && (function() {
    var version = process.versions.node.split(".").map(Number);
    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
})();

if (ret.isNode) ret.toFastProperties(process);

try {throw new Error(); } catch (e) {ret.lastLineError = e;}
module.exports = ret;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var es5 = __webpack_require__(5);
var Objectfreeze = es5.freeze;
var util = __webpack_require__(0);
var inherits = util.inherits;
var notEnumerableProp = util.notEnumerableProp;

function subError(nameProperty, defaultMessage) {
    function SubError(message) {
        if (!(this instanceof SubError)) return new SubError(message);
        notEnumerableProp(this, "message",
            typeof message === "string" ? message : defaultMessage);
        notEnumerableProp(this, "name", nameProperty);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            Error.call(this);
        }
    }
    inherits(SubError, Error);
    return SubError;
}

var _TypeError, _RangeError;
var Warning = subError("Warning", "warning");
var CancellationError = subError("CancellationError", "cancellation error");
var TimeoutError = subError("TimeoutError", "timeout error");
var AggregateError = subError("AggregateError", "aggregate error");
try {
    _TypeError = TypeError;
    _RangeError = RangeError;
} catch(e) {
    _TypeError = subError("TypeError", "type error");
    _RangeError = subError("RangeError", "range error");
}

var methods = ("join pop push shift unshift slice filter forEach some " +
    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

for (var i = 0; i < methods.length; ++i) {
    if (typeof Array.prototype[methods[i]] === "function") {
        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
    }
}

es5.defineProperty(AggregateError.prototype, "length", {
    value: 0,
    configurable: false,
    writable: true,
    enumerable: true
});
AggregateError.prototype["isOperational"] = true;
var level = 0;
AggregateError.prototype.toString = function() {
    var indent = Array(level * 4 + 1).join(" ");
    var ret = "\n" + indent + "AggregateError of:" + "\n";
    level++;
    indent = Array(level * 4 + 1).join(" ");
    for (var i = 0; i < this.length; ++i) {
        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
        var lines = str.split("\n");
        for (var j = 0; j < lines.length; ++j) {
            lines[j] = indent + lines[j];
        }
        str = lines.join("\n");
        ret += str + "\n";
    }
    level--;
    return ret;
};

function OperationalError(message) {
    if (!(this instanceof OperationalError))
        return new OperationalError(message);
    notEnumerableProp(this, "name", "OperationalError");
    notEnumerableProp(this, "message", message);
    this.cause = message;
    this["isOperational"] = true;

    if (message instanceof Error) {
        notEnumerableProp(this, "message", message.message);
        notEnumerableProp(this, "stack", message.stack);
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }

}
inherits(OperationalError, Error);

var errorTypes = Error["__BluebirdErrorTypes__"];
if (!errorTypes) {
    errorTypes = Objectfreeze({
        CancellationError: CancellationError,
        TimeoutError: TimeoutError,
        OperationalError: OperationalError,
        RejectionError: OperationalError,
        AggregateError: AggregateError
    });
    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
        value: errorTypes,
        writable: false,
        enumerable: false,
        configurable: false
    });
}

module.exports = {
    Error: Error,
    TypeError: _TypeError,
    RangeError: _RangeError,
    CancellationError: errorTypes.CancellationError,
    OperationalError: errorTypes.OperationalError,
    TimeoutError: errorTypes.TimeoutError,
    AggregateError: errorTypes.AggregateError,
    Warning: Warning
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = __webpack_require__(8);
util.inherits = __webpack_require__(9);
/*</replacement>*/

var Readable = __webpack_require__(39);
var Writable = __webpack_require__(41);

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//
//
//

// Stringifying various things



var defs = __webpack_require__(6);
var format = __webpack_require__(1).format;
var inherits = __webpack_require__(1).inherits;
var HEARTBEAT = __webpack_require__(17).HEARTBEAT;

module.exports.closeMessage = function(close) {
  var code = close.fields.replyCode;
  return format('%d (%s) with message "%s"',
                code, defs.constant_strs[code],
                close.fields.replyText);
}

module.exports.methodName = function(id) {
  return defs.info(id).name;
};

module.exports.inspect = function(frame, showFields) {
  if (frame === HEARTBEAT) {
    return '<Heartbeat>';
  }
  else if (!frame.id) {
    return format('<Content channel:%d size:%d>',
                  frame.channel, frame.size);
  }
  else {
    var info = defs.info(frame.id);
    return format('<%s channel:%d%s>', info.name, frame.channel,
                  (showFields)
                  ? ' ' + JSON.stringify(frame.fields, undefined, 2)
                  : '');
  }
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var isES5 = (function(){
    "use strict";
    return this === undefined;
})();

if (isES5) {
    module.exports = {
        freeze: Object.freeze,
        defineProperty: Object.defineProperty,
        getDescriptor: Object.getOwnPropertyDescriptor,
        keys: Object.keys,
        names: Object.getOwnPropertyNames,
        getPrototypeOf: Object.getPrototypeOf,
        isArray: Array.isArray,
        isES5: isES5,
        propertyIsWritable: function(obj, prop) {
            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
            return !!(!descriptor || descriptor.writable || descriptor.set);
        }
    };
} else {
    var has = {}.hasOwnProperty;
    var str = {}.toString;
    var proto = {}.constructor.prototype;

    var ObjectKeys = function (o) {
        var ret = [];
        for (var key in o) {
            if (has.call(o, key)) {
                ret.push(key);
            }
        }
        return ret;
    };

    var ObjectGetDescriptor = function(o, key) {
        return {value: o[key]};
    };

    var ObjectDefineProperty = function (o, key, desc) {
        o[key] = desc.value;
        return o;
    };

    var ObjectFreeze = function (obj) {
        return obj;
    };

    var ObjectGetPrototypeOf = function (obj) {
        try {
            return Object(obj).constructor.prototype;
        }
        catch (e) {
            return proto;
        }
    };

    var ArrayIsArray = function (obj) {
        try {
            return str.call(obj) === "[object Array]";
        }
        catch(e) {
            return false;
        }
    };

    module.exports = {
        isArray: ArrayIsArray,
        keys: ObjectKeys,
        names: ObjectKeys,
        defineProperty: ObjectDefineProperty,
        getDescriptor: ObjectGetDescriptor,
        freeze: ObjectFreeze,
        getPrototypeOf: ObjectGetPrototypeOf,
        isES5: isES5,
        propertyIsWritable: function() {
            return true;
        }
    };
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @preserve This file is generated by the script
 * ../bin/generate-defs.js, which is not in general included in a
 * distribution, but is available in the source repository e.g. at
 * https://github.com/squaremo/amqp.node/
 */


function decodeConnectionStart(buffer) {
  var val, len, offset = 0, fields = {
    versionMajor: void 0,
    versionMinor: void 0,
    serverProperties: void 0,
    mechanisms: void 0,
    locales: void 0
  };
  val = buffer[offset];
  offset++;
  fields.versionMajor = val;
  val = buffer[offset];
  offset++;
  fields.versionMinor = val;
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = decodeFields(buffer.slice(offset, offset + len));
  offset += len;
  fields.serverProperties = val;
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = buffer.slice(offset, offset + len);
  offset += len;
  fields.mechanisms = val;
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = buffer.slice(offset, offset + len);
  offset += len;
  fields.locales = val;
  return fields;
}

function encodeConnectionStart(channel, fields) {
  var len, offset = 0, val = null, varyingSize = 0, scratchOffset = 0;
  val = fields.serverProperties;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'serverProperties'");
  if ("object" != typeof val) throw new TypeError("Field 'serverProperties' is the wrong type; must be an object");
  len = encodeTable(SCRATCH, val, scratchOffset);
  var serverProperties_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
  scratchOffset += len;
  varyingSize += serverProperties_encoded.length;
  val = fields.mechanisms;
  if (void 0 === val) val = new Buffer("PLAIN"); else if (!Buffer.isBuffer(val)) throw new TypeError("Field 'mechanisms' is the wrong type; must be a Buffer");
  varyingSize += val.length;
  val = fields.locales;
  if (void 0 === val) val = new Buffer("en_US"); else if (!Buffer.isBuffer(val)) throw new TypeError("Field 'locales' is the wrong type; must be a Buffer");
  varyingSize += val.length;
  var buffer = new Buffer(22 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(655370, 7);
  offset = 11;
  val = fields.versionMajor;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'versionMajor' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt8(val, offset);
  offset++;
  val = fields.versionMinor;
  if (void 0 === val) val = 9; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'versionMinor' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt8(val, offset);
  offset++;
  offset += serverProperties_encoded.copy(buffer, offset);
  val = fields.mechanisms;
  void 0 === val && (val = new Buffer("PLAIN"));
  len = val.length;
  buffer.writeUInt32BE(len, offset);
  offset += 4;
  val.copy(buffer, offset);
  offset += len;
  val = fields.locales;
  void 0 === val && (val = new Buffer("en_US"));
  len = val.length;
  buffer.writeUInt32BE(len, offset);
  offset += 4;
  val.copy(buffer, offset);
  offset += len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConnectionStartOk(buffer) {
  var val, len, offset = 0, fields = {
    clientProperties: void 0,
    mechanism: void 0,
    response: void 0,
    locale: void 0
  };
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = decodeFields(buffer.slice(offset, offset + len));
  offset += len;
  fields.clientProperties = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.mechanism = val;
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = buffer.slice(offset, offset + len);
  offset += len;
  fields.response = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.locale = val;
  return fields;
}

function encodeConnectionStartOk(channel, fields) {
  var len, offset = 0, val = null, varyingSize = 0, scratchOffset = 0;
  val = fields.clientProperties;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'clientProperties'");
  if ("object" != typeof val) throw new TypeError("Field 'clientProperties' is the wrong type; must be an object");
  len = encodeTable(SCRATCH, val, scratchOffset);
  var clientProperties_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
  scratchOffset += len;
  varyingSize += clientProperties_encoded.length;
  val = fields.mechanism;
  if (void 0 === val) val = "PLAIN"; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'mechanism' is the wrong type; must be a string (up to 255 chars)");
  var mechanism_len = Buffer.byteLength(val, "utf8");
  varyingSize += mechanism_len;
  val = fields.response;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'response'");
  if (!Buffer.isBuffer(val)) throw new TypeError("Field 'response' is the wrong type; must be a Buffer");
  varyingSize += val.length;
  val = fields.locale;
  if (void 0 === val) val = "en_US"; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'locale' is the wrong type; must be a string (up to 255 chars)");
  var locale_len = Buffer.byteLength(val, "utf8");
  varyingSize += locale_len;
  var buffer = new Buffer(18 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(655371, 7);
  offset = 11;
  offset += clientProperties_encoded.copy(buffer, offset);
  val = fields.mechanism;
  void 0 === val && (val = "PLAIN");
  buffer[offset] = mechanism_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += mechanism_len;
  val = fields.response;
  void 0 === val && (val = new Buffer(void 0));
  len = val.length;
  buffer.writeUInt32BE(len, offset);
  offset += 4;
  val.copy(buffer, offset);
  offset += len;
  val = fields.locale;
  void 0 === val && (val = "en_US");
  buffer[offset] = locale_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += locale_len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConnectionSecure(buffer) {
  var val, len, offset = 0, fields = {
    challenge: void 0
  };
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = buffer.slice(offset, offset + len);
  offset += len;
  fields.challenge = val;
  return fields;
}

function encodeConnectionSecure(channel, fields) {
  var len, offset = 0, val = null, varyingSize = 0;
  val = fields.challenge;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'challenge'");
  if (!Buffer.isBuffer(val)) throw new TypeError("Field 'challenge' is the wrong type; must be a Buffer");
  varyingSize += val.length;
  var buffer = new Buffer(16 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(655380, 7);
  offset = 11;
  val = fields.challenge;
  void 0 === val && (val = new Buffer(void 0));
  len = val.length;
  buffer.writeUInt32BE(len, offset);
  offset += 4;
  val.copy(buffer, offset);
  offset += len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConnectionSecureOk(buffer) {
  var val, len, offset = 0, fields = {
    response: void 0
  };
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = buffer.slice(offset, offset + len);
  offset += len;
  fields.response = val;
  return fields;
}

function encodeConnectionSecureOk(channel, fields) {
  var len, offset = 0, val = null, varyingSize = 0;
  val = fields.response;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'response'");
  if (!Buffer.isBuffer(val)) throw new TypeError("Field 'response' is the wrong type; must be a Buffer");
  varyingSize += val.length;
  var buffer = new Buffer(16 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(655381, 7);
  offset = 11;
  val = fields.response;
  void 0 === val && (val = new Buffer(void 0));
  len = val.length;
  buffer.writeUInt32BE(len, offset);
  offset += 4;
  val.copy(buffer, offset);
  offset += len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConnectionTune(buffer) {
  var val, offset = 0, fields = {
    channelMax: void 0,
    frameMax: void 0,
    heartbeat: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.channelMax = val;
  val = buffer.readUInt32BE(offset);
  offset += 4;
  fields.frameMax = val;
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.heartbeat = val;
  return fields;
}

function encodeConnectionTune(channel, fields) {
  var offset = 0, val = null, varyingSize = 0, buffer = new Buffer(20 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(655390, 7);
  offset = 11;
  val = fields.channelMax;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'channelMax' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.frameMax;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'frameMax' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt32BE(val, offset);
  offset += 4;
  val = fields.heartbeat;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'heartbeat' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConnectionTuneOk(buffer) {
  var val, offset = 0, fields = {
    channelMax: void 0,
    frameMax: void 0,
    heartbeat: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.channelMax = val;
  val = buffer.readUInt32BE(offset);
  offset += 4;
  fields.frameMax = val;
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.heartbeat = val;
  return fields;
}

function encodeConnectionTuneOk(channel, fields) {
  var offset = 0, val = null, varyingSize = 0, buffer = new Buffer(20 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(655391, 7);
  offset = 11;
  val = fields.channelMax;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'channelMax' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.frameMax;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'frameMax' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt32BE(val, offset);
  offset += 4;
  val = fields.heartbeat;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'heartbeat' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConnectionOpen(buffer) {
  var val, len, offset = 0, fields = {
    virtualHost: void 0,
    capabilities: void 0,
    insist: void 0
  };
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.virtualHost = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.capabilities = val;
  val = !!(1 & buffer[offset]);
  fields.insist = val;
  return fields;
}

function encodeConnectionOpen(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0;
  val = fields.virtualHost;
  if (void 0 === val) val = "/"; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'virtualHost' is the wrong type; must be a string (up to 255 chars)");
  var virtualHost_len = Buffer.byteLength(val, "utf8");
  varyingSize += virtualHost_len;
  val = fields.capabilities;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'capabilities' is the wrong type; must be a string (up to 255 chars)");
  var capabilities_len = Buffer.byteLength(val, "utf8");
  varyingSize += capabilities_len;
  var buffer = new Buffer(15 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(655400, 7);
  offset = 11;
  val = fields.virtualHost;
  void 0 === val && (val = "/");
  buffer[offset] = virtualHost_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += virtualHost_len;
  val = fields.capabilities;
  void 0 === val && (val = "");
  buffer[offset] = capabilities_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += capabilities_len;
  val = fields.insist;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConnectionOpenOk(buffer) {
  var val, len, offset = 0, fields = {
    knownHosts: void 0
  };
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.knownHosts = val;
  return fields;
}

function encodeConnectionOpenOk(channel, fields) {
  var offset = 0, val = null, varyingSize = 0;
  val = fields.knownHosts;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'knownHosts' is the wrong type; must be a string (up to 255 chars)");
  var knownHosts_len = Buffer.byteLength(val, "utf8");
  varyingSize += knownHosts_len;
  var buffer = new Buffer(13 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(655401, 7);
  offset = 11;
  val = fields.knownHosts;
  void 0 === val && (val = "");
  buffer[offset] = knownHosts_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += knownHosts_len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConnectionClose(buffer) {
  var val, len, offset = 0, fields = {
    replyCode: void 0,
    replyText: void 0,
    classId: void 0,
    methodId: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.replyCode = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.replyText = val;
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.classId = val;
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.methodId = val;
  return fields;
}

function encodeConnectionClose(channel, fields) {
  var offset = 0, val = null, varyingSize = 0;
  val = fields.replyText;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'replyText' is the wrong type; must be a string (up to 255 chars)");
  var replyText_len = Buffer.byteLength(val, "utf8");
  varyingSize += replyText_len;
  var buffer = new Buffer(19 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(655410, 7);
  offset = 11;
  val = fields.replyCode;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'replyCode'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'replyCode' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.replyText;
  void 0 === val && (val = "");
  buffer[offset] = replyText_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += replyText_len;
  val = fields.classId;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'classId'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'classId' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.methodId;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'methodId'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'methodId' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConnectionCloseOk(buffer) {
  var fields = {};
  return fields;
}

function encodeConnectionCloseOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(655411, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConnectionBlocked(buffer) {
  var val, len, offset = 0, fields = {
    reason: void 0
  };
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.reason = val;
  return fields;
}

function encodeConnectionBlocked(channel, fields) {
  var offset = 0, val = null, varyingSize = 0;
  val = fields.reason;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'reason' is the wrong type; must be a string (up to 255 chars)");
  var reason_len = Buffer.byteLength(val, "utf8");
  varyingSize += reason_len;
  var buffer = new Buffer(13 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(655420, 7);
  offset = 11;
  val = fields.reason;
  void 0 === val && (val = "");
  buffer[offset] = reason_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += reason_len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConnectionUnblocked(buffer) {
  var fields = {};
  return fields;
}

function encodeConnectionUnblocked(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(655421, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeChannelOpen(buffer) {
  var val, len, offset = 0, fields = {
    outOfBand: void 0
  };
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.outOfBand = val;
  return fields;
}

function encodeChannelOpen(channel, fields) {
  var offset = 0, val = null, varyingSize = 0;
  val = fields.outOfBand;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'outOfBand' is the wrong type; must be a string (up to 255 chars)");
  var outOfBand_len = Buffer.byteLength(val, "utf8");
  varyingSize += outOfBand_len;
  var buffer = new Buffer(13 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(1310730, 7);
  offset = 11;
  val = fields.outOfBand;
  void 0 === val && (val = "");
  buffer[offset] = outOfBand_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += outOfBand_len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeChannelOpenOk(buffer) {
  var val, len, offset = 0, fields = {
    channelId: void 0
  };
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = buffer.slice(offset, offset + len);
  offset += len;
  fields.channelId = val;
  return fields;
}

function encodeChannelOpenOk(channel, fields) {
  var len, offset = 0, val = null, varyingSize = 0;
  val = fields.channelId;
  if (void 0 === val) val = new Buffer(""); else if (!Buffer.isBuffer(val)) throw new TypeError("Field 'channelId' is the wrong type; must be a Buffer");
  varyingSize += val.length;
  var buffer = new Buffer(16 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(1310731, 7);
  offset = 11;
  val = fields.channelId;
  void 0 === val && (val = new Buffer(""));
  len = val.length;
  buffer.writeUInt32BE(len, offset);
  offset += 4;
  val.copy(buffer, offset);
  offset += len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeChannelFlow(buffer) {
  var val, offset = 0, fields = {
    active: void 0
  };
  val = !!(1 & buffer[offset]);
  fields.active = val;
  return fields;
}

function encodeChannelFlow(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0, buffer = new Buffer(13 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(1310740, 7);
  offset = 11;
  val = fields.active;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'active'");
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeChannelFlowOk(buffer) {
  var val, offset = 0, fields = {
    active: void 0
  };
  val = !!(1 & buffer[offset]);
  fields.active = val;
  return fields;
}

function encodeChannelFlowOk(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0, buffer = new Buffer(13 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(1310741, 7);
  offset = 11;
  val = fields.active;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'active'");
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeChannelClose(buffer) {
  var val, len, offset = 0, fields = {
    replyCode: void 0,
    replyText: void 0,
    classId: void 0,
    methodId: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.replyCode = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.replyText = val;
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.classId = val;
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.methodId = val;
  return fields;
}

function encodeChannelClose(channel, fields) {
  var offset = 0, val = null, varyingSize = 0;
  val = fields.replyText;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'replyText' is the wrong type; must be a string (up to 255 chars)");
  var replyText_len = Buffer.byteLength(val, "utf8");
  varyingSize += replyText_len;
  var buffer = new Buffer(19 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(1310760, 7);
  offset = 11;
  val = fields.replyCode;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'replyCode'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'replyCode' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.replyText;
  void 0 === val && (val = "");
  buffer[offset] = replyText_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += replyText_len;
  val = fields.classId;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'classId'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'classId' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.methodId;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'methodId'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'methodId' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeChannelCloseOk(buffer) {
  var fields = {};
  return fields;
}

function encodeChannelCloseOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(1310761, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeAccessRequest(buffer) {
  var val, len, offset = 0, fields = {
    realm: void 0,
    exclusive: void 0,
    passive: void 0,
    active: void 0,
    write: void 0,
    read: void 0
  };
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.realm = val;
  val = !!(1 & buffer[offset]);
  fields.exclusive = val;
  val = !!(2 & buffer[offset]);
  fields.passive = val;
  val = !!(4 & buffer[offset]);
  fields.active = val;
  val = !!(8 & buffer[offset]);
  fields.write = val;
  val = !!(16 & buffer[offset]);
  fields.read = val;
  return fields;
}

function encodeAccessRequest(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0;
  val = fields.realm;
  if (void 0 === val) val = "/data"; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'realm' is the wrong type; must be a string (up to 255 chars)");
  var realm_len = Buffer.byteLength(val, "utf8");
  varyingSize += realm_len;
  var buffer = new Buffer(14 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(1966090, 7);
  offset = 11;
  val = fields.realm;
  void 0 === val && (val = "/data");
  buffer[offset] = realm_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += realm_len;
  val = fields.exclusive;
  void 0 === val && (val = !1);
  val && (bits += 1);
  val = fields.passive;
  void 0 === val && (val = !0);
  val && (bits += 2);
  val = fields.active;
  void 0 === val && (val = !0);
  val && (bits += 4);
  val = fields.write;
  void 0 === val && (val = !0);
  val && (bits += 8);
  val = fields.read;
  void 0 === val && (val = !0);
  val && (bits += 16);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeAccessRequestOk(buffer) {
  var val, offset = 0, fields = {
    ticket: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  return fields;
}

function encodeAccessRequestOk(channel, fields) {
  var offset = 0, val = null, varyingSize = 0, buffer = new Buffer(14 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(1966091, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 1; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeExchangeDeclare(buffer) {
  var val, len, offset = 0, fields = {
    ticket: void 0,
    exchange: void 0,
    type: void 0,
    passive: void 0,
    durable: void 0,
    autoDelete: void 0,
    internal: void 0,
    nowait: void 0,
    arguments: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.exchange = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.type = val;
  val = !!(1 & buffer[offset]);
  fields.passive = val;
  val = !!(2 & buffer[offset]);
  fields.durable = val;
  val = !!(4 & buffer[offset]);
  fields.autoDelete = val;
  val = !!(8 & buffer[offset]);
  fields.internal = val;
  val = !!(16 & buffer[offset]);
  fields.nowait = val;
  offset++;
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = decodeFields(buffer.slice(offset, offset + len));
  offset += len;
  fields.arguments = val;
  return fields;
}

function encodeExchangeDeclare(channel, fields) {
  var len, offset = 0, val = null, bits = 0, varyingSize = 0, scratchOffset = 0;
  val = fields.exchange;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'exchange'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
  var exchange_len = Buffer.byteLength(val, "utf8");
  varyingSize += exchange_len;
  val = fields.type;
  if (void 0 === val) val = "direct"; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'type' is the wrong type; must be a string (up to 255 chars)");
  var type_len = Buffer.byteLength(val, "utf8");
  varyingSize += type_len;
  val = fields.arguments;
  if (void 0 === val) val = {}; else if ("object" != typeof val) throw new TypeError("Field 'arguments' is the wrong type; must be an object");
  len = encodeTable(SCRATCH, val, scratchOffset);
  var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
  scratchOffset += len;
  varyingSize += arguments_encoded.length;
  var buffer = new Buffer(17 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(2621450, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.exchange;
  void 0 === val && (val = void 0);
  buffer[offset] = exchange_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += exchange_len;
  val = fields.type;
  void 0 === val && (val = "direct");
  buffer[offset] = type_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += type_len;
  val = fields.passive;
  void 0 === val && (val = !1);
  val && (bits += 1);
  val = fields.durable;
  void 0 === val && (val = !1);
  val && (bits += 2);
  val = fields.autoDelete;
  void 0 === val && (val = !1);
  val && (bits += 4);
  val = fields.internal;
  void 0 === val && (val = !1);
  val && (bits += 8);
  val = fields.nowait;
  void 0 === val && (val = !1);
  val && (bits += 16);
  buffer[offset] = bits;
  offset++;
  bits = 0;
  offset += arguments_encoded.copy(buffer, offset);
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeExchangeDeclareOk(buffer) {
  var fields = {};
  return fields;
}

function encodeExchangeDeclareOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(2621451, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeExchangeDelete(buffer) {
  var val, len, offset = 0, fields = {
    ticket: void 0,
    exchange: void 0,
    ifUnused: void 0,
    nowait: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.exchange = val;
  val = !!(1 & buffer[offset]);
  fields.ifUnused = val;
  val = !!(2 & buffer[offset]);
  fields.nowait = val;
  return fields;
}

function encodeExchangeDelete(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0;
  val = fields.exchange;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'exchange'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
  var exchange_len = Buffer.byteLength(val, "utf8");
  varyingSize += exchange_len;
  var buffer = new Buffer(16 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(2621460, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.exchange;
  void 0 === val && (val = void 0);
  buffer[offset] = exchange_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += exchange_len;
  val = fields.ifUnused;
  void 0 === val && (val = !1);
  val && (bits += 1);
  val = fields.nowait;
  void 0 === val && (val = !1);
  val && (bits += 2);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeExchangeDeleteOk(buffer) {
  var fields = {};
  return fields;
}

function encodeExchangeDeleteOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(2621461, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeExchangeBind(buffer) {
  var val, len, offset = 0, fields = {
    ticket: void 0,
    destination: void 0,
    source: void 0,
    routingKey: void 0,
    nowait: void 0,
    arguments: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.destination = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.source = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.routingKey = val;
  val = !!(1 & buffer[offset]);
  fields.nowait = val;
  offset++;
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = decodeFields(buffer.slice(offset, offset + len));
  offset += len;
  fields.arguments = val;
  return fields;
}

function encodeExchangeBind(channel, fields) {
  var len, offset = 0, val = null, bits = 0, varyingSize = 0, scratchOffset = 0;
  val = fields.destination;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'destination'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'destination' is the wrong type; must be a string (up to 255 chars)");
  var destination_len = Buffer.byteLength(val, "utf8");
  varyingSize += destination_len;
  val = fields.source;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'source'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'source' is the wrong type; must be a string (up to 255 chars)");
  var source_len = Buffer.byteLength(val, "utf8");
  varyingSize += source_len;
  val = fields.routingKey;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
  var routingKey_len = Buffer.byteLength(val, "utf8");
  varyingSize += routingKey_len;
  val = fields.arguments;
  if (void 0 === val) val = {}; else if ("object" != typeof val) throw new TypeError("Field 'arguments' is the wrong type; must be an object");
  len = encodeTable(SCRATCH, val, scratchOffset);
  var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
  scratchOffset += len;
  varyingSize += arguments_encoded.length;
  var buffer = new Buffer(18 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(2621470, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.destination;
  void 0 === val && (val = void 0);
  buffer[offset] = destination_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += destination_len;
  val = fields.source;
  void 0 === val && (val = void 0);
  buffer[offset] = source_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += source_len;
  val = fields.routingKey;
  void 0 === val && (val = "");
  buffer[offset] = routingKey_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += routingKey_len;
  val = fields.nowait;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  bits = 0;
  offset += arguments_encoded.copy(buffer, offset);
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeExchangeBindOk(buffer) {
  var fields = {};
  return fields;
}

function encodeExchangeBindOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(2621471, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeExchangeUnbind(buffer) {
  var val, len, offset = 0, fields = {
    ticket: void 0,
    destination: void 0,
    source: void 0,
    routingKey: void 0,
    nowait: void 0,
    arguments: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.destination = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.source = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.routingKey = val;
  val = !!(1 & buffer[offset]);
  fields.nowait = val;
  offset++;
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = decodeFields(buffer.slice(offset, offset + len));
  offset += len;
  fields.arguments = val;
  return fields;
}

function encodeExchangeUnbind(channel, fields) {
  var len, offset = 0, val = null, bits = 0, varyingSize = 0, scratchOffset = 0;
  val = fields.destination;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'destination'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'destination' is the wrong type; must be a string (up to 255 chars)");
  var destination_len = Buffer.byteLength(val, "utf8");
  varyingSize += destination_len;
  val = fields.source;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'source'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'source' is the wrong type; must be a string (up to 255 chars)");
  var source_len = Buffer.byteLength(val, "utf8");
  varyingSize += source_len;
  val = fields.routingKey;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
  var routingKey_len = Buffer.byteLength(val, "utf8");
  varyingSize += routingKey_len;
  val = fields.arguments;
  if (void 0 === val) val = {}; else if ("object" != typeof val) throw new TypeError("Field 'arguments' is the wrong type; must be an object");
  len = encodeTable(SCRATCH, val, scratchOffset);
  var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
  scratchOffset += len;
  varyingSize += arguments_encoded.length;
  var buffer = new Buffer(18 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(2621480, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.destination;
  void 0 === val && (val = void 0);
  buffer[offset] = destination_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += destination_len;
  val = fields.source;
  void 0 === val && (val = void 0);
  buffer[offset] = source_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += source_len;
  val = fields.routingKey;
  void 0 === val && (val = "");
  buffer[offset] = routingKey_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += routingKey_len;
  val = fields.nowait;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  bits = 0;
  offset += arguments_encoded.copy(buffer, offset);
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeExchangeUnbindOk(buffer) {
  var fields = {};
  return fields;
}

function encodeExchangeUnbindOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(2621491, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeQueueDeclare(buffer) {
  var val, len, offset = 0, fields = {
    ticket: void 0,
    queue: void 0,
    passive: void 0,
    durable: void 0,
    exclusive: void 0,
    autoDelete: void 0,
    nowait: void 0,
    arguments: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.queue = val;
  val = !!(1 & buffer[offset]);
  fields.passive = val;
  val = !!(2 & buffer[offset]);
  fields.durable = val;
  val = !!(4 & buffer[offset]);
  fields.exclusive = val;
  val = !!(8 & buffer[offset]);
  fields.autoDelete = val;
  val = !!(16 & buffer[offset]);
  fields.nowait = val;
  offset++;
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = decodeFields(buffer.slice(offset, offset + len));
  offset += len;
  fields.arguments = val;
  return fields;
}

function encodeQueueDeclare(channel, fields) {
  var len, offset = 0, val = null, bits = 0, varyingSize = 0, scratchOffset = 0;
  val = fields.queue;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
  var queue_len = Buffer.byteLength(val, "utf8");
  varyingSize += queue_len;
  val = fields.arguments;
  if (void 0 === val) val = {}; else if ("object" != typeof val) throw new TypeError("Field 'arguments' is the wrong type; must be an object");
  len = encodeTable(SCRATCH, val, scratchOffset);
  var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
  scratchOffset += len;
  varyingSize += arguments_encoded.length;
  var buffer = new Buffer(16 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3276810, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.queue;
  void 0 === val && (val = "");
  buffer[offset] = queue_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += queue_len;
  val = fields.passive;
  void 0 === val && (val = !1);
  val && (bits += 1);
  val = fields.durable;
  void 0 === val && (val = !1);
  val && (bits += 2);
  val = fields.exclusive;
  void 0 === val && (val = !1);
  val && (bits += 4);
  val = fields.autoDelete;
  void 0 === val && (val = !1);
  val && (bits += 8);
  val = fields.nowait;
  void 0 === val && (val = !1);
  val && (bits += 16);
  buffer[offset] = bits;
  offset++;
  bits = 0;
  offset += arguments_encoded.copy(buffer, offset);
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeQueueDeclareOk(buffer) {
  var val, len, offset = 0, fields = {
    queue: void 0,
    messageCount: void 0,
    consumerCount: void 0
  };
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.queue = val;
  val = buffer.readUInt32BE(offset);
  offset += 4;
  fields.messageCount = val;
  val = buffer.readUInt32BE(offset);
  offset += 4;
  fields.consumerCount = val;
  return fields;
}

function encodeQueueDeclareOk(channel, fields) {
  var offset = 0, val = null, varyingSize = 0;
  val = fields.queue;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'queue'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
  var queue_len = Buffer.byteLength(val, "utf8");
  varyingSize += queue_len;
  var buffer = new Buffer(21 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3276811, 7);
  offset = 11;
  val = fields.queue;
  void 0 === val && (val = void 0);
  buffer[offset] = queue_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += queue_len;
  val = fields.messageCount;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'messageCount'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'messageCount' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt32BE(val, offset);
  offset += 4;
  val = fields.consumerCount;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'consumerCount'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'consumerCount' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt32BE(val, offset);
  offset += 4;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeQueueBind(buffer) {
  var val, len, offset = 0, fields = {
    ticket: void 0,
    queue: void 0,
    exchange: void 0,
    routingKey: void 0,
    nowait: void 0,
    arguments: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.queue = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.exchange = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.routingKey = val;
  val = !!(1 & buffer[offset]);
  fields.nowait = val;
  offset++;
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = decodeFields(buffer.slice(offset, offset + len));
  offset += len;
  fields.arguments = val;
  return fields;
}

function encodeQueueBind(channel, fields) {
  var len, offset = 0, val = null, bits = 0, varyingSize = 0, scratchOffset = 0;
  val = fields.queue;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
  var queue_len = Buffer.byteLength(val, "utf8");
  varyingSize += queue_len;
  val = fields.exchange;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'exchange'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
  var exchange_len = Buffer.byteLength(val, "utf8");
  varyingSize += exchange_len;
  val = fields.routingKey;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
  var routingKey_len = Buffer.byteLength(val, "utf8");
  varyingSize += routingKey_len;
  val = fields.arguments;
  if (void 0 === val) val = {}; else if ("object" != typeof val) throw new TypeError("Field 'arguments' is the wrong type; must be an object");
  len = encodeTable(SCRATCH, val, scratchOffset);
  var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
  scratchOffset += len;
  varyingSize += arguments_encoded.length;
  var buffer = new Buffer(18 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3276820, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.queue;
  void 0 === val && (val = "");
  buffer[offset] = queue_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += queue_len;
  val = fields.exchange;
  void 0 === val && (val = void 0);
  buffer[offset] = exchange_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += exchange_len;
  val = fields.routingKey;
  void 0 === val && (val = "");
  buffer[offset] = routingKey_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += routingKey_len;
  val = fields.nowait;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  bits = 0;
  offset += arguments_encoded.copy(buffer, offset);
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeQueueBindOk(buffer) {
  var fields = {};
  return fields;
}

function encodeQueueBindOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3276821, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeQueuePurge(buffer) {
  var val, len, offset = 0, fields = {
    ticket: void 0,
    queue: void 0,
    nowait: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.queue = val;
  val = !!(1 & buffer[offset]);
  fields.nowait = val;
  return fields;
}

function encodeQueuePurge(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0;
  val = fields.queue;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
  var queue_len = Buffer.byteLength(val, "utf8");
  varyingSize += queue_len;
  var buffer = new Buffer(16 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3276830, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.queue;
  void 0 === val && (val = "");
  buffer[offset] = queue_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += queue_len;
  val = fields.nowait;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeQueuePurgeOk(buffer) {
  var val, offset = 0, fields = {
    messageCount: void 0
  };
  val = buffer.readUInt32BE(offset);
  offset += 4;
  fields.messageCount = val;
  return fields;
}

function encodeQueuePurgeOk(channel, fields) {
  var offset = 0, val = null, varyingSize = 0, buffer = new Buffer(16 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3276831, 7);
  offset = 11;
  val = fields.messageCount;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'messageCount'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'messageCount' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt32BE(val, offset);
  offset += 4;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeQueueDelete(buffer) {
  var val, len, offset = 0, fields = {
    ticket: void 0,
    queue: void 0,
    ifUnused: void 0,
    ifEmpty: void 0,
    nowait: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.queue = val;
  val = !!(1 & buffer[offset]);
  fields.ifUnused = val;
  val = !!(2 & buffer[offset]);
  fields.ifEmpty = val;
  val = !!(4 & buffer[offset]);
  fields.nowait = val;
  return fields;
}

function encodeQueueDelete(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0;
  val = fields.queue;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
  var queue_len = Buffer.byteLength(val, "utf8");
  varyingSize += queue_len;
  var buffer = new Buffer(16 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3276840, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.queue;
  void 0 === val && (val = "");
  buffer[offset] = queue_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += queue_len;
  val = fields.ifUnused;
  void 0 === val && (val = !1);
  val && (bits += 1);
  val = fields.ifEmpty;
  void 0 === val && (val = !1);
  val && (bits += 2);
  val = fields.nowait;
  void 0 === val && (val = !1);
  val && (bits += 4);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeQueueDeleteOk(buffer) {
  var val, offset = 0, fields = {
    messageCount: void 0
  };
  val = buffer.readUInt32BE(offset);
  offset += 4;
  fields.messageCount = val;
  return fields;
}

function encodeQueueDeleteOk(channel, fields) {
  var offset = 0, val = null, varyingSize = 0, buffer = new Buffer(16 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3276841, 7);
  offset = 11;
  val = fields.messageCount;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'messageCount'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'messageCount' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt32BE(val, offset);
  offset += 4;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeQueueUnbind(buffer) {
  var val, len, offset = 0, fields = {
    ticket: void 0,
    queue: void 0,
    exchange: void 0,
    routingKey: void 0,
    arguments: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.queue = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.exchange = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.routingKey = val;
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = decodeFields(buffer.slice(offset, offset + len));
  offset += len;
  fields.arguments = val;
  return fields;
}

function encodeQueueUnbind(channel, fields) {
  var len, offset = 0, val = null, varyingSize = 0, scratchOffset = 0;
  val = fields.queue;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
  var queue_len = Buffer.byteLength(val, "utf8");
  varyingSize += queue_len;
  val = fields.exchange;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'exchange'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
  var exchange_len = Buffer.byteLength(val, "utf8");
  varyingSize += exchange_len;
  val = fields.routingKey;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
  var routingKey_len = Buffer.byteLength(val, "utf8");
  varyingSize += routingKey_len;
  val = fields.arguments;
  if (void 0 === val) val = {}; else if ("object" != typeof val) throw new TypeError("Field 'arguments' is the wrong type; must be an object");
  len = encodeTable(SCRATCH, val, scratchOffset);
  var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
  scratchOffset += len;
  varyingSize += arguments_encoded.length;
  var buffer = new Buffer(17 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3276850, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.queue;
  void 0 === val && (val = "");
  buffer[offset] = queue_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += queue_len;
  val = fields.exchange;
  void 0 === val && (val = void 0);
  buffer[offset] = exchange_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += exchange_len;
  val = fields.routingKey;
  void 0 === val && (val = "");
  buffer[offset] = routingKey_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += routingKey_len;
  offset += arguments_encoded.copy(buffer, offset);
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeQueueUnbindOk(buffer) {
  var fields = {};
  return fields;
}

function encodeQueueUnbindOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3276851, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicQos(buffer) {
  var val, offset = 0, fields = {
    prefetchSize: void 0,
    prefetchCount: void 0,
    global: void 0
  };
  val = buffer.readUInt32BE(offset);
  offset += 4;
  fields.prefetchSize = val;
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.prefetchCount = val;
  val = !!(1 & buffer[offset]);
  fields.global = val;
  return fields;
}

function encodeBasicQos(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0, buffer = new Buffer(19 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932170, 7);
  offset = 11;
  val = fields.prefetchSize;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'prefetchSize' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt32BE(val, offset);
  offset += 4;
  val = fields.prefetchCount;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'prefetchCount' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.global;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicQosOk(buffer) {
  var fields = {};
  return fields;
}

function encodeBasicQosOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932171, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicConsume(buffer) {
  var val, len, offset = 0, fields = {
    ticket: void 0,
    queue: void 0,
    consumerTag: void 0,
    noLocal: void 0,
    noAck: void 0,
    exclusive: void 0,
    nowait: void 0,
    arguments: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.queue = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.consumerTag = val;
  val = !!(1 & buffer[offset]);
  fields.noLocal = val;
  val = !!(2 & buffer[offset]);
  fields.noAck = val;
  val = !!(4 & buffer[offset]);
  fields.exclusive = val;
  val = !!(8 & buffer[offset]);
  fields.nowait = val;
  offset++;
  len = buffer.readUInt32BE(offset);
  offset += 4;
  val = decodeFields(buffer.slice(offset, offset + len));
  offset += len;
  fields.arguments = val;
  return fields;
}

function encodeBasicConsume(channel, fields) {
  var len, offset = 0, val = null, bits = 0, varyingSize = 0, scratchOffset = 0;
  val = fields.queue;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
  var queue_len = Buffer.byteLength(val, "utf8");
  varyingSize += queue_len;
  val = fields.consumerTag;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'consumerTag' is the wrong type; must be a string (up to 255 chars)");
  var consumerTag_len = Buffer.byteLength(val, "utf8");
  varyingSize += consumerTag_len;
  val = fields.arguments;
  if (void 0 === val) val = {}; else if ("object" != typeof val) throw new TypeError("Field 'arguments' is the wrong type; must be an object");
  len = encodeTable(SCRATCH, val, scratchOffset);
  var arguments_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
  scratchOffset += len;
  varyingSize += arguments_encoded.length;
  var buffer = new Buffer(17 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932180, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.queue;
  void 0 === val && (val = "");
  buffer[offset] = queue_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += queue_len;
  val = fields.consumerTag;
  void 0 === val && (val = "");
  buffer[offset] = consumerTag_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += consumerTag_len;
  val = fields.noLocal;
  void 0 === val && (val = !1);
  val && (bits += 1);
  val = fields.noAck;
  void 0 === val && (val = !1);
  val && (bits += 2);
  val = fields.exclusive;
  void 0 === val && (val = !1);
  val && (bits += 4);
  val = fields.nowait;
  void 0 === val && (val = !1);
  val && (bits += 8);
  buffer[offset] = bits;
  offset++;
  bits = 0;
  offset += arguments_encoded.copy(buffer, offset);
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicConsumeOk(buffer) {
  var val, len, offset = 0, fields = {
    consumerTag: void 0
  };
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.consumerTag = val;
  return fields;
}

function encodeBasicConsumeOk(channel, fields) {
  var offset = 0, val = null, varyingSize = 0;
  val = fields.consumerTag;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'consumerTag'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'consumerTag' is the wrong type; must be a string (up to 255 chars)");
  var consumerTag_len = Buffer.byteLength(val, "utf8");
  varyingSize += consumerTag_len;
  var buffer = new Buffer(13 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932181, 7);
  offset = 11;
  val = fields.consumerTag;
  void 0 === val && (val = void 0);
  buffer[offset] = consumerTag_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += consumerTag_len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicCancel(buffer) {
  var val, len, offset = 0, fields = {
    consumerTag: void 0,
    nowait: void 0
  };
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.consumerTag = val;
  val = !!(1 & buffer[offset]);
  fields.nowait = val;
  return fields;
}

function encodeBasicCancel(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0;
  val = fields.consumerTag;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'consumerTag'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'consumerTag' is the wrong type; must be a string (up to 255 chars)");
  var consumerTag_len = Buffer.byteLength(val, "utf8");
  varyingSize += consumerTag_len;
  var buffer = new Buffer(14 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932190, 7);
  offset = 11;
  val = fields.consumerTag;
  void 0 === val && (val = void 0);
  buffer[offset] = consumerTag_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += consumerTag_len;
  val = fields.nowait;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicCancelOk(buffer) {
  var val, len, offset = 0, fields = {
    consumerTag: void 0
  };
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.consumerTag = val;
  return fields;
}

function encodeBasicCancelOk(channel, fields) {
  var offset = 0, val = null, varyingSize = 0;
  val = fields.consumerTag;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'consumerTag'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'consumerTag' is the wrong type; must be a string (up to 255 chars)");
  var consumerTag_len = Buffer.byteLength(val, "utf8");
  varyingSize += consumerTag_len;
  var buffer = new Buffer(13 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932191, 7);
  offset = 11;
  val = fields.consumerTag;
  void 0 === val && (val = void 0);
  buffer[offset] = consumerTag_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += consumerTag_len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicPublish(buffer) {
  var val, len, offset = 0, fields = {
    ticket: void 0,
    exchange: void 0,
    routingKey: void 0,
    mandatory: void 0,
    immediate: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.exchange = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.routingKey = val;
  val = !!(1 & buffer[offset]);
  fields.mandatory = val;
  val = !!(2 & buffer[offset]);
  fields.immediate = val;
  return fields;
}

function encodeBasicPublish(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0;
  val = fields.exchange;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
  var exchange_len = Buffer.byteLength(val, "utf8");
  varyingSize += exchange_len;
  val = fields.routingKey;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
  var routingKey_len = Buffer.byteLength(val, "utf8");
  varyingSize += routingKey_len;
  var buffer = new Buffer(17 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932200, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.exchange;
  void 0 === val && (val = "");
  buffer[offset] = exchange_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += exchange_len;
  val = fields.routingKey;
  void 0 === val && (val = "");
  buffer[offset] = routingKey_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += routingKey_len;
  val = fields.mandatory;
  void 0 === val && (val = !1);
  val && (bits += 1);
  val = fields.immediate;
  void 0 === val && (val = !1);
  val && (bits += 2);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicReturn(buffer) {
  var val, len, offset = 0, fields = {
    replyCode: void 0,
    replyText: void 0,
    exchange: void 0,
    routingKey: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.replyCode = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.replyText = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.exchange = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.routingKey = val;
  return fields;
}

function encodeBasicReturn(channel, fields) {
  var offset = 0, val = null, varyingSize = 0;
  val = fields.replyText;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'replyText' is the wrong type; must be a string (up to 255 chars)");
  var replyText_len = Buffer.byteLength(val, "utf8");
  varyingSize += replyText_len;
  val = fields.exchange;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'exchange'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
  var exchange_len = Buffer.byteLength(val, "utf8");
  varyingSize += exchange_len;
  val = fields.routingKey;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'routingKey'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
  var routingKey_len = Buffer.byteLength(val, "utf8");
  varyingSize += routingKey_len;
  var buffer = new Buffer(17 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932210, 7);
  offset = 11;
  val = fields.replyCode;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'replyCode'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'replyCode' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.replyText;
  void 0 === val && (val = "");
  buffer[offset] = replyText_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += replyText_len;
  val = fields.exchange;
  void 0 === val && (val = void 0);
  buffer[offset] = exchange_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += exchange_len;
  val = fields.routingKey;
  void 0 === val && (val = void 0);
  buffer[offset] = routingKey_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += routingKey_len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicDeliver(buffer) {
  var val, len, offset = 0, fields = {
    consumerTag: void 0,
    deliveryTag: void 0,
    redelivered: void 0,
    exchange: void 0,
    routingKey: void 0
  };
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.consumerTag = val;
  val = ints.readUInt64BE(buffer, offset);
  offset += 8;
  fields.deliveryTag = val;
  val = !!(1 & buffer[offset]);
  fields.redelivered = val;
  offset++;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.exchange = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.routingKey = val;
  return fields;
}

function encodeBasicDeliver(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0;
  val = fields.consumerTag;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'consumerTag'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'consumerTag' is the wrong type; must be a string (up to 255 chars)");
  var consumerTag_len = Buffer.byteLength(val, "utf8");
  varyingSize += consumerTag_len;
  val = fields.exchange;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'exchange'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
  var exchange_len = Buffer.byteLength(val, "utf8");
  varyingSize += exchange_len;
  val = fields.routingKey;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'routingKey'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
  var routingKey_len = Buffer.byteLength(val, "utf8");
  varyingSize += routingKey_len;
  var buffer = new Buffer(24 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932220, 7);
  offset = 11;
  val = fields.consumerTag;
  void 0 === val && (val = void 0);
  buffer[offset] = consumerTag_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += consumerTag_len;
  val = fields.deliveryTag;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'deliveryTag'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'deliveryTag' is the wrong type; must be a number (but not NaN)");
  ints.writeUInt64BE(buffer, val, offset);
  offset += 8;
  val = fields.redelivered;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  bits = 0;
  val = fields.exchange;
  void 0 === val && (val = void 0);
  buffer[offset] = exchange_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += exchange_len;
  val = fields.routingKey;
  void 0 === val && (val = void 0);
  buffer[offset] = routingKey_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += routingKey_len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicGet(buffer) {
  var val, len, offset = 0, fields = {
    ticket: void 0,
    queue: void 0,
    noAck: void 0
  };
  val = buffer.readUInt16BE(offset);
  offset += 2;
  fields.ticket = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.queue = val;
  val = !!(1 & buffer[offset]);
  fields.noAck = val;
  return fields;
}

function encodeBasicGet(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0;
  val = fields.queue;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'queue' is the wrong type; must be a string (up to 255 chars)");
  var queue_len = Buffer.byteLength(val, "utf8");
  varyingSize += queue_len;
  var buffer = new Buffer(16 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932230, 7);
  offset = 11;
  val = fields.ticket;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'ticket' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt16BE(val, offset);
  offset += 2;
  val = fields.queue;
  void 0 === val && (val = "");
  buffer[offset] = queue_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += queue_len;
  val = fields.noAck;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicGetOk(buffer) {
  var val, len, offset = 0, fields = {
    deliveryTag: void 0,
    redelivered: void 0,
    exchange: void 0,
    routingKey: void 0,
    messageCount: void 0
  };
  val = ints.readUInt64BE(buffer, offset);
  offset += 8;
  fields.deliveryTag = val;
  val = !!(1 & buffer[offset]);
  fields.redelivered = val;
  offset++;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.exchange = val;
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.routingKey = val;
  val = buffer.readUInt32BE(offset);
  offset += 4;
  fields.messageCount = val;
  return fields;
}

function encodeBasicGetOk(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0;
  val = fields.exchange;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'exchange'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'exchange' is the wrong type; must be a string (up to 255 chars)");
  var exchange_len = Buffer.byteLength(val, "utf8");
  varyingSize += exchange_len;
  val = fields.routingKey;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'routingKey'");
  if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'routingKey' is the wrong type; must be a string (up to 255 chars)");
  var routingKey_len = Buffer.byteLength(val, "utf8");
  varyingSize += routingKey_len;
  var buffer = new Buffer(27 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932231, 7);
  offset = 11;
  val = fields.deliveryTag;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'deliveryTag'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'deliveryTag' is the wrong type; must be a number (but not NaN)");
  ints.writeUInt64BE(buffer, val, offset);
  offset += 8;
  val = fields.redelivered;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  bits = 0;
  val = fields.exchange;
  void 0 === val && (val = void 0);
  buffer[offset] = exchange_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += exchange_len;
  val = fields.routingKey;
  void 0 === val && (val = void 0);
  buffer[offset] = routingKey_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += routingKey_len;
  val = fields.messageCount;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'messageCount'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'messageCount' is the wrong type; must be a number (but not NaN)");
  buffer.writeUInt32BE(val, offset);
  offset += 4;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicGetEmpty(buffer) {
  var val, len, offset = 0, fields = {
    clusterId: void 0
  };
  len = buffer.readUInt8(offset);
  offset++;
  val = buffer.toString("utf8", offset, offset + len);
  offset += len;
  fields.clusterId = val;
  return fields;
}

function encodeBasicGetEmpty(channel, fields) {
  var offset = 0, val = null, varyingSize = 0;
  val = fields.clusterId;
  if (void 0 === val) val = ""; else if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'clusterId' is the wrong type; must be a string (up to 255 chars)");
  var clusterId_len = Buffer.byteLength(val, "utf8");
  varyingSize += clusterId_len;
  var buffer = new Buffer(13 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932232, 7);
  offset = 11;
  val = fields.clusterId;
  void 0 === val && (val = "");
  buffer[offset] = clusterId_len;
  offset++;
  buffer.write(val, offset, "utf8");
  offset += clusterId_len;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicAck(buffer) {
  var val, offset = 0, fields = {
    deliveryTag: void 0,
    multiple: void 0
  };
  val = ints.readUInt64BE(buffer, offset);
  offset += 8;
  fields.deliveryTag = val;
  val = !!(1 & buffer[offset]);
  fields.multiple = val;
  return fields;
}

function encodeBasicAck(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0, buffer = new Buffer(21 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932240, 7);
  offset = 11;
  val = fields.deliveryTag;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'deliveryTag' is the wrong type; must be a number (but not NaN)");
  ints.writeUInt64BE(buffer, val, offset);
  offset += 8;
  val = fields.multiple;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicReject(buffer) {
  var val, offset = 0, fields = {
    deliveryTag: void 0,
    requeue: void 0
  };
  val = ints.readUInt64BE(buffer, offset);
  offset += 8;
  fields.deliveryTag = val;
  val = !!(1 & buffer[offset]);
  fields.requeue = val;
  return fields;
}

function encodeBasicReject(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0, buffer = new Buffer(21 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932250, 7);
  offset = 11;
  val = fields.deliveryTag;
  if (void 0 === val) throw new Error("Missing value for mandatory field 'deliveryTag'");
  if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'deliveryTag' is the wrong type; must be a number (but not NaN)");
  ints.writeUInt64BE(buffer, val, offset);
  offset += 8;
  val = fields.requeue;
  void 0 === val && (val = !0);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicRecoverAsync(buffer) {
  var val, offset = 0, fields = {
    requeue: void 0
  };
  val = !!(1 & buffer[offset]);
  fields.requeue = val;
  return fields;
}

function encodeBasicRecoverAsync(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0, buffer = new Buffer(13 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932260, 7);
  offset = 11;
  val = fields.requeue;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicRecover(buffer) {
  var val, offset = 0, fields = {
    requeue: void 0
  };
  val = !!(1 & buffer[offset]);
  fields.requeue = val;
  return fields;
}

function encodeBasicRecover(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0, buffer = new Buffer(13 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932270, 7);
  offset = 11;
  val = fields.requeue;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicRecoverOk(buffer) {
  var fields = {};
  return fields;
}

function encodeBasicRecoverOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932271, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeBasicNack(buffer) {
  var val, offset = 0, fields = {
    deliveryTag: void 0,
    multiple: void 0,
    requeue: void 0
  };
  val = ints.readUInt64BE(buffer, offset);
  offset += 8;
  fields.deliveryTag = val;
  val = !!(1 & buffer[offset]);
  fields.multiple = val;
  val = !!(2 & buffer[offset]);
  fields.requeue = val;
  return fields;
}

function encodeBasicNack(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0, buffer = new Buffer(21 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932280, 7);
  offset = 11;
  val = fields.deliveryTag;
  if (void 0 === val) val = 0; else if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'deliveryTag' is the wrong type; must be a number (but not NaN)");
  ints.writeUInt64BE(buffer, val, offset);
  offset += 8;
  val = fields.multiple;
  void 0 === val && (val = !1);
  val && (bits += 1);
  val = fields.requeue;
  void 0 === val && (val = !0);
  val && (bits += 2);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeTxSelect(buffer) {
  var fields = {};
  return fields;
}

function encodeTxSelect(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(5898250, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeTxSelectOk(buffer) {
  var fields = {};
  return fields;
}

function encodeTxSelectOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(5898251, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeTxCommit(buffer) {
  var fields = {};
  return fields;
}

function encodeTxCommit(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(5898260, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeTxCommitOk(buffer) {
  var fields = {};
  return fields;
}

function encodeTxCommitOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(5898261, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeTxRollback(buffer) {
  var fields = {};
  return fields;
}

function encodeTxRollback(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(5898270, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeTxRollbackOk(buffer) {
  var fields = {};
  return fields;
}

function encodeTxRollbackOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(5898271, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConfirmSelect(buffer) {
  var val, offset = 0, fields = {
    nowait: void 0
  };
  val = !!(1 & buffer[offset]);
  fields.nowait = val;
  return fields;
}

function encodeConfirmSelect(channel, fields) {
  var offset = 0, val = null, bits = 0, varyingSize = 0, buffer = new Buffer(13 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(5570570, 7);
  offset = 11;
  val = fields.nowait;
  void 0 === val && (val = !1);
  val && (bits += 1);
  buffer[offset] = bits;
  offset++;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function decodeConfirmSelectOk(buffer) {
  var fields = {};
  return fields;
}

function encodeConfirmSelectOk(channel, fields) {
  var offset = 0, varyingSize = 0, buffer = new Buffer(12 + varyingSize);
  buffer[0] = 1;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(5570571, 7);
  offset = 11;
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  return buffer;
}

function encodeBasicProperties(channel, size, fields) {
  var val, len, offset = 0, flags = 0, scratchOffset = 0, varyingSize = 0;
  val = fields.contentType;
  if (void 0 != val) {
    if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'contentType' is the wrong type; must be a string (up to 255 chars)");
    var contentType_len = Buffer.byteLength(val, "utf8");
    varyingSize += 1;
    varyingSize += contentType_len;
  }
  val = fields.contentEncoding;
  if (void 0 != val) {
    if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'contentEncoding' is the wrong type; must be a string (up to 255 chars)");
    var contentEncoding_len = Buffer.byteLength(val, "utf8");
    varyingSize += 1;
    varyingSize += contentEncoding_len;
  }
  val = fields.headers;
  if (void 0 != val) {
    if ("object" != typeof val) throw new TypeError("Field 'headers' is the wrong type; must be an object");
    len = encodeTable(SCRATCH, val, scratchOffset);
    var headers_encoded = SCRATCH.slice(scratchOffset, scratchOffset + len);
    scratchOffset += len;
    varyingSize += headers_encoded.length;
  }
  val = fields.deliveryMode;
  if (void 0 != val) {
    if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'deliveryMode' is the wrong type; must be a number (but not NaN)");
    varyingSize += 1;
  }
  val = fields.priority;
  if (void 0 != val) {
    if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'priority' is the wrong type; must be a number (but not NaN)");
    varyingSize += 1;
  }
  val = fields.correlationId;
  if (void 0 != val) {
    if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'correlationId' is the wrong type; must be a string (up to 255 chars)");
    var correlationId_len = Buffer.byteLength(val, "utf8");
    varyingSize += 1;
    varyingSize += correlationId_len;
  }
  val = fields.replyTo;
  if (void 0 != val) {
    if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'replyTo' is the wrong type; must be a string (up to 255 chars)");
    var replyTo_len = Buffer.byteLength(val, "utf8");
    varyingSize += 1;
    varyingSize += replyTo_len;
  }
  val = fields.expiration;
  if (void 0 != val) {
    if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'expiration' is the wrong type; must be a string (up to 255 chars)");
    var expiration_len = Buffer.byteLength(val, "utf8");
    varyingSize += 1;
    varyingSize += expiration_len;
  }
  val = fields.messageId;
  if (void 0 != val) {
    if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'messageId' is the wrong type; must be a string (up to 255 chars)");
    var messageId_len = Buffer.byteLength(val, "utf8");
    varyingSize += 1;
    varyingSize += messageId_len;
  }
  val = fields.timestamp;
  if (void 0 != val) {
    if ("number" != typeof val || isNaN(val)) throw new TypeError("Field 'timestamp' is the wrong type; must be a number (but not NaN)");
    varyingSize += 8;
  }
  val = fields.type;
  if (void 0 != val) {
    if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'type' is the wrong type; must be a string (up to 255 chars)");
    var type_len = Buffer.byteLength(val, "utf8");
    varyingSize += 1;
    varyingSize += type_len;
  }
  val = fields.userId;
  if (void 0 != val) {
    if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'userId' is the wrong type; must be a string (up to 255 chars)");
    var userId_len = Buffer.byteLength(val, "utf8");
    varyingSize += 1;
    varyingSize += userId_len;
  }
  val = fields.appId;
  if (void 0 != val) {
    if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'appId' is the wrong type; must be a string (up to 255 chars)");
    var appId_len = Buffer.byteLength(val, "utf8");
    varyingSize += 1;
    varyingSize += appId_len;
  }
  val = fields.clusterId;
  if (void 0 != val) {
    if (!("string" == typeof val && Buffer.byteLength(val) < 256)) throw new TypeError("Field 'clusterId' is the wrong type; must be a string (up to 255 chars)");
    var clusterId_len = Buffer.byteLength(val, "utf8");
    varyingSize += 1;
    varyingSize += clusterId_len;
  }
  var buffer = new Buffer(22 + varyingSize);
  buffer[0] = 2;
  buffer.writeUInt16BE(channel, 1);
  buffer.writeUInt32BE(3932160, 7);
  ints.writeUInt64BE(buffer, size, 11);
  flags = 0;
  offset = 21;
  val = fields.contentType;
  if (void 0 != val) {
    flags += 32768;
    buffer[offset] = contentType_len;
    offset++;
    buffer.write(val, offset, "utf8");
    offset += contentType_len;
  }
  val = fields.contentEncoding;
  if (void 0 != val) {
    flags += 16384;
    buffer[offset] = contentEncoding_len;
    offset++;
    buffer.write(val, offset, "utf8");
    offset += contentEncoding_len;
  }
  val = fields.headers;
  if (void 0 != val) {
    flags += 8192;
    offset += headers_encoded.copy(buffer, offset);
  }
  val = fields.deliveryMode;
  if (void 0 != val) {
    flags += 4096;
    buffer.writeUInt8(val, offset);
    offset++;
  }
  val = fields.priority;
  if (void 0 != val) {
    flags += 2048;
    buffer.writeUInt8(val, offset);
    offset++;
  }
  val = fields.correlationId;
  if (void 0 != val) {
    flags += 1024;
    buffer[offset] = correlationId_len;
    offset++;
    buffer.write(val, offset, "utf8");
    offset += correlationId_len;
  }
  val = fields.replyTo;
  if (void 0 != val) {
    flags += 512;
    buffer[offset] = replyTo_len;
    offset++;
    buffer.write(val, offset, "utf8");
    offset += replyTo_len;
  }
  val = fields.expiration;
  if (void 0 != val) {
    flags += 256;
    buffer[offset] = expiration_len;
    offset++;
    buffer.write(val, offset, "utf8");
    offset += expiration_len;
  }
  val = fields.messageId;
  if (void 0 != val) {
    flags += 128;
    buffer[offset] = messageId_len;
    offset++;
    buffer.write(val, offset, "utf8");
    offset += messageId_len;
  }
  val = fields.timestamp;
  if (void 0 != val) {
    flags += 64;
    ints.writeUInt64BE(buffer, val, offset);
    offset += 8;
  }
  val = fields.type;
  if (void 0 != val) {
    flags += 32;
    buffer[offset] = type_len;
    offset++;
    buffer.write(val, offset, "utf8");
    offset += type_len;
  }
  val = fields.userId;
  if (void 0 != val) {
    flags += 16;
    buffer[offset] = userId_len;
    offset++;
    buffer.write(val, offset, "utf8");
    offset += userId_len;
  }
  val = fields.appId;
  if (void 0 != val) {
    flags += 8;
    buffer[offset] = appId_len;
    offset++;
    buffer.write(val, offset, "utf8");
    offset += appId_len;
  }
  val = fields.clusterId;
  if (void 0 != val) {
    flags += 4;
    buffer[offset] = clusterId_len;
    offset++;
    buffer.write(val, offset, "utf8");
    offset += clusterId_len;
  }
  buffer[offset] = 206;
  buffer.writeUInt32BE(offset - 7, 3);
  buffer.writeUInt16BE(flags, 19);
  return buffer.slice(0, offset + 1);
}

function decodeBasicProperties(buffer) {
  var flags, val, len, offset = 2;
  flags = buffer.readUInt16BE(0);
  if (0 === flags) return {};
  var fields = {
    contentType: void 0,
    contentEncoding: void 0,
    headers: void 0,
    deliveryMode: void 0,
    priority: void 0,
    correlationId: void 0,
    replyTo: void 0,
    expiration: void 0,
    messageId: void 0,
    timestamp: void 0,
    type: void 0,
    userId: void 0,
    appId: void 0,
    clusterId: void 0
  };
  if (32768 & flags) {
    len = buffer.readUInt8(offset);
    offset++;
    val = buffer.toString("utf8", offset, offset + len);
    offset += len;
    fields.contentType = val;
  }
  if (16384 & flags) {
    len = buffer.readUInt8(offset);
    offset++;
    val = buffer.toString("utf8", offset, offset + len);
    offset += len;
    fields.contentEncoding = val;
  }
  if (8192 & flags) {
    len = buffer.readUInt32BE(offset);
    offset += 4;
    val = decodeFields(buffer.slice(offset, offset + len));
    offset += len;
    fields.headers = val;
  }
  if (4096 & flags) {
    val = buffer[offset];
    offset++;
    fields.deliveryMode = val;
  }
  if (2048 & flags) {
    val = buffer[offset];
    offset++;
    fields.priority = val;
  }
  if (1024 & flags) {
    len = buffer.readUInt8(offset);
    offset++;
    val = buffer.toString("utf8", offset, offset + len);
    offset += len;
    fields.correlationId = val;
  }
  if (512 & flags) {
    len = buffer.readUInt8(offset);
    offset++;
    val = buffer.toString("utf8", offset, offset + len);
    offset += len;
    fields.replyTo = val;
  }
  if (256 & flags) {
    len = buffer.readUInt8(offset);
    offset++;
    val = buffer.toString("utf8", offset, offset + len);
    offset += len;
    fields.expiration = val;
  }
  if (128 & flags) {
    len = buffer.readUInt8(offset);
    offset++;
    val = buffer.toString("utf8", offset, offset + len);
    offset += len;
    fields.messageId = val;
  }
  if (64 & flags) {
    val = ints.readUInt64BE(buffer, offset);
    offset += 8;
    fields.timestamp = val;
  }
  if (32 & flags) {
    len = buffer.readUInt8(offset);
    offset++;
    val = buffer.toString("utf8", offset, offset + len);
    offset += len;
    fields.type = val;
  }
  if (16 & flags) {
    len = buffer.readUInt8(offset);
    offset++;
    val = buffer.toString("utf8", offset, offset + len);
    offset += len;
    fields.userId = val;
  }
  if (8 & flags) {
    len = buffer.readUInt8(offset);
    offset++;
    val = buffer.toString("utf8", offset, offset + len);
    offset += len;
    fields.appId = val;
  }
  if (4 & flags) {
    len = buffer.readUInt8(offset);
    offset++;
    val = buffer.toString("utf8", offset, offset + len);
    offset += len;
    fields.clusterId = val;
  }
  return fields;
}

var codec = __webpack_require__(32), ints = __webpack_require__(7), encodeTable = codec.encodeTable, decodeFields = codec.decodeFields, SCRATCH = new Buffer(4096), EMPTY_OBJECT = Object.freeze({});

module.exports.constants = {
  FRAME_METHOD: 1,
  FRAME_HEADER: 2,
  FRAME_BODY: 3,
  FRAME_HEARTBEAT: 8,
  FRAME_MIN_SIZE: 4096,
  FRAME_END: 206,
  REPLY_SUCCESS: 200,
  CONTENT_TOO_LARGE: 311,
  NO_ROUTE: 312,
  NO_CONSUMERS: 313,
  ACCESS_REFUSED: 403,
  NOT_FOUND: 404,
  RESOURCE_LOCKED: 405,
  PRECONDITION_FAILED: 406,
  CONNECTION_FORCED: 320,
  INVALID_PATH: 402,
  FRAME_ERROR: 501,
  SYNTAX_ERROR: 502,
  COMMAND_INVALID: 503,
  CHANNEL_ERROR: 504,
  UNEXPECTED_FRAME: 505,
  RESOURCE_ERROR: 506,
  NOT_ALLOWED: 530,
  NOT_IMPLEMENTED: 540,
  INTERNAL_ERROR: 541
};

module.exports.constant_strs = {
  "1": "FRAME-METHOD",
  "2": "FRAME-HEADER",
  "3": "FRAME-BODY",
  "8": "FRAME-HEARTBEAT",
  "200": "REPLY-SUCCESS",
  "206": "FRAME-END",
  "311": "CONTENT-TOO-LARGE",
  "312": "NO-ROUTE",
  "313": "NO-CONSUMERS",
  "320": "CONNECTION-FORCED",
  "402": "INVALID-PATH",
  "403": "ACCESS-REFUSED",
  "404": "NOT-FOUND",
  "405": "RESOURCE-LOCKED",
  "406": "PRECONDITION-FAILED",
  "501": "FRAME-ERROR",
  "502": "SYNTAX-ERROR",
  "503": "COMMAND-INVALID",
  "504": "CHANNEL-ERROR",
  "505": "UNEXPECTED-FRAME",
  "506": "RESOURCE-ERROR",
  "530": "NOT-ALLOWED",
  "540": "NOT-IMPLEMENTED",
  "541": "INTERNAL-ERROR",
  "4096": "FRAME-MIN-SIZE"
};

module.exports.FRAME_OVERHEAD = 8;

module.exports.decode = function(id, buf) {
  switch (id) {
   case 655370:
    return decodeConnectionStart(buf);

   case 655371:
    return decodeConnectionStartOk(buf);

   case 655380:
    return decodeConnectionSecure(buf);

   case 655381:
    return decodeConnectionSecureOk(buf);

   case 655390:
    return decodeConnectionTune(buf);

   case 655391:
    return decodeConnectionTuneOk(buf);

   case 655400:
    return decodeConnectionOpen(buf);

   case 655401:
    return decodeConnectionOpenOk(buf);

   case 655410:
    return decodeConnectionClose(buf);

   case 655411:
    return decodeConnectionCloseOk(buf);

   case 655420:
    return decodeConnectionBlocked(buf);

   case 655421:
    return decodeConnectionUnblocked(buf);

   case 1310730:
    return decodeChannelOpen(buf);

   case 1310731:
    return decodeChannelOpenOk(buf);

   case 1310740:
    return decodeChannelFlow(buf);

   case 1310741:
    return decodeChannelFlowOk(buf);

   case 1310760:
    return decodeChannelClose(buf);

   case 1310761:
    return decodeChannelCloseOk(buf);

   case 1966090:
    return decodeAccessRequest(buf);

   case 1966091:
    return decodeAccessRequestOk(buf);

   case 2621450:
    return decodeExchangeDeclare(buf);

   case 2621451:
    return decodeExchangeDeclareOk(buf);

   case 2621460:
    return decodeExchangeDelete(buf);

   case 2621461:
    return decodeExchangeDeleteOk(buf);

   case 2621470:
    return decodeExchangeBind(buf);

   case 2621471:
    return decodeExchangeBindOk(buf);

   case 2621480:
    return decodeExchangeUnbind(buf);

   case 2621491:
    return decodeExchangeUnbindOk(buf);

   case 3276810:
    return decodeQueueDeclare(buf);

   case 3276811:
    return decodeQueueDeclareOk(buf);

   case 3276820:
    return decodeQueueBind(buf);

   case 3276821:
    return decodeQueueBindOk(buf);

   case 3276830:
    return decodeQueuePurge(buf);

   case 3276831:
    return decodeQueuePurgeOk(buf);

   case 3276840:
    return decodeQueueDelete(buf);

   case 3276841:
    return decodeQueueDeleteOk(buf);

   case 3276850:
    return decodeQueueUnbind(buf);

   case 3276851:
    return decodeQueueUnbindOk(buf);

   case 3932170:
    return decodeBasicQos(buf);

   case 3932171:
    return decodeBasicQosOk(buf);

   case 3932180:
    return decodeBasicConsume(buf);

   case 3932181:
    return decodeBasicConsumeOk(buf);

   case 3932190:
    return decodeBasicCancel(buf);

   case 3932191:
    return decodeBasicCancelOk(buf);

   case 3932200:
    return decodeBasicPublish(buf);

   case 3932210:
    return decodeBasicReturn(buf);

   case 3932220:
    return decodeBasicDeliver(buf);

   case 3932230:
    return decodeBasicGet(buf);

   case 3932231:
    return decodeBasicGetOk(buf);

   case 3932232:
    return decodeBasicGetEmpty(buf);

   case 3932240:
    return decodeBasicAck(buf);

   case 3932250:
    return decodeBasicReject(buf);

   case 3932260:
    return decodeBasicRecoverAsync(buf);

   case 3932270:
    return decodeBasicRecover(buf);

   case 3932271:
    return decodeBasicRecoverOk(buf);

   case 3932280:
    return decodeBasicNack(buf);

   case 5898250:
    return decodeTxSelect(buf);

   case 5898251:
    return decodeTxSelectOk(buf);

   case 5898260:
    return decodeTxCommit(buf);

   case 5898261:
    return decodeTxCommitOk(buf);

   case 5898270:
    return decodeTxRollback(buf);

   case 5898271:
    return decodeTxRollbackOk(buf);

   case 5570570:
    return decodeConfirmSelect(buf);

   case 5570571:
    return decodeConfirmSelectOk(buf);

   case 60:
    return decodeBasicProperties(buf);

   default:
    throw new Error("Unknown class/method ID");
  }
};

module.exports.encodeMethod = function(id, channel, fields) {
  switch (id) {
   case 655370:
    return encodeConnectionStart(channel, fields);

   case 655371:
    return encodeConnectionStartOk(channel, fields);

   case 655380:
    return encodeConnectionSecure(channel, fields);

   case 655381:
    return encodeConnectionSecureOk(channel, fields);

   case 655390:
    return encodeConnectionTune(channel, fields);

   case 655391:
    return encodeConnectionTuneOk(channel, fields);

   case 655400:
    return encodeConnectionOpen(channel, fields);

   case 655401:
    return encodeConnectionOpenOk(channel, fields);

   case 655410:
    return encodeConnectionClose(channel, fields);

   case 655411:
    return encodeConnectionCloseOk(channel, fields);

   case 655420:
    return encodeConnectionBlocked(channel, fields);

   case 655421:
    return encodeConnectionUnblocked(channel, fields);

   case 1310730:
    return encodeChannelOpen(channel, fields);

   case 1310731:
    return encodeChannelOpenOk(channel, fields);

   case 1310740:
    return encodeChannelFlow(channel, fields);

   case 1310741:
    return encodeChannelFlowOk(channel, fields);

   case 1310760:
    return encodeChannelClose(channel, fields);

   case 1310761:
    return encodeChannelCloseOk(channel, fields);

   case 1966090:
    return encodeAccessRequest(channel, fields);

   case 1966091:
    return encodeAccessRequestOk(channel, fields);

   case 2621450:
    return encodeExchangeDeclare(channel, fields);

   case 2621451:
    return encodeExchangeDeclareOk(channel, fields);

   case 2621460:
    return encodeExchangeDelete(channel, fields);

   case 2621461:
    return encodeExchangeDeleteOk(channel, fields);

   case 2621470:
    return encodeExchangeBind(channel, fields);

   case 2621471:
    return encodeExchangeBindOk(channel, fields);

   case 2621480:
    return encodeExchangeUnbind(channel, fields);

   case 2621491:
    return encodeExchangeUnbindOk(channel, fields);

   case 3276810:
    return encodeQueueDeclare(channel, fields);

   case 3276811:
    return encodeQueueDeclareOk(channel, fields);

   case 3276820:
    return encodeQueueBind(channel, fields);

   case 3276821:
    return encodeQueueBindOk(channel, fields);

   case 3276830:
    return encodeQueuePurge(channel, fields);

   case 3276831:
    return encodeQueuePurgeOk(channel, fields);

   case 3276840:
    return encodeQueueDelete(channel, fields);

   case 3276841:
    return encodeQueueDeleteOk(channel, fields);

   case 3276850:
    return encodeQueueUnbind(channel, fields);

   case 3276851:
    return encodeQueueUnbindOk(channel, fields);

   case 3932170:
    return encodeBasicQos(channel, fields);

   case 3932171:
    return encodeBasicQosOk(channel, fields);

   case 3932180:
    return encodeBasicConsume(channel, fields);

   case 3932181:
    return encodeBasicConsumeOk(channel, fields);

   case 3932190:
    return encodeBasicCancel(channel, fields);

   case 3932191:
    return encodeBasicCancelOk(channel, fields);

   case 3932200:
    return encodeBasicPublish(channel, fields);

   case 3932210:
    return encodeBasicReturn(channel, fields);

   case 3932220:
    return encodeBasicDeliver(channel, fields);

   case 3932230:
    return encodeBasicGet(channel, fields);

   case 3932231:
    return encodeBasicGetOk(channel, fields);

   case 3932232:
    return encodeBasicGetEmpty(channel, fields);

   case 3932240:
    return encodeBasicAck(channel, fields);

   case 3932250:
    return encodeBasicReject(channel, fields);

   case 3932260:
    return encodeBasicRecoverAsync(channel, fields);

   case 3932270:
    return encodeBasicRecover(channel, fields);

   case 3932271:
    return encodeBasicRecoverOk(channel, fields);

   case 3932280:
    return encodeBasicNack(channel, fields);

   case 5898250:
    return encodeTxSelect(channel, fields);

   case 5898251:
    return encodeTxSelectOk(channel, fields);

   case 5898260:
    return encodeTxCommit(channel, fields);

   case 5898261:
    return encodeTxCommitOk(channel, fields);

   case 5898270:
    return encodeTxRollback(channel, fields);

   case 5898271:
    return encodeTxRollbackOk(channel, fields);

   case 5570570:
    return encodeConfirmSelect(channel, fields);

   case 5570571:
    return encodeConfirmSelectOk(channel, fields);

   default:
    throw new Error("Unknown class/method ID");
  }
};

module.exports.encodeProperties = function(id, channel, size, fields) {
  switch (id) {
   case 60:
    return encodeBasicProperties(channel, size, fields);

   default:
    throw new Error("Unknown class/properties ID");
  }
};

module.exports.info = function(id) {
  switch (id) {
   case 655370:
    return methodInfoConnectionStart;

   case 655371:
    return methodInfoConnectionStartOk;

   case 655380:
    return methodInfoConnectionSecure;

   case 655381:
    return methodInfoConnectionSecureOk;

   case 655390:
    return methodInfoConnectionTune;

   case 655391:
    return methodInfoConnectionTuneOk;

   case 655400:
    return methodInfoConnectionOpen;

   case 655401:
    return methodInfoConnectionOpenOk;

   case 655410:
    return methodInfoConnectionClose;

   case 655411:
    return methodInfoConnectionCloseOk;

   case 655420:
    return methodInfoConnectionBlocked;

   case 655421:
    return methodInfoConnectionUnblocked;

   case 1310730:
    return methodInfoChannelOpen;

   case 1310731:
    return methodInfoChannelOpenOk;

   case 1310740:
    return methodInfoChannelFlow;

   case 1310741:
    return methodInfoChannelFlowOk;

   case 1310760:
    return methodInfoChannelClose;

   case 1310761:
    return methodInfoChannelCloseOk;

   case 1966090:
    return methodInfoAccessRequest;

   case 1966091:
    return methodInfoAccessRequestOk;

   case 2621450:
    return methodInfoExchangeDeclare;

   case 2621451:
    return methodInfoExchangeDeclareOk;

   case 2621460:
    return methodInfoExchangeDelete;

   case 2621461:
    return methodInfoExchangeDeleteOk;

   case 2621470:
    return methodInfoExchangeBind;

   case 2621471:
    return methodInfoExchangeBindOk;

   case 2621480:
    return methodInfoExchangeUnbind;

   case 2621491:
    return methodInfoExchangeUnbindOk;

   case 3276810:
    return methodInfoQueueDeclare;

   case 3276811:
    return methodInfoQueueDeclareOk;

   case 3276820:
    return methodInfoQueueBind;

   case 3276821:
    return methodInfoQueueBindOk;

   case 3276830:
    return methodInfoQueuePurge;

   case 3276831:
    return methodInfoQueuePurgeOk;

   case 3276840:
    return methodInfoQueueDelete;

   case 3276841:
    return methodInfoQueueDeleteOk;

   case 3276850:
    return methodInfoQueueUnbind;

   case 3276851:
    return methodInfoQueueUnbindOk;

   case 3932170:
    return methodInfoBasicQos;

   case 3932171:
    return methodInfoBasicQosOk;

   case 3932180:
    return methodInfoBasicConsume;

   case 3932181:
    return methodInfoBasicConsumeOk;

   case 3932190:
    return methodInfoBasicCancel;

   case 3932191:
    return methodInfoBasicCancelOk;

   case 3932200:
    return methodInfoBasicPublish;

   case 3932210:
    return methodInfoBasicReturn;

   case 3932220:
    return methodInfoBasicDeliver;

   case 3932230:
    return methodInfoBasicGet;

   case 3932231:
    return methodInfoBasicGetOk;

   case 3932232:
    return methodInfoBasicGetEmpty;

   case 3932240:
    return methodInfoBasicAck;

   case 3932250:
    return methodInfoBasicReject;

   case 3932260:
    return methodInfoBasicRecoverAsync;

   case 3932270:
    return methodInfoBasicRecover;

   case 3932271:
    return methodInfoBasicRecoverOk;

   case 3932280:
    return methodInfoBasicNack;

   case 5898250:
    return methodInfoTxSelect;

   case 5898251:
    return methodInfoTxSelectOk;

   case 5898260:
    return methodInfoTxCommit;

   case 5898261:
    return methodInfoTxCommitOk;

   case 5898270:
    return methodInfoTxRollback;

   case 5898271:
    return methodInfoTxRollbackOk;

   case 5570570:
    return methodInfoConfirmSelect;

   case 5570571:
    return methodInfoConfirmSelectOk;

   case 60:
    return propertiesInfoBasicProperties;

   default:
    throw new Error("Unknown class/method ID");
  }
};

module.exports.ConnectionStart = 655370;

var methodInfoConnectionStart = module.exports.methodInfoConnectionStart = {
  id: 655370,
  name: "ConnectionStart",
  args: [ {
    type: "octet",
    name: "versionMajor",
    "default": 0
  }, {
    type: "octet",
    name: "versionMinor",
    "default": 9
  }, {
    type: "table",
    name: "serverProperties"
  }, {
    type: "longstr",
    name: "mechanisms",
    "default": "PLAIN"
  }, {
    type: "longstr",
    name: "locales",
    "default": "en_US"
  } ]
};

module.exports.ConnectionStartOk = 655371;

var methodInfoConnectionStartOk = module.exports.methodInfoConnectionStartOk = {
  id: 655371,
  name: "ConnectionStartOk",
  args: [ {
    type: "table",
    name: "clientProperties"
  }, {
    type: "shortstr",
    name: "mechanism",
    "default": "PLAIN"
  }, {
    type: "longstr",
    name: "response"
  }, {
    type: "shortstr",
    name: "locale",
    "default": "en_US"
  } ]
};

module.exports.ConnectionSecure = 655380;

var methodInfoConnectionSecure = module.exports.methodInfoConnectionSecure = {
  id: 655380,
  name: "ConnectionSecure",
  args: [ {
    type: "longstr",
    name: "challenge"
  } ]
};

module.exports.ConnectionSecureOk = 655381;

var methodInfoConnectionSecureOk = module.exports.methodInfoConnectionSecureOk = {
  id: 655381,
  name: "ConnectionSecureOk",
  args: [ {
    type: "longstr",
    name: "response"
  } ]
};

module.exports.ConnectionTune = 655390;

var methodInfoConnectionTune = module.exports.methodInfoConnectionTune = {
  id: 655390,
  name: "ConnectionTune",
  args: [ {
    type: "short",
    name: "channelMax",
    "default": 0
  }, {
    type: "long",
    name: "frameMax",
    "default": 0
  }, {
    type: "short",
    name: "heartbeat",
    "default": 0
  } ]
};

module.exports.ConnectionTuneOk = 655391;

var methodInfoConnectionTuneOk = module.exports.methodInfoConnectionTuneOk = {
  id: 655391,
  name: "ConnectionTuneOk",
  args: [ {
    type: "short",
    name: "channelMax",
    "default": 0
  }, {
    type: "long",
    name: "frameMax",
    "default": 0
  }, {
    type: "short",
    name: "heartbeat",
    "default": 0
  } ]
};

module.exports.ConnectionOpen = 655400;

var methodInfoConnectionOpen = module.exports.methodInfoConnectionOpen = {
  id: 655400,
  name: "ConnectionOpen",
  args: [ {
    type: "shortstr",
    name: "virtualHost",
    "default": "/"
  }, {
    type: "shortstr",
    name: "capabilities",
    "default": ""
  }, {
    type: "bit",
    name: "insist",
    "default": !1
  } ]
};

module.exports.ConnectionOpenOk = 655401;

var methodInfoConnectionOpenOk = module.exports.methodInfoConnectionOpenOk = {
  id: 655401,
  name: "ConnectionOpenOk",
  args: [ {
    type: "shortstr",
    name: "knownHosts",
    "default": ""
  } ]
};

module.exports.ConnectionClose = 655410;

var methodInfoConnectionClose = module.exports.methodInfoConnectionClose = {
  id: 655410,
  name: "ConnectionClose",
  args: [ {
    type: "short",
    name: "replyCode"
  }, {
    type: "shortstr",
    name: "replyText",
    "default": ""
  }, {
    type: "short",
    name: "classId"
  }, {
    type: "short",
    name: "methodId"
  } ]
};

module.exports.ConnectionCloseOk = 655411;

var methodInfoConnectionCloseOk = module.exports.methodInfoConnectionCloseOk = {
  id: 655411,
  name: "ConnectionCloseOk",
  args: []
};

module.exports.ConnectionBlocked = 655420;

var methodInfoConnectionBlocked = module.exports.methodInfoConnectionBlocked = {
  id: 655420,
  name: "ConnectionBlocked",
  args: [ {
    type: "shortstr",
    name: "reason",
    "default": ""
  } ]
};

module.exports.ConnectionUnblocked = 655421;

var methodInfoConnectionUnblocked = module.exports.methodInfoConnectionUnblocked = {
  id: 655421,
  name: "ConnectionUnblocked",
  args: []
};

module.exports.ChannelOpen = 1310730;

var methodInfoChannelOpen = module.exports.methodInfoChannelOpen = {
  id: 1310730,
  name: "ChannelOpen",
  args: [ {
    type: "shortstr",
    name: "outOfBand",
    "default": ""
  } ]
};

module.exports.ChannelOpenOk = 1310731;

var methodInfoChannelOpenOk = module.exports.methodInfoChannelOpenOk = {
  id: 1310731,
  name: "ChannelOpenOk",
  args: [ {
    type: "longstr",
    name: "channelId",
    "default": ""
  } ]
};

module.exports.ChannelFlow = 1310740;

var methodInfoChannelFlow = module.exports.methodInfoChannelFlow = {
  id: 1310740,
  name: "ChannelFlow",
  args: [ {
    type: "bit",
    name: "active"
  } ]
};

module.exports.ChannelFlowOk = 1310741;

var methodInfoChannelFlowOk = module.exports.methodInfoChannelFlowOk = {
  id: 1310741,
  name: "ChannelFlowOk",
  args: [ {
    type: "bit",
    name: "active"
  } ]
};

module.exports.ChannelClose = 1310760;

var methodInfoChannelClose = module.exports.methodInfoChannelClose = {
  id: 1310760,
  name: "ChannelClose",
  args: [ {
    type: "short",
    name: "replyCode"
  }, {
    type: "shortstr",
    name: "replyText",
    "default": ""
  }, {
    type: "short",
    name: "classId"
  }, {
    type: "short",
    name: "methodId"
  } ]
};

module.exports.ChannelCloseOk = 1310761;

var methodInfoChannelCloseOk = module.exports.methodInfoChannelCloseOk = {
  id: 1310761,
  name: "ChannelCloseOk",
  args: []
};

module.exports.AccessRequest = 1966090;

var methodInfoAccessRequest = module.exports.methodInfoAccessRequest = {
  id: 1966090,
  name: "AccessRequest",
  args: [ {
    type: "shortstr",
    name: "realm",
    "default": "/data"
  }, {
    type: "bit",
    name: "exclusive",
    "default": !1
  }, {
    type: "bit",
    name: "passive",
    "default": !0
  }, {
    type: "bit",
    name: "active",
    "default": !0
  }, {
    type: "bit",
    name: "write",
    "default": !0
  }, {
    type: "bit",
    name: "read",
    "default": !0
  } ]
};

module.exports.AccessRequestOk = 1966091;

var methodInfoAccessRequestOk = module.exports.methodInfoAccessRequestOk = {
  id: 1966091,
  name: "AccessRequestOk",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 1
  } ]
};

module.exports.ExchangeDeclare = 2621450;

var methodInfoExchangeDeclare = module.exports.methodInfoExchangeDeclare = {
  id: 2621450,
  name: "ExchangeDeclare",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 0
  }, {
    type: "shortstr",
    name: "exchange"
  }, {
    type: "shortstr",
    name: "type",
    "default": "direct"
  }, {
    type: "bit",
    name: "passive",
    "default": !1
  }, {
    type: "bit",
    name: "durable",
    "default": !1
  }, {
    type: "bit",
    name: "autoDelete",
    "default": !1
  }, {
    type: "bit",
    name: "internal",
    "default": !1
  }, {
    type: "bit",
    name: "nowait",
    "default": !1
  }, {
    type: "table",
    name: "arguments",
    "default": {}
  } ]
};

module.exports.ExchangeDeclareOk = 2621451;

var methodInfoExchangeDeclareOk = module.exports.methodInfoExchangeDeclareOk = {
  id: 2621451,
  name: "ExchangeDeclareOk",
  args: []
};

module.exports.ExchangeDelete = 2621460;

var methodInfoExchangeDelete = module.exports.methodInfoExchangeDelete = {
  id: 2621460,
  name: "ExchangeDelete",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 0
  }, {
    type: "shortstr",
    name: "exchange"
  }, {
    type: "bit",
    name: "ifUnused",
    "default": !1
  }, {
    type: "bit",
    name: "nowait",
    "default": !1
  } ]
};

module.exports.ExchangeDeleteOk = 2621461;

var methodInfoExchangeDeleteOk = module.exports.methodInfoExchangeDeleteOk = {
  id: 2621461,
  name: "ExchangeDeleteOk",
  args: []
};

module.exports.ExchangeBind = 2621470;

var methodInfoExchangeBind = module.exports.methodInfoExchangeBind = {
  id: 2621470,
  name: "ExchangeBind",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 0
  }, {
    type: "shortstr",
    name: "destination"
  }, {
    type: "shortstr",
    name: "source"
  }, {
    type: "shortstr",
    name: "routingKey",
    "default": ""
  }, {
    type: "bit",
    name: "nowait",
    "default": !1
  }, {
    type: "table",
    name: "arguments",
    "default": {}
  } ]
};

module.exports.ExchangeBindOk = 2621471;

var methodInfoExchangeBindOk = module.exports.methodInfoExchangeBindOk = {
  id: 2621471,
  name: "ExchangeBindOk",
  args: []
};

module.exports.ExchangeUnbind = 2621480;

var methodInfoExchangeUnbind = module.exports.methodInfoExchangeUnbind = {
  id: 2621480,
  name: "ExchangeUnbind",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 0
  }, {
    type: "shortstr",
    name: "destination"
  }, {
    type: "shortstr",
    name: "source"
  }, {
    type: "shortstr",
    name: "routingKey",
    "default": ""
  }, {
    type: "bit",
    name: "nowait",
    "default": !1
  }, {
    type: "table",
    name: "arguments",
    "default": {}
  } ]
};

module.exports.ExchangeUnbindOk = 2621491;

var methodInfoExchangeUnbindOk = module.exports.methodInfoExchangeUnbindOk = {
  id: 2621491,
  name: "ExchangeUnbindOk",
  args: []
};

module.exports.QueueDeclare = 3276810;

var methodInfoQueueDeclare = module.exports.methodInfoQueueDeclare = {
  id: 3276810,
  name: "QueueDeclare",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 0
  }, {
    type: "shortstr",
    name: "queue",
    "default": ""
  }, {
    type: "bit",
    name: "passive",
    "default": !1
  }, {
    type: "bit",
    name: "durable",
    "default": !1
  }, {
    type: "bit",
    name: "exclusive",
    "default": !1
  }, {
    type: "bit",
    name: "autoDelete",
    "default": !1
  }, {
    type: "bit",
    name: "nowait",
    "default": !1
  }, {
    type: "table",
    name: "arguments",
    "default": {}
  } ]
};

module.exports.QueueDeclareOk = 3276811;

var methodInfoQueueDeclareOk = module.exports.methodInfoQueueDeclareOk = {
  id: 3276811,
  name: "QueueDeclareOk",
  args: [ {
    type: "shortstr",
    name: "queue"
  }, {
    type: "long",
    name: "messageCount"
  }, {
    type: "long",
    name: "consumerCount"
  } ]
};

module.exports.QueueBind = 3276820;

var methodInfoQueueBind = module.exports.methodInfoQueueBind = {
  id: 3276820,
  name: "QueueBind",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 0
  }, {
    type: "shortstr",
    name: "queue",
    "default": ""
  }, {
    type: "shortstr",
    name: "exchange"
  }, {
    type: "shortstr",
    name: "routingKey",
    "default": ""
  }, {
    type: "bit",
    name: "nowait",
    "default": !1
  }, {
    type: "table",
    name: "arguments",
    "default": {}
  } ]
};

module.exports.QueueBindOk = 3276821;

var methodInfoQueueBindOk = module.exports.methodInfoQueueBindOk = {
  id: 3276821,
  name: "QueueBindOk",
  args: []
};

module.exports.QueuePurge = 3276830;

var methodInfoQueuePurge = module.exports.methodInfoQueuePurge = {
  id: 3276830,
  name: "QueuePurge",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 0
  }, {
    type: "shortstr",
    name: "queue",
    "default": ""
  }, {
    type: "bit",
    name: "nowait",
    "default": !1
  } ]
};

module.exports.QueuePurgeOk = 3276831;

var methodInfoQueuePurgeOk = module.exports.methodInfoQueuePurgeOk = {
  id: 3276831,
  name: "QueuePurgeOk",
  args: [ {
    type: "long",
    name: "messageCount"
  } ]
};

module.exports.QueueDelete = 3276840;

var methodInfoQueueDelete = module.exports.methodInfoQueueDelete = {
  id: 3276840,
  name: "QueueDelete",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 0
  }, {
    type: "shortstr",
    name: "queue",
    "default": ""
  }, {
    type: "bit",
    name: "ifUnused",
    "default": !1
  }, {
    type: "bit",
    name: "ifEmpty",
    "default": !1
  }, {
    type: "bit",
    name: "nowait",
    "default": !1
  } ]
};

module.exports.QueueDeleteOk = 3276841;

var methodInfoQueueDeleteOk = module.exports.methodInfoQueueDeleteOk = {
  id: 3276841,
  name: "QueueDeleteOk",
  args: [ {
    type: "long",
    name: "messageCount"
  } ]
};

module.exports.QueueUnbind = 3276850;

var methodInfoQueueUnbind = module.exports.methodInfoQueueUnbind = {
  id: 3276850,
  name: "QueueUnbind",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 0
  }, {
    type: "shortstr",
    name: "queue",
    "default": ""
  }, {
    type: "shortstr",
    name: "exchange"
  }, {
    type: "shortstr",
    name: "routingKey",
    "default": ""
  }, {
    type: "table",
    name: "arguments",
    "default": {}
  } ]
};

module.exports.QueueUnbindOk = 3276851;

var methodInfoQueueUnbindOk = module.exports.methodInfoQueueUnbindOk = {
  id: 3276851,
  name: "QueueUnbindOk",
  args: []
};

module.exports.BasicQos = 3932170;

var methodInfoBasicQos = module.exports.methodInfoBasicQos = {
  id: 3932170,
  name: "BasicQos",
  args: [ {
    type: "long",
    name: "prefetchSize",
    "default": 0
  }, {
    type: "short",
    name: "prefetchCount",
    "default": 0
  }, {
    type: "bit",
    name: "global",
    "default": !1
  } ]
};

module.exports.BasicQosOk = 3932171;

var methodInfoBasicQosOk = module.exports.methodInfoBasicQosOk = {
  id: 3932171,
  name: "BasicQosOk",
  args: []
};

module.exports.BasicConsume = 3932180;

var methodInfoBasicConsume = module.exports.methodInfoBasicConsume = {
  id: 3932180,
  name: "BasicConsume",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 0
  }, {
    type: "shortstr",
    name: "queue",
    "default": ""
  }, {
    type: "shortstr",
    name: "consumerTag",
    "default": ""
  }, {
    type: "bit",
    name: "noLocal",
    "default": !1
  }, {
    type: "bit",
    name: "noAck",
    "default": !1
  }, {
    type: "bit",
    name: "exclusive",
    "default": !1
  }, {
    type: "bit",
    name: "nowait",
    "default": !1
  }, {
    type: "table",
    name: "arguments",
    "default": {}
  } ]
};

module.exports.BasicConsumeOk = 3932181;

var methodInfoBasicConsumeOk = module.exports.methodInfoBasicConsumeOk = {
  id: 3932181,
  name: "BasicConsumeOk",
  args: [ {
    type: "shortstr",
    name: "consumerTag"
  } ]
};

module.exports.BasicCancel = 3932190;

var methodInfoBasicCancel = module.exports.methodInfoBasicCancel = {
  id: 3932190,
  name: "BasicCancel",
  args: [ {
    type: "shortstr",
    name: "consumerTag"
  }, {
    type: "bit",
    name: "nowait",
    "default": !1
  } ]
};

module.exports.BasicCancelOk = 3932191;

var methodInfoBasicCancelOk = module.exports.methodInfoBasicCancelOk = {
  id: 3932191,
  name: "BasicCancelOk",
  args: [ {
    type: "shortstr",
    name: "consumerTag"
  } ]
};

module.exports.BasicPublish = 3932200;

var methodInfoBasicPublish = module.exports.methodInfoBasicPublish = {
  id: 3932200,
  name: "BasicPublish",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 0
  }, {
    type: "shortstr",
    name: "exchange",
    "default": ""
  }, {
    type: "shortstr",
    name: "routingKey",
    "default": ""
  }, {
    type: "bit",
    name: "mandatory",
    "default": !1
  }, {
    type: "bit",
    name: "immediate",
    "default": !1
  } ]
};

module.exports.BasicReturn = 3932210;

var methodInfoBasicReturn = module.exports.methodInfoBasicReturn = {
  id: 3932210,
  name: "BasicReturn",
  args: [ {
    type: "short",
    name: "replyCode"
  }, {
    type: "shortstr",
    name: "replyText",
    "default": ""
  }, {
    type: "shortstr",
    name: "exchange"
  }, {
    type: "shortstr",
    name: "routingKey"
  } ]
};

module.exports.BasicDeliver = 3932220;

var methodInfoBasicDeliver = module.exports.methodInfoBasicDeliver = {
  id: 3932220,
  name: "BasicDeliver",
  args: [ {
    type: "shortstr",
    name: "consumerTag"
  }, {
    type: "longlong",
    name: "deliveryTag"
  }, {
    type: "bit",
    name: "redelivered",
    "default": !1
  }, {
    type: "shortstr",
    name: "exchange"
  }, {
    type: "shortstr",
    name: "routingKey"
  } ]
};

module.exports.BasicGet = 3932230;

var methodInfoBasicGet = module.exports.methodInfoBasicGet = {
  id: 3932230,
  name: "BasicGet",
  args: [ {
    type: "short",
    name: "ticket",
    "default": 0
  }, {
    type: "shortstr",
    name: "queue",
    "default": ""
  }, {
    type: "bit",
    name: "noAck",
    "default": !1
  } ]
};

module.exports.BasicGetOk = 3932231;

var methodInfoBasicGetOk = module.exports.methodInfoBasicGetOk = {
  id: 3932231,
  name: "BasicGetOk",
  args: [ {
    type: "longlong",
    name: "deliveryTag"
  }, {
    type: "bit",
    name: "redelivered",
    "default": !1
  }, {
    type: "shortstr",
    name: "exchange"
  }, {
    type: "shortstr",
    name: "routingKey"
  }, {
    type: "long",
    name: "messageCount"
  } ]
};

module.exports.BasicGetEmpty = 3932232;

var methodInfoBasicGetEmpty = module.exports.methodInfoBasicGetEmpty = {
  id: 3932232,
  name: "BasicGetEmpty",
  args: [ {
    type: "shortstr",
    name: "clusterId",
    "default": ""
  } ]
};

module.exports.BasicAck = 3932240;

var methodInfoBasicAck = module.exports.methodInfoBasicAck = {
  id: 3932240,
  name: "BasicAck",
  args: [ {
    type: "longlong",
    name: "deliveryTag",
    "default": 0
  }, {
    type: "bit",
    name: "multiple",
    "default": !1
  } ]
};

module.exports.BasicReject = 3932250;

var methodInfoBasicReject = module.exports.methodInfoBasicReject = {
  id: 3932250,
  name: "BasicReject",
  args: [ {
    type: "longlong",
    name: "deliveryTag"
  }, {
    type: "bit",
    name: "requeue",
    "default": !0
  } ]
};

module.exports.BasicRecoverAsync = 3932260;

var methodInfoBasicRecoverAsync = module.exports.methodInfoBasicRecoverAsync = {
  id: 3932260,
  name: "BasicRecoverAsync",
  args: [ {
    type: "bit",
    name: "requeue",
    "default": !1
  } ]
};

module.exports.BasicRecover = 3932270;

var methodInfoBasicRecover = module.exports.methodInfoBasicRecover = {
  id: 3932270,
  name: "BasicRecover",
  args: [ {
    type: "bit",
    name: "requeue",
    "default": !1
  } ]
};

module.exports.BasicRecoverOk = 3932271;

var methodInfoBasicRecoverOk = module.exports.methodInfoBasicRecoverOk = {
  id: 3932271,
  name: "BasicRecoverOk",
  args: []
};

module.exports.BasicNack = 3932280;

var methodInfoBasicNack = module.exports.methodInfoBasicNack = {
  id: 3932280,
  name: "BasicNack",
  args: [ {
    type: "longlong",
    name: "deliveryTag",
    "default": 0
  }, {
    type: "bit",
    name: "multiple",
    "default": !1
  }, {
    type: "bit",
    name: "requeue",
    "default": !0
  } ]
};

module.exports.TxSelect = 5898250;

var methodInfoTxSelect = module.exports.methodInfoTxSelect = {
  id: 5898250,
  name: "TxSelect",
  args: []
};

module.exports.TxSelectOk = 5898251;

var methodInfoTxSelectOk = module.exports.methodInfoTxSelectOk = {
  id: 5898251,
  name: "TxSelectOk",
  args: []
};

module.exports.TxCommit = 5898260;

var methodInfoTxCommit = module.exports.methodInfoTxCommit = {
  id: 5898260,
  name: "TxCommit",
  args: []
};

module.exports.TxCommitOk = 5898261;

var methodInfoTxCommitOk = module.exports.methodInfoTxCommitOk = {
  id: 5898261,
  name: "TxCommitOk",
  args: []
};

module.exports.TxRollback = 5898270;

var methodInfoTxRollback = module.exports.methodInfoTxRollback = {
  id: 5898270,
  name: "TxRollback",
  args: []
};

module.exports.TxRollbackOk = 5898271;

var methodInfoTxRollbackOk = module.exports.methodInfoTxRollbackOk = {
  id: 5898271,
  name: "TxRollbackOk",
  args: []
};

module.exports.ConfirmSelect = 5570570;

var methodInfoConfirmSelect = module.exports.methodInfoConfirmSelect = {
  id: 5570570,
  name: "ConfirmSelect",
  args: [ {
    type: "bit",
    name: "nowait",
    "default": !1
  } ]
};

module.exports.ConfirmSelectOk = 5570571;

var methodInfoConfirmSelectOk = module.exports.methodInfoConfirmSelectOk = {
  id: 5570571,
  name: "ConfirmSelectOk",
  args: []
};

module.exports.BasicProperties = 60;

var propertiesInfoBasicProperties = module.exports.propertiesInfoBasicProperties = {
  id: 60,
  name: "BasicProperties",
  args: [ {
    type: "shortstr",
    name: "contentType"
  }, {
    type: "shortstr",
    name: "contentEncoding"
  }, {
    type: "table",
    name: "headers"
  }, {
    type: "octet",
    name: "deliveryMode"
  }, {
    type: "octet",
    name: "priority"
  }, {
    type: "shortstr",
    name: "correlationId"
  }, {
    type: "shortstr",
    name: "replyTo"
  }, {
    type: "shortstr",
    name: "expiration"
  }, {
    type: "shortstr",
    name: "messageId"
  }, {
    type: "timestamp",
    name: "timestamp"
  }, {
    type: "shortstr",
    name: "type"
  }, {
    type: "shortstr",
    name: "userId"
  }, {
    type: "shortstr",
    name: "appId"
  }, {
    type: "shortstr",
    name: "clusterId"
  } ]
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(13);

// JavaScript is numerically challenged
var SHIFT_LEFT_32 = (1 << 16) * (1 << 16);
var SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;

// The maximum contiguous integer that can be held in a IEEE754 double
var MAX_INT = 0x1fffffffffffff;

function isContiguousInt(val) {
    return val <= MAX_INT && val >= -MAX_INT;
}

function assertContiguousInt(val) {
    assert(isContiguousInt(val), "number cannot be represented as a contiguous integer");
}

module.exports.isContiguousInt = isContiguousInt;
module.exports.assertContiguousInt = assertContiguousInt;

// Fill in the regular procedures
['UInt', 'Int'].forEach(function (sign) {
  var suffix = sign + '8';
  module.exports['read' + suffix] =
    Buffer.prototype['read' + suffix].call;
  module.exports['write' + suffix] =
    Buffer.prototype['write' + suffix].call;
  
  ['16', '32'].forEach(function (size) {
    ['LE', 'BE'].forEach(function (endian) {
      var suffix = sign + size + endian;
      var read = Buffer.prototype['read' + suffix];
      module.exports['read' + suffix] =
        function (buf, offset, noAssert) {
          return read.call(buf, offset, noAssert);
        };
      var write = Buffer.prototype['write' + suffix];
      module.exports['write' + suffix] =
        function (buf, val, offset, noAssert) {
          return write.call(buf, val, offset, noAssert);
        };
    });
  });
});

// Check that a value is an integer within the given range
function check_int(val, min, max) {
    assert.ok(typeof(val) == 'number' && val >= min && val <= max && Math.floor(val) === val, "not a number in the required range");
}

function readUInt24BE(buf, offset, noAssert) {
  return buf.readUInt8(offset, noAssert) << 16 | buf.readUInt16BE(offset + 1, noAssert);
}
module.exports.readUInt24BE = readUInt24BE;

function writeUInt24BE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, 0, 0xffffff);
        assert.ok(offset + 3 <= buf.length, "attempt to write beyond end of buffer");
    }

    buf.writeUInt8(val >>> 16, offset, noAssert);
    buf.writeUInt16BE(val & 0xffff, offset + 1, noAssert);
}
module.exports.writeUInt24BE = writeUInt24BE;

function readUInt40BE(buf, offset, noAssert) {
    return (buf.readUInt8(offset, noAssert) || 0) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 1, noAssert);
}
module.exports.readUInt40BE = readUInt40BE;

function writeUInt40BE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, 0, 0xffffffffff);
        assert.ok(offset + 5 <= buf.length, "attempt to write beyond end of buffer");
    }

    buf.writeUInt8(Math.floor(val * SHIFT_RIGHT_32), offset, noAssert);
    buf.writeInt32BE(val & -1, offset + 1, noAssert);
}
module.exports.writeUInt40BE = writeUInt40BE;

function readUInt48BE(buf, offset, noAssert) {
    return buf.readUInt16BE(offset, noAssert) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 2, noAssert);
}
module.exports.readUInt48BE = readUInt48BE;

function writeUInt48BE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, 0, 0xffffffffffff);
        assert.ok(offset + 6 <= buf.length, "attempt to write beyond end of buffer");
    }

    buf.writeUInt16BE(Math.floor(val * SHIFT_RIGHT_32), offset, noAssert);
    buf.writeInt32BE(val & -1, offset + 2, noAssert);
}
module.exports.writeUInt48BE = writeUInt48BE;

function readUInt56BE(buf, offset, noAssert) {
    return ((buf.readUInt8(offset, noAssert) || 0) << 16 | buf.readUInt16BE(offset + 1, noAssert)) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 3, noAssert);
}
module.exports.readUInt56BE = readUInt56BE;

function writeUInt56BE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, 0, 0xffffffffffffff);
        assert.ok(offset + 7 <= buf.length, "attempt to write beyond end of buffer");
    }

    if (val < 0x100000000000000) {
        var hi = Math.floor(val * SHIFT_RIGHT_32);
        buf.writeUInt8(hi >>> 16, offset, noAssert);
        buf.writeUInt16BE(hi & 0xffff, offset + 1, noAssert);
        buf.writeInt32BE(val & -1, offset + 3, noAssert);
    } else {
        // Special case because 2^56-1 gets rounded up to 2^56
        buf[offset] = 0xff;
        buf[offset+1] = 0xff;
        buf[offset+2] = 0xff;
        buf[offset+3] = 0xff;
        buf[offset+4] = 0xff;
        buf[offset+5] = 0xff;
        buf[offset+6] = 0xff;
    }
}
module.exports.writeUInt56BE = writeUInt56BE;

function readUInt64BE(buf, offset, noAssert) {
    return buf.readUInt32BE(offset, noAssert) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 4, noAssert);
}
module.exports.readUInt64BE = readUInt64BE;

function writeUInt64BE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, 0, 0xffffffffffffffff);
        assert.ok(offset + 8 <= buf.length, "attempt to write beyond end of buffer");
    }

    if (val < 0x10000000000000000) {
        buf.writeUInt32BE(Math.floor(val * SHIFT_RIGHT_32), offset, noAssert);
        buf.writeInt32BE(val & -1, offset + 4, noAssert);
    } else {
        // Special case because 2^64-1 gets rounded up to 2^64
        buf[offset] = 0xff;
        buf[offset+1] = 0xff;
        buf[offset+2] = 0xff;
        buf[offset+3] = 0xff;
        buf[offset+4] = 0xff;
        buf[offset+5] = 0xff;
        buf[offset+6] = 0xff;
        buf[offset+7] = 0xff;
    }
}
module.exports.writeUInt64BE = writeUInt64BE;

function readUInt24LE(buf, offset, noAssert) {
    return buf.readUInt8(offset + 2, noAssert) << 16 | buf.readUInt16LE(offset, noAssert);
}
module.exports.readUInt24LE = readUInt24LE;

function writeUInt24LE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, 0, 0xffffff);
        assert.ok(offset + 3 <= buf.length, "attempt to write beyond end of buffer");
    }

    buf.writeUInt16LE(val & 0xffff, offset, noAssert);
    buf.writeUInt8(val >>> 16, offset + 2, noAssert);
}
module.exports.writeUInt24LE = writeUInt24LE;

function readUInt40LE(buf, offset, noAssert) {
    return (buf.readUInt8(offset + 4, noAssert) || 0) * SHIFT_LEFT_32 + buf.readUInt32LE(offset, noAssert);
}
module.exports.readUInt40LE = readUInt40LE;

function writeUInt40LE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, 0, 0xffffffffff);
        assert.ok(offset + 5 <= buf.length, "attempt to write beyond end of buffer");
    }

    buf.writeInt32LE(val & -1, offset, noAssert);
    buf.writeUInt8(Math.floor(val * SHIFT_RIGHT_32), offset + 4, noAssert);
}
module.exports.writeUInt40LE = writeUInt40LE;

function readUInt48LE(buf, offset, noAssert) {
    return buf.readUInt16LE(offset + 4, noAssert) * SHIFT_LEFT_32 + buf.readUInt32LE(offset, noAssert);
}
module.exports.readUInt48LE = readUInt48LE;

function writeUInt48LE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, 0, 0xffffffffffff);
        assert.ok(offset + 6 <= buf.length, "attempt to write beyond end of buffer");
    }

    buf.writeInt32LE(val & -1, offset, noAssert);
    buf.writeUInt16LE(Math.floor(val * SHIFT_RIGHT_32), offset + 4, noAssert);
}
module.exports.writeUInt48LE = writeUInt48LE;

function readUInt56LE(buf, offset, noAssert) {
    return ((buf.readUInt8(offset + 6, noAssert) || 0) << 16 | buf.readUInt16LE(offset + 4, noAssert)) * SHIFT_LEFT_32 + buf.readUInt32LE(offset, noAssert);
}
module.exports.readUInt56LE = readUInt56LE;

function writeUInt56LE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, 0, 0xffffffffffffff);
        assert.ok(offset + 7 <= buf.length, "attempt to write beyond end of buffer");
    }

    if (val < 0x100000000000000) {
        buf.writeInt32LE(val & -1, offset, noAssert);
        var hi = Math.floor(val * SHIFT_RIGHT_32);
        buf.writeUInt16LE(hi & 0xffff, offset + 4, noAssert);
        buf.writeUInt8(hi >>> 16, offset + 6, noAssert);
    } else {
        // Special case because 2^56-1 gets rounded up to 2^56
        buf[offset] = 0xff;
        buf[offset+1] = 0xff;
        buf[offset+2] = 0xff;
        buf[offset+3] = 0xff;
        buf[offset+4] = 0xff;
        buf[offset+5] = 0xff;
        buf[offset+6] = 0xff;
    }
}
module.exports.writeUInt56LE = writeUInt56LE;

function readUInt64LE(buf, offset, noAssert) {
    return buf.readUInt32LE(offset + 4, noAssert) * SHIFT_LEFT_32 + buf.readUInt32LE(offset, noAssert);
}
module.exports.readUInt64LE = readUInt64LE;

function writeUInt64LE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, 0, 0xffffffffffffffff);
        assert.ok(offset + 8 <= buf.length, "attempt to write beyond end of buffer");
    }

    if (val < 0x10000000000000000) {
        buf.writeInt32LE(val & -1, offset, noAssert);
        buf.writeUInt32LE(Math.floor(val * SHIFT_RIGHT_32), offset + 4, noAssert);
    } else {
        // Special case because 2^64-1 gets rounded up to 2^64
        buf[offset] = 0xff;
        buf[offset+1] = 0xff;
        buf[offset+2] = 0xff;
        buf[offset+3] = 0xff;
        buf[offset+4] = 0xff;
        buf[offset+5] = 0xff;
        buf[offset+6] = 0xff;
        buf[offset+7] = 0xff;
    }
}
module.exports.writeUInt64LE = writeUInt64LE;


function readInt24BE(buf, offset, noAssert) {
    return (buf.readInt8(offset, noAssert) << 16) + buf.readUInt16BE(offset + 1, noAssert);
}
module.exports.readInt24BE = readInt24BE;

function writeInt24BE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, -0x800000, 0x7fffff);
        assert.ok(offset + 3 <= buf.length, "attempt to write beyond end of buffer");
    }

    buf.writeInt8(val >> 16, offset, noAssert);
    buf.writeUInt16BE(val & 0xffff, offset + 1, noAssert);
}
module.exports.writeInt24BE = writeInt24BE;

function readInt40BE(buf, offset, noAssert) {
    return (buf.readInt8(offset, noAssert) || 0) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 1, noAssert);
}
module.exports.readInt40BE = readInt40BE;

function writeInt40BE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, -0x8000000000, 0x7fffffffff);
        assert.ok(offset + 5 <= buf.length, "attempt to write beyond end of buffer");
    }

    buf.writeInt8(Math.floor(val * SHIFT_RIGHT_32), offset, noAssert);
    buf.writeInt32BE(val & -1, offset + 1, noAssert);
}
module.exports.writeInt40BE = writeInt40BE;

function readInt48BE(buf, offset, noAssert) {
    return buf.readInt16BE(offset, noAssert) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 2, noAssert);
}
module.exports.readInt48BE = readInt48BE;

function writeInt48BE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, -0x800000000000, 0x7fffffffffff);
        assert.ok(offset + 6 <= buf.length, "attempt to write beyond end of buffer");
    }

    buf.writeInt16BE(Math.floor(val * SHIFT_RIGHT_32), offset, noAssert);
    buf.writeInt32BE(val & -1, offset + 2, noAssert);
}
module.exports.writeInt48BE = writeInt48BE;

function readInt56BE(buf, offset, noAssert) {
    return (((buf.readInt8(offset, noAssert) || 0) << 16) + buf.readUInt16BE(offset + 1, noAssert)) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 3, noAssert);
}
module.exports.readInt56BE = readInt56BE;

function writeInt56BE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, -0x800000000000000, 0x7fffffffffffff);
        assert.ok(offset + 7 <= buf.length, "attempt to write beyond end of buffer");
    }

    if (val < 0x80000000000000) {
        var hi = Math.floor(val * SHIFT_RIGHT_32);
        buf.writeInt8(hi >> 16, offset, noAssert);
        buf.writeUInt16BE(hi & 0xffff, offset + 1, noAssert);
        buf.writeInt32BE(val & -1, offset + 3, noAssert);
    } else {
        // Special case because 2^55-1 gets rounded up to 2^55
        buf[offset] = 0x7f;
        buf[offset+1] = 0xff;
        buf[offset+2] = 0xff;
        buf[offset+3] = 0xff;
        buf[offset+4] = 0xff;
        buf[offset+5] = 0xff;
        buf[offset+6] = 0xff;
    }
}
module.exports.writeInt56BE = writeInt56BE;

function readInt64BE(buf, offset, noAssert) {
    return buf.readInt32BE(offset, noAssert) * SHIFT_LEFT_32 + buf.readUInt32BE(offset + 4, noAssert);
}
module.exports.readInt64BE = readInt64BE;

function writeInt64BE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, -0x800000000000000000, 0x7fffffffffffffff);
        assert.ok(offset + 8 <= buf.length, "attempt to write beyond end of buffer");
    }

    if (val < 0x8000000000000000) {
        buf.writeInt32BE(Math.floor(val * SHIFT_RIGHT_32), offset, noAssert);
        buf.writeInt32BE(val & -1, offset + 4, noAssert);
    } else {
        // Special case because 2^63-1 gets rounded up to 2^63
        buf[offset] = 0x7f;
        buf[offset+1] = 0xff;
        buf[offset+2] = 0xff;
        buf[offset+3] = 0xff;
        buf[offset+4] = 0xff;
        buf[offset+5] = 0xff;
        buf[offset+6] = 0xff;
        buf[offset+7] = 0xff;
    }
}
module.exports.writeInt64BE = writeInt64BE;

function readInt24LE(buf, offset, noAssert) {
    return (buf.readInt8(offset + 2, noAssert) << 16) + buf.readUInt16LE(offset, noAssert);
}
module.exports.readInt24LE = readInt24LE;

function writeInt24LE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, -0x800000, 0x7fffff);
        assert.ok(offset + 3 <= buf.length, "attempt to write beyond end of buffer");
    }

    buf.writeUInt16LE(val & 0xffff, offset, noAssert);
    buf.writeInt8(val >> 16, offset + 2, noAssert);
}
module.exports.writeInt24LE = writeInt24LE;

function readInt40LE(buf, offset, noAssert) {
    return (buf.readInt8(offset + 4, noAssert) || 0) * SHIFT_LEFT_32 + buf.readUInt32LE(offset, noAssert);
}
module.exports.readInt40LE = readInt40LE;

function writeInt40LE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, -0x8000000000, 0x7fffffffff);
        assert.ok(offset + 5 <= buf.length, "attempt to write beyond end of buffer");
    }

    buf.writeInt32LE(val & -1, offset, noAssert);
    buf.writeInt8(Math.floor(val * SHIFT_RIGHT_32), offset + 4, noAssert);
}
module.exports.writeInt40LE = writeInt40LE;

function readInt48LE(buf, offset, noAssert) {
    return buf.readInt16LE(offset + 4, noAssert) * SHIFT_LEFT_32 + buf.readUInt32LE(offset, noAssert);
}
module.exports.readInt48LE = readInt48LE;

function writeInt48LE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, -0x800000000000, 0x7fffffffffff);
        assert.ok(offset + 6 <= buf.length, "attempt to write beyond end of buffer");
    }

    buf.writeInt32LE(val & -1, offset, noAssert);
    buf.writeInt16LE(Math.floor(val * SHIFT_RIGHT_32), offset + 4, noAssert);
}
module.exports.writeInt48LE = writeInt48LE;

function readInt56LE(buf, offset, noAssert) {
    return (((buf.readInt8(offset + 6, noAssert) || 0) << 16) + buf.readUInt16LE(offset + 4, noAssert)) * SHIFT_LEFT_32 + buf.readUInt32LE(offset, noAssert);
}
module.exports.readInt56LE = readInt56LE;

function writeInt56LE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, -0x80000000000000, 0x7fffffffffffff);
        assert.ok(offset + 7 <= buf.length, "attempt to write beyond end of buffer");
    }

    if (val < 0x80000000000000) {
        buf.writeInt32LE(val & -1, offset, noAssert);
        var hi = Math.floor(val * SHIFT_RIGHT_32);
        buf.writeUInt16LE(hi & 0xffff, offset + 4, noAssert);
        buf.writeInt8(hi >> 16, offset + 6, noAssert);
    } else {
        // Special case because 2^55-1 gets rounded up to 2^55
        buf[offset] = 0xff;
        buf[offset+1] = 0xff;
        buf[offset+2] = 0xff;
        buf[offset+3] = 0xff;
        buf[offset+4] = 0xff;
        buf[offset+5] = 0xff;
        buf[offset+6] = 0x7f;
    }
}
module.exports.writeInt56LE = writeInt56LE;

function readInt64LE(buf, offset, noAssert) {
    return buf.readInt32LE(offset + 4, noAssert) * SHIFT_LEFT_32 + buf.readUInt32LE(offset, noAssert);
}
module.exports.readInt64LE = readInt64LE;

function writeInt64LE(buf, val, offset, noAssert) {
    if (!noAssert) {
        check_int(val, -0x8000000000000000, 0x7fffffffffffffff);
        assert.ok(offset + 8 <= buf.length, "attempt to write beyond end of buffer");
    }

    if (val < 0x8000000000000000) {
        buf.writeInt32LE(val & -1, offset, noAssert);
        buf.writeInt32LE(Math.floor(val * SHIFT_RIGHT_32), offset + 4, noAssert);
    } else {
        // Special case because 2^55-1 gets rounded up to 2^55
        buf[offset] = 0xff;
        buf[offset+1] = 0xff;
        buf[offset+2] = 0xff;
        buf[offset+3] = 0xff;
        buf[offset+4] = 0xff;
        buf[offset+5] = 0xff;
        buf[offset+6] = 0xff;
        buf[offset+7] = 0x7f;
    }
}
module.exports.writeInt64LE = writeInt64LE;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

try {
  var util = __webpack_require__(1);
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  module.exports = __webpack_require__(38);
}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(1).inherits;

function trimStack(stack, num) {
  return stack && stack.split('\n').slice(num).join('\n');
}

function IllegalOperationError(msg, stack) {
  var tmp = new Error();
  this.message = msg;
  this.stack = this.toString() + '\n' + trimStack(tmp.stack, 2);
  this.stackAtStateChange = stack;
}
inherits(IllegalOperationError, Error);

IllegalOperationError.prototype.name = 'IllegalOperationError';

function stackCapture(reason) {
  var e = new Error();
  return 'Stack capture: ' + reason + '\n' +
    trimStack(e.stack, 2);
}

module.exports.IllegalOperationError = IllegalOperationError;
module.exports.stackCapture = stackCapture;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Parse patterns in string form into the form we use for interpreting
// (and later, for compiling).



var ast = __webpack_require__(34);
var parser = __webpack_require__(35);

function parse_pattern(string) {
  var segments = parser.parse(string);
  for (var i=0, len = segments.length; i < len; i++) {
    var s = segments[i];
    if (s.string != undefined) {
      segments[i] = ast.string(s.string);
    }
    else if (s.value != undefined) {
      segments[i] = ast.value(s.value, s.size, s.specifiers);
    }
    else if (s.name != undefined) {
      segments[i] = ast.variable(s.name, s.size, s.specifiers);
    }
    else {
      throw "Unknown segment " + s;
    }
  }
  return segments;
}

module.exports.parse = function() {
  var str = [].join.call(arguments, ',');
  return parse_pattern(str);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// -*- js-indent-level: 2 -*-

// Constructors given patterns



var ints = __webpack_require__(7);

// Interpret the pattern, writing values into a buffer
function write(buf, offset, pattern, bindings) {
  for (var i=0, len = pattern.length; i < len; i++) {
    var segment = pattern[i];
    
    switch (segment.type) {
    case 'string':
      offset += buf.write(segment.value, offset, 'utf8');
      break;
    case 'binary':
      offset += writeBinary(segment, buf, offset, bindings);
      break;
    case 'integer':
      offset += writeInteger(segment, buf, offset, bindings);
      break;
    case 'float':
      offset += writeFloat(segment, buf, offset, bindings);
      break;
    }
  }
  return offset;
}

function build(pattern, bindings) {
  var bufsize = size_of(pattern, bindings);
  var buf = new Buffer(bufsize);
  write(buf, 0, pattern, bindings);
  return buf;
}

// In bytes
function size_of_segment(segment, bindings) {
  // size refers to a variable
  if (typeof segment.size === 'string') {
    return (bindings[segment.size] * segment.unit) / 8;
  }
  if (segment.type === 'string') {
    return Buffer.byteLength(segment.value, 'utf8');
  }
  if (segment.type === 'binary' && segment.size === true) {
    var val = bindings[segment.name];
    return val.length;
  }
  return (segment.size * segment.unit) / 8;
}

// size of the to-be-constructed binary, in bytes
function size_of(segments, bindings) {
  var size = 0;
  for (var i=0, len = segments.length; i < len; i++) {
    size += size_of_segment(segments[i], bindings);
  }
  return size;
}

function writeBinary(segment, buf, offset, bindings) {
  var bin = bindings[segment.name];
  var size = size_of_segment(segment, bindings);
  bin.copy(buf, offset, 0, size);
  return size;
}

// TODO in ff might use the noAssert argument to Buffer.write*() but
// need to check that it does the right thing wrt little-endian

function writeInteger(segment, buf, offset, bindings) {
  var value = (segment.name) ? bindings[segment.name] : segment.value;
  var size = size_of_segment(segment, bindings);
  return write_int(buf, value, offset, size, segment.bigendian);
}

function write_int(buf, value, offset, size, bigendian) {
  switch (size) {
  case 1:
    buf.writeUInt8(value, offset);
    break;
  case 2:
    (bigendian) ?
      buf.writeUInt16BE(value, offset) :
      buf.writeUInt16LE(value, offset);
    break;
  case 4:
    (bigendian) ?
      buf.writeUInt32BE(value, offset) :
      buf.writeUInt32LE(value, offset);
    break;
  case 8:
    (bigendian) ?
      ints.writeUInt64BE(buf, value, offset) :
      ints.writeUInt64LE(buf, value, offset);
    break;
  default:
    throw new Error("integer size * unit must be 8, 16, 32 or 64");
  }
  return size;
}

function writeFloat(segment, buf, offset, bindings) {
  var value = (segment.name) ? bindings[segment.name] : segment.value;
  var size = size_of_segment(segment, bindings);
  return write_float(buf, value, offset, size, segment.bigendian);
}

function write_float(buf, value, offset, size, bigendian) {
  if (size === 4) {
    (bigendian) ?
      buf.writeFloatBE(value, offset) :
      buf.writeFloatLE(value, offset);
  }
  else if (size === 8) {
    (bigendian) ?
      buf.writeDoubleBE(value, offset) :
      buf.writeDoubleLE(value, offset);
  }
  else {
    throw new Error("float size * unit must be 32 or 64");
  }
  return size;
}

var parse = __webpack_require__(14).parse;

module.exports.write = write;
module.exports.build = build;
module.exports.write_int = write_int;
module.exports.write_float = write_float;

module.exports.builder = function(pstr) {
  pstr = (arguments.length > 1) ? [].join.call(arguments, ',') : pstr;
  var pattern = parse(pstr);
  return function(vars) {
    return build(pattern, vars);
  };
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The river sweeps through
// Silt and twigs, gravel and leaves
// Driving the wheel on



var defs = __webpack_require__(6);
var constants = defs.constants;
var decode = defs.decode;

var Bits = __webpack_require__(33);

module.exports.PROTOCOL_HEADER = "AMQP" + String.fromCharCode(0, 0, 9, 1);

/*
  Frame format:

  0      1         3             7                size+7 size+8
  +------+---------+-------------+ +------------+ +-----------+
  | type | channel | size        | | payload    | | frame-end |
  +------+---------+-------------+ +------------+ +-----------+
  octet   short     long            size octets    octet

  In general I want to know those first three things straight away, so I
  can discard frames early.

*/

// framing constants
var FRAME_METHOD = constants.FRAME_METHOD,
FRAME_HEARTBEAT = constants.FRAME_HEARTBEAT,
FRAME_HEADER = constants.FRAME_HEADER,
FRAME_BODY = constants.FRAME_BODY,
FRAME_END = constants.FRAME_END;

var bodyCons =
  Bits.builder(FRAME_BODY,
               'channel:16, size:32, payload:size/binary',
               FRAME_END);

// %%% TESTME possibly better to cons the first bit and write the
// second directly, in the absence of IO lists
module.exports.makeBodyFrame = function(channel, payload) {
  return bodyCons({channel: channel, size: payload.length, payload: payload});
};

var frameHeaderPattern = Bits.matcher('type:8', 'channel:16',
                                      'size:32', 'rest/binary');

function parseFrame(bin, max) {
  var fh = frameHeaderPattern(bin);
  if (fh) {
    var size = fh.size, rest = fh.rest;
    if (size > max) {
      throw new Error('Frame size exceeds frame max');
    }
    else if (rest.length > size) {
      if (rest[size] !== FRAME_END)
        throw new Error('Invalid frame');

      return {
        type: fh.type,
        channel: fh.channel,
        size: size,
        payload: rest.slice(0, size),
        rest: rest.slice(size + 1)
      };
    }
  }
  return false;
}

module.exports.parseFrame = parseFrame;

var headerPattern = Bits.matcher('class:16',
                                 '_weight:16',
                                 'size:64',
                                 'flagsAndfields/binary');

var methodPattern = Bits.matcher('id:32, args/binary');

var HEARTBEAT = {channel: 0};

module.exports.decodeFrame = function(frame) {
  var payload = frame.payload;
  switch (frame.type) {
  case FRAME_METHOD:
    var idAndArgs = methodPattern(payload);
    var id = idAndArgs.id;
    var fields = decode(id, idAndArgs.args);
    return {id: id, channel: frame.channel, fields: fields};
  case FRAME_HEADER:
    var parts = headerPattern(payload);
    var id = parts['class'];
    var fields = decode(id, parts.flagsAndfields);
    return {id: id, channel: frame.channel,
            size: parts.size, fields: fields};
  case FRAME_BODY:
    return {channel: frame.channel, content: frame.payload};
  case FRAME_HEARTBEAT:
    return HEARTBEAT;
  default:
    throw new Error('Unknown frame type ' + frame.type);
  }
}

// encoded heartbeat
module.exports.HEARTBEAT_BUF = new Buffer([constants.FRAME_HEARTBEAT,
                                           0, 0, 0, 0, // size = 0
                                           0, 0, // channel = 0
                                           constants.FRAME_END]);

module.exports.HEARTBEAT = HEARTBEAT;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// -*- js-indent: 2 -*-
// Interpreter for bit syntax AST.
// Grammar:
//
// pattern   := segment ("," segment)*
// segment   := (value | var) (":" size)? ("/" specifier ("-" specifier)*)? | string
// var       := "_" | identifier
// size      := integer | var
// specifier := "little" | "big" | "signed" | "unsigned" | "unit" ":" 0..256 | type
// type      := "integer" | "binary" | "float"
//
// where integer has the obvious meaning, and identifier is anything
// other than "_" that fits the JavaScript identifier specification.
//

// We'll use an object to represent each segment, and an array of
// segments for a pattern. We won't try to optimise for groups of
// patterns; we'll just step through each to see if it works. We rely
// a hypothetical prior step to check that it's a valid pattern.

// ? compile to intermediate instructions ?

// A segment looks like
// {
//    type: string, // 'string' is special case
//    size: integer | true, // true means 'all remaining'
//    name: string | null, // (may be '_')
//    value: value | null, // either name OR value
//    unit: integer,
//    signed: boolean,
//    bigendian: boolean
// }



var ints = __webpack_require__(7);

var debug = (process.env.DEBUG) ?
  function(s) { console.log(s); } : function () {};

function parse_int(bin, off, sizeInBytes, bigendian, signed) {
  switch (sizeInBytes) {
  case 1:
    return (signed) ? bin.readInt8(off) : bin.readUInt8(off);
  case 2:
    return (bigendian) ?
      (signed) ? bin.readInt16BE(off) : bin.readUInt16BE(off) :
      (signed) ? bin.readInt16LE(off) : bin.readUInt16LE(off);
  case 4:
    return (bigendian) ?
      (signed) ? bin.readInt32BE(off) : bin.readUInt32BE(off) :
      (signed) ? bin.readInt32LE(off) : bin.readUInt32LE(off);
  case 8:
    return (bigendian) ?
      ((signed) ? ints.readInt64BE : ints.readUInt64BE)(bin, off) :
      ((signed) ? ints.readInt64LE : ints.readUInt64LE)(bin, off);
  default:
    throw "Integers must be 8-, 16-, 32- or 64-bit";
  }
}

function parse_float(bin, off, sizeInBytes, bigendian) {
  switch (sizeInBytes) {
  case 4:
    return (bigendian) ? bin.readFloatBE(off) : bin.readFloatLE(off);
  case 8:
    return (bigendian) ? bin.readDoubleBE(off) : bin.readDoubleLE(off);
  default:
    throw "Floats must be 32- or 64-bit";
  }
}

function size_of(segment, bound) {
  var size = segment.size;
  if (typeof size === 'string') {
    return bound[size];
  }
  else {
    return size;
  }
}

function new_scope(env) {
  function scope() {};
  scope.prototype = env;
  return new scope();
}

function bindings(scope) {
  var s = {};
  for (var k in scope) {
    if (scope.hasOwnProperty(k)) {
      s[k] = scope[k];
    }
  }
  return s;
}

function match(pattern, binary, boundvars) {
  var offset = 0, vars = new_scope(boundvars);
  var binsize = binary.length * 8;

  function skip_bits(segment) {
    debug("skip bits"); debug(segment);
    var size = size_of(segment, vars);
    if (size === true) {
      if (offset % 8 === 0) {
        offset = binsize;
        return true;
      }
      else {
        return false;
      }
    }

    var bits = segment.unit * size;
    if (offset + bits > binsize) {
      return false;
    }
    else {
      offset += bits;
    }
  }

  function get_integer(segment) {
    debug("get_integer"); debug(segment);
    // let's do only multiples of eight bits for now
    var unit = segment.unit, size = size_of(segment, vars);
    var bitsize = size * unit;
    var byteoffset = offset / 8; // NB assumes aligned
    offset += bitsize;
    if (bitsize % 8 > 0 || (offset > binsize)) {
      return false;
    }
    else {
      return parse_int(binary, byteoffset, bitsize / 8,
                       segment.bigendian, segment.signed);
    }
  }

  function get_float(segment) {
    debug("get_float"); debug(segment);
    var unit = segment.unit; var size = size_of(segment, vars);
    var bitsize = size * unit;
    var byteoffset = offset / 8; // assume aligned
    offset += bitsize;
    if (offset > binsize) {
      return false;
    }
    else {
      return parse_float(binary, byteoffset,
                         bitsize / 8, segment.bigendian);
    }
  }

  function get_binary(segment) {
    debug("get_binary"); debug(segment);
    var unit = segment.unit, size = size_of(segment, vars);
    var byteoffset = offset / 8; // NB alignment

    if (size === true) {
      offset = binsize;
      return binary.slice(byteoffset);
    }
    else {
      var bitsize = size * unit;
      if (bitsize % 8 > 0 || (offset + bitsize) > binsize) {
        return false;
      }
      else {
        offset += bitsize;
        return binary.slice(byteoffset, byteoffset + bitsize / 8);
      }
    }
  }

  function get_string(segment) {
    debug("get_string"); debug(segment);
    var len = segment.value.length;
    var byteoffset = offset / 8;

    offset += len * 8;
    if (offset > binsize) {
      return false;
    }
    // FIXME bytes vs UTF8 characters
    return binary.slice(byteoffset, byteoffset + len).toString('utf8');
  }

  var patternlen = pattern.length;
  for (var i = 0;  i < patternlen; i++) {
    var segment = pattern[i];
    var result = false;
    if (segment.name === '_') {
      result = skip_bits(segment);
    }
    else {
      switch (segment.type) {
      case 'string':
        result = get_string(segment);
        break;
      case 'integer':
        result = get_integer(segment);
        break;
      case 'float':
        result = get_float(segment);
        break;
      case 'binary':
        result = get_binary(segment);
        break;
      }

      if (result === false) {
        return false;
      }
      else if (segment.name) {
        vars[segment.name] = result;
      }
      else if (segment.value != result) {
        return false;
      }
    }
  }
  if (offset == binsize) {
    return bindings(vars);
  }
  else {
    return false;
  }
}

module.exports.match = match;
module.exports.parse_int = parse_int;
module.exports.parse_float = parse_float;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Compile patterns to recognisers and constructors



__webpack_require__(7);
var $ = __webpack_require__(1).format;

var parse = __webpack_require__(14).parse;
var interp = __webpack_require__(18),
  parse_int = interp.parse_int,
  parse_float = interp.parse_float;
var construct = __webpack_require__(15),
  write_int = construct.write_int,
  write_float = construct.write_float;

var lines = [];
function $start() {
  lines = [];
}
function $line(/* format , args */) {
  lines.push($.apply(null, arguments));
}
function $result() {
  return lines.join('\n');
}

function bits_expr(segment) {
  if (typeof segment.size === 'string') {
    return $('%s * %d', var_name(segment.size), segment.unit);
  }
  else {
    return (segment.size * segment.unit).toString();
  }
}

function get_number(segment) {
  $line('bits = %s;\n', bits_expr(segment));
  var parser = (segment.type === 'integer') ?
    'parse_int' : 'parse_float';
  var be = segment.bigendian, sg = segment.signed;
  $line("byteoffset = offset / 8; offset += bits");
  $line("if (offset > binsize) { return false; }");
  $line("else { result = %s(bin, byteoffset, bits / 8, %s, %s); }",
        parser, be, sg);
}

function get_binary(segment) {
  $line("byteoffset = offset / 8;");
  if (segment.size === true) {
    $line("offset = binsize;");
    $line("result = bin.slice(byteoffset);");
  }
  else {
    $line("bits = %s;", bits_expr(segment));
    $line("offset += bits;");
    $line("if (offset > binsize) { return false; }");
    $line("else { result = bin.slice(byteoffset,",
          "byteoffset + bits / 8); }");
  }
}

function get_string(segment) {
  $line("byteoffset = offset / 8;");
  var strlen = segment.value.length;
  var strlenbits = strlen * 8;
  $line("offset += %d;", strlenbits);
  $line("if (offset > binsize) { return false; }");
  $line("else { result = bin.toString(byteoffset,",
        $("byteoffset + %d); }", strlen));
}

function skip_bits(segment) {
  if (typeof segment.size === 'string') {
    // Damn. Have to look up the size.
    $line("var skipbits = %s * %d;",
          var_name(segment.size), segment.unit);
    $line("if (offset + skipbits > binsize) { return false; }");
    $line("else { offset += skipbits; }");
  }
  else if (segment.size === true) {
    $line("if (offset % 8 === 0) { offset = binsize; }");
    $line("else { return false; }");
  }
  else {
    var bits = segment.unit * segment.size;
    $line("if (offset + %d > binsize) { return false; }", bits);
    $line("else { offset += %d; }", bits);
  }
}

function match_seg(segment) {
  if (segment.name === '_') {
    skip_bits(segment);
  }
  else {
    var assign_result;
    switch (segment.type) {
    case 'integer':
    case 'float':
      get_number(segment);
      break;
    case 'binary':
      get_binary(segment);
      break;
    case 'string':
      get_string(segment);
      break;
    }
    $line("if (result === false) return false;");
    if (segment.name) {
      // variable is given a value in the environment
      $line("else if (%s !== undefined) {", var_name(segment.name));
      // .. and it is not the same as that matched
      $line("if (%s != result) return false;",
            var_name(segment.name));
      $line("}");
      // variable is free
      $line('else %s = result;', var_name(segment.name));
    }
    else {
      var repr = JSON.stringify(segment.value);
      $line("else if (result != %s) return false;", repr);
    }
  }
}

function var_name(name) {
  return  'var_' + name;
}

function variables(segments) {
  var names = {};
  for (var i = 0; i < segments.length; i++) {
    var name = segments[i].name;
    if (name && name !== '_') {
      names[name] = true;
    }
    name = segments[i].size;
    if (typeof name === 'string') {
      names[name] = true;
    }
  }
  return Object.keys(names);
}

function compile_pattern(segments) {
  $start();
  $line("return function(binary, env) {");
  $line("'use strict';");
  $line("var bin = binary, env = env || {};");
  $line("var offset = 0, binsize = bin.length * 8;");
  $line("var bits, result, byteoffset;");
  var varnames = variables(segments);
  for (var v = 0; v < varnames.length; v++) {
    var name = varnames[v];
    $line("var %s = env['%s'];", var_name(name), name);
  }

  var len = segments.length;
  for (var i = 0; i < len; i++) {
    var segment = segments[i];
    $line("// " + JSON.stringify(segment));
    match_seg(segment);
  }

  $line("if (offset == binsize) {");
  $line("return {");
  for (var v = 0; v < varnames.length; v++) {
    var name = varnames[v];
    $line("%s: %s,", name, var_name(name));
  }
  $line('};');
  $line('}'); // if offset == binsize
  $line("else return false;");
  $line("}"); // end function

  var fn = new Function('parse_int', 'parse_float', $result());
  return fn(parse_int, parse_float);
}


function write_seg(segment) {
  switch (segment.type) {
  case 'string':
    $line("offset += buf.write(%s, offset, 'utf8');",
          JSON.stringify(segment.value));
    break;
  case 'binary':
    $line("val = bindings['%s'];", segment.name);
    if (segment.size === true) {
      $line('size = val.length;');
    }
    else if (typeof segment.size === 'string') {
      $line("size = (bindings['%s'] * %d) / 8;",
            segment.size, segment.unit);
    }
    else {
      $line("size = %d;", (segment.size * segment.unit) / 8);
    }
    $line('val.copy(buf, offset, 0, size);');
    $line('offset += size;');
    break;
  case 'integer':
  case 'float':
    write_number(segment);
    break;
  }
}

function write_number(segment) {
  if (segment.name) {
    $line("val = bindings['%s'];", segment.name);
  }
  else {
    $line("val = %d", segment.value);
  }
  var writer = (segment.type === 'integer') ?
    'write_int' : 'write_float';
  if (typeof segment.size === 'string') {
    $line("size = (bindings['%s'] * %d) / 8;",
          segment.size, segment.unit);
  }
  else {
    $line('size = %d;', (segment.size * segment.unit) / 8);
  }
  $line('%s(buf, val, offset, size, %s);',
        writer, segment.bigendian);
  $line('offset += size;');
}

function size_of(segments) {
  var variable = [];
  var fixed = 0;

  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (typeof segment.size === 'string' ||
        segment.size === true) {
      variable.push(segment);
    }
    else if (segment.type === 'string') {
      fixed += Buffer.byteLength(segment.value);
    }
    else {
      fixed += (segment.size * segment.unit) / 8;
    }
  }

  $line('var buffersize = %d;', fixed);

  if (variable.length > 0) {
    for (var j = 0; j < variable.length; j++) {
      var segment = variable[j];
      if (segment.size === true) {
        $line("buffersize += bindings['%s'].length;", segment.name);
      }
      else {
        $line("buffersize += (bindings['%s'] * %d) / 8;",
              segment.size, segment.unit);
      }
    }
  }
}

function emit_write(segments) {
  $line('var val, size;');

  var len = segments.length;
  for (var i = 0; i < len; i++) {
    var segment = segments[i];
    $line('// %s', JSON.stringify(segment));
    write_seg(segment);
  }
}

function compile_ctor(segments) {
  $start();
  $line('return function(bindings) {');
  $line("'use strict';");
  size_of(segments);
  $line('var buf = new Buffer(buffersize);');
  $line('var offset = 0;');
  emit_write(segments);
  $line('return buf;');
  $line('}'); // end function

  return new Function('write_int', 'write_float',
                      $result())(write_int, write_float);
}

module.exports.compile_pattern = compile_pattern;
module.exports.compile = function() {
  var str = [].join.call(arguments, ',');
  var p = parse(str);
  return compile_pattern(p);
};
module.exports.compile_builder = function() {
  var str = [].join.call(arguments, ',');
  var p = parse(str);
  return compile_ctor(p);
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = __webpack_require__(16).Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}


/***/ }),
/* 21 */
/***/ (function(module, exports) {

//
//
//

// Different kind of credentials that can be supplied when opening a
// connection, corresponding to SASL mechanisms There's only two
// useful mechanisms that RabbitMQ implements:
//  * PLAIN (send username and password in the plain)
//  * EXTERNAL (assume the server will figure out who you are from
//    context, i.e., your SSL certificate)

module.exports.plain = function(user, passwd) {
  return {
    mechanism: 'PLAIN',
    response: function() {
      return new Buffer(['', user, passwd].join(String.fromCharCode(0)))
    }
  }
}

module.exports.external = function() {
  return {
    mechanism: 'EXTERNAL',
    response: function() { return new Buffer(''); }
  }
}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(NEXT_FILTER) {
var util = __webpack_require__(0);
var getKeys = __webpack_require__(5).keys;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function catchFilter(instances, cb, promise) {
    return function(e) {
        var boundTo = promise._boundValue();
        predicateLoop: for (var i = 0; i < instances.length; ++i) {
            var item = instances[i];

            if (item === Error ||
                (item != null && item.prototype instanceof Error)) {
                if (e instanceof item) {
                    return tryCatch(cb).call(boundTo, e);
                }
            } else if (typeof item === "function") {
                var matchesPredicate = tryCatch(item).call(boundTo, e);
                if (matchesPredicate === errorObj) {
                    return matchesPredicate;
                } else if (matchesPredicate) {
                    return tryCatch(cb).call(boundTo, e);
                }
            } else if (util.isObject(e)) {
                var keys = getKeys(item);
                for (var j = 0; j < keys.length; ++j) {
                    var key = keys[j];
                    if (item[key] != e[key]) {
                        continue predicateLoop;
                    }
                }
                return tryCatch(cb).call(boundTo, e);
            }
        }
        return NEXT_FILTER;
    };
}

return catchFilter;
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var util = __webpack_require__(0);
var maybeWrapAsError = util.maybeWrapAsError;
var errors = __webpack_require__(2);
var OperationalError = errors.OperationalError;
var es5 = __webpack_require__(5);

function isUntypedError(obj) {
    return obj instanceof Error &&
        es5.getPrototypeOf(obj) === Error.prototype;
}

var rErrorKey = /^(?:name|message|stack|cause)$/;
function wrapAsOperationalError(obj) {
    var ret;
    if (isUntypedError(obj)) {
        ret = new OperationalError(obj);
        ret.name = obj.name;
        ret.message = obj.message;
        ret.stack = obj.stack;
        var keys = es5.keys(obj);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!rErrorKey.test(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    util.markAsOriginatingFromRejection(obj);
    return obj;
}

function nodebackForPromise(promise, multiArgs) {
    return function(err, value) {
        if (promise === null) return;
        if (err) {
            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
            promise._attachExtraTrace(wrapped);
            promise._reject(wrapped);
        } else if (!multiArgs) {
            promise._fulfill(value);
        } else {
            var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0)); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];};
            promise._fulfill(args);
        }
        promise = null;
    };
}

module.exports = nodebackForPromise;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//
//
//

// Channel machinery.



var defs = __webpack_require__(6);
var closeMsg = __webpack_require__(4).closeMessage;
var inspect = __webpack_require__(4).inspect;
var methodName = __webpack_require__(4).methodName;
var assert = __webpack_require__(13);
var inherits = __webpack_require__(1).inherits;
var EventEmitter = __webpack_require__(10).EventEmitter;
var fmt = __webpack_require__(1).format;
var IllegalOperationError = __webpack_require__(12).IllegalOperationError;
var stackCapture = __webpack_require__(12).stackCapture;

function Channel(connection) {
  EventEmitter.call( this );
  this.connection = connection;
  // for the presently outstanding RPC
  this.reply = null;
  // for the RPCs awaiting action
  this.pending = [];
  // for unconfirmed messages
  this.lwm = 1; // the least, unconfirmed deliveryTag
  this.unconfirmed = []; // rolling window of delivery callbacks
  this.on('ack', this.handleConfirm.bind(this, function(cb) {
    if (cb) cb(null);
  }));
  this.on('nack', this.handleConfirm.bind(this, function(cb) {
    if (cb) cb(new Error('message nacked'));
  }));
  // message frame state machine
  this.handleMessage = acceptDeliveryOrReturn;
}
inherits(Channel, EventEmitter);

module.exports.Channel = Channel;
module.exports.acceptMessage = acceptMessage;

var C = Channel.prototype;

C.allocate = function() {
  this.ch = this.connection.freshChannel(this);
  return this;
}

// Incoming frames are either notifications of e.g., message delivery,
// or replies to something we've sent. In general I deal with the
// former by emitting an event, and with the latter by keeping a track
// of what's expecting a reply.
//
// The AMQP specification implies that RPCs can't be pipelined; that
// is, you can have only one outstanding RPC on a channel at a
// time. Certainly that's what RabbitMQ and its clients assume. For
// this reason, I buffer RPCs if the channel is already waiting for a
// reply.

// Just send the damn frame.
C.sendImmediately = function(method, fields) {
  return this.connection.sendMethod(this.ch, method, fields);
};

// Invariant: !this.reply -> pending.length == 0. That is, whenever we
// clear a reply, we must send another RPC (and thereby fill
// this.reply) if there is one waiting. The invariant relevant here
// and in `accept`.
C.sendOrEnqueue = function(method, fields, reply) {
  if (!this.reply) { // if no reply waiting, we can go
    assert(this.pending.length === 0);
    this.reply = reply;
    this.sendImmediately(method, fields);
  }
  else {
    this.pending.push({method: method,
                       fields: fields,
                       reply: reply});
  }
};

C.sendMessage = function(fields, properties, content) {
  return this.connection.sendMessage(
    this.ch,
    defs.BasicPublish, fields,
    defs.BasicProperties, properties,
    content);
};

// Internal, synchronously resolved RPC; the return value is resolved
// with the whole frame.
C._rpc = function(method, fields, expect, cb) {
  var self = this;

  function reply(err, f) {
    if (err === null) {
      if (f.id === expect) {
        return cb(null, f);
      }
      else {
        // We have detected a problem, so it's up to us to close the
        // channel
        var expectedName = methodName(expect);
        var e = new Error(fmt("Expected %s; got %s",
                              expectedName, inspect(f, false)));
        self.closeWithError(fmt('Expected %s; got %s',
                                expectedName, methodName(f.id)),
                            defs.constants.UNEXPECTED_FRAME, e);
        return cb(e);
      }
    }
    // An error will be given if, for example, this is waiting to be
    // sent and the connection closes
    else if (err instanceof Error) return cb(err);
    // A close frame will be given if this is the RPC awaiting reply
    // and the channel is closed by the server
    else {
      // otherwise, it's a close frame
      var closeReason =
        (err.fields.classId << 16) + err.fields.methodId;
      var e = (method === closeReason)
        ? fmt("Operation failed: %s; %s",
              methodName(method), closeMsg(err))
        : fmt("Channel closed by server: %s", closeMsg(err));
      return cb(new Error(e));
    }
  }

  this.sendOrEnqueue(method, fields, reply);
};

// Shutdown protocol. There's three scenarios:
//
// 1. The application decides to shut the channel
// 2. The server decides to shut the channel, possibly because of
// something the application did
// 3. The connection is closing, so there won't be any more frames
// going back and forth.
//
// 1 and 2 involve an exchange of method frames (Close and CloseOk),
// while 3 doesn't; the connection simply says "shutdown" to the
// channel, which then acts as if it's closing, without going through
// the exchange.

function invalidOp(msg, stack) {
  return function() {
    throw new IllegalOperationError(msg, stack);
  };
}

function invalidateSend(ch, msg, stack) {
  ch.sendImmediately = ch.sendOrEnqueue = ch.sendMessage =
    invalidOp(msg, stack);
}

// Move to entirely closed state.
C.toClosed = function(capturedStack) {
  this._rejectPending();
  invalidateSend(this, 'Channel closed', capturedStack);
  this.accept = invalidOp('Channel closed', capturedStack);
  this.connection.releaseChannel(this.ch);
  this.emit('close');
};

// Stop being able to send and receive methods and content. Used when
// we close the channel. Invokes the continuation once the server has
// acknowledged the close, but before the channel is moved to the
// closed state.
C.toClosing = function(capturedStack, k) {
  var send = this.sendImmediately.bind(this);
  invalidateSend(this, 'Channel closing', capturedStack);

  this.accept = function(f) {
    if (f.id === defs.ChannelCloseOk) {
      if (k) k();
      var s = stackCapture('ChannelCloseOk frame received');
      this.toClosed(s);
    }
    else if (f.id === defs.ChannelClose) {
      send(defs.ChannelCloseOk, {});
    }
    // else ignore frame
  };
};

C._rejectPending = function() {
  function rej(r) { 
    r(new Error("Channel ended, no reply will be forthcoming"));
  }
  if (this.reply !== null) rej(this.reply);
  this.reply = null;

  var discard;
  while (discard = this.pending.shift()) rej(discard.reply);
  this.pending = null; // so pushes will break
};

C.closeBecause = function(reason, code, k) {
  this.sendImmediately(defs.ChannelClose, {
    replyText: reason,
    replyCode: code,
    methodId:0, classId: 0
  });
  var s = stackCapture('closeBecause called: ' + reason);
  this.toClosing(s, k);
};

// If we close because there's been an error, we need to distinguish
// between what we tell the server (`reason`) and what we report as
// the cause in the client (`error`).
C.closeWithError = function(reason, code, error) {
  var self = this;
  this.closeBecause(reason, code, function() {
    error.code = code;
    self.emit('error', error);
  });
};

// A trampolining state machine for message frames on a channel. A
// message arrives in at least two frames: first, a method announcing
// the message (either a BasicDeliver or BasicGetOk); then, a message
// header with the message properties; then, zero or more content
// frames.

// Keep the try/catch localised, in an attempt to avoid disabling
// optimisation
C.acceptMessageFrame = function(f) {
  try {
    this.handleMessage = this.handleMessage(f);
  }
  catch (msg) {
    if (typeof msg === 'string') {
      this.closeWithError(msg, defs.constants.UNEXPECTED_FRAME,
                          new Error(msg));
    }
    else if (msg instanceof Error) {
      this.closeWithError('Error while processing message',
                          defs.constants.INTERNAL_ERROR, msg);
    }
    else {
      this.closeWithError('Internal error while processing message',
                          defs.constants.INTERNAL_ERROR,
                          new Error(msg.toString()));
    }
  }
};

// Kick off a message delivery given a BasicDeliver or BasicReturn
// frame (BasicGet uses the RPC mechanism)
function acceptDeliveryOrReturn(f) {
  var event;
  if (f.id === defs.BasicDeliver) event = 'delivery';
  else if (f.id === defs.BasicReturn) event = 'return';
  else throw fmt("Expected BasicDeliver or BasicReturn; got %s",
                 inspect(f));

  var self = this;
  var fields = f.fields;
  return acceptMessage(function(message) {
    message.fields = fields;
    self.emit(event, message);
  });
}

// Move to the state of waiting for message frames (headers, then
// one or more content frames)
function acceptMessage(continuation) {
  var totalSize = 0, remaining = 0;
  var buffers = null;

  var message = {
    fields: null,
    properties: null,
    content: null
  };

  return headers;

  // expect a headers frame
  function headers(f) {
    if (f.id === defs.BasicProperties) {
      message.properties = f.fields;
      totalSize = remaining = f.size;
      
      // for zero-length messages, content frames aren't required.
      if (totalSize === 0) {
        message.content = new Buffer(0);
        continuation(message);
        return acceptDeliveryOrReturn;
      }
      else {
        return content;        
      }
    }
    else {
      throw "Expected headers frame after delivery";
    }
  }

  // expect a content frame
  // %%% TODO cancelled messages (sent as zero-length content frame)
  function content(f) {
    if (f.content) {
      var size = f.content.length;
      remaining -= size;
      if (remaining === 0) {
        if (buffers !== null) {
          buffers.push(f.content);
          message.content = Buffer.concat(buffers);
        }
        else {
          message.content = f.content;
        }
        continuation(message);
        return acceptDeliveryOrReturn;
      }
      else if (remaining < 0) {
        throw fmt("Too much content sent! Expected %d bytes",
                  totalSize);
      }
      else {
        if (buffers !== null)
          buffers.push(f.content);
        else
          buffers = [f.content];
        return content;
      }
    }
    else throw "Expected content frame after headers"
  }
}

C.handleConfirm = function(handle, f) {
  var tag = f.deliveryTag;
  var multi = f.multiple;

  if (multi) {
    var confirmed = this.unconfirmed.splice(0, tag - this.lwm + 1);
    this.lwm = tag + 1;
    confirmed.forEach(handle);
  }
  else {
    var c;
    if (tag === this.lwm) {
      c = this.unconfirmed.shift();
      this.lwm++;
      // Advance the LWM and the window to the next non-gap, or
      // possibly to the end
      while (this.unconfirmed[0] === null) {
        this.unconfirmed.shift();
        this.lwm++;
      }
    }
    else {
      c = this.unconfirmed[tag - this.lwm];
      this.unconfirmed[tag - this.lwm] = null;
    }
    // Technically, in the single-deliveryTag case, I should report a
    // protocol breach if it's already been confirmed.
    handle(c);
  }
};

C.pushConfirmCallback = function(cb) {
  // `null` is used specifically for marking already confirmed slots,
  // so I coerce `undefined` and `null` to false; functions are never
  // falsey.
  this.unconfirmed.push(cb || false);
};

// Interface for connection to use

C.accept = function(f) {

  switch (f.id) {

    // Message frames
  case undefined: // content frame!
  case defs.BasicDeliver:
  case defs.BasicReturn:
  case defs.BasicProperties:
    return this.acceptMessageFrame(f);

    // confirmations, need to do confirm.select first
  case defs.BasicAck:
    return this.emit('ack', f.fields);
  case defs.BasicNack:
    return this.emit('nack', f.fields);
  case defs.BasicCancel:
    // The broker can send this if e.g., the queue is deleted.
    return this.emit('cancel', f.fields);

  case defs.ChannelClose:
    // Any remote closure is an error to us. Reject the pending reply
    // with the close frame, so it can see whether it was that
    // operation that caused it to close.
    if (this.reply) {
      var reply = this.reply; this.reply = null;
      reply(f);
    }
    var emsg = "Channel closed by server: " + closeMsg(f);
    this.sendImmediately(defs.ChannelCloseOk, {});

    var error = new Error(emsg);
    error.code = f.fields.replyCode;
    this.emit('error', error);

    var s = stackCapture(emsg);
    this.toClosed(s);
    return;

  case defs.BasicFlow:
    // RabbitMQ doesn't send this, it just blocks the TCP socket
    return this.closeWithError("Flow not implemented",
                               defs.constants.NOT_IMPLEMENTED,
                               new Error('Flow not implemented'));

  default: // assume all other things are replies
    // Resolving the reply may lead to another RPC; to make sure we
    // don't hold that up, clear this.reply
    var reply = this.reply; this.reply = null;
    // however, maybe there's an RPC waiting to go? If so, that'll
    // fill this.reply again, restoring the invariant. This does rely
    // on any response being recv'ed after resolving the promise,
    // below; hence, I use synchronous defer.
    if (this.pending.length > 0) {
      var send = this.pending.shift();
      this.reply = send.reply;
      this.sendImmediately(send.method, send.fields);
    }
    return reply(null, f);
  }
};

C.onBufferDrain = function() {
  this.emit('drain');
};


// This adds just a bit more stuff useful for the APIs, but not
// low-level machinery.
function BaseChannel(connection) {
  Channel.call(this, connection);
  this.consumers = {};
}
inherits(BaseChannel, Channel);

module.exports.BaseChannel = BaseChannel;

// Not sure I like the ff, it's going to be changing hidden classes
// all over the place. On the other hand, whaddya do.
BaseChannel.prototype.registerConsumer = function(tag, callback) {
  this.consumers[tag] = callback;
};

BaseChannel.prototype.unregisterConsumer = function(tag) {
  delete this.consumers[tag];
};

BaseChannel.prototype.dispatchMessage = function(fields, message) {
  var consumerTag = fields.consumerTag;
  var consumer = this.consumers[consumerTag];
  if (consumer) {
    return consumer(message);
  }
  else {
    // %%% Surely a race here
    throw new Error("Unknown consumer: " + consumerTag);
  }
};

BaseChannel.prototype.handleDelivery = function(message) {
  return this.dispatchMessage(message.fields, message);
};

BaseChannel.prototype.handleCancel = function(fields) {
  return this.dispatchMessage(fields, null);
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _rabbitConnexion = __webpack_require__(26);

var _rabbitUtils = __webpack_require__(83);

var connexionEstablished = (0, _rabbitConnexion.connexion)();

(0, _rabbitUtils.assertQueue)(connexionEstablished, function ($message) {
    var newMessage = Object.assign($message.message, { content: 'Je n\'ai malheuresement pas compris ton message' });
    var newIntentMessage = Object.assign($message, { message: newMessage });
    (0, _rabbitUtils.sendTo)(connexionEstablished, JSON.stringify(newIntentMessage));
});

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connexion = undefined;

var _callback_api = __webpack_require__(27);

var _callback_api2 = _interopRequireDefault(_callback_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connexion = exports.connexion = function connexion() {
    return new Promise(function (resolve, reject) {
        var URL = 'amqp://' + process.env.RABBIT_USER + ':' + process.env.RABBIT_PASSWORD + '@' + process.env.RABBIT_HOST + ':' + process.env.RABBIT_PORT;
        _callback_api2.default.connect(URL, function (err, conn) {
            if (err) {
                reject(new Error('Connection refusée'));
            }
            resolve(conn);
        });
    });
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var raw_connect = __webpack_require__(28).connect;
var CallbackModel = __webpack_require__(50).CallbackModel;

// Supports three shapes:
// connect(url, options, callback)
// connect(url, callback)
// connect(callback)
function connect(url, options, cb) {
  if (typeof url === 'function')
    cb = url, url = false, options = false;
  else if (typeof options === 'function')
    cb = options, options = false;

  raw_connect(url, options, function(err, c) {
    if (err === null) cb(null, new CallbackModel(c));
    else cb(err);
  });
};

module.exports.connect = connect;
module.exports.credentials = __webpack_require__(21);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//
//
//

// General-purpose API for glueing everything together.



var URL = __webpack_require__(29);
var QS = __webpack_require__(30);
var Connection = __webpack_require__(31).Connection;
var fmt = __webpack_require__(1).format;
var credentials = __webpack_require__(21);

function copyInto(obj, target) {
  var keys = Object.keys(obj);
  var i = keys.length;
  while (i--) {
    var k = keys[i];
    target[k] = obj[k];
  }
  return target;
}

// Adapted from util._extend, which is too fringe to use.
function clone(obj) {
  return copyInto(obj, {});
}

var CLIENT_PROPERTIES = {
  "product": "amqplib",
  "version": __webpack_require__(47).version,
  "platform": fmt('Node.JS %s', process.version),
  "information": "http://squaremo.github.io/amqp.node",
  "capabilities": {
    "publisher_confirms": true,
    "exchange_exchange_bindings": true,
    "basic.nack": true,
    "consumer_cancel_notify": true,
    "connection.blocked": true,
    "authentication_failure_close": true
  }
};

// Construct the main frames used in the opening handshake
function openFrames(vhost, query, credentials, extraClientProperties) {
  if (!vhost)
    vhost = '/';
  else
    vhost = QS.unescape(vhost);

  var query = query || {};

  function intOrDefault(val, def) {
    return (val === undefined) ? def : parseInt(val);
  }

  var clientProperties = Object.create(CLIENT_PROPERTIES);

  return {
    // start-ok
    'clientProperties': copyInto(extraClientProperties, clientProperties),
    'mechanism': credentials.mechanism,
    'response': credentials.response(),
    'locale': query.locale || 'en_US',

    // tune-ok
    'channelMax': intOrDefault(query.channelMax, 0),
    'frameMax': intOrDefault(query.frameMax, 0x1000),
    'heartbeat': intOrDefault(query.heartbeat, 0),

    // open
    'virtualHost': vhost,
    'capabilities': '',
    'insist': 0
  };
}

// Decide on credentials based on what we're supplied
function credentialsFromUrl(parts) {
  var user = 'guest', passwd = 'guest';
  if (parts.auth) {
    var auth = parts.auth.split(':');
    user = auth[0];
    passwd = auth[1];
  }
  return credentials.plain(user, passwd);
}

function connect(url, socketOptions, openCallback) {
  // tls.connect uses `util._extend()` on the options given it, which
  // copies only properties mentioned in `Object.keys()`, when
  // processing the options. So I have to make copies too, rather
  // than using `Object.create()`.
  var sockopts = clone(socketOptions || {});
  url = url || 'amqp://localhost';

  var noDelay = !!sockopts.noDelay;
  var timeout = sockopts.timeout;
  var keepAlive = !!sockopts.keepAlive;
  // 0 is default for node
  var keepAliveDelay = sockopts.keepAliveDelay || 0;

  var extraClientProperties = sockopts.clientProperties || {};

  var protocol, fields;
  if (typeof url === 'object') {
    protocol = (url.protocol || 'amqp') + ':';
    sockopts.host = url.hostname;
    sockopts.port = url.port || ((protocol === 'amqp:') ? 5672 : 5671);

    var user, pass;
    if (!url.username) {
      user = 'guest';
      pass = url.password || 'guest';
    } else {
      user = url.username;
      pass = url.password;
    }

    fields = openFrames(url.vhost, null, sockopts.credentials || credentials.plain(user, pass), extraClientProperties);
  } else {
    var parts = URL.parse(url, true); // yes, parse the query string
    protocol = parts.protocol;
    sockopts.host = parts.hostname;
    sockopts.port = parseInt(parts.port) || ((protocol === 'amqp:') ? 5672 : 5671);
    var vhost = parts.pathname ? parts.pathname.substr(1) : null;
    fields = openFrames(vhost, parts.query, sockopts.credentials || credentialsFromUrl(parts), extraClientProperties);
  }

  var sockok = false;
  var sock;

  function onConnect() {
    sockok = true;
    sock.setNoDelay(noDelay);
    if (keepAlive) sock.setKeepAlive(keepAlive, keepAliveDelay);

    var c = new Connection(sock);
    c.open(fields, function(err, ok) {
      // disable timeout once the connection is open, we don't want
      // it fouling things
      if (timeout) sock.setTimeout(0);
      if (err === null) {
        openCallback(null, c);
      }
      else openCallback(err);
    });
  }

  if (protocol === 'amqp:') {
    sock = __webpack_require__(48).connect(sockopts, onConnect);
  }
  else if (protocol === 'amqps:') {
    sock = __webpack_require__(49).connect(sockopts, onConnect);
  }
  else {
    throw new Error("Expected amqp: or amqps: as the protocol; got " + protocol);
  }

  if (timeout) {
    sock.setTimeout(
      timeout, openCallback.bind(this, new Error('connect ETIMEDOUT')));
  }

  sock.once('error', function(err) {
    if (!sockok) openCallback(err);
  });

}

module.exports.connect = connect;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("querystring");

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//
//
//



var defs = __webpack_require__(6);
var constants = defs.constants;
var frame = __webpack_require__(17);
var HEARTBEAT = frame.HEARTBEAT;
var Mux = __webpack_require__(36).Mux;

var Duplex =
  __webpack_require__(11).Duplex ||
  __webpack_require__(37);
var EventEmitter = __webpack_require__(10).EventEmitter;
var Heart = __webpack_require__(42).Heart;

var methodName = __webpack_require__(4).methodName;
var closeMsg = __webpack_require__(4).closeMessage;
var inspect = __webpack_require__(4).inspect;

var BitSet = __webpack_require__(43).BitSet;
var inherits = __webpack_require__(1).inherits;
var fmt = __webpack_require__(1).format;
var PassThrough = __webpack_require__(11).PassThrough ||
  __webpack_require__(44);
var IllegalOperationError = __webpack_require__(12).IllegalOperationError;
var stackCapture = __webpack_require__(12).stackCapture;

// High-water mark for channel write buffers, in 'objects' (which are
// encoded frames as buffers).
var DEFAULT_WRITE_HWM = 1024;
// If all the frames of a message (method, properties, content) total
// to less than this, copy them into a single buffer and write it all
// at once. Note that this is less than the minimum frame size: if it
// was greater, we might have to fragment the content.
var SINGLE_CHUNK_THRESHOLD = 2048;

function Connection(underlying) {
  EventEmitter.call( this );
  var stream = this.stream = wrapStream(underlying);
  this.muxer = new Mux(stream);

  // frames
  this.rest = new Buffer(0);
  this.frameMax = constants.FRAME_MIN_SIZE;
  this.sentSinceLastCheck = false;
  this.recvSinceLastCheck = false;

  this.expectSocketClose = false;
  this.freeChannels = new BitSet();
  this.channels = [{channel: {accept: channel0(this)},
                    buffer: underlying}];
}
inherits(Connection, EventEmitter);

var C = Connection.prototype;

// Usual frame accept mode
function mainAccept(frame) {
  var rec = this.channels[frame.channel];
  if (rec) { return rec.channel.accept(frame); }
  // NB CHANNEL_ERROR may not be right, but I don't know what is ..
  else
    this.closeWithError(
      fmt('Frame on unknown channel %d', frame.channel),
      constants.CHANNEL_ERROR,
      new Error(fmt("Frame on unknown channel: %s",
                    inspect(frame, false))));
}

// Handle anything that comes through on channel 0, that's the
// connection control channel. This is only used once mainAccept is
// installed as the frame handler, after the opening handshake.
function channel0(connection) {
  return function(f) {
    // Once we get a 'close', we know 1. we'll get no more frames, and
    // 2. anything we send except close, or close-ok, will be
    // ignored. If we already sent 'close', this won't be invoked since
    // we're already in closing mode; if we didn't well we're not going
    // to send it now are we.
    if (f === HEARTBEAT); // ignore; it's already counted as activity
                          // on the socket, which is its purpose
    else if (f.id === defs.ConnectionClose) {
      // Oh. OK. I guess we're done here then.
      connection.sendMethod(0, defs.ConnectionCloseOk, {});
      var emsg = fmt('Connection closed: %s', closeMsg(f));
      var s = stackCapture(emsg);
      var e = new Error(emsg);
      e.code = f.fields.replyCode;
      if (isFatalError(e)) {
        connection.emit('error', e);
      }
      connection.toClosed(s, e);
    }
    else if (f.id === defs.ConnectionBlocked) {
      connection.emit('blocked', f.fields.reason);
    }
    else if (f.id === defs.ConnectionUnblocked) {
      connection.emit('unblocked');
    }
    else {
      connection.closeWithError(
        fmt("Unexpected frame on channel 0"),
        constants.UNEXPECTED_FRAME,
        new Error(fmt("Unexpected frame on channel 0: %s",
                      inspect(f, false))));
    }
  };
}

// This changed between versions, as did the codec, methods, etc. AMQP
// 0-9-1 is fairly similar to 0.8, but better, and nothing implements
// 0.8 that doesn't implement 0-9-1. In other words, it doesn't make
// much sense to generalise here.
C.sendProtocolHeader = function() {
  this.sendBytes(frame.PROTOCOL_HEADER);
};

/*
  The frighteningly complicated opening protocol (spec section 2.2.4):

     Client -> Server

       protocol header ->
         <- start
       start-ok ->
     .. next two zero or more times ..
         <- secure
       secure-ok ->
         <- tune
       tune-ok ->
       open ->
         <- open-ok

If I'm only supporting SASL's PLAIN mechanism (which I am for the time
being), it gets a bit easier since the server won't in general send
back a `secure`, it'll just send `tune` after the `start-ok`.
(SASL PLAIN: http://tools.ietf.org/html/rfc4616)

*/

C.open = function(allFields, openCallback0) {
  var self = this;
  var openCallback = openCallback0 || function() {};

  // This is where we'll put our negotiated values
  var tunedOptions = Object.create(allFields);

  function wait(k) {
    self.step(function(err, frame) {
      if (err !== null) bail(err);
      else if (frame.channel !== 0) {
        bail(new Error(
          fmt("Frame on channel != 0 during handshake: %s",
              inspect(frame, false))));
      }
      else k(frame);
    });
  }

  function expect(Method, k) {
    wait(function(frame) {
      if (frame.id === Method) k(frame);
      else {
        bail(new Error(
          fmt("Expected %s; got %s",
              methodName(Method), inspect(frame, false))));
      }
    });
  }

  function bail(err) {
    openCallback(err);
  }

  function send(Method) {
    // This can throw an exception if there's some problem with the
    // options; e.g., something is a string instead of a number.
    try { self.sendMethod(0, Method, tunedOptions); }
    catch (err) { bail(err); }
  }

  function negotiate(server, desired) {
    // We get sent values for channelMax, frameMax and heartbeat,
    // which we may accept or lower (subject to a minimum for
    // frameMax, but we'll leave that to the server to enforce). In
    // all cases, `0` really means "no limit", or rather the highest
    // value in the encoding, e.g., unsigned short for channelMax.
    if (server === 0 || desired === 0) {
      // i.e., whichever places a limit, if either
      return Math.max(server, desired);
    }
    else {
      return Math.min(server, desired);
    }
  }

  function onStart(start) {
    var mechanisms = start.fields.mechanisms.toString().split(' ');
    if (mechanisms.indexOf(allFields.mechanism) < 0) {
      bail(new Error(fmt('SASL mechanism %s is not provided by the server',
                         allFields.mechanism)));
      return;
    }
    send(defs.ConnectionStartOk);
    wait(afterStartOk);
  }

  function afterStartOk(reply) {
    switch (reply.id) {
    case defs.ConnectionSecure:
      bail(new Error(
        "Wasn't expecting to have to go through secure"));
      break;
    case defs.ConnectionClose:
      bail(new Error(fmt("Handshake terminated by server: %s",
                         closeMsg(reply))));
      break;
    case defs.ConnectionTune:
      var fields = reply.fields;
      tunedOptions.frameMax =
        negotiate(fields.frameMax, allFields.frameMax);
      tunedOptions.channelMax =
        negotiate(fields.channelMax, allFields.channelMax);
      tunedOptions.heartbeat =
        negotiate(fields.heartbeat, allFields.heartbeat);
      send(defs.ConnectionTuneOk);
      send(defs.ConnectionOpen);
      expect(defs.ConnectionOpenOk, onOpenOk);
      break;
    default:
      bail(new Error(
        fmt("Expected connection.secure, connection.close, " +
            "or connection.tune during handshake; got %s",
            inspect(reply, false))));
      break;
    }
  }

  function onOpenOk(openOk) {
    // Impose the maximum of the encoded value, if the negotiated
    // value is zero, meaning "no, no limits"
    self.channelMax = tunedOptions.channelMax || 0xffff;
    self.frameMax = tunedOptions.frameMax || 0xffffffff;
    // 0 means "no heartbeat", rather than "maximum period of
    // heartbeating"
    self.heartbeat = tunedOptions.heartbeat;
    self.heartbeater = self.startHeartbeater();
    self.accept = mainAccept;
    succeed(openOk);
  }

  // If the server closes the connection, it's probably because of
  // something we did
  function endWhileOpening(err) {
    bail(err || new Error('Socket closed abruptly ' +
                          'during opening handshake'));
  }

  this.stream.on('end', endWhileOpening);
  this.stream.on('error', endWhileOpening);

  function succeed(ok) {
    self.stream.removeListener('end', endWhileOpening);
    self.stream.removeListener('error', endWhileOpening);
    self.stream.on('error', self.onSocketError.bind(self));
    self.stream.on('end', self.onSocketError.bind(
      self, new Error('Unexpected close')));
    self.on('frameError', self.onSocketError.bind(self));
    self.acceptLoop();
    openCallback(null, ok);
  }

  // Now kick off the handshake by prompting the server
  this.sendProtocolHeader();
  expect(defs.ConnectionStart, onStart);
};

// Closing things: AMQP has a closing handshake that applies to
// closing both connects and channels. As the initiating party, I send
// Close, then ignore all frames until I see either CloseOK --
// which signifies that the other party has seen the Close and shut
// the connection or channel down, so it's fine to free resources; or
// Close, which means the other party also wanted to close the
// whatever, and I should send CloseOk so it can free resources,
// then go back to waiting for the CloseOk. If I receive a Close
// out of the blue, I should throw away any unsent frames (they will
// be ignored anyway) and send CloseOk, then clean up resources. In
// general, Close out of the blue signals an error (or a forced
// closure, which may as well be an error).
//
//  RUNNING [1] --- send Close ---> Closing [2] ---> recv Close --+
//     |                               |                         [3]
//     |                               +------ send CloseOk ------+
//  recv Close                   recv CloseOk
//     |                               |
//     V                               V
//  Ended [4] ---- send CloseOk ---> Closed [5]
//
// [1] All frames accepted; getting a Close frame from the server
// moves to Ended; client may initiate a close by sending Close
// itself.
// [2] Client has initiated a close; only CloseOk or (simulataneously
// sent) Close is accepted.
// [3] Simultaneous close
// [4] Server won't send any more frames; accept no more frames, send
// CloseOk.
// [5] Fully closed, client will send no more, server will send no
// more. Signal 'close' or 'error'.
//
// There are two signalling mechanisms used in the API. The first is
// that calling `close` will return a promise, that will either
// resolve once the connection or channel is cleanly shut down, or
// will reject if the shutdown times out.
//
// The second is the 'close' and 'error' events. These are
// emitted as above. The events will fire *before* promises are
// resolved.

// Close the connection without even giving a reason. Typical.
C.close = function(closeCallback) {
  var k = closeCallback && function() { closeCallback(null); };
  this.closeBecause("Cheers, thanks", constants.REPLY_SUCCESS, k);
};

// Close with a reason and a 'code'. I'm pretty sure RabbitMQ totally
// ignores these; maybe it logs them. The continuation will be invoked
// when the CloseOk has been received, and before the 'close' event.
C.closeBecause = function(reason, code, k) {
  this.sendMethod(0, defs.ConnectionClose, {
    replyText: reason,
    replyCode: code,
    methodId: 0, classId: 0
  });
  var s = stackCapture('closeBecause called: ' + reason);
  this.toClosing(s, k);
};

C.closeWithError = function(reason, code, error) {
  this.emit('error', error);
  this.closeBecause(reason, code);
};

C.onSocketError = function(err) {
  if (!this.expectSocketClose) {
    // forestall any more calls to onSocketError, since we're signed
    // up for `'error'` *and* `'end'`
    this.expectSocketClose = true;
    this.emit('error', err);
    var s = stackCapture('Socket error');
    this.toClosed(s, err);
  }
};

function invalidOp(msg, stack) {
  return function() {
    throw new IllegalOperationError(msg, stack);
  };
}

function invalidateSend(conn, msg, stack) {
  conn.sendMethod = conn.sendContent = conn.sendMessage =
    invalidOp(msg, stack);
}

// A close has been initiated. Repeat: a close has been initiated.
// This means we should not send more frames, anyway they will be
// ignored. We also have to shut down all the channels.
C.toClosing = function(capturedStack, k) {
  var send = this.sendMethod.bind(this);

  this.accept = function(f) {
    if (f.id === defs.ConnectionCloseOk) {
      if (k) k();
      var s = stackCapture('ConnectionCloseOk received');
      this.toClosed(s, undefined);
    }
    else if (f.id === defs.ConnectionClose) {
      send(0, defs.ConnectionCloseOk, {});
    }
    // else ignore frame
  };
  invalidateSend(this, 'Connection closing', capturedStack);
};

C._closeChannels = function(capturedStack) {
  for (var i = 1; i < this.channels.length; i++) {
    var ch = this.channels[i];
    if (ch !== null) {
      ch.channel.toClosed(capturedStack); // %%% or with an error? not clear
    }
  }
};

// A close has been confirmed. Cease all communication.
C.toClosed = function(capturedStack, maybeErr) {
  this._closeChannels(capturedStack);
  var info = fmt('Connection closed (%s)',
                 (maybeErr) ? maybeErr.toString() : 'by client');
  // Tidy up, invalidate enverything, dynamite the bridges.
  invalidateSend(this, info, capturedStack);
  this.accept = invalidOp(info, capturedStack);
  this.close = function(cb) {
    cb && cb(new IllegalOperationError(info, capturedStack));
  };
  if (this.heartbeater) this.heartbeater.clear();
  // This is certainly true now, if it wasn't before
  this.expectSocketClose = true;
  this.stream.end();
  this.emit('close', maybeErr);
};

// ===

C.startHeartbeater = function() {
  if (this.heartbeat === 0) return null;
  else {
    var self = this;
    var hb = new Heart(this.heartbeat,
                       this.checkSend.bind(this),
                       this.checkRecv.bind(this));
    hb.on('timeout', function() {
      var hberr = new Error("Heartbeat timeout");
      self.emit('error', hberr);
      var s = stackCapture('Heartbeat timeout');
      self.toClosed(s, hberr);
    });
    hb.on('beat', function() {
      self.sendHeartbeat();
    });
    return hb;
  }
};

// I use an array to keep track of the channels, rather than an
// object. The channel identifiers are numbers, and allocated by the
// connection. If I try to allocate low numbers when they are
// available (which I do, by looking from the start of the bitset),
// this ought to keep the array small, and out of 'sparse array
// storage'. I also set entries to null, rather than deleting them, in
// the expectation that the next channel allocation will fill the slot
// again rather than growing the array. See
// http://www.html5rocks.com/en/tutorials/speed/v8/
C.freshChannel = function(channel, options) {
  var next = this.freeChannels.nextClearBit(1);
  if (next < 0 || next > this.channelMax)
    throw new Error("No channels left to allocate");
  this.freeChannels.set(next);

  var hwm = (options && options.highWaterMark) || DEFAULT_WRITE_HWM;
  var writeBuffer = new PassThrough({
    objectMode: true, highWaterMark: hwm
  });
  this.channels[next] = {channel: channel, buffer: writeBuffer};
  writeBuffer.on('drain', function() {
    channel.onBufferDrain();
  });
  this.muxer.pipeFrom(writeBuffer);
  return next;
};

C.releaseChannel = function(channel) {
  this.freeChannels.clear(channel);
  var buffer = this.channels[channel].buffer;
  this.muxer.unpipeFrom(buffer);
  this.channels[channel] = null;
};

C.acceptLoop = function() {
  var self = this;

  function go() {
    try {
      var f; while (f = self.recvFrame()) self.accept(f);
    }
    catch (e) {
      self.emit('frameError', e);
    }
  }
  self.stream.on('readable', go);
  go();
};

C.step = function(cb) {
  var self = this;
  function recv() {
    var f;
    try {
      f = self.recvFrame();
    }
    catch (e) {
      cb(e, null);
      return;
    }
    if (f) cb(null, f);
    else self.stream.once('readable', recv);
  }
  recv();
};

C.checkSend = function() {
  var check = this.sentSinceLastCheck;
  this.sentSinceLastCheck = false;
  return check;
}

C.checkRecv = function() {
  var check = this.recvSinceLastCheck;
  this.recvSinceLastCheck = false;
  return check;
}

C.sendBytes = function(bytes) {
  this.sentSinceLastCheck = true;
  this.stream.write(bytes);
};

C.sendHeartbeat = function() {
  return this.sendBytes(frame.HEARTBEAT_BUF);
};

var encodeMethod = defs.encodeMethod;
var encodeProperties = defs.encodeProperties;

C.sendMethod = function(channel, Method, fields) {
  var frame = encodeMethod(Method, channel, fields);
  this.sentSinceLastCheck = true;
  var buffer = this.channels[channel].buffer;
  return buffer.write(frame);
};

C.sendMessage = function(channel,
                         Method, fields,
                         Properties, props,
                         content) {
  if (!Buffer.isBuffer(content))
    throw new TypeError('content is not a buffer');

  var mframe = encodeMethod(Method, channel, fields);
  var pframe = encodeProperties(Properties, channel,
                                content.length, props);
  var buffer = this.channels[channel].buffer;
  this.sentSinceLastCheck = true;

  var methodHeaderLen = mframe.length + pframe.length;
  var bodyLen = (content.length > 0) ?
    content.length + FRAME_OVERHEAD : 0;
  var allLen = methodHeaderLen + bodyLen;

  if (allLen < SINGLE_CHUNK_THRESHOLD) {
    var all = new Buffer(allLen);
    var offset = mframe.copy(all, 0);
    offset += pframe.copy(all, offset);

    if (bodyLen > 0)
      makeBodyFrame(channel, content).copy(all, offset);
    return buffer.write(all);
  }
  else {
    if (methodHeaderLen < SINGLE_CHUNK_THRESHOLD) {
      var both = new Buffer(methodHeaderLen);
      var offset = mframe.copy(both, 0);
      pframe.copy(both, offset);
      buffer.write(both);
    }
    else {
      buffer.write(mframe);
      buffer.write(pframe);
    }
    return this.sendContent(channel, content);
  }
};

var FRAME_OVERHEAD = defs.FRAME_OVERHEAD;
var makeBodyFrame = frame.makeBodyFrame;

C.sendContent = function(channel, body) {
  if (!Buffer.isBuffer(body)) {
    throw new TypeError(fmt("Expected buffer; got %s", body));
  }
  var writeResult = true;
  var buffer = this.channels[channel].buffer;

  var maxBody = this.frameMax - FRAME_OVERHEAD;

  for (var offset = 0; offset < body.length; offset += maxBody) {
    var end = offset + maxBody;
    var slice = (end > body.length) ? body.slice(offset) : body.slice(offset, end);
    var bodyFrame = makeBodyFrame(channel, slice);
    writeResult = buffer.write(bodyFrame);
  }
  this.sentSinceLastCheck = true;
  return writeResult;
};

var parseFrame = frame.parseFrame;
var decodeFrame = frame.decodeFrame;

C.recvFrame = function() {
  // %%% identifying invariants might help here?
  var frame = parseFrame(this.rest, this.frameMax);

  if (!frame) {
    var incoming = this.stream.read();
    if (incoming === null) {
      return false;
    }
    else {
      this.recvSinceLastCheck = true;
      this.rest = Buffer.concat([this.rest, incoming]);
      return this.recvFrame();
    }
  }
  else {
    this.rest = frame.rest;
    return decodeFrame(frame);
  }
};

function wrapStream(s) {
  if (s instanceof Duplex) return s;
  else {
    var ws = new Duplex();
    ws.wrap(s); //wraps the readable side of things
    ws._write = function(chunk, encoding, callback) {
      return s.write(chunk, encoding, callback);
    };
    return ws;
  }
}

function isFatalError(error) {
  switch (error && error.code) {
  case defs.constants.CONNECTION_FORCED:
  case defs.constants.REPLY_SUCCESS:
    return false;
  default:
    return true;
  }
}

module.exports.Connection = Connection;
module.exports.isFatalError = isFatalError;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 
//
//

/*

The AMQP 0-9-1 is a mess when it comes to the types that can be
encoded on the wire.

There are four encoding schemes, and three overlapping sets of types:
frames, methods, (field-)tables, and properties.

Each *frame type* has a set layout in which values of given types are
concatenated along with sections of "raw binary" data.

In frames there are `shortstr`s, that is length-prefixed strings of
UTF8 chars, 8 bit unsigned integers (called `octet`), unsigned 16 bit
integers (called `short` or `short-uint`), unsigned 32 bit integers
(called `long` or `long-uint`), unsigned 64 bit integers (called
`longlong` or `longlong-uint`), and flags (called `bit`).

Methods are encoded as a frame giving a method ID and a sequence of
arguments of known types. The encoded method argument values are
concatenated (with some fun complications around "packing" consecutive
bit values into bytes).

Along with the types given in frames, method arguments may be long
byte strings (`longstr`, not required to be UTF8) or 64 bit unsigned
integers to be interpreted as timestamps (yeah I don't know why
either), or arbitrary sets of key-value pairs (called `field-table`).

Inside a field table the keys are `shortstr` and the values are
prefixed with a byte tag giving the type. The types are any of the
above except for bits (which are replaced by byte-wide `bool`), along
with a NULL value `void`, a special fixed-precision number encoding
(`decimal`), IEEE754 `float`s and `double`s, signed integers,
`field-array` (a sequence of tagged values), and nested field-tables.

RabbitMQ and QPid use a subset of the field-table types, and different
value tags, established before the AMQP 0-9-1 specification was
published. So far as I know, no-one uses the types and tags as
published. http://www.rabbitmq.com/amqp-0-9-1-errata.html gives the
list of field-table types.

Lastly, there are (sets of) properties, only one of which is given in
AMQP 0-9-1: `BasicProperties`. These are almost the same as methods,
except that they appear in content header frames, which include a
content size, and they carry a set of flags indicating which
properties are present. This scheme can save ones of bytes per message
(messages which take a minimum of three frames each to send).

*/



var ints = __webpack_require__(7);

// JavaScript uses only doubles so what I'm testing for is whether
// it's *better* to encode a number as a float or double. This really
// just amounts to testing whether there's a fractional part to the
// number, except that see below. NB I don't use bitwise operations to
// do this 'efficiently' -- it would mask the number to 32 bits.
//
// At 2^50, doubles don't have sufficient precision to distinguish
// between floating point and integer numbers (`Math.pow(2, 50) + 0.1
// === Math.pow(2, 50)` (and, above 2^53, doubles cannot represent all
// integers (`Math.pow(2, 53) + 1 === Math.pow(2, 53)`)). Hence
// anything with a magnitude at or above 2^50 may as well be encoded
// as a 64-bit integer. Except that only signed integers are supported
// by RabbitMQ, so anything above 2^63 - 1 must be a double.
function isFloatingPoint(n) {
    return n >= 0x8000000000000000 ||
        (Math.abs(n) < 0x4000000000000
         && Math.floor(n) !== n);
}

function encodeTable(buffer, val, offset) {
    var start = offset;
    offset += 4; // leave room for the table length
    for (var key in val) {
        if (val[key] !== undefined) {
          var len = Buffer.byteLength(key);
          buffer.writeUInt8(len, offset); offset++;
          buffer.write(key, offset, 'utf8'); offset += len;
          offset += encodeFieldValue(buffer, val[key], offset);
        }
    }
    var size = offset - start;
    buffer.writeUInt32BE(size - 4, start);
    return size;
}

function encodeArray(buffer, val, offset) {
    var start = offset;
    offset += 4;
    for (var i=0, num=val.length; i < num; i++) {
        offset += encodeFieldValue(buffer, val[i], offset);
    }
    var size = offset - start;
    buffer.writeUInt32BE(size - 4, start);
    return size;
}

function encodeFieldValue(buffer, value, offset) {
    var start = offset;
    var type = typeof value, val = value;
    // A trapdoor for specifying a type, e.g., timestamp
    if (value && type === 'object' && value.hasOwnProperty('!')) {
        val = value.value;
        type = value['!'];
    }

    function tag(t) { buffer.write(t, offset); offset++; }

    switch (type) {
    case 'string': // no shortstr in field tables
        var len = Buffer.byteLength(val, 'utf8');
        tag('S');
        buffer.writeUInt32BE(len, offset); offset += 4;
        buffer.write(val, offset, 'utf8'); offset += len;
        break;
    case 'object':
        if (val === null) {
            tag('V');
        }
        else if (Array.isArray(val)) {
            tag('A');
            offset += encodeArray(buffer, val, offset);
        }
        else if (Buffer.isBuffer(val)) {
            tag('x');
            buffer.writeUInt32BE(val.length, offset); offset += 4;
            val.copy(buffer, offset); offset += val.length;
        }
        else {
            tag('F');
            offset += encodeTable(buffer, val, offset);
        }
        break;
    case 'boolean':
        tag('t');
        buffer.writeUInt8((val) ? 1 : 0, offset); offset++;
        break;
    case 'number':
        // Making assumptions about the kind of number (floating point
        // v integer, signed, unsigned, size) desired is dangerous in
        // general; however, in practice RabbitMQ uses only
        // longstrings and unsigned integers in its arguments, and
        // other clients generally conflate number types anyway. So
        // the only distinction we care about is floating point vs
        // integers, preferring integers since those can be promoted
        // if necessary. If floating point is required, we may as well
        // use double precision.
        if (isFloatingPoint(val)) {
            tag('d');
            buffer.writeDoubleBE(val, offset);
            offset += 8;
        }
        else { // only signed values are used in tables by
               // RabbitMQ. It *used* to (< v3.3.0) treat the byte 'b'
               // type as unsigned, but most clients (and the spec)
               // think it's signed, and now RabbitMQ does too.
            if (val < 128 && val >= -128) {
                tag('b');
                buffer.writeInt8(val, offset); offset++;
            }
            else if (val >= -0x8000 && val < 0x8000) { //  short
                tag('s');
                buffer.writeInt16BE(val, offset); offset += 2;
            }
            else if (val >= -0x80000000 && val < 0x80000000) { // int
                tag('I');
                buffer.writeInt32BE(val, offset); offset += 4;
            }
            else { // long
                tag('l');
                ints.writeInt64BE(buffer, val, offset); offset += 8;
            }
        }
        break;
    // Now for exotic types, those can only be denoted by using
    // `{'!': type, value: val}
    case 'timestamp':
        tag('T');
        ints.writeUInt64BE(buffer, val, offset); offset += 8;
        break;
    case 'float':
        tag('f');
        buffer.writeFloatBE(val, offset); offset += 4;
        break;
    case 'decimal':
        tag('D');
        if (val.hasOwnProperty('places') && val.hasOwnProperty('digits')
            && val.places >= 0 && val.places < 256) {
            buffer[offset] = val.places; offset++;
            buffer.writeUInt32BE(val.digits, offset); offset += 4;
        }
        else throw new TypeError(
            "Decimal value must be {'places': 0..255, 'digits': uint32}, " +
                "got " + JSON.stringify(val));
        break;
    default:
        throw new TypeError('Unknown type to encode: ' + type);
    }
    return offset - start;
}

// Assume we're given a slice of the buffer that contains just the
// fields.
function decodeFields(slice) {
    var fields = {}, offset = 0, size = slice.length;
    var len, key, val;

    function decodeFieldValue() {
        var tag = String.fromCharCode(slice[offset]); offset++;
        switch (tag) {
        case 'b':
            val = slice.readInt8(offset); offset++;
            break;
        case 'S':
            len = slice.readUInt32BE(offset); offset += 4;
            val = slice.toString('utf8', offset, offset + len);
            offset += len;
            break;
        case 'I':
            val = slice.readInt32BE(offset); offset += 4;
            break;
        case 'D': // only positive decimals, apparently.
            var places = slice[offset]; offset++;
            var digits = slice.readUInt32BE(offset); offset += 4;
            val = {'!': 'decimal', value: {places: places, digits: digits}};
            break;
        case 'T':
            val = ints.readUInt64BE(slice, offset); offset += 8;
            val = {'!': 'timestamp', value: val};
            break;
        case 'F':
            len = slice.readUInt32BE(offset); offset += 4;
            val = decodeFields(slice.slice(offset, offset + len));
            offset += len;
            break;
        case 'A':
            len = slice.readUInt32BE(offset); offset += 4;
            decodeArray(offset + len);
            // NB decodeArray will itself update offset and val
            break;
        case 'd':
            val = slice.readDoubleBE(offset); offset += 8;
            break;
        case 'f':
            val = slice.readFloatBE(offset); offset += 4;
            break;
        case 'l':
            val = ints.readInt64BE(slice, offset); offset += 8;
            break;
        case 's':
            val = slice.readInt16BE(offset); offset += 2;
            break;
        case 't':
            val = slice[offset] != 0; offset++;
            break;
        case 'V':
            val = null;
            break;
        case 'x':
            len = slice.readUInt32BE(offset); offset += 4;
            val = slice.slice(offset, offset + len);
            offset += len;
            break;
        default:
            throw new TypeError('Unexpected type tag "' + tag +'"');
        }
    }

    function decodeArray(until) {
        var vals = [];
        while (offset < until) {
            decodeFieldValue();
            vals.push(val);
        }
        val = vals;
    }

    while (offset < size) {
        len = slice.readUInt8(offset); offset++;
        key = slice.toString('utf8', offset, offset + len);
        offset += len;
        decodeFieldValue();
        fields[key] = val;
    }
    return fields;
}

module.exports.encodeTable = encodeTable;
module.exports.decodeFields = decodeFields;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.parse = __webpack_require__(14).parse;
module.exports.match = __webpack_require__(18).match;
module.exports.build = __webpack_require__(15).build;
module.exports.write = __webpack_require__(15).write;

module.exports.matcher = module.exports.compile =
  __webpack_require__(19).compile;
module.exports.builder = __webpack_require__(19).compile_builder;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// -*- js-indent-level: 2 -*-
// Constructing patterns



function set(values) {
  var s = {};
  for (var i in values) {
    s[values[i]] = 1;
  }
  return s;
}

// Construct a segment bound to a variable, e.g., from a segment like
// "Len:32/unsigned-big". `specifiers0` is an array.
function variable(name, size, specifiers0) {
  var specifiers = set(specifiers0);
  var segment = {name: name};
  segment.type = type_in(specifiers);
  specs(segment, segment.type, specifiers);
  segment.size = size_of(segment, segment.type, size, segment.unit);
  return segment;
}

module.exports.variable = variable;
module.exports.rest = function() {
  return variable('_', true, ['binary']);
}

// Construct a segment with a literal value, e.g., from a segment like
// "206". `specifiers0` is an array.

function value(val, size, specifiers0) {
  var specifiers = set(specifiers0);
  var segment = {value: val};
  segment.type = type_in(specifiers);
  // TODO check type v. value ..
  specs(segment, segment.type, specifiers);
  segment.size = size_of(segment, segment.type, size, segment.unit);
  return segment;
}

module.exports.value = value;

// A string can appear as a literal, but it must appear without
// specifiers.
function string(val) {
  return {value: val, type: 'string'};
}
module.exports.string = string;

var TYPES = {'integer': 1, 'binary': 1, 'float': 1};
function type_in(specifiers) {
  for (var t in specifiers) {
    if (TYPES[t]) { return t; }
  }
  return 'integer';
}

function specs(segment, type, specifiers) {
  switch (type) {
  case 'integer':
    segment.signed = signed_in(specifiers);
    // fall through
  case 'float':
    segment.bigendian = endian_in(specifiers);
    // fall through
  default:
    segment.unit = unit_in(specifiers, segment.type);
  }
  return segment;
}

function endian_in(specifiers) {
  // default is big, but I have chosen true = bigendian
  return !specifiers['little'];
}

function signed_in(specifiers) {
  // this time I got it right; default is unsigned
  return specifiers['signed'];
}

function unit_in(specifiers, type) {
  for (var s in specifiers) {
    if (s.substr(0, 5) == 'unit:') {
      var unit = parseInt(s.substr(5));
      // TODO check sane for type
      return unit;
    }
  }
  // OK defaults then
  switch (type) {
  case 'binary':
    return 8;
  case 'integer':
  case 'float':
    return 1;
  }
}

function size_of(segment, type, size, unit) {
  if (size !== undefined && size !== '') {
    return size;
  }
  else {
    switch (type) {
    case 'integer':
      return 8;
    case 'float':
      return 64;
    case 'binary':
      return true;
    }
  }
}


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = (function(){
  /*
   * Generated by PEG.js 0.7.0.
   *
   * http://pegjs.majda.cz/
   */
  
  function quote(s) {
    /*
     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
     * string literal except for the closing quote character, backslash,
     * carriage return, line separator, paragraph separator, and line feed.
     * Any character may appear in the form of an escape sequence.
     *
     * For portability, we also escape escape all control and non-ASCII
     * characters. Note that "\0" and "\v" escape sequences are not used
     * because JSHint does not like the first and IE the second.
     */
     return '"' + s
      .replace(/\\/g, '\\\\')  // backslash
      .replace(/"/g, '\\"')    // closing quote character
      .replace(/\x08/g, '\\b') // backspace
      .replace(/\t/g, '\\t')   // horizontal tab
      .replace(/\n/g, '\\n')   // line feed
      .replace(/\f/g, '\\f')   // form feed
      .replace(/\r/g, '\\r')   // carriage return
      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
      + '"';
  }
  
  var result = {
    /*
     * Parses the input with a generated parser. If the parsing is successfull,
     * returns a value explicitly or implicitly specified by the grammar from
     * which the parser was generated (see |PEG.buildParser|). If the parsing is
     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
     */
    parse: function(input, startRule) {
      var parseFunctions = {
        "start": parse_start,
        "segmentTail": parse_segmentTail,
        "segment": parse_segment,
        "string": parse_string,
        "chars": parse_chars,
        "char": parse_char,
        "hexDigit": parse_hexDigit,
        "identifier": parse_identifier,
        "number": parse_number,
        "size": parse_size,
        "specifierList": parse_specifierList,
        "specifierTail": parse_specifierTail,
        "specifier": parse_specifier,
        "unit": parse_unit,
        "ws": parse_ws
      };
      
      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "start";
      }
      
      var pos = 0;
      var reportFailures = 0;
      var rightmostFailuresPos = 0;
      var rightmostFailuresExpected = [];
      
      function padLeft(input, padding, length) {
        var result = input;
        
        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }
        
        return result;
      }
      
      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        var escapeChar;
        var length;
        
        if (charCode <= 0xFF) {
          escapeChar = 'x';
          length = 2;
        } else {
          escapeChar = 'u';
          length = 4;
        }
        
        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }
      
      function matchFailed(failure) {
        if (pos < rightmostFailuresPos) {
          return;
        }
        
        if (pos > rightmostFailuresPos) {
          rightmostFailuresPos = pos;
          rightmostFailuresExpected = [];
        }
        
        rightmostFailuresExpected.push(failure);
      }
      
      function parse_start() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_ws();
        if (result0 !== null) {
          result1 = parse_segment();
          if (result1 !== null) {
            result2 = [];
            result3 = parse_segmentTail();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_segmentTail();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, tail) { tail.unshift(head); return tail; })(pos0, result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_segmentTail() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_ws();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 44) {
            result1 = ",";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\",\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_ws();
            if (result2 !== null) {
              result3 = parse_segment();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, seg) { return seg; })(pos0, result0[3]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_segment() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_string();
        if (result0 !== null) {
          result0 = (function(offset, str) { return {string: str}; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_identifier();
          if (result0 !== null) {
            result1 = parse_size();
            result1 = result1 !== null ? result1 : "";
            if (result1 !== null) {
              result2 = parse_specifierList();
              result2 = result2 !== null ? result2 : "";
              if (result2 !== null) {
                result0 = [result0, result1, result2];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, v, size, specs) { return {name: v, size: size, specifiers: specs}; })(pos0, result0[0], result0[1], result0[2]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            result0 = parse_number();
            if (result0 !== null) {
              result1 = parse_size();
              result1 = result1 !== null ? result1 : "";
              if (result1 !== null) {
                result2 = parse_specifierList();
                result2 = result2 !== null ? result2 : "";
                if (result2 !== null) {
                  result0 = [result0, result1, result2];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, v, size, specs) { return {value: v, size: size, specifiers: specs}; })(pos0, result0[0], result0[1], result0[2]);
            }
            if (result0 === null) {
              pos = pos0;
            }
          }
        }
        return result0;
      }
      
      function parse_string() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 34) {
          result0 = "\"";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\\"\"");
          }
        }
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 34) {
            result1 = "\"";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\\"\"");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "";    })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.charCodeAt(pos) === 34) {
            result0 = "\"";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\\"\"");
            }
          }
          if (result0 !== null) {
            result1 = parse_chars();
            if (result1 !== null) {
              if (input.charCodeAt(pos) === 34) {
                result2 = "\"";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\"\\\"\"");
                }
              }
              if (result2 !== null) {
                result0 = [result0, result1, result2];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, chars) { return chars; })(pos0, result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_chars() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_char();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_char();
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { return chars.join(""); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_char() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        if (/^[^"\\\0-\x1F]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[^\"\\\\\\0-\\x1F]");
          }
        }
        if (result0 === null) {
          pos0 = pos;
          if (input.substr(pos, 2) === "\\\"") {
            result0 = "\\\"";
            pos += 2;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\\\\\\"\"");
            }
          }
          if (result0 !== null) {
            result0 = (function(offset) { return '"';  })(pos0);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            if (input.substr(pos, 2) === "\\\\") {
              result0 = "\\\\";
              pos += 2;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"\\\\\\\\\"");
              }
            }
            if (result0 !== null) {
              result0 = (function(offset) { return "\\"; })(pos0);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              if (input.substr(pos, 2) === "\\/") {
                result0 = "\\/";
                pos += 2;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"\\\\/\"");
                }
              }
              if (result0 !== null) {
                result0 = (function(offset) { return "/";  })(pos0);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                pos0 = pos;
                if (input.substr(pos, 2) === "\\b") {
                  result0 = "\\b";
                  pos += 2;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"\\\\b\"");
                  }
                }
                if (result0 !== null) {
                  result0 = (function(offset) { return "\b"; })(pos0);
                }
                if (result0 === null) {
                  pos = pos0;
                }
                if (result0 === null) {
                  pos0 = pos;
                  if (input.substr(pos, 2) === "\\f") {
                    result0 = "\\f";
                    pos += 2;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"\\\\f\"");
                    }
                  }
                  if (result0 !== null) {
                    result0 = (function(offset) { return "\f"; })(pos0);
                  }
                  if (result0 === null) {
                    pos = pos0;
                  }
                  if (result0 === null) {
                    pos0 = pos;
                    if (input.substr(pos, 2) === "\\n") {
                      result0 = "\\n";
                      pos += 2;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"\\\\n\"");
                      }
                    }
                    if (result0 !== null) {
                      result0 = (function(offset) { return "\n"; })(pos0);
                    }
                    if (result0 === null) {
                      pos = pos0;
                    }
                    if (result0 === null) {
                      pos0 = pos;
                      if (input.substr(pos, 2) === "\\r") {
                        result0 = "\\r";
                        pos += 2;
                      } else {
                        result0 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"\\\\r\"");
                        }
                      }
                      if (result0 !== null) {
                        result0 = (function(offset) { return "\r"; })(pos0);
                      }
                      if (result0 === null) {
                        pos = pos0;
                      }
                      if (result0 === null) {
                        pos0 = pos;
                        if (input.substr(pos, 2) === "\\t") {
                          result0 = "\\t";
                          pos += 2;
                        } else {
                          result0 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"\\\\t\"");
                          }
                        }
                        if (result0 !== null) {
                          result0 = (function(offset) { return "\t"; })(pos0);
                        }
                        if (result0 === null) {
                          pos = pos0;
                        }
                        if (result0 === null) {
                          pos0 = pos;
                          pos1 = pos;
                          if (input.substr(pos, 2) === "\\u") {
                            result0 = "\\u";
                            pos += 2;
                          } else {
                            result0 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"\\\\u\"");
                            }
                          }
                          if (result0 !== null) {
                            result1 = parse_hexDigit();
                            if (result1 !== null) {
                              result2 = parse_hexDigit();
                              if (result2 !== null) {
                                result3 = parse_hexDigit();
                                if (result3 !== null) {
                                  result4 = parse_hexDigit();
                                  if (result4 !== null) {
                                    result0 = [result0, result1, result2, result3, result4];
                                  } else {
                                    result0 = null;
                                    pos = pos1;
                                  }
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                          if (result0 !== null) {
                            result0 = (function(offset, h1, h2, h3, h4) {
                                return String.fromCharCode(parseInt("0x" + h1 + h2 + h3 + h4));
                              })(pos0, result0[1], result0[2], result0[3], result0[4]);
                          }
                          if (result0 === null) {
                            pos = pos0;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_hexDigit() {
        var result0;
        
        if (/^[0-9a-fA-F]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[0-9a-fA-F]");
          }
        }
        return result0;
      }
      
      function parse_identifier() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (/^[_a-zA-Z]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[_a-zA-Z]");
          }
        }
        if (result0 !== null) {
          result1 = [];
          if (/^[_a-zA-Z0-9]/.test(input.charAt(pos))) {
            result2 = input.charAt(pos);
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("[_a-zA-Z0-9]");
            }
          }
          while (result2 !== null) {
            result1.push(result2);
            if (/^[_a-zA-Z0-9]/.test(input.charAt(pos))) {
              result2 = input.charAt(pos);
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("[_a-zA-Z0-9]");
              }
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, tail) { return head + tail.join(''); })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_number() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        if (input.charCodeAt(pos) === 48) {
          result0 = "0";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"0\"");
          }
        }
        if (result0 !== null) {
          result0 = (function(offset) { return 0; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (/^[1-9]/.test(input.charAt(pos))) {
            result0 = input.charAt(pos);
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("[1-9]");
            }
          }
          if (result0 !== null) {
            result1 = [];
            if (/^[0-9]/.test(input.charAt(pos))) {
              result2 = input.charAt(pos);
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("[0-9]");
              }
            }
            while (result2 !== null) {
              result1.push(result2);
              if (/^[0-9]/.test(input.charAt(pos))) {
                result2 = input.charAt(pos);
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("[0-9]");
                }
              }
            }
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, head, tail) { return parseInt(head + tail.join('')); })(pos0, result0[0], result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_size() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 58) {
          result0 = ":";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\":\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_number();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, num) { return num; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.charCodeAt(pos) === 58) {
            result0 = ":";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\":\"");
            }
          }
          if (result0 !== null) {
            result1 = parse_identifier();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, id) { return id; })(pos0, result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_specifierList() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 47) {
          result0 = "/";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"/\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_specifier();
          if (result1 !== null) {
            result2 = [];
            result3 = parse_specifierTail();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_specifierTail();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, tail) { tail.unshift(head); return tail; })(pos0, result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_specifierTail() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 45) {
          result0 = "-";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"-\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_specifier();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, spec) { return spec; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_specifier() {
        var result0;
        
        if (input.substr(pos, 6) === "little") {
          result0 = "little";
          pos += 6;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"little\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 3) === "big") {
            result0 = "big";
            pos += 3;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"big\"");
            }
          }
          if (result0 === null) {
            if (input.substr(pos, 6) === "signed") {
              result0 = "signed";
              pos += 6;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"signed\"");
              }
            }
            if (result0 === null) {
              if (input.substr(pos, 8) === "unsigned") {
                result0 = "unsigned";
                pos += 8;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"unsigned\"");
                }
              }
              if (result0 === null) {
                if (input.substr(pos, 7) === "integer") {
                  result0 = "integer";
                  pos += 7;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"integer\"");
                  }
                }
                if (result0 === null) {
                  if (input.substr(pos, 6) === "binary") {
                    result0 = "binary";
                    pos += 6;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"binary\"");
                    }
                  }
                  if (result0 === null) {
                    if (input.substr(pos, 5) === "float") {
                      result0 = "float";
                      pos += 5;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"float\"");
                      }
                    }
                    if (result0 === null) {
                      result0 = parse_unit();
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_unit() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 5) === "unit:") {
          result0 = "unit:";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"unit:\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_number();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, num) { return 'unit:' + num; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_ws() {
        var result0, result1;
        
        result0 = [];
        if (/^[ \t\n]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[ \\t\\n]");
          }
        }
        while (result1 !== null) {
          result0.push(result1);
          if (/^[ \t\n]/.test(input.charAt(pos))) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("[ \\t\\n]");
            }
          }
        }
        return result0;
      }
      
      
      function cleanupExpected(expected) {
        expected.sort();
        
        var lastExpected = null;
        var cleanExpected = [];
        for (var i = 0; i < expected.length; i++) {
          if (expected[i] !== lastExpected) {
            cleanExpected.push(expected[i]);
            lastExpected = expected[i];
          }
        }
        return cleanExpected;
      }
      
      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */
        
        var line = 1;
        var column = 1;
        var seenCR = false;
        
        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
          var ch = input.charAt(i);
          if (ch === "\n") {
            if (!seenCR) { line++; }
            column = 1;
            seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }
        
        return { line: line, column: column };
      }
      
      
      var result = parseFunctions[startRule]();
      
      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var offset = Math.max(pos, rightmostFailuresPos);
        var found = offset < input.length ? input.charAt(offset) : null;
        var errorPosition = computeErrorPosition();
        
        throw new this.SyntaxError(
          cleanupExpected(rightmostFailuresExpected),
          found,
          offset,
          errorPosition.line,
          errorPosition.column
        );
      }
      
      return result;
    },
    
    /* Returns the parser source code. */
    toSource: function() { return this._source; }
  };
  
  /* Thrown when a parser encounters a syntax error. */
  
  result.SyntaxError = function(expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      var expectedHumanized, foundHumanized;
      
      switch (expected.length) {
        case 0:
          expectedHumanized = "end of input";
          break;
        case 1:
          expectedHumanized = expected[0];
          break;
        default:
          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
            + " or "
            + expected[expected.length - 1];
      }
      
      foundHumanized = found ? quote(found) : "end of input";
      
      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
    }
    
    this.name = "SyntaxError";
    this.expected = expected;
    this.found = found;
    this.message = buildMessage(expected, found);
    this.offset = offset;
    this.line = line;
    this.column = column;
  };
  
  result.SyntaxError.prototype = Error.prototype;
  
  return result;
})();


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//
//
//



// A Mux is an object into which other readable streams may be piped;
// it then writes 'packets' from the upstreams to the given
// downstream.

var inherits = __webpack_require__(1).inherits;
var assert = __webpack_require__(13);

var schedule = (typeof setImmediate === 'function') ?
  setImmediate : process.nextTick;

function Mux(downstream) {
  this.newStreams = [];
  this.oldStreams = [];
  this.blocked = false;
  this.scheduledRead = false;

  this.out = downstream;
  var self = this;
  downstream.on('drain', function() {
    self.blocked = false;
    self._readIncoming();
  });
}

// There are 2 states we can be in:

// - waiting for outbound capacity, which will be signalled by a
// - 'drain' event on the downstream; or,

// - no packets to send, waiting for an inbound buffer to have
//   packets, which will be signalled by a 'readable' event

// If we write all packets available whenever there is outbound
// capacity, we will either run out of outbound capacity (`#write`
// returns false), or run out of packets (all calls to an
// `inbound.read()` have returned null).

Mux.prototype._readIncoming = function() {

  // We may be sent here speculatively, if an incoming stream has
  // become readable
  if (this.blocked) return;

  var self = this;
  var accepting = true;
  var out = this.out;

  // Try to read a chunk from each stream in turn, until all streams
  // are empty, or we exhaust our ability to accept chunks.
  function roundrobin(streams) {
    var s;
    // if there's just one incoming stream we don't have to
    // go through all the dequeue/enqueueing
    if (streams.length === 1) {
      s = streams.shift();
      while (accepting) {
        var chunk = s.read();
        if (chunk !== null) {
          accepting = out.write(chunk);
        }
        else break;
      }
      if (!accepting) streams.push(s);
    }
    else {
      while (accepting && (s = streams.shift())) {
        var chunk = s.read();
        if (chunk !== null) {
          accepting = out.write(chunk);
          streams.push(s);
        }
      }
    }
  }

  roundrobin(this.newStreams);

  // Either we exhausted the new queues, or we ran out of capacity. If
  // we ran out of capacity, all the remaining new streams (i.e.,
  // those with packets left) become old streams. This effectively
  // prioritises streams that keep their buffers close to empty over
  // those that are constantly near full.

  if (accepting) { // all new queues are exhausted, write as many as
                   // we can from the old streams
    assert.equal(0, this.newStreams.length);
    roundrobin(this.oldStreams);
  }
  else { // ran out of room
    assert(this.newStreams.length > 0, "Expect some new streams to remain");
    this.oldStreams = this.oldStreams.concat(this.newStreams);
    this.newStreams = [];
  }
  // We may have exhausted all the old queues, or run out of room;
  // either way, all we need to do is record whether we have capacity
  // or not, so any speculative reads will know
  this.blocked = !accepting;
};

Mux.prototype._scheduleRead = function() {
  var self = this;
  
  if (!self.scheduledRead) {
    schedule(function() {
      self.scheduledRead = false;
      self._readIncoming();
    });
    self.scheduledRead = true;
  }
};

Mux.prototype.pipeFrom = function(readable) {
  var self = this;

  function enqueue() {
    self.newStreams.push(readable);
    self._scheduleRead();
  }

  function cleanup() {
    readable.removeListener('readable', enqueue);
    readable.removeListener('error', cleanup);
    readable.removeListener('end', cleanup);
    readable.removeListener('unpipeFrom', cleanupIfMe);
  }
  function cleanupIfMe(dest) {
    if (dest === self) cleanup();
  }

  readable.on('unpipeFrom', cleanupIfMe);
  readable.on('end', cleanup);
  readable.on('error', cleanup);
  readable.on('readable', enqueue);
};

Mux.prototype.unpipeFrom = function(readable) {
  readable.emit('unpipeFrom', this);
};

module.exports.Mux = Mux;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3)


/***/ }),
/* 38 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = __webpack_require__(40);
/*</replacement>*/


/*<replacement>*/
var Buffer = __webpack_require__(16).Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = __webpack_require__(10).EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = __webpack_require__(11);

/*<replacement>*/
var util = __webpack_require__(8);
util.inherits = __webpack_require__(9);
/*</replacement>*/

var StringDecoder;


/*<replacement>*/
var debug = __webpack_require__(1);
if (debug && debug.debuglog) {
  debug = debug.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/


util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  var Duplex = __webpack_require__(3);

  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.readableObjectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = __webpack_require__(20).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  var Duplex = __webpack_require__(3);

  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (util.isString(chunk) && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (util.isNullOrUndefined(chunk)) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      if (!addToFront)
        state.reading = false;

      // if we want the data now, just emit it.
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit('data', chunk);
        stream.read(0);
      } else {
        // update the buffer info.
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);

        if (state.needReadable)
          emitReadable(stream);
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = __webpack_require__(20).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (isNaN(n) || util.isNull(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  debug('read', n);
  var state = this._readableState;
  var nOrig = n;

  if (!util.isNumber(n) || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended)
      endReadable(this);
    else
      emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  }

  if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (util.isNull(ret)) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we tried to read() past the EOF, then emit end on the next tick.
  if (nOrig !== n && state.ended && state.length === 0)
    endReadable(this);

  if (!util.isNull(ret))
    this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync)
      process.nextTick(function() {
        emitReadable_(stream);
      });
    else
      emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain &&
        (!dest._writableState || dest._writableState.needDrain))
      ondrain();
  }

  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    if (false === ret) {
      debug('false write response, pause',
            src._readableState.awaitDrain);
      src._readableState.awaitDrain++;
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain)
      state.awaitDrain--;
    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
  if (ev === 'data' && false !== this._readableState.flowing) {
    this.resume();
  }

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        var self = this;
        process.nextTick(function() {
          debug('readable nexttick read 0');
          self.read(0);
        });
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    if (!state.reading) {
      debug('resume read 0');
      this.read(0);
    }
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(function() {
      resume_(stream, state);
    });
  }
}

function resume_(stream, state) {
  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading)
    stream.read(0);
}

Readable.prototype.pause = function() {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  if (state.flowing) {
    do {
      var chunk = stream.read();
    } while (null !== chunk && state.flowing);
  }
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    debug('wrapped data');
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}


/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = __webpack_require__(16).Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = __webpack_require__(8);
util.inherits = __webpack_require__(9);
/*</replacement>*/

var Stream = __webpack_require__(11);

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  var Duplex = __webpack_require__(3);

  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.writableObjectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = __webpack_require__(3);

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (util.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (!util.isFunction(cb))
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function() {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function() {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing &&
        !state.corked &&
        !state.finished &&
        !state.bufferProcessing &&
        state.buffer.length)
      clearBuffer(this, state);
  }
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      util.isString(chunk)) {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (util.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing || state.corked)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, false, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev)
    stream._writev(chunk, state.onwrite);
  else
    stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      state.pendingcb--;
      cb(er);
    });
  else {
    state.pendingcb--;
    cb(er);
  }

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished &&
        !state.corked &&
        !state.bufferProcessing &&
        state.buffer.length) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  if (stream._writev && state.buffer.length > 1) {
    // Fast case, write everything using _writev()
    var cbs = [];
    for (var c = 0; c < state.buffer.length; c++)
      cbs.push(state.buffer[c].callback);

    // count the one we are adding, as well.
    // TODO(isaacs) clean this up
    state.pendingcb++;
    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
      for (var i = 0; i < cbs.length; i++) {
        state.pendingcb--;
        cbs[i](err);
      }
    });

    // Clear buffer
    state.buffer = [];
  } else {
    // Slow case, write chunks one-by-one
    for (var c = 0; c < state.buffer.length; c++) {
      var entry = state.buffer[c];
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);

      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        c++;
        break;
      }
    }

    if (c < state.buffer.length)
      state.buffer = state.buffer.slice(c);
    else
      state.buffer.length = 0;
  }

  state.bufferProcessing = false;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));

};

Writable.prototype._writev = null;

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (util.isFunction(chunk)) {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (!util.isNullOrUndefined(chunk))
    this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else
      prefinish(stream, state);
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//
//
//

// Heartbeats. In AMQP both clients and servers may expect a heartbeat
// frame if there is no activity on the connection for a negotiated
// period of time. If there's no activity for two such intervals, the
// server or client is allowed to close the connection on the
// presumption that the other party is dead.
//
// The client has two jobs here: the first is to send a heartbeat
// frame if it's not sent any frames for a while, so that the server
// doesn't think it's dead; the second is to check periodically that
// it's seen activity from the server, and to advise if there doesn't
// appear to have been any for over two intervals.
//
// Node.JS timers are a bit unreliable, in that they endeavour only to
// fire at some indeterminate point *after* the given time (rather
// gives the lie to 'realtime', dunnit). Because the scheduler is just
// an event loop, it's quite easy to delay timers indefinitely by
// reacting to some I/O with a lot of computation.
//
// To mitigate this I need a bit of creative interpretation:
//
//  - I'll schedule a server activity check for every `interval`, and
//    check just how much time has passed. It will overshoot by at
//    least a small margin; modulo missing timer deadlines, it'll
//    notice between two and three intervals after activity actually
//    stops (otherwise, at some point after two intervals).
//
//  - Every `interval / 2` I'll check that we've sent something since
//    the last check, and if not, send a heartbeat frame. If we're
//    really too busy to even run the check for two whole heartbeat
//    intervals, there must be a lot of I (but not O, at least not on
//    the connection), or computation, in which case perhaps it's best
//    the server cuts us off anyway. Why `interval / 2`? Because the
//    edge case is that the client sent a frame just after a
//    heartbeat, which would mean I only send one after almost two
//    intervals. (NB a heartbeat counts as a send, so it'll be checked
//    at least twice before sending another)
//
// This design is based largely on RabbitMQ's heartbeating:
// https://github.com/rabbitmq/rabbitmq-common/blob/master/src/rabbit_heartbeat.erl

// %% Yes, I could apply the same 'actually passage of time' thing to
// %% send as well as to recv.



var inherits = __webpack_require__(1).inherits;
var EventEmitter = __webpack_require__(10).EventEmitter;

// Exported so that we can mess with it in tests
module.exports.UNITS_TO_MS = 1000;

function Heart(interval, checkSend, checkRecv) {
  EventEmitter.call(this);
  this.interval = interval;

  var intervalMs = interval * module.exports.UNITS_TO_MS;
  // Function#bind is my new best friend
  var beat = this.emit.bind(this, 'beat');
  var timeout = this.emit.bind(this, 'timeout');

  this.sendTimer = setInterval(
    this.runHeartbeat.bind(this, checkSend, beat), intervalMs / 2);

  // A timeout occurs if I see nothing for *two consecutive* intervals
  var recvMissed = 0;
  function missedTwo() {
    if (!checkRecv()) return (++recvMissed < 2);
    else { recvMissed = 0; return true; }
  }
  this.recvTimer = setInterval(
    this.runHeartbeat.bind(this, missedTwo, timeout), intervalMs);
}
inherits(Heart, EventEmitter);

module.exports.Heart = Heart;

Heart.prototype.clear = function() {
  clearInterval(this.sendTimer);
  clearInterval(this.recvTimer);
};

Heart.prototype.runHeartbeat = function(check, fail) {
  // Have we seen activity?
  if (!check()) fail();
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//
//
//

// A bitset implementation, after that in java.util.  Yes there
// already exist such things, but none implement next{Clear|Set}Bit or
// equivalent, and none involved me tooling about for an evening.



function BitSet(size) {
  if (size) {
    var numWords = Math.ceil(size / 32);
    this.words = new Array(numWords);
  }
  else {
    this.words = [];
  }
  this.wordsInUse = 0; // = number, not index
}

var P = BitSet.prototype;

function wordIndex(bitIndex) {
  return Math.floor(bitIndex / 32);
}

// Make sure we have at least numWords
P.ensureSize = function(numWords) {
  var wordsPresent = this.words.length;
  if (wordsPresent < numWords) {
    this.words = this.words.concat(new Array(numWords - wordsPresent));
  }
}

P.set = function(bitIndex) {
  var w = wordIndex(bitIndex);
  if (w >= this.wordsInUse) {
    this.ensureSize(w + 1);
    this.wordsInUse = w + 1;
  }
  var bit = 1 << bitIndex;
  this.words[w] |= bit;
};

P.clear = function(bitIndex) {
  var w = wordIndex(bitIndex);
  if (w >= this.wordsInUse) return;
  var mask = ~(1 << bitIndex);
  this.words[w] &= mask;
};

P.get = function(bitIndex) {
  var w = wordIndex(bitIndex);
  if (w >= this.wordsInUse) return false; // >= since index vs size
  var bit = 1 << bitIndex;
  return !!(this.words[w] & bit);
}

function trailingZeros(i) {
  // From Hacker's Delight, via JDK. Probably far less effective here,
  // since bit ops are not necessarily the quick way to do things in
  // JS.
  if (i === 0) return 32;
  var y, n = 31;
  y = i << 16; if (y != 0) { n = n -16; i = y; }
  y = i << 8;  if (y != 0) { n = n - 8; i = y; }
  y = i << 4;  if (y != 0) { n = n - 4; i = y; }
  y = i << 2;  if (y != 0) { n = n - 2; i = y; }
  return n - ((i << 1) >>> 31);
}

// Give the next bit that's set on or after fromIndex, or -1 if no such
// bit
P.nextSetBit = function(fromIndex) {
  var w = wordIndex(fromIndex);
  if (w >= this.wordsInUse) return -1;

  // the right-hand side is shifted to only test the bits of the first
  // word that are > fromIndex
  var word = this.words[w] & (0xffffffff << fromIndex);
  while (true) {
    if (word) return (w * 32) + trailingZeros(word);
    w++;
    if (w === this.wordsInUse) return -1;
    word = this.words[w];
  }
};

P.nextClearBit = function(fromIndex) {
  var w = wordIndex(fromIndex);
  if (w >= this.wordsInUse) return fromIndex;

  var word = ~(this.words[w]) & (0xffffffff << fromIndex);
  while (true) {
    if (word) return (w * 32) + trailingZeros(word);
    w++;
    if (w == this.wordsInUse) return w * 32;
    word = ~(this.words[w]);
  }
};

module.exports.BitSet = BitSet;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(45)


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = __webpack_require__(46);

/*<replacement>*/
var util = __webpack_require__(8);
util.inherits = __webpack_require__(9);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = __webpack_require__(3);

/*<replacement>*/
var util = __webpack_require__(8);
util.inherits = __webpack_require__(9);
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (!util.isNullOrUndefined(data))
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('prefinish', function() {
    if (util.isFunction(this._flush))
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}


/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = {"name":"amqplib","homepage":"http://squaremo.github.io/amqp.node/","main":"./channel_api.js","version":"0.5.1","description":"An AMQP 0-9-1 (e.g., RabbitMQ) library and client.","repository":{"type":"git","url":"https://github.com/squaremo/amqp.node.git"},"engines":{"node":">=0.8 <6 || ^6"},"dependencies":{"bitsyntax":"~0.0.4","buffer-more-ints":"0.0.2","readable-stream":"1.x >=1.1.9","bluebird":"^3.4.6"},"devDependencies":{"mocha":"~1","claire":"0.4.1","uglify-js":"2.4.x","istanbul":"0.1.x"},"scripts":{"test":"make test","prepublish":"make"},"keywords":["AMQP","AMQP 0-9-1","RabbitMQ"],"author":"Michael Bridgen <mikeb@squaremobius.net>","license":"MIT"}

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("tls");

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//
//
//



var defs = __webpack_require__(6);
var Promise = __webpack_require__(51);
var inherits = __webpack_require__(1).inherits;
var EventEmitter = __webpack_require__(10).EventEmitter;
var BaseChannel = __webpack_require__(24).BaseChannel;
var acceptMessage = __webpack_require__(24).acceptMessage;
var Args = __webpack_require__(82);

function CallbackModel(connection) {
  if (!(this instanceof CallbackModel))
    return new CallbackModel(connection);
  EventEmitter.call( this );
  this.connection = connection;
  var self = this;
  ['error', 'close', 'blocked', 'unblocked'].forEach(function(ev) {
    connection.on(ev, self.emit.bind(self, ev));
  });
}
inherits(CallbackModel, EventEmitter);

module.exports.CallbackModel = CallbackModel;

CallbackModel.prototype.close = function(cb) {
  this.connection.close(cb);
};

function Channel(connection) {
  BaseChannel.call(this, connection);
  this.on('delivery', this.handleDelivery.bind(this));
  this.on('cancel', this.handleCancel.bind(this));
}
inherits(Channel, BaseChannel);

module.exports.Channel = Channel;

CallbackModel.prototype.createChannel = function(cb) {
  var ch = new Channel(this.connection);
  ch.open(function(err, ok) {
    if (err === null) cb && cb(null, ch);
    else cb && cb(err);
  });
  return ch;
};

// Wrap an RPC callback to make sure the callback is invoked with
// either `(null, value)` or `(error)`, i.e., never two non-null
// values. Also substitutes a stub if the callback is `undefined` or
// otherwise falsey, for convenience in methods for which the callback
// is optional (that is, most of them).
function callbackWrapper(ch, cb) {
  return (cb) ? function(err, ok) {
    if (err === null) {
      cb(null, ok);
    }
    else cb(err);
  } : function() {};
}

// This encodes straight-forward RPC: no side-effects and return the
// fields from the server response. It wraps the callback given it, so
// the calling method argument can be passed as-is. For anything that
// needs to have side-effects, or needs to change the server response,
// use `#_rpc(...)` and remember to dereference `.fields` of the
// server response.
Channel.prototype.rpc = function(method, fields, expect, cb0) {
  var cb = callbackWrapper(this, cb0);
  this._rpc(method, fields, expect, function(err, ok) {
    cb(err, ok && ok.fields); // in case of an error, ok will be
                              // undefined
  });
  return this;
};

// === Public API ===

Channel.prototype.open = function(cb) {
  try { this.allocate(); }
  catch (e) { return cb(e); }

  return this.rpc(defs.ChannelOpen, {outOfBand: ""},
                  defs.ChannelOpenOk, cb);
};

Channel.prototype.close = function(cb) {
  return this.closeBecause("Goodbye", defs.constants.REPLY_SUCCESS,
                           function() { cb && cb(null); });
};

Channel.prototype.assertQueue = function(queue, options, cb) {
  return this.rpc(defs.QueueDeclare,
                  Args.assertQueue(queue, options),
                  defs.QueueDeclareOk, cb);
};

Channel.prototype.checkQueue = function(queue, cb) {
  return this.rpc(defs.QueueDeclare,
                  Args.checkQueue(queue),
                  defs.QueueDeclareOk, cb);
};

Channel.prototype.deleteQueue = function(queue, options, cb) {
  return this.rpc(defs.QueueDelete,
                  Args.deleteQueue(queue, options),
                  defs.QueueDeleteOk, cb);
};

Channel.prototype.purgeQueue = function(queue, cb) {
  return this.rpc(defs.QueuePurge,
                  Args.purgeQueue(queue),
                  defs.QueuePurgeOk, cb);
};

Channel.prototype.bindQueue =
  function(queue, source, pattern, argt, cb) {
    return this.rpc(defs.QueueBind,
                    Args.bindQueue(queue, source, pattern, argt),
                    defs.QueueBindOk, cb);
  };

Channel.prototype.unbindQueue =
  function(queue, source, pattern, argt, cb) {
    return this.rpc(defs.QueueUnbind,
                    Args.unbindQueue(queue, source, pattern, argt),
                    defs.QueueUnbindOk, cb);
  };

Channel.prototype.assertExchange = function(ex, type, options, cb0) {
  var cb = callbackWrapper(this, cb0);
  this._rpc(defs.ExchangeDeclare,
            Args.assertExchange(ex, type, options),
            defs.ExchangeDeclareOk,
            function(e, _) { cb(e, {exchange: ex}); });
  return this;
};

Channel.prototype.checkExchange = function(exchange, cb) {
  return this.rpc(defs.ExchangeDeclare,
                  Args.checkExchange(exchange),
                  defs.ExchangeDeclareOk, cb);
};

Channel.prototype.deleteExchange = function(exchange, options, cb) {
  return this.rpc(defs.ExchangeDelete,
                  Args.deleteExchange(exchange, options),
                  defs.ExchangeDeleteOk, cb);
};

Channel.prototype.bindExchange =
  function(dest, source, pattern, argt, cb) {
    return this.rpc(defs.ExchangeBind,
                    Args.bindExchange(dest, source, pattern, argt),
                    defs.ExchangeBindOk, cb);
  };

Channel.prototype.unbindExchange =
  function(dest, source, pattern, argt, cb) {
    return this.rpc(defs.ExchangeUnbind,
                    Args.unbindExchange(dest, source, pattern, argt),
                    defs.ExchangeUnbindOk, cb);
  };

Channel.prototype.publish =
  function(exchange, routingKey, content, options) {
    var fieldsAndProps = Args.publish(exchange, routingKey, options);
    return this.sendMessage(fieldsAndProps, fieldsAndProps, content);
  };

Channel.prototype.sendToQueue = function(queue, content, options) {
  return this.publish('', queue, content, options);
};

Channel.prototype.consume = function(queue, callback, options, cb0) {
  var cb = callbackWrapper(this, cb0);
  var fields = Args.consume(queue, options);
  var self = this;
  this._rpc(
    defs.BasicConsume, fields, defs.BasicConsumeOk,
    function(err, ok) {
      if (err === null) {
        self.registerConsumer(ok.fields.consumerTag, callback);
        cb(null, ok.fields);
      }
      else cb(err);
    });
  return this;
};

Channel.prototype.cancel = function(consumerTag, cb0) {
  var cb = callbackWrapper(this, cb0);
  var self = this;
  this._rpc(
    defs.BasicCancel, Args.cancel(consumerTag), defs.BasicCancelOk,
    function(err, ok) {
      if (err === null) {
        self.unregisterConsumer(consumerTag);
        cb(null, ok.fields);
      }
      else cb(err);
    });
  return this;
};

Channel.prototype.get = function(queue, options, cb0) {
  var self = this;
  var fields = Args.get(queue, options);
  var cb = callbackWrapper(this, cb0);
  this.sendOrEnqueue(defs.BasicGet, fields, function(err, f) {
    if (err === null) {
      if (f.id === defs.BasicGetEmpty) {
        cb(null, false);
      }
      else if (f.id === defs.BasicGetOk) {
        self.handleMessage = acceptMessage(function(m) {
          m.fields = f.fields;
          cb(null, m);
        });
      }
      else {
        cb(new Error("Unexpected response to BasicGet: " +
                     inspect(f)));
      }
    }
  });
  return this;
};

Channel.prototype.ack = function(message, allUpTo) {
  this.sendImmediately(
    defs.BasicAck, Args.ack(message.fields.deliveryTag, allUpTo));
  return this;
};

Channel.prototype.ackAll = function() {
  this.sendImmediately(defs.BasicAck, Args.ack(0, true));
  return this;
};

Channel.prototype.nack = function(message, allUpTo, requeue) {
  this.sendImmediately(
    defs.BasicNack,
    Args.nack(message.fields.deliveryTag, allUpTo, requeue));
  return this;
};

Channel.prototype.nackAll = function(requeue) {
  this.sendImmediately(
    defs.BasicNack, Args.nack(0, true, requeue))
  return this;
};

Channel.prototype.reject = function(message, requeue) {
  this.sendImmediately(
    defs.BasicReject,
    Args.reject(message.fields.deliveryTag, requeue));
  return this;
};

Channel.prototype.prefetch = function(count, global, cb) {
  return this.rpc(defs.BasicQos,
                  Args.prefetch(count, global),
                  defs.BasicQosOk, cb);
};

Channel.prototype.recover = function(cb) {
  return this.rpc(defs.BasicRecover,
                  Args.recover(),
                  defs.BasicRecoverOk, cb);
};

function ConfirmChannel(connection) {
  Channel.call(this, connection);
}
inherits(ConfirmChannel, Channel);

module.exports.ConfirmChannel = ConfirmChannel;

CallbackModel.prototype.createConfirmChannel = function(cb) {
  var ch = new ConfirmChannel(this.connection);
  ch.open(function(err) {
    if (err !== null) return cb && cb(err);
    else {
      ch.rpc(defs.ConfirmSelect, {nowait: false},
             defs.ConfirmSelectOk, function(err, _ok) {
               if (err !== null) return cb && cb(err);
               else cb && cb(null, ch);
             });
    }
  });
  return ch;
};

ConfirmChannel.prototype.publish = function(exchange, routingKey,
                                            content, options, cb) {
  this.pushConfirmCallback(cb);
  return Channel.prototype.publish.call(
    this, exchange, routingKey, content, options);
};

ConfirmChannel.prototype.sendToQueue = function(queue, content,
                                                options, cb) {
  return this.publish('', queue, content, options, cb);
};

ConfirmChannel.prototype.waitForConfirms = function(k) {
  var awaiting = [];
  var unconfirmed = this.unconfirmed;
  unconfirmed.forEach(function(val, index) {
    if (val === null); // already confirmed
    else {
      var confirmed = new Promise(function(resolve, reject) {
        unconfirmed[index] = function(err) {
          if (val) val(err);
          if (err === null) resolve();
          else reject(err);
        };
      });
      awaiting.push(confirmed);
    }
  });
  return Promise.all(awaiting).then(function() { k(); },
                                 function(err) { k(err); });
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var old;
if (typeof Promise !== "undefined") old = Promise;
function noConflict() {
    try { if (Promise === bluebird) Promise = old; }
    catch (e) {}
    return bluebird;
}
var bluebird = __webpack_require__(52)();
bluebird.noConflict = noConflict;
module.exports = bluebird;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function() {
var makeSelfResolutionError = function () {
    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var reflectHandler = function() {
    return new Promise.PromiseInspection(this._target());
};
var apiRejection = function(msg) {
    return Promise.reject(new TypeError(msg));
};
function Proxyable() {}
var UNDEFINED_BINDING = {};
var util = __webpack_require__(0);

var getDomain;
if (util.isNode) {
    getDomain = function() {
        var ret = process.domain;
        if (ret === undefined) ret = null;
        return ret;
    };
} else {
    getDomain = function() {
        return null;
    };
}
util.notEnumerableProp(Promise, "_getDomain", getDomain);

var es5 = __webpack_require__(5);
var Async = __webpack_require__(53);
var async = new Async();
es5.defineProperty(Promise, "_async", {value: async});
var errors = __webpack_require__(2);
var TypeError = Promise.TypeError = errors.TypeError;
Promise.RangeError = errors.RangeError;
var CancellationError = Promise.CancellationError = errors.CancellationError;
Promise.TimeoutError = errors.TimeoutError;
Promise.OperationalError = errors.OperationalError;
Promise.RejectionError = errors.OperationalError;
Promise.AggregateError = errors.AggregateError;
var INTERNAL = function(){};
var APPLY = {};
var NEXT_FILTER = {};
var tryConvertToPromise = __webpack_require__(56)(Promise, INTERNAL);
var PromiseArray =
    __webpack_require__(57)(Promise, INTERNAL,
                               tryConvertToPromise, apiRejection, Proxyable);
var Context = __webpack_require__(58)(Promise);
 /*jshint unused:false*/
var createContext = Context.create;
var debug = __webpack_require__(59)(Promise, Context);
var CapturedTrace = debug.CapturedTrace;
var PassThroughHandlerContext =
    __webpack_require__(60)(Promise, tryConvertToPromise, NEXT_FILTER);
var catchFilter = __webpack_require__(22)(NEXT_FILTER);
var nodebackForPromise = __webpack_require__(23);
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
function check(self, executor) {
    if (self == null || self.constructor !== Promise) {
        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    if (typeof executor !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(executor));
    }

}

function Promise(executor) {
    if (executor !== INTERNAL) {
        check(this, executor);
    }
    this._bitField = 0;
    this._fulfillmentHandler0 = undefined;
    this._rejectionHandler0 = undefined;
    this._promise0 = undefined;
    this._receiver0 = undefined;
    this._resolveFromExecutor(executor);
    this._promiseCreated();
    this._fireEvent("promiseCreated", this);
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
    var len = arguments.length;
    if (len > 1) {
        var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
                catchInstances[j++] = item;
            } else {
                return apiRejection("Catch statement predicate: " +
                    "expecting an object but got " + util.classString(item));
            }
        }
        catchInstances.length = j;
        fn = arguments[i];
        return this.then(undefined, catchFilter(catchInstances, fn, this));
    }
    return this.then(undefined, fn);
};

Promise.prototype.reflect = function () {
    return this._then(reflectHandler,
        reflectHandler, undefined, this, undefined);
};

Promise.prototype.then = function (didFulfill, didReject) {
    if (debug.warnings() && arguments.length > 0 &&
        typeof didFulfill !== "function" &&
        typeof didReject !== "function") {
        var msg = ".then() only accepts functions but was passed: " +
                util.classString(didFulfill);
        if (arguments.length > 1) {
            msg += ", " + util.classString(didReject);
        }
        this._warn(msg);
    }
    return this._then(didFulfill, didReject, undefined, undefined, undefined);
};

Promise.prototype.done = function (didFulfill, didReject) {
    var promise =
        this._then(didFulfill, didReject, undefined, undefined, undefined);
    promise._setIsFinal();
};

Promise.prototype.spread = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
};

Promise.prototype.toJSON = function () {
    var ret = {
        isFulfilled: false,
        isRejected: false,
        fulfillmentValue: undefined,
        rejectionReason: undefined
    };
    if (this.isFulfilled()) {
        ret.fulfillmentValue = this.value();
        ret.isFulfilled = true;
    } else if (this.isRejected()) {
        ret.rejectionReason = this.reason();
        ret.isRejected = true;
    }
    return ret;
};

Promise.prototype.all = function () {
    if (arguments.length > 0) {
        this._warn(".all() was passed arguments but it does not take any");
    }
    return new PromiseArray(this).promise();
};

Promise.prototype.error = function (fn) {
    return this.caught(util.originatesFromRejection, fn);
};

Promise.getNewLibraryCopy = module.exports;

Promise.is = function (val) {
    return val instanceof Promise;
};

Promise.fromNode = Promise.fromCallback = function(fn) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs
                                         : false;
    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
    if (result === errorObj) {
        ret._rejectCallback(result.e, true);
    }
    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
    return ret;
};

Promise.all = function (promises) {
    return new PromiseArray(promises).promise();
};

Promise.cast = function (obj) {
    var ret = tryConvertToPromise(obj);
    if (!(ret instanceof Promise)) {
        ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._setFulfilled();
        ret._rejectionHandler0 = obj;
    }
    return ret;
};

Promise.resolve = Promise.fulfilled = Promise.cast;

Promise.reject = Promise.rejected = function (reason) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._rejectCallback(reason, true);
    return ret;
};

Promise.setScheduler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    return async.setScheduler(fn);
};

Promise.prototype._then = function (
    didFulfill,
    didReject,
    _,    receiver,
    internalData
) {
    var haveInternalData = internalData !== undefined;
    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
    var target = this._target();
    var bitField = target._bitField;

    if (!haveInternalData) {
        promise._propagateFrom(this, 3);
        promise._captureStackTrace();
        if (receiver === undefined &&
            ((this._bitField & 2097152) !== 0)) {
            if (!((bitField & 50397184) === 0)) {
                receiver = this._boundValue();
            } else {
                receiver = target === this ? undefined : this._boundTo;
            }
        }
        this._fireEvent("promiseChained", this, promise);
    }

    var domain = getDomain();
    if (!((bitField & 50397184) === 0)) {
        var handler, value, settler = target._settlePromiseCtx;
        if (((bitField & 33554432) !== 0)) {
            value = target._rejectionHandler0;
            handler = didFulfill;
        } else if (((bitField & 16777216) !== 0)) {
            value = target._fulfillmentHandler0;
            handler = didReject;
            target._unsetRejectionIsUnhandled();
        } else {
            settler = target._settlePromiseLateCancellationObserver;
            value = new CancellationError("late cancellation observer");
            target._attachExtraTrace(value);
            handler = didReject;
        }

        async.invoke(settler, target, {
            handler: domain === null ? handler
                : (typeof handler === "function" &&
                    util.domainBind(domain, handler)),
            promise: promise,
            receiver: receiver,
            value: value
        });
    } else {
        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
    }

    return promise;
};

Promise.prototype._length = function () {
    return this._bitField & 65535;
};

Promise.prototype._isFateSealed = function () {
    return (this._bitField & 117506048) !== 0;
};

Promise.prototype._isFollowing = function () {
    return (this._bitField & 67108864) === 67108864;
};

Promise.prototype._setLength = function (len) {
    this._bitField = (this._bitField & -65536) |
        (len & 65535);
};

Promise.prototype._setFulfilled = function () {
    this._bitField = this._bitField | 33554432;
    this._fireEvent("promiseFulfilled", this);
};

Promise.prototype._setRejected = function () {
    this._bitField = this._bitField | 16777216;
    this._fireEvent("promiseRejected", this);
};

Promise.prototype._setFollowing = function () {
    this._bitField = this._bitField | 67108864;
    this._fireEvent("promiseResolved", this);
};

Promise.prototype._setIsFinal = function () {
    this._bitField = this._bitField | 4194304;
};

Promise.prototype._isFinal = function () {
    return (this._bitField & 4194304) > 0;
};

Promise.prototype._unsetCancelled = function() {
    this._bitField = this._bitField & (~65536);
};

Promise.prototype._setCancelled = function() {
    this._bitField = this._bitField | 65536;
    this._fireEvent("promiseCancelled", this);
};

Promise.prototype._setWillBeCancelled = function() {
    this._bitField = this._bitField | 8388608;
};

Promise.prototype._setAsyncGuaranteed = function() {
    if (async.hasCustomScheduler()) return;
    this._bitField = this._bitField | 134217728;
};

Promise.prototype._receiverAt = function (index) {
    var ret = index === 0 ? this._receiver0 : this[
            index * 4 - 4 + 3];
    if (ret === UNDEFINED_BINDING) {
        return undefined;
    } else if (ret === undefined && this._isBound()) {
        return this._boundValue();
    }
    return ret;
};

Promise.prototype._promiseAt = function (index) {
    return this[
            index * 4 - 4 + 2];
};

Promise.prototype._fulfillmentHandlerAt = function (index) {
    return this[
            index * 4 - 4 + 0];
};

Promise.prototype._rejectionHandlerAt = function (index) {
    return this[
            index * 4 - 4 + 1];
};

Promise.prototype._boundValue = function() {};

Promise.prototype._migrateCallback0 = function (follower) {
    var bitField = follower._bitField;
    var fulfill = follower._fulfillmentHandler0;
    var reject = follower._rejectionHandler0;
    var promise = follower._promise0;
    var receiver = follower._receiverAt(0);
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._migrateCallbackAt = function (follower, index) {
    var fulfill = follower._fulfillmentHandlerAt(index);
    var reject = follower._rejectionHandlerAt(index);
    var promise = follower._promiseAt(index);
    var receiver = follower._receiverAt(index);
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._addCallbacks = function (
    fulfill,
    reject,
    promise,
    receiver,
    domain
) {
    var index = this._length();

    if (index >= 65535 - 4) {
        index = 0;
        this._setLength(0);
    }

    if (index === 0) {
        this._promise0 = promise;
        this._receiver0 = receiver;
        if (typeof fulfill === "function") {
            this._fulfillmentHandler0 =
                domain === null ? fulfill : util.domainBind(domain, fulfill);
        }
        if (typeof reject === "function") {
            this._rejectionHandler0 =
                domain === null ? reject : util.domainBind(domain, reject);
        }
    } else {
        var base = index * 4 - 4;
        this[base + 2] = promise;
        this[base + 3] = receiver;
        if (typeof fulfill === "function") {
            this[base + 0] =
                domain === null ? fulfill : util.domainBind(domain, fulfill);
        }
        if (typeof reject === "function") {
            this[base + 1] =
                domain === null ? reject : util.domainBind(domain, reject);
        }
    }
    this._setLength(index + 1);
    return index;
};

Promise.prototype._proxy = function (proxyable, arg) {
    this._addCallbacks(undefined, undefined, arg, proxyable, null);
};

Promise.prototype._resolveCallback = function(value, shouldBind) {
    if (((this._bitField & 117506048) !== 0)) return;
    if (value === this)
        return this._rejectCallback(makeSelfResolutionError(), false);
    var maybePromise = tryConvertToPromise(value, this);
    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

    if (shouldBind) this._propagateFrom(maybePromise, 2);

    var promise = maybePromise._target();

    if (promise === this) {
        this._reject(makeSelfResolutionError());
        return;
    }

    var bitField = promise._bitField;
    if (((bitField & 50397184) === 0)) {
        var len = this._length();
        if (len > 0) promise._migrateCallback0(this);
        for (var i = 1; i < len; ++i) {
            promise._migrateCallbackAt(this, i);
        }
        this._setFollowing();
        this._setLength(0);
        this._setFollowee(promise);
    } else if (((bitField & 33554432) !== 0)) {
        this._fulfill(promise._value());
    } else if (((bitField & 16777216) !== 0)) {
        this._reject(promise._reason());
    } else {
        var reason = new CancellationError("late cancellation observer");
        promise._attachExtraTrace(reason);
        this._reject(reason);
    }
};

Promise.prototype._rejectCallback =
function(reason, synchronous, ignoreNonErrorWarnings) {
    var trace = util.ensureErrorObject(reason);
    var hasStack = trace === reason;
    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
        var message = "a promise was rejected with a non-error: " +
            util.classString(reason);
        this._warn(message, true);
    }
    this._attachExtraTrace(trace, synchronous ? hasStack : false);
    this._reject(reason);
};

Promise.prototype._resolveFromExecutor = function (executor) {
    if (executor === INTERNAL) return;
    var promise = this;
    this._captureStackTrace();
    this._pushContext();
    var synchronous = true;
    var r = this._execute(executor, function(value) {
        promise._resolveCallback(value);
    }, function (reason) {
        promise._rejectCallback(reason, synchronous);
    });
    synchronous = false;
    this._popContext();

    if (r !== undefined) {
        promise._rejectCallback(r, true);
    }
};

Promise.prototype._settlePromiseFromHandler = function (
    handler, receiver, value, promise
) {
    var bitField = promise._bitField;
    if (((bitField & 65536) !== 0)) return;
    promise._pushContext();
    var x;
    if (receiver === APPLY) {
        if (!value || typeof value.length !== "number") {
            x = errorObj;
            x.e = new TypeError("cannot .spread() a non-array: " +
                                    util.classString(value));
        } else {
            x = tryCatch(handler).apply(this._boundValue(), value);
        }
    } else {
        x = tryCatch(handler).call(receiver, value);
    }
    var promiseCreated = promise._popContext();
    bitField = promise._bitField;
    if (((bitField & 65536) !== 0)) return;

    if (x === NEXT_FILTER) {
        promise._reject(value);
    } else if (x === errorObj) {
        promise._rejectCallback(x.e, false);
    } else {
        debug.checkForgottenReturns(x, promiseCreated, "",  promise, this);
        promise._resolveCallback(x);
    }
};

Promise.prototype._target = function() {
    var ret = this;
    while (ret._isFollowing()) ret = ret._followee();
    return ret;
};

Promise.prototype._followee = function() {
    return this._rejectionHandler0;
};

Promise.prototype._setFollowee = function(promise) {
    this._rejectionHandler0 = promise;
};

Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
    var isPromise = promise instanceof Promise;
    var bitField = this._bitField;
    var asyncGuaranteed = ((bitField & 134217728) !== 0);
    if (((bitField & 65536) !== 0)) {
        if (isPromise) promise._invokeInternalOnCancel();

        if (receiver instanceof PassThroughHandlerContext &&
            receiver.isFinallyHandler()) {
            receiver.cancelPromise = promise;
            if (tryCatch(handler).call(receiver, value) === errorObj) {
                promise._reject(errorObj.e);
            }
        } else if (handler === reflectHandler) {
            promise._fulfill(reflectHandler.call(receiver));
        } else if (receiver instanceof Proxyable) {
            receiver._promiseCancelled(promise);
        } else if (isPromise || promise instanceof PromiseArray) {
            promise._cancel();
        } else {
            receiver.cancel();
        }
    } else if (typeof handler === "function") {
        if (!isPromise) {
            handler.call(receiver, value, promise);
        } else {
            if (asyncGuaranteed) promise._setAsyncGuaranteed();
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (receiver instanceof Proxyable) {
        if (!receiver._isResolved()) {
            if (((bitField & 33554432) !== 0)) {
                receiver._promiseFulfilled(value, promise);
            } else {
                receiver._promiseRejected(value, promise);
            }
        }
    } else if (isPromise) {
        if (asyncGuaranteed) promise._setAsyncGuaranteed();
        if (((bitField & 33554432) !== 0)) {
            promise._fulfill(value);
        } else {
            promise._reject(value);
        }
    }
};

Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
    var handler = ctx.handler;
    var promise = ctx.promise;
    var receiver = ctx.receiver;
    var value = ctx.value;
    if (typeof handler === "function") {
        if (!(promise instanceof Promise)) {
            handler.call(receiver, value, promise);
        } else {
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (promise instanceof Promise) {
        promise._reject(value);
    }
};

Promise.prototype._settlePromiseCtx = function(ctx) {
    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
};

Promise.prototype._settlePromise0 = function(handler, value, bitField) {
    var promise = this._promise0;
    var receiver = this._receiverAt(0);
    this._promise0 = undefined;
    this._receiver0 = undefined;
    this._settlePromise(promise, handler, receiver, value);
};

Promise.prototype._clearCallbackDataAtIndex = function(index) {
    var base = index * 4 - 4;
    this[base + 2] =
    this[base + 3] =
    this[base + 0] =
    this[base + 1] = undefined;
};

Promise.prototype._fulfill = function (value) {
    var bitField = this._bitField;
    if (((bitField & 117506048) >>> 16)) return;
    if (value === this) {
        var err = makeSelfResolutionError();
        this._attachExtraTrace(err);
        return this._reject(err);
    }
    this._setFulfilled();
    this._rejectionHandler0 = value;

    if ((bitField & 65535) > 0) {
        if (((bitField & 134217728) !== 0)) {
            this._settlePromises();
        } else {
            async.settlePromises(this);
        }
    }
};

Promise.prototype._reject = function (reason) {
    var bitField = this._bitField;
    if (((bitField & 117506048) >>> 16)) return;
    this._setRejected();
    this._fulfillmentHandler0 = reason;

    if (this._isFinal()) {
        return async.fatalError(reason, util.isNode);
    }

    if ((bitField & 65535) > 0) {
        async.settlePromises(this);
    } else {
        this._ensurePossibleRejectionHandled();
    }
};

Promise.prototype._fulfillPromises = function (len, value) {
    for (var i = 1; i < len; i++) {
        var handler = this._fulfillmentHandlerAt(i);
        var promise = this._promiseAt(i);
        var receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i);
        this._settlePromise(promise, handler, receiver, value);
    }
};

Promise.prototype._rejectPromises = function (len, reason) {
    for (var i = 1; i < len; i++) {
        var handler = this._rejectionHandlerAt(i);
        var promise = this._promiseAt(i);
        var receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i);
        this._settlePromise(promise, handler, receiver, reason);
    }
};

Promise.prototype._settlePromises = function () {
    var bitField = this._bitField;
    var len = (bitField & 65535);

    if (len > 0) {
        if (((bitField & 16842752) !== 0)) {
            var reason = this._fulfillmentHandler0;
            this._settlePromise0(this._rejectionHandler0, reason, bitField);
            this._rejectPromises(len, reason);
        } else {
            var value = this._rejectionHandler0;
            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
            this._fulfillPromises(len, value);
        }
        this._setLength(0);
    }
    this._clearCancellationData();
};

Promise.prototype._settledValue = function() {
    var bitField = this._bitField;
    if (((bitField & 33554432) !== 0)) {
        return this._rejectionHandler0;
    } else if (((bitField & 16777216) !== 0)) {
        return this._fulfillmentHandler0;
    }
};

function deferResolve(v) {this.promise._resolveCallback(v);}
function deferReject(v) {this.promise._rejectCallback(v, false);}

Promise.defer = Promise.pending = function() {
    debug.deprecated("Promise.defer", "new Promise");
    var promise = new Promise(INTERNAL);
    return {
        promise: promise,
        resolve: deferResolve,
        reject: deferReject
    };
};

util.notEnumerableProp(Promise,
                       "_makeSelfResolutionError",
                       makeSelfResolutionError);

__webpack_require__(61)(Promise, INTERNAL, tryConvertToPromise, apiRejection,
    debug);
__webpack_require__(62)(Promise, INTERNAL, tryConvertToPromise, debug);
__webpack_require__(63)(Promise, PromiseArray, apiRejection, debug);
__webpack_require__(64)(Promise);
__webpack_require__(65)(Promise);
__webpack_require__(66)(
    Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain);
Promise.Promise = Promise;
Promise.version = "3.5.0";
__webpack_require__(67)(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
__webpack_require__(68)(Promise);
__webpack_require__(69)(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
__webpack_require__(70)(Promise, INTERNAL, debug);
__webpack_require__(71)(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
__webpack_require__(72)(Promise);
__webpack_require__(73)(Promise, INTERNAL);
__webpack_require__(74)(Promise, PromiseArray, tryConvertToPromise, apiRejection);
__webpack_require__(75)(Promise, INTERNAL, tryConvertToPromise, apiRejection);
__webpack_require__(76)(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
__webpack_require__(77)(Promise, PromiseArray, debug);
__webpack_require__(78)(Promise, PromiseArray, apiRejection);
__webpack_require__(79)(Promise, INTERNAL);
__webpack_require__(80)(Promise, INTERNAL);
__webpack_require__(81)(Promise);
                                                         
    util.toFastProperties(Promise);                                          
    util.toFastProperties(Promise.prototype);                                
    function fillTypes(value) {                                              
        var p = new Promise(INTERNAL);                                       
        p._fulfillmentHandler0 = value;                                      
        p._rejectionHandler0 = value;                                        
        p._promise0 = value;                                                 
        p._receiver0 = value;                                                
    }                                                                        
    // Complete slack tracking, opt out of field-type tracking and           
    // stabilize map                                                         
    fillTypes({a: 1});                                                       
    fillTypes({b: 2});                                                       
    fillTypes({c: 3});                                                       
    fillTypes(1);                                                            
    fillTypes(function(){});                                                 
    fillTypes(undefined);                                                    
    fillTypes(false);                                                        
    fillTypes(new Promise(INTERNAL));                                        
    debug.setBounds(Async.firstLineError, util.lastLineError);               
    return Promise;                                                          

};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var firstLineError;
try {throw new Error(); } catch (e) {firstLineError = e;}
var schedule = __webpack_require__(54);
var Queue = __webpack_require__(55);
var util = __webpack_require__(0);

function Async() {
    this._customScheduler = false;
    this._isTickUsed = false;
    this._lateQueue = new Queue(16);
    this._normalQueue = new Queue(16);
    this._haveDrainedQueues = false;
    this._trampolineEnabled = true;
    var self = this;
    this.drainQueues = function () {
        self._drainQueues();
    };
    this._schedule = schedule;
}

Async.prototype.setScheduler = function(fn) {
    var prev = this._schedule;
    this._schedule = fn;
    this._customScheduler = true;
    return prev;
};

Async.prototype.hasCustomScheduler = function() {
    return this._customScheduler;
};

Async.prototype.enableTrampoline = function() {
    this._trampolineEnabled = true;
};

Async.prototype.disableTrampolineIfNecessary = function() {
    if (util.hasDevTools) {
        this._trampolineEnabled = false;
    }
};

Async.prototype.haveItemsQueued = function () {
    return this._isTickUsed || this._haveDrainedQueues;
};


Async.prototype.fatalError = function(e, isNode) {
    if (isNode) {
        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) +
            "\n");
        process.exit(2);
    } else {
        this.throwLater(e);
    }
};

Async.prototype.throwLater = function(fn, arg) {
    if (arguments.length === 1) {
        arg = fn;
        fn = function () { throw arg; };
    }
    if (typeof setTimeout !== "undefined") {
        setTimeout(function() {
            fn(arg);
        }, 0);
    } else try {
        this._schedule(function() {
            fn(arg);
        });
    } catch (e) {
        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
};

function AsyncInvokeLater(fn, receiver, arg) {
    this._lateQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncInvoke(fn, receiver, arg) {
    this._normalQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncSettlePromises(promise) {
    this._normalQueue._pushOne(promise);
    this._queueTick();
}

if (!util.hasDevTools) {
    Async.prototype.invokeLater = AsyncInvokeLater;
    Async.prototype.invoke = AsyncInvoke;
    Async.prototype.settlePromises = AsyncSettlePromises;
} else {
    Async.prototype.invokeLater = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvokeLater.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                setTimeout(function() {
                    fn.call(receiver, arg);
                }, 100);
            });
        }
    };

    Async.prototype.invoke = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvoke.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                fn.call(receiver, arg);
            });
        }
    };

    Async.prototype.settlePromises = function(promise) {
        if (this._trampolineEnabled) {
            AsyncSettlePromises.call(this, promise);
        } else {
            this._schedule(function() {
                promise._settlePromises();
            });
        }
    };
}

Async.prototype._drainQueue = function(queue) {
    while (queue.length() > 0) {
        var fn = queue.shift();
        if (typeof fn !== "function") {
            fn._settlePromises();
            continue;
        }
        var receiver = queue.shift();
        var arg = queue.shift();
        fn.call(receiver, arg);
    }
};

Async.prototype._drainQueues = function () {
    this._drainQueue(this._normalQueue);
    this._reset();
    this._haveDrainedQueues = true;
    this._drainQueue(this._lateQueue);
};

Async.prototype._queueTick = function () {
    if (!this._isTickUsed) {
        this._isTickUsed = true;
        this._schedule(this.drainQueues);
    }
};

Async.prototype._reset = function () {
    this._isTickUsed = false;
};

module.exports = Async;
module.exports.firstLineError = firstLineError;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var util = __webpack_require__(0);
var schedule;
var noAsyncScheduler = function() {
    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var NativePromise = util.getNativePromise();
if (util.isNode && typeof MutationObserver === "undefined") {
    var GlobalSetImmediate = global.setImmediate;
    var ProcessNextTick = process.nextTick;
    schedule = util.isRecentNode
                ? function(fn) { GlobalSetImmediate.call(global, fn); }
                : function(fn) { ProcessNextTick.call(process, fn); };
} else if (typeof NativePromise === "function" &&
           typeof NativePromise.resolve === "function") {
    var nativePromise = NativePromise.resolve();
    schedule = function(fn) {
        nativePromise.then(fn);
    };
} else if ((typeof MutationObserver !== "undefined") &&
          !(typeof window !== "undefined" &&
            window.navigator &&
            (window.navigator.standalone || window.cordova))) {
    schedule = (function() {
        var div = document.createElement("div");
        var opts = {attributes: true};
        var toggleScheduled = false;
        var div2 = document.createElement("div");
        var o2 = new MutationObserver(function() {
            div.classList.toggle("foo");
            toggleScheduled = false;
        });
        o2.observe(div2, opts);

        var scheduleToggle = function() {
            if (toggleScheduled) return;
            toggleScheduled = true;
            div2.classList.toggle("foo");
        };

        return function schedule(fn) {
            var o = new MutationObserver(function() {
                o.disconnect();
                fn();
            });
            o.observe(div, opts);
            scheduleToggle();
        };
    })();
} else if (typeof setImmediate !== "undefined") {
    schedule = function (fn) {
        setImmediate(fn);
    };
} else if (typeof setTimeout !== "undefined") {
    schedule = function (fn) {
        setTimeout(fn, 0);
    };
} else {
    schedule = noAsyncScheduler;
}
module.exports = schedule;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function arrayMove(src, srcIndex, dst, dstIndex, len) {
    for (var j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
        src[j + srcIndex] = void 0;
    }
}

function Queue(capacity) {
    this._capacity = capacity;
    this._length = 0;
    this._front = 0;
}

Queue.prototype._willBeOverCapacity = function (size) {
    return this._capacity < size;
};

Queue.prototype._pushOne = function (arg) {
    var length = this.length();
    this._checkCapacity(length + 1);
    var i = (this._front + length) & (this._capacity - 1);
    this[i] = arg;
    this._length = length + 1;
};

Queue.prototype.push = function (fn, receiver, arg) {
    var length = this.length() + 3;
    if (this._willBeOverCapacity(length)) {
        this._pushOne(fn);
        this._pushOne(receiver);
        this._pushOne(arg);
        return;
    }
    var j = this._front + length - 3;
    this._checkCapacity(length);
    var wrapMask = this._capacity - 1;
    this[(j + 0) & wrapMask] = fn;
    this[(j + 1) & wrapMask] = receiver;
    this[(j + 2) & wrapMask] = arg;
    this._length = length;
};

Queue.prototype.shift = function () {
    var front = this._front,
        ret = this[front];

    this[front] = undefined;
    this._front = (front + 1) & (this._capacity - 1);
    this._length--;
    return ret;
};

Queue.prototype.length = function () {
    return this._length;
};

Queue.prototype._checkCapacity = function (size) {
    if (this._capacity < size) {
        this._resizeTo(this._capacity << 1);
    }
};

Queue.prototype._resizeTo = function (capacity) {
    var oldCapacity = this._capacity;
    this._capacity = capacity;
    var front = this._front;
    var length = this._length;
    var moveItemsCount = (front + length) & (oldCapacity - 1);
    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
};

module.exports = Queue;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL) {
var util = __webpack_require__(0);
var errorObj = util.errorObj;
var isObject = util.isObject;

function tryConvertToPromise(obj, context) {
    if (isObject(obj)) {
        if (obj instanceof Promise) return obj;
        var then = getThen(obj);
        if (then === errorObj) {
            if (context) context._pushContext();
            var ret = Promise.reject(then.e);
            if (context) context._popContext();
            return ret;
        } else if (typeof then === "function") {
            if (isAnyBluebirdPromise(obj)) {
                var ret = new Promise(INTERNAL);
                obj._then(
                    ret._fulfill,
                    ret._reject,
                    undefined,
                    ret,
                    null
                );
                return ret;
            }
            return doThenable(obj, then, context);
        }
    }
    return obj;
}

function doGetThen(obj) {
    return obj.then;
}

function getThen(obj) {
    try {
        return doGetThen(obj);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}

var hasProp = {}.hasOwnProperty;
function isAnyBluebirdPromise(obj) {
    try {
        return hasProp.call(obj, "_promise0");
    } catch (e) {
        return false;
    }
}

function doThenable(x, then, context) {
    var promise = new Promise(INTERNAL);
    var ret = promise;
    if (context) context._pushContext();
    promise._captureStackTrace();
    if (context) context._popContext();
    var synchronous = true;
    var result = util.tryCatch(then).call(x, resolve, reject);
    synchronous = false;

    if (promise && result === errorObj) {
        promise._rejectCallback(result.e, true, true);
        promise = null;
    }

    function resolve(value) {
        if (!promise) return;
        promise._resolveCallback(value);
        promise = null;
    }

    function reject(reason) {
        if (!promise) return;
        promise._rejectCallback(reason, synchronous, true);
        promise = null;
    }
    return ret;
}

return tryConvertToPromise;
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL, tryConvertToPromise,
    apiRejection, Proxyable) {
var util = __webpack_require__(0);
var isArray = util.isArray;

function toResolutionValue(val) {
    switch(val) {
    case -2: return [];
    case -3: return {};
    case -6: return new Map();
    }
}

function PromiseArray(values) {
    var promise = this._promise = new Promise(INTERNAL);
    if (values instanceof Promise) {
        promise._propagateFrom(values, 3);
    }
    promise._setOnCancel(this);
    this._values = values;
    this._length = 0;
    this._totalResolved = 0;
    this._init(undefined, -2);
}
util.inherits(PromiseArray, Proxyable);

PromiseArray.prototype.length = function () {
    return this._length;
};

PromiseArray.prototype.promise = function () {
    return this._promise;
};

PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
    var values = tryConvertToPromise(this._values, this._promise);
    if (values instanceof Promise) {
        values = values._target();
        var bitField = values._bitField;
        ;
        this._values = values;

        if (((bitField & 50397184) === 0)) {
            this._promise._setAsyncGuaranteed();
            return values._then(
                init,
                this._reject,
                undefined,
                this,
                resolveValueIfEmpty
           );
        } else if (((bitField & 33554432) !== 0)) {
            values = values._value();
        } else if (((bitField & 16777216) !== 0)) {
            return this._reject(values._reason());
        } else {
            return this._cancel();
        }
    }
    values = util.asArray(values);
    if (values === null) {
        var err = apiRejection(
            "expecting an array or an iterable object but got " + util.classString(values)).reason();
        this._promise._rejectCallback(err, false);
        return;
    }

    if (values.length === 0) {
        if (resolveValueIfEmpty === -5) {
            this._resolveEmptyArray();
        }
        else {
            this._resolve(toResolutionValue(resolveValueIfEmpty));
        }
        return;
    }
    this._iterate(values);
};

PromiseArray.prototype._iterate = function(values) {
    var len = this.getActualLength(values.length);
    this._length = len;
    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
    var result = this._promise;
    var isResolved = false;
    var bitField = null;
    for (var i = 0; i < len; ++i) {
        var maybePromise = tryConvertToPromise(values[i], result);

        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            bitField = maybePromise._bitField;
        } else {
            bitField = null;
        }

        if (isResolved) {
            if (bitField !== null) {
                maybePromise.suppressUnhandledRejections();
            }
        } else if (bitField !== null) {
            if (((bitField & 50397184) === 0)) {
                maybePromise._proxy(this, i);
                this._values[i] = maybePromise;
            } else if (((bitField & 33554432) !== 0)) {
                isResolved = this._promiseFulfilled(maybePromise._value(), i);
            } else if (((bitField & 16777216) !== 0)) {
                isResolved = this._promiseRejected(maybePromise._reason(), i);
            } else {
                isResolved = this._promiseCancelled(i);
            }
        } else {
            isResolved = this._promiseFulfilled(maybePromise, i);
        }
    }
    if (!isResolved) result._setAsyncGuaranteed();
};

PromiseArray.prototype._isResolved = function () {
    return this._values === null;
};

PromiseArray.prototype._resolve = function (value) {
    this._values = null;
    this._promise._fulfill(value);
};

PromiseArray.prototype._cancel = function() {
    if (this._isResolved() || !this._promise._isCancellable()) return;
    this._values = null;
    this._promise._cancel();
};

PromiseArray.prototype._reject = function (reason) {
    this._values = null;
    this._promise._rejectCallback(reason, false);
};

PromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
    }
    return false;
};

PromiseArray.prototype._promiseCancelled = function() {
    this._cancel();
    return true;
};

PromiseArray.prototype._promiseRejected = function (reason) {
    this._totalResolved++;
    this._reject(reason);
    return true;
};

PromiseArray.prototype._resultCancelled = function() {
    if (this._isResolved()) return;
    var values = this._values;
    this._cancel();
    if (values instanceof Promise) {
        values.cancel();
    } else {
        for (var i = 0; i < values.length; ++i) {
            if (values[i] instanceof Promise) {
                values[i].cancel();
            }
        }
    }
};

PromiseArray.prototype.shouldCopyValues = function () {
    return true;
};

PromiseArray.prototype.getActualLength = function (len) {
    return len;
};

return PromiseArray;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
var longStackTraces = false;
var contextStack = [];

Promise.prototype._promiseCreated = function() {};
Promise.prototype._pushContext = function() {};
Promise.prototype._popContext = function() {return null;};
Promise._peekContext = Promise.prototype._peekContext = function() {};

function Context() {
    this._trace = new Context.CapturedTrace(peekContext());
}
Context.prototype._pushContext = function () {
    if (this._trace !== undefined) {
        this._trace._promiseCreated = null;
        contextStack.push(this._trace);
    }
};

Context.prototype._popContext = function () {
    if (this._trace !== undefined) {
        var trace = contextStack.pop();
        var ret = trace._promiseCreated;
        trace._promiseCreated = null;
        return ret;
    }
    return null;
};

function createContext() {
    if (longStackTraces) return new Context();
}

function peekContext() {
    var lastIndex = contextStack.length - 1;
    if (lastIndex >= 0) {
        return contextStack[lastIndex];
    }
    return undefined;
}
Context.CapturedTrace = null;
Context.create = createContext;
Context.deactivateLongStackTraces = function() {};
Context.activateLongStackTraces = function() {
    var Promise_pushContext = Promise.prototype._pushContext;
    var Promise_popContext = Promise.prototype._popContext;
    var Promise_PeekContext = Promise._peekContext;
    var Promise_peekContext = Promise.prototype._peekContext;
    var Promise_promiseCreated = Promise.prototype._promiseCreated;
    Context.deactivateLongStackTraces = function() {
        Promise.prototype._pushContext = Promise_pushContext;
        Promise.prototype._popContext = Promise_popContext;
        Promise._peekContext = Promise_PeekContext;
        Promise.prototype._peekContext = Promise_peekContext;
        Promise.prototype._promiseCreated = Promise_promiseCreated;
        longStackTraces = false;
    };
    longStackTraces = true;
    Promise.prototype._pushContext = Context.prototype._pushContext;
    Promise.prototype._popContext = Context.prototype._popContext;
    Promise._peekContext = Promise.prototype._peekContext = peekContext;
    Promise.prototype._promiseCreated = function() {
        var ctx = this._peekContext();
        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
    };
};
return Context;
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, Context) {
var getDomain = Promise._getDomain;
var async = Promise._async;
var Warning = __webpack_require__(2).Warning;
var util = __webpack_require__(0);
var canAttachTrace = util.canAttachTrace;
var unhandledRejectionHandled;
var possiblyUnhandledRejection;
var bluebirdFramePattern =
    /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
var stackFramePattern = null;
var formatStack = null;
var indentStackFrames = false;
var printWarning;
var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 &&
                        (false ||
                         util.env("BLUEBIRD_DEBUG") ||
                         util.env("NODE_ENV") === "development"));

var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 &&
    (debugging || util.env("BLUEBIRD_WARNINGS")));

var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 &&
    (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 &&
    (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

Promise.prototype.suppressUnhandledRejections = function() {
    var target = this._target();
    target._bitField = ((target._bitField & (~1048576)) |
                      524288);
};

Promise.prototype._ensurePossibleRejectionHandled = function () {
    if ((this._bitField & 524288) !== 0) return;
    this._setRejectionIsUnhandled();
    async.invokeLater(this._notifyUnhandledRejection, this, undefined);
};

Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
    fireRejectionEvent("rejectionHandled",
                                  unhandledRejectionHandled, undefined, this);
};

Promise.prototype._setReturnedNonUndefined = function() {
    this._bitField = this._bitField | 268435456;
};

Promise.prototype._returnedNonUndefined = function() {
    return (this._bitField & 268435456) !== 0;
};

Promise.prototype._notifyUnhandledRejection = function () {
    if (this._isRejectionUnhandled()) {
        var reason = this._settledValue();
        this._setUnhandledRejectionIsNotified();
        fireRejectionEvent("unhandledRejection",
                                      possiblyUnhandledRejection, reason, this);
    }
};

Promise.prototype._setUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField | 262144;
};

Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField & (~262144);
};

Promise.prototype._isUnhandledRejectionNotified = function () {
    return (this._bitField & 262144) > 0;
};

Promise.prototype._setRejectionIsUnhandled = function () {
    this._bitField = this._bitField | 1048576;
};

Promise.prototype._unsetRejectionIsUnhandled = function () {
    this._bitField = this._bitField & (~1048576);
    if (this._isUnhandledRejectionNotified()) {
        this._unsetUnhandledRejectionIsNotified();
        this._notifyUnhandledRejectionIsHandled();
    }
};

Promise.prototype._isRejectionUnhandled = function () {
    return (this._bitField & 1048576) > 0;
};

Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
    return warn(message, shouldUseOwnTrace, promise || this);
};

Promise.onPossiblyUnhandledRejection = function (fn) {
    var domain = getDomain();
    possiblyUnhandledRejection =
        typeof fn === "function" ? (domain === null ?
                                            fn : util.domainBind(domain, fn))
                                 : undefined;
};

Promise.onUnhandledRejectionHandled = function (fn) {
    var domain = getDomain();
    unhandledRejectionHandled =
        typeof fn === "function" ? (domain === null ?
                                            fn : util.domainBind(domain, fn))
                                 : undefined;
};

var disableLongStackTraces = function() {};
Promise.longStackTraces = function () {
    if (async.haveItemsQueued() && !config.longStackTraces) {
        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    if (!config.longStackTraces && longStackTracesIsSupported()) {
        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
        config.longStackTraces = true;
        disableLongStackTraces = function() {
            if (async.haveItemsQueued() && !config.longStackTraces) {
                throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
            }
            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
            Context.deactivateLongStackTraces();
            async.enableTrampoline();
            config.longStackTraces = false;
        };
        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
        Context.activateLongStackTraces();
        async.disableTrampolineIfNecessary();
    }
};

Promise.hasLongStackTraces = function () {
    return config.longStackTraces && longStackTracesIsSupported();
};

var fireDomEvent = (function() {
    try {
        if (typeof CustomEvent === "function") {
            var event = new CustomEvent("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = new CustomEvent(name.toLowerCase(), {
                    detail: event,
                    cancelable: true
                });
                return !util.global.dispatchEvent(domEvent);
            };
        } else if (typeof Event === "function") {
            var event = new Event("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = new Event(name.toLowerCase(), {
                    cancelable: true
                });
                domEvent.detail = event;
                return !util.global.dispatchEvent(domEvent);
            };
        } else {
            var event = document.createEvent("CustomEvent");
            event.initCustomEvent("testingtheevent", false, true, {});
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = document.createEvent("CustomEvent");
                domEvent.initCustomEvent(name.toLowerCase(), false, true,
                    event);
                return !util.global.dispatchEvent(domEvent);
            };
        }
    } catch (e) {}
    return function() {
        return false;
    };
})();

var fireGlobalEvent = (function() {
    if (util.isNode) {
        return function() {
            return process.emit.apply(process, arguments);
        };
    } else {
        if (!util.global) {
            return function() {
                return false;
            };
        }
        return function(name) {
            var methodName = "on" + name.toLowerCase();
            var method = util.global[methodName];
            if (!method) return false;
            method.apply(util.global, [].slice.call(arguments, 1));
            return true;
        };
    }
})();

function generatePromiseLifecycleEventObject(name, promise) {
    return {promise: promise};
}

var eventToObjectGenerator = {
    promiseCreated: generatePromiseLifecycleEventObject,
    promiseFulfilled: generatePromiseLifecycleEventObject,
    promiseRejected: generatePromiseLifecycleEventObject,
    promiseResolved: generatePromiseLifecycleEventObject,
    promiseCancelled: generatePromiseLifecycleEventObject,
    promiseChained: function(name, promise, child) {
        return {promise: promise, child: child};
    },
    warning: function(name, warning) {
        return {warning: warning};
    },
    unhandledRejection: function (name, reason, promise) {
        return {reason: reason, promise: promise};
    },
    rejectionHandled: generatePromiseLifecycleEventObject
};

var activeFireEvent = function (name) {
    var globalEventFired = false;
    try {
        globalEventFired = fireGlobalEvent.apply(null, arguments);
    } catch (e) {
        async.throwLater(e);
        globalEventFired = true;
    }

    var domEventFired = false;
    try {
        domEventFired = fireDomEvent(name,
                    eventToObjectGenerator[name].apply(null, arguments));
    } catch (e) {
        async.throwLater(e);
        domEventFired = true;
    }

    return domEventFired || globalEventFired;
};

Promise.config = function(opts) {
    opts = Object(opts);
    if ("longStackTraces" in opts) {
        if (opts.longStackTraces) {
            Promise.longStackTraces();
        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
            disableLongStackTraces();
        }
    }
    if ("warnings" in opts) {
        var warningsOption = opts.warnings;
        config.warnings = !!warningsOption;
        wForgottenReturn = config.warnings;

        if (util.isObject(warningsOption)) {
            if ("wForgottenReturn" in warningsOption) {
                wForgottenReturn = !!warningsOption.wForgottenReturn;
            }
        }
    }
    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
        if (async.haveItemsQueued()) {
            throw new Error(
                "cannot enable cancellation after promises are in use");
        }
        Promise.prototype._clearCancellationData =
            cancellationClearCancellationData;
        Promise.prototype._propagateFrom = cancellationPropagateFrom;
        Promise.prototype._onCancel = cancellationOnCancel;
        Promise.prototype._setOnCancel = cancellationSetOnCancel;
        Promise.prototype._attachCancellationCallback =
            cancellationAttachCancellationCallback;
        Promise.prototype._execute = cancellationExecute;
        propagateFromFunction = cancellationPropagateFrom;
        config.cancellation = true;
    }
    if ("monitoring" in opts) {
        if (opts.monitoring && !config.monitoring) {
            config.monitoring = true;
            Promise.prototype._fireEvent = activeFireEvent;
        } else if (!opts.monitoring && config.monitoring) {
            config.monitoring = false;
            Promise.prototype._fireEvent = defaultFireEvent;
        }
    }
    return Promise;
};

function defaultFireEvent() { return false; }

Promise.prototype._fireEvent = defaultFireEvent;
Promise.prototype._execute = function(executor, resolve, reject) {
    try {
        executor(resolve, reject);
    } catch (e) {
        return e;
    }
};
Promise.prototype._onCancel = function () {};
Promise.prototype._setOnCancel = function (handler) { ; };
Promise.prototype._attachCancellationCallback = function(onCancel) {
    ;
};
Promise.prototype._captureStackTrace = function () {};
Promise.prototype._attachExtraTrace = function () {};
Promise.prototype._clearCancellationData = function() {};
Promise.prototype._propagateFrom = function (parent, flags) {
    ;
    ;
};

function cancellationExecute(executor, resolve, reject) {
    var promise = this;
    try {
        executor(resolve, reject, function(onCancel) {
            if (typeof onCancel !== "function") {
                throw new TypeError("onCancel must be a function, got: " +
                                    util.toString(onCancel));
            }
            promise._attachCancellationCallback(onCancel);
        });
    } catch (e) {
        return e;
    }
}

function cancellationAttachCancellationCallback(onCancel) {
    if (!this._isCancellable()) return this;

    var previousOnCancel = this._onCancel();
    if (previousOnCancel !== undefined) {
        if (util.isArray(previousOnCancel)) {
            previousOnCancel.push(onCancel);
        } else {
            this._setOnCancel([previousOnCancel, onCancel]);
        }
    } else {
        this._setOnCancel(onCancel);
    }
}

function cancellationOnCancel() {
    return this._onCancelField;
}

function cancellationSetOnCancel(onCancel) {
    this._onCancelField = onCancel;
}

function cancellationClearCancellationData() {
    this._cancellationParent = undefined;
    this._onCancelField = undefined;
}

function cancellationPropagateFrom(parent, flags) {
    if ((flags & 1) !== 0) {
        this._cancellationParent = parent;
        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
        if (branchesRemainingToCancel === undefined) {
            branchesRemainingToCancel = 0;
        }
        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
    }
    if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
    }
}

function bindingPropagateFrom(parent, flags) {
    if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
    }
}
var propagateFromFunction = bindingPropagateFrom;

function boundValueFunction() {
    var ret = this._boundTo;
    if (ret !== undefined) {
        if (ret instanceof Promise) {
            if (ret.isFulfilled()) {
                return ret.value();
            } else {
                return undefined;
            }
        }
    }
    return ret;
}

function longStackTracesCaptureStackTrace() {
    this._trace = new CapturedTrace(this._peekContext());
}

function longStackTracesAttachExtraTrace(error, ignoreSelf) {
    if (canAttachTrace(error)) {
        var trace = this._trace;
        if (trace !== undefined) {
            if (ignoreSelf) trace = trace._parent;
        }
        if (trace !== undefined) {
            trace.attachExtraTrace(error);
        } else if (!error.__stackCleaned__) {
            var parsed = parseStackAndMessage(error);
            util.notEnumerableProp(error, "stack",
                parsed.message + "\n" + parsed.stack.join("\n"));
            util.notEnumerableProp(error, "__stackCleaned__", true);
        }
    }
}

function checkForgottenReturns(returnValue, promiseCreated, name, promise,
                               parent) {
    if (returnValue === undefined && promiseCreated !== null &&
        wForgottenReturn) {
        if (parent !== undefined && parent._returnedNonUndefined()) return;
        if ((promise._bitField & 65535) === 0) return;

        if (name) name = name + " ";
        var handlerLine = "";
        var creatorLine = "";
        if (promiseCreated._trace) {
            var traceLines = promiseCreated._trace.stack.split("\n");
            var stack = cleanStack(traceLines);
            for (var i = stack.length - 1; i >= 0; --i) {
                var line = stack[i];
                if (!nodeFramePattern.test(line)) {
                    var lineMatches = line.match(parseLinePattern);
                    if (lineMatches) {
                        handlerLine  = "at " + lineMatches[1] +
                            ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
                    }
                    break;
                }
            }

            if (stack.length > 0) {
                var firstUserLine = stack[0];
                for (var i = 0; i < traceLines.length; ++i) {

                    if (traceLines[i] === firstUserLine) {
                        if (i > 0) {
                            creatorLine = "\n" + traceLines[i - 1];
                        }
                        break;
                    }
                }

            }
        }
        var msg = "a promise was created in a " + name +
            "handler " + handlerLine + "but was not returned from it, " +
            "see http://goo.gl/rRqMUw" +
            creatorLine;
        promise._warn(msg, true, promiseCreated);
    }
}

function deprecated(name, replacement) {
    var message = name +
        " is deprecated and will be removed in a future version.";
    if (replacement) message += " Use " + replacement + " instead.";
    return warn(message);
}

function warn(message, shouldUseOwnTrace, promise) {
    if (!config.warnings) return;
    var warning = new Warning(message);
    var ctx;
    if (shouldUseOwnTrace) {
        promise._attachExtraTrace(warning);
    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
        ctx.attachExtraTrace(warning);
    } else {
        var parsed = parseStackAndMessage(warning);
        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
    }

    if (!activeFireEvent("warning", warning)) {
        formatAndLogError(warning, "", true);
    }
}

function reconstructStack(message, stacks) {
    for (var i = 0; i < stacks.length - 1; ++i) {
        stacks[i].push("From previous event:");
        stacks[i] = stacks[i].join("\n");
    }
    if (i < stacks.length) {
        stacks[i] = stacks[i].join("\n");
    }
    return message + "\n" + stacks.join("\n");
}

function removeDuplicateOrEmptyJumps(stacks) {
    for (var i = 0; i < stacks.length; ++i) {
        if (stacks[i].length === 0 ||
            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {
            stacks.splice(i, 1);
            i--;
        }
    }
}

function removeCommonRoots(stacks) {
    var current = stacks[0];
    for (var i = 1; i < stacks.length; ++i) {
        var prev = stacks[i];
        var currentLastIndex = current.length - 1;
        var currentLastLine = current[currentLastIndex];
        var commonRootMeetPoint = -1;

        for (var j = prev.length - 1; j >= 0; --j) {
            if (prev[j] === currentLastLine) {
                commonRootMeetPoint = j;
                break;
            }
        }

        for (var j = commonRootMeetPoint; j >= 0; --j) {
            var line = prev[j];
            if (current[currentLastIndex] === line) {
                current.pop();
                currentLastIndex--;
            } else {
                break;
            }
        }
        current = prev;
    }
}

function cleanStack(stack) {
    var ret = [];
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        var isTraceLine = "    (No stack trace)" === line ||
            stackFramePattern.test(line);
        var isInternalFrame = isTraceLine && shouldIgnore(line);
        if (isTraceLine && !isInternalFrame) {
            if (indentStackFrames && line.charAt(0) !== " ") {
                line = "    " + line;
            }
            ret.push(line);
        }
    }
    return ret;
}

function stackFramesAsArray(error) {
    var stack = error.stack.replace(/\s+$/g, "").split("\n");
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
            break;
        }
    }
    if (i > 0 && error.name != "SyntaxError") {
        stack = stack.slice(i);
    }
    return stack;
}

function parseStackAndMessage(error) {
    var stack = error.stack;
    var message = error.toString();
    stack = typeof stack === "string" && stack.length > 0
                ? stackFramesAsArray(error) : ["    (No stack trace)"];
    return {
        message: message,
        stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
    };
}

function formatAndLogError(error, title, isSoft) {
    if (typeof console !== "undefined") {
        var message;
        if (util.isObject(error)) {
            var stack = error.stack;
            message = title + formatStack(stack, error);
        } else {
            message = title + String(error);
        }
        if (typeof printWarning === "function") {
            printWarning(message, isSoft);
        } else if (typeof console.log === "function" ||
            typeof console.log === "object") {
            console.log(message);
        }
    }
}

function fireRejectionEvent(name, localHandler, reason, promise) {
    var localEventFired = false;
    try {
        if (typeof localHandler === "function") {
            localEventFired = true;
            if (name === "rejectionHandled") {
                localHandler(promise);
            } else {
                localHandler(reason, promise);
            }
        }
    } catch (e) {
        async.throwLater(e);
    }

    if (name === "unhandledRejection") {
        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
            formatAndLogError(reason, "Unhandled rejection ");
        }
    } else {
        activeFireEvent(name, promise);
    }
}

function formatNonError(obj) {
    var str;
    if (typeof obj === "function") {
        str = "[function " +
            (obj.name || "anonymous") +
            "]";
    } else {
        str = obj && typeof obj.toString === "function"
            ? obj.toString() : util.toString(obj);
        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
        if (ruselessToString.test(str)) {
            try {
                var newStr = JSON.stringify(obj);
                str = newStr;
            }
            catch(e) {

            }
        }
        if (str.length === 0) {
            str = "(empty array)";
        }
    }
    return ("(<" + snip(str) + ">, no stack trace)");
}

function snip(str) {
    var maxChars = 41;
    if (str.length < maxChars) {
        return str;
    }
    return str.substr(0, maxChars - 3) + "...";
}

function longStackTracesIsSupported() {
    return typeof captureStackTrace === "function";
}

var shouldIgnore = function() { return false; };
var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
function parseLineInfo(line) {
    var matches = line.match(parseLineInfoRegex);
    if (matches) {
        return {
            fileName: matches[1],
            line: parseInt(matches[2], 10)
        };
    }
}

function setBounds(firstLineError, lastLineError) {
    if (!longStackTracesIsSupported()) return;
    var firstStackLines = firstLineError.stack.split("\n");
    var lastStackLines = lastLineError.stack.split("\n");
    var firstIndex = -1;
    var lastIndex = -1;
    var firstFileName;
    var lastFileName;
    for (var i = 0; i < firstStackLines.length; ++i) {
        var result = parseLineInfo(firstStackLines[i]);
        if (result) {
            firstFileName = result.fileName;
            firstIndex = result.line;
            break;
        }
    }
    for (var i = 0; i < lastStackLines.length; ++i) {
        var result = parseLineInfo(lastStackLines[i]);
        if (result) {
            lastFileName = result.fileName;
            lastIndex = result.line;
            break;
        }
    }
    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
        firstFileName !== lastFileName || firstIndex >= lastIndex) {
        return;
    }

    shouldIgnore = function(line) {
        if (bluebirdFramePattern.test(line)) return true;
        var info = parseLineInfo(line);
        if (info) {
            if (info.fileName === firstFileName &&
                (firstIndex <= info.line && info.line <= lastIndex)) {
                return true;
            }
        }
        return false;
    };
}

function CapturedTrace(parent) {
    this._parent = parent;
    this._promisesCreated = 0;
    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
    captureStackTrace(this, CapturedTrace);
    if (length > 32) this.uncycle();
}
util.inherits(CapturedTrace, Error);
Context.CapturedTrace = CapturedTrace;

CapturedTrace.prototype.uncycle = function() {
    var length = this._length;
    if (length < 2) return;
    var nodes = [];
    var stackToIndex = {};

    for (var i = 0, node = this; node !== undefined; ++i) {
        nodes.push(node);
        node = node._parent;
    }
    length = this._length = i;
    for (var i = length - 1; i >= 0; --i) {
        var stack = nodes[i].stack;
        if (stackToIndex[stack] === undefined) {
            stackToIndex[stack] = i;
        }
    }
    for (var i = 0; i < length; ++i) {
        var currentStack = nodes[i].stack;
        var index = stackToIndex[currentStack];
        if (index !== undefined && index !== i) {
            if (index > 0) {
                nodes[index - 1]._parent = undefined;
                nodes[index - 1]._length = 1;
            }
            nodes[i]._parent = undefined;
            nodes[i]._length = 1;
            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

            if (index < length - 1) {
                cycleEdgeNode._parent = nodes[index + 1];
                cycleEdgeNode._parent.uncycle();
                cycleEdgeNode._length =
                    cycleEdgeNode._parent._length + 1;
            } else {
                cycleEdgeNode._parent = undefined;
                cycleEdgeNode._length = 1;
            }
            var currentChildLength = cycleEdgeNode._length + 1;
            for (var j = i - 2; j >= 0; --j) {
                nodes[j]._length = currentChildLength;
                currentChildLength++;
            }
            return;
        }
    }
};

CapturedTrace.prototype.attachExtraTrace = function(error) {
    if (error.__stackCleaned__) return;
    this.uncycle();
    var parsed = parseStackAndMessage(error);
    var message = parsed.message;
    var stacks = [parsed.stack];

    var trace = this;
    while (trace !== undefined) {
        stacks.push(cleanStack(trace.stack.split("\n")));
        trace = trace._parent;
    }
    removeCommonRoots(stacks);
    removeDuplicateOrEmptyJumps(stacks);
    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
    util.notEnumerableProp(error, "__stackCleaned__", true);
};

var captureStackTrace = (function stackDetection() {
    var v8stackFramePattern = /^\s*at\s*/;
    var v8stackFormatter = function(stack, error) {
        if (typeof stack === "string") return stack;

        if (error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    if (typeof Error.stackTraceLimit === "number" &&
        typeof Error.captureStackTrace === "function") {
        Error.stackTraceLimit += 6;
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        var captureStackTrace = Error.captureStackTrace;

        shouldIgnore = function(line) {
            return bluebirdFramePattern.test(line);
        };
        return function(receiver, ignoreUntil) {
            Error.stackTraceLimit += 6;
            captureStackTrace(receiver, ignoreUntil);
            Error.stackTraceLimit -= 6;
        };
    }
    var err = new Error();

    if (typeof err.stack === "string" &&
        err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
        stackFramePattern = /@/;
        formatStack = v8stackFormatter;
        indentStackFrames = true;
        return function captureStackTrace(o) {
            o.stack = new Error().stack;
        };
    }

    var hasStackAfterThrow;
    try { throw new Error(); }
    catch(e) {
        hasStackAfterThrow = ("stack" in e);
    }
    if (!("stack" in err) && hasStackAfterThrow &&
        typeof Error.stackTraceLimit === "number") {
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        return function captureStackTrace(o) {
            Error.stackTraceLimit += 6;
            try { throw new Error(); }
            catch(e) { o.stack = e.stack; }
            Error.stackTraceLimit -= 6;
        };
    }

    formatStack = function(stack, error) {
        if (typeof stack === "string") return stack;

        if ((typeof error === "object" ||
            typeof error === "function") &&
            error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    return null;

})([]);

if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
    printWarning = function (message) {
        console.warn(message);
    };
    if (util.isNode && process.stderr.isTTY) {
        printWarning = function(message, isSoft) {
            var color = isSoft ? "\u001b[33m" : "\u001b[31m";
            console.warn(color + message + "\u001b[0m\n");
        };
    } else if (!util.isNode && typeof (new Error().stack) === "string") {
        printWarning = function(message, isSoft) {
            console.warn("%c" + message,
                        isSoft ? "color: darkorange" : "color: red");
        };
    }
}

var config = {
    warnings: warnings,
    longStackTraces: false,
    cancellation: false,
    monitoring: false
};

if (longStackTraces) Promise.longStackTraces();

return {
    longStackTraces: function() {
        return config.longStackTraces;
    },
    warnings: function() {
        return config.warnings;
    },
    cancellation: function() {
        return config.cancellation;
    },
    monitoring: function() {
        return config.monitoring;
    },
    propagateFromFunction: function() {
        return propagateFromFunction;
    },
    boundValueFunction: function() {
        return boundValueFunction;
    },
    checkForgottenReturns: checkForgottenReturns,
    setBounds: setBounds,
    warn: warn,
    deprecated: deprecated,
    CapturedTrace: CapturedTrace,
    fireDomEvent: fireDomEvent,
    fireGlobalEvent: fireGlobalEvent
};
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, tryConvertToPromise, NEXT_FILTER) {
var util = __webpack_require__(0);
var CancellationError = Promise.CancellationError;
var errorObj = util.errorObj;
var catchFilter = __webpack_require__(22)(NEXT_FILTER);

function PassThroughHandlerContext(promise, type, handler) {
    this.promise = promise;
    this.type = type;
    this.handler = handler;
    this.called = false;
    this.cancelPromise = null;
}

PassThroughHandlerContext.prototype.isFinallyHandler = function() {
    return this.type === 0;
};

function FinallyHandlerCancelReaction(finallyHandler) {
    this.finallyHandler = finallyHandler;
}

FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
    checkCancel(this.finallyHandler);
};

function checkCancel(ctx, reason) {
    if (ctx.cancelPromise != null) {
        if (arguments.length > 1) {
            ctx.cancelPromise._reject(reason);
        } else {
            ctx.cancelPromise._cancel();
        }
        ctx.cancelPromise = null;
        return true;
    }
    return false;
}

function succeed() {
    return finallyHandler.call(this, this.promise._target()._settledValue());
}
function fail(reason) {
    if (checkCancel(this, reason)) return;
    errorObj.e = reason;
    return errorObj;
}
function finallyHandler(reasonOrValue) {
    var promise = this.promise;
    var handler = this.handler;

    if (!this.called) {
        this.called = true;
        var ret = this.isFinallyHandler()
            ? handler.call(promise._boundValue())
            : handler.call(promise._boundValue(), reasonOrValue);
        if (ret === NEXT_FILTER) {
            return ret;
        } else if (ret !== undefined) {
            promise._setReturnedNonUndefined();
            var maybePromise = tryConvertToPromise(ret, promise);
            if (maybePromise instanceof Promise) {
                if (this.cancelPromise != null) {
                    if (maybePromise._isCancelled()) {
                        var reason =
                            new CancellationError("late cancellation observer");
                        promise._attachExtraTrace(reason);
                        errorObj.e = reason;
                        return errorObj;
                    } else if (maybePromise.isPending()) {
                        maybePromise._attachCancellationCallback(
                            new FinallyHandlerCancelReaction(this));
                    }
                }
                return maybePromise._then(
                    succeed, fail, undefined, this, undefined);
            }
        }
    }

    if (promise.isRejected()) {
        checkCancel(this);
        errorObj.e = reasonOrValue;
        return errorObj;
    } else {
        checkCancel(this);
        return reasonOrValue;
    }
}

Promise.prototype._passThrough = function(handler, type, success, fail) {
    if (typeof handler !== "function") return this.then();
    return this._then(success,
                      fail,
                      undefined,
                      new PassThroughHandlerContext(this, type, handler),
                      undefined);
};

Promise.prototype.lastly =
Promise.prototype["finally"] = function (handler) {
    return this._passThrough(handler,
                             0,
                             finallyHandler,
                             finallyHandler);
};


Promise.prototype.tap = function (handler) {
    return this._passThrough(handler, 1, finallyHandler);
};

Promise.prototype.tapCatch = function (handlerOrPredicate) {
    var len = arguments.length;
    if(len === 1) {
        return this._passThrough(handlerOrPredicate,
                                 1,
                                 undefined,
                                 finallyHandler);
    } else {
         var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
                catchInstances[j++] = item;
            } else {
                return Promise.reject(new TypeError(
                    "tapCatch statement predicate: "
                    + "expecting an object but got " + util.classString(item)
                ));
            }
        }
        catchInstances.length = j;
        var handler = arguments[i];
        return this._passThrough(catchFilter(catchInstances, handler, this),
                                 1,
                                 undefined,
                                 finallyHandler);
    }

};

return PassThroughHandlerContext;
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports =
function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
var util = __webpack_require__(0);
var tryCatch = util.tryCatch;

Promise.method = function (fn) {
    if (typeof fn !== "function") {
        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
    }
    return function () {
        var ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._pushContext();
        var value = tryCatch(fn).apply(this, arguments);
        var promiseCreated = ret._popContext();
        debug.checkForgottenReturns(
            value, promiseCreated, "Promise.method", ret);
        ret._resolveFromSyncValue(value);
        return ret;
    };
};

Promise.attempt = Promise["try"] = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._pushContext();
    var value;
    if (arguments.length > 1) {
        debug.deprecated("calling Promise.try with more than 1 argument");
        var arg = arguments[1];
        var ctx = arguments[2];
        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
                                  : tryCatch(fn).call(ctx, arg);
    } else {
        value = tryCatch(fn)();
    }
    var promiseCreated = ret._popContext();
    debug.checkForgottenReturns(
        value, promiseCreated, "Promise.try", ret);
    ret._resolveFromSyncValue(value);
    return ret;
};

Promise.prototype._resolveFromSyncValue = function (value) {
    if (value === util.errorObj) {
        this._rejectCallback(value.e, false);
    } else {
        this._resolveCallback(value, true);
    }
};
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
var calledBind = false;
var rejectThis = function(_, e) {
    this._reject(e);
};

var targetRejected = function(e, context) {
    context.promiseRejectionQueued = true;
    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
};

var bindingResolved = function(thisArg, context) {
    if (((this._bitField & 50397184) === 0)) {
        this._resolveCallback(context.target);
    }
};

var bindingRejected = function(e, context) {
    if (!context.promiseRejectionQueued) this._reject(e);
};

Promise.prototype.bind = function (thisArg) {
    if (!calledBind) {
        calledBind = true;
        Promise.prototype._propagateFrom = debug.propagateFromFunction();
        Promise.prototype._boundValue = debug.boundValueFunction();
    }
    var maybePromise = tryConvertToPromise(thisArg);
    var ret = new Promise(INTERNAL);
    ret._propagateFrom(this, 1);
    var target = this._target();
    ret._setBoundTo(maybePromise);
    if (maybePromise instanceof Promise) {
        var context = {
            promiseRejectionQueued: false,
            promise: ret,
            target: target,
            bindingPromise: maybePromise
        };
        target._then(INTERNAL, targetRejected, undefined, ret, context);
        maybePromise._then(
            bindingResolved, bindingRejected, undefined, ret, context);
        ret._setOnCancel(maybePromise);
    } else {
        ret._resolveCallback(target);
    }
    return ret;
};

Promise.prototype._setBoundTo = function (obj) {
    if (obj !== undefined) {
        this._bitField = this._bitField | 2097152;
        this._boundTo = obj;
    } else {
        this._bitField = this._bitField & (~2097152);
    }
};

Promise.prototype._isBound = function () {
    return (this._bitField & 2097152) === 2097152;
};

Promise.bind = function (thisArg, value) {
    return Promise.resolve(value).bind(thisArg);
};
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, PromiseArray, apiRejection, debug) {
var util = __webpack_require__(0);
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var async = Promise._async;

Promise.prototype["break"] = Promise.prototype.cancel = function() {
    if (!debug.cancellation()) return this._warn("cancellation is disabled");

    var promise = this;
    var child = promise;
    while (promise._isCancellable()) {
        if (!promise._cancelBy(child)) {
            if (child._isFollowing()) {
                child._followee().cancel();
            } else {
                child._cancelBranched();
            }
            break;
        }

        var parent = promise._cancellationParent;
        if (parent == null || !parent._isCancellable()) {
            if (promise._isFollowing()) {
                promise._followee().cancel();
            } else {
                promise._cancelBranched();
            }
            break;
        } else {
            if (promise._isFollowing()) promise._followee().cancel();
            promise._setWillBeCancelled();
            child = promise;
            promise = parent;
        }
    }
};

Promise.prototype._branchHasCancelled = function() {
    this._branchesRemainingToCancel--;
};

Promise.prototype._enoughBranchesHaveCancelled = function() {
    return this._branchesRemainingToCancel === undefined ||
           this._branchesRemainingToCancel <= 0;
};

Promise.prototype._cancelBy = function(canceller) {
    if (canceller === this) {
        this._branchesRemainingToCancel = 0;
        this._invokeOnCancel();
        return true;
    } else {
        this._branchHasCancelled();
        if (this._enoughBranchesHaveCancelled()) {
            this._invokeOnCancel();
            return true;
        }
    }
    return false;
};

Promise.prototype._cancelBranched = function() {
    if (this._enoughBranchesHaveCancelled()) {
        this._cancel();
    }
};

Promise.prototype._cancel = function() {
    if (!this._isCancellable()) return;
    this._setCancelled();
    async.invoke(this._cancelPromises, this, undefined);
};

Promise.prototype._cancelPromises = function() {
    if (this._length() > 0) this._settlePromises();
};

Promise.prototype._unsetOnCancel = function() {
    this._onCancelField = undefined;
};

Promise.prototype._isCancellable = function() {
    return this.isPending() && !this._isCancelled();
};

Promise.prototype.isCancellable = function() {
    return this.isPending() && !this.isCancelled();
};

Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
    if (util.isArray(onCancelCallback)) {
        for (var i = 0; i < onCancelCallback.length; ++i) {
            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
        }
    } else if (onCancelCallback !== undefined) {
        if (typeof onCancelCallback === "function") {
            if (!internalOnly) {
                var e = tryCatch(onCancelCallback).call(this._boundValue());
                if (e === errorObj) {
                    this._attachExtraTrace(e.e);
                    async.throwLater(e.e);
                }
            }
        } else {
            onCancelCallback._resultCancelled(this);
        }
    }
};

Promise.prototype._invokeOnCancel = function() {
    var onCancelCallback = this._onCancel();
    this._unsetOnCancel();
    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
};

Promise.prototype._invokeInternalOnCancel = function() {
    if (this._isCancellable()) {
        this._doInvokeOnCancel(this._onCancel(), true);
        this._unsetOnCancel();
    }
};

Promise.prototype._resultCancelled = function() {
    this.cancel();
};

};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
function returner() {
    return this.value;
}
function thrower() {
    throw this.reason;
}

Promise.prototype["return"] =
Promise.prototype.thenReturn = function (value) {
    if (value instanceof Promise) value.suppressUnhandledRejections();
    return this._then(
        returner, undefined, undefined, {value: value}, undefined);
};

Promise.prototype["throw"] =
Promise.prototype.thenThrow = function (reason) {
    return this._then(
        thrower, undefined, undefined, {reason: reason}, undefined);
};

Promise.prototype.catchThrow = function (reason) {
    if (arguments.length <= 1) {
        return this._then(
            undefined, thrower, undefined, {reason: reason}, undefined);
    } else {
        var _reason = arguments[1];
        var handler = function() {throw _reason;};
        return this.caught(reason, handler);
    }
};

Promise.prototype.catchReturn = function (value) {
    if (arguments.length <= 1) {
        if (value instanceof Promise) value.suppressUnhandledRejections();
        return this._then(
            undefined, returner, undefined, {value: value}, undefined);
    } else {
        var _value = arguments[1];
        if (_value instanceof Promise) _value.suppressUnhandledRejections();
        var handler = function() {return _value;};
        return this.caught(value, handler);
    }
};
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
function PromiseInspection(promise) {
    if (promise !== undefined) {
        promise = promise._target();
        this._bitField = promise._bitField;
        this._settledValueField = promise._isFateSealed()
            ? promise._settledValue() : undefined;
    }
    else {
        this._bitField = 0;
        this._settledValueField = undefined;
    }
}

PromiseInspection.prototype._settledValue = function() {
    return this._settledValueField;
};

var value = PromiseInspection.prototype.value = function () {
    if (!this.isFulfilled()) {
        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    return this._settledValue();
};

var reason = PromiseInspection.prototype.error =
PromiseInspection.prototype.reason = function () {
    if (!this.isRejected()) {
        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    return this._settledValue();
};

var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
    return (this._bitField & 33554432) !== 0;
};

var isRejected = PromiseInspection.prototype.isRejected = function () {
    return (this._bitField & 16777216) !== 0;
};

var isPending = PromiseInspection.prototype.isPending = function () {
    return (this._bitField & 50397184) === 0;
};

var isResolved = PromiseInspection.prototype.isResolved = function () {
    return (this._bitField & 50331648) !== 0;
};

PromiseInspection.prototype.isCancelled = function() {
    return (this._bitField & 8454144) !== 0;
};

Promise.prototype.__isCancelled = function() {
    return (this._bitField & 65536) === 65536;
};

Promise.prototype._isCancelled = function() {
    return this._target().__isCancelled();
};

Promise.prototype.isCancelled = function() {
    return (this._target()._bitField & 8454144) !== 0;
};

Promise.prototype.isPending = function() {
    return isPending.call(this._target());
};

Promise.prototype.isRejected = function() {
    return isRejected.call(this._target());
};

Promise.prototype.isFulfilled = function() {
    return isFulfilled.call(this._target());
};

Promise.prototype.isResolved = function() {
    return isResolved.call(this._target());
};

Promise.prototype.value = function() {
    return value.call(this._target());
};

Promise.prototype.reason = function() {
    var target = this._target();
    target._unsetRejectionIsUnhandled();
    return reason.call(target);
};

Promise.prototype._value = function() {
    return this._settledValue();
};

Promise.prototype._reason = function() {
    this._unsetRejectionIsUnhandled();
    return this._settledValue();
};

Promise.PromiseInspection = PromiseInspection;
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports =
function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async,
         getDomain) {
var util = __webpack_require__(0);
var canEvaluate = util.canEvaluate;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var reject;

if (true) {
if (canEvaluate) {
    var thenCallback = function(i) {
        return new Function("value", "holder", "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
    };

    var promiseSetter = function(i) {
        return new Function("promise", "holder", "                           \n\
            'use strict';                                                    \n\
            holder.pIndex = promise;                                         \n\
            ".replace(/Index/g, i));
    };

    var generateHolderClass = function(total) {
        var props = new Array(total);
        for (var i = 0; i < props.length; ++i) {
            props[i] = "this.p" + (i+1);
        }
        var assignment = props.join(" = ") + " = null;";
        var cancellationCode= "var promise;\n" + props.map(function(prop) {
            return "                                                         \n\
                promise = " + prop + ";                                      \n\
                if (promise instanceof Promise) {                            \n\
                    promise.cancel();                                        \n\
                }                                                            \n\
            ";
        }).join("\n");
        var passedArguments = props.join(", ");
        var name = "Holder$" + total;


        var code = "return function(tryCatch, errorObj, Promise, async) {    \n\
            'use strict';                                                    \n\
            function [TheName](fn) {                                         \n\
                [TheProperties]                                              \n\
                this.fn = fn;                                                \n\
                this.asyncNeeded = true;                                     \n\
                this.now = 0;                                                \n\
            }                                                                \n\
                                                                             \n\
            [TheName].prototype._callFunction = function(promise) {          \n\
                promise._pushContext();                                      \n\
                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n\
                promise._popContext();                                       \n\
                if (ret === errorObj) {                                      \n\
                    promise._rejectCallback(ret.e, false);                   \n\
                } else {                                                     \n\
                    promise._resolveCallback(ret);                           \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype.checkFulfillment = function(promise) {       \n\
                var now = ++this.now;                                        \n\
                if (now === [TheTotal]) {                                    \n\
                    if (this.asyncNeeded) {                                  \n\
                        async.invoke(this._callFunction, this, promise);     \n\
                    } else {                                                 \n\
                        this._callFunction(promise);                         \n\
                    }                                                        \n\
                                                                             \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype._resultCancelled = function() {              \n\
                [CancellationCode]                                           \n\
            };                                                               \n\
                                                                             \n\
            return [TheName];                                                \n\
        }(tryCatch, errorObj, Promise, async);                               \n\
        ";

        code = code.replace(/\[TheName\]/g, name)
            .replace(/\[TheTotal\]/g, total)
            .replace(/\[ThePassedArguments\]/g, passedArguments)
            .replace(/\[TheProperties\]/g, assignment)
            .replace(/\[CancellationCode\]/g, cancellationCode);

        return new Function("tryCatch", "errorObj", "Promise", "async", code)
                           (tryCatch, errorObj, Promise, async);
    };

    var holderClasses = [];
    var thenCallbacks = [];
    var promiseSetters = [];

    for (var i = 0; i < 8; ++i) {
        holderClasses.push(generateHolderClass(i + 1));
        thenCallbacks.push(thenCallback(i + 1));
        promiseSetters.push(promiseSetter(i + 1));
    }

    reject = function (reason) {
        this._reject(reason);
    };
}}

Promise.join = function () {
    var last = arguments.length - 1;
    var fn;
    if (last > 0 && typeof arguments[last] === "function") {
        fn = arguments[last];
        if (true) {
            if (last <= 8 && canEvaluate) {
                var ret = new Promise(INTERNAL);
                ret._captureStackTrace();
                var HolderClass = holderClasses[last - 1];
                var holder = new HolderClass(fn);
                var callbacks = thenCallbacks;

                for (var i = 0; i < last; ++i) {
                    var maybePromise = tryConvertToPromise(arguments[i], ret);
                    if (maybePromise instanceof Promise) {
                        maybePromise = maybePromise._target();
                        var bitField = maybePromise._bitField;
                        ;
                        if (((bitField & 50397184) === 0)) {
                            maybePromise._then(callbacks[i], reject,
                                               undefined, ret, holder);
                            promiseSetters[i](maybePromise, holder);
                            holder.asyncNeeded = false;
                        } else if (((bitField & 33554432) !== 0)) {
                            callbacks[i].call(ret,
                                              maybePromise._value(), holder);
                        } else if (((bitField & 16777216) !== 0)) {
                            ret._reject(maybePromise._reason());
                        } else {
                            ret._cancel();
                        }
                    } else {
                        callbacks[i].call(ret, maybePromise, holder);
                    }
                }

                if (!ret._isFateSealed()) {
                    if (holder.asyncNeeded) {
                        var domain = getDomain();
                        if (domain !== null) {
                            holder.fn = util.domainBind(domain, holder.fn);
                        }
                    }
                    ret._setAsyncGuaranteed();
                    ret._setOnCancel(holder);
                }
                return ret;
            }
        }
    }
    var $_len = arguments.length;var args = new Array($_len); for(var $_i = 0; $_i < $_len; ++$_i) {args[$_i] = arguments[$_i];};
    if (fn) args.pop();
    var ret = new PromiseArray(args).promise();
    return fn !== undefined ? ret.spread(fn) : ret;
};

};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL,
                          debug) {
var getDomain = Promise._getDomain;
var util = __webpack_require__(0);
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var async = Promise._async;

function MappingPromiseArray(promises, fn, limit, _filter) {
    this.constructor$(promises);
    this._promise._captureStackTrace();
    var domain = getDomain();
    this._callback = domain === null ? fn : util.domainBind(domain, fn);
    this._preservedValues = _filter === INTERNAL
        ? new Array(this.length())
        : null;
    this._limit = limit;
    this._inFlight = 0;
    this._queue = [];
    async.invoke(this._asyncInit, this, undefined);
}
util.inherits(MappingPromiseArray, PromiseArray);

MappingPromiseArray.prototype._asyncInit = function() {
    this._init$(undefined, -2);
};

MappingPromiseArray.prototype._init = function () {};

MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var values = this._values;
    var length = this.length();
    var preservedValues = this._preservedValues;
    var limit = this._limit;

    if (index < 0) {
        index = (index * -1) - 1;
        values[index] = value;
        if (limit >= 1) {
            this._inFlight--;
            this._drainQueue();
            if (this._isResolved()) return true;
        }
    } else {
        if (limit >= 1 && this._inFlight >= limit) {
            values[index] = value;
            this._queue.push(index);
            return false;
        }
        if (preservedValues !== null) preservedValues[index] = value;

        var promise = this._promise;
        var callback = this._callback;
        var receiver = promise._boundValue();
        promise._pushContext();
        var ret = tryCatch(callback).call(receiver, value, index, length);
        var promiseCreated = promise._popContext();
        debug.checkForgottenReturns(
            ret,
            promiseCreated,
            preservedValues !== null ? "Promise.filter" : "Promise.map",
            promise
        );
        if (ret === errorObj) {
            this._reject(ret.e);
            return true;
        }

        var maybePromise = tryConvertToPromise(ret, this._promise);
        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            var bitField = maybePromise._bitField;
            ;
            if (((bitField & 50397184) === 0)) {
                if (limit >= 1) this._inFlight++;
                values[index] = maybePromise;
                maybePromise._proxy(this, (index + 1) * -1);
                return false;
            } else if (((bitField & 33554432) !== 0)) {
                ret = maybePromise._value();
            } else if (((bitField & 16777216) !== 0)) {
                this._reject(maybePromise._reason());
                return true;
            } else {
                this._cancel();
                return true;
            }
        }
        values[index] = ret;
    }
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= length) {
        if (preservedValues !== null) {
            this._filter(values, preservedValues);
        } else {
            this._resolve(values);
        }
        return true;
    }
    return false;
};

MappingPromiseArray.prototype._drainQueue = function () {
    var queue = this._queue;
    var limit = this._limit;
    var values = this._values;
    while (queue.length > 0 && this._inFlight < limit) {
        if (this._isResolved()) return;
        var index = queue.pop();
        this._promiseFulfilled(values[index], index);
    }
};

MappingPromiseArray.prototype._filter = function (booleans, values) {
    var len = values.length;
    var ret = new Array(len);
    var j = 0;
    for (var i = 0; i < len; ++i) {
        if (booleans[i]) ret[j++] = values[i];
    }
    ret.length = j;
    this._resolve(ret);
};

MappingPromiseArray.prototype.preservedValues = function () {
    return this._preservedValues;
};

function map(promises, fn, options, _filter) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }

    var limit = 0;
    if (options !== undefined) {
        if (typeof options === "object" && options !== null) {
            if (typeof options.concurrency !== "number") {
                return Promise.reject(
                    new TypeError("'concurrency' must be a number but it is " +
                                    util.classString(options.concurrency)));
            }
            limit = options.concurrency;
        } else {
            return Promise.reject(new TypeError(
                            "options argument must be an object but it is " +
                             util.classString(options)));
        }
    }
    limit = typeof limit === "number" &&
        isFinite(limit) && limit >= 1 ? limit : 0;
    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
}

Promise.prototype.map = function (fn, options) {
    return map(this, fn, options, null);
};

Promise.map = function (promises, fn, options, _filter) {
    return map(promises, fn, options, _filter);
};


};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var cr = Object.create;
if (cr) {
    var callerCache = cr(null);
    var getterCache = cr(null);
    callerCache[" size"] = getterCache[" size"] = 0;
}

module.exports = function(Promise) {
var util = __webpack_require__(0);
var canEvaluate = util.canEvaluate;
var isIdentifier = util.isIdentifier;

var getMethodCaller;
var getGetter;
if (true) {
var makeMethodCaller = function (methodName) {
    return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
};

var makeGetter = function (propertyName) {
    return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
};

var getCompiled = function(name, compiler, cache) {
    var ret = cache[name];
    if (typeof ret !== "function") {
        if (!isIdentifier(name)) {
            return null;
        }
        ret = compiler(name);
        cache[name] = ret;
        cache[" size"]++;
        if (cache[" size"] > 512) {
            var keys = Object.keys(cache);
            for (var i = 0; i < 256; ++i) delete cache[keys[i]];
            cache[" size"] = keys.length - 256;
        }
    }
    return ret;
};

getMethodCaller = function(name) {
    return getCompiled(name, makeMethodCaller, callerCache);
};

getGetter = function(name) {
    return getCompiled(name, makeGetter, getterCache);
};
}

function ensureMethod(obj, methodName) {
    var fn;
    if (obj != null) fn = obj[methodName];
    if (typeof fn !== "function") {
        var message = "Object " + util.classString(obj) + " has no method '" +
            util.toString(methodName) + "'";
        throw new Promise.TypeError(message);
    }
    return fn;
}

function caller(obj) {
    var methodName = this.pop();
    var fn = ensureMethod(obj, methodName);
    return fn.apply(obj, this);
}
Promise.prototype.call = function (methodName) {
    var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0)); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];};
    if (true) {
        if (canEvaluate) {
            var maybeCaller = getMethodCaller(methodName);
            if (maybeCaller !== null) {
                return this._then(
                    maybeCaller, undefined, undefined, args, undefined);
            }
        }
    }
    args.push(methodName);
    return this._then(caller, undefined, undefined, args, undefined);
};

function namedGetter(obj) {
    return obj[this];
}
function indexedGetter(obj) {
    var index = +this;
    if (index < 0) index = Math.max(0, index + obj.length);
    return obj[index];
}
Promise.prototype.get = function (propertyName) {
    var isIndex = (typeof propertyName === "number");
    var getter;
    if (!isIndex) {
        if (canEvaluate) {
            var maybeGetter = getGetter(propertyName);
            getter = maybeGetter !== null ? maybeGetter : namedGetter;
        } else {
            getter = namedGetter;
        }
    } else {
        getter = indexedGetter;
    }
    return this._then(getter, undefined, undefined, propertyName, undefined);
};
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (Promise, apiRejection, tryConvertToPromise,
    createContext, INTERNAL, debug) {
    var util = __webpack_require__(0);
    var TypeError = __webpack_require__(2).TypeError;
    var inherits = __webpack_require__(0).inherits;
    var errorObj = util.errorObj;
    var tryCatch = util.tryCatch;
    var NULL = {};

    function thrower(e) {
        setTimeout(function(){throw e;}, 0);
    }

    function castPreservingDisposable(thenable) {
        var maybePromise = tryConvertToPromise(thenable);
        if (maybePromise !== thenable &&
            typeof thenable._isDisposable === "function" &&
            typeof thenable._getDisposer === "function" &&
            thenable._isDisposable()) {
            maybePromise._setDisposable(thenable._getDisposer());
        }
        return maybePromise;
    }
    function dispose(resources, inspection) {
        var i = 0;
        var len = resources.length;
        var ret = new Promise(INTERNAL);
        function iterator() {
            if (i >= len) return ret._fulfill();
            var maybePromise = castPreservingDisposable(resources[i++]);
            if (maybePromise instanceof Promise &&
                maybePromise._isDisposable()) {
                try {
                    maybePromise = tryConvertToPromise(
                        maybePromise._getDisposer().tryDispose(inspection),
                        resources.promise);
                } catch (e) {
                    return thrower(e);
                }
                if (maybePromise instanceof Promise) {
                    return maybePromise._then(iterator, thrower,
                                              null, null, null);
                }
            }
            iterator();
        }
        iterator();
        return ret;
    }

    function Disposer(data, promise, context) {
        this._data = data;
        this._promise = promise;
        this._context = context;
    }

    Disposer.prototype.data = function () {
        return this._data;
    };

    Disposer.prototype.promise = function () {
        return this._promise;
    };

    Disposer.prototype.resource = function () {
        if (this.promise().isFulfilled()) {
            return this.promise().value();
        }
        return NULL;
    };

    Disposer.prototype.tryDispose = function(inspection) {
        var resource = this.resource();
        var context = this._context;
        if (context !== undefined) context._pushContext();
        var ret = resource !== NULL
            ? this.doDispose(resource, inspection) : null;
        if (context !== undefined) context._popContext();
        this._promise._unsetDisposable();
        this._data = null;
        return ret;
    };

    Disposer.isDisposer = function (d) {
        return (d != null &&
                typeof d.resource === "function" &&
                typeof d.tryDispose === "function");
    };

    function FunctionDisposer(fn, promise, context) {
        this.constructor$(fn, promise, context);
    }
    inherits(FunctionDisposer, Disposer);

    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
        var fn = this.data();
        return fn.call(resource, resource, inspection);
    };

    function maybeUnwrapDisposer(value) {
        if (Disposer.isDisposer(value)) {
            this.resources[this.index]._setDisposable(value);
            return value.promise();
        }
        return value;
    }

    function ResourceList(length) {
        this.length = length;
        this.promise = null;
        this[length-1] = null;
    }

    ResourceList.prototype._resultCancelled = function() {
        var len = this.length;
        for (var i = 0; i < len; ++i) {
            var item = this[i];
            if (item instanceof Promise) {
                item.cancel();
            }
        }
    };

    Promise.using = function () {
        var len = arguments.length;
        if (len < 2) return apiRejection(
                        "you must pass at least 2 arguments to Promise.using");
        var fn = arguments[len - 1];
        if (typeof fn !== "function") {
            return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var input;
        var spreadArgs = true;
        if (len === 2 && Array.isArray(arguments[0])) {
            input = arguments[0];
            len = input.length;
            spreadArgs = false;
        } else {
            input = arguments;
            len--;
        }
        var resources = new ResourceList(len);
        for (var i = 0; i < len; ++i) {
            var resource = input[i];
            if (Disposer.isDisposer(resource)) {
                var disposer = resource;
                resource = resource.promise();
                resource._setDisposable(disposer);
            } else {
                var maybePromise = tryConvertToPromise(resource);
                if (maybePromise instanceof Promise) {
                    resource =
                        maybePromise._then(maybeUnwrapDisposer, null, null, {
                            resources: resources,
                            index: i
                    }, undefined);
                }
            }
            resources[i] = resource;
        }

        var reflectedResources = new Array(resources.length);
        for (var i = 0; i < reflectedResources.length; ++i) {
            reflectedResources[i] = Promise.resolve(resources[i]).reflect();
        }

        var resultPromise = Promise.all(reflectedResources)
            .then(function(inspections) {
                for (var i = 0; i < inspections.length; ++i) {
                    var inspection = inspections[i];
                    if (inspection.isRejected()) {
                        errorObj.e = inspection.error();
                        return errorObj;
                    } else if (!inspection.isFulfilled()) {
                        resultPromise.cancel();
                        return;
                    }
                    inspections[i] = inspection.value();
                }
                promise._pushContext();

                fn = tryCatch(fn);
                var ret = spreadArgs
                    ? fn.apply(undefined, inspections) : fn(inspections);
                var promiseCreated = promise._popContext();
                debug.checkForgottenReturns(
                    ret, promiseCreated, "Promise.using", promise);
                return ret;
            });

        var promise = resultPromise.lastly(function() {
            var inspection = new Promise.PromiseInspection(resultPromise);
            return dispose(resources, inspection);
        });
        resources.promise = promise;
        promise._setOnCancel(resources);
        return promise;
    };

    Promise.prototype._setDisposable = function (disposer) {
        this._bitField = this._bitField | 131072;
        this._disposer = disposer;
    };

    Promise.prototype._isDisposable = function () {
        return (this._bitField & 131072) > 0;
    };

    Promise.prototype._getDisposer = function () {
        return this._disposer;
    };

    Promise.prototype._unsetDisposable = function () {
        this._bitField = this._bitField & (~131072);
        this._disposer = undefined;
    };

    Promise.prototype.disposer = function (fn) {
        if (typeof fn === "function") {
            return new FunctionDisposer(fn, this, createContext());
        }
        throw new TypeError();
    };

};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL, debug) {
var util = __webpack_require__(0);
var TimeoutError = Promise.TimeoutError;

function HandleWrapper(handle)  {
    this.handle = handle;
}

HandleWrapper.prototype._resultCancelled = function() {
    clearTimeout(this.handle);
};

var afterValue = function(value) { return delay(+this).thenReturn(value); };
var delay = Promise.delay = function (ms, value) {
    var ret;
    var handle;
    if (value !== undefined) {
        ret = Promise.resolve(value)
                ._then(afterValue, null, null, ms, undefined);
        if (debug.cancellation() && value instanceof Promise) {
            ret._setOnCancel(value);
        }
    } else {
        ret = new Promise(INTERNAL);
        handle = setTimeout(function() { ret._fulfill(); }, +ms);
        if (debug.cancellation()) {
            ret._setOnCancel(new HandleWrapper(handle));
        }
        ret._captureStackTrace();
    }
    ret._setAsyncGuaranteed();
    return ret;
};

Promise.prototype.delay = function (ms) {
    return delay(ms, this);
};

var afterTimeout = function (promise, message, parent) {
    var err;
    if (typeof message !== "string") {
        if (message instanceof Error) {
            err = message;
        } else {
            err = new TimeoutError("operation timed out");
        }
    } else {
        err = new TimeoutError(message);
    }
    util.markAsOriginatingFromRejection(err);
    promise._attachExtraTrace(err);
    promise._reject(err);

    if (parent != null) {
        parent.cancel();
    }
};

function successClear(value) {
    clearTimeout(this.handle);
    return value;
}

function failureClear(reason) {
    clearTimeout(this.handle);
    throw reason;
}

Promise.prototype.timeout = function (ms, message) {
    ms = +ms;
    var ret, parent;

    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
        if (ret.isPending()) {
            afterTimeout(ret, message, parent);
        }
    }, ms));

    if (debug.cancellation()) {
        parent = this.then();
        ret = parent._then(successClear, failureClear,
                            undefined, handleWrapper, undefined);
        ret._setOnCancel(handleWrapper);
    } else {
        ret = this._then(successClear, failureClear,
                            undefined, handleWrapper, undefined);
    }

    return ret;
};

};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise,
                          apiRejection,
                          INTERNAL,
                          tryConvertToPromise,
                          Proxyable,
                          debug) {
var errors = __webpack_require__(2);
var TypeError = errors.TypeError;
var util = __webpack_require__(0);
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
var yieldHandlers = [];

function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
    for (var i = 0; i < yieldHandlers.length; ++i) {
        traceParent._pushContext();
        var result = tryCatch(yieldHandlers[i])(value);
        traceParent._popContext();
        if (result === errorObj) {
            traceParent._pushContext();
            var ret = Promise.reject(errorObj.e);
            traceParent._popContext();
            return ret;
        }
        var maybePromise = tryConvertToPromise(result, traceParent);
        if (maybePromise instanceof Promise) return maybePromise;
    }
    return null;
}

function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
    if (debug.cancellation()) {
        var internal = new Promise(INTERNAL);
        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
        this._promise = internal.lastly(function() {
            return _finallyPromise;
        });
        internal._captureStackTrace();
        internal._setOnCancel(this);
    } else {
        var promise = this._promise = new Promise(INTERNAL);
        promise._captureStackTrace();
    }
    this._stack = stack;
    this._generatorFunction = generatorFunction;
    this._receiver = receiver;
    this._generator = undefined;
    this._yieldHandlers = typeof yieldHandler === "function"
        ? [yieldHandler].concat(yieldHandlers)
        : yieldHandlers;
    this._yieldedPromise = null;
    this._cancellationPhase = false;
}
util.inherits(PromiseSpawn, Proxyable);

PromiseSpawn.prototype._isResolved = function() {
    return this._promise === null;
};

PromiseSpawn.prototype._cleanup = function() {
    this._promise = this._generator = null;
    if (debug.cancellation() && this._finallyPromise !== null) {
        this._finallyPromise._fulfill();
        this._finallyPromise = null;
    }
};

PromiseSpawn.prototype._promiseCancelled = function() {
    if (this._isResolved()) return;
    var implementsReturn = typeof this._generator["return"] !== "undefined";

    var result;
    if (!implementsReturn) {
        var reason = new Promise.CancellationError(
            "generator .return() sentinel");
        Promise.coroutine.returnSentinel = reason;
        this._promise._attachExtraTrace(reason);
        this._promise._pushContext();
        result = tryCatch(this._generator["throw"]).call(this._generator,
                                                         reason);
        this._promise._popContext();
    } else {
        this._promise._pushContext();
        result = tryCatch(this._generator["return"]).call(this._generator,
                                                          undefined);
        this._promise._popContext();
    }
    this._cancellationPhase = true;
    this._yieldedPromise = null;
    this._continue(result);
};

PromiseSpawn.prototype._promiseFulfilled = function(value) {
    this._yieldedPromise = null;
    this._promise._pushContext();
    var result = tryCatch(this._generator.next).call(this._generator, value);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._promiseRejected = function(reason) {
    this._yieldedPromise = null;
    this._promise._attachExtraTrace(reason);
    this._promise._pushContext();
    var result = tryCatch(this._generator["throw"])
        .call(this._generator, reason);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._resultCancelled = function() {
    if (this._yieldedPromise instanceof Promise) {
        var promise = this._yieldedPromise;
        this._yieldedPromise = null;
        promise.cancel();
    }
};

PromiseSpawn.prototype.promise = function () {
    return this._promise;
};

PromiseSpawn.prototype._run = function () {
    this._generator = this._generatorFunction.call(this._receiver);
    this._receiver =
        this._generatorFunction = undefined;
    this._promiseFulfilled(undefined);
};

PromiseSpawn.prototype._continue = function (result) {
    var promise = this._promise;
    if (result === errorObj) {
        this._cleanup();
        if (this._cancellationPhase) {
            return promise.cancel();
        } else {
            return promise._rejectCallback(result.e, false);
        }
    }

    var value = result.value;
    if (result.done === true) {
        this._cleanup();
        if (this._cancellationPhase) {
            return promise.cancel();
        } else {
            return promise._resolveCallback(value);
        }
    } else {
        var maybePromise = tryConvertToPromise(value, this._promise);
        if (!(maybePromise instanceof Promise)) {
            maybePromise =
                promiseFromYieldHandler(maybePromise,
                                        this._yieldHandlers,
                                        this._promise);
            if (maybePromise === null) {
                this._promiseRejected(
                    new TypeError(
                        "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a\u000a".replace("%s", String(value)) +
                        "From coroutine:\u000a" +
                        this._stack.split("\n").slice(1, -7).join("\n")
                    )
                );
                return;
            }
        }
        maybePromise = maybePromise._target();
        var bitField = maybePromise._bitField;
        ;
        if (((bitField & 50397184) === 0)) {
            this._yieldedPromise = maybePromise;
            maybePromise._proxy(this, null);
        } else if (((bitField & 33554432) !== 0)) {
            Promise._async.invoke(
                this._promiseFulfilled, this, maybePromise._value()
            );
        } else if (((bitField & 16777216) !== 0)) {
            Promise._async.invoke(
                this._promiseRejected, this, maybePromise._reason()
            );
        } else {
            this._promiseCancelled();
        }
    }
};

Promise.coroutine = function (generatorFunction, options) {
    if (typeof generatorFunction !== "function") {
        throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var yieldHandler = Object(options).yieldHandler;
    var PromiseSpawn$ = PromiseSpawn;
    var stack = new Error().stack;
    return function () {
        var generator = generatorFunction.apply(this, arguments);
        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
                                      stack);
        var ret = spawn.promise();
        spawn._generator = generator;
        spawn._promiseFulfilled(undefined);
        return ret;
    };
};

Promise.coroutine.addYieldHandler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    yieldHandlers.push(fn);
};

Promise.spawn = function (generatorFunction) {
    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
    if (typeof generatorFunction !== "function") {
        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var spawn = new PromiseSpawn(generatorFunction, this);
    var ret = spawn.promise();
    spawn._run(Promise.spawn);
    return ret;
};
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
var util = __webpack_require__(0);
var async = Promise._async;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function spreadAdapter(val, nodeback) {
    var promise = this;
    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
    var ret =
        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

function successAdapter(val, nodeback) {
    var promise = this;
    var receiver = promise._boundValue();
    var ret = val === undefined
        ? tryCatch(nodeback).call(receiver, null)
        : tryCatch(nodeback).call(receiver, null, val);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}
function errorAdapter(reason, nodeback) {
    var promise = this;
    if (!reason) {
        var newReason = new Error(reason + "");
        newReason.cause = reason;
        reason = newReason;
    }
    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback,
                                                                     options) {
    if (typeof nodeback == "function") {
        var adapter = successAdapter;
        if (options !== undefined && Object(options).spread) {
            adapter = spreadAdapter;
        }
        this._then(
            adapter,
            errorAdapter,
            undefined,
            this,
            nodeback
        );
    }
    return this;
};
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL) {
var THIS = {};
var util = __webpack_require__(0);
var nodebackForPromise = __webpack_require__(23);
var withAppended = util.withAppended;
var maybeWrapAsError = util.maybeWrapAsError;
var canEvaluate = util.canEvaluate;
var TypeError = __webpack_require__(2).TypeError;
var defaultSuffix = "Async";
var defaultPromisified = {__isPromisified__: true};
var noCopyProps = [
    "arity",    "length",
    "name",
    "arguments",
    "caller",
    "callee",
    "prototype",
    "__isPromisified__"
];
var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

var defaultFilter = function(name) {
    return util.isIdentifier(name) &&
        name.charAt(0) !== "_" &&
        name !== "constructor";
};

function propsFilter(key) {
    return !noCopyPropsPattern.test(key);
}

function isPromisified(fn) {
    try {
        return fn.__isPromisified__ === true;
    }
    catch (e) {
        return false;
    }
}

function hasPromisified(obj, key, suffix) {
    var val = util.getDataPropertyOrDefault(obj, key + suffix,
                                            defaultPromisified);
    return val ? isPromisified(val) : false;
}
function checkValid(ret, suffix, suffixRegexp) {
    for (var i = 0; i < ret.length; i += 2) {
        var key = ret[i];
        if (suffixRegexp.test(key)) {
            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
            for (var j = 0; j < ret.length; j += 2) {
                if (ret[j] === keyWithoutAsyncSuffix) {
                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/MqrFmX\u000a"
                        .replace("%s", suffix));
                }
            }
        }
    }
}

function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
    var keys = util.inheritedDataKeys(obj);
    var ret = [];
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var value = obj[key];
        var passesDefaultFilter = filter === defaultFilter
            ? true : defaultFilter(key, value, obj);
        if (typeof value === "function" &&
            !isPromisified(value) &&
            !hasPromisified(obj, key, suffix) &&
            filter(key, value, obj, passesDefaultFilter)) {
            ret.push(key, value);
        }
    }
    checkValid(ret, suffix, suffixRegexp);
    return ret;
}

var escapeIdentRegex = function(str) {
    return str.replace(/([$])/, "\\$");
};

var makeNodePromisifiedEval;
if (true) {
var switchCaseArgumentOrder = function(likelyArgumentCount) {
    var ret = [likelyArgumentCount];
    var min = Math.max(0, likelyArgumentCount - 1 - 3);
    for(var i = likelyArgumentCount - 1; i >= min; --i) {
        ret.push(i);
    }
    for(var i = likelyArgumentCount + 1; i <= 3; ++i) {
        ret.push(i);
    }
    return ret;
};

var argumentSequence = function(argumentCount) {
    return util.filledRange(argumentCount, "_arg", "");
};

var parameterDeclaration = function(parameterCount) {
    return util.filledRange(
        Math.max(parameterCount, 3), "_arg", "");
};

var parameterCount = function(fn) {
    if (typeof fn.length === "number") {
        return Math.max(Math.min(fn.length, 1023 + 1), 0);
    }
    return 0;
};

makeNodePromisifiedEval =
function(callback, receiver, originalName, fn, _, multiArgs) {
    var newParameterCount = Math.max(0, parameterCount(fn) - 1);
    var argumentOrder = switchCaseArgumentOrder(newParameterCount);
    var shouldProxyThis = typeof callback === "string" || receiver === THIS;

    function generateCallForArgumentCount(count) {
        var args = argumentSequence(count).join(", ");
        var comma = count > 0 ? ", " : "";
        var ret;
        if (shouldProxyThis) {
            ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
        } else {
            ret = receiver === undefined
                ? "ret = callback({{args}}, nodeback); break;\n"
                : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
        }
        return ret.replace("{{args}}", args).replace(", ", comma);
    }

    function generateArgumentSwitchCase() {
        var ret = "";
        for (var i = 0; i < argumentOrder.length; ++i) {
            ret += "case " + argumentOrder[i] +":" +
                generateCallForArgumentCount(argumentOrder[i]);
        }

        ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", (shouldProxyThis
                                ? "ret = callback.apply(this, args);\n"
                                : "ret = callback.apply(receiver, args);\n"));
        return ret;
    }

    var getFunctionCode = typeof callback === "string"
                                ? ("this != null ? this['"+callback+"'] : fn")
                                : "fn";
    var body = "'use strict';                                                \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase())
        .replace("[GetFunctionCode]", getFunctionCode);
    body = body.replace("Parameters", parameterDeclaration(newParameterCount));
    return new Function("Promise",
                        "fn",
                        "receiver",
                        "withAppended",
                        "maybeWrapAsError",
                        "nodebackForPromise",
                        "tryCatch",
                        "errorObj",
                        "notEnumerableProp",
                        "INTERNAL",
                        body)(
                    Promise,
                    fn,
                    receiver,
                    withAppended,
                    maybeWrapAsError,
                    nodebackForPromise,
                    util.tryCatch,
                    util.errorObj,
                    util.notEnumerableProp,
                    INTERNAL);
};
}

function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
    var defaultThis = (function() {return this;})();
    var method = callback;
    if (typeof method === "string") {
        callback = fn;
    }
    function promisified() {
        var _receiver = receiver;
        if (receiver === THIS) _receiver = this;
        var promise = new Promise(INTERNAL);
        promise._captureStackTrace();
        var cb = typeof method === "string" && this !== defaultThis
            ? this[method] : callback;
        var fn = nodebackForPromise(promise, multiArgs);
        try {
            cb.apply(_receiver, withAppended(arguments, fn));
        } catch(e) {
            promise._rejectCallback(maybeWrapAsError(e), true, true);
        }
        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
        return promise;
    }
    util.notEnumerableProp(promisified, "__isPromisified__", true);
    return promisified;
}

var makeNodePromisified = canEvaluate
    ? makeNodePromisifiedEval
    : makeNodePromisifiedClosure;

function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
    var methods =
        promisifiableMethods(obj, suffix, suffixRegexp, filter);

    for (var i = 0, len = methods.length; i < len; i+= 2) {
        var key = methods[i];
        var fn = methods[i+1];
        var promisifiedKey = key + suffix;
        if (promisifier === makeNodePromisified) {
            obj[promisifiedKey] =
                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
        } else {
            var promisified = promisifier(fn, function() {
                return makeNodePromisified(key, THIS, key,
                                           fn, suffix, multiArgs);
            });
            util.notEnumerableProp(promisified, "__isPromisified__", true);
            obj[promisifiedKey] = promisified;
        }
    }
    util.toFastProperties(obj);
    return obj;
}

function promisify(callback, receiver, multiArgs) {
    return makeNodePromisified(callback, receiver, undefined,
                                callback, null, multiArgs);
}

Promise.promisify = function (fn, options) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    if (isPromisified(fn)) {
        return fn;
    }
    options = Object(options);
    var receiver = options.context === undefined ? THIS : options.context;
    var multiArgs = !!options.multiArgs;
    var ret = promisify(fn, receiver, multiArgs);
    util.copyDescriptors(fn, ret, propsFilter);
    return ret;
};

Promise.promisifyAll = function (target, options) {
    if (typeof target !== "function" && typeof target !== "object") {
        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    options = Object(options);
    var multiArgs = !!options.multiArgs;
    var suffix = options.suffix;
    if (typeof suffix !== "string") suffix = defaultSuffix;
    var filter = options.filter;
    if (typeof filter !== "function") filter = defaultFilter;
    var promisifier = options.promisifier;
    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

    if (!util.isIdentifier(suffix)) {
        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }

    var keys = util.inheritedDataKeys(target);
    for (var i = 0; i < keys.length; ++i) {
        var value = target[keys[i]];
        if (keys[i] !== "constructor" &&
            util.isClass(value)) {
            promisifyAll(value.prototype, suffix, filter, promisifier,
                multiArgs);
            promisifyAll(value, suffix, filter, promisifier, multiArgs);
        }
    }

    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
};
};



/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(
    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
var util = __webpack_require__(0);
var isObject = util.isObject;
var es5 = __webpack_require__(5);
var Es6Map;
if (typeof Map === "function") Es6Map = Map;

var mapToEntries = (function() {
    var index = 0;
    var size = 0;

    function extractEntry(value, key) {
        this[index] = value;
        this[index + size] = key;
        index++;
    }

    return function mapToEntries(map) {
        size = map.size;
        index = 0;
        var ret = new Array(map.size * 2);
        map.forEach(extractEntry, ret);
        return ret;
    };
})();

var entriesToMap = function(entries) {
    var ret = new Es6Map();
    var length = entries.length / 2 | 0;
    for (var i = 0; i < length; ++i) {
        var key = entries[length + i];
        var value = entries[i];
        ret.set(key, value);
    }
    return ret;
};

function PropertiesPromiseArray(obj) {
    var isMap = false;
    var entries;
    if (Es6Map !== undefined && obj instanceof Es6Map) {
        entries = mapToEntries(obj);
        isMap = true;
    } else {
        var keys = es5.keys(obj);
        var len = keys.length;
        entries = new Array(len * 2);
        for (var i = 0; i < len; ++i) {
            var key = keys[i];
            entries[i] = obj[key];
            entries[i + len] = key;
        }
    }
    this.constructor$(entries);
    this._isMap = isMap;
    this._init$(undefined, isMap ? -6 : -3);
}
util.inherits(PropertiesPromiseArray, PromiseArray);

PropertiesPromiseArray.prototype._init = function () {};

PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        var val;
        if (this._isMap) {
            val = entriesToMap(this._values);
        } else {
            val = {};
            var keyOffset = this.length();
            for (var i = 0, len = this.length(); i < len; ++i) {
                val[this._values[i + keyOffset]] = this._values[i];
            }
        }
        this._resolve(val);
        return true;
    }
    return false;
};

PropertiesPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

PropertiesPromiseArray.prototype.getActualLength = function (len) {
    return len >> 1;
};

function props(promises) {
    var ret;
    var castValue = tryConvertToPromise(promises);

    if (!isObject(castValue)) {
        return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    } else if (castValue instanceof Promise) {
        ret = castValue._then(
            Promise.props, undefined, undefined, undefined, undefined);
    } else {
        ret = new PropertiesPromiseArray(castValue).promise();
    }

    if (castValue instanceof Promise) {
        ret._propagateFrom(castValue, 2);
    }
    return ret;
}

Promise.prototype.props = function () {
    return props(this);
};

Promise.props = function (promises) {
    return props(promises);
};
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(
    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
var util = __webpack_require__(0);

var raceLater = function (promise) {
    return promise.then(function(array) {
        return race(array, promise);
    });
};

function race(promises, parent) {
    var maybePromise = tryConvertToPromise(promises);

    if (maybePromise instanceof Promise) {
        return raceLater(maybePromise);
    } else {
        promises = util.asArray(promises);
        if (promises === null)
            return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
    }

    var ret = new Promise(INTERNAL);
    if (parent !== undefined) {
        ret._propagateFrom(parent, 3);
    }
    var fulfill = ret._fulfill;
    var reject = ret._reject;
    for (var i = 0, len = promises.length; i < len; ++i) {
        var val = promises[i];

        if (val === undefined && !(i in promises)) {
            continue;
        }

        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
    }
    return ret;
}

Promise.race = function (promises) {
    return race(promises, undefined);
};

Promise.prototype.race = function () {
    return race(this, undefined);
};

};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL,
                          debug) {
var getDomain = Promise._getDomain;
var util = __webpack_require__(0);
var tryCatch = util.tryCatch;

function ReductionPromiseArray(promises, fn, initialValue, _each) {
    this.constructor$(promises);
    var domain = getDomain();
    this._fn = domain === null ? fn : util.domainBind(domain, fn);
    if (initialValue !== undefined) {
        initialValue = Promise.resolve(initialValue);
        initialValue._attachCancellationCallback(this);
    }
    this._initialValue = initialValue;
    this._currentCancellable = null;
    if(_each === INTERNAL) {
        this._eachValues = Array(this._length);
    } else if (_each === 0) {
        this._eachValues = null;
    } else {
        this._eachValues = undefined;
    }
    this._promise._captureStackTrace();
    this._init$(undefined, -5);
}
util.inherits(ReductionPromiseArray, PromiseArray);

ReductionPromiseArray.prototype._gotAccum = function(accum) {
    if (this._eachValues !== undefined && 
        this._eachValues !== null && 
        accum !== INTERNAL) {
        this._eachValues.push(accum);
    }
};

ReductionPromiseArray.prototype._eachComplete = function(value) {
    if (this._eachValues !== null) {
        this._eachValues.push(value);
    }
    return this._eachValues;
};

ReductionPromiseArray.prototype._init = function() {};

ReductionPromiseArray.prototype._resolveEmptyArray = function() {
    this._resolve(this._eachValues !== undefined ? this._eachValues
                                                 : this._initialValue);
};

ReductionPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

ReductionPromiseArray.prototype._resolve = function(value) {
    this._promise._resolveCallback(value);
    this._values = null;
};

ReductionPromiseArray.prototype._resultCancelled = function(sender) {
    if (sender === this._initialValue) return this._cancel();
    if (this._isResolved()) return;
    this._resultCancelled$();
    if (this._currentCancellable instanceof Promise) {
        this._currentCancellable.cancel();
    }
    if (this._initialValue instanceof Promise) {
        this._initialValue.cancel();
    }
};

ReductionPromiseArray.prototype._iterate = function (values) {
    this._values = values;
    var value;
    var i;
    var length = values.length;
    if (this._initialValue !== undefined) {
        value = this._initialValue;
        i = 0;
    } else {
        value = Promise.resolve(values[0]);
        i = 1;
    }

    this._currentCancellable = value;

    if (!value.isRejected()) {
        for (; i < length; ++i) {
            var ctx = {
                accum: null,
                value: values[i],
                index: i,
                length: length,
                array: this
            };
            value = value._then(gotAccum, undefined, undefined, ctx, undefined);
        }
    }

    if (this._eachValues !== undefined) {
        value = value
            ._then(this._eachComplete, undefined, undefined, this, undefined);
    }
    value._then(completed, completed, undefined, value, this);
};

Promise.prototype.reduce = function (fn, initialValue) {
    return reduce(this, fn, initialValue, null);
};

Promise.reduce = function (promises, fn, initialValue, _each) {
    return reduce(promises, fn, initialValue, _each);
};

function completed(valueOrReason, array) {
    if (this.isFulfilled()) {
        array._resolve(valueOrReason);
    } else {
        array._reject(valueOrReason);
    }
}

function reduce(promises, fn, initialValue, _each) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
    return array.promise();
}

function gotAccum(accum) {
    this.accum = accum;
    this.array._gotAccum(accum);
    var value = tryConvertToPromise(this.value, this.array._promise);
    if (value instanceof Promise) {
        this.array._currentCancellable = value;
        return value._then(gotValue, undefined, undefined, this, undefined);
    } else {
        return gotValue.call(this, value);
    }
}

function gotValue(value) {
    var array = this.array;
    var promise = array._promise;
    var fn = tryCatch(array._fn);
    promise._pushContext();
    var ret;
    if (array._eachValues !== undefined) {
        ret = fn.call(promise._boundValue(), value, this.index, this.length);
    } else {
        ret = fn.call(promise._boundValue(),
                              this.accum, value, this.index, this.length);
    }
    if (ret instanceof Promise) {
        array._currentCancellable = ret;
    }
    var promiseCreated = promise._popContext();
    debug.checkForgottenReturns(
        ret,
        promiseCreated,
        array._eachValues !== undefined ? "Promise.each" : "Promise.reduce",
        promise
    );
    return ret;
}
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports =
    function(Promise, PromiseArray, debug) {
var PromiseInspection = Promise.PromiseInspection;
var util = __webpack_require__(0);

function SettledPromiseArray(values) {
    this.constructor$(values);
}
util.inherits(SettledPromiseArray, PromiseArray);

SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
    this._values[index] = inspection;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
    }
    return false;
};

SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var ret = new PromiseInspection();
    ret._bitField = 33554432;
    ret._settledValueField = value;
    return this._promiseResolved(index, ret);
};
SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
    var ret = new PromiseInspection();
    ret._bitField = 16777216;
    ret._settledValueField = reason;
    return this._promiseResolved(index, ret);
};

Promise.settle = function (promises) {
    debug.deprecated(".settle()", ".reflect()");
    return new SettledPromiseArray(promises).promise();
};

Promise.prototype.settle = function () {
    return Promise.settle(this);
};
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports =
function(Promise, PromiseArray, apiRejection) {
var util = __webpack_require__(0);
var RangeError = __webpack_require__(2).RangeError;
var AggregateError = __webpack_require__(2).AggregateError;
var isArray = util.isArray;
var CANCELLATION = {};


function SomePromiseArray(values) {
    this.constructor$(values);
    this._howMany = 0;
    this._unwrap = false;
    this._initialized = false;
}
util.inherits(SomePromiseArray, PromiseArray);

SomePromiseArray.prototype._init = function () {
    if (!this._initialized) {
        return;
    }
    if (this._howMany === 0) {
        this._resolve([]);
        return;
    }
    this._init$(undefined, -5);
    var isArrayResolved = isArray(this._values);
    if (!this._isResolved() &&
        isArrayResolved &&
        this._howMany > this._canPossiblyFulfill()) {
        this._reject(this._getRangeError(this.length()));
    }
};

SomePromiseArray.prototype.init = function () {
    this._initialized = true;
    this._init();
};

SomePromiseArray.prototype.setUnwrap = function () {
    this._unwrap = true;
};

SomePromiseArray.prototype.howMany = function () {
    return this._howMany;
};

SomePromiseArray.prototype.setHowMany = function (count) {
    this._howMany = count;
};

SomePromiseArray.prototype._promiseFulfilled = function (value) {
    this._addFulfilled(value);
    if (this._fulfilled() === this.howMany()) {
        this._values.length = this.howMany();
        if (this.howMany() === 1 && this._unwrap) {
            this._resolve(this._values[0]);
        } else {
            this._resolve(this._values);
        }
        return true;
    }
    return false;

};
SomePromiseArray.prototype._promiseRejected = function (reason) {
    this._addRejected(reason);
    return this._checkOutcome();
};

SomePromiseArray.prototype._promiseCancelled = function () {
    if (this._values instanceof Promise || this._values == null) {
        return this._cancel();
    }
    this._addRejected(CANCELLATION);
    return this._checkOutcome();
};

SomePromiseArray.prototype._checkOutcome = function() {
    if (this.howMany() > this._canPossiblyFulfill()) {
        var e = new AggregateError();
        for (var i = this.length(); i < this._values.length; ++i) {
            if (this._values[i] !== CANCELLATION) {
                e.push(this._values[i]);
            }
        }
        if (e.length > 0) {
            this._reject(e);
        } else {
            this._cancel();
        }
        return true;
    }
    return false;
};

SomePromiseArray.prototype._fulfilled = function () {
    return this._totalResolved;
};

SomePromiseArray.prototype._rejected = function () {
    return this._values.length - this.length();
};

SomePromiseArray.prototype._addRejected = function (reason) {
    this._values.push(reason);
};

SomePromiseArray.prototype._addFulfilled = function (value) {
    this._values[this._totalResolved++] = value;
};

SomePromiseArray.prototype._canPossiblyFulfill = function () {
    return this.length() - this._rejected();
};

SomePromiseArray.prototype._getRangeError = function (count) {
    var message = "Input array must contain at least " +
            this._howMany + " items but contains only " + count + " items";
    return new RangeError(message);
};

SomePromiseArray.prototype._resolveEmptyArray = function () {
    this._reject(this._getRangeError(0));
};

function some(promises, howMany) {
    if ((howMany | 0) !== howMany || howMany < 0) {
        return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(howMany);
    ret.init();
    return promise;
}

Promise.some = function (promises, howMany) {
    return some(promises, howMany);
};

Promise.prototype.some = function (howMany) {
    return some(this, howMany);
};

Promise._SomePromiseArray = SomePromiseArray;
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL) {
var PromiseMap = Promise.map;

Promise.prototype.filter = function (fn, options) {
    return PromiseMap(this, fn, options, INTERNAL);
};

Promise.filter = function (promises, fn, options) {
    return PromiseMap(promises, fn, options, INTERNAL);
};
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL) {
var PromiseReduce = Promise.reduce;
var PromiseAll = Promise.all;

function promiseAllThis() {
    return PromiseAll(this);
}

function PromiseMapSeries(promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
}

Promise.prototype.each = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, 0)
              ._then(promiseAllThis, undefined, undefined, this, undefined);
};

Promise.prototype.mapSeries = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
};

Promise.each = function (promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, 0)
              ._then(promiseAllThis, undefined, undefined, promises, undefined);
};

Promise.mapSeries = PromiseMapSeries;
};



/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
var SomePromiseArray = Promise._SomePromiseArray;
function any(promises) {
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(1);
    ret.setUnwrap();
    ret.init();
    return promise;
}

Promise.any = function (promises) {
    return any(promises);
};

Promise.prototype.any = function () {
    return any(this);
};

};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//
//
//



/*
The channel (promise) and callback APIs have similar signatures, and
in particular, both need AMQP fields prepared from the same arguments
and options. The arguments marshalling is done here. Each of the
procedures below takes arguments and options (the latter in an object)
particular to the operation it represents, and returns an object with
fields for handing to the encoder.
*/

// A number of AMQP methods have a table-typed field called
// `arguments`, that is intended to carry extension-specific
// values. RabbitMQ uses this in a number of places; e.g., to specify
// an 'alternate exchange'.
//
// Many of the methods in this API have an `options` argument, from
// which I take both values that have a default in AMQP (e.g.,
// autoDelete in QueueDeclare) *and* values that are specific to
// RabbitMQ (e.g., 'alternate-exchange'), which would normally be
// supplied in `arguments`. So that extensions I don't support yet can
// be used, I include `arguments` itself among the options.
//
// The upshot of this is that I often need to prepare an `arguments`
// value that has any values passed in `options.arguments` as well as
// any I've promoted to being options themselves. Since I don't want
// to mutate anything passed in, the general pattern is to create a
// fresh object with the `arguments` value given as its prototype; all
// fields in the supplied value will be serialised, as well as any I
// set on the fresh object. What I don't want to do, however, is set a
// field to undefined by copying possibly missing field values,
// because that will mask a value in the prototype.
//
// NB the `arguments` field already has a default value of `{}`, so
// there's no need to explicitly default it unless I'm setting values.
function setIfDefined(obj, prop, value) {
  if (value != undefined) obj[prop] = value;
}

var EMPTY_OPTIONS = Object.freeze({});

var Args = {};

Args.assertQueue = function(queue, options) {
  queue = queue || '';
  options = options || EMPTY_OPTIONS;

  var argt = Object.create(options.arguments || null);
  setIfDefined(argt, 'x-expires', options.expires);
  setIfDefined(argt, 'x-message-ttl', options.messageTtl);
  setIfDefined(argt, 'x-dead-letter-exchange',
               options.deadLetterExchange);
  setIfDefined(argt, 'x-dead-letter-routing-key',
               options.deadLetterRoutingKey);
  setIfDefined(argt, 'x-max-length', options.maxLength);
  setIfDefined(argt, 'x-max-priority', options.maxPriority);

  return {
    queue: queue,
    exclusive: !!options.exclusive,
    durable: (options.durable === undefined) ? true : options.durable,
    autoDelete: !!options.autoDelete,
    arguments: argt,
    passive: false,
    // deprecated but we have to include it
    ticket: 0,
    nowait: false
  };
};

Args.checkQueue = function(queue) {
  return {
    queue: queue,
    passive: true, // switch to "completely different" mode
    nowait: false,
    durable: true, autoDelete: false, exclusive: false, // ignored
    ticket: 0,
  };
};

Args.deleteQueue = function(queue, options) {
  options = options || EMPTY_OPTIONS;
  return {
    queue: queue,
    ifUnused: !!options.ifUnused,
    ifEmpty: !!options.ifEmpty,
    ticket: 0, nowait: false
  };
};

Args.purgeQueue = function(queue) {
  return {
    queue: queue,
    ticket: 0, nowait: false
  };
};

Args.bindQueue = function(queue, source, pattern, argt) {
  return {
    queue: queue,
    exchange: source,
    routingKey: pattern,
    arguments: argt,
    ticket: 0, nowait: false
  };
};

Args.unbindQueue = function(queue, source, pattern, argt) {
  return {
    queue: queue,
    exchange: source,
    routingKey: pattern,
    arguments: argt,
    ticket: 0, nowait: false
  };
};

Args.assertExchange = function(exchange, type, options) {
  options = options || EMPTY_OPTIONS;
  var argt = Object.create(options.arguments || null);
  setIfDefined(argt, 'alternate-exchange', options.alternateExchange);
  return {
    exchange: exchange,
    ticket: 0,
    type: type,
    passive: false,
    durable: (options.durable === undefined) ? true : options.durable,
    autoDelete: !!options.autoDelete,
    internal: !!options.internal,
    nowait: false,
    arguments: argt
  };
};

Args.checkExchange = function(exchange) {
  return {
    exchange: exchange,
    passive: true, // switch to 'may as well be another method' mode
    nowait: false,
    // ff are ignored
    durable: true, internal: false,  type: '',  autoDelete: false,
    ticket: 0
  };
};

Args.deleteExchange = function(exchange, options) {
  options = options || EMPTY_OPTIONS;
  return {
    exchange: exchange,
    ifUnused: !!options.ifUnused,
    ticket: 0, nowait: false
  };
};

Args.bindExchange = function(dest, source, pattern, argt) {
  return {
    source: source,
    destination: dest,
    routingKey: pattern,
    arguments: argt,
    ticket: 0, nowait: false
  };
};

Args.unbindExchange = function(dest, source, pattern, argt) {
  return {
    source: source,
    destination: dest,
    routingKey: pattern,
    arguments: argt,
    ticket: 0, nowait: false
  };
};

// It's convenient to construct the properties and the method fields
// at the same time, since in the APIs, values for both can appear in
// `options`. Since the property or mthod field names don't overlap, I
// just return one big object that can be used for both purposes, and
// the encoder will pick out what it wants.
Args.publish = function(exchange, routingKey, options) {
  options = options || EMPTY_OPTIONS;

  // The CC and BCC fields expect an array of "longstr", which would
  // normally be buffer values in JavaScript; however, since a field
  // array (or table) cannot have shortstr values, the codec will
  // encode all strings as longstrs anyway.
  function convertCC(cc) {
    if (cc === undefined) {
      return undefined;
    }
    else if (Array.isArray(cc)) {
      return cc.map(String);
    }
    else return [String(cc)];
  }

  var headers = Object.create(options.headers || null);
  setIfDefined(headers, 'CC', convertCC(options.CC));
  setIfDefined(headers, 'BCC', convertCC(options.BCC));

  var deliveryMode; // undefined will default to 1 (non-persistent)

  // Previously I overloaded deliveryMode be a boolean meaning
  // 'persistent or not'; better is to name this option for what it
  // is, but I need to have backwards compatibility for applications
  // that either supply a numeric or boolean value.
  if (options.persistent !== undefined)
    deliveryMode = (options.persistent) ? 2 : 1;
  else if (typeof options.deliveryMode === 'number')
    deliveryMode = options.deliveryMode;
  else if (options.deliveryMode) // is supplied and truthy
    deliveryMode = 2;

  var expiration = options.expiration;
  if (expiration !== undefined) expiration = expiration.toString();

  return {
    // method fields
    exchange: exchange,
    routingKey: routingKey,
    mandatory: !!options.mandatory,
    immediate: false, // RabbitMQ doesn't implement this any more
    ticket: undefined,
    // properties
    contentType: options.contentType,
    contentEncoding: options.contentEncoding,
    headers: headers,
    deliveryMode: deliveryMode,
    priority: options.priority,
    correlationId: options.correlationId,
    replyTo: options.replyTo,
    expiration: expiration,
    messageId: options.messageId,
    timestamp: options.timestamp,
    type: options.type,
    userId: options.userId,
    appId: options.appId,
    clusterId: undefined
  };
};

Args.consume = function(queue, options) {
  options = options || EMPTY_OPTIONS;
  var argt = Object.create(options.arguments || null);
  setIfDefined(argt, 'x-priority', options.priority);
  return {
    ticket: 0,
    queue: queue,
    consumerTag: options.consumerTag || '',
    noLocal: !!options.noLocal,
    noAck: !!options.noAck,
    exclusive: !!options.exclusive,
    nowait: false,
    arguments: argt
  };
};

Args.cancel = function(consumerTag) {
  return {
    consumerTag: consumerTag,
    nowait: false
  };
};

Args.get = function(queue, options) {
  options = options || EMPTY_OPTIONS;
  return {
    ticket: 0,
    queue: queue,
    noAck: !!options.noAck
  };
};

Args.ack = function(tag, allUpTo) {
  return {
    deliveryTag: tag,
    multiple: !!allUpTo
  };
};

Args.nack = function(tag, allUpTo, requeue) {
  return {
    deliveryTag: tag,
    multiple: !!allUpTo,
    requeue: (requeue === undefined) ? true : requeue
  };
};

Args.reject = function(tag, requeue) {
  return {
    deliveryTag: tag,
    requeue: (requeue === undefined) ? true : requeue
  };
};

Args.prefetch = function(count, global) {
  return {
    prefetchCount: count || 0,
    prefetchSize: 0,
    global: !!global
  };
};

Args.recover = function() {
  return {requeue: true};
};

module.exports = Object.freeze(Args);


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var getEnv = function getEnv() {
    return {
        exchange: process.env.RABBIT_EXCHANGE,
        queue: process.env.RABBIT_INTENT_NONE_QUEUE,
        binding: process.env.RABBIT_INTENT_NONE_BINDING,
        apiKey: process.env.RABBIT_INTENT_API_BINDING
    };
};

var assertQueue = exports.assertQueue = function assertQueue(connexion, callback) {

    var env = getEnv();
    connexion.then(function (conn) {
        conn.createChannel(function (err, ch) {
            ch.assertExchange(env.exchange, 'topic', { durable: true });
            ch.assertQueue(env.queue, { durable: false }, function (err, q) {
                console.log(' [*] Waiting for logs. To exit press CTRL+C');

                ch.bindQueue(q.queue, env.exchange, env.binding);
                ch.consume(q.queue, function (msg) {
                    callback(JSON.parse(msg.content.toString()));
                }, { noAck: true });
            });
        });
    });
};

var sendTo = exports.sendTo = function sendTo(connexion, message) {

    var env = getEnv();
    connexion.then(function (conn) {
        conn.createChannel(function (err, ch) {
            ch.assertExchange(env.exchange, 'topic', { durable: true });
            ch.publish(env.exchange, env.apiKey, new Buffer(message));
            console.log(' [x] Sent %s:\'%s\'', env.apiKey, message);
        });
    });
};

/***/ })
/******/ ]);