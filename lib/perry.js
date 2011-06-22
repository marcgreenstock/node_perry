var querystring = require('querystring');
var Perry = exports;

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
  
  var eql_regex = new RegExp("(^.*?)[" + eq + "](.*)");
  var arr_regex = new RegExp("\\" + bo + "?(.*?)[\\" + bc + "\\" + bo + "]","g"); // thanks @mkorfmann for this solution
  
  var empty_index = {};
  var obj = {};
  str.split(sep).forEach(function(chunk) {
    var parts = chunk.match(eql_regex);
    var key = parts[1];
    var val = Perry.unescape(parts[2], true);
    
    var flat_keys = [];
    while((match = arr_regex.exec(key)) != null) {
      if(match[1] == '') {
        empty_index[flat_keys.join('_')] = empty_index[flat_keys.join('_')] || 0;
        match[1] = empty_index[flat_keys.join('_')];
        empty_index[flat_keys.join('_')]++;
      }      
      flat_keys.push(Perry.unescape(match[1].toString(), true));
    }
    
    if(flat_keys.length) {
      obj = Perry.mergeRecursive(obj, Perry.constructObj(flat_keys, val));
    } else {
      obj[Perry.unescape(key, true)] = val;
    }
  });
  return Perry.numericIndexedObjectToArray(obj);
}

Perry.escape = function(str) {
  return encodeURIComponent(str);
}

Perry.unescape = function(s, decodeSpaces) {
  return querystring.unescapeBuffer(s, decodeSpaces).toString();
};

Perry.numericIndexedObjectToArray = function(obj) {
  var array = [];
  if(typeof obj == 'object') {
    if(Array.isArray(obj)) {
      obj.forEach(function(value,key) {
        array[key] = Perry.numericIndexedObjectToArray(value);
      });
    } else if(Object.keys(obj).every(function(key) { return key == parseInt(key, 10); })) {
      Object.keys(obj).forEach(function(key) {
        array[key] = Perry.numericIndexedObjectToArray(obj[key]);
      });
    } else {
      Object.keys(obj).forEach(function(key) {
        obj[key] = Perry.numericIndexedObjectToArray(obj[key]);
      });
    }
  }
  return array.length ? array : obj;
}

Perry.constructObj = function(array, value) {
  var obj = {};
  if(array.length) {
    obj[array.shift()] = Perry.constructObj(array, value);
  } else {
    return value;
  }
  return obj;
}

Perry.mergeRecursive = function(targetObj, sourceObj) {
  Object.keys(sourceObj).forEach(function(property) {
    targetObj[property] = (sourceObj[property].constructor == Object && targetObj[property]) 
      ? Perry.mergeRecursive(targetObj[property], sourceObj[property])
      : sourceObj[property];
  });
  return targetObj;
}
  