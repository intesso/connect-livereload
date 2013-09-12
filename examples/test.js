var express = require("express");
var app = module.exports = express();
var fs = require('fs');
var path = require('path');

// load liveReload script only in development mode
app.configure('development', function() {
  // live reload script 
  app.use(require('../index.js')({
    port: 35729,
    ignore: ['.woff', '.flv', '.svg', '.js']
  }));
});

// load the routes
app.use(app.router);

// NOTE: static content should be served before LiveReload. This is for test purposes only.
var assets = path.resolve(__dirname, "../test/fixtures");
app.use(express["static"](assets));


app.get("/index", function(req, res) {
  var html = '<html><head></head><body><p>index test </p></body></html>';
  res.send(html);
});

app.get("/end", function(req, res) {
  res.write('<html><head></head>');
  res.write('<body><p>write test ');
  res.write('</p></body>');
  res.end('<!-- that was it --></html>');
});

app.get("/write", function(req, res) {
  res.write('<html><head></head>');
  res.write('<body><p>begin write test...</p> ');
  res.write('<h1>to write or not to write</h1>');
  res.end('...end write test</body></html>');
});

app.get("/stream", function(req, res) {
  var stream = fs.createReadStream(assets + '/large-file.html');
  stream.pipe(res);
});

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
  var port = 8080;
  app.listen(port);
  console.log("Express app started on port " + port);
}