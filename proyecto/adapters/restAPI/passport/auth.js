import { LOGIN_MODES } from "../../../misc/constants.js"
import configuration from "../../../misc/configuration/configuration.js"
import passport from "passport"
import logger from "../../../misc/logger/LoggerInstance.js"
import { JWT_COOKIE_NAME } from "../../../misc/constants.js"
import { HTTP_STATUS_CODES } from "../public/js/statusCodes.js"

const {loginMode} = configuration

    
const rejectAPI = (res) => { 
    logger.Info('rejectAPI', `Rejecting request by returning status code ${HTTP_STATUS_CODES.AUTHORIZATION_FAILED}`)
    res.status(HTTP_STATUS_CODES.AUTHORIZATION_FAILED).send() 
}
const rejectView = (res) =>  { 
    logger.Info('rejectAPI', `Rejecting request by redirecting to /login`)
    res.redirect('/login')
}

function auth(isAPI) {
    if(loginMode === LOGIN_MODES.SESSION)
        return [authBySession(isAPI)]
    else if(loginMode === LOGIN_MODES.JWT)
        return [authByToken(isAPI), passport.authenticate('jwt')]
}

function authBySession(isAPI) {
    
    const reject = (isAPI) ? rejectAPI : rejectView

    return (req, res, next) => {

        logger.Info('Middleware | Authorization', `Using SESSION`)

        let user  = req.user
        if(!user) {
            logger.Info('Middleware | Authorization', `User is not logged in, rejecting`)
            return reject(res)
        }
        else {
            logger.Info('Middleware | Authorization', `User is logged in`)
            next()
        }
    }
}

function authByToken(isAPI) {

    const reject = (isAPI) ? rejectAPI : rejectView

    return (req, res, next) => {
        logger.Info('Middleware | Authorization', `Using JWT`)
        // Verificar si existe el token
        const token = null;
        if (!req || !req.signedCookies || !req.signedCookies[JWT_COOKIE_NAME]) {
            logger.Info('Middleware | Authorization', `User is not logged in, rejecting`)
            return reject(res)
        }
        next()
    }
    
}

export default auth