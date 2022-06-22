import http from "@/utils/http";

const goods = new http("goods");

// 商品详情
export function getGoodsInfo(params, options) {
  return goods.get("/info", params, {
    loading: false,
    ...options
  });
}
