import { Meteor } from 'meteor/meteor';

import { Empleados } from './collection';

if (Meteor.isServer) {
  Meteor.publish('empleados', function() {

    let user = Meteor.users.findOne({_id: this.userId});

    if(user.admin) {
      return Empleados.find({});
    }
  });
}
