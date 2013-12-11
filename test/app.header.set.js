var express = require("express");
var app = express();

app.use(express.bodyParser());
app.use(express.methodOverride());

// load liveReload script only in development mode
app.configure('development', function() {
  // live reload script
  var livereload = require('../index.js');
  app.use(livereload({
    port: 35729
  }));
});

// load static content before routing takes place
app.use(express["static"](__dirname + "/fixtures"));

// load the routes
app.use(app.router);

app.get("/set_length", function(req, res) {
  var html = '<html><head></head><body><p>set_length</p></body></html>';
  res.writeHead(200, {
    'content-length': html.length,
    'Content-Type': 'text/html'
  });
  res.end(html);
});

app.get("/set_length2", function(req, res) {
  var html = '<html><head></head><body><p>set_length2</p></body></html>';
  res.write('<!DOCTYPE html>')
  res.writeHead(200, {
    'Content-Length': html.length,
    'Content-Type': 'text/html'
  });
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

function hasScript(html) {
  return (~html.indexOf('livereload.js?snipver=1'));
}

describe('GET /set_length', function() {
  it('should', function(done) {
    request(app)
      .get('/set_length')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res) {
        assert(hasScript(res.text));
        assert(~res.text.indexOf('set_length'));
        if (err) return done(err);
        done()
      });
  })
})

describe('GET /set_length2', function() {
  it('should', function(done) {
    request(app)
      .get('/set_length2')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res) {
        assert(hasScript(res.text));
        assert(~res.text.indexOf('set_length2'));
        assert(~res.text.indexOf('DOCTYPE'));
        if (err) return done(err);
        done()
      });
  })
})