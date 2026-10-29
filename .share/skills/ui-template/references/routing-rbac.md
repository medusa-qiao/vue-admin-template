# 路由制定与 RBAC 权限实现引导

适用于独立轻量模板，所有源码路径相对本模板项目根（包含 package.json 的目录）；复制为新项目后不依赖父仓库文档。RBAC 指基于角色的访问控制：后端决定用户角色与操作权限，前端用现有路由、菜单和按钮机制呈现授权结果。本指南说明现有实现与接入步骤，不代表已新增订单业务或后端权限服务。

## 1. 先制定路由与权限表

先读[静态路由、动态路由与后端交接](route-sources.md)，为每个页面列出文件、URL、唯一名称、父目录、locale key、静态/动态来源及理由、是否入库、账号状态条件、允许角色、按钮权限来源、缓存和验收场景。以订单为例，以下角色和权限码是示范契约，接真实后端前需确认：

| 页面 / 操作 | 文件 / URL                                                | 名称 / 权限                                 | 展示和缓存                           |
| ----------- | --------------------------------------------------------- | ------------------------------------------- | ------------------------------------ |
| 订单目录    | `/orders`                                                 | `Orders`                                    | 跳转列表，顶级菜单按 `rank` 排序     |
| 订单列表    | `src/views/orders/list/index.vue`；`/orders/list`         | `OrderList`；角色 `admin` 或 `editor`       | 显示菜单；缓存                       |
| 订单详情    | `src/views/orders/detail/index.vue`；`/orders/detail/:id` | `OrderDetail`；同样限制 `admin` 或 `editor` | 隐藏菜单；高亮列表；默认不缓存       |
| 删除订单    | 订单列表的删除操作                                        | 登录 `permissions` 中的 `orders:delete`     | `Perms` / `hasPerms`；提交前再次检查 |

| 必填决策   | 本例约定                                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| 路由来源   | 订单目录、列表和隐藏详情均为 `dynamic`，按当前账号授权；没有后端时也通过 Mock 菜单接口加载                  |
| 是否入库   | 是；交付菜单/页面资源、角色关联及操作权限清单，实际数据库模型与迁移由后端确认                               |
| 账号状态   | 必须有有效会话并满足后端约定的业务准入状态；具体状态枚举、来源和拒绝处理待确认，不因具有角色就默认放行      |
| 角色与按钮 | 列表和详情各自显式声明示范角色 `admin` / `editor`；删除使用登录 `permissions`，不把全部按钮权限写入固定菜单 |
| 验收       | 允许账号、无角色/无按钮权限账号、状态受限账号；覆盖直接 URL、刷新、列表/详情切换、菜单失败和退出/切换账号   |

新增业务默认采用动态来源。静态路由仅保留固定基础首页/布局、登录、错误页和刷新重定向等基础设施；隐藏详情、全屏或暂时无后端都不构成静态例外。同一页面只能从一个来源注册，业务 API 仍需后端授权。历史静态业务迁移时移除原记录；新增订单无需先写静态模块再搬迁。

## 2. 动态业务定义、汇总与页面名称

首次新增业务时，按来源指南创建 `src/router/dynamic/types.ts` 的 `DynamicRouteDto`，再新增 `src/router/dynamic/modules/orders.ts`。这些是待创建的规范示例，不表示当前项目已经具备订单文件。动态目录位于静态 `./modules/**/*.ts` glob 之外，不使用 `RouteConfigsTable` 或直接导入页面组件：

```ts
import type { DynamicRouteDto } from "../types";

export default [
  {
    path: "/orders",
    name: "Orders",
    redirect: "/orders/list",
    meta: {
      title: "menus.orders",
      rank: 20
    },
    children: [
      {
        path: "/orders/list",
        name: "OrderList",
        component: "orders/list/index",
        meta: {
          title: "menus.orderList",
          roles: ["admin", "editor"],
          keepAlive: true
        }
      },
      {
        path: "/orders/detail/:id",
        name: "OrderDetail",
        component: "orders/detail/index",
        meta: {
          title: "menus.orderDetail",
          roles: ["admin", "editor"],
          showLink: false,
          activePath: "/orders/list"
        }
      }
    ]
  }
] satisfies DynamicRouteDto[];
```

