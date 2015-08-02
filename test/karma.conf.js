module.exports = function(config){
  config.set({
    basePath: '../',

    files: [
      'source/app_lib/angular.js',
      'source/app_lib/angular-animate.js',
      'source/app_lib/angular-aria.js',
      'source/app_lib/angular-cookies.js',
      'source/app_lib/angular-resource.js',
      'source/app_lib/angular-route.js',
      'source/app_lib/angular-touch.js',
      'source/app_lib/angular-mocks.js',
      'source/app_lib/slick.module.js',
      'source/app/kytone/module.js',
      'source/app/kytone/*.js',
      'test/unit/**/*.js'
    ],

    autowatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: ['karma-chrome-launcher',
              'karma-jasmine'],

    junitReporter: {
      outputFile: 'test/unit.xml',
      suite: 'unit'
    }
  })
}