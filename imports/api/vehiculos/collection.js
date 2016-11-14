import { Mongo } from 'meteor/mongo';

export const Vehiculos = new Mongo.Collection('vehiculos');

Vehiculos.allow({
  insert(userId, vehiculo) {
    return userId;
  },

  update(userId, vehiculo, fields, modifier) {
    return userId;
  },

  remove(userId, vehiculo) {
    return userId;
  }
})
