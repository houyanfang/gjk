$(function(){
	$.mvalidateExtend({
        phone:{
            required : true,   
            pattern : /^0?1[3|4|5|8][0-9]\d{8}$/,
            each:function(){
               
            },
            descriptions:{
                required : '请输入手机号码',
                pattern : '您输入的手机号码格式不正确'
            }
        },
        verCode:{
        	required : true,  
            each:function(){
               
            },
            descriptions:{
                required : '请输入验证码',
            }
        },
        bankCardId:{
        	required : true,
        	pattern : /\d{16,19}/,
        	each:function(){},
        	descriptions:{
        		required : '请输入银行卡号',
                pattern : '您输入的银行卡卡号格式不正确'
           	}
        },
        idCard:{
        	required : true,
        	pattern : /^[1-9]\d{5}[1-9]\d{3}(((0[13578]|1[02])(0[1-9]|[12]\d|3[0-1]))|((0[469]|11)(0[1-9]|[12]\d|30))|(02(0[1-9]|[12]\d)))(\d{4}|\d{3}[xX])$/,
        	each:function(){},
        	descriptions:{
        		required : '请输入身份证号',
                pattern : '您输入的身份证号码格式不正确'
        	}
        }
    });
    
    $("#test_form").mvalidate({
        type:1,
        onKeyup:true,
        sendForm:true,
        firstInvalidFocus:true,
        valid:function(event,options){
            //点击提交按钮时,表单通过验证触发函数
            event.preventDefault();
        },
        invalid:function(event, status, options){
            //点击提交按钮时,表单未通过验证触发函数
        },
        eachField:function(event,status,options){
            //点击提交按钮时,表单每个输入域触发这个函数 this 执向当前表单输入域，是jquery对象
        },
        eachValidField:function(val){},
        eachInvalidField:function(event, status, options){},
        conditional:{
            pwd2:function(val,options){
                $("#confirmpwd2").trigger("keyup."+options.namespace);
                return true;
            },
            confirmpwd2:function(val){
                var flag;
                return (val==$("#pwd2").val()) ? true :false; 
            },
        },
        descriptions:{
            username:{
                required : '请输入用户名'
            },
            age : {
                required : '请输入年龄',
                pattern : '你输入的年龄格式不正确'
            },
            oldpwd : {
            	 required : '请输入原密码'
            },
            password:{
                required : '请输入密码'
            },
            confirmpassword:{
                required : '请再次输入密码',
                conditional : '两次密码不一样'
            },
            address:{
                required : '请选择地址'
            }
		}
	});
});