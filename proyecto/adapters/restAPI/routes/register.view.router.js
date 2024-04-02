import { Router } from 'express'
import registerViewController from '../controllers/register.view.controller.js'

const createRegisterViewRouter = () => {
    const router = Router()
    router.get('/', registerViewController.view)  
    return router    
}

export default createRegisterViewRouter