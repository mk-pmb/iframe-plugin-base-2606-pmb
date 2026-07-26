'use strict';
require('p-fatal');
require('esbrowserify-pmb')({
  srcAbs: require.resolve('../src/index.mjs'),
  verbosity: 1,
  minify: false,
  sourceMap: false,
  saveAs: '../dist/globals.bundle.js',
});
