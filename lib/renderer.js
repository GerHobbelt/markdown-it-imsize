// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";

// eslint-disable-next-line no-unused-vars
function renderer(tokens, idx, options = {}, _env) {
  let videoToken = tokens[idx];

  let service = videoToken.info.service;
  let videoID = videoToken.info.videoID;
  let videoDimensionsInfo = videoToken.info.videoDimensionsInfo;

  let optionsMerged = videoToken.info.serviceOptions;

  return service.getEmbedCode(videoID, videoDimensionsInfo, optionsMerged);
}

module.exports = renderer;
