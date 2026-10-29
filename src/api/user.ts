import { http } from "@/utils/http";

export type LoginInput = {
  username: string;
  password: string;
};

export type RefreshTokenInput = {
  refreshToken: string;
};

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  /** 后端返回 ISO 8601 日期字符串，存储时转换为毫秒时间戳。 */
  expires: string;
};

export type UserResult = {
  code: number;
  message: string;
  data: AuthTokens & {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
  };
};

export type RefreshTokenResult = {
  code: number;
  message: string;
  data: AuthTokens;
};

/** 登录；调用方必须检查 code === 0 后再使用 data。 */
export const getLogin = (data: LoginInput) => {
  return http.request<UserResult>("post", "/login", { data });
};

/** 刷新 token；沿用完整 code/message/data 业务包络。 */
export const refreshTokenApi = (data: RefreshTokenInput) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};
