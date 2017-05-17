(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.medinfo = function (option) {
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
	    			'<td>'+data.normalName+'</td>'+
	    			'<td>'+data.medicalName+'</td>'+
	    			'<td>'+data.manufacturer+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.MED_INFO_TYPE,data.status)+'</td>'+
	    			'<td>'+data.createTime+'</td>'+
	    			'<td>'+
	    			'<div class="button-group">'+
	    			'<a data-id='+data.id+' class="update_medinfo button border-main" href="javascript:void(0)">操作</a>'+
	    			'</div>'+
	    			'</td>'+
	    			'</tr>';
	    		});
    		$(".medinfolist").html(html);
    	},
    	init_list:function(pgn){
    		var self = this, $el = self.$element;
    		var params = $('#medinfofrom').serialize()+"&pgn="+pgn;
    		Base.commajax("/custom/medinfo/medinfo_list.htm","get",params,function(data){
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
        			alert(id);
//            		Base.commajax("/custom/drugcode/drugcode_del.htm","get",{id:id},function(data){
//            			console.log(data);
//            		});
        		});
        		
        		$(".update_medinfo").off('click').on('click' , function(){
        			var id=$(this).data("id");
        			$(".check_mendinfo_open").click();
        			
        			Base.commajax("/custom/medinfo/medinfo_list.htm","get",{id:id},function(data){
        				console.log(data);
        				if(data.list[0].status=="1"){
        					$(".medPass").remove();
        					$(".medUnPass").remove();
        					};
        				Base.setValueForFrom('#medinfoCheckFrom',data.list[0]);
            		});
        			
        			
        			
        			
        			$(".medPass").off('click').on('click' , function(){
        				var params = $('#medinfoCheckFrom').serialize()+"&medicineSupplyId="+id+"&status=1";
        				Base.commajax("/custom/medinfo/medinfo_update.htm","post",params,function(data){
            				$(".check_close").click();
            				self.init_list(1);
                		});
        				
        			});
        			$(".medUnPass").off('click').on('click' , function(){
        				Base.commajax("/custom/medinfo/medinfo_update.htm","post",{medicineSupplyId:id,status:"0"},function(data){
            				$(".check_close").click();
            				self.init_list(1);
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
    		
    		$el.find("#msklmedinfosearch").off('click').on('click' , function(){
	        	self.init_list(1);
        	});
    		
        },
	};
    	
    
})(jQuery);
