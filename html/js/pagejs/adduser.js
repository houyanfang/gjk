(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.adduser = function (option) {
        return new AddUser(this, option);
    };
    $.fn.adduser.defaults = {
    };
    var AddUser = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], $.fn.adduser.defaults, options);
        this.init();
    };
    
    AddUser.prototype = {
    	constructor: AddUser,
    	init: function(){
    		var self = this, $el = self.$element,config=this.options;
    		Base.emptyForm("#useraddFrom");
    		var id=$.cookie("userid");
//  		debugger
    		if(id){
    			Base.commajax("/user/user_list.htm","get",{id:id},function(user){
    				config.user = user;
    				Base.commajax("/user/list_menu.htm","get",{},function(data){
    					console.log(data);
    					config.menus=data.list;
    					var menus=config.user.userMenu;
    					var html="";
    					$.each(menus,function(i,userMenu){
    						$.each(config.menus,function(i,menu){
    							if(userMenu.id == menu.id){
    								menu.checked="checked";
    							}
    						});
    					});
    					console.log(config.menus);
    					$.each(config.menus,function(i,menu){
    						html+=' <input '+(menu.checked=="checked"?"checked":"");
    						html+=' name="menuId" value="'+menu.id+(menu.pId != 0?','+menu.pId:"")+'"  type="checkbox" />'+menu.name;
    						if(menu.pId==0){
    							html+='<br />';
    						}
    					});
	    				$('.menu-dd').html(html);
    					var user=config.user.list[0];
    					config.userName=user.userName;
    					Base.setValueForFrom('#useraddFrom',user);
    					$(".logoimg").attr('src',"");
    					$(".logoimg").attr('src',config.user.url+user.userLogo);
    				});
    			});
    		}else{
    			Base.commajax("/user/list_menu.htm","get",{},function(data){
    				console.log(data);
    				var html="";
    				$.each(data.list,function(i,menu){
						html+=' <input '+(menu.checked=="checked"?"checked":"")+
						' name="menuId" value="'+menu.id+(menu.pId != 0?','+menu.pId:"")+'"  type="checkbox" />'+menu.name;
    				});
    				$('.menu-dd').html(html);
    				
    			});
    		}
    		
        	
        	$(".addUser").off('click').on('click' , function(){
        		if( !Base.validate("#useraddFrom")){
                	return;
                };
        		var params = $('#useraddFrom').serialize();
	        	Base.commajax("/user/add_user.htm","post",params,function(data){
	        		initmenu();
	        		msg=data.message+";pages/user.html;2;#"+data.success;
	        		$.cookie("msg" , msg);
	        		Base.getPage("pages/tips.html");
	        	});
	        	
        	});
        	
        	 $("input[name='userName']").blur(function(){
             	var e=$(this);
             	e.closest('.field').find(".input-help-twice").remove();
             	var name = $("input[name='userName']").val();
             	if(!name || config.userName==name){
             		return
             	}
             	var url="/user/user_list.htm";
             	var params = {userName:name};
             	Base.commajax(url,"get",params,function(data){
             		var flag = data.list.length==0?"true":"false";
             		if(e.attr("data-validate")){
             			var $checkdata=e.attr("data-validate").split(',');
             			var $checkvalue=e.val();
             			var $checkstate=true;
             			var $checktext="";
             			if($checkvalue!="" || e.attr("data-validate").indexOf("required")>=0){
             				for(var i=0;i<$checkdata.length;i++){
             					var $checktype=$checkdata[i].split(':');
             					if(!Base.$pintuercheck(e,$checktype[0],flag)&&$checktype[0]=="twice"){
             						$checkstate=false;
             						$checktext=$checktext+"<li>"+$checktype[1]+"</li>";
             					}
             				}
             			};
             			if($checkstate){
             				e.closest('.form-group').removeClass("check-error");
             				e.parent().find(".input-help").remove();
             				e.closest('.form-group').addClass("check-success");
             			}else{
             				e.closest('.form-group').removeClass("check-success");
             				e.closest('.form-group').addClass("check-error");
             				e.closest('.field').append('<div class="input-help-twice"><ul>'+$checktext+'</ul></div>');
             			}
             		}
             		
             	});
             });
        	 
        	
    		$("#uploadlogo").off('click').on('click' , function(){
    			var filepaths = $("input[name='file']").val();
    			if (filepaths != "") {
    				var param = {
    					"file" : filepaths
    				};
    				var options = {
    					url : "/cmsManage/uploadfile",
    					dataType : "json",
    					type : "POST",
    					data : param,
    					success : function(data) {
    						var msg = JSON.parse(data);
    						if(msg.status){
    							$("input[name='userLogo']").val(msg.name);
    							$(".logoimg").attr('src',""); ;
    							$(".logoimg").attr('src',msg.url+msg.name);
    						}else{
    							alert("上传失败");
    						}
    					},
    					error : function(data) {
    						console.log(data);
    					}
    				};
    				$("#useraddFrom").ajaxSubmit(options);
    			} else {
    				alert("请选择文件！！");
    			}
    			
    		});
        }

	};
    	
    
})(jQuery);
