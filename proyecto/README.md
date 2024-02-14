# Configuracion
En la carpeta ./misc/configuration esta el archivo configuration.js que contiene los parametros de configuracion de la aplicacion. Por el momento son:

* Modo de almacenamiento. Por el momento estan soportados 'db' y 'fs'. Los mensajes del chat solo se almacenan en db. 
* Ubicacion del archivo para almacenar los productos. (Solo usado en caso de que el modo de almacenamiento sea 'fs')
* Nombre del archivo para almacenar los productos. (Solo usado en caso de que el modo de almacenamiento sea 'fs')
* Ubicacion del archivo para almacenar los carritos. (Solo usado en caso de que el modo de almacenamiento sea 'fs')
* Nombre del archivo para almacenar los carritos. (Solo usado en caso de que el modo de almacenamiento sea 'fs')
* Parametros de acceso a la base de datos (Solo mongo esta soportado)
* Puerto de escucha del server HTTP.



# Lanzar aplicacion
Para lanzar ejecutar **npm start**

# Comportamiento del chat
* Cada nuevo usuario debe registrarse primero con un correo. Este correo no debe ya estar registrado por otro usario conectado. En caso que lo este, el sucesivos registros con el mismo correo desde otros usuario no es aceptado.
* Los correo son case insensitive.
* El chat se levanta sobre el puerto 8081.
* La falla en la grabacion de los mensajes en la base de datos se ignora, solo se logea, pero el mensaje se envia a el/los destinatario/s aunque no pueda grabarse en la base.


