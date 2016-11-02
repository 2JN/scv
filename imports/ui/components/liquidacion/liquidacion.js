import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './liquidacion.html';
import promptTemplate from './promptLiquidacion.html';

import { Nombramientos } from '../../../api/nombramientos';

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
    var doc = new jsPDF('p', 'pt');
    doc.setFontSize(9);
    var positiony = 120;
    var ltLinea = 36;
    var ptLinea = 8;
    var saltoLinea = 12;
    var ctD = this.cuotaDiaria(+this.selected[0].datos_empleado.sueldoMensual);

    for(nombramiento of this.selected) {
      let motivo = doc.splitTextToSize(nombramiento.datos_comision.motivo, 125);
      doc.text(30, positiony, motivo);
      for(lugar of nombramiento.datos_comision.lugares) {
        let lgr = `${lugar.dependencia} ${lugar.municipio}, ${lugar.departamento}`;
        let lgsplit = doc.splitTextToSize(lgr, 140);
        let totalAxB = +lugar.dias * ctD;

        doc.text(170, positiony, lgsplit);
        doc.text(325, positiony, `${lugar.dias}`);
        doc.text(400, positiony, `${ctD}`);
        doc.text(480, positiony, `${totalAxB}`);

        positiony += (Math.ceil(lgr.length / ltLinea) * ptLinea) + saltoLinea;
      }
    }

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
