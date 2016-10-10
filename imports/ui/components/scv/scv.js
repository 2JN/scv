import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';

import template from './scv.html';
import { name as Navigation } from '../navigation/navigation';
import { name as NuevoEmpleado } from '../nuevoEmpleado/nuevoEmpleado.js';
import { name as ListadoEmpleados } from '../listadoEmpleados/listadoEmpleados';
import { name as DetallesEmpleado } from '../detallesEmpleado/detallesEmpleado';
import { name as NuevaDependencia } from '../nuevaDependencia/nuevaDependencia';
import { name as ListadoDependencias } from '../listadoDependencias/listadoDependencias';
import { name as DetallesDependencia } from '../detallesDependencia/detallesDependencia';
import { name as Auth } from '../auth/auth';

class SCVCtrl {
  constructor($scope, $reactive, $mdSidenav) {
    $reactive(this).attach($scope);
    this.$mdSidenav = $mdSidenav;
  }

  toggleLeft() {
    this.$mdSidenav('left').toggle();
  }
}

export default angular.module('scv', [
  angularMeteor,
  ngMaterial,
  uiRouter,
  Navigation,
  ListadoEmpleados,
  DetallesEmpleado,
  NuevoEmpleado,
  NuevaDependencia,
  ListadoDependencias,
  DetallesDependencia,
  Auth,
  'accounts.ui'
])
  .component('scv', {
    templateUrl: template,
    controllerAs: 'scv',
    controller: SCVCtrl
  })
  .config(config)
  .run(run);

function config($locationProvider, $urlRouterProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/comision-nombramiento');
}

function run($rootScope, $state) {
  'ngInject';

  $rootScope.$on('$stateChangeError',
    (event, toState, toParams, fromState, fromParams, error) => {
      if(error === 'PERMISSION_REQUIRED') {
        $state.go('login');
      }
    }
  );
}
