(function($) {
	String.prototype.repl = function(from, to) {
		return this.split(from).join(to);
	};
	$.fn.integrate = function(option) {
		return new JqPort(this, option);
	};
	var JqPort = function(element, options) {
		this.$element = $(element);
		this.options = $.extend([], options);
		this.init(1);
	};

	JqPort.prototype = {
		constructor: JqPort,
		initHtml: function(data, url) {
			var html = '';
			if(data.length == 0) {
				html = '<tr> <td colspan="11">无数据</td></tr>';
			}
			$.each(data, function(i, data) {

				html += '<tr>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td></td>'+
					'<td><div class="button-group">' +
						'<a data-id=' + data.id + ' class="show-update button border-main" href="javascript:void(0)"><span class="icon-bars"></span>修改</a>' +
					'</div></td>'+
					'<td><div class="button-group">' +
					'<a data-id=' + data.id + ' class="show-del button border-main" href="javascript:void(0)"><span class="icon-bars"></span>删除</a>' +
					'</div></td>' +
					'<td>' +
					'<div class="button-group">' +
					'<a data-id=' + data.id + ' class="show-update-img button border-main" href="javascript:void(0)"><span class="icon-bars"></span>编辑</a>' +
					'</div>' +
					'</td>'+
					'</tr>';
			});
			$(".msklIntegrateList").html(html);
		},
		init_list: function(pgn, diseaseName) {
			var self = this;
			var params = $('#msklProductFrom').serialize() + "&pgn=" + pgn;

			Base.commajax("/baseData/integrate/integrate_list.htm", "get", params, function(data) {
				console.log(data);
				$('.sum').text(data.sum);
				self.initHtml(data.list);


				var pagearr = {
					id: "#pagination",
					pgn: pgn,
					totalPages: data.page.totalPages
				};
				Base.oPage(pagearr, function(page_index, jq) {
					self.init_list(page_index + 1);
					return true;
				});
				$(".show-update").off('click').on('click', function() {
					var id = $(this).data("id");
					$(".show_open_view").click();
					$(".integer_plan").html("商品详情");
					$("#AddIntegrateForm").removeClass("hidden");
    				$("#AddIntegrateFormImg").addClass("hidden");
				});
				$(".show-update-img").off('click').on('click', function() {
					var id = $(this).data("id");
					$(".show_open_view").click();
					$(".integer_plan").html("商品图片");
					$("#AddIntegrateForm").addClass("hidden");
					$("#AddIntegrateFormImg").removeClass("hidden");
				});

			});
		},
		init: function(pgn) {
			var self = this,$el = self.$element,config = this.options;
			if(config.init) {
				self.init_list(pgn);
			}

			$el.find("#msklProductSearch").off('click').on('click', function() {
				self.init_list(1);
			});

			$el.find(".addIntegrateView").off('click').on('click', function() {
				$(".show_open_view").click();
				$(".integer_plan").html("商品详情");
				$("#AddIntegrateForm").removeClass("hidden");
				$("#AddIntegrateFormImg").addClass("hidden");
			});

		},
		addAndUpdate: function() {
			if(!Base.validate("#activityAddFrom")) {
				return false;
			};
			var params = $('#activityAddFrom').serialize();
			console.log(params);
			Base.commajax("/operate/activity/activity_add.htm", "post", params, function(data) {
				msg = data.message + ";pages/operate/activity.html;2;#" + data.success;
				$.cookie("msg", msg);
				Base.getPage("pages/tips.html");
			});
		},
	};

})(jQuery);