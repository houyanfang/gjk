$(document).ready(function(){
	var userRearname = "";
	var cardNo = "";
	var bankAddrno = "";
	var bankName = "";
	var bankBranchName = "";
	var flag = true; //true : add card , false: modify card
	var params = getUrlParams();
	var _cardId = params.cardId;
	if(_cardId)
	{
		
		flag = false;
		//get card info by card id 
		$('.me-loading').show();
		var _url = "userBankcard/select";
		var _data = {};
		var _success = function(obj){
			if(obj.success == true){
				function modifyItem(item){
					return item.id===Number(_cardId);
				}
				var modifyData = obj.data.find(modifyItem);
				if(modifyData)
				{
	//				console.log(modifyData);
					//console.log(modifyData.userRealName);
					userRearname = modifyData.userRealName;
					$('.OtherInformation_ri').val(modifyData.userRealName);
					cardNo = modifyData.cardNo;
					$('.cardNo').val(modifyData.cardNo);
					bankName =modifyData.bankName;
					$('#bankName').val(modifyData.bankName);
					bankAddrno = modifyData.bankAddrNo;
					$('#bankAddr').val(modifyData.bankAddrNo);
					bankBranchName = modifyData.bankBranchName;
					$('#bankBranchName').val(modifyData.bankBranchName);
				}
			}
			
		};
		var _error = function(obj){
			console.log(obj.message);
		};
		var _complete = function(){
			$('.me-loading').hide();
			initPicker();
		}
		$.gjk.ajax.postAjax(_url,_data,_success,_error,_complete,"POST","cardInformation");
	}
	else
	{
		initPicker();
	}
	
	//填写持卡人
	$("#userRearname").click(function(){
		$(".Name_alert").css("display","block");
		$(".Name_alert input").focus();
	});
	$(".Name_alertMain_botLe").click(function(){
		$(".Name_alert").css("display","none");
	});
	$(".Name_alertMain_botRi").click(function(){
	//	$(".Name_alert input").val(userRearname);
		var rearname_inp=$(".Name_alert input").val();
		$(".OtherInformation_ri").val(rearname_inp);
		$(".Name_alert").css("display","none");
		userRearname = rearname_inp;
	});
//	console.log(userRearname);
	//卡号
	$("#cardNo").click(function(){
		$(".Email_alert").css("display","block");
		$(".Email_alert input").focus();
	});
	$(".Email_alertMain_botLe").click(function(){
		$(".Email_alert").css("display","none");
	});
	$(".Email_alertMain_botRi").click(function(){
//		$(".Email_alert input").val(cardNo);
		var cardNo_inp=$(".Email_alert input").val();
		$("#bankNo").val(cardNo_inp);
		$(".Email_alert").css("display","none");
		cardNo = cardNo_inp;
	});
	
	function initPicker(){
		//设置开户行名称
	    $("#bankName").picker({
		  toolbarTemplate: '<header class="bar bar-nav">\
		  <button class="button button-link pull-left close-picker button-no recovery-picker-bankname">取消</button>\
		  <button class="button button-link pull-right close-picker button-yes">确定</button>\
		  <h1 class="title"></h1>\
		  </header>',
		  cols: [
		    {
		      textAlign: 'center',
		      values: ['中国银行', '工商银行', '招商银行', '建设银行', '华夏银行', '交通银行', '农业银行']
		    }
		  ],
		  recovery: '.recovery-picker-bankname'
		});		
		//开户地区
		$("#bankAddr").cityPicker({
			toolbarTemplate: '<header class="bar bar-nav">\
			<button class="button button-link pull-left button-no close-picker recovery-picker-bankaddr">取消</button>\
			<button class="button button-link pull-right close-picker button-yes">确定</button>\
			</header>',
			recovery: '.recovery-picker-bankaddr'
		});
	}
	//开户行名称
	$("#bankAddress").click(function(){
		$(".bank_alert").css("display","block");
		$(".bank_alert input").focus();
	});
	$(".bank_alertMain_botLe").click(function(){
		$(".bank_alert").css("display","none");
	});
	$(".bank_alertMain_botRi").click(function(){
//		$(".bank_alert input").val(bankBranchName);
		var bankAddr_inp=$(".bank_alert input").val();
		$("#bankBranchName").val(bankAddr_inp);
		$(".bank_alert").css("display","none");
		bankBranchName = bankAddr_inp;
	});
	
	//随机产生bankNo
	function randomWord(randomFlag, min, max){
	    var str = "",
	        range = min,
	        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	 
	    // 随机产生
	    if(randomFlag){
	        range = Math.round(Math.random() * (max-min)) + min;
	    }
	    for(var i=0; i<range; i++){
	        pos = Math.round(Math.random() * (arr.length-1));
	        str += arr[pos];
	    }
	    return str;
	}
	
	/*通过cardId找到要修改的那条数据data*/
	$("#enter-btn").on('click',function(){
		console.log("1234");
		var _bankNo = randomWord(false,6);
		console.log(_bankNo);
		var _url = flag ? "userBankcard/insertNew" : "userBankcard/update";
		var _cardId = params.cardId || "";
		var bankName =$("#bankName").val(); //$("#bankName").data("picker").value?$("#bankName").data("picker").value.join(' '):'';
		var bankAddrNo =$("#bankAddr").val(); //$("#bankAddr").data("picker").value?$("#bankAddr").data("picker").value.join(' '):'';
		if(!bankName){
			var $msg = $('#msg');
	        var $reminder = $('#reminder');
	        $reminder.show();
	        $msg.text("请选择开户银行！");
	
	        setTimeout(function () {
	             $reminder.hide();
	         }, 2000);
	        return;
		}
		var _data = {		
		    "id": _cardId,
		    "userRealName": userRearname,
		    "bankNo":_bankNo,
		    "bankName":bankName,
		    "isDefault":"1",
		    "bankAddrNo": bankAddrNo,
		    "cardNo": cardNo,
		    "bankBranchName":bankBranchName
		};
		if(!_data.userRealName){
			var $msg = $('#msg');
	        var $reminder = $('#reminder');
	        $reminder.show();
	        $msg.text("持卡人不能为空！");
	
	        setTimeout(function () {
	             $reminder.hide();
	         }, 2000);
	        return;
		}
		if(!_data.cardNo){
			var $msg = $('#msg');
	        var $reminder = $('#reminder');
	        $reminder.show();
	        $msg.text("卡号不能为空！");
	
	        setTimeout(function () {
	             $reminder.hide();
	         }, 2000);
			return;
			
		}
		if(!_data.bankName){
			var $msg = $('#msg');
	        var $reminder = $('#reminder');
	        $reminder.show();
	        $msg.text("请选择开户银行！");
	
	        setTimeout(function () {
	             $reminder.hide();
	         }, 2000);
			return;
		}
		if(!_data.bankAddrNo){
			var $msg = $('#msg');
	        var $reminder = $('#reminder');
	        $reminder.show();
	        $msg.text("请选择开户银行所在地区！");
	
	        setTimeout(function () {
	             $reminder.hide();
	         }, 2000);
			return;
		}
		if(!_data.bankBranchName){
			var $msg = $('#msg');
	        var $reminder = $('#reminder');
	        $reminder.show();
	        $msg.text("开户行名称不能为空！");
	
	        setTimeout(function () {
	             $reminder.hide();
	         }, 2000);
			return;
		}
		var _success = function(obj){
			console.log(obj);
			if(obj.success == true){
				var enterUrl = $.gjk.path_url;
				window.location.href = enterUrl + 'self/addcard.html?' +'idCardStatus=1';//	idCardStatus=1身份证审核中  -- idCardStatus=2进入到银行卡列表(未审核身份证不能进入列表)
			}
            
		};
		var _error = function(obj){
			console.log(obj.message);
		};
		var _complete = function(){
			$('.me-loading').hide();
		}
		$.gjk.ajax.postAjax(_url,_data,_success,_error,_complete,"POST","cardInformation");
	});
	
	/*通过url传值获取需要修改的cardId*/
	function getUrlParams() {
	    var params = {};
	    var url = window.location.href;
	
	    var p = url.split("#");
	    if (p.length == 2)
	        p = p[1];
	    else
	        p = url;
	
	    p = p.split("?");
	    if (p.length < 2) {
	        params.anchor = p[0];
	        return params;
	    }
	
	    params.anchor = p[0];
	    p = p[1].split("&");
	
	    for (var i = 0; i < p.length; i++) {
	        var kv = p[i].split("=");
	        params[kv[0]] = kv[1];
	    }
	    return params;
	}
})