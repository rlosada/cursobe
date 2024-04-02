import { Router } from 'express'
import getReqLogger from '../middlewares/middlewares.js'
import cartController from '../controllers/carts/carts.controller.js'
import auth from '../middlewares/auth.js'


/**
 * Crea el router que administra los carritos
 * 
 * @returns 
 */
export default function createCartRouter() {
    const authAPI = auth(true)
    const router = Router()

    // Carga middlewares
    router.use(getReqLogger('Carts'))
    router.use(authAPI)

    // Registra las acciones 
    router.get('/:cid', cartController.getById)  
    router.post('/:cid/product/:pid', cartController.addProduct)  
    router.post('/', cartController.create)  
    router.delete('/:cid/product/:pid', cartController.rmvProduct)  
    router.delete('/:cid', cartController.empty)  
    router.put('/:cid/product/:pid', cartController.setProductQty)
    router.put('/:cid', cartController.update)

    return router    
}

