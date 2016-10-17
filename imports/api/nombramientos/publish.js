import { Meteor } from 'meteor/meteor';

import { Nombramientos } from './collection';

if (Meteor.isServer) {
  Meteor.publish('nombramientos', function() {

    /**
    * TODO: Implementar solo para administradores
    */

    return Nombramientos.find({});
  });
}
