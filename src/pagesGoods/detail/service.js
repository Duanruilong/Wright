import http from "@/utils/http";

const goods = new http("goods");
const goodsEvaluation = new http("goodsEvaluation");
const goodsCart = new http("goodsCart");

// 商品详情
export function getGoodsInfo(params, options) {
  return goods.get("/info", params, {
    loading: false,
    ...options
  });
}

// 商品库存信息
export function getStock(params, options) {
  return goods.get("/stock", params, {
    loading: false,
    ...options
  });
}

// 商品评价列表
export function getGoodsEvaluation(params, options) {
  return goodsEvaluation.get("/list", params, {
    loading: false,
    ...options
  });
}

// 商品添加到购物车
export function getGoodsAddCart(params, options) {
  return goodsCart.post("/add", params, {
    loading: false,
    ...options
  });
}
