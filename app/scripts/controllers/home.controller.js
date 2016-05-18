'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('HomeController', [ '$scope', '$log', '$ionicModal', '$stateParams', '$location', '$interval', 'ParseService', 'ParseReflection', 'ParsePassage', 'ParseResponse', 'ParseQuestion', 'BibleAccessor'
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
        if ($scope.passage.firstVerse === $scope.passage.lastVerse)
        {
          return $scope.passage.book+' '+$scope.passage.chapter+' verse '+$scope.passage.firstVerse;
        }
        else
        {
          return $scope.passage.book+' '+$scope.passage.chapter+' verses '+$scope.passage.firstVerse+' - '+$scope.passage.lastVerse;
        }
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

}]);
