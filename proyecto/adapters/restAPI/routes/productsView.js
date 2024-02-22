import { Router } from 'express'

let productManager

function processGetProductsView(req, res, next) {
    productManager.getProducts(req.query)         
        .then((result) => { 
                            let data = { title:'products', ...result}; 
                            res.render('products', data)
        })
        .catch(next)
}

const createProductsViewRouter = (pm, lg) => {
    productManager = pm
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:ProductsView', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
        next()
    })
    // GET
    router.get('/', processGetProductsView)  

    return router    
}

export default createProductsViewRouter