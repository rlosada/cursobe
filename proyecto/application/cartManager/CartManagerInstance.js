import logger from '../../misc/logger/LoggerInstance.js'
import smCarts from '../../adapters/storage/fs/StorageCartInstance.js'
import productManager from '../productManager/ProductManagerInstance.js'
import CartManager  from './CartManagerFs.js'
import configuration from '../../misc/configuration/configuration.js'
import getCartMongoModel from '../../adapters/storage/db/mongo/models/carts.model.js'


let cartManager = null

async function getCartManager() { 
    if(cartManager === null)
        cartManager = await createCartManager()
    return cartManager
}

async function createCartManager() {
    const dataSources = [
        {source : "fs", codeCartManager : "./CartManagerFs.js", build: (constructor) => new constructor(smCarts, productManager, logger) } ,
        {source : "db", codeCartManager : "./CartManagerMongo.js", build : (constructor) => new constructor(getCartMongoModel(), logger)}         
    ]

    let { dataSource } =  configuration

    logger.Info('initStorageManagers', `Storage Manager source is ${dataSource}`)

    for(let i = 0; i < dataSources.length; i++) {
        const {source, codeCartManager, build} = dataSources[i]
        if(dataSource == source) {
            const mod = await import(codeCartManager)
            let test = await build(mod.default)
            return test
        }
    }   

}

// Exportar objeto cartManager
export default getCartManager