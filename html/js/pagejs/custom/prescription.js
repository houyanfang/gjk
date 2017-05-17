(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.prescription = function (option) {
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
    			html='<tr> <td colspan="14">无数据</td></tr>';
    		}
	    		$.each(data, function (i, data) {
	    			
	    			html += '<tr>'+
	    			'<td>'+(i+1)+'</td>'+
	    			'<td>'+data.userNickName+'</td>'+
	    			'<td>'+data.mobile+'</td>'+
	    			'<td>'+data.userRealName+'</td>'+
	    			'<td>'+data.pcRecordType+'</td>'+
	    			'<td>'+data.createDate+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.PRES_TYPE,data.status)+'</td>'+
	    			'<td>'+
	    			'<div class="button-group">'+
	    			'<a data-id='+data.id+' class="show-check button border-main" href="javascript:void(0)">编辑</a>'+
	    			'</div>'+
	    			'</td>'+
	    			'</tr>';
	    		});
    		$(".prescriptionlist").html(html);
    	},
    	init_list:function(pgn,diseaseName){
    		debugger
    		var self = this, $el = self.$element;
    		var params = $('#msklPrescription').serialize()+"&pgn="+pgn;
    		Base.commajax("/custom/prescription/prescription_list.htm","get",params,function(data){
    			$('.sum').text(data.sum); 
    			var html="";
    			if(diseaseName){
    				html="<option value='"+diseaseName+"' >"+diseaseName+"</option>";
    			}
    			html+="<option value='' >未选择</option>";
    			$.each(data.disease, function (i, disease) {
    				html+="<option value='"+disease.diseaseName+"' >"+disease.diseaseName+"</option>";
    			});
    			$("#pcRecordType").html(html);
        		self.initHtml(data.list);
        		
        		
        		var pagearr={
        				id:"#pagination",
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.init_list(page_index + 1,$("#pcRecordType").val());
    				return true;
    			});

        		
        		$el.find(".show-check").off('click').on('click' , function(){
        			$(".check_pres_open").click();
        			var id=$(this).data("id");
        			var params = $('#prescriptionfrom').serialize()+"&id="+id;
            		Base.commajax("/custom/prescription/prescription_info.htm","get",params,function(data){
            			console.log(data);
            			Base.emptyForm(".prescriptionfrom");
            			$(".precimg")[0].src=data.url+data.list.photo;
            			Base.setValueForFrom('.prescriptionfrom',data.list);
            			if(data.list.status=="1"){
            				Base.setFormDisable('.prescriptionfrom');
        					$(".checkPass").remove();
        					$(".updatePres").remove();
            			}
            			
            			var diseasehtml='';
        				$.each(data.disease,function(i,disease){
        					diseasehtml+='<option value="'+disease.diseaseName+'" >'+disease.diseaseName+'</option>';
        				});
        				$('select[name="pcRecordType1"]').html(diseasehtml);
            			
            			
            			$(".checkPass").off('click').on('click' , function(){
            				var params = {
            						type:"update",
            						id:id,
            						status:"1"
            				};
            				Base.commajax("/custom/prescription/prescription_update.htm","post",params,function(data){
            					if(data.success){
            						alert(data.message);	
            						$(".check_close").click();
            						self.init_list(1);
            					}else{
            						alert(data.message);	
            					}
            				});
            			});
            			$(".unChenkPass").off('click').on('click' , function(){
            				var params = {
            						type:"update",
            						id:id,
            						status:"2"
            				};
            				Base.commajax("/custom/prescription/prescription_update.htm","post",params,function(data){
            					if(data.success){
            						alert(data.message);	
            						$(".check_close").click();
            						self.init_list(1);
            					}else{
            						alert(data.message);	
            					}
            				});
            			});
            			$(".updatePres").off('click').on('click' , function(){
            				var params = $('.prescriptionfrom').serialize()+"&type=info&id="+id;
            				Base.commajax("/custom/prescription/prescription_update.htm","post",params,function(data){
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
    		});
        },
        init:function(pgn){
        	var self = this, $el = self.$element,config=this.options;
    		var id=$.cookie("mskluserid");
    		if(id && !config.init){
    			self.view_info(id);
    		}
    		if(config.init){
    			self.init_list(pgn);
    		}
    		
    		$el.find("#msklPrecSearch").off('click').on('click' , function(){
	        	self.init_list(1,$el.find("#pcRecordType").val());
        	});
        }
	};
    	
    
})(jQuery);
