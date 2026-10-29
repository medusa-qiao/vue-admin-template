---
name: test-environments
description: Use the template's Node test environment and isolate mocks, storage, and module state.
---

# Node 测试环境与隔离

本页为项目裁剪版本。独立模板在 `vitest.config.ts` 中指定 `environment: "node"`，测试文件位于 `tests/`；根演示项目没有默认测试配置。

## 按现有测试组织隔离

- 从 `vitest` 显式导入测试 API；不假设全局存在 `describe` 或 `expect`。
- 请求、Cookie、路由与存储等外部依赖按相邻测试使用 `vi.mock`、`vi.hoisted`、`vi.stubGlobal` 等已有模式隔离；不要 mock 被测业务本身。
- 每个用例前重置自建 Map、角色、请求结果等状态。配置中的 `clearMocks: true` 清调用记录，不负责清理测试自己创建的全部状态。
- 使用全局替身的测试在结束时清理；需要重新读取环境或初始化模块的测试，依照已有语言 / 存储测试处理模块缓存。
- 验证拒绝、超时或并发时，断言所有请求最终完成以及错误能传给调用方；不要只断言 mock 被调用。

参考当前 `tests/http.test.ts`、`tests/router.test.ts`、`tests/i18n.test.ts` 与 `tests/storage.test.ts`，具体文件名以实际目录为准。

## 验收边界

Node 环境没有真实浏览器 DOM、布局或焦点。即使用全局替身提供 `window` 或存储 API，也不能证明页面渲染和用户交互正确。涉及表单、弹窗、主题、菜单和按钮显示时，继续执行实际浏览器验收；按实际执行范围报告结果。
