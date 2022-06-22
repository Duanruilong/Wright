import http from "@/utils/http";

const goodsUser = new http("goodsUser");
const usr = new http("usr");
const main = new http("main");

// 测试
export function getRecommend(params, options) {
  return main.get("/recommend", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-21 10:52:03
 *  @Desc: 获取浏览记录
 * */
export function getBrowse(params, options) {
  return goodsUser.get("/getBrowse", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}
/**
 *  @Author: duanruilong
 *  @Date: 2022-04-21 10:52:03
 *  @Desc: 收藏列表
 * */
export function getFavorites(params, options) {
  return usr.get("/favorites", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}
