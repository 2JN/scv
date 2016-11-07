import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Dependencias } from './collection';

if (Meteor.isServer) {
  Meteor.publish('dependencias', function(options, searchString) {

    const selector = {};

    if (typeof searchString === 'string' && searchString.length) {
      selector._id = {
        $regex: `.*${searchString}.*`,
        $options: 'i'
      };
    }

    Counts.publish(this, 'numberOfDependencias', Dependencias.find(selector), {
      noReady: true
    });

    return Dependencias.find(selector, options);
  });
}
