'use strict'
import angular from 'angular'

import './services'
import './routes'

const NAME = 'com.module.notes'
const MODULES = [
  `${NAME}.services`,
  `${NAME}.routes`,
]

angular.module(NAME, MODULES)
  .run(($rootScope, Note, gettextCatalog) => {
    $rootScope.addMenu(gettextCatalog.getString('Notes'), 'app.notes.list', 'fa-file-o')
    Note.find((data) => $rootScope
      .addDashboardBox(gettextCatalog.getString('Notes'), 'bg-green', 'ion-clipboard', data.length, 'app.notes.list'))
  })
