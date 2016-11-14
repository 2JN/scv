import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './nuevoVehiculoI.html';
import { Vehiculos } from '../../../api/vehiculos'

class NuevoVehiculoICtrl {
  constructor($scope, $reactive, $mdToast) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$mdToast = $mdToast;
    this.vehiculoi = {};
    this.vehiculoi.institucion = true;
  }

  guardar() {
    Vehiculos.insert(this.vehiculoi, (error) => {
      if (error) {
        this.$mdToast.show(
          this.$mdToast.simple()
            .textContent('Error, vehiculo no agregado...')
            .position('top right')
        );
      } else {
        this.$mdToast.show(
          this.$mdToast.simple()
            .textContent('Vehiculo agregado...')
            .position('top right')
        );

        this.reset();
      }
    });
  }

  reset() {
    this.vehiculoi = {};
    this.vehiculoi.institucion = true;
  }
}

const name = 'nuevoVehiculoI';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: NuevoVehiculoICtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('nuevoVehiculoI', {
    url: '/nuevo-vehiculo-i',
    template: '<nuevo-vehiculo-i></nuevo-vehiculo-i>',
    resolve: {
      currentUser: ($q) => {
        var deferred = $q.defer();

        Meteor.autorun(function() {
          if(!Meteor.loggingIn()) {
            if(!Meteor.user().admin) {
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
