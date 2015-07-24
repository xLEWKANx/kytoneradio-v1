var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    jade = require('gulp-jade'),
    clean = require('gulp-clean'),
    nodemon = require('gulp-nodemon'),
    concat = require("gulp-concat");

var path = require('path');
var _source = 'source/';
var _dest = 'public/';
var _paths = {
  app: $path('app'),
  app_lib: $path('app_lib'),
  misc: $path('misc'),
  styles: $path('styles'),
  fonts: $path('fonts'),
  views: $path('views'),
  out: path.join(__dirname,'public')
}

gulp.task('clean', function(){
    return gulp
      .src(_paths.out, {read: false})
      .pipe(clean());
})

gulp.task('styles',function(){
  return gulp
    .src(_paths.styles+'/*.less')
    .pipe(less()).on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(
        $dest('styles')
      ))
    .pipe(notify('Styles task complete'))
})

gulp.task('app',function(){
  return gulp
    .src([
        _paths.app+'/**/module.js',
        _paths.app+'/**/*.js'
      ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(
        $dest('app')
      ))
})

gulp.task('app:lib',function(){
  return gulp
    .src([
      _paths.app_lib + '/**/jquery*.js',
      _paths.app_lib + '/**/angular*.js',
      _paths.app_lib + '/**/*.js'
      ])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(
        $dest('app')
      ))
})

gulp.task('views',function(){
  return gulp
    .src(_paths.views + '/*.jade')
    .pipe(jade({}))
    .pipe(gulp.dest(
        $dest('views')
      ))
})

gulp.task('misc',function(){
  return gulp
    .src(_paths.misc + '/**/*')
    .pipe(gulp.dest(
        $dest('')
      ))
})

gulp.task('fonts', function(){
  return gulp
    .src(_paths.fonts + '/**/*')
    .pipe(gulp.dest(
        $dest('styles/fonts')
      ))

});

gulp.task('develop', function () {
  nodemon({ script: 'www' 
    // tasks: ['default'] 
  })
    .on('restart', function () {
      notify('Server restarted!');
    })
})

gulp.task('build',['styles','app','app:lib','views','misc', 'fonts'], function(){
  gulp.start('develop');
})

gulp.task('default', function(){
  console.log('paths',_paths)
  gulp.start('build','watch');
  return
})

gulp.task('watch', function(){

  // server.run(['www']);
  /*require('./www');*/
  // server.listen(serverport, function() {
  //   console.log('server started, port',serverport);
  //   lrserver.listen(livereloadport);
  // })

  gulp.watch([_paths.styles + '/**/*'],['styles']);

  gulp.watch([_paths.app + '/**/*.js'],['app']);

  gulp.watch([_paths.app_lib + '/**/*.js'],['app:lib']);

  gulp.watch([_paths.views + '/**/*.jade'],['views']);

  gulp.watch([_paths.misc+'/**/*'],['misc']);
  
});

function $path(dir){
  return path.join(__dirname,_source+dir)
}
function $dest(dir){
  return path.join(__dirname,_dest+dir)
}
