'use strict'
import angular from 'angular'

import templateUrlForm from './views/form.html'
import templateUrlList from './views/list.html'
import templateUrlMain from './views/main.html'
import templateUrlView from './views/view.html'

const app = angular.module('com.module.pages.routes', [])

app.config(($stateProvider) => $stateProvider
  .state('app.pages', {
    abstract: true,
    url: '/pages',
    templateUrl: templateUrlMain,
  })
  .state('app.pages.list', {
    url: '',
    templateUrl: templateUrlList,
    controllerAs: 'ctrl',
    controller: function ctrl (pages) {
      this.pages = pages
    },
    resolve: {
      pages: (PageService) => PageService.find(),
    },
  })
  .state('app.pages.add', {
    url: '/add',
    templateUrl: templateUrlForm,
    controllerAs: 'ctrl',
    controller: function ctrl ($state, PageService, page) {
      this.editorOptions = {
        useWrapMode: true,
        theme: 'monokai',
        mode: 'markdown',
      }
      this.page = page
      this.formFields = PageService.getFormFields()
      this.formOptions = {}
      this.submit = () => PageService.upsert(this.page)
        .then(() => $state.go('^.list'))
    },
    resolve: {
      page: () => ({
        content: `# Hi!
## This is a markdown editor.
    fine code goes here 
    
- lists 
- go 
- here 
        
*Find* **more information** about \`markdown\` [Here](https://daringfireball.net/projects/markdown/basics)!`,
      }),
    },
  })
  .state('app.pages.edit', {
    url: '/:id/edit',
    templateUrl: templateUrlForm,
    controllerAs: 'ctrl',
    controller: function ctrl ($state, PageService, page) {
      this.editorOptions = {
        theme: 'monokai',
        lineWrapping: true,
        lineNumbers: true,
        mode: 'markdown',
      }
      this.page = page
      this.formFields = PageService.getFormFields()
      this.formOptions = {}
      this.submit = () => PageService.upsert(this.page)
        .then(() => $state.go('^.list'))
    },
    resolve: {
      page: ($stateParams, PageService) => PageService.findById($stateParams.id),
    },
  })
  .state('app.pages.view', {
    url: '/:id',
    templateUrl: templateUrlView,
    controllerAs: 'ctrl',
    controller: function viewCtrl (page) {
      this.page = page
    },
    resolve: {
      page: ($stateParams, PageService) => PageService.findById($stateParams.id),
    },
  })
  .state('app.pages.delete', {
    url: '/:id/delete',
    template: '',
    controllerAs: 'ctrl',
    controller: ($stateParams, $state, PageService) => {
      PageService.delete($stateParams.id, () => $state.go('^.list'), () => $state.go('^.list'))
    },
  })
)
