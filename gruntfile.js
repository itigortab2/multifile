module.exports = function(grunt) {
  
  grunt.initConfig ({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      docs: {
        options:{/*outputStyle: 'compressed'*/ /* cssmin will do this for us */},
        files: {'docs.css' : 'docs/docs.scss'}
      },
    },
    
    // ---------------------

    cssmin: {
      docs: {
        options: {
          expand: false,
          processImport: true,
          banner: '/* <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */',
        },
        files: {'docs.css': ["docs.css"]}
      }
    },
    
    // ---------------------

    jade: {
      docs: {
        options: {
          data: {
            debug: false,
            timestamp: "<%= new Date().getTime() %>"
          }
        },
        files: {"docs.html": ["docs/docs.jade"]}
      }
    },
    
    // ---------------------

    uglify: {
      options: {
        banner: '/* <%= pkg.name %> v<%= pkg.version %> @ <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */',
        compress: true /*{drop_console: true}*/,
        mangle: true /*{except: ['jQuery','fwx']}*/
      },
      dist: {
        options: {},
        files: {'jQuery.MultiFile.min.js': 'jQuery.MultiFile.js'}
      }
    },
    
    // ---------------------
    
    shell: {
      beep_twice: {
        command: 'echo  echo ',
        options: {stdout: true}
      }
    },
    
    // ---------------------
    
    gitcommit: {
      task: {
        options: { message: 'Auto commit <%= pkg.name %> v<%= pkg.version %> @ <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %>' },
        files: { src: ['test.txt'] }
      }
    },

    // ---------------------

    watch: {
      options:{
        reload: true
      },
      jade: { files: ['docs/**/*.jade','docs/*.html'], tasks: ['jade:docs','beep'], options: {} },
      scss: { files: ['docs/*.scss'], tasks: ['sass:docs','beep'], options: {} },
      css: { files: ['*.css'], tasks: ['cssmin:docs','beep'], options: {} },
      js: { files: ['jquery.MultiFile.js'], tasks: ['uglify:dist','beep'], options: {} }
    }
  });

  // ---------------------
  
  // Load required plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-shell');

  // ---------------------
  
  // Register common tasks and aliases
  grunt.registerTask('default', ['uglify:dist']);
  grunt.registerTask('build', ['uglify:dist']);
  grunt.registerTask('min', ['uglify:dist']);
  grunt.registerTask('css', ['sass:docs','cssmin:docs']);
  grunt.registerTask('doc', ['jade:docs','sass:docs','cssmin:docs']);
  grunt.registerTask('all', ['uglify:dist','jade:docs','sass:docs','cssmin:docs']);
  grunt.registerTask('beep', ['shell:beep_twice']);
  grunt.registerTask('deploy', ['gitpush']);

  // ---------------------
  
  // Custom test tasks
  grunt.registerTask('test', function() {
    grunt.log.write('Unit tests will go here'+'\n').ok();
  });

  // ---------------------
  
  // Watch for file changes and run tasks automatically
  grunt.event.on('watch', function(action, filepath, target) {
    //grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  // ---------------------
  
};