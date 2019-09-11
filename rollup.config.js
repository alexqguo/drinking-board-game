import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import copy from 'rollup-plugin-copy'

const plugins = [
  typescript(),
  resolve(),
  terser(), // enable this just for production build once we get to that point
];

export default [
// Core app
{
  input: 'src/engine/App.ts',
  output: {
    file: 'public/dist.js',
    format: 'umd',
    name: 'drinking',
  },
  plugins,
  watch: {
    exclude: ['node_modules/**']
  }
}, 

// Web components
{
  input: 'src/components/index.ts',
  output: {
    file: 'public/comp.js',
    format: 'iife'
  },
  plugins,
  watch: {
    exclude: ['node_modules/**']
  }
},

// Extensions
// TODO: loop this once we have more than 1
{
  input: 'games/pokemon-gen1/index.ts',
  output: {
    file: 'public/pokemon-gen1/index.js',
    format: 'umd',
  },
  plugins: [
    ...plugins,
    copy({
      targets: [
        { src: 'games/pokemon-gen1/index.png', dest: 'public/pokemon-gen1' },
        { src: 'games/pokemon-gen1/index.json', dest: 'public/pokemon-gen1' }
      ]
    }),
  ],
  watch: {
    exclude: ['node_modules/**']
  }
}]