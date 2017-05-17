$(document).ready(function(){
	var params = getUrlParams();
	var avalaibleAmount = params.avalaibleAmount; 
	$('.account-num').text(avalaibleAmount);
	setCardId();
	$('.end-btn').on('click',getMoney);
	$('.money-input').on('click',function(){
		$(".money").css("display","block");
		$(".money input").focus();
		$(".money input").val('');
		$('.alter-title').text("填写提取金额");
		$(".money-no").click(function(){
			$(".Email_alert").css("display","none");
		});
		
		$(".money-yes").click(function(){
			var moneyNum =$(".money input").val();
			if(Number(moneyNum) <= 0){
				$(".text-red").text('请输入有效的数值!');
				return;
			}
			if(Number(moneyNum) > Number(avalaibleAmount)){
				$(".text-red").text('您好，余额不足!');
				return;
			}
			$('.money-input').val(moneyNum);
			$(".Email_alert").css("display","none");
		});
	});
	$('.pwd-input').on('click',function(){
		$(".password").css("display","block");
		$(".password input").focus();
		$(".password input").val('');
		$('.alter-title').text("填写取现密码");
		$(".pwd-no").click(function(){
			$(".Email_alert").css("display","none");
		});
		$(".pwd-yes").click(function(){
			var pwd = $(".password input").val();
			$('.pwd-input').val(pwd);
			$(".Email_alert").css("display","none");
		});
	});
});
/*通过url传值获取需要修改的avalaibleAmount*/
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
	
	/*绑定银行卡*/
	
	var cardInfor = [];
	var cardIds = [];
	var ids = [];
	var cardInput = "";
	var index;
	function setCardId(){
		var _url = 'userBankcard/select';
		var _data = {};
		var _success = function(obj){
			if(obj.success == true){
				if(!!obj.data.length){
					cardInfor = obj.data.filter(item => item.status===2);
					//status: 1审核中 2审核通过 3 未通过审核
					for(item of cardInfor){
						cardIds.push(item.cardNo);
						ids.push(item.id);
					}
					
					$('#cardId').val(cardIds[0]);
					cardInput = $('#cardId').val()
					index = cardIds.indexOf(cardInput);
				}
			}
			
		};
		var _error = function(obj){
			alert(obj.message);
		};
		var _complete = function(obj){
			$('.me-loading').hide();
		};
		$.gjk.ajax.postAjax(_url,_data,_success,_error,_complete,"POST","accountleft");
		
		$("#cardId").picker({
		  toolbarTemplate: '<header class="bar bar-nav">\
		  <button class="button button-link pull-left button-no recovery-picker-card">取消</button>\
		  <button class="button button-link pull-right close-picker button-yes">确定</button>\
		  <h1 class="title">标题</h1>\
		  </header>',
		  cols: [
		    {
		      textAlign: 'center',
		      values:cardIds
		    }
		  ],
		  recovery: '.recovery-picker-card'
		});
	}
	/*余额提现*/
	var enterUrl = $.gjk.path_url;
	function getMoney(){
		var _url = 'userCashout/applyCash';
		var amount = $('.money-input').val();
		var carId = $('#cardId').val();
		var cardNo = cardInfor[index].bankName + '尾号' +cardInfor[index].cardNo;
		var id = ids[index];
		var pwd = $('.pwd-input').val();
		var _data = {"amount":amount,"cardNo":cardNo,"tradePassword":pwd};
		var _success = function(obj){
			if(obj.success == true){
				var $msg = $('#msg');
			    var $reminder = $('#reminder');
			    $reminder.show();
			    $msg.text("提现成功！");
			
			    setTimeout(function () {
			        $reminder.hide();
			        window.location.href = enterUrl +'self/myaccount.html'; 
			    }, 2000);
				
			}else{
				$('#longModel').css('display','block');
				$('.btnRes').on('click',function(){
					window.location.href = enterUrl + 'self/myaccount.html';
				});
				$('.btnOk').on('click',function(){
					$('.pwd-input').val("")
					$('#longModel').css('display','none');
				});
			}
		}
		var _error = function(obj){
			$('#longModel').css('display','block');
			$('.btnRes').on('click',function(){
				window.location.href = enterUrl + 'self/myaccount.html';
			});
			$('.btnRes').on('click',function(){
				$('#longModel').css('display','none');
			});
		};
		var _complete = function(){
			$('.me-loading').hide();
		};
		$.gjk.ajax.postAjax(_url,_data,_success,_error,_complete,"POST","accountleft");
	}
