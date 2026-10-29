# 模板开发约束

本文件适用于本目录及其子目录。这里是独立的 Vue 后台模板，使用 Vite 开发与构建。任务以用户要求和实际源码为准；先读取 `package.json`、相关页面、组件和接口，再修改。独立复制后不依赖父目录的配置、技能、文档或 `node_modules`。

## 已安装技能定位

先读 [AGENT.md](AGENT.md) 的任务映射，再读取 [.share/skills/ui-template/SKILL.md](.share/skills/ui-template/SKILL.md)。本模板已携带 `.share/skills/`，完整名称和实际路径见 [.share/skills-index.md](.share/skills-index.md) 与 JSON 同名索引。Element Plus 子技能位于嵌套目录，不猜测顶层路径。按需加载，避免一次读取全部技能；不依赖父项目或机器专属缓存路径。

## 目录和工具链

- Node.js `>=22.22.1`，pnpm `>=11`；优先使用 `packageManager` 声明的版本。保留并同步 `pnpm-lock.yaml`，不要混用 npm / Yarn 锁文件。
- 在本目录运行 `pnpm dev`；默认端口 4175，以进程输出为准。需要预览产物时运行 `pnpm build`、`pnpm preview`。
- 保持 Vue 3 + TypeScript、Vite 8 / Rolldown、Tailwind 4、Element Plus 和 Pinia 的现有组合。只有具体任务需要时才新增依赖，不恢复整套演示页或重型插件。
- 格式与质量检查使用现有 ESLint、Prettier、vue-tsc，保留 Vue、TypeScript、格式和 Tailwind 规则。
- 当前只有一个应用，沿用本目录的 Vite 构建和 package scripts。
- 不提交 `node_modules`、`dist`、覆盖率、缓存和本机环境文件。保留本模板已携带的 `.share/skills/`，不额外复制父级演示文档或无关技能。

## 页面与语法

- TypeScript 与 Vue 脚本实现或评审必须先读 [typescript-best-practices](.share/skills/typescript-best-practices/SKILL.md)。先查已有 DTO、API、utils、组件、composable 与已安装库；新增抽象说明能力缺口，复用请求与会话机制，不为单个页面引入新框架或全仓 strict 迁移。
- 新增或改造页面和组件必须先读[组件实现与页面结构规范](.share/skills/ui-template/references/page-component-structure.md)，统一目录、命名、SFC 顺序、页面分区和语义化 HTML，明确 props / emits / slots、状态与请求的唯一归属，并按验收表检查。既有组件路径按改动范围兼容，不批量重命名无关文件。
- 新页面放 `src/views/<业务>/`，页面私有组件和 composable 就近组织；跨页面复用后再提取到 `src/components`。业务接口放 `src/api`，公共类型放 `types` 或对应业务模块。
- Vue 单文件组件优先 `<script setup lang="ts">`，显式导入使用的 Vue API；不要假设存在自动导入。TSX 使用 Vue 的语法与响应式机制，不引入 React 写法。
- 新增代码为请求、响应、表单、表格行和事件定义明确类型；不能用新增 `any`、`@ts-ignore`、关闭规则掩盖类型问题。遗留宽类型按改动范围逐步收紧。
- `@/` 指向 `src`。页面命名、路由 `name`、`defineOptions({ name })` 保持一致，尤其是需要 KeepAlive 的页面。路由组件使用懒加载。
- 基础首页、登录、错误、刷新路由静态，放 `src/router/modules` 并遵循 `RouteConfigsTable`；新增业务与隐藏详情默认动态。先读[路由分工](.share/skills/ui-template/references/route-sources.md)，列出来源、是否入库、角色和账号状态条件。按约定在静态 glob 外创建 `src/router/dynamic/` 的分领域定义和汇总入口，供开发 Mock/种子使用；浏览器仍走动态接口，保留路由守卫及登出清理，不将业务拼入静态路由来预览 UI。
- 可见文案补齐 `locales/zh-CN.yaml` 与 `locales/en.yaml`。复用已有 i18n 工具，不手写另一套语言状态。

## UI 与组件

