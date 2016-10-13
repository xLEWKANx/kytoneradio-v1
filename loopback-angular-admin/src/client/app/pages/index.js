'use strict'
import angular from 'angular'

import './services'
import './routes'

const NAME = 'com.module.pages'
const MODULES = [
  `${NAME}.services`,
  `${NAME}.routes`,
]

angular.module(NAME, MODULES)
  .run(($rootScope, Page, gettextCatalog) => {
    $rootScope.addMenu(gettextCatalog.getString('Pages'), 'app.pages.list', 'fa-file-o')
    Page.find((data) => $rootScope
      .addDashboardBox(gettextCatalog.getString('Pages'), 'bg-teal', 'fa-page', data.length, 'app.pages.list'))
  })
