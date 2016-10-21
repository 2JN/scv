import { Meteor } from 'meteor/meteor';

import { Nombramientos } from './collection';

if (Meteor.isServer) {
  Meteor.publish('nombramientos', function() {

    let user = Meteor.users.findOne({_id: this.userId});

    // Select only comisiones that belongs to the user
    const selector = {
      $and: [{
        "datos_empleado.user": user.username
      }, {
        "datos_empleado.user": {$exists:true}
      }]
    };

    return Nombramientos.find(selector);
  });
}
