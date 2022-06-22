import http from "@/utils/http";

const main = new http("main");
const { get } = new http("usr");

export function getRecommend(params, options) {
  return main.get("/recommend", params, {
    loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}

export function changePwd(params, options) {
  return get("/changePwd", params, {
    ...options
  });
}
