/**
 * $.gjk.os
 * @param {type} $
 * @returns {undefined}
 */
(function ($, window) {
    function detect(ua) {
        this.gjk = {};
        this.gjk.os = {};
        var funcs = [
            function () { //wechat
                var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
                if (wechat) { //wechat
                    this.gjk.os.wechat = {
                        version: wechat[2].replace(/_/g, '.')
                    };
                } else if (ua.match(/(MicroMessenger)\//i)) {
                    this.gjk.os.wechat = {
                        version: 'undefined'
                    };
                }
                return false;
            },
            function () { //android
                var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
                if (android) {
                    this.gjk.os.android = true;
                    this.gjk.os.version = android[2];

                    this.gjk.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
                }
                return this.gjk.os.android === true;
            },
            function () { //ios
                var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
                if (iphone) { //iphone
                    this.gjk.os.ios = this.gjk.os.iphone = true;
                    this.gjk.os.version = iphone[2].replace(/_/g, '.');
                } else {
                    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
                    if (ipad) { //ipad
                        this.gjk.os.ios = this.gjk.os.ipad = true;
                        this.gjk.os.version = ipad[2].replace(/_/g, '.');
                    }
                }
                return this.gjk.os.ios === true;
            }
        ];
        [].every.call(funcs, function (func) {
            return !func.call($);
        });
    }

    detect.call($, navigator.userAgent);
})(Zepto, window);

/**
 * $.gjk.utils
 * @param {type} $
 * @returns {undefined}
 */
(function ($, window, document) {
    $.gjk = $.gjk || {};
    $.gjk.utils = {};
    $.gjk.utils.getSize = function () {
        var __w = document.documentElement.clientWidth || document.body.clientWidth;
        var __h = document.documentElement.clientHeight || document.body.clientHeight;
        return {
            w: __w,
            h: __h
        }
    }

    $.gjk.utils.convertJSONData = function (json) {
        for (k in json) {
            if (!(json[k] != "") || !(json[k] != null) || !(json[k] != undefined) || !(json[k] != "undefined") || !(json[k] != "null")) {
                json[k] = "";
            }
        }

        return json;
    }

    $.gjk.utils.md5 = function (paraStr) {
        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        function safeAdd(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF)
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
            return (msw << 16) | (lsw & 0xFFFF)
        }

        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        function bitRotateLeft(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt))
        }

        /*
         * These functions implement the four basic operations the algorithm uses.
         */
        function md5cmn(q, a, b, x, s, t) {
            return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
        }

        function md5ff(a, b, c, d, x, s, t) {
            return md5cmn((b & c) | ((~b) & d), a, b, x, s, t)
        }

        function md5gg(a, b, c, d, x, s, t) {
            return md5cmn((b & d) | (c & (~d)), a, b, x, s, t)
        }

        function md5hh(a, b, c, d, x, s, t) {
            return md5cmn(b ^ c ^ d, a, b, x, s, t)
        }

        function md5ii(a, b, c, d, x, s, t) {
            return md5cmn(c ^ (b | (~d)), a, b, x, s, t)
        }

        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length.
         */
        function binlMD5(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << (len % 32)
            x[(((len + 64) >>> 9) << 4) + 14] = len

            var i
            var olda
            var oldb
            var oldc
            var oldd
            var a = 1732584193
            var b = -271733879
            var c = -1732584194
            var d = 271733878

            for (i = 0; i < x.length; i += 16) {
                olda = a
                oldb = b
                oldc = c
                oldd = d

                a = md5ff(a, b, c, d, x[i], 7, -680876936)
                d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
                c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
                b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
                a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
                d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
                c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
                b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
                a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
                d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
                c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
                b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
                a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
                d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
                c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
                b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

                a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
                d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
                c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
                b = md5gg(b, c, d, a, x[i], 20, -373897302)
                a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
                d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
                c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
                b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
                a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
                d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
                c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
                b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
                a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
                d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
                c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
                b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

                a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
                d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
                c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
                b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
                a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
                d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
                c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
                b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
                a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
                d = md5hh(d, a, b, c, x[i], 11, -358537222)
                c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
                b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
                a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
                d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
                c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
                b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

                a = md5ii(a, b, c, d, x[i], 6, -198630844)
                d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
                c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
                b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
                a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
                d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
                c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
                b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
                a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
                d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
                c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
                b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
                a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
                d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
                c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
                b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

                a = safeAdd(a, olda)
                b = safeAdd(b, oldb)
                c = safeAdd(c, oldc)
                d = safeAdd(d, oldd)
            }
            return [a, b, c, d]
        }

        /*
         * Convert an array of little-endian words to a string
         */
        function binl2rstr(input) {
            var i
            var output = ''
            var length32 = input.length * 32
            for (i = 0; i < length32; i += 8) {
                output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
            }
            return output
        }

        /*
         * Convert a raw string to an array of little-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        function rstr2binl(input) {
            var i
            var output = []
            output[(input.length >> 2) - 1] = undefined
            for (i = 0; i < output.length; i += 1) {
                output[i] = 0
            }
            var length8 = input.length * 8
            for (i = 0; i < length8; i += 8) {
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
            }
            return output
        }

        /*
         * Calculate the MD5 of a raw string
         */
        function rstrMD5(s) {
            return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
        }

        /*
         * Calculate the HMAC-MD5, of a key and some data (raw strings)
         */
        function rstrHMACMD5(key, data) {
            var i
            var bkey = rstr2binl(key)
            var ipad = []
            var opad = []
            var hash
            ipad[15] = opad[15] = undefined
            if (bkey.length > 16) {
                bkey = binlMD5(bkey, key.length * 8)
            }
            for (i = 0; i < 16; i += 1) {
                ipad[i] = bkey[i] ^ 0x36363636
                opad[i] = bkey[i] ^ 0x5C5C5C5C
            }
            hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
            return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
        }

        /*
         * Convert a raw string to a hex string
         */
        function rstr2hex(input) {
            var hexTab = '0123456789abcdef'
            var output = ''
            var x
            var i
            for (i = 0; i < input.length; i += 1) {
                x = input.charCodeAt(i)
                output += hexTab.charAt((x >>> 4) & 0x0F) +
                    hexTab.charAt(x & 0x0F)
            }
            return output
        }

        /*
         * Encode a string as utf-8
         */
        function str2rstrUTF8(input) {
            return unescape(encodeURIComponent(input))
        }

        /*
         * Take string arguments and return either raw or hex encoded strings
         */
        function rawMD5(s) {
            return rstrMD5(str2rstrUTF8(s))
        }

        function hexMD5(s) {
            return rstr2hex(rawMD5(s))
        }

        function rawHMACMD5(k, d) {
            return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
        }

        function hexHMACMD5(k, d) {
            return rstr2hex(rawHMACMD5(k, d))
        }

        function md5(string, key, raw) {
            if (!key) {
                if (!raw) {
                    return hexMD5(string)
                }
                return rawMD5(string)
            }
            if (!raw) {
                return hexHMACMD5(key, string)
            }
            return rawHMACMD5(key, string)
        }

        return md5(paraStr);
    }
})(Zepto, window, document);

