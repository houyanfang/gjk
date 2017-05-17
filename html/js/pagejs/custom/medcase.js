(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.medcase = function (option) {
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
    			html='<tr> <td colspan="5">无数据</td></tr>';
    		}
	    		$.each(data, function (i, data) {
	    			
	    			html += '<tr>'+
	    			'<td>'+data.userNickName+'</td>'+
	    			'<td>'+data.mobile+'</td>'+
	    			'<td>'+data.creadTime+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.MED_CASE_TYPE,data.status)+'</td>'+
	    			'<td>'+
	    			'<div class="button-group">'+
	    			'<a data-id='+data.id+' class="update_medcase button border-main" href="javascript:void(0)">操作</a>'+
	    			'</div>'+
	    			'</td>'+
	    			'</tr>';
	    		});
    		$(".medcaselist").html(html);
    	},
    	init_list:function(pgn){
    		var self = this;
    		var params = $('#medcasefrom').serialize()+"&pgn="+pgn;
    		Base.commajax("/custom/medcase/medcase_list.htm","get",params,function(data){
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

        		
        		$(".update_medcase").off('click').on('click' , function(){
        			var id=$(this).data("id");
        			$(".check_mendcase_open").click();
        			
        			Base.commajax("/custom/medcase/medcase_list.htm","get",{id:id},function(data){
        				console.log(data);
        				var list=data.list[0];
        				Base.emptyForm('#medcaseFrom');
        				Base.removeFormDisable('#medcaseFrom');
        				$(".med-status").html(Base.getConsText(CONSTANT.MED_CASE_TYPE,list.status));
        				if(list.status=="2"){
	        					$(".medCasePass").remove();
	        					$(".medCaseUpdate").remove();
	        					Base.setFormDisable('#medcaseFrom');
        					};
        					Base.setValueForFrom('#medcaseFrom',list);
    					var html="";
        				$.each(list.medRecordPhoto.split(","),function(i,img){
        					html+='<img class="idcardimg" src="'+data.url+img+'" width="120" height="120" class="img-border border-blue radius" />';
        				});
        				$(".medphoto").html(html);
        				
        				
        				var diseasehtml='';
        				$.each(data.disease,function(i,disease){
        					diseasehtml+='<option value="'+disease.diseaseName+'" >'+disease.diseaseName+'</option>';
        				});
        				$('select[name="medRecordType"]').html(diseasehtml);
        				
        				Base.setValueForFrom('#medcaseFrom',list);
            		});
        			
        			
        			
        			
        			$(".medCasePass").off('click').on('click' , function(){
        				var params = $('#medcaseFrom').serialize()+"&id="+id+"&status=2";
        				Base.commajax("/custom/medcase/medcase_update.htm","post",params,function(data){
            				$(".check_close").click();
            				self.init_list(1);
                		});
        				
        			});
        			$(".medCaseUnPass").off('click').on('click' , function(){
        				var params = $('#medcaseFrom').serialize()+"&id="+id+"&status=3";
        				Base.commajax("/custom/medcase/medcase_update.htm","post",params,function(data){
            				$(".check_close").click();
            				self.init_list(1);
                		});
        				
        			});
        			$(".medCaseUpdate").off('click').on('click' , function(){
        				var params = $('#medcaseFrom').serialize()+"&id="+id;
        				Base.commajax("/custom/medcase/medcase_update.htm","post",params,function(data){
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
    		
    		$el.find("#medcaseSearch").off('click').on('click' , function(){
	        	self.init_list(1);
        	});
    		
        },
	};
    	
    
})(jQuery);
