import app from '../server'

module.exports = function (param) {
  return function pugStatic (req, res, next) {
    console.log('what', app)
    console.log('privet pacani')
    next()
  }
}
