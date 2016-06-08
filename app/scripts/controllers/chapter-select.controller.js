'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('ChapterSelectController', ['$scope', 'BibleAccessor', function($scope, BibleAccessor) {
  $scope.books = [];
  BibleAccessor.getBookList(function(list) { $scope.books = list; });
  var cur = null;
  $scope.isShown = function(book) {
    return book === cur;
  };
  $scope.toggleShown = function(book) {
    if($scope.isShown(book)) {
      cur = null;
    } else {
      cur = book;
    }
  };
}]);
