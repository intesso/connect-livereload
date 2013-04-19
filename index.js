module.exports = function liveReload(port) {
  port = port || 35729;

  function getSnippet() {
    /*jshint quotmark:false */
    var snippet = [
      "<!-- livereload script -->",
      "<script type=\"text/javascript\">document.write('<script src=\"http://'",
      " + (location.host || 'localhost').split(':')[0]",
      " + ':" + port + "/livereload.js?snipver=1\" type=\"text/javascript\"><\\/script>')",
      "</script>",
      ""].join('\n');
    return snippet;
  };

  function snippetExists(body) {
    return (~body.lastIndexOf("/livereload.js?snipver=1"));
  }

  return function(req, res, next) {
    var path = require('path');
    var url = require('url');

    var writeHead = res.writeHead;
    var end = res.end;

    var filepath = url.parse(req.url).pathname;
    filepath = filepath.slice(-1) === '/' ? filepath + 'index.html' : filepath;

    if (path.extname(filepath) !== '.html' && res.send === undefined) {
      return next();
    }
    if (req.accepts && !req.accepts('html')) {
      next();
    }

    res.push = function(chunk) {
      res.data = (res.data || '') + chunk;
    };

    // Bypass write until end
    var inject = res.write = function(string, encoding) {
      if (string !== undefined) {
        var body = string instanceof Buffer ? string.toString(encoding) : string;
        if (!snippetExists(body)) {
          res.push(body.replace(/<\/body>/, function(w) {
            return getSnippet() + w;
          }));
        }
      }
      return true;
    };

    // Prevent headers from being finalized
    res.writeHead = function() {};

    // Write everything at the end
    res.end = function(string, encoding) {
      inject(string, encoding);

      // Restore writeHead
      res.writeHead = writeHead;
      if (res.data !== undefined) {
        if (!res._header) {
          res.setHeader('content-length', Buffer.byteLength(res.data, encoding));
        }
        end.call(res, res.data, encoding);
      }
    };

    next();
  };

}