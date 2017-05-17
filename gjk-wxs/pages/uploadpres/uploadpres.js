Page({
    imgSrc:{},
    uploadBtn:function() {
    var that =this;
    var _cook;
    wx.chooseImage( {
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
       console.log(res)
       that.setData({
         img:res.tempFilePaths[0]
       })
        wx.getStorage({
          key: 'cook',
          success: function(res){
            // success
            console.log(res);
            _cook = res.data.cook;
            console.log(_cook);
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        })
        wx.uploadFile( {
          url: 'https://gl.ganjuke.com/cmsManage/uploadfile',
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + _cook},
          formData: {
          //  'user': 'test',
            "file" : "file_img",
	    			"basePath" : "file",
	    			"outPath" : "/upload/image/case/"
          },
          success: function(res) {
            console.log(res)
          }
        })
      }
    })
  },
  previewImg:function(){
    
  }
})