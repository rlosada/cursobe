import productManager from './application/productManager/ProductManagerInstance.js'
import logger from './misc/logger/LoggerInstance.js'
import createECOMHttpServer from './adapters/restAPI/httpServer.js'
import getCartManager from './application/cartManager/CartManagerInstance.js'
import eventManager from './application/eventManager/eventManagerInstance.js'
import {connectToMongoDb} from './adapters/storage/db/mongo/mongo.js'
import getChatManager from './adapters/restAPI/public/js/chatManager/chatManagerInstance.js'
import getUsersManager from './application/users/UserManagerInstance.js'

async function init() {
    let rc = await connectToMongoDb()
    return rc
}

async function run() {

    let cartManager = await getCartManager()
    let usersManager = await getUsersManager()

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