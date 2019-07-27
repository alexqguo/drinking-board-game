// import { createTiles } from './BoardJsonConverter';
// Test node file for json loading mechanism. to be deleted later
// var json = require('../pokemon.json');
// console.log(json);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Option 1: css background image
// probably will not handle scaling very easily
const testPosition = [{
  "x": 260,
  "y": 1770
},{
  "x": 260,
  "y": 1950
},{
  "x": 450,
  "y": 1950
},{
  "x": 450,
  "y": 1770
}];
const imgSrc = 'public/pokemon/index.png';
const img = new Image();
img.src = imgSrc;
img.addEventListener('load', () => {
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.style.background = `url(${imgSrc})`;
  canvas.style.backgroundSize = '100% 100%';

  testPosition.forEach(pos => {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2, true);
    ctx.fill();
  });
});

// Option 2: background within the canvas itself
// const img = new Image();
// img.src = './public/pokemon/index.png';
// img.addEventListener('load', () => {
//   canvas.width = img.width;
//   canvas.height = img.height;
//   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
// });

