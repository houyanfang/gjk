$(document).ready(function(){
	/*通过url传值获取身份证审核状态*/
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
	var status = getUrlParams();
	var myhomeUrl = $.gjk.path_url + 'self/myaccount.html';
	switch(status.idCardStatus){
		case '1':
		//审核中
			$('.nav-title').text('审核中');
			$('#vertify-box').removeClass('hide');
//			$('.goto-myhome').attr('href',myhomeUrl);
			$('.goto-myhome').on('click',function(){
				$('.goto-myhome').attr("href",myhomeUrl);
			});
			break;
		case '2':
		//审核通过
			$('.nav-title').text('银行卡信息');
			$('#cardList-box').removeClass('hide');
			$('#add-card').on('click',addCard);
			var _url = "userBankcard/select";
			var _data = {};
			var _success = function(obj){
				if(obj.success == true){
					console.log(obj.data);
					//my card list
					if(obj.data.length)
					{   
						//遍历获得第一个status='2'的银行卡个人信息data
						function findPersonData(item) { 
						    return item.status === 2;
						}
						var personData = obj.data.find(findPersonData);
						if(personData){
							var realName = personData.userRealName_hide;
							var userIdentiCard = personData.userIdentiCard_hide;					
							//localStorage.id = obj.data.id;
							$('.userName').val(realName);
							$('.userId').val(userIdentiCard);
						}
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
	//							case 3:
	//								var template = $(".template .template-red").clone();
	//								template.data("cardId", item.id);
	//								template.find(".bank-name").text(item.bankName);
	//								template.find(".bank-card-no").attr({placeholder: item.cardNo_hide});
	//								cardList.append(template);
	//								break;
								default:
									break;
							}
						});
					}
				}
				
			}
			var _error = function(obj){}
			var _complete = function(){
				$('.me-loading').hide();
			}
			$.gjk.ajax.postAjax(_url,_data,_success,_error,_complete,"POST","addcard");
			
			//删除银行卡信息
			$(document).on('click', '.text-red', function(){
				$('#longModel').css('display','block');
				$('.btnRes').on('click',function(){
					$('#longModel').css('display','none');
				});
				$('.btnOk').on('click',function(){
					var parent = $('.text-red').parents(".template");
					if(!parent.data("cardId"))
					{
						return;
					}
					var _url = "userBankcard/delete/"+ parent.data("cardId");
					var _data = {"id":parent.data("cardId")};
					var _success = function(obj){
						if(obj.success == true)
						{
							parent.remove();
						}
					};
					var _error = function(obj){};
					var _complete = function(){
						$('.me-loading').hide();
					};
					$.gjk.ajax.postAjax(_url,_data,_success,_error,_complete,"POST","addcard");
					$('#longModel').css('display','none');
				});
				
			});
			/*修改银行卡信息*/
			$(document).on('click','.modify-btn',function(){
				var parent = $(this).parents(".template");
				var cardId = parent.data("cardId");
				window.location.href = $.gjk.path_url + 'self/cardinformation.html?' +'cardId=' +cardId;
			});
			$('.goto-myhome').on('click',function(){
				$('.goto-myhome').attr("href",myhomeUrl);
			});
			break;
		case '0':
		//未添加
		case '3':
		default:
		//审核失败
			$('.nav-title').text('添加银行卡');
			$('#add-box').removeClass('hide');
			$('.add-btn').on('click',function(){
				var enterUrl = $.gjk.path_url;
				window.location.href = enterUrl + 'self/upload-picture.html';
			});
			$('.goto-myhome').on('click',function(){
//				window.location.href = myhomeUrl;
				$('.goto-myhome').attr("href","javascript:history.go(-1);");
			});
		break;
		
	}
	function addCard(){
		var enterUrl = $.gjk.path_url;
		window.location.href = enterUrl + "self/cardinformation.html";
	}
})