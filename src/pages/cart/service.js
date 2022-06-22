import http from "@/utils/http";

const goodsCart = new http("goodsCart");
const main = new http("main");

// 测试
// 推荐商品列表
export function getRecommend(params, options) {
  return main.get("/recommend", params, {
    loading: false,
    ignoreErrorTips: true,
    ...options
  });
}

// 购物车列表
export function getCartList(params, options) {
  return goodsCart.post("/page", params, {
    loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}

// 修改购物车-商品
export function getEditCart(params, options) {
  return goodsCart.post("/edit", params, {
    loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}

// 删除购物车-商品
export function getDelCart(params, options) {
  return goodsCart.post("/del", params, {
    loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}
