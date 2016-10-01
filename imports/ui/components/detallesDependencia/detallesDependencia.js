import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './detallesDependencia.html';
import { Dependencias } from '../../../api/dependencias';

class DetallesDependenciaCtrl {
  constructor($stateParams, $scope, $reactive, $state) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);

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
          encargado: this.dependencia.encargado
        }
      });
    } else {
      Dependencias.insert(this.dependencia, (error) => {
        if (error) {
          console.log('Oops, actualización no realizada');
        } else {
          console.log('Hecho!');
        }
      });
      Dependencias.remove(this.dependenciaId);
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
    template: '<detalles-dependencia></detalles-dependencia>'
  });
}
