import typescript from 'rollup-plugin-typescript';

export default [{
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
}, { // todo: fix this to not be specific
  input: 'src/wc/DiceRoll.js',
  output: {
    file: 'dist/diceRoll.js',
    format: 'cjs'
  },
  plugins: [
  ],
  watch: {
    exclude: ['node_modules/**']
  }
}]