import logger from "../../../../misc/logger/LoggerInstance.js"
import { CUSTOM_ERROR_TYPES } from "../../../../misc/customError.js"
import CONSTANTS from "../../../../misc/constants.js"
import passport from "passport"

const { PASSPORT_GITHUB_STRATEGY } = CONSTANTS


function login(req, res, next) {
    logger.Info('login', `Trying to authenticate using Passport Github`)
    passport.authenticate(PASSPORT_GITHUB_STRATEGY, {scope : ['user:email']})(req, res, next)
}

function callback(req, res, next) {
    logger.Info('callback', `Trying to authenticate using Passport Github`)

    passport.authenticate(PASSPORT_GITHUB_STRATEGY, 
        // Implementar esta funcion hace que el PASSPORT no serialice el usuario
        // adentro de la SESSION asi que hay que hacerlo a mano
        (err, user, info, status) => {
            if(err) 
                return next(new CustomError(CUSTOM_ERROR_TYPES.INTERNAL, 0, "Fail during user authentication"))
        
            if(!user) {
                logger.Info('callback', `Login FAILED`)
                return res.redirect('/')
            }
 
            req.session.passport = { user }
            logger.Info('callback', `Login SUCCESS. Session initialized with ${JSON.stringify(user)}`)
            return res.redirect('/products')
    })(req, res, next)
}

const loginGitHubController = {
    login,
    callback
}

export default loginGitHubController