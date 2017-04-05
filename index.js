'use strict'

const artTpl = require('./tpl/art.hbs');

import 'whatwg-fetch';
import Promise from 'promise-polyfill';
import font from 'google-fonts';

const OF_PATH = 'https://api.openframe.io/v0/frames/';
const PORTRAIT_URI = OF_PATH + '58e15977a9c1b11803b242b5';
const LANDSCAPE_URI = OF_PATH + '58e15977a9c1b11803b242b5';

const wrapEl = document.createElement('div');
const portraitEl = document.createElement('div');
const landscapeEl = document.createElement('div');

let portraitObj;
let landscapeObj;

font({
  'Overpass': true
});

const getJson = () => {
  let portraitPromise = fetch(PORTRAIT_URI).then((resp) => resp.json() );
  let landscapePromise = fetch(LANDSCAPE_URI).then((resp) => resp.json() );

  return Promise.all([portraitPromise, landscapePromise]);
}

const jsonLoaded = (json) => {
  portraitObj = json[0].current_artwork;
  landscapeObj = json[1].current_artwork;
  draw();
}

const draw = () => {
  portraitEl.innerHTML = artTpl(portraitObj);
  landscapeEl.innerHTML = artTpl(landscapeObj);
  window.setTimeout(() => getJson().then(jsonLoaded), 5000);
}

wrapEl.id = "wrap";
portraitEl.id = "portrait-art";
landscapeEl.id = "landscape-art";

// add to DOM
wrapEl.appendChild(portraitEl);
wrapEl.appendChild(landscapeEl);
document.body.appendChild(wrapEl);

getJson().then(jsonLoaded);

