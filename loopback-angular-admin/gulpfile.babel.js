import gulp from 'gulp'
import nodemon from 'gulp-nodemon'
import eslint from 'gulp-eslint'
import rename from 'gulp-rename'
import loopbackAngular from 'gulp-loopback-sdk-angular'
import runSequence from 'run-sequence'

const debugEnabled = process.env.DEBUG_API
const apiUrl = process.env.API_URL || 'http://0.0.0.0:3027/api'
const babelNode = './node_modules/.bin/babel-node'
const exec = debugEnabled ? `${babelNode} --debug` : `${babelNode}`

// ESLint configuration
gulp.task('lint', () => gulp
  .src([
    'src/client/**/*.js',
    'common/**/*.js',
    'server/**/*.js',
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
)

// This task wraps around the three tasks below
gulp.task('loopback', (cb) => runSequence(
  'loopback:before',
  'loopback:codegen',
  'loopback:after',
  cb)
)

// Set the ENV env var to 'codegen' to skip some boot scripts.
gulp.task('loopback:before', () => {
  global.originalEnv = process.env.ENV
  process.env.ENV = 'codegen'
})

// Restore the original value of the ENV env var store by the loopback:before script
gulp.task('loopback:after', () => {
  process.env.ENV = global.originalEnv
})

// The actual generation of the LoopBack Angular SDK
gulp.task('loopback:codegen', () => gulp
  .src('./server/server.js')
  .pipe(loopbackAngular({ apiUrl }))
  .pipe(rename('lb-services.js'))
  .pipe(gulp.dest('./src/client/lib'))
)

// Serve the LoopBack server with nodemon
gulp.task('serve', () => nodemon({
  exec,
  script: 'server/server.js',
  watch: [ 'server/', 'common/' ],
  ext: 'js json',
  tasks: [ 'lint' ],
}))

// The default taks
gulp.task('default', [
  'lint',
  'serve',
  'loopback',
])
