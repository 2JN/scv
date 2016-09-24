import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './scv.html';
import { name as Navigation } from '../navigation/navigation';
import { name as NuevoEmpleado } from '../nuevoEmpleado/nuevoEmpleado.js';
import { name as ListadoEmpleados } from '../listadoEmpleados/listadoEmpleados';
import { name as NuevaDependencia } from '../nuevaDependencia/nuevaDependencia';
import { name as ListadoDependencias } from '../listadoDependencias/listadoDependencias';

class SCVCtrl {
  constructor() {}
}

export default angular.module('scv', [
  angularMeteor,
  uiRouter,
  Navigation,
  ListadoEmpleados,
  NuevoEmpleado,
  NuevaDependencia,
  ListadoDependencias
])
  .component('scv', {
    templateUrl: template,
    controllerAs: 'scv',
    controller: SCVCtrl
  })
  .config(config);

function config($locationProvider, $urlRouterProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/comision-nombramiento');
}
