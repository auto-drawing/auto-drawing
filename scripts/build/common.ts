import path from 'path'
import fs from 'fs'
import esbuild from 'rollup-plugin-esbuild'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { eslint } from 'rollup-plugin-eslint'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { RollupBuild, OutputOptions, InputPluginOption } from 'rollup'
import banner2 from 'rollup-plugin-banner2'
import S from 'string'
import replace from '@rollup/plugin-replace'

// 合并路径
export const join = (...dir: string[]) => path.resolve(__dirname, '../../', ...dir)
// 包源码地址
export const pkgRoot = join('packages')
// package 信息
export const pkg = JSON.parse(fs.readFileSync(join(pkgRoot, 'package.json'), 'utf-8'))
// 库名称 大驼峰 AutoDrawing
export const PKG_CAMEL_CASE_NAME = S(pkg.name).capitalize().camelize().toString()

export const projRoot = join('./')

// 输打包后文件路径
export const output = join('dist')
export const outputDist = join(output, 'dist')

// 排除的包
export const external = []
export const moduleExternal = [
  'number-precision',
  'zrender',
  'zrender/lib/canvas/Painter.js',
  'zrender/lib/svg/Painter.js'
]
export const target = 'es2018'
export const typesOutDir = path.resolve(output, 'types')

// 写 Bundles
export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map(option => bundle.write(option)))
}
// 格式化文件后缀
export function formatBundleFilename(name: string, minify?: boolean, ext?: string) {
  return `${name}${minify ? '.min' : ''}.${ext}`
}

const excludes = ['node_modules', '__tests__', 'dist', 'auto-drawing']

export const excludeFiles = (files: string[]) => {
  return files.filter(path => ![...excludes].some(exclude => path.includes(exclude)))
}

/**
 * 替换 dts 中的别名
 * @param id
 * @returns
 */
export const pathRewriter = (id: string) => {
  id = id.replaceAll(`@auto-drawing/types`, `../types`)
  return id
}

// rollup 配置项
export const plugins: InputPluginOption[] = [
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
  esbuild({ target }),
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
