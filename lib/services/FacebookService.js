// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


class FacebookService {

  constructor(name, options, env) {
    this.name = name;
    this.options = Object.assign(this.getDefaultOptions(), options);
    this.env = env;
  }
  getDefaultOptions() {
    return { width: 500, height: 500 };
  }


  getEmbedCode(reference) {
    let containerClassNames = [];
    if (this.env.options.containerClassName) {
      containerClassNames.push(this.env.options.containerClassName);
    }
    let escapedServiceName = this.env.md.utils.escapeHtml(this.name);
    containerClassNames.push(this.env.options.serviceClassPrefix + escapedServiceName);

    let iframeAttributeList = [];
    iframeAttributeList.push([ "src", `https://www.facebook.com/plugins/post.php?href=` + reference ]);

    if (this.env.options.outputPlayerSize === true) {
      if (this.options.width !== undefined && this.options.width !== null) {
        iframeAttributeList.push([ "width", this.options.width ]);
      }
      if (this.options.height !== undefined && this.options.height !== null) {
        iframeAttributeList.push([ "height", this.options.height ]);
      }
    }


    let iframeAttributes = iframeAttributeList
      .map(pair =>
        pair[1] !== undefined
            ? `${pair[0]}="${pair[1]}"`
            : pair[0]
      )
      .join(" ");

    return `<div class="${containerClassNames.join(" ")}">`
    + `<iframe ${iframeAttributes}></iframe>`
  + `</div>\n`;
  }

}


module.exports = FacebookService;
