'use strict'
import angular from 'angular'

import './services/categories'
import './services/products'

const NAME = 'com.module.products.services'
const MODULES = [
  `${NAME}.categories`,
  `${NAME}.products`,
]

angular.module(NAME, MODULES)
