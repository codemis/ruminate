'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('HistoryController', ['$scope', 'ParseReflection', 'ParsePassage', 'BibleAccessor'
  , function($scope, ParseReflection, ParsePassage, BibleAccessor) {

  //Use parse to fetch the history

  //After that is done....place it in the $scope variable....

  $scope.historyView = [];

  //var date = new Date();

  //dateString = (date.getMonth() + 1).toString() + "-" + (date.getDate()).toString() + "-" + (date.getYear()).toString();

  var dateString = '10-03-2015';

  var numberOfQueriesWithReflection = 0;

  var parseResult = [];

  var dateOfToday = new Date(new Date().toDateString());
  var dateOfTomorrow = new Date(new Date().toDateString());
  dateOfTomorrow.setDate(dateOfTomorrow.getDate() + 1);

  ParseReflection.query(dateOfToday, dateOfTomorrow, function(results) {
    if(typeof results === 'undefined' || results.length === 0) { return; }
    for (var i = 0; i < results.length; i++) {
      var reflection = results[i];
      ParsePassage.queryWithReflection(reflection, function(passages) {
        if(typeof passages === 'undefined' || passages.length === 0) { return; }
        for (var i = 0; i < passages.length; i++) {
          var passage = passages[i];
          var tmp = {
            book: BibleAccessor.bookNames[passage.get('book')],
            chapter: passage.get('chapter'),
            start: passage.get('firstVerse'),
            end: passage.get('lastVerse'),
            verse: passage.get('snippet'),
            date: reflection.get('createdAt').toDateString(),
            objId: reflection.id,
            title:
                BibleAccessor.bookNames[passage.get('book')] + ' ' + passage.get('chapter')
                + (passage.get('firstVerse') != passage.get('lastVerse')
                   ? ' verses ' + passage.get('firstVerse') + ' - ' + passage.get('lastVerse')
                   : ' verse ' + passage.get('firstVerse'))

          };
          $scope.historyView.push(tmp)
        };
        $scope.$apply();
      })
    };
  });
}]);
