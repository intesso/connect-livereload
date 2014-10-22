var express = require("express");
var app = express();
var fs = require('fs');

app.use(express.bodyParser());
app.use(express.methodOverride());

// load liveReload script only in development mode
app.configure('development', function() {
  // live reload script
  var livereload = require('../index.js');
  app.use(livereload({
    port: 35729,
    ignore: ['.woff', '.flv']
  }));
});

// load static content before routing takes place
app.use(express["static"](__dirname + "/fixtures"));

// load the routes
app.use(app.router);

app.get("/dummies", function(req, res) {
  var html = '<!DOCTYPE html> html5 for dummies';
  res.send(html);
});

app.get("/doctype", function(req, res) {
  var html = '<!DOCTYPE html> html5 rocks... <script> console.log("dok"); </script> !!';
  res.send(html);
});

app.get("/html", function(req, res) {
  var html = '<html><title>without body </title></html>';
  res.send(html);
});

app.get("/head", function(req, res) {
  var html = '<head><title>without body </title></head>';
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

describe('GET /dummies', function() {
  it('respond with inserted script', function(done) {
    request(app)
      .get('/dummies')
      .set('Accept', 'text/html')
      .expect(200)
    .end(function(err, res) {
      assert(res.text);
      assert.equal(res.text.match(/35729\/livereload.js/).length, 1);
      if (err) return done(err);
      done();
    });
  })
})

describe('GET /doctype', function() {
  it('respond with inserted script', function(done) {
    request(app)
      .get('/doctype')
      .set('Accept', 'text/html')
      .expect(200)
    .end(function(err, res) {
      assert(res.text);
      assert.equal(res.text.match(/35729\/livereload.js/).length, 1);
      if (err) return done(err);
      done();
    });
  })
})

describe('GET /html', function() {
  it('respond with inserted script', function(done) {
    request(app)
      .get('/html')
      .set('Accept', 'text/html')
      .expect(200)
    .end(function(err, res) {
      assert(res.text);
      assert.equal(res.text.match(/35729\/livereload.js/).length, 1);
      if (err) return done(err);
      done();
    });
  })
})

describe('GET /head', function() {
  it('not have the script inserted', function(done) {
    request(app)
      .get('/head')
      .set('Accept', 'text/html')
      .expect(200)
    .end(function(err, res) {
      assert.equal(res.text.indexOf('livereload.js'), -1);
      if (err) return done(err);
      done();
    });
  })
})