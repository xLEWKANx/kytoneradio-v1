'use strict'
import angular from 'angular'

import './routes.js'

const NAME = 'com.module.browser'
const MODULES = [
  `${NAME}.routes`,
]

angular.module(NAME, MODULES)
  .run(($rootScope, gettextCatalog) => $rootScope
    .addMenu(gettextCatalog.getString('Browser'), 'app.browser.models', 'fa-globe')
  )
