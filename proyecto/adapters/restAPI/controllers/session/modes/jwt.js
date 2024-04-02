import { HTTP_STATUS_CODES } from '../../../public/js/statusCodes.js'
import { getConfiguration } from '../../../../../misc/configuration/configuration.js'
import logger from '../../../../../misc/logger/LoggerInstance.js'
import CONSTANTS from '../../../../../misc/constants.js'
import jwt from 'jsonwebtoken'

const {JWT_DETAULT_EXPIRATION_SECONDS, JWT_COOKIE_NAME} = CONSTANTS

/**
 * Crea la cookie JWT, la incluye en la response HTTP y le envia
 * al cliente
 * 
 * @param {*} res Response HTTP
 * @param {*} user Objeto que representa al usuario logeado
 */
export function loginJWT(res, user) {

    let { jwtSecret, jwtExpirationSeconds }  = getConfiguration()

    if(!jwtExpirationSeconds) 
        jwtExpirationSeconds = JWT_DETAULT_EXPIRATION_SECONDS

    // Generar el token
    let jwtToken = jwt.sign({ user }, jwtSecret, {expiresIn : `${jwtExpirationSeconds / 3600}h`})

    let cookieOptions = {
        signed : true,
        httpOnly : true,
        maxAge: jwtExpirationSeconds * 1000 // [miliseconds]
    }

    // Cargar la cookie y enviar la respuesta
    res.cookie(JWT_COOKIE_NAME, jwtToken, cookieOptions).status(HTTP_STATUS_CODES.SUCESS).send()
}

export function logoutJWT(res) {
    logger.Info('logoutJWT', 'JWT Cookie destroyed')
    res.clearCookie(JWT_COOKIE_NAME)
    res.redirect('/login')
}