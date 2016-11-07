import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Empleados } from './collection';

if (Meteor.isServer) {
  Meteor.publish('empleados', function(options, searchString) {

    let user = Meteor.users.findOne({_id: this.userId});

    const selector = {};

    if (typeof searchString === 'string' && searchString.length) {
      selector._id = {
        $regex: `.*${searchString}.*`,
        $options: 'i'
      };
    }

    Counts.publish(this, 'numberOfEmpleados', Empleados.find(selector), {
      noReady: true
    });

    if(user.admin) {
      return Empleados.find(selector, options);
    }
  });
}
