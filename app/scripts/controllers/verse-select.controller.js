'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('VerseSelectController', ['$scope', '$stateParams', '$location', '$ionicHistory', 'BibleAccessor', 'ParseUser', 'ParseReflection', 'ParsePassage',
  function($scope, $stateParams, $location, $ionicHistory, BibleAccessor, ParseUser, ParseReflection, ParsePassage) {

  // These contain the information that will be added to the database
  $scope.chapter = $stateParams.chapter;
  $scope.book = $stateParams.bookId;
  $scope.bookName = BibleAccessor.bookNames[$scope.book];
  $scope.dam_id = $stateParams.damId;
  $scope.firstVerse=-1;
  $scope.lastVerse=-1

  BibleAccessor.getVerses($scope.dam_id, $scope.book, $scope.chapter, function(verses) {
    $scope.verses = verses;
  });


  $scope.isSelected = function(id) {
    id = parseInt(id);
    if($scope.firstVerse === -1 || $scope.lastVerse === -1) {
      return id === $scope.firstVerse || id === $scope.lastVerse;
    } else {
      return id >= $scope.firstVerse && id <= $scope.lastVerse;
    }
  }

  $scope.handleClick = function(id) {
    id = parseInt(id);
    if(id === $scope.lastVerse) {
      $scope.lastVerse = -1;
    } else
    if(id === $scope.firstVerse) {
      $scope.firstVerse = -1;
    } else

    if($scope.lastVerse === -1 && $scope.firstVerse === -1) {
      $scope.lastVerse = id;
    } else

    if( $scope.lastVerse === -1 && $scope.firstVerse != -1) {
      if($scope.firstVerse > id) {
        $scope.lastVerse = $scope.firstVerse;
        $scope.firstVerse = id;
      } else {
        $scope.lastVerse = id;
      }
    } else
    if( $scope.firstVerse === -1 && $scope.lastVerse != -1) {
      if($scope.lastVerse < id) {
        $scope.firstVerse = $scope.lastVerse;
        $scope.lastVerse = id;
      } else {
        $scope.firstVerse = id;
      }
    } else

    if(id > $scope.lastVerse && $scope.lastVerse != -1) {
      $scope.lastVerse = id;
    } else
    if(id < $scope.firstVerse && $scope.firstVerse != -1) {
      $scope.firstVerse = id;
    } else

    {
      if( Math.abs(id-$scope.firstVerse) < Math.abs(id-$scope.lastVerse) ) {
        $scope.firstVerse = id;
      } else {
        $scope.lastVerse = id;
      }
    }
  };

  $scope.updateOrCreateReflection = function() {
    var reflection = null;
    /**
     * An empty function for going home when complete
     *
     * @return {void}
     * @access private
     *
     * @author Johnathan Pulos <johnathan@missionaldigerati.org>
     */
    var callback = function() {
      $ionicHistory.clearCache();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $location.path('/tab/home');
    };

    ParseReflection.create(function(reflection) {
      ParsePassage.create($scope.book, parseInt($scope.chapter), $scope.firstVerse, $scope.lastVerse, $scope.verses[$scope.firstVerse].content, reflection, callback);
    });

  };
}]);
