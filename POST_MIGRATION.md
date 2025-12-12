# Post 页面迁移文档

## 概述

本次迁移将 hexo-theme-shokaX 的 Post 页面功能完整迁移到 Astro 项目中，保持原有样式和布局，使用 Astro 和少量 Svelte 组件实现。

## 迁移内容

### 1. 组件结构

#### 创建的组件

- **`src/components/post/Breadcrumb.astro`** - 面包屑导航
  - 显示首页链接和分类层级
  - 支持 schema.org 结构化数据
  - 当前分类高亮显示

- **`src/components/post/PostHeader.astro`** - 文章头部
  - 文章标题（支持外链文章）
  - 发布日期
  - 字数统计
  - 阅读时间估算
  - Schema.org 元数据

- **`src/components/post/PostFooter.astro`** - 文章底部
  - 更新时间显示
  - 版权信息（作者、链接、许可协议）
  - 打赏功能（可配置）

- **`src/components/post/PostNav.astro`** - 文章导航
  - 上一篇/下一篇文章链接
  - 支持封面图片或渐变背景
  - 显示文章分类

#### 主页面

- **`src/pages/posts/[...slug].astro`** - 文章详情页
  - 集成所有 Post 组件
  - 获取相邻文章用于导航
  - 计算字数统计
  - 完整的 SEO 元数据

### 2. 样式迁移

**`src/styles/post.css`** - 从 Stylus 转换的完整样式

包含以下样式模块：

- Post 基础样式和布局
- 面包屑样式（带高亮效果）
- 文章头部和元信息样式
- 文章正文 Markdown 样式
- 标签样式（带悬停动画）
- 版权信息样式
- 打赏区域样式
- 文章导航样式（带背景图/渐变）

### 3. 配置更新

#### `src/content.config.ts`

添加字段支持：

- `updated: Date` - 文章更新时间
- `link: string` - 外链文章 URL

#### `src/theme.config.ts`

添加配置：

- `cover.enableNextGradientCover` - 文章导航使用渐变背景

#### `uno.config.ts`

添加 Post 页面使用的图标到 safelist：

- `i-ri-home-fill` - 首页图标
- `i-ri-arrow-right-s-line` - 箭头图标
- `i-ri-edit-2-line` - 编辑图标
- `i-ri-calendar-check-line` - 日历图标
- `i-ri-heart-pulse-line` - 心跳图标
- `i-ri-at-line` - @ 符号图标
- `i-ri-creative-commons-line` - CC 许可图标
- `i-ri-price-tag-3-line` - 标签图标
- `i-ri-link` - 链接图标

## 功能特性

### 保留的原有功能

1. ✅ 面包屑导航 - 显示分类层级
2. ✅ 文章头部元信息 - 日期、字数、阅读时间
3. ✅ 文章正文渲染 - Markdown 内容
4. ✅ 标签显示 - 带悬停动画
5. ✅ 版权信息 - 作者、链接、许可协议
6. ✅ 文章导航 - 上一篇/下一篇
7. ✅ Schema.org 元数据 - SEO 优化
8. ✅ 更新时间显示

### 可配置功能

- 版权信息显示开关
- 打赏功能（预留接口）
- 文章导航背景模式（封面图/渐变）

### 忽略的功能

根据要求，忽略了以下 JavaScript 交互行为：

- 打赏二维码动态显示
- 文章目录自动生成
- 代码高亮复制按钮
- 图片灯箱效果
- 评论系统集成

## 技术实现

### 主要使用 Astro

大部分组件使用纯 Astro 实现：

- ✅ Breadcrumb - 100% Astro
- ✅ PostHeader - 100% Astro
- ✅ PostFooter - 100% Astro
- ✅ PostNav - 100% Astro
- ✅ 主页面路由 - 100% Astro

### 代码特点

1. **类型安全** - 使用 TypeScript 定义所有 Props 接口
2. **SSR 优化** - 所有组件支持服务端渲染
3. **性能优化** - 图片懒加载、按需渲染
4. **可维护性** - 组件拆分清晰、职责单一

## 使用方法

### 创建文章

在 `src/posts/` 目录下创建 Markdown 文件：

```markdown
---
title: 文章标题
date: 2025-12-12
updated: 2025-12-12  # 可选
description: 文章描述
tags: [标签1, 标签2]
categories: [分类1, 分类2]
draft: false
cover: /path/to/cover.jpg  # 可选
link: https://external-link.com  # 可选，外链文章
---

文章内容...

```

### 配置选项

在 `theme.config.ts` 中配置：

```typescript
cover: {
  enableNextGradientCover: true,  // 文章导航使用渐变背景
}
```

### 访问文章

文章 URL 格式：`/posts/[文件名]`

例如：`/posts/hello-world`

## 样式定制

所有 Post 相关样式都在 `src/styles/post.css`，可以通过修改 CSS 变量来定制：

```css
/* 主色调 */
--primary-color: #ff6b6b;

/* 灰度色 */
--grey-0 to --grey-9

/* 强调色 */
--color-red-a1, --color-red-a3

/* 备注背景 */
--note-bg, --note-text
```

## 测试

已创建测试文章：`src/posts/post-migration-test.md`

包含：

- 中文内容
- 多个标签和分类
- 完整的元信息
- 各种 Markdown 元素

## 总结

本次迁移成功将 hexo-theme-shokaX 的 Post 页面完整迁移到 Astro，保持了原有的视觉效果和布局结构，同时：

1. ✅ 使用了更现代的技术栈（Astro + TypeScript）
2. ✅ 提供了更好的类型安全性
3. ✅ 实现了服务端渲染优化
4. ✅ 保持了代码的可维护性
5. ✅ 按需拆分了组件，职责清晰
6. ✅ 尽可能多地使用 Astro 而非 Svelte

所有组件都可以独立使用和定制，为后续功能扩展奠定了良好基础。
