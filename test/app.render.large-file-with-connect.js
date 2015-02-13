var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();
var fs = require('fs');

// load liveReload script
app.use(require('../index.js')({
  port: 35729,
  ignore: ['.js']
}));

// load static content before routing takes place
app.use(serveStatic(__dirname + "/fixtures"));

app.use("/stream-large-file", function (req, res) {
  var stream = fs.createReadStream(__dirname + '/fixtures/large-file.html');
  stream.pipe(res);
});

app.use("/stream-xl-file", function (req, res) {
  var stream = fs.createReadStream(__dirname + '/fixtures/xl-file.html');
  stream.pipe(res);
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

function hasScript(html) {
  return (~html.indexOf('livereload.js?snipver=1'));
}


describe('GET /large-file static', function () {
  it('respond with inserted script', function (done) {
    request(app)
      .get('/large-file.html')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (err, res) {
        assert(~res.text.indexOf(':35729/livereload.js'));
        if (err) return done(err);
        done();
      });
  })
});


describe('GET /xl-file static', function () {
  it('respond with inserted script', function (done) {
    request(app)
      .get('/xl-file.html')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (err, res) {
        assert(~res.text.indexOf(':35729/livereload.js'));
        if (err) return done(err);
        done();
      });
  })
});

describe('GET /stream-large-file', function () {
  it('respond with inserted script', function (done) {
    request(app)
      .get('/stream-large-file')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.text.match(/35729\/livereload.js/).length, 1);
        if (err) return done(err);
        done();
      });
  })
});

describe('GET /stream-xl-file', function () {
  it('respond with inserted script', function (done) {
    request(app)
      .get('/stream-xl-file')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.text.match(/35729\/livereload.js/).length, 1);
        if (err) return done(err);
        done();
      });
  })
});

