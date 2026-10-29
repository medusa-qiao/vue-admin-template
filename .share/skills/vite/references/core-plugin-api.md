---
name: vite-plugin-api
description: Existing Vue application plugin chain and local Vite plugin maintenance
---

# 项目插件链

按目标项目已有配置维护插件；不因为修改一个页面就安装新插件或调整整条构建链。

## 两种配置位置

完整项目从 `vite.config.ts` 调用 `build/plugins.ts` 的异步 `getPluginsList`；独立模板在自己的 `vite.config.ts` 中直接声明插件。两者共同使用：

- `@vitejs/plugin-vue`：Vue SFC。
- `@vitejs/plugin-vue-jsx`：Vue JSX / TSX。
- `@tailwindcss/vite`：现有 Tailwind 样式处理。
- `@intlify/unplugin-vue-i18n`：`locales` 资源。
- `vite-svg-loader`、`unplugin-icons`：SVG 组件与图标。
- `vite-plugin-fake-server`：按各自条件启用的 Mock。

完整项目另有开发检查、构建信息、警告处理、CDN、压缩、console 清理和 report 等插件。模板有意精简了插件集合，新增配置应来自具体需求。

## Mock 条件

完整项目 `build/plugins.ts` 中 Mock 的 `enableProd` 当前为 `true`；发布检查需要识别这一事实。

模板仅在 `command === "serve"`、非 preview、`VITE_USE_MOCK === "true"` 时启用 Mock，并设置 `enableProd: false`。修改环境或插件条件后分别检查开发、build 与 preview，保持模板的实际行为。

## 维护项目自有插件

完整项目的 `build/info.ts` 返回 `Plugin`：在 `configResolved` 读取 command / outDir，在 `buildStart` 记录开始时间，在 `closeBundle` 输出构建信息。修改时保持配置解析与构建时序，并区分开发和构建路径。

插件配置保留现有顺序及条件。为已有问题修改 hook 前先定位实际插件和当前版本的类型；需要新增 hook 时按项目文档查询流程核对对应 API，不能从其他项目的运行时示例直接套入。

涉及 Vue、TSX、locale、SVG 或 Mock 时，验收对应输入是否仍能编译和使用；构建验证使用项目完整 build 脚本。
