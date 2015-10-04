'use strict';

angular.module('dbp.services', [])

.factory('BibleAccessor', ['$http', 'DBP_ENV', function($http, env) {
	var serviceObject = {};

	var versions = {
		'KJV':['1ET'],
		'ESV':['2ET']
	}
	var version = 'ESV';

	var default_dam_id = 'ENG' + version;
	var dam_other      = versions[version][0];
	serviceObject.versionNames = {'ESV':"English Standard Version"};
	serviceObject.bookNames = {}
	serviceObject.bookDamMap = {}

	serviceObject.updateBookMaps = function() {
		serviceObject.getBookList(function(data) {
			for (var i = 0; i < data.length; i++) {
				var book = data[i];

				serviceObject.bookDamMap[book.id] = book.dam_id;
				serviceObject.bookNames[book.id]  = book.name;
			};
		})
	}
	// $http.get( 'http://dbt.io/library/version', { params: { v:2, key:env.apiKey, code:version } })
	// .then(function(response) {
	// 	var data = response.data;
	// 	serviceObject.versionNames[data[0].version_code] = data[0].version_name.trim();
	// })

	serviceObject.getBookList = function(callback) {
		$http.get( 'http://dbt.io/library/book', { params: { v:2, key:env.apiKey, dam_id:default_dam_id } } )
		.then(function(response) {
			var data = response.data;
			var parsed = [];
			for (var i = 0; i < data.length; i++) {
				var raw = data[i];
				var newObj = {};
				newObj.id = raw.book_id;
				newObj.name = raw.book_name;
				newObj.chapters = raw.chapters.split(',');
				newObj.dam_id = raw.dam_id;
				parsed.push(newObj);
			};
			callback(parsed);
		});
	};

	serviceObject.getVerses = function(dam_id, book_id, chapter_id, callback) {

		$http.get( 'http://dbt.io/text/verse', { params: { v:2, key:env.apiKey, dam_id:dam_id + dam_other, book_id:book_id, chapter_id:chapter_id }})
		.then(function(response) {
			var data = response.data;
			var parsed = [];

			for (var i = 0; i < data.length; i++) {
				var raw = data[i];
				var newObj = {};
				newObj.number = raw.verse_id;
				newObj.content = raw.verse_text;
				parsed.push(newObj);
			};

			callback(parsed);
		});

	}

	return serviceObject;
}]);