import http from "@/utils/http";

const order = new http("order");
const usr = new http("usr");
const goods = new http("goods");

//创建订单
export function getCreate(params, options) {
  return order.get("/create", params, {
    loading: false,
    ignoreErrorTips: true,
    ...options
  });
}

// 获取默认地址
export function getAddress(params, options) {
  return usr.get("/address", params, {
    loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-21 10:52:03
 *  @Desc: 订单详情
 *  country & orderid  &  userid
 * */
export function getOrdersDetail(params, options) {
  return order.get("/detail", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}
/**
 *  @Author: duanruilong
 *  @Date: 2022-04-21 10:52:03
 *  @Desc: 配送信息
 * */
export function getDeliverTo(params, options) {
  return goods.get("/deliverto", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}
