// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

import PluginEnvironment from './PluginEnvironment.js';
import renderer from './renderer.js';
import tokenizer from './tokenizer.js';


function setup(md, options) {
  let env = new PluginEnvironment(md, options);

  md.block.ruler.before('fence', 'embed', tokenizer.bind(env), {
    alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
  });
  md.renderer.rules.embed = renderer.bind(env);
}


export default setup;
