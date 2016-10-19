'use strict'
import angular from 'angular'

import './services/pages'

const NAME = 'com.module.pages.services'
const MODULES = [
  `${NAME}.pages`,
]

angular.module(NAME, MODULES)
