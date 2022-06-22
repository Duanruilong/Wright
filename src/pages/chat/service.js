import http from "@/utils/http";

const usr = new http("usr");
const main = new http("main");

// 地址列表
export function getAddresses(params, options) {
  return usr.get("/addresses", params, {
    loading: true,
    // ignoreErrorTips: true,
    ...options
  });
}

export function getRecommend(params, options) {
  return main.get("/recommend", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}
