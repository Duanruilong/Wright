import http from "@/utils/http";

const usr = new http("usr");

// 新增地址
export function getNewAddresses(params, options) {
  return usr.get("/newaddress", params, {
    loading: true,
    // ignoreErrorTips: true,
    ...options
  });
}

// 修改-地址列表
export function getEditAddress(params, options) {
  return usr.get("/editaddress", params, {
    loading: true,
    // ignoreErrorTips: true,
    ...options
  });
}
