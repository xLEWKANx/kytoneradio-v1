'use strict'
import angular from 'angular'

import './services/file'

const NAME = 'com.module.files.services'
const MODULES = [
  `${NAME}.file`,
]

angular.module(NAME, MODULES)
