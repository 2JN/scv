import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  Meteor.publish('users', function(userId) {
    return Meteor.users.find({_id: userId}, {
      fields: {
        emails: 1,
        admin: 1
      }
    });
  });
}
