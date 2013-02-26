var hasOwn = Object.prototype.hasOwnProperty;

function mirrorProperties(target, source) {
  for (var prop in source) {
    if (!hasOwn.call(target, prop)) {
      target[prop] = source[prop];
    }
  }
}

function isFunction(obj) {
  return typeof obj === "function" || !!(obj && obj.constructor && obj.call && obj.apply);
}

function extend(target) {
  for (var i = 1, l = arguments.length; i < l; i += 1) {
    for (var prop in arguments[i]) {
      if (arguments[i].hasOwnProperty(prop)) {
        target[prop] = arguments[i][prop];
      }

      // DONT ENUM bug, only care about toString
      if (arguments[i].hasOwnProperty("toString") &&
        arguments[i].toString != target.toString) {
        target.toString = arguments[i].toString;
      }
    }
  }

  return target;
}

function functionToString() {
  if (this.getCall && this.callCount) {
    var thisValue, prop, i = this.callCount;

    while (i--) {
      thisValue = this.getCall(i).thisValue;

      for (prop in thisValue) {
        if (thisValue[prop] === this) {
          return prop;
        }
      }
    }
  }

  return this.displayName || "sinon fake";
}

function functionName(func) {
  var name = func.displayName || func.name;

  // Use function decomposition as a last resort to get function
  // name. Does not rely on function decomposition to work - if it
  // doesn't debugging will be slightly less informative
  // (i.e. toString will say 'transparent' rather than 'myFunc').
  if (!name) {
    var matches = func.toString().match(/function ([^\s\(]+)/);
    name = matches && matches[1];
  }

  return name;
}

var vars = "a,b,c,d,e,f,g,h,i,j,k,l";
function createProxy(func) {
  // Retain the function length:
  var p;
  if (func.length) {
    eval("p = (function proxy(" + vars.substring(0, func.length * 2 - 1) + ") { return func.apply(this, [].slice.call(arguments)); });");
  }
  else {
    p = function proxy() {
      return func.apply(this, [].slice.call(arguments));
    };
  }
  return p;
}

function wrapMethod(object, property, method) {
  if (!object) {
    throw new TypeError("Should wrap property of object");
  }

  if (typeof method !== "function") {
    throw new TypeError("Method wrapper should be function");
  }

  var wrappedMethod = object[property];

  if (!isFunction(wrappedMethod)) {
    throw new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +
              property + " as function");
  }

  if (wrappedMethod.restore && wrappedMethod.restore.__transparent__) {
    throw new TypeError("Attempted to wrap " + property + " which is already wrapped");
  }

  // IE 8 does not support hasOwnProperty on the window object.
  var owned = hasOwn.call(object, property);
  object[property] = method;
  method.displayName = property;

  method.restore = function () {
    // For prototype properties try to reset by delete first.
    // If this fails (ex: localStorage on mobile safari) then force a reset
    // via direct assignment.
    if (!owned) {
      delete object[property];
    }
    if (object[property] === method) {
      object[property] = wrappedMethod;
    }
  };

  method.restore.__transparent__ = true;
  mirrorProperties(method, wrappedMethod);

  return method;
}

var uuid = 0;
function makeTransparent(func) {
  var name;

  if (typeof func != "function") {
    func = function () { };
  } else {
    name = functionName(func);
  }

  var proxy = createProxy(func);
  extend(proxy, func);

  proxy.prototype = func.prototype;
  proxy.displayName = name || "tranparent";
  proxy.toString = functionToString;
  proxy.id = "tranparent#" + uuid++;

  return proxy;
}

function tranparentWrap(object, property) {
  if (!property && typeof object == "function") {
    return makeTransparent(object);
  }

  if (!object && !property) {
    return makeTransparent(function () { });
  }

  var method = object[property];
  return wrapMethod(object, property, makeTransparent(method));
}

exports.proxy = tranparentWrap;



