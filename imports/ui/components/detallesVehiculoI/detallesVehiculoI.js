import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './detallesVehiculoI.html'
import { Vehiculos } from '../../../api/vehiculos';

class DetallesVehiculoICtrl {
  constructor($stateParams, $scope, $reactive, $state, $mdToast) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$state = $state;
    this.$mdToast = $mdToast;

    this.vehiculoId = $stateParams.vehiculoId;

    this.subscribe('vehiculosI');

    this.helpers({
      vehiculo() {
        return Vehiculos.findOne({
          _id: $stateParams.vehiculoId
        })
      }
    });
  }

  guardar() {
    if (this.vehiculoId === this.vehiculo._id) {
      Vehiculos.update({
        _id: this.vehiculo._id
      }, {
        $set: {
          tipo: this.vehiculo.tipo,
	        marca: this.vehiculo.marca,
          motor: this.vehiculo.motor,
	        modelo: this.vehiculo.modelo,
	        chasis: this.vehiculo.chasis,
	        combustible: this.vehiculo.combustible,
	        uso: this.vehiculo.uso,
	        color: this.vehiculo.color,
	        cilindros: this.vehiculo.cilindros
        }
      }, (error) => {
        if (error) {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Error, vehiculo no modificada...')
              .position('top right')
          );
        } else {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Vehiculo modificado...')
              .position('top right')
          );
        }
      });
    } else {
      this.vehiculo.institucion = true;

      Vehiculos.insert(this.vehiculo, (error) => {
        if (error) {
          this.$mdToas.show(
            this.$mdToast.simple()
              .textContent('Error, vehiculo no modificado')
              .position('top right')
          );
        } else {
          Vehiculos.remove(this.vehiculoId);

          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Vehiculo modificado...')
              .position('top right')
          );
        }
      });
    }

    this.$state.go('listadoVehiculosI');
  }
}

const name = 'detallesVehiculoI';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: DetallesVehiculoICtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('detallesVehiculoI', {
    url: '/vehiculo/:vehiculoId',
    template: '<detalles-vehiculo-i></detalles-vehiculo-i>',
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
