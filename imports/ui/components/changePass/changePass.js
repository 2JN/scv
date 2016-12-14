import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './changePass.html';

class ChangePassCtrl {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);
    this.admin = Meteor.user().admin;

  }

  changePassword() {
    if(this.confirm === this.password) {
      if(Meteor.user().admin) {
        Meteor.call('resetPass', Meteor.userId(), this.password);
      }
    }
  }
}

const name = 'changePass';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: ChangePassCtrl
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('changePass', {
    url: '/change-password',
    template: '<change-pass></change-pass>',
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
