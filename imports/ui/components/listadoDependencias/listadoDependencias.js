import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './listadoDependencias.html';
import { Dependencias } from '../../../api/dependencias';

class ListadoDependenciasCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.helpers({
      dependencias() {
        return Dependencias.find({});
      }
    })
  }
}

const name = 'listadoDependencias';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: ListadoDependenciasCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('listadoDependencias', {
    url: '/modificar-dependencias',
    template: '<listado-dependencias></listado-dependencias>'
  });
}
