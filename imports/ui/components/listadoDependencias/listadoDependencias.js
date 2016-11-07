import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './listadoDependencias.html';
import { Dependencias } from '../../../api/dependencias';
import { name as Ordenar } from '../ordenar/ordenar';
import { name as EliminarDependencia } from '../eliminarDependencia/eliminarDependencia';

class ListadoDependenciasCtrl {
  constructor($scope, $reactive) {
    $reactive(this).attach($scope);

    this.perPage = 15;
    this.page = 1;
    this.sort = {
      nombre: 1
    };
    this.searchText = '';

    this.subscribe('dependencias', () => [
      {
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText')
    ]);

    this.helpers({
      dependencias() {
        return Dependencias.find({}, {
          sort: this.getReactively('sort')
        });
      },

      dependenciasCount() {
        return Counts.get('numberOfDependencias');
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

const name = 'listadoDependencias';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  Ordenar,
  EliminarDependencia
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: ListadoDependenciasCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('listadoDependencias', {
    url: '/modificar-dependencias',
    template: '<listado-dependencias></listado-dependencias>',
    resolve: {
      currentUser: ($q) => {
        var deferred = $q.defer();

        Meteor.autorun(function() {
          if(!Meteor.loggingIn()) {
            if(!Meteor.user().admin) {
              deferred.reject('PERMISSION_REQUIRED')
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
