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

function newEnc(credentials) {
  Accounts.createUser(credentials);
  Meteor.users.update({'emails.address': credentials.email}, {
    $set: { encargado: true }
  });
}

Meteor.methods({
  resetPass,
  newUser,
  removeUser,
  newEnc
})
