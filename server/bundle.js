const esbuild = require('esbuild')

esbuild.build({
  bundle: true,
  entryPoints: ['index.mjs'],
  external: ['mock-aws-s3', 'nock'],
  outfile: 'dist/index.js',
  platform: 'node'
})
