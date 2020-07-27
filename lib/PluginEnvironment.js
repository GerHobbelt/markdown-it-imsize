// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

import YouTubeService from './services/YouTubeService.js';
import VimeoService from './services/VimeoService.js';
import VineService from './services/VineService.js';
import PreziService from './services/PreziService.js';
import TwitterService from './services/TwitterService.js';
import FacebookService from './services/FacebookService.js';
import GalleryService from './services/GalleryService.js';
import MediaService from './services/MediaService.js';

class PluginEnvironment {

  constructor(md, options) {
    this.md = md;
    this.options = Object.assign(this.getDefaultOptions(), options);

    this._initServices();
  }

  _initServices() {
    let defaultServiceBindings = {
      youtube: YouTubeService,
      vimeo: VimeoService,
      vine: VineService,
      prezi: PreziService,
      twitter: TwitterService,
      facebook: FacebookService,
      gallery: GalleryService,
      media: MediaService
    };

    let serviceBindings = Object.assign({}, defaultServiceBindings, this.options.services);
    let services = {};
    for (let serviceName of Object.keys(serviceBindings)) {
      let _serviceClass = serviceBindings[serviceName];
      services[serviceName] = new _serviceClass(serviceName, this.options[serviceName], this);
    }

    this.services = services;
  }

  getDefaultOptions() {
    return {
      containerClassName: 'block-embed',
      serviceClassPrefix: 'block-embed-service-',
      outputPlayerSize: true,
      outputPlayerAspectRatio: false,
      allowInstancePlayerSizeDefinition: false,
      allowFullScreen: true,
      filterUrl: null
    };
  }

}


export default PluginEnvironment;
