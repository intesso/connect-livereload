
var http = require('http');
var app = http.createServer(function (req, res) {
  var html = '<html><head></head><body><p>default test </p></body></html>';

  (require('../index.js')({
    port: 35730,
    excludeList: ['.woff', '.js', '.css', '.ico']
  }))( req, res, function(){

    //grunt-connect-proxy module write headers to test
    res.setHeader( 'content-length',html.length );
    res.writeHead( 200 );

    res.end( html );
  });

}).listen(3000, '127.0.0.1');


// run the tests
var request = require('supertest');
var assert = require('assert');

function hasScript(html) {
  return (~html.indexOf('livereload.js?snipver=1'));
}


describe('GET /default-test', function(){
  it('respond with inserted script', function(done){

    var req = http.request({

      method: 'GET',
      host:"localhost",
      port:3000,
      path:"/default-test",
      headers:{accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"}

    },function( res ){

      var data = "";

      res.setEncoding('utf8');

      res.on( "data", function( str ){
        data = data + str;
      });

      res.on( "end", function(){
        assert( hasScript( data ) );
        assert( ~data.indexOf(':35730/livereload.js') );
        done();
      });
    });

    req.on('error', function(e) {
      assert(false, 'problem with request: ' + e.message);
    });

    req.end();
  })
})


