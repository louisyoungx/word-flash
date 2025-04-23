# Word Flash

一个简单而高效的英语单词闪卡应用，帮助用户快速记忆单词。

🌐 [在线体验](https://word-flash-ruddy.vercel.app)

## 功能特点

- 🎯 随机展示单词和释义
- ⏱️ 支持自动播放模式
- ⚙️ 可自定义自动播放间隔时间
- 👁️ 可选择是否显示中文释义
- 📱 响应式设计，适配各种屏幕尺寸

## 技术栈

- React 19
- TypeScript
- TailwindCSS
- Vite

## 安装

1. 克隆项目
```bash
git clone https://github.com/louisyoungx/word-flash.git
cd word-flash
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 构建生产版本
```bash
pnpm build
```

## 使用说明

1. 启动应用后，系统会随机展示单词
2. 使用左右箭头按钮手动切换单词
3. 点击播放按钮开启自动播放模式
4. 点击设置按钮可以：
   - 调整自动播放间隔时间
   - 切换是否显示中文释义

## 数据来源

项目使用 `words.json` 作为单词数据源，包含英文单词及其对应的中文释义。

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 许可证

MIT 