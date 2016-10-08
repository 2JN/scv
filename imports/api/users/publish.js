import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  Meteor.publish('users', function() {
    return Meteor.users.find({}, {
      fields: {
        username: 1,
        emails: 1,
        admin: 1,
        _id: 1
      }
    });
  });
}
