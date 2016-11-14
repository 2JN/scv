import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import '../imports/api/empleados';
import '../imports/api/dependencias';
import '../imports/api/vehiculos';
import '../imports/api/nombramientos';
import '../imports/api/users';

Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    Accounts.createUser({username: 'admin', password: '0jud!c!al'});
    let uId = Meteor.users.findOne({username: 'admin'})._id;
    Meteor.users.update({_id: uId}, {
      $set: { admin: true }
    })
  }
});
