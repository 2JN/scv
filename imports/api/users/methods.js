import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

function resetPass(usuarioId, password) {
  if(Meteor.user().admin) {
    if(Meteor.isServer) {
      Accounts.setPassword(usuarioId, password);
    }
  }
}

Meteor.methods({
  resetPass
})
