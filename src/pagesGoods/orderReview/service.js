import http from "@/utils/http";

const goodsEvaluation = new http("goodsEvaluation");

// 获取商品评价
export function getGoodsEvaluation(params, options) {
  return goodsEvaluation.get("/getOne", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}
// 添加商品评价 /wright/api/goodsEvaluation/add
export function getAddGoodsEvaluation(params, options) {
  return goodsEvaluation.post("/add", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}
// 编辑商品评价
export function getEditGoodsEvaluation(params, options) {
  return goodsEvaluation.post("/edit", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}
