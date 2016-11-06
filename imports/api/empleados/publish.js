import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Empleados } from './collection';

if (Meteor.isServer) {
  Meteor.publish('empleados', function(options) {

    let user = Meteor.users.findOne({_id: this.userId});

    Counts.publish(this, 'numberOfEmpleados', Empleados.find(), {
      noReady: true
    });

    if(user.admin) {
      return Empleados.find({}, options);
    }
  });
}
