var q = (e, t, r) => {
  if (!t.has(e))
    throw TypeError("Cannot " + r);
};
var o = (e, t, r) => (q(e, t, "read from private field"), r ? r.call(e) : t.get(e)), l = (e, t, r) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, r);
}, d = (e, t, r, n) => (q(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
var k = (e, t, r) => (q(e, t, "access private method"), r);
import { z as s } from "zod";
import { stringify as D } from "qs";
s.record(s.string(), s.boolean());
const C = s.union([s.string(), s.number(), s.boolean()]), w = s.record(
  s.unknown(),
  C
), N = s.object({
  _query: s.record(
    w.keySchema,
    w.valueSchema.or(s.array(C))
  ).optional()
});
s.intersection(
  w,
  N
);
const _ = s.object({
  uri: s.string(),
  domain: s.string().nullable(),
  wheres: w
});
s.object({
  substituted: s.array(s.string()),
  url: s.string()
});
const F = s.record(s.string(), _), Q = s.object({
  base: s.string(),
  defaults: w,
  routes: F
}), x = (e) => typeof e == "string" || e instanceof String, O = (e) => e == null ? !0 : (x(e) || (e = String(e)), e.trim().length === 0), b = (e) => e.replace(/\/+$/, "");
var g, a, h;
class V {
  constructor(t, r, n) {
    l(this, g, void 0);
    l(this, a, void 0);
    l(this, h, void 0);
    d(this, g, t), d(this, a, r), d(this, h, n);
  }
  /**
   * Retruns the route's origin
   */
  get origin() {
    if (!O(o(this, a).domain)) {
      const r = o(this, h).base.match(/^(http|https):\/\//);
      return b(((r == null ? void 0 : r[0]) ?? "") + o(this, a).domain);
    }
    return o(this, h).config.absolute ? b(o(this, h).origin) : "";
  }
  /**
   * Retruns the route's template
   */
  get template() {
    const t = b(`${this.origin}/${o(this, a).uri}`);
    return O(t) ? "/" : t;
  }
  /**
   * Retruns the route's template expected parameters
   */
  get expects() {
    const t = {}, r = this.template.match(/{\w+\??}/g) ?? [];
    for (const n of r) {
      const f = n.replace(/\W/g, "");
      t[f] = n.includes("?") || (t[f] ?? !1);
    }
    return t;
  }
  /**
   * Return the compiled URI for this route, along with an array of substituted tokens.
   */
  compile(t) {
    var f;
    const r = new Array();
    if (Object.keys(this.expects).length < 1)
      return { substituted: r, url: this.template };
    let n = this.template;
    for (const i of Object.keys(this.expects)) {
      const m = this.expects[i];
      let u = (t == null ? void 0 : t[i]) ?? ((f = o(this, h).config.defaults) == null ? void 0 : f[i]) ?? "";
      typeof u == "boolean" && (u = u ? 1 : 0);
      const $ = String(u);
      if (!m) {
        if (O($))
          throw new Error(
            `Missing required parameter "${i}" for route "${o(this, g)}"`
          );
        if (Object.hasOwn(o(this, a).wheres, i)) {
          const p = o(this, a).wheres[i];
          if (!new RegExp(`^${p}$`).test($))
            throw new Error(
              `Parameter "${i}" for route "${o(this, g)}" does not match format "${p}"`
            );
        }
      }
      const j = new RegExp(`{${i}\\??}`, "g");
      if (j.test(n)) {
        const p = encodeURIComponent($);
        if (n = b(n.replace(j, p)), r.push(i), /\/|%2F/g.test(p)) {
          const S = `Character "/" or sequence "%2F" in parameter "${i}" for route "${o(this, g)}" might cause routing issues.`;
          if (o(this, h).config.strict)
            throw new Error(
              S + `
	An error was thrown because you enabled strict mode.
`
            );
          console.warn(S);
        }
      }
    }
    return { substituted: r, url: n };
  }
}
g = new WeakMap(), a = new WeakMap(), h = new WeakMap();
const E = () => ({
  addQueryPrefix: !0,
  encoder: (e, t, r, n) => n === "value" && typeof e == "boolean" ? e ? 1 : 0 : t(e),
  encodeValuesOnly: !0,
  skipNulls: !0
}), A = () => ({
  absolute: !1,
  strict: !1,
  qsConfig: E(),
  base: "/",
  defaults: {},
  routes: {}
}), J = (e) => Q.parse(JSON.parse(e));
var c, R, P;
class z {
  constructor(t) {
    l(this, R);
    l(this, c, A());
    this.config = t ?? {};
  }
  get config() {
    return o(this, c);
  }
  set config(t) {
    t = x(t) ? J(t) : t, d(this, c, {
      ...o(this, c),
      ...t,
      qsConfig: {
        ...E(),
        ...(t == null ? void 0 : t.qsConfig) ?? {}
      }
    });
  }
  get base() {
    return b(o(this, c).base);
  }
  get origin() {
    return o(this, c).absolute ? this.base : "";
  }
  has(t) {
    return Object.hasOwn(o(this, c).routes, t);
  }
  compile(t, r) {
    const n = k(this, R, P).call(this, t), { substituted: f, url: i } = n.compile(r), m = r._query ?? {};
    delete r._query;
    for (const u of Object.keys(r))
      f.includes(u) || (Object.hasOwn(m, u) && console.warn(`Duplicate "${u}" in params and params.query may cause issues`), m[u] = r[u]);
    return i + D(m, o(this, c).qsConfig);
  }
}
c = new WeakMap(), R = new WeakSet(), P = function(t) {
  if (!this.has(t))
    throw new Error(`No such route "${t}" in the route list`);
  return new V(t, o(this, c).routes[t], this);
};
const y = new z(), M = (e) => (y.config = e ?? {}, y.config), T = (e, t) => y.compile(e, t ?? {}), U = (e) => y.has(e);
export {
  z as Router,
  M as configureRouter,
  U as hasRoute,
  T as route
};
