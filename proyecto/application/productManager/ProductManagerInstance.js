import logger from '../../misc/logger/LoggerInstance.js'
import { getSmProducts } from '../../adapters/storage/storageManagers.js'
import ProductManager  from './ProductManager.js'
import getEventManager from '../../misc/eventManager/eventManagerInstance.js'

let productManager = new ProductManager(getSmProducts(), logger, getEventManager())

export default () => productManager