`component` 是本地视图 key，`meta.title` 是 locale key；不包含 `() => import(...)`、`$t(...)` 或组件对象。两个真实页面仍需在 `src/views/orders/` 下创建并参与前端构建。此定义是完整资源目录与后端交接来源，不能直接视为任意账号已获准的菜单。

在 `src/router/dynamic/index.ts` 显式汇总一次；已有业务时合并导入和数组，不覆盖其条目：

```ts
import orders from "./modules/orders";
import type { DynamicRouteDto } from "./types";

export const dynamicRouteCatalog: DynamicRouteDto[] = [...orders];
```

开发时在现有 `mock/auth.fake.ts` 的 `/get-async-routes` 处理器中导入汇总入口：

```ts
import { dynamicRouteCatalog } from "../src/router/dynamic";
```

该端点根据可信的模拟会话、账号状态、角色及资源授权筛选 `dynamicRouteCatalog`，再返回 `{ code: 0, message: "ok", data: 当前账号获准的路由树 }`。这里只说明接入位置；状态夹具和过滤规则需随业务实现，不能原样返回全量目录，也不能把浏览器传入的角色或状态当作授权依据。同 URL 只保留一个处理器。生产切换到后端时保留 `src/api/routes.ts` → `initRouter()` 的 HTTP 链路，不让浏览器入口、页面或静态路由入口导入该目录注册业务。

复用 `home.ts` 的 `/` → `Layout` 外壳。这里的 `/orders` 只是目录节点：项目会将业务路由整理到 `/` 下的两级结构，不必在每个业务目录再嵌套一个 Layout。`rank: 20` 仅为示例，应核对已有 `src/router/enums.ts` 与模块排序后选择值。

在现有 locale 对象中**合并**以下键，不要另建第二个顶级 `menus`：

```yaml
# locales/zh-CN.yaml
menus:
  orders: 订单管理
  orderList: 订单列表
  orderDetail: 订单详情
orders:
  delete: 删除订单
  noPermission: 无操作权限
```

```yaml
# locales/en.yaml
menus:
  orders: Orders
  orderList: Order list
  orderDetail: Order details
orders:
  delete: Delete order
  noPermission: Permission denied
```

列表页面设置 `defineOptions({ name: "OrderList" })`，详情设置 `defineOptions({ name: "OrderDetail" })`。页面标题用 `useI18n().t`，动态路由保留 locale key 字符串，由现有菜单翻译流程解析。详情跳转可用 `router.push({ name: "OrderDetail", params: { id } })`，不要用 `path` 搭配 `params` 期待自动插入参数。

`keepAlive` 依赖路由名称与组件名称一致。它保存当前运行期间的组件状态；浏览器整页刷新会重建应用，不保证恢复内存里的列表筛选。`hiddenTag` 控制是否进入标签页，`fixedTag` 控制固定标签，两者都不是授权或缓存开关。`remaining.ts` 用于登录、错误页和重定向等特殊页面，并不自动免登录。

## 3. 页面角色和按钮权限的精确语义

| 目标        | 数据来源                        | 使用入口                                         | 当前判定                                          |
| ----------- | ------------------------------- | ------------------------------------------------ | ------------------------------------------------- |
| 页面 / 菜单 | 登录 `roles` 对比 `meta.roles`  | 路由守卫、`filterNoPermissionTree`               | 两个数组有任意交集即可，即 OR                     |
| 路由按钮    | 当前路由 `meta.auths`           | `Auth`、`v-auth`、`hasAuth`（`@/router/utils`）  | 字符串精确匹配；数组必须全部满足，即 AND          |
| 用户按钮    | 登录 `permissions` → user store | `Perms`、`v-perms`、`hasPerms`（`@/utils/auth`） | 字符串精确匹配；数组 AND；仅 `['*:*:*']` 为全权限 |

