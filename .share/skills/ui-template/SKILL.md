---
name: ui-template
description: Use when an agent implements or reviews pages, components, routes, permissions, API calls, styles, tests, or build configuration in the standalone pure-admin-starter Vue and Element Plus template.
---

# UI Template — 独立后台模板

本 skill 适用于携带它的模板项目。项目根是包含 `package.json`、`AGENT.md` 和 `AGENTS.md` 的目录，不是完整演示仓库，也不是用户的全局技能目录。

## 先读项目事实

- [AGENTS.md](../../../AGENTS.md)：目录、语法、组件、API、权限、验证约束。
- [README.md](../../../README.md)：安装命令、项目结构、环境变量、接口契约和组件入口。
- [package.json](../../../package.json)、[vite.config.ts](../../../vite.config.ts)、[vitest.config.ts](../../../vitest.config.ts)：实际依赖与执行配置。
- [技能索引](../../skills-index.md)：全部已携带技能的精确路径；遇到上游链接失效时在此按名称查找。

## 按任务加载

编写或评审 TypeScript（包括 Vue 脚本）时必须读取 [typescript-best-practices](../typescript-best-practices/SKILL.md)：先复用现有类型、工具、组件及已安装库，再做必要适配；不重建请求、会话或业务框架。

新增或改造页面 / 组件时，先读[组件实现与页面结构规范](references/page-component-structure.md)：统一目录与命名、SFC 顺序、页面分区、HTML 语义、props / emits / slots、状态与请求归属，并按验收表评审。

新增页面先读[静态与动态路由分工](references/route-sources.md)，列出来源及理由、是否入库、账号状态、角色、按钮权限与验收。再读[路由制定与 RBAC 权限实现引导](references/routing-rbac.md)中的动态业务示例、登录 / 菜单契约、Auth 与 Perms、刷新和账号切换流程。没有后端时也保持动态业务的加载链路。

| 任务                      | 技能                                                                                                                       |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Vue、SFC、组合式函数、TSX | [vue](../vue/SKILL.md)                                                                                                     |
| UI 选型与组件             | [element-plus-design-overview](../element-plus-skills/element-plus-design-overview/SKILL.md)，再读取索引中的对应 el-* 技能 |
| 布局、Tailwind、token     | [tailwind-design-system](../tailwind-design-system/SKILL.md)                                                               |
| 开发服务、构建、Rolldown  | [vite](../vite/SKILL.md)                                                                                                   |
| 单元、组件或浏览器测试    | [vitest](../vitest/SKILL.md)                                                                                               |

## 关键约束

### 自定义组件的设计依据

**新增或改造自定义组件必须先读 [element-plus-design-overview](../element-plus-skills/element-plus-design-overview/SKILL.md)**，包括从零实现、二次封装、业务组合，不限于选择现成组件。先定位语义和交互最接近的组件，读取对应 `el-*` 技能与项目相邻实现；已有组件可满足的部分优先复用，再补充业务能力。

按涉及内容继续读取：[颜色](../element-plus-skills/element-plus-design-color/SKILL.md)、[边框/圆角/阴影](../element-plus-skills/element-plus-design-border/SKILL.md)、[布局](../element-plus-skills/element-plus-design-layout/SKILL.md)、[排版](../element-plus-skills/element-plus-design-typography/SKILL.md)。overview 是设计入口，具体细节以相应设计技能和当前项目主题为依据。

自定义部分延续现有主题变量与相近组件风格；具体配色、尺寸、间距、圆角和阴影按场景选择，不另设固定数值表，不把技能示例的默认色值直接硬编码。Tailwind 用于落实布局与样式，不替代 Element Plus 的设计依据。

实现说明简要列出参考技能、基础组件和必要的自定义部分；检查换主题、暗色、窄屏及适用的 hover、active、focus、disabled、loading 状态。

### 实现与验证

页面和组件必须按结构规范实现：路由页单根承接布局属性；组件输入只读、事件有类型、数据来源唯一；操作用按钮、导航用链接，禁止嵌套表单和重复提交。布局、页面与弹窗的标题 / 主内容职责分别管理。

1. 页面放 `src/views/`，接口放 `src/api/`。基础首页、登录、错误、刷新路由保留在 `src/router/modules/`；业务及隐藏详情默认动态，在首次新增业务时创建 `src/router/dynamic/` 定义及汇总入口，供 Mock/种子使用，浏览器只走现有动态接口。同步交付后端入库清单，不把动态定义混进静态 glob。复用布局、主题、Pinia 和现有全局组件；先确认 Element Plus 组件是否已注册。
2. API 通过 `@/utils/http`，返回完整 `{ code, message, data }`，成功为 `code === 0`。传输错误和业务失败都恢复加载状态；不增加一层 `.data`，不使用旧演示的 `success` 协议。
3. `Auth` / `v-auth` 读取路由 `meta.auths`；`Perms` / `v-perms` 读取登录 `permissions`；页面角色由 `meta.roles` 管理。前端权限不能代替后端授权。
   受限叶子页必须显式写 `roles`；角色数组是任一匹配，按钮权限数组是全部匹配。路由拍平后不能假定父目录授权会自动继承；隐藏菜单不构成 URL 鉴权。
4. `PureTableBar` 的 `size` 与 `dynamicColumns` 传给表格；弹窗/抽屉保存成功才调用 `done()`，失败调用 `closeLoading()` 并保留输入。详细 API 先读对应组件源码。
5. 保持现有 Tailwind theme/utilities 入口、Element Plus token 和暗色体系；保留中英文文案、键盘操作以及加载/空/失败状态。
6. 当前已接入 Vitest。`pnpm lint` 只检查，`pnpm format` 会改文件；生产构建和预览不启用 Mock。不套用完整演示项目的命令或默认值。
7. 检查与变更相称：类型、lint、格式、相关测试；依赖、构建、入口或路由变化执行 build。报告实际执行结果，区分 Node 行为测试与浏览器交互验收。

其他技能提供通用方法，本项目文件提供实际约束。需要 Superpowers 或 find-skills 时按当前运行时清单查找；它们不是本地共享目录的必需依赖。
