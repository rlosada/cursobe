import { Router } from 'express'
import { HTTP_STATUS_CODES } from '../../public/js/statusCodes.js'
import { LOGIN_MODES } from '../../../../misc/constants.js'
import passport from 'passport'
import { PASSPORT_LOCAL_STRATEGY, JWT_COOKIE_NAME } from '../../../../misc/constants.js'
import { CustomError } from '../../../../misc/customError.js'
import { CUSTOM_ERROR_TYPES } from '../../../../misc/customError.js'
import configuration from '../../../../misc/configuration/configuration.js'
import useJWT from './modes/loginJWT.js'
import useSession from './modes/loginSession.js'

let logger 
let userManager    


function processPostLogin(req, res, next) {
    logger.Info('processPostLogin', `Trying to authenticate using Passport Local Strategy`)

    passport.authenticate(PASSPORT_LOCAL_STRATEGY, 
        // Implementar esta funcion hace que el PASSPORT no serialice el usuario
        // adentro de la SESSION asi que hay que hacerlo a mano (si corresponde)
        (err, user, info, status) => {
            if(err) 
                throw new CustomError(CUSTOM_ERROR_TYPES.INTERNAL, 0, "Fail during user authentication")
            
            if(!user) {
                logger.Info('processPostLogin', `Login FAILED`)
                return res.status(HTTP_STATUS_CODES.AUTHORIZATION_FAILED).send({ msg : "User not found or password is invalid"})            
            }
 
            logger.Info('processPostLogin', `Login SUCCESS`)

            // Determinar que modo de login fue elegido 
            let { loginMode } = configuration
            if(loginMode == LOGIN_MODES.SESSION) 
                useSession(req, user)
            else if(loginMode === LOGIN_MODES.JWT)
                useJWT(res, user)

            logger.Info('processPostLogin', `Session initialized with ${JSON.stringify(user)}`)

            return res.status(HTTP_STATUS_CODES.SUCESS).send()             
        }
    )(req, res, next)

}

const createLoginRouter = (um, lg) => {
    userManager = um
    logger = lg
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:Login', `Processing request`)
        next()
    })
    // POST
    router.post('/', processPostLogin)  

    return router    
}



export default createLoginRouter