<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="renderer" content="webkit">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<title></title>

		<!--测试必须注释掉-->
		<!--<script src="js/noway.js" type="text/javascript" charset="utf-8"></script>-->
		<style type="text/css">
			@-ms-viewport {
				width: device-width;
			}
			
			@-o-viewport {
				width: device-width;
			}
			
			@viewport {
				width: device-width;
			}
		</style>

		<!-- 最新版本的 Bootstrap 核心 CSS 文件 -->
		<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<!-- 可选的 Bootstrap 主题文件（一般不用引入） -->
		<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
		<script>
			// Copyright 2014-2015 Twitter, Inc.
			// Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
			if(navigator.userAgent.match(/IEMobile\/10\.0/)) {
				var msViewportStyle = document.createElement('style')
				msViewportStyle.appendChild(
					document.createTextNode(
						'@-ms-viewport{width:auto!important}'
					)
				)
				document.querySelector('head').appendChild(msViewportStyle)
			}
		</script>
		<link rel="stylesheet" href="css/boot.css" />
		<link rel="stylesheet" href="css/theme.css" />
	</head>

	<body>

		<div role="navigation" style="z-index: 9999999;" class="navbar-fixed-top navbar-calendar">
			<div class="container-fluid">
				<div class="pull-left">
					<a role="backlink" class="glyphicon glyphicon-menu-left" href="javascript:history.go(-1);"></a>
				</div>
				<div class="pull-right">
					<a class="button circular">回今天</a>
				</div>
				<div role="navtitle">
					健康计划
				</div>
			</div>
		</div>

		<div role="calendar" class="calendar-view navbar-fixed-top">
			<div class="calendar-head">
				<div class="container-fluid">
					<div class="row">
						<div class="pull-left">
							<div class="calendar-panel yes">
								
							</div>
							<div class="calendar-status-view">
								已完成
							</div>
						</div>

						<div class="pull-right">
							<div class="calendar-panel no">
								
							</div>
							<div class="calendar-status-view">
								未完成
							</div>
						</div>

						<div class="calendar-picker clearfix">
							<i class="pull-left calendar-left"></i>
							<i class="pull-right calendar-right"></i>
							<span></span>
						</div>
					</div>
				</div>
			</div>

			<div class="calendar-body">
				<div class="calendar-week">
					<table>
						<thead>
							<tr>
								<th>日</th>
								<th>一</th>
								<th>二</th>
								<th>三</th>
								<th>四</th>
								<th>五</th>
								<th>六</th>
							</tr>
						</thead>
						<tbody>

						</tbody>
					</table>

				</div>
				<div class="calendar-date" style="display: none;">
					<table>
						<thead>
							<tr>
								<th>日</th>
								<th>一</th>
								<th>二</th>
								<th>三</th>
								<th>四</th>
								<th>五</th>
								<th>六</th>
							</tr>
						</thead>
						<tbody>

						</tbody>
					</table>
					<div class="calendar-date-foot ">
						<div class="do-tip pull-left">
							<div class="do-crl crl pull-left"></div>
							<div class="p pull-left">已完成</div>
						</div>
						<div class="none-tip">
							<div class="none-crl crl pull-left"></div>
							<div class="p pull-left">未完成</div>
						</div>
						<div class="eat-tip pull-right">
							<div class="eat-crl crl pull-left"></div>
							<div class="p pull-left">用药结束</div>
						</div>
					</div>
				</div>

			</div>
			<div class="calendar-foot"></div>

		</div>

		<div class="calendar-list">
			
			<div class="calendar-list-view hide">
				<div class="calendar-list-empty">
					<a class="circular" href="plusplans.html">添加健康计划</a>
				</div>
			</div>
			
			<ul class="calendar-list-block">
	
			</ul>
		</div>

		<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
		<!--<script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>-->

		<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
		<!--<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>-->
		<script src="js/underscore.js" type="text/javascript" charset="utf-8"></script>
		<script src="https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js"></script>
		<script src="js/cookie.js" type="text/javascript" charset="utf-8"></script>
		<script src="js/touch.js" type="text/javascript" charset="utf-8"></script>
		<script src="js/gjk.js" type="text/javascript" charset="utf-8"></script>
		<script src="js/calendar.js" type="text/javascript" charset="utf-8"></script>
		<script type="text/javascript">
			Zepto('[role="calendar"]').Calendar();
		</script>
	</body>

</html>