// app.js
import { request } from './utils/request'
import { login } from './utils/toasync'
App({
  openid: '',
  isReg: 0,
  globalData: {
    jwtToken: '',
    isNick: 0,
    clientId: 0
  },
  timer: false,
  async onLaunch() {
    // 登录
    let result = await login();
    if (result.code) {
      let rs = await request({
        path: "/wx/openid",
        method: "post",
        data: { code: result.code }
      });
      this.openid = rs.openid;
      wx.setStorageSync("openid", rs.openid);
      //未注册
      if (rs.isReg == 2) {
        let client = {
          //clientNick:userInfo.nickName,
          //wxlogo:userInfo.avatarUrl,
          wxopenid: this.openid
        }//注册要在接口上放行
        let addrs = await request({
          path: "/clients/add",
          method: "post",
          data: client
        });
        rs.clientId = addrs.id;
      }
      //通过openid获取Jwttoken
      let rsLoginOpenid = await request({
        path: "/clients/loginbyopenid",
        method: "post",
        data: { openid: this.openid }
      });
      if (this.launchToken) {
        this.launchToken(rsLoginOpenid.token, rs.isNick, rs.clientId);
      }
      wx.setStorageSync("jwttoken", rsLoginOpenid.token);
      wx.setStorageSync("isNick", rs.isNick);
      wx.setStorageSync("nickName", rsLoginOpenid.name);
      wx.setStorageSync("clientId", rs.clientId);
      this.globalData.jwtToken = rsLoginOpenid.token;
      this.globalData.nickName = rsLoginOpenid.name;
      this.globalData.isNick = rs.isNick;
      this.globalData.clientId = rs.clientId;
    }
  }
})
