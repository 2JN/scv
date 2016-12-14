import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  Meteor.publish('users', function() {
    return Meteor.users.find({}, {
      fields: {
        encargado: 1,
        username: 1,
        emails: 1,
        admin: 1,
        _id: 1
      }
    });
  });
}
