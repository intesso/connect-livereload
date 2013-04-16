/* intesso template server
 */
// set global variables
var settings = require("./settings");

var express = require("express");
var app = module.exports = express();


// load static content before routing takes place
app.use(express["static"](__dirname + "/public"));


// load liveReload script only in development mode
// load before app.router
app.configure('development', function() {
  // live reload script
  var liveReloadPort = settings.liveReload.port || 35729;
  app.use(require('connect-livereload')(liveReloadPort));
})

// load the routes
app.use(app.router);
app.get("*", require("/path/to/routes"));

// start the server
if (!module.parent) {
  var port = settings.webserver.port || 3000;
  app.listen(port);
  console.log("Express app started on port " + port);
}