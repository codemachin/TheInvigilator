myApp.controller('questionCreateController',['$window','$http','$routeParams','testService',function($window,$http,$routeParams,testService) {

  //create a context
  var main = this;

  // checks if token is in sessionStorage and parses it
  if($window.sessionStorage.token){
    var encodedProfile = $window.sessionStorage.token.split('.')[1];
    this.profile = JSON.parse(testService.url_base64_decode(encodedProfile));
    // url_base64_decode function decodes the token stored in base 64 format

    // donot allow any one other than admin to access this page
    if(main.profile.user.email!="admin@admin.com"){
      alert("You are not authorised to view this page");
      $window.history.back();
    }
    
  }else{
    alert("no token found. please login")
    window.location='#/'
  }// gets details from the jwt token an decodes it to get profile information

  this.question="";
  this.optionA="";
  this.optionB="";
  this.optionC="";
  this.optionD="";
  this.answer="";
  this.edif=false;

  // function to set the question option and answer to be edited
  var editset = function(index){
    main.question=main.items.data.questions[index].question;
    main.optionA=main.items.data.questions[index].optionA;
    main.optionB=main.items.data.questions[index].optionB;
    main.optionC=main.items.data.questions[index].optionC;
    main.optionD=main.items.data.questions[index].optionD;
    main.answer=main.items.data.questions[index].answer;
  }

  // function to set the edit question flag and calling function
  this.editFlag = function(index){
    
      main.edif = true;
      editset(index);
      main.indexhel = main.items.data.questions.length-index-1;

  }

  // function to unload the models when question editing is closed
  this.editEnd = function(){
      main.edif = false;
      main.question="";
      main.optionA="";
      main.optionB="";
      main.optionC="";
      main.optionD="";
      main.answer="";
  }

  this.id = $routeParams.id;
  
  // function for creating questions
  this.create = function(){

    // checking if no fields are empty
    if(!main.question || !main.optionA || !main.optionB || !main.optionC || !main.optionD || !main.answer){
      return alert("Make sure that all the fields are filled.")
    }

    // preventing no of created questions from exceeding no of specified questions
    if(main.items.data.questions.length>=main.items.data.totalQuestions){
      return alert("End of limit reached. "+main.items.data.totalQuestions+" questions already inserted.");
    }
       

  	var myData = {

            question: main.question,
            optionA: main.optionA,
            optionB: main.optionB,
            optionC: main.optionC,
            optionD: main.optionD,
            answer : main.answer

        }
    
      testService.questionCreate(myData,main.id)
      .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
          	
            alert(response.data.message);
            // get all the questions after its created
            main.allQuestions();

            // unloading the models after question is created
            main.question="";
            main.optionA="";
            main.optionB="";
            main.optionC="";
            main.optionD="";
            main.answer="";

          	
          } else {
          	alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
    


  }


  // function for saving edited questions
  this.editQ = function(){ 

    // checking if no fields are empty
    if(!main.question || !main.optionA || !main.optionB || !main.optionC || !main.optionD || !main.answer){
      return alert("Make sure that all the fields are filled.")
    }

    var myData = {

            question: main.question,
            optionA: main.optionA,
            optionB: main.optionB,
            optionC: main.optionC,
            optionD: main.optionD,
            answer : main.answer

        }
    
      testService.questionEdit(myData,main.id,main.indexhel)
      .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
            
            alert(response.data.message);
            //gets the edited question
            main.allQuestions();

            // unloading the models after its edited
            main.question="";
            main.optionA="";
            main.optionB="";
            main.optionC="";
            main.optionD="";
            main.answer="";

            // calling function to change the edit flag  to false
            main.editEnd();
            

          } else {
            alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert("some error occurred. Check the console.");
          console.log(response);
        });
    


  }

  // function for fetching all the created questions
  this.allQuestions = function(){

  	
    testService.getAllQuestions(main.id)
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
          	main.items= response.data;

            //setting the questions in reverse order
          	main.items.data.questions.reverse();

          } else {
          	alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
  }

  // loading all question at start
  if($window.sessionStorage.token){
    this.allQuestions();
  }

  // deletes any question the user wants
  this.delete = function(id,index){

    var data = {
      testId : main.items.data._id
    }

  	testService.deleteQuestion(id,data)
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
          	alert(response.data.message);
          	main.items.data.questions.splice(index,1)
            editset(index);
            main.indexhel = main.items.data.questions.length-index-1;
          	

          } else {
          	alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
  }
  
  this.logout = function () {
    
    delete $window.sessionStorage.token;
    window.location="#/"
    
  };// deletes the token on user logout



}]); // end controller