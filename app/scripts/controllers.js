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
.controller('PassageController', function($scope){
  
  $scope.passage = passageDef;

})
.controller('HomeController', function($scope, $ionicModal, $location) {
  $scope.passageSnippet = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lectus ipsum, rhoncus consectetur rhoncus sed, sodales id sapien. Donec ac consequat augue. Sed fermentum nibh sit amet ipsum maximus varius. Nulla finibus mauris eget purus viverra, et maximus ante laoreet. Etiam at eros ac neque gravida ullamcorper at in leo. Aliquam eget lobortis diam. Mauris tellus erat, condimentum eget tristique eget, commodo in quam. Praesent sit amet interdum leo. Fusce id metus euismod, fringilla purus a, varius mi.\n\nCurabitur risus diam, condimentum non augue sed, varius imperdiet libero. Aenean iaculis, mi et posuere rutrum, lectus ligula efficitur erat, sed ullamcorper odio nisl eu ligula. In sodales massa nec maximus pellentesque. Aenean ornare risus felis, et viverra nisi consequat at. Donec arcu metus, luctus ornare auctor et, pharetra nec quam. In a nulla tincidunt, convallis purus nec, mollis odio. Donec egestas sem id vestibulum consectetur. Etiam at leo odio. Nunc pellentesque felis quis nibh dictum, quis posuere justo fringilla. Mauris mollis augue et erat pulvinar, in tristique turpis mollis.\n\nQuisque at mattis lacus. Quisque interdum sagittis accumsan. Praesent laoreet vulputate nunc, ac consectetur leo pulvinar sed. Proin volutpat tellus quis hendrerit fringilla. Suspendisse a enim ac purus dictum tincidunt eu eget nunc. Phasellus faucibus nisi diam, at varius lacus pretium id. Sed sed eros nisl. Nulla pharetra eget ex nec vulputate. Praesent vehicula enim gravida ipsum bibendum pharetra. Quisque tincidunt scelerisque odio, id finibus massa elementum at. Sed venenatis blandit iaculis. Cras finibus ornare sagittis. Vestibulum quis luctus ex.\n\nMorbi non molestie ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla vitae ante eu turpis eleifend volutpat tincidunt ut risus. Pellentesque ligula nisi, ultricies eget tincidunt et, scelerisque a ante. Praesent erat metus, viverra sed turpis nec, mollis gravida felis. Quisque eget cursus elit. Vivamus iaculis, tortor vitae efficitur mollis, diam ante iaculis nisl, in viverra ex libero ac ipsum. Sed in nisl quis nunc posuere convallis. Vestibulum sollicitudin eleifend nulla, et ultrices nisi pulvinar sed. Quisque dui nulla, auctor ut tincidunt a, molestie vitae massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris hendrerit felis vitae ex consectetur, ut dictum ex iaculis. Maecenas vitae sem congue, imperdiet mi vitae, tincidunt lectus. Fusce sollicitudin purus tellus, nec faucibus nibh sollicitudin id.';
  
  var truncate = function(str, len) {
    var trimmedString = str.substr(0, len);
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
    if(trimmedString.length < str.length) {
      trimmedString = trimmedString + '...';      
    }
    return trimmedString;
  };
  $scope.passage = null;//passageDef;

  $scope.hasPassage = function() {
    return $scope.passage !== null && typeof $scope.passage !== 'undefined';
  };

  $scope.truncatedSnippet = truncate($scope.passageSnippet, 320);

  $scope.answerModel = '';
  $scope.unansweredQuestion = 'Some unanswered question';

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

})

.controller('HistoryController', function($scope) {

  //Use parse to fetch the history

  //After that is done....place it in the $scope variable....

  $scope.historyView = [];

  //var date = new Date();

  //dateString = (date.getMonth() + 1).toString() + "-" + (date.getDate()).toString() + "-" + (date.getYear()).toString();

  var dateString = '10-03-2015';

  $scope.historyView.push({
      id:1,
      verse:'This is one test data',
      date:dateString
  });
  $scope.historyView.push({
      id:2,
      verse:'This is another test data',
      date:dateString
  });
  $scope.historyView.push({
      id:3,
      verse:'This is yet another test data',
      date:dateString
  });
  $scope.historyView.push({
      id:4,
      verse:'This is yet one more test data',
      date:dateString
  });

  //$scope.historyView.push(dateString + ' This is one test data');
  //$scope.historyView.push(dateString + ' This is another test data');
  //$scope.historyView.push(dateString + ' This is yet another test data');
  //$scope.historyView.push(dateString + ' This is yet one more test data');

})
.controller('ChapterSelectController', ['$scope', 'BibleAccessor', function($scope, BibleAccessor) {
  $scope.books = [];
  BibleAccessor.getBookList(function(list) { $scope.books = list; });
}])
.controller('VerseSelectController', ['$scope', '$stateParams', 'BibleAccessor', function($scope, $stateParams, BibleAccessor) {
  
  // These contain the information that will be added to the database
  $scope.chapter = $stateParams.chapter;
  $scope.book = $stateParams.bookId;
  $scope.bookName = BibleAccessor.versionNames[$scope.book];
  $scope.dam_id = $stateParams.damId;
  $scope.firstVerse=-1;
  $scope.lastVerse=-1

  BibleAccessor.getVerses($scope.dam_id, $scope.book, $scope.chapter, function(verses) {
    $scope.verses = verses;
  });


  $scope.isSelected = function(id) {
    id = parseInt(id);
    if($scope.firstVerse == -1 || $scope.lastVerse == -1) {
      return id == $scope.firstVerse || id == $scope.lastVerse;
    } else {
      return id >= $scope.firstVerse && id <= $scope.lastVerse;
    }
  }

  $scope.handleClick = function(id) {
    id = parseInt(id);
    if(id == $scope.lastVerse) {
      $scope.lastVerse = -1;
    } else
    if(id == $scope.firstVerse) {
      $scope.firstVerse = -1;
    } else

    if($scope.lastVerse == -1 && $scope.firstVerse == -1) {
      $scope.lastVerse = id;
    } else

    if( $scope.lastVerse == -1 && $scope.firstVerse != -1) {
      if($scope.firstVerse > id) {
        $scope.lastVerse = $scope.firstVerse;
        $scope.firstVerse = id;
      } else {
        $scope.lastVerse = id;
      }
    } else
    if( $scope.firstVerse == -1 && $scope.lastVerse != -1) {
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
}])

.controller('SettingsController', function($scope) {});