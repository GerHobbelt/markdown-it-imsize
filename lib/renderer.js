// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";

// eslint-disable-next-line no-unused-vars
function renderer(tokens, idx, options = {}, _env) {
  let embedToken = tokens[idx];
  let service = embedToken.info.service;

  let optionsMerged = embedToken.info.serviceOptions;

  let reference = embedToken.info.reference;

  return service.getEmbedCode(reference, optionsMerged);
}

module.exports = renderer;
