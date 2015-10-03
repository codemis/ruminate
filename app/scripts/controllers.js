'use strict';

// initialized at the bottom because it's really long,
// and these are callbacks which means it'll be initialized by the time they're called
var lorem;
var arr = [
  {
    "number":2,
    "content":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id lacus ligula. Nullam turpis metus, sodales vehicula dignissim a, tincidunt convallis erat. Donec eu ligula quis mi fermentum blandit."
  },
  {
    "number":3,
    "content":"Vestibulum egestas sapien eu turpis efficitur, id rutrum velit aliquam. Vivamus elementum quis neque semper tristique. Phasellus luctus et mauris id condimentum. Vestibulum vestibulum porttitor semper."
  },
  {
    "number":4,
    "content":"Pellentesque molestie eros quis varius congue. In blandit risus non nulla viverra, eget porta ipsum porta. Vivamus molestie ut metus eu viverra."
  },
  {
    "number":5,
    "content":"Curabitur rutrum risus quis elit feugiat ultricies. Ut non lacus lorem. Fusce aliquet laoreet lorem eget hendrerit. Sed eleifend ex urna, vitae porttitor ipsum tristique in."
  },
  {
    "number":6,
    "content":"Mauris iaculis lacus vel est congue, in pharetra orci porta. Integer sollicitudin lacinia nisi, eu suscipit tortor congue sit amet."
  },
  {
    "number":7,
    "content":"Duis interdum turpis non aliquet dignissim. Aliquam ullamcorper ligula ipsum, at luctus justo blandit et. Phasellus imperdiet fermentum ex, ut feugiat leo cursus elementum. Nulla venenatis feugiat accumsan."
  },
  {
    "number":8,
    "content":"Nunc pulvinar, metus non ornare faucibus, leo lectus maximus arcu, id eleifend justo nunc in lacus."
  },
  {
    "number":9,
    "content":"Nulla ut tincidunt sapien, sit amet vestibulum ipsum. Mauris quam ante, accumsan et sodales et, dictum a ligula. Donec congue accumsan nunc. Donec quam elit, lacinia nec maximus ac, gravida et erat."
  },
  {
    "number":10,
    "content":"Phasellus vitae nisl viverra, commodo velit et, tristique nibh. Nunc efficitur odio ac velit pulvinar, et commodo nunc aliquam. Fusce ultricies arcu erat, et suscipit felis ullamcorper at. Aenean non pulvinar nulla, non fermentum nisl."
  },
  {
    "number":11,
    "content":"Aenean et ipsum leo. Nullam tristique arcu sit amet dolor sodales rutrum. Suspendisse eget arcu arcu. Nunc condimentum nulla velit, et convallis ipsum maximus dignissim. Proin vehicula, odio nec ultricies bibendum, est nisl elementum orci, quis porta risus lacus non risus."
  },
  {
    "number":12,
    "content":"Sed commodo purus sit amet lectus elementum blandit. Aenean quis fringilla diam. Etiam in ligula ut felis efficitur semper et vitae diam."
  },
  {
    "number":13,
    "content":"Mauris sit amet ante id libero tincidunt laoreet nec eget nulla. Vestibulum ac porttitor eros. Praesent nec congue urna, non feugiat orci. Nullam tristique suscipit lacus eget viverra. Etiam urna turpis, tempus eu consequat a, sodales id ligula. Etiam fermentum, nisl ac egestas luctus, ligula eros tincidunt lacus, id auctor tortor elit eget urna."
  }
];
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
.controller('HomeController', function($scope, $ionicModal) {
  $scope.passageSnippet = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lectus ipsum, rhoncus consectetur rhoncus sed, sodales id sapien. Donec ac consequat augue. Sed fermentum nibh sit amet ipsum maximus varius. Nulla finibus mauris eget purus viverra, et maximus ante laoreet. Etiam at eros ac neque gravida ullamcorper at in leo. Aliquam eget lobortis diam. Mauris tellus erat, condimentum eget tristique eget, commodo in quam. Praesent sit amet interdum leo. Fusce id metus euismod, fringilla purus a, varius mi.\n\nCurabitur risus diam, condimentum non augue sed, varius imperdiet libero. Aenean iaculis, mi et posuere rutrum, lectus ligula efficitur erat, sed ullamcorper odio nisl eu ligula. In sodales massa nec maximus pellentesque. Aenean ornare risus felis, et viverra nisi consequat at. Donec arcu metus, luctus ornare auctor et, pharetra nec quam. In a nulla tincidunt, convallis purus nec, mollis odio. Donec egestas sem id vestibulum consectetur. Etiam at leo odio. Nunc pellentesque felis quis nibh dictum, quis posuere justo fringilla. Mauris mollis augue et erat pulvinar, in tristique turpis mollis.\n\nQuisque at mattis lacus. Quisque interdum sagittis accumsan. Praesent laoreet vulputate nunc, ac consectetur leo pulvinar sed. Proin volutpat tellus quis hendrerit fringilla. Suspendisse a enim ac purus dictum tincidunt eu eget nunc. Phasellus faucibus nisi diam, at varius lacus pretium id. Sed sed eros nisl. Nulla pharetra eget ex nec vulputate. Praesent vehicula enim gravida ipsum bibendum pharetra. Quisque tincidunt scelerisque odio, id finibus massa elementum at. Sed venenatis blandit iaculis. Cras finibus ornare sagittis. Vestibulum quis luctus ex.\n\nMorbi non molestie ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla vitae ante eu turpis eleifend volutpat tincidunt ut risus. Pellentesque ligula nisi, ultricies eget tincidunt et, scelerisque a ante. Praesent erat metus, viverra sed turpis nec, mollis gravida felis. Quisque eget cursus elit. Vivamus iaculis, tortor vitae efficitur mollis, diam ante iaculis nisl, in viverra ex libero ac ipsum. Sed in nisl quis nunc posuere convallis. Vestibulum sollicitudin eleifend nulla, et ultrices nisi pulvinar sed. Quisque dui nulla, auctor ut tincidunt a, molestie vitae massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris hendrerit felis vitae ex consectetur, ut dictum ex iaculis. Maecenas vitae sem congue, imperdiet mi vitae, tincidunt lectus. Fusce sollicitudin purus tellus, nec faucibus nibh sollicitudin id.';
  
  var truncate = function(str, len) {
    var trimmedString = str.substr(0, len);
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
    if(trimmedString.length < str.length) {
      trimmedString = trimmedString + '...';      
    }
    return trimmedString;
  };
  $scope.passage = passageDef;

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
    // do something with $scope.answerModel
    // console.log(''' + $scope.answerModel + ''');
  };

  $scope.toggleQuestion = function(question) {
    question.open = !question.open;
  };

  $scope.selectPassage = function() {
    $scope.passage = $scope.hasPassage() ? null : passageDef;
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
.controller('HistoryController', function($scope) {})
.controller('SettingsController', function($scope) {});

lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id lacus ligula. Nullam turpis metus, sodales vehicula dignissim a, tincidunt convallis erat. Donec eu ligula quis mi fermentum blandit. Vestibulum egestas sapien eu turpis efficitur, id rutrum velit aliquam. Vivamus elementum quis neque semper tristique. Phasellus luctus et mauris id condimentum. Vestibulum vestibulum porttitor semper. Pellentesque molestie eros quis varius congue. In blandit risus non nulla viverra, eget porta ipsum porta. Vivamus molestie ut metus eu viverra. Curabitur rutrum risus quis elit feugiat ultricies. Ut non lacus lorem. Fusce aliquet laoreet lorem eget hendrerit. Sed eleifend ex urna, vitae porttitor ipsum tristique in.\n\nIn placerat faucibus efficitur. Vestibulum et vulputate erat, sit amet luctus lectus. Nam semper tempor pharetra. Mauris iaculis lacus vel est congue, in pharetra orci porta. Integer sollicitudin lacinia nisi, eu suscipit tortor congue sit amet. Duis interdum turpis non aliquet dignissim. Aliquam ullamcorper ligula ipsum, at luctus justo blandit et. Phasellus imperdiet fermentum ex, ut feugiat leo cursus elementum. Nulla venenatis feugiat accumsan. Nunc pulvinar, metus non ornare faucibus, leo lectus maximus arcu, id eleifend justo nunc in lacus.\n\nNulla ut tincidunt sapien, sit amet vestibulum ipsum. Mauris quam ante, accumsan et sodales et, dictum a ligula. Donec congue accumsan nunc. Donec quam elit, lacinia nec maximus ac, gravida et erat. Phasellus vitae nisl viverra, commodo velit et, tristique nibh. Nunc efficitur odio ac velit pulvinar, et commodo nunc aliquam. Fusce ultricies arcu erat, et suscipit felis ullamcorper at. Aenean non pulvinar nulla, non fermentum nisl.\n\nAenean et ipsum leo. Nullam tristique arcu sit amet dolor sodales rutrum. Suspendisse eget arcu arcu. Nunc condimentum nulla velit, et convallis ipsum maximus dignissim. Proin vehicula, odio nec ultricies bibendum, est nisl elementum orci, quis porta risus lacus non risus. Sed commodo purus sit amet lectus elementum blandit. Aenean quis fringilla diam. Etiam in ligula ut felis efficitur semper et vitae diam.\n\nMauris sit amet ante id libero tincidunt laoreet nec eget nulla. Vestibulum ac porttitor eros. Praesent nec congue urna, non feugiat orci. Nullam tristique suscipit lacus eget viverra. Etiam urna turpis, tempus eu consequat a, sodales id ligula. Etiam fermentum, nisl ac egestas luctus, ligula eros tincidunt lacus, id auctor tortor elit eget urna. Donec nec lobortis tellus. Nulla sagittis, justo eu pulvinar molestie, metus mi condimentum augue, eget rhoncus mauris nisi ut arcu. Nunc pulvinar porta dolor ut tristique. In hac habitasse platea dictumst. Sed gravida, lectus a semper maximus, mauris diam pellentesque arcu, nec imperdiet enim magna ac lacus. Sed pellentesque magna id neque pellentesque, in imperdiet urna ornare. Vivamus aliquam vitae ligula nec vestibulum.\n\nInteger porta cursus risus, sit amet mattis tortor elementum interdum. Curabitur ac eros nec massa interdum interdum eu suscipit libero. Aliquam enim mi, auctor dignissim fermentum at, placerat in urna. Nunc rhoncus dolor sit amet dui lacinia porta. Aenean vestibulum dolor ligula, et elementum enim pellentesque sit amet. Praesent sodales purus vel nunc molestie, in suscipit ipsum convallis. Proin ultrices volutpat urna. Etiam porta nec massa vel varius. Proin urna lectus, convallis et commodo sed, tristique vitae dui. Duis sed suscipit augue, a imperdiet arcu. Morbi consequat egestas nisi, non convallis mi dignissim sit amet. Donec tincidunt congue sem, sed venenatis enim commodo a. Donec a arcu tincidunt, consequat ex et, maximus augue. Integer pellentesque, nulla ornare dignissim accumsan, lacus diam tempus mauris, sit amet tempus mauris nulla eget urna. Suspendisse mi sem, congue scelerisque purus sit amet, sagittis cursus purus. Cras laoreet sem et condimentum blandit.';