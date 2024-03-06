import { fileURLToPath }  from 'url'
import { dirname } from 'path'
import crypto from 'node:crypto'
import { USER_TYPES } from './constants.js'
import bcrypt from 'bcrypt'
import configuration from './configuration/configuration.js'
import { DEFAUT_SALT_ROUNDS } from './constants.js'

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
    let keys = Object.values(USER_TYPES)
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
    let saltRounds = configuration.hashing.saltRounds || DEFAUT_SALT_ROUNDS
    let result = await bcrypt.hash(str, saltRounds)
    return result
}

export async function checkHash(plain, hashed) {
    let rc = await bcrypt.compare(plain, hashed)
    return rc
}