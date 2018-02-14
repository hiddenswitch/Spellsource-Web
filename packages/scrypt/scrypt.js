let lib = require('scrypt');
let crypto = require('crypto');

const log2 = function (n) {
  n = n | 0;
  let log = 0;
  if ((n & 0xffff0000 ) !== 0) {
    n >>>= 16;
    log = 16;
  }
  if (n >= 256) {
    n >>>= 8;
    log += 8;
  }
  if (n >= 16) {
    n >>>= 4;
    log += 4;
  }
  if (n >= 4) {
    n >>>= 2;
    log += 2;
  }
  return (log + (n >>> 1)) | 0;
};

const check = function (passwd, hashed) {
  const parts = hashed.split('$');

  if (parts.length !== 5 || parts[1] !== 's0') {
    throw new Error('Invalid hashed value');
  }

  const params = Number.parseInt(parts[2], 16) | 0;
  const salt = new Buffer(Base64.decode(parts[3]));
  const derived0 = Base64.decode(parts[4]);

  const N = Math.pow(2, params >> 16 & 0xffff) | 0;
  const r = (params >> 8 & 0xff) | 0;
  const p = (params & 0xff) | 0;
  const derived1 = lib.hashSync(passwd, {"N": N, "r": r, "p": p}, 32, salt);

  if (derived0.length !== derived1.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < derived0.length; i++) {
    result |= derived0[i] ^ derived1[i];
  }
  return result === 0;
};

const scrypt = function (passwd, N, r, p) {
  const salt = crypto.randomBytes(16);
  const derived = lib.hashSync(passwd.toString(), {"N": N, "r": r, "p": p}, 32, salt);
  const params = (log2(N) << 16 | r << 8 | p).toString(16);

  return '$s0$' + params + '$' + Base64.encode(salt) + '$' + Base64.encode(derived);
};

export const Scrypt = {check, scrypt};