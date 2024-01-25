import { Router } from 'express'


const createIndexRouter = (lg) => {
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:Index', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
        next()
    })
    // GET
    router.get('/', (req, res) => {
        res.render('index', 
        { 
            title : 'index' 
        })
    })  

    return router    
}

export default createIndexRouter