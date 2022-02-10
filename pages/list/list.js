import { request } from '../../utils/request'
import hostconfig from '../../utils/hostconfig'
import { tabBarCount } from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectThreeid: 0,
    cateNamesOne: [],
    cateNamesTwo: [],
    cateNamesThree: [],
    cateNamesFour: [],
    index: 0,
    selectFourid: 0,
    urlImg: hostconfig.apiHosts,
    inputShowed: true,
    value: ''
  },
  topList: undefined,

  async searchGoods(e) {
    let data;
    //不为空是搜索
    if (e.detail.value.trim()) {
      data = await this.getGoods(e.detail.value.trim());
    } else {
      //为空显示默认三级id所对应商品
      this.selectLevelFour(this.data.selectFourid);
      return;
    }
    this.setData({ cateNamesFour: data.rows})
  },

  //获取搜索到的商品
  async getGoods(value) {
    let data = await request({
      path: "/goods/finds",
      data: { pageNo: 1, pageSize: 30, goodsName: value }
    });
    return data;
  },
  //获取分类
  async searchLevel(pid) {
    let data = await request({
      path: "/goodscategory/getlevel",
      data: { pid }
    });
    return data;
  },
  async getGoodsList(id) {
    let three = await request({
      path: "/goods/bycateid",
      data: { id }
    });
    return three;
  },
  //用户选择的分类 一级
  bindPickerChange(e) {
    this.setData({ index: e.detail.value })
    this.selectLevelTwo(this.topList);
  },
  //用户点击的二级内容
  async selectTwo(e) {
    this.setData({ selectThreeid: e.currentTarget.dataset.item.id })
    await this.selectLevelThree(this.data.selectThreeid);
  },
  //用户点击三级内容
  async selectThree(e) {
    this.setData({ selectFourid: e.currentTarget.dataset.item.id })
    await this.selectLevelFour(this.data.selectFourid);
  },
  //用户点击四级后跳转
  async selectFour(e) {
    wx.navigateTo({
      url: '../../pages/details/details?goodsid=' + e.currentTarget.dataset.item.id,
    });
  },
  //添加到购物车
  addCat(e) {
    let data = {
      goods_id: e.target.dataset.item.id,
      goods_price: e.target.dataset.item.goodsPrice,
      goods_name: e.target.dataset.item.goodsName,
      goods_logo: e.target.dataset.item.goodsSmallLogo,
    };
    //保存在缓存
    let goodslist = wx.getStorageSync('goodslist') || [];
    let index = goodslist.findIndex(i => i.goods_id == data.goods_id);
    if (index == -1) {
      //给goods对象添加一个num属性，用于计数
      data.num = 1;
      let obj = Object.assign({}, data);//深拷贝一份
      goodslist.push(obj);
    } else {
      //控制购物车数量
      if (goodslist[index].num < 20) {
        goodslist[index].num += 1;//如果在购物车中存在商品，就把数量加1
      } else {
        wx.showToast({
          icon: 'error',
          title: '该商品已达极限'
        })
        return
      }
    }
    wx.showToast({
      title: '加入购物车成功'
    });
    wx.setStorageSync("goodslist", goodslist);
    //计算商品总个数
    tabBarCount();
  },
  //选择第二级
  async selectLevelTwo(data) {
    //取出对应的二级分类的id
    let tow = data.find(i => i.cateName == this.data.cateNamesOne[this.data.index]);
    //设置二级到渲染data中
    let dataTwo = await this.searchLevel(tow.id);
    //设置选中二级所有子级，及第一个子级id
    this.setData({ cateNamesTwo: dataTwo, selectThreeid: dataTwo[0].id })
    //三级
    await this.selectLevelThree(this.data.selectThreeid);
  },
  //三级选项内容
  async selectLevelThree(id) {
    let dataThree = await this.searchLevel(id);
    //设置三级选项
    this.setData({
      cateNamesThree: dataThree,
      selectFourid: !dataThree.length ? null : dataThree[0].id
    });
    //四级
    await this.selectLevelFour(this.data.selectFourid);
  },
  //四级选项内容
  async selectLevelFour(id) {
    let dataFour;
    if (id) {
      dataFour = await this.getGoodsList(id);
    }
    //四级商品内容
    this.setData({ cateNamesFour: !dataFour ? [] : dataFour });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
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
    let data = await this.searchLevel(0);
    //保存一份
    this.topList = Object.assign([], data);
    let list = [];
    data.forEach(element => {
      list.push(element.cateName)
    });
    //如果没有选中的值默认请求一次
    if(!this.data.selectThreeid){
    //保存在一级选择器中
    this.setData({ cateNamesOne: list });
    //默认取选中的一级分类
    await this.selectLevelTwo(data);
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
    return {
      title: '茶斟君品',
      path: '/pages/details/details',
      imageUrl: this.data.urlImg + '/images/upload/prd/upload_efe98c3c13a687a8602971877dde50ec.jpg'
    }
  }
})