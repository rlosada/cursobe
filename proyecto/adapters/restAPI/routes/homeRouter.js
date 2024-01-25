import { Router } from 'express'

let productManager

function processGetProductsView(req, res, next) {
    productManager.getProducts()         
        .then((products) => 
            res.render('home', 
            { 
                title : 'home' ,
                products: products
            }))
        .catch(next)
    
}

const createHomeRouter = (pm, lg) => {
    productManager = pm
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:Views', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
        next()
    })
    // GET
    router.get('/', processGetProductsView)  

    return router    
}

export default createHomeRouter