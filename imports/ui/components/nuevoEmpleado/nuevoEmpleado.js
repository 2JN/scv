import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './nuevoEmpleado.html';
import { Empleados } from '../../../api/empleados';

class NuevoEmpleadoCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.empleado = {};

    this.subscribe('users', () => {
      return [Meteor.userId()];
    });

    this.helpers({
      usuario() {
        return Meteor.user();
      }
    });
  }

  ingresar() {
    Empleados.insert(this.empleado);
    this.reset();
  }

  reset() {
    this.empleado = {}
  }
}

const name = 'nuevoEmpleado';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: NuevoEmpleadoCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('agregarEmpleado', {
    url: '/agregar-empleado',
    template: '<nuevo-empleado></nuevo-empleado>',
    resolve: {
      adminUser($q, $meteor) {
        /**
        *TODO: Implementar auntenticacion por rutas
        */
        if (true) {
          return $q.resolve();
        } else {
          return $q.reject();
        }
      }
    }
  });
}
