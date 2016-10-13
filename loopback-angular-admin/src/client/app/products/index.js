'use strict'
import angular from 'angular'

import './services'
import './routes'

const NAME = 'com.module.products'
const MODULES = [
  `${NAME}.services`,
  `${NAME}.routes`,
]

angular.module(NAME, MODULES)
  .run(($rootScope, Product, Category, gettextCatalog) => {
    $rootScope.addMenu(gettextCatalog.getString('Products'), 'app.products.list', 'fa-file')

    Product.find((data) => $rootScope.addDashboardBox(
      gettextCatalog.getString('Products'), 'bg-yellow', 'ion-ios7-cart-outline', data.length, 'app.products.list'
    ))
    Category.find((data) => $rootScope.addDashboardBox(
      gettextCatalog.getString('Categories'), 'bg-aqua', 'ion-ios7-pricetag-outline', data.length, 'app.products.list'
    ))
  })
