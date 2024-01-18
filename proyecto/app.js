import productManager from './application/productManager/ProductManagerInstance.js'
import logger from './misc/logger/LoggerInstance.js'
import createECOMHttpServer from './adapters/restAPI/httpServer.js'
import cartManager from './application/cartManager/CartManagerInstance.js'

const managers = {
    productManager : productManager,
    cartManager : cartManager
}

const eCOMServer = createECOMHttpServer(managers, logger)
eCOMServer.startServer()


