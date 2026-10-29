---
name: vite-config
description: Existing Vite configuration and environment boundaries for this Vue admin application
---

# 配置与运行

本页按项目现有配置整理，不作为替换整个 `vite.config.ts` 的模板。源码路径相对目标项目根。

## 配置入口

| 内容             | 完整项目                                             | 独立模板                                   |
| ---------------- | ---------------------------------------------------- | ------------------------------------------ |
| 入口             | 异步 `vite.config.ts`                                | `defineConfig` 函数形式的 `vite.config.ts` |
| 环境读取         | `loadEnv` 后经 `build/utils.ts` 的 `wrapperEnv` 转换 | 配置函数内 `loadEnv(mode, root, "")`       |
| alias            | `build/utils.ts` 的 `alias`                          | 配置内 `@` 指向本项目 `src`                |
| 插件             | `build/plugins.ts` 的 `getPluginsList`               | 配置内插件数组                             |
| 开发端口         | 读取 `VITE_PORT`                                     | `package.json` 中 `vite --port 4175`       |
| 代理             | `server.proxy`，当前为空对象                         | `API_PROXY_TARGET` 配置 `/api` 代理        |
| 静态资源基础路径 | `VITE_PUBLIC_PATH`                                   | `VITE_PUBLIC_PATH`，缺省 `/`               |

变更配置时保留原来的函数形式和环境转换，不把完整项目的异步函数直接展开为对象。模板 `/api` 代理默认不移除前缀；调整时与真实后端路径一致。

## 环境和公开配置

区分开发、生产和 staging 等实际存在的 mode。环境文件与脚本配套修改，客户端读取 `import.meta.env`，类型声明同步检查 `types/`。`VITE_` 变量会进入客户端，不能放服务端密钥。

模板配置中的 `loadEnv(..., "")` 用于配置阶段读取 `API_PROXY_TARGET` 等值，不代表应该把读取到的全部变量传入客户端 `define`。客户端只暴露确需公开的配置。

修改资源 base 时同步核对当前路由历史模式、静态资源地址和部署目录；应用可启动不代表子目录资源或刷新地址已经正确。

## 使用项目脚本验证

- `pnpm dev`：检查目标页面开发加载与热更新。
- `pnpm build`：运行目标项目的完整构建脚本。完整项目还执行版本文件生成；模板包含 Vue / TypeScript 类型检查。
- `pnpm preview`：查看已经构建的产物，分别检查首页、资源和相关路由。

根项目和模板的 Mock 条件不同，见[项目插件链](core-plugin-api.md)。不以构建成功代替真实后端联调，也不将启动预览当作执行过 build。
