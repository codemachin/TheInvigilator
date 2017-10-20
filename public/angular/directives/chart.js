myApp.directive('startChart', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      scope.$parent.ctx = element
    }
  }
});// directive for binding the area chart canvas

myApp.directive('startBar', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      scope.$parent.ctxb = element
    }
  }
});// directive for binding the bar graph canvas

myApp.directive('startPie', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      scope.$parent.ctxp = element
    }
  }
});// directive for binding the pie chart canvas