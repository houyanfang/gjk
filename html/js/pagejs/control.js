(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.control = function (option) {
        return new JqPort(this, option);
    };
    $.fn.control.defaults = {
    };
    var JqPort = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], $.fn.control.defaults, options);
        this.init(1);
    };
    
    JqPort.prototype = {
    	constructor: JqPort,
    	initHtml:function(data){
    		var html='';
    		if(data.length==0){
    			html='<tr> <td colspan="9">无数据</td></tr>';
    		}
	    		$.each(data, function (i, data) {
	    			html += '<tr>'+
	    			'<td>'+(i+1)+'</td>'+
	    			'<td>'+data.userName+'</td>'+
	    			'<td>'+data.userNickName+'</td>'+
	    			'<td>'+data.sex+'</td>'+
	    			'<td>'+data.userAge+'</td>'+
	    			'<td>'+data.mobile+'</td><td></td>'+
	    			'<td>'+data.kindred+'</td>'+
	    			'<td>'+data.updateDatetime+'</td>'+
	    			'</tr>';
	    		});
    		$(".controlList").html(html);
    		
    	},
    	init:function(pgn){
    		var self = this;
    		var params = $('#controlUser').serialize()+"&pgn="+pgn;
        	Base.commajax("/patient/control/control_list.htm","get",params,function(data){
        		$('.todayNum').html(data.todayNum);
        		$('.userSum').html(data.sum);
        		self.initHtml(data.list);
        		var pagearr={
        				id:"#pagination",
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.planinfo(page_index + 1);
    				return true;
    			});

        	});
        	$("#controlsearch").off('click').on('click' , function(){
            	self.init(1);
    		});
        	
        	
    	}

	};
    	
    
})(jQuery);
