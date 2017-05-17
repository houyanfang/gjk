$(document).ready(function(){
	$('#add-card').on('click',addCard);
	var _url = "userBankcard/select";
	var _data = {};
	var _success = function(obj){
		//my card list
		if(obj.data.length)
		{
			var realName = obj.data[0].userRealName_hide;
			var userIdentiCard = obj.data[0].userIdentiCard_hide;
			//localStorage.id = obj.data.id;
			$('.userName').val(realName);
			$('.userId').val(userIdentiCard);
		
			var cardList = $(".card-list");
			obj.data.forEach(item => {
				switch(item.status)
				{
					case 2:
						var template = $(".template .template-green").clone();
						template.data("cardId", item.id);
						template.find(".bank-name").text(item.bankName);
						template.find(".bank-card-no").attr({placeholder: item.cardNo_hide});
						cardList.append(template);
						break;
					case 1:
						var template = $(".template .template-yellow").clone();
						template.data("cardId", item.id);
						template.find(".bank-name").text(item.bankName);
						template.find(".bank-card-no").attr({placeholder: item.cardNo_hide});
						cardList.append(template);
						break;
					case 3:
						var template = $(".template .template-red").clone();
						template.data("cardId", item.id);
						template.find(".bank-name").text(item.bankName);
						template.find(".bank-card-no").attr({placeholder: item.cardNo_hide});
						cardList.append(template);
						break;
					default:
						break;
				}
			});
		}
	}
	var _error = function(obj){}
	var _complete = function(){
		
	}
	$.gjk.ajax.postAjax(_url,_data,_success,_error,_complete,"POST","modifyinformation");
	
	
	$(document).on('click', '.text-red', function(){
		var parent = $(this).parents(".template");
		if(!parent.data("cardId"))
		{
			return;
		}
		var _url = "userBankcard/delete/"+ parent.data("cardId");
		var _data = {};
		var _success = function(obj){
			if(obj.success)
			{
				//$(".card-list").remove();
				parent.remove();
			}
		};
		var _error = function(obj){};
		var _complete = function(){
			
		};
		$.gjk.ajax.postAjax(_url,_data,_success,_error,_complete,"POST","modifyinformation");
	});
})
function addCard(){
	var enterUrl = $.gjk.path_url;
	window.location.href = enterUrl + "self/cardinformation.html";
}
function modifyCard(){
	
}

