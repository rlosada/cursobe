import { Router } from 'express'
import controllerIndex from '../controllers/index.controller.js'
import auth from '../middlewares/auth.js'

const createIndexRouter = () => {

    const authView = auth(false)
    const router = Router()

    // Carga middlewares
    router.use(authView)

    // Acciones
    router.get('/', controllerIndex.view)  

    return router    
}

export default createIndexRouter