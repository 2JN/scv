import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './nombramientoComision.html';
import { Empleados } from '../../../api/empleados';
import { Dependencias } from '../../../api/dependencias';
import { Nombramientos } from '../../../api/nombramientos';

class NombramientoComisionCtrl {
  constructor($scope, $reactive, $state) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$state = $state;

    this.subscribe('dependencias');
    this.subscribe('empleados');
    this.subscribe('users');
    this.dependencia = {};
    this.comision = {};
    this.comision.fecha = new Date;

    this.isDisabled = true;
    this.comision.lugares = [
      {
        dependencia: '',
        municipio: '',
        departamento: ''
      }
    ];

    // get dates reactively

    this.comision.fechaI = new Date (
      this.comision.fecha.getFullYear(),
      this.comision.fecha.getMonth(),
      this.getReactively('this.comision.fecha').getDate() + 1
    );

    this.autorun( () => {
      this.minDate = new Date(
        this.comision.fecha.getFullYear(),
        this.comision.fecha.getMonth(),
        this.getReactively('this.comision.fecha').getDate() + 1
      );
    });

    this.autorun( () => {
      this.otherMinDate = new Date(
        this.comision.fechaI.getFullYear(),
        this.comision.fechaI.getMonth(),
        this.getReactively('this.comision.fechaI').getDate()
      );
    });

