import logger from '../../misc/logger/LoggerInstance.js'
import smCarts from '../../adapters/storage/StorageCartInstance.js'
import productManager from '../productManager/ProductManagerInstance.js'
import CartManager  from './CartManager.js'

let cartManager = null

const get = () => { 
    if(cartManager === null)
        cartManager = new CartManager(smCarts, productManager, logger)
    return cartManager
}

// Exportar objeto carttManager
export default get()