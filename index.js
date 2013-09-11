module.exports = function livereload(opt) {
  var opt = opt || {};
  var ignore = opt.ignore || opt.excludeList || ['.woff', '.js', '.css', '.ico'];
  var html = opt.html || _html;
  var rules = opt.rules || [{
    match: /<\/body>/,
    fn: prepend
  }, {
    match: /<\/html>/,
    fn: prepend
  }, {
    match: /\<\!DOCTYPE.+\>/,
    fn: append
  }];
  var port = opt.port || 35729;
  var src = opt.src || "' + (location.protocol || 'http:') + '//' + (location.hostname || 'localhost') + ':" + port + "/livereload.js?snipver=1'";
  var snippet = "\n<script type=\"text/javascript\">document.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')</script>\n";

  var regex = (function() {
    var matches = rules.map(function(item) {
      return item.match.source;
    }).join('|');

    return new RegExp(matches);
  })();

  function prepend(w) {
    return snippet + w;
  }

  function append(w) {
    return w + snippet;
  }

  function _html(str) {
    return /<\!*[a-z][\s\S]*>/i.test(str);
  }

  function deal(body) {
    return combined.test(body);
  }

  function exists(body) {
    if (!body) return false;
    return regex.test(body);
  }

  function snip(body) {
    if (!body) return true;
    return (~body.lastIndexOf("/livereload.js"));
  }

  function snap(body) {
    var _body = body;
    rules.some(function(rule) {
      if (rule.match.test(body)) {
        _body = body.replace(rule.match, rule.fn);
        return true;
      }
      return false;
    })
    return _body;
  }

  function accept(req) {
    var ha = req.headers["accept"];
    if (!ha) return false;
    return (~ha.indexOf("html"));
  }

  function leave(req) {
    var url = req.url;
    var ignored = false;
    if (!url) return true;
    ignore.forEach(function(item) {
      if (~url.indexOf(item)) {
        ignored = true;
      }
    });
    return ignored;
  }

  return function livereload(req, res, next) {
    var writeHead = res.writeHead;
    var write = res.write;
    var end = res.end;

    if (!accept(req) || leave(req)) {
      return next();
    }

    res.push = function(chunk) {
      res.data = (res.data || '') + chunk;
    };

    res.inject = res.write = function(string, encoding) {
      if (string !== undefined) {
        var body = string instanceof Buffer ? string.toString(encoding) : string;
        if (exists(body) && !snip(body)) {
          res.push(snap(body));
          return true;
        } else if (html(body) || (res.data && html(res.data))) {
          res.push(body);
          return true;
        } else {
          return res.write(string, encoding);
        }
      }
      return true;
    };

    res.end = function(string, encoding) {
      res.writeHead = writeHead;
      res.end = end;
      var result = res.inject(string, encoding);
      if (!result) return res.end(string, encoding);
      if (res.data !== undefined && !res._header) res.setHeader('content-length', Buffer.byteLength(res.data, encoding));
      res.end(res.data, encoding);
    };
    next();
  };

}