import angular from 'angular';
import angularMeteor from 'angular-meteor';

import scv from '../imports/ui/components/scv/scv';

angular.module('root', [
  angularMeteor,
  scv.name
]);
