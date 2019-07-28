import typescript from 'rollup-plugin-typescript';

export default {
  input: 'src/App.ts',
  output: {
    file: 'dist/dist.js',
    format: 'cjs'
  },
  plugins: [
    typescript()
  ],
  watch: {
    exclude: ['node_modules/**']
  }
};