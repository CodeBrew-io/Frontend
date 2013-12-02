// Generated on 2013-09-29 using generator-angular 0.4.0
'use strict';
var LIVERELOAD_PORT = 35728;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
  var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['copy:styles', 'autoprefixer']
      },
      less: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.less'],
        tasks: ['less:dev']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    autoprefixer: {
      options: ['last 1 version'],
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    connect: {
      options: {
        port: 9002,
        hostname: 'localhost'
      },
      rules: [
        {from: "^/c/(.*)$", to: "$1"},
        {from: "^/bower_components/(.*)$", to: "/bower_components/$1"},
        {from: "^/scripts/(.*)$", to: "/scripts/$1"},
        {from: "^/styles/(.*)$", to: "/styles/$1"},
        {from: "^/views/(.*)$", to: "/views/$1"},
        {from: "^/([a-bd-zA-BD-Z_\-])([a-zA-Z_\-]*)/([0-9a-zA-Z_\-]*)$", to: "/index.html"}
      ],
      proxies: [{
        context: ['/webjars', '/assets', '/user', '/login', '/logout', '/authenticate', '/not-authorized','/snippets', '/@evolutions'],
        port: 9000,
        host: 'localhost'
      }],
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              proxySnippet,
              rewriteRulesSnippet,
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          } 
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>/masgui/3JLZwuoqQROHc4DlnoliIQ'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true, 
          cwd: '<%= yeoman.app %>',
          src: 'index.html', 
          dest: '<%= yeoman.dist %>'
        },{
          expand: true, 
          cwd: '<%= yeoman.app %>/views/',
          src: ['**'], 
          dest: '<%= yeoman.dist %>/views/'
        },{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.{gif,webp}',
            'styles/fonts/*'
          ]
        }, {
          expand: true, 
          cwd: '<%= yeoman.app %>/images/',
          src: ['**'], 
          dest: '<%= yeoman.dist %>/images/'
        }, {
          expand: true, 
          cwd: '<%= yeoman.app %>/bower_components/font-awesome/fonts/', 
          src: ['**'], 
          dest: '<%= yeoman.dist %>/fonts/'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    concurrent: {
      server: [
        'less:dev',
        'copy:styles'
      ],
      test: [
        'less:dev',
        'copy:styles'
      ],
      dist: [
        'less:dist',
        'copy:styles'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/scripts',
          src: '*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    less: {
      dev: {
        files: {
          '.tmp/styles/main.css': [
            '<%= yeoman.app %>/styles/main.less'
          ] 
        }
      },
      dist : {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '<%= yeoman.app %>/styles/main.less'
          ] 
        }
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'configureProxies',
      'configureRewriteRules',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'copy:dist',
    'ngmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};
