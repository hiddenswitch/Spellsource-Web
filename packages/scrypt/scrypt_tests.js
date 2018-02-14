import {Scrypt} from './scrypt';

const passwd = 'secret';

Tinytest.add('scrypt - basic formatting', test => {
  let N = 16384;
  let r = 8;
  let p = 1;

  let hashed = Scrypt.scrypt(passwd, N, r, p);
  let parts = hashed.split('$');

  test.equal(5, parts.length);
  test.equal('s0', parts[1]);
  test.equal(16, Base64.decode(parts[3]).length);
  test.equal(32, Base64.decode(parts[4]).length);

  let params = Number.parseInt(parts[2], 16);

  test.equal(N, Math.pow(2, params >> 16 & 0xffff) | 0);
  test.equal(r, params >> 8 & 0xff);
  test.equal(p, params >> 0 & 0xff);
});

Tinytest.add('scrypt - check', test => {
  let hashed = Scrypt.scrypt(passwd, 16384, 8, 1);
  test.equal(Scrypt.check(passwd, hashed), true);
  test.equal(Scrypt.check('s3cr3t', hashed), false);
});

Tinytest.add('scrypt - format r and p are max', test => {
  let N = 2;
  let r = 255;
  let p = 255;

  let hashed = Scrypt.scrypt(passwd, N, r, p);
  test.equal(Scrypt.check(passwd, hashed), true);

  let parts = hashed.split('$');
  let params = Number.parseInt(parts[2], 16);

  test.equal(N, Math.pow(2, params >> 16 & 0xffff) | 0);
  test.equal(r, params >> 8 & 0xff);
  test.equal(p, params >> 0 & 0xff);
});