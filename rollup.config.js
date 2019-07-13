import typescript from 'rollup-plugin-typescript';

export default {
  input: 'src/test.ts',
  output: {
    file: 'dist/dist.js',
    format: 'cjs'
  },
  plugins: [
    typescript()
  ]
};