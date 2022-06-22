import http from "@/utils/http";

const main = new http("main");

export function getLike(params, options) {
  return main.get("/like", params, {
    loading: false,
    ...options
  });
}

export function getUnlike(params, options) {
  return main.get("/unlike", params, {
    loading: false,
    ...options
  });
}
