import { fileURLToPath }  from 'url'
import { dirname } from 'path'


/**
 * Recupera el path completo del directorio donde reside el modulo
 * recibido como parametro
 * 
 * @param {string} absModulePath Ruta completa del modulo
 */
export const getDirectory = (absModulePath) => dirname(fileURLToPath(absModulePath))

export const validateIp = (ip) => {
    if(typeof ip !== string) 
        return false

    let nums = ip.split('.')
    if(nums.length !== 4)
        return false
}

export const validatePort = (port) => {
    if(typeof port !== Number)
        return false
    if(port < 1024 || port > 6535)
        return false
}




