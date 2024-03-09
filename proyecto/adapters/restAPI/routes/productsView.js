import { Router } from 'express'

let productManager

function processGetProductsView(req, res, next) {
    productManager.getProducts(req.query)         
        .then((result) => { 
                            let user = req.user
                            let data = { title:'products', userFullName : `${user.firstName} ${user.lastName}`, isAdmin : user.isAdmin, ...result}; 
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