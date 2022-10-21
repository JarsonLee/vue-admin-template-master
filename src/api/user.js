import request from "@/utils/request";
/* 用户登录，登出，token获得用户信息的接口 */
export function login(data) {
  return request({
    url: "/admin/acl/index/login",
    method: "post",
    data,
  });
}

export function getInfo(token) {
  return request({
    url: "/admin/acl/index/info",
    method: "get",
    params: { token },
  });
}

export function logout() {
  return request({
    url: "/admin/acl/index/logout",
    method: "post",
  });
}
