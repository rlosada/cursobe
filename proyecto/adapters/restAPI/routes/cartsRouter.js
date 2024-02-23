import { Router } from 'express'
import { HTTP_STATUS_CODES } from '../statusCodes.js'

let cartManager
let logger 

const processGetCartById = (req, res, next) => {
    cartManager.getCartProductsInfo(req.params.cid)
        .then((products) => res.status(HTTP_STATUS_CODES.SUCESS).send({products}))
        .catch(next)
}

const processPostCartProduct = (req, res, next) => {
    let {cid, pid} = req.params
    cartManager.addCartAddProduct(cid, pid)
         .then(() => res.status(HTTP_STATUS_CODES.CREATED).send())
         .catch(next)
}

const processSetProductQty = (req, res, next) => {
    let {cid, pid} = req.params
    let { quantity } = req.body
    cartManager.cartUpProductQty(cid, pid, quantity)
         .then(() => res.status(HTTP_STATUS_CODES.SUCESS).send())
         .catch(next)
}

const processDeleteCartProduct = (req, res, next) => {
    let {cid, pid} = req.params
    cartManager.cartRmvProduct(cid, pid)
         .then(() => res.status(HTTP_STATUS_CODES.SUCESS).send())
         .catch(next)
}

const processEmptyCart = (req, res, next) => {
    let {cid, pid} = req.params
    cartManager.cartEmpty(cid, pid)
         .then(() => res.status(HTTP_STATUS_CODES.SUCESS).send())
         .catch(next)
}

const processPostCart = (req, res, next) => {
    cartManager.addCart(req.body)
         .then((cid) => res.status(HTTP_STATUS_CODES.CREATED).send({"cid" : cid}))
         .catch(next)
}

const processUpdateCart = (req, res, next) => {
        let {cid} = req.params
        let productsInfo = req.body
        cartManager.updateCart(cid, productsInfo)
            .then(() => res.status(HTTP_STATUS_CODES.SUCESS).send())
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
    // DELETE
    router.delete('/:cid/product/:pid', processDeleteCartProduct)  
    router.delete('/:cid', processEmptyCart)  
    // PUT
    router.put('/:cid/product/:pid', processSetProductQty)
    router.put('/:cid', processUpdateCart)

    return router    
}

export default createCartRouter