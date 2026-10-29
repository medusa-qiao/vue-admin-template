# 组件实现与页面结构规范

本规范适用于完整项目和独立模板的**新增页面、组件及本次实际改造部分**。源码路径相对当前应用根目录。历史演示存在混合命名、无标题层级、假保存等写法，不代表本规范；不要为了统一风格批量重命名无关文件。

“必须 / 禁止”是实现与评审的验收要求；“默认”允许根据具体业务调整，但需说明结构或交互上的理由。这是开发规范，尚未增加自动强制这些规则的 lint 插件，也不代表现有页面已完成整改。

## 1. 实现前写清结构契约

每个新页面或可复用组件先列以下信息，未使用的项标注“不适用”，不创建空文件凑结构：

| 项目     | 必须明确                                                                    |
| -------- | --------------------------------------------------------------------------- |
| 身份     | 页面 / 局部组件 / 领域组件 / 通用组件；名称、文件和唯一职责                 |
| 页面分区 | 页面标题、说明、筛选、操作、结果或详情、反馈；哪些区块需要独立组件          |
| 数据流   | props / emits / slots / 必要的 expose；谁持有输入草稿、提交条件和服务端数据 |
| 副作用   | 谁发请求、导航、开弹层和提示；请求失败、取消、重复提交和旧请求返回如何处理  |
| 语义     | 标题层级、表单边界、按钮或链接、字段标签、焦点和状态提示                    |
| 项目接入 | 复用的组件与设计技能；路由来源、角色和按钮权限；locale key；验收范围        |

组件设计先读 `element-plus-design-overview`，再按实际内容读取对应 `el-*` 和颜色、边框、布局、排版技能。路由来源沿用[静态与动态路由分工](route-sources.md)：基础页静态，业务页及隐藏详情动态；弹窗不是天然需要独立路由的页面。

## 2. 目录与命名统一

新领域默认采用下面的组织方式。只有出现对应职责时才创建文件；示例中的订单模块、API 和后端契约需要实际实现，并非模板已有业务。

```text
src/views/orders/
├── list/
│   ├── index.vue                    # 路由页：OrderList
│   ├── components/
│   │   ├── OrderFilters.vue         # 本页筛选界面
│   │   └── OrderEditForm.vue        # 仅本页使用的编辑内容
│   └── utils/
│       ├── hook.ts                  # useOrderList，页面状态与行为
│       ├── types.ts                 # 本页 UI 类型
│       └── rule.ts                  # 本页表单规则（需要时）
├── detail/
│   └── index.vue                    # 路由页：OrderDetail
└── components/
    └── OrderStatusTag.vue           # 列表与详情共用的领域组件
src/api/orders.ts                   # 请求、响应 DTO 与明确的适配
src/router/dynamic/modules/orders.ts # 开发动态定义；按路由分工接 Mock/种子
locales/zh-CN.yaml                   # 与 en.yaml 同步增量合并
```

| 对象            | 新代码命名与位置                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| 业务目录        | 小写 `kebab-case`，例如 `orders`、`audit-log`；路由页文件为 `index.vue`                                             |
| 路由页身份      | 唯一 PascalCase 名称，如 `OrderList`；与路由 `name`、`defineOptions({ name })` 一致                                 |
| 局部 / 领域组件 | 语义化 PascalCase 文件与组件名，如 `OrderFilters.vue`；模板中用 `<OrderFilters />`                                  |
| 通用组件        | 现有 `src/components/` 的 PascalCase 目录与 `index.ts` 出口；较复杂实现再分 `src/`、类型等，不强制多层空壳          |
| 组合式函数      | `useOrderList`、`useOrderEditor`；沿用本页 `utils/hook.ts`，含 JSX 才用 `.tsx`；拆出多个时用明确业务文件名          |
| 状态 / 事件处理 | 数据名具体，如 `orders`、`draftFilters`、`submitting`；UI 处理器 `handleSearch`，业务操作 `loadOrders`、`saveOrder` |
| 类型 / 常量     | 类型 PascalCase；普通局部常量 camelCase；共享固定枚举或常量按邻近模块约定                                           |
| CSS 类 / DOM id | 业务语义前缀，如 `order-list-page`、`order-list-results-title`；不使用 `box1`、`left2` 表示职责                     |

