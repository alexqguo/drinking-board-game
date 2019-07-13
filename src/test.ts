import { createTiles } from './BoardJsonConverter';
// Test node file for json loading mechanism. to be deleted later
var json = require('../pokemon.json');
// console.log(json);

// console.log(Tile);
const tiles: any = createTiles(json.tiles);
console.log(tiles);