//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    hasData: true,
    array: {},
    userId: '',
    userInfo: {},
    bgImg: "../../images/1.png",
    cook: null
  },
  //事件处理函数
  goToDetails: function (event) {
    var perId = event.currentTarget.dataset.personid;
    var perState = event.currentTarget.dataset.state;
    var perName = event.currentTarget.dataset.name;
    var perMobile = event.currentTarget.dataset.phoneNum;
    var _url;
    if (perState == 1) {
      _url = '../examineNew/examineNew?id=' + perId + "&userToken=" + this.data.userId + "&perName=" + perName + "&perMobile=" + perMobile
    } else {
      _url = '../examine/examine?id=' + perId + "&userToken=" + this.data.userId + "&perName=" + perName + "&perMobile=" + perMobile
    }
    wx.navigateTo({
      url: _url + perId,
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  //搜索
  searchPerson: function (e) {
    var that = this;
    var val = e.detail.value;
    var reg = new RegExp(val);

    //获取本地缓存数据
    wx.getStorage({
      key: 'userDataList',
      success: function (res) {
        if (val == "") {
          that.setData({
            array: res.data
          })
        } else {
          that.setData({
            array: searchList(res)
          });
        }
      }
    })
    function searchList(obj) {
      var personArr = [];
      var arr = { newman: [], A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K: [], L: [], M: [], N: [], O: [], P: [], Q: [], R: [], S: [], T: [], U: [], V: [], W: [], X: [], Y: [], Z: [], };
      //search
      for (var item in obj.data) {
        for (var j = 0; j < obj.data[item].length; j++) {
          if (reg.test(obj.data[item][j].userNickName)) {
            personArr.push(obj.data[item][j]);
          }
          if (reg.test(obj.data[item][j].mobile)) {
            personArr.push(obj.data[item][j]);
          }
        }
      }
      for (let i = 0; i < personArr.length; i++) {
        if (personArr[i].isNew == 0) {
          arr["newman"].push(personArr[i])
          continue;
        }
        arr[personArr[i].firstCharacter.toUpperCase()].push(personArr[i])
      }

      return arr;
    }
  },
  onLoad: function (e) {
    console.log(e.cook)
    var that = this
    this.setData({
      cook: e.cook
    })

    //请求页面数据
    wx.request({
      url: 'https://gl.ganjuke.com/cmsManage/wxUtil/staff_list.htm',
      header: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + that.data.cook },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        var flag;
        if (res.data.list.length == 0) {
          flag = true;
        } else {
          flag = false
        }
        //对数据进行分组
        var arr = { newman: [], A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K: [], L: [], M: [], N: [], O: [], P: [], Q: [], R: [], S: [], T: [], U: [], V: [], W: [], X: [], Y: [], Z: [], };
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].isNew == 1) {
            arr["newman"].push(res.data.list[i])
            continue;
          } else {
            arr[res.data.list[i].firstCharacter.toUpperCase()].push(res.data.list[i])
            continue;
          }
        }
        that.setData({
          hasData: flag,
          array: arr
        })
        //本地缓存数据
        wx.setStorage({
          key: 'userDataList',
          data: that.data.array,
          success: function (res) {
            // success

          }
        })
      }
    })
  }
})