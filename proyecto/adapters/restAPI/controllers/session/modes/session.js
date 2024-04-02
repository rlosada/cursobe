import logger from "../../../../../misc/logger/LoggerInstance.js"

/**
 * Inicializa el objeto session que luego buscara passport para inicializar
 * req.user
  * @param {user} user 
 */
export function loginSession(req, user) {
    logger.Info('loginSession', `Loading user to req.session.passport`)
    req.session.passport = { user : user }
}

export function logoutSession(req, res) {
    if(!req.session) {
        logger.Info('logoutSession', `client is not logged in, ignoring request`)
        res.redirect('/login')
        return
    }

    req.session.destroy((err) => {
        if(err) 
            logger.Error('logoutSession', `Fail to destroy session, error=${JSON.stringify(err)}`)
        else 
            logger.Info('logoutSession', `Session destroyed`)
        
        res.redirect('/login')
        return
    })
}
