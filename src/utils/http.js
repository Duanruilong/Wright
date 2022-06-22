/* eslint-disable import/first */
import Taro from "@tarojs/taro";
import { isString } from "./utils";
import Request from "./request";
import { toast, showLoading, hideLoading } from "./tools";
import { ENV, HOME_PAGE } from "../constants";
import servers from "./servers";
import { getUserId, updateSession, loginOutHandler } from "./loginHandler";

const msgMap = {
  networkError: "网络异常，请稍后再试",
  httpError: "请求错误",
  dataError: "请求错误"
};

export default function getHttp(admin, opts = {}) {
  return new Request({
    host: servers[admin],
    // authErrorCodes: ["00010001"],
    // ignoreErrorCode: ["00010008"],
    timeout: 10000,
    ignoreSession: false,
    ignoreErrorTips: false, // 是否显示错误弹窗信息
    // useMock: true,
    // useCache: { type: 'local', session: true,refresh:false },
    header: {
      "content-type": "application/json" // 默认值
    },
    loading: {
      title: "loading...",
      mask: true
    },
    requestInterceptor: ({ config }) => {
      const { useMock, path, ignoreSession, loading } = config;
      loading && showLoading(loading);
      if (ENV === "dev" && useMock) {
        config.url = `http://localhost:3721${path}`;
      }

      if (!ignoreSession) {
        Taro.getStorage({
          key: "userInfo"
        })
          .then(res => {
            if (res.data) {
              config.data.userid = res.data?.userid;
            }
          })
          .catch(() => {});
      }
      console.log(
        " config.data.userid------- :>> ",
        JSON.stringify(config.data)
      );

      for (const key in config.data) {
        if (isString(config.data[key])) {
          config.data[key] = config.data[key].trim();
        }
      }
      return config;
    },
    responseInterceptor: ({ response, config, request }) => {
      const {
        ignoreSession,
        loading,
        authFailCodes,
        outLoginCodes,
        authErrorCodes,
        // ignoreErrorCode,
        sessionUpdated,
        ignoreErrorTips
      } = config;
      const { data = {}, statusCode } = response;
      loading && hideLoading();
      if (!statusCode) {
        toast(msgMap["networkError"]);
        return Promise.reject(response);
      }

      if (statusCode < 200 || statusCode >= 300) {
        toast(msgMap["httpError"]);
        return Promise.reject(response);
      }

      const { errorCode = undefined, msg, status, code } = data;

      if ((status && status.toUpperCase() === "ERROR") || code !== 10000) {
        if (!ignoreSession && errorCode) {
          if (outLoginCodes.indexOf(errorCode) !== -1) {
            loginOutHandler();
            toast(msg || msgMap["dataError"]);
            return Promise.reject(data);
          }

          if (authFailCodes.indexOf(errorCode) !== -1) {
            if (!sessionUpdated && getUserId()) {
              return new Promise(async resolve => {
                await updateSession();
                resolve(request(true));
              });
            } else {
              loginOutHandler();
              toast(msg || msgMap["dataError"]);
              return Promise.reject(data);
            }
          }

          if (authErrorCodes.indexOf(errorCode) !== -1) {
            toast(msg || msgMap["dataError"], { mask: true }, () => {
              Taro.switchTab({ url: HOME_PAGE });
            });
            return Promise.reject(data);
          }
        }
        !ignoreErrorTips && toast(msg || msgMap["dataError"]);
        return Promise.reject(data);
      }

      const content = data.content !== undefined ? data.content : data;

      return Promise.resolve(content);
    },
    ...opts
  });
}
