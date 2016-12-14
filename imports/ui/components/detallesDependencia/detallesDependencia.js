import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './detallesDependencia.html';
import { Dependencias } from '../../../api/dependencias';

class DetallesDependenciaCtrl {
  constructor($stateParams, $scope, $reactive, $state, $mdToast) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$state = $state;
    this.$mdToast = $mdToast;

    this.dependenciaId = $stateParams.dependenciaId;
    this.subscribe('dependencias');

    this.helpers({
      dependencia() {
        return Dependencias.findOne({
          _id: $stateParams.dependenciaId
        })
      }
    });
  }

  guardar() {
    if (this.dependenciaId === this.dependencia._id) {
      Dependencias.update({
        _id: this.dependencia._id
      }, {
        $set: {
          nombre: this.dependencia.nombre,
          municipio: this.dependencia.municipio,
          departamento: this.dependencia.departamento,
          encargado: this.dependencia.encargado,
          cargoEn: this.dependencia.cargoEn
        }
      }, (error) => {
        if (error) {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Error, dependencia no modificada...')
              .position('top right')
          );
        } else {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Dependencia modificada...')
              .position('top right')
          );
        }
      });
    } else {
      Dependencias.insert(this.dependencia, (error) => {
        if (error) {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Error, dependencia no modificada...')
              .position('top right')
          );
        } else {
          Dependencias.remove(this.dependenciaId);

          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Dependencia modificada...')
              .position('top right')
          );
        }
      });
    }

    this.$state.go('listadoDependencias');
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
    template: '<detalles-dependencia></detalles-dependencia>',
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
