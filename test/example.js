
/* eslint-env mocha, es6 */


const Md = require('@gerhobbelt/markdown-it');
const plugin = require('../');


let md = Md({
  html: true,
  linkify: true,
  typography: true
}).use(plugin);

console.log(md.render('![dsds](dsdsads =fill )'));
