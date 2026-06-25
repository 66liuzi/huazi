#!/bin/bash
# 华子网站 GitHub Pages 部署脚本
# 用法: ./deploy.sh
# 前提: main 分支上代码已修改好

set -e

PROJECT_DIR="/Users/liuyanghuazi/WorkBuddy/2026-06-24-18-06-17/华子网站"
NODE_PATH="/Users/liuyanghuazi/.workbuddy/binaries/node/versions/22.22.2/bin"
# GH_TOKEN 请通过环境变量设置: export GH_TOKEN="your_token"
GH_REPO="https://66liuzi:${GH_TOKEN}@github.com/66liuzi/huazi.git"
TEMP_DEPLOY="/tmp/huazi-deploy"

echo "========== 华子网站部署 =========="
echo ""

# 1. 切换到 main 分支
cd "$PROJECT_DIR"
git checkout main 2>/dev/null
echo "[1/6] 已切换到 main 分支"

# 2. 清除旧构建
rm -rf .next out
echo "[2/6] 已清除旧构建缓存"

# 3. 构建网站 (basePath: /huazi 已在 next.config.ts 中配置)
PATH="$NODE_PATH:$PATH" ./node_modules/.bin/next build
echo "[3/6] 网站构建完成"

# 4. 克隆 gh-pages 分支到临时目录
rm -rf "$TEMP_DEPLOY"
git clone --depth 1 --branch gh-pages "$GH_REPO" "$TEMP_DEPLOY" 2>/dev/null
echo "[4/6] 已克隆 gh-pages 分支"

# 5. 替换文件 (保留 .git)
cd "$TEMP_DEPLOY"
find . -maxdepth 1 -not -name '.git' -not -name '.' -not -name '..' -exec rm -rf {} +
cp -r "$PROJECT_DIR/out/"* .
touch .nojekyll  # 关键! 禁用 Jekyll, 否则 _next/ 目录会 404
echo "[5/6] 已复制构建文件并添加 .nojekyll"

# 6. 提交并推送
git config user.email "66liuzi@github.com"
git config user.name "66liuzi"
git add -A
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M') 部署更新"
git push origin gh-pages --force
echo "[6/6] 已推送到 GitHub Pages"

echo ""
echo "========== 部署完成 =========="
echo "网站地址: https://66liuzi.github.io/huazi/"
echo "GitHub Pages 部署约需 1-3 分钟生效"
echo ""
echo "注意事项:"
echo "  - next.config.ts 必须包含 basePath: '/huazi'"
echo "  - gh-pages 分支根目录必须有 .nojekyll 文件"
echo "  - 视频文件存放在腾讯云 COS, 不会上传到 GitHub"
