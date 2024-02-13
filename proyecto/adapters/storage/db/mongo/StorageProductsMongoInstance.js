import { StorageManagerMongo } from './StorageManagerMongo.js'
import getProductMongoModel from './models/products.model.js'
import logger  from '../../../../misc/logger/LoggerInstance.js'

let sm = null

export const get = () => { 
    if (sm)
        return sm
    try {
        sm = new StorageManagerMongo(logger, getProductMongoModel())
    } catch (err) {
        logger.Error('get', `Fail to build StorageManagerFile for Carts, error=${err}`)
        return null
    }
    return sm
}

