/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-extra-semi */
import { rollup, OutputOptions } from 'rollup'
import { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import rollupTypescript from 'rollup-plugin-typescript2'
import consola from 'consola'
import {
  plugins as originPlugins,
  join,
  output,
  pkgRoot,
  external,
  writeBundles,
  formatBundleFilename,
  pkg,
  PKG_CAMEL_CASE_NAME,
  target
} from './common'

import { cloneDeep } from '../../src/utils'

const fullBuilder = async (minify?: boolean) => {
  const plugins = cloneDeep(originPlugins) as any[]
  plugins.splice(
    3,
    1,
    rollupTypescript({
      tsconfigOverride: {
        compilerOptions: {
          // Rollup don't use CommonJS by default.
          module: 'ESNext',
          sourceMap: true,
          // Use the esm d.ts
          declaration: false
        }
      }
    })
  )
  // minify
  if (minify) {
    plugins.push(
      minifyPlugin({
        target: target,
        sourceMap: false
      })
    )
  }

  const bundle = await rollup({
    input: join(pkgRoot, 'index.ts'),
    treeshake: false,
    external,
    plugins
  })

  const fullOutput: OutputOptions[] = [
    {
      format: 'umd',
      file: join(output, formatBundleFilename(pkg.name, minify, 'js')),
      exports: 'named',
      name: PKG_CAMEL_CASE_NAME,
      sourcemap: false,
      globals: {
        zrender: 'zrender'
      }
    },
    {
      format: 'esm',
      file: join(output, formatBundleFilename(pkg.name, minify, 'mjs')),
      sourcemap: false
    }
  ]
  await writeBundles(bundle, fullOutput)
  consola.success(`Successfully built into ${minify ? 'minify' : ''} full!`)
}

export { fullBuilder }
