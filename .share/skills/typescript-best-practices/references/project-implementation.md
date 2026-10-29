# 项目 TypeScript 实现规则

适用于完整项目和独立模板，以当前任务的 `package.json`、`tsconfig.json`、`AGENTS.md` 与源码为准。先读同级技能 [ui-template](../../ui-template/SKILL.md) 的项目规范，Vue SFC/TSX 再读 [vue](../../vue/SKILL.md)。本文件把上游类型建模与边界校验原则接入已有项目，不要求额外安装原则技能。

## 先查现成实现，再决定新增内容

1. 用 `rg` 查同业务的类型、API、页面和组件，再查 `src/utils/`、`src/components/`、领域 composable、已有 Pinia store。
2. 查 `package.json` 与已安装库的公开类型/API，优先复用已有 VueUse、Element Plus、`@pureadmin/utils` 等合适能力；核对当前版本和调用方式后使用。不能只凭函数名字相似就替换，也不通过依赖的内部文件偷用实现。
3. 优先级是：直接复用 → 在现有实现上做小幅适配 → 必要时新增领域函数。复用必须语义一致；相似字段不代表相同业务实体。
4. 新增工具或抽象时，在交付说明中简要列出检索过的入口、现有能力缺口及新增范围。可在业务目录解决的一次性逻辑不先变成通用框架；确有多个调用者和稳定契约时再提取。

特别遵守：业务接口调用 `src/api/` → `@/utils/http`，复用现有会话、刷新和错误包络；使用已有 Router、Pinia、表单和事件机制。不要重写 HTTP 客户端、token 管理、校验引擎、事件总线、CRUD 框架、DI 容器或新 store 体系来包装一个页面。仅当任务明确要求改基础设施时，在原机制上评估和验证改动。

## 类型的唯一来源

- 领域实体与 API DTO 优先从已有领域模块导入。后端生成的 OpenAPI/协议类型已存在时优先使用；没有生成链路时维护一份已确认的领域契约，不为本任务随意搭建代码生成系统。
- 同源类型的投影优先用 `Pick`、`Omit`、`Partial`、`Readonly`、`ReturnType`、`Awaited` 等内建工具。字段含义相同才复用；编辑输入、响应实体和展示模型不相同时建立显式映射。
- 组件 Props、Emits、表单、查询参数、分页和响应都明确类型。Element Plus 的 `FormInstance`、`FormRules` 等从库的公开入口导入，不手抄一套接口。
- 简单变量和局部表达式保留推断。公共边界、复杂返回值明确类型；泛型必须表达真实的输入/输出关系，普通接口和联合能清楚表达时不引入递归条件类型、复杂 Builder 或多层泛型。
- 多种互斥状态用判别联合表达，例如 `idle/loading/success/error`；简单布尔开关仍可用布尔。品牌类型只用于已知的领域混用风险，不要求所有 string/number 都加品牌。

## 外部数据与断言

- 接口响应、storage、路由参数、表单原始输入和动态菜单属于需要审视的边界。未知形状先按 `unknown` 收窄；`http.request<T>`、`JSON.parse(...) as T`、`satisfies` 都不构成运行时校验。
- 先复用项目已经存在的解析器、schema 与检查逻辑。已有 schema 库时从 schema 推导类型，避免 schema、interface 和手写 guard 三份漂移。没有 schema 库且只需少量字段检查时写小而完整的领域 guard，不因示例用了 Zod 就新增依赖。
- 类型守卫必须验证其所声称的全部必需字段与约定的值域。只看到 `id` 或 `type` 字段存在，不能把整个输入宣布为完整实体。可选字段存在时也要检查类型；日期、非负数、有限数等规则以业务契约为准。
- 数据进入后完成必要校验，内部复用已验证值；不要每个组件重复解析同一响应。也不能假设历史接口已有运行时校验。失败按现有业务包络处理，区分缺数据、无权限与网络/解析失败。
- 不新增 `any`、双重断言、未经证明的 `!`、`@ts-ignore` 来让检查变绿。第三方类型确有限制时，先寻找其公开类型/API，在最小边界记录不可避免的断言依据；不要扩散到页面。
- `as const` 用于字面量/只读推断；`satisfies` 用于编译期兼容性检查。二者均不会验证外部 JSON、冻结运行时对象或替代服务端权限。

## Vue 与现有工程

- `.vue` 使用 `<script setup lang="ts">`，TSX 使用 Vue JSX；Props 输入、局部编辑草稿与 Emits 输出分清职责，复用已有 composable 和 store。不要把 React hooks、`ReactNode` 或 JSX 设置带进来。
- 两个项目当前 `strict:false`、`strictFunctionTypes:false`、`moduleResolution:"bundler"`、`noEmit:true`。新代码仍做明确类型和空值处理；不能声称已开启完整 strict 保证，也不因安装本技能擅自改全仓 tsconfig、开启声明产物或切到 NodeNext。
- 保留现有 Prettier、ESLint、`vue-tsc`、Vite/Rolldown 与目录格式。`tsc` 单独通过不能替代 Vue SFC 类型检查。根项目 `pnpm lint` 会改文件，先按 `ui-template` 的工程质量约束选择命令；独立模板 `pnpm lint` 是只读检查。
- 测试复用现有方案：独立模板已有 Vitest，根项目未配置同样的测试脚本。对新增解析失败分支、互斥状态和改变的行为做相称验证；不为低影响文档改动补机械测试，也不把 Node 测试称作 UI 已验收。

## 交付自检

说明本次复用了哪些类型/函数/组件、为什么仍需新增、数据边界在哪里验证、实际运行过哪些检查。没有实现的 API 或状态策略标记待确认；不要用“符合最佳实践”代替具体证据。
