Page({
  data: {
    defaultDate: "",
    date: "",
    medFullName: "",
    buyCount: 0,
    medicaId: "",
    userId: "",
    medicineUnit: "",
    arrayNum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    units: ['片', '瓶', '盒', '袋', '支', '粒', '丸', '克'],
    index: 0,
    uIndex: 0
  },
  onLoad: function (e) {
    var that = this;
    that.data.medicaId = e.medicaId;
    that.data.medicineUnit = e.medicineUnit;
    //药品单位medicineUnit 暂时取消使用
    function getNowTime() {
      var nowTime = new Date();
      var nYear = nowTime.getFullYear().toString();
      var nMonth = (nowTime.getMonth() + 1) > 10 ? (nowTime.getMonth() + 1) : "0" + (nowTime.getMonth() + 1).toString();
      var nDate = nowTime.getDate() > 10 ? nowTime.getDate() : "0" + nowTime.getDate().toString();
      var fullTime = nYear + "-" + nMonth + "-" + nDate;
      return fullTime;
    }
    that.setData({
      defaultDate: getNowTime(),
      medFullName: e.normalName + "(" + e.medicalName + ")" + e.packageAmount + e.medicineUnit,
      // uIndex:_uIndex
    })
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.data.userId = res.data.id;
      }
    })
  },
  enterUpload: function () {
    wx.navigateTo({ url: "../uploadpres/uploadpres" });
  },
  buyCount: function (e) {
    var id = e.currentTarget.id;
    var count = this.data.buyCount;
    if (id == "add") {
      count = (count > 0) ? count + 1 : 1
    } else {
      count = (count > 0) ? count - 1 : 0
    }
    this.setData({ buyCount: count });
  },
  enterSearch: function () {
    wx.navigateTo({ url: "../search/search" });
  },
  alertNum: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  alertunits: function (e) {
    this.setData({
      uIndex: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      defaultDate: e.detail.value
    })
  },
  saveData: function () {
    var that = this;
    var _buyTime = that.data.defaultDate;
    var _medicaId = that.data.medicaId;
    var _userId = that.data.userId;
    var _medicineUnit = that.data.medicineUnit;
    var _buyCount = that.data.buyCount;
    var _cook;
    var _pharmacyId;
    wx.getStorage({
      key: 'cook',
      success: function (res) {
        _cook = res.data.cook;
        _pharmacyId = res.data.id;
        console.log(_cook);
        console.log(_pharmacyId);
        wx.request({
          url: 'https://gl.ganjuke.com/cmsManage/wxUtil/medicine_add.htm',
          data: {
            pharmacyId: _pharmacyId,//药店ID
            buyMedicineId: _medicaId,//药品ID
            buyPackageAmount: _buyCount,//购买数量
            userId: _userId,//用户ID
            buyTime: _buyTime, //购买时间
            medicineUnit: _medicineUnit //规格
          },
          method: "POST",
          header: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + res.data.cook },
          success: function (res) {
            console.log(res.data)
          }
        })
      }
    })

  }
})