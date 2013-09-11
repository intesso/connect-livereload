var express = require("express");
var app = module.exports = express();


// load liveReload script only in development mode
app.configure('development', function() {
  // live reload script 
  app.use(require('../index.js')({
    port: 35729,
    ignore: ['.woff', '.flv']
  }));
});

// NOTE: static content should be served before LiveReload. This is for test purposes only.
app.use(express["static"](__dirname + "/public"));

// load the routes
app.use(app.router);
app.get("/index.html", function(req, res) {
  var html = '<html><head></head><body><p>index.html test </p></body></html>';
  res.send(html);
});

// start the server
if (!module.parent) {
  var port = 8080;
  app.listen(port);
  console.log("Express app started on port " + port);
}