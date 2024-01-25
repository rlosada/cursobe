import { fileURLToPath }  from 'url'
import { dirname } from 'path'


/**
 * Recupera el path completo del directorio donde reside el modulo
 * recibido como parametro
 * 
 * @param {string} absModulePath Ruta completa del modulo
 */
const getDirectory = (absModulePath) => dirname(fileURLToPath(absModulePath))

export default getDirectory
