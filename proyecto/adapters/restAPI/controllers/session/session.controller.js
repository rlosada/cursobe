import logger from '../../../../misc/logger/LoggerInstance.js'
import { getConfiguration } from '../../../../misc/configuration/configuration.js'
import CONSTANTS from '../../../../misc/constants.js'
import passport from 'passport'
import { loginJWT, logoutJWT } from './modes/jwt.js'
import { loginSession, logoutSession } from './modes/session.js'
import { HTTP_STATUS_CODES } from '../../public/js/statusCodes.js'
import { buildUserLocal } from '../../../../application/users/userBuilder.js'
import UserRepository from '../../../../respositories/user.repository.js'

const { LOGIN_MODES, PASSPORT_LOCAL_STRATEGY} = CONSTANTS
const configuration = getConfiguration()



function login(req, res, next) {

    const func = 'SessionController | login'

    logger.Info(func, `Trying to authenticate using Passport Local Strategy`)

    passport.authenticate(PASSPORT_LOCAL_STRATEGY, 
        // Implementar esta funcion hace que el PASSPORT no serialice el usuario
        // adentro de la SESSION asi que hay que hacerlo a mano (si corresponde)
        (err, user, info, status) => {
            if(err) 
                throw new CustomError(CUSTOM_ERROR_TYPES.INTERNAL, 0, "Fail during user authentication")
            
            if(!user) {
                logger.Info(func, `Login FAILED`)
                return res.status(HTTP_STATUS_CODES.AUTHORIZATION_FAILED).send({ msg : "User not found or password is invalid"})            
            }
 
            logger.Info(func, `Login SUCCESS`)

            // Determinar que modo de login fue elegido 
            let { loginMode } = configuration
            if(loginMode == LOGIN_MODES.SESSION) 
                loginSession(req, user)
            else if(loginMode === LOGIN_MODES.JWT)
                loginJWT(res, user)

            logger.Info(func, `Session initialized with ${JSON.stringify(user)}`)

            return res.status(HTTP_STATUS_CODES.SUCESS).send()             
        }
    )(req, res, next)

}


function logout(req, res, next) {

    const func = 'SessionController | logout'

    logger.Info(func, `Processing logout request from client`)

    // Determinar que modo de login fue elegido 
    let { loginMode } = configuration
    if(loginMode == LOGIN_MODES.SESSION) 
        logoutSession(req, res)
    else if(loginMode === LOGIN_MODES.JWT)
        logoutJWT(res)    
}

function current(req, res, next) {
    logger.Info('SessionController | current', `User ${JSON.stringify(req.user)}`)
    res.send( { first_name : req.user.firstName, last_name : req.user.lastName } )
    return 
}

async function register(req, res, next) {

    const func = 'SessionController | register'

    let {email, firstName, lastName, age, password} = req.body

    let user = buildUserLocal(email, firstName, lastName, Number.parseInt(age), password)

    logger.Info(func, `Processing register request from client using ${JSON.stringify(user)}`)

    UserRepository.add(user)
        .then( (userCreated) => {
            if(userCreated) {
                logger.Info(func, `User creation SUCCESS`)
                res.status(HTTP_STATUS_CODES.SUCESS).send()   
            } 
            else {
                logger.Error(func, `User creation FAILED`)
                return res.status(HTTP_STATUS_CODES.AUTHORIZATION_FAILED).send({ msg : "User already exists" }) 
            }
        })
        .catch(next)
}

const sessionController = {
    login,
    logout,
    current,
    register 
}

export default sessionController