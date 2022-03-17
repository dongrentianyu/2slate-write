/* eslint-disable @typescript-eslint/no-unsafe-call */
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import disablePackages from 'rollup-plugin-disable-packages';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-import-css';

const sourceMap = true;
export default {
  input: 'src/components/index.ts',
  output: {
    file: './dist/plugins/linonetwo/slate-write/components/index.js',
    format: 'commonjs',
    sourceMap: sourceMap ? 'inline' : false,
    exports: 'named',
  },
  external: ['react', 'react-dom'],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    nodeResolve({ browser: true }),
    commonjs(),
    typescript({ sourceMap }),
    json(),
    css(),
    // We are not able to bundle in fsevents since it is a native osx lib.
    // It will give us errors if we don't disable (replace it with noop) it.
    // We must also use `useFsEvents: false` when calling chokidar.watch.
    disablePackages('fsevents', 'events', 'fs', 'fsevents', 'util', 'path', 'os', 'stream', 'module'),
    [...(sourceMap ? [] : [terser()])],
  ],
};
