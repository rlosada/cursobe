import logger from '../../../misc/logger/LoggerInstance.js'


/**
 * 
 * @param {*} sessionInfo Informacion de la sesion 
 * @param {*} cb Funcion de callback
 * 
 * Recibe la informacion se session asociada al usuario
 * logeado y genera el objeto que luego a traves de la
 * funcion de callback sera almacenado en req.user
 */
function deserializeUser(sessionInfo, cb) {

    logger.Info('deserializeUser', `Deserializing user`)  

    process.nextTick(() => cb(null, sessionInfo  ))
}

/**
 * @param {passport} passport Objeto passport
 * 
 * Registra el desserializador
 */
export async function initPassportCommon(passport) {
    logger.Info('initPassportCommon', `Registering deserializer`)
    passport.deserializeUser(deserializeUser)    
    return true
}