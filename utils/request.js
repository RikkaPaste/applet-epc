import requestConfig from './hostconfig';
let count = 0;
export function request(params) {
  params.headers = !params.headers ? {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + wx.getStorageSync("jwttoken")
  } : params.headers;
  params.method =
    !params.method ? 'post' : params.method;
  params.data = !params.data ? {} : params.data;
  if (count == 0) {
    wx.showLoading({
      title: "拼命加载中......",
      mask: true
    });
  }
  //每发一次请求累计一次
  count++;
  let url = "";
  if (params.url) {
    url = params.url;
  } else {
    url = requestConfig.apiHost + params.path;
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: params.data,
      header: params.headers,
      method: params.method,
      success: (result) => {
        resolve(result.data.data);
      },
      fail: (err) => {
        reject("请求失败," + err);
      },
      complete: () => {
        count--;
        if (count == 0) {
          wx.hideLoading();
        }
      }
    });
  });
}