Package.describe({
  summary: "Wrapper around the scrypt npm package matching the Lambdawork's Scrypt package",
  version: "6.0.3",
  documentation: null
});

Npm.depends({
  scrypt: "6.0.3"
});

Package.onUse(function (api) {
  api.use(['modules', 'base64', 'ecmascript'], 'server');
  api.export("Scrypt", 'server');
  api.mainModule("scrypt.js", 'server');
});


Package.onTest(function (api) {
  api.use(['scrypt', 'ecmascript', 'tinytest', 'base64']);
  api.addFiles('scrypt_tests.js', 'server');
});