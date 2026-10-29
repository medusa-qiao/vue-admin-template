---
name: vite-rolldown
description: Maintaining the project's existing Vite 8 and Rolldown build configuration
---

# Rolldown 构建维护

本页已从通用迁移资料裁剪为当前项目维护说明，保留文件名供已有入口引用。两个项目已经使用 Vite 8 与 `build.rolldownOptions`，以当前配置、锁文件及安装包类型为准。

## 保留现有输出配置

| 项目     | 当前设置                                                                     |
| -------- | ---------------------------------------------------------------------------- |
| 完整项目 | HTML 入口经 `pathResolve` 传入；JS 输出到 `static/js/`，其他资源按扩展名分类 |
| 独立模板 | `entryFileNames`、`chunkFileNames`、`assetFileNames` 输出到 `assets/`        |

修改输出命名或拆包时保留实际资源引用关系，检查生成的 HTML、异步路由 chunk 与 public 资源；不能只看构建退出码。完整项目已有 `build.target`、sourcemap 和 warning limit 等设置，按实际支持目标修改，避免用另一份通用配置覆盖。

## 插件与兼容性

保留 Vue、Vue JSX、Tailwind、i18n、SVG / 图标等现有插件链。判断某个旧插件是否兼容，要结合该插件实际 hook、当前 Vite / Rolldown 类型和构建结果；不能从依赖名称推断兼容。

当前已经配置 `rolldownOptions`，普通功能需求不需要重跑整套构建迁移或替换打包器。遇到旧配置字段时先定位它是否真的被当前构建读取，再按项目文档查询流程核对受支持的选项。

## 有范围的验证

性能调整先记录同一环境下的冷启动、热更新或构建数据，再只修改影响该问题的配置。完整项目现有 `pnpm report` 可生成打包分析；模板没有此脚本，不能直接照用。

依赖、插件、输出或入口变更后执行目标项目的 `pnpm build`，再用 `pnpm preview` 检查相关页面和资源。完整项目构建包含版本文件生成，单独运行 Vite build 不等于完成全部发布构建步骤。