必须区分的边界：

- 省略 `meta.roles` 表示不增加角色限制，仍须通过登录守卫；`meta.roles: []` 与合法用户角色数组没有交集，因此拒绝。用户 `roles: []` 也不能访问有角色限制的页面。
- `isOneOfArray` 在任一参数不是数组时返回 `true`。接后端时应验证 `roles` 是字符串数组；不能依赖这个辅助函数拒绝畸形数据。不存在自动获得全部页面权限的 `admin` 或 `roles: ['*']` 特例。
- 父子路由角色不是自动 AND。Vue Router 的 `meta` 合并是浅合并，子级同名属性覆盖父级；本项目还会拍平路由，业务目录的父子匹配关系可能不再保留。**每个受限叶子页都显式写完整 `roles`，包括隐藏的详情页。** 当前顶级 `RouteConfigsTable.meta` 类型也未声明 `roles`，不要靠强制类型转换绕过它。
- 菜单树逐层按角色过滤，父菜单被移除时子菜单随之消失；路由注册与菜单过滤是两套流程，已经注册的页面仍可能通过 URL 到达。`showLink: false`、`activePath`、标签设置都不能代替角色检查。
- `hasAuth` 不支持超级通配符；`hasPerms` 只有权限数组恰好为 `['*:*:*']` 时放行所有操作。`['*:*:*', 'orders:read']` 不触发该特例；`orders:*` 也不做模式匹配。
- 空权限字符串返回 `false`；空的“所需权限数组” `[]` 在来源数组存在时可判为全部满足。`Auth` / `Perms` 的 `value` 默认就是 `[]`，使用时必须显式传非空权限码，不能用空数组表示拒绝。
- `v-auth` / `v-perms` 只在 `mounted` 检查并移除 DOM。需要随权限更新显示 / 恢复时使用 `Auth` / `Perms` 或响应式 `v-if`；不要在初始化时把 `hasPerms(...)` 结果存成永不更新的普通布尔值。

## 4. 按钮和操作接入

上例的删除权限来自登录 `permissions`，因此使用下面的组件片段；`order.id` 来自业务表格行，不是额外的全局变量：

```vue
<Perms value="orders:delete">
  <el-button type="danger" @click="requestDelete(order.id)">
    {{ t("orders.delete") }}
  </el-button>
</Perms>
```

操作函数也使用同一来源。下面是接入片段，`confirmDelete` 是业务确认交互，`deleteOrder` 是 `src/api/orders.ts` 中对已确认后端接口的封装，`reloadOrders` 重新请求列表；三者需由业务实现，并非本项目已有函数：

```ts
import { hasPerms } from "@/utils/auth";

async function requestDelete(id: string) {
  if (!hasPerms("orders:delete")) return;
  const confirmed = await confirmDelete(id);
  if (!confirmed || !hasPerms("orders:delete")) return;
  // 确认期间权限可能已变化；请求仍由后端最终授权。
  const result = await deleteOrder(id);
  if (result.code !== 0) throw new Error(result.message);
  await reloadOrders();
}
```

业务层补齐重复提交保护、`try/catch/finally`、取消确认、失败提示及 loading 恢复；表单保存失败保留草稿。未提供真实 API 时只做明确标注的演示，不显示虚假的“删除成功”。

如果后端把当前用户被授予的按钮码放在路由 `meta.auths` 中，应统一改用 `Auth` / `hasAuth`，例如 `<Auth value="orders:delete">...</Auth>`。在静态路由里写死 `auths: ['orders:delete']` 会把这个前端按钮权限授予所有能到达该路由的用户，不能用它冒充登录用户的权限。

需要“任一按钮权限满足”时显式写 `hasPerms('orders:create') || hasPerms('orders:update')`；`hasPerms(['orders:create', 'orders:update'])` 表示两项都要满足。

