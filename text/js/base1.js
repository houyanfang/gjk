//改变picker的高度
function changePicker() {
    var $pickerModal = $('.picker-modal');
    if ($pickerModal) {
        if ($pickerModal.find('.toolbar')) {
            $pickerModal.css({
                'height': '260px'
            })
        }
    }
}
//获得url参数
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
//时间戳转换函数
function format(time, format) {
    var t = new Date(time);
    var tf = function (i) {
        return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd/g, function (a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'dd':
                return tf(t.getDate());
                break;
        }
    })
}
//生成默认开始结束时间
function createStartAndEndDate() {
    var defaultTime = {};
    var date = new Date();
    defaultTime.startDate = format(date.getTime(), 'yyyy-MM-dd');
    var newDate = new Date(date.getTime() + (60 * 24 * 60 * 60 * 1000));
    defaultTime.endDate = format(newDate.getTime(), 'yyyy-MM-dd');
    var moreNewDate = new Date(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    defaultTime.moreDate = format(moreNewDate.getTime(), 'yyyy-MM-dd');
    return defaultTime;
}

//判断数组中有不为null的数值
function btnCount(obj) {
    var num = 0;
    for (var i = 0; i < obj.length; i++) {
        if (obj[i]) {
            num++;
        }
    }
    return num
}
//删除状态值
function deleteState(obj) {
    var timeAndState;
    if (obj) {
        timeAndState = obj.split('|');
        return timeAndState;
    } else {
        return '';
    }
}

//生成按钮的数量
function createBtnCount(obj) {
    var exp = new RegExp('alarm');
    var alertTimes = [];
    for (var items in obj) {
        if (exp.test(items)) {
            alertTimes.push(obj[items])
        }
    }
    return alertTimes;
}


function limitTimeDate() {
    $pickerModal = $('.picker-modal');
    var date = new Date();
    var futureDate = new Date(date.getTime() + (100 * 24 * 60 * 60 * 1000));
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var futureDay = futureDate.getDay();
    console.log(futureDay)
    var $pickerCalendarNextYear = $('.picker-calendar-next-year');
    var $pickerCalendarPrevYear = $('.picker-calendar-prev-year');
    var $pickerCalendarNextMonth = $('.picker-calendar-next-month');
    var $pickerCalendarPrevMonth = $('.picker-calendar-prev-month');

    $pickerCalendarNextYear.on('click', changeDayState);
    $pickerCalendarPrevYear.on('click', changeDayState);
    $pickerCalendarNextMonth.on('click', changeDayState);
    $pickerCalendarPrevMonth.on('click', changeDayState);
    function changeDayState() {
        var fullDate = getFullDate($pickerModal);
        var $pickerCalendarDay = $('div.picker-calendar-day');
        if (fullDate.year > year) {
            $pickerCalendarDay.addClass('picker-calendar-day-disabled');
            return
        }
        if (fullDate.month > month + 4) {
            $pickerCalendarDay.addClass('picker-calendar-day-disabled');
        } else if (fullDate.month == month + 4) {
            $pickerCalendarDay.removeClass('picker-calendar-day-disabled');
            $pickerCalendarDay.each(function (i) {
                if ($(this).attr('data-year') == year && $(this).attr('data-month') == (month + 1)) {
                    if ($(this).attr('data-day') > futureDay) {
                        $(this).addClass('picker-calendar-day-disabled');
                    }
                }
            })
        }
    }
}


function getFullDate(parent) {
    var fullDate = {};
    var year = parent.find('.current-year-value').html();
    fullDate.year = year;
    var month = parent.find('.current-month-value').html();
    switch (month) {
        case '一月':
            fullDate.month = 1;
            break;
        case '二月':
            fullDate.month = 2;
            break;
        case '三月':
            fullDate.month = 3;
            break;
        case '四月':
            fullDate.month = 4;
            break;
        case '五月':
            fullDate.month = 5;
            break;
        case '六月':
            fullDate.month = 6;
            break;
        case '七月':
            fullDate.month = 7;
            break;
        case '八月':
            fullDate.month = 8;
            break;
        case '九月':
            fullDate.month = 9;
            break;
        case '十月':
            fullDate.month = 10;
            break;
        case '十一月':
            fullDate.month = 11;
            break;
        case '十二月':
            fullDate.month = 12;
            break;
    }
    return fullDate;
}

$('#goBackPack').on('click',function () {
    window.location.href = 'finishplan.html';
})