//获取应用实例
var app = getApp()
Page({
  data: {
    list: [
      { alphabet: 'A', datas: [] },
      { alphabet: 'B', datas: [] },
      { alphabet: 'C', datas: [] },
      { alphabet: 'D', datas: [] },
      { alphabet: 'E', datas: [] },
      { alphabet: 'F', datas: [] },
      { alphabet: 'G', datas: [] },
      { alphabet: 'H', datas: [] },
      { alphabet: 'I', datas: [] },
      { alphabet: 'J', datas: [] },
      { alphabet: 'K', datas: [] },
      { alphabet: 'L', datas: [] },
      { alphabet: 'M', datas: [] },
      { alphabet: 'N', datas: [] },
      { alphabet: 'O', datas: [] },
      { alphabet: 'P', datas: [] },
      { alphabet: 'Q', datas: [] },
      { alphabet: 'R', datas: [] },
      { alphabet: 'S', datas: [] },
      { alphabet: 'T', datas: [] },
      { alphabet: 'U', datas: [] },
      { alphabet: 'V', datas: [] },
      { alphabet: 'W', datas: [] },
      { alphabet: 'X', datas: [] },
      { alphabet: 'Y', datas: [] },
      { alphabet: 'Z', datas: [] },
    ],
    alpha: '',
    windowHeight: '',
    showLoadingImg: true
  },
  onLoad(options) {
    var that = this;
    try {
      var res = wx.getSystemInfoSync()
      this.pixelRatio = res.pixelRatio;
      // this.apHeight = 32 / this.pixelRatio;
      // this.offsetTop = 160 / this.pixelRatio;
      this.apHeight = 16;
      this.offsetTop = 80;
      this.setData({ windowHeight: res.windowHeight + 'px' })
    } catch (e) {

    }
    var _cookie;
    wx.getStorage({
      key: 'cook',
      success: function(res){
        // success
        console.log(res)
        _cookie = res.data.cook
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
    wx.request({
      url: 'https://gl.ganjuke.com/mskl-api/api/msklmedicine/findAllMedicine',
      data: {},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + _cookie },
      // header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        var dataList = res.data;
        if (res.data.code == 200) {
          var listArr = [
            { alphabet: 'A', datas: [] },
            { alphabet: 'B', datas: [] },
            { alphabet: 'C', datas: [] },
            { alphabet: 'D', datas: [] },
            { alphabet: 'E', datas: [] },
            { alphabet: 'F', datas: [] },
            { alphabet: 'G', datas: [] },
            { alphabet: 'H', datas: [] },
            { alphabet: 'I', datas: [] },
            { alphabet: 'J', datas: [] },
            { alphabet: 'K', datas: [] },
            { alphabet: 'L', datas: [] },
            { alphabet: 'M', datas: [] },
            { alphabet: 'N', datas: [] },
            { alphabet: 'O', datas: [] },
            { alphabet: 'P', datas: [] },
            { alphabet: 'Q', datas: [] },
            { alphabet: 'R', datas: [] },
            { alphabet: 'S', datas: [] },
            { alphabet: 'T', datas: [] },
            { alphabet: 'U', datas: [] },
            { alphabet: 'V', datas: [] },
            { alphabet: 'W', datas: [] },
            { alphabet: 'X', datas: [] },
            { alphabet: 'Y', datas: [] },
            { alphabet: 'Z', datas: [] },
          ];
          for (let i = 0; i < res.data.data.length; i++) {
            for (let j = 0; j < listArr.length; j++) {
              if (listArr[j].alphabet == res.data.data[i].pinyin.toUpperCase()) {
                listArr[j].datas.push(res.data.data[i]);
                continue;
              }
            }
          };
          that.setData({
            list: listArr,
            showLoadingImg: false
          })
          wx.setStorage({
            key: 'medicineList',
            data: dataList,
            success: function (res) {
              // success
              console.log("缓存成功")
            }
          })
        }
      }
    })
  },
  searchList: function (e) {
    var that = this;
    var val = e.detail.value;
    var reg = new RegExp(val);

    //获取本地缓存数据
    wx.getStorage({
      key: 'medicineList',
      success: function (res) {
        console.log(res.data)
        if (val == "") {
          that.setData({
            list: res.data
          })
        } else {
          that.setData({
            list: searchList(res.data)
          });
        }
      }
    })
    //搜索
    function searchList(obj) {
      var listArrSearch = [
        { alphabet: 'A', datas: [] },
        { alphabet: 'B', datas: [] },
        { alphabet: 'C', datas: [] },
        { alphabet: 'D', datas: [] },
        { alphabet: 'E', datas: [] },
        { alphabet: 'F', datas: [] },
        { alphabet: 'G', datas: [] },
        { alphabet: 'H', datas: [] },
        { alphabet: 'I', datas: [] },
        { alphabet: 'J', datas: [] },
        { alphabet: 'K', datas: [] },
        { alphabet: 'L', datas: [] },
        { alphabet: 'M', datas: [] },
        { alphabet: 'N', datas: [] },
        { alphabet: 'O', datas: [] },
        { alphabet: 'P', datas: [] },
        { alphabet: 'Q', datas: [] },
        { alphabet: 'R', datas: [] },
        { alphabet: 'S', datas: [] },
        { alphabet: 'T', datas: [] },
        { alphabet: 'U', datas: [] },
        { alphabet: 'V', datas: [] },
        { alphabet: 'W', datas: [] },
        { alphabet: 'X', datas: [] },
        { alphabet: 'Y', datas: [] },
        { alphabet: 'Z', datas: [] },
      ];
      var searchArr = [];
      //匹配字符串
      for (let i = 0; i < obj.data.length; i++) {
        for (let k = 0; k < listArrSearch.length; k++) {
          if (reg.test(obj.data[i].medicalName)) {
            searchArr.push(obj.data[i]);
          }
          if (reg.test(obj.data[i].manufacturer)) {
            searchArr.push(obj.data[i]);
          }
          if (reg.test(obj.data[i].normalName)) {
            searchArr.push(obj.data[i]);
          }
          continue;
        }
      };
      //生成数据
      for (let i = 0; i < searchArr.length; i++) {
        for (let j = 0; j < listArrSearch.length; j++) {
          if (listArrSearch[j].alphabet == searchArr[i].pinyin.toUpperCase()) {
            listArrSearch[j].datas.push(searchArr[i]);
            continue;
          }
        }
      };
      return listArrSearch;
    }
  },
  handlerAlphaTap(e) {
    let {ap} = e.target.dataset;
    this.setData({ alpha: ap });
  },
  handlerMove(e) {
    let {list} = this.data;
    let moveY = e.touches[0].clientY;
    let rY = moveY - this.offsetTop;
    if (rY >= 0) {
      let index = Math.ceil((rY - this.apHeight) / this.apHeight);
      if (0 <= index < list.length) {
        let nonwAp = list[index];
        nonwAp && this.setData({ alpha: nonwAp.alphabet });
      }
    }
  }
})