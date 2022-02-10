import hostconfig from '../../utils/hostconfig'
import { request } from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myAddr: undefined,
    goodslist: undefined,
    urlImg: hostconfig.apiHosts,
    allPcs: 0,
    allNumber: 0,
    allMoney: 0,
  },

  //过滤出选中状态的商品
  checkedGoods(goodslist) {
    let list = goodslist.filter((item) => {
      return item.checked;
    })
    this.setData({ goodslist: list });
  },

  //用户点击时跳转到商品详情
  checkGoods(e) {
    wx.navigateTo({
      url: '../../pages/details/details?goodsid=' + e.currentTarget.dataset.item.goods_id,
    });
  },
  //结算按钮
  async balance() {
    let openid = wx.getStorageSync('openid');
    let goodslist = this.data.goodslist;
    let newlist = [];
    //把购物车数据进行组装，发送给api，api需要
    //先生成商品订单，拿到新的商品订单号，这个
    //订单号需要发给微信服务器获取预支付id(prepay_id)
      goodslist.forEach((ele, i) => {
      let obj = {
        goodsId: ele.goods_id,//商品id
        goodsPrice: ele.goods_price,//商品价格
        goodsNumber: ele.num,//商品数量
        goodsName: ele.goods_name,//商品名称
        goodsLogo: ele.goods_logo,//商品logo
        goodsTotalPrice: ele.num * ele.goods_price,//订单总价
        openId: ele.openid,//用户openid
        fromOpenId: ele.fromOpenId
      }
      newlist.push(obj);
    });
    console.log(newlist,52);
    //获取预支付id //需要mch_id和appid绑定 待定
    let rs = await request({
      path: "/wx/prepayid",
      data: {
        goodsList: newlist,
        totalNum: this.data.allNumber,
        totalPrice: this.data.allMoney,
        addr: this.data.myAddr,
        openid,
        fromOpenId: goodslist[0].fromOpenId
      }
    });
    console.log(rs, 64);
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
    //取出数据
    let myaddr = wx.getStorageSync("myaddr");
    //所有购买商品的信息
    let allData = wx.getStorageSync('allData');
    if (myaddr && myaddr.userName) {
      this.setData({ myAddr: myaddr });
    }
    //取出缓存中的添加数据
    let goodslist = wx.getStorageSync('goodslist') || [];
    this.checkedGoods(goodslist);
    //展开赋值
    this.setData({ ...allData });
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
})