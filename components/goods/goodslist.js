// components/goodslist/goodslist.js
import hostconfig from '../../utils/hostconfig'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goods:{ type: Array, value: [] }
  },

  /**
   * 组件的初始数据
   */
  data: {
    urlImg:hostconfig.apiHosts
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getId(e){
      //获取当前点击的商品id
     wx.navigateTo({
       url: '../../pages/details/details?goodsid='+e.currentTarget.dataset.item.id,
     });
    },
  }
})
