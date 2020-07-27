// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.



class FacebookService {

  constructor(name, options, env) {
    this.name = name;

    this.env = env;
    this.options = Object.assign(this.getDefaultOptions(), options);
  }

  getDefaultOptions() {
    return { width: 500, height: 500 };
  }

  getEmbedCode(videoID, videoDimensionsInfo, options = {}) {

    let containerClassNames = [];
    if (this.env.options.containerClassName) {
      containerClassNames.push(this.env.options.containerClassName);
    }
    let escapedServiceName = this.env.md.utils.escapeHtml(this.name);
    containerClassNames.push(this.env.options.serviceClassPrefix + escapedServiceName);

    let iframeAttributeList = [];
    iframeAttributeList.push([ 'src', 'https://www.facebook.com/plugins/post.php?href=' + reference ]);

    const instanceOptions = Object.assign({}, this.options, options);
    // console.log();
    Object.entries(instanceOptions).forEach(el => {
      iframeAttributeList.push(el);
      if (el[0] === 'class') {
        containerClassNames.push(el[1]);
      }
    });

    let iframeAttributes = iframeAttributeList
      .map(pair =>
        pair[1] !== undefined
          ? `${pair[0]}="${pair[1]}"`
          : pair[0]
      )
      .join(' ');

    return `<div class="${containerClassNames.join(' ')}">`
      + `<iframe ${iframeAttributes}></iframe>`
      + '</div>\n';
  }

}


export default FacebookService;
