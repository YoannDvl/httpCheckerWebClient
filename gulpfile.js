var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');

gulp.task('buildJs', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('buildCss', function() {
  return gulp.src('src/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('styles.css'))
    .pipe(minifyCss({'s1': true}))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('minHtml', function() {
  var opts = { empty:true, cdata:true, conditionals:true, quotes:false, loose:true };

  return gulp.src('src/html/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('build/html/'));
});

gulp.task('default', ['buildJs', 'buildCss', 'minHtml']);
