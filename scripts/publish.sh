#!/usr/bin/env bash
set -e
npm run build

# 修改npm源地址
npm config get registry
npm config set registry=https://registry.npmjs.org

# 登陆输入自己的npm账号和密码，还有邮箱
# echo '登录'
# npm login

echo "发布中..."
cd dist/
npm publish
cd -

# 改回npm源地址
npm config set registry=https://registry.npmmirror.com/
echo -e "\n发布成功\n"
exit