    this.helpers({
      datosUsuario() {
        return Empleados.findOne({ user: Meteor.user().username });
      }
    });
  }

  datosDependencia() {
    this.dependencia = Dependencias.findOne({ _id: this.datosUsuario.dependencia_id });
  }

  ingresar() {
    let noNombramiento = ++this.dependencia.nombramiento + "-" + this.comision.fecha.getFullYear();

    let datosComision = {
      _id: noNombramiento,
      datos_empleado: this.datosUsuario,
      datos_dependencia: this.dependencia,
      datos_comision: angular.copy(this.comision)
    }

    Nombramientos.insert(datosComision);
    this.actualizarDependencia();
    this.isDisabled = false;
  }

  reset() {
    this.dependencia = {},
    this.comision = {}
  }

  actualizarDependencia() {
    Dependencias.update({
      _id: this.dependencia._id
    }, {
      $set: { nombramiento: this.dependencia.nombramiento }
    });
  }

  addLugar() {
    this.comision.lugares.push({
      dependencia: '',
      municipio: '',
      departamento: ''
    });
  }

  removeLugar(index) {
    this.comision.lugares.splice(index, 1);
  }

  modificarFecha(fechamod) {
    function mod(s) { return (s < 10) ? '0' + s : s; }
    return [
      mod(fechamod.getDate()),
      mod(fechamod.getMonth() + 1),
      fechamod.getFullYear()
    ].join('/');
  }

  fechaCaracteres(fechamod) {
    let x = '';
    let mes = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    function mod(s) { return (s < 10) ? '0' + s : s; }

    return [
      mod(fechamod.getDate()), 'de',
      mes[fechamod.getMonth()], 'de',
      fechamod.getFullYear()
    ].join(' ');
  }

  descargarPDF() {
    // format name
    let name = this.datosUsuario.pnombre;
    if (this.datosUsuario.snombre) {
      name += (" " + this.datosUsuario.snombre);
    }

    name += (" "+ this.datosUsuario.papellido);
    if (this.datosUsuario.sapellido) {
      name += (" " + this.datosUsuario.sapellido);
    }

    //format date
    let dateI = this.modificarFecha(this.comision.fechaI);
    let dateF = this.modificarFecha(this.comision.fechaF);

    let date = this.fechaCaracteres(this.comision.fecha);

    var doc = new jsPDF('p', 'pt');
    // encabezado
    doc.setLineWidth(1);
    doc.rect(20, 20, 550, 800); // marco
    doc.line(20, 90, 570, 90); // horizontal line
    doc.line(420, 20, 420, 90); // vertical line
    doc.line(420, 55, 570, 55);
    doc.text(160, 50, 'ORGANISMO JUDICIAL');
    doc.text(140, 70, 'NOMBRAMIENTO DE COMISION');

    doc.setFontSize(12);
    doc.text(445, 35, 'Nombramiento No.');
    doc.setFontSize(11);
    doc.text(460, 50,
      `${this.dependencia.nombramiento}-${this.comision.fecha.getFullYear()}`
    );

    doc.setFontSize(9);
    let dpnd = doc.splitTextToSize(
      `${this.dependencia.nombre} de ${this.dependencia.departamento}`, 140
    );
    doc.text(425, 67, dpnd);

    // tabla de empleado
    doc.setFontSize(11);
    doc.text(30, 110, 'Se nombra a:');

    let columns = [
      {title: "Nombre", key: "nombre"},
      {title: "Cargo", key: "cargo"},
      {title: "Renglon", key: "renglon"},
      {title: "Sueldo Mensual", key: "sueldo"},
      {title: "NIT", key: "nit"},
      {title: "Firma de Recepcion", key: "firma"}
    ];

    let rows = [
      {
        nombre: name,
        cargo: this.datosUsuario.cargo,
        renglon: this.datosUsuario.renglon,
        sueldo: "Q" + this.datosUsuario.sueldoMensual, // format salary
        nit: this.datosUsuario._id,
        firma: ""
      }
    ];

    doc.autoTable(columns, rows, {
      theme: 'plain',
      startY: 125,
      margin: {horizontal: 10},
      styles: {overflow: 'linebreak'},
      bodyStyles: {valign: 'top'},
    });

    // datos comision
    doc.text(30, 230, "Para realizar la comisión en:");

    let columnsc = [
      {title: "Dependencia", key: "dependencia"},
      {title: "Municipio", key: "municipio"},
      {title: "Departamento", key: "departamento"}
    ];

    let rowsc = [];

    for (let obj of this.comision.lugares) {
      rowsc.push(obj);
    }

    doc.autoTable(columnsc, rowsc, {
      theme: 'plain',
      startY: 245,
      margin: {horizontal: 10},
      styles: {overflow: 'linebreak'},
      bodyStyles: {valign: 'top'},
    });

    doc.text(30, 387, "Por el período comprendido:\t" + dateI +
      "\tal\t" + dateF);

    doc.text(30, 410, "Motivo de la comisión:");
    let motivo = doc.splitTextToSize(this.comision.motivo, 515);
    doc.text(30, 430, motivo);

    doc.text(30, 500, "Utilizará:");

    if(this.comision.vehiculoInst) {
      doc.rect(30, 510, 20, 20, 'F');
    } else {
      doc.rect(30, 510, 20, 20);
    }

    doc.text(55, 525, 'Vehículo de la institución');

    if(this.comision.vehiculoProp) {
      doc.rect(230, 510, 20, 20, 'F');
    } else {
      doc.rect(230, 510, 20, 20);
    }

    doc.text(255, 525, 'Vehículo propio');

    if(this.comision.tansUrbano) {
      doc.rect(430, 510, 20, 20, 'F');
    } else {
      doc.rect(430, 510, 20, 20);
    }

    doc.text(455, 525, 'Transporte urbano');

    if(this.comision.observaciones) {
      let observaciones = doc.splitTextToSize(this.comision.observaciones, 515);
      doc.text(30, 580, 'Observaciones: ');
      doc.text(30, 600, observaciones);
    } else {
      doc.text(30, 580, 'Observaciones: ');
    }

    doc.text(30, 650, `Lugar y Fecha: ${this.comision.localizacion}, ${date}`);

    doc.text(210, 700, "(f).");
    doc.line(230, 705, 400, 705);
    doc.setFontSize(9);
    doc.text(235, 720, "Nombre y firma de autoridad que nombra")

    doc.save('nombramiento.pdf');
  }
}

const name = 'nombramientoComision';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: NombramientoComisionCtrl
  })
    .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('nombramientoComisison', {
    url: '/nombramiento-comision',
    template: '<nombramiento-comision></nombramiento-comision>',
    resolve: {
      currentUser: ($q) => {
        var deferred = $q.defer();

        Meteor.autorun(function() {
          if(!Meteor.loggingIn()) {
            if(!Meteor.user()) {
              deferred.reject('PERMISSION_REQUIRED');
            } else {
              deferred.resolve();
            }
          }
        });

        return deferred.promise;
      }
    }
  });
}
