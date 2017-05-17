(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.disease = function (option) {
        return new JqPort(this, option);
    };
    var JqPort = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], options);
        this.init(1);
    };
    
    JqPort.prototype = {
    	constructor: JqPort,
    	initHtml:function(datas,url){
    		var self = this,config=this.options;
    		var html='';
    		if(datas.length==0){
    			html='<tr> <td colspan="6">无数据</td></tr>';
    		}
	    		$.each(datas, function (i, data) {
	    			var pName="";
	    			html += '<tr>';
	    			html += '<td>'+data.diseaseName+'</td>';
	    			
	    			$.each(config.diseases,function(i,Pdata){
	    				if(Pdata.id == data.pId){
	    					pName=Pdata.diseaseName;
	    					return false;
	    				}
	    			});
	    			html += '<td>'+pName+'</td>';
	    			
	    			
	    			html += '<td>'+data.updateTime+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.BASE_TYPE,data.isDelete)+'</td>'+
	    			'<td>'+
	    			'<div class="button-group">'+
	    			'<a data-id='+data.id+' class="show-update button border-main" href="javascript:void(0)"><span class="icon-bars"></span>修改</a>'+
	    			'</div>'+
	    			'</td>'+
	    			'<td>'+
	    			'<div class="button-group">'+
	    			'<a data-id='+data.id+' class="show-del button border-main" href="javascript:void(0)"><span class="icon-bars"></span>删除</a>'+
	    			'</div>'+
	    			'</td>'+
	    			'</tr>';
	    		});
    		$(".mskldiseaseList").html(html);
    	},
    	init_list:function(pgn,diseaseId){
    		var self = this,config=this.options;
    		var params = $('#msklDiseaseFrom').serialize()+"&pgn="+pgn;
    		
    		Base.commajax("/baseData/disease/disease_list.htm","get",params,function(data){
    			console.log(data);
    			$('.sum').text(data.sum); 
    			config.diseases=data.diseases;
    			self.initHtml(data.list);
    			
    			var html="";
    			if(diseaseId){
    				$.each(data.diseases, function (i, disease) {
    					if(diseaseId==disease.id){
    						html="<option value='"+diseaseId+"' >"+disease.diseaseName+"</option>";
    					};
        			});
    			}
    			html+="<option value='' >全部</option>";
    			$.each(data.diseases, function (i, disease) {
    				if(disease.pId == 0){
    					html+="<option value='"+disease.id+"' >"+disease.diseaseName+"</option>";
    				}
    			});
				$('select[name="searchId"]').html(html);
				
				
				
        		var pagearr={
        				id:"#pagination",
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.init_list(page_index + 1,$('select[name="searchId"]').val());
    				return true;
    			});
        		
        		
        		
        		$(".show-update").off('click').on('click' , function(){
        			var id = $(this).data("id");
        			$(".show_open_view").click();
    				
    				Base.commajax("/baseData/disease/disease_list.htm","get",{id:id},function(data){
    					console.log(data);
            			var html="";
            			html+="<option value='0' >全部</option>";
            			$.each(config.diseases, function (i, disease) {
            				if(disease.pId==0){
            					html+="<option value='"+disease.id+"' >"+disease.diseaseName+"</option>";
            				}
            			});
        				$('select[name="pId"]').html(html);
        				Base.emptyForm('#addDiseaseForm');
            			Base.setValueForFrom('#addDiseaseForm',data.list[0]);
            			Base.checkValue=data.list[0].diseaseName;
            			
            			 $("#addDiseaseForm").find(':radio').each(function () {
            				 if($(this).val()==data.list[0].isDelete){
            					 $(this).prop("checked", true);
            				 }
            			 });
            			
        				$(".addDisease").off('click').on('click' , function(){
	        					if( !Base.validate("#addDiseaseForm")){
	        	                	return false;
	        	                };
	        	    			var params = $('#addDiseaseForm').serialize();
	        	    			console.log(params);
	        	    			$('#check_bank').html('');
	        	    			Base.commajax("/baseData/disease/add_disease.htm","post",params,function(data){
	        	    				msg=data.message+";pages/baseData/disease.html;2;#"+data.success;
	        		        		$.cookie("msg" , msg);
	        		        		Base.getPage("pages/tips.html");
	        		        		$(".check_close").click();
	        		        		$('#show_disease_open').remove();
	        	    			});
        	    			
        	    		});
            		});
    				
            	});
        		$(".show-del").off('click').on('click' , function(){
        			Base.commajax("/baseData/disease/add_disease.htm","post",{id:$(this).data("id"),isDelete:"0"},function(data){
        				msg=data.message+";pages/baseData/disease.html;2;#"+data.success;
    	        		$.cookie("msg" , msg);
    	        		Base.getPage("pages/tips.html");
        			});
        		});
        		
    		});
        },
        init:function(pgn){
        	var self = this, $el = self.$element,config=this.options;
    		if(config.init){
    			self.init_list(pgn);
    		}
    		
    		$el.find("#msklDiseaseSearch").off('click').on('click' , function(){
	        	self.init_list(1,$('select[name="searchId"]').val());
        	});
    		
    		
    		
    		$el.find(".addDiseaseView").off('click').on('click' , function(){
    				$(".show_open_view").click();
    				var html="";
        			html+="<option value='0' >全部</option>";
        			$.each(config.diseases, function (i, disease) {
        				if(disease.pId==0){
        					html+="<option value='"+disease.id+"' >"+disease.diseaseName+"</option>";
        				}
        			});
    				$('select[name="pId"]').html(html);
    				
    				
    				$(".addDisease").off('click').on('click' , function(){
    	    			if( !Base.validate("#addDiseaseForm")){
    	                	return false;
    	                };
    	    			var params = $('#addDiseaseForm').serialize();
    	    			console.log(params);
    	    			Base.commajax("/baseData/disease/add_disease.htm","post",params,function(data){
    	    				msg=data.message+";pages/baseData/disease.html;2;#"+data.success;
    		        		$.cookie("msg" , msg);
    		        		Base.getPage("pages/tips.html");
    		        		$(".check_close").click();
    		        		$('#show_disease_open').remove();
    	    			});
    	    		});
    		});
    		
    		
        }
	};
    	
    
})(jQuery);
