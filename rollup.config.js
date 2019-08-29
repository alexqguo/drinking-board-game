import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';

export default [{
  input: 'src/App.ts',
  output: {
    file: 'dist/dist.js',
    format: 'iife'
  },
  plugins: [
    typescript(),
    minify({ comments: false }),
  ],
  watch: {
    exclude: ['node_modules/**']
  }
}, { // todo: fix this to not be specific
  input: 'src/wc/index.ts',
  output: {
    file: 'dist/wc.js',
    format: 'iife'
  },
  plugins: [
    resolve(), // to be able to source lit-element
    minify({ comments: false }),
  ],
  watch: {
    exclude: ['node_modules/**']
  }
}]