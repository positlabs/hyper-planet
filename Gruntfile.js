module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			js: {
				files: '**/*.js',
				tasks: ['requirejs:dev'],
				options: {
					interrupt: true
				}
			},
			css: {
				files: '**/*.less',
				tasks: ['less'],
				options: {
					interrupt: true
				}
			}
		},

		// https://github.com/gruntjs/grunt-contrib-less
		less: {
			options: {
				paths: ["src/styles"]
			},
			src: {
				expand: true,
				cwd: "src/styles",
				src: "master.less",
				dest: "src/styles",
				ext: ".css"
			}
		},

		requirejs: {
			dev: {
				options: {
					mainConfigFile: "src/js/require_config.js",

					baseUrl: 'src/js/',
					name: '../../node_modules/almond/almond',
					insertRequire: ['main'],
					include: [
						'app',
						'main',
						'three',
						'bower/ox/ox',
						'three.CopyShader',
						'three.ShaderPass',
						'three.RenderPass',
						'three.EffectComposer',
						'three.MaskPass'
					],
					out: 'dist/main.js',
					wrap: true,
					optimize: 'none'
				}
			},
			dist: {
				options: {
					baseUrl: 'src/js/',
					name: '../../node_modules/almond/almond',
					insertRequire: ["main"],
					include: ['main'],
					out: 'dist/main.js',
					optimize: 'uglify2',
					wrap: true
				}
			}
		},

		// https://github.com/changer/grunt-targethtml
		targethtml: {
			dist: {
				files: {
					'dist/index.html': 'src/index.html'
				}
			}
		},

		// https://github.com/gruntjs/grunt-contrib-copy
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: 'src',
						dest: 'dist',
						src: [
							'styles/master.css',
							'styles/fonts/**/*',
							'images/**/*'
            ]
					}
				]
			}
		},

		clean: {
			dist: 'dist'
		}

	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-targethtml');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks("grunt-contrib-clean");


//	grunt.registerTask('default', ['requirejs']);

	grunt.registerTask('build', ['clean:dist', 'requirejs:dev', 'less', 'targethtml:dist', 'copy']);
};