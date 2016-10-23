import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './nombramientoPDF.html';

class NombramientoPDFCtrl {
  descargarPDF() {
    // format name
    let name = this.nombramiento.datos_empleado.pnombre;
    if (this.nombramiento.datos_empleado.snombre) {
      name += (" " + this.nombramiento.datos_empleado.snombre);
    }

    name += (" "+ this.nombramiento.datos_empleado.papellido);
    if (this.nombramiento.datos_empleado.sapellido) {
      name += (" " + this.nombramiento.datos_empleado.sapellido);
    }

    //format date
    let dateI = this.modificarFecha(this.nombramiento.datos_comision.fechaI);
    let dateF = this.modificarFecha(this.nombramiento.datos_comision.fechaF);

    let date = this.fechaCaracteres(this.nombramiento.datos_comision.fecha);

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
      `${this.nombramiento.datos_dependencia.nombramiento}-${this.nombramiento.datos_comision.fecha.getFullYear()}`
    );

    doc.setFontSize(9);
    let dpnd = doc.splitTextToSize(
      `${this.nombramiento.datos_dependencia.nombre} de ${this.nombramiento.datos_dependencia.departamento}`, 140
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
        cargo: this.nombramiento.datos_empleado.cargo,
        renglon: this.nombramiento.datos_empleado.renglon,
        sueldo: "Q" + this.nombramiento.datos_empleado.sueldoMensual, // format salary
        nit: this.nombramiento.datos_empleado._id,
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

    for (let obj of this.nombramiento.datos_comision.lugares) {
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
    let motivo = doc.splitTextToSize(this.nombramiento.datos_comision.motivo, 515);
    doc.text(30, 430, motivo);

    doc.text(30, 500, "Utilizará:");

    if(this.nombramiento.datos_comision.vehiculoInst) {
      doc.rect(30, 510, 20, 20, 'F');
      doc.text(55, 545, `Placas ${this.nombramiento.datos_comision.placasVI}`);
    } else {
      doc.rect(30, 510, 20, 20);
    }

    doc.text(55, 525, 'Vehículo de la institución');

    if(this.nombramiento.datos_comision.vehiculoProp) {
      doc.rect(230, 510, 20, 20, 'F');
    } else {
      doc.rect(230, 510, 20, 20);
    }

    doc.text(255, 525, 'Vehículo propio');

    if(this.nombramiento.datos_comision.tansUrbano) {
      doc.rect(430, 510, 20, 20, 'F');
    } else {
      doc.rect(430, 510, 20, 20);
    }

    doc.text(455, 525, 'Transporte urbano');

    doc.text(30, 620, 'Observaciones: ');

    if(this.nombramiento.datos_comision.observaciones) {
      let observaciones = doc.splitTextToSize(this.nombramiento.datos_comision.observaciones, 515);
      doc.text(30, 640, observaciones);
    }

    doc.text(30, 690, `Lugar y Fecha: ${this.nombramiento.datos_comision.localizacion}, ${date}`);

    doc.text(210, 740, "(f).");
    doc.line(230, 745, 400, 745);
    doc.setFontSize(9);
    doc.text(235, 760, `Nombre: ${this.nombramiento.datos_dependencia.encargado}`);

    doc.save('nombramiento.pdf');
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
}

const name = 'nombramientoPdf';

export default angular.module(name, [
  angularMeteor
])
  .component(name, {
    templateUrl: template,
    bindings: {
      nombramiento: '<'
    },
    controllerAs: name,
    controller: NombramientoPDFCtrl
  });
