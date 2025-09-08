#!/bin/bash

# Fun Words Game 部署脚本
# 用于快速部署到 Vercel

echo "🚀 Fun Words Game 部署脚本"
echo "================================"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查 Node.js 版本
echo "📋 检查环境..."
node_version=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$node_version" -lt 18 ]; then
    echo "❌ 错误：需要 Node.js 18.0.0 或更高版本"
    exit 1
fi

echo "✅ Node.js 版本：$(node -v)"

# 安装依赖
echo "📦 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📥 安装 Vercel CLI..."
    npm i -g vercel
fi

# 部署
echo "🌐 部署到 Vercel..."
echo "如果这是第一次部署，请按照提示登录 Vercel 账户"

vercel --prod

if [ $? -eq 0 ]; then
    echo "🎉 部署成功！"
    echo "📱 请访问 Vercel 控制台查看你的应用 URL"
else
    echo "❌ 部署失败，请检查错误信息"
    exit 1
fi