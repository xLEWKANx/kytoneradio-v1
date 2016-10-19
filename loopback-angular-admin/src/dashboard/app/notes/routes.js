'use strict'
import angular from 'angular'

import templateUrlMain from './views/main.html'
import templateUrlList from './views/list.html'
import templateUrlForm from './views/form.html'
import templateUrlView from './views/view.html'

const app = angular.module('com.module.notes.routes', [])

app.config(($stateProvider) => $stateProvider
  .state('app.notes', {
    abstract: true,
    url: '/notes',
    templateUrl: templateUrlMain,
  })
  .state('app.notes.list', {
    url: '',
    templateUrl: templateUrlList,
    controllerAs: 'ctrl',
    controller: function listCtrl (notes) {
      this.notes = notes
    },
    resolve: {
      notes: (NotesService) => NotesService.getNotes(),
    },
  })
  .state('app.notes.add', {
    url: '/add',
    templateUrl: templateUrlForm,
    controllerAs: 'ctrl',
    controller: function addCtrl ($state, NotesService, note) {
      this.note = note
      this.formFields = NotesService.getFormFields()
      this.formOptions = {}
      this.submit = () => NotesService.upsertNote(this.note)
        .then(() => $state.go('^.list'))
    },
    resolve: {
      note: () => {},
    },
  })
  .state('app.notes.edit', {
    url: '/:id/edit',
    templateUrl: templateUrlForm,
    controllerAs: 'ctrl',
    controller: function editCtrl ($state, NotesService, note) {
      this.note = note
      this.formFields = NotesService.getFormFields()
      this.formOptions = {}
      this.submit = () => NotesService.upsertNote(this.note)
        .then(() => $state.go('^.list'))
    },
    resolve: {
      note: ($stateParams, NotesService) => NotesService.getNote($stateParams.id),
    },
  })
  .state('app.notes.view', {
    url: '/:id',
    templateUrl: templateUrlView,
    controllerAs: 'ctrl',
    controller: function viewCtrl (note) {
      this.note = note
    },
    resolve: {
      note: ($stateParams, NotesService) => NotesService.getNote($stateParams.id),
    },
  })
  .state('app.notes.delete', {
    url: '/:id/delete',
    template: '',
    controllerAs: 'ctrl',
    controller: ($state, NotesService, note) => NotesService.deleteNote(note.id,
      () => $state.go('^.list'),
      () => $state.go('^.list')
    ),
    resolve: {
      note: ($stateParams, NotesService) => NotesService.getNote($stateParams.id),
    },
  })
)
