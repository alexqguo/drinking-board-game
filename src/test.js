// import { createTiles } from './BoardJsonConverter';
// Test node file for json loading mechanism. to be deleted later
// var json = require('../pokemon.json');
// console.log(json);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 1200;

// Option 1: css background image
// probably will not handle scaling very easily
// canvas.style.background = 'url(./pokemon.png)';
// canvas.style.backgroundSize = '100% 100%';

// Option 2: background within the canvas itself
const img = new Image();
img.src = './public/pokemon/index.png';
img.addEventListener('load', () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
});

// assumes a square board
function calculateSize() {
  const size = Math.min(window.innerHeight, window.innerWidth);
  canvas.width = size;
  canvas.height = size;
}

// window.addEventListener('resize', calculateSize);
// calculateSize();

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
ctx.fillStyle = '#ff2626';
testPosition.forEach(pos => {
  ctx.beginPath();
  ctx.arc(50, 500, 10, 0, Math.PI * 2, true);
  // ctx.stroke();
  ctx.fill();
});