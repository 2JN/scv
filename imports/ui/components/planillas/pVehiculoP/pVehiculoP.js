import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './pVehiculoP.html';
import { Nombramientos } from '../../../../api/nombramientos';
import vhcPPDF from './vehiculoPPDF';

class PVehiculoPCtrl {
  constructor($scope, $reactive, $state) {
    'ngInject';

    $reactive(this).attach($scope);

    this.total = 0;

    this.vehiculop = {
      kilometraje: [
        {
          fecha: new Date,
          lugarSalida: {municipio: '', departamento: ''},
          lugarLlegada: {municipio: '', departamento: ''},
          distancia: 0
        }
      ],

      facturas: [
        {
          fecha: new Date,
          numero: '',
          galones: '',
          proveedor: '',
          valor: 0
        }
      ],

      depreciacion: 1
    }

    this.autorun(function() {
      if (this.getReactively('this.nombramiento.vehiculop')) {
        this.vehiculop = this.nombramiento.vehiculop;
      }
    });

    this.autorun(function() {
      let sizek = this.getReactively('this.vehiculop.kilometraje.length');
      let sizef = this.getReactively('this.vehiculop.facturas.length');

      this.totalDistancia = 0;
      for(let i = 0; i < sizek; i++) {
        if(this.getReactively(`this.vehiculop.kilometraje[${i}].distancia`)) {
          this.totalDistancia += (+this.vehiculop.kilometraje[i].distancia);
        }
      }

      this.totalFacturas = 0;
      for(let i = 0; i < sizef; i++) {
        if(this.getReactively(`this.vehiculop.facturas[${i}].valor`)) {
          this.totalFacturas += +this.vehiculop.facturas[i].valor;
        }
      }

      if(this.getReactively(`this.vehiculop.depreciacion`)) {
        this.total = (+this.vehiculop.depreciacion * this.totalDistancia) + this.totalFacturas;
      }

    });

  }

  addKilometraje() {
    this.vehiculop.kilometraje.push({
      fecha: new Date,
      lugarSalida: {municipio: '', departamento: ''},
      lugarLlegada: {municipio: '', departamento: ''},
      distancia: 0
    });
  }

  removeKilometraje(index) {
    this.vehiculop.kilometraje.splice(index, 1);
  }

  addFactura() {
    this.vehiculop.facturas.push({
      fecha: new Date,
      numero: '',
      galones: '',
      proveedor: '',
      valor: 0
    });
  }

  removeFactura(index) {
    this.vehiculop.facturas.splice(index, 1);
  }

  guardar() {
    Nombramientos.update({
      _id: this.nombramiento._id
    }, {
      $set: {
        vehiculop: angular.copy(this.vehiculop)
      }
    }, (error) => {
      if(error) {
        console.log(error);
      } else {
        console.log('Hecho!');
      }
    });
  }

  vpPDF() {
    vhcPPDF(this.nombramiento, this.vehiculop, this.vehiculop.depreciacion, this.total);
  }
}

const name = 'pVehiculoP';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    bindings: {
      nombramiento: '='
    },
    controllerAs: name,
    controller: PVehiculoPCtrl
  });
