var myData;
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
    $('.icon-cards').on('click',enterBank);
    $('.icon-moneys').on('click',accountLeft);
    $('.icon-pwd').on('click',enterMoneyPwd);
    $('.icon-record').on('click',enterMoneyRecord);
   
});
function enterBank(){
	if(!!myData){
		var idCardStatus = myData.idCardStatus;
		window.location.href = enterUrl + 'self/addcard.html?' + 'idCardStatus=' + idCardStatus;
	}else{
		window.location.href = enterUrl + 'self/addcard.html';
	}
}
function accountLeft(){
	if( !!myData && !!myBankData){
		var bankcardStatus = myBankData.status;
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
		}
		if(hasTradePwd == 'false'){
			 var $msg = $('#msg');
	         var $reminder = $('#reminder');
	         $reminder.show();
	         $msg.text("请设置提现密码！");
	
	         setTimeout(function () {
	             $reminder.hide();
	         }, 2000);
		}
		
		window.location.href = enterUrl + 'self/accountleft.html?' + 'avalaibleAmount=' +avalaibleAmount;
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
		var bankcardStatus = myBankData.status;
		var hasTradePwd = myData.hasTradePwd;
		if(bankcardStatus == '1'){
			 var $msg = $('#msg');
	         var $reminder = $('#reminder');
	         $reminder.show();
	         $msg.text("银行卡审核中！");
	
	         setTimeout(function () {
	             $reminder.hide();
	         }, 2000);
			return;
		}
		if(bankcardStatus == '3'){
			 var $msg = $('#msg');
	         var $reminder = $('#reminder');
	         $reminder.show();
	         $msg.text("审核失败，请重新绑定银行卡！");
	
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
