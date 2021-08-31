module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 提交主题类型
    'type-enum': [
      2,
      'always',
      ['feat', 'perf', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert', 'build', 'ci'] // 主题含义见 /.cz-config.js
    ],
    'subject-full-stop': [0, 'never'], // 主题句号
    'subject-case': [0, 'never'] // 主题案例
  }
}
