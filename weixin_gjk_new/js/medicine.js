$(document).ready(function () {
    if(localStorage.localData){
        var data = JSON.parse(localStorage.localData);
        checkMedicineUpdate()
    }else {
        getTreatList();
    }

    var pingyinArr = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    var mm = "A";
    
    var h = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    $(".chang_main").css("max-height", h - 160);
    $(".zimu span").tap(function () {
        mm = $(this).html();
        pinyinList(mm,0)
    });

    var num = pingyinArr.indexOf(mm);
    //滑动加载更多
    $('.chang_main').on("scroll",function () {

        var $searchlogList = $('#searchlogList');
        var $chang_main = $('.mui-indexed-list-inner.chang_main');

        if($searchlogList.height() <= ($chang_main.height() + $chang_main.scrollTop() + 1 )){
            num ++ ;
            if(num > pingyinArr.length-1){
                num = pingyinArr.length-1;
            }
            pinyinList(pingyinArr[num],1);
        }
    })

});

//匹配药品库是否有药品更新
function checkMedicineUpdate() {
    var optoins = {
        url:'http://gl.gjk.com.cn/mskl-api/api/msklmedicine/getMaxId',
        success:function (res) {
            var maxId = localStorage.lastMedicineId;
            if(res.success == true){
                if(res.data){
                    if(res.data == maxId){
                        pinyinList("A",0)
                        searchMedicine();
                    }else{
                        getTreatList();
                    }
                }
            }
        },
        error:function (res) {
            // body...
        }
    }
    $.ajax({
        type: "GET",
        url: optoins.url,
        dataType: 'json',
        contentType: 'application/json',
        success: optoins.success,
        error: optoins.error,
    })
}

function pinyinList(obj,num) {

    var reg = new RegExp(obj);
    var data = JSON.parse(localStorage.localData);
    var medicineList = [];
    for(var i=0;i<data.data.length;i++){
        if(reg.test(data.data[i].pinyin)){
            medicineList.push(data.data[i])
        }
    }
    if (medicineList.length == 0) {
        //如果沒有搜索出來内容，執行下面的語句
        var html = '<div class="hasNoPinyin"><span>没有找到您点击首字母的药品，请您再次点击，或者点击下方“继续添加计划”添加服药计划</span></div>'
        $('#searchlogList').html(html);
    } else {
        //搜索出來内容，循環到替換頁面的内容
        if(num == 0){
            insertPlan(medicineList)
        }else if(num == 1){
            scrollLoadMoreInsertPlan(medicineList)
        }
        
    }
}

//获取药品列表
function getTreatList() {
    $(".me-loading").show();

    $(".chang_main ul li").remove();

    $.gjk.ajax.request("msklmedicine/all", {}, function (data) {

        console.log(data);

        if (data.success) {
            localStorage.localData = JSON.stringify(data);
            localStorage.lastMedicineId = $(data.data).last()[0].msklMedicineId
            pinyinList("A",0)
            searchMedicine();
        }

        $(".me-loading").hide();
    }, function () {
        // alert("获取数据失败！");
        $(".me-loading").hide();
    }, function () {
    }, "POST", "medicine");

}

//搜索
function searchMedicine() {
    var key;
    var $medicine_name = $('#medicine_name');
    var $muiTableView = $('#searchlogList');
    var localData = JSON.parse(localStorage.localData);
    $medicine_name.on('keyup', function () {
        if (!$(this).val()) {
            pinyinList("A",0);
            return;
        }

        //搜索出來對象的集合
        var searchObj = [];

        key = $(this).val();
            var reg = new RegExp(key);
            for (var i = 0; i < localData.data.length; i++) {
                //搜素通用名
                if (reg.test(localData.data[i].medicalName)) {
                    searchObj.push(localData.data[i]);
                }
                //搜索製造商
                if (reg.test(localData.data[i].manufacturer)) {
                    searchObj.push(localData.data[i]);
                }
                //搜索商品名
                if (reg.test(localData.data[i].normalName)) {
                    searchObj.push(localData.data[i]);
                }
                //拼音首字母小写
                if(reg.test(localData.data[i].pinyin.toLowerCase())){
                    searchObj.push(localData.data[i]);
                }
                //拼音首字母大写
                if(reg.test(localData.data[i].pinyin)){
                    searchObj.push(localData.data[i]);
                }
            }

        if (searchObj.length == 0) {
            //如果沒有搜索出來内容，執行下面的語句
            $('#searchlogList').css('height', 0);
            $('#list').css('height', 'auto');
            $('#searchlogList').html("");
        } else {
            $('#searchlogList').css('height', '76vh');
            $('#list').css('height', '76vh');
            //搜索出來内容，循環到替換頁面的内容
            insertPlan(searchObj)
        }
    })
}

