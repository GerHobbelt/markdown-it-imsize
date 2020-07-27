
/* eslint-env mocha, es6 */

let path = require('path');
let generate = require('@gerhobbelt/markdown-it-testgen');
const Md = require('@gerhobbelt/markdown-it');
const plugin = require('../');

describe('markdown-it-imsize', function () {
  let md = Md({
    html: true,
    linkify: true,
    typography: true
  }).use(plugin);
  generate(path.join(__dirname, 'fixtures/markdown-it-imsize/imsize.txt'), md);
});

describe('markdown-it-imsize (autofill)', function () {
  let md = Md({
    html: true,
    linkify: true,
    typography: true
  }).use(plugin, { autofill: true });
  generate(path.join(__dirname, 'fixtures/markdown-it-imsize/autofill.txt'), md);
});

