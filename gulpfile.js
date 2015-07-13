var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    jade = require('gulp-jade'),
    concat = require("gulp-concat");

var path = require('path'),
      fs = require('fs');

var _source = 'source/';
var _dest = 'public/';
var _paths = {
  app: $path('app'),
  app_lib: $path('app_lib'),
  misc: $path('misc'),
  styles: $path('styles'),
  views: $path('views'),
  out: path.join(__dirname,'public')
}



gulp.task('styles',function(){
  return gulp
    .src(_paths.styles+'/*.less')
    .pipe(less()).on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(
        $dest('styles')
      ))
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
    .src(_paths.views + '/**/*')
    .pipe(gulp.dest(
        $dest('')
      ))
})

gulp.task('build',['styles','app','app:lib','views','misc'])

gulp.task('default', function(){
  console.log('paths',_paths)
  gulp.start('build','watch');
  return
})

gulp.task('config', function(){
    var raw = fs.readFileSync('./paths.json', {
        encoding : 'UTF-8'
    });
    var config = JSON.parse(raw);
    return printcfg(config);
});

gulp.task('watch', function(){

  // server.run(['www']);
  require('./www');
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
function printcfg(config){
    for (var key in config){
        if (typeof config[key] != 'object')
            console.log('%s - %s', key, config[key] );
        else{
            console.log('%s :', key);
            printcfg(config[key])
        }
    }

}