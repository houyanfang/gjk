(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.uv = function (option) {
        return new JqPort(this, option);
    };
    $.fn.uv.defaults = {
    };
    var JqPort = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], $.fn.uv.defaults, options);
        this.init(1);
    };
    
    JqPort.prototype = {
    	constructor: JqPort,
    	initHtml:function(data){
    		var html='';
    		if(data.length==0){
    			html='<tr> <td colspan="5">无数据</td></tr>';
    		}
    		$.each(data, function (i, data) {
    			var type="";
    			if(data.uvType==1){
    				type="中国肝健康网";
    			}else if(data.uvType==2){
    				type="柑橘客";
    			}else if(data.uvType==3){
    				type="自媒体";
    			}else{
    				type="其他";
    			}
    			html += '<tr>'+
    			'<td>'+(i+1)+'</td>'+
    			'<td>'+data.uvDate+'</td>'+
    			'<td>'+data.uvCount+'</td>'+
    			'<td>'+type+'</td>'+
    			'<td class="pharmaceuticalFactory">'+
    			'<div class="button-group">'+
    			'<a data-id='+data.id+' class="update-uv button border-main" href="javascript:void(0)"><span class="icon-edit"></span> 修改</a>'+
    			'<a data-id='+data.id+' class="del-uv button border-red" href="javascript:void(0)"><span class="icon-trash-o"></span> 删除</a>'+
    			'</div>'+
    			'</td>'+
    			'</tr>';
    		});
    		$(".userlist").html(html);
    	},
    	init_list:function(pgn){
    		var self = this, $el = self.$element,config=this.options;
    		$(".addUVHtml").hide();
    		Base.commajax("/statis/uv/uv_list.htm","get",{pgn:pgn},function(data){
        		config.data = data;
        		self.initHtml(config.data.list);
        		if(data.role==="2"){
        			$(".pharmaceuticalFactory").remove();
        		}else{
        			$(".addUVHtml").show();
        		}
        		$("#pagination").pagination(config.data.page.totalPages, {
        			callback : $.proxy(self.page_callback,self),
    				items_per_page : 1,
    				prev_text : "<<",
    				next_text : ">>",
    				num_edge_entries : 1, //边缘值
    				ellipse_text : '...', //边缘显示
    				num_display_entries : 5, //显示条数
    				current_page : pgn - 1,
    				show_if_single_page:true,
    				link_to : "javascript:void(0)"
    					
    			});
        		
        		$el.find(".del-uv").off('click').on('click' , function(){
        			var id = $(this).data("id");
                	Base.commajax("/statis/uv/del_uv.htm","post",{id:id},function(data){
                		msg=data.message+";pages/statis/uv.html;2;#"+data.success;
    	        		$.cookie("msg" , msg);
    	        		Base.getPage("pages/tips.html");
                	});
        		});
        		
        		$el.find(".update-uv").off('click').on('click' , function(){
        			var id = $(this).data("id");
        			$.cookie("dataid" , id);
        			Base.getPage("pages/statis/uv_add.html");
        		});
        	});
    	},
    	addAndUpd:function(id){
    		var self = this, $el = self.$element,config=this.options;
    		Base.commajax("/statis/uv/uv_list.htm","get",{id:id},function(data){
    			data=data.list[0];
    			config.datetime=data.uvDate;
    			config.type=data.uvType;
    			Base.setValueForFrom('#uvfrom',data);
			});
    	},
    	init:function(pgn){
    		var self = this, $el = self.$element,config=this.options;
    		Base.emptyForm("#uvfrom");
    		var id=$.cookie("dataid");
    		if(id && !config.init){
    			self.addAndUpd(id);
    			$.cookie("dataid","");
    		}
    		if(config.init){
    			self.init_list(pgn);
    		}
    		
    		$el.find(".addUVHtml").off('click').on('click' , function(){
    			$.cookie("dataid","");
    			Base.getPage("pages/statis/uv_add.html");
			});
    		$el.find(".showStatisticalChart").off('click').on('click' , function(){
    			Base.getPage("pages/statis/uv_chart.html");
    		});
    		
    		
    		$el.find("#addUv").off('click').on('click' , function(){
        		if( !Base.validate("#uvfrom")){
                	return;
                };
        		var params = $('#uvfrom').serialize();
	        	Base.commajax("/statis/uv/add_uv.htm","post",params,function(data){
	        		msg=data.message+";pages/statis/uv.html;2;#"+data.success;
	        		$.cookie("msg" , msg);
	        		Base.getPage("pages/tips.html");
	        	});
	        	
        	});
    		$("input[name='uvDate'],#type").blur(function(){
             	var e=$(this);
             	var date = $("input[name='uvDate']").val();
             	if(config.datetime){
             		config.datetime=config.datetime.substr(0,10);
             	}
             	if(!date){
             		return
             	}
             	$('#uvfrom').find("input[name='uvDate'],#type").parent().parent().removeClass("check-error").addClass("check-success");
                $('#uvfrom').find(".input-help-twice").remove();
             	var options=$("#type option:selected").val();
             	if(config.datetime==date.substr(0,10) && config.type==options){
             		return
             	}
             	var url="/statis/uv/uv_list.htm";
             	Base.commajax(url,"get",{checkDate:date.substr(0,10),uvType:options},function(data){
             		var flag = data.list.length==0?"true":"false";
             		if(e.attr("data-validate")){
             			var $checkdata=e.attr("data-validate").split(',');
             			var $checkvalue=e.val();
             			var $checkstate=true;
             			var $checktext="";
             			if($checkvalue!="" || e.attr("data-validate").indexOf("required")>=0){
             				for(var i=0;i<$checkdata.length;i++){
             					var $checktype=$checkdata[i].split(':');
             					if(!Base.$pintuercheck(e,$checktype[0],flag)&&$checktype[0]=="twice"){
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
             				e.closest('.field').append('<div class="input-help-twice"><ul>'+$checktext+'</ul></div>');
             			}
             		}
             		
             	});
             });
        },
    	//分页回调
    	page_callback:function(page_index, jq) {
    		var self = this;
    		current_page = page_index + 1;
    		self.init(current_page);
    		return true;
    	}

	};
    	
    
})(jQuery);
