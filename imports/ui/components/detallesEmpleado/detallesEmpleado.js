import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './detallesEmpleado.html';

class DetallesEmpleadoCtrl {
  constructor($stateParams) {
    'ngInject';

    this.empleadoId = $stateParams.empleadoId;
  }
}

const name = 'detallesEmpleado';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: DetallesEmpleadoCtrl
  })
    .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('detallesEmpleado', {
    url: '/empleados/:empleadoId',
    template: '<detalles-empleado></detalles-empleado>'
  });
}
