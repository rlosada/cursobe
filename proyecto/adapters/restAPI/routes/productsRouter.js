import { Router } from 'express'
import { HTTP_STATUS_CODES } from '../public/js/statusCodes.js'

let productManager
let logger 

const processGetAllProducts = (req, res, next) => {

    productManager.getProducts(req.query)
        .then((products) => {
            // 
            let response = {
                products,
                prevLink : "",
                nextLink : ""
            }
            res.status(HTTP_STATUS_CODES.SUCESS).send({response})
    })
        .catch(next)
}

const processGetProductById = (req, res, next) => {
    productManager.getProductById(req.params.id)
        .then((products) => res.status(HTTP_STATUS_CODES.SUCESS).send({products}))
        .catch(next)
}

const processPostProduct = (req, res, next) => {
    productManager.addProduct(req.body)
        .then((pid) => res.status(HTTP_STATUS_CODES.CREATED).send({pid : pid}))
        .catch(next)
}

const processPutProduct = (req, res, next) => {
    productManager.updateProduct(req.params.id, req.body)
        .then(() => res.status(HTTP_STATUS_CODES.SUCESS).send())
        .catch(next)
}

const processDeleteProduct = (req, res, next) => {
    productManager.deleteProduct(req.params.id)
        .then(() => res.status(HTTP_STATUS_CODES.SUCESS).send())
        .catch(next)
}


const createProductsRouter = (pm, lg) => {
    productManager = pm
    logger = lg
    const router = Router()
    router.use((req, res, next) => {
        logger.Info('Router:Products', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
        next()
    })    
    // GET
    router.get('/', processGetAllProducts)
    router.get('/:id', processGetProductById)  
    // POST
    router.post('/', processPostProduct)  
    // PUT
    router.put('/:id', processPutProduct)  
    // DELETE
    router.delete('/:id', processDeleteProduct)  

    return router    
}

export default createProductsRouter