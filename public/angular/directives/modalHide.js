myApp.directive('modalHide', function() {
  var clicked = false;;
  return {
    restrict: 'A',
    link: function(scope, element,attr) {
      var currentId;
      $(element).click(function(){
        $('.modal').modal('hide');
        clicked = true;
      })
      
      $('.modal').on('hidden.bs.modal', function (e) {
        if(clicked  && $(this).attr('id')==attr.id){
          if(attr.len>0){
            clicked = false;
            window.location = "/#/"+attr.modalHide+"/liveTest";
          }else{
            alert("This test has 0 questions set. Sorry, you cannot start this test right now.")
            clicked = false;
          }
        }
      })
    }
  }
});
// hides the modal on click and when the modal is hidden 
// go to the live test location