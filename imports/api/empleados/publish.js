import { Meteor } from 'meteor/meteor';

import { Empleados } from './collection';

if (Meteor.isServer) {
  Meteor.publish('empleados', function() {

    /**
    * TODO: Implementar solo para administradores
    */
    return Empleados.find({});
  });
}
