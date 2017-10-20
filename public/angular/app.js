var myApp = angular.module('shopApp', ['ngRoute','datatables'])
.run(function($rootScope) {
    $rootScope.$on('error', function(event, args) {
        $rootScope.$broadcast('handleBroadcast', args);
    });
  }); 
// listening for events on rootscope and 
// broadcasting to the controller that requires it
