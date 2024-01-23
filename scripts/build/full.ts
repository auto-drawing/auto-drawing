/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-extra-semi */
import { rollup, OutputOptions, InputPluginOption } from 'rollup'
import { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import consola from 'consola'
import {
  plugins as originPlugins,
  join,
  outputDist as output,
  pkgRoot,
  external,
  writeBundles,
  formatBundleFilename,
  name,
  PKG_CAMEL_CASE_NAME,
  target
} from './common'

import { cloneDeep } from '@auto-drawing/utils'

export const fullBuilder = async (minify?: boolean) => {
  try {
    const plugins = cloneDeep(originPlugins) as InputPluginOption[]

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
        file: join(output, formatBundleFilename(name, minify, 'js')),
        exports: 'named',
        name: PKG_CAMEL_CASE_NAME,
        sourcemap: false,
        globals: {
          zrender: 'zrender'
        }
      },
      {
        format: 'esm',
        file: join(output, formatBundleFilename(name, minify, 'mjs')),
        sourcemap: false
      }
    ]
    await writeBundles(bundle, fullOutput)
    consola.success(`Successfully built into ${minify ? 'minify ' : ''}full!`)
  } catch (error: unknown) {
    throw new Error((error as Error).message || 'Full Builder Error')
  }
}
