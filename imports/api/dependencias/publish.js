import { Meteor } from 'meteor/meteor';

import { Dependencias } from './collection';

if (Meteor.isServer) {
  Meteor.publish('dependencias', function() {

    /**
    * TODO: Implementar solo para administradores
    */

    return Dependencias.find({});
  });
}
