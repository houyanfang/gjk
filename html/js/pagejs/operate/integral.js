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
    			html='<tr> <td colspan="8">无数据</td></tr>';
    		}
	    		$.each(data, function (i, data) {
	    			
	    			html += '<tr>'+
	    			'<td>'+data.orderNo+'</td>'+
	    			'<td>'+data.productName+'</td>'+
	    			'<td>'+data.userNickName+'</td>'+
	    			'<td>'+data.mobile+'</td>'+
	    			'<td>'+data.userAddressConntent+'</td>'+
	    			'<td>'+data.createDatetime+'</td>'+
	    			'<td>'+data.userDiseaseName+'</td>'+
	    			'<td >'+Base.getConsText(CONSTANT.ORDER_TYPE,data.orderStatus)+'</td>'+
	    			'</tr>';
	    		});
    		$(".msklIntegrallist").html(html);
    	},
    	init_list:function(pgn,disease,productName){
    		var self = this;
    		var params = $('#msklIntegralFrom').serialize()+"&pgn="+pgn;
    		Base.commajax("/operate/integral/integral_list.htm","get",params,function(data){
    			$('.sum').text(data.sum); 
    			self.initHtml(data.list);
    			
    			var html="";
    			if(disease){
    				html="<option value='"+disease+"' >"+disease+"</option>";
    			}
    			html+="<option value='' >全部</option>";
    			$.each(data.disease, function (i, disease) {
    				html+="<option value='"+disease.diseaseName+"' >"+disease.diseaseName+"</option>";
    			});
				$('select[name="userDiseaseName"]').html(html);
				
				
				var proHtml="";
				if(productName){
					proHtml="<option value='"+productName+"' >"+productName+"</option>";
				}
				proHtml+="<option value='' >全部</option>";
				$.each(data.product, function (i, product) {
					proHtml+="<option value='"+product.productName+"' >"+product.productName+"</option>";
				});
				$('select[name="productName"]').html(proHtml);
    			
    			
    			
        		var pagearr={
        				id:"#pagination",
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.init_list(page_index + 1,$('select[name="userDiseaseName"]').val(),$('select[name="productName"]').val());
    				return true;
    			});
        		
        		
    		});
        },
        init:function(pgn){
        	var self = this, $el = self.$element,config=this.options;
    		if(config.init){
    			self.init_list(pgn);
    		}
    		
    		$el.find("#msklIntegralSearch").off('click').on('click' , function(){
	        	self.init_list(1,$('select[name="userDiseaseName"]').val(),$('select[name="productName"]').val());
        	});
    		
        }
	};
    	
    
})(jQuery);
