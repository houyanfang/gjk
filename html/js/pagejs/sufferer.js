(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.sufferer = function (option) {
        return new JqPort(this, option);
    };
    $.fn.sufferer.defaults = {
    };
    var JqPort = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], $.fn.sufferer.defaults, options);
        this.init(1);
    };
    
    JqPort.prototype = {
    	constructor: JqPort,
    	initHtml:function(data){
    		var html='';
    		if(data.length==0){
    			html='<tr> <td colspan="12">无数据</td></tr>';
    		}
	    		$.each(data, function (i, data) {
					var authtext="";
	    			if(data.authStatus=="0"){
	    				authtext="未认证";
	    			}else if(data.authStatus=="1"){
	    				authtext="认证中";
	    			}else if(data.authStatus=="2"){
	    				authtext="已认证";
	    			}else if(data.authStatus=="3"){
	    				authtext="认证状态";
	    			}
	    			
	    			html += '<tr>'+
	    			'<td>'+(i+1)+'</td>'+
	    			'<td>'+data.userName+'</td>'+
	    			'<td>'+data.userNickName+'</td>'+
	    			'<td>'+data.sex+'</td>'+
	    			'<td>'+data.userAge+'</td>'+
	    			'<td>'+data.mobile+'</td>'+
	    			'<td>'+data.email+'</td>'+
	    			'<td>'+data.userComefrom+'</td>'+
	    			'<td>'+data.registerDatetime+'</td>'+
	    			'<td>'+data.invitationCode+'</td>'+
	    			'<td>'+authtext+'</td>'+
	    			'<td>'+
	    			'<div class="button-group">'+
	    			'<a data-id='+data.userId+' class="show-user button border-main" href="javascript:void(0)"><span class="icon-bars"></span> 查看</a>'+
	    			'</div>'+
	    			'</td>'+
	    			'</tr>';
	    		});
    		$(".mskluserlist").html(html);
    	},
    	init_list:function(pgn){
    		var self = this, $el = self.$element,config=this.options;
    		var params = $('#msklUser').serialize()+"&pgn="+pgn;
    		
    		Base.commajax("/patient/sufferer/sufferer_list.htm","get",params,function(data){
        		config.data = data;
        		$('.todayNum').html(config.data.todayNum);
        		$('.userSum').html(config.data.sum);
        		self.initHtml(config.data.list);
        		$("#pagination").pagination(config.data.page.totalPages, {
        			callback :function(page_index, jq){
		        				current_page = page_index + 1;
					    		self.init_list(current_page);
					    		return true;
        			},
    				items_per_page : 1,
    				prev_text : "<<",
    				next_text : ">>",
    				num_edge_entries : 1, //边缘值
    				ellipse_text : '...', //边缘显示
    				num_display_entries : 5, //显示条数
    				current_page : pgn - 1,
    				showGoPage:true,
    				show_if_single_page:true,
    				link_to : "javascript:void(0)"
    			});
        		
        		$el.find("#msklsearch").off('click').on('click' , function(){
                	self.init(1);
        		});
        		$el.find(".show-user").off('click').on('click' , function(){
        			var id = $(this).data("id");
        			$.cookie("mskluserid" , id);
        			Base.getPage("pages/patient/sufferer-info.html");
        		});
    		});
        },
        init:function(pgn){
        	var self = this, $el = self.$element,config=this.options;
    		var id=$.cookie("mskluserid");
    		if(id && !config.init){
    			self.view_info(id);
    		}
    		if(config.init){
    			self.init_list(pgn);
    		}
    		
    		$el.find("#integralinfo").off('click').on('click' , function(){
	        	self.inte(1);
	        	
        	});
        	$el.find("#newsinfor").off('click').on('click' , function(){
	        	self.news(1);
	        	
        	});
        	$el.find("#moodrecordinfor").off('click').on('click' , function(){
	        	self.mood(1);
	        	
        	});
        	$el.find("#promotion").off('click').on('click' , function(){
	        	self.promotion(1);
        	});
        	$el.find("#planPage").off('click').on('click' , function(){
        		self.planinfo(1);
        	});
        },
        planinfo:function(pgn){
        	var self = this;
        	var params = {
        			pgn:pgn,
        			userId:$.cookie("mskluserid"),
        	};
        	Base.commajax("/patient/sufferer/sufferer_plan.htm","get",params,function(data){
        		var planhtml="";
        		$.each(data.list,function(i,plan){
        			planhtml+='<tr>';
        			planhtml+='<td>'+(plan.status==0?"未完成":"完成")+'</td>';
        			planhtml+='<td>'+plan.type+'</td>';
        			planhtml+='<td>'+plan.startDate+'</td>';
        			planhtml+='<td>'+plan.endDate+'</td>';
        			planhtml+='<td>'+($.trim(plan.sum)==""?"":plan.count+"/"+plan.sum)+'</td>';
        			planhtml+='<td>';
        			planhtml+='	<div class="button-group dialogs" data-toggle="click" data-target="#plan_info" data-url="pages/patient/control.html" data-mask="1" data-width="70%">';
    				planhtml+='	<a data-sum="'+plan.sum+'" data-count="'+plan.count+'" data-type="'+plan.type+'" data-id="'+plan.id+'" class="show-detail button border-main" href="javascript:void(0)"><span class="icon-bars"></span> 详细</a>';
    				planhtml+='</div></td></tr>';
        		});
        		$('.plan_tr').html(planhtml);
        		var pagearr={
        				id:"#plan_pagination",
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.planinfo(page_index + 1);
    				return true;
    			});
        		$(".show-detail").off('click').on('click' , function(){
        			var type = $(this).data('type');
        			$('.plan_type').html(type+"记录");
        			
    				self.diet_info(1,$(this).data('id'),$(this).data('sum'),$(this).data('count'),type);
        			
        			
            	});
        	});
        },
        diet_info:function(pgn,planId,sum,count,plan_type){
        	var self = this;
        	var params = {
        			pgn:pgn,
        			userId:$.cookie("mskluserid"),
        			planId:planId,
        			type:plan_type,
        	};
        	Base.commajax("/patient/sufferer/sufferer_info_plan.htm","get",params,function(data){
        		console.log(data);
        		$('.diet_sum').html(sum);    
        		$('.diet_sum1').html(data.time);    
        		$('.diet_sum2').html(data.untime);    
        		$('.diet_sum3').html(Number(sum-count)); 
        		
        		var id="";
        		$(".plan_info").addClass("hidden");
        		if(plan_type=='饮食'){id="#diet_pagination";$('.deit_').removeClass("hidden");}
        		if(plan_type=='服药'){id="#treat_pagination";$('.treat_').removeClass("hidden");}
        		if(plan_type=='戒酒'){id="#abstinence_pagination";$('.abstinence_').removeClass("hidden");}
        		if(plan_type=='戒烟'){id="#smok_pagination";$('.smok_').removeClass("hidden");}
        		if(plan_type=='作息'){id="#rest_pagination";$('.rest_').removeClass("hidden");}
        		if(plan_type=='运动'){id="#sport_pagination";$('.sport_').removeClass("hidden");}
        		$("#plan_info").click();
        		
        		
        		$('.diet_plan_tr').html(self.plan_info_html(data.list,plan_type));
        		var pagearr={
        				id:id,
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.diet_info(Number(page_index + 1),planId,sum,count,plan_type);
    				return true;
    			});
        	});
        	
        	
        },
        plan_info_html:function(data,plan_type){
        	var html="";
        	if(plan_type == "饮食"){
	    		$.each(data,function(i,plan){
	    			html+='<tr>';
	    			html+='<td>'+plan.createDate+'</td>';
	    			html+='<td>'+plan.dietType+'</td>';
	    			html+='<td>'+plan.diet_type_name+'</td>';
	    			html+='<td>'+Base.getConsText(CONSTANT.PLAN_INFO_TYPE,plan.dietStatus)+'</td></tr>';
	    		});
        	}
        	
        	if(plan_type=='服药'){
	    		$.each(data,function(i,plan){
	    			html+='<tr>';
	    			html+='<td>'+plan.updateDatetime+'</td>';
	    			html+='<td>'+plan.medicalName+'</td>';
	    			html+='<td>'+plan.normal_name+'</td>';
	    			html+='<td>'+plan.manufacturer+'</td>';
	    			html+='<td>'+plan.dose+plan.mediniceInit+'</td>';
	    			html+='<td>'+Base.getConsText(CONSTANT.PLAN_INFO_TYPE,plan.takenStatus)+'</td></tr>';
	    		});
        	}
    		if(plan_type=='戒酒'){
	    		$.each(data,function(i,plan){
	    			html+='<tr>';
	    			html+='<td>'+plan.updateDate+'</td>';
	    			html+='<td>'+plan.wineType+'</td>';
	    			html+='<td>'+plan.drinkMl+'</td>';
	    			html+='<td>'+Base.getConsText(CONSTANT.PLAN_INFO_TYPE,plan.abstinence_status)+'</td></tr>';
	    		});
        	}
    		if(plan_type=='戒烟'){
	    		$.each(data,function(i,plan){
	    			html+='<tr>';
	    			html+='<td>'+plan.createDate+'</td>';
	    			html+='<td>'+(plan.smokCount>0?"是":"否")+'</td>';
	    			html+='<td>'+plan.smokCount+'</td>';
	    			html+='<td>'+Base.getConsText(CONSTANT.PLAN_INFO_TYPE,plan.smokStatus)+'</td></tr>';
	    		});
        	}
    		if(plan_type=='作息'){
	    		$.each(data,function(i,plan){
	    			html+='<tr>';
	    			html+='<td>'+plan.create_date+'</td>';
	    			html+='<td>'+(plan.getup_time==""?"睡觉":"起床")+'</td>';
	    			html+='<td>'+(plan.getup_time==""?plan.sleep_time:plan.getup_time)+'</td>';
	    			html+='<td>'+Base.getConsText(CONSTANT.PLAN_INFO_TYPE,plan.rest_status)+'</td></tr>';
	    		});
        	}
    		if(plan_type=='运动'){
	    		$.each(data,function(i,plan){
	    			html+='<tr>';
	    			html+='<td>'+plan.createDate+'</td>';
	    			html+='<td>'+plan.sportType+'</td>';
	    			html+='<td>'+plan.sport_time+'分钟</td>';
	    			html+='<td>'+Base.getConsText(CONSTANT.PLAN_INFO_TYPE,plan.sport_status)+'</td></tr>';
	    		});
        	}
    		return html;
        },
        inte:function(pgn){
        	var self = this;
        	var params = {
        			pgn:pgn,
        			userId:$.cookie("mskluserid"),
        			type:"inte"
        		};
        		
	        	Base.commajax("/patient/sufferer/sufferer_info_page.htm","get",params,function(data){
	        		console.log(data)
	        		var intehtml="";
        		$.each(data.intelist,function(i,inte){
        			intehtml+='<tr><td>'+inte.createDate+'</td>';
        			intehtml+='<td>'+Base.getConsText(CONSTANT.INTEGRATE_TYPE,inte.transIntegrateType)+'</td>';
        			intehtml+='<td>'+inte.transIntegrateNum+'</td>';
        			intehtml+='<td>'+inte.transIntegrateAvalaible+'</td>';
        			intehtml+='<td>'+inte.product_name+'</td>';
        			intehtml+='<td>'+Base.getConsText(CONSTANT.ORDER_TYPE,inte.orderStatus)+'</td></tr>';
        		});
        		$('.intelist').html(intehtml);
        		
        		
        		$("#pagination").pagination(data.page.totalPages, {
        			callback :function(page_index, jq){
					    		self.inte(page_index + 1);
					    		return true;
        			},
    				items_per_page : 1,
    				prev_text : "<<",
    				next_text : ">>",
    				num_edge_entries : 1, //边缘值
    				ellipse_text : '...', //边缘显示
    				num_display_entries : 3, //显示条数
    				current_page : pgn - 1,
    				show_if_single_page:true,
    				link_to : "javascript:void(0)"
    			});
        	});
        },
        news:function(pgn){
        	var self = this;
        	var params = {
        			pgn:pgn,
        			userId:$.cookie("mskluserid"),
        			type:"news"
        		};
        		
	        	Base.commajax("/patient/sufferer/sufferer_info_page.htm","get",params,function(data){
        		var newshtml="";
        		$.each(data.newslist,function(i,news){
        			newshtml+='<tr><td>'+news.create_datetime+'</td>';
        			newshtml+='<td>'+(news.push_type=="1"?"系统消息":"自定义消息")+'</td>';
        			newshtml+='<td title="'+news.push_msg_title+'">'+news.push_msg_title+'</td>';
        			newshtml+='<td title="'+news.msg_content+'">'+news.msg_content.repl("<br")+'</td>';
        			newshtml+='<td>'+(news.is_read=="Y"?"已读":"未读")+'</td>';
        			newshtml+='<td>'+news.update_datetime+'</td></tr>';
        		});
        		$('.newslist').html(newshtml);
        		
        		
        		$("#pagination1").pagination(data.page.totalPages, {
        			callback :function(page_index, jq){
					    		self.news(page_index + 1);
					    		return true;
        			},
    				items_per_page : 1,
    				prev_text : "<<",
    				next_text : ">>",
    				num_edge_entries : 1, //边缘值
    				ellipse_text : '...', //边缘显示
    				num_display_entries : 3, //显示条数
    				current_page : pgn - 1,
    				show_if_single_page:true,
    				link_to : "javascript:void(0)"
    			});
	        });
        },
        mood:function(pgn){
        	var self = this;
        	var params = {
        			pgn:pgn,
        			userId:$.cookie("mskluserid"),
        			type:"mood"
        		};
        		
	        	Base.commajax("/patient/sufferer/sufferer_info_page.htm","get",params,function(data){
        		var moodhtml="";
        		$.each(data.moodlist,function(i,mood){
        			moodhtml+='<tr><td>'+$.trim(mood.createDate)+'</td>';
        			moodhtml+='<td>'+Base.getConsText(CONSTANT.MOOD_TYPE,mood.moodStatus)+'</td>';
        			moodhtml+='<td>'+mood.moodDescribe+'</td></tr>';
        		});
        		$('.moodlist').html(moodhtml);
        		
        		
        		$("#pagination2").pagination(data.page.totalPages, {
        			callback :function(page_index, jq){
		        				current_page = page_index + 1;
					    		self.mood(current_page);
					    		return true;
        			},
    				items_per_page : 1,
    				prev_text : "<<",
    				next_text : ">>",
    				num_edge_entries : 1, //边缘值
    				ellipse_text : '...', //边缘显示
    				num_display_entries : 3, //显示条数
    				current_page : pgn - 1,
    				show_if_single_page:true,
    				link_to : "javascript:void(0)"
    			});
	        });
        },
        promotion:function(pgn){
        	var self = this;
        	var params = {
        			pgn:pgn,
        			userId:$.cookie("mskluserid"),
        			type:"promotion"
        		};
        		
	        	Base.commajax("/patient/sufferer/sufferer_info_page.htm","get",params,function(data){
        		var promotiomhtml="";
        		$.each(data.promotionlist,function(i,promotion){
        			promotiomhtml+='<tr><td>'+promotion.infoTitle+'</td>';
        			promotiomhtml+='<td>'+promotion.infoContent+'</td>';
        			promotiomhtml+='<td>'+Base.getConsText(CONSTANT.ACTIVE_TYPE,promotion.status)+'</td>';
        			promotiomhtml+='<td>'+promotion.signupDatetime+'</td></tr>';
        		});
        		$('.promotionlist').html(promotiomhtml);
        		
   
        		$("#pagination3").pagination(data.page.totalPages, {
        			callback :function(page_index, jq){
		        				current_page = page_index + 1;
					    		self.promotion(current_page);
					    		return true;
        			},
    				items_per_page : 1,
    				prev_text : "<<",
    				next_text : ">>",
    				num_edge_entries : 1, //边缘值
    				ellipse_text : '...', //边缘显示
    				num_display_entries : 3, //显示条数
    				current_page : pgn - 1,
    				show_if_single_page:true,
    				link_to : "javascript:void(0)"
    			});
	        });
        },
        view_info:function(id){
        	Base.commajax("/patient/sufferer/sufferer_info.htm","get",{userId:id},function(data){
        		baseinfo=data.list[0];
        		banklist=data.banklist;
        		adresslist=data.adresslist;
        		
        		$('.promotionSum').html(data.sumPromotion);
        		$('.promotionRun').html(data.activePromotion);
        		$('.promotionOver').html(data.overPromotion);
        		
        		
        		$('.adressSum').html($.trim(adresslist)==""?0:adresslist.length);
        		var adresshtml="";
        		$.each(adresslist,function(i,adress){
        			adresshtml+='<tr><td>'+adress.linkName+'</td>';
        			adresshtml+='<td>'+adress.linkMobile+'</td>';
        			adresshtml+='<td>'+adress.province+adress.city+adress.area+'</td>';
        			adresshtml+='<td>'+adress.userAddressConntent+'</td></tr>';
        		});
        		$('.adresslist').html(adresshtml);
        		
        		
        		
        		if(baseinfo.cardStatus=='1'){
        			baseinfo.cardStatus='审核中';
        			$(".idcard>div").text('审核中');
        		}else if(baseinfo.cardStatus=='2'){
        			baseinfo.cardStatus='审核通过';
        			$(".idcard>div").remove();
        		}else{
        			baseinfo.cardStatus='未通过审核';
        			$(".idcard>div").text('未通过审核');
        		}
        		if($.trim(baseinfo.cardUrl)){
        			$(".idcard>img")[0].src=data.url+$.trim(baseinfo.cardUrl);
        		}
        		
        		var html='<label>处方照片照片： </label>';
        		var pc_photo = baseinfo.pc_photo;
        		if(pc_photo){
        			pc_photo=pc_photo.split(',');
        			$.each(pc_photo,function(i,imgurl){
        				if(baseinfo.pc_status=='1'){
        					html+='<div class="view"><img src='+data.url+imgurl+' width="128" height="128" '+
        					'class="img-border border-blue radius" /><div class="mask">审核中</div></div>';
        				}else if(baseinfo.pc_status=='2'){
        					html+='<div class="view"><img src='+data.url+imgurl+' width="128" height="128" '+
        					'class="img-border border-blue radius" /></div>';
        				}else{
        					html+='<div class="view"><img src='+data.url+imgurl+' width="128" height="128" '+
        					'class="img-border border-blue radius" /><div class="mask">审核失败</div></div>';
        				}
        			});
        		}
		    		
        		$('.cfimg').html(html);
        		for(var i in baseinfo){
        			$('.'+i).text(baseinfo[i]); 
        		} 
        		
        	});
        	
        	
        	
        },
    	/*page_callback:function(page_index, jq) {
    		var self = this;
    		current_page = page_index + 1;
    		self.inte(current_page);
    		return true;
    	},*/

    	
    	
    	
	};
    	
    
})(jQuery);
