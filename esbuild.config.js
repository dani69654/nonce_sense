const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: 'dist/index.js',
    minify: true,
    treeShaking: true,
    drop: ['console', 'debugger'],
    format: 'cjs',
    external: ['express', 'node-telegram-bot-api', 'node-cron', 'dotenv', 'bitcoin-etf-data'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    sourcemap: false,
    metafile: false,
    write: true,
    logLevel: 'info',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    pure: ['console.log', 'console.error', 'console.warn'],
    keepNames: false,
  })
  .catch(() => process.exit(1));
