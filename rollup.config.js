import path from 'path'
import rollupTypescript from 'rollup-plugin-typescript2'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { eslint } from 'rollup-plugin-eslint'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { terser } from 'rollup-plugin-terser'
import S from 'string'
import pkg from './package.json'

// 合并路径
const join = (dir, p) => path.join(dir, p)
// 库名称 大驼峰 AutoDrawing
const name = S(pkg.name).capitalize().camelize().toString()
// 入口文件路径
const input = join(__dirname, '/src/index.ts')
// 输打包后文件路径
const output = join(__dirname, '/dist')

// rollup 配置项
const rollupConfig = {
  input,
  output: [
    // 输出 umd 规范的代码
    {
      file: join(output, 'auto-drawing.js'),
      format: 'umd',
      name
    },
    {
      // 输出 esm 规范的代码
      file: join(output, 'auto-drawing.esm.js'),
      format: 'esm',
      plugins: [terser()],
      name
    },
    // 输出 umd 规范的压缩代码
    {
      file: join(output, 'auto-drawing.min.js'),
      format: 'umd',
      plugins: [terser()],
      name
    }
  ],
  // external: ['lodash'], // 指出应将哪些模块视为外部模块，如 Peer dependencies 中的依赖
  // plugins 需要注意引用顺序
  plugins: [
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
          module: 'ES2015',
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
    })
  ]
}

export default rollupConfig
