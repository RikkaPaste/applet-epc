// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menus:{type:Array,value:[]}
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //选择购买状态函数
  selectItem(e) {
    //获取索引
   let index=e.currentTarget.dataset.index;
    let menus = this.data.menus.map((item) => {
      item.active = false
      return item;
    });
    menus[index].active = true;
    this.setData({
      menus
    });
    //传递选中的下标
    this.triggerEvent("SelectItem",{index});
  },
  }
})
