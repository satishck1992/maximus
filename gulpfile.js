var gulp = require('gulp');
var sass = require('gulp-sass');

var browserSync = require('browser-sync').create();
var runSequence= require('run-sequence');

gulp.task('sass', function () {
   return gulp.src('./src/scss/style.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./src'))
      .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browsersync', function () {
   browserSync.init({
      server: {
         baseDir: ['./', './src']
      }
   });
})

gulp.task('watch', function () {
   gulp.watch('./src/scss/**/*.scss', ['sass']);
});

gulp.task('default', function (cb) {
   runSequence(['sass', 'browsersync', 'watch'], cb);
});