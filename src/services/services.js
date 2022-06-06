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

// 删除发布
export const publishRemoveAPI = data => {
  return put("/publish/remove", data);
};

// 发布信息列表
export const publishListAPI = data => {
  return get("/publish/list", data);
};

// 发布详情
export const publishDetailAPI = data => {
  return get("/publish/detail", data);
};

// 发布中心 list
export const publishCenterAPI = data => {
  return get("/receiver/search", data);
};

// 创建订单
export const orderCreateAPI = data => {
  return post("/order/create", data);
};

//订单列表
export const orderListAPI = data => {
  return get("/order/list", data);
};

//修改订单状态
export const updateOrderStatus = data => {
  return put("/order/update", data);
};

// 审核订单
export const auditAPI = data => {
  return put("/audit/publishInfo", data);
};

// 投诉
export const complaintAPI = data => {
  return put("/order/complaint", data);
};

// 用户列表
export const userListAPI = data => {
  return get("/user/queryAll", data);
};

// 解封账号
export const freezeUserAPI = data => {
  return put("/user/updateStatus", data);
};

// 重置密码
export const resetPasswordAPI = data => {
  return put("/user/resetPsw", data);
};

auditComplaintAPI;
// 审核投诉
export const auditComplaintAPI = data => {
  return put("/audit/complaint", data);
};
