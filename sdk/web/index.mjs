'use strict';
function hasOwnProperty(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
var isArray =
  Array.isArray ||
  function (e) {
    return '[object Array]' === Object.prototype.toString.call(e);
  };
function stringifyPrimitive(e) {
  switch (typeof e) {
    case 'string':
      return e;
    case 'boolean':
      return e ? 'true' : 'false';
    case 'number':
      return isFinite(e) ? e : '';
    default:
      return '';
  }
}
function stringify(e, t, n, r) {
  return (
    (t = t || '&'),
    (n = n || '='),
    null === e && (e = void 0),
    'object' == typeof e
      ? map(objectKeys(e), function (r) {
          var o = encodeURIComponent(stringifyPrimitive(r)) + n;
          return isArray(e[r])
            ? map(e[r], function (e) {
                return o + encodeURIComponent(stringifyPrimitive(e));
              }).join(t)
            : o + encodeURIComponent(stringifyPrimitive(e[r]));
        }).join(t)
      : r
      ? encodeURIComponent(stringifyPrimitive(r)) +
        n +
        encodeURIComponent(stringifyPrimitive(e))
      : ''
  );
}
function map(e, t) {
  if (e.map) return e.map(t);
  for (var n = [], r = 0; r < e.length; r++) n.push(t(e[r], r));
  return n;
}
var objectKeys =
  Object.keys ||
  function (e) {
    var t = [];
    for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
    return t;
  };
function parse(e, t, n, r) {
  (t = t || '&'), (n = n || '=');
  var o = {};
  if ('string' != typeof e || 0 === e.length) return o;
  e = e.split(t);
  var a = 1e3;
  r && 'number' == typeof r.maxKeys && (a = r.maxKeys);
  var s = e.length;
  0 < a && s > a && (s = a);
  for (var d = 0; d < s; ++d) {
    var l,
      h,
      p,
      u,
      f = e[d].replace(/\+/g, '%20'),
      c = f.indexOf(n);
    0 <= c
      ? ((l = f.substr(0, c)), (h = f.substr(c + 1)))
      : ((l = f), (h = '')),
      (p = decodeURIComponent(l)),
      (u = decodeURIComponent(h)),
      hasOwnProperty(o, p)
        ? isArray(o[p])
          ? o[p].push(u)
          : (o[p] = [o[p], u])
        : (o[p] = u);
  }
  return o;
}
var qs = {
    encode: stringify,
    stringify: stringify,
    decode: parse,
    parse: parse,
  },
  maxInt = 2147483647,
  base = 36,
  tMin = 1,
  tMax = 26,
  skew = 38,
  damp = 700,
  initialBias = 72,
  initialN = 128,
  delimiter = '-',
  regexNonASCII = /[^\x20-\x7E]/,
  regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
  errors = {
    overflow: 'Overflow: input needs wider integers to process',
    'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
    'invalid-input': 'Invalid input',
  },
  baseMinusTMin = base - tMin,
  floor = Math.floor,
  stringFromCharCode = String.fromCharCode;
function error(e) {
  throw new RangeError(errors[e]);
}
function map$1(e, t) {
  for (var n = e.length, r = []; n--; ) r[n] = t(e[n]);
  return r;
}
function mapDomain(e, t) {
  var n = e.split('@'),
    r = '';
  1 < n.length && ((r = n[0] + '@'), (e = n[1])),
    (e = e.replace(regexSeparators, '.'));
  var o = e.split('.'),
    a = map$1(o, t).join('.');
  return r + a;
}
function ucs2decode(e) {
  for (var t, n, r = [], o = 0, a = e.length; o < a; )
    (t = e.charCodeAt(o++)),
      55296 <= t && 56319 >= t && o < a
        ? ((n = e.charCodeAt(o++)),
          56320 == (64512 & n)
            ? r.push(((1023 & t) << 10) + (1023 & n) + 65536)
            : (r.push(t), o--))
        : r.push(t);
  return r;
}
function digitToBasic(e, t) {
  return e + 22 + 75 * (26 > e) - ((0 != t) << 5);
}
function adapt(e, t, n) {
  var r = 0;
  for (
    e = n ? floor(e / damp) : e >> 1, e += floor(e / t);
    e > (baseMinusTMin * tMax) >> 1;
    r += base
  )
    e = floor(e / baseMinusTMin);
  return floor(r + ((baseMinusTMin + 1) * e) / (e + skew));
}
function encode(e) {
  var r,
    o,
    a,
    i,
    s,
    d,
    l,
    h,
    p,
    u,
    f,
    c,
    g,
    y,
    b,
    _ = [];
  for (
    e = ucs2decode(e),
      c = e.length,
      r = initialN,
      o = 0,
      s = initialBias,
      d = 0;
    d < c;
    ++d
  )
    (f = e[d]), 128 > f && _.push(stringFromCharCode(f));
  for (a = i = _.length, i && _.push(delimiter); a < c; ) {
    for (l = maxInt, d = 0; d < c; ++d) (f = e[d]), f >= r && f < l && (l = f);
    for (
      g = a + 1,
        l - r > floor((maxInt - o) / g) && error('overflow'),
        o += (l - r) * g,
        r = l,
        d = 0;
      d < c;
      ++d
    )
      if (((f = e[d]), f < r && ++o > maxInt && error('overflow'), f == r)) {
        for (h = o, p = base; ; p += base) {
          if (((u = p <= s ? tMin : p >= s + tMax ? tMax : p - s), h < u))
            break;
          (b = h - u),
            (y = base - u),
            _.push(stringFromCharCode(digitToBasic(u + (b % y), 0))),
            (h = floor(b / y));
        }
        _.push(stringFromCharCode(digitToBasic(h, 0))),
          (s = adapt(o, g, a == i)),
          (o = 0),
          ++a;
      }
    ++o, ++r;
  }
  return _.join('');
}
function toASCII(e) {
  return mapDomain(e, function (e) {
    return regexNonASCII.test(e) ? 'xn--' + encode(e) : e;
  });
}
var global$1 =
    'undefined' == typeof global
      ? 'undefined' == typeof self
        ? 'undefined' == typeof window
          ? {}
          : window
        : self
      : global,
  lookup = [],
  revLookup = [],
  Arr = 'undefined' == typeof Uint8Array ? Array : Uint8Array,
  inited = !1;
function init() {
  inited = !0;
  for (
    var e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      t = 0,
      n = e.length;
    t < n;
    ++t
  )
    (lookup[t] = e[t]), (revLookup[e.charCodeAt(t)] = t);
  (revLookup[45] = 62), (revLookup[95] = 63);
}
function toByteArray(e) {
  inited || init();
  var t,
    n,
    r,
    o,
    a,
    s,
    d = e.length;
  if (0 < d % 4)
    throw new Error('Invalid string. Length must be a multiple of 4');
  (a = '=' === e[d - 2] ? 2 : '=' === e[d - 1] ? 1 : 0),
    (s = new Arr((3 * d) / 4 - a)),
    (r = 0 < a ? d - 4 : d);
  var h = 0;
  for (t = 0, n = 0; t < r; t += 4, n += 3)
    (o =
      (revLookup[e.charCodeAt(t)] << 18) |
      (revLookup[e.charCodeAt(t + 1)] << 12) |
      (revLookup[e.charCodeAt(t + 2)] << 6) |
      revLookup[e.charCodeAt(t + 3)]),
      (s[h++] = 255 & (o >> 16)),
      (s[h++] = 255 & (o >> 8)),
      (s[h++] = 255 & o);
  return (
    2 === a
      ? ((o =
          (revLookup[e.charCodeAt(t)] << 2) |
          (revLookup[e.charCodeAt(t + 1)] >> 4)),
        (s[h++] = 255 & o))
      : 1 == a &&
        ((o =
          (revLookup[e.charCodeAt(t)] << 10) |
          (revLookup[e.charCodeAt(t + 1)] << 4) |
          (revLookup[e.charCodeAt(t + 2)] >> 2)),
        (s[h++] = 255 & (o >> 8)),
        (s[h++] = 255 & o)),
    s
  );
}
function tripletToBase64(e) {
  return (
    lookup[63 & (e >> 18)] +
    lookup[63 & (e >> 12)] +
    lookup[63 & (e >> 6)] +
    lookup[63 & e]
  );
}
function encodeChunk(e, t, n) {
  for (var r, o = [], a = t; a < n; a += 3)
    (r = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2]), o.push(tripletToBase64(r));
  return o.join('');
}
function fromByteArray(e) {
  inited || init();
  for (
    var t, n = e.length, r = n % 3, o = '', a = [], s = 16383, d = 0, l = n - r;
    d < l;
    d += s
  )
    a.push(encodeChunk(e, d, d + s > l ? l : d + s));
  return (
    1 === r
      ? ((t = e[n - 1]),
        (o += lookup[t >> 2]),
        (o += lookup[63 & (t << 4)]),
        (o += '=='))
      : 2 === r &&
        ((t = (e[n - 2] << 8) + e[n - 1]),
        (o += lookup[t >> 10]),
        (o += lookup[63 & (t >> 4)]),
        (o += lookup[63 & (t << 2)]),
        (o += '=')),
    a.push(o),
    a.join('')
  );
}
function read(t, n, r, o, a) {
  var h,
    p,
    l = Math.pow,
    u = 8 * a - o - 1,
    f = (1 << u) - 1,
    c = f >> 1,
    g = -7,
    y = r ? a - 1 : 0,
    b = r ? -1 : 1,
    d = t[n + y];
  for (
    y += b, h = d & ((1 << -g) - 1), d >>= -g, g += u;
    0 < g;
    h = 256 * h + t[n + y], y += b, g -= 8
  );
  for (
    p = h & ((1 << -g) - 1), h >>= -g, g += o;
    0 < g;
    p = 256 * p + t[n + y], y += b, g -= 8
  );
  if (0 === h) h = 1 - c;
  else {
    if (h === f) return p ? NaN : (d ? -1 : 1) * (1 / 0);
    (p += l(2, o)), (h -= c);
  }
  return (d ? -1 : 1) * p * l(2, h - o);
}
function write(t, n, r, o, a, l) {
  var y,
    b,
    _,
    h = Math.floor,
    p = Math.LN2,
    u = Math.log,
    f = Math.abs,
    g = Math.pow,
    w = 8 * l - a - 1,
    R = (1 << w) - 1,
    v = R >> 1,
    x = 23 === a ? g(2, -24) - g(2, -77) : 0,
    E = o ? 0 : l - 1,
    L = o ? 1 : -1,
    d = 0 > n || (0 === n && 0 > 1 / n) ? 1 : 0;
  for (
    n = f(n),
      isNaN(n) || n === 1 / 0
        ? ((b = isNaN(n) ? 1 : 0), (y = R))
        : ((y = h(u(n) / p)),
          1 > n * (_ = g(2, -y)) && (y--, (_ *= 2)),
          (n += 1 <= y + v ? x / _ : x * g(2, 1 - v)),
          2 <= n * _ && (y++, (_ /= 2)),
          y + v >= R
            ? ((b = 0), (y = R))
            : 1 <= y + v
            ? ((b = (n * _ - 1) * g(2, a)), (y += v))
            : ((b = n * g(2, v - 1) * g(2, a)), (y = 0)));
    8 <= a;
    t[r + E] = 255 & b, E += L, b /= 256, a -= 8
  );
  for (
    y = (y << a) | b, w += a;
    0 < w;
    t[r + E] = 255 & y, E += L, y /= 256, w -= 8
  );
  t[r + E - L] |= 128 * d;
}
var toString = {}.toString,
  isArray$1 =
    Array.isArray ||
    function (e) {
      return '[object Array]' == toString.call(e);
    },
  INSPECT_MAX_BYTES = 50;
Buffer$1.TYPED_ARRAY_SUPPORT =
  !(global$1.TYPED_ARRAY_SUPPORT !== void 0) || global$1.TYPED_ARRAY_SUPPORT;
function kMaxLength() {
  return Buffer$1.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function createBuffer(e, t) {
  if (kMaxLength() < t) throw new RangeError('Invalid typed array length');
  return (
    Buffer$1.TYPED_ARRAY_SUPPORT
      ? ((e = new Uint8Array(t)), (e.__proto__ = Buffer$1.prototype))
      : (null === e && (e = new Buffer$1(t)), (e.length = t)),
    e
  );
}
function Buffer$1(e, t, n) {
  if (!Buffer$1.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer$1))
    return new Buffer$1(e, t, n);
  if ('number' == typeof e) {
    if ('string' == typeof t)
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      );
    return allocUnsafe(this, e);
  }
  return from(this, e, t, n);
}
(Buffer$1.poolSize = 8192),
  (Buffer$1._augment = function (e) {
    return (e.__proto__ = Buffer$1.prototype), e;
  });
function from(e, t, n, r) {
  if ('number' == typeof t)
    throw new TypeError('"value" argument must not be a number');
  return 'undefined' != typeof ArrayBuffer && t instanceof ArrayBuffer
    ? fromArrayBuffer(e, t, n, r)
    : 'string' == typeof t
    ? fromString(e, t, n)
    : fromObject(e, t);
}
(Buffer$1.from = function (e, t, n) {
  return from(null, e, t, n);
}),
  Buffer$1.TYPED_ARRAY_SUPPORT &&
    ((Buffer$1.prototype.__proto__ = Uint8Array.prototype),
    (Buffer$1.__proto__ = Uint8Array));
function assertSize(e) {
  if ('number' != typeof e)
    throw new TypeError('"size" argument must be a number');
  else if (0 > e) throw new RangeError('"size" argument must not be negative');
}
function alloc(e, t, n, r) {
  return (
    assertSize(t),
    0 >= t
      ? createBuffer(e, t)
      : void 0 === n
      ? createBuffer(e, t)
      : 'string' == typeof r
      ? createBuffer(e, t).fill(n, r)
      : createBuffer(e, t).fill(n)
  );
}
Buffer$1.alloc = function (e, t, n) {
  return alloc(null, e, t, n);
};
function allocUnsafe(e, t) {
  if (
    (assertSize(t),
    (e = createBuffer(e, 0 > t ? 0 : 0 | checked(t))),
    !Buffer$1.TYPED_ARRAY_SUPPORT)
  )
    for (var n = 0; n < t; ++n) e[n] = 0;
  return e;
}
(Buffer$1.allocUnsafe = function (e) {
  return allocUnsafe(null, e);
}),
  (Buffer$1.allocUnsafeSlow = function (e) {
    return allocUnsafe(null, e);
  });
function fromString(e, t, n) {
  if (
    (('string' != typeof n || '' === n) && (n = 'utf8'),
    !Buffer$1.isEncoding(n))
  )
    throw new TypeError('"encoding" must be a valid string encoding');
  var r = 0 | byteLength(t, n);
  e = createBuffer(e, r);
  var o = e.write(t, n);
  return o !== r && (e = e.slice(0, o)), e;
}
function fromArrayLike(e, t) {
  var n = 0 > t.length ? 0 : 0 | checked(t.length);
  e = createBuffer(e, n);
  for (var r = 0; r < n; r += 1) e[r] = 255 & t[r];
  return e;
}
function fromArrayBuffer(e, t, n, r) {
  if ((t.byteLength, 0 > n || t.byteLength < n))
    throw new RangeError("'offset' is out of bounds");
  if (t.byteLength < n + (r || 0))
    throw new RangeError("'length' is out of bounds");
  return (
    (t =
      void 0 === n && void 0 === r
        ? new Uint8Array(t)
        : void 0 === r
        ? new Uint8Array(t, n)
        : new Uint8Array(t, n, r)),
    Buffer$1.TYPED_ARRAY_SUPPORT
      ? ((e = t), (e.__proto__ = Buffer$1.prototype))
      : (e = fromArrayLike(e, t)),
    e
  );
}
function fromObject(e, t) {
  if (internalIsBuffer(t)) {
    var n = 0 | checked(t.length);
    return ((e = createBuffer(e, n)), 0 === e.length)
      ? e
      : (t.copy(e, 0, 0, n), e);
  }
  if (t) {
    if (
      ('undefined' != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer) ||
      'length' in t
    )
      return 'number' != typeof t.length || isnan(t.length)
        ? createBuffer(e, 0)
        : fromArrayLike(e, t);
    if ('Buffer' === t.type && isArray$1(t.data))
      return fromArrayLike(e, t.data);
  }
  throw new TypeError(
    'First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.'
  );
}
function checked(e) {
  if (e >= kMaxLength())
    throw new RangeError(
      'Attempt to allocate Buffer larger than maximum size: 0x' +
        kMaxLength().toString(16) +
        ' bytes'
    );
  return 0 | e;
}
Buffer$1.isBuffer = isBuffer;
function internalIsBuffer(e) {
  return !!(null != e && e._isBuffer);
}
(Buffer$1.compare = function (e, t) {
  if (!internalIsBuffer(e) || !internalIsBuffer(t))
    throw new TypeError('Arguments must be Buffers');
  if (e === t) return 0;
  for (var n = e.length, r = t.length, o = 0, a = Math.min(n, r); o < a; ++o)
    if (e[o] !== t[o]) {
      (n = e[o]), (r = t[o]);
      break;
    }
  return n < r ? -1 : r < n ? 1 : 0;
}),
  (Buffer$1.isEncoding = function (e) {
    switch ((e + '').toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'latin1':
      case 'binary':
      case 'base64':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return !0;
      default:
        return !1;
    }
  }),
  (Buffer$1.concat = function (e, t) {
    if (!isArray$1(e))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (0 === e.length) return Buffer$1.alloc(0);
    var n;
    if (t === void 0) for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
    var r = Buffer$1.allocUnsafe(t),
      o = 0;
    for (n = 0; n < e.length; ++n) {
      var a = e[n];
      if (!internalIsBuffer(a))
        throw new TypeError('"list" argument must be an Array of Buffers');
      a.copy(r, o), (o += a.length);
    }
    return r;
  });
function byteLength(e, t) {
  if (internalIsBuffer(e)) return e.length;
  if (
    'undefined' != typeof ArrayBuffer &&
    'function' == typeof ArrayBuffer.isView &&
    (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)
  )
    return e.byteLength;
  'string' != typeof e && (e = '' + e);
  var n = e.length;
  if (0 === n) return 0;
  for (var r = !1; ; )
    switch (t) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return n;
      case 'utf8':
      case 'utf-8':
      case void 0:
        return utf8ToBytes(e).length;
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 2 * n;
      case 'hex':
        return n >>> 1;
      case 'base64':
        return base64ToBytes(e).length;
      default:
        if (r) return utf8ToBytes(e).length;
        (t = ('' + t).toLowerCase()), (r = !0);
    }
}
Buffer$1.byteLength = byteLength;
function slowToString(e, t, n) {
  var r = !1;
  if (((void 0 === t || 0 > t) && (t = 0), t > this.length)) return '';
  if (((void 0 === n || n > this.length) && (n = this.length), 0 >= n))
    return '';
  if (((n >>>= 0), (t >>>= 0), n <= t)) return '';
  for (e || (e = 'utf8'); ; )
    switch (e) {
      case 'hex':
        return hexSlice(this, t, n);
      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, t, n);
      case 'ascii':
        return asciiSlice(this, t, n);
      case 'latin1':
      case 'binary':
        return latin1Slice(this, t, n);
      case 'base64':
        return base64Slice(this, t, n);
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, t, n);
      default:
        if (r) throw new TypeError('Unknown encoding: ' + e);
        (e = (e + '').toLowerCase()), (r = !0);
    }
}
Buffer$1.prototype._isBuffer = !0;
function swap(e, t, n) {
  var r = e[t];
  (e[t] = e[n]), (e[n] = r);
}
(Buffer$1.prototype.swap16 = function () {
  var e = this.length;
  if (0 != e % 2)
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  for (var t = 0; t < e; t += 2) swap(this, t, t + 1);
  return this;
}),
  (Buffer$1.prototype.swap32 = function () {
    var e = this.length;
    if (0 != e % 4)
      throw new RangeError('Buffer size must be a multiple of 32-bits');
    for (var t = 0; t < e; t += 4)
      swap(this, t, t + 3), swap(this, t + 1, t + 2);
    return this;
  }),
  (Buffer$1.prototype.swap64 = function () {
    var e = this.length;
    if (0 != e % 8)
      throw new RangeError('Buffer size must be a multiple of 64-bits');
    for (var t = 0; t < e; t += 8)
      swap(this, t, t + 7),
        swap(this, t + 1, t + 6),
        swap(this, t + 2, t + 5),
        swap(this, t + 3, t + 4);
    return this;
  }),
  (Buffer$1.prototype.toString = function () {
    var e = 0 | this.length;
    return 0 == e
      ? ''
      : 0 === arguments.length
      ? utf8Slice(this, 0, e)
      : slowToString.apply(this, arguments);
  }),
  (Buffer$1.prototype.equals = function (e) {
    if (!internalIsBuffer(e)) throw new TypeError('Argument must be a Buffer');
    return this === e || 0 === Buffer$1.compare(this, e);
  }),
  (Buffer$1.prototype.inspect = function () {
    var e = '',
      t = INSPECT_MAX_BYTES;
    return (
      0 < this.length &&
        ((e = this.toString('hex', 0, t).match(/.{2}/g).join(' ')),
        this.length > t && (e += ' ... ')),
      '<Buffer ' + e + '>'
    );
  }),
  (Buffer$1.prototype.compare = function (e, t, n, r, o) {
    var a = Math.min;
    if (!internalIsBuffer(e)) throw new TypeError('Argument must be a Buffer');
    if (
      (void 0 === t && (t = 0),
      void 0 === n && (n = e ? e.length : 0),
      void 0 === r && (r = 0),
      void 0 === o && (o = this.length),
      0 > t || n > e.length || 0 > r || o > this.length)
    )
      throw new RangeError('out of range index');
    if (r >= o && t >= n) return 0;
    if (r >= o) return -1;
    if (t >= n) return 1;
    if (((t >>>= 0), (n >>>= 0), (r >>>= 0), (o >>>= 0), this === e)) return 0;
    for (
      var s = o - r,
        d = n - t,
        l = a(s, d),
        h = this.slice(r, o),
        p = e.slice(t, n),
        u = 0;
      u < l;
      ++u
    )
      if (h[u] !== p[u]) {
        (s = h[u]), (d = p[u]);
        break;
      }
    return s < d ? -1 : d < s ? 1 : 0;
  });
function bidirectionalIndexOf(e, t, n, r, o) {
  if (0 === e.length) return -1;
  if (
    ('string' == typeof n
      ? ((r = n), (n = 0))
      : 2147483647 < n
      ? (n = 2147483647)
      : -2147483648 > n && (n = -2147483648),
    (n = +n),
    isNaN(n) && (n = o ? 0 : e.length - 1),
    0 > n && (n = e.length + n),
    n >= e.length)
  ) {
    if (o) return -1;
    n = e.length - 1;
  } else if (0 > n)
    if (o) n = 0;
    else return -1;
  if (('string' == typeof t && (t = Buffer$1.from(t, r)), internalIsBuffer(t)))
    return 0 === t.length ? -1 : arrayIndexOf(e, t, n, r, o);
  if ('number' == typeof t)
    return (
      (t &= 255),
      Buffer$1.TYPED_ARRAY_SUPPORT &&
      'function' == typeof Uint8Array.prototype.indexOf
        ? o
          ? Uint8Array.prototype.indexOf.call(e, t, n)
          : Uint8Array.prototype.lastIndexOf.call(e, t, n)
        : arrayIndexOf(e, [t], n, r, o)
    );
  throw new TypeError('val must be string, number or Buffer');
}
function arrayIndexOf(e, t, n, r, o) {
  function a(e, t) {
    return 1 === s ? e[t] : e.readUInt16BE(t * s);
  }
  var s = 1,
    d = e.length,
    l = t.length;
  if (
    void 0 !== r &&
    ((r = (r + '').toLowerCase()),
    'ucs2' === r || 'ucs-2' === r || 'utf16le' === r || 'utf-16le' === r)
  ) {
    if (2 > e.length || 2 > t.length) return -1;
    (s = 2), (d /= 2), (l /= 2), (n /= 2);
  }
  var h;
  if (o) {
    var p = -1;
    for (h = n; h < d; h++)
      if (a(e, h) !== a(t, -1 === p ? 0 : h - p))
        -1 !== p && (h -= h - p), (p = -1);
      else if ((-1 === p && (p = h), h - p + 1 === l)) return p * s;
  } else
    for (n + l > d && (n = d - l), h = n; 0 <= h; h--) {
      for (var u = !0, f = 0; f < l; f++)
        if (a(e, h + f) !== a(t, f)) {
          u = !1;
          break;
        }
      if (u) return h;
    }
  return -1;
}
(Buffer$1.prototype.includes = function (e, t, n) {
  return -1 !== this.indexOf(e, t, n);
}),
  (Buffer$1.prototype.indexOf = function (e, t, n) {
    return bidirectionalIndexOf(this, e, t, n, !0);
  }),
  (Buffer$1.prototype.lastIndexOf = function (e, t, n) {
    return bidirectionalIndexOf(this, e, t, n, !1);
  });
