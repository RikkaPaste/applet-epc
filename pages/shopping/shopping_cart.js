import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/toasync.js';
import hostconfig from '../../utils/hostconfig'
import { tabBarCount } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myAddr: undefined,
    goodslist: undefined,
    urlImg: hostconfig.apiHosts,
    allNumber: 0,
    allMoney: 0,
    allflog: false,
    allPcs:0
  },
  //前往首页
  goIndex() {
    wx.switchTab({
      url: '../../pages/index/index',
    });
  },
  //选择收货地址
  async address() {
    try {
      let getAddr = await getSetting();
      let scopeAddr = getAddr.authSetting["scope.address"];
      let chAddr;
      //如果用户接受授权，就可以获取地址信息
      if (scopeAddr === false) {
        await openSetting();
      }
      chAddr = await chooseAddress();
      wx.setStorageSync("myaddr", chAddr);
      this.setData({
        myAddr: chAddr
      });
    } catch (error) {
      return;
    }
  },
  //方法计数
  allNumberGoods(goodslist) {
    //计数  累加
    let allPcs = goodslist.reduce((pre, goods) => pre + (goods.checked ? 1 : 0), 0);
    //计算商品个数
    let allNumber=goodslist.reduce((pre, goods) => pre + (goods.checked ? goods.num : 0), 0);
    //计算金钱 计算如果是选中状态累加金钱
    let allMoney = goodslist.reduce((pre, goods) => pre + (goods.goods_price
      && goods.checked ? ((goods.goods_price * 1) * (goods.num * 1)) : 0), 0);
      //allflog:全选状态 ,allPcs:件数 ,allNumber:商品数, allMoney:总价
    this.setData({allPcs,allNumber, allMoney:allMoney.toFixed(2), allflog: allPcs == goodslist.length });
  },
  //设置选中状态
  checked(e) {
    //获取缓存中的数据
    let goodslist = Object.assign([], this.data.goodslist || []);
    //取出id在缓存中对应索引
    let index = goodslist.findIndex(i => i.goods_id == e.target.dataset.item);
    if (index !== -1) {
      //设置选中的值
      goodslist[index].checked = !goodslist[index].checked ? true : false;
    }
    //计数
    this.allNumberGoods(goodslist);
    //设置缓存
    wx.setStorageSync('goodslist', goodslist);
  },

  //计算
  async count(e) {
    //获取id及要执行的业务
    let { op, goodsid } = e.target.dataset;
    let goodslist = Object.assign([], this.data.goodslist || []);
    //取出id在缓存中对应索引
    let index = goodslist.findIndex(i => i.goods_id == goodsid);
    if (index !== -1) {
      if (goodslist[index].num == 1 && op == -1) {
        let result = await showModal();
        if (result) {
          //删除
          goodslist.splice(index, 1);
        }
      } else {
        //如果用户点击-控制减数量
        if (op == -1) {
          goodslist[index].num += op * 1;
        } else if (goodslist[index].num < 20 && op == 1) {//控制数量在20之间并且是点击+的情况下
          goodslist[index].num += op * 1;
        } else {//否则弹出提示
         wx.showToast({
            icon: 'error',
            title: '该商品已达极限'
          })
          return;
        }
      }
    }
    //计数
    this.allNumberGoods(goodslist);
    this.setData({ goodslist })
    wx.setStorageSync('goodslist', goodslist);
    tabBarCount();
  },

  //全选状态
  allchecked() {
    this.setData({ allflog: !this.data.allflog });
    let goodslist = Object.assign([], this.data.goodslist || []);
    goodslist.forEach(item => {
      item.checked = this.data.allflog;
    })
    //重新计算
    this.allNumberGoods(goodslist);
    this.setData({ goodslist })
    wx.setStorageSync('goodslist', goodslist);
  },
  //用户点击时跳转到商品详情
  checkGoods(e) {
    wx.navigateTo({
      url: '../../pages/details/details?goodsid=' + e.currentTarget.dataset.item.goods_id,
    });
  },

  //结算按钮
  async balance() {
    let openid=wx.getStorageSync('openid');
    let {allMoney,allPcs,allNumber}=this.data;
    if(!openid){
      await showToast('请先登录');
      return;
    }else if (!this.data.allPcs) {
      await showToast("请选择结算商品");
      return;
    } else if (!this.data.myAddr) {
      await showToast("这位客官,收货地址!");
      return;
    } else {
      //保存在缓存
      wx.setStorageSync('allData',{allMoney,allPcs,allNumber})
      wx.navigateTo({
        url: '../pay/pay',
      });
    }
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
    let myaddr = wx.getStorageSync("myaddr");
    if (myaddr && myaddr.userName) {
      this.setData({ myAddr: myaddr });
    }
    //取出缓存中的添加数据
    let goodslist = wx.getStorageSync('goodslist') || [];
    this.allNumberGoods(goodslist);
    this.setData({ goodslist });
    //重新计算
    tabBarCount();
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
  onallNumberAppMessage: function () {

  }
})