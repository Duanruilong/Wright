import http from "@/utils/http";

// const usr = new http("usr");
const main = new http("main");

export function getRecommend(params, options) {
  return main.get("/recommend", params, {
    // loading: false,
    // ignoreErrorTips: true,
    ...options
  });
}
