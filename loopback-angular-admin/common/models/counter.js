'use strict'
import Promise from 'bluebird'

module.exports = function (Counter) {

  Counter.initAutoInc = function(collection, cb) {

    const AutoInc = {
      "seq" : -1,
      "collection" : collection
    }

    return Counter.findOrCreate({
      where: {
        collection: collection
      }
    }, AutoInc, cb)
  }

  Counter.autoIncId = function(instance, next) {
    if (!instance) next(new Error('instance do not specified'))
    let mongoConnector = Counter.app.dataSources.db.connector
    mongoConnector.collection("Counter").findAndModify(
      { collection: instance.constructor.definition.name },
      [ ['_id', 'asc'] ],
      { $inc: { seq: 1 }},
      { new: true },
      (err, sequence) => {
        if(err) {
          console.log('error', err)
          next (err);
        } else {
          console.log('sequence', sequence)
          instance.index = sequence.value.seq;
          next(null, instance);
        }
    });
  }

  Counter.autoDecId = function(collection, next) {
    if (!collection) next(new Error('collection do not specified'))
    let mongoConnector = Counter.app.dataSources.db.connector

    mongoConnector.collection("Counter").findAndModify(
    { collection: collection},
    [ ['_id', 'asc'] ],
    { $inc: { seq: -1 }},
    { new: true },
    (err, sequence) => {
      if(err) {
        console.log('error', err)
        next (err);
      } else {
        console.log('sequence', sequence)
        next(null, sequence);
      }
    });
  }

  Promise.promisifyAll(Counter, { suffix: 'Promised' })
}
