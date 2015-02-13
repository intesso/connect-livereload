var express = require("express");
var app = express();

// load liveReload script
var livereload = require('../index.js');

function buume(w, s) {
  return "\n\n joggeli buume \n\n" + w;
}

function pfluume(w, s) {
  return "\n\n het gern pfluume \n\n" + w;
}
app.use(livereload({
  port: 35729,
  rules: [{
    match: /<\/body>/,
    fn: buume
  }, {
    match: /<\/head>/,
    fn: pfluume
  }]
}));

// load static content before routing takes place
app.use(express["static"](__dirname + "/fixtures"));

app.get("/body", function (req, res) {
  var html = '<!DOCTYPE html><body>fettwanz auf dem tanz</body>';
  res.send(html);
});

app.get("/head", function (req, res) {
  var html = '<head><title>head without body </title></head>';
  res.send(html);
});

app.get("/default", function (req, res) {
  var html = '<html><title>plain html</title></html>';
  res.send(html);
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

describe('GET /body', function () {
  it('respond with inserted "buume"', function (done) {
    request(app)
      .get('/body')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (err, res) {
        assert(res.text.indexOf('buume') > 1);
        if (err) return done(err);
        done();
      });
  })
});

describe('GET /head', function () {
  it('respond with inserted "pfluume"', function (done) {
    request(app)
      .get('/head')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (err, res) {
        assert(res.text.indexOf('pfluume') > 1);
        if (err) return done(err);
        done();
      });
  })
});

describe('GET /default', function () {
  it('not have any "livereload.js", "buume" or "pfluume" inserted', function (done) {
    request(app)
      .get('/default')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.text.indexOf('pfluume'), -1);
        assert.equal(res.text.indexOf('buume'), -1);
        assert.equal(res.text.indexOf('livereload.js'), -1);
        if (err) return done(err);
        done();
      });
  })
});