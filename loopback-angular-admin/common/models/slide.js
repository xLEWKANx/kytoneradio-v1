'use strict'
import Promise from 'bluebird'

module.exports = function (Slide) {

  Slide.createFakeData = function (faker, count) {
    return Slide.create({
      content: `* ${faker.lorem.paragraph()} *`,
      pictureUrl: `http://placehold.it/3${count}0x1${count}0`,
      outerIndex: Math.floor(count / 10),
      innerIndex: count % 10,
      local: Math.round(Math.random()),
      id: count
    })
  }

  Slide.observe('before save', (ctx, next) => {
    let model = ctx.instance || ctx.data
    console.log('before save', JSON.stringify(ctx, null, 2))
    let findByIndex = new Promise((resolve, reject) => {
      return Slide.findOne({
        where: {
          outerIndex: model.outerIndex,
          innerIndex: model.innerIndex
        }
      }, (err, savedModel) => {
        if (err) reject(err)
        if (savedModel) ctx.hookState.savedModel = savedModel
        resolve(ctx.hookState)
      })

      findByIndex.then(result => {})
    })
  })

  Slide.observe('after save', (ctx, next) => {
    let model = ctx.instance || ctx.data
    if (ctx.hookState && ctx.hookState.savedModel) {
      let oldIndex = ctx.hookState.savedModel.innerIndex
      oldIndex >= model.innerIndex
        ? ctx.hookState.savedModel.updateAttribute('innerIndex', oldIndex - 1, next)
        : ctx.hookState.savedModel.updateAttribute('innerIndex', oldIndex + 1, next)
    } else {
      next()
    }
    console.log('after save', JSON.stringify(ctx, null, 2))
  })
}
