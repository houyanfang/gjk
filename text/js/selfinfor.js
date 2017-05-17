$(document).ready(function () {
    getUserInfo();
    $('.pharmacy').click(getPharmacyInfor);
    $('.circular').click(saveData);
    $('#myPres').on('click', getPresInfor);
    $('#mobileNum').on('click', setMobileNum);
    $('.row input[name="age"]').on('click', setAge);
});
var pharId, mobile, userDiseaseId, comeFroms,age, sex, disease, diseaseTime, userDiseaseNames;
/*获取用户个人信息（微信）*/
function getUserInfo() {
    $('.me-loading').show();
    var _url = "mskluser/userInfos";
    var _data = {};
    var _success = function (obj) {
		console.log(obj);
        if(obj.success == true){
        	if (!!obj.data) {
	            var inputs = $('#myform input[type="text"]');
	            pharId = obj.data.pharId || "";
	            userDiseaseId = obj.data.userDiseaseId || "";
	            comeFroms = obj.data.comeFrom || "";
	            sex = obj.data.sex || "";
	            age = obj.data.age || "";
	            mobile = obj.data.mobile || "";
	            $(inputs).each(function () {
	                var _value = this.name;
	                if (_value && !!obj.data[_value]) {
	                	var res = obj.data[_value];
	                	if(res == "null"){
	                		$(this).val("0");
	                	}else{
	                   		$(this).val(res);	
	                	}
	                    console.log(obj.data[_value]);
	                }
	                if(_value && obj.data[_value] == null) {
	                    $(this).val("0");
	                }
	                /*if(!!_value &&  !!obj.data[_value]) {
	                 $(this).attr("value", obj.data[_value]);
	                 }
	                 if(!obj.data[_value]){
	                 $(this).attr("value", "");
	                 }*/
	            });
	
	            //头像无法显示 以后接口修好再解决
	            var img_url = obj.data.photo;
	//          mobile = $('input[name="mobile"]').val();
	            if (!!img_url) {
	                $('.mypic img').attr("src", img_url);
	            } else {
	                return;
	            }
	            $('#address-picker').val(comeFroms);
	            disease = obj.data.disease || "";
	            diseaseTime = obj.data.diseaseTime || "";
	            var myIdentity = disease + " " + diseaseTime;
	            $('#myIdentity').val(myIdentity);
	
	            //init disease
	            getIdentityInfor();
	        }
        }

    };
    var _complete = function () {
        $('.me-loading').hide();
    };
    var _error = function (obj) {
//		alert(obj.message);
        console.log(obj.message);
    };
    $.gjk.ajax.postAjax(_url, _data, _success, _error, _complete, "POST", "selfinfor");

}
function setAge() {
    //console.log("123");
    //年龄
    $(".Email_alert").css("display", "block");
    $(".Email_alertMain_botLe").click(function () {
        $(".Email_alert").css("display", "none");
    });
    $(".Email_alertMain_botRi").click(function () {
        $(".Email_alertMain_cen input").focus();
        var _age = $(".Email_alertMain_cen input").val();
        $('.row input[name="age"]').val(_age);
        $(".Email_alert").css("display", "none");
    });
}

//设置修改手机号码

var time, interval;
function setMobileNum() {
    $("#addBox").removeClass("hide");
    $(".min").removeClass("hide");
    $(".removeadd").on("click", function () {
        $("#addBox").addClass("hide");
        $(".min").addClass("hide");
        $(".celltxt").val(" ");
		$(".mobile-number").val(" ");
    })

    function countdown(target) {
        if (time == 0) {
            clearInterval(interval);
            target.removeAttribute("disabled");
            $(target).text("获取验证码");
            return false;
        } else {
            time--;
            $(target).text("重新发送(" + time + ")");
        }
    }

    $(".countdown-time").click(function () {
        var _this = this;
        var _mobile = $(".mobile-number").val();
        if (!_mobile) {
            $('.tip-panel').text("请输入您的手机号");
            return;
        }
        var _url = "verificationCode/register";
		// var _url = "verificationCode/register";
        var _data = {"mobile": _mobile};
//      console.log(_data);
        var _success = function (obj) {
            console.log(obj);
            if (obj.success == true) {
                _verificationCode = obj.data;
                time = 60;
                _this.setAttribute("disabled", "disabled");
                $(_this).text("重新发送(" + time + ")");
                interval = setInterval(countdown, 1000, _this);
                //绑定手机号码
			    $('.orange').on('click', function () {
			        if($('input[name="celltxt"]').val()===_verificationCode){
			        	var _url = "mskluser/addMobileAndPassword";
						var _data = { 
							"mobile":_mobile,
	    					"verificationCode":_verificationCode,
	    					"password":"123456"	
						};
						var _success = function(obj) {
							console.log(obj);
							if(obj.success == true) {
								$('.row input[name="mobile"]').val(_mobile);
						        $("#addBox").addClass("hide");
						        $(".min").addClass("hide");
						        window.location.reload();
							}else{
								$(".tip-panel").text("手机号绑定失败！");
							}
						}
						var _error = function(obj) {
							console.log(obj.message);
						};
						$.gjk.ajax.postAjax(_url, _data, _success, _error, function() {}, "POST", "myhome");
						
					}else{
						$(".tip-panel").text("验证码输入不正确！");
					}
					
			    })
            }
            
        };
        var _complete = function () {
            $('.me-loading').hide();
        };
        var _error = function (obj) {
            alert(obj.message);
        };
		$.gjk.ajax.request(_url, _data, _success, _error, _complete, "POST", "getpwd");
   });
}
//init address
setAddress();
//init sex
setSex();
/*设置所在地区*/
function setAddress() {
//  $('#address-picker').val(comeFroms);
    $("#address-picker").cityPicker({
        toolbarTemplate: '<header class="bar bar-nav">\
		<button class="button button-link pull-left close-picker button-no recovery-picker-address">取消</button>\
		<button class="button button-link pull-right close-picker button-yes">确定</button>\
		</header>',
        recovery: '.recovery-picker-address'
    });
}

