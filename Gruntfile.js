'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        xtPkg: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            dist: 'dist',
            hostName: 'localhost'
        },

        sass: {
            dist: {
                options: {
                    debugInfo: false,
                    trace: true
                },
                files: {
                    '.tmp/styles/main.css': '<%= xtPkg.app %>/styles/main.scss'
                }
            }
        },
		
		includes: {
		  build: {
			cwd: '<%= xtPkg.app %>/templates',
			src: [ '*.html' ],
			dest: '<%= xtPkg.app %>',
			options: {
			  flatten: true,
			  includePath: '<%= xtPkg.app %>/templates'
			}
		  }
		},

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= xtPkg.app %>/scripts/*.js'],
                //tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['<%= xtPkg.app %>/styles/*.{scss,sass}'],
                tasks: ['sass:dist', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
			htmlfile: {
                files: ['<%= xtPkg.app %>/templates/*.html'],
				tasks: ['includes:build']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= xtPkg.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= xtPkg.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                hostname: '<%= xtPkg.hostName %>',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= xtPkg.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= xtPkg.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                force: true,
                //reporterOutput: 'logger/jshint.html',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= xtPkg.app %>/scripts/*.js'
            ]
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    force: true,
                    src: [
                        '.tmp',
                        '<%= xtPkg.dist %>/*',
                        '!<%= xtPkg.dist %>/.git*'
                    ]
                }]
            },
            server: ['.tmp', '<%= xtPkg.app %>/scripts/main.js']
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        bowerInstall: {
            target: {
                src: ['<%= xtPkg.app %>/index.html'],
                ignorePath: '<%= xtPkg.app %>/'
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= xtPkg.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= xtPkg.app %>/images',
                javascriptsDir: '<%= xtPkg.app %>/scripts',
                fontsDir: '<%= xtPkg.app %>/styles/fonts',
                importPath: '<%= xtPkg.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= xtPkg.dist %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: false,
                    sourcemap: true
                }
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= xtPkg.dist %>/scripts/{,*/}*.js',
                        '<%= xtPkg.dist %>/styles/{,*/}*.css',
                        //'<%= xtPkg.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= xtPkg.dist %>/styles/fonts/*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= xtPkg.app %>/index.html',
            options: {
                dest: '<%= xtPkg.dist %>'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= xtPkg.dist %>/{,*/}*.html'],
            css: ['<%= xtPkg.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= xtPkg.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= xtPkg.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= xtPkg.dist %>/images'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= xtPkg.dist %>',
                    src: ['*.html', '*.html', ],
                    dest: '<%= xtPkg.dist %>'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= xtPkg.app %>',
                    dest: '<%= xtPkg.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'modules/{,**/}*.html',
                        'modules/*.json',
                        'data/{,**/}*.json',
                        'bower_components/**/*',
                        'images/{,*/}*.{webp}',
                        'fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= xtPkg.dist %>/images',
                    src: ['generated/*']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= xtPkg.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'sass:dist'
            ],
            test: [
                'sass'
            ],
            dist: [
                'sass:dist',
                'imagemin',
                //'svgmin'
            ]
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= xtPkg.dist %>/styles',
                    ext: '.css'
                }]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= xtPkg.app %>/scripts/main.js': [
                        '<%= xtPkg.app %>/scripts/*.js'
                    ]
                },
				build: {
					files: {
					  '<%= xtPkg.app %>/scripts/main.js': ['<%= xtPkg.app %>/scripts/*.js']
					}
				}
            }
        },
        concat: {
            dist: {}
        },       
        scsslint: {
            allFiles: [
                '<%= xtPkg.app %>/styles/*.scss',
            ],
            options: {
                config: 'lint.yml',
                reporterOutput: 'scss-lint-report.xml',
                colorizeOutput: true,
                force: true,
                maxBuffer: 30000 * 1024,
                compact: true
            }
        }
    });

	grunt.loadNpmTasks('grunt-includes');
    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
			'includes',
            //'bowerInstall',
            'concurrent:server',
            'autoprefixer',
			'uglify',
            'configureProxies:server',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        //'bowerInstall',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'copy:dist',
        'scsslint',
        'cssmin',
        'uglify',
        // 'rev',
        'usemin',
        'htmlmin',
        'newer:jshint'
    ]);

    grunt.registerTask('docs', [
        'clean:docs'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        //'test',
        'build'
    ]);
};
