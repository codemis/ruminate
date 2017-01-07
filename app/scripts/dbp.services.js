'use strict';
/**
 * This Service connects to the Digital Bible Platform to retrieve content from the Bible.
 */
angular.module('dbp.services', [])

/*jshint camelcase: false */
.factory('BibleAccessor', ['$http', '$q', '$log', 'DBP_ENV', function($http, $q, $log, env) {
  /**
   * The service object to return,
   *
   * @type {Object}
   * @access private
   */
  var serviceObject = {};
  /**
   * Versions of the Bible we support,
   *
   * @type {Object}
   * @access private
   */
  var versions = {
    'KJV':['1ET'],
    'ESV':['2ET']
  };
  /**
   * The default version of the Bible to use.
   *
   * @type {String}
   * @access private
   */
  var version = 'ESV';
  /**
   * The default DAM Id.
   *
   * @type {String}
   * @access private
   */
  var defaultDamId = 'ENG' + version;
  /**
   * The other DAM Id.
   *
   * @type {[type]}
   * @access private
   */
  var damOther = versions[version][0];
  /**
   * An array of the books of the Bible
   *
   * @type {Array}
   */
  var bibleBooks = [];
  /**
   * The version name of the selected Bible.
   *
   * @type {Object}
   */
  serviceObject.versionNames = {'ESV':"English Standard Version"};

  /**
   * Find a specific book of the Bible.
   *
   * @param  {String} id The given book id
   *
   * @return {Object}    The book of the Bible
   */
  serviceObject.findBook = function(id) {
    return this.getBooks().then(function() {
      var book = {};
      for (var i = 0; i < bibleBooks.length; i++) {
        if (bibleBooks[i].id === id) {
          book = bibleBooks[i];
          break;
        }
      }
      return book;
    });
  };

  /**
   * Setup the Book data for this class.
   *
   */
  serviceObject.getBooks = function() {
    var deferred = $q.defer();
    var params = {
      params: {
        v: 2,
        key: env.apiKey,
        dam_id: defaultDamId
      }
    };
    if (bibleBooks.length > 0) {
      deferred.resolve(bibleBooks);
    } else {
      $http.get( 'http://dbt.io/library/book', params)
      .then(function(response) {
        var data = response.data;
        if (data) {
          for (var i = 0; i < data.length; i++) {
            var book = {
              id: data[i].book_id,
              name: data[i].book_name,
              chapters: data[i].chapters.split(','),
              order: data[i].book_order,
              damId: data[i].dam_id
            };
            bibleBooks.push(book);
          }
          bibleBooks.sort(function(a, b) {
            return a.order - b.order;
          });
          deferred.resolve(bibleBooks);
        } else {
          $log.error('Unable to set the Book List.');
          deferred.reject([]);
        }
      }, function() {
        $log.error('Unable to set the Book List.');
        deferred.reject([]);
      });
    }
    return deferred.promise;
  };

  /**
   * Get the Bible verses for the given Book and chapter.
   *
   * @param  {String}   bookId    The book id of the Bible book
   * @param  {Integer}  chapterId The chapter to retrieve
   * @return {Array}              An array of verses for the given book.
   */
  serviceObject.getVerses = function(bookId, chapterId) {
    var deferred = $q.defer();
    this.findBook(bookId).then(function(book) {
      var params = {
        params: {
          v: 2,
          key: env.apiKey,
          dam_id: book.damId + damOther,
          book_id: bookId,
          chapter_id:chapterId
        }
      };
      $http.get( 'http://dbt.io/text/verse', params)
      .success(
        function(verses) {
          if (verses) {
            var parsed = [];
            for (var i = 0; i < verses.length; i++) {
              var content = verses[i];
              var verse = {};
              verse.number = content.verse_id;
              verse.content = content.verse_text;
              parsed.push(verse);
            }
            deferred.resolve(parsed);
          } else {
            $log.error('Unable to retrieve the verses.');
            deferred.reject([]);
          }
        }
      ).error(
        function() {
          $log.error('Unable to retrieve the verses.');
          deferred.reject([]);
        }
      );
    });
    return deferred.promise;
  };

  /**
   * Return this service object.
   */
  return serviceObject;
}]);
