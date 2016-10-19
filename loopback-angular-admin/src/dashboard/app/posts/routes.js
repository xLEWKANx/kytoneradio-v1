'use strict'
import angular from 'angular'

import templateUrlForm from './views/form.html'
import templateUrlList from './views/list.html'
import templateUrlMain from './views/main.html'
import templateUrlView from './views/view.html'

angular
  .module('com.module.posts.routes', [])
  .config(($stateProvider) => $stateProvider
    .state('app.posts', {
      abstract: true,
      url: '/posts',
      templateUrl: templateUrlMain,
    })
    .state('app.posts.list', {
      url: '',
      templateUrl: templateUrlList,
      controllerAs: 'ctrl',
      controller: function listCtrl (posts) {
        this.posts = posts
      },
      resolve: {
        posts: (PostsService) => PostsService.getPosts(),
      },
    })
    .state('app.posts.add', {
      url: '/add',
      templateUrl: templateUrlForm,
      controllerAs: 'ctrl',
      controller: function addCtrl ($state, PostsService, post) {
        this.post = post
        this.formFields = PostsService.getFormFields()
        this.formOptions = {}
        this.submit = () => PostsService.upsertPost(this.post).then(() => $state.go('^.list'))
      },
      resolve: {
        post: () => {},
      },
    })
    .state('app.posts.edit', {
      url: '/:id/edit',
      templateUrl: templateUrlForm,
      controllerAs: 'ctrl',
      controller: function editCtrl ($state, PostsService, post) {
        this.post = post
        this.formFields = PostsService.getFormFields()
        this.formOptions = {}
        this.submit = () => PostsService.upsertPost(this.post).then(() => $state.go('^.list'))
      },
      resolve: {
        post: ($stateParams, PostsService) => PostsService.getPost($stateParams.id),
      },
    })
    .state('app.posts.view', {
      url: '/:id',
      templateUrl: templateUrlView,
      controllerAs: 'ctrl',
      controller: function viewCtrl (post) {
        this.post = post
      },
      resolve: {
        post: ($stateParams, PostsService) => PostsService.getPost($stateParams.id),
      },
    })
    .state('app.posts.delete', {
      url: '/:id/delete',
      template: '',
      controllerAs: 'ctrl',
      controller: ($state, PostsService, post) => PostsService.deletePost(post.id,
        () => $state.go('^.list'),
        () => $state.go('^.list')),
      resolve: {
        post: ($stateParams, PostsService) => PostsService.getPost($stateParams.id),
      },
    })
  )
