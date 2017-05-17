(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.withdrawals = function (option) {
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
    			html='<tr> <td colspan="12">无数据</td></tr>';
    		}
	    		$.each(data, function (i, data) {
	    			
	    			html += '<tr>'+
	    			'<td>'+data.userNickName+'</td>'+
	    			'<td>'+data.mobile+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.USER_TYPE,data.userType)+'</td>'+
	    			'<td>'+data.userRealName+'</td>'+
	    			'<td>'+data.amount+'</td>'+
	    			'<td>'+data.bankName+'</td>'+
	    			'<td>'+data.cardNo+'</td>'+
	    			'<td>'+data.bankBranchName+'</td>'+
	    			'<td>'+data.application_dateTime+'</td>'+
	    			'<td>'+(data.reviewStatus=="1"?"已打款":"未打款")+'</td>'+
	    			'<td>'+data.payDatetime+'</td>';
	    			html += '<td>';
	    			if(data.reviewStatus!="1"){
	    				html += '<div class="button-group">';
	    				html += '<a data-id='+data.id+' class="update-money button border-main" href="javascript:void(0)">打款</a>';
	    				html += '</div>';
	    			}
	    			html += '</td>';
	    			html += '</tr>';
	    		});
    		$(".withdrawalslist").html(html);
    	},
    	init_list:function(pgn,bankName){
    		var self = this, $el = self.$element;
    		var params = $('#withdrawalsFrom').serialize()+"&pgn="+pgn;
    		Base.commajax("/custom/withdrawals/withdrawals_list.htm","get",params,function(data){
    			console.log(data);
    			$('.sum').text(data.sum); 
    			var html="";
    			if(bankName){
    				html="<option value='"+bankName+"' >"+bankName+"</option>";
    			}
    			html+="<option value='' >未选择</option>";
    			$.each(data.banks, function (i, bank) {
    				html+="<option value='"+bank.bank_name+"' >"+bank.bank_name+"</option>";
    			});
    			$("#bankName").html(html);
    			
    			
        		self.initHtml(data.list);
        		
        		
        		var pagearr={
        				id:"#pagination",
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.init_list(page_index + 1,$("#bankName").val());
    				return true;
    			});

        		
        		$el.find(".update-money").off('click').on('click' , function(){
        			var id=$(this).data("id");
            		Base.commajax("/custom/withdrawals/withdrawals_update.htm","post",{status:"1",id:id},function(data){
            			self.init_list(1);
            			console.log(data);
            		});
        		});
        		
        		
        		
    		});
        },
        init:function(pgn){
        	var self = this, $el = self.$element,config=this.options;
    		if(config.init){
    			self.init_list(pgn);
    		}
    		
    		$el.find("#msklWithsearch").off('click').on('click' , function(){
	        	self.init_list(1,$("#bankName").val());
        	});
        }
	};
    	
    
})(jQuery);
