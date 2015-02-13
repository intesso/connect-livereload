var express = require("express");
var app = express();
var fs = require('fs');

// load liveReload script
var livereload = require('../index.js');
app.use(livereload({
  port: 35729,
  ignore: ['.woff', '.flv']
}));

// live reload script
var livereload2 = require('../index.js');
app.use(livereload2({
  port: 35731,
  ignore: ['.hammel']
}));

// load static content before routing takes place
app.use(express["static"](__dirname + "/fixtures"));

app.get("/stream", function (req, res) {
  var stream = fs.createReadStream(__dirname + '/fixtures/large-file.html');
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

describe('GET /stream', function () {
  it('respond with inserted script', function (done) {
    request(app)
      .get('/stream')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.text.match(/35729\/livereload.js/).length, 1);
        if (err) return done(err);
        done();
      });
  })
});