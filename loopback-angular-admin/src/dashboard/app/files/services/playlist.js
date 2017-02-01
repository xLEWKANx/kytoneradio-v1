'use strict'
import angular from 'angular'
import moment from 'moment'


console.log(moment().startOf('d').toDate(), moment().add(1, 'day').startOf('d').toDate())

function PlaylistService(CoreService, Playlist, gettextCatalog) {

  this.Playlist = () => Playlist

  this.getPlaylist = function(date = new Date) {
    const TODAY = moment(date).startOf('d').toDate()
    const TOMORROW = moment(date).add(1, 'day').startOf('d').toDate()

    console.log('today', TODAY, TOMORROW)
    return Playlist.find({
      filter: {
        where: {
          and: [{
            endTime: {
              gte: TODAY
            }
          }, {
            startTime: {
              lte: TOMORROW
            }
          }]
        }
      }
    }).$promise
  }

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
