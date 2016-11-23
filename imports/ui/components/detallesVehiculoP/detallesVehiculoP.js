import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './detallesVehiculoP.html';
import { Vehiculos } from '../../../api/vehiculos';

class DetallesVehiculoPCtrl {
  constructor($stateParams, $scope, $reactive, $state, $mdToast) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$state = $state;
    this.$mdToast = $mdToast;

    this.vehiculoId = $stateParams.vehiculoId;

    this.subscribe('vehiculosP');

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
      this.vehiculo.user = Meteor.userId();

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

    this.$state.go('listadoVehiculosP');
  }
}

const name = 'detallesVehiculoP';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: DetallesVehiculoPCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('detallesVehiculoP', {
    url: '/vehiculop/:vehiculoId',
    template: '<detalles-vehiculo-p></detalles-vehiculo-p>',
    resolve: {
      currentUser($q) {
        if(Meteor.userId()) {
          return $q.resolve()
        } else {
          return $$q.reject('PERMISSION_REQUIRED');
        }
      }
    }
  });
}
