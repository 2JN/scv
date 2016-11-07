import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './pVehiculoI.html';
import { Nombramientos } from '../../../../api/nombramientos';
import vhcIPDF from './vehiculoIPDF';

class PVehiculoICtrl {
  constructor($scope, $reactive, $state) {
    'ngIject';

    $reactive(this).attach($scope);

    this.total = 0;
    this.pdfDisabled = true;

    this.vehiculoi = {
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
      ]
    }

    this.autorun(function() {
      if (this.getReactively('this.nombramiento.vehiculoi')) {
        this.vehiculoi = this.nombramiento.vehiculoi;
      }
    });

    this.autorun(function() {
      let sizek = this.getReactively('this.vehiculoi.kilometraje.length');
      let sizef = this.getReactively('this.vehiculoi.facturas.length');

      this.totalDistancia = 0;
      for(let i = 0; i < sizek; i++) {
        if(this.getReactively(`this.vehiculoi.kilometraje[${i}].distancia`)) {
          this.totalDistancia += (+this.vehiculoi.kilometraje[i].distancia);
        }
      }

      this.totalFacturas = 0;
      for(let i = 0; i < sizef; i++) {
        if(this.getReactively(`this.vehiculoi.facturas[${i}].valor`)) {
          this.totalFacturas += +this.vehiculoi.facturas[i].valor;
        }
      }

      this.total = this.totalFacturas;

    });
  }

  addKilometraje() {
    this.vehiculoi.kilometraje.push({
      fecha: new Date,
      lugarSalida: {municipio: '', departamento: ''},
      lugarLlegada: {municipio: '', departamento: ''},
      distancia: 0
    });
  }

  removeKilometraje(index) {
    this.vehiculoi.kilometraje.splice(index, 1);
  }

  addFactura() {
    this.vehiculoi.facturas.push({
      fecha: new Date,
      numero: '',
      galones: '',
      proveedor: '',
      valor: 0
    });
  }

  removeFactura(index) {
    this.vehiculoi.facturas.splice(index, 1);
  }

  guardar() {
    Nombramientos.update({
      _id: this.nombramiento._id
    }, {
      $set: {
        vehiculoi: angular.copy(this.vehiculoi)
      }
    }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Hecho!');
      }
    });

    this.pdfDisabled = false;
  }

  viPDF() {
    vhcIPDF(this.nombramiento, this.vehiculoi, this.total);
    this.pdfDisabled = true;
  }
}

const name = 'pVehiculoI';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    bindings: {
      nombramiento: '='
    },
    controllerAs: name,
    controller: PVehiculoICtrl
  });
