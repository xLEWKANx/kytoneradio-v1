exports.config = {
  allScriptTimeout: 11000,

  specs: [
    'e2e/*.js'
  ],

  capabilities: {
    'browserName': 'chrome',
  },

  chromeOnly: true,

  baseUrl: 'http://localhost:3000',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
}