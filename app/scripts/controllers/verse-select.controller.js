'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('VerseSelectController', ['$scope', '$timeout', '$stateParams', '$location', '$ionicHistory', '$ionicPlatform', '$ionicLoading', '$cordovaNetwork', 'BibleAccessor', 'onDeviceService', 'ConsumerService', 'RuminationService',
  function($scope, $timeout, $stateParams, $location, $ionicHistory, $ionicPlatform, $ionicLoading, $cordovaNetwork, BibleAccessor, onDeviceService, ConsumerService, RuminationService) {

  // These contain the information that will be added to the database
  $scope.chapter = 1;
  $scope.book = {};
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
    //If a person selects highlights only one verse...the $scope.firstVerse variable needs adjustment
    //At the time of commenting, if only one verse is selected the $scope.lastVerse variable
    //is assigned, while the $scope.firstVerse remains unset (i.e. it is equal to -1)
    showLoading();
    if ($scope.lastVerse > -1 && $scope.firstVerse === -1) {
        $scope.firstVerse = $scope.lastVerse;
    }
    var snippet = getSnippet();
    var rumination = {
      'passage': {
        'version': "ESV",
        'snippet': snippet,
        'first': {
          'book': capitalize($scope.book.name),
          'abbreviation': $scope.book.id,
          'chapter': parseInt($scope.chapter, 10),
          'verse': $scope.firstVerse
        },
        'last': {
          'book': capitalize($scope.book.name),
          'abbreviation': $scope.book.id,
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
      /**
       * Delay because the API is not ready.
       *
       * @todo remove this delay.
       */
      $timeout(function() {
        hideLoading();
        $location.path('/app/home');
      }, 1000);
    });
  };

  /**
   * Setup the controller
   *
   * @access private
   */
  function setup() {
    var id = $stateParams.bookId;
    $scope.chapter = $stateParams.chapter;
    showLoading();
    BibleAccessor.findBook(id).then(function(book) {
      $scope.book = book;
      return BibleAccessor.getVerses(id, $scope.chapter);
    }).then(function(verses) {
      $scope.verses = verses;
      return ConsumerService.getCurrent();
    }).then(function(consumer) {
      $scope.consumer = consumer;
      hideLoading();
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
   * Show the loading screen
   *
   * @return {Void}
   * @access private
   */
  function showLoading() {
    $ionicLoading.show({ template: '<p>Loading...</p><ion-spinner icon="ios"></ion-spinner>' });
  }

  /**
   * Hide the Loading
   *
   * @return {Void}
   * @access private
   */
  function hideLoading() {
    $ionicLoading.hide();
  }
  /**
   * Get the snippet based on the selected passage
   *
   * @return {String} The truncated string
   */
  function getSnippet() {
    var snippet = $scope.verses[$scope.firstVerse - 1].content;
    /**
     * trim the string to the maximum length
     */
     var trimmedString = snippet.substr(0, 150);
    /**
     * re-trim if we are in the middle of a word
     */
    return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
  }

  /**
   * Capitalize the first letter of the word.
   *
   * @param  {String} string The string to modify
   * @return {String}        The modified string
   * @access public
   */
  function capitalize(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    } else {
      return string;
    }
  }
}]);
