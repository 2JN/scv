import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './eliminarVehiculo.html';
import { Vehiculos } from '../../../api/vehiculos';

class EliminarVehiculosCtrl {
  eliminar() {
    if (this.vehiculo) {
      Vehiculos.remove(this.vehiculo._id);
    }
  }
}

const name = 'eliminarVehiculo';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    bindings: {
      vehiculo: '<'
    },
    controllerAs: name,
    controller: EliminarVehiculosCtrl
  });
