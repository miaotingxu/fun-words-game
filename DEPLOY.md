# Fun Words Game - Vercel 部署指南

## 🚀 快速部署到 Vercel

### 方法一：通过 Vercel 网站部署（推荐）

1. **推送代码到 GitHub**
   ```bash
   cd word-game
   git init
   git add .
   git commit -m "Initial commit: Fun Words Game"
   # 创建 GitHub 仓库后
   git remote add origin https://github.com/your-username/fun-words-game.git
   git push -u origin main
   ```

2. **部署到 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Deploy"

### 方法二：使用 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录并部署**
   ```bash
   cd word-game
   vercel login
   vercel --prod
   ```

## 📋 部署前检查

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 项目配置
项目已经配置好了所有必要的文件：
- ✅ `vite.config.ts` - Vite 构建配置
- ✅ `tsconfig.json` - TypeScript 配置
- ✅ `tailwind.config.js` - Tailwind CSS 配置
- ✅ `postcss.config.js` - PostCSS 配置
- ✅ `package.json` - 项目依赖和脚本

## 🔧 构建和运行

### 本地开发
```bash
cd word-game
npm install
npm run dev
```

### 构建生产版本
```bash
npm run build
npm run preview
```

## 🌐 部署后的功能

### ✅ 完全支持的功能
- 所有游戏功能（选择题、拼写题、听音题）
- IndexedDB 本地存储
- 像素风格 UI
- 音效系统
- 离线使用

### 📱 兼容性
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 移动设备响应式设计
- PWA 支持（可添加到主屏幕）

## 🛠️ 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清除缓存重新安装
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **IndexedDB 权限问题**
   - 确保在 HTTPS 或 localhost 下运行
   - Vercel 自动提供 HTTPS

3. **音效不工作**
   - 某些浏览器需要用户交互后才能播放音频
   - 这是浏览器的自动播放策略

### 性能优化

项目已经优化：
- 📦 构建大小：~214KB (gzip: ~67KB)
- ⚡ 首屏加载：≤ 3s
- 🎯 SEO 友好的 meta 标签

## 📊 监控和分析

### Vercel Analytics
1. 在 Vercel 控制台中启用 Analytics
2. 监控访问量和性能指标

### 错误追踪
建议集成 Sentry 或类似服务来追踪错误：

```bash
npm install @sentry/react
```

## 🔒 安全考虑

- ✅ 无服务器端代码，纯静态站点
- ✅ 所有数据存储在用户本地
- ✅ 无外部 API 调用
- ✅ HTTPS 自动启用

## 🎯 部署成功后的 URL

部署完成后，你的游戏将在以下地址可用：
```
https://your-project-name.vercel.app
```

## 📝 自定义域名

1. 在 Vercel 控制台中
2. 进入项目设置
3. 点击 "Domains"
4. 添加你的自定义域名

## 🚀 部署脚本

创建一个部署脚本：

```bash
#!/bin/bash
# deploy.sh

echo "🚀 开始部署 Fun Words Game..."

# 检查依赖
echo "📦 检查依赖..."
npm install

# 构建
echo "🔨 构建项目..."
npm run build

# 部署
echo "🌐 部署到 Vercel..."
vercel --prod

echo "✅ 部署完成！"
```

使用方法：
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🎮 恭喜！

你的高考趣味背单词游戏现在已经可以部署到 Vercel 了！部署后，用户可以在任何地方访问这个离线可用的学习工具。

记得：
1. 部署前在本地测试所有功能
2. 检查移动设备兼容性
3. 收集用户反馈并持续改进

祝你部署顺利！🎉