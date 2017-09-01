angular.module("idiomControllers.startup", [])

// startup
.controller("startupCtrl", ["$scope", "$state", function($scope, $state) {

    // startup页面初始化游戏数据
    $scope.$watch("viewContentLoaded", function() {

        $scope.initRuntime();

    });

    /* 开始游戏按钮，三种模式 开始 */

    // 正确率模式
    $scope.playProp = function() {
        $scope.runtime.status = $scope.constants.STATUS_DOING;
        $scope.runtime.mode = $scope.constants.MODE_PROP;

        if($scope.debug) {
            console.log("doing params", $scope.runtime);
        }

        $state.go("doing");
    };

    // 错误次数模式
    $scope.playError = function() {
        $scope.runtime.status = $scope.constants.STATUS_DOING;
        $scope.runtime.mode = $scope.constants.MODE_ERROR;
        $scope.runtime.error = $scope.config.ERROR;

        if($scope.debug) {
            console.log("doing params", $scope.runtime);
        }

        $state.go("doing");
    };

    // 倒计时模式
    $scope.playTimeout = function() {
        $scope.runtime.status = $scope.constants.STATUS_DOING;
        $scope.runtime.mode = $scope.constants.MODE_TIMEOUT;
        $scope.runtime.timeout = $scope.config.TIMEOUT;

        if($scope.debug) {
            console.log("doing params", $scope.runtime);
        }

        $state.go("doing");
    };

    /* 开始游戏按钮，三种模式 结束 */

}]);