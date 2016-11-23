import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Vehiculos } from './collection';

if (Meteor.isServer) {
  Meteor.publish('vehiculosI', function(options, searchString) {

    const selector = {institucion: true};

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

  Meteor.publish('vehiculosP', function(options, searchString) {

    const selector = {user: this.userId};

    if (typeof searchString === 'string' && searchString.length) {
      selector._id = {
        $regex: `.*${searchString}.*`,
        $options: 'i'
      };
    }

    Counts.publish(this, 'numberOfVehiculos', Vehiculos.find(selector), {
      noReady: true
    });

    return Vehiculos.find(selector, options);
  })
}
