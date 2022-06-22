import http from "@/utils/http";

const main = new http("main");

// 推荐商品列表
export function getRecommend(params, options) {
  return main.get("/recommend", params, {
    // loading: false,
    ignoreErrorTips: true,
    ...options
  });
}
