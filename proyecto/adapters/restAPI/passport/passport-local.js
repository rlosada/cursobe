import { Strategy as LocalStrategy } from 'passport-local'
import logger from '../../../misc/logger/LoggerInstance.js'
import getUsersManager from '../../../application/users/UserManagerInstance.js'
import { buildSessionInfo } from '../../../application/users/sessionUserBuilder.js'

let um = await getUsersManager()

/**
 * 
 * @param {string} username Nombre del usuario 
 * @param {string} password Password del usuario
 * @param {function} cb Funcion de callback
 * 
 * Verifica si el username y password suministrados corresponden
 * a un usuario valido. La respuesta, afirmativa o negativa es
 * pasada a la funcion de callback. 
 */
async function verify(username, password, cb) {
    logger.Info('verify', `LocalStrategy | username:${username}, password:${password}`)   
    
    let dbuser = await um.getUserByEmailAndPass(username, password)
    if(dbuser) {
        logger.Info('verify', `LocalStrategy | User verification SUCCESS`)   
        // Passport va a depositar el contenido de sessioninfo el storage encargado de
        // administrar las sessiones    
        cb(null, buildSessionInfo(dbuser))
    }
    else { 
        logger.Error('verify', `LocalStrategy | User verification FAILED`)   
        cb(null, false, { message: 'User not found or password is invalid' })
    }
}



// /**
//  * 
//  * @param {*} dbUser Objeto devuelto por la base 
//  * @param {*} cb Funcion de callback
//  * 
//  * Recibe la informacion de usuario recuperada en el verify() y la almacena en storage de sesiones
//  * a traves de la funcion de callback sera almacenado en req.user
//  */
// export function serializeUser(dbUser, cb) {
//     logger.Info('serializeUser', `Logged user session info : ${JSON.stringify(dbUser)}`)  

//     let sessionInfo =  buildSessionInfo(dbUser)

//     // Serializar en el siguiente ciclo del event-loop
//     cb(null, sessionInfo)
// }

export async function initPassportLocal(passport) {
    logger.Info('initPassportLocal', `Registering Local strategy`)  
    passport.use(new LocalStrategy(verify))
    return true
}











