// var express = require("express");
// var app = express();
// var fs = require('fs');
// var CHUNK_SIZE_LARGE = 65536;
// var CHUNK_SIZE_SMALL = 16;
//
// app.use(express.bodyParser());
// app.use(express.methodOverride());
//
// // load liveReload script only in development mode
// // load before app.router
// app.configure('development', function() {
//   // live reload script
//   app.use(require('../index.js')({
//     port: 35729,
//     ignore: ['.js']
//   }));
// });
//
// // load static content before routing takes place
// app.use(express["static"](__dirname + "/fixtures"));
//
// // load the routes
// app.use(app.router);
//
// app.get("/stream-static", function(req, res) {
//   var stream = fs.createReadStream(__dirname + '/fixtures/static.html');
//
//   stream.on('readable', function(){
//     var chunk;
//     while (null !== (chunk = stream.read(CHUNK_SIZE_LARGE))) {
//       res.write(chunk);
//     }
//   });
//
//   stream.on('end', function(){
//     res.end();
//   });
// });
//
// app.get("/stream-static-small-chunks", function(req, res) {
//   var stream = fs.createReadStream(__dirname + '/fixtures/static.html');
//
//   stream.on('readable', function(){
//     var chunk;
//     while (null !== (chunk = stream.read(CHUNK_SIZE_SMALL))) {
//       res.write(chunk);
//     }
//   });
//
//   stream.on('end', function(){
//     res.end();
//   });
// });
//
// // start the server
// if (!module.parent) {
//   var port = settings.webserver.port || 3000;
//   app.listen(port);
//   console.log("Express app started on port " + port);
// }
//
// // run the tests
// var request = require('supertest');
// var assert = require('assert');
//
//
// describe('GET /static static', function() {
//   it('respond with inserted script', function(done) {
//     request(app)
//       .get('/static.html')
//       .set('Accept', 'text/html')
//       .expect(200)
//     .end(function(err, res) {
//       assert(~res.text.indexOf(':35729/livereload.js'));
//       if (err) return done(err);
//       done();
//     });
//   })
// })
//
// describe('GET /stream-static', function() {
//   it('respond with inserted script', function(done) {
//     request(app)
//       .get('/stream-static')
//       .set('Accept', 'text/html')
//       .expect(200)
//     .end(function(err, res) {
//       var match = res.text.match(/35729\/livereload.js/);
//       assert(match);
//       if (match) {
//         assert.equal(match.length, 1);
//       }
//       if (err) return done(err);
//       done();
//     });
//   })
// })
//
// describe('GET /stream-static-small-chunks', function() {
//   it('respond with inserted script', function(done) {
//     request(app)
//       .get('/stream-static-small-chunks')
//       .set('Accept', 'text/html')
//       .expect(200)
//     .end(function(err, res) {
//       var match = res.text.match(/35729\/livereload.js/);
//       console.log("small stuff", res.text);
//       assert(match);
//       if (match) {
//         assert.equal(match.length, 1);
//       }
//       if (err) return done(err);
//       done();
//     });
//   })
// })
