var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    jade = require('gulp-jade'),
    nodemon = require('gulp-nodemon'),
    concat = require("gulp-concat"),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify');

var fs = require('fs'),
    path = require('path');

var file_cfg = {
  path: path.join(__dirname, 'paths.json'),
  encoding: 'UTF-8'
};

var $paths = JSON.parse(
  fs.readFileSync(
    file_cfg.path, file_cfg.encoding));

var _paths = generatePaths($paths);

gulp.task('styles',function(){
  return gulp
    .src(_paths.styles+'/*.less')
    .pipe(less()).on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minifycss())
    .pipe(gulp.dest(
        $dest('styles')
      ))
    // .pipe(notify('Styles task complete'))
})

gulp.task('app',function(){
  return gulp
    .src([
        _paths.app+'/**/module.js',
        _paths.app+'/**/*.js'
      ])
    .pipe(concat('main.js')).on("error", notify.onError("Error: <%= error.message %>"))
        // Annotate before uglify so the code get's min'd properly.
    .pipe(ngAnnotate({
        // true helps add where @ngInject is not used. It infers.
        // Doesn't work with resolve, so we must be explicit there
        add: true
    }))
    .pipe(uglify()).on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(gulp.dest(
        $dest('app')
      ))
})

gulp.task('app:lib',function(){
  return gulp
    .src([
      _paths.app_lib + '/**/jquery*.js',
      _paths.app_lib + '/**/angular.js',
      _paths.app_lib + '/**/angular*.js',
      _paths.app_lib + '/**/*.js'
      ])
    .pipe(concat('lib.js'))
    .pipe(uglify())
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

gulp.task('img', function(){
  return gulp
    .src(_paths.img + '/**/*')
    .pipe(gulp.dest(
        $dest('img')
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
  nodemon({
    script: 'www',
    watch:[
    'server/**/*.js',
    'service/**/*.js',
    'www'
    ]
  })
    .on('restart', function () {
      console.log('Server restarted');
      // notify('Server restarted!');
    })
})

gulp.task('build',['styles','app', 'app:lib','views','img','misc', 'fonts'],
  function(){
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

// function $path(dir){
//   return path.join(__dirname,_source+dir)
// }
function $dest(dir){
  if (dir)
    return path.join(_paths.out,dir)
  else
    return _paths.out
}

function generatePaths(cfg){
  var genpaths = {};

  for(var k in cfg.paths){
    var p = cfg.paths[k];
    genpaths[p] = path.join(__dirname,cfg.source,p)
  }

  genpaths.out = path.join(__dirname, cfg.dest)

  return genpaths;
}