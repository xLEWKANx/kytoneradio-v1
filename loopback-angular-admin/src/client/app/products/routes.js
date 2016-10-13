'use strict'

import angular from 'angular'

import templateUrlForm from './views/form.html'
import templateUrlList from './views/list.html'
import templateUrlMain from './views/main.html'
import templateUrlView from './views/view.html'
import templateUrlCategoryForm from './views/categoryform.html'

const app = angular.module('com.module.products.routes', [])

app.config(($stateProvider) => $stateProvider
  .state('app.products', {
    abstract: true,
    url: '/products',
    templateUrl: templateUrlMain,
  })
  .state('app.products.list', {
    url: '',
    templateUrl: templateUrlList,
    controllerAs: 'ctrl',
    controller: function listCtrl (categories) {
      this.categories = categories
    },
    resolve: {
      categories: (CategoriesService) => CategoriesService.getCategories(),
    },
  })
  .state('app.products.add', {
    url: '/add/:categoryId',
    templateUrl: templateUrlForm,
    controllerAs: 'ctrl',
    controller: function addCtrl ($state, ProductsService, categories, product) {
      this.categories = categories
      this.product = product
      this.formFields = ProductsService.getFormFields(categories)
      this.formOptions = {}
      this.submit = () => ProductsService.upsertProduct(this.product).then(() => $state.go('^.list'))
    },
    resolve: {
      categories: (CategoriesService) => CategoriesService.getCategories(),
      product: ($stateParams) => ({
        categoryId: $stateParams.categoryId,
      }),
    },
  })
  .state('app.products.edit', {
    url: '/:productId/edit',
    templateUrl: templateUrlForm,
    controllerAs: 'ctrl',
    controller: function editCtrl ($state, ProductsService, categories, product) {
      this.categories = categories
      this.product = product
      this.formFields = ProductsService.getFormFields(categories)
      this.formOptions = {}
      this.submit = () => ProductsService.upsertProduct(this.product).then(() => $state.go('^.list'))
    },
    resolve: {
      categories: (CategoriesService) => CategoriesService.getCategories(),
      product: ($stateParams, ProductsService) => ProductsService.getProduct($stateParams.productId),
    },
  })
  .state('app.products.addcategory', {
    url: '/addcategory',
    templateUrl: templateUrlCategoryForm,
    controllerAs: 'ctrl',
    controller: function addCategoryCtrl ($state, CategoriesService, category) {
      this.category = category
      this.formFields = CategoriesService.getFormFields()
      this.formOptions = {}
      this.submit = () => CategoriesService.upsertCategory(this.category).then(() => $state.go('^.list'))
    },
    resolve: {
      category: () => {},
    },
  })
  .state('app.products.view', {
    url: '/:productId',
    templateUrl: templateUrlView,
    controllerAs: 'ctrl',
    controller: function viewCtrl (product) {
      this.product = product
    },
    resolve: {
      product: ($stateParams, ProductsService) => ProductsService.getProduct($stateParams.productId),
    },
  })
  .state('app.products.editcategory', {
    url: '/editcategory/:categoryId',
    templateUrl: templateUrlCategoryForm,
    controllerAs: 'ctrl',
    controller: function editCategoryCtrl ($state, CategoriesService, category) {
      this.category = category
      this.formFields = CategoriesService.getFormFields()
      this.formOptions = {}
      this.submit = () => CategoriesService.upsertCategory(this.category).then(() => $state.go('^.list'))
    },
    resolve: {
      category: ($stateParams, CategoriesService) => CategoriesService.getCategory($stateParams.categoryId),
    },
  })
  .state('app.products.deletecategory', {
    url: '/category/:categoryId/delete',
    template: '',
    controllerAs: 'ctrl',
    controller: ($state, CategoriesService, product) => CategoriesService.deleteCategory(product.id,
      () => $state.go('^.list'),
      () => $state.go('^.list')
    ),
    resolve: {
      product: ($stateParams, CategoriesService) => CategoriesService.getCategory($stateParams.categoryId),
    },
  })
  .state('app.products.delete', {
    url: '/:productId/delete',
    template: '',
    controllerAs: 'ctrl',
    controller: ($state, ProductsService, product) => ProductsService.deleteProduct(product.id,
      () => $state.go('^.list'),
      () => $state.go('^.list')
    ),
    resolve: {
      product: ($stateParams, ProductsService) => ProductsService.getProduct($stateParams.productId),
    },
  })
)
