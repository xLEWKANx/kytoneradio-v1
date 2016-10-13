'use strict'
import angular from 'angular'

import './services/notes'

const NAME = 'com.module.notes.services'
const MODULES = [
  `${NAME}.notes`,
]

angular.module(NAME, MODULES)
