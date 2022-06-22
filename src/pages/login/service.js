import http from "@/utils/http";

const { get } = new http("usr", { ignoreSession: true });

export function getVisitorLog(params, options) {
  return get("/visitorlogin", params, {
    loading: false,
    ...options
  });
}
