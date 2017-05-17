var lock = false;
$(document).ready(function(){
		getPresInfor();
		
		$("#add-btn").on("change",function(){
			
			//has file
			if(this.files && this.files[0])
			{
				$('#nopres').addClass('hide');
				$('#upload-pres').removeClass('hide');
				var FR= new FileReader();    
			    FR.addEventListener("load", function(e) {
			      	$("#prev-image").attr({src:e.target.result});
			    }); 
			    
			    FR.readAsDataURL(this.files[0] );
			}
		});
		
		$(".upload-btn").on("click",function(){
			$('.me-loading').show();
			if(lock){
				return;
			}
			if(!lock){
				var _url = "mskluser/uploadPrescription";
				var _data ={"patientUserid": "0", "file":$("#prev-image").attr("src")};
				lock = true;
				var _success = function(obj){
				console.log(obj);
				lock = false;
					if(obj.success == true)
					{
						window.location.reload();
					}
				};
				var _error = function(obj){
				//	alert(data.message);
	                window.location.reload();
	                 lock = true;
				};
				var _complete = function(){
					$('.me-loading').hide();
				};
				
				$.gjk.ajax.basePostRequest(_url, _data, _success, _error, _complete, "POST", "mypres");
			
			}
		})
		
		$(".upload-again").on("change", function(){
			//$('.me-loading').show();
			if(this.files && this.files[0])
			{
				$('#verifying-pres').addClass('hide');
				$('#upload-pres').removeClass('hide');
				var FR= new FileReader();    
			    FR.addEventListener("load", function(e) {
			      	$("#prev-image").attr({src:e.target.result});
			    }); 
			    
			    FR.readAsDataURL(this.files[0] );
			}
		});
		
});	
	function getPresInfor(){
		$('.me-loading').show();
//		var _url = "mskluser/findUserPrescription";
        
        var _url = "medrecord";
		var _success = function(obj){
			console.log(obj);
			if(obj.success == true && obj.data)
			{
				$('#verifying-pres').removeClass('hide');
				var status = obj.data.medRecordStatus;
				switch(status){
					case 1:
						$('.status').text("审核中");
						break;
					case 2:
					 	$('.status').text("审核通过");
						break;
					case 3:
					    $('.status').text("审核失败");
						break;
					default:
					    $('.status').text("");
				}
			}else{
				$('#nopres').removeClass('hide');
			}
		};
		var _error = function(obj){
//			alert(obj);
//			console.log("123");
		};
		var _complete = function(){
			$('.me-loading').hide();
		};
		
		$.gjk.ajax.postAjax(_url, {}, _success, _error, _complete, "POST", "mypres");
	}