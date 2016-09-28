import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './detallesDependencia.html';

class DetallesDependenciaCtrl {
  constructor($stateParams) {
    'ngInject';

    this.dependenciaId = $stateParams.dependenciaId;
  }
}

const name = 'detallesDependencia';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: DetallesDependenciaCtrl
  })
    .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('detallesDependencia', {
    url: '/dependencia/:dependenciaId',
    template: '<detalles-dependencia></detalles-dependencia>'
  });
}
