// --------------------------------------------
// Dependencies
// --------------------------------------------
var autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  del = require('del'),
  gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  csso = require('gulp-csso'),
  clean = require('gulp-clean'),
  htmlmin = require('gulp-htmlmin'),
  browserSync = require('browser-sync').create();
// jshint = require('gulp-jshint');

// paths
var styleSrc = 'source/scss/**/*.scss',
  styleDest = 'build/assets/css/',
  htmlSrc = 'source/*.html',
  htmlDest = 'build/*.html',
  vendorSrc = 'source/js/vendors/',
  vendorDest = 'build/assets/js/',
  keys = 'source/keys/*.txt',
  scriptSrc = 'source/js/*.js',
  scriptDest = 'build/assets/js/';

// Tasks
gulp.task('reload', function() {
  browserSync.reload();
});

// Validate & minify html files
gulp.task('html', ['images'], function() {
  gulp.src('source/*.html')
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});

// Compiles all local SCSS files
gulp.task('scss', function() {
  gulp.src('source/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({
      style: 'compressed'
    }))
    .pipe(sourcemaps.write())
    .pipe(csso())
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('build/assets/css'))
    .pipe(browserSync.stream());
});

// Compile vendor SCSS files
gulp.task('vendors-scss', function() {
  return gulp.src(
      [
        'node_modules/bootstrap/scss/bootstrap.scss',
        'node_modules/font-awesome/scss/font-awesome.scss'
      ])
    .pipe(plumber())
    .pipe(sass({
      style: 'compressed'
    }))
    .pipe(csso())
    .pipe(concat("vendors-css.css"))
    .pipe(gulp.dest("build/assets/css/vendors"))
    .pipe(browserSync.stream());
});

//Images
gulp.task('images', function() {
  gulp.src('source/images/*')
    .pipe(gulp.dest('build/assets/images'));
});

//Favicon
gulp.task('favicon', function() {
  gulp.src('source/favicon/*')
    .pipe(gulp.dest('build/'));
});

//Fonts
//fonts for plugins
gulp.task('fonts', function() {
  gulp.src([
    'node_modules/font-awesome/fonts/*',
    'source/fonts/*'
  ])
    .pipe(gulp.dest('build/assets/css/fonts'));
});

// Copy js file
gulp.task('scripts', function() {
  gulp.src('source/js/app.js')
    .pipe(plumber())
    .pipe(gulp.dest('build/assets/js'))
    .pipe(browserSync.stream());
});

//Concat and Compress Vendor .js and plugin's files
gulp.task('vendors-js', function() {
  gulp.src(
      [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
      ])
      .pipe(plumber())
      .pipe(concat('vendors-js.js'))
      .pipe(gulp.dest('build/assets/js/vendors'))
    .pipe(browserSync.stream());
});

// Watch for changes
gulp.task('watch', function() {
  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: "./build"
    },
    notify: false
  });

  gulp.watch(htmlSrc, ['html']);
  gulp.watch(styleSrc, ['scss']);
  gulp.watch(scriptSrc, ['scripts']);
  gulp.watch(vendorSrc, ['vendors']);
  gulp.watch(['build/*.html', 'build/assets/css/*.css', 'build/assets/js/*.js', 'build/assets/js/vendors/*.js', 'build/assets/images/*']).on('change', browserSync.reload);
});

gulp.task('clean', function() {
  return gulp.src('build/*', {
      read: false
    })
    .pipe(clean());
});

// use default task to launch Browsersync and watch files
gulp.task('default', ['images', 'scss', 'vendors-scss', 'html', 'favicon', 'vendors-js', 'fonts', 'scripts', 'watch'], function() {});