/*设置sex性别选择*/
function setSex() {
    $('#sex').val(sex);
    $("#sex").picker({
        toolbarTemplate: '<header class="bar bar-nav">\
	  <button class="button button-link pull-left close-picker button-no recovery-picker-sex">取消</button>\
	  <button class="button button-link pull-right close-picker button-yes">确定</button>\
	  </header>',
        cols: [
            {
                textAlign: 'center',
                values: ['男', '女']
            }
        ],
        recovery: '.recovery-picker-sex'
    });
}

/*购药药店*/
function getPharmacyInfor() {
    var enterUrl = $.gjk.path_url + 'self/medicineshop.html?' + 'pharId=' + pharId;
    window.location.href = enterUrl;
}
/*获取我的身份--所有疾病类型*/
function getIdentityInfor() {
    var _url = "disease/list";
//  var _data = {pharType: "2", pId: "1"};
    var _data = {};
    var _success = function (obj) {
    	console.log(obj);
        if(obj.success == true){
        	if (!!obj.data) {
	            userDiseaseNames = [],
	                diseaseIds = [];
	            for (var diseaseObj of obj.data) {
	                diseaseName = diseaseObj.userDiseaseName;
	                diseaseId = diseaseObj.diseaseId;
	                userDiseaseNames.push(diseaseName);
	                diseaseIds.push(diseaseId);
	            }
	//			console.log(userDiseaseNames);
	        }
	
	        $('#myIdentity').picker({
	            toolbarTemplate: '<header class="bar bar-nav">\
						  <button class="button button-link pull-left close-picker button-no recovery-picker-identity">取消</button>\
						  <button class="button button-link pull-right close-picker button-yes" onclick="saveDisease()">确定</button>\
						  <h1 class="title">疾病种类/患病时长 </h1>\
						  </header>',
	            cols: [{
	                textAlign: 'center',
	                values: userDiseaseNames
	            },
	                {
	                    textAlign: 'center',
	                    values: ['3个月内', '3-12个月', '1-3年', '3年以上']
	                }
	            ],
	            recovery: '.recovery-picker-identity'
	        });

        }
    }
    var _complete = function () {
        $('.me-loading').hide();
    };
    var _error = function (obj) {
        console.log(obj.message);
    };
    $.gjk.ajax.request(_url, _data, _success, _error, _complete, "POST", "selfinfor");

}

function saveData() {
    //var _photo = $('.mypic img').attr("src");
    var _nickName = $('input[name="nickName"]').val();
    var _sex = $('#sex').val();
    var _age = $('input[name="age"]').val();
    var _comeFrom = $('#address-picker').val();
    var _mobile = $('input[name="mobile"]').val();
    var _url = "mskluser/addOrUpdateUserExtInfoNew";
    var _data = {
        photo: "",
        nickName: _nickName,
        sex: _sex,
        age: _age,
        comeFrom: _comeFrom,
        mobile: _mobile,
        email: "",
        token: $.gjk.isHasToken(),
        userQq: ""
    };
    var _success = function (obj) {
		console.log(obj);
//		getUserInfo();
        if(obj.success == true){
        	var enterUrl = $.gjk.path_url + 'self/myhome.html';
       		window.location.href = enterUrl;
        }
    }
    var _error = function (obj) {
        console.log(obj.message);
    };
    var _complete = function () {
        $('.me-loading').hide();
    }
    $.gjk.ajax.request(_url, _data, _success, _error, _complete, "POST", "selfinfor");

}
/*我的处方*/
function getPresInfor() {
    var enterUrl = $.gjk.path_url + 'self/mypres.html';
    window.location.href = enterUrl;
}

function saveDisease() {
    /*向后台发送用户疾病身份信息*/
    var myDisease = $('#myIdentity').data("picker").cols[0].value;
    var myDsTime = $('#myIdentity').data("picker").cols[1].value;

    var _diseaseId = userDiseaseNames.indexOf(myDisease);
    var diseaseId = diseaseIds[_diseaseId];
    var _url = "mydisease/svarUserDisease";
    var _data = {
        "diseaseId": diseaseId,
        "userDiseaseName": myDisease,
        "userDiseaseDate": myDsTime,
        "userDiseaseId": userDiseaseId

    }
    var _success = function (obj) {
    	console.log(obj);
        if(obj.success == true){
        	var myIdentity = myDisease + myDsTime;
     		$('#myIdentity').val(myIdentity);
        }
    }
    var _error = function (obj) {
        console.log(obj.message);
    };
    var _complete = function () {
        $('.me-loading').hide();
    }
    $.gjk.ajax.postAjax(_url, _data, _success, _error, _complete, "POST", "selfinfor");
}
