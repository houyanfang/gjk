(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.bank = function (option) {
        return new JqPort(this, option);
    };
    $.fn.bank.defaults = {
    };
    var JqPort = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], $.fn.bank.defaults, options);
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
	    			'<td title="'+data.mobile+'">'+data.mobile+'</td>'+
	    			'<td title="'+data.createTime+'">'+data.createTime+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.IDENTCARD_TYPE,data.miStatus)+'</td>'+
	    			'<td title="'+data.userRealName+'">'+data.userRealName+'</td>'+
	    			'<td title="'+data.cardNo+'">'+data.cardNo+'</td>'+
	    			'<td title="'+data.bankName+'">'+data.bankName+'</td>'+
	    			'<td title="'+data.bankBranchName+'">'+data.bankBranchName+'</td>'+
	    			'<td title="'+data.bankAddrNo+'">'+data.bankAddrNo+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.BANK_TYPE,data.mbStatus)+'</td>'+
	    			'<td>'+
	    			'<div class="button-group">'+
	    			'<a data-miid="'+data.miid+'" data-mbid="'+data.mbid+'" class="show-idcheck button border-main" href="javascript:void(0)">身份审核</a>'+
	    			'</div>'+
	    			'</td>'+
	    			'<td>'+
	    			'<div class="button-group">'+
	    			'<a data-miid="'+data.miid+'" data-mbid="'+data.mbid+'" class="show-bacheck button border-main" href="javascript:void(0)">银行卡审核</a>'+
	    			'</div>'+
	    			'</td>'+
	    			'</tr>';
	    		});
    		$(".banklist").html(html);
    	},
    	init_list:function(pgn){
    		var self = this, $el = self.$element,config=this.options;
    		var params = $('#msklBank').serialize()+"&pgn="+pgn;
    		Base.commajax("/custom/bank/bank_list.htm","get",params,function(data){
    			console.log(data);
        		for(var i in data){
        			$('.'+i).text(data[i]); 
        		} 
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

        		
        		$el.find(".show-idcheck").off('click').on('click' , function(){
        			$(".check_bank_open").click();
        			$(".plan_type").html("身份审核");
        			Base.commajax("/custom/bank/bank_show_info.htm","get",{id:$(this).data("mbid")},function(data){
        				config.miid=data.list.miid;
        				config.userId=data.list.userId;
        				if(data.list.mistatus==2){
        					$(".IdentPass").remove();
        					$(".IdentUpdate").remove();
        					Base.emptyForm(".identfrom");
        					Base.setFormDisable('.identfrom');
    					};
            			console.log(data);
            			Base.setValueForFrom('.identfrom',data.list);
            			$(".idcardimg")[0].src=data.url+data.list.url;
            			
            			$(".bankfrom").addClass("hidden");
            			$(".identfrom").removeClass("hidden");
            		});
        			$(".IdentUpdate").off('click').on('click' , function(){
        				var params = $('.identfrom').serialize()+"&type=info&id="+config.userId;
        				console.log(params);
        				Base.commajax("/custom/bank/bank_update_info.htm","post",params,function(data){
        					if(data.success){
        						alert(data.message);	
        						$(".check_close").click();
        						self.init_list(1);
        					}else{
        						alert(data.message);	
        					}
                		});
        				Base.removeFormDisable('.identfrom');
        			});
        			$(".IdentPass").off('click').on('click' , function(){
        				Base.commajax("/custom/bank/bank_update_info.htm","post",{status:"2",type:"identcard",id:config.miid},function(data){
        					if(data.success){
        						alert(data.message);	
        						$(".check_close").click();
        						self.init_list(1);
        					}else{
        						alert(data.message);	
        					}
                		});
        			});
        			$(".IdentUnPass").off('click').on('click' , function(){
        				Base.commajax("/custom/bank/bank_update_info.htm","post",{status:"3",type:"identcard",id:config.miid},function(data){
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
        		$el.find(".show-bacheck").off('click').on('click' , function(){
        			$(".check_bank_open").click();
        			$(".plan_type").html("银行卡审核");
        			Base.commajax("/custom/bank/bank_show_info.htm","get",{id:$(this).data("mbid")},function(data){
        				console.log(data);
        				config.mbid=data.list.mbid;
        				if(data.list.mbStatus==2){
        					$(".BankPass").remove();
        					};
        				
        				Base.emptyForm(".bankfrom");
        				Base.setValueForFrom('.bankfrom',data.list);
        				Base.setFormDisable('.bankfrom');
        				$(".bankfrom")[0].src=data.url+data.list.url;
        				
        				$(".bankfrom").removeClass("hidden");
        				$(".identfrom").addClass("hidden");
        			});
        			
        			$(".BankPass").off('click').on('click' , function(){
        				Base.commajax("/custom/bank/bank_update_info.htm","post",{status:"2",type:"bank",id:config.mbid},function(data){
        					if(data.success){
        						alert(data.message);	
        						$(".check_close").click();
        						self.init_list(1);
        					}else{
        						alert(data.message);	
        					}
                		});
        			});
        			$(".BankUnPass").off('click').on('click' , function(){
        				Base.commajax("/custom/bank/bank_update_info.htm","post",{status:"3",type:"bank",id:config.mbid},function(data){
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
        		
        		
        		
        		
    		});
        },
        init:function(pgn){
        	var self = this, $el = self.$element,config=this.options;
    		if(config.init){
    			self.init_list(pgn);
    		}
    		
    		$el.find("#msklBankSearch").off('click').on('click' , function(){
    			self.init_list(1);
    		});
        }

    	
    	
    	
	};
    	
    
})(jQuery);
