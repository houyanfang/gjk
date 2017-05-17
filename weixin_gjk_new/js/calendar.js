/**
 * $.gjk.calendar
 * @param {type} $
 * @returns {undefined}
 */

(function ($, window, document) {
    //创建当前日期
    function createDate() {
        if (arguments.length == 3) return new Date(arguments[0], arguments[1], arguments[2]);
        return new Date();
    }

    getCalendarData(getDate(createStartAndEndDate().startDate));
    $('#marqueeText').html("")
    //日期转化字符串
    function dateToString(date) {
        if ($.type(date) != "date") return "";
        var __m = (date.getMonth() + 1);
        if ((date.getMonth() + 1) < 10) {
            __m = '0' + (date.getMonth() + 1);
        }
        var __d = date.getDate();
        if (date.getDate() < 10) {
            __d = '0' + date.getDate();
        }

        return (date.getFullYear() + '-' + __m + '-' + __d);
    }

    //字符串转化为日期
    function stringToDate(str) {
        if ($.type(str) != "string") return createDate();
        var _strs = str.split('-');
        if (_strs.length < 3) return createDate();
        return createDate(_strs[0], parseInt(_strs[1]) - 1, _strs[2]);
    }

    //日期年月日操作
    function superDate(date, y, m, d) {
        if ($.type(date) != "date") return createDate();
        var _y = date.getFullYear(),
            _m = date.getMonth(),
            _d = date.getDate();
        return createDate((_y + y), (_m + m), (_d + d));
    }

    //初始化储存
    function initStore() {
        var _arrDates = [];
        for (var _i = 0; _i < 6; _i++) {
            _arrDates[_i] = [{}, {}, {}, {}, {}, {}, {}];
        }
        return _arrDates;
    }

    //储存日期
    function dateStrore(arrDate, x, y, v) {
        arrDate[x][y] = v;
    }

    //储存月
    function dateToStore(store, date, curr) {
        var _main = createDate(),
            _start, _begin, j = 0,
            _now = createDate();
        if ($.type(date) == "date") _main = date;
        _start = createDate(_main.getFullYear(), _main.getMonth(), 1);
        _begin = superDate(_start, 0, 0, -(_start.getDay() == 0 ? 7 : _start.getDay()));
        for (var i = 1; i < 43; i++) {
            var _y = i % 7 == 0 ? 7 : i % 7;
            var _str = dateToString(_begin),
                _isNow = false,
                _isCurr = false,
                _isActive = false;
            if (dateToString(_now) == dateToString(_begin)) _isNow = true;
            if (localDate(curr) == localDate(_begin)) _isCurr = true;
            if (_str == getKeyByStorage('actived')) _isActive = true;
            dateStrore(store, j, (_y - 1), {
                str: _str,
                week: _begin.getDay(),
                index: _begin.getDate(),
                isNow: _isNow,
                isCurr: _isCurr,
                isActive: _isActive
            });
            if (i % 7 == 0) {
                j++;
            }
            _begin.setDate(_begin.getDate() + 1);
        }
        _main = null, _start = null, _begin = null, _now = null;
    }

    //储存日
    function weekToStore(store, date, curr) {
        var _now = createDate();
        for (var i = 0; i < 7; i++) {
            var _str = dateToString(date),
                _isNow = false,
                _isCurr = false,
                _isActive = false;
            if (dateToString(_now) == dateToString(date)) _isNow = true;
            if (localDate(curr) == localDate(date)) _isCurr = true;
            if (dateToString(date) == getKeyByStorage('actived')) _isActive = true;
            store[i] = {
                str: _str,
                week: date.getDay(),
                index: date.getDate(),
                isNow: _isNow,
                isCurr: _isCurr,
                isActive: _isActive
            };
            date.setDate(date.getDate() + 1);
        }
    }

    //输出月
    function renderDate(date) {
        var _data = [];
        _data = initStore(),
            _now = createDate();

        if ($.type(date) == "date") _now = date;
        dateToStore(_data, _now, _now);
        return _data;
    }

    //输出日
    function renderWeek(date) {
        var _data = [],
            _main = createDate();
        if ($.type(date) == "date") _main = date;
        var _start = superDate(_main, 0, 0, -(_main.getDay()));
        weekToStore(_data, _start, _main);
        _main = null, _start = null;
        return _data;
    }

    //输出本地日期
    function localDate(date) {
        return date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
    }

    //打印到DOM树
    var renderTag;

    function renderHTML(_data, container, _mode) {
        renderTag = $(container),
            tr = "<tr></tr>", td = "<td></td>", span = "<span></span>",
            _flag = false, _tr = $(tr);
        $(container).find('td').unbind('tap');
        renderTag.empty();
        _data.forEach(function (v) {
            if (_mode == "week") {
                var _td = $(td).attr('title', v.str).attr('week', v.week),
                    _span = $(span).text(v.index);

                if (v.isNow) _td.addClass('today');
                if (!v.isCurr) _td.addClass('old');
                if (v.isActive) _td.addClass('active');
                _td.append(_span);
                _tr.append(_td);
            } else if (_mode == "date") {
                _tr = $(tr), _flag = true;
                v.forEach(function (vs) {
                    var _td = $(td).attr('title', vs.str).attr('week', vs.week),
                        _span = $(span).text(vs.index);
                    if (v.isNow) _td.addClass('today');
                    if (vs.isNow) _td.addClass('today');
                    if (!vs.isCurr) _td.addClass('old');
                    if (vs.isActive) _td.addClass('active');
                    _td.append(_span);
                    _tr.append(_td);
                })
                renderTag.append(_tr);
            }
        })
        if (!_flag) renderTag.append(_tr);
        //event
        $(container).find('td').bind('tap', function (e) {
            // console.log(e)
            e.stopPropagation();
            $('td.active').removeClass('active');
            $(this).addClass('active');
            storage('actived', $(this).attr('title'));
            getAjaxData($(this).attr('title'))
        });
    }

    //左切换
    function leftEvent(mode, container, callback) {
        var _initd = getKeyByStorage('initd'),
            _d = createDate(), _data;
        if (_initd) _d = stringToDate(_initd);
        if (mode == "week") {
            _d = superDate(_d, 0, 0, 6 - (_d.getDay()));
            _d.setDate(_d.getDate() - 7);
            _data = renderWeek(_d);
        } else if (mode == "date") {
            _d = superDate(_d, 0, -1, 0);
            _data = renderDate(_d);
        }
        storage('initd', dateToString(_d));
        renderHTML(_data, container, mode);
        callback(localDate(_d));
        monthChangeCheck(localDate(_d), _d)
    }

    //右切换
    function rightEvent(mode, container, callback) {
        var _initd = getKeyByStorage('initd'),
            _d = createDate(), _data;
        if (_initd) _d = stringToDate(_initd);
        if (mode == "week") {
            _d = superDate(_d, 0, 0, 6 - (_d.getDay()));
            _d.setDate(_d.getDate() + 7);
            _data = renderWeek(_d);
        } else if (mode == "date") {
            _d = superDate(_d, 0, 1, 0);
            _data = renderDate(_d);
        }
        storage('initd', dateToString(_d));
        renderHTML(_data, container, mode);
        callback(localDate(_d));
        monthChangeCheck(localDate(_d), _d)
    }

    //本地保存
    function storage(keys, values) {
        localStorage.setItem(keys, values);
    }

    function getKeyByStorage(keys) {
        return localStorage.getItem(keys);
    }

    function clearList() {
        $('.calendar-list-link').remove();
        $('.calendar-list-block').empty();
    }

    var $calendarFoot = $('.calendar-foot');
    //下拉按钮的点击事件
    $calendarFoot.unbind('click');
    $calendarFoot.on('click', function () {
        getCalendarData(getDate(createStartAndEndDate().startDate));
        $('#marqueeText').html("")
    });

    //请求每天计划完成的状态
    function getCalendarData(dateStr) {
        //TODO 请求计划列表
        setTimeout(function () {
            $.gjk.ajax.postAjax('dailyRecord/planInfos', {
                date: getDate(dateStr)
            }, function (res) {
                // console.log(res)
                if (res.success == true) {
                    createStates(res.data);
                } else {
                    // alert(res.message);
                }
            }, function (err) {
                // console.log(err);
                // alert('网络请求失败！');
            }, function () {
            }, 'POST');
        }, 100);
    }

    //改变时间状态
    function getDate(date) {
        var __date;
        if (date.length == 10) {
            __date = date.slice(0, 7)
        } else {
            var newDate = new Date(date);
            var dateBack = format(newDate, 'yyyy-MM-dd');
            __date = dateBack.slice(0, 7)
        }
        return __date
    }

    //判断是小日历还是大日历
    function createStates(data) {
        var $calendarWeek = $('.calendar-week');
        var $calendarDate = $('.calendar-date');
        if ($calendarWeek.css('display') == 'block') {
            var $calendarWeekTd = $('.calendar-week').find('tbody');
            data.forEach(function (items) {
                judegState(items, $calendarWeekTd);
            })
        }
        if ($calendarDate.css('display') == 'block') {
            var $calendarDateTd = $('.calendar-date').find('tbody');
            data.forEach(function (items) {
                judegState(items, $calendarDateTd);
            })
        }
    }

    //生成对应的点
    function judegState(obj, parent) {
        if (obj.logStatus == 5) {
            $('#marqueeText').html("");
            if (obj.logContext) {
                parent.find('td[title="' + obj.logDate + '"]').addClass('eatit');
                parent.find('td[title="' + obj.logDate + '"]').on('click',function () {
                    var html = '<marquee behavior="scroll">您的'+ obj.logContext +'药物将于该日服完，为了保证用药的连续性，请您及时购药！</marquee>'
                    $('#marqueeText').html(html);
                });
            }
            return
        }
        if (obj.logStatus == 0) {
            parent.find('td[title="' + obj.logDate + '"]').addClass('none');
            $('#marqueeText').html("")
        }
        if (obj.logStatus == 1) {
            parent.find('td[title="' + obj.logDate + '"]').addClass('do');
            $('#marqueeText').html("")
        }
    }

    //提取年月日的方法
    function getYearMonthDay(obj) {
        var dateArr = {};
        var data = obj.split('-');
        dateArr.year = data[0];
        dateArr.month = getMonth(data[1]);
        dateArr.day = fisteZ(data[2]);
        return dateArr
    }

    //获取当前时间的时间戳
    function getNewTime() {
        var newDate = new Date();
        var newDay = getYearMonthDay(format(newDate.getTime(), 'yyyy-MM-dd'));
        return createTimeStamp(newDay.year, newDay.month, newDay.day)
    }

    //生成时间戳
    function createTimeStamp(y, m, d) {
        return new Date(y, m, d).getTime();
    }

    var dateTime;
    //请求页面的计划
    function getAjaxData(dateStr) {
        //TODO 请求计划列表
        dateTime = dateStr;
        setTimeout(function () {
            $.gjk.ajax.postAjax('dailyRecord/findLogByDate', {
                date: dateStr
            }, function (res) {
                if (timersda_1(dateStr) < getNewTime()) {
                    $('#addPlanHealth').hide();
                } else {
                    $('#addPlanHealth').show();
                }
                if (res.success) {
                    console.log(res);
                    if (!res.data) {
                        // alert(res.message);
                        return;
                    }
                    clearList();

                    if (res.data.length == 1) {
                        $('.calendar-list-view').removeClass('hide')
                    } else {
                        $('.calendar-list-view').addClass('hide')
                    }
                    var __tmparr1 = [];
                    var __tmparr2 = [];
                    var __tmparr3 = [];
                    var __tmparr4 = [];
                    res.data.forEach(function (data) {
                        data = $.gjk.utils.convertJSONData(data);
                        data.logData = $.gjk.utils.convertJSONData(data.logData);
                        data.logData.takenStatus = $.gjk.utils.convertJSONData(data.logData.takenStatus);
                        // console.log(data)
                        if (data.logStatus == 0) {
                            __tmparr1.push(data);
                        } else if (data.logStatus == 1) {
                            if (data.logData.takenStatus) {
                                if (data.logData.takenStatus == 1) {
                                    __tmparr2.push(data);
                                } else if (data.logData.takenStatus == 2) {
                                    __tmparr3.push(data);
                                } else if (data.logData.takenStatus == 4) {
                                    __tmparr4.push(data);
                                } else {
                                    __tmparr2.push(data);
                                }
                            } else {
                                if (data.logType == "yesterdayPlan") {
                                    __tmparr1.push(data)
                                }
                            }
                        } else if (data.logType == "yesterdayPlan") {
                            __tmparr1.push(data)
                        }

                    });
                    var arrJSON = __tmparr1.concat(__tmparr2).concat(__tmparr3).concat(__tmparr4);
                    console.log(arrJSON)
                    arrJSON.forEach(function (data) {
                        planTypeMapping(data)
                    })

                } else {
                    alert(res.message);
                }
            }, function (err) {
                // alert('网络请求失败！');
            }, function () {

            }, 'POST', 'index');
        }, 100);
    }

    function planTypeMapping(obj) {
        var type = obj.logType;
        var __res = {
            success: false,
            code: 0,
            data: {}
        };

        function dispatch(obj, fn1, fn2, fn3) {
            if (obj.logStatus == 0) {
                __res.success = true;
                __res.code = 1;
                fn1()
            } else if (obj.logStatus == 1) {
                __res.success = true;
                __res.code = 2;
                fn2()
            }
            else if (obj.logStatus == 2) {
                __res.success = true;
                __res.code = 1;
                fn3()
            }
        }

        switch (type) {
            case 'yesterdayPlan':
                var num;
                dispatch(obj, function () {
                    num = 0;
                    renderToYesterday(__res, num);
                    $('.calendar-status').text('未记录')
                }, function () {
                    num = 0;
                    renderToYesterday(__res, num);
                    $('.calendar-status').text('未记录')
                }, function () {
                    num = 1;
                    renderToYesterday(__res, num);
                    $('.calendar-status').text('已记录')
                });
                break;
            case 'sportLog':
                dispatch(obj, function () {
                    renderToPlan(obj)
                }, function () {
                    renderToPlan(obj)
                }, function () {
                });
                break;
            case 'dietLog':
                ;
            case 'treatLog':
                dispatch(obj, function () {
                    renderToPlan(obj)
                }, function () {
                    renderToPlan(obj)

                }, function () {
                });
                break;
        }
    }

    function renderToYesterday(data, n) {
        var __a = '<a href="javascript:;" class="calendar-list-link"></a>',
            __title = '<div class="ls-title pull-left">昨日执行情况</div>',
            __link = '<div class="inlink glyphicon glyphicon-menu-right pull-right"></div>',
            __status = '<span class="calendar-status pull-right"></span>';
        if (getMIN() > timersda_1(dateTime)) {
            __a = '<a href="' + 'http://gl.gjk.com.cn/mskl-api/weixin_gjk_new/plan/yesterdayrecord.html?f=' + data.code + '&time=' + dateTime + '&state=' + n + '" class="calendar-list-link"></a>'
        }
        var container = $(__a);
        $('.calendar-list-view').before(container);
        $(container).append($(__title)).append(__link).append(__status);
    }

    //判断周几
    function judgeWeek(obj) {
        var week;
        var dateWeek = new Date().getDay();
        switch (dateWeek) {
            case 0:
                week = obj.alarmSunday;
                break;
            case 1:
                week = obj.alarmMonday;
                break;
            case 2:
                week = obj.alarmTuesday;
                break;
            case 3:
                week = obj.alarmSaturday;
                break;
            case 4:
                week = obj.alarmThursday;
                break;
            case 5:
                week = obj.alarmFriday;
                break;
            case 6:
                week = obj.alarmSaturday;
                break;
        }
        return week;
    }

    function renderToPlan(data) {
        var __item = '<li class="home-item"></li>';
        var __wrap = '<a></a>';
        var __cont = '<div style="width:' + ($.gjk.utils.getSize().w - 67) + 'px;" class="calendar-list-content pull-left"></div>';
        var __tag = '<div class="tag"></div>';
        var __time = '<div class="time-tag pull-left">' + data.reminderTime + '</div>';
        var __yao = '';
        var __c = '<div class="context"></div>';
        var __m = '<div class="calendar-list-media pull-right"></div>';
        var __ts = '<i class="time"></i>';

        switch (data.logType) {
            case "sportLog" :
                __wrap = '<a href="#"></a>'
                __time = '<div class="time-tag pull-left">'+ data.reminderTime + '</div>';
                __c = '<div class="context">本周运动记录：柑橘客伴您健康、阳光、快乐运动！</div>';
                if (getMIN() > timersda_1(dateTime)) {
                    __wrap = '<a href="http://gl.gjk.com.cn/mskl-api/weixin_gjk_new/plan/finishsport.html?id=' + data.logData.sportId + '&logType=sportPlan"></a>'
                }
                break;
            case "dietLog" :
                switch (data.logDietType) {
                    case "1":
                        __c = '<div class="context">早餐：建议早餐要有蛋、奶、碳水化合物和水果！</div>';
                        break;
                    case "2":
                        __c = '<div class="context">午餐：建议适量搭配些鱼、虾，蔬菜和瘦肉，饭前喝点汤！</div>';
                        break;
                    case "3":
                        __c = '<div class="context">晚餐：建议晚餐不宜大吃大喝，尽量清淡易消化！</div>';
                        break;
                    case "4":
                        ;
                    case "5":
                        ;
                    case "6":
                        __c = '<div class="context">加餐' + (data.logDietType - 3) + '：建议来几颗坚果，一杯酸奶或一些水果！</div>';
                        break;
                }
                break;
            case "treatLog" :
                var __done = [];
                var __undone = [];
                switch (data.logData.takenStatus) {
                    case '1':
                        __undone.push(data.logData)
                }
                if (data.logData.takenStatus == 2 || data.logData.takenStatus == 4) {    //判断状态值
                    __item = '<li class="home-item do"></li>';
                    __m = '<div class="calendar-list-media pull-right"></div>';
                    __yao = '<div style="background: rgba(255,255,255,0.5);color:#999;" class="yao-tag pull-left">' + data.logData.dose + '' + data.logData.mediniceInit + '</div>'
                } else {
                    __m = '<div class="calendar-list-media pull-right"></div>';
                    __yao = '<div style="background: rgba(245,245,245,1);color:#999;" class="yao-tag pull-left">' + data.logData.dose + '' + data.logData.mediniceInit + '</div>'
                }
                if (getMIN() > timersda(data.logData.setAlarm)) {
                    __wrap = '<a href="http://gl.gjk.com.cn/mskl-api/weixin_gjk_new/plan/finishmedicine.html?normalName=' + data.logData.normalName + '&medicalName=' + data.logData.medicalName + '&id=' + data.logData.msklTreatlogId + '&dose=' + data.logData.dose + '&mediniceInit=' + data.logData.mediniceInit + '&takenStatus=' + data.logData.takenStatus + '&logType=treatPlan" data-state="' + data.logData.takenStatus + '"></a>';
                    __m = '<div class="calendar-list-media pull-right"><img src="http://gl.gjk.com.cn/mskl-api/weixin_gjk_new/img/clock.png" style="width: 100%; height: 100%"></div>';
                    if(data.logData.takenStatus == 2 || data.logData.takenStatus == 4){
                        __m = '<div class="calendar-list-media pull-right"></div>';
                    }
                } else {
                    __wrap = '<a href="javascript:;" data-state="' + data.logData.takenStatus + '"></a>';
                }
                var norl = data.logData.normalName ? ('(' + data.logData.normalName + ')') : '';
                __c = '<div class="context">服药：' + data.logData.medicalName + norl + '</div>';
                __yao = '<div class="yao-tag pull-left">' + data.logData.dose + '' + data.logData.mediniceInit + '</div>';
                break;
        }
        var container = $(__item), wrap = $(__wrap), cont = $(__cont), medias = $(__m), tags = $(__tag);
        tags.append(__time);
        if (__yao) {
            tags.append(__yao);
        }
        cont.append(tags);
        cont.append(__c);
        var __date = getKeyByStorage('actived');
        if (!__date) {
            __date = dateToString(new Date());
        }
        var ddds = stringToDate(__date);
        ddds.setSeconds(0);
        ddds.setMilliseconds(0)
        if (data.logData.reminderTime
            && data.logData.reminderTime != undefined
            && data.logData.reminderTime != null
            && data.logData.reminderTime != "undefined"
            && data.logData.reminderTime != "null"
            && typeof data.logData.reminderTime == "string") {
            ddds.setHours(data.logData.reminderTime.split(':')[0]);
            ddds.setMinutes(data.logData.reminderTime.split(':')[1]);
        }
        var __curs = new Date();
        ddds.setMinutes(ddds.getMinutes() - 30);
        if (__curs >= ddds && data.logStatus != 1) {
            medias.append(__ts);
        }
        wrap.append(cont).append(medias);
        container.append(wrap);
        $('.calendar-list-block').append(container)
    }

    var options = {
        contentDateContainer: '.calendar-body .calendar-date',
        contentWeekContainer: '.calendar-body .calendar-week',
        renderDateContainer: '.calendar-body .calendar-date table tbody',
        renderWeekContainer: '.calendar-body .calendar-week table tbody',
        swiperLeftContainer: '.calendar-head .calendar-left',
        swiperRightContainer: '.calendar-head .calendar-right',
        sliderContainer: '.calendar-foot',
        todayBtn: '[role="navigation"] .button',
        mode: 'week',
        datePanel: function (v) {
            $('.calendar-head .calendar-picker span').text(v);
        },
        swiperContainer: '.calendar-body'
    };

    function monthChangeCheck(date, date1) {
        if (date != $.gjk.prevMonth && $.gjk.prevMonth) {
            getCalendarData(date1);
            $('#marqueeText').html("")
        }
        $.gjk.prevMonth = date;
    }

    $.extend($.fn, {
        Calendar: function (sets) {
//			console.log('load')
            Object.assign(options, sets);
            var _initDate = getKeyByStorage('actived'),
                _initData = [];
            if (_initDate) _initData = renderWeek(stringToDate(_initDate));
            else _initData = renderWeek();
            if (_initDate) storage('initd', _initDate);
            var _data = _initData,
                _left = options.swiperLeftContainer,
                _right = options.swiperRightContainer,
                _slider = options.sliderContainer,
                _mode = options.mode,
                _this = this;
            renderHTML(_data, options.renderWeekContainer, _mode);

            if (_initDate) {
                var _ds = stringToDate(_initDate);
                if (_mode == "week") {
                    _ds = superDate(_ds, 0, 0, 6 - (_ds.getDay()));
                }
                options.datePanel(localDate(_ds));
                $.gjk.prevMonth = localDate(_ds)
                getAjaxData(_initDate)
                getCalendarData(_initDate);
                $('#marqueeText').html("")
            } else {
                var _ds = createDate();
                getAjaxData(dateToString(_ds))
                getCalendarData(dateToString(_ds));
                $('#marqueeText').html("")
                if (_mode == "week") {
                    _ds = superDate(_ds, 0, 0, 6 - (_ds.getDay()));
                }
                options.datePanel(localDate(_ds));
                storage('initd', dateToString(_ds));
                $.gjk.prevMonth = localDate(_ds)

            }
            $(_left).tap(function () {
                var _container = _mode == "week" ? options.renderWeekContainer : options.renderDateContainer;
                leftEvent(_mode, _container, options.datePanel);

            });
            $(_right).tap(function () {
                var _container = _mode == "week" ? options.renderWeekContainer : options.renderDateContainer;
                rightEvent(_mode, _container, options.datePanel);

            });
            $(options.todayBtn).tap(function () {
                var c = new Date();
                if (getKeyByStorage('initd') == dateToString(c) && getKeyByStorage('actived') == dateToString(c)) {
                    return;
                }
                var _container = _mode == "week" ? options.renderWeekContainer : options.renderDateContainer;
                if (_mode == "week") {
                    _initData = renderWeek();
                    renderHTML(_initData, options.renderWeekContainer, _mode);
                } else {
                    _initData = renderDate();
                    renderHTML(_initData, options.renderDateContainer, _mode);
                }
                options.datePanel(localDate(c));
                storage('actived', dateToString(c));
                storage('initd', dateToString(c));
                getAjaxData(dateToString(c));
                monthChangeCheck(localDate(c), c);

                renderTag.find('td').each(function () {
                    $(this).removeClass('active');
                    if ($(this).hasClass('today')) {
                        $(this).addClass('active')
                    }
                });
                getCalendarData(getDate(createStartAndEndDate().startDate));
                $('#marqueeText').html("")
            })
            $(_slider).tap(function () {

                _initDate = getKeyByStorage('initd');

                var _container = _mode == "week" ? options.contentWeekContainer : options.contentDateContainer;
                $(_container).hide();

                if ($(this).hasClass('down')) {
                    $(this).removeClass('down')
                    _mode = "week";
                    if (getKeyByStorage('actived')) _initDate = getKeyByStorage('actived');
                    if (getKeyByStorage('actived')) storage('initd', _initDate);
                    if (_initDate) _initData = renderWeek(stringToDate(_initDate));
                    else _initData = renderWeek();
                    renderHTML(_initData, options.renderWeekContainer, _mode);
                    $(options.contentWeekContainer).show();
                    options.datePanel(localDate(stringToDate(_initDate)));
                } else {
                    $(this).addClass('down')
                    _mode = "date";
                    if (_initDate) _initData = renderDate(stringToDate(_initDate));
                    else _initData = renderDate();
                    renderHTML(_initData, options.renderDateContainer, _mode);
                    $(options.contentDateContainer).show();
                }
            });
            $(options.swiperContainer).swipeRight(function () {
                var _container = _mode == "week" ? options.renderWeekContainer : options.renderDateContainer;
                leftEvent(_mode, _container, options.datePanel);
            });
            $(options.swiperContainer).swipeLeft(function () {
                var _container = _mode == "week" ? options.renderWeekContainer : options.renderDateContainer;
                rightEvent(_mode, _container, options.datePanel);
            });
        }
    })
})(Zepto, window, document);