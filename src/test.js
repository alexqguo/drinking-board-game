// import { createTiles } from './BoardJsonConverter';
// Test node file for json loading mechanism. to be deleted later
// var json = require('../pokemon.json');
// console.log(json);

(function(){
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 1000;
  canvas.height = 1000;
  canvas.style.background = 'url(./pokemon.png)';
  canvas.style.backgroundSize = '100% 100%';
})();