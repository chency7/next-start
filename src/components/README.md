# 🎨 组件目录

此目录用于存放项目中所有可复用的组件。

## 📁 目录结构

### 🔰 基础UI组件 (`ui/`)

- 按钮 (Button)
- 输入框 (Input)
- 卡片 (Card)

### 📐 布局组件 (`layout/`)

- 页头 (Header)
- 页脚 (Footer)
- 侧边栏 (Sidebar)

### ⚡ 功能组件 (`features/`)

- 登录表单 (AuthForm)
- 搜索栏 (SearchBar)
- 用户信息卡 (UserProfile)

## 💡 使用指南

1. 组件必须按功能分类存放
2. 使用 TypeScript 编写，确保类型安全
3. 默认使用 Server Components，必要时才使用 `"use client"`
4. 每个组件都要有完整的类型定义和使用说明
