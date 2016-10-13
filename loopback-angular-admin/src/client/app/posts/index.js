'use strict'
import angular from 'angular'

import './services'
import './routes'

const NAME = 'com.module.posts'
const MODULES = [
  `${NAME}.services`,
  `${NAME}.routes`,
]
angular.module(NAME, MODULES)
  .run(($rootScope, Post, gettextCatalog) => {
    $rootScope.addMenu(gettextCatalog.getString('Posts'), 'app.posts.list', 'fa-edit')
    Post.find((posts) => $rootScope
      .addDashboardBox(gettextCatalog.getString('Posts'), 'bg-red', 'ion-document-text', posts.length, 'app.posts.list')
    )
  })
