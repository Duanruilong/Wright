import http from "@/utils/http";

const { get } = new http("usr", { ignoreSession: true });

export function login(params, options) {
  return get("/login", params, {
    // loading: false,
    ...options
  });
}

export function getRegister(params, options) {
  return get("/register", params, {
    // loading: false,
    ...options
  });
}
