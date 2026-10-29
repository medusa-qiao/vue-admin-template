---
name: vite-features
description: Vite import patterns and assets already used by this Vue admin application
---

# 源码导入与资源

本页仅覆盖当前项目正在使用的导入方式；修改具体入口时回查源码。路径相对目标项目根。

## 自动发现路由与语言

`src/router/index.ts` 使用 eager glob 读取静态路由，并排除特殊路由文件：

```ts
const modules = import.meta.glob(
  ["./modules/**/*.ts", "!./modules/**/remaining.ts"],
  { eager: true }
);
```

`src/router/utils.ts` 用以下 glob 生成页面组件映射；后端路由的 component 字符串必须指向实际页面，映射规则与权限约束见当前项目 UI Template 的路由指南：

```ts
const modulesRoutes = import.meta.glob("/src/views/**/*.{vue,tsx}");
```

`src/plugins/i18n.ts` 自动读取 `locales` 中的语言文件。新增文件时保留已有命名、导出形状和注册流程，不重复手动装配另一套 loader。

## 图像、SVG 与图标

| 导入形式          | 项目用法                                                                       |
| ----------------- | ------------------------------------------------------------------------------ |
| 普通图片路径      | 交给现有 Vite 资源处理，按页面与组件已有方式引用                               |
| `*.svg?component` | 由 `vite-svg-loader` 转成 Vue 组件；错误页、布局和表格工具栏已使用             |
| `~icons/...`      | 使用已有 `unplugin-icons` 与项目图标包装；模板的离线图标使用 `?raw` SVG 字符串 |

资源 import、Vue 组件 import 与字符串返回值的类型不同；遵循已有 `types/` 声明及邻近实现，不用强制类型转换把字符串当 Vue 组件。

## 环境变量和样式

客户端使用现有 `import.meta.env.MODE`、`DEV`、`PROD` 与声明过的 `VITE_` 变量。新增公开配置时同时检查配置读取、类型声明和环境文件；私密数据留在服务端。

Tailwind 由 `@tailwindcss/vite` 处理，样式入口在 `src/main.ts`。保持 reset、公共样式、Tailwind 和 Element Plus 的当前顺序；Tailwind 详细约束见相应项目技能。Vue 热更新由现有 Vue 插件处理，普通页面不需要另写热更新监听器。
