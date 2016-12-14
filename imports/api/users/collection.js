import { Meteor } from 'meteor/meteor';

Meteor.users.allow({
  remove(userId, party) {
    let currentUser;
    currentUser = Meteor.users.findOne({ _id: userId }, { fields: { 'admin': 1 } });
    return currentUser.admin;
  }
})
