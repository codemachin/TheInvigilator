myApp.directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.on('click', function() {
        $("html,body").animate({scrollTop: $('.card-login').offset().top}, "fast");
      });
    }
  }
});// this directive is for simple scroll animation in the login view