function hexWrite(e, t, n, r) {
  n = +n || 0;
  var o = e.length - n;
  r ? ((r = +r), r > o && (r = o)) : (r = o);
  var a = t.length;
  if (0 != a % 2) throw new TypeError('Invalid hex string');
  r > a / 2 && (r = a / 2);
  for (var s, d = 0; d < r; ++d) {
    if (((s = parseInt(t.substr(2 * d, 2), 16)), isNaN(s))) return d;
    e[n + d] = s;
  }
  return d;
}
function utf8Write(e, t, n, r) {
  return blitBuffer(utf8ToBytes(t, e.length - n), e, n, r);
}
function asciiWrite(e, t, n, r) {
  return blitBuffer(asciiToBytes(t), e, n, r);
}
function latin1Write(e, t, n, r) {
  return asciiWrite(e, t, n, r);
}
function base64Write(e, t, n, r) {
  return blitBuffer(base64ToBytes(t), e, n, r);
}
function ucs2Write(e, t, n, r) {
  return blitBuffer(utf16leToBytes(t, e.length - n), e, n, r);
}
(Buffer$1.prototype.write = function (e, t, n, r) {
  if (void 0 === t) (r = 'utf8'), (n = this.length), (t = 0);
  else if (void 0 === n && 'string' == typeof t)
    (r = t), (n = this.length), (t = 0);
  else if (isFinite(t))
    (t |= 0),
      isFinite(n)
        ? ((n |= 0), void 0 === r && (r = 'utf8'))
        : ((r = n), (n = void 0));
  else
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    );
  var o = this.length - t;
  if (
    ((void 0 === n || n > o) && (n = o),
    (0 < e.length && (0 > n || 0 > t)) || t > this.length)
  )
    throw new RangeError('Attempt to write outside buffer bounds');
  r || (r = 'utf8');
  for (var a = !1; ; )
    switch (r) {
      case 'hex':
        return hexWrite(this, e, t, n);
      case 'utf8':
      case 'utf-8':
        return utf8Write(this, e, t, n);
      case 'ascii':
        return asciiWrite(this, e, t, n);
      case 'latin1':
      case 'binary':
        return latin1Write(this, e, t, n);
      case 'base64':
        return base64Write(this, e, t, n);
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, e, t, n);
      default:
        if (a) throw new TypeError('Unknown encoding: ' + r);
        (r = ('' + r).toLowerCase()), (a = !0);
    }
}),
  (Buffer$1.prototype.toJSON = function () {
    return {
      type: 'Buffer',
      data: Array.prototype.slice.call(this._arr || this, 0),
    };
  });
function base64Slice(e, t, n) {
  return 0 === t && n === e.length
    ? fromByteArray(e)
    : fromByteArray(e.slice(t, n));
}
function utf8Slice(e, t, n) {
  n = Math.min(e.length, n);
  for (var r = [], o = t; o < n; ) {
    var a = e[o],
      s = null,
      d = 239 < a ? 4 : 223 < a ? 3 : 191 < a ? 2 : 1;
    if (o + d <= n) {
      var l, h, p, u;
      1 === d
        ? 128 > a && (s = a)
        : 2 === d
        ? ((l = e[o + 1]),
          128 == (192 & l) &&
            ((u = ((31 & a) << 6) | (63 & l)), 127 < u && (s = u)))
        : 3 === d
        ? ((l = e[o + 1]),
          (h = e[o + 2]),
          128 == (192 & l) &&
            128 == (192 & h) &&
            ((u = ((15 & a) << 12) | ((63 & l) << 6) | (63 & h)),
            2047 < u && (55296 > u || 57343 < u) && (s = u)))
        : 4 === d
        ? ((l = e[o + 1]),
          (h = e[o + 2]),
          (p = e[o + 3]),
          128 == (192 & l) &&
            128 == (192 & h) &&
            128 == (192 & p) &&
            ((u =
              ((15 & a) << 18) | ((63 & l) << 12) | ((63 & h) << 6) | (63 & p)),
            65535 < u && 1114112 > u && (s = u)))
        : void 0;
    }
    null === s
      ? ((s = 65533), (d = 1))
      : 65535 < s &&
        ((s -= 65536),
        r.push(55296 | (1023 & (s >>> 10))),
        (s = 56320 | (1023 & s))),
      r.push(s),
      (o += d);
  }
  return decodeCodePointsArray(r);
}
var MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(e) {
  var t = String.fromCharCode,
    n = e.length;
  if (n <= MAX_ARGUMENTS_LENGTH) return t.apply(String, e);
  for (var r = '', o = 0; o < n; )
    r += t.apply(String, e.slice(o, (o += MAX_ARGUMENTS_LENGTH)));
  return r;
}
function asciiSlice(e, t, n) {
  var r = '';
  n = Math.min(e.length, n);
  for (var o = t; o < n; ++o) r += String.fromCharCode(127 & e[o]);
  return r;
}
function latin1Slice(e, t, n) {
  var r = '';
  n = Math.min(e.length, n);
  for (var o = t; o < n; ++o) r += String.fromCharCode(e[o]);
  return r;
}
function hexSlice(e, t, n) {
  var r = e.length;
  (!t || 0 > t) && (t = 0), (!n || 0 > n || n > r) && (n = r);
  for (var o = '', a = t; a < n; ++a) o += toHex(e[a]);
  return o;
}
function utf16leSlice(e, t, n) {
  for (var r = e.slice(t, n), o = '', a = 0; a < r.length; a += 2)
    o += String.fromCharCode(r[a] + 256 * r[a + 1]);
  return o;
}
Buffer$1.prototype.slice = function (e, t) {
  var n = this.length;
  (e = ~~e),
    (t = t === void 0 ? n : ~~t),
    0 > e ? ((e += n), 0 > e && (e = 0)) : e > n && (e = n),
    0 > t ? ((t += n), 0 > t && (t = 0)) : t > n && (t = n),
    t < e && (t = e);
  var r;
  if (Buffer$1.TYPED_ARRAY_SUPPORT)
    (r = this.subarray(e, t)), (r.__proto__ = Buffer$1.prototype);
  else {
    var o = t - e;
    r = new Buffer$1(o, void 0);
    for (var a = 0; a < o; ++a) r[a] = this[a + e];
  }
  return r;
};
function checkOffset(e, t, n) {
  if (0 != e % 1 || 0 > e) throw new RangeError('offset is not uint');
  if (e + t > n) throw new RangeError('Trying to access beyond buffer length');
}
(Buffer$1.prototype.readUIntLE = function (e, t, n) {
  (e |= 0), (t |= 0), n || checkOffset(e, t, this.length);
  for (var r = this[e], o = 1, a = 0; ++a < t && (o *= 256); )
    r += this[e + a] * o;
  return r;
}),
  (Buffer$1.prototype.readUIntBE = function (e, t, n) {
    (e |= 0), (t |= 0), n || checkOffset(e, t, this.length);
    for (var r = this[e + --t], o = 1; 0 < t && (o *= 256); )
      r += this[e + --t] * o;
    return r;
  }),
  (Buffer$1.prototype.readUInt8 = function (e, t) {
    return t || checkOffset(e, 1, this.length), this[e];
  }),
  (Buffer$1.prototype.readUInt16LE = function (e, t) {
    return t || checkOffset(e, 2, this.length), this[e] | (this[e + 1] << 8);
  }),
  (Buffer$1.prototype.readUInt16BE = function (e, t) {
    return t || checkOffset(e, 2, this.length), (this[e] << 8) | this[e + 1];
  }),
  (Buffer$1.prototype.readUInt32LE = function (e, t) {
    return (
      t || checkOffset(e, 4, this.length),
      (this[e] | (this[e + 1] << 8) | (this[e + 2] << 16)) +
        16777216 * this[e + 3]
    );
  }),
  (Buffer$1.prototype.readUInt32BE = function (e, t) {
    return (
      t || checkOffset(e, 4, this.length),
      16777216 * this[e] +
        ((this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3])
    );
  }),
  (Buffer$1.prototype.readIntLE = function (e, t, n) {
    var r = Math.pow;
    (e |= 0), (t |= 0), n || checkOffset(e, t, this.length);
    for (var o = this[e], a = 1, s = 0; ++s < t && (a *= 256); )
      o += this[e + s] * a;
    return (a *= 128), o >= a && (o -= r(2, 8 * t)), o;
  }),
  (Buffer$1.prototype.readIntBE = function (e, t, n) {
    var r = Math.pow;
    (e |= 0), (t |= 0), n || checkOffset(e, t, this.length);
    for (var o = t, a = 1, s = this[e + --o]; 0 < o && (a *= 256); )
      s += this[e + --o] * a;
    return (a *= 128), s >= a && (s -= r(2, 8 * t)), s;
  }),
  (Buffer$1.prototype.readInt8 = function (e, t) {
    return (
      t || checkOffset(e, 1, this.length),
      128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
    );
  }),
  (Buffer$1.prototype.readInt16LE = function (e, t) {
    t || checkOffset(e, 2, this.length);
    var n = this[e] | (this[e + 1] << 8);
    return 32768 & n ? 4294901760 | n : n;
  }),
  (Buffer$1.prototype.readInt16BE = function (e, t) {
    t || checkOffset(e, 2, this.length);
    var n = this[e + 1] | (this[e] << 8);
    return 32768 & n ? 4294901760 | n : n;
  }),
  (Buffer$1.prototype.readInt32LE = function (e, t) {
    return (
      t || checkOffset(e, 4, this.length),
      this[e] | (this[e + 1] << 8) | (this[e + 2] << 16) | (this[e + 3] << 24)
    );
  }),
  (Buffer$1.prototype.readInt32BE = function (e, t) {
    return (
      t || checkOffset(e, 4, this.length),
      (this[e] << 24) | (this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3]
    );
  }),
  (Buffer$1.prototype.readFloatLE = function (e, t) {
    return t || checkOffset(e, 4, this.length), read(this, e, !0, 23, 4);
  }),
  (Buffer$1.prototype.readFloatBE = function (e, t) {
    return t || checkOffset(e, 4, this.length), read(this, e, !1, 23, 4);
  }),
  (Buffer$1.prototype.readDoubleLE = function (e, t) {
    return t || checkOffset(e, 8, this.length), read(this, e, !0, 52, 8);
  }),
  (Buffer$1.prototype.readDoubleBE = function (e, t) {
    return t || checkOffset(e, 8, this.length), read(this, e, !1, 52, 8);
  });
function checkInt(e, t, n, r, o, a) {
  if (!internalIsBuffer(e))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (t > o || t < a) throw new RangeError('"value" argument is out of bounds');
  if (n + r > e.length) throw new RangeError('Index out of range');
}
(Buffer$1.prototype.writeUIntLE = function (e, t, n, r) {
  var o = Math.pow;
  if (((e = +e), (t |= 0), (n |= 0), !r)) {
    var a = o(2, 8 * n) - 1;
    checkInt(this, e, t, n, a, 0);
  }
  var s = 1,
    d = 0;
  for (this[t] = 255 & e; ++d < n && (s *= 256); ) this[t + d] = 255 & (e / s);
  return t + n;
}),
  (Buffer$1.prototype.writeUIntBE = function (e, t, n, r) {
    var o = Math.pow;
    if (((e = +e), (t |= 0), (n |= 0), !r)) {
      var a = o(2, 8 * n) - 1;
      checkInt(this, e, t, n, a, 0);
    }
    var s = n - 1,
      d = 1;
    for (this[t + s] = 255 & e; 0 <= --s && (d *= 256); )
      this[t + s] = 255 & (e / d);
    return t + n;
  }),
  (Buffer$1.prototype.writeUInt8 = function (e, t, n) {
    var r = Math.floor;
    return (
      (e = +e),
      (t |= 0),
      n || checkInt(this, e, t, 1, 255, 0),
      Buffer$1.TYPED_ARRAY_SUPPORT || (e = r(e)),
      (this[t] = 255 & e),
      t + 1
    );
  });
function objectWriteUInt16(e, t, n, r) {
  0 > t && (t = 65535 + t + 1);
  for (var o = 0, a = Math.min(e.length - n, 2); o < a; ++o)
    e[n + o] = (t & (255 << (8 * (r ? o : 1 - o)))) >>> (8 * (r ? o : 1 - o));
}
(Buffer$1.prototype.writeUInt16LE = function (e, t, n) {
  return (
    (e = +e),
    (t |= 0),
    n || checkInt(this, e, t, 2, 65535, 0),
    Buffer$1.TYPED_ARRAY_SUPPORT
      ? ((this[t] = 255 & e), (this[t + 1] = e >>> 8))
      : objectWriteUInt16(this, e, t, !0),
    t + 2
  );
}),
  (Buffer$1.prototype.writeUInt16BE = function (e, t, n) {
    return (
      (e = +e),
      (t |= 0),
      n || checkInt(this, e, t, 2, 65535, 0),
      Buffer$1.TYPED_ARRAY_SUPPORT
        ? ((this[t] = e >>> 8), (this[t + 1] = 255 & e))
        : objectWriteUInt16(this, e, t, !1),
      t + 2
    );
  });
function objectWriteUInt32(e, t, n, r) {
  0 > t && (t = 4294967295 + t + 1);
  for (var o = 0, a = Math.min(e.length - n, 4); o < a; ++o)
    e[n + o] = 255 & (t >>> (8 * (r ? o : 3 - o)));
}
(Buffer$1.prototype.writeUInt32LE = function (e, t, n) {
  return (
    (e = +e),
    (t |= 0),
    n || checkInt(this, e, t, 4, 4294967295, 0),
    Buffer$1.TYPED_ARRAY_SUPPORT
      ? ((this[t + 3] = e >>> 24),
        (this[t + 2] = e >>> 16),
        (this[t + 1] = e >>> 8),
        (this[t] = 255 & e))
      : objectWriteUInt32(this, e, t, !0),
    t + 4
  );
}),
  (Buffer$1.prototype.writeUInt32BE = function (e, t, n) {
    return (
      (e = +e),
      (t |= 0),
      n || checkInt(this, e, t, 4, 4294967295, 0),
      Buffer$1.TYPED_ARRAY_SUPPORT
        ? ((this[t] = e >>> 24),
          (this[t + 1] = e >>> 16),
          (this[t + 2] = e >>> 8),
          (this[t + 3] = 255 & e))
        : objectWriteUInt32(this, e, t, !1),
      t + 4
    );
  }),
  (Buffer$1.prototype.writeIntLE = function (e, t, n, r) {
    var o = Math.pow;
    if (((e = +e), (t |= 0), !r)) {
      var a = o(2, 8 * n - 1);
      checkInt(this, e, t, n, a - 1, -a);
    }
    var s = 0,
      d = 1,
      l = 0;
    for (this[t] = 255 & e; ++s < n && (d *= 256); )
      0 > e && 0 === l && 0 !== this[t + s - 1] && (l = 1),
        (this[t + s] = 255 & (((e / d) >> 0) - l));
    return t + n;
  }),
  (Buffer$1.prototype.writeIntBE = function (e, t, n, r) {
    var o = Math.pow;
    if (((e = +e), (t |= 0), !r)) {
      var a = o(2, 8 * n - 1);
      checkInt(this, e, t, n, a - 1, -a);
    }
    var s = n - 1,
      d = 1,
      l = 0;
    for (this[t + s] = 255 & e; 0 <= --s && (d *= 256); )
      0 > e && 0 === l && 0 !== this[t + s + 1] && (l = 1),
        (this[t + s] = 255 & (((e / d) >> 0) - l));
    return t + n;
  }),
  (Buffer$1.prototype.writeInt8 = function (e, t, n) {
    var r = Math.floor;
    return (
      (e = +e),
      (t |= 0),
      n || checkInt(this, e, t, 1, 127, -128),
      Buffer$1.TYPED_ARRAY_SUPPORT || (e = r(e)),
      0 > e && (e = 255 + e + 1),
      (this[t] = 255 & e),
      t + 1
    );
  }),
  (Buffer$1.prototype.writeInt16LE = function (e, t, n) {
    return (
      (e = +e),
      (t |= 0),
      n || checkInt(this, e, t, 2, 32767, -32768),
      Buffer$1.TYPED_ARRAY_SUPPORT
        ? ((this[t] = 255 & e), (this[t + 1] = e >>> 8))
        : objectWriteUInt16(this, e, t, !0),
      t + 2
    );
  }),
  (Buffer$1.prototype.writeInt16BE = function (e, t, n) {
    return (
      (e = +e),
      (t |= 0),
      n || checkInt(this, e, t, 2, 32767, -32768),
      Buffer$1.TYPED_ARRAY_SUPPORT
        ? ((this[t] = e >>> 8), (this[t + 1] = 255 & e))
        : objectWriteUInt16(this, e, t, !1),
      t + 2
    );
  }),
  (Buffer$1.prototype.writeInt32LE = function (e, t, n) {
    return (
      (e = +e),
      (t |= 0),
      n || checkInt(this, e, t, 4, 2147483647, -2147483648),
      Buffer$1.TYPED_ARRAY_SUPPORT
        ? ((this[t] = 255 & e),
          (this[t + 1] = e >>> 8),
          (this[t + 2] = e >>> 16),
          (this[t + 3] = e >>> 24))
        : objectWriteUInt32(this, e, t, !0),
      t + 4
    );
  }),
  (Buffer$1.prototype.writeInt32BE = function (e, t, n) {
    return (
      (e = +e),
      (t |= 0),
      n || checkInt(this, e, t, 4, 2147483647, -2147483648),
      0 > e && (e = 4294967295 + e + 1),
      Buffer$1.TYPED_ARRAY_SUPPORT
        ? ((this[t] = e >>> 24),
          (this[t + 1] = e >>> 16),
          (this[t + 2] = e >>> 8),
          (this[t + 3] = 255 & e))
        : objectWriteUInt32(this, e, t, !1),
      t + 4
    );
  });
function checkIEEE754(e, t, n, r) {
  if (n + r > e.length) throw new RangeError('Index out of range');
  if (0 > n) throw new RangeError('Index out of range');
}
function writeFloat(e, t, n, r, o) {
  return o || checkIEEE754(e, t, n, 4), write(e, t, n, r, 23, 4), n + 4;
}
(Buffer$1.prototype.writeFloatLE = function (e, t, n) {
  return writeFloat(this, e, t, !0, n);
}),
  (Buffer$1.prototype.writeFloatBE = function (e, t, n) {
    return writeFloat(this, e, t, !1, n);
  });
function writeDouble(e, t, n, r, o) {
  return o || checkIEEE754(e, t, n, 8), write(e, t, n, r, 52, 8), n + 8;
}
(Buffer$1.prototype.writeDoubleLE = function (e, t, n) {
  return writeDouble(this, e, t, !0, n);
}),
  (Buffer$1.prototype.writeDoubleBE = function (e, t, n) {
    return writeDouble(this, e, t, !1, n);
  }),
  (Buffer$1.prototype.copy = function (e, t, n, r) {
    if (
      (n || (n = 0),
      r || 0 === r || (r = this.length),
      t >= e.length && (t = e.length),
      t || (t = 0),
      0 < r && r < n && (r = n),
      r === n)
    )
      return 0;
    if (0 === e.length || 0 === this.length) return 0;
    if (0 > t) throw new RangeError('targetStart out of bounds');
    if (0 > n || n >= this.length)
      throw new RangeError('sourceStart out of bounds');
    if (0 > r) throw new RangeError('sourceEnd out of bounds');
    r > this.length && (r = this.length),
      e.length - t < r - n && (r = e.length - t + n);
    var o,
      a = r - n;
    if (this === e && n < t && t < r)
      for (o = a - 1; 0 <= o; --o) e[o + t] = this[o + n];
    else if (1e3 > a || !Buffer$1.TYPED_ARRAY_SUPPORT)
      for (o = 0; o < a; ++o) e[o + t] = this[o + n];
    else Uint8Array.prototype.set.call(e, this.subarray(n, n + a), t);
    return a;
  }),
  (Buffer$1.prototype.fill = function (e, t, n, r) {
    if ('string' == typeof e) {
      if (
        ('string' == typeof t
          ? ((r = t), (t = 0), (n = this.length))
          : 'string' == typeof n && ((r = n), (n = this.length)),
        1 === e.length)
      ) {
        var o = e.charCodeAt(0);
        256 > o && (e = o);
      }
      if (void 0 !== r && 'string' != typeof r)
        throw new TypeError('encoding must be a string');
      if ('string' == typeof r && !Buffer$1.isEncoding(r))
        throw new TypeError('Unknown encoding: ' + r);
    } else 'number' == typeof e && (e &= 255);
    if (0 > t || this.length < t || this.length < n)
      throw new RangeError('Out of range index');
    if (n <= t) return this;
    (t >>>= 0), (n = n === void 0 ? this.length : n >>> 0), e || (e = 0);
    var a;
    if ('number' == typeof e) for (a = t; a < n; ++a) this[a] = e;
    else {
      var s = internalIsBuffer(e)
          ? e
          : utf8ToBytes(new Buffer$1(e, r).toString()),
        d = s.length;
      for (a = 0; a < n - t; ++a) this[a + t] = s[a % d];
    }
    return this;
  });
var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
function base64clean(e) {
  if (((e = stringtrim(e).replace(INVALID_BASE64_RE, '')), 2 > e.length))
    return '';
  for (; 0 != e.length % 4; ) e += '=';
  return e;
}
function stringtrim(e) {
  return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, '');
}
function toHex(e) {
  return 16 > e ? '0' + e.toString(16) : e.toString(16);
}
function utf8ToBytes(e, t) {
  t = t || 1 / 0;
  for (var n, r = e.length, o = null, a = [], s = 0; s < r; ++s) {
    if (((n = e.charCodeAt(s)), 55295 < n && 57344 > n)) {
      if (!o) {
        if (56319 < n) {
          -1 < (t -= 3) && a.push(239, 191, 189);
          continue;
        } else if (s + 1 === r) {
          -1 < (t -= 3) && a.push(239, 191, 189);
          continue;
        }
        o = n;
        continue;
      }
      if (56320 > n) {
        -1 < (t -= 3) && a.push(239, 191, 189), (o = n);
        continue;
      }
      n = (((o - 55296) << 10) | (n - 56320)) + 65536;
    } else o && -1 < (t -= 3) && a.push(239, 191, 189);
    if (((o = null), 128 > n)) {
      if (0 > (t -= 1)) break;
      a.push(n);
    } else if (2048 > n) {
      if (0 > (t -= 2)) break;
      a.push(192 | (n >> 6), 128 | (63 & n));
    } else if (65536 > n) {
      if (0 > (t -= 3)) break;
      a.push(224 | (n >> 12), 128 | (63 & (n >> 6)), 128 | (63 & n));
    } else if (1114112 > n) {
      if (0 > (t -= 4)) break;
      a.push(
        240 | (n >> 18),
        128 | (63 & (n >> 12)),
        128 | (63 & (n >> 6)),
        128 | (63 & n)
      );
    } else throw new Error('Invalid code point');
  }
  return a;
}
function asciiToBytes(e) {
  for (var t = [], n = 0; n < e.length; ++n) t.push(255 & e.charCodeAt(n));
  return t;
}
function utf16leToBytes(e, t) {
  for (var n, r, o, a = [], s = 0; s < e.length && !(0 > (t -= 2)); ++s)
    (n = e.charCodeAt(s)), (r = n >> 8), (o = n % 256), a.push(o), a.push(r);
  return a;
}
function base64ToBytes(e) {
  return toByteArray(base64clean(e));
}
function blitBuffer(e, t, n, r) {
  for (var o = 0; o < r && !(o + n >= t.length || o >= e.length); ++o)
    t[o + n] = e[o];
  return o;
}
function isnan(e) {
  return e !== e;
}
function isBuffer(e) {
  return null != e && (!!e._isBuffer || isFastBuffer(e) || isSlowBuffer(e));
}
function isFastBuffer(e) {
  return (
    !!e.constructor &&
    'function' == typeof e.constructor.isBuffer &&
    e.constructor.isBuffer(e)
  );
}
function isSlowBuffer(e) {
  return (
    'function' == typeof e.readFloatLE &&
    'function' == typeof e.slice &&
    isFastBuffer(e.slice(0, 0))
  );
}
function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout,
  cachedClearTimeout = defaultClearTimeout;
