(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.integral = function (option) {
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
	    			'<td>'+Base.getConsText(CONSTANT.ORDER_PAY_TYPE,data.payState)+'</td>'+
	    			'<td>'+data.createDatetime+'</td>'+
	    			'<td>'+data.userRealName+'</td>'+
	    			'<td>'+data.province+data.city+data.area+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.ORDER_STSTUS_TYPE,data.orderStatus)+'</td>'+
	    			'<td>'+data.linkMobile+'</td>'+
	    			'<td>'+data.productName+'</td>'+
	    			'<td>'+data.orderMoney+'</td>'+
	    			'<td>'+
	    			'<div class="button-group">';
	    			if(data.orderStatus!="2"){
	    				html += '<a data-id='+data.id+' class="update_inte button border-main" href="javascript:void(0)">发货</a>';
	    			}
	    			html += '</div>';
	    			html += '</td>';
	    			html += '</tr>';
	    		});
    		$(".intelist").html(html);
    	},
    	init_list:function(pgn){
    		var self = this, $el = self.$element;
    		var params = $('#integralFrom').serialize()+"&pgn="+pgn;
    		Base.commajax("/custom/integral/integral_list.htm","get",params,function(data){
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

        		
        		$el.find(".update_inte").off('click').on('click' , function(){
        			var id=$(this).data("id");
            		Base.commajax("/custom/integral/integral_updata.htm","post",{id:id},function(data){
            			self.init_list(1);
            		});
        		});
        		
        		
        		
    		});
        },
        init:function(pgn){
        	var self = this, $el = self.$element,config=this.options;
    		if(config.init){
    			self.init_list(pgn);
    		}
    		
    		$el.find("#msklIntesearch").off('click').on('click' , function(){
	        	self.init_list(1);
        	});
        },
	};
    	
    
})(jQuery);
