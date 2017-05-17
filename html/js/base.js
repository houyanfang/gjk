   $(function(){
       $.fn.serializeObject = function() {
           var o = {};
           var a = this.serializeArray();
           $.each(a, function() {
               if (o[this.name] !== undefined) {
                   if (!o[this.name].push) {
                       o[this.name] = [o[this.name]];
                   }
                   o[this.name].push(this.value || '');
               } else {
                   o[this.name] = this.value || '';
               }
           });
           return o;
       };
       
       $('textarea, input, select').blur(function(){
		var e=$(this);
		if(e.attr("data-validate")){
			e.closest('.field').find(".input-help").remove();
			var $checkdata=e.attr("data-validate").split(',');
			var $checkvalue=e.val();
			var $checkstate=true;
			var $checktext="";
			if(e.attr("placeholder")==$checkvalue){$checkvalue="";}
			if($checkvalue!="" || e.attr("data-validate").indexOf("required")>=0){
				for(var i=0;i<$checkdata.length;i++){
					var $checktype=$checkdata[i].split(':');
					if(! Base.$pintuercheck(e,$checktype[0],$checkvalue)){
						$checkstate=false;
						$checktext=$checktext+"<li>"+$checktype[1]+"</li>";
					}
				}
			};
			if($checkstate){
				e.closest('.form-group').removeClass("check-error");
				e.parent().find(".input-help").remove();
				e.closest('.form-group').addClass("check-success");
			}else{
				e.closest('.form-group').removeClass("check-success");
				e.closest('.form-group').addClass("check-error");
				e.closest('.field').append('<div class="input-help"><ul>'+$checktext+'</ul></div>');
			}
		}
	});
       
});

