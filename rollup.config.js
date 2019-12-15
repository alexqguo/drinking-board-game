import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import copy from 'rollup-plugin-copy'

// TODO: minify JSON in production build

const basePlugins = [
  typescript(),
  resolve(),
  process.env.NODE_ENV !== 'development' ? terser() : undefined,
];

const createCustomGameConfiguration = (prefix) => {
  return {
    input: `games/${prefix}/index.ts`,
    output: {
      file: `public/${prefix}/index.js`,
      format: 'umd',
      name: prefix,
    },
    plugins: [
      ...basePlugins,
      copy({
        targets: [
          { src: `games/${prefix}/index.png`, dest: `public/${prefix}` },
          { src: `games/${prefix}/index.json`, dest: `public/${prefix}` },
          { src: `games/${prefix}/battle.mp3`, dest: `public/${prefix}`},
          { src: `games/${prefix}/victory.mp3`, dest: `public/${prefix}`},
        ]
      }),
    ],
    watch: {
      exclude: ['node_modules/**']
    }
  };
};

export default [
  // Core app
  {
    input: 'src/engine/App.ts',
    output: {
      file: 'public/dist.js',
      format: 'umd',
      name: 'drinking',
    },
    plugins: basePlugins,
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
    plugins: basePlugins,
    watch: {
      exclude: ['node_modules/**']
    }
  },

  // join.js for the join game page
  {
    input: 'src/join/index.ts',
    output: {
      file: 'public/join.js',
      format: 'iife',
    },
    plugins: basePlugins,
    watch: {
      exclude: ['node_modules/**'],
    },
  },

  createCustomGameConfiguration('pokemon-gen1'),
  createCustomGameConfiguration('pokemon-gen2'),
  createCustomGameConfiguration('pokemon-gen3'),
];