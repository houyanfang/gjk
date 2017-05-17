(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.news = function (option) {
        return new JqPort(this, option);
    };
    var JqPort = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], options);
        this.init(1);
    };
    
    JqPort.prototype = {
    	constructor: JqPort,
    	initHtml:function(data){
    		var html='';
    		if(data.length==0){
    			html='<tr> <td colspan="7">无数据</td></tr>';
    		}
	    		$.each(data, function (i, data) {
	    			
	    			html += '<tr>'+
	    			'<td>'+data.userNickName+'</td>'+
	    			'<td>'+data.mobile+'</td>'+
	    			'<td title="'+data.pushMsgTitle+'">'+data.pushMsgTitle+'</td>'+
	    			'<td title="'+data.msgContent+'">'+data.msgContent+'</td>'+
	    			'<td title="'+data.createDatetime+'">'+data.createDatetime+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.READ_TYPE,data.isRead)+'</td>'+
	    			'<td title="'+data.updateDatetime+'">'+data.updateDatetime+'</td>'+
	    			'</tr>';
	    		});
    		$(".msklNewslist").html(html);
    	},
    	init_list:function(pgn){
    		var self = this;
    		var params = $('#msklNewsFrom').serialize()+"&pgn="+pgn;
    		Base.commajax("/operate/news/news_list.htm","get",params,function(data){
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
        		
        		
    		});
        },
        init:function(pgn){
        	var self = this, $el = self.$element,config=this.options;
    		if(config.init){
    			self.init_list(pgn);
    		}
    		
    		$el.find("#msklNewsearch").off('click').on('click' , function(){
	        	self.init_list(1);
        	});
    		
    		
    		
    		
    		
        }
	};
    	
    
})(jQuery);
