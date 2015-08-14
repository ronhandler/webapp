module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		dirs: {
			dest: './',
			js: 'js',
			css: 'css',
			scss: 'scss'
		},
		connect: {
		  server: {
			options: {
			  port: 8000,
			  base: '<%= dirs.dest %>',
			  livereload: true
			}
		  }
		},
		compass: {
			dist: {
				options: {
					config: "config.rb",
					//imagesDir: '../img'
				},
			}
		},
		watch: {
			src: {
				files: [ 'index.html',
					   '<%= dirs.css %>/*',
					   '<%= dirs.js %>/*'],
				options: {
					livereload: 35729,
				}
			},
			compass_compile: {
				files: [ '<%= dirs.scss %>/*' ],
				tasks: ['compass']
			}
		}
	});

	// Load grunt plugins.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');

	grunt.registerTask('default', ['connect', 'watch']);
};
