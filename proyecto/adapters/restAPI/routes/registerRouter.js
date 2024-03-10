import { Router } from 'express'
import { HTTP_STATUS_CODES } from '../public/js/statusCodes.js'
import { USER_TYPES } from '../../../misc/constants.js'
import { buildUserLocal } from '../../../application/users/userBuilder.js'

let logger 
let userManager    

function processPostRegister(req, res, next) {

    let {email, firstName, lastName, age, password} = req.body

    let user = buildUserLocal(email, firstName, lastName, Number.parseInt(age), password)

    logger.Info('processPostRegister', `Processing register request from client using ${JSON.stringify(user)}`)

    userManager.addUser(user)
        .then(result => {
            if(result) {
                logger.Info('processPostRegister', `User creation SUCCESS`)
                res.status(HTTP_STATUS_CODES.SUCESS).send()    
            }
            else {
                logger.Error('processPostRegister', `User creation FAILED`)
                res.status(HTTP_STATUS_CODES.AUTHORIZATION_FAILED).send({msg : "User already exists"})    
            }})
        .catch(next)
}

const createRegisterRouter = (um, lg) => {
    userManager = um
    logger = lg
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:RegisterView', `Processing request`)
        next()
    })
    // GET
    router.post('/', processPostRegister)  

    return router    
}

export default createRegisterRouter