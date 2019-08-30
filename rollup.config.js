import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

const plugins = [
  typescript(),
  resolve(),
  // terser(), // enable this just for production build once we get to that point
];

export default [{
  input: 'src/App.ts',
  output: {
    file: 'dist/dist.js',
    format: 'iife'
  },
  plugins,
  watch: {
    exclude: ['node_modules/**']
  }
}, {
  input: 'src/wc/index.ts',
  output: {
    file: 'dist/wc.js',
    format: 'iife'
  },
  plugins,
  watch: {
    exclude: ['node_modules/**']
  }
}]