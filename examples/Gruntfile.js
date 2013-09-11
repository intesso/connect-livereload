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
      port: 35729,
      liveReload: {},
      proxy: {
        host: "localhost",
        port: 8080
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-reload");

  grunt.registerTask("default", ["reload", "watch"]);
};