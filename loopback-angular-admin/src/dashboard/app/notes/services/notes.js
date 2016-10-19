'use strict'
import angular from 'angular'

function NotesService ($state, CoreService, Note, gettextCatalog) {

  this.getNotes = () => Note.find().$promise

  this.getNote = (id) => Note.findById({ id: id }).$promise

  this.upsertNote = (note) => Note.upsert(note).$promise
    .then(() => CoreService.toastSuccess(
      gettextCatalog.getString('Note saved'),
      gettextCatalog.getString('Your note is safe with us!')
      )
    )
    .catch((err) => CoreService.toastSuccess(
      gettextCatalog.getString('Error saving note '),
      gettextCatalog.getString(`This note could no be saved: ${err}`)
      )
    )

  this.deleteNote = (id, successCb, cancelCb) => {
    CoreService.confirm(
      gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      () => {
        Note.deleteById({ id: id },
          () => {
            CoreService.toastSuccess(
              gettextCatalog.getString('Note deleted'),
              gettextCatalog.getString('Your note is deleted!'))
            successCb()
          },
          (err) => {
            CoreService.toastError(
              gettextCatalog.getString('Error deleting note'),
              gettextCatalog.getString('Your note is not deleted! ') + err)
            cancelCb()
          })
      },
      () => cancelCb()
    )
  }

  this.getFormFields = () => ([ {
    key: 'title',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Title'),
      required: true,
    },
  }, {
    key: 'body',
    type: 'textarea',
    templateOptions: {
      label: gettextCatalog.getString('Body'),
      required: true,
    },
  } ])

}

angular
  .module('com.module.notes.services.notes', [])
  .service('NotesService', NotesService)
