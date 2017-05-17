(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.medicine = function (option) {
        return new JqPort(this, option);
    };
    var JqPort = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], options);
        this.init(1);
    };
    
    JqPort.prototype = {
    	constructor: JqPort,
    	initHtml:function(data,url){
    		var html='';
    		if(data.length==0){
    			html='<tr> <td colspan="11">无数据</td></tr>';
    		}
	    		$.each(data, function (i, data) {
	    			
	    			html += '<tr>'+
	    			'<td>'+data.normalName+'</td>'+
	    			'<td>'+data.medicalName+'</td>'+
	    			'<td>'+data.manufacturer+'</td>'+
	    			'<td>'+data.medicineUnit+'</td>'+
	    			'<td>'+data.packageAmount+'</td>'+
	    			'<td>'+data.dose+'</td>'+
	    			'<td>'+data.dailyTimes+'</td>'+
	    			'<td>'+data.medCode+'</td>'+
	    			'<td>'+data.barCode+'</td>'+
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
    		$(".msklmedicineList").html(html);
    	},
    	init_list:function(pgn){
    		var self = this;
    		var params = $('#msklMedicineFrom').serialize()+"&pgn="+pgn;
    		Base.commajax("/baseData/medicine/medicine_list.htm","get",params,function(data){
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
        		
        		
        		
        		$(".show-update").off('click').on('click' , function(){
        			var id = $(this).data("id");
        			Base.commajax("/baseData/medicine/medicine_list.htm","get",{id:id},function(data){
        				$(".show_open_view").click();
        				Base.emptyForm('#AddMedicineForm');
            			Base.setValueForFrom('#AddMedicineForm',data.list[0]);
        				self.addAndUpdate();
        			});
            	});
        		$(".show-del").off('click').on('click' , function(){
        			var id = $(this).data("id");
        			Base.commajax("/baseData/medicine/medicine_add.htm","post",{id:id,isDelect:"0"},function(data){
        				msg=data.message+";pages/baseData/medicine.html;2;#"+data.success;
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
    		
    		$('select[name="medicineUnit"]').html(Base.createMedUnit());
    		
    		$el.find("#msklDiseaseSearch").off('click').on('click' , function(){
	        	self.init_list(1,$('select[name="diseaseName"]').val());
        	});
    		
    		$el.find(".addMedicineView").off('click').on('click' , function(){
    			$(".show_open_view").click();
    			$('select[name="medicineUnit"]').html(Base.createMedUnit());
    			Base.emptyForm('#AddMedicineForm');
    			self.addAndUpdate();
    		});
    		
        },
        addAndUpdate:function(){
        	$(".addMedicine").off('click').on('click' , function(){
    			if( !Base.validate("#AddMedicineForm")){
                	return false;
                };
    			var params = $('#AddMedicineForm').serialize();
    			Base.commajax("/baseData/medicine/medicine_add.htm","post",params,function(data){
    				msg=data.message+";pages/baseData/medicine.html;2;#"+data.success;
	        		$.cookie("msg" , msg);
	        		Base.getPage("pages/tips.html");
	        		$(".view_close").click();
	        		$('#show_medicine_open').remove();
    			});
    		});
        },
	};
    	
    
})(jQuery);
