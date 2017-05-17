$(function() {
	//使用JS-SDK的页面必须先注入配置信息
	var url = window.location.href;
	$.ajax({
        type: "get",
        url: "http://122.194.216.11/msklcms/wx/wxshare.xhtml", // 这个就是不同于当前域的一个URL地址，这里单纯演示，所以同域
        dataType: "jsonp",
        jsonp: "jsoncallback",  // 指定回调函数，这里名字可以为其他任意你喜欢的，比如callback，不过必须与下一行的GET参数一致
        data: "url="+encodeURIComponent(url)+"&jsoncallback=?", // jsonpcallback与上面的jsonp值一致
        success: function (json) {
        	var param = json.result;
    		wx.config({
    			debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    			appId : param.appId, // 必填，公众号的唯一标识
    			timestamp : param.timestamp, // 必填，生成签名的时间戳
    			nonceStr : param.nonceStr, // 必填，生成签名的随机串
    			signature : param.signature,// 必填，签名，见附录1
    			jsApiList : [ 'onMenuShareTimeline', 'onMenuShareAppMessage',
    					'onMenuShareQQ', 'onMenuShareWeibo','scanQRCode' ]
    		// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    		});
        }
    });
});