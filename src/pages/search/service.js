import http from "@/utils/http";

const { post } = new http("goodsUser");
const main = new http("main");

export function searchGoods(params, options) {
  return post("/searchGoodsByTitleByUser", params, {
    loading: true,
    ...options
  });
}

// 推荐商品列表
export function getRecommend(params, options) {
  return main.get("/recommend", params, {
    // loading: false,
    ignoreErrorTips: true,
    ...options
  });
}

// 热搜列表
export function getHots(params, options) {
  return main.get("/hots", params, {
    // loading: false,
    ignoreErrorTips: true,
    ...options
  });
}
