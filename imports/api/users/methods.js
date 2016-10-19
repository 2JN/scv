import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

function resetPass(usuarioId, password) {
  if(Meteor.user().admin) {
    if(Meteor.isServer) {
      Accounts.setPassword(usuarioId, password);
    }
  }
}

function newUser(credentials) {
  Accounts.createUser(credentials);
}

function removeUser(username) {
  Meteor.users.remove({username: username});
}

Meteor.methods({
  resetPass,
  newUser,
  removeUser
})
