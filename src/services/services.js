import { get, post, put } from "@/utils/http.js";

// 发送邮件
export const sendVerifyCodeAPI = data => {
  return post("/user/sendAuthCode", data);
};

// 注册
export const registerAPI = data => {
  return post("/user/register", data);
};

// 登录
export const loginAPI = data => {
  return post("/user/login", data);
};

// 修改密码
export const updatePasswordAPI = data => {
  return put("/user/updateMyPsw", data);
};

// 获取用户信息
export const getUserInfoAPI = () => {
  return get("/user/query");
};

// 更新用户信息
export const updateUserInfoAPI = data => {
  return put("/user/updateInfo", data);
};

// 发布信息
export const publishCreateAPI = data => {
  return post("/publish/create", data);
};

// 发布信息列表
export const publishListAPI = data => {
  return get("/publish/list", data);
};
