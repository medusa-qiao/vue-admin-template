import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 仅供本地开发演示。生产构建不加载此文件，也不提供认证服务。
// 演示账号：admin / admin123。真实项目应由服务端校验身份和权限。
const demoRefreshToken = "demo-admin-refresh-token";
const createTokens = () => ({
  accessToken: "demo-admin-access-token",
  refreshToken: demoRefreshToken,
  expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
});

export default defineFakeRoute([
  {
    url: "/login",
    method: "post",
    response: ({ body }) => {
      if (body?.username !== "admin" || body?.password !== "admin123") {
        return { code: 10001, message: "用户名或密码不正确", data: null };
      }
      return {
        code: 0,
        message: "登录成功",
        data: {
          avatar: "",
          username: "admin",
          nickname: "管理员",
          roles: ["admin"],
          permissions: ["*:*:*"],
          ...createTokens()
        }
      };
    }
  },
  {
    url: "/refresh-token",
    method: "post",
    response: ({ body }) => {
      if (body?.refreshToken !== demoRefreshToken) {
        return { code: 10002, message: "登录已过期，请重新登录", data: null };
      }
      return { code: 0, message: "刷新成功", data: createTokens() };
    }
  },
  {
    url: "/get-async-routes",
    method: "get",
    response: () => ({ code: 0, message: "操作成功", data: [] })
  }
]);
