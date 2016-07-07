var gulp = require('gulp'),

    typescript = require('gulp-typescript'),
    tsConfig = require('./tsconfig.json'),

    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence');


var devBuildLocation = 'builds/development',
    prodBuildLocation = 'builds/production',
    srcLocation = 'src/';


// TYPESCRIPT compilation
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


// Watchers
gulp.task('watch', function(){
    gulp.watch(srcLocation + '/**/*.ts', ['onTypescriptChange']);
    gulp.watch(srcLocation + '/views/**/*.jade', ['onTemplateChange']);
    gulp.watch(srcLocation + '/public/**/*.*', ['collectPublic'])
});


// Facade tasks
gulp.task('dev', function(){
    runSequence(
        'typescript',
        'templates',
        'collectPublic',
        'watch'
    );
});
