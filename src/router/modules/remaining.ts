import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: $t("menus.pureLogin"),
      showLink: false
    }
  },
  // 全屏403（无权访问）页面
  {
    path: "/error/403",
    name: "403",
    component: () => import("@/views/error/403.vue"),
    meta: {
      title: $t("menus.pureAccessDenied"),
      showLink: false
    }
  },
  // 路径与路由守卫的兜底目标保持一致
  {
    path: "/error/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
    meta: {
      title: $t("menus.purePageNotFound"),
      showLink: false
    }
  },
  // 全屏500（服务器出错）页面
  {
    path: "/error/500",
    name: "500",
    component: () => import("@/views/error/500.vue"),
    meta: {
      title: $t("menus.pureServerError"),
      showLink: false
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: $t("status.pureLoad"),
      showLink: false
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
