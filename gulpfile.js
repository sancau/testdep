var gulp = require('gulp'),

    connect = require('gulp-connect'),

    typescript = require('gulp-typescript'),
    tsConfig = require('./tsconfig.json'),

    jade = require('gulp-jade'),
    sass = require('gulp-sass'),

    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence');


var devBuildLocation = 'builds/development/',
    prodBuildLocation = 'builds/production/',
    srcLocation = 'src/';


// TYPESCRIPT compilation
gulp.task('typescript', function() {
    return gulp.src(srcLocation + '**/*.ts')
    .pipe(
        plumber({
            handleError: function(err) {
                console.log(err);
                this.emit('end');
            }
        })
    )
    .pipe(typescript(tsConfig.compilerOptions))
    .pipe(gulp.dest(devBuildLocation + 'js'));
});


// JADE compilation
gulp.task('jade', function() {
    return gulp.src(srcLocation + '**/*.jade')
    .pipe(
        plumber({
            handleError: function(err) {
                console.log(err);
                this.emit('end');
            }
        })
    )
    .pipe(jade())
    .pipe(gulp.dest(devBuildLocation));
});


// SASS compilation
gulp.task('sass', function() {
    return gulp.src(srcLocation + '**/*.scss')
    .pipe(
        plumber({
            handleError: function(err) {
                console.log(err);
                this.emit('end');
            }
        })
    )
    .pipe(sass({ style: 'compressed' }))
    .pipe(gulp.dest(devBuildLocation + 'css'));
});


// Task groups
gulp.task('onTypescriptChange', function(){
    runSequence(
        'typescript'
    );
});

gulp.task('onMarkupChange', function(){
    runSequence(
        'jade'
    );
});

gulp.task('onStyleChange', function(){
    runSequence(
        'sass'
    );
});


// Watchers
gulp.task('watch', function(){
    gulp.watch(srcLocation + '**/*.ts', ['onTypescriptChange']);
    gulp.watch(srcLocation + '**/*.jade', ['onMarkupChange']);
    gulp.watch(srcLocation + '**/*.scss', ['onStyleChange']);

    // Reload browser when dev build changes
    gulp.watch(devBuildLocation + '**/**.*')
    .on('change', function(file) {
        gulp.src(file.path)
        .pipe(connect.reload());
    });
});


// Dev server
gulp.task('connect', function() {
    connect.server({
        port: 9000,
        livereload: true,
        root: '.'
    });
});


// Facade tasks
gulp.task('dev', function(){
    runSequence(
        'typescript',
        'jade',
        'sass',
        'watch',
        'connect'
    );
});

