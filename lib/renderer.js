// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


function renderer(tokens, idx, options = {}, _env) {
  let embedToken = tokens[idx];
  options.x = 1;
  let service = embedToken.info.service;

  let reference = embedToken.info.reference;

  return service.getEmbedCode(reference);
}

module.exports = renderer;
