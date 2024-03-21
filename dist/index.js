var Fe = (r, e, t) => {
  if (!e.has(r))
    throw TypeError("Cannot " + t);
};
var g = (r, e, t) => (Fe(r, e, "read from private field"), t ? t.call(r) : e.get(r)), V = (r, e, t) => {
  if (e.has(r))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(r) : e.set(r, t);
}, ie = (r, e, t, n) => (Fe(r, e, "write to private field"), n ? n.call(r, t) : e.set(r, t), t);
var nr = (r, e, t) => (Fe(r, e, "access private method"), t);
const Yr = (r) => typeof r == "string" || r instanceof String, Re = (r) => r == null ? !0 : (Yr(r) || (r = String(r)), r.trim().length === 0), fe = (r) => r.replace(/\/+$/, "");
var q, F, R;
class Xr {
  constructor(e, t, n) {
    V(this, q, void 0);
    V(this, F, void 0);
    V(this, R, void 0);
    ie(this, q, e), ie(this, F, t), ie(this, R, n);
  }
  /**
   * Retruns the route's origin
   */
  get origin() {
    if (!Re(g(this, F).domain)) {
      const t = g(this, R).base.match(/^(http|https):\/\//);
      return fe(((t == null ? void 0 : t[0]) ?? "") + g(this, F).domain);
    }
    return g(this, R).config.absolute ? fe(g(this, R).origin) : "";
  }
  /**
   * Retruns the route's template
   */
  get template() {
    const e = fe(`${this.origin}/${g(this, F).uri}`);
    return Re(e) ? "/" : e;
  }
  /**
   * Retruns the route's template expected parameters
   */
  get expects() {
    const e = {}, t = this.template.match(/{\w+\??}/g) ?? [];
    for (const n of t) {
      const a = n.replace(/\W/g, "");
      e[a] = n.includes("?") || (e[a] ?? !1);
    }
    return e;
  }
  /**
   * Return the compiled URI for this route, along with an array of substituted tokens.
   */
  compile(e) {
    var a;
    const t = new Array();
    if (Object.keys(this.expects).length < 1)
      return { substituted: t, template: this.template };
    let n = this.template;
    for (const o of Object.keys(this.expects)) {
      const i = this.expects[o], f = (e == null ? void 0 : e[o]) ?? ((a = g(this, R).config.defaults) == null ? void 0 : a[o]) ?? "";
      if (!i) {
        if (Re(f))
          throw new Error(
            `Missing required parameter "${o}" for route "${g(this, q)}"`
          );
        if (Object.hasOwn(g(this, F).wheres, o)) {
          const l = g(this, F).wheres[o];
          if (!new RegExp(`^${l}$`).test(f))
            throw new Error(
              `Parameter "${o}" for route "${g(this, q)}" does not match format "${l}"`
            );
        }
      }
      const u = new RegExp(`{${o}\\??}`, "g");
      if (u.test(n)) {
        const l = encodeURIComponent(f);
        if (n = fe(n.replace(u, l)), t.push(o), /\/|%2F/g.test(l)) {
          const c = `Character "/" or sequence "%2F" in parameter "${o}" for route "${g(this, q)}" might cause routing issues.`;
          if (g(this, R).config.strict)
            throw new Error(
              c + `
	An error was thrown because you enabled strict mode.
`
            );
        }
      }
    }
    return { substituted: t, template: n };
  }
}
q = new WeakMap(), F = new WeakMap(), R = new WeakMap();
var Zr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function et(r) {
  if (r.__esModule)
    return r;
  var e = r.default;
  if (typeof e == "function") {
    var t = function n() {
      return this instanceof n ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else
    t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(r).forEach(function(n) {
    var a = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(t, n, a.get ? a : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), t;
}
var rt = Error, tt = EvalError, nt = RangeError, ot = ReferenceError, xr = SyntaxError, ye = TypeError, at = URIError, it = function() {
  if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
    return !1;
  if (typeof Symbol.iterator == "symbol")
    return !0;
  var e = {}, t = Symbol("test"), n = Object(t);
  if (typeof t == "string" || Object.prototype.toString.call(t) !== "[object Symbol]" || Object.prototype.toString.call(n) !== "[object Symbol]")
    return !1;
  var a = 42;
  e[t] = a;
  for (t in e)
    return !1;
  if (typeof Object.keys == "function" && Object.keys(e).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(e).length !== 0)
    return !1;
  var o = Object.getOwnPropertySymbols(e);
  if (o.length !== 1 || o[0] !== t || !Object.prototype.propertyIsEnumerable.call(e, t))
    return !1;
  if (typeof Object.getOwnPropertyDescriptor == "function") {
    var i = Object.getOwnPropertyDescriptor(e, t);
    if (i.value !== a || i.enumerable !== !0)
      return !1;
  }
  return !0;
}, or = typeof Symbol < "u" && Symbol, lt = it, ft = function() {
  return typeof or != "function" || typeof Symbol != "function" || typeof or("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : lt();
}, De = {
  __proto__: null,
  foo: {}
}, ut = Object, ct = function() {
  return { __proto__: De }.foo === De.foo && !(De instanceof ut);
}, pt = "Function.prototype.bind called on incompatible ", yt = Object.prototype.toString, st = Math.max, dt = "[object Function]", ar = function(e, t) {
  for (var n = [], a = 0; a < e.length; a += 1)
    n[a] = e[a];
  for (var o = 0; o < t.length; o += 1)
    n[o + e.length] = t[o];
  return n;
}, vt = function(e, t) {
  for (var n = [], a = t || 0, o = 0; a < e.length; a += 1, o += 1)
    n[o] = e[a];
  return n;
}, ht = function(r, e) {
  for (var t = "", n = 0; n < r.length; n += 1)
    t += r[n], n + 1 < r.length && (t += e);
  return t;
}, gt = function(e) {
  var t = this;
  if (typeof t != "function" || yt.apply(t) !== dt)
    throw new TypeError(pt + t);
  for (var n = vt(arguments, 1), a, o = function() {
    if (this instanceof a) {
      var c = t.apply(
        this,
        ar(n, arguments)
      );
      return Object(c) === c ? c : this;
    }
    return t.apply(
      e,
      ar(n, arguments)
    );
  }, i = st(0, t.length - n.length), f = [], u = 0; u < i; u++)
    f[u] = "$" + u;
  if (a = Function("binder", "return function (" + ht(f, ",") + "){ return binder.apply(this,arguments); }")(o), t.prototype) {
    var l = function() {
    };
    l.prototype = t.prototype, a.prototype = new l(), l.prototype = null;
  }
  return a;
}, mt = gt, Je = Function.prototype.bind || mt, bt = Function.prototype.call, St = Object.prototype.hasOwnProperty, wt = Je, At = wt.call(bt, St), p, Et = rt, Ot = tt, Pt = nt, $t = ot, Z = xr, X = ye, It = at, Fr = Function, _e = function(r) {
  try {
    return Fr('"use strict"; return (' + r + ").constructor;")();
  } catch {
  }
}, z = Object.getOwnPropertyDescriptor;
if (z)
  try {
    z({}, "");
  } catch {
    z = null;
  }
var Ne = function() {
  throw new X();
}, xt = z ? function() {
  try {
    return arguments.callee, Ne;
  } catch {
    try {
      return z(arguments, "callee").get;
    } catch {
      return Ne;
    }
  }
}() : Ne, J = ft(), Ft = ct(), S = Object.getPrototypeOf || (Ft ? function(r) {
  return r.__proto__;
} : null), Y = {}, Rt = typeof Uint8Array > "u" || !S ? p : S(Uint8Array), K = {
  __proto__: null,
  "%AggregateError%": typeof AggregateError > "u" ? p : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? p : ArrayBuffer,
  "%ArrayIteratorPrototype%": J && S ? S([][Symbol.iterator]()) : p,
  "%AsyncFromSyncIteratorPrototype%": p,
  "%AsyncFunction%": Y,
  "%AsyncGenerator%": Y,
  "%AsyncGeneratorFunction%": Y,
  "%AsyncIteratorPrototype%": Y,
  "%Atomics%": typeof Atomics > "u" ? p : Atomics,
  "%BigInt%": typeof BigInt > "u" ? p : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? p : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? p : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? p : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Et,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": Ot,
  "%Float32Array%": typeof Float32Array > "u" ? p : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? p : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? p : FinalizationRegistry,
  "%Function%": Fr,
  "%GeneratorFunction%": Y,
  "%Int8Array%": typeof Int8Array > "u" ? p : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? p : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? p : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": J && S ? S(S([][Symbol.iterator]())) : p,
  "%JSON%": typeof JSON == "object" ? JSON : p,
  "%Map%": typeof Map > "u" ? p : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !J || !S ? p : S((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? p : Promise,
  "%Proxy%": typeof Proxy > "u" ? p : Proxy,
  "%RangeError%": Pt,
  "%ReferenceError%": $t,
  "%Reflect%": typeof Reflect > "u" ? p : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? p : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !J || !S ? p : S((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? p : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": J && S ? S(""[Symbol.iterator]()) : p,
  "%Symbol%": J ? Symbol : p,
  "%SyntaxError%": Z,
  "%ThrowTypeError%": xt,
  "%TypedArray%": Rt,
  "%TypeError%": X,
  "%Uint8Array%": typeof Uint8Array > "u" ? p : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? p : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? p : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? p : Uint32Array,
  "%URIError%": It,
  "%WeakMap%": typeof WeakMap > "u" ? p : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? p : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? p : WeakSet
};
if (S)
  try {
    null.error;
  } catch (r) {
    var Dt = S(S(r));
    K["%Error.prototype%"] = Dt;
  }
var _t = function r(e) {
  var t;
  if (e === "%AsyncFunction%")
    t = _e("async function () {}");
  else if (e === "%GeneratorFunction%")
    t = _e("function* () {}");
  else if (e === "%AsyncGeneratorFunction%")
    t = _e("async function* () {}");
  else if (e === "%AsyncGenerator%") {
    var n = r("%AsyncGeneratorFunction%");
    n && (t = n.prototype);
  } else if (e === "%AsyncIteratorPrototype%") {
    var a = r("%AsyncGenerator%");
    a && S && (t = S(a.prototype));
  }
  return K[e] = t, t;
}, ir = {
  __proto__: null,
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
}, se = Je, we = At, Nt = se.call(Function.call, Array.prototype.concat), Tt = se.call(Function.apply, Array.prototype.splice), lr = se.call(Function.call, String.prototype.replace), Ae = se.call(Function.call, String.prototype.slice), Mt = se.call(Function.call, RegExp.prototype.exec), Bt = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, Ct = /\\(\\)?/g, Ut = function(e) {
  var t = Ae(e, 0, 1), n = Ae(e, -1);
  if (t === "%" && n !== "%")
    throw new Z("invalid intrinsic syntax, expected closing `%`");
  if (n === "%" && t !== "%")
    throw new Z("invalid intrinsic syntax, expected opening `%`");
  var a = [];
  return lr(e, Bt, function(o, i, f, u) {
    a[a.length] = f ? lr(u, Ct, "$1") : i || o;
  }), a;
}, Wt = function(e, t) {
  var n = e, a;
  if (we(ir, n) && (a = ir[n], n = "%" + a[0] + "%"), we(K, n)) {
    var o = K[n];
    if (o === Y && (o = _t(n)), typeof o > "u" && !t)
      throw new X("intrinsic " + e + " exists, but is not available. Please file an issue!");
    return {
      alias: a,
      name: n,
      value: o
    };
  }
  throw new Z("intrinsic " + e + " does not exist!");
}, te = function(e, t) {
  if (typeof e != "string" || e.length === 0)
    throw new X("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof t != "boolean")
    throw new X('"allowMissing" argument must be a boolean');
  if (Mt(/^%?[^%]*%?$/, e) === null)
    throw new Z("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var n = Ut(e), a = n.length > 0 ? n[0] : "", o = Wt("%" + a + "%", t), i = o.name, f = o.value, u = !1, l = o.alias;
  l && (a = l[0], Tt(n, Nt([0, 1], l)));
  for (var c = 1, d = !0; c < n.length; c += 1) {
    var y = n[c], v = Ae(y, 0, 1), h = Ae(y, -1);
    if ((v === '"' || v === "'" || v === "`" || h === '"' || h === "'" || h === "`") && v !== h)
      throw new Z("property names with quotes must have matching quotes");
    if ((y === "constructor" || !d) && (u = !0), a += "." + y, i = "%" + a + "%", we(K, i))
      f = K[i];
    else if (f != null) {
      if (!(y in f)) {
        if (!t)
          throw new X("base intrinsic for " + e + " exists, but the property is not available.");
        return;
      }
      if (z && c + 1 >= n.length) {
        var w = z(f, y);
        d = !!w, d && "get" in w && !("originalValue" in w.get) ? f = w.get : f = f[y];
      } else
        d = we(f, y), f = f[y];
      d && !u && (K[i] = f);
    }
  }
  return f;
}, Rr = { exports: {} }, Te, fr;
function je() {
  if (fr)
    return Te;
  fr = 1;
  var r = te, e = r("%Object.defineProperty%", !0) || !1;
  if (e)
    try {
      e({}, "a", { value: 1 });
    } catch {
      e = !1;
    }
  return Te = e, Te;
}
var Lt = te, be = Lt("%Object.getOwnPropertyDescriptor%", !0);
if (be)
  try {
    be([], "length");
  } catch {
    be = null;
  }
var Dr = be, ur = je(), kt = xr, j = ye, cr = Dr, Gt = function(e, t, n) {
  if (!e || typeof e != "object" && typeof e != "function")
    throw new j("`obj` must be an object or a function`");
  if (typeof t != "string" && typeof t != "symbol")
    throw new j("`property` must be a string or a symbol`");
  if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
    throw new j("`nonEnumerable`, if provided, must be a boolean or null");
  if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
    throw new j("`nonWritable`, if provided, must be a boolean or null");
  if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
    throw new j("`nonConfigurable`, if provided, must be a boolean or null");
  if (arguments.length > 6 && typeof arguments[6] != "boolean")
    throw new j("`loose`, if provided, must be a boolean");
  var a = arguments.length > 3 ? arguments[3] : null, o = arguments.length > 4 ? arguments[4] : null, i = arguments.length > 5 ? arguments[5] : null, f = arguments.length > 6 ? arguments[6] : !1, u = !!cr && cr(e, t);
  if (ur)
    ur(e, t, {
      configurable: i === null && u ? u.configurable : !i,
      enumerable: a === null && u ? u.enumerable : !a,
      value: n,
      writable: o === null && u ? u.writable : !o
    });
  else if (f || !a && !o && !i)
    e[t] = n;
  else
    throw new kt("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
}, Ge = je(), _r = function() {
  return !!Ge;
};
_r.hasArrayLengthDefineBug = function() {
  if (!Ge)
    return null;
  try {
    return Ge([], "length", { value: 1 }).length !== 1;
  } catch {
    return !0;
  }
};
var qt = _r, zt = te, pr = Gt, Kt = qt(), yr = Dr, sr = ye, Ht = zt("%Math.floor%"), Qt = function(e, t) {
  if (typeof e != "function")
    throw new sr("`fn` is not a function");
  if (typeof t != "number" || t < 0 || t > 4294967295 || Ht(t) !== t)
    throw new sr("`length` must be a positive 32-bit integer");
  var n = arguments.length > 2 && !!arguments[2], a = !0, o = !0;
  if ("length" in e && yr) {
    var i = yr(e, "length");
    i && !i.configurable && (a = !1), i && !i.writable && (o = !1);
  }
  return (a || o || !n) && (Kt ? pr(
    /** @type {Parameters<define>[0]} */
    e,
    "length",
    t,
    !0,
    !0
  ) : pr(
    /** @type {Parameters<define>[0]} */
    e,
    "length",
    t
  )), e;
};
(function(r) {
  var e = Je, t = te, n = Qt, a = ye, o = t("%Function.prototype.apply%"), i = t("%Function.prototype.call%"), f = t("%Reflect.apply%", !0) || e.call(i, o), u = je(), l = t("%Math.max%");
  r.exports = function(y) {
    if (typeof y != "function")
      throw new a("a function is required");
    var v = f(e, i, arguments);
    return n(
      v,
      1 + l(0, y.length - (arguments.length - 1)),
      !0
    );
  };
  var c = function() {
    return f(e, o, arguments);
  };
  u ? u(r.exports, "apply", { value: c }) : r.exports.apply = c;
})(Rr);
var Vt = Rr.exports, Nr = te, Tr = Vt, Jt = Tr(Nr("String.prototype.indexOf")), jt = function(e, t) {
  var n = Nr(e, !!t);
  return typeof n == "function" && Jt(e, ".prototype.") > -1 ? Tr(n) : n;
};
const Yt = {}, Xt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Yt
}, Symbol.toStringTag, { value: "Module" })), Zt = /* @__PURE__ */ et(Xt);
var Ye = typeof Map == "function" && Map.prototype, Me = Object.getOwnPropertyDescriptor && Ye ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, Ee = Ye && Me && typeof Me.get == "function" ? Me.get : null, dr = Ye && Map.prototype.forEach, Xe = typeof Set == "function" && Set.prototype, Be = Object.getOwnPropertyDescriptor && Xe ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, Oe = Xe && Be && typeof Be.get == "function" ? Be.get : null, vr = Xe && Set.prototype.forEach, en = typeof WeakMap == "function" && WeakMap.prototype, ue = en ? WeakMap.prototype.has : null, rn = typeof WeakSet == "function" && WeakSet.prototype, ce = rn ? WeakSet.prototype.has : null, tn = typeof WeakRef == "function" && WeakRef.prototype, hr = tn ? WeakRef.prototype.deref : null, nn = Boolean.prototype.valueOf, on = Object.prototype.toString, an = Function.prototype.toString, ln = String.prototype.match, Ze = String.prototype.slice, U = String.prototype.replace, fn = String.prototype.toUpperCase, gr = String.prototype.toLowerCase, Mr = RegExp.prototype.test, mr = Array.prototype.concat, x = Array.prototype.join, un = Array.prototype.slice, br = Math.floor, qe = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, Ce = Object.getOwnPropertySymbols, ze = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, ee = typeof Symbol == "function" && typeof Symbol.iterator == "object", A = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === ee || !0) ? Symbol.toStringTag : null, Br = Object.prototype.propertyIsEnumerable, Sr = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(r) {
  return r.__proto__;
} : null);
function wr(r, e) {
  if (r === 1 / 0 || r === -1 / 0 || r !== r || r && r > -1e3 && r < 1e3 || Mr.call(/e/, e))
    return e;
  var t = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof r == "number") {
    var n = r < 0 ? -br(-r) : br(r);
    if (n !== r) {
      var a = String(n), o = Ze.call(e, a.length + 1);
      return U.call(a, t, "$&_") + "." + U.call(U.call(o, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return U.call(e, t, "$&_");
}
var Ke = Zt, Ar = Ke.custom, Er = Ur(Ar) ? Ar : null, cn = function r(e, t, n, a) {
  var o = t || {};
  if (C(o, "quoteStyle") && o.quoteStyle !== "single" && o.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (C(o, "maxStringLength") && (typeof o.maxStringLength == "number" ? o.maxStringLength < 0 && o.maxStringLength !== 1 / 0 : o.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var i = C(o, "customInspect") ? o.customInspect : !0;
  if (typeof i != "boolean" && i !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (C(o, "indent") && o.indent !== null && o.indent !== "	" && !(parseInt(o.indent, 10) === o.indent && o.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (C(o, "numericSeparator") && typeof o.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var f = o.numericSeparator;
  if (typeof e > "u")
    return "undefined";
  if (e === null)
    return "null";
  if (typeof e == "boolean")
    return e ? "true" : "false";
  if (typeof e == "string")
    return Lr(e, o);
  if (typeof e == "number") {
    if (e === 0)
      return 1 / 0 / e > 0 ? "0" : "-0";
    var u = String(e);
    return f ? wr(e, u) : u;
  }
  if (typeof e == "bigint") {
    var l = String(e) + "n";
    return f ? wr(e, l) : l;
  }
  var c = typeof o.depth > "u" ? 5 : o.depth;
  if (typeof n > "u" && (n = 0), n >= c && c > 0 && typeof e == "object")
    return He(e) ? "[Array]" : "[Object]";
  var d = xn(o, n);
  if (typeof a > "u")
    a = [];
  else if (Wr(a, e) >= 0)
    return "[Circular]";
  function y(O, M, B) {
    if (M && (a = un.call(a), a.push(M)), B) {
      var ae = {
        depth: o.depth
      };
      return C(o, "quoteStyle") && (ae.quoteStyle = o.quoteStyle), r(O, ae, n + 1, a);
    }
    return r(O, o, n + 1, a);
  }
  if (typeof e == "function" && !Or(e)) {
    var v = bn(e), h = he(e, y);
    return "[Function" + (v ? ": " + v : " (anonymous)") + "]" + (h.length > 0 ? " { " + x.call(h, ", ") + " }" : "");
  }
  if (Ur(e)) {
    var w = ee ? U.call(String(e), /^(Symbol\(.*\))_[^)]*$/, "$1") : ze.call(e);
    return typeof e == "object" && !ee ? le(w) : w;
  }
  if (Pn(e)) {
    for (var E = "<" + gr.call(String(e.nodeName)), D = e.attributes || [], _ = 0; _ < D.length; _++)
      E += " " + D[_].name + "=" + Cr(pn(D[_].value), "double", o);
    return E += ">", e.childNodes && e.childNodes.length && (E += "..."), E += "</" + gr.call(String(e.nodeName)) + ">", E;
  }
  if (He(e)) {
    if (e.length === 0)
      return "[]";
    var s = he(e, y);
    return d && !In(s) ? "[" + Qe(s, d) + "]" : "[ " + x.call(s, ", ") + " ]";
  }
  if (sn(e)) {
    var N = he(e, y);
    return !("cause" in Error.prototype) && "cause" in e && !Br.call(e, "cause") ? "{ [" + String(e) + "] " + x.call(mr.call("[cause]: " + y(e.cause), N), ", ") + " }" : N.length === 0 ? "[" + String(e) + "]" : "{ [" + String(e) + "] " + x.call(N, ", ") + " }";
  }
  if (typeof e == "object" && i) {
    if (Er && typeof e[Er] == "function" && Ke)
      return Ke(e, { depth: c - n });
    if (i !== "symbol" && typeof e.inspect == "function")
      return e.inspect();
  }
  if (Sn(e)) {
    var L = [];
    return dr && dr.call(e, function(O, M) {
      L.push(y(M, e, !0) + " => " + y(O, e));
    }), Pr("Map", Ee.call(e), L, d);
  }
  if (En(e)) {
    var oe = [];
    return vr && vr.call(e, function(O) {
      oe.push(y(O, e));
    }), Pr("Set", Oe.call(e), oe, d);
  }
  if (wn(e))
    return Ue("WeakMap");
  if (On(e))
    return Ue("WeakSet");
  if (An(e))
    return Ue("WeakRef");
  if (vn(e))
    return le(y(Number(e)));
  if (gn(e))
    return le(y(qe.call(e)));
  if (hn(e))
    return le(nn.call(e));
  if (dn(e))
    return le(y(String(e)));
  if (typeof window < "u" && e === window)
    return "{ [object Window] }";
  if (e === Zr)
    return "{ [object globalThis] }";
  if (!yn(e) && !Or(e)) {
    var H = he(e, y), de = Sr ? Sr(e) === Object.prototype : e instanceof Object || e.constructor === Object, k = e instanceof Object ? "" : "null prototype", T = !de && A && Object(e) === e && A in e ? Ze.call(W(e), 8, -1) : k ? "Object" : "", ve = de || typeof e.constructor != "function" ? "" : e.constructor.name ? e.constructor.name + " " : "", Q = ve + (T || k ? "[" + x.call(mr.call([], T || [], k || []), ": ") + "] " : "");
    return H.length === 0 ? Q + "{}" : d ? Q + "{" + Qe(H, d) + "}" : Q + "{ " + x.call(H, ", ") + " }";
  }
  return String(e);
};
function Cr(r, e, t) {
  var n = (t.quoteStyle || e) === "double" ? '"' : "'";
  return n + r + n;
}
function pn(r) {
  return U.call(String(r), /"/g, "&quot;");
}
function He(r) {
  return W(r) === "[object Array]" && (!A || !(typeof r == "object" && A in r));
}
function yn(r) {
  return W(r) === "[object Date]" && (!A || !(typeof r == "object" && A in r));
}
function Or(r) {
  return W(r) === "[object RegExp]" && (!A || !(typeof r == "object" && A in r));
}
function sn(r) {
  return W(r) === "[object Error]" && (!A || !(typeof r == "object" && A in r));
}
function dn(r) {
  return W(r) === "[object String]" && (!A || !(typeof r == "object" && A in r));
}
function vn(r) {
  return W(r) === "[object Number]" && (!A || !(typeof r == "object" && A in r));
}
function hn(r) {
  return W(r) === "[object Boolean]" && (!A || !(typeof r == "object" && A in r));
}
function Ur(r) {
  if (ee)
    return r && typeof r == "object" && r instanceof Symbol;
  if (typeof r == "symbol")
    return !0;
  if (!r || typeof r != "object" || !ze)
    return !1;
  try {
    return ze.call(r), !0;
  } catch {
  }
  return !1;
}
function gn(r) {
  if (!r || typeof r != "object" || !qe)
    return !1;
  try {
    return qe.call(r), !0;
  } catch {
  }
  return !1;
}
var mn = Object.prototype.hasOwnProperty || function(r) {
  return r in this;
};
function C(r, e) {
  return mn.call(r, e);
}
function W(r) {
  return on.call(r);
}
function bn(r) {
  if (r.name)
    return r.name;
  var e = ln.call(an.call(r), /^function\s*([\w$]+)/);
  return e ? e[1] : null;
}
function Wr(r, e) {
  if (r.indexOf)
    return r.indexOf(e);
  for (var t = 0, n = r.length; t < n; t++)
    if (r[t] === e)
      return t;
  return -1;
}
function Sn(r) {
  if (!Ee || !r || typeof r != "object")
    return !1;
  try {
    Ee.call(r);
    try {
      Oe.call(r);
    } catch {
      return !0;
    }
    return r instanceof Map;
  } catch {
  }
  return !1;
}
function wn(r) {
  if (!ue || !r || typeof r != "object")
    return !1;
  try {
    ue.call(r, ue);
    try {
      ce.call(r, ce);
    } catch {
      return !0;
    }
    return r instanceof WeakMap;
  } catch {
  }
  return !1;
}
function An(r) {
  if (!hr || !r || typeof r != "object")
    return !1;
  try {
    return hr.call(r), !0;
  } catch {
  }
  return !1;
}
function En(r) {
  if (!Oe || !r || typeof r != "object")
    return !1;
  try {
    Oe.call(r);
    try {
      Ee.call(r);
    } catch {
      return !0;
    }
    return r instanceof Set;
  } catch {
  }
  return !1;
}
function On(r) {
  if (!ce || !r || typeof r != "object")
    return !1;
  try {
    ce.call(r, ce);
    try {
      ue.call(r, ue);
    } catch {
      return !0;
    }
    return r instanceof WeakSet;
  } catch {
  }
  return !1;
}
function Pn(r) {
  return !r || typeof r != "object" ? !1 : typeof HTMLElement < "u" && r instanceof HTMLElement ? !0 : typeof r.nodeName == "string" && typeof r.getAttribute == "function";
}
function Lr(r, e) {
  if (r.length > e.maxStringLength) {
    var t = r.length - e.maxStringLength, n = "... " + t + " more character" + (t > 1 ? "s" : "");
    return Lr(Ze.call(r, 0, e.maxStringLength), e) + n;
  }
  var a = U.call(U.call(r, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, $n);
  return Cr(a, "single", e);
}
function $n(r) {
  var e = r.charCodeAt(0), t = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[e];
  return t ? "\\" + t : "\\x" + (e < 16 ? "0" : "") + fn.call(e.toString(16));
}
function le(r) {
  return "Object(" + r + ")";
}
function Ue(r) {
  return r + " { ? }";
}
function Pr(r, e, t, n) {
  var a = n ? Qe(t, n) : x.call(t, ", ");
  return r + " (" + e + ") {" + a + "}";
}
function In(r) {
  for (var e = 0; e < r.length; e++)
    if (Wr(r[e], `
`) >= 0)
      return !1;
  return !0;
}
function xn(r, e) {
  var t;
  if (r.indent === "	")
    t = "	";
  else if (typeof r.indent == "number" && r.indent > 0)
    t = x.call(Array(r.indent + 1), " ");
  else
    return null;
  return {
    base: t,
    prev: x.call(Array(e + 1), t)
  };
}
function Qe(r, e) {
  if (r.length === 0)
    return "";
  var t = `
` + e.prev + e.base;
  return t + x.call(r, "," + t) + `
` + e.prev;
}
function he(r, e) {
  var t = He(r), n = [];
  if (t) {
    n.length = r.length;
    for (var a = 0; a < r.length; a++)
      n[a] = C(r, a) ? e(r[a], r) : "";
  }
  var o = typeof Ce == "function" ? Ce(r) : [], i;
  if (ee) {
    i = {};
    for (var f = 0; f < o.length; f++)
      i["$" + o[f]] = o[f];
  }
  for (var u in r)
    C(r, u) && (t && String(Number(u)) === u && u < r.length || ee && i["$" + u] instanceof Symbol || (Mr.call(/[^\w$]/, u) ? n.push(e(u, r) + ": " + e(r[u], r)) : n.push(u + ": " + e(r[u], r))));
  if (typeof Ce == "function")
    for (var l = 0; l < o.length; l++)
      Br.call(r, o[l]) && n.push("[" + e(o[l]) + "]: " + e(r[o[l]], r));
  return n;
}
var kr = te, ne = jt, Fn = cn, Rn = ye, ge = kr("%WeakMap%", !0), me = kr("%Map%", !0), Dn = ne("WeakMap.prototype.get", !0), _n = ne("WeakMap.prototype.set", !0), Nn = ne("WeakMap.prototype.has", !0), Tn = ne("Map.prototype.get", !0), Mn = ne("Map.prototype.set", !0), Bn = ne("Map.prototype.has", !0), er = function(r, e) {
  for (var t = r, n; (n = t.next) !== null; t = n)
    if (n.key === e)
      return t.next = n.next, n.next = /** @type {NonNullable<typeof list.next>} */
      r.next, r.next = n, n;
}, Cn = function(r, e) {
  var t = er(r, e);
  return t && t.value;
}, Un = function(r, e, t) {
  var n = er(r, e);
  n ? n.value = t : r.next = /** @type {import('.').ListNode<typeof value>} */
  {
    // eslint-disable-line no-param-reassign, no-extra-parens
    key: e,
    next: r.next,
    value: t
  };
}, Wn = function(r, e) {
  return !!er(r, e);
}, Ln = function() {
  var e, t, n, a = {
    assert: function(o) {
      if (!a.has(o))
        throw new Rn("Side channel does not contain " + Fn(o));
    },
    get: function(o) {
      if (ge && o && (typeof o == "object" || typeof o == "function")) {
        if (e)
          return Dn(e, o);
      } else if (me) {
        if (t)
          return Tn(t, o);
      } else if (n)
        return Cn(n, o);
    },
    has: function(o) {
      if (ge && o && (typeof o == "object" || typeof o == "function")) {
        if (e)
          return Nn(e, o);
      } else if (me) {
        if (t)
          return Bn(t, o);
      } else if (n)
        return Wn(n, o);
      return !1;
    },
    set: function(o, i) {
      ge && o && (typeof o == "object" || typeof o == "function") ? (e || (e = new ge()), _n(e, o, i)) : me ? (t || (t = new me()), Mn(t, o, i)) : (n || (n = { key: {}, next: null }), Un(n, o, i));
    }
  };
  return a;
}, kn = String.prototype.replace, Gn = /%20/g, We = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, rr = {
  default: We.RFC3986,
  formatters: {
    RFC1738: function(r) {
      return kn.call(r, Gn, "+");
    },
    RFC3986: function(r) {
      return String(r);
    }
  },
  RFC1738: We.RFC1738,
  RFC3986: We.RFC3986
}, qn = rr, Le = Object.prototype.hasOwnProperty, G = Array.isArray, $ = function() {
  for (var r = [], e = 0; e < 256; ++e)
    r.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return r;
}(), zn = function(e) {
  for (; e.length > 1; ) {
    var t = e.pop(), n = t.obj[t.prop];
    if (G(n)) {
      for (var a = [], o = 0; o < n.length; ++o)
        typeof n[o] < "u" && a.push(n[o]);
      t.obj[t.prop] = a;
    }
  }
}, Gr = function(e, t) {
  for (var n = t && t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, a = 0; a < e.length; ++a)
    typeof e[a] < "u" && (n[a] = e[a]);
  return n;
}, Kn = function r(e, t, n) {
  if (!t)
    return e;
  if (typeof t != "object") {
    if (G(e))
      e.push(t);
    else if (e && typeof e == "object")
      (n && (n.plainObjects || n.allowPrototypes) || !Le.call(Object.prototype, t)) && (e[t] = !0);
    else
      return [e, t];
    return e;
  }
  if (!e || typeof e != "object")
    return [e].concat(t);
  var a = e;
  return G(e) && !G(t) && (a = Gr(e, n)), G(e) && G(t) ? (t.forEach(function(o, i) {
    if (Le.call(e, i)) {
      var f = e[i];
      f && typeof f == "object" && o && typeof o == "object" ? e[i] = r(f, o, n) : e.push(o);
    } else
      e[i] = o;
  }), e) : Object.keys(t).reduce(function(o, i) {
    var f = t[i];
    return Le.call(o, i) ? o[i] = r(o[i], f, n) : o[i] = f, o;
  }, a);
}, Hn = function(e, t) {
  return Object.keys(t).reduce(function(n, a) {
    return n[a] = t[a], n;
  }, e);
}, Qn = function(r, e, t) {
  var n = r.replace(/\+/g, " ");
  if (t === "iso-8859-1")
    return n.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(n);
  } catch {
    return n;
  }
}, Vn = function(e, t, n, a, o) {
  if (e.length === 0)
    return e;
  var i = e;
  if (typeof e == "symbol" ? i = Symbol.prototype.toString.call(e) : typeof e != "string" && (i = String(e)), n === "iso-8859-1")
    return escape(i).replace(/%u[0-9a-f]{4}/gi, function(c) {
      return "%26%23" + parseInt(c.slice(2), 16) + "%3B";
    });
  for (var f = "", u = 0; u < i.length; ++u) {
    var l = i.charCodeAt(u);
    if (l === 45 || l === 46 || l === 95 || l === 126 || l >= 48 && l <= 57 || l >= 65 && l <= 90 || l >= 97 && l <= 122 || o === qn.RFC1738 && (l === 40 || l === 41)) {
      f += i.charAt(u);
      continue;
    }
    if (l < 128) {
      f = f + $[l];
      continue;
    }
    if (l < 2048) {
      f = f + ($[192 | l >> 6] + $[128 | l & 63]);
      continue;
    }
    if (l < 55296 || l >= 57344) {
      f = f + ($[224 | l >> 12] + $[128 | l >> 6 & 63] + $[128 | l & 63]);
      continue;
    }
    u += 1, l = 65536 + ((l & 1023) << 10 | i.charCodeAt(u) & 1023), f += $[240 | l >> 18] + $[128 | l >> 12 & 63] + $[128 | l >> 6 & 63] + $[128 | l & 63];
  }
  return f;
}, Jn = function(e) {
  for (var t = [{ obj: { o: e }, prop: "o" }], n = [], a = 0; a < t.length; ++a)
    for (var o = t[a], i = o.obj[o.prop], f = Object.keys(i), u = 0; u < f.length; ++u) {
      var l = f[u], c = i[l];
      typeof c == "object" && c !== null && n.indexOf(c) === -1 && (t.push({ obj: i, prop: l }), n.push(c));
    }
  return zn(t), e;
}, jn = function(e) {
  return Object.prototype.toString.call(e) === "[object RegExp]";
}, Yn = function(e) {
  return !e || typeof e != "object" ? !1 : !!(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e));
}, Xn = function(e, t) {
  return [].concat(e, t);
}, Zn = function(e, t) {
  if (G(e)) {
    for (var n = [], a = 0; a < e.length; a += 1)
      n.push(t(e[a]));
    return n;
  }
  return t(e);
}, qr = {
  arrayToObject: Gr,
  assign: Hn,
  combine: Xn,
  compact: Jn,
  decode: Qn,
  encode: Vn,
  isBuffer: Yn,
  isRegExp: jn,
  maybeMap: Zn,
  merge: Kn
}, zr = Ln, Se = qr, pe = rr, eo = Object.prototype.hasOwnProperty, Kr = {
  brackets: function(e) {
    return e + "[]";
  },
  comma: "comma",
  indices: function(e, t) {
    return e + "[" + t + "]";
  },
  repeat: function(e) {
    return e;
  }
}, I = Array.isArray, ro = Array.prototype.push, Hr = function(r, e) {
  ro.apply(r, I(e) ? e : [e]);
}, to = Date.prototype.toISOString, $r = pe.default, b = {
  addQueryPrefix: !1,
  allowDots: !1,
  allowEmptyArrays: !1,
  arrayFormat: "indices",
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encodeDotInKeys: !1,
  encoder: Se.encode,
  encodeValuesOnly: !1,
  format: $r,
  formatter: pe.formatters[$r],
  // deprecated
  indices: !1,
  serializeDate: function(e) {
    return to.call(e);
  },
  skipNulls: !1,
  strictNullHandling: !1
}, no = function(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "symbol" || typeof e == "bigint";
}, ke = {}, oo = function r(e, t, n, a, o, i, f, u, l, c, d, y, v, h, w, E, D, _) {
  for (var s = e, N = _, L = 0, oe = !1; (N = N.get(ke)) !== void 0 && !oe; ) {
    var H = N.get(e);
    if (L += 1, typeof H < "u") {
      if (H === L)
        throw new RangeError("Cyclic object value");
      oe = !0;
    }
    typeof N.get(ke) > "u" && (L = 0);
  }
  if (typeof c == "function" ? s = c(t, s) : s instanceof Date ? s = v(s) : n === "comma" && I(s) && (s = Se.maybeMap(s, function(xe) {
    return xe instanceof Date ? v(xe) : xe;
  })), s === null) {
    if (i)
      return l && !E ? l(t, b.encoder, D, "key", h) : t;
    s = "";
  }
  if (no(s) || Se.isBuffer(s)) {
    if (l) {
      var de = E ? t : l(t, b.encoder, D, "key", h);
      return [w(de) + "=" + w(l(s, b.encoder, D, "value", h))];
    }
    return [w(t) + "=" + w(String(s))];
  }
  var k = [];
  if (typeof s > "u")
    return k;
  var T;
  if (n === "comma" && I(s))
    E && l && (s = Se.maybeMap(s, l)), T = [{ value: s.length > 0 ? s.join(",") || null : void 0 }];
  else if (I(c))
    T = c;
  else {
    var ve = Object.keys(s);
    T = d ? ve.sort(d) : ve;
  }
  var Q = u ? t.replace(/\./g, "%2E") : t, O = a && I(s) && s.length === 1 ? Q + "[]" : Q;
  if (o && I(s) && s.length === 0)
    return O + "[]";
  for (var M = 0; M < T.length; ++M) {
    var B = T[M], ae = typeof B == "object" && typeof B.value < "u" ? B.value : s[B];
    if (!(f && ae === null)) {
      var Ie = y && u ? B.replace(/\./g, "%2E") : B, jr = I(s) ? typeof n == "function" ? n(O, Ie) : O : O + (y ? "." + Ie : "[" + Ie + "]");
      _.set(e, L);
      var tr = zr();
      tr.set(ke, _), Hr(k, r(
        ae,
        jr,
        n,
        a,
        o,
        i,
        f,
        u,
        n === "comma" && E && I(s) ? null : l,
        c,
        d,
        y,
        v,
        h,
        w,
        E,
        D,
        tr
      ));
    }
  }
  return k;
}, ao = function(e) {
  if (!e)
    return b;
  if (typeof e.allowEmptyArrays < "u" && typeof e.allowEmptyArrays != "boolean")
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  if (typeof e.encodeDotInKeys < "u" && typeof e.encodeDotInKeys != "boolean")
    throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
  if (e.encoder !== null && typeof e.encoder < "u" && typeof e.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  var t = e.charset || b.charset;
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var n = pe.default;
  if (typeof e.format < "u") {
    if (!eo.call(pe.formatters, e.format))
      throw new TypeError("Unknown format option provided.");
    n = e.format;
  }
  var a = pe.formatters[n], o = b.filter;
  (typeof e.filter == "function" || I(e.filter)) && (o = e.filter);
  var i;
  if (e.arrayFormat in Kr ? i = e.arrayFormat : "indices" in e ? i = e.indices ? "indices" : "repeat" : i = b.arrayFormat, "commaRoundTrip" in e && typeof e.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  var f = typeof e.allowDots > "u" ? e.encodeDotInKeys === !0 ? !0 : b.allowDots : !!e.allowDots;
  return {
    addQueryPrefix: typeof e.addQueryPrefix == "boolean" ? e.addQueryPrefix : b.addQueryPrefix,
    allowDots: f,
    allowEmptyArrays: typeof e.allowEmptyArrays == "boolean" ? !!e.allowEmptyArrays : b.allowEmptyArrays,
    arrayFormat: i,
    charset: t,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : b.charsetSentinel,
    commaRoundTrip: e.commaRoundTrip,
    delimiter: typeof e.delimiter > "u" ? b.delimiter : e.delimiter,
    encode: typeof e.encode == "boolean" ? e.encode : b.encode,
    encodeDotInKeys: typeof e.encodeDotInKeys == "boolean" ? e.encodeDotInKeys : b.encodeDotInKeys,
    encoder: typeof e.encoder == "function" ? e.encoder : b.encoder,
    encodeValuesOnly: typeof e.encodeValuesOnly == "boolean" ? e.encodeValuesOnly : b.encodeValuesOnly,
    filter: o,
    format: n,
    formatter: a,
    serializeDate: typeof e.serializeDate == "function" ? e.serializeDate : b.serializeDate,
    skipNulls: typeof e.skipNulls == "boolean" ? e.skipNulls : b.skipNulls,
    sort: typeof e.sort == "function" ? e.sort : null,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : b.strictNullHandling
  };
}, io = function(r, e) {
  var t = r, n = ao(e), a, o;
  typeof n.filter == "function" ? (o = n.filter, t = o("", t)) : I(n.filter) && (o = n.filter, a = o);
  var i = [];
  if (typeof t != "object" || t === null)
    return "";
  var f = Kr[n.arrayFormat], u = f === "comma" && n.commaRoundTrip;
  a || (a = Object.keys(t)), n.sort && a.sort(n.sort);
  for (var l = zr(), c = 0; c < a.length; ++c) {
    var d = a[c];
    n.skipNulls && t[d] === null || Hr(i, oo(
      t[d],
      d,
      f,
      u,
      n.allowEmptyArrays,
      n.strictNullHandling,
      n.skipNulls,
      n.encodeDotInKeys,
      n.encode ? n.encoder : null,
      n.filter,
      n.sort,
      n.allowDots,
      n.serializeDate,
      n.format,
      n.formatter,
      n.encodeValuesOnly,
      n.charset,
      l
    ));
  }
  var y = i.join(n.delimiter), v = n.addQueryPrefix === !0 ? "?" : "";
  return n.charsetSentinel && (n.charset === "iso-8859-1" ? v += "utf8=%26%2310003%3B&" : v += "utf8=%E2%9C%93&"), y.length > 0 ? v + y : "";
}, re = qr, Ve = Object.prototype.hasOwnProperty, lo = Array.isArray, m = {
  allowDots: !1,
  allowEmptyArrays: !1,
  allowPrototypes: !1,
  allowSparse: !1,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: !1,
  comma: !1,
  decodeDotInKeys: !0,
  decoder: re.decode,
  delimiter: "&",
  depth: 5,
  duplicates: "combine",
  ignoreQueryPrefix: !1,
  interpretNumericEntities: !1,
  parameterLimit: 1e3,
  parseArrays: !0,
  plainObjects: !1,
  strictNullHandling: !1
}, fo = function(r) {
  return r.replace(/&#(\d+);/g, function(e, t) {
    return String.fromCharCode(parseInt(t, 10));
  });
}, Qr = function(r, e) {
  return r && typeof r == "string" && e.comma && r.indexOf(",") > -1 ? r.split(",") : r;
}, uo = "utf8=%26%2310003%3B", co = "utf8=%E2%9C%93", po = function(e, t) {
  var n = { __proto__: null }, a = t.ignoreQueryPrefix ? e.replace(/^\?/, "") : e, o = t.parameterLimit === 1 / 0 ? void 0 : t.parameterLimit, i = a.split(t.delimiter, o), f = -1, u, l = t.charset;
  if (t.charsetSentinel)
    for (u = 0; u < i.length; ++u)
      i[u].indexOf("utf8=") === 0 && (i[u] === co ? l = "utf-8" : i[u] === uo && (l = "iso-8859-1"), f = u, u = i.length);
  for (u = 0; u < i.length; ++u)
    if (u !== f) {
      var c = i[u], d = c.indexOf("]="), y = d === -1 ? c.indexOf("=") : d + 1, v, h;
      y === -1 ? (v = t.decoder(c, m.decoder, l, "key"), h = t.strictNullHandling ? null : "") : (v = t.decoder(c.slice(0, y), m.decoder, l, "key"), h = re.maybeMap(
        Qr(c.slice(y + 1), t),
        function(E) {
          return t.decoder(E, m.decoder, l, "value");
        }
      )), h && t.interpretNumericEntities && l === "iso-8859-1" && (h = fo(h)), c.indexOf("[]=") > -1 && (h = lo(h) ? [h] : h);
      var w = Ve.call(n, v);
      w && t.duplicates === "combine" ? n[v] = re.combine(n[v], h) : (!w || t.duplicates === "last") && (n[v] = h);
    }
  return n;
}, yo = function(r, e, t, n) {
  for (var a = n ? e : Qr(e, t), o = r.length - 1; o >= 0; --o) {
    var i, f = r[o];
    if (f === "[]" && t.parseArrays)
      i = t.allowEmptyArrays && a === "" ? [] : [].concat(a);
    else {
      i = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var u = f.charAt(0) === "[" && f.charAt(f.length - 1) === "]" ? f.slice(1, -1) : f, l = t.decodeDotInKeys ? u.replace(/%2E/g, ".") : u, c = parseInt(l, 10);
      !t.parseArrays && l === "" ? i = { 0: a } : !isNaN(c) && f !== l && String(c) === l && c >= 0 && t.parseArrays && c <= t.arrayLimit ? (i = [], i[c] = a) : l !== "__proto__" && (i[l] = a);
    }
    a = i;
  }
  return a;
}, so = function(e, t, n, a) {
  if (e) {
    var o = n.allowDots ? e.replace(/\.([^.[]+)/g, "[$1]") : e, i = /(\[[^[\]]*])/, f = /(\[[^[\]]*])/g, u = n.depth > 0 && i.exec(o), l = u ? o.slice(0, u.index) : o, c = [];
    if (l) {
      if (!n.plainObjects && Ve.call(Object.prototype, l) && !n.allowPrototypes)
        return;
      c.push(l);
    }
    for (var d = 0; n.depth > 0 && (u = f.exec(o)) !== null && d < n.depth; ) {
      if (d += 1, !n.plainObjects && Ve.call(Object.prototype, u[1].slice(1, -1)) && !n.allowPrototypes)
        return;
      c.push(u[1]);
    }
    return u && c.push("[" + o.slice(u.index) + "]"), yo(c, t, n, a);
  }
}, vo = function(e) {
  if (!e)
    return m;
  if (typeof e.allowEmptyArrays < "u" && typeof e.allowEmptyArrays != "boolean")
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  if (typeof e.decodeDotInKeys < "u" && typeof e.decodeDotInKeys != "boolean")
    throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
  if (e.decoder !== null && typeof e.decoder < "u" && typeof e.decoder != "function")
    throw new TypeError("Decoder has to be a function.");
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var t = typeof e.charset > "u" ? m.charset : e.charset, n = typeof e.duplicates > "u" ? m.duplicates : e.duplicates;
  if (n !== "combine" && n !== "first" && n !== "last")
    throw new TypeError("The duplicates option must be either combine, first, or last");
  var a = typeof e.allowDots > "u" ? e.decodeDotInKeys === !0 ? !0 : m.allowDots : !!e.allowDots;
  return {
    allowDots: a,
    allowEmptyArrays: typeof e.allowEmptyArrays == "boolean" ? !!e.allowEmptyArrays : m.allowEmptyArrays,
    allowPrototypes: typeof e.allowPrototypes == "boolean" ? e.allowPrototypes : m.allowPrototypes,
    allowSparse: typeof e.allowSparse == "boolean" ? e.allowSparse : m.allowSparse,
    arrayLimit: typeof e.arrayLimit == "number" ? e.arrayLimit : m.arrayLimit,
    charset: t,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : m.charsetSentinel,
    comma: typeof e.comma == "boolean" ? e.comma : m.comma,
    decodeDotInKeys: typeof e.decodeDotInKeys == "boolean" ? e.decodeDotInKeys : m.decodeDotInKeys,
    decoder: typeof e.decoder == "function" ? e.decoder : m.decoder,
    delimiter: typeof e.delimiter == "string" || re.isRegExp(e.delimiter) ? e.delimiter : m.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof e.depth == "number" || e.depth === !1 ? +e.depth : m.depth,
    duplicates: n,
    ignoreQueryPrefix: e.ignoreQueryPrefix === !0,
    interpretNumericEntities: typeof e.interpretNumericEntities == "boolean" ? e.interpretNumericEntities : m.interpretNumericEntities,
    parameterLimit: typeof e.parameterLimit == "number" ? e.parameterLimit : m.parameterLimit,
    parseArrays: e.parseArrays !== !1,
    plainObjects: typeof e.plainObjects == "boolean" ? e.plainObjects : m.plainObjects,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : m.strictNullHandling
  };
}, ho = function(r, e) {
  var t = vo(e);
  if (r === "" || r === null || typeof r > "u")
    return t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var n = typeof r == "string" ? po(r, t) : r, a = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, o = Object.keys(n), i = 0; i < o.length; ++i) {
    var f = o[i], u = so(f, n[f], t, typeof r == "string");
    a = re.merge(a, u, t);
  }
  return t.allowSparse === !0 ? a : re.compact(a);
}, go = io, mo = ho, bo = rr, So = {
  formats: bo,
  parse: mo,
  stringify: go
};
const Vr = {
  addQueryPrefix: !0,
  encoder: (r, e, t, n) => n === "value" && typeof r == "boolean" ? r ? 1 : 0 : e(r),
  encodeValuesOnly: !0,
  skipNulls: !0
}, wo = {
  absolute: !1,
  strict: !1,
  qsConfig: Vr,
  base: "/",
  defaults: {},
  routes: {}
};
var P, $e, Jr, Ir;
let Ao = (Ir = class {
  constructor(e) {
    V(this, $e);
    V(this, P, wo);
    this.config = e;
  }
  get config() {
    return g(this, P);
  }
  set config(e) {
    ie(this, P, {
      ...g(this, P),
      ...e,
      qsConfig: {
        ...Vr,
        ...(e == null ? void 0 : e.qsConfig) ?? {}
      }
    });
  }
  get base() {
    return fe(g(this, P).base);
  }
  get origin() {
    return g(this, P).absolute ? this.base : "";
  }
  has(e) {
    return Object.hasOwn(g(this, P).routes, e);
  }
  compile(e, t) {
    const n = nr(this, $e, Jr).call(this, e), { substituted: a, template: o } = n.compile(t), i = t._query ?? {};
    delete t._query;
    for (const f of Object.keys(t))
      Object.hasOwn(i, f) && console.warn(`Duplicate "${f}" in params and params.query may cause issues`), !a.includes(f) && (i[f] = t[f]);
    return o + So.stringify(i, g(this, P).qsConfig);
  }
}, P = new WeakMap(), $e = new WeakSet(), Jr = function(e) {
  if (!this.has(e))
    throw new Error(`No such route "${e}" in the route list`);
  return new Xr(e, g(this, P).routes[e], this);
}, Ir);
const Pe = new Ao(), Po = (r) => (Pe.config = r, Pe.config), $o = (r, e) => Pe.compile(r, e ?? {}), Io = Pe;
export {
  Io as Router,
  Po as configureRouter,
  $o as route
};
