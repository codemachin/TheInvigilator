myApp.config(['$routeProvider','$httpProvider', function($routeProvider,$httpProvider,$scope){

    $httpProvider.interceptors.push('authInterceptor');
    // for pre-processing the http requests with authInterceptor

    $routeProvider
        .when('/',{
        	templateUrl		: 'views/login-view.html',
            controller 		: 'loginController',
        	controllerAs 	: 'myLogin'
        })
        .when('/signup',{
        	templateUrl		: 'views/register-view.html',
            controller 		: 'signupController',
        	controllerAs 	: 'mySignup'
        })
        .when('/dashboard',{
        	templateUrl     : 'views/dashboard-view.html',
        	controller 		: 'dashController',
        	controllerAs 	: 'myDash'
        })
        .when('/manageTest',{
            templateUrl     : 'views/manageTest-view.html',
            controller      : 'allTestController',
            controllerAs    : 'myDash'
        })
        .when('/takeatest',{
            templateUrl     : 'views/allTest-view.html',
            controller      : 'allTestController',
            controllerAs    : 'myDash'
        })

        .when('/home',{
            templateUrl     : 'views/home-view.html',
            controller      : 'homeController',
            controllerAs    : 'myDash'
        })
        .when('/user/:id',{
            templateUrl     : 'views/home-view.html',
            controller      : 'homeController',
            controllerAs    : 'myDash'
        })
        .when('/createTest',{

            templateUrl     : 'views/testCreate-view.html',
            controller      : 'testCreateController',
            controllerAs    : 'myTestCreate'
            
        })
        .when('/editTest/:id',{

            templateUrl     : 'views/testEdit-view.html',
            controller      : 'testEditController',
            controllerAs    : 'myTestEdit'
            
        })
        .when('/:id/createQuestions',{

            templateUrl     : 'views/questionCreate-view.html',
            controller      : 'questionCreateController',
            controllerAs    : 'myQuestionCreate'
            
        })
        .when('/:id/liveTest',{

            templateUrl     : 'views/testLive-view.html',
            controller      : 'testLiveController',
            controllerAs    : 'myLive'
            
        })

        .when('/:id/result',{

            templateUrl     : 'views/result-view.html',
            controller      : 'resultController',
            controllerAs    : 'myResult'
            
        })

        .when('/allResult',{

            templateUrl     : 'views/allResult-view.html',
            controller      : 'allResultController',
            controllerAs    : 'myAllResult'
            
        })
        .when('/forgotPassword',{

            templateUrl     : 'views/forgot-view.html',
            controller      : 'resetController',
            controllerAs    : 'myReset'
        })

        .when('/reset/:token',{

            templateUrl     : 'views/updatePass-view.html',
            controller      : 'resetController',
            controllerAs    : 'myReset'
        })
        

        .otherwise(
            {
                templateUrl   : 'views/404.html',
                controller    : '404'
            }
        );
}]);