import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './planillas.html';
import { Nombramientos } from '../../../api/nombramientos';
import { name as PPasajes } from './pPasajes/pPasajes';

class PlanillasCtrl {
  constructor($stateParams, $scope, $reactive, $state) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('nombramientos');

    this.nombramientoId = $stateParams.nombramientoId;

    this.helpers({
      nombramiento() {
        return Nombramientos.findOne({_id: this.nombramientoId})
      }
    })
  }
}

const name = 'planillas';

export default angular.module(name, [
  angularMeteor,
  PPasajes
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: PlanillasCtrl
  })
    .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('planillas', {
    url: '/planillas/:nombramientoId',
    template: '<planillas></planillas>',
    resolve: {
      currentUser($q) {
        if(Meteor.userId()) {
          return $q.resolve()
        } else {
          return $q.reject('PERMISSION_REQUIRED');
        }
      }
    }
  });
}
