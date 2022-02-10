// pages/Status/Status.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menus: [
      { id: 1, "menuname": "全部订单", active: false },
      { id: 2, "menuname": "待发货", active: false },
      { id: 3, "menuname": "已发货", active: false },
      { id: 4, "menuname": "退款", active: false }
    ],
    index:0
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

  //需要改变的方法
  updMenus(index){
    let {menus}=this.data;
    menus.forEach((item,i)=>{
      //设置选中状态
      i===index?item.active=true:item.active=false;
    })
    this.setData({menus});
  },
  //子传父属性
  selectItem(e){
    let {index}=e.detail;
      //向页面传递所选下标
      this.updMenus(index);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let currentPages = getCurrentPages();
    let { options } = currentPages[currentPages.length - 1];
    //向页面传递所选下标
    this.updMenus((options.state) - 1);
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