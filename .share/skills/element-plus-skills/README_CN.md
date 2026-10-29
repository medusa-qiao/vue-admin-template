# Element Plus Skills Library 

一个全面的 Element Plus UI 框架技能库，专为 AI 智能体理解和运用 Element Plus 组件而设计。

**[English Version](./README.md)**

---

## 📖 简介

这是按当前 Vue 项目适配的技能副本，保留原作者、来源信息和许可证。包含 87 个专题技能，加上包入口共 88 个 SKILL.md，并非未经修改的上游完整快照：

- **77 个组件技能** - 单个组件文档及 API 参考
- **5 个设计规范技能** - 边框、颜色、布局、字体排版和总览
- **5 个基础技能** - 快速开始、主题定制、国际化、暗黑模式、组件总览

## ✨ 功能特性

- **完整的 API 文档** - 包含属性、事件、插槽和暴露方法
- **使用示例** - 基础和进阶用法模式
- **最佳实践** - 推荐的实现指南
- **组件交互** - 组件间的协作方式
- **跨平台兼容** - 适用于任何智能体环境

## 📁 目录结构

```
element-plus-skills/
├── components/                    # 77 个组件技能
│   ├── el-affix/
│   ├── el-alert/
│   ├── el-button/
│   ├── el-form/
│   ├── el-table/
│   └── ...
├── element-plus-components/       # 组件总览索引
├── element-plus-dark-mode/        # 暗黑模式实现
├── element-plus-design-border/    # 边框规范
├── element-plus-design-color/     # 颜色规范
├── element-plus-design-layout/    # 布局网格系统
├── element-plus-design-overview/  # 设计总览
├── element-plus-design-typography/# 字体排版规范
├── element-plus-i18n/             # 国际化
├── element-plus-quickstart/       # 快速开始指南
└── element-plus-theming/          # 主题定制
```

## 项目接入

本技能库已随项目携带。依赖版本和命令以目标项目 package.json 为准，按[项目快速开始](element-plus-quickstart/SKILL.md)维护现有显式组件注册与样式入口。

新增或改造自定义组件必须先读[设计总览](element-plus-design-overview/SKILL.md)，再按涉及内容读取对应组件、颜色、边框、布局和排版资料。更新裁剪后的技能时同步项目索引，并保留原许可证。

## 📚 使用方法

### 适用于 AI 智能体

每个技能文件遵循统一的格式：

```yaml
---
name: "el-button"
description: "按钮组件描述..."
metadata:
  author: jiaiyan
  version: "1.0.0"
---
```

### 技能分类

| 分类     | 数量 | 描述                                                                                                           |
| -------- | ---- | -------------------------------------------------------------------------------------------------------------- |
| 基础组件 | 14   | Affix、Anchor、Avatar、Backtop、Badge、Breadcrumb、Button、Card、Carousel、Collapse、Divider、Icon、Link、Text |
| 表单组件 | 24   | Autocomplete、Cascader、Checkbox、ColorPicker、DatePicker、Form、Input、Radio、Select、Switch、Upload 等       |
| 数据展示 | 17   | Avatar、Badge、Calendar、Card、Carousel、Descriptions、Empty、Image、Pagination、Progress、Table、Tree 等      |
| 导航组件 | 8    | Affix、Anchor、Breadcrumb、Dropdown、Menu、PageHeader、Steps、Tabs                                             |
| 反馈组件 | 12   | Alert、Dialog、Drawer、Loading、Message、MessageBox、Notification、Popconfirm、Popover、Result、Tooltip、Tour  |
| 布局组件 | 4    | Container、Divider、Space、Splitter                                                                            |
| 工具组件 | 5    | ConfigProvider、InfiniteScroll、Scrollbar、Tour、Watermark                                                     |

### 快速引用

```markdown
# 访问组件技能

./components/el-{name}/SKILL.md

# 访问设计规范

./element-plus-design-{name}/SKILL.md

# 访问基础技能

./element-plus-{name}/SKILL.md
```

## 🔧 组件示例

### 基础用法

```vue
<template>
  <el-button type="primary">主要按钮</el-button>
  <el-input v-model="input" placeholder="请输入内容" />
  <el-table :data="tableData">
    <el-table-column prop="name" label="姓名" />
  </el-table>
</template>
```

### 带验证的表单

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
</template>
```

## 🤝 贡献指南

欢迎参与贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/new-skill`)
3. 提交更改 (`git commit -m 'Add new skill'`)
4. 推送到分支 (`git push origin feature/new-skill`)
5. 创建 Pull Request

### 技能文件规范

每个技能文件应包含：

- **name**: 唯一标识符（如 `el-button`）
- **description**: 清晰的描述及调用条件
- **metadata**: 作者和版本信息
- **内容章节**:
  - 使用场景
  - 基础用法
  - API 参考
  - 常见模式
  - 最佳实践

## 📋 技能文件模板

```markdown
---
name: "el-{component-name}"
description: "组件描述。当用户需要...时调用"
metadata:
  author: your-name
  version: "1.0.0"
---

# 组件名称

组件描述和概述。

## 使用场景

- 场景 1
- 场景 2

## 基础用法

\`\`\`vue
<template>
<el-component />
</template>
\`\`\`

## API 参考

### 属性

| 名称 | 描述 | 类型 | 默认值  |
| ---- | ---- | ---- | ------- |
| prop | 描述 | type | default |

### 事件

| 名称  | 描述 | 类型 |
| ----- | ---- | ---- |
| event | 描述 | type |

### 插槽

| 名称 | 描述 |
| ---- | ---- |
| slot | 描述 |

## 最佳实践

1. 实践 1
2. 实践 2
```

## 📄 许可证

MIT License

Copyright (c) 2024 Element Plus Skills Library

特此免费授予任何获得本软件副本和相关文档文件（"软件"）的人不受限制地处置该软件的权利，包括不受限制地使用、复制、修改、合并、发布、分发、再授权和/或出售该软件副本，以及再授权以配备了上述权利的人员使用该软件。

上述版权声明和本许可声明应包含在该软件的所有副本或实质性成分中。

本软件按"原样"提供，不提供任何形式的担保，包括但不限于适销性、特定用途适用性和非侵权性担保。在任何情况下，作者或版权持有人均不对任何索赔、损害或其他责任负责，无论这些追责基于合同、侵权或其他行为，还是产生于、源于或有关于本软件以及本软件的使用或其他处置。

## 🔗 相关资源

- [Element Plus 官方文档](https://element-plus.org/zh-CN/)
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Element Plus GitHub](https://github.com/element-plus/element-plus)

## 📞 支持

如有问题和需要支持：

- 在 GitHub 上提交 Issue
- 查阅官方文档
- 加入 Element Plus 社区
