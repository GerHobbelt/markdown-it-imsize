'use strict';

var assert = require('assert');
var path = require('path');
var generate = require('@gerhobbelt/markdown-it-testgen');
var should = require('should');

describe('markdown-it-imsize', function() {
  var md = require('@gerhobbelt/markdown-it')({
    html: true,
    linkify: true,
    typography: true
  }).use(require('../lib'));
  generate(path.join(__dirname, 'fixtures/markdown-it-imsize/imsize.txt'), md);
});

describe('markdown-it-imsize (autofill)', function() {
  var md = require('@gerhobbelt/markdown-it')({
    html: true,
    linkify: true,
    typography: true
  }).use(require('../lib'), { autofill: true });
  generate(path.join(__dirname, 'fixtures/markdown-it-imsize/autofill.txt'), md);
});

