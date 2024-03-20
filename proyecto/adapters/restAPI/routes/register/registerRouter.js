import { Router } from 'express'
import { HTTP_STATUS_CODES } from '../../public/js/statusCodes.js'
import { buildUserLocal } from '../../../../application/users/userBuilder.js'
import globalConfiguration from '../../../../misc/configuration/configuration.js'
import { LOGIN_MODES } from '../../../../misc/constants.js'

let logger 
let userManager   


function processSession(req, res, next) {
    logger.Info('processSession', `User creation SUCCESS`)
    res.status(HTTP_STATUS_CODES.SUCESS).send()   
    return 
}

function processAddUser(req, res, next, userCreated) {
    let { loginMode } = globalConfiguration

    // Si el usuario existe ya en la base, esto es false
    if(!userCreated) {
        logger.Error('processPostRegister', `User creation FAILED`)
        return res.status(HTTP_STATUS_CODES.AUTHORIZATION_FAILED).send({ msg : "User already exists" })     
    }

    if(LOGIN_MODES.JWT === loginMode) {
        processJWT(req, res, next)
    }
    else if (LOGIN_MODES.SESSION === loginMode) {
        processSession(req, res, next)
    }
}

function processPostRegister(req, res, next) {

    let {email, firstName, lastName, age, password} = req.body

    let user = buildUserLocal(email, firstName, lastName, Number.parseInt(age), password)

    logger.Info('processPostRegister', `Processing register request from client using ${JSON.stringify(user)}`)

    userManager.addUser(user)
        .then( (userCreated) => {
            if(userCreated) {
                logger.Info('processSession', `User creation SUCCESS`)
                res.status(HTTP_STATUS_CODES.SUCESS).send()   
            } 
            else {
                logger.Error('processPostRegister', `User creation FAILED`)
                return res.status(HTTP_STATUS_CODES.AUTHORIZATION_FAILED).send({ msg : "User already exists" }) 
            }
        })
        .catch(next)
}

const createRegisterRouter = (um, lg) => {
    userManager = um
    logger = lg
    const router = Router()
    router.use('/', (req, res, next) => {
            lg.Info('Router:RegisterView', `Processing request`)
            next()
    })

    // GET
    router.post('/', processPostRegister)  

    return router    
}

export default createRegisterRouter