//{{controllerName}}
app.controller('ExampleController', ['$scope', '$http', 'hints', '$timeout', '$uibModal', '$cookies', '$location','$rootScope','queryCriteria','pagination',function($scope, $http, hints, $timeout, $uibModal,  $cookies ,$location,$rootScope,queryCriteria,pagination) {
	
	var params = {
		merchantNo: '',
		bizType: '',
        page: 1,
        rows: 10
	};
	
	queryCriteria.run($scope, params, sessionStorage.ExampleControllerParams,'startTime','endTime');
    $scope.myData = [];
    $scope.pagingOptions = {
        pageSizes: [10, 20, 50],
        pageSize: 10,
        totalServerItems: 0,
        currentPage: 1
	};
    //获取商户信息
    $http.get('/dep-manage/merchant/merchantInfo', {
    	headers: {
    		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    	}
    }).success(function(data) {
    	if(data.code == '000000') {
    		$scope.openingDate = data.data;
    		for(var i=0;i<$scope.openingDate.length;i++){
    			$scope.openingDate[i].onName=$scope.openingDate[i].merchantName+'|'+$scope.openingDate[i].merchantNo;
    			if($scope.params.merchantNo == $scope.openingDate[i].merchantNo){
    				$scope.merchantName = $scope.openingDate[i].merchantName;
    			}
    		}
    	} else {
    		hints.show('warning', '商户列表获取失败', 2000);
    	}
    }).error(function(data, status) {
    	if (status == 401) {
    		tokenFailure($cookies, $location, $timeout, hints);
    		return;
    	}
    	hints.show('warning', '网络出错', 2000);
    });
    //获取选中的值
	$scope.$watch('merchantName',function(newValue) {
		if (typeof(newValue) != undefined && typeof(newValue) != 'undefined') {
			var newMerNo = newValue["merchantNo"];
			for (var i = 0, length = $scope.openingDate.length; i < length; i ++) {
				if (newMerNo == $scope.openingDate[i].merchantNo) {
					$scope.params.merchantNo = $scope.openingDate[i].merchantNo;
					return;
				} else {
					continue;
				}
			}
		}
	});
	$scope.changeMchnt = function() {
    	if($scope.merchantName == ''){
    		$scope.params.merchantNo='';
    	}
    }
	//若不是要选定的商户，就置为空
	$scope.selectMerchantNo = function() {
		if (!$scope.openingDate) {
			hints.show('warning', '商户列表未加载成功', 2000);
			return;
		}
		if (typeof($scope.merchantName) && typeof($scope.merchantName) === 'string') {
			for (var i = 0, length = $scope.openingDate.length; i < length; i ++) {
				if ($scope.merchantName == $scope.openingDate[i].merchantName) {
					$scope.params.merchantNo = $scope.openingDate[i].merchantNo;
					return;
				} else continue;
			}
			$scope.merchantName = '';
		}
	}
	
	$scope.bizTypeEnum = feeBizTypeEnum;
    
    $scope.gridOptions = {
		data: 'myData',
        enableColumnResizing: true,
        showGridFooter: true,
        enableRowHashing:false,
        gridFooterTemplate: gridFooterTemplate,
        pagingOptions: $scope.pagingOptions,
        multiSelect: false,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        columnDefs: [
        {cellTemplate: '<div class="grid-operation row""><button class="btn btn-success btn-xs" ng-click="grid.appScope.detail(row.entity, $event)">详情</button></div>', name: '操作', width: 66},
        // {field: 'xxxxx', name: 'xxxxx', width:200},
        // {field: 'xxxxx',cellFilter:'KeyValueFilter : grid.appScope.xxxxx', name: 'xxxxx', width: 100},
        // {field: 'bankCardType',cellFilter:'KeyValueFilter : grid.appScope.bankCardTypeEnum', name: '卡类型', width:100},
        // {field: 'settleMode',cellFilter:'KeyValueFilter : grid.appScope.settleModeCodeEnum', name: '结算模式', width: 150},
        // {field: 'bizFlow', name: '业务流水号', width: 200},
        // {field: 'merOrderNo', name: '商户订单号', width: 200},
        // {field: 'status',cellFilter:'KeyValueFilter : grid.appScope.feeFlowStatusEnum', name: '收取状态', width: 150},
        // {field: 'feeAmt', name: '手续费（元）', cellFilter:'number : 2', width: 150, cellClass: 'text-right'},
        // {field: 'tranAmt', name: '交易金额（元）', cellFilter:'number : 2', width: 150, cellClass: 'text-right'},
        // {field: 'createTime', name: '创建日期', width: 180},
        ]
    }
    // $scope.detail = function(item, event) {  //TODO 详情
    // 	modalInstance = $uibModal.open({
    // 		animation: true,
    // 		size:'lg',
    // 		templateUrl: 'pages/fee/feeflow-detail-modal.html',
    // 		controller: 'FeeFlowDetailModalController',
    // 		resolve: {
    // 			item: function() {
    // 				return item;
    // 			}
    // 		}
    // 	})
    // }
    $scope.queryAll = function(){
        $scope.params = {
			merchantNo: '',
			bizType: '',
			page: 1,
			rows: 10
		};
		$scope.merchantName = '';
		$scope.pagingOptions.currentPage = 1;
    	query();
    }
    $scope.query = function() {
        if ($scope.queryButtonStatus) {
            return;
        }
        $scope.queryButtonStatus = true;
        $scope.pagingOptions.currentPage = 1;
        query();
    }
    pagination.pageChange($scope,query);
	function query() { //TODO 查询
        $scope.myData=[];
        $scope.params.page = $scope.pagingOptions.currentPage;
        $scope.params.rows = $scope.pagingOptions.pageSize;
        $scope.noRecord = false;
        $http.post('/dep-manage/xxxxx', $.param($scope.params), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).success(function(data) {
            $scope.queryButtonStatus = false;
            $scope.items = data.totalRecord;
            $scope.myData = data.results;
            $scope.pagingOptions.totalServerItems = data.totalRecord;
            if (data.results.length === 0) {
                $scope.noRecord = true;
                return;
            }
            sessionStorage.ExampleControllerParams = JSON.stringify($scope.params)
        }).error(function(data, status) {
        	$scope.queryButtonStatus = false;
            if (status == 401) {
                tokenFailure($cookies, $location, $timeout, hints);
                return;
            }
            hints.show('warning', '网络出错', 2000);
        });
    }
    query();
	
}]);

// //TODO 详情
// app.controller('FeeFlowDetailModalController', ['$scope', '$uibModalInstance', 'item', function($scope, $uibModalInstance, item) {
// 	$scope.bizTypeEnum = feeBizTypeEnum;
// 	$scope.bankCardTypeEnum = bankCardTypeEnum;
// 	$scope.rateModeEnum = rateModeEnum;
// 	$scope.settleModeCodeEnum = settleModeEnum;
// 	$scope.acctTypeMerEnum = acctTypeMerEnum;
// 	$scope.feeFlowStatusEnum = feeFlowStatusEnum;
// 	$scope.tradeCodeEnum = tradeCodeEnum;
	
// 	$scope.item = item;
//     $scope.cancel = function () {
//         $uibModalInstance.close();
//     }
// }]);