/**
 * $.gjk.ajax
 * @param {type} $
 * @returns {undefined}
 */
(function ($, window, document, _) {
    $.gjk = $.gjk || {};
    $.gjk.ajax = {};

    $.gjk.URL = 'http://gl.gjk.com.cn/mskl-api/api/';
    $.gjk.path_url = 'http://gl.gjk.com.cn/mskl-api/weixin_gjk/';
    // $.gjk.URL = 'http://127.0.0.1/mskl-api/api/';
    // $.gjk.path_url = 'http://127.0.0.1//';
    //TODO 测试设置，上线前清空数据
    $.gjk.isDebugger = false;
    // $.gjk.defaultSecretKey = 'U5rRI65jvGBFNG23aZHZGxOUQnmIEPyV';
    // $.gjk.defaultToken = 'iasdfasjkjo@6985';
    $.gjk.defaultSecretKey = '';
    $.gjk.defaultToken = '';
    var requestPost = function (api, data, success, fail, complete, method, flag) {
        $.gjk.isAuthor(flag);

        var __url = $.gjk.postApiURL(api, data);
        if (!data) {
            data = {}
        }
        // console.log(__url);
        var __jsonData = JSON.stringify(data);
        if (__jsonData == "{}") {
            __jsonData = "";
        }
        $.ajax({
            type: method,
            url: __url,
            data: __jsonData,
            dataType: 'json',
            contentType: 'application/json',
            success: success,
            error: fail,
            complete: complete
        });
    };
    var requestPostOrder = function (api, data, success, fail, complete, method, flag) {
        $.gjk.isAuthor(flag);

        var __url = $.gjk.postApiOrderTokenURL(api, data);
        if (!data) {
            data = {}
        }
        // console.log(__url);
        var __jsonData = JSON.stringify(data);
        if (__jsonData == "{}") {
            __jsonData = "";
        }
        $.ajax({
            type: method,
            url: __url,
            data: __jsonData,
            dataType: 'json',
            contentType: 'application/json',
            success: success,
            error: fail,
            complete: complete
        });
    };
    var requestGet = function (api, data, success, fail, complete, method, flag) {
        $.gjk.isAuthor(flag);
        var __url = $.gjk.getApiURL(api, data);
        if (!data) {
            data = {}
        }

        var __jsonData = JSON.stringify(data);
        if (__jsonData == "{}") {
            __jsonData = "";
        }
        $.ajax({
            type: method,
            url: __url,
            data: __jsonData,
            dataType: 'json',
            contentType: 'application/json',
            success: success,
            error: fail,
            complete: complete
        });
    }

    var request = function (api, data, success, fail, complete, method, flag) {
        $.gjk.isAuthor(flag);
        var __url = $.gjk.postApiURLNoToken(api, data);
        if (!data) {
            data = {}
        }
        console.log(__url)
        var __jsonData = JSON.stringify(data);
        if (__jsonData == "{}") {
            __jsonData = "";
        }
        console.log(__jsonData);
        $.ajax({
            type: method,
            url: __url,
            data: __jsonData,
            dataType: 'json',
            contentType: 'application/json',
            success: success,
            error: fail,
            complete: complete
        });
    };

    //TODO 数据没有加密
    var basePostRequest = function (api, data, success, fail, complete, method, flag) {
        $.gjk.isAuthor(flag);
        var __url = $.gjk.postApiURL(api, {});
        if (!data) {
            data = {}
        }
        var __jsonData = JSON.stringify(data);
        if (__jsonData == "{}") {
            __jsonData = "";
        }
        console.log(__jsonData);
        $.ajax({
            type: method,
            url: __url,
            data: __jsonData,
            dataType: 'json',
            contentType: 'application/json',
            success: success,
            error: fail,
            complete: complete
        });
    };
    var hasNoTokenAndTime = function (api, data, success, fail, complete, method) {
        // $.gjk.isAuthor(flag);
        // var __url = $.gjk.postApiURL(api, {});
        if (!data) {
            data = {}
        }

        var __jsonData = JSON.stringify(data);
        if (__jsonData == "{}") {
            __jsonData = "";
        }
        $.ajax({
            type: method,
            url: api,
            data: __jsonData,
            dataType: 'json',
            contentType: 'application/json',
            success: success,
            error: fail,
            complete: complete
        });
    }

    //获取完整API路径
    $.gjk.postApiURLNoToken = function (api, data) {
        var __timestamp = $.gjk.getTimeStamp();
        data.t = __timestamp;
        var __md5str = $.gjk.md5str(data, $.gjk.isHasSecretKey());
        // var __token = $.gjk.isHasToken();
        console.log(__md5str)
        var __url = $.gjk.URL + api + '/' + __timestamp + '/' + __md5str;
        return __url;
    };

    //获取完整API路径
    $.gjk.postApiURL = function (api, data) {
        var __timestamp = $.gjk.getTimeStamp();
        data.t = __timestamp;
        var __md5str = $.gjk.md5str(data, $.gjk.isHasSecretKey());
        var __token = $.gjk.isHasToken();
        var __url = $.gjk.URL + api + '/' + __token + '/' + __timestamp + '/' + __md5str;
        console.log(__url)
        return __url;
    };

    //获取完整APIOrderToken路径
    $.gjk.postApiOrderTokenURL = function (api, data) {
        var __timestamp = $.gjk.getTimeStamp();
        data.t = __timestamp;
        var __md5str = $.gjk.md5str(data, $.gjk.isHasSecretKey());
        var __token = $.fn.cookie('gjk_user_token') ? $.fn.cookie('gjk_user_token') : "";
        var __url = $.gjk.URL + api + '/' + __token + '/' + __timestamp + '/' + __md5str;
        return __url;
    };

    $.gjk.getApiURL = function (api, data) {
        var __param = "";
        for (var k in data) {
            __param += '/' + data[k];
        }
        var __timestamp = $.gjk.getTimeStamp();
        data.t = __timestamp;
        var __md5str = $.gjk.md5str(data, $.gjk.isHasSecretKey());

        var __url = $.gjk.URL + api + __param + '/' + __timestamp + '/' + __md5str;
        return __url;
    }
    //微信是否授权
    $.gjk.isAuthor = function (flag) {
        if (!($.gjk.isHasSecretKey() && $.gjk.isHasToken()) && !($.gjk.isDebugger)) {
            //TODO 微信授权
            // 需要本地保存好密钥、token
            var appid = "wx565d5287077411f2";
            //这里需要更换uri字符串。
            var redirect_uri = encodeURIComponent("http://gl.gjk.com.cn/mskl-api/api/wxLoginC/checkWxToken?flag=" + flag);
            var weixin_login_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
            window.location.href = weixin_login_url;
        }
    };

    //生成MD5加密参数信息
    $.gjk.md5str = function (paramData, sec) {
        //TODO 参数MD5加密
        if ($.gjk.isDebugger) {
            return '1';
        }
        var paraStr = $.gjk.paramObjectSort(paramData);
        console.log(paraStr)
        return $.gjk.utils.md5(paraStr + '' + sec);
    };

    //查看本地是否有密钥
    $.gjk.isHasSecretKey = function () {
        //TODO 本地获取密钥
        // var __sk = localStorage.getItem('__sk');
        var __sk = $.fn.cookie('gjk_signKey');
        if ($.gjk.isDebugger) {
            __sk = __sk ? __sk : $.gjk.defaultSecretKey;
        }

        if (__sk) {
            return __sk;
        }
        return false;
    };
    //URL参数字典排序
    $.gjk.paramObjectSort = function (param) {
        var __str = '';
        if (typeof param === "object"
            && param instanceof Object
            && !(param instanceof Array)
            && !(param instanceof Function)) {
            //需优化内容
            var __arrK = _.keys(param),
                __sortedKeys = _.sortBy(__arrK),
                __sortedObj = $.gjk.serialize(__sortedKeys, param);
            __str = __sortedObj;

        } else {
            console.error('方法param参数格式错误！格式为：对象(Object); eg: { id:\'name\' }')
        }
        return __str;
    }
    //URL参数序列化
    $.gjk.serialize = function (keys, obj) {
        var __str = '', __strT = '';
        if (_.isArray(keys) && _.isObject(obj)) {
            keys.forEach(function (k) {
                if (k == "t") {
                    __strT = '&' + k + "=" + obj[k];
                } else {
                    __str += '&' + k + "='" + obj[k] + "'";
                }
            })
        }
        __str += __strT;

        return __str.length == 0 ? '' : __str.substr(1);
    }
    //获取本地时间戳
    $.gjk.getTimeStamp = function () {
        if ($.gjk.isDebugger) {
            return 1;
        }
        return new Date().getTime();
//		
    }
    //查看本地是否有token
    $.gjk.isHasToken = function () {
        //TODO 本地获取TOKEN
//		var __tk = localStorage.getItem('__tk');
        var __tk = $.fn.cookie('gjk_token');
        if ($.gjk.isDebugger) {
            __tk = __tk ? __tk : $.gjk.defaultToken;
        }

        if (__tk) {
            return __tk;
        }
        return false;
    };
    $.gjk.ajax = {
        postAjax: requestPost,
        getAjax: requestGet,
        request: request,
        basePostRequest: basePostRequest,
        hasNoTokenAndTime: hasNoTokenAndTime,
        requestPostOrder:requestPostOrder
    }

})(Zepto, window, document, _);
