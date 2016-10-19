'use strict'
import angular from 'angular'

function PageService ($state, CoreService, Page, gettextCatalog) {

  this.find = () => Page.find().$promise

  this.findById = (id) => Page.findById({ id }).$promise

  this.upsert = (page) => Page.upsert(page).$promise
    .then(() => CoreService.toastSuccess(
      gettextCatalog.getString('Page saved'),
      gettextCatalog.getString('Your page is safe with us!')
      )
    )
    .catch((err) => CoreService.toastError(
      gettextCatalog.getString('Error saving page '),
      gettextCatalog.getString(`This page could no be saved: ${err}`)
      )
    )

  this.delete = (id, successCb, cancelCb) => CoreService.confirm(
    gettextCatalog.getString('Are you sure?'),
    gettextCatalog.getString('Deleting this cannot be undone'),
    () => {
      Page.deleteById({ id: id },
        () => {
          CoreService.toastSuccess(
            gettextCatalog.getString('Page deleted'),
            gettextCatalog.getString('Your page is deleted!'))
          successCb()
        },
        (err) => {
          CoreService.toastError(
            gettextCatalog.getString('Error deleting page'),
            gettextCatalog.getString(`Your page is not deleted! ${err}`))
          cancelCb()
        })
    },
    () => cancelCb()
  )

  this.getFormFields = () => [ {
    key: 'name',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Name'),
      required: true,
    },
  }, {
    key: 'slug',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Slug'),
      required: true,
    },
  } ]

}

angular
  .module('com.module.pages.services.pages', [])
  .service('PageService', PageService)
