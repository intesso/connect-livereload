module.exports = function liveReload(opt) {
  var opt = opt || {};
  var port = opt.port || 35729;
  var excludeList = opt.excludeList || [".woff", ".js", ".css", ".ico"];

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

  function acceptsHtmlExplicit(req) {
    var accept = req.headers["accept"];
    if (!accept) return false;
    return (~accept.indexOf("html"));
  }

  function isExcluded(req) {
    var url = req.url;
    var excluded = false;
    if (!url) return true;
    excludeList.forEach(function(exclude) {
      if (~url.indexOf(exclude)) {
        excluded = true;
      }
    });
    return excluded;
  }

  return function(req, res, next) {
    var writeHead = res.writeHead;
    var end = res.end;

    if (!acceptsHtmlExplicit(req) || isExcluded(req)) {
      return next();
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
      return false;
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
      }
      end.call(res,res.data,encoding); // finish the response
    };

    next();
  };

}
