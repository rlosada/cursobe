import { Router } from 'express'
import controllerHome from '../controllers/home.controller.js'
import auth from '../middlewares/auth.js'


const createHomeRouter = () => {

    const authView = auth(false)
    const router = Router()

    // Carga middlewares
    router.use(authView)    

    router.get('/', controllerHome.view)  

    return router    
}

export default createHomeRouter