'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('PassageController', ['$scope', '$stateParams', 'ParseReflection', 'ParsePassage', 'BibleAccessor'
  , function($scope, $stateParams, ParseReflection, ParsePassage, BibleAccessor){

  $scope.id = $stateParams.passageId;

  ParsePassage.getFromId($scope.id, function(passage) {
    if(typeof passage === 'undefined'){ return; }
    $scope.bookName = BibleAccessor.bookNames[passage.get('book')];
    $scope.chapter  = passage.get('chapter');
    BibleAccessor.getVerses(BibleAccessor.bookDamMap[passage.get('book')], passage.get('book'), passage.get('chapter'), function(verses) {
      $scope.verses = verses.slice(passage.get('firstVerse'), passage.get('lastVerse') + 1);
    });
    $scope.$apply();
  })

}]);
