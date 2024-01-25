import logger from '../../misc/logger/LoggerInstance.js'
import smProducts from '../../adapters/storage/StorageProductsInstance.js'
import ProductManager  from './ProductManager.js'
import eventManager from './../eventManager/eventManagerInstance.js'

let productManager = null

const get = () => { 
    if(productManager === null)
        productManager = new ProductManager(smProducts, logger, eventManager)
    return productManager
}

// Exportar objeto productManager
export default get()