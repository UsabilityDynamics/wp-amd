/**
 * Build WP-Site
 *
 * @author potanin@UD
 * @version 2.0.0
 * @param grunt
 */
module.exports = function( grunt ) {

  // Automatically Load Tasks
  require( 'load-grunt-tasks' )( grunt, {
    pattern: 'grunt-*',
    config: './package.json',
    scope: 'devDependencies'
  } );

  // Build Configuration.
  grunt.initConfig({

    // Runtime Meta.
    job: {
      build: process.env.CIRCLE_BUILD_NUM,
      artifacts: process.env.CIRCLE_ARTIFACTS,
      branch: process.env.CIRCLE_BRANCH
    },

    // Get Project Package.
    composer: grunt.file.readJSON( 'composer.json' ),

    // Visual Regression.
    phantomcss: {
      options: {
        logLevel: 'warning'
      },
      desktop: {
        options: {
          screenshots: 'application/tests/visual/original/desktop',
          results: 'application/static/screenshots/desktop',
          viewportSize: [1024, 768]
        },
        src: [
          'application/tests/visual/*.js'
        ]
      },
      mobile: {
        options: {
          screenshots: 'application/tests/visual/original/mobile',
          results: 'application/static/screenshots/mobile',
          viewportSize: [450, 600]
        },
        src: [
          'application/tests/visual/*.js'
        ]
      }
    },

    // Generate YUIDoc documentation.
    yuidoc: {
      compile: {
        name: '<%= composer.name %>',
        description: '<%= composer.description %>',
        url: '<%= composer.homepage %>',
        version: '<%= composer.version %>',
        options: {
          paths: [
            'application',
            'vendor/plugins',
            'vendor/libraries/usabilitydynamics',
            'vendor/themes',
            'vendor/modules'
          ],
          outdir: 'application/static/codex/'
        }
      }
    },

    // Generate Markdown Documentation.
    markdown: {
      all: {
        files: [
          {
            expand: true,
            src: 'readme.md',
            dest: 'application/static',
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

    // Clean Directories.
    clean: {
      files: [
        '.environment',
        '.htaccess',
        'advanced-cache.php',
        'db.php',
        'object-cache.php',
        'sunrise.php',
        'vendor/libraries/automattic/wordpress/wp-config.php',
        'wp-cli.yml'
      ],
      symlinks: [
        '.htaccess',
        'advanced-cache.php',
        'db.php',
        'object-cache.php',
        'sunrise.php',
        'vendor/libraries/automattic/wordpress/wp-config.php',
        'wp-cli.yml'
      ],
      junk: [
        'cgi-bin',
        'uploads'
      ],
      test: []
    },

    // Build Our Less Assets
    less: {
      development: {
        options: {
          paths: [
            'application/static/styles/src'
          ],
          relativeUrls: true
        },
        files: {
          'application/static/styles/app.css' : [
            'application/static/styles/src/app.less'
          ]
        }
      },
      production : {
        options : {
          compress: true,
          yuicompress: true,
          relativeUrls: true,
          paths: [
            'application/static/styles/src'
          ],
        },
        files: {
          'application/static/styles/app.css' : [
            'application/static/styles/src/app.less'
          ]
        }
      }
    },

    // Build our JavaScript Assets
    requirejs: {
      production: {
        options: {
          "name": "app",
          "out": "application/static/scripts/app.js",
          "baseUrl": "application/static/scripts/src",
          "paths": {
          },
          "map": {
          },
          uglify : {
            max_line_length: 1000,
            no_mangle: true
          }
        }
      }
    },

    // Symbolic Links.
    symlink: {
      standalone: {
        files: {
          '.htaccess': 'vendor/modules/wp-veneer/lib/local/.htaccess',
          'vendor/libraries/automattic/wordpress/wp-config.php': 'vendor/modules/wp-veneer/lib/class-config.php'
        }
      },
      network: {
        files: {
          '.htaccess': 'vendor/modules/wp-veneer/lib/local/.htaccess',
          'vendor/libraries/automattic/wordpress/wp-config.php': 'vendor/modules/wp-veneer/lib/class-config.php',
          'sunrise.php': 'vendor/modules/wp-cluster/lib/class-sunrise.php'
        }
      },
      cluster: {
        files: {
          '.htaccess': 'vendor/modules/wp-veneer/lib/local/.htaccess',
          'vendor/libraries/automattic/wordpress/wp-config.php': 'vendor/modules/wp-veneer/lib/class-config.php',
          'db.php': 'vendor/modules/wp-cluster/lib/class-database.php',
          'sunrise.php': 'vendor/modules/wp-cluster/lib/class-sunrise.php'
        }
      },
      production: {
        files: {
          'wp-cli.yml': 'application/static/etc/wp-cli.yml',
          'advanced-cache.php': 'vendor/modules/wp-veneer/lib/class-advanced-cache.php',
          'object-cache.php': 'vendor/modules/wp-veneer/lib/class-object-cache.php'
        }
      },
      development: {
        files: {
          'wp-cli.yml': 'application/static/etc/wp-cli.yml'
        }
      },
      staging: {},
      local: {}
    },

    // Copying files (for Windows)
    copy: {
      standalone: {
        files: {
          '.htaccess': 'vendor/modules/wp-veneer/lib/local/.htaccess',
          'vendor/libraries/automattic/wordpress/wp-config.php': 'vendor/modules/wp-veneer/lib/class-config.php'
        }
      },
      network: {
        files: {
          '.htaccess': 'vendor/modules/wp-veneer/lib/local/.htaccess',
          'vendor/libraries/automattic/wordpress/wp-config.php': 'vendor/modules/wp-veneer/lib/class-config.php',
          'sunrise.php': 'vendor/modules/wp-cluster/lib/class-sunrise.php'
        }
      },
      cluster: {
        files: {
          '.htaccess': 'vendor/modules/wp-veneer/lib/local/.htaccess',
          'vendor/libraries/automattic/wordpress/wp-config.php': 'vendor/modules/wp-veneer/lib/class-config.php',
          'db.php': 'vendor/modules/wp-cluster/lib/class-database.php',
          'sunrise.php': 'vendor/modules/wp-cluster/lib/class-sunrise.php',
        }
      },
      production: {
        files: {
          'advanced-cache.php': 'vendor/modules/wp-veneer/lib/class-advanced-cache.php',
          'object-cache.php': 'vendor/modules/wp-veneer/lib/class-object-cache.php'
        }
      },
      development: {
        files: {
          'wp-cli.yml': 'application/static/etc/wp-cli.yml'
        }
      },
      staging: {},
      local: {}
    },

    // Shell commands
    shell: {
      // This just configures the environment file
      configure: {
        options: {
          stdout: true
        },
        command: function( environment ){
          var cmd = 'echo ' + environment + ' > ./.environment';
          grunt.log.writeln( 'Running command: ' + cmd );
          return cmd;
        }
      }
    },

    // Server Mocha Tests.
    mochaTest: {
      test: {
        options: {
          ui: 'exports',
          timeout: 'exports',
          require: [
            'should',
            'request'
          ],
          reporter: 'list'
        },
        src: [
        ]
      },
      audit: {
        options: {
          ui: 'exports',
          timeout: 'exports',
          require: [
            'should',
            'request'
          ],
          reporter: 'list'
        },
        src: [
        ]
      }
    },

    // Notifications
    notify: {
      options: {
        title: "WP-Site Notifications",
        enabled: true,
        max_jshint_notifications: 5
      },
      pluginsInstalling: {
        options: {
          title: 'WP-Site',
          message: 'Starting to install plugins.'
        }
      },
      pluginsInstalled: {
        options: {
          title: 'WP-Site',
          message: 'All plugins have been installed.'
        }
      },
      watch: {
        options: {
          title: 'WP-Site: Task Complete',
          message: 'LESS and Uglify finished running'
        }
      },
      testSuccess: {
        options: {
          title: 'WP-Site: Tests',
          message: 'Tests completed, no issues.'
        }
      },
      audit: {
        options: {
          title: 'WP-Site: Audits',
          message: 'Audits completed, no issues.'
        }
      }
    }

  } );

  // Pull in some NPM based tasks
  grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-less' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-yuidoc' );

  // Automatically Load Tasks from application/tasks directory
  grunt.task.loadTasks( 'application/tasks' );

};