新增组件优先明确业务名，不再同时引入 `form.vue`、`Form/index.vue`、`FormComponent.vue` 三种同义组织。已有 `form.vue`、`form/index.vue` 等路径继续兼容；修改原组件时保持其公开接口。多个真实调用方需要同一职责后，再从页面内提升到领域内或通用目录。

禁止页面间直接 import 另一个路由页；共享内容提取到同领域组件。API DTO 定义在 API 模块，UI 类型引用或显式映射它，不能复制同名接口后各自维护。通用工具不 import 业务页面，公共组件不向 `views/` 反向依赖。

## 3. 分层和单一数据来源

| 层                 | 拥有的职责                                                        | 不应承担                                                     |
| ------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------ |
| `index.vue` 路由页 | 页面结构、路由上下文、区域装配、事件接线、页面权限呈现            | 手写另一套布局 / HTTP 客户端，把复杂请求流程塞在模板表达式里 |
| 页面 composable    | 查询与分页、服务端结果、加载 / 错误状态、业务操作、必要副作用清理 | 混入多个不相关页面的状态，返回全部内部变量供外部随意修改     |
| API 模块           | 复用统一 HTTP，定义请求 / 响应、适配已确认协议                    | 控制弹窗、导航、Toast、DOM 或页面 loading                    |
| 页面 / 领域组件    | 明确输入、局部交互、输入草稿或展示、向父级发送事件                | 隐式改父级对象，通过 parent/ref 链寻找业务上下文             |
| 通用组件           | 稳定的数据 / 事件 / 插槽契约，复用 Element Plus 交互              | 写死订单接口、路由、用户角色、账号存储或某页的按钮权限       |
| Pinia              | 真正跨页面且有生命周期的共享状态                                  | 为仅本页使用的搜索词、弹窗草稿、请求 loading 新建全局状态    |

默认由页面或页面 hook 请求数据，筛选和展示组件只发送意图。确实需要自行请求的领域组件，应把它定义为“带数据行为的领域组件”，说明所依赖的 API、权限和错误处理；不能以通用组件名隐藏这些副作用。

筛选表单的 `draftFilters` 与实际请求的 `appliedFilters` 分开；输入变化不应自动发请求，除非产品明确要求实时查询。搜索 / 重置 / 修改页大小按契约重置页码；保留一个负责加载的入口，避免 watch 和点击处理器同时触发相同请求。

## 4. SFC 和脚本顺序

新 SFC 存在相应块时，顺序固定为：`<script setup lang="ts">` → `<template>` → 可选 `<style scoped>`。已有 SCSS 项目按需要使用 `lang="scss"`，没有自定义样式就省略 style；不要添加空 script / style。

脚本默认按以下顺序组织，缺少某类内容时直接省略，不要求逐段写编号注释。初始化依赖优先于分组顺序：依赖本地 ref / computed 的 composable 放在这些变量之后，禁止为了凑顺序访问尚未初始化的变量：

1. imports：第三方模块 → 项目模块 → 相对组件 / 工具；类型显式使用 `import type`，同一来源的类型可与值相邻。
2. 页面 / 组件身份 `defineOptions`，本地类型，`defineProps` / `defineEmits` / 已采用的模型或插槽契约。
3. 上下文与依赖：i18n、router、store、已有 composable；不要在模块顶层建立跨实例共享的可变页面状态。
4. refs / reactive 与初始值，然后是纯 `computed` 派生数据。
5. 辅助函数、业务操作、UI 事件处理；按关联职责靠近排列。
6. watch、生命周期与订阅清理；同一订阅的建立和释放必须能对应找到。
7. 仅在确有父级命令式调用时保留最小 `defineExpose`。

禁止在 computed、模板函数或渲染过程中请求接口、写 store、弹消息或改路由。watch 只处理明确依赖变化，不能用连续的 deep watch 复制 props、修正状态，再触发彼此更新。复杂条件提取为有语义的 computed，模板不堆多层三元表达式。

