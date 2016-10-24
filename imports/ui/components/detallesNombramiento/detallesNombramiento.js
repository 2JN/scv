import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './detallesNombramiento.html';
import { Nombramientos } from '../../../api/nombramientos';

class DetallesNombramientoCtrl {
  constructor($stateParams, $scope, $reactive, $state) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$state = $state;

    this.subscribe('nombramientos');

    this.nombramientoId = $stateParams.nombramientoId;

    this.helpers({
      nombramiento() {
        return Nombramientos.findOne({_id: this.nombramientoId})
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
    Nombramientos.update({
      _id: this.nombramientoId
    }, {
      $set: {
        datos_empleado: this.nombramiento.datos_empleado,
        datos_dependencia: this.nombramiento.datos_dependencia,
        datos_comision: angular.copy(this.nombramiento.datos_comision)
      }
    }, (error) => {
      if (error) {
        console.log('Oops, no se pudieron guardar los cambios...');
      } else {
        console.log('Hecho!');
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
