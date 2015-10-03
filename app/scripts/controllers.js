'use strict';

angular.module('starter.controllers', [])

.controller('HomeController', function($scope, $ionicModal) {

  $scope.passageSnippet = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lectus ipsum, rhoncus consectetur rhoncus sed, sodales id sapien. Donec ac consequat augue. Sed fermentum nibh sit amet ipsum maximus varius. Nulla finibus mauris eget purus viverra, et maximus ante laoreet. Etiam at eros ac neque gravida ullamcorper at in leo. Aliquam eget lobortis diam. Mauris tellus erat, condimentum eget tristique eget, commodo in quam. Praesent sit amet interdum leo.";

  $scope.answerModel = "";
  $scope.unansweredQuestion = "Some unanswered question";

  $scope.hasUnansweredQuestion = function() {
    return $scope.unansweredQuestion !== null
  }
  $scope.updateAnswer = function() {
    // do something with $scope.answerModel
    // console.log("'" + $scope.answerModel + "'");
  }

  $scope.toggleQuestion = function(question) {
    question.open = !question.open;
  }

  $scope.questions = [
    {
      "question":"Some complex question I asked you",
      "answer":"Some long answer I gave. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lectus ipsum, rhoncus consectetur rhoncus sed, sodales id sapien. Donec ac consequat augue. Sed fermentum nibh sit amet ipsum maximus varius. Nulla finibus mauris eget purus viverra, et maximus ante laoreet. Etiam at eros ac neque gravida ullamcorper at in leo. Aliquam eget lobortis diam. Mauris tellus erat, condimentum eget tristique eget, commodo in quam. Praesent sit amet interdum leo. Fusce id metus euismod, fringilla purus a, varius mi.\n\nCurabitur risus diam, condimentum non augue sed, varius imperdiet libero. Aenean iaculis, mi et posuere rutrum, lectus ligula efficitur erat, sed ullamcorper odio nisl eu ligula. In sodales massa nec maximus pellentesque. Aenean ornare risus felis, et viverra nisi consequat at. Donec arcu metus, luctus ornare auctor et, pharetra nec quam. In a nulla tincidunt, convallis purus nec, mollis odio. Donec egestas sem id vestibulum consectetur. Etiam at leo odio. Nunc pellentesque felis quis nibh dictum, quis posuere justo fringilla. Mauris mollis augue et erat pulvinar, in tristique turpis mollis.\n\nQuisque at mattis lacus. Quisque interdum sagittis accumsan. Praesent laoreet vulputate nunc, ac consectetur leo pulvinar sed. Proin volutpat tellus quis hendrerit fringilla. Suspendisse a enim ac purus dictum tincidunt eu eget nunc. Phasellus faucibus nisi diam, at varius lacus pretium id. Sed sed eros nisl. Nulla pharetra eget ex nec vulputate. Praesent vehicula enim gravida ipsum bibendum pharetra. Quisque tincidunt scelerisque odio, id finibus massa elementum at. Sed venenatis blandit iaculis. Cras finibus ornare sagittis. Vestibulum quis luctus ex.",
      "open":false
    },
    {
      "question":"Some other question I asked you",
      "answer":"Some other answer I gave",
      "open":false
    },
    {
      "question":"Some question I asked you",
      "answer":"Some answer I gave",
      "open":false
    }
  ];


  $ionicModal.fromTemplateUrl('templates/question-popover.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    console.log("open");
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

})
.controller('HistoryController', function($scope) {})
.controller('SettingsController', function($scope) {});