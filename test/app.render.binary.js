var express = require("express");
var app = express();
var fs = require('fs');
var bufferEqual = require('buffer-equal');

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
// load the routes
app.use(app.router);

// load static content before routing takes place
app.use(express["static"](__dirname + "/fixtures"));



// start the server
if (!module.parent) {
  var port = settings.webserver.port || 3000;
  app.listen(port);
}

// run the tests
var request = require('supertest');
var assert = require('assert');

function hasScript(html) {
  return (~html.indexOf('livereload.js?snipver=1'));
}

function getFile(file) {
  return fs.readFileSync(__dirname + "/fixtures" + file);
}

describe('getFile /favicon.ico', function() {
  it('should get the file', function(done) {
    var fav = getFile('/favicon.ico');
    assert(fav instanceof Buffer);
    done();
  })
})

describe('GET /favicon.ico', function() {
  it('should respond with with unmodified binary file', function(done) {

    var fav = getFile('/favicon.ico');

    request(app)
      .get('/favicon.ico')
      .set('Accept', 'text/html')
      .expect(200)
      .parse(function(res, fn) {
        res.chunk = '';
        var bufs = [];
        res.on('data', function(chunk) {
          assert(chunk instanceof Buffer);
          res.chunk += chunk;
          bufs.push(chunk);
        });
        res.on('end', function() {
          assert(res.chunk.length > 0);
          var buf = Buffer.concat(bufs);
          assert(bufferEqual(buf, fav), 'Buffer not equal');
          done();
        });
      })
      .end(function(err, res) {
        assert(!err);
        if (err) return done(err);
      });
  })
})

describe('GET /font.ttf', function() {
  it('should respond with with unmodified binary file', function(done) {
    request(app)
      .get('/font.ttf')
      .set('Accept', 'text/html')
      .expect(200)
      .parse(function(res, fn) {
        res.chunk = '';
        res.on('data', function(chunk) {
          res.chunk += chunk;
        });
        res.on('end', function() {
          assert(res.chunk.length > 0);
          done();
        });
      })
      .end(function(err, res) {
        assert(!err);
        if (err) return done(err);
      });
  })
})