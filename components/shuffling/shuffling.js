
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //type:数据类型
    //value:默认值
    imgs: { type: Array, value: [] }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //是否显示面板指示点
    indicatorDots: true,
    //是否自动播放
    autoplay: true,
    //自动播放间隔，毫秒
    interval: 5000,
    //动画持续时间，毫秒
    duration: 500
  }
})