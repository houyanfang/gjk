(function ($) {
    	initree =  function(){
    		var url="/menu/list_menu.htm";
    		Base.commajax(url,"get",{},function(data){
    			sortObjarrByProp(data, 'seq');
    			var setting = {
        	    		view : {
        	    			selectedMulti : false
        	    		},
        	    		edit : {
        	    			enable : true,
        	    			showRemoveBtn : false,
        	    			showRenameBtn : false
        	    		},
        	    		data : {
        	    			keep : {
        	    				parent : true,
        	    				leaf : true
        	    			},
        	    			simpleData : {
        	    				enable : true
        	    			}
        	    		},
        	    		callback : {
            	    		onClick: this.onClick2
        	    		}
        	    	};
    			var html='<option value="0">选择上级菜单</option>';
    			$.each(data, function (i, d) {
    				if(d.pId==0){
    					html += '<option value="'+d.id+'">'+d.name+'</option>';
    				}
             	});
    			$(".upmenu").html(html);
    	    	$.fn.zTree.init($("#treeDemo2"), setting, data);
    	    	
    			$("#remove").bind("click", remove);
    			$("#edit").bind("click", edit);
    		});
    		
        };
        onClick2 = function(e, treeId, node){
        	var url="/menu/list_menu.htm";
        	var params = {id:node.id};
        	Base.emptyForm('#menufrom');
        	Base.commajax(url,"get",params,function(data){
        		Base.setValueForFrom('#menufrom',data[0]);
        		Base.setFormDisable('#menufrom');
        	});
        };
    	sortObjarrByProp = function(arr, prop){
    		arr.sort(function(a,b){
    			return a[prop] - b[prop];
    		});
    	};
        $('#addMenu').off('click').on('click',function(e){
        	if( !Base.validate("#menufrom")){
                	return false;
                };
	        	var url="/menu/add_menu.htm";
	        	var params = $('#menufrom').serialize();
	        	Base.commajax(url,"post",params,function(data){
	        		msg=data.message+";pages/menu.html;2;#"+data.success;
	        		$.cookie("msg" , msg);
	        		Base.getPage("pages/tips.html");
	        	});
        });
        $('#add').off('click').on('click',function(e){
        	Base.removeFormDisable('#menufrom');
        	Base.emptyForm('#menufrom');
        	$("#rename").val("");
        });
        
//        $("#name").blur(function(){
//        	var e=$(this);
//        	e.closest('.field').find(".input-help-twice").remove();
//        	var name = $("#name").val();
//        	if(!name || $("#rename").val()==name){
//        		return
//        	}
//        	var url="/menu/list_menu.htm";
//        	var params = {name:name};
//        	Base.commajax(url,"get",params,function(data){
//        		var flag = data.length==0?"true":"false";
//        		
//        		if(e.attr("data-validate")){
//        			var $checkdata=e.attr("data-validate").split(',');
//        			var $checkvalue=e.val();
//        			var $checkstate=true;
//        			var $checktext="";
//        			if($checkvalue!="" || e.attr("data-validate").indexOf("required")>=0){
//        				for(var i=0;i<$checkdata.length;i++){
//        					var $checktype=$checkdata[i].split(':');
//        					if(!Base.$pintuercheck(e,$checktype[0],flag)&&$checktype[0]=="twice"){
//        						$checkstate=false;
//        						$checktext=$checktext+"<li>"+$checktype[1]+"</li>";
//        					}
//        				}
//        			};
//        			if($checkstate){
//        				e.closest('.form-group').removeClass("check-error");
//        				e.parent().find(".input-help").remove();
//        				e.closest('.form-group').addClass("check-success");
//        			}else{
//        				e.closest('.form-group').removeClass("check-success");
//        				e.closest('.form-group').addClass("check-error");
//        				e.closest('.field').append('<div class="input-help-twice"><ul>'+$checktext+'</ul></div>');
//        			}
//        		}
//        		
//        	});
//        });
        
        
	function remove(e) {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo2"), 
					nodes = zTree.getSelectedNodes(), 
					treeNode = nodes[0];
		if (nodes.length == 0) {
			alert("请先选择一个要删除的目录");
			return;
		}
		if(treeNode.isParent){
			alert('该目录下有子目录无法删除');
			return;
		};
		var url="/menu/del_menu.htm";
    	var params = {id:treeNode.id};
    	Base.commajax(url,"post",params,function(data){
    		msg=data.message+";pages/menu.html;2;#"+data.success;
    		$.cookie("msg" , msg);
    		Base.getPage("pages/tips.html");
    		initmenu();
    	});
		
	};
	function edit() {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo2"), 
					nodes = zTree.getSelectedNodes(), 
					treeNode = nodes[0];
		if (nodes.length == 0) {
			alert("请先选择一个要修改的节点");
			return;
		}
		Base.emptyForm("#menufrom");
		var url="/menu/list_menu.htm";
    	var params = {id:treeNode.id};
    	Base.removeFormDisable('#menufrom');
    	Base.commajax(url,"get",params,function(data){
    		Base.setValueForFrom('#menufrom',data[0]);
    		$("#rename").val(data[0].name);
    	});
	};
	
	
	
	
	
})(jQuery);