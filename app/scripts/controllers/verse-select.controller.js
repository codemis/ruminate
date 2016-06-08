'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('VerseSelectController', ['$scope', '$stateParams', '$location', '$ionicHistory', '$ionicPlatform', '$cordovaNetwork', 'BibleAccessor', 'onDeviceService', 'ConsumerService', 'RuminationService',
  function($scope, $stateParams, $location, $ionicHistory, $ionicPlatform, $cordovaNetwork, BibleAccessor, onDeviceService, ConsumerService, RuminationService) {

  // These contain the information that will be added to the database
  $scope.chapter = $stateParams.chapter;
  $scope.book = $stateParams.bookId;
  $scope.bookName = BibleAccessor.bookNames[$scope.book];
  $scope.damId = $stateParams.damId;
  $scope.firstVerse=-1;
  $scope.lastVerse=-1;
  /**
   * Is the API accessible
   *
   * @type {Boolean}
   * @access public
   */
  $scope.apiAccessible = true;
  /**
   * The current Consumer
   *
   * @type {Object}
   * @access public
   */
  $scope.consumer = null;

  $ionicPlatform.ready(function() {
    /**
     * Handle online/offline access
     */
    if(onDeviceService.check()) {
      $scope.apiAccessible = $cordovaNetwork.isOnline();
    }
    /**
     * Watch for events that are broadcasted
     */
    $scope.$on('$cordovaNetwork:online', function() {
      $scope.apiAccessible = true;
      setup();
    });

    $scope.$on('$cordovaNetwork:offline', function() {
      $scope.apiAccessible = false;
      teardown();
    });

    $scope.$on('$ionicView.enter', function() {
      setup();
    });

    $scope.$on('$ionicView.leave', function() {
      teardown();
    });

    $scope.$on('$destroy', function() {
      teardown();
    });

  });

  $scope.isSelected = function(id) {
    id = parseInt(id);
    if($scope.firstVerse === -1 || $scope.lastVerse === -1) {
      return id === $scope.firstVerse || id === $scope.lastVerse;
    } else {
      return id >= $scope.firstVerse && id <= $scope.lastVerse;
    }
  };

  $scope.handleClick = function(id) {
    id = parseInt(id, 10);
    if(id === $scope.lastVerse) {
      $scope.lastVerse = -1;
    } else
    if(id === $scope.firstVerse) {
      $scope.firstVerse = -1;
    } else

    if($scope.lastVerse === -1 && $scope.firstVerse === -1) {
      $scope.lastVerse = id;
    } else

    if( $scope.lastVerse === -1 && $scope.firstVerse !== -1) {
      if($scope.firstVerse > id) {
        $scope.lastVerse = $scope.firstVerse;
        $scope.firstVerse = id;
      } else {
        $scope.lastVerse = id;
      }
    } else
    if( $scope.firstVerse === -1 && $scope.lastVerse !== -1) {
      if($scope.lastVerse < id) {
        $scope.firstVerse = $scope.lastVerse;
        $scope.lastVerse = id;
      } else {
        $scope.firstVerse = id;
      }
    } else

    if(id > $scope.lastVerse && $scope.lastVerse !== -1) {
      $scope.lastVerse = id;
    } else
    if(id < $scope.firstVerse && $scope.firstVerse !== -1) {
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
    var rumination = {
      'passage': {
        'version': "ESV",
        'snippet': $scope.verses[0].content,
        'first': {
          'book': $scope.bookName,
          'abbreviation': capitalize($scope.book),
          'chapter': parseInt($scope.chapter, 10),
          'verse': $scope.firstVerse
        },
        'last': {
          'book': $scope.bookName,
          'abbreviation': capitalize($scope.book),
          'chapter': parseInt($scope.chapter, 10),
          'verse': $scope.lastVerse
        }
      }
    };

    RuminationService.new($scope.consumer.apiKey, rumination).then(function() {
      $ionicHistory.clearCache();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $location.path('/tab/home');
    });
  };

  /**
   * Setup the controller
   *
   * @access private
   */
  function setup() {
    BibleAccessor.getVerses($scope.damId, $scope.book, $scope.chapter, function(verses) {
      $scope.verses = verses;
    });
    ConsumerService.getCurrent().then(function(consumer) {
      $scope.consumer = consumer;
    });
  }

  /**
   * Teardown the controller
   *
   * @access private
   */
  function teardown() {
  }

  /**
   * Capitalize the first letter of the word.
   *
   * @param  {String} string The string to modify
   * @return {String}        The modified string
   * @access public
   */
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}]);
