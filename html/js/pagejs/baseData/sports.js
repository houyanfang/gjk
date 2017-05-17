(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.sports = function (option) {
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
	    			'<td>'+Base.getConsText(CONSTANT.BASE_SPORTS_TYPE,data.sportsType)+'</td>'+
	    			'<td>'+data.sportName+'</td>'+
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
    		$(".msklsportsList").html(html);
    	},
    	init_list:function(pgn){
    		var self = this;
    		var params = $('#msklSportsFrom').serialize()+"&pgn="+pgn;
    		
    		Base.commajax("/baseData/sports/sports_list.htm","get",params,function(data){
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
    				
    				Base.commajax("/baseData/sports/sports_list.htm","get",{id:id},function(data){
    					console.log(data);
        				Base.emptyForm('#sportAddForm');
            			Base.setValueForFrom('#sportAddForm',data.list[0]);
            			Base.checkValue=data.list[0].sportName;
            			
            			 $("#sportAddForm").find(':radio').each(function () {
            				 if($(this).val()==data.list[0].isDelete){
            					 $(this).prop("checked", true);
            				 }
            			 });
            			
    					self.addAndUpd();
            		});
    				
            	});
        		$(".show-del").off('click').on('click' , function(){
        			Base.commajax("/baseData/sports/add_sports.htm","post",{id:$(this).data("id"),isDelete:"0"},function(data){
        				msg=data.message+";pages/baseData/sports.html;2;#"+data.success;
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
    		
    		$el.find("#msklSportsSearch").off('click').on('click' , function(){
	        	self.init_list(1);
        	});
    		
    		$el.find(".addSportsView").off('click').on('click' , function(){
    			$(".show_open_view").click();
    			self.addAndUpd();
    		});
    		
        },
        addAndUpd:function(){
        	$(".addSoprts").off('click').on('click' , function(){
    			if( !Base.validate("#sportAddForm")){
                	return false;
                };
    			var params = $('#sportAddForm').serialize();
    			Base.commajax("/baseData/sports/add_sports.htm","post",params,function(data){
    				msg=data.message+";pages/baseData/sports.html;2;#"+data.success;
	        		$.cookie("msg" , msg);
	        		Base.getPage("pages/tips.html");
	        		$(".view_close").click();
	        		$('#show_sports_open').remove();
    			});
    		});
        }
	};
    	
    
})(jQuery);