不靠文件行数机械拆组件。出现独立输入 / 输出契约、独立异步生命周期、重复业务块或难以单独验证的多个职责时必须重新评估拆分；只有一层无语义容器、几行纯布局或仅透传全部 props 的组件不值得提取。禁止一个 hook 吞下列表、编辑、批量导入和权限管理所有逻辑。

## 5. 页面结构和语义化 HTML

### 布局归属

路由页必须有**一个实体根节点**，默认 `<section class="order-list-page" aria-labelledby="...">`，承接布局注入的 `main-content` 类、过渡和属性。不要用多个平级根节点导致类和属性无处挂载；确需 `inheritAttrs: false` 时，显式把需要的属性交给唯一内容根。

复用现有 `src/layout` 的导航、侧栏、标签和内容滚动。页面不重新创建侧栏 / 顶栏 / 全局弹层宿主，不用 `h-screen`、全局 `.main` 覆盖或随意 `!important` 重设框架占用空间。仅布局用途的容器使用 `div`，不为每层 flex/grid 都制造一个语义 section。

**主内容地标由应用布局统一负责。** 当前两种项目的 `src/layout/components/lay-content/index.vue` 实际为 `<section>`，尚未建立统一 `main` 地标；不能描述为已完成。该缺口应在布局任务中集中补齐并验收。业务页面和局部组件按有名 section 组织，不各自添加多个 `main` 或 `role="main"`。不经过后台 Layout 的独立页面可用 `main`，但必须确认当前文档没有其他可见主内容地标。此次规范不改布局源码。

### 区域顺序

| 页面类型        | 默认从上到下的顺序                                                                 | 限制                                                                           |
| --------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 列表            | 页面 header → 筛选表单 → 结果 section（工具栏、批量操作、表格与分页）              | 页级操作放 header 或工具栏其中一处；分页由已有表格机制承担，不再重复渲染第二套 |
| 详情            | 页面 header（标题、状态、返回 / 操作）→ 基本信息 → 有名业务分区 → 有条件的关联记录 | 描述信息使用 `dl/dt/dd` 或现有 descriptions；状态不是纯颜色图标                |
| 独立编辑页      | 页面 header → 单个编辑 form（分组与字段）→ form 内或显式关联的操作区               | 不嵌套 form；同一保存入口负责按钮与键盘提交                                    |
| 弹窗 / 抽屉内容 | 宿主标题 → 本地编辑 / 详情内容 → 宿主操作区                                        | 不再嵌套 `main`、新 Layout 或第二个 Dialog / Drawer 宿主                       |

页面 header 使用当前内容的 `h1` 和可选说明；同一页面不在卡片、表格工具栏再重复一遍相同主标题。分区标题依次使用 `h2`、`h3`，字号通过样式调整，不用标题级别充当字号。局部组件不硬编码 `h1`；由父级标题插槽或明确的受限标题级别表达当前层次。

有独立主题且适合被导航到的区块用有名 `section`，通过 `aria-labelledby` 指向真实标题；没有主题的容器用 `div`。`article` 只用于可独立理解的内容，`nav` 只用于导航链接，`aside` 只用于独立的补充内容，不能当通用左右布局标签。多个导航区应能通过名称区分。

### 列表模板结构示意

下面是页面的 **template 结构片段**，数据与函数来自页面 hook；它不包含订单 API 实现。所有 `orders.*` 文案必须补入中英文 locale。页面需显式导入 `OrderFilters` 和 `import { PureTableBar } from "@/components/RePureTableBar"`；全局注册的 `pure-table` 不包含工具栏。当前 `PureTableBar` 支持 `#title`，默认 title 只是普通段落，因此分区标题应明确通过该插槽提供。

`hasLoaded` 初始为 `false`，只有成功响应且数据有效时才设为 `true`；首次加载前 / 中显示状态提示，避免空表误报“暂无数据”。之后刷新时可保留已有表格并用 loading 标记。每次请求清除上次错误，失败时设置 `errorMessage`；这些状态由同一 hook 维护。

