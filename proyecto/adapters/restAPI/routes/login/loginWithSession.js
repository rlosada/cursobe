
import logger from "../../../../misc/logger/LoggerInstance.js"
import configuration from '../../../../misc/configuration/configuration.js'

/**
 * Procesa la solicitud de login 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function procLoginWithSession(req, res, next) {
    
    logger.Info('processPostLogin', `Trying to authenticate using Passport Local Strategy`)

    passport.authenticate(PASSPORT_LOCAL_STRATEGY, 
        // Implementar esta funcion hace que el PASSPORT no serialice el usuario
        // adentro de la SESSION asi que hay que hacerlo a mano
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
            useSession(user)
        else if(loginMode === LOGIN_MODES.JWT)
            useJWT(user)



        logger.Info('processPostLogin', `Session initialized with ${JSON.stringify(user)}`)

        return res.status(HTTP_STATUS_CODES.SUCESS).send()             
    })(req, res, next)
}

function useJWT(user) {
    
}

/**
 * Inicializa el objeto session que luego buscara passport para inicializar
 * req.user
  * @param {user} user 
 */
function useSession(user) {
    logger.Info('useSession', `Loading user to req.session.passport`)
    req.session.passport = { user : user }
}

export default procLoginWithSession