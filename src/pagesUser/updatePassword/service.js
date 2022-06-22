import http from "@/utils/http";

const { get } = new http("usr");

export function sendVerifyCodeByEmail(params, options) {
  return get("/sendVerifyCodeByEmail", params, {
    ...options
  });
}

export function sendVerifyCodeByMsg(params, options) {
  return get("/sendVerifyCodeByMsg", params, {
    ...options
  });
}

export function changePwd(params, options) {
  return get("/changePwd", params, {
    ...options
  });
}