```vue
<section class="order-list-page" aria-labelledby="order-list-title">
  <header class="mb-4">
    <h1 id="order-list-title">{{ t("orders.title") }}</h1>
    <p>{{ t("orders.description") }}</p>
  </header>

  <OrderFilters
    v-model:keyword="draftKeyword"
    field-id="order-list-keyword"
    :busy="loading"
    @search="handleSearch"
    @reset="handleReset"
  />

  <section aria-labelledby="order-list-results-title" :aria-busy="loading">
    <PureTableBar :columns="columns" @refresh="loadOrders">
      <template #title>
        <h2 id="order-list-results-title">{{ t("orders.results") }}</h2>
      </template>
      <template #default="{ size, dynamicColumns }">
        <div v-if="errorMessage" role="alert">
          <p>{{ errorMessage }}</p>
          <el-button native-type="button" :loading="loading" @click="loadOrders">
            {{ t("orders.retry") }}
          </el-button>
        </div>
        <p v-else-if="!hasLoaded" role="status">
          {{ t(loading ? "orders.loading" : "orders.ready") }}
        </p>
        <pure-table
          v-else
          row-key="id"
          :loading="loading"
          :size="size"
          :data="orders"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, size }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        />
      </template>
    </PureTableBar>
  </section>
</section>
```

这个示意采用“失败替换结果区”的策略；如果需求要求失败时保留上次数据，必须明确标注旧数据与重试入口，不能把旧结果当成本次成功。空数据只在请求成功且没有行时呈现。业务新增、编辑、删除等操作按 [RBAC](routing-rbac.md) 加入对应权限组件，不能照抄结构后遗漏授权。

### 表单、操作与反馈

- 执行搜索、保存、重试等动作用原生 `button` 或 `el-button`；前往详情或其他页面用真实 `RouterLink` / 链接，保留浏览器打开方式和可访问名称。禁止用 `div @click`、`span @click`、`href="#"` 冒充交互元素。
- 筛选 / 编辑表单使用 `el-form` 的 `@submit.prevent`；提交按钮显式 `native-type="submit"`，重置、取消等显式 `native-type="button"`。不要在同一个提交按钮上再绑定一次相同 `@click`，造成重复请求。
- 不嵌套 `form` / `el-form`。字段有可见 label，`for` 与实际输入 `id` 对应；一组多个输入时逐项命名，必要时用 `fieldset/legend` 或正确的分组语义。placeholder 和 Tooltip 都不能代替标签。
- 每个重复实例的 DOM id 必须唯一，组件可接收明确的 `fieldId` / id 前缀或使用项目支持的实例 ID 方式；不能把固定 id 写进反复渲染的组件。
- 错误信息关联到字段；必填、无效状态、禁用原因不能只靠颜色。图标按钮有 `aria-label`，装饰图标不重复播报。
- 异步结果摘要可用短小的 `role="status"`；阻断错误在适当位置用 `role="alert"`。不要让整张表格或每次输入都成为 live region，也不要对同一错误同时反复 Toast 和读屏播报。
- 关闭弹窗后恢复到合理的触发位置；路由进入、校验失败和删除当前记录后的焦点落点需可预测。保留组件已有键盘 / 焦点行为，禁止正数 `tabindex` 或移除焦点轮廓而不给替代样式。

## 6. 组件公开契约

| 接口        | 约束                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| props       | camelCase、明确类型与默认值；输入只读，不写 `props.x` 或间接修改其嵌套对象；不传整个 store / route / 用户会话给展示组件                     |
| 模型更新    | 使用明确的 `modelValue` / `update:modelValue` 或具名模型，如 `keyword` / `update:keyword`；同一状态只有一个来源，不再额外维护双向同步的副本 |
| 事件        | 用具体意图如 `search`、`reset`、`request-delete`，模板以 kebab-case 监听；载荷只包含必要 ID / 表单数据，不能用无类型 `data`、`event1`       |
| slots       | 默认插槽承载主体，具名插槽表达 `title`、`actions` 等稳定区域；公开必要且有类型的数据，不泄露整个内部响应式对象                              |
| expose      | 只开放宿主必须调用的 `validate`、`focus`、`getDraft` 等窄接口；兼容已有 `getRef` 时不继续扩大暴露面                                         |
| attrs / DOM | 明确根节点及 class、id、aria 属性最终落点；多根组件不得依赖不确定的属性透传；不要将所有业务 props 展开成 DOM 属性                           |

