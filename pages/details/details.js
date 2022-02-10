// pages/details/details.js
import { request } from '../../utils/request'
import hostconfig from '../../utils/hostconfig'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: undefined,
    fromOpenId:undefined
  },

  /**
   * 
   * @param {*} via 进入的途经 作为提示的判断依据 有加入购物车，有立即购买
   * @returns 
   */
  //保存在缓存
  saveStorage(via) {
    //保存在缓存
    let goodslist = wx.getStorageSync('goodslist') || [];
    let openid=wx.getStorageSync('openid');
    let index = goodslist.findIndex(i => i.goods_id == this.data.goods.goods_id);
    if (index == -1) {
      //给goods对象添加一个num属性，用于计数
      this.data.goods.num = 1;
      let obj = Object.assign({}, this.data.goods);//深拷贝一份
      //如果是立即购买携带fromOpenId或用户openid
      if(!via){
        obj.fromOpenId=this.data.fromOpenId;
        obj.openid=openid;
        //立即购买设置选中状态
        obj.checked=true;
      }
      delete obj.pics;
      delete obj.goods_introduce;
      goodslist.push(obj);
    } else {
      //控制购物车数量
      if (goodslist[index].num < 20) {
        goodslist[index].num += 1;//如果在购物车中存在商品，就把数量加1
      } else {
        //如果是从购物车进入的该方法跳出该提示
        if (via) {
          wx.showToast({
            icon: 'error',
            title: '该商品已达极限'
          })
          return
        }
      }
    }
    if (via) {
      wx.showToast({
        title: '加入购物车成功'
      });
    }
    wx.setStorageSync("goodslist", goodslist);
    this.setData({ goods: { ...this.data.goods, ...goodslist[index] } });
  },
  //添加购物车
  addCat() {
    this.saveStorage(1);
  },
  //立即购买按钮
  buyNow() {
    //跳转
    wx.switchTab({
      url: '../../pages/shopping/shopping_cart',
    });
    this.saveStorage(0);
  },
  //获取该id对应商品数据
  async goods(id) {
    let data = await request({
      path: "/goods/onegoods",
      data: { id }
    })
    //存放
    let list = [];
    data.pics.forEach(element => {
      list.push(hostconfig.apiHosts + "/images/upload/prd/" + element.midImg)
    })
    if (data.goodsIntroduce) {
      //转码替换
      data.goodsIntroduce = decodeURIComponent(data.goodsIntroduce);
      data.goodsIntroduce = data.goodsIntroduce.replace(/\<p/g, '<p style="text-align:center;"');
      data.goodsIntroduce = data.goodsIntroduce.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin-bottom:10px;"');
    }
    this.setData({
      goods: {
        ...this.data.goods, ...{
          goods_id: data.id,
          goods_price: data.goodsPrice,
          goods_name: data.goodsName,
          goods_introduce: data.goodsIntroduce,
          goods_logo: data.goodsSmallLogo,
          pics: list
        }
      }
    })
  },
  dialog:undefined,
  //授权
  bindGetUserInfo() {
    wx.getUserProfile({
      desc: '使用户得到更好的体验',
      success: async (res) => {
        let user = res.userInfo
        wx.setStorageSync('user', user)
        wx.setStorageSync("nickName",user.nickName);
        this.setData({
          nickName: user.nickName,
          userInfo: user
        })
        let rs=await request({
          path:"/clients/upd",
          data:{id:this.data.clientId,clientNick:user.nickName}
        });
        //获取昵称并得到更新后，全局变量的isNick也要跟着变
        //不然onShow的if中的isNick判断会一直是2
        app.globalData.isNick=1;
        this.dialog.hideDialog();
      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.removeStorageSync('goodslist');
    //获取当前页面栈
    let currentPages = getCurrentPages();
    let { options } = currentPages[currentPages.length - 1];
    //获取传递的商品id
    let goodsid=!options.goodsid?0:options.goodsid;
    //获取传递的openid
    let fromOpenId=!options.openid ? 0 : options.openid;
    this.goods(goodsid);
    //获取缓存的数据
    let goodslist = wx.getStorageSync('goodslist') || [];
    //获取缓存中的商品购物车数量
    let num;
    goodslist.forEach(item => {
      if (item.goods_id == options.goodsid) num = item.num;
    })
    //初始数量
    this.setData({ 'goods.num': num,fromOpenId})
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

  /* 
   *分享到朋友圈
   */
  onShareTimeline(res) {
    let openId = wx.getStorageSync('openid');
    return {
      title: '茶斟君品: ' + this.data.goods.goods_name,
      path: '/pages/details/details?goodsid=' + this.data.goods.goods_id + '&openid=' + openId,
      imageUrl: hostconfig.apiHosts + '/images/upload/prd/' + this.data.goods.goods_logo
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let openId = wx.getStorageSync('openid');
    return {
      title: '茶斟君品: ' + this.data.goods.goods_name,
      path: '/pages/details/details?goodsid=' + this.data.goods.goods_id + '&openid=' + openId,
      imageUrl: hostconfig.apiHosts + '/images/upload/prd/' + this.data.goods.goods_logo
    }
  }
})