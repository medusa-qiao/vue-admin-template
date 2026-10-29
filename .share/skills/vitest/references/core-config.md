---
name: vitest-configuration
description: Read and maintain the standalone template's existing Vitest Node configuration.
---

# 项目测试配置

本页按独立模板当前配置裁剪；上游来源为 Vitest 技能元数据所列的官方文档快照。源码路径相对正在操作的模板根目录。完整演示项目没有默认测试脚本。

## 当前配置

`vitest.config.ts` 的实际结构：

```ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    clearMocks: true
  }
});
```

新增行为测试放到 `tests/*.test.ts`，显式从 `vitest` 导入 `describe`、`it`、`expect`、`vi` 等 API。保留 `@` 指向本模板 `src/` 的解析规则；不要让测试依赖父项目文件。

## 运行与范围

- `pnpm test`：执行一次全部已发现的测试。
- `pnpm test:watch`：监听测试。
- 按具体任务过滤文件或名称时查 [CLI](core-cli.md)。
- 测试本身不代替 `pnpm typecheck` 或包含类型检查的 `pnpm build`。

配置只针对当前 Node 行为测试；没有启用额外的浏览器测试运行时或覆盖率插件。涉及页面的需求应另做实际浏览器验收，不因为文档提到某种测试能力就自动安装依赖。

## 修改注意

先查看相邻测试的 mock 边界，再调整配置。当前测试直接模拟外部请求、路由或存储依赖，不依赖整套应用启动。独立测试配置无需盲目合并根应用异步 Vite 配置和完整插件链。

覆盖真实的成功、失败、权限拒绝与并发行为；不要以全部 mock 后返回固定成功的测试替代业务验证。状态隔离见 [Node 环境](advanced-environments.md)。
