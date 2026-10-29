# Pure Admin Starter

从当前项目提取的独立后台起步模板。保留账号密码登录、原有布局、主题切换、多标签页、中英文、路由权限和空白首页；保留 `PureTableBar` / `pure-table`、Dialog、Drawer、Auth、Perms 等基础组件。演示业务、图表、地图、编辑器、播放器和对应重型依赖已移除。

模板使用 Vue 3、TypeScript、Pinia、Vue Router、Element Plus、Tailwind CSS 4 和 Vite 8 / Rolldown；检查工具为 ESLint、Prettier、vue-tsc 和 Vitest 5。当前是单应用，使用本目录的构建与测试配置。

## 独立使用

需要 Node.js `>=22.22.1`、pnpm `>=11`；精确包管理器版本见 `package.json` 的 `packageManager`。

在原仓库中运行：

```sh
cd templates
pnpm install --frozen-lockfile
pnpm dev
```

默认开发地址为 `http://localhost:4175`，端口被占用时以终端输出为准。开发 Mock 账号为 **`admin` / `admin123`**。

也可以把整个 `templates` 目录复制为新项目，包含隐藏配置文件、`.vscode/`、`.share/`、`AGENT.md`、`AGENTS.md`、`pnpm-lock.yaml` 和 `LICENSE`，然后在新目录执行以上安装和运行命令。无需复制父项目的 `node_modules`、`docs` 或 `.agents`；也不要复制已有的 `templates/node_modules`、`dist`、测试覆盖率和缓存目录。

Agent 从 [AGENT.md](AGENT.md) 定位随模板携带的技能；[.share/skills-index.md](.share/skills-index.md) 列出全部 93 个真实技能入口。共享目录包含 Vue、Element Plus、Tailwind、Vite、Vitest 等已安装技能及参考文件，独立复制后仍可读取。

## 常用命令

| 命令                | 用途                                    |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | 启动开发服务器，按环境配置启用本地 Mock |
| `pnpm typecheck`    | 检查 TypeScript 和 Vue 模板类型         |
| `pnpm lint`         | 只检查 ESLint 规则，不自动修改文件      |
| `pnpm format:check` | 检查 Prettier 格式                      |
| `pnpm format`       | 格式化文件，会修改源码                  |
| `pnpm test`         | 运行 Vitest 测试                        |
| `pnpm test:watch`   | 监听模式运行测试                        |
| `pnpm build`        | 类型检查后构建，产物写入 `dist/`        |
| `pnpm preview`      | 本地预览构建产物，默认端口 4175         |

`tests/` 使用 Node 环境测试 HTTP 返回值、请求鉴权、并发刷新令牌、路由初始化、语言恢复和缓存隔离，不是浏览器 UI 测试。涉及布局、交互和权限显示的修改，还需要实际检查页面；后续可按需要加入 Vitest Browser Mode 或端到端测试。

## VS Code

直接将 `templates` 或复制后的项目目录作为 VS Code 工作区根目录打开，使用随模板携带的 [.vscode](.vscode/) 配置：

- [settings.json](.vscode/settings.json)：Prettier 保存格式化、显式保存时 ESLint 修复、Vue 检查、Tailwind 入口与 YAML 国际化路径。
- [extensions.json](.vscode/extensions.json)：推荐 Vue、ESLint、Prettier、Tailwind CSS、i18n Ally、YAML 六个扩展。
- [vue.code-snippets](.vscode/vue.code-snippets)：在 Vue 文件中输入 `vue-page` 或 `vue-component`，插入符合当前 SFC 顺序的页面 / 局部组件骨架。

页面片段的组件名需与路由名一致，标题 id 在当前文档唯一，文案 key 补入中英文 locale；片段仅提供结构，业务逻辑和动态路由按 UI Template 完成。编辑器的保存修复会修改文件，仍需按项目命令执行交付检查。

## 目录与扩展位置

开发页面和组件时遵循 UI Template 的[组件实现与页面结构规范](.share/skills/ui-template/references/page-component-structure.md)，其中提供目录树、页面分区、组件契约、语义化表单示例和交付验收表。

