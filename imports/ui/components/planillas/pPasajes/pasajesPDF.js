function modificarFecha(fechamod) {
  function mod(s) { return (s < 10) ? '0' + s : s; }
  return [
    mod(fechamod.getDate()),
    mod(fechamod.getMonth() + 1),
    fechamod.getFullYear()
  ].join('/');
}

export default function pasajePDF(nombramiento, pasajes) {
  let name = nombramiento.datos_empleado.pnombre;
  if (nombramiento.datos_empleado.snombre) {
    name += (" " + nombramiento.datos_empleado.snombre);
  }

  name += (" "+ nombramiento.datos_empleado.papellido);
  if (nombramiento.datos_empleado.sapellido) {
    name += (" " + nombramiento.datos_empleado.sapellido);
  }

  var doc = new jsPDF('p', 'pt');

  doc.text(200, 70, 'PLANILLA DE PASAJES');
  doc.setFontSize(9);
  doc.text(30, 100, `Nombre completo: ${name}`);
  doc.text(30, 115, `Cargo: ${nombramiento.datos_empleado.cargo}`);
  doc.text(30, 130, `Nombramiento número: ${nombramiento._id}`);

  doc.text(30, 150, 'Lugares de comisión:');
  // table lugares, 5 rows = 150p approximately
  let columnsl = [
    {title: 'Dependencia', key: 'dependencia'},
    {title: 'Municipio', key: 'municipio'},
    {title: 'Departamento', key: 'departamento'}
  ];

  let rowsl = [];

  for(let obj of nombramiento.datos_comision.lugares) {
    rowsl.push(obj);
  }

  doc.autoTable(columnsl, rowsl, {
    theme: 'plain',
    startY: 165
  });

  doc.text(30, 320, 'Motivo de la Comisión:');
  let motivo = doc.splitTextToSize(nombramiento.datos_comision.motivo, 515);
  doc.text(30, 335, motivo);

  doc.text(30, 390, 'Detalles de facturas de pasajes:');
  // table pasajes, 5 rows = 150p approximately
  let columnsp = [
    {title: 'Fecha', key: 'fecha'},
    {title: 'Numero', key: 'nfactura'},
    {title: 'Salida (Municipio, Departamento)', key: 'lugarSalida'},
    {title: 'Llegada (Municipio, Departamento)', key: 'lugarLlegada'},
    {title: 'Costo', key: 'valorPasaje'}
  ]

  let rowsp = [];

  for(let obj of pasajes.facturas) {
    rowsp.push(
      {
        fecha: `${modificarFecha(obj.fecha)}`,
        nfactura: obj.nfactura,
        lugarSalida: `${obj.lugarSalida.municipio}, ${obj.lugarSalida.departamento}`,
        lugarLlegada: `${obj.lugarLlegada.municipio}, ${obj.lugarLlegada.departamento}`,
        valorPasaje: `Q ${obj.valorPasaje}`
      });
  }

  doc.autoTable(columnsp, rowsp, {
    theme: 'plain',
    startY: 410
  })

  doc.text(210, 560, '(f)');
  doc.line(220, 560, 375, 560);
  doc.text(220, 570, `Nombre: ${name}`);
  doc.text(220, 580, `Cargo: ${nombramiento.datos_empleado.cargo}`);

  doc.text(180, 650, 'Vo.Bo.(f)');
  doc.line(220, 650, 375, 650);
  doc.text(220, 660, `Nombre: ${nombramiento.datos_dependencia.encargado}`);
  doc.text(220, 670, `Cargo: ${nombramiento.datos_dependencia.cargoEn}`);

  doc.save('planilla_pasajes.pdf');
}
