(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.user = function (option) {
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
	    			'<td>'+data.userNickName+'</td>'+
	    			'<td>'+data.mobile+'</td>'+
	    			'<td>'+data.sex+'</td>'+
	    			'<td>'+data.medicalName+'</td>'+
	    			'<td>'+data.manufacturer+'</td>'+
	    			'<td>'+data.userDiseaseName+'</td>'+
	    			'<td>'+Base.getConsText(CONSTANT.USER_TYPE,data.userType)+'</td>'+
	    			'</tr>';
	    		});
    		$(".mskluserlist").html(html);
    	},
    	init_list:function(pgn,userDiseaseName){
    		var self = this,config=this.options;
    		var params = $('#usersfrom').serialize()+"&pgn="+pgn+"&likeTime="+$.trim(config.likeTime);
    		
    		Base.commajax("/operate/user/user_list.htm","get",params,function(data){
    			console.log(data);
    			$('.sum').text(data.sum); 
    			self.initHtml(data.list);
    			var diseasehtml="";
    			if(userDiseaseName){
    				diseasehtml+="<option value='"+userDiseaseName+"' >"+userDiseaseName+"</option>";
    			}
    			   diseasehtml += '<option value="" >全部</option>';
				$.each(data.disease,function(i,disease){
					diseasehtml+='<option value="'+disease.diseaseName+'" >'+disease.diseaseName+'</option>';
				});
				$('select[name="userDiseaseName"]').html(diseasehtml);
        		
        		var pagearr={
        				id:"#pagination",
        				pgn:pgn,
        				totalPages:data.page.totalPages
        		};
        		Base.oPage(pagearr,function(page_index, jq){
    				self.init_list(page_index + 1,$('select[name="userDiseaseName"]').val());
    				return true;
    			},true);

        		
    		});
        },
        init:function(pgn){
        	var self = this, $el = self.$element,config=this.options;
    		if(config.init){
    			self.init_list(pgn);
    		}
    		
    		$el.find("#msklUserSearch").off('click').on('click' , function(){
    			config.likeTime="";
	        	self.init_list(1,$('select[name="userDiseaseName"]').val());
        	});
    		
    		
//    		$el.find("#msklDaySearch").off('click').on('click' , function(){
//    			config.likeTime=Base.formatTime(new Date(),"yyyy-MM-dd");
//    			self.init_list(1,$('select[name="userDiseaseName"]').val());
//    		});
//    		$el.find("#msklMouthSearch").off('click').on('click' , function(){
//    			config.likeTime=Base.formatTime(new Date(),"yyyy-MM-");
//    			self.init_list(1,$('select[name="userDiseaseName"]').val());
//    		});
//    		$el.find("#msklYearSearch").off('click').on('click' , function(){
//    			config.likeTime=Base.formatTime(new Date(),"yyyy-");
//    			self.init_list(1,$('select[name="userDiseaseName"]').val());
//    		});
    		
        },
	};
    	
    
})(jQuery);
