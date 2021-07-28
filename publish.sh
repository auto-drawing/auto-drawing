#!/usr/bin/env bash
set -e

# 修改npm源地址
npm config get registry
npm config set registry=http://registry.npmjs.org

# 登陆输入自己的npm账号和密码，还有邮箱
echo '登录'
npm login

echo "发布中..."
npm publish

# 改回npm源地址
npm config set registry=https://registry.npm.taobao.org
echo -e "\n发布成功\n"
exit

