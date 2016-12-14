import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import template from './auth.html';
import { name as Login } from '../login/login';

class AuthCtrl {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('users');

    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },

      currentUser() {
        return Meteor.user();
      }
    });
  }

  logout() {
    Accounts.logout();
  }
}

const name = 'auth';

export default angular.module(name, [
  angularMeteor,
  Login
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: AuthCtrl
  });
