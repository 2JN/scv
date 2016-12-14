import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { counts } from 'meteor/tmeasday:publish-counts';

import template from './listadoVehiculosP.html';
import { Vehiculos } from '../../../api/vehiculos';
import { name as Ordenar } from '../ordenar/ordenar';
import { name as EliminarVehiculo } from '../eliminarVehiculo/eliminarVehiculo';

class ListadoVehiculosPCtrl {
  constructor($scope, $reactive) {
    $reactive(this).attach($scope);

    this.perPage = 15;
    this.page = 1;
    this.sort = {
      _id: 1
    };
    this.searchText = '';

    this.subscribe('vehiculosP', () => [
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

const name = 'listadoVehiculosP';

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
    controller: ListadoVehiculosPCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('listadoVehiculosP', {
    url: '/listado-vehiculos-p',
    template: '<listado-vehiculos-p></listado-vehiculos-p>',
    resolve: {
      currentUser($q) {
        if (Meteor.userId()) {
          return $q.resolve();
        } else {
          return $q.reject('PERMISSION_REQUIRED');
        }
      }
    }
  })
}
