import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export function validar() {
  return 'cadena';
}

Meteor.methods({
  validar
})
