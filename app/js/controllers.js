angular.module("idiomControllers", ["idiomControllers.loading", "idiomControllers.startup", "idiomControllers.doing", "idiomControllers.completed", "idiomControllers.timeout", "idiomControllers.error"])

// 公共控制器
.controller("wrapperController", ["$rootScope", "$scope", "$http", "$state", "apiAddress", "apis", "$translate", "$interval", function($rootScope, $scope, $http, $state, apiAddress, apis, $translate, $interval) {

	/* 拦截器 开始 */

	// 正常拦截
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

		// 路由切换之前，拦截，下边是具体处理
		event.preventDefault();

		switch (toState.name) {
			case "loading":
				if($scope.debug) {
					console.log("$stateChangeStart", "loading");
				}

				release();
				break;
			case "startup":
				if($scope.debug) {
					console.log("$stateChangeStart", "startup");
				}

				release();
				break;
			case "doing":
				if (fromState.name != "startup" || !$scope.runtime.status || !$scope.runtime.mode) {
					if($scope.debug) {
						console.log("$stateChangeStart", "doing");
					}

					$scope.runtime.status = $scope.constants.STATUS_LOADING;
					return;
				} else {
					release();
				}
				break;
			case "completed":
				if(fromState.name != "doing") {
					if($scope.debug) {
						console.log("$stateChangeStart", "completed");
					}

					$scope.runtime.status = $scope.constants.STATUS_LOADING;
					return;
				} else {
					release();
				}
				break;
			case "timeout":
				if(fromState.name != "doing") {
					if($scope.debug) {
						console.log("$stateChangeStart", "timeout");
					}

					$scope.runtime.status = $scope.constants.STATUS_LOADING;
					return;
				} else {
					release();
				}
				break;
			case "error":
				if(fromState.name != "doing") {
					if($scope.debug) {
						console.log("$stateChangeStart", "error");
					}

					$scope.runtime.status = $scope.constants.STATUS_LOADING;
					return;
				} else {
					release();
				}
				break;
			default:
				release();
		}

		// 放行不需要拦截或符合条件的路由
		function release() {
			event.defaultPrevented = false;
		}
	});

	// state未定义
	$rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {

		// state未定义处理

		// 路由切换之前，拦截，下边是具体处理
		event.preventDefault();

		// 跳转到loading页
		$scope.runtime.status = $scope.constants.STATUS_LOADING;
	});
	/* 拦截器 结束 */

	/* 公共变量 开始 */
	$scope.debug = true;		// 调试模式开关

	$scope.constants = {
		MODE_PROP: 1,			// 正确率模式
		MODE_ERROR: 2,			// 错误次数模式
		MODE_TIMEOUT: 3,		// 倒计时模式
		STATUS_LOADING: 100,	// 加载中
		STATUS_STARTUP:	200,	// 开始
		STATUS_DOING: 300,		// 进行中
		STATUS_COMPLETED: 400,	// 正常完成结束
		STATUS_TIMEOUT: 500,	// 时间到了结束
		STATUS_ERROR: 600		// 错误次数到了结束
	};

	// 初始化配置
	$scope.config = {
		COUNT: 10,			// 题目总数
		ERROR: 3,			// 错误模式最多错误次数
		TIMEOUT: 3,		// 倒计时模式时间长度，单位秒
		TOTAL_TIMES: 3,	// 最长总用时，超过就timeout
		LOADING_TIME: 1000	// loading页面显示时间，单位毫秒
	};

	// 初始化游戏数据
	$scope.runtime = {};

	/* 公共变量 结束 */

	// 初始化游戏数据（重置）
	$scope.initRuntime = function() {

		// 强制结束顺时计时器
		if($scope.runtime.timerInterval && typeof $scope.runtime.timerInterval === "object" && $scope.runtime.timerInterval.$$state.status != 2) {
			$interval.cancel($scope.runtime.timerInterval);
		}

		// 强制结束倒计时器
		if($scope.runtime.countdownInterval && typeof $scope.runtime.countdownInterval === "object" && $scope.runtime.countdownInterval.$$state.status != 2) {
			$interval.cancel($scope.runtime.countdownInterval);
		}

		// 初始化游戏数据
		$scope.runtime = {
			status: null,			                		// 状态标志
			mode: null,				                		// 游戏模式
			times: 0,				                		// 总用时
			timeout: $scope.config.TIMEOUT * 1000,			// 超时控制
			totalTimes: $scope.config.TOTAL_TIMES * 1000,	// 最长总用时，超过就timeout
			count: $scope.config.COUNT,						// 题目总数
			correct: 0,				                		// 正确题目数
			incorrect: 0,			                		// 错误题目数
			error: $scope.config.ERROR,						// 错误模式次数限制
			timerInterval: undefined,						// 顺时监听对象
			countdownInterval: undefined					// 倒计时监听对象
		};

		if($scope.debug) {
			console.log("initRuntime", $scope.runtime);
		}
	}

	// 重新开始，跳转到loading页面重新加载
	$scope.reset = function() {

		if($scope.debug) {
			console.log("reset");
		}

		// 初始化游戏数据（重置）
		$scope.initRuntime();

		// 跳转到startup页
		$scope.runtime.status = $scope.constants.STATUS_STARTUP;
	}

	/* 添加监听 开始 */

	// 监听状态变化
	$scope.$watch("runtime.status", function(newValue, oldValue) {
		switch(newValue) {
			case $scope.constants.STATUS_LOADING:

				// 调试模式日志
				if($scope.debug) {
					console.log("STATUS_LOADING");
				}

				$state.go("loading");
				break;
			case $scope.constants.STATUS_STARTUP:

				// 调试模式日志
				if($scope.debug) {
					console.log("STATUS_STARTUP");
				}

				$state.go("startup");
				break;
			case $scope.constants.STATUS_DOING:

				// 调试模式日志
				if($scope.debug) {
					console.log("STATUS_DOING");
				}

				$state.go("doing");
				break;
			case $scope.constants.STATUS_COMPLETED:

				// 调试模式日志
				if($scope.debug) {
					console.log("STATUS_COMPLETED");
				}

				$state.go("completed");
				break;
			case $scope.constants.STATUS_TIMEOUT:

				// 调试模式日志
				if($scope.debug) {
					console.log("STATUS_TIMEOUT");
				}

				$state.go("timeout");
				break;
			case $scope.constants.STATUS_ERROR:

				// 调试模式日志
				if($scope.debug) {
					console.log("STATUS_ERROR");
				}

				$state.go("error");
				break;
		}
	});

	/* 添加监听 结束 */

	/* 请求接口封装 开始 */

	$scope.request = {
		http: function(path, method, data, callback) {
			if(method.toLowerCase() == 'get') {
				$http({
					url: apiAddress.get() + path,
					method: 'get',
					params: data
				}).success(function(data) {
					if(typeof(callback) === "function") {
						callback(data);
					}
				}).error(function(err) {

					// 调试模式日志
					if($scope.debug) {
						console.error("error", err);
					}
				})
			} else if(method.toLowerCase() == 'post') {
				$http({
					url: apiAddress.get() + path,
					method: 'post',
					data: data
				}).success(function(data) {
					if(typeof(callback) === "function") {
						callback(data);
					}
				}).error(function(err) {

					// 调试模式日志
					if($scope.debug) {
						console.error("error", err);
					}
				})
			} else if(method.toLowerCase() == 'jsonp') {

				// 设置JSONP回调函数为success
				data.callback = "JSON_CALLBACK";

				$http({
					url: apiAddress.get() + path,
					method: 'jsonp',
					params: data
				}).success(function(data) {
					if(typeof(callback) === "function") {
						callback(data);
					}
				}).error(function(err) {

					// 调试模式日志
					if($scope.debug) {
						console.error("error", err);
					}
				})
			}
		}
	}

	/* 请求接口封装 结束 */

	// 多语言配置，临时代码，需要调整
	$scope.active = 2;
	$scope.changeLanguage = function(langKey, num) {
		$translate.use(langKey);
		if(num == 1) {
			$scope.active = 1;
		} else if(num == 2) {
			$scope.active = 2;
		}
	};

}]);