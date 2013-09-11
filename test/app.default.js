var express = require("express");
var app = express();

// load static content before routing takes place
app.use(express["static"](__dirname + "/fixtures"));

// load liveReload script only in development mode
// load before app.router
app.configure('development', function() {
  // live reload script  
  app.use(require('../index.js')());
});

// load the routes
app.use(app.router);
app.get("/default-test", function(req, res) {
  var html = '<html><head></head><body><p>default test </p></body></html>';
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

function hasScript(html) {
  return (~html.indexOf('livereload.js?snipver=1'));
}

describe('GET /default-test', function(){
  it('respond with inserted script', function(done){
    request(app)
      .get('/default-test')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res){
        assert(hasScript(res.text));
        if (err) return done(err);
        done()
      });
  })
})

describe('GET /client.js', function(){
  it('respond without script', function(done){
    request(app)
      .get('/client.js')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res){
        assert(!hasScript(res.text));
        if (err) return done(err);
        done()
      });
  })
})

describe('GET /static.html', function(){
  it('respond without script', function(done){
    request(app)
      .get('/static.html')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res){
        assert(!hasScript(res.text));
        if (err) return done(err);
        done()
      });
  })
})

describe('GET /large-file', function(){
  it('respond with inserted script', function(done){
    request(app)
      .get('/large-file.html')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res){
        assert(!hasScript(res.text));
        if (err) return done(err);
        done()
      });
  })
})
