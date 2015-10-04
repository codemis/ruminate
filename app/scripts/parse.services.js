'use strict';
/*global Parse */
angular.module('parse.services', [])

/**
 * A service for initializing parse
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
.factory('ParseService', ['ParseUser', function(ParseUser) {
  /**
   * The object for the parse service
   *
   * @type {Object}
   */
  var parseServiceObject = {};

  /**
   * Initialize Parse
   *
   * @param  {String} appId         The Parse Application Id
   * @param  {String} javascriptKey The Parse Javascript Key
   *
   * @return {Promise} A promise to login the user
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  parseServiceObject.initialize = function(appId, javascriptKey) {
    Parse.initialize(appId, javascriptKey);
    return ParseUser.createAndLogin();
  };

  return parseServiceObject;
}])
/**
 * A Service for handling ParseUser's model
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
.factory('ParseUser', ['$localStorage', function($localStorage) {
  /**
   * The parseUser Object that will be returned
   *
   * @type {Object}
   */
  var parseUserObject = {};

  /**
   * Create a GUID for the username
   *
   * @return {String} The username
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  function createUsername() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0;
      var v = (c === 'x') ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
  /**
   * Create a Random password to the set length
   *
   * @param  {Integer} length The length of the password
   *
   * @return {String}         The new password
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  function createPassword(length) {
    var charset = 'abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var password = '';
    for (var i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }
  /**
   * Create the user if it does not exist, and log them in
   *
   * @return {Promise} A promise to login or sign up
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  parseUserObject.createAndLogin = function() {
    var userData = $localStorage.getObject('parse_user');
    if (Object.keys(userData).length === 0) {
      var user = new Parse.User();
      var username = createUsername().toString();
      var password = createPassword(12).toString();
      /**
       * create and login
       */
      user.set('username', username);
      user.set('password', password);

      return user.signUp(null, {
        success: function() {
          $localStorage.setObject('parse_user', {username: username, password: password});
        },
        error: function(user, error) {
          console.log('Unable to sign up:  ' + error.code + ' ' + error.message);
        }
      });
    } else {
      console.log('I am a user.');
      return Parse.User.logIn(userData.username, userData.password, {
        success: function() {
        },
        error: function(user, error) {
          console.log('Unable to login:  ' + error.code + ' ' + error.message);
        }
      });
    }
  };

  return parseUserObject;
}])

.factory('ParseReflection', [ function() {
  
  /**
   * The parseReflection Object that will be returned
   *
   * @type {Object}
   */
  var parseReflectionObject = {};
  
   //var Mapper = Parse.Object.extend("mapper");
   //var a_mapper = new Mapper();
   //a_mapper.set("userPointer", Parse.User.current());
   //a_mapper.save();
   
   //var Reflection = Parse.Object.extend("reflection");
   
   //var a_reflection = new Reflection();
   //a_reflection.set("userPointer", Parse.User.current());
   //a_reflection.save();

    /**
   * Create the user if it does not exist, and log them in
   *
   * @return {Promise} A promise to create a reflection object.
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  parseReflectionObject.create = function() {

	  
	//Extend the native Parse.Object class.
    var Reflection = Parse.Object.extend("Reflection");

    //Instantiate an object of the ListItem class
    var reflection = new Reflection();

    //listItem is now the object that we want to save, so we assign the properties that we want on it.
    reflection.set("userPointer", Parse.User.current());

    //We call the save method, and pass in success and failure callback functions.
    reflection.save();
	  
    };

  return parseReflectionObject;


}])

.factory('ParsePassage', [function() {
  /**
   * The parsePassage Object that will be returned
   *
   * @type {Object}
   */
  var parsePassageObject = {};
  
  /**
   *  The result when executing a query will be stored in result.
   *
   * @type {Array}
   */
  parsePassageObject.result = [];
  
  /**
   * Create the passage if it does not exist
   *
   * @param {string} book:  The book to insert
   *
   * @param {int} chapter:  The chapter to insert
   *
   * @param {int} firstVerse:  The verse in which the passage starts
   *
   * @param {int} lastVerse:  The verse in which the passage ends
   *
   * @param {string} snippet:  The text of the passage starting from the first verse of a chapter in a book and ending with the last verse of a chapter in the same book.
   *
   * @param {Pointer} reflection:  The reflection in which the passage is related to.
   *
   * @return {Promise} A promise to create a passage object.
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  parsePassageObject.create = function(book, chapter, firstVerse, lastVerse, snippet, reflection) {

    var Passage = Parse.Object.extend("Passage");

    //Instantiate an object of the ListItem class
    var passage = new Passage();

    //listItem is now the object that we want to save, so we assign the properties that we want on it.
    passage.set("book", book);
	passage.set("chapter", chapter);
	passage.set("firstVerse", firstVerse);
	passage.set("lastVerse", lastVerse);
	passage.set("snippet", snippet);
	passage.set("reflection", reflection);
	

    //We call the save method, and pass in success and failure callback functions.
    passage.save();
	  
    };
	
	/**
	 * Retrieves an existing passage from the Parse database
	 *
	 * @param {string} snippetSearchText:  The snippet to query for.
	 *
	 * @return {Promise} A promise to return a passage object.
	 *
	 */
  parsePassageObject.query = function(snippetSearchText) {
	    var Passage = Parse.Object.extend("Passage");
		
		
		
		var query = new Parse.Query(Passage);
		
		query.startsWith("snippet", snippetSearchText);
		
		query.find(
		{
			success: function (passages)  {
                for (var ctr = 0; ctr < passages.length; ctr++)
                {
                    var passage = passages[ctr];
					var resultToStore = {};
					resultToStore.book = passage.get("book");
					resultToStore.chapter = passage.get("chapter");
					resultToStore.firstVerse = passage.get("firstVerse");
					resultToStore.lastVerse = passage.get("lastVerse");
					resultToStore.snippet = passage.get("snippet");
					resultToStore.reflection = passage.get("reflection");
					
					parsePassageObject.result.push(resultToStore);
                }				
			},
			failure:  function (object, error) {  
				
			}
		});
		
		
	};

  return parsePassageObject;


}])


