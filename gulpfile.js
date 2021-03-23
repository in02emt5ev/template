var gulp = require('gulp');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var csso = require('postcss-csso');
var autoprefixer = require('autoprefixer');
var postcssImport = require('postcss-import');
var postcssUrl = require('postcss-url');
var rename = require('gulp-rename');
var server = require('browser-sync');
var del = require('del');

gulp.task('clean', function () {
  return(del('build'));
});

gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/*.{woff,woff2}',
    'source/img/**/*.{jpg,svg,png}',
    'source/*.html'
  ],
  {
    base: 'source'
  })
  .pipe(gulp.dest('build'))
  .pipe(server.stream());
});

gulp.task('css', function () {
  return gulp.src('source/css/styles.css')
  .pipe(plumber())
  .pipe(postcss([
    postcssImport(),
    postcssUrl(),
    autoprefixer(),
    csso()
  ]))
  .pipe(rename('styles.min.css'))
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream());
});

gulp.task('server', function () {
  server.init({
    server: {
      baseDir: 'build/',
      notify: false,
      open: true,
      cors: true,
      ui: false
    }
  });
  gulp.watch('source/*.html', gulp.series('copy'));
  gulp.watch('source/css/**/*.css', gulp.series('css'));
});

gulp.task('build', gulp.series('clean', 'copy', 'css', 'server'));
