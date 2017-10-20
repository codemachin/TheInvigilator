myApp.controller('404',['$scope',function($scope) {

	$scope.$emit('error');
	/////emits error event to rootscope so that footer is hidden on 404 page./////

}]);