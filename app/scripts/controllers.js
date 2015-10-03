'use strict';

angular.module('starter.controllers', [])

.controller('HomeController', function($scope) {



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
.controller('SettingsController', function($scope) {});