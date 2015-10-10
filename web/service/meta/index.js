'use strict'
class fDate {
  constructor (number) {
    this.year = new Date(number).getFullYear();
    this.month = new Date(number).getMonth() + 1;
    this.day = new Date(number).getDate ();
    this.hours = new Date(number).getHours();
    this.minutes = new Date(number).getMinutes();
    this.seconds = new Date(number).getSeconds();
    this.zerofy();
  }
  get obj () { return this; }

  parse (string) {

  }
  zerofy (date) {
    for (let key in this) {
      this[key] = this[key] < 10 ? '0' + this[key] : this[key].toString() }
    }
}

class fDuration {
  constructor (number) {
    this.hours = parseInt(number/3600);
    this.minutes = (number - this.hours*3600)/60;
    this.zerofy();
  }
  get obj () { return this; }

  zerofy (date) {
    for (let key in this) {
      this[key] = this[key] < 10 ? '0' + this[key] : this[key].toString() }
    }
}

module.exports = {
  viewTime, getDaytime, serverTime, fDate, fDuration
}

function viewTime() {
  
  // must be like:
  // '17:22 KYIV (+2 GMT)';
  
  return calcTime('+2').toString().split(' ')[4].substring(0,5) + ' Kyiv (+2 GMT) ';
}

function getDaytime(ms) {
  ms = ms || new Date();
  var hours = new Date(ms).getHours();

  return (hours < 22 && hours >= 7)
    ? 'day'
    : 'night';
}

function serverTime() {
  return new Date().getTime() - new Date().getSeconds();
}


// Private methods
function calcTime(offset) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    return new Date(utc + (3600000 * offset));
};