## 5. 对接后端角色、授权与动态菜单

项目现有协议是 `{ code, message, data }`，`code === 0` 成功。`src/api/user.ts` → user store 的 `loginByUsername` → `setToken` 保存会话，同时更新 store 和本地用户资料。登录响应示意如下；示例令牌不是可用凭据：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "avatar": "",
    "username": "editor-demo",
    "nickname": "编辑人员",
    "roles": ["editor"],
    "permissions": ["orders:read", "orders:delete"],
    "accessToken": "<server-issued-access-token>",
    "refreshToken": "<server-issued-refresh-token>",
    "expires": "<server-issued-expiry>"
  }
}
```

`expires` 必须替换成真实的有效到期时间，按当前接口类型处理；不是固定的示例日期。标准 RBAC 的用户 → 角色 → 权限映射、权限码分配和数据范围由后端维护。每个业务接口还要校验当前身份、操作权限与目标数据归属；前端的角色列表、缓存、隐藏按钮都不是可信凭证。仅仅新增角色管理 UI 不会自动建立服务端 RBAC。

新增业务从本地 Mock 阶段就使用动态菜单。接入真实后端时，依据 `docs/backend/route-manifest.md` 完成目录、列表、隐藏详情及授权关联的入库与 DTO 映射，保留前端页面和现有加载链路；只迁移已有静态业务时才移除其原静态记录，避免双注册。数据库存资源与组件 key，不存 Vue 源码或导入函数。`DynamicRouteDto` 不是数据库表结构，也不会自动校验接口 JSON。`src/api/routes.ts` 始终请求 `GET /get-async-routes`；后端验证当前会话、账号状态和资源授权后，可向获准账号返回以下完整订单树：

```json
{
  "code": 0,
  "message": "ok",
  "data": [
    {
      "path": "/orders",
      "name": "Orders",
      "redirect": "/orders/list",
      "meta": { "title": "menus.orders", "rank": 20 },
      "children": [
        {
          "path": "/orders/list",
          "name": "OrderList",
          "component": "orders/list/index",
          "meta": {
            "title": "menus.orderList",
            "roles": ["admin", "editor"],
            "keepAlive": true
          }
        },
        {
          "path": "/orders/detail/:id",
          "name": "OrderDetail",
          "component": "orders/detail/index",
          "meta": {
            "title": "menus.orderDetail",
            "roles": ["admin", "editor"],
            "showLink": false,
            "activePath": "/orders/list"
          }
        }
      ]
    }
  ]
}
```

上例假定账号已经满足约定的状态与资源授权，角色名只是示范。账号状态不是 `meta.roles` 的替代字段；具体协议未确认时记录待办，不自行添加一个客户端状态值作为放行条件。受限账号返回范围、无权限落点与错误码由后端契约决定，业务接口也要执行相同的状态与权限校验。

当前组件解析使用 `src/router/utils.ts` 的 `import.meta.glob('/src/views/**/*.{vue,tsx}')`，再对键做 `includes(component)` 并取第一个匹配；省略 `component` 时按 `path` 查找。因此：

- 明确写相对 `views` 的完整业务路径，如 `orders/list/index` → `src/views/orders/list/index.vue`；详情 `/orders/detail/:id` 必须显式映射到 `orders/detail/index`，不能拿含参数的 URL 当文件名。
- 保证字符串恰好命中一个文件；`index`、`user` 等短片段会歧义。没有匹配时当前实现会得到 `undefined`，并没有完整的 DTO 校验和友好的组件缺失报错。
- 该解析器不是任意 URL 导入机制，也没有通用 `component: 'Layout'` 字符串注册表。目录可只包含 `children`、`redirect` 和 `meta`；`meta.frameSrc` 是现有 IFrame 分支，接外部地址时另行确认可信来源。
- 每条记录提供 `meta` 与标题；所有父子 `name` 唯一，静态 / 动态 URL 也保持唯一。现有兼容逻辑会为缺失的目录名称生成“首个子项名称 + Parent”，缺失重定向时取第一个子项；新业务显式填写更容易审查。
- 动态 `meta.title` 返回已定义的 locale key。`auths` 仅在选定“路由按钮权限”方式时返回当前账号获准的按钮码，不能把页面所有可能的操作码直接下发给所有人。

## 6. 初始化、刷新、登出和权限变更

主链路：登录成功保存会话 → `initRouter()` 获取动态路由 → `addAsyncRoutes` 映射组件并注册 → permission store 合并静态 / 动态菜单后过滤 → 补充 404 → 导航到允许的页面。没有动态菜单时也必须处理 `data: []`，才能初始化静态菜单与 404。

`router.addRoute` 只注册记录，同名记录会替换旧记录，不能依赖它掩盖目录重复。直接刷新动态 URL 时还需要重新匹配导航；在守卫内添加后返回 `to.fullPath` 是官方重匹配方式之一，必须保证下一次检查已满足以避免循环。这里沿用当前项目的初始化与守卫，不另写第二套。不要另写一套守卫抢先进入 404，也不要只修改 `router.options.routes` 而遗漏真实注册。

### 本模板的初始化和缓存

- `src/router/utils.ts` 的 `initRouter` await 路由请求，非零业务码、非数组 data 和网络异常都会拒绝；空动态菜单仍初始化静态菜单与 404。
- 刷新守卫 await 初始化，缺失路由名称时返回保留 path/query/hash 的新导航。初始化失败清会话并回登录，不能在尚未注入动态路由时抢先认定 404。
- 登录页在 `loginByUsername` 成功后 await `initRouter()`，再导航到首个菜单。已认证但菜单初始化失败时调用 `logOut()`，同时恢复表单提交状态。
- `CachingAsyncRoutes` 默认 `false`，在 `public/platform-config.json` 配置。启用后使用带项目命名空间的 `async-routes` 键，空数组缓存也可复用；`resetRouter()` 会清理本项目的该缓存。
- `logOut()` 清用户资料、角色、permissions、会话和标签，返回登录后调用 `resetRouter()` 重建静态路由，清菜单、KeepAlive 与已加载路径。不直接复制其他版本的登录 / 缓存实现。
- `mock/auth.fake.ts` 目前只提供 `admin/admin123`，角色 `admin`、权限 `['*:*:*']`，动态菜单为 `[]`；模板保留权限机制，没有预置 editor 账号、订单业务或完整 RBAC 管理后台。验证低权限场景时需显式补充隔离的开发测试数据或对接真实后端。生产构建不加载 Mock。

### 权限更新的现有限制

守卫和菜单过滤读本地用户资料中的 `roles`，`hasPerms` 读 store；仅调用 `SET_ROLES` / `SET_PERMS` 不构成完整权限刷新。刷新令牌响应若只含令牌，`setToken` 会沿用已有角色 / 权限，不会自动重新拉取授权。

账号切换优先走已有 `logOut()` 后重新登录；若业务必须热更新权限，需要实现并验证：使旧路由请求失效 → 同步可信的新用户资料与 store → 清旧动态路由缓存、菜单、标签、页面缓存并重置路由 → 请求新授权菜单 → 检查当前页是否仍可访问并跳转。必须处理请求期间退出 / 切换账号的竞态；当前代码没有完整的会话版本隔离，不能把该序列当成已实现功能。

本模板 permission store 的 `clearAllCachePage()` 只清 `wholeMenus` 和 `cachePageList`，未清 `flatteningRoutes`；后者也未经角色过滤。不要用 `flatteningRoutes` 作为可访问页面清单。当前固定标签从它读取，受限业务不要无条件设置 `fixedTag`；需要时补齐授权过滤及登出清理验证。

## 7. 验收矩阵

以下是实现业务后应执行的检查，不代表模板已有这些账号、页面或端到端覆盖：

| 场景                                        | 期望 / 检查点                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 动态来源与入库交接                          | 业务只定义在动态目录，经汇总与 Mock/后端接口加载；清单覆盖隐藏详情、资源映射与待确认字段 |
| 有允许角色但账号状态受限                    | 不因角色匹配而放行；菜单返回、直接访问和业务 API 符合已确认的状态契约                    |
| 未登录直接访问列表 / 详情                   | 跳登录；不能靠 `showLink` 或 `remaining.ts` 绕过                                         |
| admin / editor，含删除权限                  | 列表可见；直达详情可用；删除请求被后端授权                                               |
| admin / editor，无删除权限                  | 页面可进入，删除按钮隐藏，操作函数拒绝；接口直接请求也被后端拒绝                         |
| 其他角色直达列表 / 详情                     | 已注册但角色不满足时到 `/error/403`；若后端完全不下发该路由，则未知地址进入 404          |
| 省略 roles / roles=[] / 畸形 roles          | 省略不加角色限制；空数组拒绝；接入层拒绝畸形数据                                         |
| 同时要求两个按钮码                          | 只持有其中一个不得通过；另验单一通配符与混合通配符差异                                   |
| 父目录和子页角色不一致                      | 对照菜单树与实际 URL；叶子显式授权，避免隐藏菜单却能直达的误判                           |
| 列表 → 详情 → 列表                          | 详情高亮列表；名称一致时列表保留内存状态；关闭标签 / 刷新另测缓存失效                    |
| 刷新动态详情 URL，含 query/hash             | 完成路由注册再匹配；不误进 404、不循环跳转                                               |
| 菜单返回 [] / 非零 code / 网络错误 / 非数组 | 空数组初始化静态菜单；错误有结束与恢复路径                                               |
| 组件不存在 / 歧义 / 路由名称或路径重复      | 接入阶段发现并拒绝，不能上线后依赖空白页或跳过注册掩盖问题                               |
| admin 退出后换低权限账号                    | 旧菜单、URL 权限、按钮、标签和缓存页面不泄漏；启用菜单缓存时再测一次                     |
| 授权热变更 / 刷新令牌 / 旧请求迟到          | store 与用户资料一致；旧请求不恢复旧授权；令牌刷新不误当成授权刷新                       |

在本模板根执行 `pnpm lint`、`pnpm format:check`、`pnpm test`；路由、依赖或入口有改动时执行 `pnpm build`（含类型检查）。需要单独检查类型时运行 `pnpm typecheck`。现有 Node 单测不能证明上述浏览器权限流程全部通过，交付需注明实际执行范围。

## 8. 源码索引与官方依据

| 内容                           | 项目内入口                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 路由类型、模块发现、守卫       | `types/router.d.ts`、`src/router/index.ts`、`src/router/modules/home.ts`                             |
| 角色过滤、拍平、动态映射、Auth | `src/router/utils.ts`                                                                                |
| 登录和菜单契约                 | `src/api/user.ts`、`src/api/routes.ts`、`mock/auth.fake.ts`                                          |
| 会话与 Perms                   | `src/utils/auth.ts`、`src/store/modules/user.ts`                                                     |
| 菜单与缓存                     | `src/store/modules/permission.ts`、`src/store/modules/multiTags.ts`、`public/platform-config.json`   |
| 权限组件与指令                 | `src/components/ReAuth/`、`src/components/RePerms/`、`src/directives/auth/`、`src/directives/perms/` |

2026-10-29 已按 Context7 的 `library → docs` 流程解析 `/vuejs/router`，核对 meta 合并、同名动态记录替换与守卫内添加后返回 `to.fullPath` 重新匹配的行为。查询返回 main 分支资料，不视为与本项目锁定的 Vue Router 版本完全一致；实际项目行为优先以源码与安装包为准。官方资料：[Route Meta Fields](https://router.vuejs.org/guide/advanced/meta.html)、[Dynamic Routing](https://router.vuejs.org/guide/advanced/dynamic-routing.html)。
