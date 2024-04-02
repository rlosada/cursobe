
import { Router } from 'express'
import loginController from '../controllers/login/login.controller.js'
import loginGitHubController from '../controllers/login/login.github.controller.js'


export default function createLoginRouter() {

    const router = Router()
    
    router.get('/', loginController.login)
    router.get('/local', loginController.loginLocal)

    router.get('/github', loginGitHubController.login)
    router.get('/github/callback', loginGitHubController.callback)
    
    return router    
}


