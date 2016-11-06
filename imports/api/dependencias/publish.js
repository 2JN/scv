import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Dependencias } from './collection';

if (Meteor.isServer) {
  Meteor.publish('dependencias', function(options) {

    let user = Meteor.users.findOne({_id: this.userId});

    Counts.publish(this, 'numberOfDependencias', Dependencias.find(), {
      noReady: true
    });

    if (user.admin) {
      return Dependencias.find({}, options);
    }
  });
}
