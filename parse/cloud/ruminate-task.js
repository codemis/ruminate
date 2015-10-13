/**
 * The cloud code background task for running the ruminate tasks
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
Parse.Cloud.job('ruminateTask', function(request, status) {
  /**
   * Get the upcoming tasks
   */
  var rightnow = new Date();
  var query = new Parse.Query('RuminateTask');
  var todaysDate = new Date(rightnow.getTime());
  var midnight = new Date();
  midnight.setHours(0);
  midnight.setMinutes(0);
  query.lessThanOrEqualTo('sendAt', todaysDate);
  query.equalTo('completed', false);
  query.each(function(task) {
    /**
     * Add a new question to reflect on.  And generate a message to send
     * 1.  Check for all the complete questions today
     */
    var responseQuery = new Parse.Query('Response');
    responseQuery.greaterThanOrEqualTo('createdAt', midnight);
    responseQuery.lessThanOrEqualTo('createdAt', new Date());
    responseQuery.equalTo('reflection', task.get('reflection'));
    var keys = [];
    responseQuery.each(function(response) {
      /**
       * 2. Create an array of keys for all questions already asked
       */
      keys.push(response.get('question').id);
    }).then(function() {
      /**
       * 3. Find a question
       */
      var questionQuery = new Parse.Query('Question');
      questionQuery.notContainedIn('objectId', keys);
      questionQuery.limit(1);
      questionQuery.find({
        success: function(question) {
          /**
           * Insert the new question into the Response table
           */    
          var message = 'New Question: ' + question.get('questionText');
          var newResponseObject = Parse.Object.extend('Response');
          var newResponse = new newResponseObject();
          newResponse.set('question', question);
          newResponse.set('answer', '');
          newResponse.set('reflection', task.get('reflection'));
          newResponse.save();
          /**
           * Push the message
           */
          Parse.Push.send(
            {
                channels: [task.get('broadcastChannel')],
                data: { alert: message, sound: 'default' }
            },
            {
              success: function() {
                status.success('Parse.Push.send completed successfully.');
              },
              error: function() {
                status.error('Uh oh, something went wrong with Parse.Push.send.');
              }
            }
          );
        },
        error: function() {
          console.log('Unable to find a question.');
        }
      });
    });
    /**
     * Mark Task complete
     */
    task.set('completed', true);
    return task.save();
  }).then(function() {
    status.success('RuminateTask completed successfully.');
  }, function(error) {
    status.error('Uh oh, something went wrong.');
  });
});