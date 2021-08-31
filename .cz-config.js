module.exports = {
  // 修改主题选择
  types: [
    { value: 'feat', name: 'feat:添加新功能' },
    { value: 'fix', name: 'fix:Bug修复' },
    { value: 'delete', name: 'delete:删除代码，接口' },
    {
      value: 'docs',
      name: 'docs:  变更的只有文档，比如README.md等'
    },
    { value: 'test', name: 'test:添加一个测试，包括单元测试、集成测试等' },
    {
      value: 'style',
      name: 'style:  空格, 分号等格式修复（注意不是 css 修改）'
    },
    { value: 'ci', name: 'ci:ci配置，脚本文件等更新' },
    {
      value: 'refactor',
      name: 'refactor:代码重构（即不是新增功能，也不是修改bug的代码变动）'
    },
    { value: 'perf', name: 'perf:优化相关，比如提升性能、体验' },
    { value: 'chore', name: 'chore:改变构建流程、或者增加依赖库、工具等' },
    { value: 'revert', name: 'revert:代码回退' }
  ],
  // 构建对话
  messages: {
    type: '选择一种你的提交类型(必选):',
    scope: '选择一个更改范围(可选):',
    // used if allowCustomScopes is true
    customScope: '自定义更改范围(可选):',
    subject: '提交说明(必填):\n',
    body: '长说明，使用"|"换行(可选)：\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的issue，例如：#31, #34(可选):\n',
    confirmCommit: '确定提交说明?'
  },
  // 是否允许自定义更改范围
  allowCustomScopes: true,
  // 允许中断的改变
  allowBreakingChanges: ['feat', 'fix'],
  // 修改主题描述字数限制
  subjectLimit: 100,
  // 选择跳过的步骤
  skipQuestions: ['scope', 'customScope', 'body', 'breaking', 'footer']
}
