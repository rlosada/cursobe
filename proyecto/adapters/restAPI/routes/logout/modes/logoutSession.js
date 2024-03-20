import logger from "../../../../../misc/logger/LoggerInstance.js"

function logoutSession(req, res) {
    if(!req.session) {
        logger.Info('processPostLogout', `client is not logged in, ignoring request`)
        res.redirect('/login')
        return
    }

    req.session.destroy((err) => {
        if(err) 
            logger.Error('processPostLogout', `Fail to destroy session, error=${JSON.stringify(err)}`)
        else 
            logger.Info('processPostLogout', `Session destroyed`)
        
        res.redirect('/login')
        return
    })
}

export default logoutSession