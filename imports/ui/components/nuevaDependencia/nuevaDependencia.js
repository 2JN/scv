import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './nuevaDependencia.html';
import { Dependencias } from '../../../api/dependencias';

class NuevaDependenciaCtrl {
  constructor($mdToast) {
    this.$mdToast = $mdToast;
    this.dependencia = {};
    this.dependencia.nombramiento = 0;
  }

  ingresar() {
    Dependencias.insert(this.dependencia, (error) => {
      if (error) {
        this.$mdToast.show(
          this.$mdToast.simple()
            .textContent('Error, dependencia no agregada...')
            .position('top right')
        );
      } else {
        this.$mdToast.show(
          this.$mdToast.simple()
            .textContent('Dependencia agregada')
            .position('top right')
        );

        this.reset();
      }
    });
  }

  reset() {
    this.dependencia = {};
    this.dependencia.nombramiento = 0;
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
    template: '<nueva-dependencia></nueva-dependencia>',
    resolve: {
      currentUser: ($q) => {
        var deferred = $q.defer();

        Meteor.autorun(function() {
          if(!Meteor.loggingIn()) {
            if(!Meteor.user().admin) {
              deferred.reject('PERMISSION_REQUIRED');
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
