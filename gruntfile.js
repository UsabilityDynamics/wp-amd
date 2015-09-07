/**
 * Build Plugin
 *
 * @author potanin@UD
 * @version 1.1.2
 * @param grunt
 */
module.exports = function build( grunt ) {

  // Automatically Load Tasks.
  require( 'load-grunt-tasks' )( grunt, {
    pattern: 'grunt-*',
    config: './package.json',
    scope: 'devDependencies'
  });

  grunt.initConfig( {

    package: grunt.file.readJSON( 'composer.json' ),

    // Locale.
    pot: {
      options:{
        package_name: 'wp-amd',
        package_version: '<%= package.version %>',
        text_domain: 'wp-amd',
        dest: 'static/languages/',
        keywords: [ 'gettext', 'ngettext:1,2' ]
      },
      files:{
        src:  [ '**/*.php', 'lib/*.php' ],
        expand: true
      }
    },
    
    // Documentation.
    yuidoc: {
      compile: {
        name: '<%= package.name %>',
        description: '<%= package.description %>',
        version: '<%= package.version %>',
        url: '<%= package.homepage %>',
        options: {
          paths: 'lib',
          outdir: 'static/codex/'
        }
      }
    },

    // Compile LESS in app.css
    less: {
      production: {
        options: {
          yuicompress: true,
          relativeUrls: true
        },
        files: {
          'static/styles/wp-amd.css': [ 'static/styles/src/wp-amd.less' ],
          'static/styles/wp.amd.editor.style.css': [ 'static/styles/src/wp.amd.editor.style.less' ]
        }
      },
      development: {
        options: {
          relativeUrls: true
        },
        files: {
          'static/styles/wp-amd.dev.css': [ 'static/styles/src/wp-amd.less' ]
        }
      }
    },

    watch: {
      options: {
        interval: 100,
        debounceDelay: 500
      },
      less: {
        files: [
          'static/styles/src/*.*'
        ],
        tasks: [ 'less' ]
      },
      js: {
        files: [
          'static/scripts/src/*.*'
        ],
        tasks: [ 'uglify' ]
      }
    },

    uglify: {
      production: {
        options: {
          mangle: false,
          beautify: false
        },
        files: [
          {
            expand: true,
            cwd: 'static/scripts/src',
            src: [ '*.js' ],
            dest: 'static/scripts'
          }
        ]
      },
      staging: {
        options: {
          mangle: false,
          beautify: true
        },
        files: [
          {
            expand: true,
            cwd: 'static/scripts/src',
            src: [ '*.js' ],
            dest: 'static/scripts'
          }
        ]
      }
    },

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

    clean: {
      all: [
        "composer.lock"
      ]
    },

    shell: {
      /**
       * Make Production Build and create new tag ( release ) on Github.
       */
      release: {
        command: function( tag ) {
          return [
            'sh build.sh ' + tag
          ].join( ' && ' );
        },
        options: {
          encoding: 'utf8',
          stderr: true,
          stdout: true
        }
      },
      /**
       * Runs PHPUnit test, creates code coverage and sends it to Scrutinizer
       */
      coverageScrutinizer: {
        command: [
          'grunt phpunit:circleci --coverage-clover=coverage.clover',
          'wget https://scrutinizer-ci.com/ocular.phar',
          'php ocular.phar code-coverage:upload --format=php-clover coverage.clover'
        ].join( ' && ' ),
        options: {
          encoding: 'utf8',
          stderr: true,
          stdout: true
        }
      },
      /**
       * Runs PHPUnit test, creates code coverage and sends it to Code Climate
       */
      coverageCodeClimate: {
        command: [
          'grunt phpunit:circleci --coverage-clover build/logs/clover.xml',
          'CODECLIMATE_REPO_TOKEN='+ process.env.CODECLIMATE_REPO_TOKEN + ' ./vendor/bin/test-reporter'
        ].join( ' && ' ),
        options: {
          encoding: 'utf8',
          stderr: true,
          stdout: true
        }
      },
      update: {
        options: {
          stdout: true
        },
        command: 'composer update --prefer-source'
      }
    },
    
    // Runs PHPUnit Tests
    phpunit: {
      classes: {},
      options: {
        bin: './vendor/bin/phpunit'
      },
      local: {
        configuration: './test/php/phpunit.xml'
      },
      circleci: {
        configuration: './test/php/phpunit-circle.xml'
      }
    }

  });

  // Register tasks
  grunt.registerTask( 'default', [ 'markdown', 'less' , 'yuidoc', 'uglify' ] );
  
  // Update Environment
  grunt.registerTask( 'update', [ "clean", "shell:update" ] );

  // Install for development.
  grunt.registerTask( 'install', [ 'pot', 'default' ] );

  // Build Distribution.
  grunt.registerTask( 'build', [ 'pot', 'default' ] );

  // Run coverage tests
  grunt.registerTask( 'testscrutinizer', [ 'shell:coverageScrutinizer' ] );
  grunt.registerTask( 'testcodeclimate', [ 'shell:coverageCodeClimate' ] );
  
  grunt.registerTask( 'localtest', [ 'phpunit:local' ] );

  // Make Production release and create new tag ( release ) on Github.
  grunt.registerTask( 'release', 'Run all my release tasks.', function( tag ) {
    if ( tag == null ) grunt.warn( 'Release tag must be specified, like release:1.0.0' );
    grunt.task.run( 'shell:release:' + tag );
  });

};
