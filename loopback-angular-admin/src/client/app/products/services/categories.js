'use strict'
import angular from 'angular'

function CategoriesService (CoreService, Category, gettextCatalog) {

  this.getCategories = () => Category.find({
    filter: {
      order: 'created DESC',
      include: [
        'products',
      ],
    },
  }).$promise

  this.getCategory = (id) => Category.findOne({
    where: {
      id,
    },
  }).$promise

  this.upsertCategory = (category) => Category.upsert(category).$promise
    .then(() => CoreService.toastSuccess(
      gettextCatalog.getString('Category saved'),
      gettextCatalog.getString('Your category is safe with us!')
      )
    )
    .catch((err) => CoreService.toastSuccess(
      gettextCatalog.getString('Error saving category '),
      gettextCatalog.getString(`This category could no be saved: ${err}`)
      )
    )

  this.deleteCategory = (id, successCb, cancelCb) => {
    CoreService.confirm(
      gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      () => {
        Category.deleteById({ id },
          () => {
            CoreService.toastSuccess(
              gettextCatalog.getString('Category deleted'),
              gettextCatalog.getString('Your category is deleted!'))
            successCb()
          },
          (err) => {
            CoreService.toastError(
              gettextCatalog.getString('Error deleting category'),
              gettextCatalog.getString(`Your category is not deleted! ${err}`)
            )
            cancelCb()
          })
      },
      () => cancelCb()
    )
  }

  this.getFormFields = () => [ {
    key: 'name',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Name'),
      required: true,
    },
  } ]

}

angular
  .module('com.module.products.services.categories', [])
  .service('CategoriesService', CategoriesService)
