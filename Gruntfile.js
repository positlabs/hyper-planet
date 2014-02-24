module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			js: {
				files: '**/*.js',
				tasks: ['requirejs'],
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
			compile: {
				options: {
					baseUrl: 'src/js/',
					name: '../../node_modules/almond/almond',
					include: ['main'],
					out: 'main.js',
					wrap: true,
					optimize: 'none' // TODO: make a requirejs:dist
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');

//	grunt.registerTask('default', ['requirejs']);

};