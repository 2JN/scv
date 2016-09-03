import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './eliminarEmpleado.html';
import { Empleados } from '../../../api/empleados';

class eliminarEmpleadoCtrl {
  eliminar() {
    if(this.empleado) {
      Empleados.remove(this.empleado._id);
    }
  }
}

const name = 'eliminarEmpleado';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    bindings: {
      empleado: '<'
    },
    controllerAs: name,
    controller: eliminarEmpleadoCtrl
  });
