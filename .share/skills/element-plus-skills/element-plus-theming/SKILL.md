---
name: "element-plus-theming"
description: "Use when changing Element Plus theme colors, component styles, or design tokens in this Vue project with its existing CSS variables and theme hooks."
metadata:
  author: jiaiyan
  version: "1.0.0"
  adaptation: "Project-specific theme guidance based on existing source and styles."
---

# Element Plus 项目主题

这是保留原作者信息的项目适配版，路径相对当前应用根目录。完整项目与独立模板都以现有 Element Plus 变量、主题 hook 和 `.dark` 样式为主题来源。

## 设计与源码入口

新增或改造自定义组件，先读[设计总览](../element-plus-design-overview/SKILL.md)，然后按需要读[颜色](../element-plus-design-color/SKILL.md)、[边框](../element-plus-design-border/SKILL.md)、[布局](../element-plus-design-layout/SKILL.md)与[排版](../element-plus-design-typography/SKILL.md)。设计参考帮助选择语义与层次，实际取值服从当前主题和邻近组件。

| 内容                          | 入口                                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| Element Plus 主题色及明暗色阶 | `src/layout/hooks/useDataThemeChange.ts` 中的 `setEpThemeColor` / `setPropertyPrimary` |
| 全局主题与持久化状态          | 现有布局设置、`src/store/modules/epTheme.ts`、`public/platform-config.json`            |
| Element Plus 公共样式覆盖     | `src/style/element-plus.scss`，由 `src/style/index.scss` 加载                          |
| 暗色变量与覆盖                | `src/style/dark.scss`；已有 Element Plus 暗色变量样式导入                              |
| Tailwind 语义变量映射         | `src/style/tailwind.css`，引用现有 `--el-*` 变量                                       |
| 基础组件样式入口              | `src/main.ts` 的 `element-plus/dist/index.css`                                         |

## 使用现有语义变量

业务组件的颜色使用主题变量，而不是再定义一套固定颜色：

| 用途            | 变量示例                                                                           |
| --------------- | ---------------------------------------------------------------------------------- |
| 主操作与强调    | `--el-color-primary`                                                               |
| 背景            | `--el-bg-color`、`--el-fill-color-blank`                                           |
| 主要 / 常规文字 | `--el-text-color-primary`、`--el-text-color-regular`                               |
| 边框            | `--el-border-color`                                                                |
| 反馈语义        | `--el-color-success`、`--el-color-warning`、`--el-color-danger`、`--el-color-info` |

例如在业务组件已有样式中引用：

```css
.business-panel {
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
  border-color: var(--el-border-color);
}
```

布局、间距和尺寸沿用邻近页面与设计参考；局部覆盖先限定业务容器，跨组件内部结构时有范围地使用 `:deep()`。公共修正才进入 `src/style/element-plus.scss`。避免为了单个组件扩大为全局样式覆盖。

## 修改主题色或暗色

`useDataThemeChange` 已通过 `setEpThemeColor` 更新 store、`--el-color-primary` 以及 light / dark 色阶；`dataThemeChange` 与现有布局设置协作维护 `.dark`。主题设置页面还负责既有持久化行为。

修改时复用这条链路，核对当前项目的配置和存储状态。只覆盖一个主色变量会留下按钮 hover、active 等色阶不一致；额外创建一个独立主题状态也会与现有设置互相覆盖。

`src/style/dark.scss` 已引入 Element Plus 暗色变量。新增页面消费这些变量，并分别检查暗色下的文字、边框、表单、弹层与禁用状态。不要在业务页面重复导入完整主题或添加第二个主题开关。

## CSS 变量与 Sass 的边界

CSS 变量用于运行时主题；Sass 用于当前项目已有的样式组织、计算和覆盖。当前 `src/style/element-plus.scss` 是应用侧覆盖文件，基础组件 CSS 由 `src/main.ts` 导入，不是通过一个自建主题编译入口生成。

因此，仅在任意业务 SCSS 中写 Element Plus 的 Sass 变量不会自动改写已经导入的预编译 CSS。当前任务优先使用现有 CSS 变量和主题 hook；具体构建配置以项目现状为准。

## 验证

检查浅色 / 暗色、主色切换后的 hover / active / disabled、刷新后的设置恢复，以及 Dialog / Drawer / Popover 等弹层。运行目标项目的样式、类型和构建检查时遵循其现有脚本，不把格式检查或变量定义存在当成视觉验收。
