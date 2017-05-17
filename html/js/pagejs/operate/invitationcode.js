(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.invitationcode = function (option) {
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
	    			'<td>'+(i+1)+'</td>'+
	    			'<td>'+data.createTime+'</td>'+
	    			'<td>'+data.channelCode+'</td>'+
	    			'<td >'+data.channelName+'</td>'+
	    			'<td >'+data.channelLinkman+'</td>'+
	    			'<td >'+data.count+'</td>'+
	    			'</tr>';
	    		});
    		$(".msklInvitationCodelist").html(html);
    	},
    	init_list:function(pgn){
    		var self = this;
    		var params = $('#msklCodeFrom').serialize()+"&pgn="+pgn;
    		Base.commajax("/operate/invitationcode/invitationcode_list.htm","get",params,function(data){
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
    		
    		$el.find("#msklCodesearch").off('click').on('click' , function(){
	        	self.init_list(1);
        	});
    		
    		$el.find("#mskladdCode").off('click').on('click' , function(){
    			$(".check_bank_open").click();
    			
    			$(".addCode").off('click').on('click' , function(){
    				if( !Base.validate("#codeAddForm")){
                    	return false;
                    };
        			var params = $('#codeAddForm').serialize();
        			console.log(params);
    				Base.commajax("/operate/invitationcode/invitationcode_add.htm","post",params,function(data){
    					if(data.success){
    						alert(data.message);	
    						$(".check_close").click();
    						self.init_list(1);
    					}else{
    						alert(data.message);	
    					}
            		});
        			
    			});
    			
    		});
    		$el.find("#msklExport").off('click').on('click' , function(){
    			var title=['序号','邀请码','渠道','渠道负责人'];
    			Base.commajax("/operate/invitationcode/invitationcode_list.htm","get",{type:"export"},function(data){
        			console.log(data);
        			JSONToExcelConvertor(data.list, "邀请码", title);
            		
        		});
    			
    		});
        }
	};
    	
    
})(jQuery);
