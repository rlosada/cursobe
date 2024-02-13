import logger from '../../misc/logger/LoggerInstance.js'
import { getSmProducts } from '../../adapters/storage/storageManagers.js'
import ProductManager  from './ProductManager.js'
import eventManager from './../eventManager/eventManagerInstance.js'

let productManager = null

const get = () => { 
    if(productManager === null)
        productManager = new ProductManager(getSmProducts(), logger, eventManager)
    return productManager
}

// Exportar objeto productManager
export default get()