import { Mongo } from 'meteor/mongo';

export const Nombramientos = new Mongo.Collection('nombramientos');

Nombramientos.allow({
  insert(userId, nombramiento) {
    return userId;
  },

  update(userId, nombramiento, fields, modifier) {
    return userId;
  },

  remove(userId, dependencia) {
    return userId;
  }
});
