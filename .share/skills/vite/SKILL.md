---
name: vite
description: Use when maintaining the Vite configuration, Vue plugins, environment variables, assets, development server, or Rolldown build in this Vue admin application.
metadata:
  author: Anthony Fu
  version: "2026.9.25"
  source: Generated from https://github.com/vitejs/vite, scripts at https://github.com/antfu/skills
  scope: Project-curated Vue SPA guide
---

# Vite — 项目适用版

保留上游来源信息，本地内容已按当前 Vue 管理后台裁剪。当前应用使用 Vite 8 / Rolldown，具体版本以目标项目的 `package.json`、锁文件和已安装依赖为准；原生成信息见 `GENERATION.md`。

先确定目标项目：完整项目使用根 `vite.config.ts` 与 `build/`；独立模板使用自身 `vite.config.ts`。源码路径均相对目标项目根，模板不依赖父项目配置。

## 按任务读取

| 任务                                  | 参考                                                  |
| ------------------------------------- | ----------------------------------------------------- |
| 环境、alias、代理、开发和发布配置     | [配置与运行](references/core-config.md)               |
| 路由 / locale 自动导入、SVG、环境变量 | [源码导入与资源](references/core-features.md)         |
| Vue、Tailwind、i18n、图标与 Mock 插件 | [项目插件链](references/core-plugin-api.md)           |
| 构建产物、输出规则与兼容检查          | [Rolldown 构建维护](references/rolldown-migration.md) |

## 当前约束

- 保留 TypeScript / ESM 配置、Vue SFC 与 Vue JSX 插件，以及现有 alias、i18n 和样式入口。
- 完整项目的配置是异步函数并调用 `getPluginsList`；不能把它直接当普通对象展开合并。
- 修改开发服务器端口、代理和资源基础路径时，以当前配置及 `.env` 文件为准。`server` 配置指开发服务器。
- 用目标项目的 `pnpm dev`、`pnpm build`、`pnpm preview`。完整项目 build 还会生成版本文件；模板 build 先进行类型检查。
- 构建、入口或插件变化运行实际 build；开发行为变化检查对应页面。`preview` 展示已有产物，本身不证明构建成功。

其他项目规则从当前 `ui-template` 读取；只为本次明确需求调整现有配置。
