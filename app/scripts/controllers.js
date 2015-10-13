'use strict';

// initialized at the bottom because it's really long,
// and these are callbacks which means it'll be initialized by the time they're called
var lorem;

var passageDef = {
  'book':'BID',
  'chapter':2,
  'startVerse':3,
  'stopVerse':5,
  'getBookName':function() {
    return 'fooBar';
  },
  'getText':function() {
    return arr;
  }
};


angular.module('starter.controllers', [])
.controller('PassageController', ['$scope', '$stateParams', 'ParseReflection', 'ParsePassage', 'BibleAccessor'
  , function($scope, $stateParams, ParseReflection, ParsePassage, BibleAccessor){
  
  $scope.id = $stateParams.passageId;
  console.log('id ' + $scope.id);

  ParsePassage.getFromId($scope.id, function(passage) {
    if(typeof passage === 'undefined'){ return; }
    console.log('HI!');
    $scope.bookName = BibleAccessor.bookNames[passage.get('book')];
    $scope.chapter  = passage.get('chapter');
    BibleAccessor.getVerses(BibleAccessor.bookDamMap[passage.get('book')], passage.get('book'), passage.get('chapter'), function(verses) {
      $scope.verses = verses.slice(passage.get('firstVerse'), passage.get('lastVerse') + 1);
    });
    $scope.$apply();
  })

}])
.controller('HomeController', [ '$scope', '$ionicModal', '$stateParams', '$location', 'ParseService', 'ParseReflection', 'ParsePassage', 'ParseResponse', 'ParseQuestion', 'BibleAccessor'
  ,function($scope, $ionicModal, $stateParams, $location, ParseService, ParseReflection, ParsePassage, ParseResponse, ParseQuestion, BibleAccessor) {
  
  $scope.objId = $stateParams.objId;

  $scope.updateData = function(objId) {
    var f = function(reflection) {
      $scope.reflection = reflection;
      console.log($scope.reflection.id);
      ParsePassage.getFromReflection($scope.reflection, function(passages) {
        if(typeof passages === 'undefined' || typeof passages[0] === 'undefined'){ return; }
        var passage = passages[0];
        $scope.passage = {};
        $scope.passage.book       = passage.get('book');
        $scope.passage.chapter    = passage.get('chapter');
        $scope.passage.firstVerse = passage.get('firstVerse');
        $scope.passage.lastVerse  = passage.get('lastVerse');
        $scope.passage.snippet    = passage.get('snippet');
        $scope.passage.recordId   = passage.id;

        $scope.truncatedSnippet = truncate($scope.passage.snippet, 320);
        $scope.$apply();
      });
      ParseResponse.forEachFromReflectionWithQuestion($scope.reflection, function(response) {
          var obj = {open:false};
          obj.answer = response.get('answer');
          obj.recordId = response.id;
          obj.question = response.question.get('questionText');

          if(obj.answer.trim().length == 0) {
            $scope.unansweredQuestion = obj;
          } else {
            $scope.questions.push(obj);
          }
          $scope.$apply();
      });
      $scope.hasReflection = true;
      $scope.$apply();
    };
    if(typeof objId === 'undefined') {
      ParseReflection.getForToday(f);      
    } else {
      ParseReflection.getById(objId, f);
    }
  }
  
  $scope.hasReflection = false;
  $scope.reflection = null;
  $scope.truncatedSnippet = '';
  $scope.passage = null;
  $scope.questions = [];
  $scope.unansweredQuestion = null;
  // {
  //   'question':'Some question I asked you',
  //   'answer':'Some answer I gave',
  //   'open':false
  // }
  var truncate = function(str, len) {
    var trimmedString = str.substr(0, len);
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
    if(trimmedString.length < str.length) {
      trimmedString = trimmedString + '...';      
    }
    return trimmedString;
  };

  // $scope.hasPassage = function() {
  //   return $scope.reflection !== null;
  // };


  $scope.answerModel = '';
  // $scope.unansweredQuestion = 'Some unanswered question';

  $scope.hasUnansweredQuestion = function() {
    return $scope.unansweredQuestion !== null;
  };
  $scope.updateAnswer = function() {
    
  };
  
  $scope.toggleQuestion = function(question) {
    question.open = !question.open;
  };

  $scope.selectPassage = function() {
    // $scope.passage = $scope.hasPassage() ? null : passageDef;
    $location.path('/tab/home/chapter-select');
    // do LOTS of VERY complicated stuff
  };


  $ionicModal.fromTemplateUrl('templates/question-popover.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openQuestionModal = function(event, question) {
    event.stopPropagation();
    $scope.openQuestion = question;
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  /**
   * Watch and wait for Parse to Initialize before loading everything
   */
  $scope.$watch(
    function() {
      return ParseService.parseInitialized;
    },
    function() {
      if (ParseService.parseInitialized === true) {
        $scope.updateData($scope.objId);
      }
    }
  );

}])

.controller('HistoryController', ['$scope', 'ParseReflection', 'ParsePassage', 'BibleAccessor'
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

}])
.controller('ChapterSelectController', ['$scope', 'BibleAccessor', function($scope, BibleAccessor) {
  $scope.books = [];
  BibleAccessor.getBookList(function(list) { $scope.books = list; });
  var cur = null
  $scope.isShown = function(book) {
    return book === cur;
    // if(typeof book.show === 'undefined') {
    //   return false;
    // } else {
    //   return book.show;
    // }
  };
  $scope.toggleShown = function(book) {
    if($scope.isShown(book)) {
      cur = null;
    } else {
      cur = book;
    }
    //book.show = !$scope.isShown(book);
  };
}])
.controller('VerseSelectController', ['$scope', '$stateParams', '$location', 'BibleAccessor', 'ParseUser', 'ParseReflection', 'ParsePassage', 
  function($scope, $stateParams, $location, BibleAccessor, ParseUser, ParseReflection, ParsePassage) {
  
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

    ParseReflection.create(function(reflection) {
      ParsePassage.create($scope.book, parseInt($scope.chapter), $scope.firstVerse, $scope.lastVerse, $scope.verses[$scope.firstVerse].content, reflection);
    });

    $location.path('/tab/home');
  };
}])

.controller('SettingsController', function($scope) {

$scope.minuteSelection = [{value:5,text:'5 minutes',selected:false}, {value:10,text:'10 minutes',selected:true}, {value:20,text:'20 minutes',selected:false}, {value:30,text:'30 minutes',selected:false}, {value:60,text:'1 hour',selected:false}, {value:120,text:'2 hours',selected:false}, {value:240,text:'4 hours',selected:false}];

});