# 布局与主题

本页按项目现有 `src/main.ts`、`src/style/tailwind.css` 和 Element Plus 主题组织；适用于完整项目和独立模板。源码路径相对目标项目根。

## 保留已有样式入口

现有入口的关键片段如下；修改对应文件，不在业务页重复导入：

```css
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);

@custom-variant dark (&:is(.dark *));

@theme {
  --color-bg_color: var(--el-bg-color);
  --color-primary: var(--el-color-primary);
  --color-text_color_primary: var(--el-text-color-primary);
  --color-text_color_regular: var(--el-text-color-regular);
}
```

以上是源码节选，不是覆盖整个文件的替代内容。现有边框兼容规则和 `@utility` 也需保留。主题颜色由 Element Plus 和平台设置维护；业务页直接使用这些语义映射或现有 `--el-*` 变量，保持主题切换与暗色一致。

## 布局选择

| 场景                     | 项目中的落实方式                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------- |
| 同行标题、筛选和操作     | 选择 flex 对齐，内容超出时允许换行；复用邻近页间距                                  |
| 多列信息                 | 使用已有响应式栅格 / grid 布局，窄屏按内容优先级排列                                |
| 业务表格                 | 复用 PureTableBar 与 pure-table；按数据需要处理列宽和滚动                           |
| 容器背景、正文、次要文字 | 使用 `bg-bg_color`、`text-text_color_primary`、`text-text_color_regular` 等已有映射 |
| 组件边框、圆角、阴影     | 先查对应 Element Plus 设计技能与邻近实现；必要时使用主题变量                        |

复用已有 `flex-c`、`flex-ac`、`flex-bc` 前先核对其语义，避免仅为缩短 class 而降低可读性。新增公共 utility 前确认确实跨页面复用；只供单个页面使用的样式留在该页面。

## 响应式与内容状态

按项目现有断点与相邻页面布局处理窄屏。检查标签、按钮、筛选条件和长文本是否挤压正文；仅表格内容需要横向滚动时，将滚动限制在表格容器。空数据、加载、失败状态继续使用既有组件和主题，不另写全局样式覆盖。

Tailwind 写在 Vue 的 `class` 或 `:class` 中；脚本中的 class 选择使用清楚、完整的类名。复杂的组件内部覆盖放在局部样式中，并限定作用范围。
