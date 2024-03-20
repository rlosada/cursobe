import { Router } from 'express'


const createCurrentRouter = (lg, auth) => {
    const router = Router()
    router.use(auth, (req, res, next) => {
        lg.Info('Router:createCurrentRouter', `User ${JSON.stringify(req.user)}`)
        res.send(
            {
                first_name : req.user.firstName,
                last_name : req.user.lastName
            }
        )
    })
    // GET
    router.get('/', createCurrentRouter)  

    return router    
}

export default createCurrentRouter