import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './nuevoVehiculoP.html';
import { Vehiculos } from '../../../api/vehiculos';

class NuevoVehiculoPCtrl {
  constructor($scope, $reactive, $mdToast) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$mdToast = $mdToast;
    this.vehiculop = {};
    this.vehiculop.user = Meteor.userId();
  }

  guardar() {
    Vehiculos.insert(this.vehiculop, (error) => {
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
    this.vehiculop = {};
    this.vehiculop.user = Meteor.userId();
  }
}

const name = 'nuevoVehiculoP';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: NuevoVehiculoPCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('nuevoVehiculoP', {
    url: '/nuevo-vehiculo-p',
    template: '<nuevo-vehiculo-p></nuevo-vehiculo-p>',
    resolve: {
      currentUser($q) {
        if(Meteor.userId()) {
          return $q.resolve();
        } else {
          return $q.reject('PERMISSION_REQUIRED');
        }
      }
    }
  })
}
