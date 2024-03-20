import { Router } from 'express'

let cartManager

function processGetCartProductsInfoView(req, res, next) {
    let {cid} = req.params
    cartManager.getCartProductsInfo(cid)         
        .then((products) => { 
                            let data = { title:'Carrito', cid, products} 
                            res.render('cartcontent', data)
        })
        .catch((err) => { 
            next()
        })
}

const createCartProductsInfoViewRouter = (cm, lg, auth) => {
    cartManager = cm
    const router = Router()
    router.use(auth, (req, res, next) => {
        lg.Info('Router:CartProductsView', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
        next()
    })
    // GET
    router.get('/:cid', processGetCartProductsInfoView)  

    return router    
}

export default createCartProductsInfoViewRouter