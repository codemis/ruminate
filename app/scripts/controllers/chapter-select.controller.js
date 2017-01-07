'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('ChapterSelectController', ['$scope', 'BibleAccessor', function($scope, BibleAccessor) {
  /**
   * The books of the Bible
   *
   * @type {Array}
   */
  $scope.books = [];
  /**
   * The current selected book.
   *
   * @type {[type]}
   */
  var current = null;
  /**
   * Setup the controller.
   *
   * @return {Void}
   */
  function setup() {
    BibleAccessor.getBooks().then(function(books) {
      $scope.books = books;
    });
  }

  /**
   * Is the book showing?
   *
   * @param  {String}  id   The book id you want to check.
   * @return {Boolean}      Is it showing?
   */
  $scope.isShown = function(id) {
    return id === current;
  };
  /**
   * Toggle the shown book.
   *
   * @param  {String} id    The id of the book to toggle
   * @return {Void}
   */
  $scope.toggleShown = function(id) {
    if($scope.isShown(id)) {
      current = null;
    } else {
      current = id;
    }
  };

  setup();
}]);
