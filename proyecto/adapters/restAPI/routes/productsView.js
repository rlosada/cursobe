import { Router } from 'express'

let productManager
let logger 

function processGetProductsView(req, res, next) {
    productManager.getProducts(req.query)         
        .then((result) => { 
                            logger.Info('Router:processGetProductsView', `req.user=${JSON.stringify(req.user)}`)
                            let user = req.user
                            let data = { title:'products', userFullName : `${user.firstName} ${user.lastName}`, isAdmin : user.isAdmin, ...result}; 
                            res.render('products', data)
        })
        .catch(next)
}

const createProductsViewRouter = (pm, lg, auth) => {
    productManager = pm
    logger = lg
    const router = Router()
    router.use(auth, (req, res, next) => {
        lg.Info('Router:ProductsView', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
        next()
    })
    // GET
    router.get('/', processGetProductsView)  

    return router    
}

export default createProductsViewRouter