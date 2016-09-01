import angular from 'angular';
import angularMeteor from 'angular-meteor';

import scvList from '../imports/ui/components/scv/scv.js';

angular.module('root', [
  angularMeteor,
  scvList.name
]);
