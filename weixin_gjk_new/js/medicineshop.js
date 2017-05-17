var pharIds = [], pharNames = [];
var userData;
var firstInit = true;

$(document).ready(function () {
    getPharInfor();
//	$('#brank,#pharname,#city-picker').click(function(){
//		var flag = $("#save-btn").hasClass("hide");
//		if(flag){
//			$("#save-btn").removeClass("hide");	
//		}
//	});
    //save data
    $("#save-btn").click(saveData);
});
/*通过url传值获取药品品牌pharId*/
function getUrlParams() {
    var params = {};
    var url = window.location.href;

    var p = url.split("#");
    if (p.length == 2)
        p = p[1];
    else
        p = url;

    p = p.split("?");
    if (p.length < 2) {
        params.anchor = p[0];
        return params;
    }

    params.anchor = p[0];
    p = p[1].split("&");

    for (var i = 0; i < p.length; i++) {
        var kv = p[i].split("=");
        params[kv[0]] = kv[1];
    }
    return params;
}
/*获取个人购药药店信息*/
function getPharInfor() {
    var urlPara = getUrlParams();
    var pharId = urlPara.pharId || "";
    if (pharId !="") {
        var _url = "mskluser/findUserPharById";
        var _data = {"primaryKey": pharId};
        var _success = function (obj) {
        	console.log(obj);
            if (obj.success == true) {
            	//非首次进入 修改购药药店信息
                userData = obj.data;
                var userAddr = obj.data.userAddress;
                var pharBrank = obj.data.pharBrank;
                var pharName = obj.data.pharName;
                $('#city-picker').val(userAddr);
                $("#brank").val(pharBrank);
                $("#pharname").val(pharName)


                //city-picker
                setAddress();

                $("#pharname").picker({
                    toolbarTemplate: '<header class="bar bar-nav">\
				    <button class="button button-link pull-left button-no pharNo close-picker recovery-picker-pharname">取消</button>\
				    <button class="button button-link pull-right close-picker button-yes">确定</button>\
				    <h1 class="title"></h1>\
				    </header>',
                    cols: [
                        {
                            textAlign: 'center',
                            values: [""]
                        }
                    ],
                    onClose: function (picker) {
                        var currenValue = picker.cols[0].value;
                        var i = pharNames.indexOf(currenValue);
                        var pharId = pharIds[i];
                        $("#pharname").data("pharId", pharId);

                    },
                    recovery: '.recovery-picker-pharname'
                });
                $("#pharname").data("picker").open();
                $("#pharname").data("picker").close();

                //brank
                setBrankInfor();

            }
//          else{
//          	//首次进入设置购药药店信息
//          	 setAddress();
//          	 $("#pharname").picker({
//                  toolbarTemplate: '<header class="bar bar-nav">\
//				    <button class="button button-link pull-left button-no pharNo close-picker recovery-picker-pharname">取消</button>\
//				    <button class="button button-link pull-right close-picker button-yes">确定</button>\
//				    <h1 class="title"></h1>\
//				    </header>',
//                  cols: [
//                      {
//                          textAlign: 'center',
//                          values: [""]
//                      }
//                  ],
//                  onClose: function (picker) {
//                      var currenValue = picker.cols[0].value;
//                      var i = pharNames.indexOf(currenValue);
//                      var pharId = pharIds[i];
//                      $("#pharname").data("pharId", pharId);
//
//                  },
//                  recovery: '.recovery-picker-pharname'
//              });
//              $("#pharname").data("picker").open();
//              $("#pharname").data("picker").close();
//
//              //brank
//              setBrankInfor();
//          }
        }
        var _complete = function () {
            $('.me-loading').hide();
        };
        var _error = function (obj) {
            alert(obj.message);
        };
        $.gjk.ajax.postAjax(_url, _data, _success, _error, _complete, "POST", "medicineshop");

    }
    else {
    	//首次进入设置购药药店信息
        setAddress();
        $("#pharname").picker({
            toolbarTemplate: '<header class="bar bar-nav">\
		    <button class="button button-link pull-left button-no pharNo close-picker recovery-picker-pharname">取消</button>\
		    <button class="button button-link pull-right close-picker button-yes">确定</button>\
		    <h1 class="title"></h1>\
		    </header>',
            cols: [
                {
                    textAlign: 'center',
                    values: [""]
                }
            ],
            onClose: function (picker) {
                var currenValue = picker.cols[0].value;
                var i = pharNames.indexOf(currenValue);
                var pharId = pharIds[i];
                $("#pharname").data("pharId", pharId);

            },
            recovery: '.recovery-picker-pharname'
        });
        $("#pharname").data("picker").open();
        $("#pharname").data("picker").close();

        //brank
        setBrankInfor();
    }

}
/*设置所在地区*/
function setAddress() {
    $("#city-picker").cityPicker({
        toolbarTemplate: '<header class="bar bar-nav">\
		<button class="button button-link pull-left button-no close-picker recovery-picker-address">取消</button>\
		<button class="button button-link pull-right close-picker button-yes">确定</button>\
		</header>',
        recovery: '.recovery-picker-address'
    });
}
/*获取所有药店品牌和药店名称信息*/
function setBrankInfor() {
    var _url = "baseController/findPharListByType";
    var _data = {"pharType": "1", "pId": "0"};
    var _success = function (obj) {

        if(obj.success == true){
        	brankNames = [], brankIds = [];
	        for (var _brank of obj.data) {
	            brankNames.push(_brank.pharmacyName);
	            brankIds.push(_brank.pharmacyId);
	        }
	        $("#brank").picker({
	            toolbarTemplate: '<header class="bar bar-nav">\
				<button class="button button-link pull-left close-picker button-no brankNo">取消</button>\
				<button class="button button-link pull-right close-picker button-yes">确定</button>\
				<h1 class="title"></h1>\
				</header>',
	            cols: [
	                {
	                    textAlign: 'center',
	                    values: brankNames
	                }
	            ],
	            onClose: function (picker) {
	                var currenValue = picker.cols[0].value;
	                var i = brankNames.indexOf(currenValue);
	                var brankId = brankIds[i];
	                $("#brank").data("brankId", brankId);
	                var _url = "baseController/findPharListByType";
	                var _data = {"pharType": "2", "pId": brankId};
	                var _success = function (obj) {
	                    //console.log(obj.data);
	                    pharNames = [];
	                    pharIds = [];
	                    for (var _phar of obj.data) {
	                        pharNames.push(_phar.pharmacyName);
	                        pharIds.push(_phar.pharmacyId);
	                    }
	                    if (pharNames.length !== 0) {
	                        $("#pharname").data("picker").cols[0].replaceValues(pharNames);
	                        $("#pharname").data("picker").updateValue();
	                        //set default valueId
	                        $("#pharname").data("pharId", pharIds[0]);
	                        if (firstInit && userData) {
	                            firstInit = false;
	                            $("#pharname").picker("setValue", [userData.pharName]);
	                        }
	                    } else {
	
	                        $("#pharname").val("该品牌下暂无药店");
	                        $("#pharname").picker("close");
	                    }
	                };
	                var _complete = function () {
	                    $('.me-loading').hide();
	                };
	
	                var _error = function (obj) {
	                    alert(obj.message);
	                };
	                $.gjk.ajax.postAjax(_url, _data, _success, _error, _complete, "POST", "medicineshop");
	            }
	        });
        }

        $("#brank").data("picker").open();
        $("#brank").data("picker").close();
    };

    var _complete = function () {
        $('.me-loading').hide();
    };
    var _error = function (obj) {
        alert(obj.message);
    };
    $.gjk.ajax.postAjax(_url, _data, _success, _error, _complete, "POST", "medicineshop");

}
/*save data to server*/
function saveData() {
    var _userAddress = $('#city-picker').val();
    var urlPara = getUrlParams();
    var _pharId = urlPara.pharId;
    var _pharBrank = $('#brank').val();
    var _pharName = $('#pharname').val();
    //console.log(_pharId);
    var message = "您好，输入不能为空！";
    if (!_userAddress || !_pharBrank || !_pharName) {
        var $msg = $('#msg');
        var $reminder = $('#reminder');
        $reminder.show();
        $msg.text(message);

        setTimeout(function () {
             $reminder.hide();
         }, 2000);
		return;
    }

    $('.me-loading').show();
    var _url = "mskluser/saveUserPhar";
    var _data = {
        "pharId": _pharId,
        "userAddress": _userAddress,
        "pharBrank": _pharBrank,
        "pharName": _pharName
    };
    var _success = function (obj) {

        if(obj.data == true && obj.success == true){
       	    window.location.href = $.gjk.path_url + 'self/selfinfor.html';
        }else{
        	var $msg = $('#msg');
	        var $reminder = $('#reminder');
	        $reminder.show();
	        $msg.text(message);
	
	        setTimeout(function () {
	             $reminder.hide();
	         }, 2000);
			return;
        }

    };
    var _error = function (obj) {
        //alert(obj.message);
    };
    var _complete = function () {
        $('.me-loading').hide();
    }
    $.gjk.ajax.postAjax(_url, _data, _success, _error, _complete, "POST", "medicineshop");

}

