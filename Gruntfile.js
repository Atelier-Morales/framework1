module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var _ = require('underscore');
  
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {                              // Task
        dist: {                          // Target
          options: {                       // Target options
            style: 'expanded'
          },
          files: {                         // Dictionary of files
            'css/style.css': 'sass/style.scss'       // 'destination': 'source'
          }
        }
    },
    watch: {
      scss : {
	      files: ['sass/*.scss'],
	      tasks: ['sass'],
      }
    },
    browserSync: {
        dev: {
            bsFiles: {
                src : [
                    'css/*.css',
                    'index.html',
                    'templates/*.html'
                ]
            },
            options: {
                watchTask: true,
                server: '.'
            }
        }
    }
  });
    
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');    
  grunt.loadNpmTasks('grunt-browser-sync');
    
  grunt.registerTask('default', [
    'browserSync',
    'watch'
  ]);
};