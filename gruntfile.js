'use strict';

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

    grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.name %> by <%= pkg.author.name %> - v<%= pkg.version %> - ' +
		    	'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		    	'* http://<%= pkg.homepage %>/\n' +
		    	'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
		    	'<%= pkg.author.name %>; Licensed MIT */',

		config: {
		   // Configurable paths
		   app: 'app',
		   dist: 'dist'
		},

		bower: {
			install: {
				options: {
					install: true,
					verbose: false,
					cleanTargetDir: true,
					cleanBowerDir: true,
					bowerOptions: {}
				}
			}
		},

		watch: {
			js: {
			   files: ['source/{,*/}*.js'],
			   tasks: ['concat:js'],
			   options: {
			       // livereload: true
			   }
			},
			less: {
				files: ['source/*/*.less'],
				tasks: ['less']
			},       
		},
		concat: {
		   js: {
		       	src: [
		   			'lib/jquery/jquery.js',
		   			'source/{,*/}*.js',
		   			'!<%= config.app %>/scripts/vendor/*'
		   		],
		       	dest: '<%= config.app %>/scripts/lib.js'
		   },
		},
		less: {
		   	dev: {
				files: {
				   '<%= config.app %>/styles/main.css': 'source/styles/main.less'
				}
		   },
		   dist: {
		       options: {
		           compress: true,
		           yuicompress: true,
		           optimization: 2
		       },
		       files: {
		          '<%= config.dist %>/styles/main.css': 'source/styles/main.less'
		       }
		   }
		},

		copy: {
		    dist: {
		        files: [{
		            expand: true,
		            dot: true,
		            cwd: '<%= config.app %>',
		            dest: '<%= config.dist %>',
		            src: [
		                '*.{ico,png,txt}',
		                '.htaccess',
		                'images/{,*/}*.webp',
		                'scripts/*.js',
		                '{,*/}*.html',
		                'styles/fonts/{,*/}*.*'
		            ]
		        }, {
		            src: 'src/svg/timing.json',
		            dest: '<%= config.app %>/svg/timing.json',
		            flatten: true,
		            filter: 'isFile'
		        }, {
		            src: 'src/svg/timing.json',
		            dest: '<%= config.dist %>/svg/timing.json',
		            flatten: true,
		            filter: 'isFile'
		        }]
		    },
		},

		//for build
		clean: {
		    dist: {
		        files: [{
		            dot: true,
		            src: [
		                '.tmp',
		                '<%= config.dist %>/*',
		                '!<%= config.dist %>/.git*'
		            ]
		        }]
		    },
		    server: '.tmp'
		},
		uglify: {
		    dist: {
		        files: [{
		            '<%= config.dist %>/scripts/lib.js': [
		                '<%= config.dist %>/scripts/lib.js'
		            ]
		        }]
		    }
		},

		modernizr: {
		    devFile: 'lib/modernizr/modernizr.js',
		    outputFile: '<%= config.dist %>/scripts/vendor/modernizr.js',
		    files: [
		        '<%= config.dist %>/scripts/{,*/}*.js',
		        '<%= config.dist %>/styles/{,*/}*.css',
		        '!<%= config.dist %>/scripts/vendor/*'
		    ],
		    uglify: true
		},


		usebanner: {
		    options: {
		      position: 'top',
		      banner: '<%= banner %>',
		      linebreak: true
		    },
		    files: {
		      src: ['<%= config.dist %>/scripts/*.js', '<%= config.dist %>/styles/*.css']
		    }

		},
		imagemin: {
		    dist: {
		        files: [{
		            expand: true,
		            cwd: '<%= config.app %>/images',
		            src: '{,*/}*.{gif,jpeg,jpg,png}',
		            dest: '<%= config.dist %>/images'
		        }]
		    }
		},
		rev: {
		    dist: {
		        files: {
		            src: [
		                '<%= config.dist %>/scripts/lib.js',
		                '<%= config.dist %>/styles/main.css',
		                '<%= config.dist %>/images/*.*',
		                '<%= config.dist %>/styles/fonts/{,*/}*.*',
		                '<%= config.dist %>/*.{ico,png}'
		            ]
		        }
		    }
		},


		//for test
		jshint: {
		   options: {
		       jshintrc: '.jshintrc',
		       reporter: require('jshint-stylish')
		   },
		   all: [
		       'source/{,*/}*.js'
		   ]
		},

        csslint: {
            lax: {
                options: {
                    "important": false,
                    "adjoining-classes": false,
                    "box-sizing": false,
                    "order-alphabetical" : false,
                    quiet: true
                },
                src: "<%= config.app %>/styles/main.css"
            },

            strict: {
                options: {
                    "order-alphabetical" : false,
                    // "adjoining-classes": false,
                    // "box-sizing": false,
                    quiet: false
                },
                src: "<%= config.app %>/styles/main.css"
            }
        },


    });


    grunt.registerTask('test', [
    	'jshint',
    	'csslint:strict'
    ]);


    grunt.registerTask('build', [
        'clean:dist',
        'concat:js',
        'less:dist',
        // 'imagemin',
        'copy:dist',
        'modernizr',
        'uglify',
        'rev',
        'usebanner'
    ]);

    grunt.registerTask('compile', [
    	'concat:js',
    	'less:dev'
	]);

    grunt.registerTask('default', [
		'test:strict', 
		'build'
	]);
};