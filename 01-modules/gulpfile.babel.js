var gulp = require('gulp');
var runSequence = require('run-sequence');

/* Browserify Task */
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var hbsfy = require('hbsfy');
var babelify = require('babelify');

/* Clean Task */
var clean = require('gulp-clean');

/* Connect Task */
var connect = require('gulp-connect');
var serveStatic = require('serve-static');
var fs = require('fs');

gulp.task('browserify:dist', function () {
    return browserify('./src/app.js')
        .transform(hbsfy)
        .transform(babelify.configure({
            presets: ["es2015"]
        }))
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./dist'));
});

gulp.task('browserify:watch', function () {
    return browserify('./src/app.js')
        .transform(hbsfy)
        .transform(babelify.configure({
            presets: ["es2015"]
        }))
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload())
});

gulp.task('clean', function () {
    gulp.src('./dist/', {read: false})
        .pipe(clean())
});

gulp.task('copy', function () {
    gulp.src(['./src/*.html'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('connect', function () {
    connect.server({
        root: './dist/',
        hostname: '0.0.0.0',
        livereload: true,
        port: 3000,
        middleware: (connect, options) => {
            const middlewares = []

            if (!Array.isArray(options.root)) {
                options.root = [options.root]
            }

            options.root.forEach(function(base) {
                middlewares.push(serveStatic(base))
            })

            // default: index.html
            middlewares.push((req, res) => {
                fs
                    .createReadStream(`${options.root}index.html`)
                    .pipe(res)
            })
            return middlewares
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(['./src/**/*.js'], ['browserify:watch']);
    gulp.watch(['./src/*html'], ['copy']);
});

gulp.task('connect-watch', ['connect', 'watch']);


gulp.task('default', function (done) {
    runSequence('clean', 'copy', 'browserify:dist', done);
});
gulp.task('start', function (done) {
    runSequence('default', 'connect-watch', done);
});