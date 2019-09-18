
var isEmpty = function(obj) {
    var p;

    for (p in obj) {
        return false;
    }
    return true;
};


var stringToBool = function(bool) {
  if(typeof bool == 'boolean') {
    return bool;
  }
  if(bool == 'true' ) {
    return true;
  }
  if(bool == 'false') {
    return false
  }
  return null;
}


var isSetDefault = function(v, d) {
    if(typeof v == 'number') {
      return (!Number.isNaN(v)) ? v : d;
    }
    return (v !== null && v !== undefined) ? v : d;
};

module.exports = {
  isEmpty,
  stringToBool,
  isSetDefault
}
