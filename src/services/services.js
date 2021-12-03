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

// 获取余额及充值卡信息
export const walletInfoAPI = data => {
  return get("/wallet/rechargeVouchers", data);
};

// 充值
export const couponAPI = data => {
  return post("/wallet/recharge", data);
};

// 提现
export const withdrawAPI = data => {
  return post("/wallet/withdraw", data);
};

// 新建发布
export const publishCreateAPI = data => {
  return post("/publish/create", data);
};

//编辑发布
export const publishUpdateAPI = data => {
  return put("/publish/update", data);
};

// 发布信息列表
export const publishListAPI = data => {
  return get("/publish/list", data);
};

// 发布详情
export const publishDetailAPI = data => {
  return get("/publish/detail", data);
};
