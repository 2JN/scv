import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './nuevaDependencia.html';
import { Dependencias } from '../../../api/dependencias';

class NuevaDependenciaCtrl {
  constructor() {
    this.dependencia = {};
  }

  ingresar() {
    Dependencias.insert(this.dependencia, (error) => {
      if (error) {
        console.log('Oops, dependencia no agregada...');
      } else {
        console.log('Hecho!');
      }
    });
    this.reset()
  }

  reset() {
    this.dependencia = {}
  }
}

const name = 'nuevaDependencia';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: NuevaDependenciaCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('agregarDependencia', {
    url: '/agregar-dependencia',
    template: '<nueva-dependencia></nueva-dependencia>'
  })
}
