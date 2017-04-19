'use strict';
/**
 * A directive for auto focusing on the given element when the page loads.  If you use in a modal, set the
 * value to true to reinitialize the focus.
 *
 * @link https://forum.ionicframework.com/t/auto-focus-textbox-while-template-loads/6851/14
 */
var appLibraries = angular.module('app.libraries');
appLibraries.directive('inputFocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    scope: { inputFocus: '@'},
    link: function(scope, element, attrs) {
      attrs.$observe('inputFocus', function(value) {
        if (value === 'true') {
          $timeout(function() {
            element[0].focus();
          }, 150);
        }
      });
    }
  };
}]);
