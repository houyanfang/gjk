(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.orange_chart = function (option) {
        return new JsProt(this, option);
    };
    $.fn.orange_chart.defaults = {
    };
    var JsProt = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], $.fn.orange_chart.defaults, options);
        this.init();
    };
    
    JsProt.prototype = {
    	constructor: JsProt,
    	query:function(params){
    		var self = this;
    		Base.commajax("/statis/orange/orange_chart.htm","get",params,function(data){
    			console.log(data);
        		var sum = self.column({arr:data.main,id:"chart1",ytext:"橘子营数量",titletext:"橘子营数量"});
        		$(".sum").html(sum);  
        	});
    	},
    	init:function(){
    		var self = this, $el = self.$element;
    		var params={};
    		self.query(params);
    		$el.find("#articlesearch").off('click').on('click' , function(){
    			var startTime=$el.find('input[name="startTime"]').val()+" 00:00:00";
    			var endTime=$el.find('input[name="endTime"]').val()+" 24:00:00";
    			params["startTime"]=startTime;
    			params["endTime"]=endTime;
    			self.query(params);
			});
        },
        column:function(data){
        	var self = this;
        	var cate=[];
        	var num=[];
        	var sum=0;
        	$.each(data.arr,function(i,oriarti){
        		cate.push(oriarti.orangeDate.substr(0,10));
        		num.push(oriarti.orangeCount);
        		sum+=Number(oriarti.orangeCount);
        	});
        	new Highcharts.Chart({
    	        chart: {
    				height: 400,
    				plotBorderWidth: 0,
    	            renderTo: data.id //关联页面元素div#id
    	        },
    	        title: {  //图表标题
    	            text: data.titletext
    	        },
    	        xAxis: { //x轴
    	            categories: cate,  //X轴类别
    				labels:{y:18}  //x轴标签位置：距X轴下方18像素
    	        },
    			yAxis: {  //y轴
    	            title: {text: data.ytext}, //y轴标题
    				lineWidth: 1 //基线宽度
    	        },
    	        labels: { //图表标签
    	            items: [{
    	                html: '',
    	                style: {
    	                    left: '48px',
    	                    top: '8px'
    	                }
    	            }]
    	        },
    			
    			credits: { 
    				text: '',
    				href: ''
    			},
    	        series: [{ //数据列
    	            type: 'column',
    	            name: '柱形',
    	            data: num
    	        },
    	        {
    	            type: 'spline',
    	            name: '折线',
    	            data: num
    	        }
    			]
    	    });
        	return sum;
        }

	};
    	
    
})(jQuery);
