import Taro from "@tarojs/taro";
import { SESSION_KEY, SYSTEM, LOGIN_PAGE, HOME_PAGE } from "@/constants";
import { getStorageData } from "./utils";
import http from "../utils/http";

const { post } = new http("sso", { ignoreErrorTips: true });

export function loginByWxCode(params) {
  return post("/user/login-by-wechatapp-code", params, { useMock: false });
}

let session = () => {
  const data = getUserId() || {};
  console.log("res--session :>> ", data);
  return data;
};

// let session = Taro.getStorageSync(SESSION_KEY);

export function loginHandler(data = {}) {
  const { token, nickname, userid, noHistory } = data.data;
  if (token) {
    Taro.setStorage({
      key: "use-name",
      data: nickname
    });
    Taro.setStorage({
      key: `${nickname}-userid`,
      data: userid
    });
    Taro.setStorage({
      key: `userInfo`,
      data: { ...data.data }
    });

    Taro.removeStorage({
      key: "clerk",
      success: function() {}
    });
    session = token;
  }
  if (!noHistory) {
    // Taro.reLaunch({ url: HOME_PAGE });
    Taro.switchTab({
      url: HOME_PAGE
    });
  }
}

export function loginOutHandler() {
  session = null;
  Taro.clearStorage(); //清理本地数据缓存
  Taro.reLaunch({ url: LOGIN_PAGE });
}

export async function getUserId() {
  let useName, dataId;
  await Taro.getStorage({
    key: "use-name"
  })
    .then(res => {
      if (res.data) {
        useName = res.data;
      }
    })
    .catch(() => {});
  if (useName) {
    await Taro.getStorage({
      key: `${useName}-userid`
    })
      .then(res => {
        if (res.data) {
          dataId = res.data;
        }
      })
      .catch(() => {});
  }
  return dataId;
}

export async function updateSession() {
  const loginWx = await Taro.login();
  try {
    const res = await loginByWxCode({ code: loginWx.code, system: SYSTEM });
    session = res.token;
    // Taro.setStorage({
    //   key: SESSION_KEY,
    //   data: session
    // });
  } catch (e) {}
  return session;
}
