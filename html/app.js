(function ($) {
	 String.prototype.repl = function (from, to) {
	        return this.split(from).join(to);
	    };
	$.fn.test = function (option) {
        return new Demo(this, option);
    };
    $.fn.test.defaults = {
    };
    var Demo = function (element, options) {
        this.$element = $(element);
        this.options = $.extend([], $.fn.test.defaults, options);
        this.init();
    };
    
    Demo.prototype = {
    	constructor: Demo,
    	init: function(){
    		var self = this, $el = self.$element,config=this.options;
    		var dddd="wwwwwwwwwwwwwwwwwwwwww";
    		alert(dddd);
        }
	};
    	
    
})(jQuery);
