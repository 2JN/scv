import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import template from './nuevoEmpleado.html';
import { Empleados } from '../../../api/empleados';

class NuevoEmpleadoCtrl {
  constructor($scope, $reactive, $state) {
    'ngInject';

    $reactive(this).attach($scope);

    this.empleado = {};

    this.credentials = {
      user: '',
      password: ''
    };

    this.error = '';
  }

  ingresar() {
    this.empleado.user = this.credentials.username;
    Empleados.insert(this.empleado);
    this.register();
    this.reset();
  }

  reset() {
    this.empleado = {};
    this.credentials = {};
  }

  register() {
    Accounts.createUser(this.credentials,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
        } else {
          console.log('Usuario registrado');
        }
      })
    );
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
