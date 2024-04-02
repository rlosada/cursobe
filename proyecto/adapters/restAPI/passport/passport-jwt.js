import logger from '../../../misc/logger/LoggerInstance.js'
import { Strategy } from 'passport-jwt'
import CONSTANTS from '../../../misc/constants.js'
import { getConfiguration } from '../../../misc/configuration/configuration.js'

const { JWT_COOKIE_NAME } = CONSTANTS
const configuration = getConfiguration()

export async function initPassportJWT(passport) { 
    logger.Info('initPassportJWT', `Registering JWT strategy`)  
    let {jwtSecret} = configuration
    passport.use(new Strategy({
            jwtFromRequest: (req) => {
                let token = null;
                if (req && req.signedCookies) 
                    token = req.signedCookies[JWT_COOKIE_NAME];
                return token;
            },
            secretOrKey : jwtSecret
        }, 

        async function(jwtPayload, done) {
            logger.Info('initPassportJWT', `JWT Payload ${JSON.stringify(jwtPayload)}`)  
            return done(null, jwtPayload.user)
        },
        
    ))
    return true
}

