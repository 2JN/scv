import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import jsPDF from 'jspdf';

import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './liquidacion.html';
import promptTemplate from './promptLiquidacion.html';

import { Nombramientos } from '../../../api/nombramientos';
import { name as Ordenar } from '../ordenar/ordenar';
import numeroALetras from './numeroALetras';

class LiquidacionCtrl {
  constructor($scope, $reactive, seleccion, $state, $mdToast, $mdDialog) {
    $scope.viewModel(this);

    this.perPage = 15;
    this.page = 1;
    this.sort = {
      _id: 1
    };
    this.searchText = '';

    this.subscribe('nombramientos', () => [
      {
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText')
    ]);

    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;

    this.selected = seleccion.selected;
    this.tlugares = 0;

    this.helpers({
      nombramientos() {
        return Nombramientos.find({});
      },

      nombramientosCount() {
        return Counts.get('numberOfNombramientos');
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
      parent: angular.element(document.body),
      controllerAs: 'promptLiquidacion',
      controller: PromptLiquidacionCtrl,
    });
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(sort) {
    this.sort = sort;
  }
}

class PromptLiquidacionCtrl {
  constructor($scope, seleccion, $mdDialog, $mdToast) {
    $scope.viewModel(this);

    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;

    this.v_a =  false;
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

    var doc = new jsPDF('p', 'pt', 'legal');
    doc.setFontSize(9);

    var positiony = 245;
    var ltLinea = 35;
    var ptLinea = 8;
    var saltoLinea = 10;
    var ctD = this.cuotaDiaria(+this.selected[0].datos_empleado.sueldoMensual);

    var  gastosViatico = 0;
    var otrosGastos = 0;
    var totalF1 = 0;

    doc.text(85, 120, this.pagoDep); // Recibi de

    for(nombramiento of this.selected) {
      let motivo = nombramiento.datos_comision.motivo;
      let mtvsplit = doc.splitTextToSize(nombramiento.datos_comision.motivo, 125);
      doc.text(30, positiony, mtvsplit);

      for(lugar of nombramiento.datos_comision.lugares) {
        let lgr = `${lugar.dependencia} ${lugar.municipio}, ${lugar.departamento}`;
        let lgsplit = doc.splitTextToSize(lgr, 140);
        let totalAxB = +lugar.dias * ctD;

        gastosViatico += totalAxB;

        doc.text(172, positiony, lgsplit);
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

    doc.text(495, 495, `${Number(gastosViatico).toFixed(2)}`);

    // Calculo de otros gastos
    for(nombramiento of this.selected) {

      if (nombramiento.datos_comision.vehiculoInst) {
        if (nombramiento.vehiculoi && nombramiento.vehiculoi.facturas) {
          for (factura of nombramiento.vehiculoi.facturas) {
            otrosGastos += +factura.valor;
          }
        } else {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Asegurese de que tenga las planillas requeridas de vehiculo de la institución')
              .position('top right')
          );
        }
      }

      if(nombramiento.datos_comision.vehiculoProp) {
        if(nombramiento.vehiculop) {
          for (lugar of nombramiento.vehiculop.kilometraje) {
            otrosGastos += lugar.distancia * nombramiento.vehiculop.depreciacion;
          }

          for (factura of nombramiento.vehiculop.facturas) {
            otrosGastos += +factura.valor;
          }
        } else {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Asegurese de que tenga las planillas requeridas de vehiculo propio')
              .position('top right')
          );
        }
      }

      if(nombramiento.datos_comision.transUrbano) {
        if (nombramiento.pasajes) {
          for (factura of nombramiento.pasajes.facturas) {
            otrosGastos += +factura.valorPasaje;
          }
        } else {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Asegurese de que tenga las planillas requeridas de pasajes')
              .position('top right')
          );
        }
      }
    }

    doc.text(495, 540, `${Number(otrosGastos).toFixed(2)}`);

    totalF1 = Number(gastosViatico + otrosGastos).toFixed(2);
    doc.text(495, 563, `${totalF1}`);

    // Liquidacion
    if (this.recibido) {
      doc.text(350, 600, `${this.v_aNumber}`);
      doc.text(495, 600, `${Number(this.recibido).toFixed(2)}`);

      if (this.recibido > totalF1) {
        let reintegro = this.recibido - totalF1;

        doc.text(495, 630, `${Number(reintegro).toFixed(2)}`);
      } else if (this.recibido < totalF1) {
        let complemento = totalF1 - this.recibido;

        doc.text(495, 650, `${Number(complemento).toFixed(2)}`);
      } else {
        doc.text(495, 650, `0.00`);
      }
    } else {
      doc.text(495, 650, `${totalF1}`);
    }

    doc.text(495, 692, `${totalF1}`);

    // cabecera
    let cantidadL = numeroALetras(totalF1);
    doc.text(110, 160, cantidadL);

    doc.setFontSize(18);
    doc.text(440, 70, `${totalF1}`);

    // pie de pagina
    doc.setFontSize(9);
    doc.text(100, 718, 'Quetzaltenango');
    doc.text(80, 740, `${name}`);
    doc.text(80, 766, `${this.selected[0].datos_empleado.cargo}`);
    doc.text(460, 766, `${
      Number(this.selected[0].datos_empleado.sueldoMensual).toFixed(2)
    }`);

    doc.save('liquidacion.pdf');
  }

  cancel() {
    this.$mdDialog.cancel();
  }
}

const name = 'liquidacion';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
  Ordenar,
  utilsPagination
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
