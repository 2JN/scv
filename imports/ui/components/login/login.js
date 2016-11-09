import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './login.html'

class LoginCtrl {
  constructor($scope, $reactive, $mdToast) {
    'ngInject';

    $reactive(this).attach($scope);
    this.$mdToast = $mdToast;

    this.credentials = {
      user: '',
      password: ''
    };

    this.error = '';
  }

  login() {
    Meteor.loginWithPassword(this.credentials.user, this.credentials.password,
      this.$bindToContext((err) => {
        if (err) {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Usuario o contraseña incorrectos...')
              .position('top right')
          );
        }
      })
    );
  }
}

const name = 'login';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: LoginCtrl
  })
    .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: '<login></login>'
  });
}