- 新增或改造自定义组件（含从零实现、二次封装、业务组合）必须先读取 [element-plus-design-overview](.share/skills/element-plus-skills/element-plus-design-overview/SKILL.md)，确定最接近的组件语义与交互，再按涉及内容读取对应 `el-*` 以及颜色、边框、布局、排版设计技能。具体入口见 [模板 UI 技能](.share/skills/ui-template/SKILL.md)。以这些设计参考和相邻组件为依据选择视觉细节，不另设固定配色或尺寸体系。
- 复用 `src/layout` 的导航、侧栏、标签页和内容区域。业务页面仅实现内容，不另建应用外壳或重复注册公共插件。
- 优先使用已注册的 Element Plus 组件；使用尚未注册的组件时同步检查 `src/plugins/elementPlus.ts`。复用 `PureTableBar`、`pure-table`、ReDialog、ReDrawer、Auth、Perms。
- 保持 `src/main.ts` 中样式入口顺序。Tailwind 4 配置在 `src/style/tailwind.css`，目前分别引入 theme 和 utilities；不要直接改成带完整 Preflight 的入口以免影响 Element Plus。
- 颜色使用 Element Plus 变量或已映射的 Tailwind 主题 token；兼顾 `.dark` 模式，避免给业务页写固定白色背景。布局用 Tailwind，组件覆盖使用局部样式，慎用全局覆盖与 `!important`。
- 使用现有图标入口，不为了少量图标添加另一套 UI 库。表单提供可识别标签、验证提示和键盘提交；异步操作有 loading，并处理空数据、失败与重复提交。
- `PureTableBar` 默认插槽提供 `size` 与 `dynamicColumns`，表格应消费两者；工具栏刷新事件应重新请求数据。分页事件使用 `page-size-change` / `page-current-change`，改变页大小或筛选条件时重置页码。
- 弹窗通过 `addDialog`、抽屉通过 `addDrawer` 打开。`beforeSure(done, { closeLoading })` 内先校验再保存，成功调用 `done()`；失败调用 `closeLoading()` 并保留输入。不要因请求失败提前关闭表单。

## 接口、会话与权限

- 业务请求统一从 `@/utils/http` 导入 `http`，由 `src/api/<业务>.ts` 封装。页面不自行创建 Axios 实例，不用独立 fetch 绕过会话处理，不手工拼接 token。
- GET 查询放 `params`，POST / PUT / PATCH 请求体放 `data`。传入正确的响应泛型，保留取消请求或错误处理需要的信息。
- HTTP 返回 `{ code, message, data }` 完整业务响应，成功码为 `0`。不要读 AxiosResponse 式的 `response.data.data`，不要改用 `success: true` 契约。普通业务调用需要显式处理非零 `code` 和传输异常，在 `finally` 恢复 loading。
- API 地址通过 `VITE_API_BASE_URL` 配置，资源基础路径通过 `VITE_PUBLIC_PATH` 配置。`API_PROXY_TARGET` 只控制开发服务器 `/api` 代理，默认不移除 `/api` 前缀。不得把密码、私钥或服务端密钥写入源码或 `VITE_` 环境变量。
- `/login` 与 `/refresh-token` 属于鉴权白名单。修改 HTTP 拦截器时，保持并发过期请求共用一次刷新、刷新失败使所有等待请求结束、登出清理会话的行为，并更新针对行为的测试。
- Mock 只用于开发，`VITE_USE_MOCK=true` 只放开发配置；构建与预览不启用 Mock。`admin/admin123` 只用于本地演示，生产必须连接真实后端。
- `meta.roles` 管页面与菜单；`Auth` / `v-auth` / `hasAuth` 检查当前路由 `meta.auths`；`Perms` / `v-perms` / `hasPerms` 检查登录数据 `permissions`。不能混用这两套按钮权限来源。数组权限要求全部满足。
- 权限指令在挂载时移除不允许的元素，不适合依赖动态恢复；动态权限用组件或函数控制渲染。前端隐藏不能代替后端接口授权。
- 复用 `src/utils/auth.ts` 管理会话。更改存储命名空间时同步检查平台配置、会话键、路由缓存、登录退出逻辑，避免多个同域应用相互污染。

## 验证与交付

- 常规代码改动运行 `pnpm typecheck`、`pnpm lint`、`pnpm format:check`，需要修正格式时运行 `pnpm format` 后检查 diff。构建、路由、依赖和入口变化运行 `pnpm build`。
- 修改 HTTP、鉴权或其他有测试覆盖的行为时运行 `pnpm test`，为新失败分支补充有意义的行为测试。现有 Vitest 使用 Node 环境，不代表 UI 已测试，不为简单文案或样式改动机械新增测试。
- 页面改动实际验证登录、相关导航、浅色与暗色、窄屏、加载 / 空 / 错误状态；权限改动覆盖允许和拒绝场景。仅做与改动相关的检查。
- 报告实际变更、运行过的检查及其结果，说明未验证项；不能只凭代码阅读或启动进程就宣称测试、构建、页面均通过。
- 保留 `LICENSE` 以及共享技能已有的来源和许可。技能从本模板 `AGENT.md` 和 `.share/skills-index.md` 定位；独立模板以本文件、随附技能和源码为开发入口，不把外部路径写成运行前置条件。
