var $t = (r, e, t) => {
  if (!e.has(r))
    throw TypeError("Cannot " + t);
};
var A = (r, e, t) => ($t(r, e, "read from private field"), t ? t.call(r) : e.get(r)), Se = (r, e, t) => {
  if (e.has(r))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(r) : e.set(r, t);
}, Fe = (r, e, t, n) => ($t(r, e, "write to private field"), n ? n.call(r, t) : e.set(r, t), t);
var dr = (r, e, t) => ($t(r, e, "access private method"), t);
var S;
(function(r) {
  r.assertEqual = (i) => i;
  function e(i) {
  }
  r.assertIs = e;
  function t(i) {
    throw new Error();
  }
  r.assertNever = t, r.arrayToEnum = (i) => {
    const a = {};
    for (const s of i)
      a[s] = s;
    return a;
  }, r.getValidEnumValues = (i) => {
    const a = r.objectKeys(i).filter((o) => typeof i[i[o]] != "number"), s = {};
    for (const o of a)
      s[o] = i[o];
    return r.objectValues(s);
  }, r.objectValues = (i) => r.objectKeys(i).map(function(a) {
    return i[a];
  }), r.objectKeys = typeof Object.keys == "function" ? (i) => Object.keys(i) : (i) => {
    const a = [];
    for (const s in i)
      Object.prototype.hasOwnProperty.call(i, s) && a.push(s);
    return a;
  }, r.find = (i, a) => {
    for (const s of i)
      if (a(s))
        return s;
  }, r.isInteger = typeof Number.isInteger == "function" ? (i) => Number.isInteger(i) : (i) => typeof i == "number" && isFinite(i) && Math.floor(i) === i;
  function n(i, a = " | ") {
    return i.map((s) => typeof s == "string" ? `'${s}'` : s).join(a);
  }
  r.joinValues = n, r.jsonStringifyReplacer = (i, a) => typeof a == "bigint" ? a.toString() : a;
})(S || (S = {}));
var Gt;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Gt || (Gt = {}));
const d = S.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), ie = (r) => {
  switch (typeof r) {
    case "undefined":
      return d.undefined;
    case "string":
      return d.string;
    case "number":
      return isNaN(r) ? d.nan : d.number;
    case "boolean":
      return d.boolean;
    case "function":
      return d.function;
    case "bigint":
      return d.bigint;
    case "symbol":
      return d.symbol;
    case "object":
      return Array.isArray(r) ? d.array : r === null ? d.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? d.promise : typeof Map < "u" && r instanceof Map ? d.map : typeof Set < "u" && r instanceof Set ? d.set : typeof Date < "u" && r instanceof Date ? d.date : d.object;
    default:
      return d.unknown;
  }
}, f = S.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]), gn = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
class B extends Error {
  constructor(e) {
    super(), this.issues = [], this.addIssue = (n) => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  get errors() {
    return this.issues;
  }
  format(e) {
    const t = e || function(a) {
      return a.message;
    }, n = { _errors: [] }, i = (a) => {
      for (const s of a.issues)
        if (s.code === "invalid_union")
          s.unionErrors.map(i);
        else if (s.code === "invalid_return_type")
          i(s.returnTypeError);
        else if (s.code === "invalid_arguments")
          i(s.argumentsError);
        else if (s.path.length === 0)
          n._errors.push(t(s));
        else {
          let o = n, u = 0;
          for (; u < s.path.length; ) {
            const c = s.path[u];
            u === s.path.length - 1 ? (o[c] = o[c] || { _errors: [] }, o[c]._errors.push(t(s))) : o[c] = o[c] || { _errors: [] }, o = o[c], u++;
          }
        }
    };
    return i(this), n;
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, S.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, n = [];
    for (const i of this.issues)
      i.path.length > 0 ? (t[i.path[0]] = t[i.path[0]] || [], t[i.path[0]].push(e(i))) : n.push(e(i));
    return { formErrors: n, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
B.create = (r) => new B(r);
const ze = (r, e) => {
  let t;
  switch (r.code) {
    case f.invalid_type:
      r.received === d.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
      break;
    case f.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r.expected, S.jsonStringifyReplacer)}`;
      break;
    case f.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${S.joinValues(r.keys, ", ")}`;
      break;
    case f.invalid_union:
      t = "Invalid input";
      break;
    case f.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${S.joinValues(r.options)}`;
      break;
    case f.invalid_enum_value:
      t = `Invalid enum value. Expected ${S.joinValues(r.options)}, received '${r.received}'`;
      break;
    case f.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case f.invalid_return_type:
      t = "Invalid function return type";
      break;
    case f.invalid_date:
      t = "Invalid date";
      break;
    case f.invalid_string:
      typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : S.assertNever(r.validation) : r.validation !== "regex" ? t = `Invalid ${r.validation}` : t = "Invalid";
      break;
    case f.too_small:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "more than"} ${r.minimum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "over"} ${r.minimum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${r.minimum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r.minimum))}` : t = "Invalid input";
      break;
    case f.too_big:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "less than"} ${r.maximum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "under"} ${r.maximum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "bigint" ? t = `BigInt must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly" : r.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r.maximum))}` : t = "Invalid input";
      break;
    case f.custom:
      t = "Invalid input";
      break;
    case f.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case f.not_multiple_of:
      t = `Number must be a multiple of ${r.multipleOf}`;
      break;
    case f.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, S.assertNever(r);
  }
  return { message: t };
};
let jr = ze;
function _n(r) {
  jr = r;
}
function ht() {
  return jr;
}
const mt = (r) => {
  const { data: e, path: t, errorMaps: n, issueData: i } = r, a = [...t, ...i.path || []], s = {
    ...i,
    path: a
  };
  let o = "";
  const u = n.filter((c) => !!c).slice().reverse();
  for (const c of u)
    o = c(s, { data: e, defaultError: o }).message;
  return {
    ...i,
    path: a,
    message: i.message || o
  };
}, bn = [];
function p(r, e) {
  const t = mt({
    issueData: e,
    data: r.data,
    path: r.path,
    errorMaps: [
      r.common.contextualErrorMap,
      r.schemaErrorMap,
      ht(),
      ze
      // then global default map
    ].filter((n) => !!n)
  });
  r.common.issues.push(t);
}
class $ {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const n = [];
    for (const i of t) {
      if (i.status === "aborted")
        return v;
      i.status === "dirty" && e.dirty(), n.push(i.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, t) {
    const n = [];
    for (const i of t)
      n.push({
        key: await i.key,
        value: await i.value
      });
    return $.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, t) {
    const n = {};
    for (const i of t) {
      const { key: a, value: s } = i;
      if (a.status === "aborted" || s.status === "aborted")
        return v;
      a.status === "dirty" && e.dirty(), s.status === "dirty" && e.dirty(), a.value !== "__proto__" && (typeof s.value < "u" || i.alwaysSet) && (n[a.value] = s.value);
    }
    return { status: e.value, value: n };
  }
}
const v = Object.freeze({
  status: "aborted"
}), Fr = (r) => ({ status: "dirty", value: r }), Z = (r) => ({ status: "valid", value: r }), Ht = (r) => r.status === "aborted", Kt = (r) => r.status === "dirty", qe = (r) => r.status === "valid", vt = (r) => typeof Promise < "u" && r instanceof Promise;
var y;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(y || (y = {}));
class q {
  constructor(e, t, n, i) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = i;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const pr = (r, e) => {
  if (qe(e))
    return { success: !0, data: e.value };
  if (!r.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new B(r.common.issues);
      return this._error = t, this._error;
    }
  };
};
function g(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: n, description: i } = r;
  if (e && (t || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: i } : { errorMap: (s, o) => s.code !== "invalid_type" ? { message: o.defaultError } : typeof o.data > "u" ? { message: n ?? o.defaultError } : { message: t ?? o.defaultError }, description: i };
}
class _ {
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return ie(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: ie(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new $(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: ie(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (vt(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const n = this.safeParse(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  safeParse(e, t) {
    var n;
    const i = {
      common: {
        issues: [],
        async: (n = t == null ? void 0 : t.async) !== null && n !== void 0 ? n : !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: ie(e)
    }, a = this._parseSync({ data: e, path: i.path, parent: i });
    return pr(i, a);
  }
  async parseAsync(e, t) {
    const n = await this.safeParseAsync(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  async safeParseAsync(e, t) {
    const n = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: ie(e)
    }, i = this._parse({ data: e, path: n.path, parent: n }), a = await (vt(i) ? i : Promise.resolve(i));
    return pr(n, a);
  }
  refine(e, t) {
    const n = (i) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(i) : t;
    return this._refinement((i, a) => {
      const s = e(i), o = () => a.addIssue({
        code: f.custom,
        ...n(i)
      });
      return typeof Promise < "u" && s instanceof Promise ? s.then((u) => u ? !0 : (o(), !1)) : s ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((n, i) => e(n) ? !0 : (i.addIssue(typeof t == "function" ? t(n, i) : t), !1));
  }
  _refinement(e) {
    return new U({
      schema: this,
      typeName: h.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  optional() {
    return Q.create(this, this._def);
  }
  nullable() {
    return be.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return L.create(this, this._def);
  }
  promise() {
    return Re.create(this, this._def);
  }
  or(e) {
    return Qe.create([this, e], this._def);
  }
  and(e) {
    return Je.create(this, e, this._def);
  }
  transform(e) {
    return new U({
      ...g(this._def),
      schema: this,
      typeName: h.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new rt({
      ...g(this._def),
      innerType: this,
      defaultValue: t,
      typeName: h.ZodDefault
    });
  }
  brand() {
    return new Lr({
      typeName: h.ZodBranded,
      type: this,
      ...g(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new wt({
      ...g(this._def),
      innerType: this,
      catchValue: t,
      typeName: h.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return at.create(this, e);
  }
  readonly() {
    return St.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const wn = /^c[^\s-]{8,}$/i, xn = /^[a-z][a-z0-9]*$/, Sn = /^[0-9A-HJKMNP-TV-Z]{26}$/, kn = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, On = /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, En = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let Ct;
const Tn = /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/, An = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, In = (r) => r.precision ? r.offset ? new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${r.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`) : new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${r.precision}}Z$`) : r.precision === 0 ? r.offset ? new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$") : new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$") : r.offset ? new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$") : new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$");
function Pn(r, e) {
  return !!((e === "v4" || !e) && Tn.test(r) || (e === "v6" || !e) && An.test(r));
}
class F extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== d.string) {
      const a = this._getOrReturnCtx(e);
      return p(
        a,
        {
          code: f.invalid_type,
          expected: d.string,
          received: a.parsedType
        }
        //
      ), v;
    }
    const n = new $();
    let i;
    for (const a of this._def.checks)
      if (a.kind === "min")
        e.data.length < a.value && (i = this._getOrReturnCtx(e, i), p(i, {
          code: f.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), n.dirty());
      else if (a.kind === "max")
        e.data.length > a.value && (i = this._getOrReturnCtx(e, i), p(i, {
          code: f.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), n.dirty());
      else if (a.kind === "length") {
        const s = e.data.length > a.value, o = e.data.length < a.value;
        (s || o) && (i = this._getOrReturnCtx(e, i), s ? p(i, {
          code: f.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }) : o && p(i, {
          code: f.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }), n.dirty());
      } else if (a.kind === "email")
        On.test(e.data) || (i = this._getOrReturnCtx(e, i), p(i, {
          validation: "email",
          code: f.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "emoji")
        Ct || (Ct = new RegExp(En, "u")), Ct.test(e.data) || (i = this._getOrReturnCtx(e, i), p(i, {
          validation: "emoji",
          code: f.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "uuid")
        kn.test(e.data) || (i = this._getOrReturnCtx(e, i), p(i, {
          validation: "uuid",
          code: f.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "cuid")
        wn.test(e.data) || (i = this._getOrReturnCtx(e, i), p(i, {
          validation: "cuid",
          code: f.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "cuid2")
        xn.test(e.data) || (i = this._getOrReturnCtx(e, i), p(i, {
          validation: "cuid2",
          code: f.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "ulid")
        Sn.test(e.data) || (i = this._getOrReturnCtx(e, i), p(i, {
          validation: "ulid",
          code: f.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "url")
        try {
          new URL(e.data);
        } catch {
          i = this._getOrReturnCtx(e, i), p(i, {
            validation: "url",
            code: f.invalid_string,
            message: a.message
          }), n.dirty();
        }
      else
        a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (i = this._getOrReturnCtx(e, i), p(i, {
          validation: "regex",
          code: f.invalid_string,
          message: a.message
        }), n.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (i = this._getOrReturnCtx(e, i), p(i, {
          code: f.invalid_string,
          validation: { includes: a.value, position: a.position },
          message: a.message
        }), n.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (i = this._getOrReturnCtx(e, i), p(i, {
          code: f.invalid_string,
          validation: { startsWith: a.value },
          message: a.message
        }), n.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (i = this._getOrReturnCtx(e, i), p(i, {
          code: f.invalid_string,
          validation: { endsWith: a.value },
          message: a.message
        }), n.dirty()) : a.kind === "datetime" ? In(a).test(e.data) || (i = this._getOrReturnCtx(e, i), p(i, {
          code: f.invalid_string,
          validation: "datetime",
          message: a.message
        }), n.dirty()) : a.kind === "ip" ? Pn(e.data, a.version) || (i = this._getOrReturnCtx(e, i), p(i, {
          validation: "ip",
          code: f.invalid_string,
          message: a.message
        }), n.dirty()) : S.assertNever(a);
    return { status: n.value, value: e.data };
  }
  _regex(e, t, n) {
    return this.refinement((i) => e.test(i), {
      validation: t,
      code: f.invalid_string,
      ...y.errToObj(n)
    });
  }
  _addCheck(e) {
    return new F({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...y.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...y.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...y.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...y.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...y.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...y.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...y.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...y.errToObj(e) });
  }
  datetime(e) {
    var t;
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (t = e == null ? void 0 : e.offset) !== null && t !== void 0 ? t : !1,
      ...y.errToObj(e == null ? void 0 : e.message)
    });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...y.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...y.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...y.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...y.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...y.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...y.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...y.errToObj(t)
    });
  }
  /**
   * @deprecated Use z.string().min(1) instead.
   * @see {@link ZodString.min}
   */
  nonempty(e) {
    return this.min(1, y.errToObj(e));
  }
  trim() {
    return new F({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new F({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new F({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
F.create = (r) => {
  var e;
  return new F({
    checks: [],
    typeName: h.ZodString,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...g(r)
  });
};
function Rn(r, e) {
  const t = (r.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, i = t > n ? t : n, a = parseInt(r.toFixed(i).replace(".", "")), s = parseInt(e.toFixed(i).replace(".", ""));
  return a % s / Math.pow(10, i);
}
class oe extends _ {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== d.number) {
      const a = this._getOrReturnCtx(e);
      return p(a, {
        code: f.invalid_type,
        expected: d.number,
        received: a.parsedType
      }), v;
    }
    let n;
    const i = new $();
    for (const a of this._def.checks)
      a.kind === "int" ? S.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.invalid_type,
        expected: "integer",
        received: "float",
        message: a.message
      }), i.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.too_small,
        minimum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), i.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.too_big,
        maximum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), i.dirty()) : a.kind === "multipleOf" ? Rn(e.data, a.value) !== 0 && (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), i.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.not_finite,
        message: a.message
      }), i.dirty()) : S.assertNever(a);
    return { status: i.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, y.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, y.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, y.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, y.toString(t));
  }
  setLimit(e, t, n, i) {
    return new oe({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: y.toString(i)
        }
      ]
    });
  }
  _addCheck(e) {
    return new oe({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: y.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: y.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: y.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: y.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: y.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: y.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: y.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: y.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: y.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && S.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf")
        return !0;
      n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
oe.create = (r) => new oe({
  checks: [],
  typeName: h.ZodNumber,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...g(r)
});
class ce extends _ {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== d.bigint) {
      const a = this._getOrReturnCtx(e);
      return p(a, {
        code: f.invalid_type,
        expected: d.bigint,
        received: a.parsedType
      }), v;
    }
    let n;
    const i = new $();
    for (const a of this._def.checks)
      a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.too_small,
        type: "bigint",
        minimum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), i.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.too_big,
        type: "bigint",
        maximum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), i.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), p(n, {
        code: f.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), i.dirty()) : S.assertNever(a);
    return { status: i.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, y.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, y.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, y.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, y.toString(t));
  }
  setLimit(e, t, n, i) {
    return new ce({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: y.toString(i)
        }
      ]
    });
  }
  _addCheck(e) {
    return new ce({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: y.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: y.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: y.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: y.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: y.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
ce.create = (r) => {
  var e;
  return new ce({
    checks: [],
    typeName: h.ZodBigInt,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...g(r)
  });
};
class Ge extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== d.boolean) {
      const n = this._getOrReturnCtx(e);
      return p(n, {
        code: f.invalid_type,
        expected: d.boolean,
        received: n.parsedType
      }), v;
    }
    return Z(e.data);
  }
}
Ge.create = (r) => new Ge({
  typeName: h.ZodBoolean,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...g(r)
});
class ge extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== d.date) {
      const a = this._getOrReturnCtx(e);
      return p(a, {
        code: f.invalid_type,
        expected: d.date,
        received: a.parsedType
      }), v;
    }
    if (isNaN(e.data.getTime())) {
      const a = this._getOrReturnCtx(e);
      return p(a, {
        code: f.invalid_date
      }), v;
    }
    const n = new $();
    let i;
    for (const a of this._def.checks)
      a.kind === "min" ? e.data.getTime() < a.value && (i = this._getOrReturnCtx(e, i), p(i, {
        code: f.too_small,
        message: a.message,
        inclusive: !0,
        exact: !1,
        minimum: a.value,
        type: "date"
      }), n.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (i = this._getOrReturnCtx(e, i), p(i, {
        code: f.too_big,
        message: a.message,
        inclusive: !0,
        exact: !1,
        maximum: a.value,
        type: "date"
      }), n.dirty()) : S.assertNever(a);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new ge({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: y.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: y.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
ge.create = (r) => new ge({
  checks: [],
  coerce: (r == null ? void 0 : r.coerce) || !1,
  typeName: h.ZodDate,
  ...g(r)
});
class gt extends _ {
  _parse(e) {
    if (this._getType(e) !== d.symbol) {
      const n = this._getOrReturnCtx(e);
      return p(n, {
        code: f.invalid_type,
        expected: d.symbol,
        received: n.parsedType
      }), v;
    }
    return Z(e.data);
  }
}
gt.create = (r) => new gt({
  typeName: h.ZodSymbol,
  ...g(r)
});
class He extends _ {
  _parse(e) {
    if (this._getType(e) !== d.undefined) {
      const n = this._getOrReturnCtx(e);
      return p(n, {
        code: f.invalid_type,
        expected: d.undefined,
        received: n.parsedType
      }), v;
    }
    return Z(e.data);
  }
}
He.create = (r) => new He({
  typeName: h.ZodUndefined,
  ...g(r)
});
class Ke extends _ {
  _parse(e) {
    if (this._getType(e) !== d.null) {
      const n = this._getOrReturnCtx(e);
      return p(n, {
        code: f.invalid_type,
        expected: d.null,
        received: n.parsedType
      }), v;
    }
    return Z(e.data);
  }
}
Ke.create = (r) => new Ke({
  typeName: h.ZodNull,
  ...g(r)
});
class Pe extends _ {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return Z(e.data);
  }
}
Pe.create = (r) => new Pe({
  typeName: h.ZodAny,
  ...g(r)
});
class he extends _ {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return Z(e.data);
  }
}
he.create = (r) => new he({
  typeName: h.ZodUnknown,
  ...g(r)
});
class J extends _ {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return p(t, {
      code: f.invalid_type,
      expected: d.never,
      received: t.parsedType
    }), v;
  }
}
J.create = (r) => new J({
  typeName: h.ZodNever,
  ...g(r)
});
class _t extends _ {
  _parse(e) {
    if (this._getType(e) !== d.undefined) {
      const n = this._getOrReturnCtx(e);
      return p(n, {
        code: f.invalid_type,
        expected: d.void,
        received: n.parsedType
      }), v;
    }
    return Z(e.data);
  }
}
_t.create = (r) => new _t({
  typeName: h.ZodVoid,
  ...g(r)
});
class L extends _ {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), i = this._def;
    if (t.parsedType !== d.array)
      return p(t, {
        code: f.invalid_type,
        expected: d.array,
        received: t.parsedType
      }), v;
    if (i.exactLength !== null) {
      const s = t.data.length > i.exactLength.value, o = t.data.length < i.exactLength.value;
      (s || o) && (p(t, {
        code: s ? f.too_big : f.too_small,
        minimum: o ? i.exactLength.value : void 0,
        maximum: s ? i.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: i.exactLength.message
      }), n.dirty());
    }
    if (i.minLength !== null && t.data.length < i.minLength.value && (p(t, {
      code: f.too_small,
      minimum: i.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: i.minLength.message
    }), n.dirty()), i.maxLength !== null && t.data.length > i.maxLength.value && (p(t, {
      code: f.too_big,
      maximum: i.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: i.maxLength.message
    }), n.dirty()), t.common.async)
      return Promise.all([...t.data].map((s, o) => i.type._parseAsync(new q(t, s, t.path, o)))).then((s) => $.mergeArray(n, s));
    const a = [...t.data].map((s, o) => i.type._parseSync(new q(t, s, t.path, o)));
    return $.mergeArray(n, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new L({
      ...this._def,
      minLength: { value: e, message: y.toString(t) }
    });
  }
  max(e, t) {
    return new L({
      ...this._def,
      maxLength: { value: e, message: y.toString(t) }
    });
  }
  length(e, t) {
    return new L({
      ...this._def,
      exactLength: { value: e, message: y.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
L.create = (r, e) => new L({
  type: r,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: h.ZodArray,
  ...g(e)
});
function Ee(r) {
  if (r instanceof T) {
    const e = {};
    for (const t in r.shape) {
      const n = r.shape[t];
      e[t] = Q.create(Ee(n));
    }
    return new T({
      ...r._def,
      shape: () => e
    });
  } else
    return r instanceof L ? new L({
      ...r._def,
      type: Ee(r.element)
    }) : r instanceof Q ? Q.create(Ee(r.unwrap())) : r instanceof be ? be.create(Ee(r.unwrap())) : r instanceof G ? G.create(r.items.map((e) => Ee(e))) : r;
}
class T extends _ {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = S.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== d.object) {
      const c = this._getOrReturnCtx(e);
      return p(c, {
        code: f.invalid_type,
        expected: d.object,
        received: c.parsedType
      }), v;
    }
    const { status: n, ctx: i } = this._processInputParams(e), { shape: a, keys: s } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof J && this._def.unknownKeys === "strip"))
      for (const c in i.data)
        s.includes(c) || o.push(c);
    const u = [];
    for (const c of s) {
      const l = a[c], m = i.data[c];
      u.push({
        key: { status: "valid", value: c },
        value: l._parse(new q(i, m, i.path, c)),
        alwaysSet: c in i.data
      });
    }
    if (this._def.catchall instanceof J) {
      const c = this._def.unknownKeys;
      if (c === "passthrough")
        for (const l of o)
          u.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: i.data[l] }
          });
      else if (c === "strict")
        o.length > 0 && (p(i, {
          code: f.unrecognized_keys,
          keys: o
        }), n.dirty());
      else if (c !== "strip")
        throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const c = this._def.catchall;
      for (const l of o) {
        const m = i.data[l];
        u.push({
          key: { status: "valid", value: l },
          value: c._parse(
            new q(i, m, i.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in i.data
        });
      }
    }
    return i.common.async ? Promise.resolve().then(async () => {
      const c = [];
      for (const l of u) {
        const m = await l.key;
        c.push({
          key: m,
          value: await l.value,
          alwaysSet: l.alwaysSet
        });
      }
      return c;
    }).then((c) => $.mergeObjectSync(n, c)) : $.mergeObjectSync(n, u);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return y.errToObj, new T({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, n) => {
          var i, a, s, o;
          const u = (s = (a = (i = this._def).errorMap) === null || a === void 0 ? void 0 : a.call(i, t, n).message) !== null && s !== void 0 ? s : n.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (o = y.errToObj(e).message) !== null && o !== void 0 ? o : u
          } : {
            message: u
          };
        }
      } : {}
    });
  }
  strip() {
    return new T({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new T({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new T({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new T({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: h.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new T({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    return S.objectKeys(e).forEach((n) => {
      e[n] && this.shape[n] && (t[n] = this.shape[n]);
    }), new T({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return S.objectKeys(this.shape).forEach((n) => {
      e[n] || (t[n] = this.shape[n]);
    }), new T({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return Ee(this);
  }
  partial(e) {
    const t = {};
    return S.objectKeys(this.shape).forEach((n) => {
      const i = this.shape[n];
      e && !e[n] ? t[n] = i : t[n] = i.optional();
    }), new T({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    return S.objectKeys(this.shape).forEach((n) => {
      if (e && !e[n])
        t[n] = this.shape[n];
      else {
        let a = this.shape[n];
        for (; a instanceof Q; )
          a = a._def.innerType;
        t[n] = a;
      }
    }), new T({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Br(S.objectKeys(this.shape));
  }
}
T.create = (r, e) => new T({
  shape: () => r,
  unknownKeys: "strip",
  catchall: J.create(),
  typeName: h.ZodObject,
  ...g(e)
});
T.strictCreate = (r, e) => new T({
  shape: () => r,
  unknownKeys: "strict",
  catchall: J.create(),
  typeName: h.ZodObject,
  ...g(e)
});
T.lazycreate = (r, e) => new T({
  shape: r,
  unknownKeys: "strip",
  catchall: J.create(),
  typeName: h.ZodObject,
  ...g(e)
});
class Qe extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = this._def.options;
    function i(a) {
      for (const o of a)
        if (o.result.status === "valid")
          return o.result;
      for (const o of a)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const s = a.map((o) => new B(o.ctx.common.issues));
      return p(t, {
        code: f.invalid_union,
        unionErrors: s
      }), v;
    }
    if (t.common.async)
      return Promise.all(n.map(async (a) => {
        const s = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await a._parseAsync({
            data: t.data,
            path: t.path,
            parent: s
          }),
          ctx: s
        };
      })).then(i);
    {
      let a;
      const s = [];
      for (const u of n) {
        const c = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, l = u._parseSync({
          data: t.data,
          path: t.path,
          parent: c
        });
        if (l.status === "valid")
          return l;
        l.status === "dirty" && !a && (a = { result: l, ctx: c }), c.common.issues.length && s.push(c.common.issues);
      }
      if (a)
        return t.common.issues.push(...a.ctx.common.issues), a.result;
      const o = s.map((u) => new B(u));
      return p(t, {
        code: f.invalid_union,
        unionErrors: o
      }), v;
    }
  }
  get options() {
    return this._def.options;
  }
}
Qe.create = (r, e) => new Qe({
  options: r,
  typeName: h.ZodUnion,
  ...g(e)
});
const dt = (r) => r instanceof Xe ? dt(r.schema) : r instanceof U ? dt(r.innerType()) : r instanceof et ? [r.value] : r instanceof ue ? r.options : r instanceof tt ? Object.keys(r.enum) : r instanceof rt ? dt(r._def.innerType) : r instanceof He ? [void 0] : r instanceof Ke ? [null] : null;
class Pt extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== d.object)
      return p(t, {
        code: f.invalid_type,
        expected: d.object,
        received: t.parsedType
      }), v;
    const n = this.discriminator, i = t.data[n], a = this.optionsMap.get(i);
    return a ? t.common.async ? a._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : a._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (p(t, {
      code: f.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [n]
    }), v);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(e, t, n) {
    const i = /* @__PURE__ */ new Map();
    for (const a of t) {
      const s = dt(a.shape[e]);
      if (!s)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const o of s) {
        if (i.has(o))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o)}`);
        i.set(o, a);
      }
    }
    return new Pt({
      typeName: h.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: i,
      ...g(n)
    });
  }
}
function Qt(r, e) {
  const t = ie(r), n = ie(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === d.object && n === d.object) {
    const i = S.objectKeys(e), a = S.objectKeys(r).filter((o) => i.indexOf(o) !== -1), s = { ...r, ...e };
    for (const o of a) {
      const u = Qt(r[o], e[o]);
      if (!u.valid)
        return { valid: !1 };
      s[o] = u.data;
    }
    return { valid: !0, data: s };
  } else if (t === d.array && n === d.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const i = [];
    for (let a = 0; a < r.length; a++) {
      const s = r[a], o = e[a], u = Qt(s, o);
      if (!u.valid)
        return { valid: !1 };
      i.push(u.data);
    }
    return { valid: !0, data: i };
  } else
    return t === d.date && n === d.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class Je extends _ {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), i = (a, s) => {
      if (Ht(a) || Ht(s))
        return v;
      const o = Qt(a.value, s.value);
      return o.valid ? ((Kt(a) || Kt(s)) && t.dirty(), { status: t.value, value: o.data }) : (p(n, {
        code: f.invalid_intersection_types
      }), v);
    };
    return n.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      }),
      this._def.right._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      })
    ]).then(([a, s]) => i(a, s)) : i(this._def.left._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }), this._def.right._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }));
  }
}
Je.create = (r, e, t) => new Je({
  left: r,
  right: e,
  typeName: h.ZodIntersection,
  ...g(t)
});
class G extends _ {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== d.array)
      return p(n, {
        code: f.invalid_type,
        expected: d.array,
        received: n.parsedType
      }), v;
    if (n.data.length < this._def.items.length)
      return p(n, {
        code: f.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), v;
    !this._def.rest && n.data.length > this._def.items.length && (p(n, {
      code: f.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const a = [...n.data].map((s, o) => {
      const u = this._def.items[o] || this._def.rest;
      return u ? u._parse(new q(n, s, n.path, o)) : null;
    }).filter((s) => !!s);
    return n.common.async ? Promise.all(a).then((s) => $.mergeArray(t, s)) : $.mergeArray(t, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new G({
      ...this._def,
      rest: e
    });
  }
}
G.create = (r, e) => {
  if (!Array.isArray(r))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new G({
    items: r,
    typeName: h.ZodTuple,
    rest: null,
    ...g(e)
  });
};
class Ye extends _ {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== d.object)
      return p(n, {
        code: f.invalid_type,
        expected: d.object,
        received: n.parsedType
      }), v;
    const i = [], a = this._def.keyType, s = this._def.valueType;
    for (const o in n.data)
      i.push({
        key: a._parse(new q(n, o, n.path, o)),
        value: s._parse(new q(n, n.data[o], n.path, o))
      });
    return n.common.async ? $.mergeObjectAsync(t, i) : $.mergeObjectSync(t, i);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, n) {
    return t instanceof _ ? new Ye({
      keyType: e,
      valueType: t,
      typeName: h.ZodRecord,
      ...g(n)
    }) : new Ye({
      keyType: F.create(),
      valueType: e,
      typeName: h.ZodRecord,
      ...g(t)
    });
  }
}
class bt extends _ {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== d.map)
      return p(n, {
        code: f.invalid_type,
        expected: d.map,
        received: n.parsedType
      }), v;
    const i = this._def.keyType, a = this._def.valueType, s = [...n.data.entries()].map(([o, u], c) => ({
      key: i._parse(new q(n, o, n.path, [c, "key"])),
      value: a._parse(new q(n, u, n.path, [c, "value"]))
    }));
    if (n.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const u of s) {
          const c = await u.key, l = await u.value;
          if (c.status === "aborted" || l.status === "aborted")
            return v;
          (c.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(c.value, l.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const u of s) {
        const c = u.key, l = u.value;
        if (c.status === "aborted" || l.status === "aborted")
          return v;
        (c.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(c.value, l.value);
      }
      return { status: t.value, value: o };
    }
  }
}
bt.create = (r, e, t) => new bt({
  valueType: e,
  keyType: r,
  typeName: h.ZodMap,
  ...g(t)
});
class _e extends _ {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== d.set)
      return p(n, {
        code: f.invalid_type,
        expected: d.set,
        received: n.parsedType
      }), v;
    const i = this._def;
    i.minSize !== null && n.data.size < i.minSize.value && (p(n, {
      code: f.too_small,
      minimum: i.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: i.minSize.message
    }), t.dirty()), i.maxSize !== null && n.data.size > i.maxSize.value && (p(n, {
      code: f.too_big,
      maximum: i.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: i.maxSize.message
    }), t.dirty());
    const a = this._def.valueType;
    function s(u) {
      const c = /* @__PURE__ */ new Set();
      for (const l of u) {
        if (l.status === "aborted")
          return v;
        l.status === "dirty" && t.dirty(), c.add(l.value);
      }
      return { status: t.value, value: c };
    }
    const o = [...n.data.values()].map((u, c) => a._parse(new q(n, u, n.path, c)));
    return n.common.async ? Promise.all(o).then((u) => s(u)) : s(o);
  }
  min(e, t) {
    return new _e({
      ...this._def,
      minSize: { value: e, message: y.toString(t) }
    });
  }
  max(e, t) {
    return new _e({
      ...this._def,
      maxSize: { value: e, message: y.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
_e.create = (r, e) => new _e({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: h.ZodSet,
  ...g(e)
});
class Ae extends _ {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== d.function)
      return p(t, {
        code: f.invalid_type,
        expected: d.function,
        received: t.parsedType
      }), v;
    function n(o, u) {
      return mt({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          ht(),
          ze
        ].filter((c) => !!c),
        issueData: {
          code: f.invalid_arguments,
          argumentsError: u
        }
      });
    }
    function i(o, u) {
      return mt({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          ht(),
          ze
        ].filter((c) => !!c),
        issueData: {
          code: f.invalid_return_type,
          returnTypeError: u
        }
      });
    }
    const a = { errorMap: t.common.contextualErrorMap }, s = t.data;
    if (this._def.returns instanceof Re) {
      const o = this;
      return Z(async function(...u) {
        const c = new B([]), l = await o._def.args.parseAsync(u, a).catch((k) => {
          throw c.addIssue(n(u, k)), c;
        }), m = await Reflect.apply(s, this, l);
        return await o._def.returns._def.type.parseAsync(m, a).catch((k) => {
          throw c.addIssue(i(m, k)), c;
        });
      });
    } else {
      const o = this;
      return Z(function(...u) {
        const c = o._def.args.safeParse(u, a);
        if (!c.success)
          throw new B([n(u, c.error)]);
        const l = Reflect.apply(s, this, c.data), m = o._def.returns.safeParse(l, a);
        if (!m.success)
          throw new B([i(l, m.error)]);
        return m.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new Ae({
      ...this._def,
      args: G.create(e).rest(he.create())
    });
  }
  returns(e) {
    return new Ae({
      ...this._def,
      returns: e
    });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, t, n) {
    return new Ae({
      args: e || G.create([]).rest(he.create()),
      returns: t || he.create(),
      typeName: h.ZodFunction,
      ...g(n)
    });
  }
}
class Xe extends _ {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
Xe.create = (r, e) => new Xe({
  getter: r,
  typeName: h.ZodLazy,
  ...g(e)
});
class et extends _ {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return p(t, {
        received: t.data,
        code: f.invalid_literal,
        expected: this._def.value
      }), v;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
et.create = (r, e) => new et({
  value: r,
  typeName: h.ZodLiteral,
  ...g(e)
});
function Br(r, e) {
  return new ue({
    values: r,
    typeName: h.ZodEnum,
    ...g(e)
  });
}
class ue extends _ {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return p(t, {
        expected: S.joinValues(n),
        received: t.parsedType,
        code: f.invalid_type
      }), v;
    }
    if (this._def.values.indexOf(e.data) === -1) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return p(t, {
        received: t.data,
        code: f.invalid_enum_value,
        options: n
      }), v;
    }
    return Z(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e) {
    return ue.create(e);
  }
  exclude(e) {
    return ue.create(this.options.filter((t) => !e.includes(t)));
  }
}
ue.create = Br;
class tt extends _ {
  _parse(e) {
    const t = S.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== d.string && n.parsedType !== d.number) {
      const i = S.objectValues(t);
      return p(n, {
        expected: S.joinValues(i),
        received: n.parsedType,
        code: f.invalid_type
      }), v;
    }
    if (t.indexOf(e.data) === -1) {
      const i = S.objectValues(t);
      return p(n, {
        received: n.data,
        code: f.invalid_enum_value,
        options: i
      }), v;
    }
    return Z(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
tt.create = (r, e) => new tt({
  values: r,
  typeName: h.ZodNativeEnum,
  ...g(e)
});
class Re extends _ {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== d.promise && t.common.async === !1)
      return p(t, {
        code: f.invalid_type,
        expected: d.promise,
        received: t.parsedType
      }), v;
    const n = t.parsedType === d.promise ? t.data : Promise.resolve(t.data);
    return Z(n.then((i) => this._def.type.parseAsync(i, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
Re.create = (r, e) => new Re({
  type: r,
  typeName: h.ZodPromise,
  ...g(e)
});
class U extends _ {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === h.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), i = this._def.effect || null, a = {
      addIssue: (s) => {
        p(n, s), s.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (a.addIssue = a.addIssue.bind(a), i.type === "preprocess") {
      const s = i.transform(n.data, a);
      return n.common.issues.length ? {
        status: "dirty",
        value: n.data
      } : n.common.async ? Promise.resolve(s).then((o) => this._def.schema._parseAsync({
        data: o,
        path: n.path,
        parent: n
      })) : this._def.schema._parseSync({
        data: s,
        path: n.path,
        parent: n
      });
    }
    if (i.type === "refinement") {
      const s = (o) => {
        const u = i.refinement(o, a);
        if (n.common.async)
          return Promise.resolve(u);
        if (u instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return o.status === "aborted" ? v : (o.status === "dirty" && t.dirty(), s(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => o.status === "aborted" ? v : (o.status === "dirty" && t.dirty(), s(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (i.type === "transform")
      if (n.common.async === !1) {
        const s = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!qe(s))
          return s;
        const o = i.transform(s.value, a);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((s) => qe(s) ? Promise.resolve(i.transform(s.value, a)).then((o) => ({ status: t.value, value: o })) : s);
    S.assertNever(i);
  }
}
U.create = (r, e, t) => new U({
  schema: r,
  typeName: h.ZodEffects,
  effect: e,
  ...g(t)
});
U.createWithPreprocess = (r, e, t) => new U({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: h.ZodEffects,
  ...g(t)
});
class Q extends _ {
  _parse(e) {
    return this._getType(e) === d.undefined ? Z(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Q.create = (r, e) => new Q({
  innerType: r,
  typeName: h.ZodOptional,
  ...g(e)
});
class be extends _ {
  _parse(e) {
    return this._getType(e) === d.null ? Z(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
be.create = (r, e) => new be({
  innerType: r,
  typeName: h.ZodNullable,
  ...g(e)
});
class rt extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === d.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
rt.create = (r, e) => new rt({
  innerType: r,
  typeName: h.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...g(e)
});
class wt extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, i = this._def.innerType._parse({
      data: n.data,
      path: n.path,
      parent: {
        ...n
      }
    });
    return vt(i) ? i.then((a) => ({
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new B(n.common.issues);
        },
        input: n.data
      })
    })) : {
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new B(n.common.issues);
        },
        input: n.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
wt.create = (r, e) => new wt({
  innerType: r,
  typeName: h.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...g(e)
});
class xt extends _ {
  _parse(e) {
    if (this._getType(e) !== d.nan) {
      const n = this._getOrReturnCtx(e);
      return p(n, {
        code: f.invalid_type,
        expected: d.nan,
        received: n.parsedType
      }), v;
    }
    return { status: "valid", value: e.data };
  }
}
xt.create = (r) => new xt({
  typeName: h.ZodNaN,
  ...g(r)
});
const Nn = Symbol("zod_brand");
class Lr extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = t.data;
    return this._def.type._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class at extends _ {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const a = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return a.status === "aborted" ? v : a.status === "dirty" ? (t.dirty(), Fr(a.value)) : this._def.out._parseAsync({
          data: a.value,
          path: n.path,
          parent: n
        });
      })();
    {
      const i = this._def.in._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return i.status === "aborted" ? v : i.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: i.value
      }) : this._def.out._parseSync({
        data: i.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, t) {
    return new at({
      in: e,
      out: t,
      typeName: h.ZodPipeline
    });
  }
}
class St extends _ {
  _parse(e) {
    const t = this._def.innerType._parse(e);
    return qe(t) && (t.value = Object.freeze(t.value)), t;
  }
}
St.create = (r, e) => new St({
  innerType: r,
  typeName: h.ZodReadonly,
  ...g(e)
});
const Ur = (r, e = {}, t) => r ? Pe.create().superRefine((n, i) => {
  var a, s;
  if (!r(n)) {
    const o = typeof e == "function" ? e(n) : typeof e == "string" ? { message: e } : e, u = (s = (a = o.fatal) !== null && a !== void 0 ? a : t) !== null && s !== void 0 ? s : !0, c = typeof o == "string" ? { message: o } : o;
    i.addIssue({ code: "custom", ...c, fatal: u });
  }
}) : Pe.create(), $n = {
  object: T.lazycreate
};
var h;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(h || (h = {}));
const Cn = (r, e = {
  message: `Input not instance of ${r.name}`
}) => Ur((t) => t instanceof r, e), Vr = F.create, Wr = oe.create, Zn = xt.create, Dn = ce.create, zr = Ge.create, Mn = ge.create, jn = gt.create, Fn = He.create, Bn = Ke.create, Ln = Pe.create, Un = he.create, Vn = J.create, Wn = _t.create, zn = L.create, qn = T.create, Gn = T.strictCreate, Hn = Qe.create, Kn = Pt.create, Qn = Je.create, Jn = G.create, Yn = Ye.create, Xn = bt.create, ea = _e.create, ta = Ae.create, ra = Xe.create, na = et.create, aa = ue.create, ia = tt.create, sa = Re.create, yr = U.create, oa = Q.create, ca = be.create, ua = U.createWithPreprocess, la = at.create, fa = () => Vr().optional(), da = () => Wr().optional(), pa = () => zr().optional(), ya = {
  string: (r) => F.create({ ...r, coerce: !0 }),
  number: (r) => oe.create({ ...r, coerce: !0 }),
  boolean: (r) => Ge.create({
    ...r,
    coerce: !0
  }),
  bigint: (r) => ce.create({ ...r, coerce: !0 }),
  date: (r) => ge.create({ ...r, coerce: !0 })
}, ha = v;
var E = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: ze,
  setErrorMap: _n,
  getErrorMap: ht,
  makeIssue: mt,
  EMPTY_PATH: bn,
  addIssueToContext: p,
  ParseStatus: $,
  INVALID: v,
  DIRTY: Fr,
  OK: Z,
  isAborted: Ht,
  isDirty: Kt,
  isValid: qe,
  isAsync: vt,
  get util() {
    return S;
  },
  get objectUtil() {
    return Gt;
  },
  ZodParsedType: d,
  getParsedType: ie,
  ZodType: _,
  ZodString: F,
  ZodNumber: oe,
  ZodBigInt: ce,
  ZodBoolean: Ge,
  ZodDate: ge,
  ZodSymbol: gt,
  ZodUndefined: He,
  ZodNull: Ke,
  ZodAny: Pe,
  ZodUnknown: he,
  ZodNever: J,
  ZodVoid: _t,
  ZodArray: L,
  ZodObject: T,
  ZodUnion: Qe,
  ZodDiscriminatedUnion: Pt,
  ZodIntersection: Je,
  ZodTuple: G,
  ZodRecord: Ye,
  ZodMap: bt,
  ZodSet: _e,
  ZodFunction: Ae,
  ZodLazy: Xe,
  ZodLiteral: et,
  ZodEnum: ue,
  ZodNativeEnum: tt,
  ZodPromise: Re,
  ZodEffects: U,
  ZodTransformer: U,
  ZodOptional: Q,
  ZodNullable: be,
  ZodDefault: rt,
  ZodCatch: wt,
  ZodNaN: xt,
  BRAND: Nn,
  ZodBranded: Lr,
  ZodPipeline: at,
  ZodReadonly: St,
  custom: Ur,
  Schema: _,
  ZodSchema: _,
  late: $n,
  get ZodFirstPartyTypeKind() {
    return h;
  },
  coerce: ya,
  any: Ln,
  array: zn,
  bigint: Dn,
  boolean: zr,
  date: Mn,
  discriminatedUnion: Kn,
  effect: yr,
  enum: aa,
  function: ta,
  instanceof: Cn,
  intersection: Qn,
  lazy: ra,
  literal: na,
  map: Xn,
  nan: Zn,
  nativeEnum: ia,
  never: Vn,
  null: Bn,
  nullable: ca,
  number: Wr,
  object: qn,
  oboolean: pa,
  onumber: da,
  optional: oa,
  ostring: fa,
  pipeline: la,
  preprocess: ua,
  promise: sa,
  record: Yn,
  set: ea,
  strictObject: Gn,
  string: Vr,
  symbol: jn,
  transformer: yr,
  tuple: Jn,
  undefined: Fn,
  union: Hn,
  unknown: Un,
  void: Wn,
  NEVER: ha,
  ZodIssueCode: f,
  quotelessJson: gn,
  ZodError: B
});
E.record(E.string(), E.boolean());
const qr = E.union([E.string(), E.number(), E.boolean()]), nt = E.record(
  E.unknown(),
  qr
), ma = E.object({
  _query: E.record(
    nt.keySchema,
    nt.valueSchema.or(E.array(qr))
  ).optional()
});
E.intersection(
  nt,
  ma
);
const va = E.object({
  uri: E.string(),
  domain: E.string().nullable(),
  wheres: nt
});
E.object({
  substituted: E.array(E.string()),
  url: E.string()
});
const ga = E.record(E.string(), va), _a = E.object({
  base: E.string(),
  defaults: nt,
  routes: ga
}), Gr = (r) => typeof r == "string" || r instanceof String, Zt = (r) => r == null ? !0 : (Gr(r) || (r = String(r)), r.trim().length === 0), Le = (r) => r.replace(/\/+$/, "");
var ye, H, K;
class ba {
  constructor(e, t, n) {
    Se(this, ye, void 0);
    Se(this, H, void 0);
    Se(this, K, void 0);
    Fe(this, ye, e), Fe(this, H, t), Fe(this, K, n);
  }
  /**
   * Retruns the route's origin
   */
  get origin() {
    if (!Zt(A(this, H).domain)) {
      const t = A(this, K).base.match(/^(http|https):\/\//);
      return Le(((t == null ? void 0 : t[0]) ?? "") + A(this, H).domain);
    }
    return A(this, K).config.absolute ? Le(A(this, K).origin) : "";
  }
  /**
   * Retruns the route's template
   */
  get template() {
    const e = Le(`${this.origin}/${A(this, H).uri}`);
    return Zt(e) ? "/" : e;
  }
  /**
   * Retruns the route's template expected parameters
   */
  get expects() {
    const e = {}, t = this.template.match(/{\w+\??}/g) ?? [];
    for (const n of t) {
      const i = n.replace(/\W/g, "");
      e[i] = n.includes("?") || (e[i] ?? !1);
    }
    return e;
  }
  /**
   * Return the compiled URI for this route, along with an array of substituted tokens.
   */
  compile(e) {
    var i;
    const t = new Array();
    if (Object.keys(this.expects).length < 1)
      return { substituted: t, url: this.template };
    let n = this.template;
    for (const a of Object.keys(this.expects)) {
      const s = this.expects[a];
      let o = (e == null ? void 0 : e[a]) ?? ((i = A(this, K).config.defaults) == null ? void 0 : i[a]) ?? "";
      typeof o == "boolean" && (o = o ? 1 : 0);
      const u = String(o);
      if (!s) {
        if (Zt(u))
          throw new Error(
            `Missing required parameter "${a}" for route "${A(this, ye)}"`
          );
        if (Object.hasOwn(A(this, H).wheres, a)) {
          const l = A(this, H).wheres[a];
          if (!new RegExp(`^${l}$`).test(u))
            throw new Error(
              `Parameter "${a}" for route "${A(this, ye)}" does not match format "${l}"`
            );
        }
      }
      const c = new RegExp(`{${a}\\??}`, "g");
      if (c.test(n)) {
        const l = encodeURIComponent(u);
        if (n = Le(n.replace(c, l)), t.push(a), /\/|%2F/g.test(l)) {
          const m = `Character "/" or sequence "%2F" in parameter "${a}" for route "${A(this, ye)}" might cause routing issues.`;
          if (A(this, K).config.strict)
            throw new Error(
              m + `
	An error was thrown because you enabled strict mode.
`
            );
          console.warn(m);
        }
      }
    }
    return { substituted: t, url: n };
  }
}
ye = new WeakMap(), H = new WeakMap(), K = new WeakMap();
var wa = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function xa(r) {
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
    var i = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(t, n, i.get ? i : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), t;
}
var Sa = Error, ka = EvalError, Oa = RangeError, Ea = ReferenceError, Hr = SyntaxError, it = TypeError, Ta = URIError, Aa = function() {
  if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
    return !1;
  if (typeof Symbol.iterator == "symbol")
    return !0;
  var e = {}, t = Symbol("test"), n = Object(t);
  if (typeof t == "string" || Object.prototype.toString.call(t) !== "[object Symbol]" || Object.prototype.toString.call(n) !== "[object Symbol]")
    return !1;
  var i = 42;
  e[t] = i;
  for (t in e)
    return !1;
  if (typeof Object.keys == "function" && Object.keys(e).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(e).length !== 0)
    return !1;
  var a = Object.getOwnPropertySymbols(e);
  if (a.length !== 1 || a[0] !== t || !Object.prototype.propertyIsEnumerable.call(e, t))
    return !1;
  if (typeof Object.getOwnPropertyDescriptor == "function") {
    var s = Object.getOwnPropertyDescriptor(e, t);
    if (s.value !== i || s.enumerable !== !0)
      return !1;
  }
  return !0;
}, hr = typeof Symbol < "u" && Symbol, Ia = Aa, Pa = function() {
  return typeof hr != "function" || typeof Symbol != "function" || typeof hr("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : Ia();
}, Dt = {
  __proto__: null,
  foo: {}
}, Ra = Object, Na = function() {
  return { __proto__: Dt }.foo === Dt.foo && !(Dt instanceof Ra);
}, $a = "Function.prototype.bind called on incompatible ", Ca = Object.prototype.toString, Za = Math.max, Da = "[object Function]", mr = function(e, t) {
  for (var n = [], i = 0; i < e.length; i += 1)
    n[i] = e[i];
  for (var a = 0; a < t.length; a += 1)
    n[a + e.length] = t[a];
  return n;
}, Ma = function(e, t) {
  for (var n = [], i = t || 0, a = 0; i < e.length; i += 1, a += 1)
    n[a] = e[i];
  return n;
}, ja = function(r, e) {
  for (var t = "", n = 0; n < r.length; n += 1)
    t += r[n], n + 1 < r.length && (t += e);
  return t;
}, Fa = function(e) {
  var t = this;
  if (typeof t != "function" || Ca.apply(t) !== Da)
    throw new TypeError($a + t);
  for (var n = Ma(arguments, 1), i, a = function() {
    if (this instanceof i) {
      var l = t.apply(
        this,
        mr(n, arguments)
      );
      return Object(l) === l ? l : this;
    }
    return t.apply(
      e,
      mr(n, arguments)
    );
  }, s = Za(0, t.length - n.length), o = [], u = 0; u < s; u++)
    o[u] = "$" + u;
  if (i = Function("binder", "return function (" + ja(o, ",") + "){ return binder.apply(this,arguments); }")(a), t.prototype) {
    var c = function() {
    };
    c.prototype = t.prototype, i.prototype = new c(), c.prototype = null;
  }
  return i;
}, Ba = Fa, ar = Function.prototype.bind || Ba, La = Function.prototype.call, Ua = Object.prototype.hasOwnProperty, Va = ar, Wa = Va.call(La, Ua), w, za = Sa, qa = ka, Ga = Oa, Ha = Ea, Ne = Hr, Ie = it, Ka = Ta, Kr = Function, Mt = function(r) {
  try {
    return Kr('"use strict"; return (' + r + ").constructor;")();
  } catch {
  }
}, me = Object.getOwnPropertyDescriptor;
if (me)
  try {
    me({}, "");
  } catch {
    me = null;
  }
var jt = function() {
  throw new Ie();
}, Qa = me ? function() {
  try {
    return arguments.callee, jt;
  } catch {
    try {
      return me(arguments, "callee").get;
    } catch {
      return jt;
    }
  }
}() : jt, ke = Pa(), Ja = Na(), R = Object.getPrototypeOf || (Ja ? function(r) {
  return r.__proto__;
} : null), Te = {}, Ya = typeof Uint8Array > "u" || !R ? w : R(Uint8Array), ve = {
  __proto__: null,
  "%AggregateError%": typeof AggregateError > "u" ? w : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? w : ArrayBuffer,
  "%ArrayIteratorPrototype%": ke && R ? R([][Symbol.iterator]()) : w,
  "%AsyncFromSyncIteratorPrototype%": w,
  "%AsyncFunction%": Te,
  "%AsyncGenerator%": Te,
  "%AsyncGeneratorFunction%": Te,
  "%AsyncIteratorPrototype%": Te,
  "%Atomics%": typeof Atomics > "u" ? w : Atomics,
  "%BigInt%": typeof BigInt > "u" ? w : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? w : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? w : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? w : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": za,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": qa,
  "%Float32Array%": typeof Float32Array > "u" ? w : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? w : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? w : FinalizationRegistry,
  "%Function%": Kr,
  "%GeneratorFunction%": Te,
  "%Int8Array%": typeof Int8Array > "u" ? w : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? w : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? w : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": ke && R ? R(R([][Symbol.iterator]())) : w,
  "%JSON%": typeof JSON == "object" ? JSON : w,
  "%Map%": typeof Map > "u" ? w : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !ke || !R ? w : R((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? w : Promise,
  "%Proxy%": typeof Proxy > "u" ? w : Proxy,
  "%RangeError%": Ga,
  "%ReferenceError%": Ha,
  "%Reflect%": typeof Reflect > "u" ? w : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? w : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !ke || !R ? w : R((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? w : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": ke && R ? R(""[Symbol.iterator]()) : w,
  "%Symbol%": ke ? Symbol : w,
  "%SyntaxError%": Ne,
  "%ThrowTypeError%": Qa,
  "%TypedArray%": Ya,
  "%TypeError%": Ie,
  "%Uint8Array%": typeof Uint8Array > "u" ? w : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? w : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? w : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? w : Uint32Array,
  "%URIError%": Ka,
  "%WeakMap%": typeof WeakMap > "u" ? w : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? w : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? w : WeakSet
};
if (R)
  try {
    null.error;
  } catch (r) {
    var Xa = R(R(r));
    ve["%Error.prototype%"] = Xa;
  }
var ei = function r(e) {
  var t;
  if (e === "%AsyncFunction%")
    t = Mt("async function () {}");
  else if (e === "%GeneratorFunction%")
    t = Mt("function* () {}");
  else if (e === "%AsyncGeneratorFunction%")
    t = Mt("async function* () {}");
  else if (e === "%AsyncGenerator%") {
    var n = r("%AsyncGeneratorFunction%");
    n && (t = n.prototype);
  } else if (e === "%AsyncIteratorPrototype%") {
    var i = r("%AsyncGenerator%");
    i && R && (t = R(i.prototype));
  }
  return ve[e] = t, t;
}, vr = {
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
}, st = ar, kt = Wa, ti = st.call(Function.call, Array.prototype.concat), ri = st.call(Function.apply, Array.prototype.splice), gr = st.call(Function.call, String.prototype.replace), Ot = st.call(Function.call, String.prototype.slice), ni = st.call(Function.call, RegExp.prototype.exec), ai = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, ii = /\\(\\)?/g, si = function(e) {
  var t = Ot(e, 0, 1), n = Ot(e, -1);
  if (t === "%" && n !== "%")
    throw new Ne("invalid intrinsic syntax, expected closing `%`");
  if (n === "%" && t !== "%")
    throw new Ne("invalid intrinsic syntax, expected opening `%`");
  var i = [];
  return gr(e, ai, function(a, s, o, u) {
    i[i.length] = o ? gr(u, ii, "$1") : s || a;
  }), i;
}, oi = function(e, t) {
  var n = e, i;
  if (kt(vr, n) && (i = vr[n], n = "%" + i[0] + "%"), kt(ve, n)) {
    var a = ve[n];
    if (a === Te && (a = ei(n)), typeof a > "u" && !t)
      throw new Ie("intrinsic " + e + " exists, but is not available. Please file an issue!");
    return {
      alias: i,
      name: n,
      value: a
    };
  }
  throw new Ne("intrinsic " + e + " does not exist!");
}, Ze = function(e, t) {
  if (typeof e != "string" || e.length === 0)
    throw new Ie("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof t != "boolean")
    throw new Ie('"allowMissing" argument must be a boolean');
  if (ni(/^%?[^%]*%?$/, e) === null)
    throw new Ne("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var n = si(e), i = n.length > 0 ? n[0] : "", a = oi("%" + i + "%", t), s = a.name, o = a.value, u = !1, c = a.alias;
  c && (i = c[0], ri(n, ti([0, 1], c)));
  for (var l = 1, m = !0; l < n.length; l += 1) {
    var b = n[l], k = Ot(b, 0, 1), O = Ot(b, -1);
    if ((k === '"' || k === "'" || k === "`" || O === '"' || O === "'" || O === "`") && k !== O)
      throw new Ne("property names with quotes must have matching quotes");
    if ((b === "constructor" || !m) && (u = !0), i += "." + b, s = "%" + i + "%", kt(ve, s))
      o = ve[s];
    else if (o != null) {
      if (!(b in o)) {
        if (!t)
          throw new Ie("base intrinsic for " + e + " exists, but the property is not available.");
        return;
      }
      if (me && l + 1 >= n.length) {
        var N = me(o, b);
        m = !!N, m && "get" in N && !("originalValue" in N.get) ? o = N.get : o = o[b];
      } else
        m = kt(o, b), o = o[b];
      m && !u && (ve[s] = o);
    }
  }
  return o;
}, Qr = { exports: {} }, Ft, _r;
function ir() {
  if (_r)
    return Ft;
  _r = 1;
  var r = Ze, e = r("%Object.defineProperty%", !0) || !1;
  if (e)
    try {
      e({}, "a", { value: 1 });
    } catch {
      e = !1;
    }
  return Ft = e, Ft;
}
var ci = Ze, pt = ci("%Object.getOwnPropertyDescriptor%", !0);
if (pt)
  try {
    pt([], "length");
  } catch {
    pt = null;
  }
var Jr = pt, br = ir(), ui = Hr, Oe = it, wr = Jr, li = function(e, t, n) {
  if (!e || typeof e != "object" && typeof e != "function")
    throw new Oe("`obj` must be an object or a function`");
  if (typeof t != "string" && typeof t != "symbol")
    throw new Oe("`property` must be a string or a symbol`");
  if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
    throw new Oe("`nonEnumerable`, if provided, must be a boolean or null");
  if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
    throw new Oe("`nonWritable`, if provided, must be a boolean or null");
  if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
    throw new Oe("`nonConfigurable`, if provided, must be a boolean or null");
  if (arguments.length > 6 && typeof arguments[6] != "boolean")
    throw new Oe("`loose`, if provided, must be a boolean");
  var i = arguments.length > 3 ? arguments[3] : null, a = arguments.length > 4 ? arguments[4] : null, s = arguments.length > 5 ? arguments[5] : null, o = arguments.length > 6 ? arguments[6] : !1, u = !!wr && wr(e, t);
  if (br)
    br(e, t, {
      configurable: s === null && u ? u.configurable : !s,
      enumerable: i === null && u ? u.enumerable : !i,
      value: n,
      writable: a === null && u ? u.writable : !a
    });
  else if (o || !i && !a && !s)
    e[t] = n;
  else
    throw new ui("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
}, Jt = ir(), Yr = function() {
  return !!Jt;
};
Yr.hasArrayLengthDefineBug = function() {
  if (!Jt)
    return null;
  try {
    return Jt([], "length", { value: 1 }).length !== 1;
  } catch {
    return !0;
  }
};
var fi = Yr, di = Ze, xr = li, pi = fi(), Sr = Jr, kr = it, yi = di("%Math.floor%"), hi = function(e, t) {
  if (typeof e != "function")
    throw new kr("`fn` is not a function");
  if (typeof t != "number" || t < 0 || t > 4294967295 || yi(t) !== t)
    throw new kr("`length` must be a positive 32-bit integer");
  var n = arguments.length > 2 && !!arguments[2], i = !0, a = !0;
  if ("length" in e && Sr) {
    var s = Sr(e, "length");
    s && !s.configurable && (i = !1), s && !s.writable && (a = !1);
  }
  return (i || a || !n) && (pi ? xr(
    /** @type {Parameters<define>[0]} */
    e,
    "length",
    t,
    !0,
    !0
  ) : xr(
    /** @type {Parameters<define>[0]} */
    e,
    "length",
    t
  )), e;
};
(function(r) {
  var e = ar, t = Ze, n = hi, i = it, a = t("%Function.prototype.apply%"), s = t("%Function.prototype.call%"), o = t("%Reflect.apply%", !0) || e.call(s, a), u = ir(), c = t("%Math.max%");
  r.exports = function(b) {
    if (typeof b != "function")
      throw new i("a function is required");
    var k = o(e, s, arguments);
    return n(
      k,
      1 + c(0, b.length - (arguments.length - 1)),
      !0
    );
  };
  var l = function() {
    return o(e, a, arguments);
  };
  u ? u(r.exports, "apply", { value: l }) : r.exports.apply = l;
})(Qr);
var mi = Qr.exports, Xr = Ze, en = mi, vi = en(Xr("String.prototype.indexOf")), gi = function(e, t) {
  var n = Xr(e, !!t);
  return typeof n == "function" && vi(e, ".prototype.") > -1 ? en(n) : n;
};
const _i = {}, bi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _i
}, Symbol.toStringTag, { value: "Module" })), wi = /* @__PURE__ */ xa(bi);
var sr = typeof Map == "function" && Map.prototype, Bt = Object.getOwnPropertyDescriptor && sr ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, Et = sr && Bt && typeof Bt.get == "function" ? Bt.get : null, Or = sr && Map.prototype.forEach, or = typeof Set == "function" && Set.prototype, Lt = Object.getOwnPropertyDescriptor && or ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, Tt = or && Lt && typeof Lt.get == "function" ? Lt.get : null, Er = or && Set.prototype.forEach, xi = typeof WeakMap == "function" && WeakMap.prototype, Ue = xi ? WeakMap.prototype.has : null, Si = typeof WeakSet == "function" && WeakSet.prototype, Ve = Si ? WeakSet.prototype.has : null, ki = typeof WeakRef == "function" && WeakRef.prototype, Tr = ki ? WeakRef.prototype.deref : null, Oi = Boolean.prototype.valueOf, Ei = Object.prototype.toString, Ti = Function.prototype.toString, Ai = String.prototype.match, cr = String.prototype.slice, se = String.prototype.replace, Ii = String.prototype.toUpperCase, Ar = String.prototype.toLowerCase, tn = RegExp.prototype.test, Ir = Array.prototype.concat, z = Array.prototype.join, Pi = Array.prototype.slice, Pr = Math.floor, Yt = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, Ut = Object.getOwnPropertySymbols, Xt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, $e = typeof Symbol == "function" && typeof Symbol.iterator == "object", C = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === $e || !0) ? Symbol.toStringTag : null, rn = Object.prototype.propertyIsEnumerable, Rr = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(r) {
  return r.__proto__;
} : null);
function Nr(r, e) {
  if (r === 1 / 0 || r === -1 / 0 || r !== r || r && r > -1e3 && r < 1e3 || tn.call(/e/, e))
    return e;
  var t = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof r == "number") {
    var n = r < 0 ? -Pr(-r) : Pr(r);
    if (n !== r) {
      var i = String(n), a = cr.call(e, i.length + 1);
      return se.call(i, t, "$&_") + "." + se.call(se.call(a, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return se.call(e, t, "$&_");
}
var er = wi, $r = er.custom, Cr = an($r) ? $r : null, Ri = function r(e, t, n, i) {
  var a = t || {};
  if (ae(a, "quoteStyle") && a.quoteStyle !== "single" && a.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (ae(a, "maxStringLength") && (typeof a.maxStringLength == "number" ? a.maxStringLength < 0 && a.maxStringLength !== 1 / 0 : a.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var s = ae(a, "customInspect") ? a.customInspect : !0;
  if (typeof s != "boolean" && s !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (ae(a, "indent") && a.indent !== null && a.indent !== "	" && !(parseInt(a.indent, 10) === a.indent && a.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (ae(a, "numericSeparator") && typeof a.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var o = a.numericSeparator;
  if (typeof e > "u")
    return "undefined";
  if (e === null)
    return "null";
  if (typeof e == "boolean")
    return e ? "true" : "false";
  if (typeof e == "string")
    return on(e, a);
  if (typeof e == "number") {
    if (e === 0)
      return 1 / 0 / e > 0 ? "0" : "-0";
    var u = String(e);
    return o ? Nr(e, u) : u;
  }
  if (typeof e == "bigint") {
    var c = String(e) + "n";
    return o ? Nr(e, c) : c;
  }
  var l = typeof a.depth > "u" ? 5 : a.depth;
  if (typeof n > "u" && (n = 0), n >= l && l > 0 && typeof e == "object")
    return tr(e) ? "[Array]" : "[Object]";
  var m = Ki(a, n);
  if (typeof i > "u")
    i = [];
  else if (sn(i, e) >= 0)
    return "[Circular]";
  function b(M, re, ne) {
    if (re && (i = Pi.call(i), i.push(re)), ne) {
      var je = {
        depth: a.depth
      };
      return ae(a, "quoteStyle") && (je.quoteStyle = a.quoteStyle), r(M, je, n + 1, i);
    }
    return r(M, a, n + 1, i);
  }
  if (typeof e == "function" && !Zr(e)) {
    var k = Bi(e), O = ut(e, b);
    return "[Function" + (k ? ": " + k : " (anonymous)") + "]" + (O.length > 0 ? " { " + z.call(O, ", ") + " }" : "");
  }
  if (an(e)) {
    var N = $e ? se.call(String(e), /^(Symbol\(.*\))_[^)]*$/, "$1") : Xt.call(e);
    return typeof e == "object" && !$e ? Be(N) : N;
  }
  if (qi(e)) {
    for (var D = "<" + Ar.call(String(e.nodeName)), Y = e.attributes || [], X = 0; X < Y.length; X++)
      D += " " + Y[X].name + "=" + nn(Ni(Y[X].value), "double", a);
    return D += ">", e.childNodes && e.childNodes.length && (D += "..."), D += "</" + Ar.call(String(e.nodeName)) + ">", D;
  }
  if (tr(e)) {
    if (e.length === 0)
      return "[]";
    var x = ut(e, b);
    return m && !Hi(x) ? "[" + rr(x, m) + "]" : "[ " + z.call(x, ", ") + " ]";
  }
  if (Ci(e)) {
    var ee = ut(e, b);
    return !("cause" in Error.prototype) && "cause" in e && !rn.call(e, "cause") ? "{ [" + String(e) + "] " + z.call(Ir.call("[cause]: " + b(e.cause), ee), ", ") + " }" : ee.length === 0 ? "[" + String(e) + "]" : "{ [" + String(e) + "] " + z.call(ee, ", ") + " }";
  }
  if (typeof e == "object" && s) {
    if (Cr && typeof e[Cr] == "function" && er)
      return er(e, { depth: l - n });
    if (s !== "symbol" && typeof e.inspect == "function")
      return e.inspect();
  }
  if (Li(e)) {
    var fe = [];
    return Or && Or.call(e, function(M, re) {
      fe.push(b(re, e, !0) + " => " + b(M, e));
    }), Dr("Map", Et.call(e), fe, m);
  }
  if (Wi(e)) {
    var Me = [];
    return Er && Er.call(e, function(M) {
      Me.push(b(M, e));
    }), Dr("Set", Tt.call(e), Me, m);
  }
  if (Ui(e))
    return Vt("WeakMap");
  if (zi(e))
    return Vt("WeakSet");
  if (Vi(e))
    return Vt("WeakRef");
  if (Di(e))
    return Be(b(Number(e)));
  if (ji(e))
    return Be(b(Yt.call(e)));
  if (Mi(e))
    return Be(Oi.call(e));
  if (Zi(e))
    return Be(b(String(e)));
  if (typeof window < "u" && e === window)
    return "{ [object Window] }";
  if (e === wa)
    return "{ [object globalThis] }";
  if (!$i(e) && !Zr(e)) {
    var we = ut(e, b), ot = Rr ? Rr(e) === Object.prototype : e instanceof Object || e.constructor === Object, de = e instanceof Object ? "" : "null prototype", te = !ot && C && Object(e) === e && C in e ? cr.call(le(e), 8, -1) : de ? "Object" : "", ct = ot || typeof e.constructor != "function" ? "" : e.constructor.name ? e.constructor.name + " " : "", xe = ct + (te || de ? "[" + z.call(Ir.call([], te || [], de || []), ": ") + "] " : "");
    return we.length === 0 ? xe + "{}" : m ? xe + "{" + rr(we, m) + "}" : xe + "{ " + z.call(we, ", ") + " }";
  }
  return String(e);
};
function nn(r, e, t) {
  var n = (t.quoteStyle || e) === "double" ? '"' : "'";
  return n + r + n;
}
function Ni(r) {
  return se.call(String(r), /"/g, "&quot;");
}
function tr(r) {
  return le(r) === "[object Array]" && (!C || !(typeof r == "object" && C in r));
}
function $i(r) {
  return le(r) === "[object Date]" && (!C || !(typeof r == "object" && C in r));
}
function Zr(r) {
  return le(r) === "[object RegExp]" && (!C || !(typeof r == "object" && C in r));
}
function Ci(r) {
  return le(r) === "[object Error]" && (!C || !(typeof r == "object" && C in r));
}
function Zi(r) {
  return le(r) === "[object String]" && (!C || !(typeof r == "object" && C in r));
}
function Di(r) {
  return le(r) === "[object Number]" && (!C || !(typeof r == "object" && C in r));
}
function Mi(r) {
  return le(r) === "[object Boolean]" && (!C || !(typeof r == "object" && C in r));
}
function an(r) {
  if ($e)
    return r && typeof r == "object" && r instanceof Symbol;
  if (typeof r == "symbol")
    return !0;
  if (!r || typeof r != "object" || !Xt)
    return !1;
  try {
    return Xt.call(r), !0;
  } catch {
  }
  return !1;
}
function ji(r) {
  if (!r || typeof r != "object" || !Yt)
    return !1;
  try {
    return Yt.call(r), !0;
  } catch {
  }
  return !1;
}
var Fi = Object.prototype.hasOwnProperty || function(r) {
  return r in this;
};
function ae(r, e) {
  return Fi.call(r, e);
}
function le(r) {
  return Ei.call(r);
}
function Bi(r) {
  if (r.name)
    return r.name;
  var e = Ai.call(Ti.call(r), /^function\s*([\w$]+)/);
  return e ? e[1] : null;
}
function sn(r, e) {
  if (r.indexOf)
    return r.indexOf(e);
  for (var t = 0, n = r.length; t < n; t++)
    if (r[t] === e)
      return t;
  return -1;
}
function Li(r) {
  if (!Et || !r || typeof r != "object")
    return !1;
  try {
    Et.call(r);
    try {
      Tt.call(r);
    } catch {
      return !0;
    }
    return r instanceof Map;
  } catch {
  }
  return !1;
}
function Ui(r) {
  if (!Ue || !r || typeof r != "object")
    return !1;
  try {
    Ue.call(r, Ue);
    try {
      Ve.call(r, Ve);
    } catch {
      return !0;
    }
    return r instanceof WeakMap;
  } catch {
  }
  return !1;
}
function Vi(r) {
  if (!Tr || !r || typeof r != "object")
    return !1;
  try {
    return Tr.call(r), !0;
  } catch {
  }
  return !1;
}
function Wi(r) {
  if (!Tt || !r || typeof r != "object")
    return !1;
  try {
    Tt.call(r);
    try {
      Et.call(r);
    } catch {
      return !0;
    }
    return r instanceof Set;
  } catch {
  }
  return !1;
}
function zi(r) {
  if (!Ve || !r || typeof r != "object")
    return !1;
  try {
    Ve.call(r, Ve);
    try {
      Ue.call(r, Ue);
    } catch {
      return !0;
    }
    return r instanceof WeakSet;
  } catch {
  }
  return !1;
}
function qi(r) {
  return !r || typeof r != "object" ? !1 : typeof HTMLElement < "u" && r instanceof HTMLElement ? !0 : typeof r.nodeName == "string" && typeof r.getAttribute == "function";
}
function on(r, e) {
  if (r.length > e.maxStringLength) {
    var t = r.length - e.maxStringLength, n = "... " + t + " more character" + (t > 1 ? "s" : "");
    return on(cr.call(r, 0, e.maxStringLength), e) + n;
  }
  var i = se.call(se.call(r, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, Gi);
  return nn(i, "single", e);
}
function Gi(r) {
  var e = r.charCodeAt(0), t = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[e];
  return t ? "\\" + t : "\\x" + (e < 16 ? "0" : "") + Ii.call(e.toString(16));
}
function Be(r) {
  return "Object(" + r + ")";
}
function Vt(r) {
  return r + " { ? }";
}
function Dr(r, e, t, n) {
  var i = n ? rr(t, n) : z.call(t, ", ");
  return r + " (" + e + ") {" + i + "}";
}
function Hi(r) {
  for (var e = 0; e < r.length; e++)
    if (sn(r[e], `
`) >= 0)
      return !1;
  return !0;
}
function Ki(r, e) {
  var t;
  if (r.indent === "	")
    t = "	";
  else if (typeof r.indent == "number" && r.indent > 0)
    t = z.call(Array(r.indent + 1), " ");
  else
    return null;
  return {
    base: t,
    prev: z.call(Array(e + 1), t)
  };
}
function rr(r, e) {
  if (r.length === 0)
    return "";
  var t = `
` + e.prev + e.base;
  return t + z.call(r, "," + t) + `
` + e.prev;
}
function ut(r, e) {
  var t = tr(r), n = [];
  if (t) {
    n.length = r.length;
    for (var i = 0; i < r.length; i++)
      n[i] = ae(r, i) ? e(r[i], r) : "";
  }
  var a = typeof Ut == "function" ? Ut(r) : [], s;
  if ($e) {
    s = {};
    for (var o = 0; o < a.length; o++)
      s["$" + a[o]] = a[o];
  }
  for (var u in r)
    ae(r, u) && (t && String(Number(u)) === u && u < r.length || $e && s["$" + u] instanceof Symbol || (tn.call(/[^\w$]/, u) ? n.push(e(u, r) + ": " + e(r[u], r)) : n.push(u + ": " + e(r[u], r))));
  if (typeof Ut == "function")
    for (var c = 0; c < a.length; c++)
      rn.call(r, a[c]) && n.push("[" + e(a[c]) + "]: " + e(r[a[c]], r));
  return n;
}
var cn = Ze, De = gi, Qi = Ri, Ji = it, lt = cn("%WeakMap%", !0), ft = cn("%Map%", !0), Yi = De("WeakMap.prototype.get", !0), Xi = De("WeakMap.prototype.set", !0), es = De("WeakMap.prototype.has", !0), ts = De("Map.prototype.get", !0), rs = De("Map.prototype.set", !0), ns = De("Map.prototype.has", !0), ur = function(r, e) {
  for (var t = r, n; (n = t.next) !== null; t = n)
    if (n.key === e)
      return t.next = n.next, n.next = /** @type {NonNullable<typeof list.next>} */
      r.next, r.next = n, n;
}, as = function(r, e) {
  var t = ur(r, e);
  return t && t.value;
}, is = function(r, e, t) {
  var n = ur(r, e);
  n ? n.value = t : r.next = /** @type {import('.').ListNode<typeof value>} */
  {
    // eslint-disable-line no-param-reassign, no-extra-parens
    key: e,
    next: r.next,
    value: t
  };
}, ss = function(r, e) {
  return !!ur(r, e);
}, os = function() {
  var e, t, n, i = {
    assert: function(a) {
      if (!i.has(a))
        throw new Ji("Side channel does not contain " + Qi(a));
    },
    get: function(a) {
      if (lt && a && (typeof a == "object" || typeof a == "function")) {
        if (e)
          return Yi(e, a);
      } else if (ft) {
        if (t)
          return ts(t, a);
      } else if (n)
        return as(n, a);
    },
    has: function(a) {
      if (lt && a && (typeof a == "object" || typeof a == "function")) {
        if (e)
          return es(e, a);
      } else if (ft) {
        if (t)
          return ns(t, a);
      } else if (n)
        return ss(n, a);
      return !1;
    },
    set: function(a, s) {
      lt && a && (typeof a == "object" || typeof a == "function") ? (e || (e = new lt()), Xi(e, a, s)) : ft ? (t || (t = new ft()), rs(t, a, s)) : (n || (n = { key: {}, next: null }), is(n, a, s));
    }
  };
  return i;
}, cs = String.prototype.replace, us = /%20/g, Wt = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, lr = {
  default: Wt.RFC3986,
  formatters: {
    RFC1738: function(r) {
      return cs.call(r, us, "+");
    },
    RFC3986: function(r) {
      return String(r);
    }
  },
  RFC1738: Wt.RFC1738,
  RFC3986: Wt.RFC3986
}, ls = lr, zt = Object.prototype.hasOwnProperty, pe = Array.isArray, V = function() {
  for (var r = [], e = 0; e < 256; ++e)
    r.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return r;
}(), fs = function(e) {
  for (; e.length > 1; ) {
    var t = e.pop(), n = t.obj[t.prop];
    if (pe(n)) {
      for (var i = [], a = 0; a < n.length; ++a)
        typeof n[a] < "u" && i.push(n[a]);
      t.obj[t.prop] = i;
    }
  }
}, un = function(e, t) {
  for (var n = t && t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, i = 0; i < e.length; ++i)
    typeof e[i] < "u" && (n[i] = e[i]);
  return n;
}, ds = function r(e, t, n) {
  if (!t)
    return e;
  if (typeof t != "object") {
    if (pe(e))
      e.push(t);
    else if (e && typeof e == "object")
      (n && (n.plainObjects || n.allowPrototypes) || !zt.call(Object.prototype, t)) && (e[t] = !0);
    else
      return [e, t];
    return e;
  }
  if (!e || typeof e != "object")
    return [e].concat(t);
  var i = e;
  return pe(e) && !pe(t) && (i = un(e, n)), pe(e) && pe(t) ? (t.forEach(function(a, s) {
    if (zt.call(e, s)) {
      var o = e[s];
      o && typeof o == "object" && a && typeof a == "object" ? e[s] = r(o, a, n) : e.push(a);
    } else
      e[s] = a;
  }), e) : Object.keys(t).reduce(function(a, s) {
    var o = t[s];
    return zt.call(a, s) ? a[s] = r(a[s], o, n) : a[s] = o, a;
  }, i);
}, ps = function(e, t) {
  return Object.keys(t).reduce(function(n, i) {
    return n[i] = t[i], n;
  }, e);
}, ys = function(r, e, t) {
  var n = r.replace(/\+/g, " ");
  if (t === "iso-8859-1")
    return n.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(n);
  } catch {
    return n;
  }
}, hs = function(e, t, n, i, a) {
  if (e.length === 0)
    return e;
  var s = e;
  if (typeof e == "symbol" ? s = Symbol.prototype.toString.call(e) : typeof e != "string" && (s = String(e)), n === "iso-8859-1")
    return escape(s).replace(/%u[0-9a-f]{4}/gi, function(l) {
      return "%26%23" + parseInt(l.slice(2), 16) + "%3B";
    });
  for (var o = "", u = 0; u < s.length; ++u) {
    var c = s.charCodeAt(u);
    if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || a === ls.RFC1738 && (c === 40 || c === 41)) {
      o += s.charAt(u);
      continue;
    }
    if (c < 128) {
      o = o + V[c];
      continue;
    }
    if (c < 2048) {
      o = o + (V[192 | c >> 6] + V[128 | c & 63]);
      continue;
    }
    if (c < 55296 || c >= 57344) {
      o = o + (V[224 | c >> 12] + V[128 | c >> 6 & 63] + V[128 | c & 63]);
      continue;
    }
    u += 1, c = 65536 + ((c & 1023) << 10 | s.charCodeAt(u) & 1023), o += V[240 | c >> 18] + V[128 | c >> 12 & 63] + V[128 | c >> 6 & 63] + V[128 | c & 63];
  }
  return o;
}, ms = function(e) {
  for (var t = [{ obj: { o: e }, prop: "o" }], n = [], i = 0; i < t.length; ++i)
    for (var a = t[i], s = a.obj[a.prop], o = Object.keys(s), u = 0; u < o.length; ++u) {
      var c = o[u], l = s[c];
      typeof l == "object" && l !== null && n.indexOf(l) === -1 && (t.push({ obj: s, prop: c }), n.push(l));
    }
  return fs(t), e;
}, vs = function(e) {
  return Object.prototype.toString.call(e) === "[object RegExp]";
}, gs = function(e) {
  return !e || typeof e != "object" ? !1 : !!(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e));
}, _s = function(e, t) {
  return [].concat(e, t);
}, bs = function(e, t) {
  if (pe(e)) {
    for (var n = [], i = 0; i < e.length; i += 1)
      n.push(t(e[i]));
    return n;
  }
  return t(e);
}, ln = {
  arrayToObject: un,
  assign: ps,
  combine: _s,
  compact: ms,
  decode: ys,
  encode: hs,
  isBuffer: gs,
  isRegExp: vs,
  maybeMap: bs,
  merge: ds
}, fn = os, yt = ln, We = lr, ws = Object.prototype.hasOwnProperty, dn = {
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
}, W = Array.isArray, xs = Array.prototype.push, pn = function(r, e) {
  xs.apply(r, W(e) ? e : [e]);
}, Ss = Date.prototype.toISOString, Mr = We.default, P = {
  addQueryPrefix: !1,
  allowDots: !1,
  allowEmptyArrays: !1,
  arrayFormat: "indices",
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encodeDotInKeys: !1,
  encoder: yt.encode,
  encodeValuesOnly: !1,
  format: Mr,
  formatter: We.formatters[Mr],
  // deprecated
  indices: !1,
  serializeDate: function(e) {
    return Ss.call(e);
  },
  skipNulls: !1,
  strictNullHandling: !1
}, ks = function(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "symbol" || typeof e == "bigint";
}, qt = {}, Os = function r(e, t, n, i, a, s, o, u, c, l, m, b, k, O, N, D, Y, X) {
  for (var x = e, ee = X, fe = 0, Me = !1; (ee = ee.get(qt)) !== void 0 && !Me; ) {
    var we = ee.get(e);
    if (fe += 1, typeof we < "u") {
      if (we === fe)
        throw new RangeError("Cyclic object value");
      Me = !0;
    }
    typeof ee.get(qt) > "u" && (fe = 0);
  }
  if (typeof l == "function" ? x = l(t, x) : x instanceof Date ? x = k(x) : n === "comma" && W(x) && (x = yt.maybeMap(x, function(Nt) {
    return Nt instanceof Date ? k(Nt) : Nt;
  })), x === null) {
    if (s)
      return c && !D ? c(t, P.encoder, Y, "key", O) : t;
    x = "";
  }
  if (ks(x) || yt.isBuffer(x)) {
    if (c) {
      var ot = D ? t : c(t, P.encoder, Y, "key", O);
      return [N(ot) + "=" + N(c(x, P.encoder, Y, "value", O))];
    }
    return [N(t) + "=" + N(String(x))];
  }
  var de = [];
  if (typeof x > "u")
    return de;
  var te;
  if (n === "comma" && W(x))
    D && c && (x = yt.maybeMap(x, c)), te = [{ value: x.length > 0 ? x.join(",") || null : void 0 }];
  else if (W(l))
    te = l;
  else {
    var ct = Object.keys(x);
    te = m ? ct.sort(m) : ct;
  }
  var xe = u ? t.replace(/\./g, "%2E") : t, M = i && W(x) && x.length === 1 ? xe + "[]" : xe;
  if (a && W(x) && x.length === 0)
    return M + "[]";
  for (var re = 0; re < te.length; ++re) {
    var ne = te[re], je = typeof ne == "object" && typeof ne.value < "u" ? ne.value : x[ne];
    if (!(o && je === null)) {
      var Rt = b && u ? ne.replace(/\./g, "%2E") : ne, vn = W(x) ? typeof n == "function" ? n(M, Rt) : M : M + (b ? "." + Rt : "[" + Rt + "]");
      X.set(e, fe);
      var fr = fn();
      fr.set(qt, X), pn(de, r(
        je,
        vn,
        n,
        i,
        a,
        s,
        o,
        u,
        n === "comma" && D && W(x) ? null : c,
        l,
        m,
        b,
        k,
        O,
        N,
        D,
        Y,
        fr
      ));
    }
  }
  return de;
}, Es = function(e) {
  if (!e)
    return P;
  if (typeof e.allowEmptyArrays < "u" && typeof e.allowEmptyArrays != "boolean")
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  if (typeof e.encodeDotInKeys < "u" && typeof e.encodeDotInKeys != "boolean")
    throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
  if (e.encoder !== null && typeof e.encoder < "u" && typeof e.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  var t = e.charset || P.charset;
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var n = We.default;
  if (typeof e.format < "u") {
    if (!ws.call(We.formatters, e.format))
      throw new TypeError("Unknown format option provided.");
    n = e.format;
  }
  var i = We.formatters[n], a = P.filter;
  (typeof e.filter == "function" || W(e.filter)) && (a = e.filter);
  var s;
  if (e.arrayFormat in dn ? s = e.arrayFormat : "indices" in e ? s = e.indices ? "indices" : "repeat" : s = P.arrayFormat, "commaRoundTrip" in e && typeof e.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  var o = typeof e.allowDots > "u" ? e.encodeDotInKeys === !0 ? !0 : P.allowDots : !!e.allowDots;
  return {
    addQueryPrefix: typeof e.addQueryPrefix == "boolean" ? e.addQueryPrefix : P.addQueryPrefix,
    allowDots: o,
    allowEmptyArrays: typeof e.allowEmptyArrays == "boolean" ? !!e.allowEmptyArrays : P.allowEmptyArrays,
    arrayFormat: s,
    charset: t,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : P.charsetSentinel,
    commaRoundTrip: e.commaRoundTrip,
    delimiter: typeof e.delimiter > "u" ? P.delimiter : e.delimiter,
    encode: typeof e.encode == "boolean" ? e.encode : P.encode,
    encodeDotInKeys: typeof e.encodeDotInKeys == "boolean" ? e.encodeDotInKeys : P.encodeDotInKeys,
    encoder: typeof e.encoder == "function" ? e.encoder : P.encoder,
    encodeValuesOnly: typeof e.encodeValuesOnly == "boolean" ? e.encodeValuesOnly : P.encodeValuesOnly,
    filter: a,
    format: n,
    formatter: i,
    serializeDate: typeof e.serializeDate == "function" ? e.serializeDate : P.serializeDate,
    skipNulls: typeof e.skipNulls == "boolean" ? e.skipNulls : P.skipNulls,
    sort: typeof e.sort == "function" ? e.sort : null,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : P.strictNullHandling
  };
}, Ts = function(r, e) {
  var t = r, n = Es(e), i, a;
  typeof n.filter == "function" ? (a = n.filter, t = a("", t)) : W(n.filter) && (a = n.filter, i = a);
  var s = [];
  if (typeof t != "object" || t === null)
    return "";
  var o = dn[n.arrayFormat], u = o === "comma" && n.commaRoundTrip;
  i || (i = Object.keys(t)), n.sort && i.sort(n.sort);
  for (var c = fn(), l = 0; l < i.length; ++l) {
    var m = i[l];
    n.skipNulls && t[m] === null || pn(s, Os(
      t[m],
      m,
      o,
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
      c
    ));
  }
  var b = s.join(n.delimiter), k = n.addQueryPrefix === !0 ? "?" : "";
  return n.charsetSentinel && (n.charset === "iso-8859-1" ? k += "utf8=%26%2310003%3B&" : k += "utf8=%E2%9C%93&"), b.length > 0 ? k + b : "";
}, Ce = ln, nr = Object.prototype.hasOwnProperty, As = Array.isArray, I = {
  allowDots: !1,
  allowEmptyArrays: !1,
  allowPrototypes: !1,
  allowSparse: !1,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: !1,
  comma: !1,
  decodeDotInKeys: !0,
  decoder: Ce.decode,
  delimiter: "&",
  depth: 5,
  duplicates: "combine",
  ignoreQueryPrefix: !1,
  interpretNumericEntities: !1,
  parameterLimit: 1e3,
  parseArrays: !0,
  plainObjects: !1,
  strictNullHandling: !1
}, Is = function(r) {
  return r.replace(/&#(\d+);/g, function(e, t) {
    return String.fromCharCode(parseInt(t, 10));
  });
}, yn = function(r, e) {
  return r && typeof r == "string" && e.comma && r.indexOf(",") > -1 ? r.split(",") : r;
}, Ps = "utf8=%26%2310003%3B", Rs = "utf8=%E2%9C%93", Ns = function(e, t) {
  var n = { __proto__: null }, i = t.ignoreQueryPrefix ? e.replace(/^\?/, "") : e, a = t.parameterLimit === 1 / 0 ? void 0 : t.parameterLimit, s = i.split(t.delimiter, a), o = -1, u, c = t.charset;
  if (t.charsetSentinel)
    for (u = 0; u < s.length; ++u)
      s[u].indexOf("utf8=") === 0 && (s[u] === Rs ? c = "utf-8" : s[u] === Ps && (c = "iso-8859-1"), o = u, u = s.length);
  for (u = 0; u < s.length; ++u)
    if (u !== o) {
      var l = s[u], m = l.indexOf("]="), b = m === -1 ? l.indexOf("=") : m + 1, k, O;
      b === -1 ? (k = t.decoder(l, I.decoder, c, "key"), O = t.strictNullHandling ? null : "") : (k = t.decoder(l.slice(0, b), I.decoder, c, "key"), O = Ce.maybeMap(
        yn(l.slice(b + 1), t),
        function(D) {
          return t.decoder(D, I.decoder, c, "value");
        }
      )), O && t.interpretNumericEntities && c === "iso-8859-1" && (O = Is(O)), l.indexOf("[]=") > -1 && (O = As(O) ? [O] : O);
      var N = nr.call(n, k);
      N && t.duplicates === "combine" ? n[k] = Ce.combine(n[k], O) : (!N || t.duplicates === "last") && (n[k] = O);
    }
  return n;
}, $s = function(r, e, t, n) {
  for (var i = n ? e : yn(e, t), a = r.length - 1; a >= 0; --a) {
    var s, o = r[a];
    if (o === "[]" && t.parseArrays)
      s = t.allowEmptyArrays && i === "" ? [] : [].concat(i);
    else {
      s = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var u = o.charAt(0) === "[" && o.charAt(o.length - 1) === "]" ? o.slice(1, -1) : o, c = t.decodeDotInKeys ? u.replace(/%2E/g, ".") : u, l = parseInt(c, 10);
      !t.parseArrays && c === "" ? s = { 0: i } : !isNaN(l) && o !== c && String(l) === c && l >= 0 && t.parseArrays && l <= t.arrayLimit ? (s = [], s[l] = i) : c !== "__proto__" && (s[c] = i);
    }
    i = s;
  }
  return i;
}, Cs = function(e, t, n, i) {
  if (e) {
    var a = n.allowDots ? e.replace(/\.([^.[]+)/g, "[$1]") : e, s = /(\[[^[\]]*])/, o = /(\[[^[\]]*])/g, u = n.depth > 0 && s.exec(a), c = u ? a.slice(0, u.index) : a, l = [];
    if (c) {
      if (!n.plainObjects && nr.call(Object.prototype, c) && !n.allowPrototypes)
        return;
      l.push(c);
    }
    for (var m = 0; n.depth > 0 && (u = o.exec(a)) !== null && m < n.depth; ) {
      if (m += 1, !n.plainObjects && nr.call(Object.prototype, u[1].slice(1, -1)) && !n.allowPrototypes)
        return;
      l.push(u[1]);
    }
    return u && l.push("[" + a.slice(u.index) + "]"), $s(l, t, n, i);
  }
}, Zs = function(e) {
  if (!e)
    return I;
  if (typeof e.allowEmptyArrays < "u" && typeof e.allowEmptyArrays != "boolean")
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  if (typeof e.decodeDotInKeys < "u" && typeof e.decodeDotInKeys != "boolean")
    throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
  if (e.decoder !== null && typeof e.decoder < "u" && typeof e.decoder != "function")
    throw new TypeError("Decoder has to be a function.");
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var t = typeof e.charset > "u" ? I.charset : e.charset, n = typeof e.duplicates > "u" ? I.duplicates : e.duplicates;
  if (n !== "combine" && n !== "first" && n !== "last")
    throw new TypeError("The duplicates option must be either combine, first, or last");
  var i = typeof e.allowDots > "u" ? e.decodeDotInKeys === !0 ? !0 : I.allowDots : !!e.allowDots;
  return {
    allowDots: i,
    allowEmptyArrays: typeof e.allowEmptyArrays == "boolean" ? !!e.allowEmptyArrays : I.allowEmptyArrays,
    allowPrototypes: typeof e.allowPrototypes == "boolean" ? e.allowPrototypes : I.allowPrototypes,
    allowSparse: typeof e.allowSparse == "boolean" ? e.allowSparse : I.allowSparse,
    arrayLimit: typeof e.arrayLimit == "number" ? e.arrayLimit : I.arrayLimit,
    charset: t,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : I.charsetSentinel,
    comma: typeof e.comma == "boolean" ? e.comma : I.comma,
    decodeDotInKeys: typeof e.decodeDotInKeys == "boolean" ? e.decodeDotInKeys : I.decodeDotInKeys,
    decoder: typeof e.decoder == "function" ? e.decoder : I.decoder,
    delimiter: typeof e.delimiter == "string" || Ce.isRegExp(e.delimiter) ? e.delimiter : I.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof e.depth == "number" || e.depth === !1 ? +e.depth : I.depth,
    duplicates: n,
    ignoreQueryPrefix: e.ignoreQueryPrefix === !0,
    interpretNumericEntities: typeof e.interpretNumericEntities == "boolean" ? e.interpretNumericEntities : I.interpretNumericEntities,
    parameterLimit: typeof e.parameterLimit == "number" ? e.parameterLimit : I.parameterLimit,
    parseArrays: e.parseArrays !== !1,
    plainObjects: typeof e.plainObjects == "boolean" ? e.plainObjects : I.plainObjects,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : I.strictNullHandling
  };
}, Ds = function(r, e) {
  var t = Zs(e);
  if (r === "" || r === null || typeof r > "u")
    return t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var n = typeof r == "string" ? Ns(r, t) : r, i = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, a = Object.keys(n), s = 0; s < a.length; ++s) {
    var o = a[s], u = Cs(o, n[o], t, typeof r == "string");
    i = Ce.merge(i, u, t);
  }
  return t.allowSparse === !0 ? i : Ce.compact(i);
}, Ms = Ts, js = Ds, Fs = lr, Bs = {
  formats: Fs,
  parse: js,
  stringify: Ms
};
const hn = () => ({
  addQueryPrefix: !0,
  encoder: (r, e, t, n) => n === "value" && typeof r == "boolean" ? r ? 1 : 0 : e(r),
  encodeValuesOnly: !0,
  skipNulls: !0
}), Ls = () => ({
  absolute: !1,
  strict: !1,
  qsConfig: hn(),
  base: "/",
  defaults: {},
  routes: {}
}), Us = (r) => _a.parse(JSON.parse(r));
var j, It, mn;
class Vs {
  constructor(e) {
    Se(this, It);
    Se(this, j, Ls());
    this.config = e ?? {};
  }
  get config() {
    return A(this, j);
  }
  set config(e) {
    e = Gr(e) ? Us(e) : e, Fe(this, j, {
      ...A(this, j),
      ...e,
      qsConfig: {
        ...hn(),
        ...(e == null ? void 0 : e.qsConfig) ?? {}
      }
    });
  }
  get base() {
    return Le(A(this, j).base);
  }
  get origin() {
    return A(this, j).absolute ? this.base : "";
  }
  has(e) {
    return Object.hasOwn(A(this, j).routes, e);
  }
  compile(e, t) {
    const n = dr(this, It, mn).call(this, e), { substituted: i, url: a } = n.compile(t), s = t._query ?? {};
    delete t._query;
    for (const o of Object.keys(t))
      i.includes(o) || (Object.hasOwn(s, o) && console.warn(`Duplicate "${o}" in params and params.query may cause issues`), s[o] = t[o]);
    return a + Bs.stringify(s, A(this, j).qsConfig);
  }
}
j = new WeakMap(), It = new WeakSet(), mn = function(e) {
  if (!this.has(e))
    throw new Error(`No such route "${e}" in the route list`);
  return new ba(e, A(this, j).routes[e], this);
};
const At = new Vs(), zs = (r) => (At.config = r ?? {}, At.config), qs = (r, e) => At.compile(r, e ?? {}), Gs = (r) => At.has(r);
export {
  Vs as Router,
  zs as configureRouter,
  Gs as hasRoute,
  qs as route
};
