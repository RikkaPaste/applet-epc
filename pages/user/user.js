import { getSetting, chooseAddress, openSetting, showToast } from '../../utils/toasync.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: false,
    userInfo: undefined,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //选择收货地址
  async address() {
    try {
        let getAddr = await getSetting();
        let scopeAddr = getAddr.authSetting["scope.address"];
        //如果用户接受授权，就可以获取地址信息
        if (!scopeAddr) {
          await openSetting();
        } else {
          let chAddr = await chooseAddress();
          wx.setStorageSync("myaddr", chAddr);
        }
    } catch (error) {
      return;
    }
  },
  //联系
  contact(){
    wx.navigateTo({
      url: '../../pages/contact/contact'
    });
  },
  //点击订单列表状态
  accessState(e) {
    if (this.data.result) {
      wx.navigateTo({
        url: '../../pages/status/status?state=' + e.currentTarget.dataset.state,
      });
    } else {
     wx.showToast({
        icon: 'error',
        title: '请先完成授权'
      })
    }
  },
  //授权
  getUserInfo() {
    let that = this;
    wx.getUserProfile({
      desc: '小程序需要获取你的昵名,头像',
      success: (res) => {
        that.setData({ userInfo: res.userInfo, result: true });
        wx.setStorageSync('userInfo',res.userInfo);
        wx.showToast({
          icon: 'success',
          title: '授权成功'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 查看是否授权
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let that = this;
    let userInfo=wx.getStorageSync('userInfo');
    //如果没有授权信息进行授权
    if (!this.data.result&&!userInfo) {
      let getUser = await getSetting();
      let getScope = getUser.authSetting['scope.userInfo']
      if (!getScope) {
        //打开接受授权页面
        await openSetting();
      } else {
        wx.getUserInfo({
          success: function (res) {
            that.setData({ userInfo: res.userInfo });
          }
        })
      }
    }else{
      that.setData({userInfo,result:true});
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})