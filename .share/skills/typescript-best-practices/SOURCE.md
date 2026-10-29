# 来源与项目适配

- 上游：`cursor/plugins` 中的 pstack TypeScript skill；作者和授权见 [LICENSE](LICENSE)。此为社区/插件中的实践指南，不是 TypeScript 团队官方规范。
- 安装来源：`https://github.com/cursor/plugins/tree/1ba91fc25c0977741dd0e267849e6234b037ed0a/pstack/skills/typescript-best-practices`。
- 固定提交：`1ba91fc25c0977741dd0e267849e6234b037ed0a`；安装日期：2026-10-29。
- 使用 Skills CLI 安装一个项目级技能到 `.agents/skills/typescript-best-practices`，保留 `skills-lock.json` 的上游来源和哈希；哈希不是本地适配内容的校验和。
- 共享副本及独立模板均携带本目录全部内容和许可证，按各自项目的 Agent 入口定位。

## 适配内容

1. 标准化技能入口，覆盖 Vue 的 TypeScript 脚本，移除禁止自动调用的上游标记。
2. 将对未安装 `type-system-discipline`、`boundary-discipline` 技能的依赖改为本地可读的项目规则；不额外安装其技能链。
3. 添加“先查现有代码/库、再最小适配”的流程，明确复用 DTO、VueUse、组件、HTTP、会话与 store；保留项目配置和工具链，不引入新框架或默认迁移 strict。
4. 修正 `durationMs: number` 可保证非负的错误说法，澄清 `as const`、`satisfies`、品牌类型、接口泛型和运行时校验的边界；明确 schema 示例不要求安装 Zod。
5. 修改对象参数、品牌类型、边界验证及测试的绝对规则，使其按实际风险与项目已有契约使用。

更新时先核对上游差异，再保留上述项目约束；不要用未经审核的上游版本直接覆盖。授权为 MIT，保留完整许可。
