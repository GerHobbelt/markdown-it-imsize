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

  let pointer = { line: startLine, pos: startPos };

  // Block embed must be at start of input or the previous line must be blank.
  if (startLine !== 0) {
    let prevLineStartPos = state.bMarks[startLine - 1] + state.tShift[startLine - 1];
    let prevLineMaxPos = state.eMarks[startLine - 1];
    if (prevLineMaxPos > prevLineStartPos) return false;
  }

  // Identify as being a potential block embed.
  if (maxPos - startPos < 2) return false;
  if (SYNTAX_CODES[0] !== state.src.charCodeAt(pointer.pos++)) return false;

  // Read service name from within square brackets.
  if (SYNTAX_CODES[1] !== state.src.charCodeAt(pointer.pos++)) return false;
  if (!advanceToSymbol(state, endLine, ']', pointer)) return false;

  let tagString = state.src
    .substr(pointer.prevPos, pointer.pos - pointer.prevPos)
    .trim()
    .toLowerCase();
  let m;
  let tagOptions = {};
  let regex = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;
  while ((m = regex.exec(tagString)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    tagOptions[m[1]] = m[2];
  }

  let serviceName = 'unknown';
  regex = /(\S+)\s*.*/g;
  while ((m = regex.exec(tagString)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    serviceName = m[1];
  }

  ++pointer.pos;

  // Lookup service; if unknown, then this is not a known embed!
  let service = this.services[serviceName];
  // console.log(service==true);
  if (!service) return false;

  // Read embed reference from within parenthesis.
  if (SYNTAX_CODES[3] !== state.src.charCodeAt(pointer.pos++)) return false;
  if (!advanceToSymbol(state, endLine, ')', pointer)) return false;

  let videoReference = state.src
    .substr(pointer.prevPos, pointer.pos - pointer.prevPos)
    .trim();

  ++pointer.pos;

  // Do not recognize as block element when there is trailing text.
  maxPos = state.eMarks[pointer.line];
  let trailingText = state.src
    .substr(pointer.pos, maxPos - pointer.pos)
    .trim();
  if (trailingText !== '') return false;

  // Block embed must be at end of input or the next line must be blank.
  if (endLine !== pointer.line + 1) {
    let nextLineStartPos = state.bMarks[pointer.line + 1] + state.tShift[pointer.line + 1];
    let nextLineMaxPos = state.eMarks[pointer.line + 1];
    if (nextLineMaxPos > nextLineStartPos) return false;
  }

  if (pointer.line >= endLine) return false;

  if (!silent) {
    let token = state.push('video', 'div', 0);
    // object for storing and passing what we know about the player instance dimensions
    let videoDimensionsInfo = {};
    // configuration option allows us to parse player size for individual player instances
    if (this.options.allowInstancePlayerSizeDefinition === true) {
      const videoReferenceComponents = videoReference.split('##');
      if (videoReferenceComponents.length > 1) {
        // first component is url / ID
        videoReference = videoReferenceComponents[0];
        // second component is size information
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
        }
        // future: detect if more than 2 components for third (currently unused) option...
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
    token.map = [ startLine, pointer.line + 1 ];

    state.line = pointer.line + 1;
  }

  return true;
}


export default tokenizer;