import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './eliminarDependencia.html';
import { Dependencias } from '../../../api/dependencias';

class EliminarDependenciaCtrl {
  eliminar() {
    if(this.dependencia) {
      Dependencias.remove(this.dependencia._id);
    }
  }
}

const name = 'eliminarDependencia';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    bindings: {
      dependencia: '<'
    },
    controllerAs: name,
    controller: EliminarDependenciaCtrl
  });
