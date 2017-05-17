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
    var newDate = new Date(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    defaultTime.endDate = format(newDate.getTime(), 'yyyy-MM-dd');

    var moreNewDate = new Date(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    defaultTime.moreDate = format(moreNewDate.getTime(), 'yyyy-MM-dd');

    var orderTime = new Date(date.getTime() + (60 * 24 * 60 * 60 * 1000));
    defaultTime.orderTime = format(orderTime.getTime(), 'yyyy-MM-dd');
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
    var futureDate = new Date(date.getTime() + (90 * 24 * 60 * 60 * 1000));
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
//转换月份
function getMonth(month) {
    var time;
    switch (month) {
        case '01':
            time = 0;
            break;
        case '02':
            time = 1;
            break;
        case '03':
            time = 2;
            break;
        case '04':
            time = 3;
            break;
        case '05':
            time = 4;
            break;
        case '06':
            time = 5;
            break;
        case '07':
            time = 6;
            break;
        case '08':
            time = 7;
            break;
        case '09':
            time = 8;
            break;
        case '10':
            time = 9;
            break;
        case '11':
            time = 10;
            break;
        case '12':
            time = 11;
            break;
    }
    return time;
}
//返回去掉0的日期
function fisteZ(obj) {
    if (obj[0] == 0) {
        obj = obj.slice(1);
    }
    return obj;
}

$('#goBackPack').on('click', function () {
    window.location.href = 'finishplan.html';
});
//时间转换
function timersda(date) {
    var timeArr = date.split(' ');
    var m = timeArr[0].split('-');
    var s = timeArr[1].split(':');
    return new Date(fisteZ(m[0]), getMonth(m[1]), fisteZ(m[2]), fisteZ(s[0]), fisteZ(s[1])).getTime()
}
function timersda_1(date) {
    var m = date.split('-');
    return new Date(fisteZ(m[0]), getMonth(m[1]), fisteZ(m[2])).getTime()
}
//找出最小值
// Array.min = function (array) {
//     return Math.min.apply(Math, array);
// };
//得到当前时间小于30分钟的时间
function getMIN() {
    return (new Date().getTime() + (30 * 60 * 1000))
}
//得到当前时间
function getNewTime() {
    return new Date().getTime()
}

//判断是否有重复的时间
function tiquAlartTime(obj, str) {
    var reg = new RegExp(str);
    var alartTimeArr = [];
    for (var item in obj) {
        if (reg.test(item)) {
            if (obj[item]) {
                alartTimeArr.push(obj[item])
            }
        }
    }
    //对数组去重
    var newArr = Array.from(new Set(alartTimeArr));
    // console.log(newArr)
    if (alartTimeArr.length === newArr.length) {
        return true
    } else {
        return false
    }
}
//弹出提示框
function alertTextModelHint(txt) {
    var $msg = $('#msg');
    var $reminder = $('#reminder');
    $reminder.show();
    $msg.html(txt);
    setTimeout(function () {
        $reminder.hide();
    }, 2000);
}
//改变开关的状态值(前面附带状态)
function changeBtnStates() {
    var $itemContent = $('.item-content');
    var $labelSwitch = $itemContent.find('.label-switch');
    var $switchCheckBox = $('#switchCheckBox');
    var $labelCheckbox = $switchCheckBox.find('.label-checkbox');
    $labelSwitch.click(function (e) {
        var ev = e || event;
        var elm = ev.target || ev.srcElement;
        if (elm.tagName === 'DIV') {
            if ($labelCheckbox.eq($labelSwitch.index($(this))).hasClass('checked')) {
                if ($(this).attr('data-state') == '0') {
                    $(this).attr('data-state', '1');
                } else {
                    $(this).attr('data-state', '0');
                }
            } else {
                $(this).attr('data-state', '0');
            }
        }else {
            return;
        }

        e.stopPropagation()
    })
}
//改变开关的状态值(没有附带状态)
function changeBtnStates2() {
    $('#switchHtml').on('click', '.label-switch', function (e) {
        var ev = e || event;
        var elm = ev.target || ev.srcElement;
        if (elm.tagName === 'DIV') {
            var state = $(this).attr('data-state');
            if (state == 0) {
                $(this).attr('data-state', 1)
            } else {
                $(this).attr('data-state', 0)
            }
        }else {
            return;
        }

    });
}

function endTimeCantThanStartTime(start, end) {
    var statTime = timersda_1(start);
    var endTime = timersda_1(end);
    if(endTime < statTime){
        return true
    }
    return false;
}