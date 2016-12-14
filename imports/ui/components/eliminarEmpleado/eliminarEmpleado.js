import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './eliminarEmpleado.html';
import { Empleados } from '../../../api/empleados';

class EliminarEmpleadoCtrl {
  eliminar() {
    if(this.empleado) {
      Empleados.remove(this.empleado._id);
      Meteor.call('removeUser', this.empleado.user);
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
    controller: EliminarEmpleadoCtrl
  });
