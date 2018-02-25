'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .value('FIREBASE_URL', 'https://waitandeat-keza.firebaseio.com/')

  .factory('dataService', function dataService(FIREBASE_URL) {
    var dataRef = new Firebase(FIREBASE_URL);
    return dataRef;
  })

  .factory('partyService', function partyService(dataService, $firebaseArray) {
    var partyServiceObject = {
      saveParty: function saveParty(party, userId) {
        party.timestamp = Firebase.ServerValue.TIMESTAMP;
        $firebaseArray(dataService.child('users/'+userId+'/parties')).$add(party);
      },
      getPartiesByUserId: function getPartiesByUserId(userId) {
        var query = dataService.child('users/'+userId+'/parties').orderByChild("timestamp");
        //var query = dataService.child('users/'+userId+'/parties').orderByChild("timestamp").limitToLast(5);
        return $firebaseArray(query);
      }
    };
    return partyServiceObject;
  })

  .factory('textMessageService', function (dataService, partyService, $firebaseArray,$firebaseObject) {
    var textMessageServiceObject = {
      sendTextMessage: function sendTextMessage(party, userId) {
        var newTextMessage = {
          phoneNumber:party.phone,
          size: party.size,
          name: party.name
        };
        dataService.child("textMessages").push(newTextMessage);
        
        var obj = $firebaseObject(dataService.child('users/'+userId+'/parties/'+party.$id))
        obj.$loaded().then(function() {
          obj.notified = true;
          obj.$save();
        });
      }
    };
    return textMessageServiceObject;
  })

  .factory('authService', function authService($firebaseAuth, $location, $rootScope, FIREBASE_URL, dataService) {
    var authRef = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(authRef);
    $rootScope.authObj = auth;

    var authServiceObject = {
      register: function register(user) {
        auth.$createUser({ email: user.email, password: user.password } )
          .then(function(userData) {
            console.log("User " + userData.uid + " created successfully!");
            authServiceObject.login(user, function() {
              dataService.child("emails").push({email: user.email });
            });
          });
      },
      login: function login(user, optionalCallback) {
        auth.$authWithPassword({ email: user.email, password: user.password })
          .then(function(authData) {
            $rootScope.currentUser = authData;
            console.log("Logged in as:", authData.uid);
            if (optionalCallback) {
              optionalCallback();
            };
            $location.path('/waitlist');
          })
          .catch(function(error) {
            console.error("Authentication failed:", error);
          }); 
      },
      logout: function logout() {
        auth.$unauth();
        $rootScope.currentUser = null;
        $location.path('/');
      },
      getCurrentUser: function() {
        var obj = auth.$getAuth();
        console.log(obj);
        return obj; 
      }
    };
    $rootScope.authObj.$onAuth(function(authData) {
      if (authData) {
        console.log("Logged in as:", authData.uid);
        $rootScope.currentUser = authData;
      } else {
        console.log("Logged out");
        $rootScope.currentUser = null;
      }
    });
  
    return authServiceObject;
  });
