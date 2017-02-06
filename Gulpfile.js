var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var cssmin = require('gulp-cssmin')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('browserify', function() {
  var bundler = browserify({
    entries: ["./src/js/app.js"],
    debug:true,
    cache: {}, packageCache: {}, fullPaths: true
  }).transform(babelify, { })

  function bundle() {
    bundler.bundle()
      .pipe(source("app.js"))
      .pipe(buffer())
      .pipe(gulp.dest("./build/"))
      .pipe(sourcemaps.init({loadMaps:true}))
      .pipe(rename('app.min.js'))
      .pipe(uglify())
      // .pipe(uglify())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("./build/"))

    bundler.on("error", function (error) {
      console.log(error)
    })
  }

  bundle()
})

gulp.task('css', function() {
  return gulp.src('src/scss/*.scss')
    .pipe(sass(), {/* options */ })
    .pipe(rename('app.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('build/'))
})

gulp.task('html', function() {
  return gulp.src('src/html/*.html')
    .pipe(gulp.dest('build/'))
})

gulp.task('copystatic', function() {
  return gulp.src('src/static/*')
    .pipe(gulp.dest('build/'))
})

gulp.task('watch-html', function() { return gulp.watch('src/html/*.html', ['html']) })
gulp.task('watch-static', function() { return gulp.watch('src/static/*', ['copystatic']) })
gulp.task('watch-js', function() { return gulp.watch('src/js/*.js', ['browserify']) })
gulp.task('watch-css', function() { return gulp.watch('src/scss/*.scss', ['css']) })

gulp.task('default', ['browserify', 'css', 'html', 'copystatic', 'watch-html', 'watch-js', 'watch-css', 'watch-static']);
