'use strict';

var typeMap = {};
var types = require('./types');

Object.keys(types).forEach(function(type) {
    typeMap[type] = types[type].detect;
});

module.exports = function(buffer, filepath) {
  var type, result;
  for (type in typeMap) {
    if (type in typeMap) {
      result = typeMap[type](buffer, filepath);
      if (result) {
        return type;
      }
    }
  }
  throw new TypeError('Unsupported type');
};
