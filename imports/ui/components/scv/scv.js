import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './scv.html';
import listadoEmpleados from '../listadoEmpleados/listadoEmpleados.js'
import nuevoEmpleado from '../nuevoEmpleado/nuevoEmpleado.js';

class SCVCtrl {
  constructor() {
    this.word = 'hello';
  }
}

export default angular.module('scv', [
  angularMeteor,
  uiRouter,
  listadoEmpleados.name,
  nuevoEmpleado.name
])
  .component('scv', {
    templateUrl: template,
    controllerAs: 'scv',
    controller: SCVCtrl
  });
