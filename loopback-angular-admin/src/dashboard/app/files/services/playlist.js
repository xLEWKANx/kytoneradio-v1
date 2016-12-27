'use strict'
import angular from 'angular'

function PlaylistService(CoreService, Playlist, gettextCatalog) {

  this.getPlaylist = () => Playlist



}

angular
  .module('com.module.files.services.playlist', [])
  .service('PlaylistService', PlaylistService)
