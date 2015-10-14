/**
 * The cloud code background task for running the ruminate tasks
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
var _ = require("underscore");

Parse.Cloud.job('ruminateTask', function(request, status) {
  Parse.Cloud.useMasterKey();
  /**
   * Get the upcoming tasks
   */
  getTasks()
    .then(function(tasks) {
      var promise = Parse.Promise.as();
      _.each(tasks, function(task) {
        console.log('Task: '+ task.get('description'));
        promise = promise
          .then(function() {
            return getCurrentResponses(task)
              .then(function(responses) {
                return getQuestionsAnswered(responses);
              })
              .then(function(keys) {
                console.log('Here are the keys: '+ keys.toString());
                return getARandomQuestion(keys);
              })
              .then(function(questions) {
                var question = questions[0];
                console.log('Random Question: '+question.get('questionText'));
                return saveNewResponse(task, question)
                  .then(function() {
                    return notifyUser(question.get('questionText'), task.get('broadcastChannel'));
                  });
              })
              .then(function() {
                task.set('completed', true);
                return task.save();
              });
          });
      });
      return promise;
    })
    .then(function() {
      console.log('RuminateTask completed successfully.');
      status.success('RuminateTask completed successfully.');
    }, function(error) {
      status.error('Uh oh, something went wrong.');
    });
});

var rightnow = new Date();
var midnight = new Date();
midnight.setHours(0);
midnight.setMinutes(0);
midnight.setSeconds(0);
var yesterdayMidnight = new Date(midnight - 1000*60*60*24);

/**
 * Get the upcoming task that need to be handled
 *
 * @return {Promise} A promise that results in an array of tasks
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
function getTasks() {
  console.log('getTasks()');
  var query = new Parse.Query('RuminateTask');
  query.lessThanOrEqualTo('sendAt', rightnow);
  query.equalTo('completed', false);
  return query.find();
};
/**
 * Get all the id's of questions already answered
 *
 * @param  {Array} responses An array of responses for a specific task
 *
 * @return {Array}           The id's of the answered questions
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
function getQuestionsAnswered(responses) {
  console.log('getQuestionsAnswered()');
  var keys = [];
  _.each(responses, function(response) {
    keys.push(response.get('question').id);
  });
  return keys;
};
/**
 * Get the responses for a task
 *
 * @param  {Object} task The task to use as reference
 *
 * @return {Promise}      The result of the find
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
function getCurrentResponses(task) {
  console.log('getCurrentResponses()');
  var query = new Parse.Query('Response');
  /**
   * Date is formatted incorrectly
   */
  query.greaterThanOrEqualTo('createdAt', yesterdayMidnight);
  query.equalTo('reflection', task.get('reflection'));
  return query.find();
};
/**
 * Get the next question to ask
 *
 * @param  {Array} answeredQuestionKeys An array of id's to exclude when getting the question
 *
 * @return {Promise}                    The find results
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
function getARandomQuestion(answeredQuestionKeys) {
  console.log('getARandomQuestion()');
  var query = new Parse.Query('Question');
  query.notContainedIn('objectId', answeredQuestionKeys);
  query.limit(1);
  return query.find();
};
/**
 * Save a new response with no answer so they can fill it out
 *
 * @param  {Object} task     The task associated with this request
 * @param  {Object} question The question to ask
 *
 * @return {Promise}          A promise to save the content
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
function saveNewResponse(task, question) {
  var newResponseObject = Parse.Object.extend('Response');
  var newResponse = new newResponseObject();
  newResponse.set('question', question);
  newResponse.set('answer', '');
  newResponse.set('reflection', task.get('reflection'));
  return newResponse.save();
};
/**
 * Notify the user of the new question
 *
 * @param  {String} question The question asked
 * @param  {String} channel  The channel to broadcast on
 *
 * @return {Void}
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
function notifyUser(question, channel) {
  Parse.Push.send(
    {
        channels: [channel],
        data: { alert: question, sound: 'default' }
    },
    {
      success: function() {
        console.log('Parse.Push.send completed successfully.');
      },
      error: function() {
        console.log('Uh oh, something went wrong with Parse.Push.send.');
      }
    }
  );
};