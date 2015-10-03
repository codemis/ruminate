'use strict';

angular.module('starter.controllers', [])

.controller('HomeController', function($scope, $ionicModal) {

  $scope.passageSnippet = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lectus ipsum, rhoncus consectetur rhoncus sed, sodales id sapien. Donec ac consequat augue. Sed fermentum nibh sit amet ipsum maximus varius. Nulla finibus mauris eget purus viverra, et maximus ante laoreet. Etiam at eros ac neque gravida ullamcorper at in leo. Aliquam eget lobortis diam. Mauris tellus erat, condimentum eget tristique eget, commodo in quam. Praesent sit amet interdum leo. Fusce id metus euismod, fringilla purus a, varius mi.\n\nCurabitur risus diam, condimentum non augue sed, varius imperdiet libero. Aenean iaculis, mi et posuere rutrum, lectus ligula efficitur erat, sed ullamcorper odio nisl eu ligula. In sodales massa nec maximus pellentesque. Aenean ornare risus felis, et viverra nisi consequat at. Donec arcu metus, luctus ornare auctor et, pharetra nec quam. In a nulla tincidunt, convallis purus nec, mollis odio. Donec egestas sem id vestibulum consectetur. Etiam at leo odio. Nunc pellentesque felis quis nibh dictum, quis posuere justo fringilla. Mauris mollis augue et erat pulvinar, in tristique turpis mollis.\n\nQuisque at mattis lacus. Quisque interdum sagittis accumsan. Praesent laoreet vulputate nunc, ac consectetur leo pulvinar sed. Proin volutpat tellus quis hendrerit fringilla. Suspendisse a enim ac purus dictum tincidunt eu eget nunc. Phasellus faucibus nisi diam, at varius lacus pretium id. Sed sed eros nisl. Nulla pharetra eget ex nec vulputate. Praesent vehicula enim gravida ipsum bibendum pharetra. Quisque tincidunt scelerisque odio, id finibus massa elementum at. Sed venenatis blandit iaculis. Cras finibus ornare sagittis. Vestibulum quis luctus ex.\n\nMorbi non molestie ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla vitae ante eu turpis eleifend volutpat tincidunt ut risus. Pellentesque ligula nisi, ultricies eget tincidunt et, scelerisque a ante. Praesent erat metus, viverra sed turpis nec, mollis gravida felis. Quisque eget cursus elit. Vivamus iaculis, tortor vitae efficitur mollis, diam ante iaculis nisl, in viverra ex libero ac ipsum. Sed in nisl quis nunc posuere convallis. Vestibulum sollicitudin eleifend nulla, et ultrices nisi pulvinar sed. Quisque dui nulla, auctor ut tincidunt a, molestie vitae massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris hendrerit felis vitae ex consectetur, ut dictum ex iaculis. Maecenas vitae sem congue, imperdiet mi vitae, tincidunt lectus. Fusce sollicitudin purus tellus, nec faucibus nibh sollicitudin id.';
  $scope.passage = {
    "book":"GEN",
    "chapter":"1",
    "verseStart":1,
    "verseEnd":10
  }
  var truncate = function(str, len) {
    var trimmedString = str.substr(0, len);
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
    if(trimmedString.length < str.length)
      trimmedString = trimmedString + "..."
    return trimmedString;
  };

  $scope.hasPassage = function() {
    return passage != null;
  };

  $scope.truncatedSnippet = truncate($scope.passageSnippet, 320);

  $scope.answerModel = '';
  $scope.unansweredQuestion = 'Some unanswered question';

  $scope.hasUnansweredQuestion = function() {
    return $scope.unansweredQuestion !== null;
  };
  $scope.updateAnswer = function() {
    // do something with $scope.answerModel
    // console.log(''' + $scope.answerModel + ''');
  };

  $scope.toggleQuestion = function(question) {
    question.open = !question.open;
  };

  $scope.selectPassage = function() {
    // do LOTS of VERY complicated stuff
  };

  $scope.questions = [
    {
      'question':'Some complex question I asked you',
      'answer':'Some long answer I gave. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lectus ipsum, rhoncus consectetur rhoncus sed, sodales id sapien. Donec ac consequat augue. Sed fermentum nibh sit amet ipsum maximus varius. Nulla finibus mauris eget purus viverra, et maximus ante laoreet. Etiam at eros ac neque gravida ullamcorper at in leo. Aliquam eget lobortis diam. Mauris tellus erat, condimentum eget tristique eget, commodo in quam. Praesent sit amet interdum leo. Fusce id metus euismod, fringilla purus a, varius mi.\n\nCurabitur risus diam, condimentum non augue sed, varius imperdiet libero. Aenean iaculis, mi et posuere rutrum, lectus ligula efficitur erat, sed ullamcorper odio nisl eu ligula. In sodales massa nec maximus pellentesque. Aenean ornare risus felis, et viverra nisi consequat at. Donec arcu metus, luctus ornare auctor et, pharetra nec quam. In a nulla tincidunt, convallis purus nec, mollis odio. Donec egestas sem id vestibulum consectetur. Etiam at leo odio. Nunc pellentesque felis quis nibh dictum, quis posuere justo fringilla. Mauris mollis augue et erat pulvinar, in tristique turpis mollis.\n\nQuisque at mattis lacus. Quisque interdum sagittis accumsan. Praesent laoreet vulputate nunc, ac consectetur leo pulvinar sed. Proin volutpat tellus quis hendrerit fringilla. Suspendisse a enim ac purus dictum tincidunt eu eget nunc. Phasellus faucibus nisi diam, at varius lacus pretium id. Sed sed eros nisl. Nulla pharetra eget ex nec vulputate. Praesent vehicula enim gravida ipsum bibendum pharetra. Quisque tincidunt scelerisque odio, id finibus massa elementum at. Sed venenatis blandit iaculis. Cras finibus ornare sagittis. Vestibulum quis luctus ex.\n\nMorbi non molestie ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla vitae ante eu turpis eleifend volutpat tincidunt ut risus. Pellentesque ligula nisi, ultricies eget tincidunt et, scelerisque a ante. Praesent erat metus, viverra sed turpis nec, mollis gravida felis. Quisque eget cursus elit. Vivamus iaculis, tortor vitae efficitur mollis, diam ante iaculis nisl, in viverra ex libero ac ipsum. Sed in nisl quis nunc posuere convallis. Vestibulum sollicitudin eleifend nulla, et ultrices nisi pulvinar sed. Quisque dui nulla, auctor ut tincidunt a, molestie vitae massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris hendrerit felis vitae ex consectetur, ut dictum ex iaculis. Maecenas vitae sem congue, imperdiet mi vitae, tincidunt lectus. Fusce sollicitudin purus tellus, nec faucibus nibh sollicitudin id.\n\nAliquam et nunc ac orci scelerisque rhoncus. Etiam ullamcorper dui quis fermentum congue. Nulla fringilla sit amet ante vel ultrices. Sed vitae lacus nec turpis ultricies tempor. Aenean nisl leo, egestas sit amet nisi sit amet, euismod egestas quam. Proin dolor purus, hendrerit scelerisque dignissim eu, consectetur ac ipsum. Sed dictum sodales libero non rhoncus. Phasellus condimentum ullamcorper congue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce accumsan scelerisque purus, non vulputate lorem facilisis pulvinar. Aliquam sodales at erat ac sagittis. Integer tempus arcu vitae ligula lobortis laoreet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum nec tristique metus. Proin sollicitudin fringilla lacus, mattis iaculis libero dignissim at. Nam nisi ligula, finibus sit amet orci vitae, consectetur iaculis ipsum.',
      'open':false
    },
    {
      'question':'Some other question I asked you',
      'answer':'Some other answer I gave',
      'open':false
    },
    {
      'question':'Some question I asked you',
      'answer':'Some answer I gave',
      'open':false
    }
  ];


  $ionicModal.fromTemplateUrl('templates/question-popover.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $ionicModal.fromTemplateUrl('templates/passage-popover.html', {
    scope: $scope,
    animation: 'slide-in-right'
  }).then(function(modal) {
    $scope.versemodal = modal;
  });

  $scope.openQuestionModal = function(event, question) {
    event.stopPropagation();
    $scope.openQuestion = question;
    $scope.modal.show();
  };
  $scope.openPassageModal = function(event, passage) {
    event.stopPropagation();
    $scope.openPassage = passage;
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.versemodal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
    $scope.versemodal.remove();
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