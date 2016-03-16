'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:SearchCtrl
 * @description
 * # SearchCtrl
 */
angular.module('Divvy')
  .controller('SearchCtrl', function($scope, FirebaseUrl, $ionicLoading, $state, $rootScope) {

    console.log('in search');
    $scope.terms = {};
    $scope.data = {};

    $scope.search = function (terms) {
      console.log(terms.keywords);
      $scope.data = {};
      if(terms.keywords){
        doSearch('firebase', 'book', buildQuery(terms.keywords, terms.words));
      }
    };
    $scope.bookview = function (id) {
      $state.go('tab.bookview', { isbn: id });
    };

    // display search results
    function doSearch(index, type, query) {
      $rootScope.$broadcast('loading:show');
      var ref = new Firebase(FirebaseUrl+'/search');
      var key = ref.child('request').push({ index: index, type: type, query: query }).key();
      console.log('search', key, { index: index, type: type, query: query });
      ref.child('response/'+key).on('value', showResults);
    }

    function showResults(snap) {
      if( snap.val() === null ) { return; } // wait until we get data
      $scope.data = snap.val();
      snap.ref().off('value', showResults);
      snap.ref().remove();

      console.log('result', snap.key(), snap.val());
      $rootScope.$broadcast('loading:hide');
    }

    function buildQuery(term, words) {
      // See this tut for more query options:
      // http://okfnlabs.org/blog/2013/07/01/elasticsearch-query-tutorial.html#match-all--find-everything
      return {
        'query_string': { query: makeTerm(term, words) }
      };
    }

    function makeTerm(term, matchWholeWords) {
      if( !matchWholeWords ) {
        if( !term.match(/^\*/) ) { term = '*'+term; }
        if( !term.match(/\*$/) ) { term += '*'; }
      }
      return term;
    }

  });
