import { Router } from 'express'
import cartControllerView from '../controllers/carts.view.controller.js'
import auth from '../middlewares/auth.js'


const createCartProductsInfoViewRouter = () => {
    const authView = auth(false)
    const router = Router()
    
    // Carga middlewares
    router.use(authView)
    
    // Registra las acciones 
    router.get('/:cid', cartControllerView.view)  

    return router    
}

export default createCartProductsInfoViewRouter