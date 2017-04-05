'use strict'

import 'whatwg-fetch';
import Promise from 'promise-polyfill'; 

const OF_PATH = 'https://api.openframe.io/v0/frames/';
const PORTRAIT_URI = OF_PATH + '58e15977a9c1b11803b242b5';
const LANDSCAPE_URI = OF_PATH + '58e15977a9c1b11803b242b5';

let portraitArt;
let landscapeArt;

const getJson = () => {
  let portraitPromise = fetch(PORTRAIT_URI).then((resp) => resp.json() );
  let landscapePromise = fetch(LANDSCAPE_URI).then((resp) => resp.json() );

  return Promise.all([portraitPromise, landscapePromise]);
}

const jsonLoaded = (json) => {
  portraitArt = json[0].current_artwork;
  landscapeArt = json[1].current_artwork;
  draw();
}

const draw = () => {
  console.log(portraitArt, landscapeArt);
  window.setTimeout(() => getJson().then(jsonLoaded), 5000);
}

getJson().then(jsonLoaded);

