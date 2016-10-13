'use strict'
import angular from 'angular'

function PostsService (CoreService, Post, gettextCatalog) {

  this.getPosts = () => Post.find({
    filter: {
      order: 'created DESC',
    },
  }).$promise

  this.getPost = (id) => Post.findById({ id }).$promise

  this.upsertPost = (post) => Post.upsert(post).$promise
    .then(() => CoreService.toastSuccess(
      gettextCatalog.getString('Post saved'),
      gettextCatalog.getString('Your post is safe with us!')
      )
    )
    .catch((err) => CoreService.toastSuccess(
      gettextCatalog.getString('Error saving post '),
      gettextCatalog.getString(`This post could no be saved: ${err}`)
      )
    )

  this.deletePost = (id, successCb, cancelCb) => {
    CoreService.confirm(
      gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      () => {
        Post.deleteById({ id: id },
          () => {
            CoreService.toastSuccess(
              gettextCatalog.getString('Post deleted'),
              gettextCatalog.getString('Your post is deleted!'))
            successCb()
          }, (err) => {
            CoreService.toastError(
              gettextCatalog.getString('Error deleting post'),
              gettextCatalog.getString(`Your post is not deleted! ${err}`))
            cancelCb()
          })
      },
      () => cancelCb()
    )
  }

  this.getFormFields = () => [ {
    key: 'title',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Title'),
      required: true,
    },
  }, {
    key: 'content',
    type: 'textarea',
    templateOptions: {
      label: gettextCatalog.getString('Content'),
      required: true,
    },
  }, {
    key: 'image',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Image'),
    },
  } ]

}

angular
  .module('com.module.posts.services.posts', [])
  .service('PostsService', PostsService)
