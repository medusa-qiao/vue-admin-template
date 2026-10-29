import Axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer,
  type InternalAxiosRequestConfig
} from "axios";
import type {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig
} from "./types.d";
import { stringify } from "qs";
import { message } from "@/utils/message";
import { $t, transformI18n } from "@/plugins/i18n";
import { getToken, formatToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";

const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** 所有过期请求共享一次刷新，成功和失败都会结束等待。 */
  private static refreshPromise: Promise<string> | null = null;

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前`Axios`实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  private static refreshAccessToken(refreshToken: string): Promise<string> {
    if (!PureHttp.refreshPromise) {
      PureHttp.refreshPromise = useUserStoreHook()
        .handRefreshToken({ refreshToken })
        .then(result => result.data.accessToken)
        .catch(async error => {
          await useUserStoreHook().logOut();
          message(transformI18n($t("login.pureLoginExpired")), {
            type: "warning"
          });
          throw error;
        })
        .finally(() => {
          PureHttp.refreshPromise = null;
        });
    }
    return PureHttp.refreshPromise;
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig & PureHttpRequestConfig) => {
        // 自定义回调可以补充请求参数，但不能跳过统一认证。
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
        } else if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
        }
        // 登录与刷新接口不附加访问令牌，避免刷新请求递归刷新。
        const whiteList = ["/refresh-token", "/login"];
        if (whiteList.some(url => config.url?.endsWith(url))) return config;

        const data = getToken();
        if (data) {
          const expired = Number(data.expires) <= Date.now();
          const token = expired
            ? await PureHttp.refreshAccessToken(data.refreshToken)
            : data.accessToken;
          config.headers = AxiosHeaders.from(config.headers);
          config.headers.set("Authorization", formatToken(token));
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        return response.data;
      },
      (error: PureHttpError) => {
        const $error =
          error instanceof Error
            ? error
            : (new Error(String(error)) as PureHttpError);
        $error.isCancelRequest = Axios.isCancel($error);
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;

    // 响应拦截器只移除 Axios 外层；业务包络仍交给调用方处理。
    return PureHttp.axiosInstance.request<unknown, T>(config);
  }

  /** 单独抽离的`post`工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("post", url, params, config);
  }

  /** 单独抽离的`get`工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("get", url, params, config);
  }
}

export const http = new PureHttp();
