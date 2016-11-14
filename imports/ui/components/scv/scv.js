import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';

import template from './scv.html';
import { name as Navigation } from '../navigation/navigation';
import { name as NuevoEmpleado } from '../nuevoEmpleado/nuevoEmpleado';
import { name as ListadoEmpleados } from '../listadoEmpleados/listadoEmpleados';
import { name as DetallesEmpleado } from '../detallesEmpleado/detallesEmpleado';
import { name as NuevaDependencia } from '../nuevaDependencia/nuevaDependencia';
import { name as ListadoDependencias } from '../listadoDependencias/listadoDependencias';
import { name as DetallesDependencia } from '../detallesDependencia/detallesDependencia';
import { name as NuevoVehiculoI } from '../nuevoVehiculoI/nuevoVehiculosI';
import { name as ListadoVehiculosI } from '../listadoVehiculosI/listadoVehiculosI';
import { name as DetallesVehiculoI } from '../detallesVehiculoI/detallesVehiculoI';
import { name as NombramientoComision } from '../nombramientoComision/nombramientoComision';
import { name as ListadoNombramientos } from '../listadoNombramientos/listadoNombramientos';
import { name as DetallesNombramiento } from '../detallesNombramiento/detallesNombramiento';
import { name as LsNombramientosAdm } from '../lsNombramientosAdm/lsNombramientosAdm';
import { name as Planillas } from '../planillas/planillas';
import { name as Liquidacion } from '../liquidacion/liquidacion';
import { name as ChangePass } from '../changePass/changePass';
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
  NuevoVehiculoI,
  ListadoVehiculosI,
  DetallesVehiculoI,
  NombramientoComision,
  ListadoNombramientos,
  DetallesNombramiento,
  LsNombramientosAdm,
  Planillas,
  Liquidacion,
  ChangePass,
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

function config($locationProvider, $urlRouterProvider, $mdIconProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/nombramiento-comision');

  const iconPath = '/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/';

  $mdIconProvider
    .iconSet('action', iconPath + 'svg-sprite-action.svg')
    .iconSet('navigation', iconPath + 'svg-sprite-navigation.svg');
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