.factory('ParseQuestion', [function() {
  /**
   * The parseQuestion Object that will be returned
   *
   * @type {Object}
   */
  var parseQuestionObject = {};
  
  /**
   *  The result when executing a query will be stored in result.
   *
   * @type {Array}
   */
  parseQuestionObject.result = [];


	/**
	 * Retrieves an existing question from the Parse database
	 *
	 * @param {string} questionType:  The question type to query for.
	 *
	 * @return {Promise} A promise to return a question object.
	 *
	 */  
  parseQuestionObject.query = function(questionType) {
	    var Question = Parse.Object.extend("Question");
		
		var query = new Parse.Query(Question);
		
		query.startsWith("questionType", questionType);
		
		query.find(
		{
			success: function (questions)  {
                for (var ctr = 0; ctr < questions.length; ctr++)
                {
                    var question = questions[ctr];
					var resultToStore = {};
					resultToStore.questionText = question.get("questionText");
					resultToStore.questionType = question.get("questionType");
					parseQuestionObject.result.push(resultToStore);
                }				
			},
			failure:  function (object, error) {  
				
			}
		});
		
		
	};

  return parseQuestionObject;


}])

//.factory('ParseResponse', ;

//pointer to question, answer as string

.factory('ParseResponse', [function() {
  /**
   * The parseResponse Object that will be returned
   *
   * @type {Object}
   */
  var parseResponseObject = {};
  
  /**
   *  The result when executing a query will be stored in result.
   *
   * @type {Array}
   */
  
  parseResponseObject.result = [];
  
  /**
   * Create the response if it does not exist
   *
   * @param {Pointer} questionAsked:  A reference to the question that was asked.
   *
   * @param {string} answer:  An answer to the question that was asked.
   *
   * @return {Promise} A promise to create a response object.
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  parseResponseObject.create = function(questionAsked, answer) {

    var Response = Parse.Object.extend("Response");

    //Instantiate an object of the ListItem class
    var response = new Response();

    //listItem is now the object that we want to save, so we assign the properties that we want on it.
	response.set("question", questionAsked);
    response.set("answer", answer);	

    //We call the save method, and pass in success and failure callback functions.
    response.save();
	  
    };
	
	/**
	 * Retrieves an existing response from the Parse database
	 *
	 * @param {string} answerSearchText:  The response to query for.
	 *
	 * @param {Pointer} reflection:  The reflection to query for.
	 *
	 * @return {Promise} A promise to return a response object.
	 *
	 */
  parseResponseObject.query = function(reflection, answerSearchText) {
	    var Response = Parse.Object.extend("Response");
		
		var query = new Parse.Query(Response);
		
		query.startsWith("answer", answerSearchText);
		query.equalTo("reflection", reflection);
		
		query.find(
		{
			success: function (responses)  {
                for (var ctr = 0; ctr < responses.length; ctr++)
                {
                    var response = responses[ctr];
					var resultToStore = {};
					resultToStore.question = response.get("question");
					resultToStore.answer = response.get("answer");
					parseResponseObject.result.push(resultToStore);
                }				
			},
			failure:  function (object, error) {  
				
			}
		});
		
		
	};


	/**
	 * Updates an existing response from the Parse database
	 *
	 * @param {Pointer} reflection:  The reflection to query for.
	 *
	 * @param {Pointer}  questionAsked:  The question to query for.
	 *
	 * @param {string}  answer:  The answer for use with updating an existing response
	 *
	 * @return {Promise} A promise to return a response object.
	 *
	 */
	
  parseResponseObject.update = function(reflection, questionAsked, answer) {
	    var Response = Parse.Object.extend("Response");
		
		var query = new Parse.Query(Response);
		
		query.equalTo("reflection", reflection);
		query.equalTo("questionAsked", questionAsked);
		
		query.find(
		{
			success: function (responses)  {
			    //There really should be only one response result.
                for (var ctr = 0; ctr < responses.length; ctr++)
                {
                    var response = responses[ctr];
					response.set("answer", answer);
					response.save();
                }				
			},
			failure:  function (object, error) {  
				
			}
		});
        		
    };

  return parsePassageObject;


}])
