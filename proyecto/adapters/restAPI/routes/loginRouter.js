import { Router } from 'express'
import { HTTP_STATUS_CODES } from '../public/js/statusCodes.js'
import { USER_TYPES } from '../../../misc/constants.js'

let logger 
let userManager    

function processPostLogin(req, res, next) {
    let {email, password} = req.body
    
    logger.Info('processPostLogin', `Processing login request from client. Login credentials: email=${email}, password=${password}`)

    if(!email || !password)
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({msg : "Invalid request. Must include email and password"})

    userManager.getUserByEmailAndPass(email, password)
         .then((user) => {
            if (user) {
                req.session.user = {
                    uid : user._id,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    isAdmin : (user.type === USER_TYPES.ADMIN)
                }
                logger.Info('processPostLogin', `Login SUCCESS. Session initialized with ${JSON.stringify(req.session.user )}`)
                return res.status(HTTP_STATUS_CODES.SUCESS).send() 
            }
            else {
                logger.Info('processPostLogin', `Login FAILED`)
                return res.status(HTTP_STATUS_CODES.AUTHORIZATION_FAILED).send({ msg : "User not found or password is invalid"})
            }
            })
         .catch(next)    
}

const createLoginRouter = (um, lg) => {
    userManager = um
    logger = lg
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:Login', `Processing request`)
        next()
    })
    // GET
    router.post('/', processPostLogin)  

    return router    
}

export default createLoginRouter