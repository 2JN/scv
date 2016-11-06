import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './navigation.html';

class NavigationCtrl {
  constructor($scope, $mdSidenav) {
    $scope.viewModel(this);
    this.$mdSidenav = $mdSidenav;
    this.subscribe('users');

    this.helpers({
      usuario() {
        return Meteor.user();
      }
    })
  }

  toggleLeft() {
    this.$mdSidenav('left').close();
  }
}

const name = 'navigation';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: NavigationCtrl
  });
