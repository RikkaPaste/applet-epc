const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}


const tabBarCount = () => {
  let goodslist = wx.getStorageSync('goodslist') || [];
  if (goodslist.length) {
    //显示数量
    wx.setTabBarBadge({
      index: 2,
      text: goodslist.length + ''//显示数量
    })
  } else {
    //移除
    wx.removeTabBarBadge({
      index: 2
    })
  }
}



module.exports = {
  formatTime,
  tabBarCount
}


