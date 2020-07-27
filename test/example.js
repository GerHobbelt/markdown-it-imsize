
/* eslint-env mocha, es6 */

let md = require('@gerhobbelt/markdown-it')({
  html: true,
  linkify: true,
  typography: true
}).use(require('../'));

console.log(md.render('![dsds](dsdsads =fill )'));
