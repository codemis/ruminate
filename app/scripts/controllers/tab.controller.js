'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('tabController', ['$scope', '$state', function($scope, $state) {
  /**
   * Switch the tab.
   *
   * @param  {String} page The dot notation of the page
   * @return {Void}
   */
  $scope.changeTab = function(page) {
    if (page === 'app.home') {
      /**
       * If we are going home, we should clear the receivedNotification.
       *
       */
      $state.go(page, { receivedNotification: false });
    } else {
      $state.go(page);
    }
    console.log('Change Tab');
  };
}]);
