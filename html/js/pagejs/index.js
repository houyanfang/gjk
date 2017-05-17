(function ($) {
	initmenu = function(){
		Base.commajax("/user/getmenu.htm","get",{},function(data){
			data = JSON.parse(data);
			sorttree(data.menuTree);
			var html="";
			$.each(data.menuTree,function(i,arrs){
				html+='<h2><span class="icon-pencil-square-o"></span>'+arrs.name+'</h2>';
				html+=' <ul>';
				$.each(arrs.childNode,function(i,arr){
					html+=' <li><a data-url='+arr.menuurl+'><span class="icon-caret-right"></span>'+arr.name+'</a></li>';
				});
				html+='</ul> '; 
			});
			$(".menujsondiv").html(html);
			$(".leftnav h2").click(function(){
				var flag =$(this).hasClass("on");
				
				
				$(".leftnav ul").css("display","none");
				$(".leftnav h2").removeClass("on");

			    if(flag){
			    	$(this).next().slideUp(200);
			    	$(this).removeClass("on");
			    }else{
			    	$(this).next().slideDown(200);
			    	$(this).addClass("on");
			    }
			  });
			  $(".leftnav ul li a").click(function(){
			  		$(".leftnav ul li a").removeClass("on");
					$(this).addClass("on");
					$("#a_leader_txt").html($(this).text());
		        	$("#a_leader_txt").data("url",$(this).data("url"));
					Base.getPage($(this).data("url"));
			  });
		});
	};
	
	function sorttree(arr){
		$.each(arr, function(i, o){
			if(o.childNode && o.childNode.length){
				sorttree(o.childNode);
			}
		});
		sortObjarrByProp(arr, 'seq');
	}
	sortObjarrByProp = function(arr, prop){		// console.log(arr)
		arr.sort(function(a,b){
			return a[prop] - b[prop];
		});
	};
	$.datetimepicker.setLocale('ch');
	$("#a_leader_first").off('click').on('click' , function(){
		Base.getPage($(this).data("url"));
	});
 	$("#a_leader_txt").off('click').on('click' , function(){
		Base.getPage($(this).data("url"));
	});
 	$("#login_out").off('click').on('click' , function(){
 		Base.commajax("/user/login_out.htm","post",{},function(res){
	 	});
	});
	Base.getPage("welcome.html");
	initmenu();
})(jQuery);