```text
.
├── .share/                    # 技能完整副本、名称与路径索引
├── .vscode/                   # 必要编辑器设置、扩展推荐与 Vue 片段
├── AGENT.md                   # 技能定位入口
├── AGENTS.md                  # 随模板携带的 Agent 开发约束
├── locales/                   # zh-CN.yaml、en.yaml
├── mock/                      # 仅开发服务器使用的模拟接口
├── public/
│   └── platform-config.json   # 标题、布局、主题、多标签和存储命名空间
├── src/
│   ├── api/                   # 接口函数与响应类型
│   ├── assets/                # 布局、图标和错误页面的必要资源
│   ├── components/            # 保留的通用组件
│   ├── config/                # 平台配置加载
│   ├── directives/            # auth、perms 等指令
│   ├── layout/                # 导航、侧栏、标签页、设置和内容区
│   ├── plugins/               # Element Plus 与 i18n
│   ├── router/
│   │   ├── modules/home.ts    # /welcome 首页
│   │   ├── modules/remaining.ts # 登录、错误页和刷新重定向
│   │   ├── index.ts           # 路由装配和导航守卫
│   │   └── utils.ts           # 动态路由、菜单和路由权限
│   ├── store/modules/         # 用户、权限、布局、主题和多标签状态
│   ├── style/                 # Tailwind、主题和 Element Plus 样式
│   ├── utils/
│   │   ├── auth.ts            # 会话和登录权限
│   │   └── http/              # 唯一业务 HTTP 入口
│   ├── views/                 # login、welcome、error
│   ├── App.vue                # 应用与 Dialog / Drawer 容器
│   └── main.ts                # 插件、组件和样式注册
├── tests/                     # 请求、路由、语言和缓存隔离测试
├── types/                     # 路由、全局组件和环境类型
├── vite.config.ts             # Vue、Tailwind、i18n、图标、Mock、构建
├── vitest.config.ts            # Node 测试配置
├── eslint.config.js
├── pnpm-lock.yaml
└── package.json
```

新增业务放到 `src/views/<业务名>/`，同目录组织页面专用组件和逻辑；接口放到 `src/api/<业务名>.ts`。基础静态路由保留在 `src/router/modules/`；业务页及隐藏详情默认按账号动态加载，首次添加时在 `src/router/dynamic/` 分文件定义并汇总，供开发 Mock 和后端种子使用。浏览器仍通过 `GET /get-async-routes` 加载，不能为方便本地开发把业务塞进静态路由。路由来源、账号状态、入库清单和后端切换步骤见[路由分工](.share/skills/ui-template/references/route-sources.md)。该目录是新增业务的约定，当前模板仅提供基础页面和空动态菜单。优先复用现有布局和基础组件，不要复制一套导航或请求客户端。

路由与权限接入请阅读 UI Template 的[路由制定与 RBAC 权限实现引导](.share/skills/ui-template/references/routing-rbac.md)，包含订单页面示例、静态 / 动态菜单、角色与按钮授权、刷新与账号切换，以及验收矩阵。

## 配置与真实后端

| 变量                  | 默认值 / 位置             | 说明                                                  |
| --------------------- | ------------------------- | ----------------------------------------------------- |
| `VITE_PUBLIC_PATH`    | `/`，`.env`               | 静态资源部署基础路径                                  |
| `VITE_ROUTER_HISTORY` | `hash`，`.env`            | 默认 Hash 路由；切换 HTML5 History 时需配置服务器回退 |
| `VITE_HIDE_HOME`      | `false`，`.env`           | 首页菜单可见性                                        |
| `VITE_API_BASE_URL`   | 空，`.env`                | API 基础地址；为空时请求当前站点                      |
| `VITE_USE_MOCK`       | 开发 `true`，生产 `false` | Mock 只在开发服务器加载，构建与预览均不启用           |
| `API_PROXY_TARGET`    | 未配置                    | 可选的本地 `/api` 代理目标，属于开发服务器配置        |

