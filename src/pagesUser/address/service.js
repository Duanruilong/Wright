import http from "@/utils/http";

const usr = new http("usr");

// 地址列表
export function getAddresses(params, options) {
  return usr.get("/addresses", params, {
    loading: true,
    // ignoreErrorTips: true,
    ...options
  });
}

// 查询默认地址
export function getAddress(params, options) {
  return usr.get("/address", params, {
    loading: true,
    // ignoreErrorTips: true,
    ...options
  });
}

// 删除地址
export function getDelAddress(params, options) {
  return usr.get("/deladdress", params, {
    loading: true,
    // ignoreErrorTips: true,
    ...options
  });
}
