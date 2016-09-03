import angular from 'angular';
import angularMeteor from 'angular-meteor';

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
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: NuevoEmpleadoCtrl
  });
