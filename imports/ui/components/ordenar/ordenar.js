import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './ordenar.html';

class OrdenarCtrl {
  constructor() {
    this.changed();
  }

  changed() {
    this.onChange({
      sort: {
        [this.property]: parseInt(this.order)
      }
    });
  }
}

const name = 'ordenar';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    bindings: {
      onChange: '&',
      property: '@',
      order: '@'
    },
    controllerAs: name,
    controller: OrdenarCtrl
  });
