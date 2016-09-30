import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './nuevoEmpleado.html';
import { Empleados } from '../../../api/empleados';

class NuevoEmpleadoCtrl {
  constructor() {
    this.empleado = {};
  }

  ingresar() {
    Empleados.insert(this.empleado);
    this.reset()
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
    template: '<nuevo-empleado></nuevo-empleado>'
  });
}
