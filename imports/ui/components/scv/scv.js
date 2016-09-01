import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './scv.html';

class SCVCtrl {
  constructor() {
    this.word = 'hello';
  }
}

export default angular.module('scv', [
  angularMeteor,
])
  .component('scv', {
    templateUrl: template,
    controllerAs: 'scv',
    controller: SCVCtrl
  });
