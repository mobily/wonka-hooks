const esbuild = require('esbuild')
const { babel } = require('./plugins/esbuild-babel-plugin')
const { curryGuaranteePlugin } = require('./plugins/babel-curry-guarantee-plugin')
const { removeReScriptHooks } = require('./plugins/babel-remove-rescript-hooks-plugin')

const handleError = () => process.exit(1)
const build = (outfile, options) => {
  return esbuild
    .build({
      entryPoints: ['src/WonkaHooks.bs.js'],
      bundle: true,
      format: 'cjs',
      outfile: `dist/${outfile}`,
      plugins: [
        babel({
          config: {
            babelrc: false,
            exclude: 'node_modules/**',
            plugins: [
              [
                'module-resolver',
                {
                  root: ['./src'],
                  alias: {
                    'wonka/src/Wonka.bs.js': 'wonka',
                    '@mobily/wonka-extras/src/WonkaExtras.bs.js': '@mobily/wonka-extras',
                  },
                },
              ],
              removeReScriptHooks,
              curryGuaranteePlugin,
              'closure-elimination',
              'minify-dead-code-elimination',
            ],
          },
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
