var myData;
var bankcardStatus = [];//所有银行卡status值
var myBankData; //银行卡数据信息
var yesBankData //已通过审核的银行卡数据
var idCardStatus; //身份证审核状态
var enterUrl = $.gjk.path_url;
function getMyAccountInfor(){
	var _url = "account";
	var _data = {};
	var _success = function(obj){
		if(obj.success == true){
			console.log(obj);
			myData = obj.data;
			//console.log(myData);
			var money = obj.data.avalaibleAmount;
			//var integs = obj.data.userIntegrate;
			$('.money-num').text(money);
//			$('.inger-num').text(integs);
		}else{
			$('.money-num').text("0");
//			$('.inger-num').text("0");
		}
	};
	var _complete = function(){
		$('.me-loading').hide();
	};
	var _error = function(){
	};
	console.log(_url);
	console.log(_data);
	$.gjk.ajax.postAjax(_url,_data,_success,_error,_complete,"POST","myaccount");
}
function getBankData(){
	var _url = "userBankcard/select";
	var _data = {};
	var _success = function(obj){
		console.log(obj);
		if(obj.success == true){
 		   myBankData = obj.data;
		   yesBankData = obj.data.filter(item => item.status===2);
		   myBankData.forEach(function(ele){
		   	  bankcardStatus.push(ele.status);
		   });
		   console.log(bankcardStatus);
		}
	};
	var _complete = function(){
		$('.me-loading').hide();
	};
	var _error = function(){
	};
	$.gjk.ajax.postAjax(_url,_data,_success,_error,_complete,"POST","myaccount");
}
$(document).ready(function(){
    getMyAccountInfor();
    getBankData();
    $('.icon-cards').on('click',enterBank); //银行卡
    $('.icon-moneys').on('click',accountLeft);//余额提现
    $('.icon-pwd').on('click',enterMoneyPwd);//提现密码
    $('.icon-record').on('click',enterMoneyRecord);//提现记录
   
});
function enterBank(){
	if(!!myData && $.trim(myData.cardNo)!=""){
		var idCardStatus = myData.idCardStatus;
		window.location.href = enterUrl + 'self/addcard.html?' + 'idCardStatus=' + idCardStatus;
	}else if(!!myData && $.trim(myData.cardNo)==""){
		window.location.href = enterUrl + 'self/cardinformation.html';
	}else{
		window.location.href = enterUrl + 'self/addcard.html';
	}
}
function accountLeft(){
	if( !!myData && !!myBankData){
		var hasTradePwd = myData.hasTradePwd;
		var avalaibleAmount = myData.avalaibleAmount; 
		if(myBankData.length===0){
			 var $msg = $('#msg');
	         var $reminder = $('#reminder');
	         $reminder.show();
	         $msg.text("请绑定您的银行卡！");
	
	         setTimeout(function () {
	             $reminder.hide();
	         }, 2000);
	         return;
		}else{
			for(var val of bankcardStatus){
				if(val==1){
					var $msg = $('#msg');
			        var $reminder = $('#reminder');
			        $reminder.show();
			        $msg.text("银行卡审核中，无法提现！");
			
			        setTimeout(function () {
			             $reminder.hide();
			        }, 2000);
			        return;
				}
				if(val==3){
					var $msg = $('#msg');
			        var $reminder = $('#reminder');
			        $reminder.show();
			        $msg.text("银行卡审核失败，请重新绑定！");
			
			        setTimeout(function () {
			             $reminder.hide();
			        }, 2000);
			        return;
				}
			}
		}
		if(hasTradePwd == 'false'){
			 var $msg = $('#msg');
	         var $reminder = $('#reminder');
	         $reminder.show();
	         $msg.text("请设置提现密码！");
	
	         setTimeout(function () {
	             $reminder.hide();
	         }, 2000);
	         return;
		}
		
		
		if(!!yesBankData){
			window.location.href = enterUrl + 'self/accountleft.html?' + 'avalaibleAmount=' +avalaibleAmount;
		}
	}else{
		return;
	}
}
function enterMoneyPwd(){
	if(!!myData){
		var hasTradePwd = myData.hasTradePwd;
		window.location.href = enterUrl + (myData.hasTradePwd?"self/modifypwd.html":"self/setpassword.html");
	}else{
		var $msg = $('#msg');
	    var $reminder = $('#reminder');
	    $reminder.show();
	    $msg.text("请设置提现密码！");
	
	    setTimeout(function () {
	         $reminder.hide();
	    }, 2000);
		return;
	}
}
function enterMoneyRecord(){
	if(!!myData && !!myBankData){
		var hasTradePwd = myData.hasTradePwd;
		if(myBankData.length!=0){
			for(var val of bankcardStatus){
				if(val==1){
					var $msg = $('#msg');
			        var $reminder = $('#reminder');
			        $reminder.show();
			        $msg.text("银行卡审核中，无法提现！");
			
			        setTimeout(function () {
			             $reminder.hide();
			        }, 2000);
			        return;
				}
				if(val==3){
					var $msg = $('#msg');
			        var $reminder = $('#reminder');
			        $reminder.show();
			        $msg.text("银行卡审核失败，请重新绑定！");
			
			        setTimeout(function () {
			             $reminder.hide();
			        }, 2000);
			        return;
				}
			}
		}else{
			var $msg = $('#msg');
	        var $reminder = $('#reminder');
	        $reminder.show();
	        $msg.text("请绑定您的银行卡！");
	
	        setTimeout(function () {
	            $reminder.hide();
	        }, 2000);
	        return;
		}
		
		if(hasTradePwd == 'false'){
			 var $msg = $('#msg');
	         var $reminder = $('#reminder');
	         $reminder.show();
	         $msg.text("请设置提现密码!");
	
	         setTimeout(function () {
	             $reminder.hide();
	         }, 2000);
			return;
		}
		window.location.href = enterUrl +'self/moneyrecord.html';
	}else{
		return;
	}
	
}
