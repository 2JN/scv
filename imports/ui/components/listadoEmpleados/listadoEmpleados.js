import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './listadoEmpleados.html';
import { Empleados } from '../../../api/empleados';
import { name as eliminarEmpleado } from '../eliminarEmpleado/eliminarEmpleado'

class ListadoEmpleadosCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.perPage = 15;
    this.page = 1;
    this.sort = {
      name: 1
    };

    this.subscribe('empleados', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }]);

    this.helpers({
      empleados() {
        return Empleados.find({}, {
          sort: this.getReactively('sort')
        });
      },

      empleadosCount() {
        return Counts.get('numberOfEmpleados');
      }
    });
  }

  pageChanged(newPage) {
    this.page = newPage;
  }
}

const name = 'listadoEmpleados';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  eliminarEmpleado
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: ListadoEmpleadosCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('listadoEmpleados', {
    url: '/modificar-empelados',
    template: '<listado-empleados></listado-empleados>',
    resolve: {
      currentUser: ($q) => {
        var deferred = $q.defer();

        Meteor.autorun(function() {
          if(!Meteor.loggingIn()) {
            if(!Meteor.user().admin) {
              deferred.reject('PERMISSION_REQUIRED');
            } else {
              deferred.resolve();
            }
          }
        });

        return deferred.promise;
      }
    }
  });
}
