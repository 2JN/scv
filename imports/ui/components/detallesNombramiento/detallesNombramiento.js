import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './detallesNombramiento.html';
import { Nombramientos } from '../../../api/nombramientos';
import { Vehiculos } from '../../../api/vehiculos';

class DetallesNombramientoCtrl {
  constructor($stateParams, $scope, $reactive, $state, $mdToast) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$state = $state;
    this.$mdToast = $mdToast;

    this.subscribe('nombramientos');
    this.subscribe('vehiculosI');

    this.nombramientoId = $stateParams.nombramientoId;

    this.helpers({
      nombramiento() {
        return Nombramientos.findOne({_id: this.nombramientoId})
      },

      vehiculosI() {
        return Vehiculos.find({
          _id: {
            $regex: `.*${this.getReactively('nombramiento.datos_comision.placasVI')}.*`,
            $options: 'i'
          }, institucion: true
        }, {
          fields: {_id: 1}
        });
      }
    })
  }

  addLugar() {
    this.nombramiento.datos_comision.lugares.push({
      dependencia: '',
      municipio: '',
      departamento: ''
    });
  }

  removeLugar(index) {
    this.nombramiento.datos_comision.lugares.splice(index, 1);
  }

  guardar() {
    let dc = angular.copy(this.nombramiento.datos_comision);
    dc.placasVI = this.placas._id;

    Nombramientos.update({
      _id: this.nombramientoId
    }, {
      $set: {
        datos_empleado: this.nombramiento.datos_empleado,
        datos_dependencia: this.nombramiento.datos_dependencia,
        datos_comision: dc
      }
    }, (error) => {
      if (error) {
        this.$mdToast.show(
          this.$mdToast.simple()
            .textContent('No se pudo modificar el nombramiento...')
            .position('top right')
        );
      } else {
        this.$mdToast.show(
          this.$mdToast.simple()
            .textContent('Nombramiento modificado')
            .position('top right')
        );
      }
    });

    this.$state.go('listadoNombramientos');
  }
}

const name = 'detallesNombramiento';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: DetallesNombramientoCtrl
  })
    .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('detallesNombramiento', {
    url: '/nombramiento/:nombramientoId',
    template: '<detalles-nombramiento></detalles-nombramiento>',
    resolve: {
      currentUser($q) {
        if(Meteor.userId()) {
          return $q.resolve()
        } else {
          return $$q.reject('PERMISSION_REQUIRED');
        }
      }
    }
  });
}
