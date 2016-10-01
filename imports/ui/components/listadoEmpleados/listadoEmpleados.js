import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './listadoEmpleados.html';
import { Empleados } from '../../../api/empleados';
import { name as eliminarEmpleado } from '../eliminarEmpleado/eliminarEmpleado'

class ListadoEmpleadosCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.subscribe('empleados');

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
  uiRouter,
  eliminarEmpleado
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: ListadoEmpleadosCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('listadoEmpleados', {
    url: '/modificar-empelados',
    template: '<listado-empleados></listado-empleados>'
  });
}
