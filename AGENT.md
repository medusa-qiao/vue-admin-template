# Agent 技能定位入口

本目录是独立项目根。编码约束见 [AGENTS.md](AGENTS.md)，运行与接口说明见 [README.md](README.md)。技能已随模板放在 `.share/skills/`，复制项目时必须保留 `.share` 隐藏目录。

完整技能路径见 [.share/skills-index.md](.share/skills-index.md)，程序读取 [.share/skills-index.json](.share/skills-index.json)。这里的技能不依赖父项目 `.agents` 或用户的插件缓存目录。

| 任务                                | 本项目入口                                                                                                                                                                                                                                                                                                       |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 模板结构、页面、接口、权限与检查    | [ui-template](.share/skills/ui-template/SKILL.md)                                                                                                                                                                                                                                                                |
| Vue、响应式、SFC、TSX               | [vue](.share/skills/vue/SKILL.md)                                                                                                                                                                                                                                                                                |
| TypeScript、DTO、类型收窄、复用实现 | [typescript-best-practices](.share/skills/typescript-best-practices/SKILL.md)                                                                                                                                                                                                                                    |
| UI 组件选型                         | [element-plus-design-overview](.share/skills/element-plus-skills/element-plus-design-overview/SKILL.md)                                                                                                                                                                                                          |
| 表单 / 表格 / 弹窗 / 抽屉           | [el-form](.share/skills/element-plus-skills/components/el-form/SKILL.md)、[el-table](.share/skills/element-plus-skills/components/el-table/SKILL.md)、[el-dialog](.share/skills/element-plus-skills/components/el-dialog/SKILL.md)、[el-drawer](.share/skills/element-plus-skills/components/el-drawer/SKILL.md) |
| Tailwind、布局、主题 token          | [tailwind-design-system](.share/skills/tailwind-design-system/SKILL.md)                                                                                                                                                                                                                                          |
| 开发服务、Vite、Rolldown            | [vite](.share/skills/vite/SKILL.md)                                                                                                                                                                                                                                                                              |
| Vitest 测试                         | [vitest](.share/skills/vitest/SKILL.md)                                                                                                                                                                                                                                                                          |

先读取模板专用 `ui-template`，然后只加载任务需要的技能。软件能力以本目录 `package.json` 和配置为准：本模板已有 Vitest，lint 只检查，Mock 仅开发启用。

编写或评审 TypeScript（含 Vue 的脚本）时必须读取 `typescript-best-practices`。先检索已有 DTO、API、utils、组件、composable 和已安装库，再做最小必要实现；新增抽象需说明现有能力缺口。遵循该技能的项目适配，不重建请求/会话体系，不因安装技能擅自修改 strict 或工具链。

新增页面必须先读[静态与动态路由分工](.share/skills/ui-template/references/route-sources.md)：基础路由静态，业务及隐藏详情默认动态；分别组织文件和导入入口，纯前端阶段也通过动态 Mock 加载，交付账号状态/权限条件与后端入库清单。

**新增或改造自定义组件也必须先读 [element-plus-design-overview](.share/skills/element-plus-skills/element-plus-design-overview/SKILL.md)**，包括从零实现、二次封装与业务组合。按涉及内容继续读取对应组件及 Color、Border、Layout、Typography 设计技能，沿用现有主题与相近组件风格，不另立固定配色或尺寸体系。

Element Plus 子技能嵌套在 `element-plus-skills/` 中；部分上游内部链接存在相对路径问题，使用全量索引中的入口定位。需要搜索时执行 `rg --files --hidden .share/skills`。

可选的 `superpowers:*`、`find-skills` 从当前 Agent 运行时技能清单定位；这里不宣称它们已随模板安装，也不依赖任何机器专属路径。共享技能来源和更新约束见 [.share/README.md](.share/README.md)。
