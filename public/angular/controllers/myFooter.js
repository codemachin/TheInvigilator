myApp.controller('myFooter',['$window','$scope','$location','testService',function($window,$scope,$location,testService) {

	var main =this;
	this.show=false;

	// recieves broadcast even from 404 error page to hide the footer
	$scope.$on('handleBroadcast', function(event, args) {
        main.show=false;
    });

	// hide footer is corrent location is login, signup,forgotPassword or reset page
	if($scope.isError == true || window.location.href==window.location.origin+"/#/" || window.location.href==window.location.origin+"/#/signup" || window.location.href==window.location.origin+"/#/forgotPassword" || window.location.href==window.location.origin+"/#/reset/"+window.location.href.replace(window.location.origin+"/#/reset/",'')){
		this.show=false;
	}else{
		this.show=true;
		$scope.isError = false;
	}

	// hide footer is corrent location is login, signup,forgotPassword or reset page when route is changed successfully
	$scope.$on('$locationChangeSuccess', function(event) {
		
	    if($scope.isError == true || window.location.href==window.location.origin+"/#/" || window.location.href==window.location.origin+"/#/signup" || window.location.href==window.location.origin+"/#/forgotPassword" || window.location.href==window.location.origin+"/#/reset/"+window.location.href.replace(window.location.origin+"/#/reset/",'')){
			main.show=false;
		}else{
			main.show=true;
			$scope.isError = false;
		}
	             
	});

}]);