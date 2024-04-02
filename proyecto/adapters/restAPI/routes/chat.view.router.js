import { Router } from 'express'
import chatViewController from '../controllers/chat.view.controller.js'
import auth from '../middlewares/auth.js'

function createChatRouter() {
    const authView = auth(false)
    const router = Router()

    // Carga middlewares
    router.use(authView)

    // Registra las acciones 
    router.get('/', chatViewController.view)  
   
    return router    
}

export default createChatRouter