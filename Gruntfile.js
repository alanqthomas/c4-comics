module.exports = function(grunt) {

	grunt.initConfig({
		sass: {
			dist: {
				files: {
					'war/css/styles.css' : 'war/css/sass/base.scss'
				}
			}
		},
		concat: {
			js: {
                options: {
                    // Replace all 'use strict' statements in the code with a single one at the top
                    banner: "'use strict';\n",
                    process: function(src, filepath) {
                        return '// Source: ' + filepath + '\n' +
                            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                },
				src: ['war/js/app.js',
                      'war/js/config.js',
                      'war/js/controllers/homeController.js',
                      'war/js/controllers/profileController.js',
                      'war/js/services/authService.js'],
				dest: 'war/js/dist/scripts.js'
			}
		},
		watch: {
			js: {
				files: ['war/js/**/*.js'],
				tasks: ['concat:js', 'uglify']
			},
			sass: {
				files: ['war/css/sass/**/*.scss'],
				tasks: ['sass']
			},
			css: {
				files: ['war/css/**/*.css'],
				tasks: ['cssmin']
			},
		},
		cssmin: {
			minify: {
				src: 'war/css/styles.css',
				dest: 'war/css/styles.min.css'
			}
		},
		uglify: {
			options: {
				manage: false
			},
			minify: {
				files: {
					'war/js/dist/scripts.min.js' : ['war/js/dist/scripts.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.registerTask('default', ['concat', 'uglify', 'sass', 'cssmin', 'watch']);

};
