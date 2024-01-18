import { Router } from 'express'
import { HTTP_STATUS_CODES } from '../statusCodes.js'

let cartManager
let logger 

const processGetCartById = (req, res, next) => {
    cartManager.getCartProductsInfo(parseInt(req.params.cid))
        .then((products) => res.status(HTTP_STATUS_CODES.SUCESS).send({products}))
        .catch(next)
}

const processPostCartProduct = (req, res, next) => {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    cartManager.addCartAddProduct(cid, pid)
         .then(() => res.status(HTTP_STATUS_CODES.CREATED).send())
         .catch(next)
}

const processPostCart = (req, res, next) => {
    cartManager.addCart(req.body)
         .then((cid) => res.status(HTTP_STATUS_CODES.CREATED).send({"cid" : cid}))
         .catch(next)
}

const createCartRouter = (cm, lg) => {
    cartManager = cm
    logger = lg
    const router = Router()
    router.use((req, res, next) => {
        logger.Info('Router:Carts', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
        next()
    })
    // GET
    router.get('/:cid', processGetCartById)  
    // POST
    router.post('/:cid/product/:pid', processPostCartProduct)  
    router.post('/', processPostCart)  

    return router    
}

export default createCartRouter