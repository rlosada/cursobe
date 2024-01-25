import globalConfiguration from '../../misc/configuration/configuration.js'
import express from 'express'
import createProductsRouter from './routes/productsRouter.js'
import createCartRouter from './routes/cartsRouter.js'
import registerViewEngine from './viewengine/viewengine.js'
import createHomeRouter from './routes/homeRouter.js'
import createIndexRouter from './routes/indexRouter.js'
import createRealTimeProductsRouter from './routes/realTimeProductsRouter.js'
import { CUSTOM_ERROR_TYPES, CustomError  } from '../../misc/customError.js'
import { HTTP_STATUS_CODES } from './statusCodes.js'
import getDirectory from '../../misc/utils.js'
import createWebSocketServer from './wsServer.js'

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
    
        const buildRoute = (arr) => "/" + arr.join("/")
    
        const routes = [
            { route : buildRoute([PATH_API, PATH_PRODUCTS]), router: createProductsRouter(this.managers.productManager, this.logger), name: 'productManagerRouter'},
            { route : buildRoute([PATH_API, PATH_CARTS]), router: createCartRouter(this.managers.cartManager, this.logger), name : 'cartManagerRouter'},
            { route : buildRoute([PATH_HOME]), router: createHomeRouter(this.managers.productManager, this.logger), name : 'HomeRouter'},
            { route : buildRoute([PATH_ROOT]), router: createIndexRouter(this.logger), name : 'IndexRouter'},
            { route : buildRoute([PATH_RT_PRODUCTS]), router: createRealTimeProductsRouter(this.logger), name : 'RealTimeProducts'}
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
    setMiddlewares() {
        const publicDirectory = `${getDirectory(import.meta.url)}/public`    
        // 
        this.app.use(express.static(publicDirectory))
    
        // Middleware parseo JSON en body
        this.app.use(express.json())
    
        // Middleware : Logeo
        this.app.use((req, res, next) => {
            this.logger.Info('ECOMHttpServer', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
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
const createECOMHttpServer = (managers, lg) => {
    
    return new  ECOMMServer(managers, globalConfiguration.httpServer, lg)
                    .setMiddlewares()
                    .setRoutes()
                    .registerViewEngine()
                    .setErrorHandler()
}

export default createECOMHttpServer