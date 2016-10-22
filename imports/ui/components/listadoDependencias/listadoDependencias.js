import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './listadoDependencias.html';
import { Dependencias } from '../../../api/dependencias';
import { name as EliminarDependencia } from '../eliminarDependencia/eliminarDependencia';

class ListadoDependenciasCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.subscribe('dependencias');

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
  uiRouter,
  EliminarDependencia
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
    template: '<listado-dependencias></listado-dependencias>',
    resolve: {
      currentUser: ($q) => {
        var deferred = $q.defer();

        Meteor.autorun(function() {
          if(!Meteor.loggingIn()) {
            if(!Meteor.user().admin) {
              deferred.reject('PERMISSION_REQUIRED')
            } else {
              deferred.resolve();
            }
          }
        });

        return deferred.promise;
      }
    }
  });
}
