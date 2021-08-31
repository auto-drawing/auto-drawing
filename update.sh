#!/usr/bin/env bash
success="更新成功"

set -e

git add .
npm  run commit

git  pull
git  push

echo  -e "\n\033[32m$success\033[0m"



