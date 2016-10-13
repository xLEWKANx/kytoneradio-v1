'use strict'
import angular from 'angular'

import templateUrlMain from './views/main.html'
import templateUrlModels from './views/models.html'
import templateUrlModelsInfo from './views/models.info.html'
import templateUrlModelsItems from './views/models.items.html'
import templateUrlModelsItemsAdd from './views/models.items.add.html'
import templateUrlModelsItemsEdit from './views/models.items.edit.html'
import templateUrlModelsItemsView from './views/models.items.view.html'

const app = angular.module('com.module.browser.routes', [])
app.config(($stateProvider) => $stateProvider
  .state('app.browser', {
    abstract: true,
    url: '/browser',
    templateUrl: templateUrlMain,
  })
  .state('app.browser.models', {
    url: '',
    templateUrl: templateUrlModels,
    controllerAs: 'ctrl',
    controller: function modelsCtrl (models) {
      this.models = models
    },
    resolve: {
      models: (MetaService) => MetaService.find(),
    },
  })
  .state('app.browser.models.info', {
    url: '/:modelName/info',
    templateUrl: templateUrlModelsInfo,
    controllerAs: 'info',
    controller: function infoCtrl (model) {
      this.model = model
    },
    resolve: {
      model: ($stateParams, MetaService) => MetaService.findById($stateParams.modelName),
    },
  })
  .state('app.browser.models.items', {
    url: '/:modelName',
    templateUrl: templateUrlModelsItems,
    controllerAs: 'items',
    controller: function itemsCtrl (model, items) {
      this.model = model
      this.items = items
      this.itemKeys = []
      if (this.items[ 0 ] !== undefined) {
        this.itemKeys = Object.keys(this.items[ 0 ])
      }
    },
    resolve: {
      model: ($stateParams, MetaService) => MetaService.findById($stateParams.modelName),
      items: ($stateParams, MetaService) => MetaService.getModelItems($stateParams.modelName),
    },
  })
  .state('app.browser.models.items.view', {
    url: '/:modelId/view',
    templateUrl: templateUrlModelsItemsView,
    controllerAs: 'view',
    controller: function itemsViewCtrl (item) {
      this.item = item
      this.itemKeys = Object.keys(this.item)
    },
    resolve: {
      item: ($stateParams, MetaService) => MetaService.getModelItem($stateParams.modelName, $stateParams.modelId),
    },
  })
  .state('app.browser.models.items.edit', {
    url: '/:modelId/edit',
    templateUrl: templateUrlModelsItemsEdit,
    controllerAs: 'edit',
    controller: function itemsEditCtrl ($state, MetaService, model, item, itemFields) {
      this.item = item
      this.itemFields = itemFields
      this.submit = () => MetaService.upsert(model.name, this.item)
        .then(() => {
          $state.go('app.browser.models.items', { modelName: model.name }, { reload: true })
        })
    },
    resolve: {
      item: ($stateParams, MetaService) => MetaService.getModelItem($stateParams.modelName, $stateParams.modelId),
      itemFields: ($stateParams, MetaService, model) => MetaService.getModelFields(model),
    },
  })
  .state('app.browser.models.items.add', {
    url: '/add',
    templateUrl: templateUrlModelsItemsAdd,
    controllerAs: 'add',
    controller: function addCtrl ($state, MetaService, model, itemFields) {
      this.item = {}
      this.itemFields = itemFields
      this.submit = () => MetaService.upsert(model.name, this.item)
        .then(() => {
          $state.go('app.browser.models.items', { modelName: model.name }, { reload: true })
        })
    },
    resolve: {
      itemFields: ($stateParams, MetaService, model) => MetaService.getModelFields(model),
    },
  })
  .state('app.browser.models.items.delete', {
    url: '/:modelId/delete',
    template: '',
    controller: function deleteCtrl ($state, $stateParams, MetaService, model) {
      MetaService.delete(model.name, $stateParams.modelId, () => {
        $state.go('app.browser.models.items', { modelName: model.name }, { reload: true })
      }, () => {
        $state.go('app.browser.models.items', { modelName: model.name }, { reload: true })
      })
    },
  })
)
