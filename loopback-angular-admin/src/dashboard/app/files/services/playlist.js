'use strict'
import angular from 'angular'

function PlaylistService(CoreService, Playlist, gettextCatalog) {
  Playlist.find({}).$promise.then((result) => {
    console.log(result)
  })
  this.getPlaylist = () => Playlist

  this.clear = () => Playlist.clear().$promise
    .then(() => CoreService.toastInfo(
      gettextCatalog.getString('Playlist cleared')
      )
    )
    .catch((err) => CoreService.toastSuccess(
      gettextCatalog.getString('Error clear playlist'),
      gettextCatalog.getString(err)
      )
    )
}

angular
  .module('com.module.files.services.playlist', [])
  .service('PlaylistService', PlaylistService)
