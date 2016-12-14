import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Empleados } from './collection';

if (Meteor.isServer) {
  Meteor.publish('empleados', function(options, searchString) {

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

    return Empleados.find(selector, options);
  });
}
