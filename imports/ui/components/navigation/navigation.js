import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

const name = 'navigation';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    controllerAs: name
  });
