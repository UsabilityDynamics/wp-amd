/**
 * Build Theme
 *
 * @author Usability Dynamics
 * @version 0.1.0
 * @param grunt
 */
module.exports = function( grunt ) {

  // Automatically Load Tasks.
  require( 'load-grunt-tasks' )( grunt, {
    pattern: 'grunt-*',
    config: './package.json',
    scope: 'devDependencies'
  });
  
  grunt.initConfig({

    // LESS Compilation.
    pkg: grunt.file.readJSON( 'composer.json' ),

    // Compress PNG Files.
    tinypng: {
      options: {
        apiKey: "D3_kNVgKtPXTkfpx6X9SDZ5XTGch9vu_",
        showProgress: true,
        stopOnImageError: true
      },
      production: {
        expand: true,
        cwd: 'images/src',
        src: [ '*.png' ],
        dest: 'images',
        ext: '.png'
      }
    },

    // Generate Sprite.
    sprite:{

      all: {
        src: 'images/src/*.png',
        destImg: 'images/sprite.png',
        destCSS: 'styles/src/sprites.less',
        engine: 'canvas',
        cssFormat: 'less'
      }
    },

    // LESS Compilation.
    less: {
      'production': {
        options: {
          yuicompress: true,
          relativeUrls: true
        },
        files: {
          'styles/app-main.css': [ 'styles/src/app-main.less' ],
          'styles/app-bootstrap.css': [ 'styles/src/app-bootstrap.less' ],
          'styles/default.css': [ 'styles/src/colors/default.less' ],
          'styles/editor-style.css': [ 'styles/src/editor-style.less' ]
        }
      }
    },

    // Run Mocha Tests.
    mochacli: {
      options: {
        require: [ 'should' ],
        reporter: 'list',
        ui: 'exports'
      },
      all: [ 'test/*.js' ]
    },

    // Minify all JS Files.
    uglify: {
      production: {
        options: {
          preserveComments: false,
          wrap: false
        },
        files: [
          {
            expand: true,
            cwd: 'scripts/src',
            src: [ '*.js' ],
            dest: 'scripts'
          }
        ]
      }
    },

    // Require JS Tasks.
    requirejs: {
      main: {
        options: {
          baseUrl: "scripts/src",
          skipModuleInsertion: true,
          locale: "en-us",
          optimize: 'none',
          uglify: {
            toplevel: true,
            ascii_only: true,
            beautify: true,
            max_line_length: 1000,
            defines: {
              DEBUG: ['name', 'false']
            },
            no_mangle: true
          },
          include: [
            'app.main',
            'countdown',
            'modules/html.picture',
            'modules/html.video',
            'modules/banner.poster'
          ],
          out: "scripts/app.main.js"
        }
      },
      foobox: {
        options: {
          name: 'foobox',
          paths: {
            "foobox": "scripts/src/foobox.dev"
          },
          include: [ 'foobox' ],
          out: 'scripts/utility/foobox.js',
          skipModuleInsertion: true,
          wrap: {
            start: "define( function(require, exports, module) {",
            end: "});"
          }
        }
      }
    },

    // Monitor.
    watch: {
      options: {
        interval: 1000,
        debounceDelay: 500
      },
      styles: {
        files: [
          'gruntfile.js', 'styles/src/*', 'styles/src/colors/*'
        ],
        tasks: [ 'less' ]
      },
      scripts: {
        files: [
          'gruntfile.js',
          'scripts/src/*.js',
          'scripts/src/modules/*.js'
        ],
        tasks: [ 'uglify' ]
      },
      docs: {
        files: [
          'styles/app.*.css', 'composer.json', 'readme.md'
        ],
        tasks: [ 'markdown' ]
      }
    },

    // Markdown Generation.
    markdown: {
      all: {
        files: [
          {
            expand: true,
            src: 'readme.md',
            dest: 'static/',
            ext: '.html'
          }
        ],
        options: {
          markdownOptions: {
            gfm: true,
            codeLines: {
              before: '<span>',
              after: '</span>'
            }
          }
        }
      }
    },

    // Remove Things.
    clean: [
      "vendor"
    ],

    // Documentation
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        logo: 'http://media.usabilitydynamics.com/logo.png',
        options: {
          paths: './',
          outdir: 'static/codex'
        }
      }
    }

  });

  // Build Assets
  grunt.registerTask( 'default', [ 'yuidoc', 'uglify', 'markdown', 'less' ] );

  // Install environment
  grunt.registerTask( 'install', [ 'yuidoc', 'uglify',  'markdown', 'less' ] );

  // Update Environment
  grunt.registerTask( 'update', [ 'yuidoc', 'uglify',  'markdown', 'less' ] );

  // Prepare distribution
  grunt.registerTask( 'dist', [ 'yuidoc', 'uglify',  'markdown', 'less' ] );

  // Update Documentation
  grunt.registerTask( 'doc', [ 'yuidoc', 'markdown' ] );

};