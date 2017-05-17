/**
 * Created by zhangmeng on 2017/4/24.
 */
function isLoginToken(fn1,flag) {
    //判断是否登陆
    function islogin() {
        // $.fn.cookie('gjk_token', 'dasfewcwejrtcwewe|6985', {expires: 7, path: '/'});
        // var token = "dasfewcwejrtcwewe|6985";
        // var token = $.fn.cookie('gjk_token');
        var token = $.gjk.isHasToken();
        console.log(token);
        if (token) {
            return true;
        } else {
            return false;
        }
    }

    //判断是否登录
    if (islogin()) {
        fn1();
    } else {
        // weixin_login(flag);
        $.gjk.isAuthor(flag)
    }
}
//微信登录
function weixin_login(flag) {
    var appid = "wx565d5287077411f2";
    var redirect_uri = encodeURIComponent("http://gl.gjk.com.cn/mskl-api/api/wxLoginC/checkWxToken?flag=" + flag);
    var weixin_login_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    window.location.href = weixin_login_url;
}
