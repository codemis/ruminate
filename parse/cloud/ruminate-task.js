/**
 * The cloud code background task for running the ruminate tasks
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
Parse.Cloud.job('ruminateTask', function(request, status) {
  Parse.Push.send({
    channels: ['user-2d979933-b64a-4bbb-992a-efec4f34e3bc'],
    data: {
      alert: 'I am sending you message from the cloud :)'
    }
  },
  {
    success: function() {
      status.success('Parse.Push.send completed successfully.');
    },
    error: function() {
      status.error('Uh oh, something went wrong with Parse.Push.send.');
    }
  });
  // var query = new Parse.Query('RuminateTask');
  // query.each(function(task) {
  //   task.set('completed', true);
  //   return task.save();
  // }).then(function() {
  //   status.success('RuminateTask completed successfully.');
  // }, function(error) {
  //   status.error('Uh oh, something went wrong.');
  // });
});