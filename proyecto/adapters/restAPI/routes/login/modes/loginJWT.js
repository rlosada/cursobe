import { Router } from 'express'
import { HTTP_STATUS_CODES } from '../../../public/js/statusCodes.js'
import { JWT_DETAULT_EXPIRATION_SECONDS, LOGIN_MODES } from '../../../../../misc/constants.js'
import passport from 'passport'
import { PASSPORT_LOCAL_STRATEGY, JWT_COOKIE_NAME } from '../../../../../misc/constants.js'
import { CustomError } from '../../../../../misc/customError.js'
import { CUSTOM_ERROR_TYPES } from '../../../../../misc/customError.js'
import configuration from '../../../../../misc/configuration/configuration.js'
import jwt from 'jsonwebtoken'

function useJWT(res, user) {

    let { jwtSecret, jwtExpirationSeconds }  = configuration

    if(!jwtExpirationSeconds) {
        jwtExpirationSeconds = JWT_DETAULT_EXPIRATION_SECONDS
    }

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

export default useJWT