import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './liquidacion.html';
import promptTemplate from './promptLiquidacion.html';

import { Nombramientos } from '../../../api/nombramientos';
import numeroALetras from './numeroALetras';

class LiquidacionCtrl {
  constructor($scope, $reactive, seleccion, $state, $mdToast, $mdDialog) {
    $scope.viewModel(this);

    this.subscribe('nombramientos');
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;

    this.selected = seleccion.selected;
    this.tlugares = 0;

    this.helpers({
      nombramientos() {
        return Nombramientos.find({});
      }
    });
  }

  selectNombramiento(nombramiento) {
    let idx = this.selected.indexOf(nombramiento);
    if(idx > -1) {
      this.tlugares -= nombramiento.datos_comision.lugares.length;
      this.selected.splice(idx, 1);
    } else {
      this.tlugares += nombramiento.datos_comision.lugares.length;
      this.selected.push(nombramiento);

      if(this.tlugares > 5) {
        this.$mdToast.show(
          this.$mdToast.simple()
            .textContent('Solo pueden imprimirse 5 lugares')
            .position('top right')
        );
      }
    }
  }

  showLugaresTabs() {
    this.$mdDialog.show({
      templateUrl: promptTemplate,
      controllerAs: 'promptLiquidacion',
      controller: PromptLiquidacionCtrl,
    });
  }
}

class PromptLiquidacionCtrl {
  constructor($scope, seleccion, $mdDialog) {
    $scope.viewModel(this);

    this.$mdDialog = $mdDialog;
    this.selected = seleccion.selected;

  }

  cuotaDiaria(sueldo) {
    if(sueldo <= 10000) {
      return 300;
    } else if (sueldo > 10000 && sueldo <= 12000) {
      return 350;
    } else {
      return 400;
    }
  }

  liquidacionPDF() {
    let name = this.selected[0].datos_empleado.pnombre;
    if (this.selected[0].datos_empleado.snombre) {
      name += (" " + this.selected[0].datos_empleado.snombre);
    }

    name += (" "+ this.selected[0].datos_empleado.papellido);
    if (this.selected[0].datos_empleado.sapellido) {
      name += (" " + this.selected[0].datos_empleado.sapellido);
    }

    var doc = new jsPDF('p', 'pt');
    doc.setFontSize(9);

    var positiony = 200;
    var ltLinea = 35;
    var ptLinea = 8;
    var saltoLinea = 10;
    var ctD = this.cuotaDiaria(+this.selected[0].datos_empleado.sueldoMensual);

    var  gastosViatico = 0;
    var otrosGastos = 0;
    var totalF1 = 0;

    doc.text(80, 80, this.pagoDep);

    for(nombramiento of this.selected) {
      let motivo = nombramiento.datos_comision.motivo;
      let mtvsplit = doc.splitTextToSize(nombramiento.datos_comision.motivo, 125);
      doc.text(30, positiony, mtvsplit);

      for(lugar of nombramiento.datos_comision.lugares) {
        let lgr = `${lugar.dependencia} ${lugar.municipio}, ${lugar.departamento}`;
        let lgsplit = doc.splitTextToSize(lgr, 140);
        let totalAxB = +lugar.dias * ctD;

        gastosViatico += totalAxB;

        doc.text(170, positiony, lgsplit);
        doc.text(325, positiony, `${lugar.dias}`);
        doc.text(400, positiony, `${Number(ctD).toFixed(2)}`);
        doc.text(480, positiony, `${Number(totalAxB).toFixed(2)}`);

        positiony += (Math.ceil(lgr.length / ltLinea) * ptLinea) + saltoLinea;
      }

      let motivoLng = (Math.ceil(motivo.length / 31) * ptLinea) + saltoLinea;

      if (motivoLng > positiony) {
        positiony = motivoLng;
      }
    }

    doc.text(495, 475, `${Number(gastosViatico).toFixed(2)}`);

    // Calculo de otros gastos
    for(nombramiento of this.selected) {
      let vhi = 0, vhp = 0, pasajes = 0;

      if(nombramiento.datos_comision.vehiculoInst) {
        for (factura of nombramiento.vehiculoi.facturas) {
          otrosGastos += +factura.valor;
        }
      }

      if(nombramiento.datos_comision.vehiculoProp) {
        for (lugar of nombramiento.vehiculop.kilometraje) {
          otrosGastos += lugar.distancia * nombramiento.vehiculop.depreciacion;
        }

        for (factura of nombramiento.vehiculop.facturas) {
          otrosGastos += +factura.valor;
        }
      }

      if(nombramiento.datos_comision.transUrbano) {
        for (factura of nombramiento.pasajes.facturas) {
          otrosGastos += +factura.valorPasaje;
        }
      }
    }

    doc.text(495, 520, `${Number(otrosGastos).toFixed(2)}`);

    totalF1 = Number(gastosViatico + otrosGastos).toFixed(2);
    doc.text(495, 539, `${totalF1}`);

    doc.text(495, 672, `${totalF1}`);

    // cabecera
    let cantidadL = numeroALetras(totalF1);
    doc.text(80, 120, cantidadL);

    doc.setFontSize(18);
    doc.text(440, 35, `${totalF1}`);

    // pie de pagina
    doc.setFontSize(9);
    doc.text(80, 695, 'Quetzaltenango');
    doc.text(80, 717, `${name}`);
    doc.text(80, 743, `${this.selected[0].datos_empleado.cargo}`);
    doc.text(460, 743, `${
      Number(this.selected[0].datos_empleado.sueldoMensual).toFixed(2)
    }`);

    doc.save('nombramiento.pdf');
  }

  cancel() {
    this.$mdDialog.cancel();
  }
}

const name = 'liquidacion';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: LiquidacionCtrl
  })
  .service('seleccion', function() {
    var sl = this;
    sl.selected = [];
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('liquidacion', {
    url: '/liquidacion',
    template: '<liquidacion></liquidacion>',
    resolve: {
      currentUser($q) {
        if(Meteor.userId()) {
          return $q.resolve();
        } else {
          return $q.reject('PERMISSION_REQUIRED');
        }
      }
    }
  });
}
