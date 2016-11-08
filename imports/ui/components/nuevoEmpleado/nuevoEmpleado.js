import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import template from './nuevoEmpleado.html';
import { Empleados } from '../../../api/empleados';

class NuevoEmpleadoCtrl {
  constructor($scope, $reactive, $mdToast) {
    'ngInject';

    $reactive(this).attach($scope);

    this.empleado = {};
    this.$mdToast = $mdToast;

    this.credentials = {
      user: '',
      password: ''
    };

    this.error = '';
  }

  ingresar() {
    this.empleado.user = this.credentials.username;
    Empleados.insert(this.empleado,  (error) => {
      if (error) {
        this.$mdToast.show(
          this.$mdToast.simple()
            .textContent('Oops, empleado no agregada...')
            .position('top right')
        );
      } else {
        this.$mdToast.show(
          this.$mdToast.simple()
            .textContent('Empleado agregado')
            .position('top right')
        );

        Meteor.call('newUser', this.credentials);
        this.reset();
      }
    });
  }

  reset() {
    this.empleado = {};
    this.credentials = {};
  }
}

const name = 'nuevoEmpleado';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: NuevoEmpleadoCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('agregarEmpleado', {
    url: '/agregar-empleado',
    template: '<nuevo-empleado></nuevo-empleado>',
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
