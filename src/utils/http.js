import axios from "axios";
import { Message } from "element-ui";

axios.defaults.timeout = 200000000;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

// http request 拦截器
axios.interceptors.request.use(
  config => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (userInfo) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.id = userInfo.id; //请求头加上token
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        if (res.status == 200) {
          resolve(res.data);
        } else {
          Message.error({
            message: res.data.description || "连接异常，请刷新重试!"
          });
        }
      })
      .catch(err => {
        reject(err.message);
      });
  });
}

export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        console.log(res);
        if (res.status == 200) {
          resolve(res.data);
        } else {
          Message.error({
            message: res.data.description || "连接异常，请刷新重试!"
          });
        }
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then(res => {
        if (res.status == 200) {
          resolve(res.data);
        } else {
          Message.error({
            message: res.data.description || "连接异常，请刷新重试!"
          });
        }
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
