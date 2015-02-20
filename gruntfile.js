module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'screeps@alanc.net',
                password: 'Water1981!'
            },
            dist: {
                src: ['dist/*.js']
            }
        },
        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['screeps'],
                options: {
                    atBegin: true,
                    spawn: true
                }
            }
        }
    });
};