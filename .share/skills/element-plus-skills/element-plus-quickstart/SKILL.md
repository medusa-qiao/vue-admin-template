---
name: "element-plus-quickstart"
description: "Use when registering Element Plus components, checking global configuration, or troubleshooting component and style setup in this Vue and Vite project."
metadata:
  author: jiaiyan
  version: "1.0.0"
  adaptation: "Project-specific setup based on vue-pure-admin and its standalone template."
---

# Element Plus 项目接入

这是保留原作者信息的项目适配版。路径相对当前应用根目录；完整项目与独立模板分别使用自己的配置。依赖和包管理器版本以目标 `package.json`、锁文件为准。

## 先确认现有入口

| 内容           | 位置与当前行为                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| 组件与插件注册 | `src/plugins/elementPlus.ts` 显式导入组件，维护 `components` / `plugins` 数组，导出 `useElementPlus` |
| 应用启动       | `src/main.ts` 创建 Vue 应用，在平台配置、store、路由就绪后注册已有插件并挂载                         |
| 全局配置       | `src/App.vue` 已有 `el-config-provider`，从项目语言状态计算 `currentLocale`                          |
| 样式           | `src/main.ts` 已导入 `element-plus/dist/index.css`；`src/style/index.scss` 加载组件覆盖及暗色样式    |
| 公共组件       | 表格、弹窗、抽屉和权限入口沿用 UI Template 与现有封装                                                |

根项目为演示保留较多组件；模板只注册后台外壳和基础表单、表格所需组件。不要把根项目的整份组件列表直接覆盖到模板。

## 新增组件的步骤

1. 新增或改造自定义组件，包括二次封装和业务组合，先读[设计总览](../element-plus-design-overview/SKILL.md)，再按实际涉及内容读对应 `el-*` 和颜色、边框、布局、排版技能。保留现有主题及相近组件的视觉习惯。
2. 查看 `src/plugins/elementPlus.ts`，确认目标组件及其子组件是否已经导入并放入 `components`。只有缺少时才补充；插件或指令放入现有 `plugins` 数组。
3. 保留现有注册函数。以下是源码采用的核心方式，不是另建一套应用入口的模板：

```ts
export function useElementPlus(app: App) {
  components.forEach((component: Component) => {
    app.component(component.name, component);
  });
  plugins.forEach(plugin => app.use(plugin));
}
```

其中 `App`、`Component` 类型由 `vue` 显式导入，数组内容由同文件维护。项目没有自动导入配置；页面使用 Vue API 时也应显式导入。

4. 在现有页面或组件中使用对应标签，公共配置继续交给已有 `el-config-provider`。局部大小、禁用或加载状态使用组件现有属性；不要为单个页面重建全局插件或语言状态。
5. 保留 `src/main.ts` 的样式顺序：`reset.scss` → `index.scss` → `tailwind.css` → Element Plus 样式。Tailwind 当前分别引入 theme 和 utilities；样式问题先核对现有入口与选择器。

## 样式和主题

样式覆盖先按组件范围组织；共用修正查 `src/style/element-plus.scss`。全局颜色和暗色修改继续读取[主题指南](../element-plus-theming/SKILL.md)与[暗色参考](../element-plus-dark-mode/SKILL.md)，复用 `--el-*` 变量及现有主题 hook。

图标先查 `src/components/ReIcon` 和当前图标插件配置。现有组件出现类型提示问题时，核对 `types/`、`tsconfig.json` 和组件公开类型，不通过新增另一套 UI 或图标库解决。

## 验证

确认组件没有未解析警告，必要子组件已注册，样式、中文 / 英文、浅色 / 暗色、键盘交互和窄屏可用。随后执行目标项目已有的类型与限定范围代码检查；变更入口或构建配置时执行构建。具体验证命令从目标 `package.json` 和 UI Template 读取。
