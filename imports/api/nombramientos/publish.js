import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Nombramientos } from './collection';

if (Meteor.isServer) {
  Meteor.publish('nombramientos', function(options) {

    let user = Meteor.users.findOne({_id: this.userId});

    // Select only comisiones that belongs to the user
    const selector = {
      $and: [{
        "datos_empleado.user": user.username
      }, {
        "datos_empleado.user": {$exists:true}
      }]
    };

    Counts.publish(this, 'numberOfNombramientos', Nombramientos.find(selector), {
      noReady: true
    });

    return Nombramientos.find(selector, options);
  });
}
