var settings = require("./settings");
var port = settings.webserver.port || 3000;
var liveReloadPort = settings.liveReload.port || 35729;

module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      all: {
        files: ["app/views/**/*", "app/styles/**/*", "vendor/**/*", "public/img/**/*", "app/client/**/*"],
        tasks: ["default"],
        options: {
          nospawn: true,
          interrupt: false,
          debounceDelay: 250
        }
      }
    },
    reload: {
      port: liveReloadPort,
      liveReload: {},
      proxy: {
        host: "localhost",
        port: port
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-reload");

  grunt.registerTask("default", ["reload", "watch"]);
};