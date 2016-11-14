import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Vehiculos } from './collection';

if (Meteor.isServer) {
  Meteor.publish('vehiculos', function(options, searchString) {

    const selector = {};

    if (typeof searchString === 'string' && searchString.length) {
      selector._id =  {
        $regex: `.*${searchString}.*`,
        $options: 'i'
      };
    }

    Counts.publish(this, 'numberOfVehiculos', Vehiculos.find(selector), {
      noReady: true
    });

    return Vehiculos.find(selector, options);
  });
}
