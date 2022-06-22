import http from "@/utils/http";

const { post } = new http("goodsUser");
const main = new http("main");

export function searchGoodsByTitle(params, options) {
  return post("/searchGoodsByTitleByUser", params, {
    loading: true,
    ...options
  });
}

// 测试
export function getRecommend(params, options) {
  return main.get("/recommend", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}
