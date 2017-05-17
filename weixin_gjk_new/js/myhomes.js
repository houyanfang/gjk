$(document).ready(function(){
		getUserInfo();
		$('.enter-btn').click(enterBtn);
		$('.account-url').click(openAccount);
		$('.healthplan-url').click(openTreatplans);
		$('.healthtest-url').click(openTest);
		$('.integral-url').click(openPoint);
		$('.moodrecord-url').click(openMoodrecord);
		$('.superior-url').click(openSupervisor);
		$('.activity-url').click();
});
	function getUserInfo(){
		$('.me-loading').show();
		var _url = "mskluser/userInfos";
		var _data = {};
		var _success = function(obj){
//				   console.log(obj.data);
		   if(obj.success == true){
		       var img_url = obj.data.photo;
			   var my_name = obj.data.nickName;
			   $('.myimg').attr("src",img_url);
			   $('.superintendent-name').html(my_name);
		   }
		};
		var _complete = function(){					
		   $('.me-loading').hide();
		}
		var _error = function(obj){
		   alert(obj.message);
		};
		$.gjk.ajax.postAjax(_url, _data, _success, _error, _complete, "POST", "myhome");
						
	}
	/*enter--进入*/
	function enterBtn(){
		var enterUrl =$.gjk.path_url + 'self/selfinfor.html';
		window.location.href = enterUrl;
	}
	/*我的账户按钮*/
	function openAccount(){
		var enterUrl =$.gjk.path_url + 'self/myaccount.html';
		window.location.href = enterUrl;
	}
	/*我的积分*/
	function openPoint(){
		var enterUrl =$.gjk.path_url + 'self/mypoint.html';
		window.location.href = enterUrl;
	}
	/*健康测试*/
	function openTest(){
		var enterUrl =$.gjk.path_url + 'test/testbegin.html';
		window.location.href = enterUrl;
	}
	/*健康计划*/
	function openTreatplans(){
		var enterUrl =$.gjk.path_url + 'plan/finishplan.html';
		window.location.href = enterUrl;
	}
	/*心情记录*/
	function openMoodrecord(){
		var enterUrl =$.gjk.path_url + 'self/mymoodrecord.html';
		window.location.href = enterUrl;
	}
	/*监督人*/
	function openSupervisor(){
		var enterUrl =$.gjk.path_url + 'self/mysuperivoroutput.html';
		window.location.href = enterUrl;
	}
	/*活动*/
	function openActivity(){
		var enterUrl =$.gjk.path_url + 'self/activity.html';
		window.location.href = enterUrl;
	}