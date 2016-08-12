var express = require("express");
var app = express();

// load liveReload script and plugin
app.use(require('../index.js')({
  plugins: [
    "http://localhost/plugin.js"
  ]
}));

// load static content before routing takes place
app.use(express["static"](__dirname + "/fixtures"));

app.get("/default-test", function (req, res) {
  var html = '<html><head></head><body><p>default test </p></body></html>';
  res.send(html);
});

app.get("/index.html", function (req, res) {
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


describe('GET /default-test', function () {
  it('respond with inserted script and plugin', function (done) {
    request(app)
      .get('/default-test')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (err, res) {
        // Assert that it has the script.
        assert(~res.text.indexOf('livereload.js?snipver=1'));

        // Assert that it has the plugin.
        assert(~res.text.indexOf('plugin.js'));

        if (err) return done(err);
        done()
      });
  })
});
