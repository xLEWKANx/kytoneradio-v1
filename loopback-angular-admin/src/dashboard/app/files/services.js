'use strict'
import angular from 'angular'


import './services/track'

const NAME = 'com.module.files.services'
const MODULES = [
  `${NAME}.track`
]

angular.module(NAME, MODULES)
