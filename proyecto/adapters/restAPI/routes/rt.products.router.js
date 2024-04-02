import { Router } from 'express'
import controllerRTProducts from '../controllers/rt.products.view.controller.js'
import auth from '../middlewares/auth.js'


const createRealTimeProductsRouter = () => {
    const authView = auth(false)
    const router = Router()

    // Carga middlewares
    router.use(authView)    

    router.get('/', controllerRTProducts.view)  

    return router    
}

export default createRealTimeProductsRouter