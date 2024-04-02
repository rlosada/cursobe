import { fileURLToPath }  from 'url'
import { dirname } from 'path'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { getConfiguration } from './configuration/configuration.js'
import constants from './constants.js'

const configuration = getConfiguration()

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

export const validatePositiveIntBase10 = (value) => {
    
    let v = Number.parseInt(value)
    
    if(Number.isNaN(v))
        return false

    if(v < 0)
        return false

    return true
} 

export const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validateUserType = (type) => {
    let keys = Object.values(constants.USER_TYPES)
    return keys.includes(type)
}

/**
 * Devuelve el SHA256 del valor recibido
 * 
 * @param {string} value 
 */
export function getHash(value) {
    const HASH_ALGO = 'sha256'
    const OUTPUT_FORMAT = 'hex'
    return crypto.createHash(HASH_ALGO)
            .update(value)
            .digest(OUTPUT_FORMAT)
}


export async function hashString(str) {
    let saltRounds = Number.parseInt(configuration.hashing.saltRounds || constants.DEFAUT_SALT_ROUNDS)
    let result = await bcrypt.hash(str, saltRounds)
    return result
}

export async function checkHash(plain, hashed) {
    let rc = await bcrypt.compare(plain, hashed)
    return rc
}

export function buildRoute(arr) {
    return "/" + arr.join("/")
}



// export function verifyConfiguration(config) {
//     // Verificar que el mecanismo de logeo es uno de los elegidos    
//     let {loginMode} = configuration
//     let values = Object.values(LOGIN_MODES)
//     if(!values.includes(loginMode.toLocaleUpperCase())) {
//         logger.Error('verifyConfiguration', `loginMode=${loginMode} is not a valid value. Possible values are ${values}`)
//         return false
//     }
//     // Verificar que los secrets del para el JWT Token y el Cookie esten si es que se desea usar ese modo
//     if(loginMode === LOGIN_MODES.JWT) {
//         let {jwtSecret, cookieSecret} = configuration
//         const check = (k, v) => { 
//             if(typeof v !== 'string' || v.length > MAX_SECRETS_LENGTH) {
//                 logger.Error('verifyConfiguration', `${k}=${v} is not a valid value. It must a be a string and its length less or equal than ${MAX_SECRETS_LENGTH}`)    
//                 return false
//             }
//             return true
//         } 

//         if(!check('jwtSecret', jwtSecret)) 
//             return false

//         if(!check('cookieSecret', cookieSecret)) 
//             return false            

//     }

//     return true
// }