'use strict'

const artTpl = require('./tpl/art.hbs');

import 'whatwg-fetch';
import Promise from 'promise-polyfill';
import font from 'google-fonts';

// openframe api
const OF_PATH = 'https://api.openframe.io/v0/frames/';
const PORTRAIT_URI = OF_PATH + '58e15977a9c1b11803b242b5';
const LANDSCAPE_URI = OF_PATH + '58e5466ab2462d7382b8f152';

// accuweather api
const ACCUWEATHER_API_KEY = 'ZADT76zsY52YqATKgIZGAaGpe6rOjW7w';
const LOCATION_CODE = '331530'; // madison
const ACCUWEATHER_URI = 'http://dataservice.accuweather.com/currentconditions/v1/' + LOCATION_CODE + '?apikey=' + ACCUWEATHER_API_KEY;

const HASH_REGEX = /#([ab])/;

let body = document.getElementsByTagName('body')[0];
let wrapEl = document.getElementById('wrap');
let portraitEl = document.getElementById('a');
let landscapeEl = document.getElementById('b');

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
  if(json.length > 1) {
    portraitObj = json[0].current_artwork;
    landscapeObj = json[1].current_artwork;
    draw();
  }
}

const draw = () => {
  portraitEl.innerHTML = artTpl(portraitObj);
  landscapeEl.innerHTML = artTpl(landscapeObj);
  window.setTimeout(() => getJson().then(jsonLoaded), 5000);
}

const removeSelected = () => {
  let selected = document.querySelectorAll('.selected');
  for(var el of selected) {
    el.classList.remove('selected');
  }
}

const handleHash = () => { 
  if(HASH_REGEX.test(window.location.hash)) {
    // counteract default hash behavior

    let m = HASH_REGEX.exec(window.location.hash);
    let selectEl = document.getElementById(m[1]);

    // remove currently selected

    removeSelected();

    console.log(selectEl);

    selectEl.classList.add('selected');

    // hide when screen is tapped/clicked
    document.body.addEventListener('click', removeSelected);

  }
}

// set colors based on night/day
fetch(ACCUWEATHER_URI)
  .then((resp) => resp.json())
  .then((data) => {
    const dayTime = data[0].IsDayTime;
    if(dayTime) {
      body.classList.remove('night');
    } else {
      body.classList.add('night');
    }
  });

getJson().then(jsonLoaded);


window.addEventListener('hashchange', handleHash);
window.scrollTo(0, 0);
handleHash();