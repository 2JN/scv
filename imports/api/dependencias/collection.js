import { Mongo } from 'meteor/mongo';

export const Dependencias = new Mongo.Collection('dependencias');

Dependencias.allow({
  insert(userId, dependencia) {
    return userId;
  },

  update(userId, depedencia, fields, modifier) {
    return userId;
  },

  remove(userId, dependencia) {
    return userId;
  }
});