Base={
	getPage:function (url){
		if(!url){return;}
			this.pageTemp = null;			// 页面临时对象，加载页面时载入，切换页面时清除
			this.pageArgu = null;			// 切换页面时传递的参数，切换页面时不清除
			this.pageLoadCallback = null;
			$.ajaxSetup ({cache: false});
			 $("#admin").load(url);
		},
	oPage:function (arr,callback,showGo){
		showGo=$.trim(showGo)==""?false:showGo;
		$(arr.id).pagination(arr.totalPages, {
			callback :callback,
			items_per_page : 1,
			prev_text : "<<",
			next_text : ">>",
			num_edge_entries : 1, //边缘值
			ellipse_text : '...', //边缘显示
			num_display_entries : 3, //显示条数
			current_page : arr.pgn - 1,
			showGoPage:showGo,
			show_if_single_page:true,
			link_to : "javascript:void(0)"
		});
	},
    commajax: function(requestUrl,type, params, backCall){
        if(requestUrl && params){  // .height("99999px")
            var loading = $('<div style="z-index: 99999;position: absolute;top: 0;right: 0;left: 0;bottom: 0;background: url(images/loading-sm.gif) center center no-repeat #000;opacity: 0;overflow-y: auto; "></div>')
            .appendTo('body').animate({
                opacity: '.3'
            }, 1000);
            $('.common-commquery-loading').css("height",document.body.scrollHeight+"px");
            var suffer="/cmsManage";
            if(requestUrl.indexOf(suffer)>-1){
                url = requestUrl ;//+ '?timestamp=' + new Date().getTime();
            }else{
                url = suffer + requestUrl ;//+ '?timestamp=' + new Date().getTime();
            }
            $.ajax({
                type: type,
                url: url,               //eg: "/manager/user",
                data: params,                                              //eg: {type:'',...}
                dataType: "json",
                success: function(data){
                    loading.remove();
                    
                    if(data.errorcode){
                        if(data.errorcode==11111){
//                        	alert(data.errordesc);
                            setTimeout(function() {
                            	location.href="login.html";
                        	}, "1000");
                        }else{
                            alert(data.errordesc);
                        }
                    }else{
                        if(backCall){
                            backCall(data);
                        }
                    }
                },
                error:function(er){
                    loading.remove();
                    console.log(er);
                }
            });
        }else{
            console.log('requestUrl or requestData error.');
        }
    },
    validate:function(formId){
    	var numError2 = $(formId).find('.input-help-twice').length;
    	if(numError2){
			return false;
        }
    	$(formId).find('input[data-validate],textarea[data-validate],select[data-validate]').trigger("blur");
		$(formId).find('input[placeholder],textarea[placeholder]').each(function(){Base.$hideplaceholder($(formId));});
		var numError = $(formId).find('.check-error').length;
		if(numError){
			$(formId).find('.check-error').first().find('input[data-validate],textarea[data-validate],select[data-validate]').first().focus().select();
			return false;
        }else{
        	return true;
        }
    },
	$hideplaceholder:function(element){
		if($(element).data("pintuerholder")){
			$(element).val("");
			$(element).css("color", $(element).data("pintuerholder"));		
			$(element).removeData("pintuerholder");
		}
	},
	$pintuercheck:function(element,type,value){   
		$pintu=value.replace(/(^\s*)|(\s*$)/g, "");
		switch(type){
			case "required":return /[^(^\s*)|(\s*$)]/.test($pintu);break;
			case "twice":return $pintu != "false";break;
			case "chinese":return /^[\u0391-\uFFE5]+$/.test($pintu);break;
			case "number":return /^\d+$/.test($pintu);break;
			case "integer":return /^[-\+]?\d+$/.test($pintu);break;
			case "plusinteger":return /^[+]?\d+$/.test($pintu);break;
			case "double":return /^[-\+]?\d+(\.\d+)?$/.test($pintu);break;
			case "plusdouble":return /^[+]?\d+(\.\d+)?$/.test($pintu);break;
			case "english":return /^[A-Za-z]+$/.test($pintu);break;
			case "username":return /^[a-z]\w{3,}$/i.test($pintu);break;
			case "mobile":return /^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}?$|15[89]\d{8}?$|170\d{8}?$|147\d{8}?$/.test($pintu);break;
			case "phone":return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/.test($pintu);break;
			case "tel":return /^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}?$|15[89]\d{8}?$|170\d{8}?$|147\d{8}?$/.test($pintu) || /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/.test($pintu);break;
			case "email":return /^[^@]+@[^@]+\.[^@]+$/.test($pintu);break;
			case "url":return /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test($pintu);break;
			case "ip":return /^[\d\.]{7,15}$/.test($pintu);break;
			case "qq":return /^[1-9]\d{4,10}$/.test($pintu);break;
			case "currency":return /^\d+(\.\d+)?$/.test($pintu);break;
			case "zip":return /^[1-9]\d{5}$/.test($pintu);break;
			case "radio":
				var radio=element.closest('form').find('input[name="'+element.attr("name")+'"]:checked').length;
				return eval(radio==1);
				break;
			default:
				var $test=type.split('#');
				if($test.length>1){
					switch($test[0]){
						case "compare":
							return eval(Number($pintu)+$test[1]);
							break;
						case "regexp":
							return new RegExp($test[1],"gi").test($pintu);
							break;
						case "length":
							var $length;
							if(element.attr("type")=="checkbox"){
								$length=element.closest('form').find('input[name="'+element.attr("name")+'"]:checked').length;
							}else{
								$length=$pintu.replace(/[\u4e00-\u9fa5]/g,"***").length;
							}
							return eval($length+$test[1]);
							break;
						case "ajax":							
							var $getdata;
							var $url=$test[1]+$pintu;							
							$.ajaxSetup({async:false});
							$.getJSON($url,function(data){								
								$getdata=data.getdata;								
							});
							if($getdata=="true"){return true;}
							break;
						case "repeat":
							return $pintu==jQuery('input[name="'+$test[1]+'"]').eq(0).val();
							break;
						default:return true;break;
					}
					break;
				}else{
					return true;
				}
		}
	},
	 setValueForFrom:function(formId,jsonData,transfromJsons,dropObj){
	        if(formId&&jsonData) {
	            $(formId).find(':input').not(':button, :submit, :reset,:radio,:checkbox').each(function () {
	            	var attrName = $(this).attr("name");
	                var val = jsonData[attrName];
	                if(val){
	                	val=val.toString();
	                	}
	                if (attrName && val) {
	                    if(val.match("00:00:00.0")){
	                        val=val.substr(0,10);
	                    }
	                    var me = $(this);
	                    if (me.is(":checkbox")) {
	                        Base.setRadioChecked(this, val);
	                    }
	                    if (me.is("select")) {
	                        Base.setSelectChecked(this, val);
	                    }
	                    if (me.is("textarea")){
	                        me.siblings().remove();
	                        if(me.data("forshow")!=true){                            
	                            me.parent().append('<em style="display:none;margin-left: 13px;">'+val+'</em>');
	                        }
	                    }
	                    if(transfromJsons){
	                        var transValue=transfromJsons[attrName];
	                        if(transValue){
	                            me.find("option").remove();
	                            $("<option>").val(val).text(jsonData[transValue]).attr("selected", "selected")
	                                .appendTo(me);
	                        }else{
	                            me.val(val);
	                        }
	                    }else{
	                        me.val(val);
	                    }
	                    me.change();
	                }

	            });
	            if(dropObj){
	                dropObj.showCurrent(jsonData);
	            }
	        }
	    },
	    setSelectChecked: function (selectId, strs) {
	        $(selectId).find("option").each(function () {
	            var value = $(this).val();
	            if (strs) {
	                if (strs===value) {
	                    $(this).prop("selected", true);
	                    return;
	                } else {
	                    $(this).removeAttr("selected");
	                }
	            } else {
	                $(this).removeAttr("selected");
	            }
	        });
	    },
	    setRadioChecked: function (radioId, strs) {
	        $(radioId).parent().parent().find(":checkbox").each(function () {
	            var value = $(this).val();
	            if (strs) {
	                if (strs.match(value)) {
	                    $(this).prop("checked", true);
	                } else {
	                    $(this).removeAttr("checked");
	                }
	            } else {
	                $(this).removeAttr("checked");
	            }
	        });
	    },
	    emptyForm:function(formId,dropObj){
	        $(formId).find(":input")
	            .removeAttr('checked')
	            .removeAttr('selected')
	            .not(':button, :submit, :reset,:checkbox,select,:radio')
	            .val('');
	        $(formId).find("option[value='0']").prop("selected", true);
	        if(dropObj){
	            dropObj.resetDrop();
	        }
	    },
	    setInputReadOnly:function(formId){
	    	  $(formId).find(':input,:radio,:checkbox').each(function () {
					$(this).attr("readonly","readonly");
	    	  });
	    },
	    removeInputReadOnly:function(formId){
	    	 $(formId).find(':input,:radio,:checkbox').each(function () {
					$(this).attr("readonly","");
	    	  });
	    },
	    setFormDisable:function(formId){
	    	$(formId).find(':input,textarea').each(function () {
	    		$(this).attr("disabled",true);
	  	  	});
	    },
	    removeFormDisable:function(formId){
	    	$(formId).find(':input,textarea').each(function () {
	    		$(this).attr("disabled",false);
	  	  	});
	    },
	    initTwoDate:function(statId,endId,mindate,timeType){
	    	timeType=$.trim(timeType)==""?'Y-m-d':timeType;
	    	mindate=$.trim(mindate)==""?false:mindate;
	    	$(statId).datetimepicker({
	    		timepicker:false,
	    		format:timeType,
	    		minDate:mindate,
	    		step:30
	    	}).off('blur').on('blur' , function(){
	    		var startdate=$(statId).val();
	    		var endate=$(endId).val();
	    		if($.trim(startdate)){
	    			if(new Date(startdate)>new Date(endate)){
	    				$(endId).val("");
	    			}; 
	    			Base.initDate(endId,startdate);
	    			return;
	    		}
	    		Base.initDate(endId);
	    	});
	    	Base.initDate(endId);
	    },
	    initDate:function(dateId,mindate,timeType){
	    	timeType=$.trim(timeType)==""?'Y-m-d':timeType;
	    	mindate=$.trim(mindate)==""?false:mindate;
	    	$(dateId).datetimepicker({
	    		timepicker:false,
	    		format:timeType,
	    		startDate:mindate,
	    		minDate:mindate,
	    		step:30
	    	});
	    },
	    getConsText:function(constants,code){
            var dataType="";
            $.each(constants,function(i,data){
                if(data.CODE==code){
                	dataType= data.TEXT;
                    return false;
                }
            });
            return dataType;
        },
        formatTime:function(time, format) {
        	var t = new Date(time);
        	var tf = function(i) {
        		return (i < 10 ? '0' : '') + i;
        	};
        	return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        		switch (a) {
        		case 'yyyy':
        			return tf(t.getFullYear());
        			break;
        		case 'MM':
        			return tf(t.getMonth() + 1);
        			break;
        		case 'mm':
        			return tf(t.getMinutes());
        			break;
        		case 'dd':
        			return tf(t.getDate());
        			break;
        		case 'HH':
        			return tf(t.getHours());
        			break;
        		case 'ss':
        			return tf(t.getSeconds());
        			break;
        		}
        	})
        }
	
	
	
	
	
	
	
	
	
	
	
}