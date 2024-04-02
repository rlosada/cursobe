import { Router } from 'express'
import getReqLogger from '../middlewares/middlewares.js'
import productController from '../controllers/products/products.controller.js'
import auth from '../middlewares/auth.js'

/**
 * Crea el router que administra los productos
*
* @returns 
 */
export default function createProductsRouter() {
    const authAPI = auth(true)
    const router = Router()
    
    // Carga middlewares
    router.use(getReqLogger('Products'))
    router.use(authAPI)

    // Registra las acciones 
    router.get('/', productController.getAll)          
    router.get('/:id', productController.getById)       
    router.post('/', productController.create)            
    router.put('/:id', productController.update)           
    router.delete('/:id', productController.remove)     

    return router    
}
