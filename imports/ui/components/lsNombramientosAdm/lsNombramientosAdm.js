import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './lsNombramientosAdm.html';
import { Nombramientos } from '../../../api/nombramientos';
import { Dependencias } from '../../../api/dependencias';
import { name as Ordernar } from '../ordenar/ordenar';
import { name as Ordenar } from '../ordenar/ordenar';
import { name as NombramientoPDF } from '../nombramientoPDF/nombramientoPDF';

class LsNombramientosAdmCtrl {
  constructor($scope, $reactive) {
    $scope.viewModel(this);

    this.perPage = 15;
    this.page = 1;
    this.sort = {
      _id: 1
    };
    this.searchText = '';

    this.subscribe('nombramientosAdm', () => [
      this.getReactively('dependencia'), 
      {
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText')
    ]);

    this.subscribe('dependencias');

    this.helpers({
      nombramientos() {
        return Nombramientos.find({});
      },

      nombramientosCount() {
        return Counts.get('numberOfNombramientos');
      },

      dependencias() {
        return Dependencias.find({});
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

const name = 'lsNombramientosAdm';

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
    controller: LsNombramientosAdmCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('lsNombramientosAdm', {
    url: '/ls-nombramientos-adm',
    template: '<ls-nombramientos-adm></ls-nombramientos-adm>',
    resolve: {
      currentUser: ($q) => {
        var deferred = $q.defer();

        Meteor.autorun(function() {
          if (!Meteor.loggingIn()) {
            if (!Meteor.user().admin) {
              deferred.reject('PERMISSION_REQUIRED');
            } else {
              deferred.resolve();
            }
          }
        });

        return deferred.promise;
      }
    }
  })
}
