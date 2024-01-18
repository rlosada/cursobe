import globalConfiguration from '../../misc/configuration/configuration.js'
import express from 'express'
import createProductsRouter from './routes/productsRouter.js'
import createCartRouter from './routes/cartsRouter.js'
import { CUSTOM_ERROR_TYPES, CustomError } from '../../misc/customError.js'
import { HTTP_STATUS_CODES } from './statusCodes.js'

const PATH_API = 'api'
const PATH_PRODUCTS = 'products'

const config = globalConfiguration.httpServer

const buildPath = (relativePaths) => relativePaths.join('/')

const createECOMHttpServer = (managers, logger) => {
    let { productManager, cartManager} = managers
    const app = express()
    let ecomServer = {
        app : app,
        productManagerRouter : createProductsRouter(productManager, logger),
        cartManagerRouter: createCartRouter(cartManager, logger),
        startServer : () => ecomServer.app.listen(config.port, () => {
            logger.Info('startServer', `E-COMMERCE Http Server started at ${config.port}`)
        })
    }
    // Middleware parseo JSON en body
    app.use(express.json())
    // Middleware : Logeo
    app.use((req, res, next) => {
        logger.Info('ECOMHttpServer', `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
        next()
    })
    app.use('/api/products', ecomServer.productManagerRouter)
    app.use('/api/carts', ecomServer.cartManagerRouter)
    // Registrar error handler
    app.use((err, req, res, next) => {
        console.log(err)
        try {
            logger.Error('ECOMHttpServer', `Error: ${err.getCodeStr()}, additional info=${err.message}`)
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
            logger.Error('ECOMHttpServer', `${err.toString()}`)
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send('Something went wrong')
        }
    })

    return ecomServer
}

export default createECOMHttpServer