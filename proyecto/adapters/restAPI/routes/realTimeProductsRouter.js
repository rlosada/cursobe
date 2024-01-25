import { Router } from 'express'


const createRealTimeProductsRouter = (lg) => {
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:RealTimeProducts', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
        next()
    })
    // GET
    router.get('/', (req, res) => {
        res.render('realtimeproducts', 
        { 
            title : 'Products - Real Time' 
        })
    })  

    return router    
}

export default createRealTimeProductsRouter