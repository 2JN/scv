import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './aprobarComision.html';
import { Nombramientos } from '../../../api/nombramientos';

class AprobarComisionCtrl {
  aprobar() {
    if(this.comision) {
      Nombramientos.update({_id: this.comision._id},
        { $set: {aprobado: true} }
      );
    }
  }
}

const name = 'aprobarComision';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    bindings: {
      comision: '<'
    },
    controllerAs: name,
    controller: AprobarComisionCtrl
  });
