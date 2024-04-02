import express from 'express'
// Routers 
import createProductsRouter from './routes/products.router.js'
import createCartRouter from './routes/carts.router.js'
import createSessionRouter from './routes/session.router.js'
import createLoginRouter from './routes/login.router.js'
import createRegisterViewRouter from './routes/register.view.router.js'
import createRealTimeProductsRouter from './routes/rt.products.router.js'
import createIndexRouter from './routes/index.router.js'
import createHomeRouter from './routes/home.router.js'
import createCartProductsInfoViewRouter from './routes/carts.view.router.js'
import createProductsViewRouter from './routes/products.view.router.js'
import createChatRouter from './routes/chat.view.router.js'
import registerViewEngine from './viewengine/viewengine.js'
import { CUSTOM_ERROR_TYPES, CustomError  } from '../../misc/customError.js'
import { HTTP_STATUS_CODES } from './public/js/statusCodes.js'
import {getDirectory} from '../../misc/utils.js'
import createWebSocketServer from './wsServer.js'
import session from 'express-session'

import { getMongoUrl } from '../storage/db/mongo/mongo.js'

import MongoStore from 'connect-mongo'

import passport from 'passport'

import initPassport from './passport/passport.js'
import cookieParser from 'cookie-parser'

import CONSTANTS from '../../misc/constants.js'
import { getConfiguration } from '../../misc/configuration/configuration.js'


let { LOGIN_MODES } = CONSTANTS
const configuration = getConfiguration()

class ECOMMServer {
    constructor(managers, config, logger) {
        this.logger = logger
        this.managers = managers
        this.config = config
        this.app = express()
    }

    /**
     * El server HTTP comienza a escuchar por pedidos
     * de los clientes
     */
    startServer() {
        this.server = this.app.listen(
            this.config.port, 
            () => { 
                this.logger.Info('startServer', `E-COMMERCE Http Server started at ${this.config.port}`) 
                let { eventManager} = this.managers
                this.wsServer = createWebSocketServer(this.server, this.logger, eventManager)
            })
        
        return this
    }    

    /**
     * Registra las rutas con los routers a utilizar
     * */
    setRoutes() {

        const PATH_API = 'api'
        const PATH_PRODUCTS = 'products'
        const PATH_CARTS = 'carts'  
        const PATH_HOME = 'home'  
        const PATH_ROOT = ""
        const PATH_RT_PRODUCTS = "realtimeproducts"
        const PATH_CHAT = "chat"
        const PATH_SESSION = 'session'
        const PATH_LOGIN = 'login'
        const PATH_REGISTER = 'register'
    
        const buildRoute = (arr) => "/" + arr.join("/")

           
        const routes = [
            // API
            { route : buildRoute([PATH_API, PATH_PRODUCTS]), router: createProductsRouter(), name: 'productManagerRouter'},
            { route : buildRoute([PATH_API, PATH_CARTS]), router: createCartRouter(), name : 'cartManagerRouter'},
            { route : buildRoute([PATH_API, PATH_SESSION]), router: createSessionRouter(), name : 'sessionManagerRouter'},
           
            // VIEWS
            { route : buildRoute([PATH_LOGIN]), router: createLoginRouter(), name : 'LoginView'},
            { route : buildRoute([PATH_REGISTER]), router: createRegisterViewRouter(), name : 'RegisterView'},
            { route : buildRoute([PATH_RT_PRODUCTS]), router: createRealTimeProductsRouter(), name : 'RealTimeProducts'},
            { route : buildRoute([PATH_ROOT]), router: createIndexRouter(), name : 'IndexRouter'},
            { route : buildRoute([PATH_HOME]), router: createHomeRouter(), name : 'HomeRouter'},
            { route : buildRoute([PATH_CARTS]), router: createCartProductsInfoViewRouter(), name : 'CartProductsView'},
            { route : buildRoute([PATH_PRODUCTS]), router: createProductsViewRouter(), name : 'ProductsView'},
            { route : buildRoute([PATH_CHAT]), router: createChatRouter(), name : 'Chat'},
            
        ]
        this.logger.Info('setRoutes', `Registering ${routes.length} routes:`)
        routes.forEach(e => {
            this.app.use(e.route, e.router)
            this.logger.Info('setRoutes', `    route:${e.route}, router: ${e.name}`)
        })
    
        return this
    }    

    /**
     * Inicializa los middlewares
     */
    async setMiddlewares() {

        this.app.use((req, res, next) => {this.logger.Custom1('Middleware', `<<<< New request >>>>`); next()})

        this.app.use(express.static(`${getDirectory(import.meta.url)}/public`))
   
        // Middleware parseo JSON en body
        this.app.use(express.json())

        // Cookie parser
        let {cookieSecret} = configuration
        this.app.use(cookieParser(cookieSecret))
    
        // Sesion
        let { sessionSecret } = configuration
        this.app.use(session({
            secret : sessionSecret,
            store : MongoStore.create({
                mongoUrl : getMongoUrl(),
                ttl : 500
            }),
            resave : false
        }))


        // Passport
        let rc = await initPassport(passport)
        if(!rc) {
            this.logger.Info('Middleware | Passport', `Passport initialization failed`)
            throw new Error('Passport middleware initialization failed')
        }

        // Determinar que modo de login fue elegido 
        let { loginMode } = configuration
        if(loginMode == LOGIN_MODES.SESSION) 
            this.app.use(passport.authenticate('session'))
        

        // Middleware : Logeo
        this.app.use((req, res, next) => {
            this.logger.Info('Middleware | Request Logger', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
            next()
        })        

        this.app.use((req, res, next) => {
            this.logger.Info('Middleware | Passport Debug', `req.cookies=${JSON.stringify(req.cookies)}, req.session=${JSON.stringify(req.session)}, req.user=${JSON.stringify(req.user)}`)
            next()
        })

        return this
    }   

    registerViewEngine() {
        registerViewEngine(this.app, this.logger)
        return this
    }

    setErrorHandler() {
        // Registrar error handler
        this.app.use((err, req, res, next) => {

            const processGenericError = (err) => {
                this.logger.Error('GenericErrorHandler', `Error:${err.stack}`)
                res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send('Something went wrong') 
            }

            const processCustomError = (err) => {
                try {
                    this.logger.Error('ECOMHttpServer', `Error: ${err.getCodeStr()}, additional info=${err.message}`)
                    switch(err.getType()) {
                        case CUSTOM_ERROR_TYPES.EMPTY: 
                            return res.status(HTTP_STATUS_CODES.NOT_FOUND).send('The requested resources was not found')
                        case CUSTOM_ERROR_TYPES.PARAMETER:
                            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send('Bad request')
                        case CUSTOM_ERROR_TYPES.INTERNAL:
                        default:
                            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send('Internal server error, please retry later')                
                    }
                } catch(err) {
                    processGenericError(err)
                }
            }

            if((err instanceof CustomError)) {
                processCustomError(err)
            } else {
                processGenericError(err)
            }
        })
        return this
    }
}

/**
 * Crea un ECOMMERCE Http Server 
 * 
 * 
 */
async function createECOMHttpServer(managers, lg) {
    const ecomserver = new  ECOMMServer(managers, configuration.httpServer, lg)

    let rc = await ecomserver.setMiddlewares()
    
    ecomserver.setRoutes()
              .registerViewEngine()
              .setErrorHandler()

    return ecomserver
}

export default createECOMHttpServer