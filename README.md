# Sistema de Control de Viaticos

## Uso
El sistema permite el proceso de recopilación de información e impresión del mismo correspondiente a las comisiones que se realizaran asi como su liquidación.

Para poder acceder al programa se debe de iniciar sesión a través de un usuario y una contraseña que el administrador debera facilitarle.

* La aplicación le presentara una serie de formlarios de los cuales los campos que contienen un *asterisico\** son obligatorios.
* No deben utilizarse simbolos (como los de moneda) en los campos de los formularios.
* Los listados proporcionan un campo de busqueda rapida que se puede inicializar haciendo click en el icono de lupa, el número de nombramiento es el único campo para el cual esta disponible la busquda.
* Los listados pueden presentarse en un orden ascendente o descendente.


### Nombramiento Comision
En esta forma se tomaran todos los datos referentes a la comisión. Al llenar todos los campos y dar click en el botón de aceptar se nos redirigira al **listado de nombramientos**.

![nombramientos](/manual/datos_nombramiento.png)

Del lado izquierdo se encuentra el menu, con el que podra acceder a las diferentes partes del proceso de liquidación de viaticos.

### Listado de Nombramientos

En esta parte podemos descargar el documento en PDF y para proceder a imprimirlo, podemos agregar *planillas adicionales* que formaran parte del total de la liquidación o podemos editar las comisiones realizadas anteriormente.

![listado nombramientos](/manual/listado_nombramientos.png)

### Planillas
Las planillas que se deben llenar son relativas de acuerdo a los tipos de vehiculos especificados en el *nombramiento*.

![planillas](/manual/planilla.png)

Una vez llenados todos los campos obligatorios se habilitara el botono de aceptar, al aceptar los datos se habilitara el boton para descargar la planilla correspondiente que se este vizualisando por el usuario, una vez descargado la planilla en PDF se deben volver a aceptar los datos actuales para poder re-habilitar el boton de PDF.

![planillas-stub](/manual/planilla_stub.png)

### Liquidación de Viaticos
En esta página debemos de seleccionar los nombramientos de que conforman una sola liquidación.

![liquidacion](/manual/liquidacion.png)

Al hacer esto se habilitara el boton de que nos pedira información adicional para la liquidación.

![liquidacion prompt](/manual/liquidacion_prompt.png)

En este ultimo formulario se ingresa de quien se recibe la liquidación de viaticos la fracción de días que se pasaron en los lugares correspondientes a los nombramientos seleccionados y anticipos que se pudieron haber tenido, estos son opcionales y se habilitan o desabilitan pulsando en el boton con las flehas que aparece en la barra del formulario.

Al llenar todos los datos se habilitara la descarga del PDF.

> Nota: A diferencia de los demás formularios, el de liquidación no se guardara.
