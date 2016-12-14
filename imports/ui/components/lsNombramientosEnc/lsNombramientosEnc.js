import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './lsNombramientosEnc.html';
import { Nombramientos } from '../../../api/nombramientos';
import { name as Ordenar } from '../ordenar/ordenar';
import { name as NombramientoPDF } from '../nombramientoPDF/nombramientoPDF';

class LsNombramientosEncCtrl {
  constructor($scope, $reactive) {
    $scope.viewModel(this);

    this.showNombramientos = 0;

    this.perPage = 15;
    this.page = 1;
    this.sort = {
      nombramiento: 1
    };
    this.searchText = '';

    this.subscribe('nombramientosEnc', () => [
      Meteor.user().emails[0].address,
      this.getReactively('showNombramientos'),
      {
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText')
    ]);

    this.helpers({
      nombramientos() {
        return Nombramientos.find({}, {
          sort: this.getReactively('sort')
        });
      },

      nombramientosCount() {
        return Counts.get('numberOfNombramientos');
      }
    });
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(sort) {
    this.sort = sort;
  }
}

const name = 'lsNombramientosEnc';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  Ordenar,
  NombramientoPDF
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: LsNombramientosEncCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('lsNombramientosEnc', {
    url: '/ls-nombramientos-enc',
    template: '<ls-nombramientos-enc></ls-nombramientos-enc>',
    resolve: {
      currentUser: ($q) => {
        var deferred = $q.defer();

        Meteor.autorun(function() {
          if (!Meteor.loggingIn()) {
            if (!Meteor.user().encargado) {
              deferred.reject('PERMISSION_REQUIRED');
            } else {
              deferred.resolve();
            }
          }
        });

        return deferred.promise;
      }
    }
  });
}
