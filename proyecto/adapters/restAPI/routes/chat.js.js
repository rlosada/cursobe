import { Router } from 'express'


const createChatRouter = (lg) => {
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:Chat', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
        next()
    })
    // GET
    router.get('/', (req, res) => {
        res.render('chat', 
        { 
            title : 'Chat' 
        })
    })  

    return router    
}

export default createChatRouter