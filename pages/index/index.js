import { request } from '../../utils/request'
import hostconfig from '../../utils/hostconfig'
import {tabBarCount} from '../../utils/util'
// 获取应用实例
const app = getApp()

Page({
  data: {
    img: [],
    goodslist: undefined,
    floorstatus: false,
    showbottom: false,
    pagelist: 0,
    goodscount: 2
  },
  pageSize: 8,
  pageNo: 1,//页数
  count: 1,//记录
  noneCount:5,//默认最大记录
  // 事件处理函数
  search() {
    //跳转
    wx.switchTab({
      url: "/pages/list/list"
    })
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 1500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //回到顶部
  goTop: function (e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  async getimgs(pageNo, pageSize) {
    let imgs = await request({
      path: "/swiper/listswiper",
      data: { pageNo, pageSize, imgUrl: "" }
    })
    let list = [];
    imgs.rows.forEach(element => {
      list.push(hostconfig.apiHosts+'/images/upload/rootswiper/' + element.imgurl);
    });
    this.setData({ img: list })
  },
  async getgoodslist(pageNo, pageSize) {
    //获取商品列表
    let goods = await request({
      path: '/goods/listgoods',
      data: { goodsName: "", pageNo, pageSize }
    })
    //二维化
    this.setData({
      [`goodslist[${this.pageNo - 1}]`]: goods.rows,
      goodscount:Math.ceil(goods.count/(this.noneCount+1))
    })
  },

  //上一页
  async onPage() {
    if (this.data.pagelist >0) {
      this.setData({ goodslist: [] })
      //返回上一页记录数
      this.pageNo-=((this.count) * 2)-1;
      this.setData({ pagelist: --this.data.pagelist }); 
      await this.getgoodslist(this.pageNo, this.pageSize);
    }
    this.setData({ showbottom: false })
    //记录数初始化
    this.count = 1;
  },
  //下一页
  async nextPage() {
    if(this.data.goodscount>=this.data.pagelist){
    this.setData({ pagelist: ++this.data.pagelist });
    this.setData({ goodslist: []})
    //计算当前页数
    this.pageNo += 1;
    await this.getgoodslist(this.pageNo, this.pageSize);
    }
    this.setData({ showbottom: false })
    this.count = 1;
  },
  async onShow() {
    //监视首次打开页面的状态 如果已经有jwtToken返回，停止定时器监视
    let timer = setInterval(() => {
      if (app.globalData &&
        app.globalData.hasOwnProperty('jwtToken') &&
        app.globalData.jwtToken) {
        if(!this.data.goodslist){
        this.getimgs(1, this.pageSize);
        this.getgoodslist(1, this.pageSize);
        }
        clearInterval(timer);
      }
    })
    tabBarCount();
  },
  onReachBottom(e) {
    //限制只能请求默认设置的请求数据
    if (this.count <= this.noneCount) {
      this.count++;
      //每次下拉请求页数自增
      ++this.pageNo;
      //拉取数据
      this.getgoodslist(this.pageNo, this.pageSize);
      this.setData({ showbottom: false })
    } else {
      this.setData({ showbottom: true })
    }
  },

  /* 
   *分享到朋友圈
   */
   onShareTimeline(res){
    return {
      title: '茶斟君品,做你的购物好能手!',
      path:'/pages/index/index',
      imageUrl: hostconfig.apiHosts+'/images/upload/prd/upload_efe98c3c13a687a8602971877dde50ec.jpg'
    }
  },

  onShareAppMessage: function (res) {
    return {
      title: '茶斟君品,做你的购物好能手!',
      path:'/pages/index/index',
      imageUrl: hostconfig.apiHosts+'/images/upload/prd/upload_efe98c3c13a687a8602971877dde50ec.jpg'
    }
}
})