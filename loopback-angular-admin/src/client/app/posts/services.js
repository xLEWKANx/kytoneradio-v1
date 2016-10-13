'use strict'
import angular from 'angular'

import './services/posts'

const NAME = 'com.module.posts.services'
const MODULES = [
  `${NAME}.posts`,
]

angular.module(NAME, MODULES)
