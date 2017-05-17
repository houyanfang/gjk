(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.activity = function (option) {
        return new JqPort(this, option);
    };
    var JqPort = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], options);
        this.init(1);
    };
    
    JqPort.prototype = {
    	constructor: JqPort,
    	initHtml:function(data,url){
    		var html='';
    		if(data.length==0){
    			html='<tr> <td colspan="16">无数据</td></tr>';
    		}
	    		$.each(data, function (i, data) {
	    			
	    			html += '<tr>'+
	    			'<td title="'+data.promotionName+'">'+data.promotionName+'</td>'+
	    			'<td><img src="'+url+data.bannerUrl+'" style="width:40px;height:30px;" /></td>'+
	    			'<td title="'+data.contentUrl+'">'+data.contentUrl+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.ACTIVITY_TYPE,data.promotionType)+'</td>'+
	    			'<td title="'+data.normalName+'">'+data.normalName+'</td>'+
	    			'<td title="'+data.medCode+'">'+data.medCode+'</td>'+
	    			'<td>'+data.medcodeNum+'</td>'+
	    			'<td>'+data.lostdaysMax+'</td>'+
	    			'<td>'+data.takendays+'</td>'+
	    			'<td>'+data.reward+'</td>'+
	    			'<td title="'+data.promotionCount+"/"+data.promotionMaxNum+'">'+data.promotionCount+"/"+data.promotionMaxNum+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.ACTIVE_TYPE,data.status)+'</td>'+
	    			'<td>'+data.shareCount+'</td>'+
	    			'<td>'+data.sort+'</td>'+
	    			'<td>'+
	    			'<div class="button-group">'+
	    			'<a data-id='+data.id+' class="show-update button border-main" href="javascript:void(0)"><span class="icon-bars"></span>修改</a>'+
	    			'</div>'+
	    			'</td>'+
	    			'<td>'+
	    			'<div class="button-group">'+
	    			'<a data-id='+data.id+' class="show-del button border-main" href="javascript:void(0)"><span class="icon-bars"></span>删除</a>'+
	    			'</div>'+
	    			'</td>'+
	    			'</tr>';
	    		});
    		$(".msklactilist").html(html);
    	},
    	init_list:function(pgn,infoTitle){
    		var self = this;
    		var params = $('#msklActiviFrom').serialize()+"&pgn="+pgn;
    		
    		Base.commajax("/operate/activity/activity_list.htm","get",params,function(data){
    			console.log(data);
    			$('.sum').text(data.sum); 
    			self.initHtml(data.list,data.url);
    			
    			
    			var html="";
    			if(infoTitle){
    				html="<option value='"+infoTitle+"' >"+infoTitle+"</option>";
    			}
    			html+="<option value='' >全部</option>";
    			$.each(data.promotions, function (i, promotion) {
    				html+="<option value='"+promotion.infoTitle+"' >"+promotion.infoTitle+"</option>";
    			});
				$('select[name="promotionName"]').html(html);
				
        		var pagearr={
        				id:"#pagination",
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.init_list(page_index + 1,$('select[name="promotionName"]').val());
    				return true;
    			});
        		
        		
        		
        		$(".show-update").off('click').on('click' , function(){
        			var id = $(this).data("id");
        			$.cookie("activityId" , id);
        			Base.getPage("pages/operate/addactivity.html");
            	});
        		$(".show-del").off('click').on('click' , function(){
        			Base.commajax("/operate/activity/activity_del.htm","post",params,function(data){
        				msg=data.message+";pages/operate/activity.html;2;#"+data.success;
    	        		$.cookie("msg" , msg);
    	        		Base.getPage("pages/tips.html");
        			});
        		});
        		
    		});
        },
        init:function(pgn){
        	var self = this, $el = self.$element,config=this.options;
    		if(config.init){
    			self.init_list(pgn);
    		}else{
    			self.addAndUpdate();
    		}
    		
    		$el.find("#msklActiviSearch").off('click').on('click' , function(){
	        	self.init_list(1,$('select[name="promotionName"]').val());
        	});
    		$el.find(".addActivityView").off('click').on('click' , function(){
    			$.cookie("activityId" , "");
    			Base.getPage("pages/operate/addactivity.html");
    		});
    		
    		
    		$el.find(".addActivity").off('click').on('click' , function(){
    			var filepaths = $("input[name='bannerUrl']").val();
    			if( !filepaths){
    				alert("请上传banner图！！");
    			};
    			if( !Base.validate("#activityAddFrom")){
                	return false;
                };
    			var params = $('#activityAddFrom').serialize();
    			console.log(params);
    			Base.commajax("/operate/activity/activity_add.htm","post",params,function(data){
    				msg=data.message+";pages/operate/activity.html;2;#"+data.success;
	        		$.cookie("msg" , msg);
	        		Base.getPage("pages/tips.html");
    			});
    		});
    		
    		$("input[name='file']").off('change').on('change' , function(){
    			var filepaths = $("input[name='file']").val();
    			if (filepaths != "") {
    				var param = {
    					"file" : filepaths
    				};
    				var options = {
    					url : "/cmsManage/uploadfile",
    					dataType : "json",
    					type : "POST",
    					data : param,
    					success : function(data) {
    						var msg = JSON.parse(data);
    						if(msg.status){
    							$("input[name='bannerUrl']").val(msg.name);
    							$(".logoimg").attr('src',""); ;
    							$(".logoimg").attr('src',msg.url+msg.name);
    						}else{
    							alert("上传失败");
    						}
    					},
    					error : function(data) {
    						console.log(data);
    					}
    				};
    				$("#activityAddFrom").ajaxSubmit(options);
    			} else {
    				alert("请选择文件！！");
    			}
    			
    		});
    		
    		
        },
        addAndUpdate:function(){
        	id=$.cookie("activityId");
        	if(id){
        		Base.commajax("/operate/activity/activity_list.htm","get",{id:id},function(data){
        			$(".logoimg").attr('src',""); ;
					$(".logoimg").attr('src',data.url+data.list[0].bannerUrl);
					$("input[name='bannerUrl']").val(data.list[0].bannerUrl);
        			Base.setValueForFrom('#activityAddFrom',data.list[0]);
        		});
        	}
        },
	};
    	
    
})(jQuery);
