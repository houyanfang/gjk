<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
	<title></title>
	<link href="./css/mui.min.css" rel="stylesheet" />
	<link href="./css/mui.indexedlist.css" rel="stylesheet" />
	<link href="css/medicine.css" />
	<style>
		html,
		body {
			height: 100%;
			overflow: hidden;
		}
		.mui-bar {
			-webkit-box-shadow: none;
			box-shadow: none;
		}
	</style>
</head>

<body>
	<header class="mui-bar mui-bar-nav" style="background: #fea70f;">
		<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" style="color: #fff;"></a>
		<h1 class="mui-title" style="color: #fff;">选择药品名</h1>
	</header>
	<div class="mui-content">
		<div id='list' class="mui-indexed-list">
			<div class="mui-indexed-list-search mui-input-row mui-search">
				<input type="search" id="medicine_name" class="mui-input-clear mui-indexed-list-search-input" placeholder="请输入药品名、通用名、生产厂商">
			</div>
			<div class="chang_main">
				<div class="mui-indexed-list-bar">
					<span>A</span>
					<span>B</span>
					<span>C</span>
					<span>D</span>
					<span>E</span>
					<span>F</span>
					<span>G</span>
					<span>H</span>
					<span>I</span>
					<span>J</span>
					<span>K</span>
					<span>L</span>
					<span>M</span>
					<span>N</span>
					<span>O</span>
					<span>P</span>
					<span>Q</span>
					<span>R</span>
					<span>S</span>
					<span>T</span>
					<span>U</span>
					<span>V</span>
					<span>W</span>
					<span>X</span>
					<span>Y</span>
					<span>Z</span>
				</div>
				<div class="mui-indexed-list-alert"></div>
				<div class="mui-indexed-list-inner">
					<div class="mui-indexed-list-empty-alert">没有数据</div>
					<ul class="mui-table-view">
						<li class="mui-table-view-divider mui-indexed-list-group">A</li>
						<li class="mui-table-view-cell mui-indexed-list-item">
							阿克苏机场
							<p class="company-name">珠海联邦制药股份有限公司中山分公司</p>
						</li>
						<li class="mui-table-view-cell mui-indexed-list-item">阿拉山口机场</li>
						<li class="mui-table-view-cell mui-indexed-list-item">阿勒泰机场</li>
						<li class="mui-table-view-cell mui-indexed-list-item">阿里昆莎机场</li>
						<li class="mui-table-view-cell mui-indexed-list-item">安庆天柱山机场</li>
						<li class="mui-table-view-cell mui-indexed-list-item">澳门国际机场</li>
						<li data-group="B" class="mui-table-view-divider mui-indexed-list-group">B</li>
						<li class="mui-table-view-cell mui-indexed-list-item">保山机场</li>
						<li data-value="BAV" data-tags="BaoTou" class="mui-table-view-cell mui-indexed-list-item">包头机场</li>
						<li class="mui-table-view-cell mui-indexed-list-item">北海福成机场</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	
	<div class="btn-group" style="padding: 20px 10px 20px;">
		<p style="font-size: 14px;color: #999; text-align: center;">找不到您的药品名称？没关系</p>
		<a style="display: block;height: 45px; line-height: 45px;background: #fea70f;text-align: center;font-size: 18px;color: #FFF;border-radius: 5px;">继续添加计划</a>
	</div>
	<script src="./js/mui.min.js"></script>
	<script src="./js/mui.indexedlist.js"></script>
	<script src="js/underscore.js" type="text/javascript" charset="utf-8"></script>
	<script src="https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js"></script>
	<script src="js/touch.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/gjk.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript" charset="utf-8">
		mui.init();
		mui.ready(function() {
			var header = document.querySelector('header.mui-bar');
			var list = document.getElementById('list');
			//calc hieght
			list.style.height = (document.body.offsetHeight - header.offsetHeight-95) + 'px';
			//create
			window.indexedList = new mui.IndexedList(list);
		});
	</script>
</body>

</html>