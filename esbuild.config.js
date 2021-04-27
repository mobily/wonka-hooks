const esbuild = require('esbuild')

const { jscodeshift } = require('./plugins/esbuild-jscodeshift')
const { uncurryFunctions } = require('./plugins/uncurry-functions')
const { replaceLiterals } = require('./plugins/replace-literals')
const { removeRescriptHooks } = require('./plugins/remove-rescript-hooks')

const handleError = () => process.exit(1)
const build = (outfile, options) => {
  return esbuild
    .build({
      entryPoints: ['src/WonkaHooks.bs.js'],
      bundle: true,
      format: 'cjs',
      outfile: `dist/${outfile}`,
      plugins: [
        jscodeshift({
          exclude: ['node_modules/**'],
          plugins: [replaceLiterals, uncurryFunctions, removeRescriptHooks],
        }),
      ],
      minify: false,
      external: ['wonka', '@mobily/wonka-extras', 'react'],
      logLevel: 'info',
      ...options,
    })
    .catch(handleError)
}

build('index.js')
build('index.min.js', { minify: true })
build('index.mjs', { format: 'esm' })
