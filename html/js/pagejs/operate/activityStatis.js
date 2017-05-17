(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.activityStatis = function (option) {
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
    			html='<tr> <td colspan="11">无数据</td></tr>';
    		}
	    		$.each(data, function (i, data) {
	    			
	    			html += '<tr>'+
	    			'<td>'+data.userNickName+'</td>'+
	    			'<td>'+data.mobile+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.ACTIVE_TYPE,data.status)+'</td>'+
	    			'<td>'+data.infoTitle+'</td>'+
	    			'<td>'+data.taskStartDatetime+'</td>'+
	    			'<td>'+data.sex+'</td>'+
	    			'<td>'+data.medicalName+'</td>'+
	    			'<td>'+data.takendays+'</td>'+
	    			'<td>'+data.manufacturer+'</td>'+
	    			'<td>'+data.signupDatetime+'</td>'+
	    			
	    			'</tr>';
	    		});
    		$(".msklactivitylist").html(html);
    	},
    	init_list:function(pgn,infoTitle){
    		var self = this;
    		var params = $('#usersfrom').serialize()+"&pgn="+pgn;
    		
    		Base.commajax("/operate/activityStatis/activityStatis_list.htm","get",params,function(data){
    			console.log(data);
    			$('.sum').text(data.sum); 
    			self.initHtml(data.list);
    			
    			
    			var html="";
    			if(infoTitle){
    				html="<option value='"+infoTitle+"' >"+infoTitle+"</option>";
    			}
    			html+="<option value='' >全部</option>";
    			$.each(data.promotions, function (i, promotion) {
    				html+="<option value='"+promotion.infoTitle+"' >"+promotion.infoTitle+"</option>";
    			});
				$('select[name="infoTitle"]').html(html);
        		
				
				
        		var pagearr={
        				id:"#pagination",
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.init_list(page_index + 1,$('select[name="infoTitle"]').val());
    				return true;
    			});

        		
    		});
        },
        init:function(pgn){
        	var self = this, $el = self.$element,config=this.options;
    		if(config.init){
    			self.init_list(pgn);
    		}
    		
    		$el.find("#msklUserSearch").off('click').on('click' , function(){
	        	self.init_list(1,$('select[name="infoTitle"]').val());
        	});
    		
    		
        },
	};
    	
    
})(jQuery);
