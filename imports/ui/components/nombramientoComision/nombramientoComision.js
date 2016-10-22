import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './nombramientoComision.html';
import { Empleados } from '../../../api/empleados';
import { Dependencias } from '../../../api/dependencias';
import { Nombramientos } from '../../../api/nombramientos';

class NombramientoComisionCtrl {
  constructor($scope, $reactive, $state) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$state = $state;

    this.subscribe('dependencias');
    this.subscribe('empleados');
    this.subscribe('users');
    this.dependencia = {};
    this.comision = {};
    this.comision.fecha = new Date;

    this.comision.lugares = [
      {
        dependencia: '',
        municipio: '',
        departamento: ''
      }
    ];

    // get dates reactively

    this.comision.fechaI = new Date (
      this.comision.fecha.getFullYear(),
      this.comision.fecha.getMonth(),
      this.getReactively('this.comision.fecha').getDate() + 1
    );

    this.autorun( () => {
      this.minDate = new Date(
        this.comision.fecha.getFullYear(),
        this.comision.fecha.getMonth(),
        this.getReactively('this.comision.fecha').getDate() + 1
      );
    });

    this.autorun( () => {
      this.otherMinDate = new Date(
        this.comision.fechaI.getFullYear(),
        this.comision.fechaI.getMonth(),
        this.getReactively('this.comision.fechaI').getDate()
      );
    });

    this.helpers({
      datosUsuario() {
        return Empleados.findOne({ user: Meteor.user().username });
      }
    });
  }

  datosDependencia() {
    this.dependencia = Dependencias.findOne({ _id: this.datosUsuario.dependencia_id });
  }

  ingresar() {
    let noNombramiento = ++this.dependencia.nombramiento + "-" + this.comision.fecha.getFullYear();

    let datosComision = {
      _id: noNombramiento,
      datos_empleado: this.datosUsuario,
      datos_dependencia: this.dependencia,
      datos_comision: angular.copy(this.comision)
    }

    Nombramientos.insert(datosComision);
    this.actualizarDependencia();
  }

  reset() {
    this.dependencia = {},
    this.comision = {}
  }

  actualizarDependencia() {
    Dependencias.update({
      _id: this.dependencia._id
    }, {
      $set: { nombramiento: this.dependencia.nombramiento }
    });
  }

  addLugar() {
    this.comision.lugares.push({
      dependencia: '',
      municipio: '',
      departamento: ''
    });
  }

  removeLugar(index) {
    this.comision.lugares.splice(index, 1);
  }
}

const name = 'nombramientoComision';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: NombramientoComisionCtrl
  })
    .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('nombramientoComisison', {
    url: '/nombramiento-comision',
    template: '<nombramiento-comision></nombramiento-comision>',
    resolve: {
      currentUser: ($q) => {
        var deferred = $q.defer();

        Meteor.autorun(function() {
          if(!Meteor.loggingIn()) {
            if(!Meteor.user()) {
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
