// pages/examine/plan/plan.js
Page({
  data: {
    plan: {},
    finishPlan: {},
    userId: "",
    showAndHide: "hideInner",
    classes: "plan-box",
    openId: "",
    hasNoPlan: true
  },
  onLoad: function (e) {
    var that = this;
    console.log(e)
    // 页面初始化 options为页面跳转所带来的参数
    wx.getStorage({
      key: 'cook',
      success: function (res) {
        // success
        console.log(res);

        wx.request({
          url: 'https://gl.ganjuke.com/mskl-api/api/dailyRecord/findAppletAllUserPlanByUserId/' + createRandom() + "|" + e.userId,
          data: {},
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          header: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + res.data.cook.cook },
          success: function (res) {
            // success
            console.log(res);
            if (res.data.success == true) {
              if (res.data.data) {
                that.setData({
                  plan: planTypeList(res.data.data),hasNoPlan:false
                })
              }

            }
          }
        })
        //数据分类
        function planTypeList(obj) {
          var planTypeListArr = {
            sport: [], treat: [], smok: [], rest: [], abstinence: [], diet: [], visit: []
          };
          for (let i = 0; i < obj.length; i++) {
            planTypeListArr[obj[i].planType].push(obj[i])
          }
          for (let item in planTypeListArr) {
            for (let i = 0; i < planTypeListArr[item].length; i++) {
              planTypeListArr[item][i].planData.startDate = format(planTypeListArr[item][i].planData.startDate, 'yyyy-MM-dd');
              planTypeListArr[item][i].planData.endDate = format(planTypeListArr[item][i].planData.endDate, 'yyyy-MM-dd');
              planTypeListArr[item][i].planData.endDate = format(planTypeListArr[item][i].planData.endDate, 'yyyy-MM-dd');
            }
          }
          return planTypeListArr;
        };
        //时间戳转换函数
        function format(time, format) {
          var t = new Date(time);
          var tf = function (i) {
            return (i < 10 ? '0' : '') + i
          };
          return format.replace(/yyyy|MM|dd/g, function (a) {
            switch (a) {
              case 'yyyy':
                return tf(t.getFullYear());
                break;
              case 'MM':
                return tf(t.getMonth() + 1);
                break;
              case 'dd':
                return tf(t.getDate());
                break;
            }
          })
        }
        function createRandom() {
          var letterArr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
          var random = "";
          for (let i = 0; i < 16; i++) {
            var num = parseInt(Math.random() * 26);
            random += letterArr[num];
          }
          return random;
        }
      }
    })
  },
  showAndHideInner: function (e) {
    console.log(e.currentTarget.dataset.id)

    this.setData({
      openId: e.currentTarget.dataset.id
    })

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})