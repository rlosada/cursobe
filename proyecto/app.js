import getProductManager from './application/productManager/ProductManagerInstance.js'
import logger from './misc/logger/LoggerInstance.js'
import createECOMHttpServer from './adapters/restAPI/httpServer.js'
import getCartManager from './application/cartManager/CartManagerInstance.js'
import getEventManager from './misc/eventManager/eventManagerInstance.js'
import {connectToMongoDb} from './adapters/storage/db/mongo/mongo.js'
import getChatManager from './adapters/restAPI/public/js/chatManager/chatManagerInstance.js'
import getUsersManager from './application/users/UserManagerInstance.js'



async function init() {
    let rc = await connectToMongoDb()
    return rc
}

async function run() {

    const cartManager = await getCartManager()
    const usersManager = await getUsersManager()
    const productManager = await getProductManager()
    const eventManager = await getEventManager()

    const managers = {
        productManager : productManager,
        cartManager : cartManager,
        eventManager : eventManager,
        usersManager: usersManager
    }

    const ChatApp = getChatManager()

    ChatApp.start()

    const eCOMServer = await createECOMHttpServer(managers, logger)
    eCOMServer.startServer()
}

let rc = await init()
if(rc == false)
    process.exit()
run()