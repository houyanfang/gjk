$(document).ready(function () {
    if(localStorage.localData){
        var data = JSON.parse(localStorage.localData);
        insertPlan(data.data);
        searchMedicine();
    }else {
        getTreatList();
    }

    var h = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    $(".chang_main").css("max-height", h - 160);
    $(".zimu span").tap(function () {
        var mm = $(this).html();
        $(".login-prompt-cen").html(mm);
        if ($(".li" + mm)[0]) {
            var mTop = $(".li" + mm)[0].offsetTop;
            $(".chang_main").scrollTo({endY: (mTop-34), duration: 500});
        }
        sol();
    });
});
function sol() {
    $(".login-prompt").show();
    setTimeout(hide, 500);
}
function hide() {
    $(".login-prompt").animate({opacity: 0}, "slow");
}
function getTreatList() {
    $(".me-loading").show();

    $(".chang_main ul li").remove();

    $.gjk.ajax.getAjax("msklmedicine/all", {}, function (data) {

        console.log(data);

        if (data.success) {
            localStorage.localData = JSON.stringify(data);
            insertPlan(data.data);
            searchMedicine();
        }

        $(".me-loading").hide();
    }, function () {
        // alert("获取数据失败！");
        $(".me-loading").hide();
    }, function () {
    }, "GET", "medicine");

}

//搜索
function searchMedicine() {
    var $medicine_name = $('#medicine_name');
    var $muiTableView = $('#searchlogList');
    var localData = JSON.parse(localStorage.localData);

    $medicine_name.on('keyup', function () {
        if (!$(this).val()) {
            return;
        }

        //搜索出來對象的集合
        var searchObj = [];

        var key = $(this).val();

        var reg = new RegExp(key);
        for (var i = 0; i < localData.data.length; i++) {
            if (reg.test(localData.data[i].medicalName)) {
                searchObj.push(localData.data[i]);
            }
            if (reg.test(localData.data[i].manufacturer)) {
                searchObj.push(localData.data[i]);
            }
            if (reg.test(localData.data[i].normalName)) {
                searchObj.push(localData.data[i]);
            }
        }

        if (searchObj.length == 0) {
            //如果沒有搜索出來内容，執行下面的語句
            $('#searchlogList').css('height', 0);
            $('#list').css('height', 'auto')
        } else {
            $('#searchlogList').css('height', '592px');
            $('#list').css('height', '592px')
        }

        //搜索出來内容，循環到替換頁面的内容
        insertPlan(searchObj)
    })
}

//插入
function insertPlan(data) {
//	$('#searchlog').css('display','none');
    $("#searchlogList").html('');
    var category = '';
    var elements = $();
    $.each(data, function (i, item) {
        var li = '';
        if (item.pinyin != category) {
            category = item.pinyin;
            li = '<li class="mui-table-view-divider mui-indexed-list-group medicine-list-title">' + category + '</li>';
        }
        li += '<li class="mui-table-view-cell mui-indexed-list-item li' + item.pinyin + '" onclick="toeditplan(' + item.msklMedicineId + ',\'' + item.medicalName + '\')">'
            + '	<div class="chang_centTop">' + item.medicalName + '(' + item.normalName + ')<span>' + item.packageAmount + item.medicineUnit + '</span></div>'
            + '	<div class="company-name">' + item.manufacturer + '</div>'
            + '</li>';
        elements = elements.add(li);
    });
    $(".chang_main ul").append(elements);
}

//点击跳转到对于的药品页面

function toeditplan(msklMedicineId, medicalName) {
    var name = 'name=' + medicalName;
    var id = '&id=' + msklMedicineId;
    var urlPost = '../plan/addmedicine.html?';
    var states = '&states=1';
    var token = '&token=' + $.gjk.isHasToken();
    var timeStamp = '&timeStamp=' + $.gjk.getTimeStamp();
    window.location.href = urlPost + name + id + token + timeStamp + states;
}

$('.circular').on('click', function () {
    addToeditPlan();
});

//点击添加药品
function addToeditPlan() {
    var urlPost = '../plan/addmedicine.html?';
    var states = '&states=-1';
    var token = '&token=' + $.gjk.isHasToken();
    var timeStamp = '&timeStamp=' + $.gjk.getTimeStamp();
    window.location.href = urlPost + token + timeStamp + states;
}
