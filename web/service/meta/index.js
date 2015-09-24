

function calcTime(offset) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    return new Date(utc + (3600000 * offset));
};

module.exports.timenow = function(){
  
  // must be like:
  // '17:22 KYIV (+2 GMT)';
  
  return calcTime('+2').toString().split(' ')[4].substring(0,5) + ' Kyiv (+2 GMT) ';
}