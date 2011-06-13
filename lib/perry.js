var querystring = require('querystring');
var Perry = {};

module.exports = Perry;

Perry.stringify = function(obj, sep, eq, bo, bc, prefix) {
  sep = sep || '&';
  eq = eq || '=';
  bo = bo || '[';
  bc = bc || ']';
  obj = (obj === null) ? undefined : obj;
  
  return Object.keys(obj).map(function(i) {
    var key = prefix ? 
      prefix + bo + Perry.escape(i) + bc : 
      Perry.escape(i);
    var value = obj[i];
    
    return typeof value == 'object' ? 
      Perry.stringify(value, sep, eq, bo, bc, key) :
      key + eq + Perry.escape(value);
  }).join(sep);
}

Perry.parse = function(str, sep, eq, bo, bc) {
  sep = sep || '&';
  eq = eq || '=';
  bo = bo || '[';
  bc = bc || ']';
  str = str || '';
  
  function implode(array, value) {
    var obj = {};
    if(array.length) {
      obj[array.shift()] = implode(array, value);
    } else {
      return value;
    }
    return obj;
  }

  function mergeRecursive(targetObj, sourceObj) {
    // help from http://viktorbezdek.com/post/3443234398/js-snippet-recursively-merging-two-objects-in-js
    Object.keys(sourceObj).forEach(function(property) {
      targetObj[property] = (sourceObj[property].constructor == Object && targetObj[property]) 
        ? mergeRecursive(targetObj[property], sourceObj[property])
        : sourceObj[property];
    });
    return targetObj;
  }
  
  var obj = {};
  str.split(sep).forEach(function(chunk) {
    var parts = chunk.match(new RegExp("(^.*?)[" + eq + "](.*)"));
    var key = parts[1];
    var val = Perry.unescape(parts[2],true);
    
    // thanks to @mkorfmann for this awesome regex solution!
    var exploded = [];
    var regex = new RegExp("\\" + bo + "?(.*?)[\\" + bc + "\\" + bo + "]","g");
    while((match = regex.exec(key)) != null) {
      exploded.push(Perry.unescape(match[1],true));
    }
    
    if(exploded.length > 1) {
      obj = mergeRecursive(obj,implode(exploded, val));
    } else {
      obj[Perry.unescape(key,true)] = val;
    }
  });
  return obj;
}

Perry.escape = function(str) {
  return encodeURIComponent(str);
}

Perry.unescape = function(s, decodeSpaces) {
  return querystring.unescapeBuffer(s, decodeSpaces).toString();
};