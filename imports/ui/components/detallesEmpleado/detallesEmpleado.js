import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './detallesEmpleado.html';
import { Empleados } from '../../../api/empleados';

class DetallesEmpleadoCtrl {
  constructor($stateParams, $scope, $reactive, $state) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);
    this.subscribe('empleados');

    this.empleadoId = $stateParams.empleadoId;

    this.helpers({
      empleado() {
        return Empleados.findOne({
          _id: $stateParams.empleadoId
        })
      }
    });
  }

  guardar() {
    if (this.empleadoId === this.empleado._id){
      Empleados.update({
        _id: this.empleado._id
      }, {
        $set: {
          pnombre: this.empleado.pnombre,
          snombre: this.empleado.snombre,
          papellido: this.empleado.papellido,
          sapellido: this.empleado.sapellido,
          dependencia_id: this.empleado.dependencia_id,
          cargo: this.empleado.cargo,
          renglon: this.empleado.renglon,
          sueldoMensual: this.empleado.sueldoMensual,
        }
      });
    } else {
      Empleados.insert(this.empleado, (error) => {
        if (error) {
          console.log('Oops, actualización no realizada');
        } else {
          console.log('Hecho!');
        }
      });
      Empleados.remove(this.empleadoId);
    }

    this.$state.go('listadoEmpleados');
  }
}

const name = 'detallesEmpleado';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: DetallesEmpleadoCtrl
  })
    .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('detallesEmpleado', {
    url: '/empleados/:empleadoId',
    template: '<detalles-empleado></detalles-empleado>',
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
