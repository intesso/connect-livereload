var express = require("express");
var app = express();

// load liveReload script
app.use(require('../index.js')());

// Monkeypatch the response object after livereload has
function patch(res, fname, func) {
  var fold = res[fname];
  return (res[fname] = function () {
    func.apply(res, arguments);
    return fold.apply(res, arguments);
  });
}
var writeHead,
  write,
  end,
  response;
app.use(function (req, res, next) {
  response = res;
  writeHead = patch(res, 'writeHead', function () {
    var headers = arguments[arguments.length - 1];
    if (headers['X-Patched'])
      headers['X-Patched'] = 'true';
  });
  write = patch(res, 'write', function () {});
  end = patch(res, 'end', function () {});

  next();
});

app.get("/patch-test", function (req, res) {
  res.writeHead(200, {
    'X-Patched': 'false'
  });

  var html = '<html><head></head><body><p>default test </p></body></html>';
  res.end(html);
});

// start the server
if (!module.parent) {
  var port = settings.webserver.port || 3000;
  app.listen(port);
  console.log("Express app started on port " + port);
}

// run the tests
var request = require('supertest');
var assert = require('assert');

describe('GET /default-test', function () {
  it('only restore own patches', function (done) {
    request(app)
      .get('/patch-test')
      .set('Accept', 'text/html')
      .expect(200)
      .expect('X-Patched', 'true')
      .expect(function (res) {
        assert(response.writeHead === writeHead, 'Repatched writeHead was over-restored');
        assert(response.write === write, 'Repatched write was over-restored');
        assert(response.end === end, 'Repatched end was over-restored');
      })
      .end(done);
  });
});
