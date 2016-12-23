'use strict'
import angular from 'angular'

import './services/track'
import './services/player'

const NAME = 'com.module.files.services'
const MODULES = [
  `${NAME}.track`,
  `${NAME}.player`
]

angular.module(NAME, MODULES)
