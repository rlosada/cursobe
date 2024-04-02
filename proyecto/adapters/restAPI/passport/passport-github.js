import { Strategy as GithubStrategy } from 'passport-github2'
import logger from '../../../misc/logger/LoggerInstance.js'
import { getConfiguration } from '../../../misc/configuration/configuration.js'
import { buildExternalID } from '../../../application/users/externalID.js'
import CONSTANTS from '../../../misc/constants.js'
import { buildUserGitHub } from '../../../application/users/userBuilder.js'
import { buildSessionInfo } from '../../../application/users/sessionUserBuilder.js'
import UserRepository from '../../../respositories/user.repository.js'

const { EXTERNAL_SOURCES } = CONSTANTS
const configuration = getConfiguration()


/**
 * @param {string} accessToken  Access Token devuelto por GitHub
 * @param {string} refreshToken  Refresh Token devuelto por GitHub
 * @param {object} profile Objeto que representa el perfil del usuario en Github 
 * @param {function} done Funcion a ejecturar para finalizar
 */
async function verify(accessToken, refreshToken, profile, done) {
    let dbuser 
    let externalID
    let {id, username} = profile

    // Si GitHub envio un objeto invalido, rechazar login
    if(id == null || username == null)
        return done(null, null)

    externalID = buildExternalID(EXTERNAL_SOURCES.GITHUB, id)

    // Recuperar el usuario
    try {
        dbuser =  await UserRepository.getByExternaId(externalID)
    } catch(err) {
        return done(err, null)
    }
    // Si el usuario no existe cargarlo en la base
    if(dbuser === null)  {
        try {
            dbuser = buildUserGitHub(externalID, username)
            await um.addExternaUser(dbuser)
        } catch(err) {
                return done(err, null)
        }
    }
   
    return done(null, buildSessionInfo(dbuser))
}

export async function initPassportGitHub(passport) {

    logger.Info('initPassportGitHub', `Registering GitHub strategy`)  

    let {clientid, clientsecret, callback} = configuration.githubPassportLogin
    let {port} = configuration.httpServer
    
    if(clientid == null || clientsecret == null || callback == null || port == null) {
        logger.Error('initPassportGitHub', `Registering Github strategy failed`) 
        return false
    }

    passport.use(
        new GithubStrategy(
            {
                clientID: clientid,
                clientSecret: clientsecret,
                callbackURL : `http://localhost:${port}${callback}`
            },
            verify
        )
    )
    return true
}