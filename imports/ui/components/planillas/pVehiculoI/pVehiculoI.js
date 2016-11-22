import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMessages from 'angular-messages';

import template from './pVehiculoI.html';
import { Nombramientos } from '../../../../api/nombramientos';
import { Vehiculos } from '../../../../api/vehiculos';
import vhcIPDF from './vehiculoIPDF';

class PVehiculoICtrl {
  constructor($scope, $reactive, $state) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('vehiculosI');

    this.total = 0;
    this.maxG = 0;
    this.galonesR = [];
    this.pdfDisabled = true;
    this.showFacturas = false;

    this.vehiculoi = {
      vehiculo: {},

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
          galones: 0,
          proveedor: '',
          valor: 0
        }
      ]
    }

    this.autorun(function() {
      if (this.getReactively('this.nombramiento.vehiculoi')) {
        this.vehiculoi = this.nombramiento.vehiculoi;
      } else {

        if (this.getReactively('nombramiento.datos_comision.placasVI')) {
          let pvi = this.nombramiento.datos_comision.placasVI;

          this.vehiculoi.vehiculo = Vehiculos.findOne(pvi);
        }
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

      if (this.getReactively('vehiculoi.vehiculo.combustible')) {
        let KxG = {};

        if (this.vehiculoi.vehiculo.combustible === 1) {
          KxG = {'4': 30, '6': 25, '8': 15, '9': 12}
        } else {
          KxG = {'4': 30, '6': 20, '8': 15, '9': 10}
        }

        if (this.getReactively('vehiculoi.vehiculo.cilindros')) {
          let index = this.vehiculoi.vehiculo.cilindros;
          this.restantesG = this.maxG = this.totalDistancia / KxG[`${index}`];
        }
      }

      for(let i = 0; i < sizef; i++) {
        if (this.getReactively(`this.vehiculoi.facturas[${i}].galones`)) {

          this.galonesR[i] = this.restantesG;

          if (+this.vehiculoi.facturas[i].galones <= this.restantesG) {
            this.restantesG -= +this.vehiculoi.facturas[i].galones;
          } else {
            this.restantesG = 0;
          }
        }

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
      galones: 0,
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
    vhcIPDF(this.nombramiento, this.vehiculoi, this.showFacturas, this.total);
    this.pdfDisabled = true;
  }
}

const name = 'pVehiculoI';

export default angular.module(name, [
  angularMeteor,
  ngMessages
])
  .component(name, {
    templateUrl: template,
    bindings: {
      nombramiento: '='
    },
    controllerAs: name,
    controller: PVehiculoICtrl
  });
