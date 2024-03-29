import globalConfiguration from '../../misc/configuration/configuration.js'
import express from 'express'
import createLoginRouter from './routes/login/loginLocalRouter.js'
import createProductsRouter from './routes/productsRouter.js'
import createCartRouter from './routes/cartsRouter.js'
import registerViewEngine from './viewengine/viewengine.js'
import createHomeRouter from './routes/homeRouter.js'
import createIndexRouter from './routes/indexRouter.js'
import createChatRouter from './routes/chat.js.js'
import createRealTimeProductsRouter from './routes/realTimeProductsRouter.js'
import createRegisterRouter from './routes/register/registerRouter.js'
import createLoginLocalViewRouter from './routes/login/loginLocalView .js'
import createLoginGitHubRouter from './routes/login/loginGitHubRouter.js'
import createLoginGitHubCbckRouter from './routes/login/loginGitHubCbckRouter.js'
import createCurrentRouter from './routes/currentRouter.js'

import createProductsViewRouter from './routes/productsView.js'
import createCartProductsInfoViewRouter from './routes/cartContentView.js'
import createLoginViewRouter from './routes/login/loginView.js'
import createRegisterViewRouter from './routes/register/registerView.js'
import createLogoutRouter from './routes/logout/logoutRouter.js'

import { CUSTOM_ERROR_TYPES, CustomError  } from '../../misc/customError.js'
import { HTTP_STATUS_CODES } from './public/js/statusCodes.js'
import {getDirectory} from '../../misc/utils.js'
import createWebSocketServer from './wsServer.js'
import session from 'express-session'
import getSessionSecret from '../../misc/session.js'

import { getMongoUrl } from '../storage/db/mongo/mongo.js'

import MongoStore from 'connect-mongo'

import passport from 'passport'

import initPassport from './passport/passport.js'
import cookieParser from 'cookie-parser'
import configuration from '../../misc/configuration/configuration.js'
import { LOGIN_MODES } from '../../misc/constants.js'
import auth from './passport/auth.js'

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
        const PATH_LOGOUT = 'logout'
        const PATH_LOCAL = 'local'
        const PATH_GITHUB = 'github'
        const PATH_CALLBACK = 'callback'
        const PATH_CURRENT = 'current'
    
        const buildRoute = (arr) => "/" + arr.join("/")

        const authAPI = () => auth(true)
        const authView = () => auth(false)
    
        const routes = [
            // API
            { route : buildRoute([PATH_API, PATH_PRODUCTS]), router: createProductsRouter(this.managers.productManager, this.logger, authAPI()), name: 'productManagerRouter'},
            { route : buildRoute([PATH_API, PATH_CARTS]), router: createCartRouter(this.managers.cartManager, this.logger, authAPI()), name : 'cartManagerRouter'},
            { route : buildRoute([PATH_API, PATH_SESSION, PATH_LOGOUT]), router: createLogoutRouter(this.logger, authAPI()), name : 'LogoutRouter'},
            { route : buildRoute([PATH_API, PATH_SESSION, PATH_CURRENT]), router: createCurrentRouter(this.logger, authAPI()), name : 'CurrentRouter'},
            

            { route : buildRoute([PATH_API, PATH_SESSION, PATH_LOGIN]), router: createLoginRouter(this.managers.usersManager, this.logger), name : 'LoginRouter'},
            { route : buildRoute([PATH_API, PATH_SESSION, PATH_REGISTER]), router: createRegisterRouter(this.managers.usersManager, this.logger), name : 'RegisterRouter'},
            
            
            // VIEWS
            { route : buildRoute([PATH_LOGIN]), router: createLoginViewRouter(this.logger), name : 'LoginView'},
            { route : buildRoute([PATH_LOGIN, PATH_LOCAL]), router: createLoginLocalViewRouter(this.logger), name : 'LoginLocalView'},
            { route : buildRoute([PATH_REGISTER]), router: createRegisterViewRouter(this.logger), name : 'RegisterView'},

            { route : buildRoute([PATH_LOGIN, PATH_GITHUB]), router: createLoginGitHubRouter(this.logger), name : 'LoginLocalGitHub'},
            { route : buildRoute([PATH_LOGIN, PATH_GITHUB, PATH_CALLBACK]), router: createLoginGitHubCbckRouter(this.logger), name : 'LoginLocalGitHubCbck'},

            { route : buildRoute([PATH_HOME]), router: createHomeRouter(this.managers.productManager, this.logger, authView()), name : 'HomeRouter'},
            { route : buildRoute([PATH_ROOT]), router: createIndexRouter(this.logger, authView()), name : 'IndexRouter'},
            { route : buildRoute([PATH_RT_PRODUCTS]), router: createRealTimeProductsRouter(this.logger, authView()), name : 'RealTimeProducts'},
            { route : buildRoute([PATH_CHAT]), router: createChatRouter(this.logger, authView()), name : 'Chat'},
            { route : buildRoute([PATH_PRODUCTS]), router: createProductsViewRouter(this.managers.productManager, this.logger, authView()), name : 'ProductsView'},
            { route : buildRoute([PATH_CARTS]), router: createCartProductsInfoViewRouter(this.managers.cartManager, this.logger, authView()), name : 'CartProductsView'},

            
            
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
        const publicDirectory = `${getDirectory(import.meta.url)}/public`    
        // 
        this.app.use(express.static(publicDirectory))
    
        // Middleware parseo JSON en body
        this.app.use(express.json())

        // Cookie parser
        let {cookieSecret} = configuration
        this.app.use(cookieParser(cookieSecret))
    
        // Sesion
        this.app.use(session({
            secret : getSessionSecret(),
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
    const ecomserver = new  ECOMMServer(managers, globalConfiguration.httpServer, lg)

    let rc = await ecomserver.setMiddlewares()
    
    ecomserver.setRoutes()
              .registerViewEngine()
              .setErrorHandler()

    return ecomserver
}

export default createECOMHttpServer