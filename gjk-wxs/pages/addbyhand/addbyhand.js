Page({
    data:{
      date: '2016-09-01',
      medicalName:"",//药品商品名
      normalName:"",//药品通用名
      manufacturer:"", //生产厂商
      userId:"",//用户ID
      arrayNum:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      units:['粒','片','袋','支','丸','克'],
      index:0,
      uIndex:0,
      numIndex:0
    },
     onLoad:function(e){
       var that = this;
       wx.getStorage({
        key: 'userId',
        success: function(res){
          // success
          console.log(res);
          that.data.userId = res.data.id;
        },
        fail: function(res) {
          // fail
        },
        complete: function(res) {
          // complete
        }
      })
     },
    enterUpload:function(){
       wx.navigateTo({url: "../uploadpres/uploadpres"});
    }, 
    alertNum:function(e){
      this.setData({
         numIndex: e.detail.value
      })
    },
    alertMed:function(e){
      this.setData({
         index: e.detail.value
      })
    },
    alertunits:function(e){
      this.setData({
      uIndex: e.detail.value
    })
    },
    saveData:function(){
      var that = this;
      var _medicineUnit,_dayACount,_dayTimes,_uIndex,_index,_numIndex,_medicalName,_normalName,_manufacturer,_userId;
      _uIndex = that.data.uIndex;
      _index = that.data.index;
      _numIndex = that.data.numIndex;
      _userId = that.data.userId;
       console.log(_index);
       console.log(_uIndex);
       console.log(_numIndex);
       _medicalName = that.data.medicalName;
       _normalName = that.data.normalName;
       _manufacturer = that.data.manufacturer ;
       console.log(_medicalName + _normalName + _manufacturer);
       _medicineUnit = that.data.units[_uIndex];
       _dayACount = that.data.arrayNum[_index];
       _dayTimes = that.data.arrayNum[_numIndex];
       wx.request({
          url: 'https://gl.ganjuke.com/cmsManage/wxUtil/medicine_supply_add.htm', 
          data: {
            medicalName:_medicalName,//药品商品名
            normalName:_normalName,//药品通用名
            manufacturer:_manufacturer, //生产厂商           
            medicineUnit:_medicineUnit, //规格
            dayAcount:_dayACount,//每日服用数量
            dayTimes:_dayTimes,//每日服用次数
            userId:_userId,//用户ID
          },
          method:"POST",
          header: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + _cook},
          success: function(res) {
            console.log(res.data)
          }
       })
    }
})