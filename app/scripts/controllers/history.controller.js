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
            objId: reflection.id
          };
          $scope.historyView.push(tmp)
        };
        $scope.$apply();
      })
    };
  });
		/* for (var ctr = 0; ctr < result.length; ctr++) {

        (function(ctr){
		      ParsePassage.queryWithReflection(ParseReflection.result[ctr], function() {
				    var createdDate = ParseReflection.result[numberOfQueriesWithReflection].get("createdAt");

            for (var ctr2 = 0; ctr2 < ParsePassage.result.length; ctr2++)
					  {
					      parseResult.push({date:createdDate, passageResult:ParsePassage.result[ctr2]});
					  }

					  numberOfQueriesWithReflection++;
					  if (numberOfQueriesWithReflection == ParseReflection.result.length)
					  {
					      for (var ctr3 = 0; ctr3 < parseResult.length; ctr3++)
						  {
						      $scope.historyView.push(
							      {
								      info:  parseResult[ctr3].passageResult.book + " " + parseResult[ctr3].passageResult.chapter + ":" + parseResult[ctr3].passageResult.firstVerse + "-" + parseResult[ctr3].passageResult.lastVerse
								     ,verse: parseResult[ctr3].passageResult.snippet
									 ,date: parseResult[ctr3].date.toDateString()
								  }
							  );
						  }
						  $scope.$apply();
					  }
				  });
        })(ctr)
		  }
	  }
  )*/

  //$scope.historyView.push({
  //    id:1,
  //    verse:'This is one test data',
  //    date:dateString
  //});
  //$scope.historyView.push({
  //    id:2,
  //    verse:'This is another test data',
  //    date:dateString
  //});
  //$scope.historyView.push({
  //    id:3,
  //    verse:'This is yet another test data',
  //    date:dateString
  //});
  //$scope.historyView.push({
  //    id:4,
  //    verse:'This is yet one more test data',
  //    date:dateString
  //});

  //$scope.historyView.push(dateString + ' This is one test data');
  //$scope.historyView.push(dateString + ' This is another test data');
  //$scope.historyView.push(dateString + ' This is yet another test data');
  //$scope.historyView.push(dateString + ' This is yet one more test data');

}]);
