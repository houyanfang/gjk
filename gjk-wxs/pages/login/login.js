// pages/login/index.js
var app = getApp()
Page({
 data: {
    checked:false,
    display:"none",
    msg:"用户名或密码不能为空",
    textVal:{}
  },
  showVal:function(e){
    this.data.textVal[e.currentTarget.id] = e.detail.value
  },
  yetread:function(){
    //对checked取反
    this.setData({
      checked:!this.data.checked
    })
  },
  hideModel:function(){
    this.setData({
      display:"none"
    })
  },
  UserLogin:function(){
    var that = this;        // step one:get cookie
    wx.request({
        url:'https://gl.ganjuke.com/cmsManage/wxUtil/login.htm',
          data: {
            staffLoginName:this.data.textVal.userName,
            staffPassword:this.data.textVal.passWord
          },
        header:{'Content-Type':'application/x-www-form-urlencoded'},
        method:'POST',
        success:function(res){
          console.log(res)
          if(res.data.result == 1){
            wx.setStorage({
              key: 'cook',
              data: {
                cook:res.data.cookie,
                id: res.data.staff.id
              },
              success: function(res){
              }
            })
            wx.redirectTo({
              url: '../index/index?cook=' + res.data.cookie
            })  
          }else{
              that.setData({
                msg:"请输入正确的用户名密码",
                display:"flex"
              })
          }
                        
        }
    })
    
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  enterXy:function(){
     wx.navigateTo({url: "../logs/logs"});
  }
})