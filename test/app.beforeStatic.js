var express = require("express");
var app = express();

app.use(express.bodyParser());
app.use(express.methodOverride());

// load liveReload script only in development mode
// load before app.router
app.configure('development', function() {
  // live reload script  
  app.use(require('../index.js')({
    port: 35730,
    ignore: ['.js']
  }));
});

// load static content before routing takes place
app.use(express["static"](__dirname + "/fixtures"));

// load the routes
app.use(app.router);
app.get("/default-test", function(req, res) {
  var html = '<html><head></head><body><p>default test </p></body></html>';
  res.send(html);
});

app.get("/index.html", function(req, res) {
  var html = '<html><head></head><body><p>index.html test </p></body></html>';
  res.send(html);
});

app.get("/writeStream", function(req, res) {
  res.write('<html><head></head>');
  //res.write('<body><p>write test </p></body></html>'); -> does not work!!! </body> has to be written wit res.end or res.send
  res.end('<body><p>write test </p></body></html>');
});

app.get("/write", function(req, res) {
  var html = '<html><head></head><body><p>index.html test </p></body></html>';
  res.write(html);
  res.end();
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
        assert(~res.text.indexOf(':35730/livereload.js'));
        if (err) return done(err);
        done()
      });
  })
})

describe('GET /index.html', function(){
  it('respond with inserted script', function(done){
    request(app)
      .get('/index.html')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res){
        assert(hasScript(res.text));
        assert(~res.text.indexOf(':35730/livereload.js'));
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
        assert(~res.text.indexOf(':35730/livereload.js'));
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
  it('respond with script', function(done){
    request(app)
      .get('/static.html')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res){
        assert(hasScript(res.text));
        if (err) return done(err);
        done()
      });
  })
})


describe('GET /favicon.ico', function(){
  it('respond with script', function(done){
    request(app)
      .get('/favicon.ico')
      .expect(200)
      .end(function(err, res){
        assert(!hasScript(res.text));
        if (err) return done(err);
        done()
      });
  })
})

describe('GET /font.ttf', function(){
  it('respond with script', function(done){
    request(app)
      .get('/font.ttf')
      .expect(200)
      .end(function(err, res){
        assert(!hasScript(res.text));
        if (err) return done(err);
        done()
      });
  })
})

describe('GET /static.html', function(){
  it('respond with script', function(done){
    request(app)
      .get('/static.html')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res){
        assert(hasScript(res.text));
        if (err) return done(err);
        done()
      });
  })
})

describe('GET /write', function(){
  it('respond with script', function(done){
    request(app)
      .get('/write')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res){
        assert(hasScript(res.text));
        if (err) return done(err);
        done()
      });
  })
})


describe('GET /writeStream', function(){
  it('respond with script', function(done){
    request(app)
      .get('/writeStream')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res){
        assert(hasScript(res.text));
        if (err) return done(err);
        done()
      });
  })
})

