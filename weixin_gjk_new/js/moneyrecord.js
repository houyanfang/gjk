$(document).ready(function(){
	$('.me-loading').show();
	var _url = 'userCashout/cashoutLog';
	var _data = {};
	var _success = function(obj){
		if(obj.success == true){
			console.log(obj.data);
			if(obj.data.length===0){
				$('#no-record').removeClass('hide');
			}
			var recordList = $('#record-list');
			if(obj.data.length >= 1){
				obj.data.forEach(item => {
					var time = new Date(item.transDatetime);
					var year = time.getFullYear();
					var month = time.getMonth()+1;
					var dates = time.getDate();
					var fulldates = year + '-'+month + '-'+dates;
					var money = item.transAmount;
					var refSerialNo = item.refSerialNo;
					var template = $('.template .templatelist').clone();
					template.find('.money-time').text(fulldates);
					template.find('.money-id').text(refSerialNo);
					template.find('.money-data').text(money);
					recordList.append(template);
				})
				
			}
		}
	};
	var _error = function(obj){
		alert(obj.message);
	};
	var _complete = function(){
		$('.me-loading').hide();
	}
	$.gjk.ajax.postAjax(_url,_data,_success,_error,_complete,"POST","moneyrecord");
});
