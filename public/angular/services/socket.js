myApp.factory('socket', function($rootScope) {
  var socket = io.connect('http://'+window.location.hostname+':'+window.location.port+'/');
      return {
          on: function (eventName, callback) {
              socket.on(eventName, function () {
                  var args = arguments;
                  $rootScope.$apply(function () {
                      callback.apply(socket, args);
                  });
              });
          }, // event listner for socket io
          emit: function (eventName, data, callback) {
              socket.emit(eventName, data, function () {
                  var args = arguments;
                  $rootScope.$apply(function () {
                      if (callback) {
                          callback.apply(socket, args);
                      }
                  });
              })
          }, // event emiter for socket io
        getSocket: function() {
          return socket;
        } // socket instance
      };
});