本地对接真实后端时，可在 `.env.development.local` 中设置：

```dotenv
VITE_USE_MOCK=false
VITE_API_BASE_URL=/api
API_PROXY_TARGET=http://localhost:8080
```

当前代理保留 `/api` 前缀；如果后端没有该前缀，需要明确调整 `vite.config.ts` 的转发规则。生产环境通过 `VITE_API_BASE_URL` 或部署服务器的同源反向代理连接真实后端；开发代理不随 `dist/` 部署。修改环境变量后重启开发服务器或重新构建。`VITE_` 变量会进入前端，不能放密钥。

默认接口契约以 `src/api/user.ts`、`src/api/routes.ts` 和 `mock/` 源码为准：

| 请求                    | 输入                     | 成功时的 `data`                                                                                    |
| ----------------------- | ------------------------ | -------------------------------------------------------------------------------------------------- |
| `POST /login`           | `{ username, password }` | `avatar`、`username`、`nickname`、`roles`、`permissions`、`accessToken`、`refreshToken`、`expires` |
| `POST /refresh-token`   | `{ refreshToken }`       | `accessToken`、`refreshToken`、`expires`                                                           |
| `GET /get-async-routes` | 无                       | 动态路由数组；没有动态菜单时返回 `[]`                                                              |

统一响应为 `{ code: 0, message: "ok", data: ... }`，非零 `code` 表示业务失败。HTTP 封装返回完整业务响应体，不是 AxiosResponse，也不会自动把业务错误转换成异常；调用方需要检查 `code`，同时处理请求异常。`expires` 应提供可由 `new Date(...)` 解析的日期值，建议后端返回 ISO 8601 字符串。前端通过 `Authorization: Bearer <accessToken>` 访问受保护接口。

登录 Mock 只用于本地体验，不是生产鉴权。生产使用真实后端验证身份、角色和每个敏感操作；`pnpm preview` 不提供模拟登录服务。当前退出操作清理前端会话，若后端要求令牌撤销，需要补充注销接口。

平台标题、默认主题和布局入口在 `public/platform-config.json`；默认持久化命名空间为 `admin-starter-`。从模板创建多个同域应用时，为各应用设置独立命名空间，并同步检查 `src/utils/auth.ts` 的会话键。

## 组件和权限

| 能力           | 使用入口                                         | 关键约束                                                                          |
| -------------- | ------------------------------------------------ | --------------------------------------------------------------------------------- |
| 表格           | `@/components/RePureTableBar`、全局 `pure-table` | 工具栏插槽的 `size`、`dynamicColumns` 要传入表格；分页状态与请求参数保持一致      |
| 弹窗           | `addDialog`，来自 `@/components/ReDialog`        | 在 `beforeSure` 中校验和保存，成功才调用 `done()`；失败恢复按钮 loading，保留表单 |
| 抽屉           | `addDrawer`，来自 `@/components/ReDrawer`        | 与 Dialog 使用相同的异步提交规则                                                  |
| 路由按钮权限   | `Auth` / `v-auth` / `hasAuth`                    | 读取当前路由的 `meta.auths`                                                       |
| 登录按钮权限   | `Perms` / `v-perms` / `hasPerms`                 | 读取登录结果中的 `permissions`                                                    |
| 页面与菜单权限 | 路由 `meta.roles`                                | 与用户 `roles` 匹配；不代替后端授权                                               |

`Auth` 和 `Perms` 已全局注册；`hasAuth` 来自 `@/router/utils`，`hasPerms` 来自 `@/utils/auth`。权限数组表示全部满足。权限指令在挂载时处理元素；权限需要动态变化时使用组件或函数控制显示。

所有新页面遵循 [AGENTS.md](./AGENTS.md)，通过 [AGENT.md](./AGENT.md) 加载本模板 `.share/skills/` 中的 `ui-template` 与相关技能。保留 `LICENSE` 中的原项目许可与归属，以及共享技能已有的来源与许可。
