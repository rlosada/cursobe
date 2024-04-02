import { Router } from 'express'
import getReqLogger from '../middlewares/middlewares.js'
import productControllerView from '../controllers/products.view.controller.js'
import auth from '../middlewares/auth.js'

/**
 * Crea el router que administra los productos
*
* @returns 
 */
function createProductsViewRouter() {
    const authView = auth(false)
    const router = Router()
    
    // Carga middlewares
    router.use(getReqLogger('Products'))
    router.use(authView)

    // Registra las acciones 
    router.get('/', productControllerView.view)       

    return router    
}

export default createProductsViewRouter