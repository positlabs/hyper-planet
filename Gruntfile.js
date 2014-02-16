module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			scripts: {
				files: '**/*.js',
				tasks: ['requirejs'],
				options: {
					interrupt: true
				}
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

//	grunt.registerTask('default', ['requirejs']);

};