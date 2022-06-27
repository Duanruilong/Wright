import http from "@/utils/http";

const main = new http("main");

export function getAds(params, options) {
  return main.get("/ads", params, {
    loading: false,
    ignoreErrorTips: true,
    ...options
  });
}

// 分类列表
export function getKind(params, options) {
  return main.get("/kind", params, {
    loading: false,
    ignoreErrorTips: true,
    ...options
  });
}

// 首页菜单
export function getMenus(params, options) {
  return main.get("/menus", params, {
    loading: false,
    ignoreErrorTips: true,
    ...options
  });
}
// 推荐商品列表
export function getRecommend(params, options) {
  return main.get("/recommend", params, {
    loading: false,
    ignoreErrorTips: true,
    ...options
  });
}
