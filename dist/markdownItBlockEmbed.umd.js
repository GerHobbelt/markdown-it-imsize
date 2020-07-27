/*! markdown-it-block-embed 0.0.3-1 https://github.com//GerHobbelt/markdown-it-block-embed @license MIT */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.markdownitBlockEmbed = factory());
}(this, (function () { 'use strict';

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
  // Licensed under the MIT license. See LICENSE file in the project root.
  function defaultUrlFilter(url, _videoID, _serviceName, _options) {
    return url;
  }

  class VideoServiceBase {
    constructor(name, options, env) {
      this.name = name;
      this.options = Object.assign(this.getDefaultOptions(), options);
      this.env = env;
    }

    getDefaultOptions() {
      return {};
    }

    extractVideoID(reference) {
      return reference;
    }

    getVideoUrl(_videoID) {
      throw new Error('not implemented');
    }

    getFilteredVideoUrl(videoID) {
      let filterUrlDelegate = typeof this.env.options.filterUrl === 'function' ? this.env.options.filterUrl : defaultUrlFilter;
      let videoUrl = this.getVideoUrl(videoID);
      return filterUrlDelegate(videoUrl, this.name, videoID, this.env.options);
    }

    getEmbedCode(videoID, videoDimensionsInfo, options = {}) {
      let containerClassNames = [];

      if (this.env.options.containerClassName) {
        containerClassNames.push(this.env.options.containerClassName);
      } // config for 'viewport' element


      const mediaViewportClassName = `${this.env.options.containerClassName}__viewport`;
      let mediaViewportExists = false;
      const mediaViewportAttributeList = [];
      let escapedServiceName = this.env.md.utils.escapeHtml(this.name);
      containerClassNames.push(this.env.options.serviceClassPrefix + escapedServiceName);
      let iframeAttributeList = [];
      iframeAttributeList.push(['type', 'text/html']);
      iframeAttributeList.push(['src', this.getFilteredVideoUrl(videoID)]);
      iframeAttributeList.push(['frameborder', 0]); // collect default player dimensions from config and allow override from player instance, if available

      let playerWidth = videoDimensionsInfo.Width || this.options.width;
      let playerHeight = videoDimensionsInfo.Height || this.options.height; // ouptut width and height if we are configured to do so (and values are valid)

      if (this.env.options.outputPlayerSize === true && (playerWidth || playerHeight)) {
        if (playerWidth !== undefined && playerWidth !== null) {
          iframeAttributeList.push(['width', playerWidth]);
        }

        if (playerHeight !== undefined && playerHeight !== null) {
          iframeAttributeList.push(['height', playerHeight]);
        }
      } else if (this.env.options.outputPlayerAspectRatio === true) {
        // output aspect ratio on media viewport element if we are configured to do so
        // get explicit aspect ratio
        let aspectRatio = videoDimensionsInfo.AspectRatio;

        if (!aspectRatio && playerWidth && playerHeight) {
          // calculate aspect ratio from dimensions
          aspectRatio = playerHeight / playerWidth * 100;
        } // only proceed if we have aspect ratio data


        if (aspectRatio) {
          // need extra container
          mediaViewportExists = true; // aspect ratio is achieved with padding and must go hand-in-hand with other styles (e.g. absolute positioning)

          mediaViewportAttributeList.push(['style', `padding-top: ${aspectRatio}%`]);
        }
      }

      if (this.env.options.allowFullScreen === true) {
        iframeAttributeList.push(['webkitallowfullscreen']);
        iframeAttributeList.push(['mozallowfullscreen']);
        iframeAttributeList.push(['allowfullscreen']);
      }

      const instanceOptions = Object.assign({}, this.options, options); // console.log();

      Object.entries(instanceOptions).forEach(el => {
        iframeAttributeList.push(el);

        if (el[0] === 'class') {
          containerClassNames.push(el[1]);
        }
      });
      let iframeAttributes = iframeAttributeList.map(pair => pair[1] !== undefined ? `${pair[0]}="${pair[1]}"` : pair[0]).join(' ');
      const mediaViewportAttributes = mediaViewportAttributeList.map(pair => pair[1] !== undefined ? `${pair[0]}="${pair[1]}"` : pair[0]).join(' ');
      return `<div class="${containerClassNames.join(' ')}">` + (mediaViewportExists ? `<div class="${mediaViewportClassName}" ${mediaViewportAttributes}>` : '') + `<iframe ${iframeAttributes}></iframe>` + (mediaViewportExists ? '</div>' : '') + '</div>\n';
    }

  }

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors

  class YouTubeService extends VideoServiceBase {
    getDefaultOptions() {
      return {
        width: 640,
        height: 390
      };
    }

    extractVideoID(reference) {
      let match = reference.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/);
      return match && match[7].length === 11 ? match[7] : reference;
    }

    getVideoUrl(videoID) {
      let escapedVideoID = this.env.md.utils.escapeHtml(videoID);
      return `//www.youtube.com/embed/${escapedVideoID}`;
    }

  }

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors

  class VimeoService extends VideoServiceBase {
    getDefaultOptions() {
      return {
        width: 500,
        height: 281,
        isBackground: false
      };
    }

    extractVideoID(reference) {
      let match = reference.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
      return match && typeof match[3] === 'string' ? match[3] : reference;
    }

    getVideoUrl(videoID) {
      let escapedVideoID = this.env.md.utils.escapeHtml(videoID); // construct vimeo player url

      let vimeoUrl = `//player.vimeo.com/video/${escapedVideoID}`; // change url to suit options for player

      if (this.options.isBackground) {
        // background mode
        vimeoUrl += '?background=1';
      }

      return vimeoUrl;
    }

  }

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors

  class VineService extends VideoServiceBase {
    getDefaultOptions() {
      return {
        width: 600,
        height: 600,
        embed: 'simple'
      };
    }

    extractVideoID(reference) {
      let match = reference.match(/^http(?:s?):\/\/(?:www\.)?vine\.co\/v\/([a-zA-Z0-9]{1,13}).*/);
      return match && match[1].length === 11 ? match[1] : reference;
    }

    getVideoUrl(videoID) {
      let escapedVideoID = this.env.md.utils.escapeHtml(videoID);
      let escapedEmbed = this.env.md.utils.escapeHtml(this.options.embed);
      return `//vine.co/v/${escapedVideoID}/embed/${escapedEmbed}`;
    }

  }

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors

  class PreziService extends VideoServiceBase {
    getDefaultOptions() {
      return {
        width: 550,
        height: 400
      };
    }

    extractVideoID(reference) {
      let match = reference.match(/^https:\/\/prezi.com\/(.[^/]+)/);
      return match ? match[1] : reference;
    }

    getVideoUrl(videoID) {
      let escapedVideoID = this.env.md.utils.escapeHtml(videoID);
      return 'https://prezi.com/embed/' + escapedVideoID + '/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0&amp;' + 'landing_data=bHVZZmNaNDBIWnNjdEVENDRhZDFNZGNIUE43MHdLNWpsdFJLb2ZHanI5N1lQVHkxSHFxazZ0UUNCRHloSXZROHh3PT0&amp;' + 'landing_sign=1kD6c0N6aYpMUS0wxnQjxzSqZlEB8qNFdxtdjYhwSuI';
    }

  }

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
  // Licensed under the MIT license. See LICENSE file in the project root.
  class TwitterService {
    constructor(name, options, env) {
      this.name = name;
      this.options = Object.assign(this.getDefaultOptions(), options);
      this.env = env;
    }

    getDefaultOptions() {
      return {
        'data-lang': 'en',
        dir: 'ltr'
      };
    }

    getEmbedCode(videoID, videoDimensionsInfo, options = {}) {
      let containerClassNames = [];

      if (this.env.options.containerClassName) {
        containerClassNames.push(this.env.options.containerClassName);
      }

      let escapedServiceName = this.env.md.utils.escapeHtml(this.name);
      containerClassNames.push(this.env.options.serviceClassPrefix + escapedServiceName);
      let iframeAttributeList = []; // iframeAttributeList.push([ "src", `https://twitframe.com/show?url=` + reference ]);

      const instanceOptions = Object.assign({}, this.options, options); // console.log();

      Object.entries(instanceOptions).forEach(el => {
        iframeAttributeList.push(el);

        if (el[0] === 'class') {
          containerClassNames.push(el[1]);
        }
      });
      let iframeAttributes = iframeAttributeList.map(pair => pair[1] !== undefined ? `${pair[0]}="${pair[1]}"` : pair[0]).join(' ');
      return `<div class="${containerClassNames.join(' ')}">` + `<blockquote class="twitter-tweet" ${iframeAttributes}><p lang="${instanceOptions['data-lang']}" dir="${instanceOptions.dir}"><a href="${videoID}"></a></p></blockquote>` + '</div>\n';
    }

  }

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
  // Licensed under the MIT license. See LICENSE file in the project root.
  class FacebookService {
    constructor(name, options, env) {
      this.name = name;
      this.env = env;
      this.options = Object.assign(this.getDefaultOptions(), options);
    }

    getDefaultOptions() {
      return {
        width: 500,
        height: 500
      };
    }

    getEmbedCode(videoID, videoDimensionsInfo, options = {}) {
      let containerClassNames = [];

      if (this.env.options.containerClassName) {
        containerClassNames.push(this.env.options.containerClassName);
      }

      let escapedServiceName = this.env.md.utils.escapeHtml(this.name);
      containerClassNames.push(this.env.options.serviceClassPrefix + escapedServiceName);
      let iframeAttributeList = [];
      iframeAttributeList.push(['src', 'https://www.facebook.com/plugins/post.php?href=' + reference]);
      const instanceOptions = Object.assign({}, this.options, options); // console.log();

      Object.entries(instanceOptions).forEach(el => {
        iframeAttributeList.push(el);

        if (el[0] === 'class') {
          containerClassNames.push(el[1]);
        }
      });
      let iframeAttributes = iframeAttributeList.map(pair => pair[1] !== undefined ? `${pair[0]}="${pair[1]}"` : pair[0]).join(' ');
      return `<div class="${containerClassNames.join(' ')}">` + `<iframe ${iframeAttributes}></iframe>` + '</div>\n';
    }

  }

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
  // Licensed under the MIT license. See LICENSE file in the project root.
  class GalleryService {
    constructor(name, options, env) {
      this.name = name;
      this.env = env;
      this.options = Object.assign(this.getDefaultOptions(), options);
    }

    getDefaultOptions() {
      return {};
    }

    getEmbedCode(videoID, videoDimensionsInfo, options = {}) {
      let containerClassNames = [];

      if (this.env.options.containerClassName) {
        containerClassNames.push(this.env.options.containerClassName);
      }

      let escapedServiceName = this.env.md.utils.escapeHtml(this.name);
      containerClassNames.push(this.env.options.serviceClassPrefix + escapedServiceName);
      let iframeAttributeList = []; // iframeAttributeList.push([ "src", `https://www.facebook.com/plugins/post.php?href=` + reference ]);

      const instanceOptions = Object.assign({}, this.options, options); // console.log();

      Object.entries(instanceOptions).forEach(el => {
        iframeAttributeList.push(el);
      });
      let iframeAttributes = iframeAttributeList.map(pair => pair[1] !== undefined ? `${pair[0]}="${pair[1]}"` : pair[0]).join(' ');
      return `<div class="${containerClassNames.join(' ')}">` + `[gallery id=${videoID} ${iframeAttributes}][/gallery]` + '</div>\n';
    }

  }

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
  // Licensed under the MIT license. See LICENSE file in the project root.
  class MediaService {
    constructor(name, options, env) {
      this.name = name;
      this.env = env;
      this.options = Object.assign(this.getDefaultOptions(), options);
    }

    getDefaultOptions() {
      return {};
    }

    getEmbedCode(videoID, videoDimensionsInfo, options = {}) {
      let containerClassNames = [];

      if (this.env.options.containerClassName) {
        containerClassNames.push(this.env.options.containerClassName);
      }

      let escapedServiceName = this.env.md.utils.escapeHtml(this.name);
      containerClassNames.push(this.env.options.serviceClassPrefix + escapedServiceName);
      let iframeAttributeList = []; // iframeAttributeList.push([ "src", `https://www.facebook.com/plugins/post.php?href=` + reference ]);

      const instanceOptions = Object.assign({}, this.options, options); // console.log();

      Object.entries(instanceOptions).forEach(el => {
        iframeAttributeList.push(el);

        if (el[0] === 'class') {
          containerClassNames.push(el[1]);
        }
      });
      let iframeAttributes = iframeAttributeList.map(pair => pair[1] !== undefined ? `${pair[0]}="${pair[1]}"` : pair[0]).join(' ');
      return `<div class="${containerClassNames.join(' ')}">` + `[media id=${videoID} ${iframeAttributes}][/media]` + '</div>\n';
    }

  }

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors

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

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
  // Licensed under the MIT license. See LICENSE file in the project root.
  // eslint-disable-next-line no-unused-vars
  function renderer(tokens, idx, options = {}, _env) {
    let videoToken = tokens[idx];
    let service = videoToken.info.service;
    let videoID = videoToken.info.videoID;
    let videoDimensionsInfo = videoToken.info.videoDimensionsInfo;
    let optionsMerged = videoToken.info.serviceOptions;
    return service.getEmbedCode(videoID, videoDimensionsInfo, optionsMerged);
  }

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
  // Licensed under the MIT license. See LICENSE file in the project root.
  const SYNTAX_CHARS = '@[]()'.split('');
  const SYNTAX_CODES = SYNTAX_CHARS.map(char => char.charCodeAt(0));

  function advanceToSymbol(state, endLine, symbol, pointer) {
    let maxPos = null;
    let symbolLine = pointer.line;
    let symbolIndex = state.src.indexOf(symbol, pointer.pos);
    if (symbolIndex === -1) return false;
    maxPos = state.eMarks[pointer.line];

    while (symbolIndex >= maxPos) {
      ++symbolLine;
      maxPos = state.eMarks[symbolLine];
      if (symbolLine >= endLine) return false;
    }

    pointer.prevPos = pointer.pos;
    pointer.pos = symbolIndex;
    pointer.line = symbolLine;
    return true;
  }

  function tokenizer(state, startLine, endLine, silent) {
    let startPos = state.bMarks[startLine] + state.tShift[startLine];
    let maxPos = state.eMarks[startLine];
    let pointer = {
      line: startLine,
      pos: startPos
    }; // Block embed must be at start of input or the previous line must be blank.

    if (startLine !== 0) {
      let prevLineStartPos = state.bMarks[startLine - 1] + state.tShift[startLine - 1];
      let prevLineMaxPos = state.eMarks[startLine - 1];
      if (prevLineMaxPos > prevLineStartPos) return false;
    } // Identify as being a potential block embed.


    if (maxPos - startPos < 2) return false;
    if (SYNTAX_CODES[0] !== state.src.charCodeAt(pointer.pos++)) return false; // Read service name from within square brackets.

    if (SYNTAX_CODES[1] !== state.src.charCodeAt(pointer.pos++)) return false;
    if (!advanceToSymbol(state, endLine, ']', pointer)) return false;
    let tagString = state.src.substr(pointer.prevPos, pointer.pos - pointer.prevPos).trim().toLowerCase();
    let m;
    let tagOptions = {};
    let regex = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;

    while ((m = regex.exec(tagString)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      } // The result can be accessed through the `m`-variable.


      tagOptions[m[1]] = m[2];
    }

    let serviceName = 'unknown';
    regex = /(\S+)\s*.*/g;

    while ((m = regex.exec(tagString)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      } // The result can be accessed through the `m`-variable.


      serviceName = m[1];
    }

    ++pointer.pos; // Lookup service; if unknown, then this is not a known embed!

    let service = this.services[serviceName]; // console.log(service==true);

    if (!service) return false; // Read embed reference from within parenthesis.

    if (SYNTAX_CODES[3] !== state.src.charCodeAt(pointer.pos++)) return false;
    if (!advanceToSymbol(state, endLine, ')', pointer)) return false;
    let videoReference = state.src.substr(pointer.prevPos, pointer.pos - pointer.prevPos).trim();
    ++pointer.pos; // Do not recognize as block element when there is trailing text.

    maxPos = state.eMarks[pointer.line];
    let trailingText = state.src.substr(pointer.pos, maxPos - pointer.pos).trim();
    if (trailingText !== '') return false; // Block embed must be at end of input or the next line must be blank.

    if (endLine !== pointer.line + 1) {
      let nextLineStartPos = state.bMarks[pointer.line + 1] + state.tShift[pointer.line + 1];
      let nextLineMaxPos = state.eMarks[pointer.line + 1];
      if (nextLineMaxPos > nextLineStartPos) return false;
    }

    if (pointer.line >= endLine) return false;

    if (!silent) {
      let token = state.push('video', 'div', 0); // object for storing and passing what we know about the player instance dimensions

      let videoDimensionsInfo = {}; // configuration option allows us to parse player size for individual player instances

      if (this.options.allowInstancePlayerSizeDefinition === true) {
        const videoReferenceComponents = videoReference.split('##');

        if (videoReferenceComponents.length > 1) {
          // first component is url / ID
          videoReference = videoReferenceComponents[0]; // second component is size information
          // either a width/height or a single aspect ratio value (as height percentage of width)
          // find if is a string split by 'x' i.e. XXXxYYY

          const videoDimensionsComponents = videoReferenceComponents[1].split('x');

          if (videoDimensionsComponents.length === 2) {
            // should be width and height
            videoDimensionsInfo.Width = videoDimensionsComponents[0];
            videoDimensionsInfo.Height = videoDimensionsComponents[1];
          } else if (videoDimensionsComponents.length === 1) {
            // should be aspect ratio (assume int)
            videoDimensionsInfo.AspectRatio = videoDimensionsComponents[0];
          } // future: detect if more than 2 components for third (currently unused) option...

        }
      }

      token.markup = state.src.slice(startPos, pointer.pos);
      token.block = true;
      token.info = {
        serviceName: serviceName,
        service: service,
        videoReference: videoReference,
        serviceOptions: tagOptions,
        videoID: service.extractVideoID(videoReference),
        videoDimensionsInfo: videoDimensionsInfo
      };
      token.map = [startLine, pointer.line + 1];
      state.line = pointer.line + 1;
    }

    return true;
  }

  // Copyright (c) Rotorz Limited and portions by original markdown-it-video authors

  function setup(md, options) {
    let env = new PluginEnvironment(md, options);
    md.block.ruler.before('fence', 'embed', tokenizer.bind(env), {
      alt: ['paragraph', 'reference', 'blockquote', 'list']
    });
    md.renderer.rules.embed = renderer.bind(env);
  }

  return setup;

})));
//# sourceMappingURL=markdownItBlockEmbed.umd.js.map