//插入dom结构
function insertPlan(data) {
    $("#searchlogList").html('');
    var category = '';
    var elements = $();
    $.each(data, function (i, item) {
        var li = '';
        if (item.pinyin != category) {
            category = item.pinyin;
            li = '<li class="mui-table-view-divider mui-indexed-list-group medicine-list-title">' + category + '</li>';
        }
        li += '<li class="mui-indexed-list-item li' + item.pinyin + '" onclick="toeditplan(' + item.msklMedicineId + ',\'' + item.medicalName + '\',\'' + item.manufacturer + '\',\'' + item.medicineUnit + '\',\''+ item.normalName + '\')">'
            + ' <div class="chang_centTop">' + item.medicalName + '(' + item.normalName + ')<span>' + item.packageAmount + item.medicineUnit + '</span></div>'
            + ' <div class="company-name">' + item.manufacturer + '</div>'
            + '</li>';
        elements = elements.add(li);
    });
    $(".chang_main ul").append(elements);
}

//滑动加载更多dom结构
function scrollLoadMoreInsertPlan(data) {
    var category = '';
    var elements = $();
    $.each(data, function (i, item) {
        var li = '';
        if (item.pinyin != category) {
            category = item.pinyin;
            li = '<li class="mui-table-view-divider mui-indexed-list-group medicine-list-title">' + category + '</li>';
        }
        li += '<li class="mui-indexed-list-item li' + item.pinyin + '" onclick="toeditplan(' + item.msklMedicineId + ',\'' + item.medicalName + '\',\'' + item.manufacturer + '\',\'' + item.medicineUnit + '\',\''+ item.normalName + '\')">'
            + ' <div class="chang_centTop">' + item.medicalName + '(' + item.normalName + ')<span>' + item.packageAmount + item.medicineUnit + '</span></div>'
            + ' <div class="company-name">' + item.manufacturer + '</div>'
            + '</li>';
        elements = elements.add(li);
    });
    $(".chang_main ul").append(elements);
}

//点击跳转到对于的药品页面
function toeditplan(msklMedicineId, medicalName, manufacturer, medicineUnit, normalName) {

    var optoins = {
        checkedUrl:"treatPlan/check/" + medicalName,
        success:function(res) {
            
            if(res.data){
                var $msg = $('#modelContext');
                var $reminder = $('#longModel');
                $reminder.show();
                $msg.find('p').eq(0).html('计划中已存在该药品，');
                $msg.find('p').eq(1).html('是否前去修改？');
                $('body').on('click','.btnRes',function () {
                    $reminder.hide();
                });
                $('body').on('click','.btnOk',function () {
                    addAllPlan(medicalName);
                });
                return;
            }else{
                goToMedical(msklMedicineId, medicalName, manufacturer, medicineUnit, normalName)
            }
        },
        error:function(res) {
            // body...
        }
    }
    $.gjk.ajax.postAjax(optoins.checkedUrl, {}, optoins.success, optoins.error, function () {
        // body...
    },"POST", "check")

    //获取计划列表详情
    function addAllPlan(name) {
        var _url = 'dailyRecord/findAllUserPlanByUserId';
        var _data = {};
        var _success = function (data) {

            var PlanId = getMedicalList(data.data,name);

            window.location.href = "http://gl.gjk.com.cn/mskl-api/weixin_gjk_new/plan/modifymedicine.html?id=" + PlanId + "&state=1"

            }
        var _error = function (data) {};
        $.gjk.ajax.postAjax(_url, _data, _success, _error, function () {
        }, 'POST', 'findAllUserPlanByUserId');
    }
}

function getMedicalList(res,name) {
    for(var i=0;i<res.length;i++){
        if(res[i].planType == "treat"){
            if(res[i].planData.medicalName == name){
                return res[i].planData.msklTreatplanId
            }
        }
    }
}

function goToMedical(msklMedicineId, medicalName, manufacturer, medicineUnit, normalName) {
    var medicalName = 'medicalName=' + medicalName;
    var normalName = '&normalName=' + normalName;
    var id = '&id=' + msklMedicineId;
    var manufacturer = '&manufacturer=' + manufacturer;
    var urlPost = '../plan/addmedicine.html?';
    var states = '&states=1';
    window.location.href = urlPost + medicalName + normalName + manufacturer + states;
}

//点击继续添加药品
$('.circular').on('click', function () {
    addToeditPlan();
});

function addToeditPlan() {
    var urlPost = '../plan/addmedicine.html?';
    var states = '&states=-1';
    window.location.href = urlPost + states;
}