import { Router } from 'express'


const createChatRouter = (lg, auth) => {
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:Chat', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
        next()
    })
    // GET
    router.get('/', auth, (req, res) => {
        res.render('chat', 
        { 
            title : 'Chat' 
        })
    })  

    return router    
}

export default createChatRouter