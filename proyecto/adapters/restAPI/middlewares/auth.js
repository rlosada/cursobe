import CONSTANTS from "../../../misc/constants.js"
import { getConfiguration } from "../../../misc/configuration/configuration.js"
import passport from "passport"
import logger from "../../../misc/logger/LoggerInstance.js"
import { HTTP_STATUS_CODES } from "../public/js/statusCodes.js"

const { JWT_COOKIE_NAME, LOGIN_MODES } = CONSTANTS
const { loginMode } = getConfiguration()

/**
 * Recupera el middleware de authorizacion
 * 
 * @param {boolean} isAPI true si el endpoint es parte de la API
 * @returns middleware de autorizacion
 */    
function auth(isAPI) {

    const reject = (isAPI) ? rejectAPI : rejectView

    if(loginMode === LOGIN_MODES.SESSION)
        return authBySession(reject)
    else if(loginMode === LOGIN_MODES.JWT)
        return authByToken(reject)
}


const rejectAPI = (res) => { 
    logger.Info('rejectAPI', `Rejecting request by returning status code ${HTTP_STATUS_CODES.AUTHORIZATION_FAILED}`)
    res.status(HTTP_STATUS_CODES.AUTHORIZATION_FAILED).send() 
}
const rejectView = (res) =>  { 
    logger.Info('rejectAPI', `Rejecting request by redirecting to /login`)
    res.redirect('/login')
}


/**
 * Recupera el middleware de authorizacion basado en Session
 * 
 * @param {*} isAPI true si el endpoint es parte de la API
 * @returns middleware de autorizacion
 */
function authBySession(reject) {
    
    return (req, res, next) => {

        logger.Info('Middleware | Authorization', `Using SESSION`)

        let user  = req.user
        if(!user) {
            logger.Info('Middleware | Authorization', `User is not logged in, rejecting`)
            return reject(res)
        }

        logger.Info('Middleware | Authorization', `User is logged in`)
        next()

    }
}

/**
 * Recupera el middleware de authorizacion basado en JWT
 * 
 * @param {function} reject funcion a ejecutar para devolver el resultado
 *                          cuando el usuario no este autorizado
 * @returns middleware de autorizacion
 */
function authByToken(reject) {

    return (req, res, next) => {
        logger.Info('Middleware | Authorization', `Using JWT`)

        const token = null;

        if (!req || !req.signedCookies || !req.signedCookies[JWT_COOKIE_NAME]) {
            logger.Info('Middleware | Authorization', `User is not logged in, rejecting`)
            return reject(res)
        }

        passport.authenticate('jwt')(req, res, next)
    }
    
}

export default auth