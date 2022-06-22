import Taro from "@tarojs/taro";
import { hideLoading } from "../tools";
import { getCacheItem } from "./cache";

// 微信请求库封装

// interface RequestOptions {
//   host?: string;
//   authFailCodes?: string[];
//   useMock?: boolean;
//   timeout?: number;
//   requestType?: string;
//   ignoreSession?: boolean;
//   ignoreErrorTips?: boolean;
//   requestInterceptor?: (arg: any) => any | Promise<any>;
//   responseInterceptor?: (arg: any) => any | Promise<any>;
//   [propName: string]: any;
// }

export * from "./cache";

/**
 * Request
 *
 * @props host 接口域名
 * @props authFailCodes 授权过期错误码数组，用户pc、H5下线处理
 * @props useMock 是否开启本地mock
 * @props loading loading效果
 * @props timeout 超时时长
 * @props ignoreSession 忽略session
 * @props ignoreErrorTips 忽略提示错误
 * @props requestInterceptor request拦截器
 * @props responseInterceptor response拦截器
 */
export default class Request {
  constructor(options = {}) {
    this.options = options;
  }

  options;

  get = (...args) => {
    return this.request("GET", ...args);
  };

  post = (...args) => {
    return this.request("POST", ...args);
  };

  request = (...args) => {
    return new Promise((resolve, reject) => {
      const [
        method = "GET",
        path = undefined,
        params = {},
        options = {},
        sessionUpdated = false
      ] = args;
      const { useCache, log = false } = options;
      const {
        requestInterceptor,
        responseInterceptor,
        host,
        ...rest
      } = this.options;

      let config = {
        url: `${host}${path}`,
        data: params,
        method,
        sessionUpdated,
        ...rest,
        ...options
      };

      if (requestInterceptor) {
        config = requestInterceptor({ config });
      }
      console.log("Taro.config :>> ", config);

      return Taro.request({
        ...config,
        success: response => {
          console.log("Taro.request :>> ", response);
          if (responseInterceptor) {
            responseInterceptor({
              response,
              config,
              request: this.request.bind(this, ...args)
            })
              .then(resolve)
              .catch(reject);
          }
        }
      });
    });
  };
}
