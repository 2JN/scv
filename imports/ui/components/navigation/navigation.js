import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './navigation.html';

class NavigationCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.subscribe('users', () => {
      return [Meteor.userId()]
    });

    this.helpers({
      usuario() {
        return Meteor.user();
      }
    })
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