Vue `emit` 用于通知父级，不能把 `await emit('save')` 当成等待后端保存完成。保存完成状态由父级通过 props / 明确契约反馈；库现有回调接口按其真实协议接入，不为统一风格改坏兼容性。

### 示例：只负责筛选交互的 OrderFilters

这份 SFC 定义受控输入与语义化提交，**不请求 API、不改路由、不操作权限 store**。父页面负责应用筛选条件、重置分页并请求数据。`fieldId` 必须在当前文档唯一，`orders.filters/keyword/search/reset` 需补齐 locale。Element Plus 使用目标项目已有的显式组件注册。

```vue
<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

defineOptions({ name: "OrderFilters" });

const props = defineProps<{
  keyword: string;
  fieldId: string;
  busy?: boolean;
}>();
const emit = defineEmits<{
  "update:keyword": [value: string];
  search: [keyword: string];
  reset: [];
}>();

const { t } = useI18n();
const keyword = computed({
  get: () => props.keyword,
  set: (value: string) => emit("update:keyword", value)
});

function handleSubmit() {
  if (props.busy) return;
  emit("search", props.keyword.trim());
}

function handleReset() {
  if (props.busy) return;
  emit("reset");
}
</script>

<template>
  <el-form
    :aria-label="t('orders.filters')"
    :disabled="props.busy"
    @submit.prevent="handleSubmit"
  >
    <el-form-item :label="t('orders.keyword')" :for="props.fieldId">
      <el-input :id="props.fieldId" v-model="keyword" clearable />
    </el-form-item>
    <el-form-item>
      <el-button native-type="submit" type="primary" :loading="props.busy">
        {{ t("orders.search") }}
      </el-button>
      <el-button native-type="button" @click="handleReset">
        {{ t("orders.reset") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
```

需要表单校验时再添加有类型的 model、rules 与字段 prop。编辑组件先由唯一的拥有者创建独立草稿；禁止用 `ref(props.record)` 误认为已经克隆。确认保存之前不改列表原记录，取消不得留下半成品。

## 7. 状态、弹层和副作用限制

页面加载、表单提交、批量操作、单行删除使用不同状态；派生的 `isEmpty`、`canSubmit` 用 computed，不再存一套需要手动同步的布尔值。分清首次加载、刷新、成功有数据、成功空数据、失败及未授权；请求失败不能落入空态，未授权不等于没有数据。

请求统一通过 `src/api/` 与现有 HTTP 层。快速切换筛选时应取消旧请求或用请求序号忽略过期响应；只有最新请求可落数据和结束自己的 loading。卸载、停用缓存页面、退出和账号切换时，分别按生命周期清理订阅、计时器和请求。不能在 `onMounted` 与 `onActivated` 无条件重复加载或重建监听。

`App.vue` 已各挂载一次 ReDialog / ReDrawer。编辑内容只提供表单，打开和保存流程留页面或 editor hook。宿主页脚在内容表单之外，不能假定点击页脚会自动触发表单 submit；按钮与 Enter 必须调用同一个校验 / 保存入口，并验证是否需要显式关联。

保存流程按“防重复 → 校验 → 权限复核 → 请求 → 判断 `code === 0` → 成功关闭 / 刷新”处理。默认确认按钮需要加载反馈时设置 `sureBtnLoading: true`；`beforeSure(done, { closeLoading })` 中成功才 `done()`，其他退出分支 `closeLoading()` 并保留草稿。未启用宿主加载选项时，`closeLoading()` 不会代替业务自己的 submitting 状态恢复；自定义页脚自行承接事件和加载状态。已保存但刷新列表失败应提示刷新失败，不能再次提交或误报保存失败。

