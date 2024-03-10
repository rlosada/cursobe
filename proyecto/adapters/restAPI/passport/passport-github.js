import { Strategy as GithubStrategy } from 'passport-github2'
import logger from '../../../misc/logger/LoggerInstance.js'
import configuration from '../../../misc/configuration/configuration.js'
import getUsersManager from '../../../application/users/UserManagerInstance.js'
import { buildExternalID } from '../../../application/users/externalID.js'
import { EXTERNAL_SOURCES } from '../../../misc/constants.js'
import { buildUserGitHub } from '../../../application/users/userBuilder.js'
import { buildSessionInfo } from '../../../application/users/sessionUserBuilder.js'

let um = await getUsersManager()

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
        dbuser = await um.getUserByExternaId(externalID)
    } catch(err) {
        return done(err, null)
    }
    // Si el usuario no existe cargarlo en la base
    try {
        if(dbuser === null)  {
            dbuser = buildUserGitHub(externalID, username)
            let rc = await um.addExternaUser(dbuser)
            
        }
    } catch(err) {
        return done(err, null)
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