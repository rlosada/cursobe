# Product Manager
Logica de funcionamiento

* Los productos son almacenados en un archivo products.json.
* La ruta donde el archivo se guarda se define cuando se crea el ProductManager.
* Si ya existe un archivo products.json que sea valido, el ProductManager lo utiliza.
* Si el ProductManager detecta que el archivo no es valido, ignora su contenido y lo sobreescribe la proxima vez que deba actualizarlo.
* Se considera que un archivo puede ser invalido dado que fue editado por fuera de la aplicacion. Un archivo es considerado invalido cuando sucede alguna de las siguientes cosas:
    A. Existe al menos un elemento que no posee todos los campos requeridos o bien no respetan la especificacion. (id, title, description, price, thumbnail, code, stock)
    B. Existen al menos dos elementos cuyo id es repetido. 
