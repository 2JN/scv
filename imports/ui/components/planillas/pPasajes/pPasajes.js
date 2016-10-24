import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './pPasajes.html';
import { Nombramientos } from '../../../../api/nombramientos';

class PPasajesCtrl {
  constructor($scope, $reactive, $state) {
    'ngInject';

    $reactive(this).attach($scope);

    this.total = 0;

    this.pasajes = {
      facturas: [
        {
          fecha: new Date,
          nfactura: '',
          lugarSalida: {municipio: '', departamento: ''},
          lugarLlegada: {municipio: '', departamento: ''},
          valorPasaje: 0
        }
      ]
    }

    this.autorun(function() {
      if (this.getReactively('this.nombramiento.pasajes')) {
        this.pasajes = this.nombramiento.pasajes;
      }
    });

    this.autorun(function() {
      let size = this.getReactively('this.pasajes.facturas.length');

      this.total = 0;
      for(let i = 0; i < size; i++) {
        if(this.getReactively(`this.pasajes.facturas[${i}].valorPasaje`)) {
          this.total += +this.pasajes.facturas[i].valorPasaje;
        }
      }
    });
  }

  guardar() {
    Nombramientos.update({
      _id: this.nombramiento._id
    }, {
      $set: {
        pasajes: angular.copy(this.pasajes)
      }
    }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Hecho!');
      }
    });
  }

  addPasaje() {
    this.pasajes.facturas.push({
      fecha: new Date,
      nfactura: '',
      lugarSalida: {municipio: '', departamento: ''},
      lugarLlegada: {municipio: '', departamento: ''},
      valorPasaje: 0
    });
  }

  removePasaje(index) {
    this.pasajes.facturas.splice(index, 1);
  }
}

const name = 'pPasajes';

export default angular.module(name, [
  angularMeteor,
])
  .component(name, {
    templateUrl: template,
    bindings: {
      nombramiento: '='
    },
    controllerAs: name,
    controller: PPasajesCtrl
  });
