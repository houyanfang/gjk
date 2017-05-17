(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.healthy = function (option) {
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
    			html='<tr> <td colspan="9">无数据</td></tr>';
    		}
	    		$.each(data, function (i, data) {
	    			
	    			html += '<tr>'+
	    			'<td></td>'+
	    			'<td></td>'+
	    			'<td></td>'+
	    			'<td></td>'+
	    			'<td></td>'+
	    			'<td></td>'+
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
	    			'<td>'+
	    			'<div class="button-group">'+
	    			'<a data-id='+data.id+' class="show-del button border-main" href="javascript:void(0)"><span class="icon-bars"></span>编辑</a>'+
	    			'</div>'+
	    			'</td>'+
	    			'</tr>';
	    		});
    		$(".mskldiseaseList").html(html);
    	},
    	init_list:function(pgn,diseaseName){
    		var self = this;
    		var params = $('#msklDiseaseFrom').serialize()+"&pgn="+pgn;
    		
    		Base.commajax("/baseData/healthy/healthy_list.htm","get",params,function(data){
    			console.log(data);
    			$('.sum').text(data.sum); 
    			self.initHtml(data.list);
    			
    			var html="";
    			if(diseaseName){
    				html="<option value='"+diseaseName+"' >"+diseaseName+"</option>";
    			}
    			html+="<option value='' >全部</option>";
    			$.each(data.diseases, function (i, disease) {
    				html+="<option value='"+disease.diseaseName+"' >"+disease.diseaseName+"</option>";
    			});
				$('select[name="diseaseName"]').html(html);
    			
    			
        		var pagearr={
        				id:"#pagination",
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.init_list(page_index + 1,$('select[name="diseaseName"]').val());
    				return true;
    			});
        		
        		
        		
        		$(".show-update").off('click').on('click' , function(){
        			var id = $(this).data("id");
        			$(".check_bank_open").click();
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
    		
    		$el.find("#msklDiseaseSearch").off('click').on('click' , function(){
	        	self.init_list(1,$('select[name="diseaseName"]').val());
        	});
    		
    		
    		
    		$el.find(".addDiseaseView").off('click').on('click' , function(){
    				$(".show_open_view").click();
    		});
    		
    		
    		$el.find(".addActivity").off('click').on('click' , function(){
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
    		
        },
        addAndUpdate:function(){
        	id=$.cookie("activityId");
        	if(id){
        		Base.commajax("/operate/activity/activity_list.htm","get",{id:id},function(data){
        			Base.setValueForFrom('#activityAddFrom',data.list[0]);
        		});
        	}
        },
	};
    	
    
})(jQuery);
