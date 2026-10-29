---
name: tailwind-design-system
description: Use when implementing layout, spacing, responsive styles, theme tokens, or reusable UI patterns in this Vue 3, Element Plus, and Tailwind CSS v4 project.
metadata:
  source: Adapted from wshobson/agents tailwind-design-system; upstream provenance remains in skills-lock.json.
  scope: Project-curated Vue and Element Plus guide
---

# Tailwind Design System — 项目适用版

本指南根据当前完整项目与独立模板裁剪，保留已有 Tailwind v4、Vue 和 Element Plus 的配合方式。目录中的源码路径相对正在开发的项目根；先读目标项目的 `AGENTS.md`、`ui-template` 和 `src/style/tailwind.css`。本地内容经过裁剪，不是上游快照的逐字副本；来源记录保留。

## 设计依据

新增或改造自定义组件，包括从零实现、二次封装和业务组合，必须先读 [Element Plus 设计概览](../element-plus-skills/element-plus-design-overview/SKILL.md)。按涉及内容读取相应组件以及颜色、边框、布局、排版设计技能；沿用现有主题和邻近组件风格。

Tailwind 负责落实布局和样式。配色、尺寸、间距、圆角、阴影根据组件语义与设计资料选择，不在本技能定义另一套固定数值表。

## 当前项目约束

- 样式入口在 `src/main.ts`：reset → 公共样式 → Tailwind → Element Plus，修改时保留目标项目已有顺序。
- `src/style/tailwind.css` 分别导入 `tailwindcss/theme.css` 和 `tailwindcss/utilities.css`；保留当前层级与边框兼容样式。
- 颜色复用 `@theme` 中映射的 Element Plus 变量，暗色复用既有 `.dark` 变体和平台主题切换。
- 页面结构使用 Vue SFC 与 Element Plus；交互组件先复用已有组件及项目包装，再补充业务布局。
- 项目现有 ESLint 的 Tailwind 规则参与验收；以项目配置与相邻代码为准，修改后检查实际 class 写法。

## 按任务阅读

| 任务                             | 参考                                          |
| -------------------------------- | --------------------------------------------- |
| 样式入口、语义颜色、响应式布局   | [布局与主题](references/details.md)           |
| Vue 状态样式、组件覆盖、交互验收 | [组件与状态](references/advanced-patterns.md) |

交付时检查浅色 / 暗色、窄屏、文本较长和异步状态；样式检查不能代替浏览器交互检查。
