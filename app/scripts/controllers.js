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

  ParsePassage.getFromId($scope.id, function(passage) {
    if(typeof passage === 'undefined'){ return; }
    $scope.bookName = BibleAccessor.bookNames[passage.get('book')];
    $scope.chapter  = passage.get('chapter');
    BibleAccessor.getVerses(BibleAccessor.bookDamMap[passage.get('book')], passage.get('book'), passage.get('chapter'), function(verses) {
      $scope.verses = verses.slice(passage.get('firstVerse'), passage.get('lastVerse') + 1);
    });
    $scope.$apply();
  })

}])

.controller('HomeController', [ '$scope', '$log', '$ionicModal', '$stateParams', '$location', '$interval', 'ParseService', 'ParseReflection', 'ParsePassage', 'ParseResponse', 'ParseQuestion', 'BibleAccessor'
  ,function($scope, $log, $ionicModal, $stateParams, $location, $interval, ParseService, ParseReflection, ParsePassage, ParseResponse, ParseQuestion, BibleAccessor) {
  $scope.objId = $stateParams.objId;
  /**
   * Saving Interval for checking whether we need to push a save
   * @type {Object|Null}
   * @access private
   */
  var savingInterval = null;

  /**
   * Update the data for the Reflection
   *
   * @param  {String} objId The id for the given reflection
   * @return {void}
   * @access public
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  $scope.updateData = function(objId) {
    console.log('updateData');
    if(typeof objId === 'undefined') {
      ParseReflection.getForToday(loadReflection, loadReflectionError);
    } else {
      ParseReflection.getById(objId, loadReflection);
    }
  }

  /**
   * Load the given reflection and questions with responses
   *
   * @param  {ParseReflection} reflection The reflection to load
   * @return {void}
   * @access private
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  function loadReflection(reflection) {
    $scope.reflection = reflection;
    $scope.questions = [];
    ParsePassage.getFromReflection($scope.reflection, function(passages) {
      if(typeof passages === 'undefined' || typeof passages[0] === 'undefined'){ return; }
      var passage = passages[0];
      $scope.passage = {};
      $scope.passage.book       = passage.get('book');
      $scope.passage.chapter    = passage.get('chapter');
      $scope.passage.firstVerse = passage.get('firstVerse');
      $scope.passage.lastVerse  = passage.get('lastVerse');
      $scope.passage.snippet    = passage.get('snippet');
      $scope.passage.date       = passage.get('createdAt').toDateString();
      $scope.passage.recordId   = passage.id;
      $scope.passage.title      = getTitle();

      $scope.truncatedSnippet = truncate($scope.passage.snippet, 320);
      $scope.$apply();
    });
    ParseResponse.forEachFromReflectionWithQuestion($scope.reflection, function(response) {
      var obj = {open:false};
      obj.answer = response.get('answer');
      obj.recordId = response.id;
      obj.question = response.question.get('questionText');

      $scope.questions.push(obj);
      $scope.$apply();
    });
    $scope.hasReflection = true;
    $scope.$apply();
  }

  /**
   * If no results were found when attempting to load a reflection....
   * the function below executes....
   *
   * @return {void}
   * @access private
   *
   */
  function loadReflectionError() {
     $scope.displaySelectButton = true;
     $scope.$apply();
  }

  $scope.displaySelectButton = false;
  $scope.hasReflection = false;
  $scope.reflection = null;
  $scope.truncatedSnippet = '';
  $scope.passage = {};
  $scope.questions = [];
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

  /**
   * Get the title for the passage
   *
   * @return {String} The title for the given passage
   * @access private
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  function getTitle() {
    if (angular.equals({}, $scope.passage)) {
      return 'Passage Loading';
    } else {
        return $scope.passage.book+' '+$scope.passage.chapter+' verses '+$scope.passage.firstVerse+' - '+$scope.passage.lastVerse;
    }
  };
  /**
   * Save all notes by sending it to Parse
   *
   * @return {Void}
   * @access public
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  function saveAllNotes() {
    angular.forEach($scope.questions, function(question, key) {
      if (question.needsSaving === true) {
        /**
         * Save the question
         */
        $log.log('Saving Question: '+question.question);
        ParseResponse.update(question.recordId, question.answer, function(saved) {
          if (saved) {
            $scope.questions[key].needsSaving = false;
          }
        });
      }
    });
  };


  $scope.answerModel = '';

  $scope.updateNeedsSaving = function(question) {
    question.needsSaving = true;
  };

  $scope.toggleQuestion = function(question) {
    question.open = !question.open;
  };

  $scope.selectPassage = function() {
    $location.path('/tab/home/chapter-select');
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
    $interval.cancel(savingInterval);
    savingInterval = null;
    console.log('Saving all notes!');
    saveAllNotes();
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

  $scope.$on('$ionicView.enter', function() {
    if (savingInterval === null) {
      savingInterval = $interval(function() {
        console.log('Saving all notes!');
        saveAllNotes();
      }, 5000);
    }
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
}])

.controller('ChapterSelectController', ['$scope', 'BibleAccessor', function($scope, BibleAccessor) {
  $scope.books = [];
  BibleAccessor.getBookList(function(list) { $scope.books = list; });
  var cur = null
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
}])

.controller('VerseSelectController', ['$scope', '$stateParams', '$location', '$ionicHistory', 'BibleAccessor', 'ParseUser', 'ParseReflection', 'ParsePassage',
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
}])

.controller('SettingsController', function($scope) {

$scope.minuteSelection = [{value:5,text:'5 minutes',selected:false}, {value:10,text:'10 minutes',selected:true}, {value:20,text:'20 minutes',selected:false}, {value:30,text:'30 minutes',selected:false}, {value:60,text:'1 hour',selected:false}, {value:120,text:'2 hours',selected:false}, {value:240,text:'4 hours',selected:false}];

});
