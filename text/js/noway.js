/**
 * wx
 * @param {type} $
 * @returns {undefined}
 */
(function(window) {
	function detect(ua) {
		var NOWAY_FORWARD_URL = 'http://192.168.1.103:8020'
								+'/weixin_gjk_new/noway.html';
		var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i) || ua.match(/(MicroMessenger)\//i);
		if (!wechat) {
			window.location.href = NOWAY_FORWARD_URL;
		}
	}
	detect.call(this, navigator.userAgent);
})(window);
