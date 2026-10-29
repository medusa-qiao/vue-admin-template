# 模板共享技能

本目录携带与项目技术栈一致的 7 组技能、94 个 `SKILL.md`：UI Template、TypeScript、Vue、Element Plus、Tailwind、Vite、Vitest，不需要父项目或用户全局技能目录。读取项目根 [AGENT.md](../AGENT.md)，再按 [skills-index.md](skills-index.md) 选择入口；程序读取 [skills-index.json](skills-index.json)，其中路径相对模板项目根目录。

`skills/ui-template/` 是模板专用入口，以本模板 `AGENTS.md`、README 和源码为准。其余 6 组技能携带了本项目适用的资料和已有许可；部分入口与资料经过项目裁剪，来源元数据与 `localAdaptation` 说明保存在 JSON 索引的 `packages` 中。来源哈希保留上游安装记录，不代表裁剪后的本地内容。这些是可阅读的本地技能文件，不代表所有 Agent 都会自动扫描 `.share`；因此同时提供 `AGENT.md` 和 `AGENTS.md` 的明确定位入口。

独立复制时包含本隐藏目录。独立项目中直接维护此处副本；更新技能后同步两个索引的名称和真实路径，保留来源与许可证。第三方快照已加入项目 `.prettierignore`，日常格式化不会改写上游文档。

不要用完整项目的 `ui-template` 覆盖模板入口：模板已配置 Vitest、lint 为只读检查、Mock 仅开发启用，具体行为以当前源码为准。更新技能时保持当前技术栈范围，不恢复已经清理的无关技术引导。

Element Plus 上游少量索引文件存在相对链接问题；通过此处覆盖所有嵌套技能的全量索引定位实际文件。`superpowers:*` 和 `find-skills` 属于可选运行时技能，按当前会话清单查找，不依赖其他机器的绝对缓存路径。
