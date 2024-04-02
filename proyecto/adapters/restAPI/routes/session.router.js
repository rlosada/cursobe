
import { Router } from 'express'
import sessionController from '../controllers/session/session.controller.js'
import auth from '../middlewares/auth.js'

/**
 * Crea el router que la API de sessiones

 * @returns el router de sessiones
 */
export default function createSessionRouter() {

    const authAPI = auth(true)
    const router = Router()

    router.post(`/logout`, authAPI, sessionController.logout)
    router.get('/current', authAPI, sessionController.current)
    router.post('/login', sessionController.login)
    router.post('/register', sessionController.register)

    return router    
}
