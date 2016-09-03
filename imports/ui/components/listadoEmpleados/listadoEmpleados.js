import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './listadoEmpleados.html';
import { Empleados } from '../../../api/empleados';
import eliminarEmpleado from '../eliminarEmpleado/eliminarEmpleado'

class listadoEmpleadosCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.helpers({
      empleados() {
        return Empleados.find({});
      }
    })
  }
}

const name = 'listadoEmpleados';

export default angular.module(name, [
  angularMeteor,
  eliminarEmpleado.name
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: listadoEmpleadosCtrl
  });
