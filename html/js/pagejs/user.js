(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.user = function (option) {
        return new User(this, option);
    };
    $.fn.user.defaults = {
    };
    var User = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], $.fn.user.defaults, options);
        this.init(1);
    };
    
    User.prototype = {
    	constructor: User,
    	userHtml:function(data){
    		var html='';
    		if(data.length==0){
    			html='<tr> <td colspan="6">无数据</td></tr>';
    		}
    		$.each(data, function (i, user) {
    			html += '<tr>'+
    			'<td>'+(i+1)+'</td>'+
    			'<td>'+user.userName+'</td>'+
    			'<td>'+user.realName+'</td>'+
    			'<td>'+user.phone+'</td>'+
    			'<td>'+user.createUser+'</td>'+
    			'<td>'+
    			'<div class="button-group">'+
    			'<a data-id='+user.id+' class="update-user button border-main" href="javascript:void(0)"><span class="icon-edit"></span> 修改</a>'+
    			'<a data-id='+user.id+' class="del-user button border-red" href="javascript:void(0)"><span class="icon-trash-o"></span> 删除</a>'+
    			'</div>'+
    			'</td>'+
    			'</tr>';
    		});
    		$(".userlist").html(html);
    	},
    	init: function(pgn){
    		var self = this, $el = self.$element,config=this.options;
        	var url="/user/user_list.htm";
        	Base.commajax(url,"get",{pgn:pgn},function(data){
        		config.data = data;
        		self.userHtml(config.data.list);
        		$("#pagination").pagination(config.data.page.totalPages, {
        			callback : $.proxy(self.page_callback,self),
    				items_per_page : 1,
    				prev_text : "<<",
    				next_text : ">>",
    				num_edge_entries : 1, //边缘值
    				ellipse_text : '...', //边缘显示
    				num_display_entries : 3, //显示条数
    				current_page : pgn - 1,
    				show_if_single_page:true,
    				link_to : "javascript:void(0)"
    			});
        		
        		$el.find(".del-user").off('click').on('click' , function(){
        			var id = $(this).data("id");
                	Base.commajax("/user/del_user.htm","post",{id:id},function(data){
                		msg=data.message+";pages/user.html;2;#"+data.success;
    	        		$.cookie("msg" , msg);
    	        		Base.getPage("pages/tips.html");
                	});
        		});
        		$el.find(".update-user").off('click').on('click' , function(){
        			var id = $(this).data("id");
        			$.cookie("userid" , id);
        			Base.getPage("pages/adduser.html");
        		});
        	});
        	
    		$(".addUserHtml").off('click').on('click' , function(){
    			$.cookie("userid","");
    			Base.getPage("pages/adduser.html");
			});
        },
    	//分页回调
    	page_callback:function(page_index, jq) {
    		var self = this, $el = self.$element,config=this.options;
    		current_page = page_index + 1;
    		self.init(current_page);
    		return true;
    	}

	};
    	
    
})(jQuery);
