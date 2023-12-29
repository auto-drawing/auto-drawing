import path from 'path'
import fs from 'fs'
import rollupTypescript from 'rollup-plugin-typescript2'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { eslint } from 'rollup-plugin-eslint'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { RollupBuild, OutputOptions, RollupOptions } from 'rollup'
import banner2 from 'rollup-plugin-banner2'
import S from 'string'
import replace from '@rollup/plugin-replace'

// 合并路径
export const join = (...dir: string[]) => path.resolve(__dirname, '../../', ...dir)
// package 信息
export const pkg = JSON.parse(fs.readFileSync(join('package.json'), 'utf-8'))
// 库名称 大驼峰 AutoDrawing
export const PKG_CAMEL_CASE_NAME = S(pkg.name).capitalize().camelize().toString()
// 输打包后文件路径
export const output = join('dist')
// 包源码地址
export const pkgRoot = join('src')
// 排出的包
export const external = []
export const moduleExternal = [
  'zrender',
  'number-precision',
  'zrender/lib/canvas/Painter',
  'zrender/lib/svg/Painter'
]
export const target = 'es2018'

// 写 Bundles
export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map(option => bundle.write(option)))
}
// 格式化文件后缀
export function formatBundleFilename(name: string, minify?: boolean, ext?: string) {
  return `${name}${minify ? '.min' : ''}.${ext}`
}

// rollup 配置项
export const plugins: RollupOptions['plugins'] = [
  // 验证导入的文件
  eslint({
    throwOnError: true, // lint 结果有错误将会抛出异常
    throwOnWarning: true,
    include: ['src/**/*.ts'],
    exclude: ['node_modules/**', 'dist/**', '*.js']
  }),

  // 使得 rollup 支持 commonjs 规范，识别 commonjs 规范的依赖
  commonjs(),
  // 配合 commonjs 解析第三方模块
  resolve({
    // 将自定义选项传递给解析插件
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  }),
  rollupTypescript({
    tsconfigOverride: {
      compilerOptions: {
        // Rollup don't use CommonJS by default.
        module: 'ESNext',
        sourceMap: true,
        // Use the esm d.ts
        declaration: true
      }
    }
  }),
  babel({
    runtimeHelpers: true,
    // 只转换源代码，不运行外部依赖
    exclude: 'node_modules/**',
    // babel 默认不支持 ts 需要手动添加
    extensions: [...DEFAULT_EXTENSIONS, '.ts']
  }),
  banner2(
    () =>
      `/*!\n * name: ${pkg.name}\n * version: v${pkg.version}\n * description: ${pkg.description}\n * author: ${pkg.author}\n * copyright: ${pkg.copyright}\n * license: ${pkg.license}\n */\n`
  ),
  replace({
    values: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    },
    preventAssignment: true
  })
]
