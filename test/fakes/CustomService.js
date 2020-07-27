// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.


const VideoServiceBase = require('../../lib/services/VideoServiceBase.js');


class CustomService extends VideoServiceBase {

  getDefaultOptions() {
    return { magicNumber: 42 };
  }

  extractVideoID(reference) {
    let match = reference.match(/^https:\/\/example.com\/(.[^/]+)/);
    return match ? match[1] : reference;
  }

  getVideoUrl(videoID) {
    return `https://example.com/embed/${videoID}/${this.options.magicNumber}`;
  }

}


module.exports = CustomService;
