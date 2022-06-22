import http from "@/utils/http";

const order = new http("order");
const main = new http("main");
const goodsCart = new http("goodsCart");

// 测试
export function getRecommend(params, options) {
  return main.get("/recommend", params, {
    // loading: false,
    // ignoreErrorTips: true,
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

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-21 10:52:03
 *  @Desc: 我的订单
 *  type ： 0查看所有订单 1已下单 2已支付 3退款中 4已经退款 5配送中 6已完结
 * */
export function getOrders(params, options) {
  return order.get("/orders", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-21 10:52:03
 *  @Desc: 退货申请
 *  "orderDetailId": "string",
    "orderId": "string",
    "reason": "string",
    "refundType": 0,
    "token": "string"
 * */
export function getRefundGoods(params, options) {
  return order.post("/refundGoods", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-21 10:52:03
 *  @Desc: 退货申请
     "orderId": "string",
    "payChannel": "string",
    "token": "string"
 * */
export function getToPay(params, options) {
  return order.post("/toPay", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}
