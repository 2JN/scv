import { Meteor } from 'meteor/meteor';

import { Dependencias } from './collection';

if (Meteor.isServer) {
  Meteor.publish('dependencias', function() {

    let user = Meteor.users.findOne({_id: this.userId});

    if (user.admin) {
      return Dependencias.find({});
    }
  });
}
