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
  
  /*
    Thanks to:
    http://viktorbezdek.com/post/3443234398/js-snippet-recursively-merging-two-objects-in-js
  */
  
  function mergeRecursive(targetObject, sourceObject) {
    for(var property in sourceObject) {
      try {
        targetObject[property] = (sourceObject[property].constructor == Object) 
                  ? mergeRecursive(targetObject[property], sourceObject[property]) 
                  : sourceObject[property]; 
      } catch(e) {
        targetObject[property] = sourceObject[property];
      }
    }
    return targetObject;  
  }
  
  var obj = {};
  str.split(sep).forEach(function(chunk) {
    var parts = chunk.split(eq);
    
    var exploded = parts[0].substring(0,parts[0].length -1).split(new RegExp("\\" + bo + "|(?:\\" + bc + "\\" + bo + ")")); // thanks @mkorfmann
    if(exploded.length > 1) {
      obj = mergeRecursive(obj,implode(exploded, parts[1]));
    } else {
      obj[parts[0]] = parts[1];
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