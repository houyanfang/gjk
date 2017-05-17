//logs.js
Page({
  data: {
    logs: [],
    units:['片','粒','袋','克','支','丸'],
    unitsIndex:0
  },
  onLoad: function () {
  /*  this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      })
    })*/
  },
  alertUnit:function(e){
    this.setData({
      unitsIndex:e.detail.value
    });
  }
})
