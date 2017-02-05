'use strict'
import Promise from 'bluebird'
import { default as debug } from 'debug'

const log = debug('player:Counter')


module.exports = function (Counter) {

  Counter.initAutoInc = function (collection, cb) {

    const AutoInc = {
      "seq": -1,
      "collection": collection
    }

    return Counter.findOrCreate({
      where: {
        collection: collection
      }
    }, AutoInc, cb)
  }

  Counter.autoIncId = function (instance, cb) {
    if (!instance) cb(new Error('instance do not specified'))
    let mongoConnector = Counter.app.dataSources.db.connector
    log('Counter.autoInc collection', instance.constructor.definition.name)
    mongoConnector.collection("Counter").findAndModify(
      { collection: instance.constructor.definition.name },
      [['_id', 'asc']],
      { $inc: { seq: 1 } },
      { new: true },
      (err, sequence) => {
        if (err) {
          console.log('error', err)
          cb(err);
        } else {
          console.log('sequence', sequence)
          instance.index = sequence.value.seq;
          cb(null, instance);
        }
      });
  }

  Counter.autoDecId = function (collection, index, cb) {
    if (!collection) cb(new Error('collection do not specified'))
    let mongoConnector = Counter.app.dataSources.db.connector
    log('Counter.autoDecId collection', collection)

    mongoConnector.collection("Counter").findAndModify(
      { collection: collection },
      [['_id', 'asc']],
      { $set: { seq: index - 1 } },
      { new: true },
      (err, sequence) => {
        if (err) {
          console.log('error', err)
          cb(err);
        } else {
          console.log('sequence', sequence)
          cb(null, sequence);
        }
      });
  }

  Counter.reset = function (collection, cb) {
    if (!collection) cb(new Error('collection do not specified'))
    Counter.updateAll({
      collection: collection
    }, {
        seq: -1
      }, (err, result) => {
        if (err) cb(err)
        log('Counter reset', result)
        cb(null, result)
      })
  }

  Promise.promisifyAll(Counter, { suffix: 'Promised' })
}
