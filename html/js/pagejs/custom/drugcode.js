(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.drugcode = function (option) {
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
    			html='<tr> <td colspan="6">无数据</td></tr>';
    		}
	    		$.each(data, function (i, data) {
	    			
	    			html += '<tr>'+
	    			'<td>'+data.userNickName+'</td>'+
	    			'<td>'+data.mobile+'</td>'+
	    			'<td>'+data.infoTitle+'</td>'+
	    			'<td>'+data.medCode+'</td>'+
	    			'<td>'+data.dateline+'</td>'+
	    			'<td>'+
	    			'<div class="button-group">'+
	    			'<a data-id='+data.id+' class="del_drug button border-main" href="javascript:void(0)">删除</a>'+
	    			'</div>'+
	    			'</td>'+
	    			'</tr>';
	    		});
    		$(".druglist").html(html);
    	},
    	init_list:function(pgn,infoTitle){
    		var self = this, $el = self.$element;
    		var params = $('#drugcodeFrom').serialize()+"&pgn="+pgn;
    		Base.commajax("/custom/drugcode/drugcode_list.htm","get",params,function(data){
    			console.log(data);
    			$('.sum').text(data.sum); 
    			var html="";
    			if(infoTitle){
    				html="<option value='"+infoTitle+"' >"+infoTitle+"</option>";
    			}
    			html+="<option value='' >全部</option>";
    			$.each(data.promotions, function (i, promotion) {
    				html+="<option value='"+promotion.infoTitle+"' >"+promotion.infoTitle+"</option>";
    			});
    			$("#infoTitle").html(html);
    			
    			
        		self.initHtml(data.list);
        		
        		
        		var pagearr={
        				id:"#pagination",
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.init_list(page_index + 1,$("#infoTitle").val());
    				return true;
    			});

        		
        		$el.find(".del_drug").off('click').on('click' , function(){
        			var id=$(this).data("id");
            		Base.commajax("/custom/drugcode/drugcode_del.htm","get",{id:id},function(data){
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
    		
    		$el.find("#msklMedCodesearch").off('click').on('click' , function(){
	        	self.init_list(1,$("#infoTitle").val());
        	});
        }
	};
    	
    
})(jQuery);
