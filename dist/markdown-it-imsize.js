!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports["markdown-it-imsize.js"]=r():e["markdown-it-imsize.js"]=r()}(window,(function(){return function(e){var r={};function t(o){if(r[o])return r[o].exports;var n=r[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,t),n.l=!0,n.exports}return t.m=e,t.c=r,t.d=function(e,r,o){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)t.d(o,n,function(r){return e[r]}.bind(null,n));return o},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=0)}([function(e,r,t){"use strict";var o=t(1);e.exports=function(e,r){e.inline.ruler.before("emphasis","image",function(e,r){return function(r,t){var n,i,s,c,u,a,f,p,l,d,h,v,m="",b="",k="",x=r.pos,y=r.posMax;if(33!==r.src.charCodeAt(r.pos))return!1;if(91!==r.src.charCodeAt(r.pos+1))return!1;if(u=r.pos+2,(c=e.helpers.parseLinkLabel(r,r.pos+1,!1))<0)return!1;if((a=c+1)<y&&40===r.src.charCodeAt(a)){for(a++;a<y&&(32===(i=r.src.charCodeAt(a))||10===i);a++);if(a>=y)return!1;for(v=a,(p=e.helpers.parseLinkDestination(r.src,a,r.posMax)).ok&&(k=r.md.normalizeLink(p.str),r.md.validateLink(k)?a=p.pos:k=""),v=a;a<y&&(32===(i=r.src.charCodeAt(a))||10===i);a++);if(p=e.helpers.parseLinkTitle(r.src,a,r.posMax),a<y&&v!==a&&p.ok)for(l=p.str,a=p.pos;a<y&&(32===(i=r.src.charCodeAt(a))||10===i);a++);else l="";if(a-1>=0&&32===(i=r.src.charCodeAt(a-1)))for((p=o(r.src,a,r.posMax)).ok&&(m=p.width,b=p.height,a=p.pos);a<y&&(32===(i=r.src.charCodeAt(a))||10===i);a++);if(a>=y||41!==r.src.charCodeAt(a))return r.pos=x,!1;a++}else{if(void 0===r.env.references)return!1;for(;a<y&&(32===(i=r.src.charCodeAt(a))||10===i);a++);if(a<y&&91===r.src.charCodeAt(a)?(v=a+1,(a=e.helpers.parseLinkLabel(r,a))>=0?s=r.src.slice(v,a++):a=c+1):a=c+1,s||(s=r.src.slice(u,c)),!(f=r.env.references[e.utils.normalizeReference(s)]))return r.pos=x,!1;k=f.href,l=f.title}if(!t){r.pos=u,r.posMax=c;var A=new r.md.inline.State(r.src.slice(u,c),r.md,r.env,h=[]);A.md.inline.tokenize(A),(d=r.push("image","img",0)).attrs=n=[["src",k],["alt",""]],d.children=h,l&&n.push(["title",l]),""!==m&&n.push(["width",m]),""!==b&&n.push(["height",b])}return r.pos=a,r.posMax=y,!0}}(e))}},function(e,r,t){"use strict";function o(e,r,t){var o,n=r,i={ok:!1,pos:r,value:""};for(o=e.charCodeAt(r);r<t&&o>=48&&o<=57||37===o;)o=e.charCodeAt(++r);return i.ok=!0,i.pos=r,i.value=e.slice(n,r),i}e.exports=function(e,r,t){var n,i={ok:!1,pos:0,width:"",height:""};if(r>=t)return i;if(61!==(n=e.charCodeAt(r)))return i;if(r++,n=e.charCodeAt(r),0===e.slice(r,t).indexOf("fill"))return i.width="100%",i.height="100%",i.pos=r+"fill".length,i.ok=!0,i;if(120!==n&&(n<48||n>57))return i;var s=o(e,r,t);if(r=s.pos,120!==(n=e.charCodeAt(r))&&s.value)return i.width=s.value,i.pos=r,i.ok=!0,i;if(120!==n)return i;var c=o(e,++r,t);return r=c.pos,i.width=s.value,i.height=c.value,i.pos=r,i.ok=!0,i}}])}));