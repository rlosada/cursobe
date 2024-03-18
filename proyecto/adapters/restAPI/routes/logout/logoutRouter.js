import { Router } from 'express'
import { HTTP_STATUS_CODES } from '../../public/js/statusCodes.js'

let logger 


function processPostLogout(req, res, next) {
    
    logger.Info('processPostLogout', `Processing logout request from client`)

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

const createLogoutRouter = (lg) => {
    logger = lg
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:Logout', `Processing request`)
        next()
    })
    // GET
    router.post('/', processPostLogout)  

    return router    
}

export default createLogoutRouter