var isBinary = require('isbinaryfile');

module.exports = function livereload(opt) {
  // options
  var opt = opt || {};
  var ignore = opt.ignore || opt.excludeList ||
    [/\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/, /\.woff(\?.*)?$/, /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/];
  var include = opt.include || [/.*/];
  var html = opt.html || _html;
  var rules = opt.rules || [{
    match: /<\/body>(?![\s\S]*<\/body>)/i,
    fn: prepend
  }, {
    match: /<\/html>(?![\s\S]*<\/html>)/i,
    fn: prepend
  }, {
    match: /<\!DOCTYPE.+?>/i,
    fn: append
  }];
  var disableCompression = opt.disableCompression || false;
  var hostname = opt.hostname || 'localhost';
  var port = opt.port || 35729;
  var src = opt.src || "//' + (location.hostname || '" + hostname + "') + ':" + port + "/livereload.js?snipver=1";
  var snippet = "\n<script>//<![CDATA[\ndocument.write('<script src=\"" + src + "\"><\\/script>')\n//]]></script>\n";

  // helper functions
  var regex = (function() {
    var matches = rules.map(function(item) {
      return item.match.source;
    }).join('|');

    return new RegExp(matches);
  })();

  function prepend(w, s) {
    return s + w;
  }

  function append(w, s) {
    return w + s;
  }

  function _html(str) {
    if (!str) return false;
    return /<[:_-\w\s\!\/\=\"\']+>/i.test(str);
  }

  function exists(body) {
    if (!body) return false;
    return regex.test(body);
  }

  function snip(body) {
    if (!body) return false;
    return (~body.lastIndexOf("/livereload.js"));
  }

  function snap(body) {
    var _body = body;
    rules.some(function(rule) {
      if (rule.match.test(body)) {
        _body = body.replace(rule.match, function(w) {
          return rule.fn(w, snippet);
        });
        return true;
      }
      return false;
    });
    return _body;
  }

  function accept(req) {
    var ha = req.headers["accept"];
    if (!ha) return false;
    return (~ha.indexOf("html"));
  }

  function check(str, arr) {
   if (!str) return true;
    return arr.some(function(item) {
      if ( (item.test && item.test(str) ) || ~str.indexOf(item)) return true;
      return false;
    });
  }

  // middleware
  return function livereload(req, res, next) {
    if (res._livereload) return next();
    res._livereload = true;

    // store original functions
    var writeHead = res.writeHead;
    var write = res.write;
    var end = res.end;

    if (!accept(req) || !check(req.url, include) || check(req.url, ignore)) {
      return next();
    }

    // Disable G-Zip to enable proper inspecting of HTML
    if (disableCompression) {
      req.headers['accept-encoding'] = 'identity';
    }

    res.push = function(string) {
      res.data = (res.data || '') + string;
    };

    // proxy functions
    res.inject = res.write = function(chunk, encoding) {
      if (chunk) {
        var buf = "string" == typeof chunk ? new Buffer(chunk, encoding) : chunk;
        res._isBinary = typeof res._isBinary == 'undefined' ? isBinary(buf, buf.length) : res._isBinary;
        if (res._isBinary) {
          return write.apply(res, arguments);
        }
        var string = chunk instanceof Buffer ? chunk.toString(encoding) : chunk;
        if (exists(string) && !snip(res.data)) {
          res.push(snap(string));
        } else {
          res.push(string);
        }
      }
      return true;
    };

    res.writeHead = function() {
      var headers = arguments[arguments.length - 1];
      if (headers && typeof headers === 'object') {
        for (var name in headers) {
          if (/content-length/i.test(name)) {
            delete headers[name];
          }
        }
      }
      var header = res.getHeader( 'content-length' );
      if ( header ) res.removeHeader( 'content-length' );

      writeHead.apply(res, arguments);
    };

    res.end = function(chunk, encoding) {
      if (chunk && chunk.length && chunk.length > 0) res.inject(chunk, encoding);
      if (res._isBinary) return end.apply(res, arguments);
      if (html(res.data) && exists(res.data) && !snip(res.data)) res.data = snap(res.data);
      if (res.data !== undefined && !res._header) res.setHeader('content-length', Buffer.byteLength(res.data, encoding));

      end.call(res, res.data, encoding);
    };

    next();
  };

}
