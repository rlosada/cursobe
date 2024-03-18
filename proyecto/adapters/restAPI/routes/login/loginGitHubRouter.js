import { Router } from 'express'
import passport from 'passport'
import { PASSPORT_GITHUB_STRATEGY } from '../../../../misc/constants.js'

let logger 

function processGetLogin(req, res, next) {
    logger.Info('processGetLogin', `Trying to authenticate using Passport Github`)
    passport.authenticate(PASSPORT_GITHUB_STRATEGY, {scope : ['user:email']})(req, res, next)
}

const createLoginGitHubRouter = (lg) => {
    logger = lg
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:LoginGitHub', `Processing request`)
        next()
    })
    // GET
    router.get('/', processGetLogin)  

    return router    
}

export default createLoginGitHubRouter