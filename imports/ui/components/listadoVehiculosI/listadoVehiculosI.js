import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './listadoVehiculosI.html';
import { Vehiculos } from '../../../api/vehiculos';
import { name as Ordenar } from '../ordenar/ordenar';
import { name as EliminarVehiculo } from '../eliminarVehiculo/eliminarVehiculo';

class ListadoVehiculosCtrl {
  constructor($scope, $reactive) {
    $reactive(this).attach($scope);

    this.perPage = 15;
    this.page = 1;
    this.sort = {
      _id: 1
    };
    this.searchText = '';

    this.subscribe('vehiculosI', () => [
      {
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText')
    ]);

    this.helpers({
      vehiculos() {
        return Vehiculos.find({}, {
          sort: this.getReactively('sort')
        });
      },

      vehiculosCount() {
        return Counts.get('numberOfVehiculos');
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

const name = 'listadoVehiculosI';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  Ordenar,
  EliminarVehiculo
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: ListadoVehiculosCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('listadoVehiculosI', {
    url: '/listado-vehiculos-i',
    template: '<listado-vehiculos-i></listado-vehiculos-i>',
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
