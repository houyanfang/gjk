var app = getApp();
Page({
  data: {
    userName: "name",
    phone: "",
    id: "",
    token: "",
    userInfo: ""
  },
  onLoad: function (e) {
    var _cookie;
    wx.getStorage({
      key: 'cook',
      success: function (res) {
        // success
        _cookie = res.data.cook;
        wx.request({
          url: 'https://gl.ganjuke.com/cmsManage/wxUtil/staff_list.htm',
          data: {
            userId: e.id
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          header: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + res.data.cook },
          success: function (res) {
            // success
            console.log(res)
          }
        })
      }
    })

    var that = this
    this.setData({
      userId: e.cook,
      userName: e.perName,
      phone: e.perMobile,
      id: e.id,
      token: e.userToken
    })
    wx.setStorage({
      key: 'userId',
      data: e,
      success: function (res) {
        console.log(res)
      }
    })
  }
})