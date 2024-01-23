/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import semver from 'semver'
import { prompt } from 'enquirer'
import execa from 'execa'
import { version as currentVersion } from '../package.json'

//  版本列表
const versionIncrements = [
  'patch（补丁）',
  'minor（次版本）',
  'major（主版本）',
  'prepatch（预构建补丁）',
  'preminor（预构建次版本）',
  'premajor（预构建主版本）',
  'prerelease（预构建发布版本）'
]

// 步骤打印
const step = (msg: string) => console.log(chalk.green(msg))

// 增加版本号
const inc = (i: semver.ReleaseType) => semver.inc(currentVersion, i)

// 运行脚本
const run = (bin: string, args: string[], opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })

/**
 * 更新版本号
 * @param {string} version
 */
function updatePackage(version: string) {
  const pkgPath = path.resolve(__dirname, '../package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  step(`updated package.json version to ${version}\n`)
}

function getInc(value: string) {
  const r = /(\w+)/g
  return r.exec(value)![0] as semver.ReleaseType
}

/**
 * 提交 打标签 推送到远程仓库
 * @param {string} version
 */
async function publish(version: string) {
  try {
    await run('yarn', ['changelog'])
    await run('git', ['add', '-A'])
    await run('git', ['tag', '-a', version, '-m', `Release v${version}`])
    await run('yarn', ['commit', '-m', `release: v${version}`])
    await run('git', ['pull'])
    await run('git', ['push', '--tags'])
    await run('git', ['push'])
    step(`push version to ${version}\n`)
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

// 主函数
async function main() {
  let version

  const { release } = await prompt<{ release: string }>({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map(i => `${i} (${inc(getInc(i))})`).concat(['custom（自定义版本）'])
  })

  if (release.includes('custom')) {
    version = (
      await prompt<{ version: string }>({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: version
      })
    ).version
  } else {
    version = release.match(/\((.*)\)/)![1]
  }

  if (!semver.valid(version)) {
    throw new Error(`invalid target version: ${version}`)
  }
  updatePackage(version)
  await publish(version)
}

main().catch(err => {
  console.error(err)
})
