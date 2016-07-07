var gulp = require('gulp'),

    gls = require('gulp-live-server'),

    typescript = require('gulp-typescript'),
    tsConfig = require('./tsconfig.json'),

    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence');


var devBuildLocation = 'builds/development',
    prodBuildLocation = 'builds/production',
    srcLocation = 'src/';


// Typescript compilation
gulp.task('typescript', function() {
    return gulp.src(srcLocation + '/**/*.ts')
    .pipe(
        plumber({
            handleError: function(err) {
                console.log(err);
                this.emit('end');
            }
        })
    )
    .pipe(typescript(tsConfig.compilerOptions))
    .pipe(gulp.dest(devBuildLocation));
});


// Collect templates 
gulp.task('templates', function(){
    return gulp.src(srcLocation + '/views/**/*.jade')
    .pipe(
        plumber({
            handleError: function(err) {
                console.log(err);
                this.emit('end');
            }
        })
    )
    .pipe(gulp.dest(devBuildLocation + '/views'));
});


// Collect public
gulp.task('collectPublic', function(err){
    return gulp.src(srcLocation + '/public/**/*.*')
    .pipe(
        plumber({
            handleError: function(err) {
                console.log(err);
                this.emit('end');
            }
        })
    )
    .pipe(gulp.dest(devBuildLocation + '/public'));
});


// Gulp live server
gulp.task('serve', function() {
    var server = gls.new('builds/development/app.js');
    server.start();

    gulp.watch([
        devBuildLocation + '/views/**/*.*', 
        devBuildLocation + '/public/**/*.*'], function (file) {
      console.log(`File changed: ${file.path}`);
      console.log('Reloading browser..');
      server.notify.apply(server, [file]);
    });
    
    gulp.watch('builds/development/**/*.js', function(file) {
      console.log(`File changed: ${file.path}`);
      console.log('Restarting server / Reloading browser..');
      server.start.bind(server)();    
      server.notify.apply(server, [file]);
    });
});


// Task groups
gulp.task('onTypescriptChange', function(){
    runSequence(
        'typescript'
    );
});

gulp.task('onTemplateChange', function(){
    runSequence(
        'templates'
    );
});

gulp.task('onPublicChange', function(){
    runSequence(
        'collectPublic'
    ); 
});


// Watchers
gulp.task('watchSource', function(){
    gulp.watch(srcLocation + '/**/*.ts', ['onTypescriptChange']);
    gulp.watch(srcLocation + '/views/**/*.jade', ['onTemplateChange']);
    gulp.watch(srcLocation + '/public/**/*.*', ['onPublicChange']);
});


// Facade tasks
gulp.task('dev', function(){
    runSequence(
        'typescript',
        'templates',
        'collectPublic',
        'watchSource',
        'serve'
    );
});
