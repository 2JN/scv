import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './listadoNombramientos.html';
import { Nombramientos } from '../../../api/nombramientos';
import { name as NombramientoPDF } from '../nombramientoPDF/nombramientoPDF';

class ListadoNombramientosCtrl {
  constructor($scope, $reactive, $state) {
    $scope.viewModel(this);

    this.perPage = 15;
    this.page = 1;
    this.sort = {
      name: 1
    };

    this.subscribe('nombramientos', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }]);

    this.helpers({
      nombramientos() {
        return Nombramientos.find({});
      },

      nombramientosCount() {
        return Counts.get('numberOfNombramientos');
      }
    });
  }

  pageChanged(newPage) {
    this.page = newPage;
  }
}

const name = 'listadoNombramientos';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  NombramientoPDF
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: ListadoNombramientosCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('listadoNombramientos', {
    url: '/listado-nombramientos',
    template: '<listado-nombramientos></listado-nombramientos>',
    resolve: {
      currentUser($q) {
        if(Meteor.userId()) {
          return $q.resolve();
        } else {
          return $q.reject('PERMISSION_REQUIRED');
        }
      }
    }
  });
}
