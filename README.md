# 🚀 Next.js 项目模板

基于 [Next.js 15](https://nextjs.org) 构建的现代化 Web 应用模板，集成了最佳实践和常用工具。

## ✨ 特性

- 📦 基于 Next.js 15 App Router
- 🎨 集成 TailwindCSS 样式解决方案
- 💪 TypeScript 类型支持
- 🔍 ESLint + Prettier 代码规范
- 🚦 Husky + lint-staged 提交检查
- 🐳 Docker 容器化支持
- 📱 响应式设计
- 🔄 自动化部署配置

## 🛠️ 技术栈

- **框架：** Next.js 15
- **语言：** TypeScript
- **样式：** TailwindCSS
- **状态管理：** React Context + Hooks
- **代码规范：** ESLint + Prettier
- **提交规范：** Husky + Commitlint
- **包管理器：** pnpm
- **容器化：** Docker

## 📦 项目结构

```bash
src/
├── app/          # 页面和路由
├── components/   # 可复用组件
├── hooks/        # 自定义 Hooks
├── utils/        # 工具函数
├── types/        # 类型定义
├── styles/       # 全局样式
└── lib/          # 第三方库配置
```

## 🚀 快速开始

### 开发环境

1. 安装依赖：

```bash
pnpm install
```

2. 启动开发服务器：

```bash
pnpm dev
```

3. 在浏览器打开 [http://localhost:3000](http://localhost:3000)

### 生产环境

1. 构建项目：

```bash
pnpm build
```

2. 启动生产服务：

```bash
pnpm start
```

### Docker 部署

1. 构建镜像：

```bash
pnpm docker:build
```

2. 运行容器：

```bash
pnpm docker:run
```

## 📝 开发规范

- 代码提交前会自动运行 ESLint 和 Prettier 检查
- 提交信息必须符合 Conventional Commits 规范
- 组件优先使用 Server Components
- 确保所有代码都有适当的类型定义

## 🔧 环境变量

创建 `.env.local` 文件：

```bash
APP_ENV=development
# 其他环境变量...
```

## 📚 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [TailwindCSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

## 🤝 贡献指南

1. Fork 本项目
2. 创建新分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 📄 许可证

[MIT](LICENSE)
