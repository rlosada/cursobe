import { Router } from 'express'
import logoutJWT from './modes/logoutJWT.js'
import logoutSession from './modes/logoutSession.js'
import { LOGIN_MODES } from '../../../../misc/constants.js'
import configuration from '../../../../misc/configuration/configuration.js'

let logger 



function processPostLogout(req, res, next) {

    logger.Info('processPostLogout', `Processing logout request from client`)

    // Determinar que modo de login fue elegido 
    let { loginMode } = configuration
    if(loginMode == LOGIN_MODES.SESSION) 
        logoutSession(req, res)
    else if(loginMode === LOGIN_MODES.JWT)
        logoutJWT(res)    
}

const createLogoutRouter = (lg, auth) => {
    logger = lg
    const router = Router()
    router.use(auth, (req, res, next) => {
        lg.Info('Router:Logout', `Processing request`)
        next()
    })
    // GET
    router.post('/', processPostLogout)  

    return router    
}

export default createLogoutRouter