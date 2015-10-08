

module.exports = {
  viewTime, getDaytime, serverTime
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