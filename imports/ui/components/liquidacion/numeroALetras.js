function unidades(num) {
  switch(num) {
    case 1: return "UN";
    case 2: return "DOS";
    case 3: return "TRES";
    case 4: return "CUATRO";
    case 5: return "CINCO";
    case 6: return "SEIS";
    case 7: return "SIETE";
    case 8: return "OCHO";
    case 9: return "NUEVE";
  }

  return "";
}//unidades()

function decenas(num) {
  decena = Math.floor(num/10);
  unidad = num - (decena * 10);

  switch(decena) {
    case 1:
        switch(unidad) {
          case 0: return "DIEZ";
          case 1: return "ONCE";
          case 2: return "DOCE";
          case 3: return "TRECE";
          case 4: return "CATORCE";
          case 5: return "QUINCE";
          default: return "DIECI" + unidades(unidad);
        }

    case 2:
      switch(unidad) {
        case 0: return "VEINTE";
        default: return "VEINTI" + unidades(unidad);
      }

    case 3: return decenasY("TREINTA", unidad);
    case 4: return decenasY("CUARENTA", unidad);
    case 5: return decenasY("CINCUENTA", unidad);
    case 6: return decenasY("SESENTA", unidad);
    case 7: return decenasY("SETENTA", unidad);
    case 8: return decenasY("OCHENTA", unidad);
    case 9: return decenasY("NOVENTA", unidad);
    case 0: return unidades(unidad);
  }
}//decenas()

function decenasY(strSin, numUnidades) {
  if (numUnidades > 0) {
    return strSin + " Y " + unidades(numUnidades);
  }

  return strSin;
}//decenasY()

function centenas(num) {
  hecto = Math.floor(num / 100);
  deca = num - (hecto * 100);

  switch(hecto)
  {
    case 1:
      if (deca > 0) {
        return "CIENTO " + decenas(deca);
      }

      return "CIEN";

    case 2: return "DOSCIENTOS " + decenas(deca);
    case 3: return "TRESCIENTOS " + decenas(deca);
    case 4: return "CUATROCIENTOS " + decenas(deca);
    case 5: return "QUINIENTOS " + decenas(deca);
    case 6: return "SEISCIENTOS " + decenas(deca);
    case 7: return "SETECIENTOS " + decenas(deca);
    case 8: return "OCHOCIENTOS " + decenas(deca);
    case 9: return "NOVECIENTOS " + decenas(deca);
  }

  return decenas(deca);
}//centenas()

function seccion(num, divisor, strSingular, strPlural) {
  cientos = Math.floor(num / divisor);

  var letras = "";

  if (cientos > 0)
    if (cientos > 1)
      letras = centenas(cientos) + " " + strPlural;
    else
      letras = strSingular;

  return letras;
}//seccion()

function miles(num) {
  var miles = Math.floor(num / 1000);
  var resto = num - (miles * 1000);

  var strMiles = seccion(num, 1000, "MIL", "MIL");
  var strCentenas = centenas(resto);

  if(strMiles == "")
    return strCentenas;

  return strMiles + " " + strCentenas;
}//miles()

function millones(num) {
  var millones = Math.floor(num / 1000000)
  var resto = num - (millones * 1000000)

  var strMillones = seccion(num, 1000000, "UN MILLON", "MILLONES");
  var strMiles = miles(resto);

  if(strMillones == "")
    return strMiles;

  return strMillones + " " + strMiles;
}//millones()

export default function numeroALetras(num) {
  var data = {
    numero: num,
    enteros: Math.floor(num),
    centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
    letrasCentavos: "",
    letrasMonedaPlural: 'QUETZALES',
    letrasMonedaSingular: 'QUETZAL',

    letrasMonedaCentavoPlural: "CENTAVOS",
    letrasMonedaCentavoSingular: "CENTAVO"
  };

  if (data.centavos > 0) {
    data.letrasCentavos = "CON " + (function() {
      if (data.centavos == 1)
        return millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
      else
        return millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
      })();
  };

  if(data.enteros == 0)
    return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
  else if (data.enteros == 1)
    return millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
  else
    return millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
}//numeroALetras()
