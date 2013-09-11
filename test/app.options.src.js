var express = require("express");
var app = express();

// load static content before routing takes place
app.use(express["static"](__dirname + "/fixtures"));

// load liveReload script only in development mode
// load before app.router
app.configure('development', function() {
  // live reload script  
  app.use(require('../index.js')({
    port: 35730,
    src: "http://localhost/livereload.js?snipver=2",
    ignore: []
  }));
});

// load the routes
app.use(app.router);
app.get("/default-test", function(req, res) {
  var html = '<html><head></head><body><p>default test </p></body></html>';
  res.send(html);
});

app.get("/index.html", function(req, res) {
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


describe('GET /default-test', function(){
  it('respond with inserted script', function(done){
    request(app)
      .get('/default-test')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res){
        assert(~res.text.indexOf('http://localhost/livereload.js?snipver=2'));
        if (err) return done(err);
        done()
      });
  })
})
