import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Nombramientos } from './collection';

if (Meteor.isServer) {
  Meteor.publish('nombramientos', function(options, searchString) {

    let user = Meteor.users.findOne({_id: this.userId});

    // Select only comisiones that belongs to the user
    const selector = {
      $and: [{
        "datos_empleado.user": user.username
      }, {
        "datos_empleado.user": {$exists:true}
      }]
    };

    if (typeof searchString === 'string' && searchString.length) {
      selector._id = {
        $regex: `.*${searchString}.*`,
        $options: 'i'
      };
    }

    Counts.publish(this, 'numberOfNombramientos', Nombramientos.find(selector), {
      noReady: true
    });

    return Nombramientos.find(selector, options);
  });

  Meteor.publish('nombramientosAdm', function(dependencia, options,
    searchString) {

    let user = Meteor.users.findOne({_id: this.userId});

    if (typeof searchString === 'string' && searchString.length) {
      selector._id = {
        $regex: `.*${searchString}.*`,
        $options: 'i'
      };
    }

    Counts.publish(this, 'numberOfNombramientos', Nombramientos.find({
      'datos_dependencia._id': dependencia
    }), {
      noReady: true
    });

    if (user.admin) {
      return Nombramientos.find({
        'datos_dependencia._id': dependencia
      }, options);
    }
  });
}
