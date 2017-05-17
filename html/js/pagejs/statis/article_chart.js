(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.article_chart = function (option) {
        return new JsProt(this, option);
    };
    $.fn.article_chart.defaults = {
    };
    var JsProt = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], $.fn.article_chart.defaults, options);
        this.init();
    };
    
    JsProt.prototype = {
    	constructor: JsProt,
    	query:function(params){
    		var self = this;
    		Base.commajax("/statis/article/article_chart.htm","get",params,function(data){
        		self.circular(data,"circular");
        		var main =  self.column({arr:data.original,id:"original",ytext:"原创数量",titletext:"原创"});
        		var remain = self.column({arr:data.noriginal,id:"noriginal",ytext:"非原创数量",titletext:"非原创"});
        		var sum=Number(main+remain);
        		$(".sum").html(sum);  
        		$(".main").html(main);  
        		$(".remain").html(remain);  
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
    		$el.find(".circular").off('click').on('click' , function(){
    			alert("圆");
    		});
    		$el.find(".original").off('click').on('click' , function(){
    			alert("原创");
    		});
    		$el.find(".noriginal").off('click').on('click' , function(){
    			alert("非原创");
    		});
        },
        circular:function(data,id){
        	var self = this;
        	var original = data.original.length;
    		var noriginal = data.noriginal.length;
            
    		new Highcharts.Chart({
    	        chart: {
    	            renderTo: id //关联页面元素div#id
    	        },
    	        title: {  //图表标题
    	            text: ''
    	        },
    	        tooltip: {
    	            formatter: function() { //格式化鼠标滑向图表数据点时显示的提示框
    	                var s;
    	                if (this.point.name) { // 饼状图
    	                    s = '<b>' + this.point.name + '</b>: <br>' + this.y+ '篇(' + self.twoDecimal(this.percentage) + '%)';
    	                } else {
    	                    s = '' + this.x + ': ' + this.y + '篇';
    	                }
    	                return s;
    	            }
    	        },
    	        labels: { //图表标签
    	            items: [{
    	                html: '原创非原创占比',
    	                style: {
    	                    left: '150px',
    	                    top: '0px'
    	                }
    	            }]
    	        },

    			credits: { 
    				text: '',
    				href: ''
    			},
    	        series: [{
    	            type: 'pie', //饼状图
    	            name: '文章总量',
    	            data: [{
    	                name: '原创',
    	                y: original,
    	                color: '#4572A7' 
    	            },
    	            {
    	                name: '非原创',
    	                y: noriginal,
    	                color: '#AA4643' 
    	            }],
    	            center: [200, 150],  //饼状图坐标
    	            size: 200,  //饼状图直径大小
    				dataLabels: {
    	                enabled: true  //不显示饼状图数据标签
    	            }

    	        }]
    	    });
        },
        column:function(data){
        	var self = this;
        	var cate=[];
        	var num=[];
        	var sum=0;
        	$.each(data.arr,function(i,oriarti){
        		cate.push(oriarti.articleDate.substr(0,10));
        		num.push(oriarti.articleCount);
        		sum+=Number(oriarti.articleCount);
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
        },
        twoDecimal:function(x) {
        	var self = this;
            var f_x = parseFloat(x);
            if (isNaN(f_x)) {
                alert('错误的参数');
                return false;
            }
            var f_x = Math.round(x * 100) / 100;
            var s_x = f_x.toString();
            var pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += '.';
            }
            while (s_x.length <= pos_decimal + 2) {
                s_x += '0';
            }
            return s_x;
        },

	};
    	
    
})(jQuery);
