'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('SettingsController', function($scope) {

$scope.minuteSelection = [{value:5,text:'5 minutes',selected:false}, {value:10,text:'10 minutes',selected:true}, {value:20,text:'20 minutes',selected:false}, {value:30,text:'30 minutes',selected:false}, {value:60,text:'1 hour',selected:false}, {value:120,text:'2 hours',selected:false}, {value:240,text:'4 hours',selected:false}];

});
