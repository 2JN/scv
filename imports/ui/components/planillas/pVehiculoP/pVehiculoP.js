import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMessages from 'angular-messages';

import template from './pVehiculoP.html';
import { Nombramientos } from '../../../../api/nombramientos';
import { Vehiculos } from '../../../../api/vehiculos';
import vhcPPDF from './vehiculoPPDF';

class PVehiculoPCtrl {
  constructor($scope, $reactive, $state) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('vehiculosP');

    this.total = 0;
    this.maxG = 0;
    this.galonesR = [];
    this.pdfDisabled = true;

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
          galones: 0,
          proveedor: '',
          valor: 0
        }
      ],

      depreciacion: 1
    }

    this.helpers({
      vehiculosP() {
        return Vehiculos.find({
          _id: {
            $regex: `.*${this.getReactively('searchPlaca')}.*`,
            $options: 'i'
          }, user: Meteor.userId()
        }, {
          fields: {_id: 1}
        });
      }
    });

    this.autorun(function() {
      if (this.getReactively('this.nombramiento.vehiculop')) {
        this.vehiculop = this.nombramiento.vehiculop;
        this.placas = {_id: this.nombramiento.vehiculop.vehiculo.placa};
      } else {
        if (this.getReactively('placas')) {
          this.vehiculop.vehiculo = Vehiculos.findOne(this.placas);
          this.vehiculop.vehiculo.placa = this.placas._id;
        }
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

      if (this.getReactively('vehiculop.vehiculo.combustible')) {
          let KxG = {};

          if (this.vehiculop.vehiculo.combustible === 1) {
            KxG = {'4': 30, '6': 25, '8': 15, '9': 12}
          } else {
            KxG = {'4': 30, '6': 20, '8': 15, '9': 10}
          }

          if (this.getReactively('vehiculop.vehiculo.cilindros')) {
            let index = this.vehiculop.vehiculo.cilindros;
            this.restantesG = this.maxG = this.totalDistancia / KxG[`${index}`];
          }
      }

      for(let i = 0; i < sizef; i++) {
        if (this.getReactively(`this.vehiculop.facturas[${i}].galones`)) {

          this.galonesR[i] = this.restantesG;

          if (+this.vehiculop.facturas[i].galones <= this.restantesG) {
            this.restantesG -= +this.vehiculop.facturas[i].galones;
          } else {
            this.restantesG = 0;
          }
        }

        if (this.getReactively(`this.vehiculop.facturas[${i}].valor`)) {
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
      galones: 0,
      proveedor: '',
      valor: 0
    });
  }

  removeFactura(index) {
    this.vehiculop.facturas.splice(index, 1);
  }

  guardar() {
    this.vehiculop.vehiculo.placa = this.placas._id;

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

    this.pdfDisabled = false;
  }

  vpPDF() {
    vhcPPDF(this.nombramiento, this.vehiculop, this.vehiculop.depreciacion, this.total);
    this.pdfDisabled = true;
  }
}

const name = 'pVehiculoP';

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
    controller: PVehiculoPCtrl
  });
