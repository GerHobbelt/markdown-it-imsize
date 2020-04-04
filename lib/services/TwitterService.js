// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


class TwitterService {

  constructor(name, options, env) {
    this.name = name;
    this.options = Object.assign(this.getDefaultOptions(), options);
    this.env = env;
  }
  getDefaultOptions() {
    return { "data-lang": "en", "dir": "ltr" };
  }


  getEmbedCode(videoID, videoDimensionsInfo, options = {}) {
    let containerClassNames = [];
    if (this.env.options.containerClassName) {
      containerClassNames.push(this.env.options.containerClassName);
    }
    let escapedServiceName = this.env.md.utils.escapeHtml(this.name);
    containerClassNames.push(this.env.options.serviceClassPrefix + escapedServiceName);

    let iframeAttributeList = [];
    // iframeAttributeList.push([ "src", `https://twitframe.com/show?url=` + reference ]);
    const instanceOptions = Object.assign({}, this.options, options);
    // console.log();
    Object.entries(instanceOptions).forEach(el => {
      iframeAttributeList.push(el);
      if (el[0] == "class") {
        containerClassNames.push(el[1]);
      }
    });

    let iframeAttributes = iframeAttributeList
      .map(pair =>
        pair[1] !== undefined
          ? `${pair[0]}="${pair[1]}"`
          : pair[0]
      )
      .join(" ");

    return `<div class="${containerClassNames.join(" ")}">`
      + `<blockquote class="twitter-tweet" ${iframeAttributes}><p lang="${instanceOptions["data-lang"]}" dir="${instanceOptions["dir"]}"><a href="${videoID}"></a></p></blockquote>`
      + `</div>\n`;
  }

}


module.exports = TwitterService;
