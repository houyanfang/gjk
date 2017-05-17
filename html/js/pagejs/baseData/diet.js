(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.diet = function (option) {
        return new JqPort(this, option);
    };
    var JqPort = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], options);
        this.init(1);
    };
    
    JqPort.prototype = {
    	constructor: JqPort,
    	initHtml:function(datas,url){
    		var html='';
    		if(datas.length==0){
    			html='<tr> <td colspan="6">无数据</td></tr>';
    		}
	    		$.each(datas, function (i, data) {
	    			html += '<tr>'+
	    			'<td>'+Base.getConsText(CONSTANT.BASE_DIET_TYPE,data.isGood)+'</td>'+
	    			'<td>'+data.dietTypeName+'</td>'+
	    			'<td>'+data.updateDate+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.BASE_TYPE,data.isDelete)+'</td>'+
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
    		$(".msklDietList").html(html);
    	},
    	init_list:function(pgn){
    		var self = this;
    		var params = $('#msklDietFrom').serialize()+"&pgn="+pgn;
    		
    		Base.commajax("/baseData/diet/diet_list.htm","get",params,function(data){
    			console.log(data);
    			$('.sum').text(data.sum); 
    			self.initHtml(data.list);
    			
				
				
        		var pagearr={
        				id:"#pagination",
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.init_list(page_index + 1);
    				return true;
    			});
        		
        		
        		
        		$(".show-update").off('click').on('click' , function(){
        			var id = $(this).data("id");
        			$(".show_open_view").click();
    				
    				Base.commajax("/baseData/diet/diet_list.htm","get",{id:id},function(data){
    					console.log(data);
        				Base.emptyForm('#dietAddForm');
            			Base.setValueForFrom('#dietAddForm',data.list[0]);
            			Base.checkValue=data.list[0].dietTypeName;
            			
            			 $("#dietAddForm").find(':radio').each(function () {
            				 if($(this).val()==data.list[0].isDelete){
            					 $(this).prop("checked", true);
            				 }
            			 });
            			
    					self.addAndUpd();
            		});
    				
            	});
        		$(".show-del").off('click').on('click' , function(){
        			Base.commajax("/baseData/diet/add_diet.htm","post",{id:$(this).data("id"),isDelete:"0"},function(data){
        				msg=data.message+";pages/baseData/diet.html;2;#"+data.success;
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
    		}
    		
    		$el.find("#msklDietSearch").off('click').on('click' , function(){
	        	self.init_list(1);
        	});
    		
    		$el.find(".addDietView").off('click').on('click' , function(){
    			$(".show_open_view").click();
    			self.addAndUpd();
    		});
    		
        },
        addAndUpd:function(){
        	$(".addDiet").off('click').on('click' , function(){
    			if( !Base.validate("#dietAddForm")){
                	return false;
                };
    			var params = $('#dietAddForm').serialize();
    			Base.commajax("/baseData/diet/add_diet.htm","post",params,function(data){
    				msg=data.message+";pages/baseData/diet.html;2;#"+data.success;
	        		$.cookie("msg" , msg);
	        		Base.getPage("pages/tips.html");
	        		$(".view_close").click();
	        		$('#show_diet_open').remove();
    			});
    		});
        }
	};
    	
    
})(jQuery);
