'use strict'
import angular from 'angular'

function FileService ($http, CoreService, Setting, gettextCatalog) {

  this.find = () => $http.get(`${CoreService.env.apiUrl}/containers/files/files`)
    .success((res) => res.data)

  this.delete = (id, successCb, cancelCb) => {
    CoreService.confirm(
      gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      () => {
        $http.delete(`${CoreService.env.apiUrl}/containers/files/files/${encodeURIComponent(id)}`)
          .success(
            () => {
              CoreService.toastSuccess(
                gettextCatalog.getString('File deleted'),
                gettextCatalog.getString('Your file is deleted!')
              )
              successCb()
            })
      }, (err) => {
        CoreService.toastError(
          gettextCatalog.getString('Error deleting file'),
          gettextCatalog.getString(`Your file is not deleted! ${err}`))
        cancelCb()
      })
  }
}

angular
  .module('com.module.files.services.file', [])
  .service('FileService', FileService)
