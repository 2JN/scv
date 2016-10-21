import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './listadoNombramientos.html';
import { Nombramientos } from '../../../api/nombramientos';

class ListadoNombramientosCtrl {
  constructor($scope, $reactive, $state) {
    $scope.viewModel(this);

    this.subscribe('nombramientos');

    this.helpers({
      nombramientos() {
        return Nombramientos.find({});
      }
    });
  }
}

const name = 'listadoNombramientos';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: ListadoNombramientosCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('listadoNombramientos', {
    url: '/listado-nombramientos',
    template: '<listado-nombramientos></listado-nombramientos>',
    resolve: {
      currentUser($q) {
        if(Meteor.userId()) {
          return $q.resolve();
        } else {
          return $q.reject('PERMISSION_REQUIRED');
        }
      }
    }
  });
}
