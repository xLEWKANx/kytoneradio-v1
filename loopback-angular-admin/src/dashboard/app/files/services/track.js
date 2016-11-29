'use strict'
import angular from 'angular'

function TracksService (CoreService, Track, gettextCatalog) {

  this.getTracks = () => Track.find({
    filter: {
      order: 'created DESC',
    },
  }).$promise

  this.getTrack = (id) => Track.findById({ id }).$promise

  this.upsertTrack = (track) => Track.upsert(track).$promise
    .then(() => CoreService.toastSuccess(
      gettextCatalog.getString('Track saved'),
      gettextCatalog.getString('Your track is safe with us!')
      )
    )
    .catch((err) => CoreService.toastSuccess(
      gettextCatalog.getString('Error saving track '),
      gettextCatalog.getString(`This track could no be saved: ${err}`)
      )
    )

  this.deleteTrack = (id, successCb, cancelCb) => {
    CoreService.confirm(
      gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      () => {
        Track.deleteById({ id: id },
          () => {
            CoreService.toastSuccess(
              gettextCatalog.getString('Track deleted'),
              gettextCatalog.getString('Your track is deleted!'))
            successCb()
          }, (err) => {
            CoreService.toastError(
              gettextCatalog.getString('Error deleting track'),
              gettextCatalog.getString(`Your track is not deleted! ${err}`))
            cancelCb()
          })
      },
      () => cancelCb()
    )
  }

  this.getFormFields = () => [ {
    key: 'content',
    type: 'textarea',
    templateOptions: {
      label: gettextCatalog.getString('Content'),
      required: true,
    },
    ngModelElAttrs: {
      rows: '10'
    }
  }, {
    key: 'pictureUrl',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Image'),
    },
  }, {
    key: 'outerUrl',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Link'),
    },
  }, {
    key: 'innerIndex',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Number'),
    },
  }, {
    key: 'outerIndex',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Row'),
    },
  }, {
    key: 'local',
    type: 'checkbox',
    templateOptions: {
      label: gettextCatalog.getString('Local'),
    },
  } ]

}

angular
  .module('com.module.files.services.track', [])
  .service('TracksService', TracksService)
