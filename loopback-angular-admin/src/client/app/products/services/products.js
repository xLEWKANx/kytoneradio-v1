'use strict'

import angular from 'angular'

function ProductsService (CoreService, Product, gettextCatalog) {

  this.getProducts = () => Product.find({
    filter: {
      order: 'created DESC',
    },
  }).$promise

  this.getProduct = (id) => Product.findById({ id }).$promise

  this.upsertProduct = (product) => Product.upsert(product).$promise
    .then(() => CoreService.toastSuccess(
      gettextCatalog.getString('Product saved'),
      gettextCatalog.getString('Your product is safe with us!')
      )
    )
    .catch((err) => CoreService.toastSuccess(
      gettextCatalog.getString('Error saving product '),
      gettextCatalog.getString(`This product could no be saved: ${err}`)
      )
    )

  this.deleteProduct = (id, successCb, cancelCb) => {
    CoreService.confirm(
      gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      () => {
        Product.deleteById({ id },
          () => {
            CoreService.toastSuccess(
              gettextCatalog.getString('Product deleted'),
              gettextCatalog.getString('Your product is deleted!'))
            successCb()
          },
          (err) => {
            CoreService.toastError(
              gettextCatalog.getString('Error deleting product'),
              gettextCatalog.getString(`Your product is not deleted! ${err}`)
            )
            cancelCb()
          })
      },
      () => cancelCb()
    )
  }

  this.getFormFields = (categories) => {
    const catOptions = categories.map((category) => ({
      name: category.name,
      value: category.id,
    }))

    return [ {
      key: 'name',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('Name'),
        required: true,
      },
    }, {
      key: 'categoryId',
      type: 'select',
      templateOptions: {
        label: gettextCatalog.getString('Category'),
        required: true,
        options: catOptions,
      },
    }, {
      key: 'description',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('Description'),
      },
    }, {
      key: 'price',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('Price'),
      },
    } ]
  }
}

angular.module('com.module.products.services.products', [])
  .service('ProductsService', ProductsService)
