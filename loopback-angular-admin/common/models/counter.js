'use strict'
import Promise from 'bluebird'

module.exports = function (Counter) {

  Counter.initAutoInc = function(collection, cb) {

    const AutoInc = {
      "seq" : 0,
      "collection" : collection
    }

    return Counter.findOrCreate({
      where: {
        collection: collection
      }
    }, AutoInc, cb)
  }

  Counter.autoIncId = function(collection, instance, next) {
    let mongoConnector = Counter.app.dataSources.db.connector
    console.log('collection', collection)
    mongoConnector.collection("Counter").findAndModify(
      { collection: collection },
      [ ['_id', 'asc'] ],
      { $inc: { seq: 1 }},
      { new: true },
      (err, sequence) => {
        if(err) {
          console.log('error', err)
          next (err);
        } else {
          console.log('sequence', sequence)
          // Do what I need to do with new incremented value sequence.value
          //Save the tweet id with autoincrement..
          instance.index = sequence.value.seq;
          next(null, instance);
        }
    });
  }

  Promise.promisifyAll(Counter, { suffix: 'Promised' })
}
