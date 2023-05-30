import { rollup, OutputOptions, ModuleFormat } from 'rollup'
import glob from 'fast-glob'
import consola from 'consola'
import { plugins, join, output, pkgRoot, external, writeBundles } from './common'

const buildConfig = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: join(output, 'es')
    }
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      name: 'lib',
      path: join(output, 'lib')
    }
  }
}

const buildConfigEntries = Object.entries(buildConfig)

const moduleBuilder = async () => {
  const input = await glob(['**/*.{js,ts}'], {
    cwd: pkgRoot,
    absolute: true,
    onlyFiles: true
  })
  const bundle = await rollup({
    input,
    external,
    plugins
  })
  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format as ModuleFormat,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        sourcemap: false,
        preserveModulesRoot: pkgRoot,
        entryFileNames: `[name].${config.ext}`
      }
    })
  )
  consola.success('Successfully built into modules!')
}

export { moduleBuilder }
