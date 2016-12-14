import { Mongo } from 'meteor/mongo';

export const Empleados = new Mongo.Collection('empleados');

/**
*TODO: Implementar validación de datos de administrador
*/
Empleados.allow({
  insert(userId, empleado) {
    return userId;
  },

  update(userId, empleado, fields, modifier) {
    return userId;
  },

  remove(userId, empleado) {
    return userId
  }
});
