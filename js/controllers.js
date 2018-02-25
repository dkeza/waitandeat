'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

  .controller('LandingPageController', [function() {
  }])

  .controller('WaitListController', ['$scope', '$firebaseArray', 'partyService', 'textMessageService', 'authService','$rootScope','$firebaseAuth', function($scope, $firebaseArray, partyService, textMessageService, authService,$rootScope,$firebaseAuth) {
    var userid = authService.getCurrentUser().uid;
    userid = userid.replace('simplelogin:','');
    if (userid) {
      $scope.parties = partyService.getPartiesByUserId(userid);
    };
    
    $scope.newParty = { name: '', phone: '', size: '', done: false, notified: false };
    
    $scope.saveParty = function saveParty() {
      partyService.saveParty($scope.newParty, $scope.currentUser.uid.replace('simplelogin:',''));
      $scope.newParty = { name: '', phone: '', size: '', done: false, notified: false };
    };
    
    $scope.sendTextMessage = function sendTextMessage(party) {
      textMessageService.sendTextMessage(party, $scope.currentUser.uid.replace('simplelogin:',''));
    };
  }])

  .controller('AuthController', ['$scope', 'authService', function($scope, authService) {

    $scope.user = { email: '', password: ''};
    
    $scope.register = function register() {
      authService.register($scope.user);
    };
    
    $scope.login = function login() {
      authService.login($scope.user);
    };
    
    $scope.logout = function logout() {
      authService.logout();
    };
    
  }])

;