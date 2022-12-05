#!/usr/bin/env bash
set -e

git add .
npm run commit

git pull
git push

echo -e "\n\033[32m更新成功\033[0m"