公共组件不直接决定当前用户是否拥有业务权限。页面按选定的 Auth / Perms 来源控制展示、打开入口与最终提交；后端继续校验权限和数据范围。详细生命周期及现有限制见 [RBAC 指南](routing-rbac.md)。

## 8. 样式和可评审限制

- 复用 Element Plus 设计语义和项目主题，Tailwind 处理布局与间距；新样式不创建平行的颜色、暗色或全局字号体系。
- 局部样式有业务根 class，必要的 `:deep()` 限定在该根下；不要让页面选择器污染导航、其他页或全局弹层。动态传入尺寸确有需要时才用内联 style。
- 属性和事件一行一个或按项目 Prettier 排版；不要靠手工对齐、额外空白或无意义注释分区。
- UI 层没有新 `any`、`@ts-ignore`、为了通过检查而关闭规则；注释解释业务约束或非显然原因，不复述 `const`、`if` 等代码。
- 层次要有职责：根 → 业务区块 → 控件布局。发现连续多个无样式、无属性、无语义的包装节点时合并；保留组件交互、滚动和可访问性所必需的容器，不以固定 DOM 深度破坏它们。

## 9. 交付验收表

| 维度       | 必须能确认的结果                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------ |
| 结构       | 目录与职责对应；路由页单根能接收布局 class；没有复制外壳、弹层宿主或页面互相引用                 |
| 命名       | 新组件语义化 PascalCase；路由与页面名一致；不存在含糊的 UI 数据 / 事件名                         |
| 标题与区域 | 一个清晰的页面主标题，区块标题层级连续；section 有真实主题和名称；布局 main 的现状与整改范围明确 |
| 交互语义   | 导航为链接、操作为按钮；没有嵌套表单；Enter 与点击只执行一次同一提交入口                         |
| 组件契约   | props 不被修改；模型来源唯一；事件载荷有类型；slots / expose 最小；通用组件不依赖业务页面        |
| 数据与状态 | API / hook / 页面职责分明；加载、空态、失败、无权限可区分；旧响应不覆盖新结果                    |
| 编辑       | 打开时是独立草稿；取消不污染源数据；失败不关闭、不丢输入；保存与刷新失败区分                     |
| 可访问性   | 字段可见标签与控件关联、id 唯一、图标命名、键盘与焦点可用；动态反馈不过量                        |
| 视觉       | 保留主题、暗色、长文案和窄屏可用；无无关全局覆盖；布局与语义 DOM 不因样式便利被破坏              |
| 路由权限   | 新业务遵循动态来源和后端交接清单；隐藏详情仍受保护；组件抽取不绕过权限                           |
| 验证       | 对改动范围执行格式、类型及相关行为检查；有 UI 修改就做实际页面验收；不把示例编译当真实业务联调   |

根项目检查入口与模板不同，使用目标项目的 `package.json`：根 `pnpm lint` 会修改文件且没有默认 test；模板 lint 只读并已有 Node Vitest。仅修改此规范时检查文档链接、示例与检索应用，不要求无关业务重构或声称已通过浏览器验收。

## 依据与后续维护

源码入口：`src/layout/components/lay-content/index.vue`、`src/App.vue`、`src/components/RePureTableBar/src/bar.tsx`、`src/components/ReDialog/`、`src/components/ReDrawer/`、`src/plugins/elementPlus.ts`。独立模板登录页提供现有的标题、标签、form submit 和按钮类型示例；完整项目的 system/user 只用于了解文件职责，不复制其演示保存或草稿共享问题。

2026-10-29 经 Context7 `library → docs` 核对 Vue 官方站点 `/websites/vuejs` 的 [script setup](https://vuejs.org/api/sfc-script-setup.html)、[TypeScript 组件契约](https://vuejs.org/guide/typescript/composition-api.html)和[可访问性](https://vuejs.org/guide/best-practices/accessibility.html)。检索内容不是项目的版本锁；本页目录、顺序和职责划分是项目约定，具体组件 API 仍以目标项目安装版本和源码为准。
