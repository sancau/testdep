'use strict';

var appCtrl = function($scope, $http) {
  // $scope.messages = [
  //   {
  //     author: 'Sancau',
  //     time: 'Just now',
  //     content: 'Test message'
  //   },
  //   {
  //     author: 'Sancau',
  //     time: 'Just now',
  //     content: 'Test message'
  //   }
  // ]

  var currentTag = 0;

  var chatURL = 'http://localhost:2500/api/chat/messages';

  var getMessages = function() {
    $http.get(chatURL)
    .then(
      function(res) {
        if (currentTag !== res.data.tag) {
          $scope.messages = res.data.messages;
          currentTag = res.data.tag;
          console.log('Getting new data..');
        }
        else {
          console.log('No changes..');
        }
      },

      function(e) {
        console.error(e); 
      }
    );
  };

  $scope.sendMessage = function() {   
    $http.post(chatURL, {username: $scope.username, content: $scope.newMessage})
    .then(
      function(res) {
        console.log("Message sended");
      },
      function(e) {
        console.error(e);
      }
    );
  };

  setInterval(getMessages, 1000);
};

angular.module('app', []).controller('appCtrl', appCtrl);