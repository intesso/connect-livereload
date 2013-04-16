connect-livereload
==================
connect middleware for adding the livereload script to the response.
no browser plugin is needed.
if you are happy with a browser plugin, then you don't need this middleware.

Usage
=====
this middleware can be used with a LiveReload server e.g. [grunt-reload](https://github.com/webxl/grunt-reload).

In your connect or express application add this after the static and before the dynamic routes:
```javascript
  var port = 35729;
  app.use(require('connect-livereload')(port));
```

please see the [examples](https://github.com/intesso/connect-livereload/tree/master/examples) for the app and Grunt configuration.

Alternative
===========
An alternative would be to install the [LiveReload browser plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei).


Credits
=======
* The middleware code is mainly extracted from: [grunt-contrib-livereload/util.js](https://github.com/gruntjs/grunt-contrib-livereload/blob/master/lib/utils.js)
* [LiveReload Creator](http://livereload.com/)


License
=======
[MIT License](https://github.com/intesso/connect-livereload/blob/master/LICENSE)