'function' == typeof global$1.setTimeout && (cachedSetTimeout = setTimeout),
  'function' == typeof global$1.clearTimeout &&
    (cachedClearTimeout = clearTimeout);
function runTimeout(t) {
  if (cachedSetTimeout === setTimeout) return setTimeout(t, 0);
  if (
    (cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) &&
    setTimeout
  )
    return (cachedSetTimeout = setTimeout), setTimeout(t, 0);
  try {
    return cachedSetTimeout(t, 0);
  } catch (n) {
    try {
      return cachedSetTimeout.call(null, t, 0);
    } catch (n) {
      return cachedSetTimeout.call(this, t, 0);
    }
  }
}
function runClearTimeout(t) {
  if (cachedClearTimeout === clearTimeout) return clearTimeout(t);
  if (
    (cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) &&
    clearTimeout
  )
    return (cachedClearTimeout = clearTimeout), clearTimeout(t);
  try {
    return cachedClearTimeout(t);
  } catch (n) {
    try {
      return cachedClearTimeout.call(null, t);
    } catch (n) {
      return cachedClearTimeout.call(this, t);
    }
  }
}
var currentQueue,
  queue = [],
  draining = !1,
  queueIndex = -1;
function cleanUpNextTick() {
  draining &&
    currentQueue &&
    ((draining = !1),
    currentQueue.length
      ? (queue = currentQueue.concat(queue))
      : (queueIndex = -1),
    queue.length && drainQueue());
}
function drainQueue() {
  if (!draining) {
    var e = runTimeout(cleanUpNextTick);
    draining = !0;
    for (var t = queue.length; t; ) {
      for (currentQueue = queue, queue = []; ++queueIndex < t; )
        currentQueue && currentQueue[queueIndex].run();
      (queueIndex = -1), (t = queue.length);
    }
    (currentQueue = null), (draining = !1), runClearTimeout(e);
  }
}
function nextTick(e) {
  var t = Array(arguments.length - 1);
  if (1 < arguments.length)
    for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
  queue.push(new Item(e, t)),
    1 !== queue.length || draining || runTimeout(drainQueue);
}
function Item(e, t) {
  (this.fun = e), (this.array = t);
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
var title = 'browser',
  platform = 'browser',
  browser = !0,
  env = {},
  argv = [],
  version = '',
  versions = {},
  release = {},
  config = {};
function noop() {}
var on = noop,
  addListener = noop,
  once = noop,
  off = noop,
  removeListener = noop,
  removeAllListeners = noop,
  emit = noop;
function binding() {
  throw new Error('process.binding is not supported');
}
function cwd() {
  return '/';
}
function chdir() {
  throw new Error('process.chdir is not supported');
}
function umask() {
  return 0;
}
var performance = global$1.performance || {},
  performanceNow =
    performance.now ||
    performance.mozNow ||
    performance.msNow ||
    performance.oNow ||
    performance.webkitNow ||
    function () {
      return new Date().getTime();
    };
function hrtime(e) {
  var t = Math.floor,
    n = 1e-3 * performanceNow.call(performance),
    r = t(n),
    o = t(1e9 * (n % 1));
  return e && ((r -= e[0]), (o -= e[1]), 0 > o && (r--, (o += 1e9))), [r, o];
}
var startTime = new Date();
function uptime() {
  var e = new Date();
  return (e - startTime) / 1e3;
}
var inherits,
  browser$1 = {
    nextTick: nextTick,
    title: 'browser',
    browser: browser,
    env: env,
    argv: argv,
    version: version,
    versions: versions,
    on: on,
    addListener: addListener,
    once: once,
    off: off,
    removeListener: removeListener,
    removeAllListeners: removeAllListeners,
    emit: emit,
    binding: binding,
    cwd: cwd,
    chdir: chdir,
    umask: umask,
    hrtime: hrtime,
    platform: platform,
    release: release,
    config: config,
    uptime: uptime,
  };
inherits =
  'function' == typeof Object.create
    ? function (e, t) {
        (e.super_ = t),
          (e.prototype = Object.create(t.prototype, {
            constructor: {
              value: e,
              enumerable: !1,
              writable: !0,
              configurable: !0,
            },
          }));
      }
    : function (e, t) {
        e.super_ = t;
        var n = function () {};
        (n.prototype = t.prototype),
          (e.prototype = new n()),
          (e.prototype.constructor = e);
      };
var inherits$1 = inherits,
  formatRegExp = /%[sdj%]/g;
function format(e) {
  if (!isString(e)) {
    for (var t = [], n = 0; n < arguments.length; n++)
      t.push(inspect(arguments[n]));
    return t.join(' ');
  }
  for (
    var n = 1,
      r = arguments,
      o = r.length,
      a = (e + '').replace(formatRegExp, function (e) {
        if ('%%' === e) return '%';
        if (n >= o) return e;
        switch (e) {
          case '%s':
            return r[n++] + '';
          case '%d':
            return +r[n++];
          case '%j':
            try {
              return JSON.stringify(r[n++]);
            } catch (e) {
              return '[Circular]';
            }
          default:
            return e;
        }
      }),
      s = r[n];
    n < o;
    s = r[++n]
  )
    a += isNull(s) || !isObject(s) ? ' ' + s : ' ' + inspect(s);
  return a;
}
function deprecate(e, t) {
  function n() {
    if (!r) {
      if (browser$1.throwDeprecation) throw new Error(t);
      else browser$1.traceDeprecation ? console.trace(t) : console.error(t);
      r = !0;
    }
    return e.apply(this, arguments);
  }
  if (isUndefined(global$1.process))
    return function () {
      return deprecate(e, t).apply(this, arguments);
    };
  if (!0 === browser$1.noDeprecation) return e;
  var r = !1;
  return n;
}
var debugEnviron,
  debugs = {};
function debuglog(e) {
  if (
    (isUndefined(debugEnviron) &&
      (debugEnviron = browser$1.env.NODE_DEBUG || ''),
    (e = e.toUpperCase()),
    !debugs[e])
  )
    if (new RegExp('\\b' + e + '\\b', 'i').test(debugEnviron)) {
      debugs[e] = function () {
        var t = format.apply(null, arguments);
        console.error('%s %d: %s', e, 0, t);
      };
    } else debugs[e] = function () {};
  return debugs[e];
}
function inspect(e, t) {
  var n = { seen: [], stylize: stylizeNoColor };
  return (
    3 <= arguments.length && (n.depth = arguments[2]),
    4 <= arguments.length && (n.colors = arguments[3]),
    isBoolean(t) ? (n.showHidden = t) : t && _extend(n, t),
    isUndefined(n.showHidden) && (n.showHidden = !1),
    isUndefined(n.depth) && (n.depth = 2),
    isUndefined(n.colors) && (n.colors = !1),
    isUndefined(n.customInspect) && (n.customInspect = !0),
    n.colors && (n.stylize = stylizeWithColor),
    formatValue(n, e, n.depth)
  );
}
(inspect.colors = {
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  white: [37, 39],
  grey: [90, 39],
  black: [30, 39],
  blue: [34, 39],
  cyan: [36, 39],
  green: [32, 39],
  magenta: [35, 39],
  red: [31, 39],
  yellow: [33, 39],
}),
  (inspect.styles = {
    special: 'cyan',
    number: 'yellow',
    boolean: 'yellow',
    undefined: 'grey',
    null: 'bold',
    string: 'green',
    date: 'magenta',
    regexp: 'red',
  });
function stylizeWithColor(e, t) {
  var n = inspect.styles[t];
  return n
    ? '\x1B[' +
        inspect.colors[n][0] +
        'm' +
        e +
        '\x1B[' +
        inspect.colors[n][1] +
        'm'
    : e;
}
function stylizeNoColor(e) {
  return e;
}
function arrayToHash(e) {
  var t = {};
  return (
    e.forEach(function (e) {
      t[e] = !0;
    }),
    t
  );
}
function formatValue(e, t, r) {
  if (
    e.customInspect &&
    t &&
    isFunction(t.inspect) &&
    t.inspect !== inspect &&
    !(t.constructor && t.constructor.prototype === t)
  ) {
    var o = t.inspect(r, e);
    return isString(o) || (o = formatValue(e, o, r)), o;
  }
  var a = formatPrimitive(e, t);
  if (a) return a;
  var i = Object.keys(t),
    s = arrayToHash(i);
  if (
    (e.showHidden && (i = Object.getOwnPropertyNames(t)),
    isError(t) && (0 <= i.indexOf('message') || 0 <= i.indexOf('description')))
  )
    return formatError(t);
  if (0 === i.length) {
    if (isFunction(t)) {
      var d = t.name ? ': ' + t.name : '';
      return e.stylize('[Function' + d + ']', 'special');
    }
    if (isRegExp(t))
      return e.stylize(RegExp.prototype.toString.call(t), 'regexp');
    if (isDate(t)) return e.stylize(Date.prototype.toString.call(t), 'date');
    if (isError(t)) return formatError(t);
  }
  var l = '',
    h = !1,
    p = ['{', '}'];
  if ((isArray$2(t) && ((h = !0), (p = ['[', ']'])), isFunction(t))) {
    var u = t.name ? ': ' + t.name : '';
    l = ' [Function' + u + ']';
  }
  if (
    (isRegExp(t) && (l = ' ' + RegExp.prototype.toString.call(t)),
    isDate(t) && (l = ' ' + Date.prototype.toUTCString.call(t)),
    isError(t) && (l = ' ' + formatError(t)),
    0 === i.length && (!h || 0 == t.length))
  )
    return p[0] + l + p[1];
  if (0 > r)
    return isRegExp(t)
      ? e.stylize(RegExp.prototype.toString.call(t), 'regexp')
      : e.stylize('[Object]', 'special');
  e.seen.push(t);
  var n;
  return (
    (n = h
      ? formatArray(e, t, r, s, i)
      : i.map(function (n) {
          return formatProperty(e, t, r, s, n, h);
        })),
    e.seen.pop(),
    reduceToSingleString(n, l, p)
  );
}
function formatPrimitive(e, t) {
  if (isUndefined(t)) return e.stylize('undefined', 'undefined');
  if (isString(t)) {
    var n =
      "'" +
      JSON.stringify(t)
        .replace(/^"|"$/g, '')
        .replace(/'/g, "\\'")
        .replace(/\\"/g, '"') +
      "'";
    return e.stylize(n, 'string');
  }
  return isNumber(t)
    ? e.stylize('' + t, 'number')
    : isBoolean(t)
    ? e.stylize('' + t, 'boolean')
    : isNull(t)
    ? e.stylize('null', 'null')
    : void 0;
}
function formatError(e) {
  return '[' + Error.prototype.toString.call(e) + ']';
}
function formatArray(e, t, n, r, o) {
  for (var a = [], s = 0, d = t.length; s < d; ++s)
    hasOwnProperty$1(t, s + '')
      ? a.push(formatProperty(e, t, n, r, s + '', !0))
      : a.push('');
  return (
    o.forEach(function (o) {
      o.match(/^\d+$/) || a.push(formatProperty(e, t, n, r, o, !0));
    }),
    a
  );
}
function formatProperty(e, t, n, r, o, a) {
  var i, s, d;
  if (
    ((d = Object.getOwnPropertyDescriptor(t, o) || { value: t[o] }),
    d.get
      ? d.set
        ? (s = e.stylize('[Getter/Setter]', 'special'))
        : (s = e.stylize('[Getter]', 'special'))
      : d.set && (s = e.stylize('[Setter]', 'special')),
    hasOwnProperty$1(r, o) || (i = '[' + o + ']'),
    s ||
      (0 > e.seen.indexOf(d.value)
        ? ((s = isNull(n)
            ? formatValue(e, d.value, null)
            : formatValue(e, d.value, n - 1)),
          -1 < s.indexOf('\n') &&
            (a
              ? (s = s
                  .split('\n')
                  .map(function (e) {
                    return '  ' + e;
                  })
                  .join('\n')
                  .substr(2))
              : (s =
                  '\n' +
                  s
                    .split('\n')
                    .map(function (e) {
                      return '   ' + e;
                    })
                    .join('\n'))))
        : (s = e.stylize('[Circular]', 'special'))),
    isUndefined(i))
  ) {
    if (a && o.match(/^\d+$/)) return s;
    (i = JSON.stringify('' + o)),
      i.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)
        ? ((i = i.substr(1, i.length - 2)), (i = e.stylize(i, 'name')))
        : ((i = i
            .replace(/'/g, "\\'")
            .replace(/\\"/g, '"')
            .replace(/(^"|"$)/g, "'")),
          (i = e.stylize(i, 'string')));
  }
  return i + ': ' + s;
}
function reduceToSingleString(e, t, n) {
  var r = e.reduce(function (e, t) {
    if (0 <= t.indexOf('\n'));
    return e + t.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);
  return 60 < r
    ? n[0] + ('' === t ? '' : t + '\n ') + ' ' + e.join(',\n  ') + ' ' + n[1]
    : n[0] + t + ' ' + e.join(', ') + ' ' + n[1];
}
function isArray$2(e) {
  return Array.isArray(e);
}
function isBoolean(e) {
  return 'boolean' == typeof e;
}
function isNull(e) {
  return null === e;
}
function isNullOrUndefined(e) {
  return null == e;
}
function isNumber(e) {
  return 'number' == typeof e;
}
function isString(e) {
  return 'string' == typeof e;
}
function isUndefined(e) {
  return void 0 === e;
}
function isRegExp(e) {
  return isObject(e) && '[object RegExp]' === objectToString(e);
}
function isObject(e) {
  return 'object' == typeof e && null !== e;
}
function isDate(e) {
  return isObject(e) && '[object Date]' === objectToString(e);
}
function isError(t) {
  return (
    isObject(t) &&
    ('[object Error]' === objectToString(t) || t instanceof Error)
  );
}
function isFunction(e) {
  return 'function' == typeof e;
}
function objectToString(e) {
  return Object.prototype.toString.call(e);
}
function _extend(e, t) {
  if (!t || !isObject(t)) return e;
  for (var n = Object.keys(t), r = n.length; r--; ) e[n[r]] = t[n[r]];
  return e;
}
function hasOwnProperty$1(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
var url = {
  parse: urlParse,
  resolve: urlResolve,
  resolveObject: urlResolveObject,
  format: urlFormat,
  Url: Url,
};
function Url() {
  (this.protocol = null),
    (this.slashes = null),
    (this.auth = null),
    (this.host = null),
    (this.port = null),
    (this.hostname = null),
    (this.hash = null),
    (this.search = null),
    (this.query = null),
    (this.pathname = null),
    (this.path = null),
    (this.href = null);
}
var protocolPattern = /^([a-z0-9.+-]+:)/i,
  portPattern = /:[0-9]*$/,
  simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
  delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
  unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
  autoEscape = ["'"].concat(unwise),
  nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
  hostEndingChars = ['/', '?', '#'],
  hostnameMaxLen = 255,
  hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
  hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
  unsafeProtocol = { javascript: !0, 'javascript:': !0 },
  hostlessProtocol = { javascript: !0, 'javascript:': !0 },
  slashedProtocol = {
    http: !0,
    https: !0,
    ftp: !0,
    gopher: !0,
    file: !0,
    'http:': !0,
    'https:': !0,
    'ftp:': !0,
    'gopher:': !0,
    'file:': !0,
  };
function urlParse(e, t, n) {
  if (e && isObject(e) && e instanceof Url) return e;
  var r = new Url();
  return r.parse(e, t, n), r;
}
Url.prototype.parse = function (e, t, n) {
  return parse$1(this, e, t, n);
};
function parse$1(e, t, n, r) {
  if (!isString(t))
    throw new TypeError("Parameter 'url' must be a string, not " + typeof t);
  var o = t.indexOf('?'),
    a = -1 !== o && o < t.indexOf('#') ? '?' : '#',
    d = t.split(a);
  (d[0] = d[0].replace(/\\/g, '/')), (t = d.join(a));
  var u = t;
  if (((u = u.trim()), !r && 1 === t.split('#').length)) {
    var f = simplePathPattern.exec(u);
    if (f)
      return (
        (e.path = u),
        (e.href = u),
        (e.pathname = f[1]),
        f[2]
          ? ((e.search = f[2]),
            (e.query = n ? parse(e.search.substr(1)) : e.search.substr(1)))
          : n && ((e.search = ''), (e.query = {})),
        e
      );
  }
  var c = protocolPattern.exec(u);
  if (c) {
    c = c[0];
    var g = c.toLowerCase();
    (e.protocol = g), (u = u.substr(c.length));
  }
  if (r || c || u.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var m = '//' === u.substr(0, 2);
    m && !(c && hostlessProtocol[c]) && ((u = u.substr(2)), (e.slashes = !0));
  }
  var y, b, _, w;
  if (!hostlessProtocol[c] && (m || (c && !slashedProtocol[c]))) {
    var R = -1;
    for (y = 0; y < hostEndingChars.length; y++)
      (b = u.indexOf(hostEndingChars[y])),
        -1 !== b && (-1 === R || b < R) && (R = b);
    var v, x;
    for (
      x = -1 === R ? u.lastIndexOf('@') : u.lastIndexOf('@', R),
        -1 !== x &&
          ((v = u.slice(0, x)),
          (u = u.slice(x + 1)),
          (e.auth = decodeURIComponent(v))),
        R = -1,
        y = 0;
      y < nonHostChars.length;
      y++
    )
      (b = u.indexOf(nonHostChars[y])),
        -1 !== b && (-1 === R || b < R) && (R = b);
    -1 === R && (R = u.length),
      (e.host = u.slice(0, R)),
      (u = u.slice(R)),
      parseHost(e),
      (e.hostname = e.hostname || '');
    var E = '[' === e.hostname[0] && ']' === e.hostname[e.hostname.length - 1];
    if (!E) {
      var L = e.hostname.split(/\./);
      for (y = 0, _ = L.length; y < _; y++) {
        var S = L[y];
        if (S && !S.match(hostnamePartPattern)) {
          for (var A = '', C = 0, O = S.length; C < O; C++)
            A += 127 < S.charCodeAt(C) ? 'x' : S[C];
          if (!A.match(hostnamePartPattern)) {
            var P = L.slice(0, y),
              k = L.slice(y + 1),
              T = S.match(hostnamePartStart);
            T && (P.push(T[1]), k.unshift(T[2])),
              k.length && (u = '/' + k.join('.') + u),
              (e.hostname = P.join('.'));
            break;
          }
        }
      }
    }
    (e.hostname =
      e.hostname.length > hostnameMaxLen ? '' : e.hostname.toLowerCase()),
      E || (e.hostname = toASCII(e.hostname)),
      (w = e.port ? ':' + e.port : '');
    var B = e.hostname || '';
    (e.host = B + w),
      (e.href += e.host),
      E &&
        ((e.hostname = e.hostname.substr(1, e.hostname.length - 2)),
        '/' !== u[0] && (u = '/' + u));
  }
  if (!unsafeProtocol[g])
    for (y = 0, _ = autoEscape.length; y < _; y++) {
      var h = autoEscape[y];
      if (-1 !== u.indexOf(h)) {
        var q = encodeURIComponent(h);
        q === h && (q = escape(h)), (u = u.split(h).join(q));
      }
    }
  var M = u.indexOf('#');
  -1 !== M && ((e.hash = u.substr(M)), (u = u.slice(0, M)));
  var U = u.indexOf('?');
  if (
    (-1 === U
      ? n && ((e.search = ''), (e.query = {}))
      : ((e.search = u.substr(U)),
        (e.query = u.substr(U + 1)),
        n && (e.query = parse(e.query)),
        (u = u.slice(0, U))),
    u && (e.pathname = u),
    slashedProtocol[g] && e.hostname && !e.pathname && (e.pathname = '/'),
    e.pathname || e.search)
  ) {
    w = e.pathname || '';
    var I = e.search || '';
    e.path = w + I;
  }
  return (e.href = format$1(e)), e;
}
function urlFormat(e) {
  return isString(e) && (e = parse$1({}, e)), format$1(e);
}
function format$1(e) {
  var t = e.auth || '';
  t && ((t = encodeURIComponent(t)), (t = t.replace(/%3A/i, ':')), (t += '@'));
  var n = e.protocol || '',
    r = e.pathname || '',
    o = e.hash || '',
    a = !1,
    i = '';
  e.host
    ? (a = t + e.host)
    : e.hostname &&
      ((a =
        t +
        (-1 === e.hostname.indexOf(':')
          ? e.hostname
          : '[' + this.hostname + ']')),
      e.port && (a += ':' + e.port)),
    e.query &&
      isObject(e.query) &&
      Object.keys(e.query).length &&
      (i = stringify(e.query));
  var s = e.search || (i && '?' + i) || '';
  return (
    n && ':' !== n.substr(-1) && (n += ':'),
    e.slashes || ((!n || slashedProtocol[n]) && !1 !== a)
      ? ((a = '//' + (a || '')), r && '/' !== r.charAt(0) && (r = '/' + r))
      : !a && (a = ''),
    o && '#' !== o.charAt(0) && (o = '#' + o),
    s && '?' !== s.charAt(0) && (s = '?' + s),
    (r = r.replace(/[?#]/g, function (e) {
      return encodeURIComponent(e);
    })),
    (s = s.replace('#', '%23')),
    n + a + r + s + o
  );
}
Url.prototype.format = function () {
  return format$1(this);
};
function urlResolve(e, t) {
  return urlParse(e, !1, !0).resolve(t);
}
Url.prototype.resolve = function (e) {
  return this.resolveObject(urlParse(e, !1, !0)).format();
};
function urlResolveObject(e, t) {
  return e ? urlParse(e, !1, !0).resolveObject(t) : t;
}
(Url.prototype.resolveObject = function (e) {
  if (isString(e)) {
    var t = new Url();
    t.parse(e, !1, !0), (e = t);
  }
  for (var n, r = new Url(), o = Object.keys(this), a = 0; a < o.length; a++)
    (n = o[a]), (r[n] = this[n]);
  if (((r.hash = e.hash), '' === e.href)) return (r.href = r.format()), r;
  if (e.slashes && !e.protocol) {
    for (var d, l = Object.keys(e), h = 0; h < l.length; h++)
      (d = l[h]), 'protocol' !== d && (r[d] = e[d]);
    return (
      slashedProtocol[r.protocol] &&
        r.hostname &&
        !r.pathname &&
        (r.path = r.pathname = '/'),
      (r.href = r.format()),
      r
    );
  }
  var u;
  if (e.protocol && e.protocol !== r.protocol) {
    if (!slashedProtocol[e.protocol]) {
      for (var f, c = Object.keys(e), g = 0; g < c.length; g++)
        (f = c[g]), (r[f] = e[f]);
      return (r.href = r.format()), r;
    }
    if (((r.protocol = e.protocol), !e.host && !hostlessProtocol[e.protocol])) {
      for (
        u = (e.pathname || '').split('/');
        u.length && !(e.host = u.shift());

      );
      e.host || (e.host = ''),
        e.hostname || (e.hostname = ''),
        '' !== u[0] && u.unshift(''),
        2 > u.length && u.unshift(''),
        (r.pathname = u.join('/'));
    } else r.pathname = e.pathname;
    if (
      ((r.search = e.search),
      (r.query = e.query),
      (r.host = e.host || ''),
      (r.auth = e.auth),
      (r.hostname = e.hostname || e.host),
      (r.port = e.port),
      r.pathname || r.search)
    ) {
      var m = r.pathname || '',
        p = r.search || '';
      r.path = m + p;
    }
    return (r.slashes = r.slashes || e.slashes), (r.href = r.format()), r;
  }
  var s = r.pathname && '/' === r.pathname.charAt(0),
    y = e.host || (e.pathname && '/' === e.pathname.charAt(0)),
    b = y || s || (r.host && e.pathname),
    _ = b,
    w = (r.pathname && r.pathname.split('/')) || [],
    R = r.protocol && !slashedProtocol[r.protocol];
  (u = (e.pathname && e.pathname.split('/')) || []),
    R &&
      ((r.hostname = ''),
      (r.port = null),
      r.host && ('' === w[0] ? (w[0] = r.host) : w.unshift(r.host)),
      (r.host = ''),
      e.protocol &&
        ((e.hostname = null),
        (e.port = null),
        e.host && ('' === u[0] ? (u[0] = e.host) : u.unshift(e.host)),
        (e.host = null)),
      (b = b && ('' === u[0] || '' === w[0])));
  var x;
  if (y)
    (r.host = e.host || '' === e.host ? e.host : r.host),
      (r.hostname = e.hostname || '' === e.hostname ? e.hostname : r.hostname),
      (r.search = e.search),
      (r.query = e.query),
      (w = u);
  else if (u.length)
    w || (w = []),
      w.pop(),
      (w = w.concat(u)),
      (r.search = e.search),
      (r.query = e.query);
  else if (!isNullOrUndefined(e.search))
    return (
      R &&
        ((r.hostname = r.host = w.shift()),
        (x = !!(r.host && 0 < r.host.indexOf('@')) && r.host.split('@')),
        x && ((r.auth = x.shift()), (r.host = r.hostname = x.shift()))),
      (r.search = e.search),
      (r.query = e.query),
      (isNull(r.pathname) && isNull(r.search)) ||
        (r.path = (r.pathname ? r.pathname : '') + (r.search ? r.search : '')),
      (r.href = r.format()),
      r
    );
  if (!w.length)
    return (
      (r.pathname = null),
      (r.path = r.search ? '/' + r.search : null),
      (r.href = r.format()),
      r
    );
  for (
    var E = w.slice(-1)[0],
      L =
        ((r.host || e.host || 1 < w.length) && ('.' === E || '..' === E)) ||
        '' === E,
      S = 0,
      A = w.length;
    0 <= A;
    A--
  )
    (E = w[A]),
      '.' === E
        ? w.splice(A, 1)
        : '..' === E
        ? (w.splice(A, 1), S++)
        : S && (w.splice(A, 1), S--);
  if (!b && !_) for (; S--; S) w.unshift('..');
  b && '' !== w[0] && (!w[0] || '/' !== w[0].charAt(0)) && w.unshift(''),
    L && '/' !== w.join('/').substr(-1) && w.push('');
  var C = '' === w[0] || (w[0] && '/' === w[0].charAt(0));
  return (
    R &&
      ((r.hostname = r.host = C ? '' : w.length ? w.shift() : ''),
      (x = !!(r.host && 0 < r.host.indexOf('@')) && r.host.split('@')),
      x && ((r.auth = x.shift()), (r.host = r.hostname = x.shift()))),
    (b = b || (r.host && w.length)),
    b && !C && w.unshift(''),
    w.length
      ? (r.pathname = w.join('/'))
      : ((r.pathname = null), (r.path = null)),
    (isNull(r.pathname) && isNull(r.search)) ||
      (r.path = (r.pathname ? r.pathname : '') + (r.search ? r.search : '')),
    (r.auth = e.auth || r.auth),
    (r.slashes = r.slashes || e.slashes),
    (r.href = r.format()),
    r
  );
}),
  (Url.prototype.parseHost = function () {
    return parseHost(this);
  });
function parseHost(e) {
  var t = e.host,
    n = portPattern.exec(t);
  n &&
    ((n = n[0]),
    ':' !== n && (e.port = n.substr(1)),
    (t = t.substr(0, t.length - n.length))),
    t && (e.hostname = t);
}
var _blobConstructor,
  hasFetch =
    isFunction$1(global$1.fetch) && isFunction$1(global$1.ReadableStream);
function blobConstructor() {
  if ('undefined' != typeof _blobConstructor) return _blobConstructor;
  try {
    new global$1.Blob([new ArrayBuffer(1)]), (_blobConstructor = !0);
  } catch (t) {
    _blobConstructor = !1;
  }
  return _blobConstructor;
}
var xhr;
function checkTypeSupport(e) {
  xhr ||
    ((xhr = new global$1.XMLHttpRequest()),
    xhr.open('GET', global$1.location.host ? '/' : 'https://example.com'));
  try {
    return (xhr.responseType = e), xhr.responseType === e;
  } catch (t) {
    return !1;
  }
}
var haveArrayBuffer = 'undefined' != typeof global$1.ArrayBuffer,
  haveSlice =
    haveArrayBuffer && isFunction$1(global$1.ArrayBuffer.prototype.slice),
  arraybuffer = haveArrayBuffer && checkTypeSupport('arraybuffer'),
  msstream = !hasFetch && haveSlice && checkTypeSupport('ms-stream'),
  mozchunkedarraybuffer =
    !hasFetch && haveArrayBuffer && checkTypeSupport('moz-chunked-arraybuffer'),
  overrideMimeType = isFunction$1(xhr.overrideMimeType),
  vbArray = isFunction$1(global$1.VBArray);
function isFunction$1(e) {
  return 'function' == typeof e;
}
xhr = null;
var domain;
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);
function EventEmitter() {
  EventEmitter.init.call(this);
}
(EventEmitter.EventEmitter = EventEmitter),
  (EventEmitter.usingDomains = !1),
  (EventEmitter.prototype.domain = void 0),
  (EventEmitter.prototype._events = void 0),
  (EventEmitter.prototype._maxListeners = void 0),
  (EventEmitter.defaultMaxListeners = 10),
  (EventEmitter.init = function () {
    if (((this.domain = null), EventEmitter.usingDomains && domain.active));
    (this._events && this._events !== Object.getPrototypeOf(this)._events) ||
      ((this._events = new EventHandlers()), (this._eventsCount = 0)),
      (this._maxListeners = this._maxListeners || void 0);
  }),
  (EventEmitter.prototype.setMaxListeners = function (e) {
    if ('number' != typeof e || 0 > e || isNaN(e))
      throw new TypeError('"n" argument must be a positive number');
    return (this._maxListeners = e), this;
  });
function $getMaxListeners(e) {
  return void 0 === e._maxListeners
    ? EventEmitter.defaultMaxListeners
    : e._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function () {
  return $getMaxListeners(this);
};
function emitNone(e, t, n) {
  if (t) e.call(n);
  else
    for (var r = e.length, o = arrayClone(e, r), a = 0; a < r; ++a)
      o[a].call(n);
}
function emitOne(e, t, n, r) {
  if (t) e.call(n, r);
  else
    for (var o = e.length, a = arrayClone(e, o), s = 0; s < o; ++s)
      a[s].call(n, r);
}
function emitTwo(e, t, n, r, o) {
  if (t) e.call(n, r, o);
  else
    for (var a = e.length, s = arrayClone(e, a), d = 0; d < a; ++d)
      s[d].call(n, r, o);
}
function emitThree(e, t, n, r, o, a) {
  if (t) e.call(n, r, o, a);
  else
    for (var s = e.length, d = arrayClone(e, s), l = 0; l < s; ++l)
      d[l].call(n, r, o, a);
}
function emitMany(e, t, n, r) {
  if (t) e.apply(n, r);
  else
    for (var o = e.length, a = arrayClone(e, o), s = 0; s < o; ++s)
      a[s].apply(n, r);
}
EventEmitter.prototype.emit = function (e) {
  var t,
    n,
    r,
    o,
    a,
    s,
    d,
    l = 'error' === e;
  if (((s = this._events), s)) l = l && null == s.error;
  else if (!l) return !1;
  if (((d = this.domain), l)) {
    if (((t = arguments[1]), d))
      t || (t = new Error('Uncaught, unspecified "error" event')),
        (t.domainEmitter = this),
        (t.domain = d),
        (t.domainThrown = !1),
        d.emit('error', t);
    else if (t instanceof Error) throw t;
    else {
      var h = new Error('Uncaught, unspecified "error" event. (' + t + ')');
      throw ((h.context = t), h);
    }
    return !1;
  }
  if (((n = s[e]), !n)) return !1;
  var p = 'function' == typeof n;
  switch (((r = arguments.length), r)) {
    case 1:
      emitNone(n, p, this);
      break;
    case 2:
      emitOne(n, p, this, arguments[1]);
      break;
    case 3:
      emitTwo(n, p, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(n, p, this, arguments[1], arguments[2], arguments[3]);
      break;
    default:
      for (o = Array(r - 1), a = 1; a < r; a++) o[a - 1] = arguments[a];
      emitMany(n, p, this, o);
  }
  return !0;
};
function _addListener(e, t, n, r) {
  var o, a, i;
  if ('function' != typeof n)
    throw new TypeError('"listener" argument must be a function');
  if (
    ((a = e._events),
    a
      ? (a.newListener &&
          (e.emit('newListener', t, n.listener ? n.listener : n),
          (a = e._events)),
        (i = a[t]))
      : ((a = e._events = new EventHandlers()), (e._eventsCount = 0)),
    !i)
  )
    (i = a[t] = n), ++e._eventsCount;
  else if (
    ('function' == typeof i
      ? (i = a[t] = r ? [n, i] : [i, n])
      : r
      ? i.unshift(n)
      : i.push(n),
    !i.warned && ((o = $getMaxListeners(e)), o && 0 < o && i.length > o))
  ) {
    i.warned = !0;
    var s = new Error(
      'Possible EventEmitter memory leak detected. ' +
        i.length +
        ' ' +
        t +
        ' listeners added. Use emitter.setMaxListeners() to increase limit'
    );
    (s.name = 'MaxListenersExceededWarning'),
      (s.emitter = e),
      (s.type = t),
      (s.count = i.length),
      emitWarning(s);
  }
  return e;
}
function emitWarning(t) {
  'function' == typeof console.warn ? console.warn(t) : console.log(t);
}
(EventEmitter.prototype.addListener = function (e, t) {
  return _addListener(this, e, t, !1);
}),
  (EventEmitter.prototype.on = EventEmitter.prototype.addListener),
  (EventEmitter.prototype.prependListener = function (e, t) {
    return _addListener(this, e, t, !0);
  });
function _onceWrap(e, t, n) {
  function r() {
    e.removeListener(t, r), o || ((o = !0), n.apply(e, arguments));
  }
  var o = !1;
  return (r.listener = n), r;
}
(EventEmitter.prototype.once = function (e, t) {
  if ('function' != typeof t)
    throw new TypeError('"listener" argument must be a function');
  return this.on(e, _onceWrap(this, e, t)), this;
}),
  (EventEmitter.prototype.prependOnceListener = function (e, t) {
    if ('function' != typeof t)
      throw new TypeError('"listener" argument must be a function');
    return this.prependListener(e, _onceWrap(this, e, t)), this;
  }),
  (EventEmitter.prototype.removeListener = function (e, t) {
    var n, r, o, a, s;
    if ('function' != typeof t)
      throw new TypeError('"listener" argument must be a function');
    if (((r = this._events), !r)) return this;
    if (((n = r[e]), !n)) return this;
    if (n === t || (n.listener && n.listener === t))
      0 == --this._eventsCount
        ? (this._events = new EventHandlers())
        : (delete r[e],
          r.removeListener && this.emit('removeListener', e, n.listener || t));
    else if ('function' != typeof n) {
      for (o = -1, a = n.length; 0 < a--; )
        if (n[a] === t || (n[a].listener && n[a].listener === t)) {
          (s = n[a].listener), (o = a);
          break;
        }
      if (0 > o) return this;
      if (1 === n.length) {
        if (((n[0] = void 0), 0 == --this._eventsCount))
          return (this._events = new EventHandlers()), this;
        delete r[e];
      } else spliceOne(n, o);
      r.removeListener && this.emit('removeListener', e, s || t);
    }
    return this;
  }),
  (EventEmitter.prototype.removeAllListeners = function (e) {
    var t, n;
    if (((n = this._events), !n)) return this;
    if (!n.removeListener)
      return (
        0 === arguments.length
          ? ((this._events = new EventHandlers()), (this._eventsCount = 0))
          : n[e] &&
            (0 == --this._eventsCount
              ? (this._events = new EventHandlers())
              : delete n[e]),
        this
      );
    if (0 === arguments.length) {
      for (var r, o = Object.keys(n), a = 0; a < o.length; ++a)
        (r = o[a]), 'removeListener' === r || this.removeAllListeners(r);
      return (
        this.removeAllListeners('removeListener'),
        (this._events = new EventHandlers()),
        (this._eventsCount = 0),
        this
      );
    }
    if (((t = n[e]), 'function' == typeof t)) this.removeListener(e, t);
    else if (t)
      do this.removeListener(e, t[t.length - 1]);
      while (t[0]);
    return this;
  }),
  (EventEmitter.prototype.listeners = function (e) {
    var t,
      n,
      r = this._events;
    return (
      r
        ? ((t = r[e]),
          (n = t
            ? 'function' == typeof t
              ? [t.listener || t]
              : unwrapListeners(t)
            : []))
        : (n = []),
      n
    );
  }),
  (EventEmitter.listenerCount = function (e, t) {
    return 'function' == typeof e.listenerCount
      ? e.listenerCount(t)
      : listenerCount.call(e, t);
  }),
  (EventEmitter.prototype.listenerCount = listenerCount);
function listenerCount(e) {
  var t = this._events;
  if (t) {
    var n = t[e];
    if ('function' == typeof n) return 1;
    if (n) return n.length;
  }
  return 0;
}
EventEmitter.prototype.eventNames = function () {
  return 0 < this._eventsCount ? Reflect.ownKeys(this._events) : [];
};
function spliceOne(e, t) {
  for (var r = t, o = r + 1, a = e.length; o < a; r += 1, o += 1) e[r] = e[o];
  e.pop();
}
function arrayClone(e, t) {
  for (var n = Array(t); t--; ) n[t] = e[t];
  return n;
}
function unwrapListeners(e) {
  for (var t = Array(e.length), n = 0; n < t.length; ++n)
    t[n] = e[n].listener || e[n];
  return t;
}
function BufferList() {
  (this.head = null), (this.tail = null), (this.length = 0);
}
(BufferList.prototype.push = function (e) {
  var t = { data: e, next: null };
  0 < this.length ? (this.tail.next = t) : (this.head = t),
    (this.tail = t),
    ++this.length;
}),
  (BufferList.prototype.unshift = function (e) {
    var t = { data: e, next: this.head };
    0 === this.length && (this.tail = t), (this.head = t), ++this.length;
  }),
  (BufferList.prototype.shift = function () {
    if (0 !== this.length) {
      var e = this.head.data;
      return (
        (this.head = 1 === this.length ? (this.tail = null) : this.head.next),
        --this.length,
        e
      );
    }
  }),
  (BufferList.prototype.clear = function () {
    (this.head = this.tail = null), (this.length = 0);
  }),
  (BufferList.prototype.join = function (e) {
    if (0 === this.length) return '';
    for (var t = this.head, n = '' + t.data; (t = t.next); ) n += e + t.data;
    return n;
  }),
  (BufferList.prototype.concat = function (e) {
    if (0 === this.length) return Buffer$1.alloc(0);
    if (1 === this.length) return this.head.data;
    for (var t = Buffer$1.allocUnsafe(e >>> 0), n = this.head, r = 0; n; )
      n.data.copy(t, r), (r += n.data.length), (n = n.next);
    return t;
  });
var isBufferEncoding =
  Buffer$1.isEncoding ||
  function (e) {
    switch (e && e.toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'binary':
      case 'base64':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
      case 'raw':
        return !0;
      default:
        return !1;
    }
  };
function assertEncoding(e) {
  if (e && !isBufferEncoding(e)) throw new Error('Unknown encoding: ' + e);
}
function StringDecoder(e) {
  switch (
    ((this.encoding = (e || 'utf8').toLowerCase().replace(/[-_]/, '')),
    assertEncoding(e),
    this.encoding)
  ) {
    case 'utf8':
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      (this.surrogateSize = 2),
        (this.detectIncompleteChar = utf16DetectIncompleteChar);
      break;
    case 'base64':
      (this.surrogateSize = 3),
        (this.detectIncompleteChar = base64DetectIncompleteChar);
      break;
    default:
      return void (this.write = passThroughWrite);
  }
  (this.charBuffer = new Buffer$1(6)),
    (this.charReceived = 0),
    (this.charLength = 0);
}
(StringDecoder.prototype.write = function (e) {
  for (var t, n = ''; this.charLength; ) {
    if (
      ((t =
        e.length >= this.charLength - this.charReceived
          ? this.charLength - this.charReceived
          : e.length),
      e.copy(this.charBuffer, this.charReceived, 0, t),
      (this.charReceived += t),
      this.charReceived < this.charLength)
    )
      return '';
    (e = e.slice(t, e.length)),
      (n = this.charBuffer.slice(0, this.charLength).toString(this.encoding));
    var r = n.charCodeAt(n.length - 1);
    if (55296 <= r && 56319 >= r) {
      (this.charLength += this.surrogateSize), (n = '');
      continue;
    }
    if (((this.charReceived = this.charLength = 0), 0 === e.length)) return n;
    break;
  }
  this.detectIncompleteChar(e);
  var o = e.length;
  this.charLength &&
    (e.copy(this.charBuffer, 0, e.length - this.charReceived, o),
    (o -= this.charReceived)),
    (n += e.toString(this.encoding, 0, o));
  var o = n.length - 1,
    r = n.charCodeAt(o);
  if (55296 <= r && 56319 >= r) {
    var a = this.surrogateSize;
    return (
      (this.charLength += a),
      (this.charReceived += a),
      this.charBuffer.copy(this.charBuffer, a, 0, a),
      e.copy(this.charBuffer, 0, 0, a),
      n.substring(0, o)
    );
  }
  return n;
}),
  (StringDecoder.prototype.detectIncompleteChar = function (e) {
    for (var t = 3 <= e.length ? 3 : e.length; 0 < t; t--) {
      var n = e[e.length - t];
      if (1 == t && 6 == n >> 5) {
        this.charLength = 2;
        break;
      }
      if (2 >= t && 14 == n >> 4) {
        this.charLength = 3;
        break;
      }
      if (3 >= t && 30 == n >> 3) {
        this.charLength = 4;
        break;
      }
    }
    this.charReceived = t;
  }),
  (StringDecoder.prototype.end = function (e) {
    var t = '';
    if ((e && e.length && (t = this.write(e)), this.charReceived)) {
      var n = this.charReceived,
        r = this.charBuffer,
        o = this.encoding;
      t += r.slice(0, n).toString(o);
    }
    return t;
  });
function passThroughWrite(e) {
  return e.toString(this.encoding);
}
function utf16DetectIncompleteChar(e) {
  (this.charReceived = e.length % 2),
    (this.charLength = this.charReceived ? 2 : 0);
}
function base64DetectIncompleteChar(e) {
  (this.charReceived = e.length % 3),
    (this.charLength = this.charReceived ? 3 : 0);
}
Readable.ReadableState = ReadableState;
var debug = debuglog('stream');
inherits$1(Readable, EventEmitter);
function prependListener(e, t, n) {
  return 'function' == typeof e.prependListener
    ? e.prependListener(t, n)
    : void (e._events && e._events[t]
        ? Array.isArray(e._events[t])
          ? e._events[t].unshift(n)
          : (e._events[t] = [n, e._events[t]])
        : e.on(t, n));
}
function listenerCount$1(e, t) {
  return e.listeners(t).length;
}
function ReadableState(e, t) {
  (e = e || {}),
    (this.objectMode = !!e.objectMode),
    t instanceof Duplex &&
      (this.objectMode = this.objectMode || !!e.readableObjectMode);
  var n = e.highWaterMark,
    r = this.objectMode ? 16 : 16384;
  (this.highWaterMark = n || 0 === n ? n : r),
    (this.highWaterMark = ~~this.highWaterMark),
    (this.buffer = new BufferList()),
    (this.length = 0),
    (this.pipes = null),
    (this.pipesCount = 0),
    (this.flowing = null),
    (this.ended = !1),
    (this.endEmitted = !1),
    (this.reading = !1),
    (this.sync = !0),
    (this.needReadable = !1),
    (this.emittedReadable = !1),
    (this.readableListening = !1),
    (this.resumeScheduled = !1),
    (this.defaultEncoding = e.defaultEncoding || 'utf8'),
    (this.ranOut = !1),
    (this.awaitDrain = 0),
    (this.readingMore = !1),
    (this.decoder = null),
    (this.encoding = null),
    e.encoding &&
      ((this.decoder = new StringDecoder(e.encoding)),
      (this.encoding = e.encoding));
}
function Readable(e) {
  return this instanceof Readable
    ? void ((this._readableState = new ReadableState(e, this)),
      (this.readable = !0),
      e && 'function' == typeof e.read && (this._read = e.read),
      EventEmitter.call(this))
    : new Readable(e);
}
(Readable.prototype.push = function (e, t) {
  var n = this._readableState;
  return (
    n.objectMode ||
      'string' != typeof e ||
      ((t = t || n.defaultEncoding),
      t !== n.encoding && ((e = Buffer$1.from(e, t)), (t = ''))),
    readableAddChunk(this, n, e, t, !1)
  );
}),
  (Readable.prototype.unshift = function (e) {
    var t = this._readableState;
    return readableAddChunk(this, t, e, '', !0);
  }),
  (Readable.prototype.isPaused = function () {
    return !1 === this._readableState.flowing;
  });
function readableAddChunk(t, n, r, o, a) {
  var i = chunkInvalid(n, r);
  if (i) t.emit('error', i);
  else if (null === r) (n.reading = !1), onEofChunk(t, n);
  else if (!(n.objectMode || (r && 0 < r.length))) a || (n.reading = !1);
  else if (n.ended && !a) {
    var s = new Error('stream.push() after EOF');
    t.emit('error', s);
  } else if (n.endEmitted && a) {
    var e = new Error('stream.unshift() after end event');
    t.emit('error', e);
  } else {
    var d;
    !n.decoder ||
      a ||
      o ||
      ((r = n.decoder.write(r)), (d = !n.objectMode && 0 === r.length)),
      a || (n.reading = !1),
      d ||
        (n.flowing && 0 === n.length && !n.sync
          ? (t.emit('data', r), t.read(0))
          : ((n.length += n.objectMode ? 1 : r.length),
            a ? n.buffer.unshift(r) : n.buffer.push(r),
            n.needReadable && emitReadable(t))),
      maybeReadMore(t, n);
  }
  return needMoreData(n);
}
function needMoreData(e) {
  return (
    !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length)
  );
}
Readable.prototype.setEncoding = function (e) {
  return (
    (this._readableState.decoder = new StringDecoder(e)),
    (this._readableState.encoding = e),
    this
  );
};
var MAX_HWM = 8388608;
function computeNewHighWaterMark(e) {
  return (
    e >= MAX_HWM
      ? (e = MAX_HWM)
      : (e--,
        (e |= e >>> 1),
        (e |= e >>> 2),
        (e |= e >>> 4),
        (e |= e >>> 8),
        (e |= e >>> 16),
        e++),
    e
  );
}
function howMuchToRead(e, t) {
  return 0 >= e || (0 === t.length && t.ended)
    ? 0
    : t.objectMode
    ? 1
    : e === e
    ? (e > t.highWaterMark && (t.highWaterMark = computeNewHighWaterMark(e)),
      e <= t.length ? e : t.ended ? t.length : ((t.needReadable = !0), 0))
    : t.flowing && t.length
    ? t.buffer.head.data.length
    : t.length;
}
Readable.prototype.read = function (e) {
  debug('read', e), (e = parseInt(e, 10));
  var t = this._readableState,
    r = e;
  if (
    (0 !== e && (t.emittedReadable = !1),
    0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended))
  )
    return (
      debug('read: emitReadable', t.length, t.ended),
      0 === t.length && t.ended ? endReadable(this) : emitReadable(this),
      null
    );
  if (((e = howMuchToRead(e, t)), 0 === e && t.ended))
    return 0 === t.length && endReadable(this), null;
  var o = t.needReadable;
  debug('need readable', o),
    (0 === t.length || t.length - e < t.highWaterMark) &&
      ((o = !0), debug('length less than watermark', o)),
    t.ended || t.reading
      ? ((o = !1), debug('reading or ended', o))
      : o &&
        (debug('do read'),
        (t.reading = !0),
        (t.sync = !0),
        0 === t.length && (t.needReadable = !0),
        this._read(t.highWaterMark),
        (t.sync = !1),
        !t.reading && (e = howMuchToRead(r, t)));
  var a;
  return (
    (a = 0 < e ? fromList(e, t) : null),
    null === a ? ((t.needReadable = !0), (e = 0)) : (t.length -= e),
    0 === t.length &&
      (!t.ended && (t.needReadable = !0),
      r !== e && t.ended && endReadable(this)),
    null !== a && this.emit('data', a),
    a
  );
};
function chunkInvalid(e, t) {
  var n = null;
  return (
    Buffer$1.isBuffer(t) ||
      'string' == typeof t ||
      null === t ||
      void 0 === t ||
      e.objectMode ||
      (n = new TypeError('Invalid non-string/buffer chunk')),
    n
  );
}
function onEofChunk(e, t) {
  if (!t.ended) {
    if (t.decoder) {
      var n = t.decoder.end();
      n &&
        n.length &&
        (t.buffer.push(n), (t.length += t.objectMode ? 1 : n.length));
    }
    (t.ended = !0), emitReadable(e);
  }
}
function emitReadable(e) {
  var t = e._readableState;
  (t.needReadable = !1),
    t.emittedReadable ||
      (debug('emitReadable', t.flowing),
      (t.emittedReadable = !0),
      t.sync ? nextTick(emitReadable_, e) : emitReadable_(e));
}
function emitReadable_(e) {
  debug('emit readable'), e.emit('readable'), flow(e);
}
function maybeReadMore(e, t) {
  t.readingMore || ((t.readingMore = !0), nextTick(maybeReadMore_, e, t));
}
function maybeReadMore_(e, t) {
  for (
    var n = t.length;
    !t.reading &&
    !t.flowing &&
    !t.ended &&
    t.length < t.highWaterMark &&
    (debug('maybeReadMore read 0'), e.read(0), n !== t.length);

  )
    n = t.length;
  t.readingMore = !1;
}
(Readable.prototype._read = function () {
  this.emit('error', new Error('not implemented'));
}),
  (Readable.prototype.pipe = function (e, t) {
    function n(e) {
      debug('onunpipe'), e === h && o();
    }
    function r() {
      debug('onend'), e.end();
    }
    function o() {
      debug('cleanup'),
        e.removeListener('close', s),
        e.removeListener('finish', d),
        e.removeListener('drain', c),
        e.removeListener('error', i),
        e.removeListener('unpipe', n),
        h.removeListener('end', r),
        h.removeListener('end', o),
        h.removeListener('data', a),
        (g = !0),
        p.awaitDrain &&
          (!e._writableState || e._writableState.needDrain) &&
          c();
    }
    function a(t) {
      debug('ondata'), (m = !1);
      var n = e.write(t);
      !1 !== n ||
        m ||
        (((1 === p.pipesCount && p.pipes === e) ||
          (1 < p.pipesCount && -1 !== indexOf(p.pipes, e))) &&
          !g &&
          (debug('false write response, pause', h._readableState.awaitDrain),
          h._readableState.awaitDrain++,
          (m = !0)),
        h.pause());
    }
    function i(t) {
      debug('onerror', t),
        l(),
        e.removeListener('error', i),
        0 === listenerCount$1(e, 'error') && e.emit('error', t);
    }
    function s() {
      e.removeListener('finish', d), l();
    }
    function d() {
      debug('onfinish'), e.removeListener('close', s), l();
    }
    function l() {
      debug('unpipe'), h.unpipe(e);
    }
    var h = this,
      p = this._readableState;
    switch (p.pipesCount) {
      case 0:
        p.pipes = e;
        break;
      case 1:
        p.pipes = [p.pipes, e];
        break;
      default:
        p.pipes.push(e);
    }
    (p.pipesCount += 1), debug('pipe count=%d opts=%j', p.pipesCount, t);
    var u = !t || !1 !== t.end,
      f = u ? r : o;
    p.endEmitted ? nextTick(f) : h.once('end', f), e.on('unpipe', n);
    var c = pipeOnDrain(h);
    e.on('drain', c);
    var g = !1,
      m = !1;
    return (
      h.on('data', a),
      prependListener(e, 'error', i),
      e.once('close', s),
      e.once('finish', d),
      e.emit('pipe', h),
      p.flowing || (debug('pipe resume'), h.resume()),
      e
    );
  });
function pipeOnDrain(e) {
  return function () {
    var t = e._readableState;
    debug('pipeOnDrain', t.awaitDrain),
      t.awaitDrain && t.awaitDrain--,
      0 === t.awaitDrain &&
        e.listeners('data').length &&
        ((t.flowing = !0), flow(e));
  };
}
(Readable.prototype.unpipe = function (e) {
  var t = this._readableState;
  if (0 === t.pipesCount) return this;
  if (1 === t.pipesCount)
    return e && e !== t.pipes
      ? this
      : (e || (e = t.pipes),
        (t.pipes = null),
        (t.pipesCount = 0),
        (t.flowing = !1),
        e && e.emit('unpipe', this),
        this);
  if (!e) {
    var n = t.pipes,
      r = t.pipesCount;
    (t.pipes = null), (t.pipesCount = 0), (t.flowing = !1);
    for (var o = 0; o < r; o++) n[o].emit('unpipe', this);
    return this;
  }
  var a = indexOf(t.pipes, e);
  return -1 === a
    ? this
    : (t.pipes.splice(a, 1),
      (t.pipesCount -= 1),
      1 === t.pipesCount && (t.pipes = t.pipes[0]),
      e.emit('unpipe', this),
      this);
}),
  (Readable.prototype.on = function (e, t) {
    var n = EventEmitter.prototype.on.call(this, e, t);
    if ('data' === e) !1 !== this._readableState.flowing && this.resume();
    else if ('readable' === e) {
      var r = this._readableState;
      r.endEmitted ||
        r.readableListening ||
        ((r.readableListening = r.needReadable = !0),
        (r.emittedReadable = !1),
        r.reading
          ? r.length && emitReadable(this)
          : nextTick(nReadingNextTick, this));
    }
    return n;
  }),
  (Readable.prototype.addListener = Readable.prototype.on);
function nReadingNextTick(e) {
  debug('readable nexttick read 0'), e.read(0);
}
Readable.prototype.resume = function () {
  var e = this._readableState;
  return (
    e.flowing || (debug('resume'), (e.flowing = !0), resume(this, e)), this
  );
};
function resume(e, t) {
  t.resumeScheduled || ((t.resumeScheduled = !0), nextTick(resume_, e, t));
}
function resume_(e, t) {
  t.reading || (debug('resume read 0'), e.read(0)),
    (t.resumeScheduled = !1),
    (t.awaitDrain = 0),
    e.emit('resume'),
    flow(e),
    t.flowing && !t.reading && e.read(0);
}
Readable.prototype.pause = function () {
  return (
    debug('call pause flowing=%j', this._readableState.flowing),
    !1 !== this._readableState.flowing &&
      (debug('pause'), (this._readableState.flowing = !1), this.emit('pause')),
    this
  );
};
function flow(e) {
  var t = e._readableState;
  for (debug('flow', t.flowing); t.flowing && null !== e.read(); );
}
(Readable.prototype.wrap = function (e) {
  var t = this._readableState,
    r = !1,
    o = this;
  for (var a in (e.on('end', function () {
    if ((debug('wrapped end'), t.decoder && !t.ended)) {
      var e = t.decoder.end();
      e && e.length && o.push(e);
    }
    o.push(null);
  }),
  e.on('data', function (n) {
    if (
      (debug('wrapped data'),
      t.decoder && (n = t.decoder.write(n)),
      !(t.objectMode && (null === n || void 0 === n))) &&
      (t.objectMode || (n && n.length))
    ) {
      var a = o.push(n);
      a || ((r = !0), e.pause());
    }
  }),
  e))
    void 0 === this[a] &&
      'function' == typeof e[a] &&
      (this[a] = (function (t) {
        return function () {
          return e[t].apply(e, arguments);
        };
      })(a));
  return (
    forEach(['error', 'close', 'destroy', 'pause', 'resume'], function (t) {
      e.on(t, o.emit.bind(o, t));
    }),
    (o._read = function (t) {
      debug('wrapped _read', t), r && ((r = !1), e.resume());
    }),
    o
  );
}),
  (Readable._fromList = fromList);
function fromList(e, t) {
  if (0 === t.length) return null;
  var n;
  return (
    t.objectMode
      ? (n = t.buffer.shift())
      : !e || e >= t.length
      ? ((n = t.decoder
          ? t.buffer.join('')
          : 1 === t.buffer.length
          ? t.buffer.head.data
          : t.buffer.concat(t.length)),
        t.buffer.clear())
      : (n = fromListPartial(e, t.buffer, t.decoder)),
    n
  );
}
function fromListPartial(e, t, n) {
  var r;
  return (
    e < t.head.data.length
      ? ((r = t.head.data.slice(0, e)), (t.head.data = t.head.data.slice(e)))
      : e === t.head.data.length
      ? (r = t.shift())
      : (r = n ? copyFromBufferString(e, t) : copyFromBuffer(e, t)),
    r
  );
}
function copyFromBufferString(e, t) {
  var r = t.head,
    o = 1,
    a = r.data;
  for (e -= a.length; (r = r.next); ) {
    var i = r.data,
      s = e > i.length ? i.length : e;
    if (((a += s === i.length ? i : i.slice(0, e)), (e -= s), 0 === e)) {
      s === i.length
        ? (++o, (t.head = r.next ? r.next : (t.tail = null)))
        : ((t.head = r), (r.data = i.slice(s)));
      break;
    }
    ++o;
  }
  return (t.length -= o), a;
}
function copyFromBuffer(e, t) {
  var r = Buffer$1.allocUnsafe(e),
    o = t.head,
    a = 1;
  for (o.data.copy(r), e -= o.data.length; (o = o.next); ) {
    var i = o.data,
      s = e > i.length ? i.length : e;
    if ((i.copy(r, r.length - e, 0, s), (e -= s), 0 === e)) {
      s === i.length
        ? (++a, (t.head = o.next ? o.next : (t.tail = null)))
        : ((t.head = o), (o.data = i.slice(s)));
      break;
    }
    ++a;
  }
  return (t.length -= a), r;
}
function endReadable(e) {
  var t = e._readableState;
  if (0 < t.length)
    throw new Error('"endReadable()" called on non-empty stream');
  t.endEmitted || ((t.ended = !0), nextTick(endReadableNT, t, e));
}
function endReadableNT(e, t) {
  e.endEmitted ||
    0 !== e.length ||
    ((e.endEmitted = !0), (t.readable = !1), t.emit('end'));
}
function forEach(e, t) {
  for (var n = 0, r = e.length; n < r; n++) t(e[n], n);
}
function indexOf(e, t) {
  for (var n = 0, r = e.length; n < r; n++) if (e[n] === t) return n;
  return -1;
}
(Writable.WritableState = WritableState), inherits$1(Writable, EventEmitter);
function nop() {}
function WriteReq(e, t, n) {
  (this.chunk = e),
    (this.encoding = t),
    (this.callback = n),
    (this.next = null);
}
function WritableState(e, t) {
  Object.defineProperty(this, 'buffer', {
    get: deprecate(function () {
      return this.getBuffer();
    }, '_writableState.buffer is deprecated. Use _writableState.getBuffer instead.'),
  }),
    (e = e || {}),
    (this.objectMode = !!e.objectMode),
    t instanceof Duplex &&
      (this.objectMode = this.objectMode || !!e.writableObjectMode);
  var n = e.highWaterMark,
    r = this.objectMode ? 16 : 16384;
  (this.highWaterMark = n || 0 === n ? n : r),
    (this.highWaterMark = ~~this.highWaterMark),
    (this.needDrain = !1),
    (this.ending = !1),
    (this.ended = !1),
    (this.finished = !1);
  var o = !1 === e.decodeStrings;
  (this.decodeStrings = !o),
    (this.defaultEncoding = e.defaultEncoding || 'utf8'),
    (this.length = 0),
    (this.writing = !1),
    (this.corked = 0),
    (this.sync = !0),
    (this.bufferProcessing = !1),
    (this.onwrite = function (e) {
      onwrite(t, e);
    }),
    (this.writecb = null),
    (this.writelen = 0),
    (this.bufferedRequest = null),
    (this.lastBufferedRequest = null),
    (this.pendingcb = 0),
    (this.prefinished = !1),
    (this.errorEmitted = !1),
    (this.bufferedRequestCount = 0),
    (this.corkedRequestsFree = new CorkedRequest(this));
}
WritableState.prototype.getBuffer = function () {
  for (var e = this.bufferedRequest, t = []; e; ) t.push(e), (e = e.next);
  return t;
};
function Writable(e) {
  return this instanceof Writable || this instanceof Duplex
    ? void ((this._writableState = new WritableState(e, this)),
      (this.writable = !0),
      e &&
        ('function' == typeof e.write && (this._write = e.write),
        'function' == typeof e.writev && (this._writev = e.writev)),
      EventEmitter.call(this))
    : new Writable(e);
}
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};
function writeAfterEnd(e, t) {
  var n = new Error('write after end');
  e.emit('error', n), nextTick(t, n);
}
function validChunk(e, t, n, r) {
  var o = !0,
    a = !1;
  return (
    null === n
      ? (a = new TypeError('May not write null values to stream'))
      : !Buffer$1.isBuffer(n) &&
        'string' != typeof n &&
        void 0 !== n &&
        !t.objectMode &&
        (a = new TypeError('Invalid non-string/buffer chunk')),
    a && (e.emit('error', a), nextTick(r, a), (o = !1)),
    o
  );
}
(Writable.prototype.write = function (e, t, n) {
  var r = this._writableState,
    o = !1;
  return (
    'function' == typeof t && ((n = t), (t = null)),
    Buffer$1.isBuffer(e) ? (t = 'buffer') : !t && (t = r.defaultEncoding),
    'function' != typeof n && (n = nop),
    r.ended
      ? writeAfterEnd(this, n)
      : validChunk(this, r, e, n) &&
        (r.pendingcb++, (o = writeOrBuffer(this, r, e, t, n))),
    o
  );
}),
  (Writable.prototype.cork = function () {
    var e = this._writableState;
    e.corked++;
  }),
  (Writable.prototype.uncork = function () {
    var e = this._writableState;
    e.corked &&
      (e.corked--,
      !e.writing &&
        !e.corked &&
        !e.finished &&
        !e.bufferProcessing &&
        e.bufferedRequest &&
        clearBuffer(this, e));
  }),
  (Writable.prototype.setDefaultEncoding = function (e) {
    if (
      ('string' == typeof e && (e = e.toLowerCase()),
      !(
        -1 <
        [
          'hex',
          'utf8',
          'utf-8',
          'ascii',
          'binary',
          'base64',
          'ucs2',
          'ucs-2',
          'utf16le',
          'utf-16le',
          'raw',
        ].indexOf((e + '').toLowerCase())
      ))
    )
      throw new TypeError('Unknown encoding: ' + e);
    return (this._writableState.defaultEncoding = e), this;
  });
function decodeChunk(e, t, n) {
  return (
    e.objectMode ||
      !1 === e.decodeStrings ||
      'string' != typeof t ||
      (t = Buffer$1.from(t, n)),
    t
  );
}
function writeOrBuffer(e, t, n, r, o) {
  (n = decodeChunk(t, n, r)), Buffer$1.isBuffer(n) && (r = 'buffer');
  var a = t.objectMode ? 1 : n.length;
  t.length += a;
  var i = t.length < t.highWaterMark;
  if ((i || (t.needDrain = !0), t.writing || t.corked)) {
    var s = t.lastBufferedRequest;
    (t.lastBufferedRequest = new WriteReq(n, r, o)),
      s
        ? (s.next = t.lastBufferedRequest)
        : (t.bufferedRequest = t.lastBufferedRequest),
      (t.bufferedRequestCount += 1);
  } else doWrite(e, t, !1, a, n, r, o);
  return i;
}
function doWrite(e, t, n, r, o, a, i) {
  (t.writelen = r),
    (t.writecb = i),
    (t.writing = !0),
    (t.sync = !0),
    n ? e._writev(o, t.onwrite) : e._write(o, a, t.onwrite),
    (t.sync = !1);
}
function onwriteError(e, t, n, r, o) {
  --t.pendingcb,
    n ? nextTick(o, r) : o(r),
    (e._writableState.errorEmitted = !0),
    e.emit('error', r);
}
function onwriteStateUpdate(e) {
  (e.writing = !1),
    (e.writecb = null),
    (e.length -= e.writelen),
    (e.writelen = 0);
}
function onwrite(e, t) {
  var n = e._writableState,
    r = n.sync,
    o = n.writecb;
  if ((onwriteStateUpdate(n), t)) onwriteError(e, n, r, t, o);
  else {
    var a = needFinish(n);
    a ||
      n.corked ||
      n.bufferProcessing ||
      !n.bufferedRequest ||
      clearBuffer(e, n),
      r ? nextTick(afterWrite, e, n, a, o) : afterWrite(e, n, a, o);
  }
}
function afterWrite(e, t, n, r) {
  n || onwriteDrain(e, t), t.pendingcb--, r(), finishMaybe(e, t);
}
function onwriteDrain(e, t) {
  0 === t.length && t.needDrain && ((t.needDrain = !1), e.emit('drain'));
}
function clearBuffer(e, t) {
  t.bufferProcessing = !0;
  var n = t.bufferedRequest;
  if (e._writev && n && n.next) {
    var r = t.bufferedRequestCount,
      o = Array(r),
      a = t.corkedRequestsFree;
    a.entry = n;
    for (var i = 0; n; ) (o[i] = n), (n = n.next), (i += 1);
    doWrite(e, t, !0, t.length, o, '', a.finish),
      t.pendingcb++,
      (t.lastBufferedRequest = null),
      a.next
        ? ((t.corkedRequestsFree = a.next), (a.next = null))
        : (t.corkedRequestsFree = new CorkedRequest(t));
  } else {
    for (; n; ) {
      var s = n.chunk,
        d = n.encoding,
        l = n.callback,
        h = t.objectMode ? 1 : s.length;
      if ((doWrite(e, t, !1, h, s, d, l), (n = n.next), t.writing)) break;
    }
    null === n && (t.lastBufferedRequest = null);
  }
  (t.bufferedRequestCount = 0),
    (t.bufferedRequest = n),
    (t.bufferProcessing = !1);
}
(Writable.prototype._write = function (e, t, n) {
  n(new Error('not implemented'));
}),
  (Writable.prototype._writev = null),
  (Writable.prototype.end = function (e, t, n) {
    var r = this._writableState;
    'function' == typeof e
      ? ((n = e), (e = null), (t = null))
      : 'function' == typeof t && ((n = t), (t = null)),
      null !== e && e !== void 0 && this.write(e, t),
      r.corked && ((r.corked = 1), this.uncork()),
      r.ending || r.finished || endWritable(this, r, n);
  });
function needFinish(e) {
  return (
    e.ending &&
    0 === e.length &&
    null === e.bufferedRequest &&
    !e.finished &&
    !e.writing
  );
}
function prefinish(e, t) {
  t.prefinished || ((t.prefinished = !0), e.emit('prefinish'));
}
function finishMaybe(e, t) {
  var n = needFinish(t);
  return (
    n &&
      (0 === t.pendingcb
        ? (prefinish(e, t), (t.finished = !0), e.emit('finish'))
        : prefinish(e, t)),
    n
  );
}
function endWritable(e, t, n) {
  (t.ending = !0),
    finishMaybe(e, t),
    n && (t.finished ? nextTick(n) : e.once('finish', n)),
    (t.ended = !0),
    (e.writable = !1);
}
function CorkedRequest(e) {
  var t = this;
  (this.next = null),
    (this.entry = null),
    (this.finish = function (n) {
      var r = t.entry;
      for (t.entry = null; r; ) {
        var o = r.callback;
        e.pendingcb--, o(n), (r = r.next);
      }
      e.corkedRequestsFree
        ? (e.corkedRequestsFree.next = t)
        : (e.corkedRequestsFree = t);
    });
}
inherits$1(Duplex, Readable);
for (
  var method, keys = Object.keys(Writable.prototype), v = 0;
  v < keys.length;
  v++
)
  (method = keys[v]),
    Duplex.prototype[method] ||
      (Duplex.prototype[method] = Writable.prototype[method]);
function Duplex(e) {
  return this instanceof Duplex
    ? void (Readable.call(this, e),
      Writable.call(this, e),
      e && !1 === e.readable && (this.readable = !1),
      e && !1 === e.writable && (this.writable = !1),
      (this.allowHalfOpen = !0),
      e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1),
      this.once('end', onend))
    : new Duplex(e);
}
function onend() {
  this.allowHalfOpen || this._writableState.ended || nextTick(onEndNT, this);
}
function onEndNT(e) {
  e.end();
}
var rStates = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4,
};
function IncomingMessage(e, t, n) {
  var r = this;
  Readable.call(r),
    (r._mode = n),
    (r.headers = {}),
    (r.rawHeaders = []),
    (r.trailers = {}),
    (r.rawTrailers = []),
    r.on('end', function () {
      browser$1.nextTick(function () {
        r.emit('close');
      });
    });
  var o;
  if ('fetch' === n) {
    (r._fetchResponse = t),
      (r.url = t.url),
      (r.statusCode = t.status),
      (r.statusMessage = t.statusText);
    for (
      var a, i, s = t.headers[Symbol.iterator]();
      (a = (i = s.next()).value), !i.done;

    )
      (r.headers[a[0].toLowerCase()] = a[1]), r.rawHeaders.push(a[0], a[1]);
    var d = t.body.getReader();
    (o = function () {
      d.read().then(function (e) {
        return r._destroyed
          ? void 0
          : e.done
          ? void r.push(null)
          : void (r.push(new Buffer$1(e.value)), o());
      });
    }),
      o();
  } else {
    (r._xhr = e),
      (r._pos = 0),
      (r.url = e.responseURL),
      (r.statusCode = e.status),
      (r.statusMessage = e.statusText);
    var l = e.getAllResponseHeaders().split(/\r?\n/);
    if (
      (l.forEach(function (e) {
        var t = e.match(/^([^:]+):\s*(.*)/);
        if (t) {
          var n = t[1].toLowerCase();
          'set-cookie' === n
            ? (void 0 === r.headers[n] && (r.headers[n] = []),
              r.headers[n].push(t[2]))
            : void 0 === r.headers[n]
            ? (r.headers[n] = t[2])
            : (r.headers[n] += ', ' + t[2]),
            r.rawHeaders.push(t[1], t[2]);
        }
      }),
      (r._charset = 'x-user-defined'),
      !overrideMimeType)
    ) {
      var h = r.rawHeaders['mime-type'];
      if (h) {
        var p = h.match(/;\s*charset=([^;])(;|$)/);
        p && (r._charset = p[1].toLowerCase());
      }
      r._charset || (r._charset = 'utf-8');
    }
  }
}
inherits$1(IncomingMessage, Readable),
  (IncomingMessage.prototype._read = function () {}),
  (IncomingMessage.prototype._onXHRProgress = function () {
    var t = this,
      n = t._xhr,
      r = null;
    switch (t._mode) {
      case 'text:vbarray':
        if (n.readyState !== rStates.DONE) break;
        try {
          r = new global$1.VBArray(n.responseBody).toArray();
        } catch (t) {}
        if (null !== r) {
          t.push(new Buffer$1(r));
          break;
        }
      case 'text':
        try {
          r = n.responseText;
        } catch (n) {
          t._mode = 'text:vbarray';
          break;
        }
        if (r.length > t._pos) {
          var o = r.substr(t._pos);
          if ('x-user-defined' === t._charset) {
            for (var a = new Buffer$1(o.length), s = 0; s < o.length; s++)
              a[s] = 255 & o.charCodeAt(s);
            t.push(a);
          } else t.push(o, t._charset);
          t._pos = r.length;
        }
        break;
      case 'arraybuffer':
        if (n.readyState !== rStates.DONE || !n.response) break;
        (r = n.response), t.push(new Buffer$1(new Uint8Array(r)));
        break;
      case 'moz-chunked-arraybuffer':
        if (((r = n.response), n.readyState !== rStates.LOADING || !r)) break;
        t.push(new Buffer$1(new Uint8Array(r)));
        break;
      case 'ms-stream':
        if (((r = n.response), n.readyState !== rStates.LOADING)) break;
        var e = new global$1.MSStreamReader();
        (e.onprogress = function () {
          e.result.byteLength > t._pos &&
            (t.push(new Buffer$1(new Uint8Array(e.result.slice(t._pos)))),
            (t._pos = e.result.byteLength));
        }),
          (e.onload = function () {
            t.push(null);
          }),
          e.readAsArrayBuffer(r);
    }
    t._xhr.readyState === rStates.DONE &&
      'ms-stream' !== t._mode &&
      t.push(null);
  });
function toArrayBuffer(e) {
  if (e instanceof Uint8Array) {
    if (0 === e.byteOffset && e.byteLength === e.buffer.byteLength)
      return e.buffer;
    if ('function' == typeof e.buffer.slice)
      return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
  }
  if (isBuffer(e)) {
    for (var t = new Uint8Array(e.length), n = e.length, r = 0; r < n; r++)
      t[r] = e[r];
    return t.buffer;
  }
  throw new Error('Argument must be a Buffer');
}
function decideMode(e, t) {
  return hasFetch && t
    ? 'fetch'
    : mozchunkedarraybuffer
    ? 'moz-chunked-arraybuffer'
    : msstream
    ? 'ms-stream'
    : arraybuffer && e
    ? 'arraybuffer'
    : vbArray && e
    ? 'text:vbarray'
    : 'text';
}
function ClientRequest(e) {
  var t = this;
  Writable.call(t),
    (t._opts = e),
    (t._body = []),
    (t._headers = {}),
    e.auth &&
      t.setHeader(
        'Authorization',
        'Basic ' + new Buffer$1(e.auth).toString('base64')
      ),
    Object.keys(e.headers).forEach(function (n) {
      t.setHeader(n, e.headers[n]);
    });
  var n,
    r = !0;
  if ('disable-fetch' === e.mode) (r = !1), (n = !0);
  else if ('prefer-streaming' === e.mode) n = !1;
  else if ('allow-wrong-content-type' === e.mode) n = !overrideMimeType;
  else if (!e.mode || 'default' === e.mode || 'prefer-fast' === e.mode) n = !0;
  else throw new Error('Invalid value for opts.mode');
  (t._mode = decideMode(n, r)),
    t.on('finish', function () {
      t._onFinish();
    });
}
inherits$1(ClientRequest, Writable);
var unsafeHeaders = [
  'accept-charset',
  'accept-encoding',
  'access-control-request-headers',
  'access-control-request-method',
  'connection',
  'content-length',
  'cookie',
  'cookie2',
  'date',
  'dnt',
  'expect',
  'host',
  'keep-alive',
  'origin',
  'referer',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'user-agent',
  'via',
];
(ClientRequest.prototype.setHeader = function (e, t) {
  var n = this,
    r = e.toLowerCase();
  -1 !== unsafeHeaders.indexOf(r) || (n._headers[r] = { name: e, value: t });
}),
  (ClientRequest.prototype.getHeader = function (e) {
    var t = this;
    return t._headers[e.toLowerCase()].value;
  }),
  (ClientRequest.prototype.removeHeader = function (e) {
    var t = this;
    delete t._headers[e.toLowerCase()];
  }),
  (ClientRequest.prototype._onFinish = function () {
    var e = this;
    if (!e._destroyed) {
      var t,
        n = e._opts,
        r = e._headers;
      if (
        (('POST' === n.method || 'PUT' === n.method || 'PATCH' === n.method) &&
          (blobConstructor()
            ? (t = new global$1.Blob(
                e._body.map(function (e) {
                  return toArrayBuffer(e);
                }),
                { type: (r['content-type'] || {}).value || '' }
              ))
            : (t = Buffer$1.concat(e._body).toString())),
        'fetch' === e._mode)
      ) {
        var o = Object.keys(r).map(function (e) {
          return [r[e].name, r[e].value];
        });
        global$1
          .fetch(e._opts.url, {
            method: e._opts.method,
            headers: o,
            body: t,
            mode: 'cors',
            credentials: n.withCredentials ? 'include' : 'same-origin',
          })
          .then(
            function (t) {
              (e._fetchResponse = t), e._connect();
            },
            function (t) {
              e.emit('error', t);
            }
          );
      } else {
        var a = (e._xhr = new global$1.XMLHttpRequest());
        try {
          a.open(e._opts.method, e._opts.url, !0);
        } catch (t) {
          return void browser$1.nextTick(function () {
            e.emit('error', t);
          });
        }
        'responseType' in a && (a.responseType = e._mode.split(':')[0]),
          'withCredentials' in a && (a.withCredentials = !!n.withCredentials),
          'text' === e._mode &&
            'overrideMimeType' in a &&
            a.overrideMimeType('text/plain; charset=x-user-defined'),
          Object.keys(r).forEach(function (e) {
            a.setRequestHeader(r[e].name, r[e].value);
          }),
          (e._response = null),
          (a.onreadystatechange = function () {
            switch (a.readyState) {
              case rStates.LOADING:
              case rStates.DONE:
                e._onXHRProgress();
            }
          }),
          'moz-chunked-arraybuffer' === e._mode &&
            (a.onprogress = function () {
              e._onXHRProgress();
            }),
          (a.onerror = function () {
            e._destroyed || e.emit('error', new Error('XHR error'));
          });
        try {
          a.send(t);
        } catch (t) {
          return void browser$1.nextTick(function () {
            e.emit('error', t);
          });
        }
      }
    }
  });
function statusValid(e) {
  try {
    var t = e.status;
    return null !== t && 0 !== t;
  } catch (t) {
    return !1;
  }
}
(ClientRequest.prototype._onXHRProgress = function () {
  var e = this;
  !statusValid(e._xhr) ||
    e._destroyed ||
    (!e._response && e._connect(), e._response._onXHRProgress());
}),
  (ClientRequest.prototype._connect = function () {
    var e = this;
    e._destroyed ||
      ((e._response = new IncomingMessage(e._xhr, e._fetchResponse, e._mode)),
      e.emit('response', e._response));
  }),
  (ClientRequest.prototype._write = function (e, t, n) {
    var r = this;
    r._body.push(e), n();
  }),
  (ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
    var e = this;
    (e._destroyed = !0),
      e._response && (e._response._destroyed = !0),
      e._xhr && e._xhr.abort();
  }),
  (ClientRequest.prototype.end = function (e, t, n) {
    var r = this;
    'function' == typeof e && ((n = e), (e = void 0)),
      Writable.prototype.end.call(r, e, t, n);
  }),
  (ClientRequest.prototype.flushHeaders = function () {}),
  (ClientRequest.prototype.setTimeout = function () {}),
  (ClientRequest.prototype.setNoDelay = function () {}),
  (ClientRequest.prototype.setSocketKeepAlive = function () {});
function request(e, t) {
  'string' == typeof e && (e = urlParse(e));
  var n = -1 === global$1.location.protocol.search(/^https?:$/) ? 'http:' : '',
    r = e.protocol || n,
    o = e.hostname || e.host,
    a = e.port,
    i = e.path || '/';
  o && -1 !== o.indexOf(':') && (o = '[' + o + ']'),
    (e.url = (o ? r + '//' + o : '') + (a ? ':' + a : '') + i),
    (e.method = (e.method || 'GET').toUpperCase()),
    (e.headers = e.headers || {});
  var s = new ClientRequest(e);
  return t && s.on('response', t), s;
}
function get(e, t) {
  var n = request(e, t);
  return n.end(), n;
}
function Agent() {}
Agent.defaultMaxSockets = 4;
var METHODS = [
    'CHECKOUT',
    'CONNECT',
    'COPY',
    'DELETE',
    'GET',
    'HEAD',
    'LOCK',
    'M-SEARCH',
    'MERGE',
    'MKACTIVITY',
    'MKCOL',
    'MOVE',
    'NOTIFY',
    'OPTIONS',
    'PATCH',
    'POST',
    'PROPFIND',
    'PROPPATCH',
    'PURGE',
    'PUT',
    'REPORT',
    'SEARCH',
    'SUBSCRIBE',
    'TRACE',
    'UNLOCK',
    'UNSUBSCRIBE',
  ],
  STATUS_CODES = {
    100: 'Continue',
    101: 'Switching Protocols',
    102: 'Processing',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    207: 'Multi-Status',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Moved Temporarily',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Time-out',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Large',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    418: "I'm a teapot",
    422: 'Unprocessable Entity',
    423: 'Locked',
    424: 'Failed Dependency',
    425: 'Unordered Collection',
    426: 'Upgrade Required',
    428: 'Precondition Required',
    429: 'Too Many Requests',
    431: 'Request Header Fields Too Large',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Time-out',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates',
    507: 'Insufficient Storage',
    509: 'Bandwidth Limit Exceeded',
    510: 'Not Extended',
    511: 'Network Authentication Required',
  },
  require$$1 = { request, get, Agent, METHODS, STATUS_CODES };
const client = { https: require$$1, http: require$$1 },
  REDIRECT_CODES = [301, 302, 303, 307];
class SimpleError extends Error {
  constructor() {
    super('Error happened due to simple constraint not being 2xx status code.'),
      (this.name = 'FR_Simple');
  }
}
class RequestError extends Error {
  constructor(t) {
    super('Error happened reguarding a request: ' + t.message),
      (this.name = 'FR_Request_' + t.name);
  }
}
class RequestTimeoutError extends Error {
  constructor(t) {
    super('Error happened reguarding a request: ' + t.message),
      (this.name = 'FR_Request_Timeout');
  }
}
class Fasquest {
  constructor() {
    this.agent = {
      http: new client.http.Agent({ keepAlive: !0 }),
      https: new client.https.Agent({ keepAlive: !0 }),
    };
  }
  request(e, t = null) {
    return t
      ? void this._request(e, (e, n, r) => {
          t({ req: e, res: n, err: r });
        })
      : this.requestPromise(e);
  }
  requestPromise(e) {
    return new Promise((t, n) => {
      this._request(e, (r, o, a) => {
        a
          ? n({ req: r, res: o, err: a })
          : t(e.resolveWithFullResponse ? o : o.body);
      });
    });
  }
  _request(e, n, r = 0) {
    var o = this._setOptions({ ...e });
    o.json && o.body && (o.body = JSON.stringify(o.body)),
      o.body &&
        !o.headers['Content-Length'] &&
        (o.headers['Content-Length'] = Buffer.byteLength(o.body));
    var a = client[o.proto].request(o, (e) => {
        (e.body = ''),
          e.on('data', (t) => {
            e.body += t;
          }),
          e.on('end', () => {
            if (
              (clearTimeout(i),
              delete o.agent,
              -1 !== REDIRECT_CODES.indexOf(e.statusCode) && r < o.redirect_max)
            )
              return (
                (o.uri = url.resolve(o.uri, e.headers.location)),
                this._request(this._setOptions(o), n, ++r)
              );
            if (
              e.headers['content-type'] &&
              -1 < e.headers['content-type'].indexOf('json')
            )
              try {
                e.body = JSON.parse(e.body);
              } catch (t) {}
            return o.simple && (299 < e.statusCode || 200 > e.statusCode)
              ? n(a, e, new SimpleError())
              : n(a, e, null);
          });
      }),
      i = setTimeout(() => {
        a.destroy();
      }, o.timeout || 6e4);
    a.on('error', (t) => {
      var e =
        -1 < t.message.indexOf('socket hang up')
          ? new RequestTimeoutError(t)
          : new RequestError(t);
      return delete o.agent, n(a, null, e);
    }),
      o.body && a.write(o.body),
      a.end();
  }
  _setOptions(e) {
    if (((e.simple = !1 !== e.simple), (e.method = e.method || 'GET'), e.qs)) {
      var t = qs.stringify(e.qs);
      0 < t.length && (e.uri += (-1 < e.uri.indexOf('?') ? '&' : '?') + t);
    }
    return (
      this._uri_to_options(e),
      (e.agent = e.agent || this.agent[e.proto]),
      e.headers || (e.headers = {}),
      e.json
        ? (e.headers['Content-Type'] = 'application/json')
        : e.form &&
          ((e.body = qs.stringify(e.form)),
          (e.headers['Content-Type'] = 'application/x-www-form-urlencoded'),
          (e.headers['Content-Length'] = Buffer.byteLength(e.body))),
      e.authorization &&
        (e.authorization.basic
          ? (e.headers.Authorization =
              'Basic ' +
              Buffer.from(
                e.authorization.basic.client +
                  ':' +
                  e.authorization.basic.secret,
                'ascii'
              ).toString('base64'))
          : e.authorization.bearer &&
            (e.headers.Authorization = 'Bearer ' + e.authorization.bearer),
        delete e.authorization),
      e.redirect_max || 0 === e.redirect_max || (e.redirect_max = 5),
      e
    );
  }
  _uri_to_options(e) {
    var t = { proto: '', path: '', port: 80, host: '' },
      n = e.uri.split('://');
    if (((t.proto = n[0]), -1 < n[1].indexOf(':'))) {
      const e = n[1].split(':'),
        r = e[1].indexOf('/');
      -1 < r
        ? ((n[1] = e[1]), (t.path = n[1].slice(r)), (t.port = n[1].slice(0, r)))
        : (t.port = e[1]),
        (t.host = e[0]);
    } else t.port = 'https' == t.proto ? 443 : 80;
    const r = n[1].indexOf('/');
    -1 < r
      ? ((t.path = t.path || n[1].slice(r)),
        (t.host = t.host || n[1].slice(0, r)))
      : ((t.path = t.path || '/'), (t.host = t.host || n[1])),
      (e.proto = t.proto),
      (e.path = t.path),
      (e.port = t.port),
      (e.host = t.host);
  }
}
var Fasquest_1 = new Fasquest();
export default Fasquest_1;

const fasq = new Fasquest();
var hostUrl = '';
var defaultOpts = null;

/**
 *
 */
class Travelling {
  constructor() {}
  static get _postgenClassUrls() {
    return { healthcheck: 'health', metrics: 'metrics' };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * healthCheck - server's health check
   *
   * Path: health
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async healthCheck(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `health`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * metrics - servers metrics
   *
   * Path: metrics
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async metrics(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `metrics`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Audit() {
    return Audit;
  }

  static get Config() {
    return Config;
  }

  static get Groups() {
    return Groups;
  }

  static get Group() {
    return Group;
  }

  static get Users() {
    return Users;
  }

  static get User() {
    return User;
  }

  static get Auth() {
    return Auth;
  }
}
/**
 *
 */
class Audit {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      byactionandsubaction: 'api/v1/audit/action/:action/subaction/:subaction',
      bysubaction: 'api/v1/audit/subaction/:subaction',
      byaction: 'api/v1/audit/action/:action',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
  * byActionAndSubaction - Gets audits by action and subaction type.

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example: id=415c87e9-eaad-4b8e-8ce8-655c911e20ae) |
| created_on | *optional* (example:  created_on>=2021-06-09) |
| prop | *optional* (example: prop=email) |
| old_val | *optional* (example:  old_val=swagger@email.69) |
| new_val | *optional* (example:  new_val=leet@teel.com) |
  *
  * Path: api/v1/audit/action/:action/subaction/:subaction
  * @param {any} action Audti action type. (example: CREATE)
  * @param {any} subaction Audit subaction type. (example: GROUP)
  * @param {any} limit Number of maximum results. (example: 2) (example: 2)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 1)
  * @param {any} sort Sort by any user object key (examples: created_on, action, etc.) (example: created_on)
  * @param {any} sortdir Sort direction (example ascending order: ASC) (example: ASC)
  * @param {any} filter Filter parameters (example: action=created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-03,created_on<2021-06-06)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async byActionAndSubaction(
    action,
    subaction,
    limit,
    skip,
    sort,
    sortdir,
    filter,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri:
        hostUrl + '/' + `api/v1/audit/action/${action}/subaction/${subaction}`,
      qs: { limit, skip, sort, sortdir, filter },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * bySubaction - Gets audits by subaction type.

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example: id=415c87e9-eaad-4b8e-8ce8-655c911e20ae) |
| created_on | *optional* (example:  created_on>=2021-06-09) |
| prop | *optional* (example: prop=email) |
| old_val | *optional* (example:  old_val=swagger@email.69) |
| new_val | *optional* (example:  new_val=leet@teel.com) |
  *
  * Path: api/v1/audit/subaction/:subaction
  * @param {any} subaction Audit subaction type. (example: USER)
  * @param {any} limit Number of maximum results. (example: 2) (example: 2)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 1)
  * @param {any} sort Sort by any user object key (examples: created_on, action, etc.) (example: created_on)
  * @param {any} sortdir Sort direction (example ascending order: ASC) (example: ASC)
  * @param {any} filter Filter parameters (example: action=created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-03,created_on<2021-06-06)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async bySubaction(
    subaction,
    limit,
    skip,
    sort,
    sortdir,
    filter,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/audit/subaction/${subaction}`,
      qs: { limit, skip, sort, sortdir, filter },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * byAction - Gets audits by action type.

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example: id=415c87e9-eaad-4b8e-8ce8-655c911e20ae) |
| created_on | *optional* (example:  created_on>=2021-06-09) |
| prop | *optional* (example: prop=email) |
| old_val | *optional* (example:  old_val=swagger@email.69) |
| new_val | *optional* (example:  new_val=leet@teel.com) |
  *
  * Path: api/v1/audit/action/:action
  * @param {any} action Audit action type. (example: CREATE)
  * @param {any} limit Number of maximum results. (example: 2) (example: 2)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 1)
  * @param {any} sort Sort by any user object key (examples: created_on, action, etc.) (example: created_on)
  * @param {any} sortdir Sort direction (example ascending order: ASC) (example: ASC)
  * @param {any} filter Filter parameters (example: action=created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-03,created_on<2021-06-06)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async byAction(
    action,
    limit,
    skip,
    sort,
    sortdir,
    filter,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/audit/action/${action}`,
      qs: { limit, skip, sort, sortdir, filter },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get User() {
    return AuditUser;
  }
}
/**
 *
 */
class AuditUser {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      byuserid: 'api/v1/audit/user/byuser/:id',
      ofuserid: 'api/v1/audit/user/ofuser/:id',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
  * byuserId - Gets audits by by_user id.

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example: id=415c87e9-eaad-4b8e-8ce8-655c911e20ae) |
| created_on | *optional* (example:  created_on>=2021-06-09) |
| action | *optional* (example:  action=CREATE) |
| subaction | *optional* (example:  subaction=USER) |
| prop | *optional* (example:  prop=email) |
| old_val | *optional* (example:  old_val=swagger@email.69) |
| new_val | *optional* (example:  new_val=leet@teel.com) |
  *
  * Path: api/v1/audit/user/byuser/:id
  * @param {any} id Id of user that committed the action. (example: 778c3e68-4d9f-486d-a6eb-0d1cfd93520d)
  * @param {any} filter Filter parameters (example: action=CREATE,subaction=USER,created_on>2021-06-03,created_on<2021-06-06) (example: action=CREATE,created_on>2021-06-03,created_on<2021-07-06)
  * @param {any} limit Number of maximum results. (example: 2) (example: 2)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 10)
  * @param {any} sort Sort by any user object key (examples: created_on, action, etc.) (example: created_on)
  * @param {any} sortdir Sort direction (example ascending order: ASC) (example: ASC)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async byuserId(
    id,
    filter,
    limit,
    skip,
    sort,
    sortdir,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/audit/user/byuser/${id}`,
      qs: { filter, limit, skip, sort, sortdir },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * ofuserId - Gets audits by of_user id.

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example: id=415c87e9-eaad-4b8e-8ce8-655c911e20ae) |
| created_on | *optional* (example:  created_on>=2021-06-09) |
| action | *optional* (example:  action=CREATE) |
| subaction | *optional* (example:  subaction=USER) |
| prop | *optional* (example:  prop=email) |
| old_val | *optional* (example:  old_val=swagger@email.69) |
| new_val | *optional* (example:  new_val=leet@teel.com) |
  *
  * Path: api/v1/audit/user/ofuser/:id
  * @param {any} id Id of user that committed the action. (example: 7c93b6f6-a145-41b6-b892-a52bd3ad3e11)
  * @param {any} filter Filter parameters (example: action=CREATE,subaction=USER,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-03,created_on<2021-06-06)
  * @param {any} limit Number of maximum results. (example: 2) (example: 2)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 10)
  * @param {any} sort Sort by any user object key (examples: created_on, action, etc.) (example: action)
  * @param {any} sortdir Sort direction (example ascending order: ASC) (example: DESC)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async ofuserId(
    id,
    filter,
    limit,
    skip,
    sort,
    sortdir,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/audit/user/ofuser/${id}`,
      qs: { filter, limit, skip, sort, sortdir },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class Config {
  constructor() {}
  static get _postgenClassUrls() {
    return { getproperty: 'api/v1/config/:property' };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * getProperty - Gets a property from travellings config.
   *
   * Path: api/v1/config/:property
   * @param {any} property  (example: password)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getProperty(property, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/config/${property}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class Groups {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      export: 'api/v1/groups/export',
      import: 'api/v1/groups/import',
      get: 'api/v1/groups',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * export - Exports all groups in the proper format to be imported.
   *
   * Path: api/v1/groups/export
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async export(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/groups/export`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * import - Imports all groups from the exported format.
   *
   * Path: api/v1/groups/import
   * @param {Object} body
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   *     "global": {
   *         "user": {
   *             "allowed": [
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/api/v1/auth/logout",
   *                     "name": "get-account-api-v1-auth-logout"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/api/v1/user/me/*",
   *                     "name": "get-account-api-v1-user-me-*"
   *                 },
   *                 {
   *                     "method": "PUT",
   *                     "route": "/account/api/v1/user/me/property/password/*",
   *                     "name": "put-account-api-v1-user-me-property-password-*"
   *                 },
   *                 {
   *                     "method": "PUT",
   *                     "route": "/account/api/v1/user/me/property/avatar/*",
   *                     "name": "put-account-api-v1-user-me-property-avatar-*"
   *                 },
   *                 {
   *                     "method": "PUT",
   *                     "route": "/account/api/v1/user/me/property/email/*",
   *                     "name": "put-account-api-v1-user-me-property-email-*"
   *                 }
   *             ],
   *             "inherited": [
   *                 "group|anonymous"
   *             ],
   *             "is_default": true
   *         },
   *         "developer": {
   *             "allowed": [
   *                 {
   *                     "method": "POST",
   *                     "route": "/account/api/v1/user/me/token",
   *                     "name": "post-account-api-v1-user-me-token"
   *                 },
   *                 {
   *                     "method": "DELETE",
   *                     "route": "/account/api/v1/user/me/token/*",
   *                     "name": "delete-account-api-v1-user-me-token-*"
   *                 }
   *             ],
   *             "inherited": [
   *                 "global|user"
   *             ]
   *         },
   *         "service": {
   *             "allowed": [
   *                 {
   *                     "method": "POST",
   *                     "route": "/account/api/v1/user/me/token",
   *                     "name": "post-account-api-v1-user-me-token"
   *                 },
   *                 {
   *                     "method": "DELETE",
   *                     "route": "/account/api/v1/user/me/token/*",
   *                     "name": "delete-account-api-v1-user-me-token-*"
   *                 }
   *             ],
   *             "inherited": [
   *                 "global|user",
   *                 "global|superadmin"
   *             ]
   *         },
   *         "crm-public": {
   *             "allowed": [
   *                 {
   *                     "method": "GET",
   *                     "route": "/crm",
   *                     "host": "http://localhost:1337",
   *                     "name": "get-crm"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/crm/auth/*",
   *                     "host": "http://localhost:1337",
   *                     "name": "get-crm-auth-*"
   *                 }
   *             ]
   *         },
   *         "leads-public": {
   *             "allowed": [
   *                 {
   *                     "method": "POST",
   *                     "route": "/api/leads/v1/new/lead",
   *                     "remove_from_path": "/api",
   *                     "host": "http://leads.trazidev.com",
   *                     "name": "post-api-leads-v1-new-lead"
   *                 }
   *             ]
   *         },
   *         "import-report-public": {
   *             "allowed": [
   *                 {
   *                     "method": "POST",
   *                     "route": "/api/import-report/v1/tlo/people/cid/*",
   *                     "remove_from_path": "/api",
   *                     "host": "http://import-report.trazidev.com",
   *                     "name": "post-api-import-report-v1-tlo-people-cid-*"
   *                 }
   *             ]
   *         },
   *         "subscribed": {},
   *         "admin": {
   *             "inherited": [
   *                 "global|user",
   *                 "global|csrall"
   *             ]
   *         },
   *         "superadmin": {
   *             "allowed": [
   *                 {
   *                     "route": "/account/*",
   *                     "name": "*-account-*"
   *                 },
   *                 {
   *                     "name": "account-*"
   *                 }
   *             ],
   *             "inherited": [
   *                 "global|admin"
   *             ]
   *         },
   *         "csrall": {
   *             "allowed": [
   *                 {
   *                     "method": "*",
   *                     "route": "/api/opt-out/v1/*",
   *                     "remove_from_path": "/api",
   *                     "host": "http://opt-out.trazidev.com",
   *                     "name": "*-api-opt-out-v1-*"
   *                 },
   *                 {
   *                     "method": "*",
   *                     "route": "/api/search/v1/*",
   *                     "remove_from_path": "/api",
   *                     "host": "http://search.trazidev.com",
   *                     "name": "*-api-search-v1-*"
   *                 },
   *                 {
   *                     "method": "*",
   *                     "route": "/api/email/v1/*",
   *                     "remove_from_path": "/api",
   *                     "host": "http://email.trazidev.com",
   *                     "name": "*-api-email-v1-*"
   *                 }
   *             ],
   *             "inherited": [
   *                 "global|user",
   *                 "global|crm-private"
   *             ]
   *         },
   *         "auth": {
   *             "allowed": [
   *                 {
   *                     "method": "POST",
   *                     "route": "/account/api/v1/auth/register/domain/unmask.com",
   *                     "name": "post-account-api-v1-auth-register-domain-unmask.com"
   *                 },
   *                 {
   *                     "method": "PUT",
   *                     "route": "/account/api/v1/auth/login/domain/unmask.com",
   *                     "name": "put-account-api-v1-auth-login-domain-unmask.com"
   *                 },
   *                 {
   *                     "method": "PUT",
   *                     "route": "/account/api/v1/auth/password/forgot/domain/unmask.com",
   *                     "name": "put-account-api-v1-auth-password-forgot-domain-unmask.com"
   *                 },
   *                 {
   *                     "method": "POST",
   *                     "route": "/account/api/v1/auth/register/domain/checkpeople.com",
   *                     "name": "post-account-api-v1-auth-register-domain-checkpeople.com"
   *                 },
   *                 {
   *                     "method": "PUT",
   *                     "route": "/account/api/v1/auth/login/domain/checkpeople.com",
   *                     "name": "put-account-api-v1-auth-login-domain-checkpeople.com"
   *                 },
   *                 {
   *                     "method": "PUT",
   *                     "route": "/account/api/v1/auth/password/forgot/domain/checkpeople.com",
   *                     "name": "put-account-api-v1-auth-password-forgot-domain-checkpeople.com"
   *                 },
   *                 {
   *                     "method": "POST",
   *                     "route": "/account/api/v1/auth/register/domain/traziventures.com",
   *                     "name": "post-account-api-v1-auth-register-domain-traziventures.com"
   *                 },
   *                 {
   *                     "method": "PUT",
   *                     "route": "/account/api/v1/auth/login/domain/traziventures.com",
   *                     "name": "put-account-api-v1-auth-login-domain-traziventures.com"
   *                 },
   *                 {
   *                     "method": "PUT",
   *                     "route": "/account/api/v1/auth/password/forgot/domain/traziventures.com",
   *                     "name": "put-account-api-v1-auth-password-forgot-domain-traziventures.com"
   *                 },
   *                 {
   *                     "method": "PUT",
   *                     "route": "/account/api/v1/auth/password/reset/login",
   *                     "name": "put-account-api-v1-auth-password-reset-login"
   *                 }
   *             ]
   *         },
   *         "crm-private": {
   *             "allowed": [
   *                 {
   *                     "method": "GET",
   *                     "route": "/crm/admin/*",
   *                     "host": "http://staging.crm.trazidev.com",
   *                     "name": "get-crm-admin-*"
   *                 }
   *             ]
   *         },
   *         "csr": {
   *             "allowed": [
   *                 {
   *                     "method": "*",
   *                     "route": "/api/opt-out/v1/cids",
   *                     "remove_from_path": "/api",
   *                     "host": "http://opt-out.trazidev.com",
   *                     "name": "*-api-opt-out-v1-cids"
   *                 },
   *                 {
   *                     "method": "*",
   *                     "route": "/api/opt-out/v1/id/*",
   *                     "remove_from_path": "/api",
   *                     "host": "http://opt-out.trazidev.com",
   *                     "name": "*-api-opt-out-v1-id-*"
   *                 },
   *                 {
   *                     "method": "*",
   *                     "route": "/api/opt-out/v1/domain/:grouptype.com",
   *                     "remove_from_path": "/api",
   *                     "host": "http://opt-out.trazidev.com",
   *                     "name": "*-api-opt-out-v1-domain-:grouptype.com"
   *                 },
   *                 {
   *                     "method": "*",
   *                     "route": "/api/opt-out/v1/domain/:grouptype.com/*",
   *                     "remove_from_path": "/api",
   *                     "host": "http://opt-out.trazidev.com",
   *                     "name": "*-api-opt-out-v1-domain-:grouptype.com-*"
   *                 },
   *                 {
   *                     "method": "*",
   *                     "route": "/api/search/v1/*",
   *                     "remove_from_path": "/api",
   *                     "host": "http://search.trazidev.com",
   *                     "name": "*-api-search-v1-*"
   *                 },
   *                 {
   *                     "method": "*",
   *                     "route": "/api/email/v1/*",
   *                     "remove_from_path": "/api",
   *                     "host": "http://email.trazidev.com",
   *                     "name": "*-api-email-v1-*"
   *                 }
   *             ],
   *             "inherited": [
   *                 "global|user",
   *                 "global|crm-private"
   *             ]
   *         }
   *     },
   *     "group": {
   *         "superadmin": {
   *             "allowed": [
   *                 {
   *                     "host": null,
   *                     "route": "/account/*",
   *                     "name": "*-account-*"
   *                 }
   *             ],
   *             "inherited": [
   *                 "group|anonymous"
   *             ]
   *         },
   *         "anonymous": {
   *             "allowed": [
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/dashboard/*",
   *                     "remove_from_path": "/account/dashboard",
   *                     "host": "https://unmask.com",
   *                     "name": "get-account-dashboard-*"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/portal/*",
   *                     "name": "get-account-portal-*"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/assets/*",
   *                     "name": "get-account-assets-*"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/favicon.ico",
   *                     "name": "get-favicon.ico"
   *                 },
   *                 {
   *                     "method": "PUT",
   *                     "route": "/account/api/v1/auth/password/forgot",
   *                     "name": "put-account-api-v1-auth-password-forgot"
   *                 },
   *                 {
   *                     "method": "PUT",
   *                     "route": "/account/api/v1/auth/password/reset",
   *                     "name": "put-account-api-v1-auth-password-reset"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/api/v1/auth/activate",
   *                     "name": "get-account-api-v1-auth-activate"
   *                 },
   *                 {
   *                     "method": "POST",
   *                     "route": "/account/api/v1/auth/token",
   *                     "name": "post-account-api-v1-auth-token"
   *                 },
   *                 {
   *                     "method": "POST",
   *                     "route": "/account/api/v1//auth/oauth/authorize",
   *                     "name": "post-account-api-v1--auth-oauth-authorize"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/api/v1//auth/oauth/authorize",
   *                     "name": "get-account-api-v1--auth-oauth-authorize"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/api/v1/user/me/permission/allowed/*",
   *                     "name": "get-account-api-v1-user-me-permission-allowed-*"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/api/v1/user/me/route/allowed",
   *                     "name": "get-account-api-v1-user-me-route-allowed"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/api/v1/config/password",
   *                     "name": "get-account-api-v1-config-password"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/api/v1/config/portal/webclient",
   *                     "name": "get-account-api-v1-config-portal-webclient"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/metrics",
   *                     "name": "get-account-metrics"
   *                 },
   *                 {
   *                     "method": "GET",
   *                     "route": "/account/health",
   *                     "name": "get-account-health"
   *                 }
   *             ],
   *             "inherited": [
   *                 "global|auth",
   *                 "global|leads-public",
   *                 "global|import-report-public",
   *                 "global|opt-out-public",
   *                 "global|crm-public"
   *             ]
   *         }
   *     },
   *     "unmask": {
   *         "csr": {
   *             "inherited": [
   *                 "global|csr"
   *             ]
   *         }
   *     },
   *     "checkpeople": {
   *         "csr": {
   *             "inherited": [
   *                 "global|csr"
   *             ]
   *         }
   *     },
   *     "information": {
   *         "csr": {
   *             "inherited": [
   *                 "global|csr"
   *             ]
   *         }
   *     },
   *     "products": {
   *         "full_reports": {},
   *         "pdf_generation": {},
   *         "report_monitoring": {}
   *     }
   * }
   * ```
   */
  static async import(body, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/groups/import`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get all the groups
   *
   * Path: api/v1/groups
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/groups`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Type() {
    return GroupsType;
  }
}
/**
 *
 */
class GroupsType {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      all: 'api/v1/groups/type/:type',
      gettypeslist: 'api/v1/groups/types',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * all - Gets all groups of a particular type
   *
   * Path: api/v1/groups/type/:type
   * @param {any} type The type of the group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async all(type, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/groups/type/${type}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * getTypesList - Gets all the types of groups currently made.
   *
   * Path: api/v1/groups/types
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getTypesList(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/groups/types`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class Group {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      addpermission: 'api/v1/group/id/:id/insert/permission/:permission',
      deletepermission: 'api/v1/group/id/:id/permission/:permission',
      addroute: 'api/v1/group/id/:id/insert/route',
      removeinheritance:
        'api/v1/group/id/:id/remove/inheritance/:inherited/type/:grouptype',
      inheritfrom:
        'api/v1/group/id/:id/inherit/from/:inherited/type/:grouptype',
      setdefault: 'api/v1/group/id/:id/set/default',
      delete: 'api/v1/group/id/:id',
      edit: 'api/v1/group/id/:id',
      get: 'api/v1/group/id/:id',
      createbyname: 'api/v1/group/id/:id',
      create: 'api/v1/group',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * addPermission - Adds a permission to a group.
   *
   * Path: api/v1/group/id/:id/insert/permission/:permission
   * @param {any} id Name of the group (example: anonymous)
   * @param {any} permission Permission (example: test-one-two-*)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addPermission(id, permission, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl + '/' + `api/v1/group/id/${id}/insert/permission/${permission}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * deletePermission - Removes a permission/route from a group.
   *
   * Path: api/v1/group/id/:id/permission/:permission
   * @param {any} id Name of the group (example: anonymous)
   * @param {any} permission Name or Route (example: test-one-two-*)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async deletePermission(id, permission, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/permission/${permission}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * addRoute - Adds a route to a group.

```javascript
{
    "route": "test/permissions/*", // optional
    "host": null, // optional, defaults to travelling host
    "method": "*", // optional, defaults to '*'
    "remove_from_path": 'test/', // optional 
    "name": "test-permissions-*"  // Required and needs to be unqiue, defaults to method + route seperated by '-' instead of `/`
}
```
  *
  * Path: api/v1/group/id/:id/insert/route
  * @param {Object} body
  * @param {any} id  
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  * @example
  * body
  * ```json
  * {
 * 	"route": "test/permissions/*",
 *     "host": null, 
 *     "method": "*", 
 *     "name": "test-permissions-*"  
 * }
  * ```
  */
  static async addRoute(body, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/insert/route`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeInheritance - Removes an inheritance from a group.
   *
   * Path: api/v1/group/id/:id/remove/inheritance/:inherited/type/:grouptype
   * @param {any} id Name of the group (example: test1234)
   * @param {any} inherited Name of the group to inherit from (example: group4)
   * @param {any} grouptype The type of the inherited group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeInheritance(
    id,
    inherited,
    grouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${id}/remove/inheritance/${inherited}/type/${grouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * inheritFrom - Adds an inheritance to a group.
   *
   * Path: api/v1/group/id/:id/inherit/from/:inherited/type/:grouptype
   * @param {any} id Name of the group (example: test1234)
   * @param {any} inherited Name of the group to inherit from (example: group4)
   * @param {any} grouptype The type of the inherited group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async inheritFrom(
    id,
    inherited,
    grouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${id}/inherit/from/${inherited}/type/${grouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * setDefault - Sets the group to be the default group for new users.
   *
   * Path: api/v1/group/id/:id/set/default
   * @param {any} id id or name (example: group6)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async setDefault(id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/set/default`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * delete - delete group by its id or name
   *
   * Path: api/v1/group/id/:id
   * @param {any} id id or name  (example: group1)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async delete(id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edits a group
   *
   * Path: api/v1/group/id/:id
   * @param {Object} body
   * @param {any} id  (example: ab31efc8-40a5-4d38-a347-adb4e38d0075)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   *     "allowed": [
   *         {
   *             "route": "/travelling/portal/*",
   *             "host": null,
   *             "remove_from_path": "/travelling/portal",
   *             "method": "*",
   *             "name": "*-travelling-portal-*"
   *         },
   *         {
   *             "route": "/travelling/api/v1/auth/*",
   *             "host": null,
   *             "method": "*",
   *             "name": "*-travelling-api-v1-auth-*"
   *         },
   *         {
   *             "route": "/travelling/api/v1/user/me/route/allowed",
   *             "host": null,
   *             "method": "GET",
   *             "name": "get-travelling-api-v1-user-me-route-allowed"
   *         },
   *         {
   *             "route": "/travelling/api/v1/user/me/permission/allowed/*",
   *             "host": null,
   *             "method": "GET",
   *             "name": "get-travelling-api-v1-user-me-permission-allowed-*"
   *         },
   *         {
   *             "route": "/travelling/assets/*",
   *             "host": null,
   *             "remove_from_path": "/travelling/assets/",
   *             "method": "*",
   *             "name": "*-travelling-assets-*"
   *         },
   *         {
   *             "route": "travelling/api/v1/config/password",
   *             "host": null,
   *             "method": "get"
   *         }
   *     ]
   * }
   * ```
   */
  static async edit(body, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get a group by it's id or name.
   *
   * Path: api/v1/group/id/:id
   * @param {any} id id or name  (example: group1)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(id, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * createByName - Add a new blank group with the set name.
   *
   * Path: api/v1/group/id/:id
   * @param {any} id Name of the new group (example: test123)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async createByName(id, authorization_bearer, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * create - Add a new group
   *
   * Path: api/v1/group
   * @param {Object} body
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   *     "name": "group1",
   *     "type": "testgroup",
   *     "allowed": [
   *         {
   *             "route": "/test",
   *             "host": "http://127.0.0.1:1237/",
   *             "remove_from_path": "test",
   *             "method": "*",
   *             "name": "all-test"
   *         }
   *     ],
   *     "is_default": false
   * }
   * ```
   */
  static async create(body, authorization_bearer, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Users() {
    return GroupUsers;
  }

  static get User() {
    return GroupUser;
  }

  static get Type() {
    return GroupType;
  }

  static get Request() {
    return GroupRequest;
  }
}
/**
 *
 */
class GroupUsers {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      inherited: 'api/v1/group/id/:id/users/inherited',
      get: 'api/v1/group/id/:id/users',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
  * inherited - Gets all the users that belong to the group and all of its inherited groups.

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |
  *
  * Path: api/v1/group/id/:id/users/inherited
  * @param {any} id id or name (example: superadmin)
  */
  static async inherited(id, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/users/inherited`,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * get - Gets all the users that belong to the group.

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |
  *
  * Path: api/v1/group/id/:id/users
  * @param {any} id id or name (example: superadmin)
  */
  static async get(id, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/users`,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class GroupUser {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      delete: 'api/v1/group/id/:group/type/:type/user/:id',
      removegroupinheritance:
        'api/v1/group/id/:group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      addgroupinheritance:
        'api/v1/group/id/:group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      editpropertyvalue:
        'api/v1/group/id/:group/type/:type/user/:id/property/:property/:value',
      editproperty:
        'api/v1/group/id/:group/type/:type/user/:id/property/:property',
      edit: 'api/v1/group/id/:group/type/:type/user/:id',
      getproperty:
        'api/v1/group/id/:group/type/:type/user/:id/property/:property',
      get: 'api/v1/group/id/:group/type/:type/user/:id',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * delete - Delete a user by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id
   * @param {any} group id or name of the group
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user7)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async delete(group, type, id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${group}/type/${type}/user/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeGroupInheritance - Remove a user to a group of a particular type of group.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} group id or name of the group (example: group1)
   * @param {any} type type of group (example: group)
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeGroupInheritance(
    group,
    type,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${group}/type/${type}/user/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addGroupInheritance - Add a group for the current user from a group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} group id or name of the group (example: group1)
   * @param {any} type type of group (example: group)
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addGroupInheritance(
    group,
    type,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${group}/type/${type}/user/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editPropertyValue - Edit a current user's property data as a path param from a group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id/property/:property/:value
   * @param {any} group id or name of the group
   * @param {any} type The type of the group (example: group)
   * @param {any} id id or name (example: user5)
   * @param {any} property  (example: email)
   * @param {any} value  (example: swag@yolo.com)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async editPropertyValue(
    group,
    type,
    id,
    property,
    value,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${group}/type/${type}/user/${id}/property/${property}/${value}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editProperty - Edit a user's property by it's id or username from a group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id/property/:property
   * @param {Object} body
   * @param {any} group id or name of the group
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {any} property  (example: email)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"locked": false
   * }
   * ```
   */
  static async editProperty(
    body,
    group,
    type,
    id,
    property,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${group}/type/${type}/user/${id}/property/${property}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edit a user by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id
   * @param {Object} body
   * @param {any} group id or name of the group
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"locked": false
   * }
   * ```
   */
  static async edit(body, group, type, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${group}/type/${type}/user/${id}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * getProperty - Get a user's property by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id/property/:property
   * @param {any} group id or name of the group
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {any} property  (example: email)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getProperty(
    group,
    type,
    id,
    property,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${group}/type/${type}/user/${id}/property/${property}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get a user by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id
   * @param {any} group id or name of the group
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(group, type, id, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${group}/type/${type}/user/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class GroupType {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      deletepermission: 'api/v1/group/id/:id/type/:type/permission/:permission',
      addpermission:
        'api/v1/group/id/:id/type/:type/insert/permission/:permission',
      addroute: 'api/v1/group/id/:id/type/:type/insert/route',
      removeinheritance:
        'api/v1/group/id/:id/type/:type/remove/inheritance/:inherited/type/:grouptype',
      inheritfrom:
        'api/v1/group/id/:id/type/:type/inherit/from/:inherited/type/:grouptype',
      setdefault: 'api/v1/group/id/:id/type/:type/set/default',
      delete: 'api/v1/group/id/:id/type/:type',
      get: 'api/v1/group/id/:id/type/:type',
      edit: 'api/v1/group/id/:id/type/:type',
      createbyname: 'api/v1/group/id/:id/type/:type',
      create: 'api/v1/group/type/:type',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * deletePermission - Removes a permission/route from a group of a particular type.
   *
   * Path: api/v1/group/id/:id/type/:type/permission/:permission
   * @param {any} id Name of the group (example: anonymous)
   * @param {any} type Type of the group (example: group)
   * @param {any} permission Name or Route (example: test-one-three-*)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async deletePermission(
    id,
    type,
    permission,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${id}/type/${type}/permission/${permission}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addPermission - Adds a permission to a group of a particular type.
   *
   * Path: api/v1/group/id/:id/type/:type/insert/permission/:permission
   * @param {any} id Name of the group (example: anonymous)
   * @param {any} type Type of the group (example: group)
   * @param {any} permission Permission  (example: test-one-three-*)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addPermission(id, type, permission, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${id}/type/${type}/insert/permission/${permission}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * addRoute - Adds a route to a group of a particular type.

```javascript
{
    "route": "test/permissions/*", // optional
    "host": null, // optional, defaults to travelling host
    "method": "*", // optional, defaults to '*'
    "remove_from_path": 'test/', // optional 
    "name": "test-permissions-*"  // Required and needs to be unqiue, defaults to method + route seperated by '-' instead of `/`
}
```
  *
  * Path: api/v1/group/id/:id/type/:type/insert/route
  * @param {Object} body
  * @param {any} id Name of the group 
  * @param {any} type  
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  * @example
  * body
  * ```json
  * {
 * 	"route": "test/permissions/*",
 *     "host": null, 
 *     "method": "*", 
 *     "name": "test-permissions-*"  
 * }
  * ```
  */
  static async addRoute(body, id, type, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}/insert/route`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeInheritance - Removes an inheritance from a group of a particular type.
   *
   * Path: api/v1/group/id/:id/type/:type/remove/inheritance/:inherited/type/:grouptype
   * @param {any} id Name of the group (example: test1234)
   * @param {any} type The type of the group (example: accounts)
   * @param {any} inherited Name of the group to inherit from (example: superadmin)
   * @param {any} grouptype The type of the inherited group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeInheritance(
    id,
    type,
    inherited,
    grouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${id}/type/${type}/remove/inheritance/${inherited}/type/${grouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * inheritFrom - Adds an inheritance to a group of a particular type.
   *
   * Path: api/v1/group/id/:id/type/:type/inherit/from/:inherited/type/:grouptype
   * @param {any} id Name of the group (example: group1)
   * @param {any} type The type of the group (example: testgroup)
   * @param {any} inherited Name of the group to inherit from (example: test123)
   * @param {any} grouptype The type of the inherited group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async inheritFrom(
    id,
    type,
    inherited,
    grouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${id}/type/${type}/inherit/from/${inherited}/type/${grouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * setDefault - Sets the group of a particular type to be the default group for new users.
   *
   * Path: api/v1/group/id/:id/type/:type/set/default
   * @param {any} id id or name (example: group1)
   * @param {any} type The type of the group (example: account)
   */
  static async setDefault(id, type, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}/set/default`,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * delete - delete group of a particular type by its name or id
   *
   * Path: api/v1/group/id/:id/type/:type
   * @param {any} id id or name
   * @param {any} type The type of the group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async delete(id, type, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get a group by it's id or name of a particular type.
   *
   * Path: api/v1/group/id/:id/type/:type
   * @param {any} id id or name  (example: group1)
   * @param {any} type The type of the group (example: accounts)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(id, type, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edits a group of a particular type
   *
   * Path: api/v1/group/id/:id/type/:type
   * @param {Object} body
   * @param {any} id id or name
   * @param {any} type The type of the group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {"inherited":["a717b880-b17b-4995-9610-cf451a06d015","7ec8c351-7b8a-4ea8-95cc-0d990b225768"]}
   * ```
   */
  static async edit(body, id, type, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * createByName - Add a new blank group with the set name and type
   *
   * Path: api/v1/group/id/:id/type/:type
   * @param {any} id Name of the new group (example: test1234)
   * @param {any} type Type of the new group (example: accounts)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async createByName(id, type, authorization_bearer, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * create - Add a new group of a particular type
   *
   * Path: api/v1/group/type/:type
   * @param {Object} body
   * @param {any} type The type of the group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   *     "name": "group1",
   *     "type": "accounts",
   *     "allowed": [
   *         {
   *             "route": "/test",
   *             "host": "http://127.0.0.1:1237/",
   *             "remove_from_path": "test",
   *             "method": "*",
   *             "name": "all-test"
   *         }
   *     ],
   *     "is_default": false
   * }
   * ```
   */
  static async create(body, type, authorization_bearer, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/type/${type}`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Users() {
    return GroupTypeUsers;
  }

  static get User() {
    return GroupTypeUser;
  }
}
/**
 * Both requests are disabled. Dont use.
 */
class GroupTypeUsers {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      get: 'api/v1/group/id/:id/type/:type/users',
      inherited: 'api/v1/group/id/:id/type/:type/users/inherited',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
  * get - Gets all the users that belong to the group  of a particular type by its name or id.

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |
  *
  * Path: api/v1/group/id/:id/type/:type/users
  * @param {any} id  
  * @param {any} type  
  */
  static async get(id, type, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}/users`,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * inherited - Gets all the users that belong to the group  of a particular type by its name or id and all of its inherited groups.

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |
  *
  * Path: api/v1/group/id/:id/type/:type/users/inherited
  * @param {any} id  (example: group4)
  * @param {any} type The type of the group (example: groups)
  */
  static async inherited(id, type, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}/users/inherited`,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class GroupTypeUser {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      delete: 'api/v1/group/type/:type/user/:id',
      removegroupinheritance:
        'api/v1/group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      addgroupinheritance:
        'api/v1/group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      editpropertyvalue:
        'api/v1/group/type/:type/user/:id/property/:property/:value',
      editproperty: 'api/v1/group/type/:type/user/:id/property/:property',
      edit: 'api/v1/group/type/:type/user/:id',
      getproperty: 'api/v1/group/type/:type/user/:id/property/:property',
      get: 'api/v1/group/type/:type/user/:id',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * delete - Delete a user by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/type/:type/user/:id
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user7)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async delete(type, id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/type/${type}/user/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeGroupInheritance - Remove a user to a group of a particular type of group.
   *
   * Path: api/v1/group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} type type of group (example: group)
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeGroupInheritance(
    type,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/type/${type}/user/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addGroupInheritance - Add a user to a group of a particular type of group.
   *
   * Path: api/v1/group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} type type of group (example: group)
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addGroupInheritance(
    type,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/type/${type}/user/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editPropertyValue - Edit a current user's property data as a path param from a group of a particular type.
   *
   * Path: api/v1/group/type/:type/user/:id/property/:property/:value
   * @param {any} type The type of the group (example: group)
   * @param {any} id id or name (example: user5)
   * @param {any} property  (example: email)
   * @param {any} value  (example: swag@yolo.com)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async editPropertyValue(
    type,
    id,
    property,
    value,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/type/${type}/user/${id}/property/${property}/${value}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editProperty - Edit a user's property by it's id or username from a group of a particular type.
   *
   * Path: api/v1/group/type/:type/user/:id/property/:property
   * @param {Object} body
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {any} property  (example: email)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"locked": false
   * }
   * ```
   */
  static async editProperty(
    body,
    type,
    id,
    property,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/type/${type}/user/${id}/property/${property}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edit a user by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/type/:type/user/:id
   * @param {Object} body
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"locked": false
   * }
   * ```
   */
  static async edit(body, type, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/type/${type}/user/${id}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * getProperty - Get a user's property by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/type/:type/user/:id/property/:property
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {any} property  (example: email)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getProperty(type, id, property, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/type/${type}/user/${id}/property/${property}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get a user by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/type/:type/user/:id
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(type, id, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/type/${type}/user/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class GroupRequest {
  constructor() {}
  static get _postgenClassUrls() {
    return {};
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  static get User() {
    return GroupRequestUser;
  }
}
/**
 *
 */
class GroupRequestUser {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      delete: 'api/v1/group/request/type/:type/user/:id',
      addgroupinheritance:
        'api/v1/group/request/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      editproperty:
        'api/v1/group/request/type/:type/user/:id/property/:property',
      edit: 'api/v1/group/request/type/:type/user/:id',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * delete - Delete a user by it's id or username from the user's `group_request` of a particular type.
   *
   * Path: api/v1/group/request/type/:type/user/:id
   * @param {Object} body
   * @param {any} type  (example: testgroup)
   * @param {any} id  (example: user69)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"locked": false
   * }
   * ```
   */
  static async delete(body, type, id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/request/type/${type}/user/${id}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addGroupInheritance - Add a user to a group from the user's `group_request` of a particular type.
   *
   * Path: api/v1/group/request/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} type type of group (example: group)
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addGroupInheritance(
    type,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/request/type/${type}/user/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editProperty - Edit a user's property by it's id or username from the user's `group_request` of a particular type.
   *
   * Path: api/v1/group/request/type/:type/user/:id/property/:property
   * @param {Object} body
   * @param {any} type  (example: accounts)
   * @param {any} id  (example: user6)
   * @param {any} property  (example: email)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * "chad@yolo.com"
   * ```
   */
  static async editProperty(
    body,
    type,
    id,
    property,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/request/type/${type}/user/${id}/property/${property}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edit a user by it's id or username from the user's `group_request` of a particular type.
   *
   * Path: api/v1/group/request/type/:type/user/:id
   * @param {Object} body
   * @param {any} type  (example: accounts)
   * @param {any} id  (example: user6)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"locked": false
   * }
   * ```
   */
  static async edit(body, type, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/request/type/${type}/user/${id}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class Users {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      bygrouprequest: 'api/v1/users/group/request/:group_request',
      count: 'api/v1/users/count',
      get: 'api/v1/users',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
  * byGroupRequest - Gets all the users that have the specified group request

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |
  *
  * Path: api/v1/users/group/request/:group_request
  * @param {any} group_request name of the group  (example: superadmin)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async byGroupRequest(group_request, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/users/group/request/${group_request}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * count - Gets all the users

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |
  *
  * Path: api/v1/users/count
  * @param {any} limit Number of maximum results. (example: 2) (example: 2)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 10)
  * @param {any} filter Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-06,created_on<2021-06-08)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async count(limit, skip, filter, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/users/count`,
      qs: { limit, skip, filter },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * get - Gets all the users

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |
  *
  * Path: api/v1/users
  * @param {any} sort Sort by any user object key (examples: id, domain, locked, etc.) (example: created_on)
  * @param {any} limit Number of maximum results. (example: 2) (example: 2)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 10)
  * @param {any} filter Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: locked=false,created_on>2021-06-03,created_on<2021-06-06)
  * @param {any} sortdir Sort direction (example ascending order: ASC) (example: ASC)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async get(
    sort,
    limit,
    skip,
    filter,
    sortdir,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/users`,
      qs: { sort, limit, skip, filter, sortdir },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Domain() {
    return UsersDomain;
  }
}
/**
 *
 */
class UsersDomain {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      count: 'api/v1/users/domain/:domain/count',
      get: 'api/v1/users/domain/:domain',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
  * count - Gets all the users

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |
  *
  * Path: api/v1/users/domain/:domain/count
  * @param {any} domain  (example: test.com)
  * @param {any} limit Number of maximum results. (example: 2) (example: 5)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 10)
  * @param {any} filter Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2022-06-01,created_on<2022-06-08)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async count(domain, limit, skip, filter, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/users/domain/${domain}/count`,
      qs: { limit, skip, filter },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * get - Gets all the users

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |
  *
  * Path: api/v1/users/domain/:domain
  * @param {any} domain  (example: test.com)
  * @param {any} sort Sort by any user object key (examples: id, domain, locked, etc.) (example: created_on)
  * @param {any} limit Number of maximum results. (example: 2) (example: 1)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 10)
  * @param {any} filter Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-01,created_on<2021-06-08)
  * @param {any} sortdir Sort direction (example ascending order: ASC) (example: ASC)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async get(
    domain,
    sort,
    limit,
    skip,
    filter,
    sortdir,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/users/domain/${domain}`,
      qs: { sort, limit, skip, filter, sortdir },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class User {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      delete: 'api/v1/user/id/:id',
      removegroupinheritance:
        'api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      addgroupinheritance:
        'api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      editpropertyvalue: 'api/v1/user/id/:id/property/:property/:value',
      editproperty: 'api/v1/user/id/:id/property/:property',
      edit: 'api/v1/user/id/:id',
      getproperty: 'api/v1/user/id/:id/property/:property',
      get: 'api/v1/user/id/:id',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * delete - Delete a user by it's Id.
   *
   * Path: api/v1/user/id/:id
   * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async delete(id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeGroupInheritance - Remove a user from a group.
   *
   * Path: api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} id id or name of the user (example: 99a64193-b5a8-448d-8933-05d27f366094)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group)
   * @param {any} inheritgrouptype type of the  group to inherit (example: testgroup)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeGroupInheritance(
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/id/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addGroupInheritance - Add a user to a group.
   *
   * Path: api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} id id or name of the user (example: 99a64193-b5a8-448d-8933-05d27f366094)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group1)
   * @param {any} inheritgrouptype type of the  group to inherit (example: testgroup)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addGroupInheritance(
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/id/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editPropertyValue - Edit a current user's property data as a path param.
   *
   * Path: api/v1/user/id/:id/property/:property/:value
   * @param {any} id Id or Username
   * @param {any} property  (example: group_id)
   * @param {any} value  (example: 595d3f9a-5383-4da9-a465-b975d8a5e28e)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async editPropertyValue(
    id,
    property,
    value,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/id/${id}/property/${property}/${value}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editProperty - Edit a user's property by id.
   *
   * Path: api/v1/user/id/:id/property/:property
   * @param {Object} body
   * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {any} property
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```text
   * user6
   * ```
   */
  static async editProperty(body, id, property, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/id/${id}/property/${property}`,
      body,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edit a user's by id.
   *
   * Path: api/v1/user/id/:id
   * @param {Object} body
   * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"username" : "user6",
   * 	"password" : "Awickednewawesomepasword4242!@"
   * }
   * ```
   */
  static async edit(body, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/id/${id}`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * getProperty - Get a user's property by it's id.
   *
   * Path: api/v1/user/id/:id/property/:property
   * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {any} property
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getProperty(id, property, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/id/${id}/property/${property}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get a user by it's id.
   *
   * Path: api/v1/user/id/:id
   * @param {any} id  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(id, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Domain() {
    return UserDomain;
  }

  static get Current() {
    return UserCurrent;
  }
}
/**
 *
 */
class UserDomain {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      delete: 'api/v1/user/domain/:domain/id/:id',
      removegroupinheritance:
        'api/v1/user/domain/:domain/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      addgroupinheritance:
        'api/v1/user/domain/:domain/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      editpropertyvalue:
        'api/v1/user/domain/:domain/id/:id/property/:property/:value',
      editproperty: 'api/v1/user/domain/:domain/id/:id/property/:property',
      edit: 'api/v1/user/domain/:domain/id/:id',
      getproperty: 'api/v1/user/domain/:domain/id/:id/property/:property',
      get: 'api/v1/user/domain/:domain/id/:id',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * delete - Delete a user by it's Id.
   *
   * Path: api/v1/user/domain/:domain/id/:id
   * @param {any} domain Domain (example: test.com) (example: test.com)
   * @param {any} id id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async delete(domain, id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/domain/${domain}/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeGroupInheritance - Remove a user from a group.
   *
   * Path: api/v1/user/domain/:domain/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} domain Domain (example: test.com) (example: test.com)
   * @param {any} id id, username or email. (example: d1bf9986-9938-4d47-b8aa-79184b37cc16)
   * @param {any} inheritgroupid id or name of the group to inherit (example: group1)
   * @param {any} inheritgrouptype type of the group to inherit (example: testgroup)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeGroupInheritance(
    domain,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/domain/${domain}/id/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addGroupInheritance - Add a user to a group.
   *
   * Path: api/v1/user/domain/:domain/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} domain Domain (example: test.com) (example: test.com)
   * @param {any} id id, username or email. (example: user5)
   * @param {any} inheritgroupid id or name of the group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addGroupInheritance(
    domain,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/domain/${domain}/id/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editPropertyValue - Edit a current user's property data as a path param.
   *
   * Path: api/v1/user/domain/:domain/id/:id/property/:property/:value
   * @param {any} domain Domain (example: test.com) (example: test.com)
   * @param {any} id id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294)
   * @param {any} property Property to modify (example: locked) (example: locked)
   * @param {any} value Value to change property to. (example: true)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async editPropertyValue(
    domain,
    id,
    property,
    value,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/domain/${domain}/id/${id}/property/${property}/${value}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editProperty - Edit a user's property by id.
   *
   * Path: api/v1/user/domain/:domain/id/:id/property/:property
   * @param {Object} body
   * @param {any} domain Domain (example: test.com) (example: test.com)
   * @param {any} id id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294)
   * @param {any} property Property to modify (example: locked) (example: locked)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```text
   * false
   * ```
   */
  static async editProperty(
    body,
    domain,
    id,
    property,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/domain/${domain}/id/${id}/property/${property}`,
      body,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edit a user's by id.
   *
   * Path: api/v1/user/domain/:domain/id/:id
   * @param {Object} body
   * @param {any} domain Domain (example: test.com) (example: test.com)
   * @param {any} id id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"username" : "user6",
   * 	"password" : "Awickednewawesomepasword4242!@"
   * }
   * ```
   */
  static async edit(body, domain, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/domain/${domain}/id/${id}`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * getProperty - Get a user's property by it's id.
   *
   * Path: api/v1/user/domain/:domain/id/:id/property/:property
   * @param {any} domain Domain (example: test.com) (example: test.com)
   * @param {any} id id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294)
   * @param {any} property Property to get (example: locked) (example: locked)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getProperty(domain, id, property, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/domain/${domain}/id/${id}/property/${property}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get a user by it's id.
   *
   * Path: api/v1/user/domain/:domain/id/:id
   * @param {any} domain Domain (example: test.com) (example: test.com)
   * @param {any} id id, username or email. (example: d1bf9986-9938-4d47-b8aa-79184b37cc16)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(domain, id, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/domain/${domain}/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class UserCurrent {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      registertoken: 'api/v1/user/me/token',
      removegroupinheritance:
        'api/v1/user/me/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      addgroupinheritance:
        'api/v1/user/me/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      editpropertyvalue: 'api/v1/user/me/property/:property/:value',
      editproperty: 'api/v1/user/me/property/:property',
      deletetoken: 'api/v1/user/me/token/:id',
      edit: 'api/v1/user/me',
      getproperty: 'api/v1/user/me/property/:property',
      routecheck: 'api/v1/user/me/route/allowed',
      permissioncheck: 'api/v1/user/me/permission/allowed/:permission',
      get: 'api/v1/user/me',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * registerToken - Registers a new credentials service for client_credentials based access token auth.
   *
   * Path: api/v1/user/me/token
   * @param {Object} body
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   *     "urls": [
   *         "http://127.0.0.1",
   *         "http://checkpeople.com"
   *     ]
   * }
   * ```
   */
  static async registerToken(body, authorization_bearer, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/token`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeGroupInheritance - Remove a user from a group.
   *
   * Path: api/v1/user/me/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeGroupInheritance(
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/me/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addGroupInheritance - Add a user to a group.
   *
   * Path: api/v1/user/me/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addGroupInheritance(
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/me/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editPropertyValue - Edit a current user's property data as a path param.
   *
   * Path: api/v1/user/me/property/:property/:value
   * @param {any} property  (example: group_id)
   * @param {any} value  (example: 595d3f9a-5383-4da9-a465-b975d8a5e28e)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async editPropertyValue(property, value, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/property/${property}/${value}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editProperty - Edit a current user's property data.
   *
   * Path: api/v1/user/me/property/:property
   * @param {Object} body
   * @param {any} property  (example: password)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```text
   * newpasss
   * ```
   */
  static async editProperty(body, property, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/property/${property}`,
      body,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * deleteToken - Deletes a client_credentials based access token auth.
   *
   * Path: api/v1/user/me/token/:id
   * @param {any} id id or name of the token (example: 74b3c2f2-3f94-4b5d-b3e2-4b3bd2c5d6fe)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async deleteToken(id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/token/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Updates the current logged in user.
   *
   * Path: api/v1/user/me
   * @param {Object} body
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   *     "username": "user6",
   *     "password": "Awickednewawesomepasword4242!@"
   * }
   * ```
   */
  static async edit(body, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * getProperty - Gets the currently logged in user's single property
   *
   * Path: api/v1/user/me/property/:property
   * @param {any} property  (example: username)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getProperty(property, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/property/${property}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * routeCheck - Checks if current logged in user can access the route with method.
   *
   * Path: api/v1/user/me/route/allowed
   * @param {any} method  (example: get)
   * @param {any} route  (example: /travelling/api/v1/group/request/type/anonymous/user/)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async routeCheck(method, route, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/route/allowed`,
      qs: { method, route },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * permissionCheck - Checks to see if the current user can access content based on permission.
   *
   * Path: api/v1/user/me/permission/allowed/:permission
   * @param {any} permission name of the route/permission (example: get-travelling)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async permissionCheck(permission, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/permission/allowed/${permission}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Gets the currently logged in user
   *
   * Path: api/v1/user/me
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 * #### Auth endpoints
 *
 */
class Auth {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      accesstoken: 'api/v1/auth/token',
      authorize: 'api/v1/auth/oauth/authorize',
      activate: 'api/v1/auth/activate',
      resetpasswordautologin: 'api/v1/auth/password/reset/login',
      resetpassword: 'api/v1/auth/password/reset',
      forgotpassword: 'api/v1/auth/password/forgot',
      logout: 'api/v1/auth/logout',
      loginotp: 'api/v1/auth/login/otp',
      login: 'api/v1/auth/login',
      register: 'api/v1/auth/register',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * accessToken - Oauth2 `client_credentials` access token flow. Body must be `application/x-www-form-urlencoded` and must contain the `grant_type`. `client_id` & `client_secret` will be sent in a `Basic` Authorization header as `base64(client_id:client_secret)`
   *
   * Path: api/v1/auth/token
   */
  static async accessToken(grant_type, client_id, client_secret, code, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/token`,
      form: {
        grant_type,
        client_id,
        client_secret,
        code,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * authorize - Authorization Code Grant
   *
   * Path: api/v1/auth/oauth/authorize
   * @param {any} client_id
   * @param {any} response_type
   * @param {any} state
   * @param {any} redirect_uri
   * @param {any} group_request
   */
  static async authorize(
    client_id,
    response_type,
    state,
    redirect_uri,
    group_request,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/oauth/authorize`,
      qs: { client_id, response_type, state, redirect_uri, group_request },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * activate - Activates and unlocks user
   *
   * Path: api/v1/auth/activate
   * @param {any} token  (example: activation_token)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async activate(token, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/activate`,
      qs: { token },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * resetPasswordAutoLogin - Resets the password if the recovery token is valid of the user, then authenticates the user and returns cookies.
   *
   * Path: api/v1/auth/password/reset/login
   * @param {Object} body
   * @param {any} token  (example: [thegeneratedtoken])
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"password":"asdf"
   * }
   * ```
   */
  static async resetPasswordAutoLogin(body, token, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/password/reset/login`,
      qs: { token },
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * resetPassword - Resets the password if the recovery token is valid of the user.
   *
   * Path: api/v1/auth/password/reset
   * @param {Object} body
   * @param {any} token  (example: [thegeneratedtoken])
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"password":"asdf"
   * }
   * ```
   */
  static async resetPassword(body, token, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/password/reset`,
      qs: { token },
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * forgotPassword - Generates a recovery token and sends a email to the attached user (if they exist)
   *
   * Path: api/v1/auth/password/forgot
   * @param {Object} body
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"email": "test@test.com"
   * }
   * ```
   */
  static async forgotPassword(body, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/password/forgot`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * logout -
   *
   * Path: api/v1/auth/logout
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async logout(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/logout`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * loginOtp - Login a user

##### Body Properties

| Prop | Description |
| --- | --- |
| email/username | *required* String (example:  test@test.com) |
| password | *required* String (example:  fakePassword123) |
| remember | *optional* Boolean if you would like to be logged in automatically (example:  true) |
  *
  * Path: api/v1/auth/login/otp
  * @param {any} token  (example: JQHGH9QuIIhpGuFBG920TdnWkSECFp-ONP0NadfPCclsX708wYaXKHFb5nUj1fmZFHcN1KpKqzkOkjfZGYdfsIt0KnWV69mmt5Uqpw3HiMYD1mBfr4SQap2cg8vH78bb|6Rzt6ubKWXJKY6Pg4GAePg==)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async loginOtp(token, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/login/otp`,
      qs: { token },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * login - Login a user

##### Body Properties

| Prop | Description |
| --- | --- |
| email/username | *required* String (example:  test@test.com) |
| password | *required* String (example:  fakePassword123) |
| remember | *optional* Boolean if you would like to be logged in automatically (example:  true) |
  *
  * Path: api/v1/auth/login
  * @param {Object} body
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  * @example
  * body
  * ```json
  * {
 * 	"email": "test@test.com",
 * 	"password": "Pas5w0r!d"
 * }
  * ```
  */
  static async login(body, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/login`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * register - Register a user

`group_request`	is optional.
  *
  * Path: api/v1/auth/register
  * @param {Object} body
  * @param {any} randomPassword Generates a random password on the backend securely if set to `true` (example: true)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  * @example
  * body
  * ```json
  * {
 * 	"username":"test",
 * 	"email": "test34@test.com",
 *     "domain": "default",
 *     "password": "Pas5w0r!d"
 * 
 * }
  * ```
  */
  static async register(body, randomPassword, authorization_bearer, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/register`,
      qs: { randomPassword },
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Token() {
    return AuthToken;
  }

  static get Domain() {
    return AuthDomain;
  }
}
/**
 *
 */
class AuthToken {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      otp: 'api/v1/auth/token/otp/id/:id',
      forgotpassword: 'api/v1/auth/token/password/forgot',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * otp - Generates a one time use password and returns the token to the attached user (if they exist) instead of sending an email.
   **CAUTION SECURITY RISK: Would not expose this URL publicly or have it be allowed by anyone who is not a superadmin type level**
   *
   * Path: api/v1/auth/token/otp/id/:id
   * @param {any} id  (example: test@test.com)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async otp(id, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/token/otp/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * forgotPassword - Generates a recovery token and returns the token to the attached user (if they exist) instead of sending an email.
   **CAUTION SECURITY RISK: Would not expose this URL publicly or have it be allowed by anyone who is not a superadmin type level**
   *
   * Path: api/v1/auth/token/password/forgot
   * @param {Object} body
   * @example
   * body
   * ```json
   * {
   * 	"email": "test@test.com"
   * }
   * ```
   */
  static async forgotPassword(body, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/token/password/forgot`,
      body,
      json: true,
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class AuthDomain {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      forgotpassword: 'api/v1/auth/password/forgot/domain/:domain',
      login: 'api/v1/auth/login/domain/:domain',
      register: 'api/v1/auth/register/domain/:domain',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * forgotPassword - Generates a recovery token and sends a email to the attached user (if they exist)
   *
   * Path: api/v1/auth/password/forgot/domain/:domain
   * @param {Object} body
   * @param {any} domain Domain name (example: test.com) (example: traziventures.com)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"email": "kelvin@traziventures.com"
   * }
   * ```
   */
  static async forgotPassword(body, domain, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/password/forgot/domain/${domain}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * login - Login a user

##### Body Properties

| Prop | Description |
| --- | --- |
| email/username | *required* String (example:  test@test.com) |
| password | *required* String (example:  fakePassword123) |
| domain | *required* String (example:  test.com) |
| remember | *optional* Boolean if you would like to be logged in automatically (example:  true) |
  *
  * Path: api/v1/auth/login/domain/:domain
  * @param {Object} body
  * @param {any} domain Domain name (example: test.com) (example: traziventures.com)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  * @example
  * body
  * ```json
  * {
 * 	"email": "tesft@test.com",
 * 	"password": "Pas5w0r!d"
 * }
  * ```
  */
  static async login(body, domain, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/login/domain/${domain}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * register - Register a user

`group_request`	is optional.
  *
  * Path: api/v1/auth/register/domain/:domain
  * @param {Object} body
  * @param {any} domain Domain name (example: test.com) (example: traziventures.com)
  * @param {any} randomPassword Generates a random password on the backend securely if set to `true` (example: true)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  * @example
  * body
  * ```json
  * {
 * 	"email": "tesft@test.com",
 * 	"password": "Pas5w0r!d"
 * }
  * ```
  */
  static async register(
    body,
    domain,
    randomPassword,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/register/domain/${domain}`,
      qs: { randomPassword },
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Token() {
    return AuthDomainToken;
  }
}
/**
 *
 */
class AuthDomainToken {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      otp: 'api/v1/auth/token/otp/domain/:domain/id/:id',
      forgotpassword: 'api/v1/auth/token/password/forgot/domain/:domain',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * otp - Generates a one time use password and returns the token to the attached user (if they exist) instead of sending an email.
   **CAUTION SECURITY RISK: Would not expose this URL publicly or have it be allowed by anyone who is not a superadmin type level**
   *
   * Path: api/v1/auth/token/otp/domain/:domain/id/:id
   * @param {any} domain  (example: traziventures.com)
   * @param {any} id  (example: test@test.com)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async otp(domain, id, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/token/otp/domain/${domain}/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * forgotPassword - Generates a recovery token and returns the token to the attached user (if they exist) instead of sending an email.
   **CAUTION SECURITY RISK: Would not expose this URL publicly or have it be allowed by anyone who is not a superadmin type level**
   *
   * Path: api/v1/auth/token/password/forgot/domain/:domain
   * @param {Object} body
   * @param {any} domain
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"email": "test@test.com"
   * }
   * ```
   */
  static async forgotPassword(body, domain, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/token/password/forgot/domain/${domain}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 * SDK - importing the SDK for use
 * @param {string} host the hostname to the service (example: http://127.0.0.1)
 * @param {object} opts options that will be appened to every request. [Fasquest Lib Options](https://github.com/Phara0h/Fasquest) (example: {headers: {'API-KEY':'34098hodf'}})
 * @example
 * init
 * ```js
 * import sdk from './sdk.mjs';
 * const Travelling = sdk('http://127.0.0.1');
 * ```
 */
function SDK(host, opts) {
  if (host) {
    hostUrl = host;
  }
  if (opts) {
    defaultOpts = opts;
  }
  return {
    Travelling,
    Audit,
    AuditUser,
    Config,
    Groups,
    GroupsType,
    Group,
    GroupUsers,
    GroupUser,
    GroupType,
    GroupTypeUsers,
    GroupTypeUser,
    GroupRequest,
    GroupRequestUser,
    Users,
    UsersDomain,
    User,
    UserDomain,
    UserCurrent,
    Auth,
    AuthToken,
    AuthDomain,
    AuthDomainToken,
  };
}
export default SDK;

