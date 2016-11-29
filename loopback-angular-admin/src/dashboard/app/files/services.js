'use strict'
import angular from 'angular'

import './services/file'
import './services/track'

const NAME = 'com.module.files.services'
const MODULES = [
  `${NAME}.file`,
  `${NAME}.track`,
]

angular.module(NAME, MODULES)
